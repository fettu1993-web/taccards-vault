export interface PricePoint {
  date: string
  price: number
  gradeLabel: string
}

export interface Carta {
  id: string
  cardId: string
  player: string
  set: string
  parallel: string | null
  grade: string
  buyPrice: number
  currentPrice: number
  sport: string
  categoria: string
  imageUrl: string | null
  priceHistory: PricePoint[]
}

export const SPORT_MAP: Record<string, { label: string; emoji: string }> = {
  soccer: { label: 'Calcio', emoji: '⚽' },
  basketball: { label: 'Basket', emoji: '🏀' },
  f1: { label: 'F1', emoji: '🏎' },
  baseball: { label: 'Baseball', emoji: '⚾' },
  football: { label: 'Football', emoji: '🏈' },
  pokemon: { label: 'Pokémon', emoji: '⚡' },
  onepiece: { label: 'One Piece', emoji: '🏴‍☠️' },
  tennis: { label: 'Tennis', emoji: '🎾' },
}

export const SPORT_FILTER_MAP: Record<string, string> = {
  'Calcio': 'soccer',
  'Basket': 'basketball',
  'F1': 'f1',
  'Baseball': 'baseball',
  'Football': 'football',
  'Tennis': 'tennis',
}

function buildGradeLabel(condition: string, gradeCompany: string | null, gradeValue: string | null): string {
  if (condition === 'raw' || !gradeCompany) return 'raw'
  return `${gradeCompany.toUpperCase()} ${gradeValue ?? ''}`.trim()
}

export function mapUserCard(uc: any): Carta {
  const sportInfo = SPORT_MAP[uc.card.sport] ?? { label: uc.card.sport, emoji: '🃏' }
  const gradeLabel = buildGradeLabel(uc.condition, uc.gradeCompany, uc.gradeValue)
  const priceHistory = uc.card.priceHistory ?? []
  const gradePrice = priceHistory.find((p: any) => p.gradeLabel === gradeLabel)
  const rawPrice = priceHistory.find((p: any) => p.gradeLabel === 'raw')
  const latestPrice = gradePrice?.price ?? rawPrice?.price ?? 0

  let grade = 'Raw'
  if (uc.condition !== 'raw' && uc.gradeCompany) {
    grade = `${uc.gradeCompany.toUpperCase()} ${uc.gradeValue ?? ''}`.trim()
  }

  return {
    id: uc.id,
    cardId: uc.cardId,
    player: uc.card.playerName ?? uc.card.name,
    set: uc.card.setName,
    parallel: uc.card.parallel ?? null,
    grade,
    buyPrice: Number(uc.purchasePrice ?? 0),
    currentPrice: Number(latestPrice),
    sport: sportInfo.emoji,
    categoria: sportInfo.label,
    imageUrl: uc.card.imageUrl ?? null,
    priceHistory: priceHistory.map((p: any) => ({
      date: p.saleDate ?? p.date ?? p.createdAt ?? '',
      price: Number(p.price),
      gradeLabel: p.gradeLabel,
    })),
  }
}

export function mapCatalogCard(card: any): Carta {
  const sportInfo = SPORT_MAP[card.sport] ?? { label: card.sport, emoji: '🃏' }
  const priceHistory = card.priceHistory ?? []
  const rawPrice = priceHistory.find((p: any) => p.gradeLabel === 'raw')
  const latestPrice = rawPrice?.price ?? priceHistory[0]?.price ?? 0
  return {
    id: card.id,
    cardId: card.id,
    player: card.playerName ?? card.name,
    set: card.setName,
    parallel: card.parallel ?? null,
    grade: card.isRookie ? 'RC' : '',
    buyPrice: 0,
    currentPrice: Number(latestPrice),
    sport: sportInfo.emoji,
    categoria: sportInfo.label,
    imageUrl: card.imageUrl ?? null,
    priceHistory: [],
  }
}