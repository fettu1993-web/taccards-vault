import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const cards = [
  // ══ CALCIO ══
  { playerName: 'Kylian Mbappé', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '1', isRookie: false, price: 45.00 },
  { playerName: 'Kylian Mbappé', team: 'Paris Saint-Germain', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '80', isRookie: true, price: 280.00 },
  { playerName: 'Erling Haaland', team: 'Manchester City', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '14', isRookie: false, price: 35.00 },
  { playerName: 'Erling Haaland', team: 'RB Salzburg', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm FIFA', year: 2019, cardNumber: '246', isRookie: true, price: 180.00 },
  { playerName: 'Lionel Messi', team: 'Inter Miami', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '7', isRookie: false, price: 120.00 },
  { playerName: 'Lionel Messi', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Mega Cracks', manufacturer: 'Panini', setName: '2004-05 Panini Mega Cracks', year: 2004, cardNumber: '70', isRookie: true, price: 3200.00 },
  { playerName: 'Cristiano Ronaldo', team: 'Al Nassr', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '11', isRookie: false, price: 85.00 },
  { playerName: 'Cristiano Ronaldo', team: 'Manchester United', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '2003-04 Panini Sports Mega Cracks', year: 2003, cardNumber: '95', isRookie: true, price: 1800.00 },
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Mega Cracks', manufacturer: 'Panini', setName: '2023-24 Panini MegaCracks LaLiga EA Sports', year: 2023, cardNumber: '108', isRookie: true, price: 420.00 },
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2024-25 Panini Prizm FIFA', year: 2024, cardNumber: '12', isRookie: false, price: 95.00 },
  { playerName: 'Vinicius Jr', team: 'Real Madrid', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome UCL', year: 2023, cardNumber: '44', isRookie: false, price: 28.00 },
  { playerName: 'Vinicius Jr', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '133', isRookie: true, price: 95.00 },
  { playerName: 'Jude Bellingham', team: 'Borussia Dortmund', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020-21 Topps Chrome Bundesliga', year: 2020, cardNumber: '1', isRookie: true, price: 320.00 },
  { playerName: 'Jude Bellingham', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '10', isRookie: false, price: 55.00 },
  { playerName: 'Pedri', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '87', isRookie: true, price: 75.00 },
  { playerName: 'Florian Wirtz', team: 'Bayer Leverkusen', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020-21 Topps Chrome Bundesliga', year: 2020, cardNumber: '88', isRookie: true, price: 110.00 },
  { playerName: 'Gianluigi Donnarumma', team: 'PSG', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2016-17 Panini Prizm FIFA', year: 2016, cardNumber: '245', isRookie: true, price: 65.00 },

  // ══ BASKET ══
  { playerName: 'Victor Wembanyama', team: 'San Antonio Spurs', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '301', isRookie: true, price: 95.00 },
  { playerName: 'Victor Wembanyama', team: 'San Antonio Spurs', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '301', parallel: 'Silver', isRookie: true, price: 580.00 },
  { playerName: 'LeBron James', team: 'Cleveland Cavaliers', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2003-04 Topps Chrome', year: 2003, cardNumber: '111', isRookie: true, price: 4800.00 },
  { playerName: 'LeBron James', team: 'Los Angeles Lakers', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '1', isRookie: false, price: 25.00 },
  { playerName: 'Stephen Curry', team: 'Golden State Warriors', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2009-10 Topps Chrome', year: 2009, cardNumber: '101', isRookie: true, price: 1200.00 },
  { playerName: 'Stephen Curry', team: 'Golden State Warriors', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '30', isRookie: false, price: 18.00 },
  { playerName: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2013-14 Panini Prizm NBA', year: 2013, cardNumber: '290', isRookie: true, price: 580.00 },
  { playerName: 'Luka Dončić', team: 'Dallas Mavericks', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm NBA', year: 2018, cardNumber: '280', isRookie: true, price: 750.00 },
  { playerName: 'Nikola Jokić', team: 'Denver Nuggets', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2015-16 Panini Prizm NBA', year: 2015, cardNumber: '288', isRookie: true, price: 320.00 },
  { playerName: 'Jayson Tatum', team: 'Boston Celtics', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2017-18 Panini Prizm NBA', year: 2017, cardNumber: '14', isRookie: true, price: 180.00 },
  { playerName: 'Paolo Banchero', team: 'Orlando Magic', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022-23 Panini Prizm NBA', year: 2022, cardNumber: '301', isRookie: true, price: 45.00 },
  { playerName: 'Cooper Flagg', team: 'Dallas Mavericks', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025-26 Topps Chrome NBA', year: 2025, cardNumber: '150', isRookie: true, price: 380.00 },
  { playerName: 'Michael Jordan', team: 'Chicago Bulls', sport: 'basketball', category: 'Fleer', manufacturer: 'Fleer', setName: '1986-87 Fleer Basketball', year: 1986, cardNumber: '57', isRookie: true, price: 8500.00 },

  // ══ F1 ══
  { playerName: 'Max Verstappen', team: 'Red Bull Racing', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '1', isRookie: true, price: 280.00 },
  { playerName: 'Max Verstappen', team: 'Red Bull Racing', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '1', isRookie: false, price: 72.00 },
  { playerName: 'Lewis Hamilton', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '44', isRookie: false, price: 95.00 },
  { playerName: 'Charles Leclerc', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '16', isRookie: true, price: 145.00 },
  { playerName: 'Charles Leclerc', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '16', isRookie: false, price: 38.00 },
  { playerName: 'Lando Norris', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '4', isRookie: true, price: 195.00 },
  { playerName: 'Lando Norris', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '4', isRookie: false, price: 55.00 },
  { playerName: 'Carlos Sainz', team: 'Williams', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '55', isRookie: true, price: 85.00 },
  { playerName: 'Oscar Piastri', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '81', isRookie: true, price: 120.00 },
  { playerName: 'Kimi Antonelli', team: 'Mercedes', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '12', isRookie: true, price: 220.00 },
]

async function main() {
  console.log('🌱 Avvio seed catalogo carte...')
  let created = 0
  let skipped = 0

  for (const c of cards) {
    const { price, parallel, ...cardData } = c

    const existing = await prisma.card.findFirst({
      where: {
        playerName: cardData.playerName,
        setName: cardData.setName,
        cardNumber: cardData.cardNumber,
      },
    })

    if (existing) {
      skipped++
      continue
    }

    const card = await prisma.card.create({
      data: {
        name: `${cardData.playerName} ${cardData.setName}`,
        playerName: cardData.playerName,
        team: cardData.team,
        sport: cardData.sport,
        category: cardData.category,
        manufacturer: cardData.manufacturer,
        setName: cardData.setName,
        year: cardData.year,
        cardNumber: cardData.cardNumber,
        parallel: parallel ?? null,
        isRookie: cardData.isRookie,
        isAutograph: false,
        isNumbered: false,
        dataSource: 'manual',
      },
    })

    await prisma.priceHistory.create({
      data: {
        cardId: card.id,
        gradeLabel: 'raw',
        price: new Prisma.Decimal(price),
        source: 'manual',
        platform: 'ebay',
        saleDate: new Date(),
      },
    })

    created++
    console.log(`  ✅ ${card.playerName} — ${card.setName}`)
  }

  console.log(`\n✅ Seed completato: ${created} carte create, ${skipped} già presenti`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())