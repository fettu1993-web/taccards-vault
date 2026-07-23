import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID!
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET!

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

async function searchEbayPrice(query: string, token: string): Promise<number | null> {
  const encoded = encodeURIComponent(query)
  const res = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encoded}&filter=soldItemsOnly:true,conditionIds:{2750|3000}&sort=newlyListed&limit=5`,
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
  if (items.length === 0) return null

  const prices = items
    .map((i: any) => parseFloat(i.price?.value ?? '0'))
    .filter((p: number) => p > 0)

  if (prices.length === 0) return null
  const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
  return Math.round(avg * 100) / 100
}

export async function ebayRoutes(app: FastifyInstance) {

  // GET /api/v1/ebay/price/:cardId — ottieni prezzo eBay per una carta
  app.get('/price/:cardId', { preHandler: authenticate }, async (req, reply) => {
    const { cardId } = req.params as { cardId: string }

    const card = await prisma.card.findUnique({ where: { id: cardId } })
    if (!card) return reply.status(404).send({ error: 'Carta non trovata' })

    // Controlla se abbiamo un prezzo recente (< 24h)
    const recentPrice = await prisma.priceHistory.findFirst({
      where: {
        cardId,
        gradeLabel: 'raw',
        saleDate: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { saleDate: 'desc' },
    })

    if (recentPrice) {
      return reply.send({ price: Number(recentPrice.price), cached: true })
    }

    // Chiama eBay API
    try {
      const token = await getEbayToken()
      const query = `${card.playerName} ${card.setName}${card.parallel ? ' ' + card.parallel : ''}`
      const price = await searchEbayPrice(query, token)

      if (price) {
        // Salva in Supabase
        await prisma.priceHistory.create({
          data: {
            cardId,
            price,
            gradeLabel: 'raw',
            saleDate: new Date(),
          },
        })
        return reply.send({ price, cached: false })
      }

      return reply.send({ price: null, cached: false })
    } catch (e: any) {
      return reply.status(500).send({ error: e.message })
    }
  })
}