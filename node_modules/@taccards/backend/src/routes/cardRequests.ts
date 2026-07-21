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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'fettu1993@gmail.com'

async function requireAdmin(req: any, reply: any) {
  if (req.user?.email !== ADMIN_EMAIL) {
    return reply.status(403).send({ error: 'Non autorizzato' })
  }
}

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

  // GET /api/v1/card-requests/admin — tutte le richieste (solo admin)
  app.get('/admin', { preHandler: [authenticate, requireAdmin] }, async (req, reply) => {
    const requests = await prisma.$queryRaw`
      SELECT id, player_name, set_name, sport, parallel, notes, status, created_at,
             user_id::text as user_email
      FROM card_requests
      ORDER BY created_at DESC
    `
    return reply.send({ data: requests })
  })

  // PATCH /api/v1/card-requests/:id/status — aggiorna stato (solo admin)
  app.patch('/:id/status', { preHandler: [authenticate, requireAdmin] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { status } = req.body as { status: string }

    if (!['pending', 'added', 'rejected'].includes(status)) {
      return reply.status(400).send({ error: 'Stato non valido' })
    }

    await prisma.$queryRaw`
      UPDATE card_requests SET status = ${status} WHERE id = ${id}::uuid
    `

    return reply.send({ success: true })
  })

  // POST /api/v1/card-requests/:id/approve — aggiunge carta al catalogo (solo admin)
  app.post('/:id/approve', { preHandler: [authenticate, requireAdmin] }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const body = req.body as {
      playerName: string
      setName: string
      sport: string
      team?: string
      year?: number
      parallel?: string
      isRookie?: boolean
      isAutograph?: boolean
      isNumbered?: boolean
      printRun?: number
      manufacturer?: string
      category?: string
    }

    const card = await prisma.$queryRaw`
      INSERT INTO cards (name, player_name, sport, set_name, team, year, parallel, is_rookie, is_autograph, is_numbered, print_run, manufacturer, category, data_source)
      VALUES (
        ${body.playerName + ' ' + body.setName},
        ${body.playerName},
        ${body.sport},
        ${body.setName},
        ${body.team ?? null},
        ${body.year ?? null},
        ${body.parallel ?? null},
        ${body.isRookie ?? false},
        ${body.isAutograph ?? false},
        ${body.isNumbered ?? false},
        ${body.printRun ?? null},
        ${body.manufacturer ?? null},
        ${body.category ?? null},
        'manual'
      )
      RETURNING *
    `

    await prisma.$queryRaw`
      UPDATE card_requests SET status = 'added' WHERE id = ${id}::uuid
    `

    return reply.status(201).send({ data: card })
  })
}