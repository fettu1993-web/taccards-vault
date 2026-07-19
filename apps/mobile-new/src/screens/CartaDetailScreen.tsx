import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { Carta } from '../types'

export function CartaDetailScreen({ carta, onBack, onRimuovi }: {
  carta: Carta
  onBack: () => void
  onRimuovi?: (id: string) => void
}) {
  const roi = carta.buyPrice > 0
    ? (((carta.currentPrice - carta.buyPrice) / carta.buyPrice) * 100).toFixed(1)
    : null
  const roiPos = roi ? Number(roi) >= 0 : true
  const guadagno = carta.currentPrice - carta.buyPrice

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header con back */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Collezione</Text>
      </TouchableOpacity>

      {/* Hero carta */}
      <View style={styles.heroCard}>
        {carta.imageUrl ? (
          <Image
            source={{ uri: carta.imageUrl }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.heroEmoji}>{carta.sport}</Text>
        )}
        <Text style={styles.heroPlayer}>{carta.player}</Text>
        <Text style={styles.heroSet}>{carta.set}</Text>
        {carta.grade ? (
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>{carta.grade}</Text>
          </View>
        ) : null}
      </View>

      {/* Valore e ROI */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VALORE</Text>
        <View style={styles.valoreRow}>
          <View>
            <Text style={styles.valoreLabel}>Valore attuale</Text>
            <Text style={styles.valoreNum}>€{carta.currentPrice.toLocaleString('it-IT')}</Text>
          </View>
          {roi !== null && (
            <View style={[styles.roiBadge, roiPos ? styles.roiPos : styles.roiNeg]}>
              <Text style={[styles.roiText, roiPos ? styles.roiTextPos : styles.roiTextNeg]}>
                {roiPos ? '+' : ''}{roi}%
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Dettagli investimento */}
      {carta.buyPrice > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVESTIMENTO</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Prezzo acquisto</Text>
              <Text style={styles.detailValue}>€{carta.buyPrice.toLocaleString('it-IT')}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Guadagno</Text>
              <Text style={[styles.detailValue, roiPos ? styles.roiTextPos : styles.roiTextNeg]}>
                {roiPos ? '+' : ''}€{guadagno.toLocaleString('it-IT')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Info carta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETTAGLI</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Categoria</Text>
          <Text style={styles.infoValue}>{carta.categoria}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Set</Text>
          <Text style={styles.infoValue}>{carta.set}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Condizione</Text>
          <Text style={styles.infoValue}>{carta.grade || 'Raw'}</Text>
        </View>
      </View>

      {/* Pulsante rimuovi */}
      {onRimuovi && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() =>
            Alert.alert('Rimuovi carta', `Rimuovere ${carta.player} dalla collezione?`, [
              { text: 'Annulla', style: 'cancel' },
              { text: 'Rimuovi', style: 'destructive', onPress: () => onRimuovi(carta.id) },
            ])
          }
        >
          <Text style={styles.removeBtnText}>🗑 Rimuovi dalla collezione</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  backBtn: { marginTop: 52, marginBottom: 20 },
  backText: { fontSize: 15, color: '#534AB7', fontWeight: '500' },
  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16 },
  heroImage: { width: 160, height: 220, borderRadius: 8, marginBottom: 16 },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroPlayer: { fontSize: 22, fontWeight: '600', color: '#2C2C2A', textAlign: 'center', marginBottom: 6 },
  heroSet: { fontSize: 14, color: '#888780', textAlign: 'center' },
  gradeBadge: { marginTop: 12, backgroundColor: '#EEEDFE', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  gradeText: { color: '#534AB7', fontSize: 13, fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 18, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  sectionTitle: { fontSize: 11, color: '#888780', fontWeight: '600', marginBottom: 14, letterSpacing: 0.8 },
  valoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valoreLabel: { fontSize: 13, color: '#888780', marginBottom: 4 },
  valoreNum: { fontSize: 32, fontWeight: '600', color: '#2C2C2A' },
  roiBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  roiPos: { backgroundColor: '#EAF3DE' },
  roiNeg: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 15, fontWeight: '600' },
  roiTextPos: { color: '#3B6D11' },
  roiTextNeg: { color: '#A32D2D' },
  detailGrid: { flexDirection: 'row', gap: 12 },
  detailCell: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 14 },
  detailLabel: { fontSize: 12, color: '#888780', marginBottom: 4 },
  detailValue: { fontSize: 18, fontWeight: '600', color: '#2C2C2A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#F1EFE8' },
  infoLabel: { fontSize: 14, color: '#888780' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  removeBtn: { marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FCEBEB', backgroundColor: '#fff', alignItems: 'center' },
  removeBtnText: { color: '#A32D2D', fontSize: 15, fontWeight: '500' },
})