import { useState, useEffect, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { apiFetch } from '../lib/api'

interface WatchlistItem {
  id: string
  cardId: string
  targetPrice: string | number | null
  card: {
    playerName: string
    setName: string
    parallel: string | null
    priceHistory: { price: string | number }[]
  }
}

export function WatchlistScreen({ onToast }: { onToast: (text: string, type: 'success' | 'error') => void }) {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchWatchlist() {
    try {
      const res = await apiFetch('/watchlist')
      setItems(Array.isArray(res) ? res : res.data ?? [])
    } catch (e: any) {
      onToast('Errore caricamento watchlist', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchWatchlist() }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchWatchlist()
  }, [])

  async function handleRimuovi(id: string) {
    try {
      await apiFetch(`/watchlist/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(i => i.id !== id))
      onToast('Rimosso dalla watchlist', 'success')
    } catch (e: any) {
      onToast('Errore rimozione', 'error')
    }
  }

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color="#534AB7" />
      </View>
    )
  }

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#534AB7" />}
    >
      <Text style={s.title}>Watchlist</Text>

      {items.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyIcon}>👁️</Text>
          <Text style={s.emptyTitle}>Nessuna carta monitorata</Text>
          <Text style={s.emptyText}>Aggiungi carte alla watchlist dalla schermata di dettaglio per monitorarne il prezzo.</Text>
        </View>
      ) : (
        items.map(item => {
          const currentPrice = item.card.priceHistory?.[0]?.price != null
            ? parseFloat(item.card.priceHistory[0].price as any)
            : null
          const targetPrice = item.targetPrice != null ? parseFloat(item.targetPrice as any) : null
          const diff = currentPrice != null && targetPrice != null
            ? currentPrice - targetPrice
            : null
          const reached = diff != null && diff >= 0

          return (
            <View key={item.id} style={s.card}>
              <View style={s.cardHeader}>
                <View style={s.cardInfo}>
                  <Text style={s.player}>{item.card.playerName}</Text>
                  <Text style={s.set}>{item.card.setName}{item.card.parallel ? ` · ${item.card.parallel}` : ''}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRimuovi(item.id)} style={s.removeBtn}>
                  <Text style={s.removeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={s.priceRow}>
                <View style={s.priceBox}>
                  <Text style={s.priceLabel}>Prezzo attuale</Text>
                  <Text style={s.priceValue}>
                    {currentPrice != null ? `€${currentPrice.toLocaleString('it-IT')}` : '—'}
                  </Text>
                </View>
                <View style={s.priceBox}>
                  <Text style={s.priceLabel}>Target</Text>
                  <Text style={s.priceValue}>
                    {targetPrice != null ? `€${targetPrice.toLocaleString('it-IT')}` : '—'}
                  </Text>
                </View>
              </View>
              {diff != null && (
                <View style={[s.diffBox, reached ? s.diffPos : s.diffNeg]}>
                  <Text style={[s.diffText, reached ? s.textPos : s.textNeg]}>
                    {reached ? '🎯 Target raggiunto!' : `Manca €${Math.abs(diff).toLocaleString('it-IT')}`}
                  </Text>
                </View>
              )}
            </View>
          )
        })
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1EFE8' },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginTop: 52, marginBottom: 24 },
  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#2C2C2A', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#888780', textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: '#D3D1C7' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardInfo: { flex: 1 },
  player: { fontSize: 16, fontWeight: '600', color: '#2C2C2A', marginBottom: 2 },
  set: { fontSize: 13, color: '#888780' },
  removeBtn: { padding: 4 },
  removeText: { fontSize: 16, color: '#888780' },
  priceRow: { flexDirection: 'row', gap: 8 },
  priceBox: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 8, padding: 10 },
  priceLabel: { fontSize: 11, color: '#888780', marginBottom: 4 },
  priceValue: { fontSize: 15, fontWeight: '600', color: '#2C2C2A' },
  diffBox: { marginTop: 8, borderRadius: 8, padding: 10, alignItems: 'center' },
  diffPos: { backgroundColor: '#EAF3DE' },
  diffNeg: { backgroundColor: '#FCEBEB' },
  diffText: { fontSize: 13, fontWeight: '500' },
  textPos: { color: '#3B6D11' },
  textNeg: { color: '#A32D2D' },
})