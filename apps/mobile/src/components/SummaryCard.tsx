import { View, Text, StyleSheet } from 'react-native'

interface Props {
  totalValue: string
  totalCost: string
  roi: string
  totalCards: number
}

export function SummaryCard({ totalValue, totalCost, roi, totalCards }: Props) {
  const roiNum = parseFloat(roi)
  const roiPositive = roiNum >= 0

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <View>
          <Text style={styles.label}>Valore totale</Text>
          <Text style={styles.valueMain}>€{Number(totalValue).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={[styles.roiBadge, roiPositive ? styles.roiPositive : styles.roiNegative]}>
          <Text style={[styles.roiText, roiPositive ? styles.roiTextPositive : styles.roiTextNegative]}>
            {roiPositive ? '+' : ''}{roi}%
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Investito</Text>
          <Text style={styles.statValue}>€{Number(totalCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Guadagno</Text>
          <Text style={[styles.statValue, roiPositive ? styles.roiTextPositive : styles.roiTextNegative]}>
            {roiPositive ? '+' : ''}€{(Number(totalValue) - Number(totalCost)).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Carte</Text>
          <Text style={styles.statValue}>{totalCards}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: { fontSize: 13, color: '#888780', marginBottom: 4 },
  valueMain: { fontSize: 28, fontWeight: '500', color: '#2C2C2A' },
  roiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roiPositive: { backgroundColor: '#EAF3DE' },
  roiNegative: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 14, fontWeight: '500' },
  roiTextPositive: { color: '#3B6D11' },
  roiTextNegative: { color: '#A32D2D' },
  divider: { height: 0.5, backgroundColor: '#D3D1C7', marginVertical: 16 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888780', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
})
