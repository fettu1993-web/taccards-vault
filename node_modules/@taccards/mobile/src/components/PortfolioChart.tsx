import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const { width } = Dimensions.get('window')

interface PricePoint {
  saleDate: string
  _avg: { price: number }
}

async function fetchPortfolioHistory(): Promise<PricePoint[]> {
  const res = await api.get('/collection/portfolio-history', {
    params: { days: 90 },
  })
  return res.data.data ?? []
}

export function PortfolioChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio-history'],
    queryFn: fetchPortfolioHistory,
  })

  if (isLoading) {
    return <View style={[styles.container, styles.placeholder]} />
  }

  if (!data || data.length < 2) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>
          Aggiungi carte alla collezione per vedere l'andamento del tuo portfolio
        </Text>
      </View>
    )
  }

  // Formatta dati per il grafico
  const chartData = data.map((p) => ({
    x: new Date(p.saleDate).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' }),
    y: Number(p._avg?.price ?? 0),
  }))

  const maxY = Math.max(...chartData.map((d) => d.y))
  const minY = Math.min(...chartData.map((d) => d.y))

  // Grafico SVG semplice — sostituire con Victory Native dopo npm install
  return (
    <View style={styles.container}>
      <Text style={styles.chartPlaceholder}>
        📈 Grafico attivo dopo npm install (Victory Native)
      </Text>
      <Text style={styles.chartInfo}>
        Min: €{minY.toFixed(0)} · Max: €{maxY.toFixed(0)}
      </Text>
      {/* 
        Dopo npm install, sostituire con:
        <CartesianChart data={chartData} xKey="x" yKeys={["y"]}>
          {({ points }) => (
            <Line points={points.y} color="#7F77DD" strokeWidth={2} />
          )}
        </CartesianChart>
      */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  placeholder: {
    backgroundColor: '#F1EFE8',
  },
  empty: {
    padding: 24,
  },
  emptyText: {
    color: '#888780',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  chartPlaceholder: {
    fontSize: 16,
    color: '#7F77DD',
    marginBottom: 8,
  },
  chartInfo: {
    fontSize: 12,
    color: '#888780',
  },
})
