import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

// Parallels più importanti per le carte principali
// Ogni parallel è una carta separata con prezzo proprio
const parallels = [
  // ══ LAMINE YAMAL MegaCracks ══
  { playerName: 'Lamine Yamal', setName: '2023-24 Panini MegaCracks LaLiga EA Sports', parallel: 'Gold', cardNumber: '108G', price: 1200 },
  { playerName: 'Lamine Yamal', setName: '2023-24 Panini MegaCracks LaLiga EA Sports', parallel: 'Master Rookie Foil', cardNumber: '108MR', price: 2200 },

  // ══ LAMINE YAMAL Prizm ══
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Silver', cardNumber: '12S', price: 380 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Gold /10', cardNumber: '12G', price: 2800 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Red /25', cardNumber: '12R', price: 1200 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Orange /49', cardNumber: '12O', price: 650 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Blue /199', cardNumber: '12B', price: 280 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Purple /49', cardNumber: '12P', price: 580 },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', parallel: 'Black 1/1', cardNumber: '12BK', price: 12000 },

  // ══ MBAPPÉ RC Prizm ══
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Silver', cardNumber: '80S', price: 1200 },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Gold /10', cardNumber: '80G', price: 9500 },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Red /25', cardNumber: '80R', price: 4200 },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Orange /49', cardNumber: '80O', price: 2200 },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Blue /199', cardNumber: '80B', price: 850 },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', parallel: 'Black 1/1', cardNumber: '80BK', price: 45000 },

  // ══ MESSI RC ══
  { playerName: 'Lionel Messi', setName: '2004-05 Panini Mega Cracks', parallel: 'Foil', cardNumber: '70F', price: 8500 },

  // ══ WEMBANYAMA Prizm ══
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Silver', cardNumber: '301S', price: 580 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Gold /10', cardNumber: '301G', price: 4500 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Red /25', cardNumber: '301R', price: 1800 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Orange /49', cardNumber: '301O', price: 950 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Blue /199', cardNumber: '301B', price: 320 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Black 1/1', cardNumber: '301BK', price: 25000 },
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', parallel: 'Auto RC', cardNumber: '301A', price: 2800 },

  // ══ LUKA DONČIĆ RC Prizm ══
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Silver', cardNumber: '280S', price: 3200 },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Gold /10', cardNumber: '280G', price: 28000 },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Red /25', cardNumber: '280R', price: 12000 },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Orange /49', cardNumber: '280O', price: 5500 },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Auto RC', cardNumber: '280A', price: 18000 },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', parallel: 'Black 1/1', cardNumber: '280BK', price: 95000 },

  // ══ LEBRON RC Topps Chrome ══
  { playerName: 'LeBron James', setName: '2003-04 Topps Chrome', parallel: 'Refractor', cardNumber: '111R', price: 12000 },
  { playerName: 'LeBron James', setName: '2003-04 Topps Chrome', parallel: 'Gold Refractor /25', cardNumber: '111GR', price: 85000 },
  { playerName: 'LeBron James', setName: '2003-04 Topps Chrome', parallel: 'SuperFractor 1/1', cardNumber: '111SF', price: 350000 },
  { playerName: 'LeBron James', setName: '2003-04 Topps Chrome', parallel: 'Auto RC', cardNumber: '111A', price: 45000 },

  // ══ MICHAEL JORDAN RC Fleer ══
  { playerName: 'Michael Jordan', setName: '1986-87 Fleer Basketball', parallel: 'Sticker', cardNumber: '57ST', price: 2800 },

  // ══ VERSTAPPEN RC ══
  { playerName: 'Max Verstappen', setName: '2020 Topps Chrome F1', parallel: 'Refractor', cardNumber: '1R', price: 850 },
  { playerName: 'Max Verstappen', setName: '2020 Topps Chrome F1', parallel: 'Gold Refractor /50', cardNumber: '1GR', price: 3200 },
  { playerName: 'Max Verstappen', setName: '2020 Topps Chrome F1', parallel: 'SuperFractor 1/1', cardNumber: '1SF', price: 18000 },
  { playerName: 'Max Verstappen', setName: '2020 Topps Chrome F1', parallel: 'Auto RC', cardNumber: '1A', price: 4500 },

  // ══ SENNA ══
  { playerName: 'Ayrton Senna', setName: '1992 Topps F1', parallel: 'Auto', cardNumber: '1A', price: 28000 },

  // ══ LECLERC RC ══
  { playerName: 'Charles Leclerc', setName: '2020 Topps Chrome F1', parallel: 'Refractor', cardNumber: '16R', price: 420 },
  { playerName: 'Charles Leclerc', setName: '2020 Topps Chrome F1', parallel: 'Gold Refractor /50', cardNumber: '16GR', price: 1800 },
  { playerName: 'Charles Leclerc', setName: '2020 Topps Chrome F1', parallel: 'Auto RC', cardNumber: '16A', price: 2200 },

  // ══ SINNER ══
  { playerName: 'Jannik Sinner', setName: '2024 Topps Chrome Tennis', parallel: 'Refractor', cardNumber: '1R', price: 850 },
  { playerName: 'Jannik Sinner', setName: '2024 Topps Chrome Tennis', parallel: 'Gold Refractor /50', cardNumber: '1GR', price: 3500 },
  { playerName: 'Jannik Sinner', setName: '2024 Topps Chrome Tennis', parallel: 'Auto RC', cardNumber: '1A', price: 4800 },
  { playerName: 'Jannik Sinner', setName: '2024 Topps Chrome Tennis', parallel: 'SuperFractor 1/1', cardNumber: '1SF', price: 22000 },
]

async function main() {
  console.log('🌱 Seed parallels...')
  let created = 0, skipped = 0

  for (const p of parallels) {
    // Trova la carta base
    const baseCard = await prisma.card.findFirst({
      where: { playerName: p.playerName, setName: p.setName, parallel: null },
    })
    if (!baseCard) {
      console.log(`  ⚠️  Carta base non trovata: ${p.playerName} — ${p.setName}`)
      continue
    }

    // Controlla se il parallel esiste già
    const existing = await prisma.card.findFirst({
      where: { playerName: p.playerName, setName: p.setName, parallel: p.parallel },
    })
    if (existing) { skipped++; continue }

    // Crea il parallel
    const card = await prisma.card.create({
      data: {
        name: `${baseCard.playerName} ${baseCard.setName} ${p.parallel}`,
        playerName: baseCard.playerName,
        team: baseCard.team,
        sport: baseCard.sport,
        category: baseCard.category,
        manufacturer: baseCard.manufacturer,
        setName: baseCard.setName,
        year: baseCard.year,
        cardNumber: p.cardNumber,
        parallel: p.parallel,
        isRookie: baseCard.isRookie,
        isAutograph: p.parallel.includes('Auto'),
        isNumbered: p.parallel.includes('/') || p.parallel.includes('1/1'),
        dataSource: 'manual',
        imageUrl: baseCard.imageUrl,
      },
    })

    await prisma.priceHistory.create({
      data: {
        cardId: card.id,
        gradeLabel: 'raw',
        price: new Prisma.Decimal(p.price),
        source: 'manual',
        platform: 'ebay',
        saleDate: new Date(),
      },
    })

    created++
    console.log(`  ✅ ${card.playerName} — ${p.parallel} — €${p.price}`)
  }

  console.log(`\n✅ Completato: ${created} parallels creati, ${skipped} già presenti`)
}

main().catch(console.error).finally(() => prisma.$disconnect())