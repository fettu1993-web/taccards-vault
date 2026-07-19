import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding catalogo carte...')

  const cards = [
    {
      name: 'Kylian Mbappé 2023 Panini Prizm FIFA',
      playerName: 'Kylian Mbappé',
      team: 'France',
      sport: 'soccer',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2023 Panini Prizm FIFA',
      year: 2023,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'LeBron James 2022 Panini Prizm NBA',
      playerName: 'LeBron James',
      team: 'Los Angeles Lakers',
      sport: 'basketball',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2022 Panini Prizm NBA',
      year: 2022,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Max Verstappen 2023 Topps F1 Chrome',
      playerName: 'Max Verstappen',
      team: 'Red Bull Racing',
      sport: 'f1',
      category: 'Topps Chrome',
      manufacturer: 'Topps',
      setName: '2023 Topps F1 Chrome',
      year: 2023,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Erling Haaland 2024 Topps Chrome UCL',
      playerName: 'Erling Haaland',
      team: 'Manchester City',
      sport: 'soccer',
      category: 'Topps Chrome',
      manufacturer: 'Topps',
      setName: '2024 Topps Chrome UCL',
      year: 2024,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Lionel Messi 2022 Panini Prizm FIFA WC',
      playerName: 'Lionel Messi',
      team: 'Argentina',
      sport: 'soccer',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2022 Panini Prizm FIFA World Cup',
      year: 2022,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Vinicius Jr 2023 Topps Chrome UCL',
      playerName: 'Vinicius Jr',
      team: 'Real Madrid',
      sport: 'soccer',
      category: 'Topps Chrome',
      manufacturer: 'Topps',
      setName: '2023 Topps Chrome UCL',
      year: 2023,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Lamine Yamal 2024 Panini Prizm FIFA',
      playerName: 'Lamine Yamal',
      team: 'FC Barcelona',
      sport: 'soccer',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2024 Panini Prizm FIFA',
      year: 2024,
      isRookie: true,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Giannis Antetokounmpo 2023 Panini Prizm NBA',
      playerName: 'Giannis Antetokounmpo',
      team: 'Milwaukee Bucks',
      sport: 'basketball',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2023 Panini Prizm NBA',
      year: 2023,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Charles Leclerc 2023 Topps F1 Chrome',
      playerName: 'Charles Leclerc',
      team: 'Ferrari',
      sport: 'f1',
      category: 'Topps Chrome',
      manufacturer: 'Topps',
      setName: '2023 Topps F1 Chrome',
      year: 2023,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Kylian Mbappé 2024 Panini Prizm LaLiga',
      playerName: 'Kylian Mbappé',
      team: 'Real Madrid',
      sport: 'soccer',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2024 Panini Prizm LaLiga',
      year: 2024,
      isRookie: false,
      isAutograph: false,
      isNumbered: false,
    },
    {
      name: 'Victor Wembanyama 2023 Panini Prizm NBA RC',
      playerName: 'Victor Wembanyama',
      team: 'San Antonio Spurs',
      sport: 'basketball',
      category: 'Panini Prizm',
      manufacturer: 'Panini',
      setName: '2023 Panini Prizm NBA',
      year: 2023,
      isRookie: true,
      isAutograph: false,
      isNumbered: false,
    },
  ]

  for (const card of cards) {
    const created = await prisma.card.create({ data: card })
    console.log(`  ✅ ${card.playerName} — ${card.setName} (${created.id})`)

    // Inserisci un prezzo finto per ogni carta così il frontend può mostrare valori
    const prices: Record<string, number> = {
      'Kylian Mbappé 2023 Panini Prizm FIFA': 185,
      'LeBron James 2022 Panini Prizm NBA': 165,
      'Max Verstappen 2023 Topps F1 Chrome': 72,
      'Erling Haaland 2024 Topps Chrome UCL': 140,
      'Lionel Messi 2022 Panini Prizm FIFA WC': 320,
      'Vinicius Jr 2023 Topps Chrome UCL': 45,
      'Lamine Yamal 2024 Panini Prizm FIFA': 180,
      'Giannis Antetokounmpo 2023 Panini Prizm NBA': 95,
      'Charles Leclerc 2023 Topps F1 Chrome': 38,
      'Kylian Mbappé 2024 Panini Prizm LaLiga': 260,
      'Victor Wembanyama 2023 Panini Prizm NBA RC': 580,
    }

    await prisma.priceHistory.create({
      data: {
        cardId: created.id,
        gradeLabel: 'raw',
        price: prices[card.name] ?? 100,
        source: 'manual',
        platform: 'seed',
        saleDate: new Date(),
      },
    })
  }

  console.log('\n🎉 Seed completato! 11 carte inserite con prezzi.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())