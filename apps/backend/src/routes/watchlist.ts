import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const addWatchSchema = z.object({
  cardId: z.string().uuid(),
  targetPrice: z.number().positive().optional(),
  notifyAbove: z.boolean().default(false),
  notifyBelow: z.boolean().default(true),
  gradeLabel: z.string().optional(),
})

export async function watchlistRoutes(app: FastifyInstance) {

  app.get('/', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const items = await prisma.watchlist.findMany({
      where: { userId: user.id, isActive: true },
      include: {
        card: {
          include: {
            priceHistory: { orderBy: { saleDate: 'desc' }, take: 1 },
          },
        },
      },
    })
    return reply.send(items)
  })

  app.post('/', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const body = addWatchSchema.safeParse(req.body)
    if (!body.success) return reply.status(400).send({ error: body.error.flatten() })

    const item = await prisma.watchlist.upsert({
      where: { userId_cardId: { userId: user.id, cardId: body.data.cardId } },
      update: { ...body.data, isActive: true },
      create: { userId: user.id, ...body.data },
      include: { card: true },
    })

    return reply.status(201).send(item)
  })

  app.delete('/:id', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const { id } = req.params as { id: string }
    await prisma.watchlist.updateMany({
      where: { id, userId: user.id },
      data: { isActive: false },
    })
    return reply.status(204).send()
  })
}
