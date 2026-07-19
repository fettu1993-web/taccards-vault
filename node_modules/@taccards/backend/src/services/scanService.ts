import axios from 'axios'
import { prisma } from '../lib/prisma'

const CARDSIGHT_BASE = 'https://api.cardsight.ai/v1'
const CARDSIGHT_KEY = process.env.CARDSIGHT_API_KEY!

export interface ScanResult {
  cardId: string | null
  card: any | null
  confidence: number
  provider: 'cardsight' | 'manual_search'
  rawResponse?: any
}

// ── Identifica carta da immagine base64 ─────────────────────────────────────
export async function identifyCardFromImage(
  imageBase64: string,
  userId: string
): Promise<ScanResult> {

  // 1. Prova CardSight AI
  try {
    const res = await axios.post(
      `${CARDSIGHT_BASE}/identify`,
      { image: imageBase64, include_pricing: false },
      {
        headers: {
          Authorization: `Bearer ${CARDSIGHT_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    )

    const match = res.data?.matches?.[0]
    if (match && match.confidence > 0.75) {
      // Cerca nel nostro DB per external_id
      const card = await prisma.card.findFirst({
        where: { externalId: match.card_id },
      })

      // Log della scansione
      await prisma.scanLog.create({
        data: {
          userId,
          matchedCardId: card?.id ?? null,
          apiProvider: 'cardsight',
          confidenceScore: match.confidence,
          wasConfirmed: false,
        },
      })

      return {
        cardId: card?.id ?? null,
        card,
        confidence: match.confidence,
        provider: 'cardsight',
        rawResponse: match,
      }
    }
  } catch (err) {
    console.error('CardSight AI error:', err)
  }

  // 2. Fallback: restituisce suggerimento di ricerca manuale
  await prisma.scanLog.create({
    data: {
      userId,
      matchedCardId: null,
      apiProvider: 'manual_search',
      confidenceScore: 0,
      wasConfirmed: false,
    },
  })

  return {
    cardId: null,
    card: null,
    confidence: 0,
    provider: 'manual_search',
  }
}

// ── Conferma match (utente approva o corregge) ───────────────────────────────
export async function confirmScan(scanLogId: string, confirmedCardId: string) {
  await prisma.scanLog.update({
    where: { id: scanLogId },
    data: {
      matchedCardId: confirmedCardId,
      wasConfirmed: true,
    },
  })
}
