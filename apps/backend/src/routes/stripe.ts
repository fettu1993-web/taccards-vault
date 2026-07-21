import { FastifyInstance } from 'fastify'
import Stripe from 'stripe'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

const PRICE_ID = process.env.STRIPE_PRICE_ID!
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function stripeRoutes(app: FastifyInstance) {

  // POST /api/v1/stripe/create-checkout — crea sessione pagamento
  app.post('/create-checkout', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: user.email,
      metadata: { userId: user.id },
    })

    return reply.send({ url: session.url })
  })

  // POST /api/v1/stripe/webhook — eventi Stripe
  app.post('/webhook', {
    config: { rawBody: true },
  }, async (req, reply) => {
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        WEBHOOK_SECRET
      )
    } catch (err: any) {
      return reply.status(400).send({ error: `Webhook error: ${err.message}` })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true },
        })
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(subscription.customer as string)
      if ('email' in customer && customer.email) {
        await prisma.user.update({
          where: { email: customer.email },
          data: { isPremium: false },
        })
      }
    }

    return reply.send({ received: true })
  })

  // GET /api/v1/stripe/status — stato abbonamento utente
  app.get('/status', { preHandler: authenticate }, async (req, reply) => {
    const user = (req as any).user
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    return reply.send({ isPremium: dbUser?.isPremium ?? false })
  })
}