import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID!
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET!

const isValidUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

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

async function searchEbaySales(query: string, token: string): Promise<{ price: number; date: string; title: string }[]> {
  const encoded = encodeURIComponent(query)
  const res = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encoded}&filter=conditionIds:{2750|3000}&sort=newlyListed&limit=10&category_ids=212`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_IT',
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await res.json() as any
  const items = data.itemSummaries ?? []
  return items
    .filter((i: any) => i.price?.value)
    .map((i: any) => ({
      price: parseFloat(i.price.value),
      date: i.itemCreationDate ?? new Date().toISOString(),
      title: i.title ?? '',
    }))
}

export async function ebayRoutes(app: FastifyInstance) {

  app.get('/search', { preHandler: authenticate }, async (req, reply) => {
    const { cardId, gradeLabel, playerName, setName, parallel } = req.query as Record<string, string>

    if (!playerName || !setName || !gradeLabel) {
      return reply.status(400).send({ error: 'Parametri mancanti' })
    }

    // Cache 24h — solo per carte con UUID valido
    if (cardId && isValidUuid(cardId)) {
      const cached = await prisma.priceHistory.findFirst({
        where: {
          cardId,
          gradeLabel,
          saleDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        orderBy: { saleDate: 'desc' },
      })
      if (cached) {
        return reply.send({ avgPrice: Number(cached.price), sales: [], cached: true })
      }
    }

    const gradeQuery = gradeLabel === 'raw' ? '' : ` ${gradeLabel}`
    const parallelQuery = parallel ? ` ${parallel}` : ''
    const query = `${playerName} ${setName}${parallelQuery}${gradeQuery} card`

    try {
      const token = await getEbayToken()
      const sales = await searchEbaySales(query, token)

      if (sales.length === 0) {
        return reply.send({ avgPrice: null, sales: [], cached: false })
      }

      const avgPrice = Math.round(
        (sales.reduce((sum, s) => sum + s.price, 0) / sales.length) * 100
      ) / 100

      // Salva cache solo per UUID validi
      if (cardId && isValidUuid(cardId)) {
        try {
          await prisma.priceHistory.create({
            data: {
              cardId,
              price: avgPrice,
              gradeLabel,
              saleDate: new Date(),
              source: 'ebay',
            },
          })
        } catch (_) {
          // ignora errori di cache
        }
      }

      return reply.send({ avgPrice, sales, cached: false })
    } catch (e: any) {
      return reply.status(500).send({ error: e.message })
    }
  })
}