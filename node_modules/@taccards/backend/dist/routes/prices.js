import { authenticate } from '../middleware/auth';
import { syncCardPrices } from '../services/priceService';
import { prisma } from '../lib/prisma';
export async function pricesRoutes(app) {
    // POST /api/v1/prices/sync/:cardId — forza aggiornamento prezzi
    app.post('/sync/:cardId', { preHandler: authenticate }, async (req, reply) => {
        const { cardId } = req.params;
        await syncCardPrices(cardId);
        return reply.send({ ok: true });
    });
    // GET /api/v1/prices/:cardId?grade=PSA 10&days=90
    app.get('/:cardId', { preHandler: authenticate }, async (req, reply) => {
        const { cardId } = req.params;
        const { grade = 'raw', days = '90' } = req.query;
        const since = new Date();
        since.setDate(since.getDate() - Number(days));
        const data = await prisma.priceHistory.findMany({
            where: {
                cardId,
                gradeLabel: grade,
                saleDate: { gte: since },
            },
            orderBy: { saleDate: 'asc' },
            select: { price: true, saleDate: true, source: true, platform: true },
        });
        return reply.send({ cardId, grade, data });
    });
}
