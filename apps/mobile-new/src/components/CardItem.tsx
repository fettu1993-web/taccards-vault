import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { Carta } from '../types'

export function CardItem({ card, onRimuovi, onPress }: {
  card: Carta
  onRimuovi?: (id: string) => void
  onPress?: (carta: Carta) => void
}) {
  const cardRoi = card.buyPrice > 0
    ? (((card.currentPrice - card.buyPrice) / card.buyPrice) * 100).toFixed(1)
    : null
  const cardRoiPos = cardRoi ? Number(cardRoi) >= 0 : true

  return (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => onPress?.(card)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {card.imageUrl ? (
        <Image source={{ uri: card.imageUrl }} style={styles.cardImage} resizeMode="contain" />
      ) : (
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{card.sport}</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardPlayer}>{card.player}</Text>
        <Text style={styles.cardSet}>{card.set}</Text>
        {card.parallel ? (
          <Text style={styles.cardParallel}>✨ {card.parallel}</Text>
        ) : null}
        {card.grade ? <Text style={styles.cardGrade}>{card.grade}</Text> : null}
      </View>
      <View style={styles.cardPrices}>
        <Text style={styles.cardCurrentPrice}>€{card.currentPrice}</Text>
        {cardRoi !== null && (
          <Text style={[styles.cardRoi, cardRoiPos ? styles.roiTextPos : styles.roiTextNeg]}>
            {cardRoiPos ? '+' : ''}{cardRoi}%
          </Text>
        )}
        {onRimuovi && (
          <TouchableOpacity onPress={() => Alert.alert('Rimuovi carta', `Rimuovere ${card.player}?`, [
            { text: 'Annulla', style: 'cancel' },
            { text: 'Rimuovi', style: 'destructive', onPress: () => onRimuovi(card.id) }
          ])}>
            <Text style={styles.deleteBtn}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 44, height: 60, borderRadius: 4, marginRight: 12, backgroundColor: '#F1EFE8' },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardPlayer: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  cardSet: { fontSize: 12, color: '#888780', marginTop: 2 },
  cardParallel: { fontSize: 11, color: '#B8860B', marginTop: 3, fontWeight: '600' },
  cardGrade: { fontSize: 11, color: '#534AB7', marginTop: 3, fontWeight: '500' },
  cardPrices: { alignItems: 'flex-end' },
  cardCurrentPrice: { fontSize: 16, fontWeight: '500', color: '#2C2C2A' },
  cardRoi: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  roiTextPos: { color: '#3B6D11' },
  roiTextNeg: { color: '#A32D2D' },
  deleteBtn: { fontSize: 14, marginTop: 4 },
})