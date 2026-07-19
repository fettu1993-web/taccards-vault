import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { UserCard } from '../stores/collectionStore'

interface Props {
  cards: UserCard[]
}

export function TopCardsRow({ cards }: Props) {
  const router = useRouter()

  if (cards.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nessuna carta ancora. Inizia scansionando la tua prima carta!</Text>
      </View>
    )
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {cards.map((uc) => {
        const latestPrice = uc.card.priceHistory?.[0]?.price ?? 0
        const roi = uc.purchasePrice && uc.purchasePrice > 0
          ? (((latestPrice - uc.purchasePrice) / uc.purchasePrice) * 100).toFixed(1)
          : null

        return (
          <TouchableOpacity
            key={uc.id}
            style={styles.card}
            onPress={() => router.push(`/card/${uc.id}`)}
          >
            {uc.card.imageUrl ? (
              <Image source={{ uri: uc.card.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>🃏</Text>
              </View>
            )}
            <Text style={styles.playerName} numberOfLines={1}>
              {uc.card.playerName ?? uc.card.name}
            </Text>
            <Text style={styles.setName} numberOfLines={1}>
              {uc.card.year} {uc.card.setName}
            </Text>
            <Text style={styles.price}>€{Number(latestPrice).toFixed(0)}</Text>
            {roi && (
              <Text style={[styles.roi, Number(roi) >= 0 ? styles.roiPos : styles.roiNeg]}>
                {Number(roi) >= 0 ? '+' : ''}{roi}%
              </Text>
            )}
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 130,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  image: { width: 106, height: 148, borderRadius: 6, marginBottom: 8 },
  imagePlaceholder: {
    width: 106,
    height: 148,
    borderRadius: 6,
    backgroundColor: '#F1EFE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePlaceholderText: { fontSize: 32 },
  playerName: { fontSize: 13, fontWeight: '500', color: '#2C2C2A' },
  setName: { fontSize: 11, color: '#888780', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '500', color: '#2C2C2A', marginTop: 6 },
  roi: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  roiPos: { color: '#3B6D11' },
  roiNeg: { color: '#A32D2D' },
})
