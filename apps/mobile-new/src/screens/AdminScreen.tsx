import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { apiFetch } from '../lib/api'

interface CardRequest {
  id: string
  player_name: string
  set_name: string
  sport: string
  parallel: string | null
  notes: string | null
  status: 'pending' | 'added' | 'rejected'
  created_at: string
  user_email: string
}

const STATUS_LABELS: Record<string, { label: string, color: string, bg: string }> = {
  pending:  { label: 'In attesa', color: '#B8860B', bg: '#FFF8E1' },
  added:    { label: 'Aggiunta',  color: '#3B6D11', bg: '#EAF3DE' },
  rejected: { label: 'Rifiutata', color: '#A32D2D', bg: '#FCEBEB' },
}

const SPORT_EMOJI: Record<string, string> = {
  soccer: '⚽', basketball: '🏀', f1: '🏎', tennis: '🎾', baseball: '⚾', football: '🏈',
}

export function AdminScreen({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<CardRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'all' | 'pending' | 'added' | 'rejected'>('pending')
  const [aggiornando, setAggiornando] = useState<string | null>(null)

  useEffect(() => { loadRequests() }, [])

  async function loadRequests() {
    setLoading(true)
    try {
      const res = await apiFetch('/card-requests/admin')
      setRequests(res.data)
    } catch (e) {
      console.error('Errore caricamento richieste:', e)
    }
    setLoading(false)
  }

  async function aggiornaStatus(id: string, status: string) {
    setAggiornando(id)
    try {
      await apiFetch(`/card-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r))
    } catch (e) {
      console.error('Errore aggiornamento:', e)
    }
    setAggiornando(null)
  }

  const filtered = filtro === 'all' ? requests : requests.filter(r => r.status === filtro)
  const counts = {
    pending: requests.filter(r => r.status === 'pending').length,
    added: requests.filter(r => r.status === 'added').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <TouchableOpacity style={s.backBtn} onPress={onBack}>
        <Text style={s.backText}>← Profilo</Text>
      </TouchableOpacity>

      <Text style={s.title}>Admin — Richieste carte</Text>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{counts.pending}</Text>
          <Text style={s.statLabel}>In attesa</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#3B6D11' }]}>{counts.added}</Text>
          <Text style={s.statLabel}>Aggiunte</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#A32D2D' }]}>{counts.rejected}</Text>
          <Text style={s.statLabel}>Rifiutate</Text>
        </View>
      </View>

      {/* Filtri */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtriScroll}>
        {(['pending', 'all', 'added', 'rejected'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[s.filtroBtn, filtro === f && s.filtroBtnAttivo]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[s.filtroText, filtro === f && s.filtroTextAttivo]}>
              {f === 'all' ? 'Tutte' : STATUS_LABELS[f].label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading && <ActivityIndicator color="#534AB7" style={{ marginTop: 40 }} />}

      {!loading && filtered.length === 0 && (
        <Text style={s.emptyText}>Nessuna richiesta in questa categoria</Text>
      )}

      {!loading && filtered.map(r => (
        <View key={r.id} style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardHeaderLeft}>
              <Text style={s.sportEmoji}>{SPORT_EMOJI[r.sport] ?? '🃏'}</Text>
              <View>
                <Text style={s.playerName}>{r.player_name}</Text>
                <Text style={s.setName}>{r.set_name}</Text>
              </View>
            </View>
            <View style={[s.statusBadge, { backgroundColor: STATUS_LABELS[r.status].bg }]}>
              <Text style={[s.statusText, { color: STATUS_LABELS[r.status].color }]}>
                {STATUS_LABELS[r.status].label}
              </Text>
            </View>
          </View>

          {(r.parallel || r.notes) && (
            <View style={s.cardMeta}>
              {r.parallel && <Text style={s.metaText}>✨ {r.parallel}</Text>}
              {r.notes && <Text style={s.metaText}>📝 {r.notes}</Text>}
            </View>
          )}

          <View style={s.cardFooter}>
            <Text style={s.userEmail}>{r.user_email}</Text>
            <Text style={s.cardDate}>
              {new Date(r.created_at).toLocaleDateString('it-IT')}
            </Text>
          </View>

          {r.status === 'pending' && (
            <View style={s.actions}>
              <TouchableOpacity
                style={[s.actionBtn, s.actionAdd]}
                onPress={() => aggiornaStatus(r.id, 'added')}
                disabled={aggiornando === r.id}
              >
                {aggiornando === r.id
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.actionBtnText}>✓ Aggiunta</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, s.actionReject]}
                onPress={() => aggiornaStatus(r.id, 'rejected')}
                disabled={aggiornando === r.id}
              >
                <Text style={[s.actionBtnText, { color: '#A32D2D' }]}>✕ Rifiuta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  backBtn: { marginTop: 52, marginBottom: 20 },
  backText: { fontSize: 15, color: '#534AB7', fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7' },
  statNum: { fontSize: 28, fontWeight: '700', color: '#534AB7' },
  statLabel: { fontSize: 11, color: '#888780', marginTop: 4 },
  filtriScroll: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 0.5, borderColor: '#D3D1C7' },
  filtroBtnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  filtroText: { fontSize: 13, color: '#888780' },
  filtroTextAttivo: { color: '#fff', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#888780', marginTop: 40, fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardHeaderLeft: { flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1 },
  sportEmoji: { fontSize: 24 },
  playerName: { fontSize: 15, fontWeight: '600', color: '#2C2C2A' },
  setName: { fontSize: 12, color: '#888780', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cardMeta: { backgroundColor: '#F1EFE8', borderRadius: 8, padding: 10, marginBottom: 8, gap: 4 },
  metaText: { fontSize: 12, color: '#888780' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userEmail: { fontSize: 11, color: '#888780' },
  cardDate: { fontSize: 11, color: '#888780' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  actionAdd: { backgroundColor: '#534AB7' },
  actionReject: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D3D1C7' },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
})