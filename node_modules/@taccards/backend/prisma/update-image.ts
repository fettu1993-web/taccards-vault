import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const r = await prisma.card.updateMany({
    where: { playerName: 'Lamine Yamal', setName: '2023-24 Panini MegaCracks LaLiga EA Sports' },
    data: { imageUrl: 'https://povrueepomfwmvtdapkp.supabase.co/storage/v1/object/public/card-images/yamal-megacracks-rc.jpg' }
  })
  console.log('✅ Aggiornate:', r.count)
}

main().catch(console.error).finally(() => prisma.$disconnect())