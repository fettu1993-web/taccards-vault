import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
const addSealedSchema = z.object({
    name: z.string().min(1).max(200),
    category: z.string(),
    productType: z.enum(['box', 'case', 'pack', 'blaster', 'hobby', 'breakaway']),
    manufacturer: z.string().optional(),
    year: z.number().int().min(1990).max(2030),
    setName: z.string(),
    quantity: z.number().int().positive().default(1),
    purchasePrice: z.number().positive(),
    purchaseDate: z.string().datetime(),
    purchasePlatform: z.string().optional(),
    notes: z.string().max(500).optional(),
});
export async function sealedRoutes(app) {
    // GET /api/v1/sealed — lista prodotti sigillati
    app.get('/', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const products = await prisma.sealedProduct.findMany({
            where: { userId: user.id },
            include: {
                priceHistory: { orderBy: { saleDate: 'desc' }, take: 1 },
            },
            orderBy: { purchaseDate: 'desc' },
        });
        const totalInvested = products.reduce((sum, p) => sum + Number(p.purchasePrice) * p.quantity, 0);
        const totalCurrentValue = products.reduce((sum, p) => sum + Number(p.currentValue ?? p.purchasePrice) * p.quantity, 0);
        return reply.send({
            data: products,
            summary: {
                totalProducts: products.length,
                totalInvested: totalInvested.toFixed(2),
                totalCurrentValue: totalCurrentValue.toFixed(2),
                roi: totalInvested > 0
                    ? (((totalCurrentValue - totalInvested) / totalInvested) * 100).toFixed(2)
                    : '0.00',
            },
        });
    });
    // POST /api/v1/sealed — aggiungi prodotto sigillato
    app.post('/', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const body = addSealedSchema.safeParse(req.body);
        if (!body.success)
            return reply.status(400).send({ error: body.error.flatten() });
        const product = await prisma.sealedProduct.create({
            data: {
                userId: user.id,
                ...body.data,
                purchaseDate: new Date(body.data.purchaseDate),
            },
        });
        return reply.status(201).send(product);
    });
    // PATCH /api/v1/sealed/:id — aggiorna status o currentValue
    app.patch('/:id', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { id } = req.params;
        const existing = await prisma.sealedProduct.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing)
            return reply.status(404).send({ error: 'Prodotto non trovato' });
        const updated = await prisma.sealedProduct.update({
            where: { id },
            data: req.body,
        });
        return reply.send(updated);
    });
    // DELETE /api/v1/sealed/:id
    app.delete('/:id', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const { id } = req.params;
        const existing = await prisma.sealedProduct.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing)
            return reply.status(404).send({ error: 'Prodotto non trovato' });
        await prisma.sealedProduct.delete({ where: { id } });
        return reply.status(204).send();
    });
}
