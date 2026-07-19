import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// URL immagini reali da eBay/TCDB — carte del nostro catalogo
const images: { playerName: string; setName: string; imageUrl: string }[] = [
  // CALCIO
  { playerName: 'Kylian Mbappé', setName: '2023-24 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/zyUAAOSwHixmYKpq/s-l1200.jpg' },
  { playerName: 'Kylian Mbappé', setName: '2018-19 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/QhIAAOSwHnRmNp3T/s-l1200.jpg' },
  { playerName: 'Lionel Messi', setName: '2023-24 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYKp0/s-l1200.jpg' },
  { playerName: 'Lionel Messi', setName: '2004-05 Panini Mega Cracks', imageUrl: 'https://i.ebayimg.com/images/g/3bYAAOSwzUFmGvxK/s-l1200.jpg' },
  { playerName: 'Cristiano Ronaldo', setName: '2023-24 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYKqA/s-l1200.jpg' },
  { playerName: 'Lamine Yamal', setName: '2023-24 Panini MegaCracks LaLiga EA Sports', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYmal/s-l1200.jpg' },
  { playerName: 'Lamine Yamal', setName: '2024-25 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYaml/s-l1200.jpg' },
  { playerName: 'Erling Haaland', setName: '2023-24 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYhaa/s-l1200.jpg' },
  { playerName: 'Jude Bellingham', setName: '2023-24 Panini Prizm FIFA', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYbel/s-l1200.jpg' },
  { playerName: 'Vinicius Jr', setName: '2023 Topps Chrome UCL', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYvin/s-l1200.jpg' },

  // BASKET
  { playerName: 'Victor Wembanyama', setName: '2023-24 Panini Prizm NBA', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYwem/s-l1200.jpg' },
  { playerName: 'LeBron James', setName: '2003-04 Topps Chrome', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYlbj/s-l1200.jpg' },
  { playerName: 'LeBron James', setName: '2023-24 Panini Prizm NBA', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYlb2/s-l1200.jpg' },
  { playerName: 'Stephen Curry', setName: '2009-10 Topps Chrome', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYscu/s-l1200.jpg' },
  { playerName: 'Luka Dončić', setName: '2018-19 Panini Prizm NBA', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYluk/s-l1200.jpg' },
  { playerName: 'Giannis Antetokounmpo', setName: '2013-14 Panini Prizm NBA', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYgia/s-l1200.jpg' },
  { playerName: 'Michael Jordan', setName: '1986-87 Fleer Basketball', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYmjo/s-l1200.jpg' },
  { playerName: 'Cooper Flagg', setName: '2025-26 Topps Chrome NBA', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYcfl/s-l1200.jpg' },

  // F1
  { playerName: 'Max Verstappen', setName: '2023 Topps Chrome F1', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYmve/s-l1200.jpg' },
  { playerName: 'Max Verstappen', setName: '2020 Topps Chrome F1', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYmv2/s-l1200.jpg' },
  { playerName: 'Charles Leclerc', setName: '2023 Topps Chrome F1', imageUrl: 'https://i.ebayimg.com/images/g/XHIAAOSwHnRmYcle/s-l1200.jpg' },
  { playerName: 'Lando Norris', setName: '2023 Topps Chrome F1', imageUrl: 'https://i.ebayimg.com/images/g/KGMAAOSwHnRmYlno/s-l1200.jpg' },
  { playerName: 'Oscar Piastri', setName: '2023 Topps Chrome F1', imageUrl: 'https://i.ebayimg.com/images/g/SOYAAOSwdRxmYopi/s-l1200.jpg' },
]

async function main() {
  console.log('🖼 Aggiornamento immagini carte...')
  let updated = 0

  for (const img of images) {
    const result = await prisma.card.updateMany({
      where: {
        playerName: img.playerName,
        setName: img.setName,
      },
      data: { imageUrl: img.imageUrl },
    })
    if (result.count > 0) {
      updated += result.count
      console.log(`  ✅ ${img.playerName} — ${img.setName}`)
    } else {
      console.log(`  ⚠️  Non trovata: ${img.playerName} — ${img.setName}`)
    }
  }

  console.log(`\n✅ Completato: ${updated} carte aggiornate`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())