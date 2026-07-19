import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Carta } from '../types'
import { CardItem } from '../components/CardItem'
import { PriceChart } from '../components/PriceChart'

export function CollezioneScreen({ carte, onRimuovi, loading }: {
  carte: Carta[]
  onRimuovi: (id: string) => void
  loading: boolean
}) {
  const [filtroAttivo, setFiltroAttivo] = useState('Tutte')

  const carteFiltrate = filtroAttivo === 'Tutte'
    ? carte
    : carte.filter(c => c.categoria === filtroAttivo)

  const totalCost = carte.reduce((s, c) => s + c.buyPrice, 0)
  const totalValue = carte.reduce((s, c) => s + c.currentPrice, 0)
  const roi = totalCost > 0 ? (((totalValue - totalCost) / totalCost) * 100).toFixed(1) : '0.0'
  const roiPositive = Number(roi) >= 0

  const categoriePresenti = ['Tutte', ...Array.from(new Set(carte.map(c => c.categoria)))]

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>La mia collezione</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Valore totale</Text>
            <Text style={styles.summaryValue}>€{totalValue.toLocaleString('it-IT')}</Text>
          </View>
          <View style={[styles.roiBadge, roiPositive ? styles.roiPos : styles.roiNeg]}>
            <Text style={[styles.roiText, roiPositive ? styles.roiTextPos : styles.roiTextNeg]}>
              {roiPositive ? '+' : ''}{roi}%
            </Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Investito</Text><Text style={styles.summaryStatValue}>€{totalCost}</Text></View>
          <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Guadagno</Text><Text style={[styles.summaryStatValue, roiPositive ? styles.roiTextPos : styles.roiTextNeg]}>{roiPositive ? '+' : ''}€{totalValue - totalCost}</Text></View>
          <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Carte</Text><Text style={styles.summaryStatValue}>{carte.length}</Text></View>
        </View>
      </View>

      <PriceChart totalValue={totalValue} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtriScroll}>
        {categoriePresenti.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtroBtn, filtroAttivo === cat && styles.filtroBtnAttivo]}
            onPress={() => setFiltroAttivo(cat)}
          >
            <Text style={[styles.filtroText, filtroAttivo === cat && styles.filtroTextAttivo]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        {filtroAttivo === 'Tutte' ? 'Tutte le carte' : filtroAttivo} ({carteFiltrate.length})
      </Text>

      {loading && <ActivityIndicator color="#534AB7" style={{ marginTop: 20 }} />}

      {!loading && carteFiltrate.length === 0 && (
        <Text style={styles.emptyText}>
          {carte.length === 0
            ? 'Nessuna carta nella collezione.\nVai su Cerca per aggiungere le tue carte!'
            : 'Nessuna carta in questa categoria.'}
        </Text>
      )}

      {carteFiltrate.map((card) => (
        <CardItem key={card.id} card={card} onRimuovi={onRimuovi} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  screenContent: { padding: 20, paddingBottom: 40 },
  screenTitle: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginTop: 40, marginBottom: 20 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#888780', marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: '500', color: '#2C2C2A' },
  summaryDivider: { height: 0.5, backgroundColor: '#D3D1C7', marginVertical: 16 },
  summaryStat: { alignItems: 'center' },
  summaryStatLabel: { fontSize: 12, color: '#888780', marginBottom: 2 },
  summaryStatValue: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  roiBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  roiPos: { backgroundColor: '#EAF3DE' },
  roiNeg: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 14, fontWeight: '500' },
  roiTextPos: { color: '#3B6D11' },
  roiTextNeg: { color: '#A32D2D' },
  sectionTitle: { fontSize: 16, fontWeight: '500', color: '#444441', marginBottom: 12 },
  filtriScroll: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 0.5, borderColor: '#D3D1C7' },
  filtroBtnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  filtroText: { fontSize: 13, color: '#888780' },
  filtroTextAttivo: { color: '#fff', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#888780', marginTop: 40, fontSize: 15 },
})