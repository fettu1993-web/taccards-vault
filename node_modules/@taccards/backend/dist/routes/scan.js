import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { identifyCardFromImage, confirmScan } from '../services/scanService';
const scanSchema = z.object({
    imageBase64: z.string().min(100),
});
const confirmSchema = z.object({
    scanLogId: z.string().uuid(),
    cardId: z.string().uuid(),
});
export async function scanRoutes(app) {
    // POST /api/v1/scan — scansiona carta da immagine
    app.post('/', { preHandler: authenticate }, async (req, reply) => {
        const user = req.user;
        const body = scanSchema.safeParse(req.body);
        if (!body.success) {
            return reply.status(400).send({ error: body.error.flatten() });
        }
        const result = await identifyCardFromImage(body.data.imageBase64, user.id);
        return reply.send(result);
    });
    // POST /api/v1/scan/confirm — conferma o correggi il match
    app.post('/confirm', { preHandler: authenticate }, async (req, reply) => {
        const body = confirmSchema.safeParse(req.body);
        if (!body.success) {
            return reply.status(400).send({ error: body.error.flatten() });
        }
        await confirmScan(body.data.scanLogId, body.data.cardId);
        return reply.send({ ok: true });
    });
}
