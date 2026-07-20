import { View, Text, StyleSheet } from 'react-native'
import { PricePoint } from '../types'

export function PrezzoChart({ points, gradeLabel }: { points: PricePoint[], gradeLabel: string }) {
  if (!points || points.length === 0) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyText}>Dati storici non disponibili</Text>
      </View>
    )
  }

  // Prendi il prezzo più recente per ogni grade
  const byGrade = new Map<string, number>()
  points.forEach(p => {
    if (!byGrade.has(p.gradeLabel)) {
      byGrade.set(p.gradeLabel, p.price)
    }
  })

  // Ordine logico dei grade
  const ORDER = ['raw', 'PSA 1', 'PSA 2', 'PSA 3', 'PSA 4', 'PSA 5', 'PSA 6', 'PSA 7', 'PSA 8', 'PSA 9', 'PSA 10',
    'BGS 1', 'BGS 2', 'BGS 3', 'BGS 4', 'BGS 5', 'BGS 6', 'BGS 7', 'BGS 8', 'BGS 9', 'BGS 9.5', 'BGS 10',
    'CGC 1', 'CGC 2', 'CGC 3', 'CGC 4', 'CGC 5', 'CGC 6', 'CGC 7', 'CGC 8', 'CGC 9', 'CGC 9.5', 'CGC 10',
    'GRAAD 1', 'GRAAD 2', 'GRAAD 3', 'GRAAD 4', 'GRAAD 5', 'GRAAD 6', 'GRAAD 7', 'GRAAD 8', 'GRAAD 9', 'GRAAD 9.5', 'GRAAD 10']

  const entries = ORDER
    .filter(g => byGrade.has(g))
    .map(g => ({ grade: g, price: byGrade.get(g)! }))

  if (entries.length === 0) return null

  const maxPrice = Math.max(...entries.map(e => e.price))
  const currentEntry = entries.find(e => e.grade === gradeLabel)

  return (
    <View>
      <View style={s.bars}>
        {entries.map((e) => {
          const isCurrent = e.grade === gradeLabel
          const barW = Math.max(4, (e.price / maxPrice) * 100)
          return (
            <View key={e.grade} style={s.row}>
              <Text style={[s.gradeLabel, isCurrent && s.gradeLabelActive]} numberOfLines={1}>
                {e.grade === 'raw' ? 'Raw' : e.grade}
              </Text>
              <View style={s.barWrap}>
                <View style={[s.bar, { width: `${barW}%`, backgroundColor: isCurrent ? '#534AB7' : '#D3D1C7' }]} />
              </View>
              <Text style={[s.price, isCurrent && s.priceActive]}>€{e.price.toLocaleString('it-IT')}</Text>
            </View>
          )
        })}
      </View>

      {currentEntry && (
        <View style={s.currentBadge}>
          <Text style={s.currentText}>Il tuo grade: <Text style={s.currentGrade}>{gradeLabel === 'raw' ? 'Raw' : gradeLabel}</Text> — €{currentEntry.price.toLocaleString('it-IT')}</Text>
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  empty: { height: 60, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#888780', fontSize: 13 },
  bars: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gradeLabel: { width: 64, fontSize: 11, color: '#888780', textAlign: 'right' },
  gradeLabelActive: { color: '#534AB7', fontWeight: '600' },
  barWrap: { flex: 1, height: 10, backgroundColor: '#F1EFE8', borderRadius: 5, overflow: 'hidden' },
  bar: { height: 10, borderRadius: 5 },
  price: { width: 64, fontSize: 11, color: '#888780', textAlign: 'right' },
  priceActive: { color: '#534AB7', fontWeight: '600' },
  currentBadge: { marginTop: 12, backgroundColor: '#EEEDFE', borderRadius: 8, padding: 10 },
  currentText: { fontSize: 12, color: '#534AB7' },
  currentGrade: { fontWeight: '600' },
})