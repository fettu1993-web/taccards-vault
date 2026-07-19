import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { Prisma } from '@prisma/client';
const addCardSchema = z.object({
    cardId: z.string().uuid(),
    condition: z.enum(['raw', 'psa', 'bgs', 'sgc', 'cgc', 'tag']).default('raw'),
    gradeCompany: z.string().optional(),
    gradeValue: z.string().optional(),
    certNumber: z.string().optional(),
    purchasePrice: z.number().positive().optional(),
    purchaseDate: z.string().datetime().optional(),
    purchasePlatform: z.string().optional(),
    status: z.enum(['in_collection', 'for_sale', 'sold', 'wishlist']).default('in_collection'),
    notes: z.string().max(500).optional(),
});
export async function collectionRoutes(app) {
    // GET /api/v1/collection — tutta la collezione dell'utente
    app.get('/', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { status, sport } = req.query;
        const userCards = await prisma.userCard.findMany({
            where: {
                userId: user.id,
                ...(status ? { status } : {}),
                ...(sport ? { card: { sport } } : {}),
            },
            include: {
                card: {
                    include: {
                        priceHistory: {
                            orderBy: { saleDate: 'desc' },
                            take: 1,
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        // Calcola valore totale portfolio
        const totalValue = userCards.reduce((sum, uc) => {
            const latestPrice = uc.card.priceHistory[0]?.price ?? new Prisma.Decimal(0);
            return sum + Number(latestPrice);
        }, 0);
        const totalCost = userCards.reduce((sum, uc) => {
            return sum + Number(uc.purchasePrice ?? 0);
        }, 0);
        return reply.send({
            data: userCards,
            summary: {
                totalCards: userCards.length,
                totalValue: totalValue.toFixed(2),
                totalCost: totalCost.toFixed(2),
                roi: totalCost > 0
                    ? (((totalValue - totalCost) / totalCost) * 100).toFixed(2)
                    : '0.00',
            },
        });
    });
    // POST /api/v1/collection — aggiungi carta alla collezione
    app.post('/', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const body = addCardSchema.safeParse(req.body);
        if (!body.success) {
            return reply.status(400).send({ error: body.error.flatten() });
        }
        const card = await prisma.card.findUnique({ where: { id: body.data.cardId } });
        if (!card)
            return reply.status(404).send({ error: 'Carta non trovata nel catalogo' });
        const userCard = await prisma.userCard.create({
            data: {
                userId: user.id,
                cardId: body.data.cardId,
                condition: body.data.condition,
                gradeCompany: body.data.gradeCompany,
                gradeValue: body.data.gradeValue,
                certNumber: body.data.certNumber,
                purchasePrice: body.data.purchasePrice,
                purchaseDate: body.data.purchaseDate ? new Date(body.data.purchaseDate) : undefined,
                purchasePlatform: body.data.purchasePlatform,
                status: body.data.status,
                notes: body.data.notes,
            },
            include: { card: true },
        });
        return reply.status(201).send(userCard);
    });
    // PATCH /api/v1/collection/:id — aggiorna carta
    app.patch('/:id', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { id } = req.params;
        const existing = await prisma.userCard.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing)
            return reply.status(404).send({ error: 'Carta non trovata nella tua collezione' });
        const updated = await prisma.userCard.update({
            where: { id },
            data: req.body,
            include: { card: true },
        });
        return reply.send(updated);
    });
    // DELETE /api/v1/collection/:id — rimuovi carta
    app.delete('/:id', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { id } = req.params;
        const existing = await prisma.userCard.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing)
            return reply.status(404).send({ error: 'Carta non trovata' });
        await prisma.userCard.delete({ where: { id } });
        return reply.status(204).send();
    });
    // GET /api/v1/collection/portfolio-history?days=365
    // Restituisce l'andamento del valore totale del portfolio nel tempo
    app.get('/portfolio-history', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { days = '365' } = req.query;
        const since = new Date();
        since.setDate(since.getDate() - Number(days));
        // Prende tutte le userCard con storico prezzi aggregato per data
        const userCards = await prisma.userCard.findMany({
            where: { userId: user.id, status: 'in_collection' },
            select: { cardId: true, gradeValue: true, condition: true, purchasePrice: true },
        });
        // Per ogni data, somma i prezzi più recenti di ogni carta
        const pricesByDate = await prisma.priceHistory.groupBy({
            by: ['saleDate'],
            where: {
                cardId: { in: userCards.map((uc) => uc.cardId) },
                saleDate: { gte: since },
            },
            _avg: { price: true },
            orderBy: { saleDate: 'asc' },
        });
        return reply.send({ data: pricesByDate });
    });
}
