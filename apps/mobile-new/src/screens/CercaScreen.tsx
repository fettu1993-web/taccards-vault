import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, Image } from 'react-native'
import { Carta, mapCatalogCard, SPORT_FILTER_MAP } from '../types'
import { apiFetch } from '../lib/api'

const GRADER_CONFIG = [
  { company: null,    label: 'Raw',   valori: [] },
  { company: 'psa',  label: 'PSA',   valori: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'] },
  { company: 'bgs',  label: 'BGS',   valori: ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'] },
  { company: 'cgc',  label: 'CGC',   valori: ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'] },
  { company: 'graad', label: 'GRAAD', valori: ['10', '9.5', '9', '8.5', '8', '7.5', '7', '6.5', '6', '5.5', '5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1'] },
]

interface GradeValue {
  label: string
  condition: string
  company: string | null
  value: string | null
}

const DEFAULT_GRADE: GradeValue = { label: 'Raw', condition: 'raw', company: null, value: null }

function GradeSelector({ value, onChange }: { value: GradeValue, onChange: (g: GradeValue) => void }) {
  const [aperto, setAperto] = useState<string | null>(null)

  function selezionaRaw() {
    onChange(DEFAULT_GRADE)
    setAperto(null)
  }

  function selezionaVoto(company: string, voto: string) {
    onChange({ label: `${company.toUpperCase()} ${voto}`, condition: 'graded', company, value: voto })
    setAperto(null)
  }

  return (
    <View style={gs.wrap}>
      <View style={gs.row}>
        {GRADER_CONFIG.map((g) => {
          const isRaw = g.company === null
          const isAttivo = isRaw ? value.label === 'Raw' : value.company === g.company
          const isOpen = aperto === g.label
          return (
            <TouchableOpacity key={g.label} style={[gs.btn, isAttivo && gs.btnAttivo]}
              onPress={() => { if (isRaw) { selezionaRaw(); return } setAperto(isOpen ? null : g.label) }}>
              <Text style={[gs.btnText, isAttivo && gs.btnTextAttivo]}>
                {g.label}{!isRaw ? (isOpen ? ' ▲' : ' ▼') : ''}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {GRADER_CONFIG.filter(g => g.company && aperto === g.label).map((g) => (
        <View key={g.label} style={gs.dropdown}>
          {g.valori.map((voto) => {
            const isSelezionato = value.company === g.company && value.value === voto
            return (
              <TouchableOpacity key={voto} style={[gs.votoBtn, isSelezionato && gs.votoBtnAttivo]}
                onPress={() => selezionaVoto(g.company!, voto)}>
                <Text style={[gs.votoText, isSelezionato && gs.votoTextAttivo]}>{g.label.toUpperCase()} {voto}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      ))}

      {value.label !== 'Raw' && (
        <Text style={gs.selectedLabel}>Selezionato: <Text style={gs.selectedValue}>{value.label}</Text></Text>
      )}
    </View>
  )
}

const gs = StyleSheet.create({
  wrap: { marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#F1EFE8', borderWidth: 0.5, borderColor: '#D3D1C7', alignItems: 'center' },
  btnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  btnText: { fontSize: 14, fontWeight: '600', color: '#888780' },
  btnTextAttivo: { color: '#fff' },
  dropdown: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, padding: 12, backgroundColor: '#F1EFE8', borderRadius: 10, borderWidth: 0.5, borderColor: '#D3D1C7' },
  votoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#D3D1C7' },
  votoBtnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  votoText: { fontSize: 13, fontWeight: '500', color: '#2C2C2A' },
  votoTextAttivo: { color: '#fff' },
  selectedLabel: { fontSize: 12, color: '#888780', marginTop: 8 },
  selectedValue: { color: '#534AB7', fontWeight: '600' },
})

export function CercaScreen({ collezione, onAggiungi }: {
  collezione: Carta[]
  onAggiungi: (carta: Carta, purchasePrice: number, condition: string, gradeCompany: string | null, gradeValue: string | null) => void
}) {
  const [query, setQuery] = useState('')
  const [filtroSport, setFiltroSport] = useState('Tutti')
  const [risultati, setRisultati] = useState<Carta[]>([])
  const [cercando, setCercando] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [cartaSelezionata, setCartaSelezionata] = useState<Carta | null>(null)
  const [prezzoAcquisto, setPrezzoAcquisto] = useState('')
  const [gradeSelezionato, setGradeSelezionato] = useState<GradeValue>(DEFAULT_GRADE)
  const [aggiungendo, setAggiungendo] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => { loadCards() }, 300)
    return () => clearTimeout(timeout)
  }, [query, filtroSport])

  async function loadCards() {
    setCercando(true)
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (filtroSport !== 'Tutti') {
        params.set('sport', SPORT_FILTER_MAP[filtroSport] ?? filtroSport.toLowerCase())
      }
      const res = await apiFetch(`/cards/search?${params}`)
      const mapped = res.data.map(mapCatalogCard)
      
      setRisultati(mapped)
    } catch (e) {
      console.error('Errore ricerca:', e)
    }
    setCercando(false)
  }

  function apriModal(carta: Carta) {
    setCartaSelezionata(carta)
    setPrezzoAcquisto('')
    setGradeSelezionato(DEFAULT_GRADE)
    setModalVisible(true)
  }

  async function confermaAggiungi() {
    if (!cartaSelezionata) return
    const prezzo = parseFloat(prezzoAcquisto.replace(',', '.'))
    if (isNaN(prezzo) || prezzo <= 0) {
      Alert.alert('Prezzo non valido', 'Inserisci un prezzo di acquisto valido.')
      return
    }
    setAggiungendo(true)
    await onAggiungi(cartaSelezionata, prezzo, gradeSelezionato.condition, gradeSelezionato.company, gradeSelezionato.value)
    setAggiungendo(false)
    setModalVisible(false)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Cerca carte</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Cerca giocatore, set, parallel..."
          placeholderTextColor="#888780" value={query} onChangeText={setQuery} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtriScroll}>
        {['Tutti', 'Calcio', 'Basket', 'F1', 'Tennis'].map((sport) => (
          <TouchableOpacity key={sport}
            style={[styles.filtroBtn, filtroSport === sport && styles.filtroBtnAttivo]}
            onPress={() => setFiltroSport(sport)}>
            <Text style={[styles.filtroText, filtroSport === sport && styles.filtroTextAttivo]}>{sport}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {cercando && <ActivityIndicator color="#534AB7" style={{ marginTop: 20 }} />}

      {!cercando && risultati.length === 0 && (
        <Text style={styles.emptyText}>Nessuna carta trovata</Text>
      )}

      {!cercando && risultati.map((card) => (
        <View key={card.id} style={styles.cardItem}>
          {card.imageUrl ? (
            <Image source={{ uri: card.imageUrl }} style={styles.cardImage} resizeMode="contain" />
          ) : (
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>{card.sport}</Text>
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.cardPlayer}>{card.player}</Text>
            <Text style={styles.cardSet}>{card.set}</Text>
            {card.parallel ? <Text style={styles.cardParallel}>✨ {card.parallel}</Text> : null}
            {card.grade ? <Text style={styles.cardGrade}>{card.grade}</Text> : null}
          </View>
          <View style={styles.cardPrices}>
            <Text style={styles.cardCurrentPrice}>€{card.currentPrice}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => apriModal(card)}>
              <Text style={styles.addBtnText}>+ Aggiungi</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {cartaSelezionata && (
              <>
                <Text style={styles.modalTitle}>Aggiungi alla collezione</Text>

                <View style={styles.modalCartaInfo}>
                  {cartaSelezionata.imageUrl ? (
                    <Image source={{ uri: cartaSelezionata.imageUrl }} style={styles.modalCartaImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.modalCartaSport}>{cartaSelezionata.sport}</Text>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalCartaPlayer}>{cartaSelezionata.player}</Text>
                    <Text style={styles.modalCartaSet}>{cartaSelezionata.set}</Text>
                    {cartaSelezionata.parallel ? (
                      <Text style={styles.modalCartaParallel}>✨ {cartaSelezionata.parallel}</Text>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.modalLabel}>Condizione / Grade</Text>
                <GradeSelector value={gradeSelezionato} onChange={setGradeSelezionato} />

                <Text style={[styles.modalLabel, { marginTop: 16 }]}>Prezzo di acquisto (€)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="es. 85.00"
                  placeholderTextColor="#888780"
                  value={prezzoAcquisto}
                  onChangeText={setPrezzoAcquisto}
                  keyboardType="decimal-pad"
                  autoFocus
                />
                <Text style={styles.modalHint}>
                  Valore di mercato attuale: €{cartaSelezionata.currentPrice}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalBtnAnnulla} onPress={() => setModalVisible(false)} disabled={aggiungendo}>
                    <Text style={styles.modalBtnAnnullaText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalBtnAggiungi, aggiungendo && { opacity: 0.6 }]} onPress={confermaAggiungi} disabled={aggiungendo}>
                    {aggiungendo ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalBtnAggiungiText}>Aggiungi</Text>}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  screenContent: { padding: 20, paddingBottom: 40 },
  screenTitle: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginTop: 40, marginBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, padding: 12, fontSize: 16, color: '#2C2C2A' },
  filtriScroll: { marginBottom: 16 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 0.5, borderColor: '#D3D1C7' },
  filtroBtnAttivo: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  filtroText: { fontSize: 13, color: '#888780' },
  filtroTextAttivo: { color: '#fff', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#888780', marginTop: 40, fontSize: 15 },
  cardItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 44, height: 60, borderRadius: 4, marginRight: 12, backgroundColor: '#F1EFE8' },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardPlayer: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  cardSet: { fontSize: 12, color: '#888780', marginTop: 2 },
  cardParallel: { fontSize: 11, color: '#B8860B', marginTop: 3, fontWeight: '600' },
  cardGrade: { fontSize: 11, color: '#534AB7', marginTop: 3, fontWeight: '500' },
  cardPrices: { alignItems: 'flex-end' },
  cardCurrentPrice: { fontSize: 16, fontWeight: '500', color: '#2C2C2A' },
  addBtn: { backgroundColor: '#EEEDFE', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginTop: 4 },
  addBtnText: { color: '#534AB7', fontSize: 11, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '500', color: '#2C2C2A', marginBottom: 16 },
  modalCartaInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12, marginBottom: 20, gap: 12 },
  modalCartaImage: { width: 40, height: 55, borderRadius: 4 },
  modalCartaSport: { fontSize: 28 },
  modalCartaPlayer: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  modalCartaSet: { fontSize: 12, color: '#888780', marginTop: 2 },
  modalCartaParallel: { fontSize: 11, color: '#B8860B', marginTop: 3, fontWeight: '600' },
  modalLabel: { fontSize: 13, color: '#888780', marginBottom: 8 },
  modalInput: { backgroundColor: '#F1EFE8', borderRadius: 8, padding: 14, fontSize: 20, color: '#2C2C2A', borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 8 },
  modalHint: { fontSize: 12, color: '#888780', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtnAnnulla: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D3D1C7' },
  modalBtnAnnullaText: { color: '#888780', fontSize: 15, fontWeight: '500' },
  modalBtnAggiungi: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', backgroundColor: '#534AB7' },
  modalBtnAggiungiText: { color: '#fff', fontSize: 15, fontWeight: '500' },
})