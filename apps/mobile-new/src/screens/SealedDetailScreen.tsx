import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native'
import { useState } from 'react'
import { apiFetch } from '../lib/api'

interface SealedProduct {
  id: string
  name: string
  category: string
  productType: string
  sportEmoji: string
  buyPrice: number
  currentValue: number
  quantity: number
  purchaseDate: string
  status: 'sealed' | 'opened'
  notes: string
}

export function SealedDetailScreen({ prodotto, onBack, onRimuovi, onUpdate }: {
  prodotto: SealedProduct
  onBack: () => void
  onRimuovi: (id: string) => void
  onUpdate: (id: string, nuovoValore: number) => void
}) {
  const [editingValore, setEditingValore] = useState(false)
  const [nuovoValore, setNuovoValore] = useState(prodotto.currentValue.toString())
  const [salvando, setSalvando] = useState(false)

  const roi = prodotto.buyPrice > 0
    ? (((prodotto.currentValue - prodotto.buyPrice) / prodotto.buyPrice) * 100).toFixed(1)
    : null
  const roiPos = roi ? Number(roi) >= 0 : true
  const guadagno = (prodotto.currentValue - prodotto.buyPrice) * prodotto.quantity

  async function salvaValore() {
    const valore = parseFloat(nuovoValore.replace(',', '.'))
    if (isNaN(valore) || valore <= 0) {
      window.alert('Inserisci un valore valido.')
      return
    }
    setSalvando(true)
    try {
      await apiFetch(`/sealed/${prodotto.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ currentValue: valore }),
      })
      onUpdate(prodotto.id, valore)
      setEditingValore(false)
    } catch (e: any) {
      window.alert(e.message || 'Errore nel salvataggio.')
    }
    setSalvando(false)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Sealed Products</Text>
      </TouchableOpacity>

      {/* Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>{prodotto.sportEmoji}</Text>
        <Text style={styles.heroName}>{prodotto.name}</Text>
        <View style={styles.heroBadgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{prodotto.productType}</Text>
          </View>
          <View style={[styles.statusBadge, prodotto.status === 'sealed' ? styles.statusSealed : styles.statusOpened]}>
            <Text style={styles.statusText}>{prodotto.status === 'sealed' ? '📦 Sigillato' : '📭 Aperto'}</Text>
          </View>
        </View>
      </View>

      {/* Valore attuale */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VALORE</Text>
        <View style={styles.valoreRow}>
          <View>
            <Text style={styles.valoreLabel}>Valore attuale {prodotto.quantity > 1 ? `(x${prodotto.quantity})` : ''}</Text>
            {editingValore ? (
              <TextInput
                style={styles.valoreInput}
                value={nuovoValore}
                onChangeText={setNuovoValore}
                keyboardType="decimal-pad"
                autoFocus
              />
            ) : (
              <Text style={styles.valoreNum}>€{(prodotto.currentValue * prodotto.quantity).toLocaleString('it-IT')}</Text>
            )}
          </View>
          <View style={styles.valoreActions}>
            {roi !== null && !editingValore && (
              <View style={[styles.roiBadge, roiPos ? styles.roiPos : styles.roiNeg]}>
                <Text style={[styles.roiText, roiPos ? styles.roiTextPos : styles.roiTextNeg]}>
                  {roiPos ? '+' : ''}{roi}%
                </Text>
              </View>
            )}
            {editingValore ? (
              <TouchableOpacity style={styles.saveBtn} onPress={salvaValore} disabled={salvando}>
                <Text style={styles.saveBtnText}>{salvando ? '...' : '✓ Salva'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditingValore(true)}>
                <Text style={styles.editBtnText}>✏️ Aggiorna</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Investimento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>INVESTIMENTO</Text>
        <View style={styles.detailGrid}>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Prezzo acquisto</Text>
            <Text style={styles.detailValue}>€{(prodotto.buyPrice * prodotto.quantity).toLocaleString('it-IT')}</Text>
          </View>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Guadagno</Text>
            <Text style={[styles.detailValue, roiPos ? styles.roiTextPos : styles.roiTextNeg]}>
              {roiPos ? '+' : ''}€{guadagno.toLocaleString('it-IT')}
            </Text>
          </View>
        </View>
      </View>

      {/* Dettagli */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETTAGLI</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Categoria</Text>
          <Text style={styles.infoValue}>{prodotto.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo</Text>
          <Text style={styles.infoValue}>{prodotto.productType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantità</Text>
          <Text style={styles.infoValue}>{prodotto.quantity}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data acquisto</Text>
          <Text style={styles.infoValue}>{prodotto.purchaseDate}</Text>
        </View>
        {prodotto.notes ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Note</Text>
            <Text style={styles.infoValue}>{prodotto.notes}</Text>
          </View>
        ) : null}
      </View>

      {/* Rimuovi */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => {
          if (window.confirm(`Rimuovere ${prodotto.name}?`)) {
            onRimuovi(prodotto.id)
          }
        }}
      >
        <Text style={styles.removeBtnText}>🗑 Rimuovi prodotto</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  backBtn: { marginTop: 52, marginBottom: 20 },
  backText: { fontSize: 15, color: '#534AB7', fontWeight: '500' },
  heroCard: { backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16 },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroName: { fontSize: 20, fontWeight: '600', color: '#2C2C2A', textAlign: 'center', marginBottom: 12 },
  heroBadgeRow: { flexDirection: 'row', gap: 8 },
  typeBadge: { backgroundColor: '#F1EFE8', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  typeBadgeText: { color: '#888780', fontSize: 13, fontWeight: '500' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusSealed: { backgroundColor: '#EEEDFE' },
  statusOpened: { backgroundColor: '#EAF3DE' },
  statusText: { fontSize: 13, fontWeight: '500', color: '#2C2C2A' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 18, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  sectionTitle: { fontSize: 11, color: '#888780', fontWeight: '600', marginBottom: 14, letterSpacing: 0.8 },
  valoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valoreLabel: { fontSize: 13, color: '#888780', marginBottom: 4 },
  valoreNum: { fontSize: 32, fontWeight: '600', color: '#2C2C2A' },
  valoreInput: { fontSize: 28, fontWeight: '600', color: '#534AB7', borderBottomWidth: 2, borderBottomColor: '#534AB7', minWidth: 120, paddingVertical: 4 },
  valoreActions: { alignItems: 'flex-end', gap: 8 },
  roiBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  roiPos: { backgroundColor: '#EAF3DE' },
  roiNeg: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 15, fontWeight: '600' },
  roiTextPos: { color: '#3B6D11' },
  roiTextNeg: { color: '#A32D2D' },
  editBtn: { backgroundColor: '#EEEDFE', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  editBtnText: { color: '#534AB7', fontSize: 13, fontWeight: '500' },
  saveBtn: { backgroundColor: '#534AB7', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  detailGrid: { flexDirection: 'row', gap: 12 },
  detailCell: { flex: 1, backgroundColor: '#F1EFE8', borderRadius: 10, padding: 14 },
  detailLabel: { fontSize: 12, color: '#888780', marginBottom: 4 },
  detailValue: { fontSize: 18, fontWeight: '600', color: '#2C2C2A' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#F1EFE8' },
  infoLabel: { fontSize: 14, color: '#888780' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#2C2C2A', maxWidth: '60%', textAlign: 'right' },
  removeBtn: { marginTop: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FCEBEB', backgroundColor: '#fff', alignItems: 'center' },
  removeBtnText: { color: '#A32D2D', fontSize: 15, fontWeight: '500' },
})