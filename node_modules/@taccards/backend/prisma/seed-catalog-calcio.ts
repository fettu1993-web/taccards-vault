import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const cards = [
  // ══ MARADONA ══
  { playerName: 'Diego Maradona', team: 'Napoli', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1987-88 Panini Calciatori', year: 1987, cardNumber: '301', isRookie: false, price: 1200 },
  { playerName: 'Diego Maradona', team: 'Argentina', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1986 Panini FIFA World Cup Mexico', year: 1986, cardNumber: '85', isRookie: false, price: 2800 },
  { playerName: 'Diego Maradona', team: 'Napoli', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1989-90 Panini Calciatori', year: 1989, cardNumber: '276', isRookie: false, price: 950 },
  { playerName: 'Diego Maradona', team: 'Barcelona', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1982-83 Panini Futbol', year: 1982, cardNumber: '12', isRookie: false, price: 1800 },

  // ══ MESSI ══
  { playerName: 'Lionel Messi', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Mega Cracks', manufacturer: 'Panini', setName: '2004-05 Panini Mega Cracks', year: 2004, cardNumber: '70', isRookie: true, price: 3200 },
  { playerName: 'Lionel Messi', team: 'FC Barcelona', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '2005-06 Panini Calciatori', year: 2005, cardNumber: '116', isRookie: false, price: 480 },
  { playerName: 'Lionel Messi', team: 'FC Barcelona', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2012-13 Topps Chrome UEFA CL', year: 2012, cardNumber: '1', isRookie: false, price: 320 },
  { playerName: 'Lionel Messi', team: 'Paris Saint-Germain', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2021-22 Panini Prizm FIFA', year: 2021, cardNumber: '11', isRookie: false, price: 180 },
  { playerName: 'Lionel Messi', team: 'Inter Miami', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '7', isRookie: false, price: 120 },
  { playerName: 'Lionel Messi', team: 'Argentina', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022 Panini Prizm FIFA World Cup', year: 2022, cardNumber: '1', isRookie: false, price: 320 },

  // ══ RONALDO ══
  { playerName: 'Cristiano Ronaldo', team: 'Manchester United', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '2003-04 Panini Sports Mega Cracks', year: 2003, cardNumber: '95', isRookie: true, price: 1800 },
  { playerName: 'Cristiano Ronaldo', team: 'Real Madrid', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2014-15 Topps Chrome UCL', year: 2014, cardNumber: '1', isRookie: false, price: 280 },
  { playerName: 'Cristiano Ronaldo', team: 'Juventus', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm FIFA', year: 2019, cardNumber: '11', isRookie: false, price: 95 },
  { playerName: 'Cristiano Ronaldo', team: 'Al Nassr', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '11', isRookie: false, price: 85 },
  { playerName: 'Cristiano Ronaldo', team: 'Portugal', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022 Panini Prizm FIFA World Cup', year: 2022, cardNumber: '11', isRookie: false, price: 75 },

  // ══ LAMINE YAMAL ══
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Mega Cracks', manufacturer: 'Panini', setName: '2023-24 Panini MegaCracks LaLiga EA Sports', year: 2023, cardNumber: '108', isRookie: true, price: 420 },
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2024-25 Panini Prizm FIFA', year: 2024, cardNumber: '12', isRookie: false, price: 95 },
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome LaLiga', year: 2023, cardNumber: '88', isRookie: true, price: 180 },
  { playerName: 'Lamine Yamal', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2024 Panini Prizm FIFA', year: 2024, cardNumber: '108', isRookie: false, price: 180 },

  // ══ MBAPPÉ ══
  { playerName: 'Kylian Mbappé', team: 'Paris Saint-Germain', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '80', isRookie: true, price: 280 },
  { playerName: 'Kylian Mbappé', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '1', isRookie: false, price: 45 },
  { playerName: 'Kylian Mbappé', team: 'France', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022 Panini Prizm FIFA World Cup', year: 2022, cardNumber: '2', isRookie: false, price: 65 },
  { playerName: 'Kylian Mbappé', team: 'Real Madrid', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2024-25 Topps Chrome UCL', year: 2024, cardNumber: '10', isRookie: false, price: 38 },

  // ══ HAALAND ══
  { playerName: 'Erling Haaland', team: 'RB Salzburg', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm FIFA', year: 2019, cardNumber: '246', isRookie: true, price: 180 },
  { playerName: 'Erling Haaland', team: 'Manchester City', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022-23 Panini Prizm Premier League', year: 2022, cardNumber: '9', isRookie: false, price: 55 },
  { playerName: 'Erling Haaland', team: 'Manchester City', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome UCL', year: 2023, cardNumber: '9', isRookie: false, price: 35 },
  { playerName: 'Erling Haaland', team: 'Norway', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '14', isRookie: false, price: 42 },

  // ══ BELLINGHAM ══
  { playerName: 'Jude Bellingham', team: 'Borussia Dortmund', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020-21 Topps Chrome Bundesliga', year: 2020, cardNumber: '1', isRookie: true, price: 320 },
  { playerName: 'Jude Bellingham', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '10', isRookie: false, price: 55 },
  { playerName: 'Jude Bellingham', team: 'Real Madrid', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome UCL', year: 2023, cardNumber: '5', isRookie: false, price: 48 },

  // ══ VINICIUS JR ══
  { playerName: 'Vinicius Jr', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '133', isRookie: true, price: 95 },
  { playerName: 'Vinicius Jr', team: 'Real Madrid', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023 Topps Chrome UCL', year: 2023, cardNumber: '44', isRookie: false, price: 28 },
  { playerName: 'Vinicius Jr', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm FIFA', year: 2023, cardNumber: '20', isRookie: false, price: 32 },

  // ══ PEDRI ══
  { playerName: 'Pedri', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '87', isRookie: true, price: 75 },
  { playerName: 'Pedri', team: 'FC Barcelona', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2021-22 Topps Chrome UCL', year: 2021, cardNumber: '8', isRookie: false, price: 35 },

  // ══ WIRTZ ══
  { playerName: 'Florian Wirtz', team: 'Bayer Leverkusen', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020-21 Topps Chrome Bundesliga', year: 2020, cardNumber: '88', isRookie: true, price: 110 },
  { playerName: 'Florian Wirtz', team: 'Bayer Leverkusen', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome Bundesliga', year: 2023, cardNumber: '10', isRookie: false, price: 45 },

  // ══ DONNARUMMA ══
  { playerName: 'Gianluigi Donnarumma', team: 'AC Milan', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2016-17 Panini Prizm FIFA', year: 2016, cardNumber: '245', isRookie: true, price: 65 },
  { playerName: 'Gianluigi Donnarumma', team: 'PSG', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2021-22 Panini Prizm FIFA', year: 2021, cardNumber: '1', isRookie: false, price: 28 },

  // ══ SERIE A ITALIANA ══
  { playerName: 'Dusan Vlahovic', team: 'Juventus', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2021-22 Panini Prizm FIFA', year: 2021, cardNumber: '88', isRookie: true, price: 45 },
  { playerName: 'Nicolo Barella', team: 'Inter Milan', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm FIFA', year: 2019, cardNumber: '142', isRookie: false, price: 55 },
  { playerName: 'Nicolo Barella', team: 'Inter Milan', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome UCL', year: 2023, cardNumber: '22', isRookie: false, price: 28 },
  { playerName: 'Victor Osimhen', team: 'Napoli', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '205', isRookie: true, price: 85 },
  { playerName: 'Theo Hernandez', team: 'AC Milan', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2022-23 Topps Chrome UCL', year: 2022, cardNumber: '33', isRookie: false, price: 22 },
  { playerName: 'Rafael Leao', team: 'AC Milan', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2021-22 Panini Prizm FIFA', year: 2021, cardNumber: '77', isRookie: false, price: 38 },
  { playerName: 'Paulo Dybala', team: 'AS Roma', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '55', isRookie: false, price: 32 },
  { playerName: 'Lorenzo Pellegrini', team: 'AS Roma', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '118', isRookie: false, price: 18 },
  { playerName: 'Khvicha Kvaratskhelia', team: 'Napoli', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022-23 Panini Prizm FIFA', year: 2022, cardNumber: '99', isRookie: true, price: 65 },
  { playerName: 'Federico Chiesa', team: 'Liverpool', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm FIFA', year: 2020, cardNumber: '88', isRookie: false, price: 35 },

  // ══ PREMIER LEAGUE ══
  { playerName: 'Mohamed Salah', team: 'Liverpool', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2017-18 Panini Prizm FIFA', year: 2017, cardNumber: '11', isRookie: false, price: 85 },
  { playerName: 'Mohamed Salah', team: 'Liverpool', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm Premier League', year: 2023, cardNumber: '11', isRookie: false, price: 28 },
  { playerName: 'Kevin De Bruyne', team: 'Manchester City', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2021-22 Panini Prizm Premier League', year: 2021, cardNumber: '17', isRookie: false, price: 42 },
  { playerName: 'Harry Kane', team: 'Bayern Munich', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm Premier League', year: 2020, cardNumber: '10', isRookie: false, price: 38 },
  { playerName: 'Bukayo Saka', team: 'Arsenal', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2020-21 Panini Prizm Premier League', year: 2020, cardNumber: '77', isRookie: true, price: 55 },
  { playerName: 'Phil Foden', team: 'Manchester City', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm Premier League', year: 2019, cardNumber: '47', isRookie: false, price: 45 },
  { playerName: 'Marcus Rashford', team: 'Manchester United', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2019-20 Panini Prizm Premier League', year: 2019, cardNumber: '20', isRookie: false, price: 28 },

  // ══ LA LIGA ══
  { playerName: 'Carlos Alcaraz', team: 'Real Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2024-25 Panini Prizm LaLiga', year: 2024, cardNumber: '14', isRookie: false, price: 22 },
  { playerName: 'Robert Lewandowski', team: 'FC Barcelona', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2022-23 Panini Prizm LaLiga', year: 2022, cardNumber: '9', isRookie: false, price: 35 },
  { playerName: 'Antoine Griezmann', team: 'Atletico Madrid', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2023-24 Panini Prizm LaLiga', year: 2023, cardNumber: '7', isRookie: false, price: 22 },

  // ══ BUNDESLIGA ══
  { playerName: 'Jamal Musiala', team: 'Bayern Munich', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2020-21 Topps Chrome Bundesliga', year: 2020, cardNumber: '10', isRookie: true, price: 85 },
  { playerName: 'Jamal Musiala', team: 'Bayern Munich', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2023-24 Topps Chrome Bundesliga', year: 2023, cardNumber: '10', isRookie: false, price: 32 },
  { playerName: 'Leroy Sane', team: 'Bayern Munich', sport: 'soccer', category: 'Topps Chrome', manufacturer: 'Topps', setName: '2022-23 Topps Chrome Bundesliga', year: 2022, cardNumber: '19', isRookie: false, price: 18 },

  // ══ NAZIONALI STORICHE ══
  { playerName: 'Ronaldo Nazario', team: 'Brazil', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1998 Panini FIFA World Cup France', year: 1998, cardNumber: '44', isRookie: false, price: 380 },
  { playerName: 'Zinedine Zidane', team: 'France', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1998 Panini FIFA World Cup France', year: 1998, cardNumber: '66', isRookie: false, price: 280 },
  { playerName: 'Roberto Baggio', team: 'Italy', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1994 Panini FIFA World Cup USA', year: 1994, cardNumber: '10', isRookie: false, price: 320 },
  { playerName: 'Paolo Maldini', team: 'Italy', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '1994 Panini FIFA World Cup USA', year: 1994, cardNumber: '3', isRookie: false, price: 280 },
  { playerName: 'Francesco Totti', team: 'AS Roma', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '2006 Panini FIFA World Cup Germany', year: 2006, cardNumber: '10', isRookie: false, price: 220 },
  { playerName: 'Alessandro Del Piero', team: 'Juventus', sport: 'soccer', category: 'Panini', manufacturer: 'Panini', setName: '2006 Panini FIFA World Cup Germany', year: 2006, cardNumber: '7', isRookie: false, price: 180 },
  { playerName: 'Gianluigi Buffon', team: 'Italy', sport: 'soccer', category: 'Panini Prizm', manufacturer: 'Panini', setName: '2018-19 Panini Prizm FIFA', year: 2018, cardNumber: '1', isRookie: false, price: 85 },
]

async function main() {
  console.log('🌱 Seed catalogo calcio...')
  let created = 0, skipped = 0

  for (const c of cards) {
    const { price, ...cardData } = c
    const existing = await prisma.card.findFirst({
      where: { playerName: cardData.playerName, setName: cardData.setName },
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

  console.log(`\n✅ Calcio: ${created} carte create, ${skipped} già presenti`)
}

main().catch(console.error).finally(() => prisma.$disconnect())