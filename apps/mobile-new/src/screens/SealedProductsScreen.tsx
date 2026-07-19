import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native'
import { apiFetch } from '../lib/api'
import { SealedDetailScreen } from './SealedDetailScreen'

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

const SPORT_OPTIONS = [
  { label: 'Calcio',    emoji: '⚽', value: 'soccer' },
  { label: 'Basket',   emoji: '🏀', value: 'basketball' },
  { label: 'F1',       emoji: '🏎', value: 'f1' },
  { label: 'Pokémon',  emoji: '⚡', value: 'pokemon' },
  { label: 'One Piece',emoji: '🏴‍☠️', value: 'onepiece' },
]

const PRODUCT_TYPES = ['box', 'case', 'pack', 'blaster', 'hobby', 'breakaway']

const SPORT_EMOJI: Record<string, string> = {
  soccer: '⚽', basketball: '🏀', f1: '🏎', pokemon: '⚡', onepiece: '🏴‍☠️',
}

function mapProduct(p: any): SealedProduct {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    productType: p.productType,
    sportEmoji: SPORT_EMOJI[p.category] ?? '📦',
    buyPrice: Number(p.purchasePrice),
    currentValue: Number(p.currentValue ?? p.purchasePrice),
    quantity: p.quantity,
    purchaseDate: p.purchaseDate?.split('T')[0] ?? '',
    status: p.status as 'sealed' | 'opened',
    notes: p.notes ?? '',
  }
}

