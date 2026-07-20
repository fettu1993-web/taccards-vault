import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const cards = [
  // ══ TENNIS ══
  { playerName: 'Jannik Sinner', team: 'Italy', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2024 Topps Chrome Tennis', year: 2024, cardNumber: '1', isRookie: true, price: 280 },
  { playerName: 'Jannik Sinner', team: 'Italy', sport: 'tennis', category: 'Topps', manufacturer: 'Topps', setName: '2023 Topps Tennis', year: 2023, cardNumber: '1', isRookie: false, price: 95 },
  { playerName: 'Jannik Sinner', team: 'Italy', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome Tennis', year: 2025, cardNumber: '1', isRookie: false, price: 180 },
  { playerName: 'Carlos Alcaraz Garfia', team: 'Spain', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2022 Topps Chrome Tennis', year: 2022, cardNumber: '10', isRookie: true, price: 320 },
  { playerName: 'Carlos Alcaraz Garfia', team: 'Spain', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2024 Topps Chrome Tennis', year: 2024, cardNumber: '10', isRookie: false, price: 145 },
  { playerName: 'Novak Djokovic', team: 'Serbia', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome Tennis', year: 2023, cardNumber: '3', isRookie: false, price: 85 },
  { playerName: 'Roger Federer', team: 'Switzerland', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2021 Topps Chrome Tennis', year: 2021, cardNumber: '5', isRookie: false, price: 180 },
  { playerName: 'Rafael Nadal', team: 'Spain', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2022 Topps Chrome Tennis', year: 2022, cardNumber: '2', isRookie: false, price: 120 },
  { playerName: 'Lorenzo Musetti', team: 'Italy', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2024 Topps Chrome Tennis', year: 2024, cardNumber: '22', isRookie: false, price: 45 },
  { playerName: 'Matteo Berrettini', team: 'Italy', sport: 'tennis', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2022 Topps Chrome Tennis', year: 2022, cardNumber: '7', isRookie: false, price: 35 },

  // ══ BASKET NBA ══
  { playerName: 'Michael Jordan', team: 'Chicago Bulls', sport: 'basketball', category: 'Fleer', manufacturer: 'Fleer', setName: '1986-87 Fleer Basketball', year: 1986, cardNumber: '57', isRookie: true, price: 8500 },
  { playerName: 'Michael Jordan', team: 'Chicago Bulls', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '1996-97 Topps Chrome NBA', year: 1996, cardNumber: '139', isRookie: false, price: 420 },
  { playerName: 'Kobe Bryant', team: 'Los Angeles Lakers', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '1996-97 Topps Chrome NBA', year: 1996, cardNumber: '138', isRookie: true, price: 1800 },
  { playerName: 'Kobe Bryant', team: 'Los Angeles Lakers', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2012-13 Panini Prizm NBA', year: 2012, cardNumber: '24', isRookie: false, price: 280 },
  { playerName: 'LeBron James', team: 'Cleveland Cavaliers', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2003-04 Topps Chrome', year: 2003, cardNumber: '111', isRookie: true, price: 4800 },
  { playerName: 'LeBron James', team: 'Los Angeles Lakers', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '1', isRookie: false, price: 25 },
  { playerName: 'Stephen Curry', team: 'Golden State Warriors', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2009-10 Topps Chrome', year: 2009, cardNumber: '101', isRookie: true, price: 1200 },
  { playerName: 'Stephen Curry', team: 'Golden State Warriors', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '30', isRookie: false, price: 18 },
  { playerName: 'Victor Wembanyama', team: 'San Antonio Spurs', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '301', isRookie: true, price: 95 },
  { playerName: 'Victor Wembanyama', team: 'San Antonio Spurs', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '301', parallel: 'Silver', isRookie: true, price: 580 },
  { playerName: 'Luka Dončić', team: 'Dallas Mavericks', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm NBA', year: 2018, cardNumber: '280', isRookie: true, price: 750 },
  { playerName: 'Luka Dončić', team: 'Dallas Mavericks', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm NBA', year: 2023, cardNumber: '77', isRookie: false, price: 35 },
  { playerName: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2013-14 Panini Prizm NBA', year: 2013, cardNumber: '290', isRookie: true, price: 580 },
  { playerName: 'Nikola Jokić', team: 'Denver Nuggets', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2015-16 Panini Prizm NBA', year: 2015, cardNumber: '288', isRookie: true, price: 320 },
  { playerName: 'Jayson Tatum', team: 'Boston Celtics', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2017-18 Panini Prizm NBA', year: 2017, cardNumber: '14', isRookie: true, price: 180 },
  { playerName: 'Paolo Banchero', team: 'Orlando Magic', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022-23 Panini Prizm NBA', year: 2022, cardNumber: '301', isRookie: true, price: 45 },
  { playerName: 'Cooper Flagg', team: 'Dallas Mavericks', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025-26 Topps Chrome NBA', year: 2025, cardNumber: '150', isRookie: true, price: 380 },
  { playerName: 'Zion Williamson', team: 'New Orleans Pelicans', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm NBA', year: 2019, cardNumber: '248', isRookie: true, price: 180 },
  { playerName: 'Kevin Durant', team: 'Oklahoma City Thunder', sport: 'basketball', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2007-08 Topps Chrome NBA', year: 2007, cardNumber: '131', isRookie: true, price: 650 },
  { playerName: 'Devin Booker', team: 'Phoenix Suns', sport: 'basketball', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2015-16 Panini Prizm NBA', year: 2015, cardNumber: '308', isRookie: true, price: 220 },

  // ══ F1 ══
  { playerName: 'Ayrton Senna', team: 'McLaren', sport: 'f1', category: 'Topps', manufacturer: 'Topps', setName: '1992 Topps F1', year: 1992, cardNumber: '1', isRookie: false, price: 2800 },
  { playerName: 'Ayrton Senna', team: 'Lotus', sport: 'f1', category: 'Topps', manufacturer: 'Topps', setName: '1985 Topps F1', year: 1985, cardNumber: '12', isRookie: true, price: 4500 },
  { playerName: 'Michael Schumacher', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '7', isRookie: false, price: 380 },
  { playerName: 'Michael Schumacher', team: 'Benetton', sport: 'f1', category: 'Topps', manufacturer: 'Topps', setName: '1992 Topps F1', year: 1992, cardNumber: '3', isRookie: true, price: 850 },
  { playerName: 'Max Verstappen', team: 'Red Bull Racing', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '1', isRookie: true, price: 280 },
  { playerName: 'Max Verstappen', team: 'Red Bull Racing', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '1', isRookie: false, price: 72 },
  { playerName: 'Max Verstappen', team: 'Red Bull Racing', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '1', isRookie: false, price: 65 },
  { playerName: 'Lewis Hamilton', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '44', isRookie: false, price: 95 },
  { playerName: 'Lewis Hamilton', team: 'Mercedes', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '44', isRookie: false, price: 120 },
  { playerName: 'Charles Leclerc', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '16', isRookie: true, price: 145 },
  { playerName: 'Charles Leclerc', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '16', isRookie: false, price: 38 },
  { playerName: 'Charles Leclerc', team: 'Ferrari', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '16', isRookie: false, price: 42 },
  { playerName: 'Lando Norris', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '4', isRookie: true, price: 195 },
  { playerName: 'Lando Norris', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '4', isRookie: false, price: 55 },
  { playerName: 'Oscar Piastri', team: 'McLaren', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '81', isRookie: true, price: 120 },
  { playerName: 'Carlos Sainz', team: 'Williams', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '55', isRookie: false, price: 35 },
  { playerName: 'Kimi Antonelli', team: 'Mercedes', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2025 Topps Chrome F1', year: 2025, cardNumber: '12', isRookie: true, price: 220 },
  { playerName: 'Fernando Alonso', team: 'Aston Martin', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome F1', year: 2023, cardNumber: '14', isRookie: false, price: 45 },
  { playerName: 'Fernando Alonso', team: 'Renault', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '14', isRookie: false, price: 85 },
  { playerName: 'George Russell', team: 'Mercedes', sport: 'f1', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020 Topps Chrome F1', year: 2020, cardNumber: '63', isRookie: true, price: 95 },
]

async function main() {
  console.log('🌱 Seed catalogo Tennis + Basket + F1...')
  let created = 0, skipped = 0

  for (const c of cards) {
    const { price, parallel, ...cardData } = c as any
    const existing = await prisma.card.findFirst({
      where: { playerName: cardData.playerName, setName: cardData.setName, cardNumber: cardData.cardNumber },
    })
    if (existing) { skipped++; continue }

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

  console.log(`\n✅ Completato: ${created} carte create, ${skipped} già presenti`)
}

main().catch(console.error).finally(() => prisma.$disconnect())