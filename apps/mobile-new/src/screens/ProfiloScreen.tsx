import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native'
import { Carta } from '../types'
import { useIsPremium } from '../lib/useIsPremium'
import { apiFetch } from '../lib/api'

interface ProfiloScreenProps {
  user: any
  onLogout: () => void
  carte: Carta[]
  onAdmin?: () => void
  onToast: (text: string, type: 'success' | 'error') => void
}

export function ProfiloScreen({ user, onLogout, carte, onAdmin, onToast }: ProfiloScreenProps) {
  const { isPremium, loading } = useIsPremium()
  const [loadingCheckout, setLoadingCheckout] = useState(false)

  const totalValore = carte.reduce((sum, c) => sum + c.currentPrice, 0)
  const totalInvestito = carte.reduce((sum, c) => sum + c.buyPrice, 0)
  const guadagno = totalValore - totalInvestito
  const roiPerc = totalInvestito > 0 ? ((guadagno / totalInvestito) * 100).toFixed(1) : null
  const roiPos = guadagno >= 0

  async function handleUpgrade() {
    setLoadingCheckout(true)
    try {
      const res = await apiFetch('/stripe/create-checkout', { method: 'POST' })
      if (res.url) {
        Linking.openURL(res.url)
      }
    } catch (e: any) {
      onToast('Errore durante il checkout. Riprova.', 'error')
    }
    setLoadingCheckout(false)
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.title}>Profilo</Text>

      <View style={s.avatarWrap}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user?.email?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={s.email}>{user?.email}</Text>
        {!loading && (
          <View style={[s.badge, isPremium ? s.badgePremium : s.badgeFree]}>
            <Text style={[s.badgeText, isPremium ? s.badgePremiumText : s.badgeFreeText]}>
              {isPremium ? '⭐ Premium' : 'Piano Free'}
            </Text>
          </View>
        )}
      </View>

      {/* Banner upgrade */}
      {!loading && !isPremium && (
        <TouchableOpacity style={s.upgradeCard} onPress={handleUpgrade} disabled={loadingCheckout}>
          <Text style={s.upgradeTitle}>🚀 Passa a Premium</Text>
          <Text style={s.upgradeDesc}>Collezione illimitata · Storico prezzi · ROI · Watchlist illimitata · Scanner</Text>
          <View style={s.upgradeBtn}>
            {loadingCheckout
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.upgradeBtnText}>Abbonati a €9,99/mese →</Text>
            }
          </View>
        </TouchableOpacity>
      )}

      <View style={s.section}>
        <Text style={s.sectionTitle}>PORTFOLIO</Text>
        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Carte</Text>
            <Text style={s.statNum}>{carte.length}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Valore totale</Text>
            <Text style={s.statNum}>€{totalValore.toLocaleString('it-IT')}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Investito</Text>
            <Text style={s.statNum}>€{totalInvestito.toLocaleString('it-IT')}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Guadagno</Text>
            <Text style={[s.statNum, roiPos ? s.pos : s.neg]}>
              {roiPos ? '+' : ''}€{guadagno.toLocaleString('it-IT')}
            </Text>
          </View>
        </View>
        {roiPerc && (
          <View style={[s.roiBadge, roiPos ? s.roiPos : s.roiNeg]}>
            <Text style={[s.roiText, roiPos ? s.pos : s.neg]}>
              ROI {roiPos ? '+' : ''}{roiPerc}%
            </Text>
          </View>
        )}
      </View>

      {onAdmin && (
        <TouchableOpacity style={s.adminBtn} onPress={onAdmin}>
          <Text style={s.adminBtnText}>⚙️ Admin — Richieste carte</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={s.logoutBtn} onPress={onLogout}>
        <Text style={s.logoutText}>Esci dall'account</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginTop: 52, marginBottom: 24 },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#534AB7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  email: { fontSize: 15, color: '#888780', marginBottom: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeFree: { backgroundColor: '#F1EFE8', borderWidth: 1, borderColor: '#D3D1C7' },
  badgePremium: { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#F9A825' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  badgeFreeText: { color: '#888780' },
  badgePremiumText: { color: '#F57F17' },
  upgradeCard: { backgroundColor: '#534AB7', borderRadius: 16, padding: 20, marginBottom: 16 },
  upgradeTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  upgradeDesc: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16, lineHeight: 20 },
  upgradeBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 12, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 18, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  sectionTitle: { fontSize: 11, color: '#888780', fontWeight: '600', marginBottom: 14, letterSpacing: 0.8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12 },
  statLabel: { fontSize: 11, color: '#888780', marginBottom: 4 },
  statNum: { fontSize: 16, fontWeight: '600', color: '#2C2C2A' },
  pos: { color: '#3B6D11' },
  neg: { color: '#A32D2D' },
  roiBadge: { marginTop: 12, borderRadius: 8, padding: 12, alignItems: 'center' },
  roiPos: { backgroundColor: '#EAF3DE' },
  roiNeg: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 16, fontWeight: '600' },
  adminBtn: { backgroundColor: '#EEEDFE', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12, borderWidth: 0.5, borderColor: '#534AB7' },
  adminBtnText: { color: '#534AB7', fontSize: 15, fontWeight: '500' },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7' },
  logoutText: { color: '#A32D2D', fontSize: 15, fontWeight: '500' },
})