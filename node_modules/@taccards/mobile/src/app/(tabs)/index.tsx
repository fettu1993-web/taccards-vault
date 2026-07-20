import { useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useCollectionStore } from '../../stores/collectionStore'
import { PortfolioChart } from '../../components/PortfolioChart'
import { SummaryCard } from '../../components/SummaryCard'
import { TopCardsRow } from '../../components/TopCardsRow'

export default function PortfolioScreen() {
  const { cards, summary, loading, fetchCollection } = useCollectionStore()

  useEffect(() => {
    fetchCollection()
  }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7F77DD" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Il tuo portfolio</Text>

      {/* Card riassuntiva ROI */}
      {summary && (
        <SummaryCard
          totalValue={summary.totalValue}
          totalCost={summary.totalCost}
          roi={summary.roi}
          totalCards={summary.totalCards}
        />
      )}

      {/* Grafico andamento valore */}
      <Text style={styles.sectionTitle}>Andamento valore</Text>
      <PortfolioChart />

      {/* Top carte per valore */}
      <Text style={styles.sectionTitle}>Le tue migliori carte</Text>
      <TopCardsRow cards={cards.slice(0, 5)} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 16, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 16,
    marginTop: 56,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444441',
    marginTop: 24,
    marginBottom: 12,
  },
})
