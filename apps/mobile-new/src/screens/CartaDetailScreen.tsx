import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, TextInput } from 'react-native'
import { Carta } from '../types'
import { PrezzoChart } from '../components/PrezzoChart'
import { apiFetch } from '../lib/api'
import { EbayPrices } from '../components/EbayPrices'

export function CartaDetailScreen({ carta, onBack, onRimuovi, onToast }: {
  carta: Carta
  onBack: () => void
  onRimuovi?: (id: string) => void
  onToast?: (text: string, type: 'success' | 'error') => void
}) {
  const [showWatchlistModal, setShowWatchlistModal] = useState(false)
  const [targetPrice, setTargetPrice] = useState('')
  const [addingWatchlist, setAddingWatchlist] = useState(false)

  const roi = carta.buyPrice > 0
    ? (((carta.currentPrice - carta.buyPrice) / carta.buyPrice) * 100).toFixed(1)
    : null
  const roiPos = roi ? Number(roi) >= 0 : true
  const guadagno = carta.currentPrice - carta.buyPrice
  const gradeLabel = carta.grade === 'Raw' || !carta.grade ? 'raw' : carta.grade

  async function handleAggiungiWatchlist() {
    setAddingWatchlist(true)
    try {
      await apiFetch('/watchlist', {
        method: 'POST',
        body: JSON.stringify({
          cardId: carta.cardId,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        }),
      })
      setShowWatchlistModal(false)
      setTargetPrice('')
      onToast?.('👁️ Aggiunta alla watchlist!', 'success')
    } catch (e: any) {
      onToast?.(e.message || 'Errore aggiunta watchlist', 'error')
    } finally {
      setAddingWatchlist(false)
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Collezione</Text>
      </TouchableOpacity>

      <View style={styles.heroCard}>
        {carta.imageUrl ? (
          <Image source={{ uri: carta.imageUrl }} style={styles.heroImage} resizeMode="contain" />
        ) : (
          <Text style={styles.heroEmoji}>{carta.sport}</Text>
        )}
        <Text style={styles.heroPlayer}>{carta.player}</Text>
        <Text style={styles.heroSet}>{carta.set}</Text>
        <View style={styles.badgeRow}>
          {carta.parallel ? (
            <View style={styles.parallelBadge}>
              <Text style={styles.parallelText}>✨ {carta.parallel}</Text>
            </View>
          ) : null}
          {carta.grade ? (
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{carta.grade}</Text>
            </View>
          ) : null}
        </View>
      </View>

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

      {carta.priceHistory && carta.priceHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STORICO PREZZI</Text>
          <PrezzoChart points={carta.priceHistory} gradeLabel={gradeLabel} />
        </View>
      )}

      <EbayPrices
        cardId={carta.cardId}
        playerName={carta.player}
        setName={carta.set}
        parallel={carta.parallel}
      />

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
        {carta.parallel ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Variante</Text>
            <Text style={[styles.infoValue, { color: '#B8860B' }]}>✨ {carta.parallel}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Condizione</Text>
          <Text style={styles.infoValue}>{carta.grade || 'Raw'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.watchlistBtn} onPress={() => setShowWatchlistModal(true)}>
        <Text style={styles.watchlistBtnText}>👁️ Aggiungi alla Watchlist</Text>
      </TouchableOpacity>

      {onRimuovi && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => {
            if (window.confirm(`Rimuovere ${carta.player} dalla collezione?`)) {
              onRimuovi(carta.id)
            }
          }}
        >
          <Text style={styles.removeBtnText}>🗑 Rimuovi dalla collezione</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showWatchlistModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>👁️ Aggiungi alla Watchlist</Text>
            <Text style={styles.modalSubtitle}>{carta.player} · {carta.set}</Text>
            <Text style={styles.modalLabel}>Prezzo target (opzionale)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="es. 150"
              keyboardType="numeric"
              value={targetPrice}
              onChangeText={setTargetPrice}
            />
            <Text style={styles.modalHint}>Riceverai una notifica quando il prezzo raggiunge il target.</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowWatchlistModal(false)}>
                <Text style={styles.modalCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, addingWatchlist && { opacity: 0.6 }]}
                onPress={handleAggiungiWatchlist}
                disabled={addingWatchlist}
              >
                <Text style={styles.modalConfirmText}>
                  {addingWatchlist ? 'Aggiunta...' : 'Aggiungi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  heroSet: { fontSize: 14, color: '#888780', textAlign: 'center', marginBottom: 10 },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  parallelBadge: { backgroundColor: '#FFF8E1', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 0.5, borderColor: '#B8860B' },
  parallelText: { color: '#B8860B', fontSize: 13, fontWeight: '600' },
  gradeBadge: { backgroundColor: '#EEEDFE', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
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
  watchlistBtn: { marginTop: 8, marginBottom: 8, padding: 16, borderRadius: 12, backgroundColor: '#EEEDFE', borderWidth: 0.5, borderColor: '#534AB7', alignItems: 'center' },
  watchlistBtnText: { color: '#534AB7', fontSize: 15, fontWeight: '500' },
  removeBtn: { marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FCEBEB', backgroundColor: '#fff', alignItems: 'center' },
  removeBtnText: { color: '#A32D2D', fontSize: 15, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#2C2C2A', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#888780', marginBottom: 20 },
  modalLabel: { fontSize: 13, color: '#888780', marginBottom: 8 },
  modalInput: { borderWidth: 1, borderColor: '#D3D1C7', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 8 },
  modalHint: { fontSize: 12, color: '#888780', marginBottom: 24 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#D3D1C7', alignItems: 'center' },
  modalCancelText: { color: '#888780', fontSize: 15 },
  modalConfirm: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#534AB7', alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontSize: 15, fontWeight: '600' },
})