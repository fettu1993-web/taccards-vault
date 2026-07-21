import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

import { cardsRoutes } from './routes/cards'
import { collectionRoutes } from './routes/collection'
import { pricesRoutes } from './routes/prices'
import { sealedRoutes } from './routes/sealed'
import { scanRoutes } from './routes/scan'
import { watchlistRoutes } from './routes/watchlist'
import { cardRequestsRoutes } from './routes/cardRequests'
import { stripeRoutes } from './routes/stripe'

const app = Fastify({ logger: true })

async function main() {
  await app.register(cors, { origin: true })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // rawBody solo per il webhook Stripe
  app.addHook('preHandler', async (req: any, _reply) => {
    const isWebhook = req.url === '/api/v1/stripe/webhook'
    if (isWebhook) {
      req.rawBody = await req.body
    }
  })

  app.get('/health', async () => ({ status: 'ok', version: '0.1.0' }))

  await app.register(cardsRoutes,        { prefix: '/api/v1/cards' })
  await app.register(collectionRoutes,   { prefix: '/api/v1/collection' })
  await app.register(pricesRoutes,       { prefix: '/api/v1/prices' })
  await app.register(sealedRoutes,       { prefix: '/api/v1/sealed' })
  await app.register(scanRoutes,         { prefix: '/api/v1/scan' })
  await app.register(watchlistRoutes,    { prefix: '/api/v1/watchlist' })
  await app.register(cardRequestsRoutes, { prefix: '/api/v1/card-requests' })
  await app.register(stripeRoutes,       { prefix: '/api/v1/stripe' })

  try {
    await app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' })
    console.log('🚀 TacCards Vault backend avviato')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()