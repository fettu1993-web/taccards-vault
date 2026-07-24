import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID!
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET!
const SYNC_SECRET = process.env.SYNC_SECRET ?? 'sync-secret-dev'
const BATCH_SIZE = 100

async function getEbayToken(): Promise<string> {
  const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
  })
  const data = await res.json() as any
  return data.access_token
}

async function fetchEbayData(
  playerName: string,
  setName: string,
  parallel: string | null,
  token: string
): Promise<{ price: number | null; imageUrl: string | null }> {
  const parallelQuery = parallel ? ` ${parallel}` : ''
  const query = `${playerName} ${setName}${parallelQuery} card`
  const encoded = encodeURIComponent(query)

  const res = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encoded}&filter=conditionIds:{2750|3000}&sort=newlyListed&limit=5&category_ids=212`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await res.json() as any
  const items = data.itemSummaries ?? []

  const prices = items
    .filter((i: any) => i.price?.value)
    .map((i: any) => parseFloat(i.price.value))
    .filter((p: number) => p > 0)

  const price = prices.length > 0
    ? Math.round((prices.reduce((a: number, b: number) => a + b, 0) / prices.length) * 100) / 100
    : null

  // Prendi immagine dal primo risultato, pulita senza parametri
  const rawImage = items[0]?.image?.imageUrl ?? null
  const imageUrl = rawImage ? rawImage.split('?')[0].replace(/\/s-l\d+\./, '/s-l500.') : null

  return { price, imageUrl }
}

export async function syncRoutes(app: FastifyInstance) {

  // POST /api/v1/sync/prices — job notturno
  app.post('/prices', async (req, reply) => {
    const secret = (req.headers['x-sync-secret'] as string) ?? ''
    if (secret !== SYNC_SECRET) {
      return reply.status(401).send({ error: 'Non autorizzato' })
    }

    const cards = await (prisma as any).$queryRaw`
      SELECT id, player_name, set_name, parallel, image_url
      FROM cards
      ORDER BY last_price_update ASC NULLS FIRST
      LIMIT ${BATCH_SIZE}
    ` as any[]

    if (cards.length === 0) {
      return reply.send({ updated: 0, message: 'Nessuna carta da aggiornare' })
    }

    let updated = 0
    let failed = 0
    let imagesAdded = 0

    try {
      const token = await getEbayToken()

      for (const card of cards) {
        try {
          const { price, imageUrl } = await fetchEbayData(
            card.player_name ?? '',
            card.set_name ?? '',
            card.parallel ?? null,
            token
          )

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(card.id)

          // Salva prezzo in price_history solo per UUID validi
          if (price && isUuid) {
            await prisma.priceHistory.create({
              data: {
                cardId: card.id,
                price,
                gradeLabel: 'raw',
                saleDate: new Date(),
                source: 'ebay',
              },
            })
            updated++
          }

          // Salva immagine se non ce l'ha già
          if (imageUrl && !card.image_url) {
            await (prisma as any).$executeRaw`
              UPDATE cards SET image_url = ${imageUrl} WHERE id = ${card.id}
            `
            imagesAdded++
          }

          // Aggiorna last_price_update
          await (prisma as any).$executeRaw`
            UPDATE cards SET last_price_update = NOW() WHERE id = ${card.id}
          `

          // Pausa 200ms tra le chiamate
          await new Promise(r => setTimeout(r, 200))

        } catch (e) {
          failed++
        }
      }
    } catch (e: any) {
      return reply.status(500).send({ error: e.message })
    }

    return reply.send({
      updated,
      failed,
      imagesAdded,
      total: cards.length,
      message: `Aggiornate ${updated} prezzi, ${imagesAdded} immagini su ${cards.length} carte`,
    })
  })

  // GET /api/v1/sync/status
  app.get('/status', async (_req, reply) => {
    const total = await prisma.card.count()
    const updated = await (prisma as any).$queryRaw`
      SELECT COUNT(*) as count FROM cards WHERE last_price_update IS NOT NULL
    ` as any[]
    const withImage = await (prisma as any).$queryRaw`
      SELECT COUNT(*) as count FROM cards WHERE image_url IS NOT NULL
    ` as any[]
    const withPrice = await prisma.priceHistory.groupBy({
      by: ['cardId'],
      _count: true,
    })

    return reply.send({
      totalCards: total,
      cardsWithPriceUpdate: Number(updated[0].count),
      cardsWithPrice: withPrice.length,
      cardsWithoutPrice: total - withPrice.length,
      cardsWithImage: Number(withImage[0].count),
      cardsWithoutImage: total - Number(withImage[0].count),
    })
  })
}