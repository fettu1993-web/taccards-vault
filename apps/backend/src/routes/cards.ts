import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const searchSchema = z.object({
  q: z.string().min(1).max(100).optional(),
  sport: z.string().optional(),
  year: z.coerce.number().optional(),
  manufacturer: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(20),
})

export async function cardsRoutes(app: FastifyInstance) {

  app.get('/search', { preHandler: authenticate }, async (req, reply) => {
    const query = searchSchema.safeParse(req.query)
    if (!query.success) {
      return reply.status(400).send({ error: query.error.flatten() })
    }

    const { q, sport, year, manufacturer, page, limit } = query.data
    const skip = (page - 1) * limit

    // Splitta la query in parole e cerca ognuna in tutti i campi
    const buildSearchCondition = (term: string) => ({
      OR: [
        { playerName: { contains: term, mode: 'insensitive' as const } },
        { name: { contains: term, mode: 'insensitive' as const } },
        { setName: { contains: term, mode: 'insensitive' as const } },
        { parallel: { contains: term, mode: 'insensitive' as const } },
        { team: { contains: term, mode: 'insensitive' as const } },
        { category: { contains: term, mode: 'insensitive' as const } },
      ],
    })

    const searchConditions = q
      ? q.trim().split(/\s+/).map(buildSearchCondition)
      : []

    const where = {
      AND: [
        ...searchConditions,
        sport ? { sport } : {},
        year ? { year } : {},
        manufacturer ? { manufacturer: { contains: manufacturer, mode: 'insensitive' as const } } : {},
      ],
    }

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        skip,
        take: limit,
        orderBy: { year: 'desc' },
        include: {
          priceHistory: {
            orderBy: { saleDate: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.card.count({ where }),
    ])

    return reply.send({
      data: cards,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  })

  app.get('/:id', { preHandler: authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { saleDate: 'desc' },
          take: 100,
        },
      },
    })
    if (!card) return reply.status(404).send({ error: 'Carta non trovata' })
    return reply.send(card)
  })

  app.get('/:id/price-chart', { preHandler: authenticate }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { grade = 'raw', days = '90' } = req.query as Record<string, string>

    const since = new Date()
    since.setDate(since.getDate() - Number(days))

    const history = await prisma.priceHistory.findMany({
      where: {
        cardId: id,
        gradeLabel: grade,
        saleDate: { gte: since },
      },
      orderBy: { saleDate: 'asc' },
      select: { price: true, saleDate: true, source: true },
    })

    return reply.send({ cardId: id, grade, data: history })
  })
}