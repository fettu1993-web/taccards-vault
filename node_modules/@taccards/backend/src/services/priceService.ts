import axios from 'axios'
import { prisma } from '../lib/prisma'

const CARDHEDGE_BASE = 'https://api.cardhedger.com/v1'
const CARDHEDGE_KEY = process.env.CARDHEDGE_API_KEY!

// ── Card Hedge: fetch prezzo FMV per una carta ──────────────────────────────
export async function fetchCardHedgePrice(
  externalId: string,
  gradeLabel: string = 'raw'
) {
  try {
    const res = await axios.get(`${CARDHEDGE_BASE}/cards/card-fmv`, {
      headers: { 'X-API-Key': CARDHEDGE_KEY },
      params: { card_id: externalId, grade_label: gradeLabel },
      timeout: 5000,
    })

    return {
      price: res.data.fmv as number,
      confidence: res.data.confidence_grade as string,
      source: 'cardhedge' as const,
    }
  } catch (err) {
    console.error('CardHedge API error:', err)
    return null
  }
}

// ── Card Hedge: storico vendite ─────────────────────────────────────────────
export async function fetchCardHedgeSalesHistory(
  externalId: string,
  gradeLabel: string = 'raw',
  limit: number = 50
) {
  try {
    const res = await axios.get(`${CARDHEDGE_BASE}/cards/sales-history`, {
      headers: { 'X-API-Key': CARDHEDGE_KEY },
      params: { card_id: externalId, grade_label: gradeLabel, limit },
      timeout: 8000,
    })

    return res.data.sales as Array<{
      price: number
      date: string
      platform: string
    }>
  } catch (err) {
    console.error('CardHedge sales history error:', err)
    return []
  }
}

// ── Salva prezzi nel DB e aggiorna price_history ────────────────────────────
export async function syncCardPrices(cardId: string) {
  const card = await prisma.card.findUnique({ where: { id: cardId } })
  if (!card?.externalId) return

  const grades = ['raw', 'PSA 9', 'PSA 10', 'BGS 9.5']

  for (const grade of grades) {
    const sales = await fetchCardHedgeSalesHistory(card.externalId, grade, 30)

    if (sales.length === 0) continue

    // Upsert storico in price_history
    const records = sales.map((s) => ({
      cardId,
      gradeLabel: grade,
      price: s.price,
      source: 'cardhedge',
      platform: s.platform,
      saleDate: new Date(s.date),
    }))

    // Bulk insert (ignora duplicati su saleDate + cardId + gradeLabel)
    await prisma.priceHistory.createMany({
      data: records,
      skipDuplicates: true,
    })
  }
}

// ── eBay Browse API: prezzi europei (gratuita) ──────────────────────────────
export async function fetchEbayPrices(query: string, marketId: string = 'EBAY_IT') {
  const EBAY_TOKEN = process.env.EBAY_ACCESS_TOKEN!

  try {
    const res = await axios.get('https://api.ebay.com/buy/browse/v1/item_summary/search', {
      headers: {
        Authorization: `Bearer ${EBAY_TOKEN}`,
        'X-EBAY-C-MARKETPLACE-ID': marketId,
        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=IT,zip=00100',
      },
      params: {
        q: query,
        filter: 'buyingOptions:{FIXED_PRICE},conditions:{USED}',
        sort: 'newlyListed',
        limit: 20,
      },
      timeout: 8000,
    })

    return res.data.itemSummaries ?? []
  } catch (err) {
    console.error('eBay API error:', err)
    return []
  }
}
