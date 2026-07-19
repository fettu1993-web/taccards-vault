import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from 'react-native'
import { Carta, mapCatalogCard, SPORT_FILTER_MAP } from '../types'
import { apiFetch } from '../lib/api'

export function CercaScreen({ collezione, onAggiungi }: {
  collezione: Carta[]
  onAggiungi: (carta: Carta, purchasePrice: number) => void
}) {
  const [query, setQuery] = useState('')
  const [filtroSport, setFiltroSport] = useState('Tutti')
  const [risultati, setRisultati] = useState<Carta[]>([])
  const [cercando, setCercando] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [cartaSelezionata, setCartaSelezionata] = useState<Carta | null>(null)
  const [prezzoAcquisto, setPrezzoAcquisto] = useState('')
  const [aggiungendo, setAggiungendo] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadCards()
    }, 300)
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
      setRisultati(res.data.map(mapCatalogCard))
    } catch (e) {
      console.error('Errore ricerca:', e)
    }
    setCercando(false)
  }

  function apriModal(carta: Carta) {
    if (collezione.find(c => c.cardId === carta.cardId)) {
      Alert.alert('Già presente', 'Questa carta è già nella tua collezione.')
      return
    }
    setCartaSelezionata(carta)
    setPrezzoAcquisto('')
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
    await onAggiungi(cartaSelezionata, prezzo)
    setAggiungendo(false)
    setModalVisible(false)
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Cerca carte</Text>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Cerca giocatore, set, anno..."
          placeholderTextColor="#888780" value={query} onChangeText={setQuery} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtriScroll}>
        {['Tutti', 'Calcio', 'Basket', 'F1'].map((sport) => (
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

      {!cercando && risultati.map((card) => {
        const inCollezione = !!collezione.find(c => c.cardId === card.cardId)
        return (
          <View key={card.id} style={styles.cardItem}>
            <View style={styles.cardIcon}><Text style={styles.cardIconText}>{card.sport}</Text></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardPlayer}>{card.player}</Text>
              <Text style={styles.cardSet}>{card.set}</Text>
              {card.grade ? <Text style={styles.cardGrade}>{card.grade}</Text> : null}
            </View>
            <View style={styles.cardPrices}>
              <Text style={styles.cardCurrentPrice}>€{card.currentPrice}</Text>
              <TouchableOpacity style={[styles.addBtn, inCollezione && styles.addBtnDone]}
                onPress={() => apriModal(card)} disabled={inCollezione}>
                <Text style={[styles.addBtnText, inCollezione && styles.addBtnTextDone]}>
                  {inCollezione ? '✓ Aggiunta' : '+ Aggiungi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      })}

      {/* Modal prezzo acquisto */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {cartaSelezionata && (
              <>
                <Text style={styles.modalTitle}>Aggiungi alla collezione</Text>
                <View style={styles.modalCartaInfo}>
                  <Text style={styles.modalCartaSport}>{cartaSelezionata.sport}</Text>
                  <View>
                    <Text style={styles.modalCartaPlayer}>{cartaSelezionata.player}</Text>
                    <Text style={styles.modalCartaSet}>{cartaSelezionata.set}</Text>
                  </View>
                </View>
                <Text style={styles.modalLabel}>Prezzo di acquisto (€)</Text>
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
                  <TouchableOpacity
                    style={styles.modalBtnAnnulla}
                    onPress={() => setModalVisible(false)}
                    disabled={aggiungendo}>
                    <Text style={styles.modalBtnAnnullaText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtnAggiungi, aggiungendo && { opacity: 0.6 }]}
                    onPress={confermaAggiungi}
                    disabled={aggiungendo}>
                    {aggiungendo
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={styles.modalBtnAggiungiText}>Aggiungi</Text>
                    }
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
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardPlayer: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  cardSet: { fontSize: 12, color: '#888780', marginTop: 2 },
  cardGrade: { fontSize: 11, color: '#534AB7', marginTop: 3, fontWeight: '500' },
  cardPrices: { alignItems: 'flex-end' },
  cardCurrentPrice: { fontSize: 16, fontWeight: '500', color: '#2C2C2A' },
  addBtn: { backgroundColor: '#EEEDFE', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginTop: 4 },
  addBtnDone: { backgroundColor: '#EAF3DE' },
  addBtnText: { color: '#534AB7', fontSize: 11, fontWeight: '500' },
  addBtnTextDone: { color: '#3B6D11' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '500', color: '#2C2C2A', marginBottom: 16 },
  modalCartaInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1EFE8', borderRadius: 10, padding: 12, marginBottom: 20, gap: 12 },
  modalCartaSport: { fontSize: 28 },
  modalCartaPlayer: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  modalCartaSet: { fontSize: 12, color: '#888780', marginTop: 2 },
  modalLabel: { fontSize: 13, color: '#888780', marginBottom: 8 },
  modalInput: { backgroundColor: '#F1EFE8', borderRadius: 8, padding: 14, fontSize: 20, color: '#2C2C2A', borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 8 },
  modalHint: { fontSize: 12, color: '#888780', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtnAnnulla: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#D3D1C7' },
  modalBtnAnnullaText: { color: '#888780', fontSize: 15, fontWeight: '500' },
  modalBtnAggiungi: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center', backgroundColor: '#534AB7' },
  modalBtnAggiungiText: { color: '#fff', fontSize: 15, fontWeight: '500' },
})