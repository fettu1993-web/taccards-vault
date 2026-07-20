import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const requestSchema = z.object({
  playerName: z.string().min(1).max(100),
  setName: z.string().min(1).max(100),
  sport: z.string().min(1).max(50),
  parallel: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
})

export async function cardRequestsRoutes(app: FastifyInstance) {

  // POST /api/v1/card-requests — invia richiesta carta
  app.post('/', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const body = requestSchema.safeParse(req.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const request = await prisma.$queryRaw`
      INSERT INTO card_requests (user_id, player_name, set_name, sport, parallel, notes)
      VALUES (${user.id}::uuid, ${body.data.playerName}, ${body.data.setName}, ${body.data.sport}, ${body.data.parallel ?? null}, ${body.data.notes ?? null})
      RETURNING *
    `

    return reply.status(201).send({ data: request })
  })

  // GET /api/v1/card-requests — lista richieste dell'utente
  app.get('/', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const requests = await prisma.$queryRaw`
      SELECT * FROM card_requests
      WHERE user_id = ${user.id}::uuid
      ORDER BY created_at DESC
    `
    return reply.send({ data: requests })
  })
}