export interface Carta {
  id: string
  cardId: string
  player: string
  set: string
  grade: string
  buyPrice: number
  currentPrice: number
  sport: string
  categoria: string
  imageUrl: string | null
}

export const SPORT_MAP: Record<string, { label: string; emoji: string }> = {
  soccer: { label: 'Calcio', emoji: '⚽' },
  basketball: { label: 'Basket', emoji: '🏀' },
  f1: { label: 'F1', emoji: '🏎' },
  baseball: { label: 'Baseball', emoji: '⚾' },
  football: { label: 'Football', emoji: '🏈' },
  pokemon: { label: 'Pokémon', emoji: '⚡' },
  onepiece: { label: 'One Piece', emoji: '🏴‍☠️' },
}

export const SPORT_FILTER_MAP: Record<string, string> = {
  'Calcio': 'soccer',
  'Basket': 'basketball',
  'F1': 'f1',
  'Baseball': 'baseball',
  'Football': 'football',
}

export function mapUserCard(uc: any): Carta {
  const sportInfo = SPORT_MAP[uc.card.sport] ?? { label: uc.card.sport, emoji: '🃏' }
  const latestPrice = uc.card.priceHistory?.[0]?.price ?? 0
  let grade = 'Raw'
  if (uc.condition !== 'raw' && uc.gradeCompany) {
    grade = `${uc.gradeCompany.toUpperCase()} ${uc.gradeValue ?? ''}`.trim()
  }
  return {
    id: uc.id,
    cardId: uc.cardId,
    player: uc.card.playerName ?? uc.card.name,
    set: uc.card.setName,
    grade,
    buyPrice: Number(uc.purchasePrice ?? 0),
    currentPrice: Number(latestPrice),
    sport: sportInfo.emoji,
    categoria: sportInfo.label,
    imageUrl: uc.card.imageUrl ?? null,
  }
}

export function mapCatalogCard(card: any): Carta {
  const sportInfo = SPORT_MAP[card.sport] ?? { label: card.sport, emoji: '🃏' }
  const latestPrice = card.priceHistory?.[0]?.price ?? 0
  return {
    id: card.id,
    cardId: card.id,
    player: card.playerName ?? card.name,
    set: card.setName,
    grade: card.isRookie ? 'RC' : '',
    buyPrice: 0,
    currentPrice: Number(latestPrice),
    sport: sportInfo.emoji,
    categoria: sportInfo.label,
    imageUrl: card.imageUrl ?? null,
  }
}