export function SealedProductsScreen() {
  const [prodotti, setProdotti] = useState<SealedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState<'tutti' | 'sealed' | 'opened'>('tutti')
  const [prodottoDettaglio, setProdottoDettaglio] = useState<SealedProduct | null>(null)

  const [formName, setFormName] = useState('')
  const [formSport, setFormSport] = useState(SPORT_OPTIONS[0])
  const [formProductType, setFormProductType] = useState(PRODUCT_TYPES[0])
  const [formSetName, setFormSetName] = useState('')
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString())
  const [formBuyPrice, setFormBuyPrice] = useState('')
  const [formCurrentValue, setFormCurrentValue] = useState('')
  const [formQuantity, setFormQuantity] = useState('1')
  const [formNotes, setFormNotes] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { fetchProdotti() }, [])

  async function fetchProdotti() {
    setLoading(true)
    try {
      const res = await apiFetch('/sealed')
      setProdotti(res.data.map(mapProduct))
    } catch (e) {
      console.error('Errore caricamento sealed:', e)
    }
    setLoading(false)
  }

  const prodottiFiltrati = filtroStatus === 'tutti'
    ? prodotti
    : prodotti.filter(p => p.status === filtroStatus)

  const totalInvested = prodotti.reduce((s, p) => s + p.buyPrice * p.quantity, 0)
  const totalValue = prodotti.reduce((s, p) => s + p.currentValue * p.quantity, 0)
  const roi = totalInvested > 0 ? (((totalValue - totalInvested) / totalInvested) * 100).toFixed(1) : '0.0'
  const roiPos = Number(roi) >= 0

  function apriModal() {
    setFormName(''); setFormSport(SPORT_OPTIONS[0]); setFormProductType(PRODUCT_TYPES[0])
    setFormSetName(''); setFormYear(new Date().getFullYear().toString())
    setFormBuyPrice(''); setFormCurrentValue(''); setFormQuantity('1'); setFormNotes('')
    setModalVisible(true)
  }

  async function salvaProdotto() {
    if (!formName.trim()) { window.alert('Inserisci il nome del prodotto.'); return }
    if (!formSetName.trim()) { window.alert('Inserisci il nome del set.'); return }
    const buyPrice = parseFloat(formBuyPrice.replace(',', '.'))
    if (isNaN(buyPrice) || buyPrice <= 0) { window.alert('Inserisci un prezzo valido.'); return }
    const year = parseInt(formYear)
    if (isNaN(year)) { window.alert('Inserisci un anno valido.'); return }
    setSalvando(true)
    try {
      await apiFetch('/sealed', {
        method: 'POST',
        body: JSON.stringify({
          name: formName.trim(), category: formSport.value, productType: formProductType,
          setName: formSetName.trim(), year, quantity: parseInt(formQuantity) || 1,
          purchasePrice: buyPrice, purchaseDate: new Date().toISOString(),
          notes: formNotes.trim() || undefined,
        }),
      })
      await fetchProdotti()
      setModalVisible(false)
    } catch (e: any) {
      window.alert(e.message || 'Errore nel salvataggio.')
    }
    setSalvando(false)
  }

  async function toggleStatus(p: SealedProduct) {
    const nuovoStatus = p.status === 'sealed' ? 'opened' : 'sealed'
    try {
      await apiFetch(`/sealed/${p.id}`, { method: 'PATCH', body: JSON.stringify({ status: nuovoStatus }) })
      setProdotti(prev => prev.map(x => x.id === p.id ? { ...x, status: nuovoStatus } : x))
    } catch (e) { await fetchProdotti() }
  }

  async function rimuoviProdotto(id: string) {
    try {
      await apiFetch(`/sealed/${id}`, { method: 'DELETE' })
      setProdotti(prev => prev.filter(p => p.id !== id))
      setProdottoDettaglio(null)
    } catch (e: any) {
      window.alert(e.message || 'Errore nella rimozione.')
    }
  }

  function onUpdate(id: string, nuovoValore: number) {
    setProdotti(prev => prev.map(p => p.id === id ? { ...p, currentValue: nuovoValore } : p))
    setProdottoDettaglio(prev => prev ? { ...prev, currentValue: nuovoValore } : null)
  }

  // Schermata dettaglio
  if (prodottoDettaglio) {
    return (
      <SealedDetailScreen
        prodotto={prodottoDettaglio}
        onBack={() => setProdottoDettaglio(null)}
        onRimuovi={rimuoviProdotto}
        onUpdate={onUpdate}
      />
    )
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Sealed Products</Text>
        <TouchableOpacity style={styles.addBtn} onPress={apriModal}>
          <Text style={styles.addBtnText}>+ Aggiungi</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator color="#534AB7" style={{ marginTop: 40 }} />}

      {!loading && (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>Valore totale</Text>
                <Text style={styles.summaryValue}>€{totalValue.toLocaleString('it-IT')}</Text>
              </View>
              <View style={[styles.roiBadge, roiPos ? styles.roiPos : styles.roiNeg]}>
                <Text style={[styles.roiText, roiPos ? styles.roiTextPos : styles.roiTextNeg]}>
                  {roiPos ? '+' : ''}{roi}%
                </Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Investito</Text><Text style={styles.summaryStatValue}>€{totalInvested.toLocaleString('it-IT')}</Text></View>
              <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Prodotti</Text><Text style={styles.summaryStatValue}>{prodotti.length}</Text></View>
              <View style={styles.summaryStat}><Text style={styles.summaryStatLabel}>Sigillati</Text><Text style={styles.summaryStatValue}>{prodotti.filter(p => p.status === 'sealed').length}</Text></View>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtriScroll}>
            {(['tutti', 'sealed', 'opened'] as const).map((f) => (
              <TouchableOpacity key={f}
                style={[styles.filtroBtn, filtroStatus === f && styles.filtroBtnAttivo]}
                onPress={() => setFiltroStatus(f)}>
                <Text style={[styles.filtroText, filtroStatus === f && styles.filtroTextAttivo]}>
                  {f === 'tutti' ? 'Tutti' : f === 'sealed' ? '📦 Sigillati' : '📭 Aperti'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {prodottiFiltrati.length === 0 && (
            <Text style={styles.emptyText}>Nessun prodotto.{'\n'}Premi "+ Aggiungi" per iniziare.</Text>
          )}

          {prodottiFiltrati.map((p) => {
            const itemRoi = p.buyPrice > 0 ? (((p.currentValue - p.buyPrice) / p.buyPrice) * 100).toFixed(1) : null
            const itemRoiPos = itemRoi ? Number(itemRoi) >= 0 : true
            return (
              <TouchableOpacity key={p.id} style={styles.productCard} onPress={() => setProdottoDettaglio(p)} activeOpacity={0.7}>
                <View style={styles.productHeader}>
                  <View style={styles.productIconWrap}>
                    <Text style={styles.productEmoji}>{p.sportEmoji}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productMeta}>{p.productType} · {p.quantity > 1 ? `x${p.quantity} · ` : ''}{p.purchaseDate}</Text>
                    {p.notes ? <Text style={styles.productNotes}>{p.notes}</Text> : null}
                  </View>
                  <View style={[styles.statusBadge, p.status === 'sealed' ? styles.statusSealed : styles.statusOpened]}>
                    <Text style={styles.statusEmoji}>{p.status === 'sealed' ? '📦' : '📭'}</Text>
                  </View>
                </View>

                <View style={styles.productPrices}>
                  <View style={styles.priceCell}>
                    <Text style={styles.priceLabel}>Acquisto</Text>
                    <Text style={styles.priceValue}>€{(p.buyPrice * p.quantity).toLocaleString('it-IT')}</Text>
                  </View>
                  <View style={styles.priceCell}>
                    <Text style={styles.priceLabel}>Valore</Text>
                    <Text style={styles.priceValue}>€{(p.currentValue * p.quantity).toLocaleString('it-IT')}</Text>
                  </View>
                  {itemRoi !== null && (
                    <View style={[styles.roiBadgeSmall, itemRoiPos ? styles.roiPos : styles.roiNeg]}>
                      <Text style={[styles.roiTextSmall, itemRoiPos ? styles.roiTextPos : styles.roiTextNeg]}>
                        {itemRoiPos ? '+' : ''}{itemRoi}%
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={(e) => { e.stopPropagation?.(); toggleStatus(p) }}>
                    <Text style={styles.actionBtnText}>{p.status === 'sealed' ? 'Segna aperto' : 'Segna sigillato'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnDelete} onPress={(e) => {
                    e.stopPropagation?.()
                    if (window.confirm(`Rimuovere ${p.name}?`)) rimuoviProdotto(p.id)
                  }}>
                    <Text style={styles.actionBtnDeleteText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )
          })}
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalTitle}>Nuovo prodotto sigillato</Text>

            <Text style={styles.modalLabel}>Nome prodotto</Text>
            <TextInput style={styles.modalInput} placeholder="es. Panini Prizm 2024 Hobby Box"
              placeholderTextColor="#888780" value={formName} onChangeText={setFormName} />

            <Text style={styles.modalLabel}>Sport / Categoria</Text>
            <View style={styles.chipGrid}>
              {SPORT_OPTIONS.map((s) => (
                <TouchableOpacity key={s.value}
                  style={[styles.chip, formSport.value === s.value && styles.chipAttivo]}
                  onPress={() => setFormSport(s)}>
                  <Text style={[styles.chipText, formSport.value === s.value && styles.chipTextAttivo]}>{s.emoji} {s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Tipo prodotto</Text>
            <View style={styles.chipGrid}>
              {PRODUCT_TYPES.map((t) => (
                <TouchableOpacity key={t}
                  style={[styles.chip, formProductType === t && styles.chipAttivo]}
                  onPress={() => setFormProductType(t)}>
                  <Text style={[styles.chipText, formProductType === t && styles.chipTextAttivo]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.modalLabel}>Nome set</Text>
                <TextInput style={styles.modalInput} placeholder="es. Prizm 2024"
                  placeholderTextColor="#888780" value={formSetName} onChangeText={setFormSetName} />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.modalLabel}>Anno</Text>
                <TextInput style={styles.modalInput} placeholder="2024"
                  placeholderTextColor="#888780" value={formYear} onChangeText={setFormYear} keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.modalLabel}>Prezzo acquisto (€)</Text>
                <TextInput style={styles.modalInput} placeholder="120.00"
                  placeholderTextColor="#888780" value={formBuyPrice} onChangeText={setFormBuyPrice} keyboardType="decimal-pad" />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.modalLabel}>Valore attuale (€)</Text>
                <TextInput style={styles.modalInput} placeholder="120.00"
                  placeholderTextColor="#888780" value={formCurrentValue} onChangeText={setFormCurrentValue} keyboardType="decimal-pad" />
              </View>
            </View>

            <Text style={styles.modalLabel}>Quantità</Text>
            <TextInput style={styles.modalInput} placeholder="1"
              placeholderTextColor="#888780" value={formQuantity} onChangeText={setFormQuantity} keyboardType="number-pad" />

            <Text style={styles.modalLabel}>Note (opzionale)</Text>
            <TextInput style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="es. Comprato su eBay..."
              placeholderTextColor="#888780" value={formNotes} onChangeText={setFormNotes} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnAnnulla} onPress={() => setModalVisible(false)} disabled={salvando}>
                <Text style={styles.modalBtnAnnullaText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnSalva, salvando && { opacity: 0.6 }]} onPress={salvaProdotto} disabled={salvando}>
                {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnSalvaText}>Salva</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  content: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 52, marginBottom: 20 },
  screenTitle: { fontSize: 24, fontWeight: '500', color: '#2C2C2A' },
  addBtn: { backgroundColor: '#534AB7', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#888780', marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: '500', color: '#2C2C2A' },
  summaryDivider: { height: 0.5, backgroundColor: '#D3D1C7', marginVertical: 16 },
  summaryStat: { alignItems: 'center' },
  summaryStatLabel: { fontSize: 12, color: '#888780', marginBottom: 2 },
  summaryStatValue: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  roiBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  roiBadgeSmall: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: 'center' },
  roiPos: { backgroundColor: '#EAF3DE' },
  roiNeg: { backgroundColor: '#FCEBEB' },
  roiText: { fontSize: 14, fontWeight: '500' },
  roiTextSmall: { fontSize: 12, fontWeight: '500' },
  roiTextPos: { color: '#3B6D11' },
  roiTextNeg: { color: '#A32D2D' },
  filtriScroll: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 0.5, borderColor: '#D3D1C7' },
  filtroBtnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  filtroText: { fontSize: 13, color: '#888780' },
  filtroTextAttivo: { color: '#fff', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#888780', marginTop: 40, fontSize: 15, lineHeight: 24 },
  productCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  productHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  productIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  productEmoji: { fontSize: 20 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '500', color: '#2C2C2A', marginBottom: 2 },
  productMeta: { fontSize: 12, color: '#888780' },
  productNotes: { fontSize: 11, color: '#888780', marginTop: 3, fontStyle: 'italic' },
  statusBadge: { padding: 6, borderRadius: 8 },
  statusSealed: { backgroundColor: '#EEEDFE' },
  statusOpened: { backgroundColor: '#F1EFE8' },
  statusEmoji: { fontSize: 16 },
  productPrices: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#F1EFE8' },
  priceCell: {},
  priceLabel: { fontSize: 11, color: '#888780', marginBottom: 2 },
  priceValue: { fontSize: 15, fontWeight: '500', color: '#2C2C2A' },
  productActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, borderRadius: 8, padding: 10, alignItems: 'center', backgroundColor: '#F1EFE8' },
  actionBtnText: { color: '#534AB7', fontSize: 13, fontWeight: '500' },
  actionBtnDelete: { borderRadius: 8, padding: 10, alignItems: 'center', backgroundColor: '#FCEBEB' },
  actionBtnDeleteText: { fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalScroll: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  modalScrollContent: { padding: 24, paddingBottom: 48 },
  modalTitle: { fontSize: 18, fontWeight: '500', color: '#2C2C2A', marginBottom: 20 },
  modalLabel: { fontSize: 13, color: '#888780', marginBottom: 8, marginTop: 12 },
  modalInput: { backgroundColor: '#F1EFE8', borderRadius: 8, padding: 14, fontSize: 16, color: '#2C2C2A', borderWidth: 0.5, borderColor: '#D3D1C7' },
  modalInputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row', gap: 12 },
  formHalf: { flex: 1 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F1EFE8', borderWidth: 0.5, borderColor: '#D3D1C7' },
  chipAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  chipText: { fontSize: 13, color: '#888780', fontWeight: '500' },
  chipTextAttivo: { color: '#fff' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalBtnAnnulla: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D3D1C7' },
  modalBtnAnnullaText: { color: '#888780', fontSize: 15, fontWeight: '500' },
  modalBtnSalva: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', backgroundColor: '#534AB7' },
  modalBtnSalvaText: { color: '#fff', fontSize: 15, fontWeight: '500' },
})