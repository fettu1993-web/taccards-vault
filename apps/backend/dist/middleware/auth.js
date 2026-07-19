import { createClient } from '@supabase/supabase-js';
import { prisma } from '../lib/prisma';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
export async function authenticate(req, reply) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Token mancante' });
    }
    const token = authHeader.slice(7);
    // Verifica token Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return reply.status(401).send({ error: 'Token non valido' });
    }
    // Carica o crea l'utente nel nostro DB
    let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
        dbUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                displayName: user.user_metadata?.full_name ?? null,
                avatarUrl: user.user_metadata?.avatar_url ?? null,
            },
        });
    }
    // Attacca l'utente alla request
    ;
    req.user = dbUser;
}
