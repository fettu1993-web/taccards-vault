import { View, Text, StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')
const CHART_WIDTH = Math.min(width - 40, 800)
const CHART_HEIGHT = 120

export function PriceChart({ totalValue }: { totalValue: number }) {
  const chartData = [
    { label: 'Gen', value: 380 },
    { label: 'Feb', value: 410 },
    { label: 'Mar', value: 395 },
    { label: 'Apr', value: 440 },
    { label: 'Mag', value: 420 },
    { label: 'Giu', value: 490 },
    { label: 'Lug', value: totalValue || 0 },
  ]
  const maxVal = Math.max(...chartData.map(d => d.value))
  const minVal = Math.min(...chartData.map(d => d.value))
  const range = maxVal - minVal || 1
  const padX = 10
  const stepX = (CHART_WIDTH - padX * 2) / (chartData.length - 1)
  const points = chartData.map((d, i) => ({
    x: padX + i * stepX,
    y: CHART_HEIGHT - 20 - ((d.value - minVal) / range) * (CHART_HEIGHT - 40),
    label: d.label,
    value: d.value,
  }))
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
  const area = `${points[0].x},${CHART_HEIGHT - 20} ` + points.map(p => `${p.x},${p.y}`).join(' ') + ` ${points[points.length - 1].x},${CHART_HEIGHT - 20}`

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Andamento collezione</Text>
      <Text style={styles.period}>Ultimi 7 mesi</Text>
      <svg width={CHART_WIDTH} height={CHART_HEIGHT} style={{ display: 'block' }}>
        <polygon points={area} fill="#534AB7" fillOpacity={0.08} />
        <polyline points={polyline} fill="none" stroke="#534AB7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? '#534AB7' : '#fff'} stroke="#534AB7" strokeWidth={2} />
        ))}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={CHART_HEIGHT - 4} textAnchor="middle" fontSize={10} fill="#888780">{p.label}</text>
        ))}
        <text x={points[points.length - 1].x} y={points[points.length - 1].y - 10}
          textAnchor="middle" fontSize={11} fill="#534AB7" fontWeight="bold">€{points[points.length - 1].value}</text>
      </svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 24 },
  title: { fontSize: 14, fontWeight: '500', color: '#2C2C2A', marginBottom: 2 },
  period: { fontSize: 12, color: '#888780', marginBottom: 12 },
})