import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native'
import { apiFetch } from '../lib/api'

const GRADES = [
  { label: 'Raw', gradeLabel: 'raw' },
  { label: 'PSA 10', gradeLabel: 'PSA 10' },
  { label: 'PSA 9', gradeLabel: 'PSA 9' },
  { label: 'PSA 8', gradeLabel: 'PSA 8' },
  { label: 'BGS 9.5', gradeLabel: 'BGS 9.5' },
  { label: 'BGS 9', gradeLabel: 'BGS 9' },
]

interface Sale {
  price: number
  date: string
  title: string
  image?: string | null
  itemUrl?: string | null
}

interface EbayPrice {
  gradeLabel: string
  price: number | null
  sales: Sale[]
  loading: boolean
  loaded: boolean
}

interface Props {
  cardId: string
  playerName: string
  setName: string
  parallel?: string | null
}

function cleanImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  // Rimuove parametri timestamp e resize da URL eBay
  return url.split('?')[0].replace(/\/s-l\d+\./, '/s-l500.')
}

export function EbayPrices({ cardId, playerName, setName, parallel }: Props) {
  const [selectedGrade, setSelectedGrade] = useState('raw')
  const [prices, setPrices] = useState<Record<string, EbayPrice>>({})

  async function loadPrice(gradeLabel: string) {
    if (prices[gradeLabel]?.loaded) return

    setPrices(prev => ({
      ...prev,
      [gradeLabel]: { gradeLabel, price: null, sales: [], loading: true, loaded: false }
    }))

    try {
      const params = new URLSearchParams({
        cardId,
        gradeLabel,
        playerName,
        setName,
        ...(parallel ? { parallel } : {}),
      })
      const res = await apiFetch(`/ebay/search?${params}`)
      setPrices(prev => ({
        ...prev,
        [gradeLabel]: {
          gradeLabel,
          price: res.avgPrice,
          sales: res.sales ?? [],
          loading: false,
          loaded: true,
        }
      }))
    } catch (e) {
      setPrices(prev => ({
        ...prev,
        [gradeLabel]: { gradeLabel, price: null, sales: [], loading: false, loaded: true }
      }))
    }
  }

  useEffect(() => {
    loadPrice('raw')
  }, [cardId])

  useEffect(() => {
    loadPrice(selectedGrade)
  }, [selectedGrade])

  const current = prices[selectedGrade]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PREZZI EBAY</Text>

      <View style={styles.gradeRow}>
        {GRADES.map(g => (
          <TouchableOpacity
            key={g.gradeLabel}
            style={[styles.gradeBtn, selectedGrade === g.gradeLabel && styles.gradeBtnActive]}
            onPress={() => setSelectedGrade(g.gradeLabel)}
          >
            <Text style={[styles.gradeBtnText, selectedGrade === g.gradeLabel && styles.gradeBtnTextActive]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {current?.loading && (
        <ActivityIndicator color="#534AB7" style={{ marginVertical: 16 }} />
      )}

      {current?.loaded && (
        <>
          <View style={styles.avgRow}>
            <View>
              <Text style={styles.avgLabel}>Valore medio ({selectedGrade})</Text>
              <Text style={styles.avgPrice}>
                {current.price
                  ? `$${current.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : 'Nessun dato'}
              </Text>
            </View>
            {current.price && current.sales.length > 0 && (
              <View style={styles.salesCount}>
                <Text style={styles.salesCountText}>{current.sales.length} annunci</Text>
              </View>
            )}
          </View>

          {current.sales.length > 0 && (
            <View style={styles.salesList}>
              <Text style={styles.salesTitle}>ANNUNCI RECENTI</Text>
              {current.sales.map((sale, idx) => {
                const cleanImg = cleanImageUrl(sale.image)
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.saleRow}
                    onPress={() => sale.itemUrl && Linking.openURL(sale.itemUrl)}
                    activeOpacity={0.7}
                  >
                    {cleanImg ? (
                      <Image
                        source={{ uri: cleanImg }}
                        style={styles.saleImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.saleImagePlaceholder}>
                        <Text style={styles.saleImagePlaceholderText}>🃏</Text>
                      </View>
                    )}
                    <View style={styles.saleInfo}>
                      <Text style={styles.saleTitle2} numberOfLines={2}>{sale.title}</Text>
                      <Text style={styles.salePrice}>${sale.price.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.saleArrow}>→</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          {current.sales.length === 0 && (
            <Text style={styles.noData}>Nessun annuncio trovato su eBay</Text>
          )}
        </>
      )}

      {!current && (
        <Text style={styles.noData}>Caricamento prezzi...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 18, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 12 },
  title: { fontSize: 11, color: '#888780', fontWeight: '600', marginBottom: 14, letterSpacing: 0.8 },
  gradeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  gradeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1EFE8', borderWidth: 0.5, borderColor: '#D3D1C7' },
  gradeBtnActive: { backgroundColor: '#534AB7', borderColor: '#534AB7' },
  gradeBtnText: { fontSize: 12, color: '#888780', fontWeight: '500' },
  gradeBtnTextActive: { color: '#fff' },
  avgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  avgLabel: { fontSize: 12, color: '#888780', marginBottom: 4 },
  avgPrice: { fontSize: 28, fontWeight: '600', color: '#2C2C2A' },
  salesCount: { backgroundColor: '#EEEDFE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  salesCountText: { fontSize: 12, color: '#534AB7', fontWeight: '500' },
  salesList: { borderTopWidth: 0.5, borderTopColor: '#F1EFE8', paddingTop: 12 },
  salesTitle: { fontSize: 11, color: '#888780', fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 },
  saleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#F1EFE8', gap: 12 },
  saleImage: { width: 56, height: 78, borderRadius: 4, backgroundColor: '#F1EFE8' },
  saleImagePlaceholder: { width: 56, height: 78, borderRadius: 4, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center' },
  saleImagePlaceholderText: { fontSize: 24 },
  saleInfo: { flex: 1 },
  saleTitle2: { fontSize: 12, color: '#2C2C2A', lineHeight: 16, marginBottom: 4 },
  salePrice: { fontSize: 15, fontWeight: '700', color: '#534AB7' },
  saleArrow: { fontSize: 16, color: '#888780' },
  noData: { fontSize: 13, color: '#888780', textAlign: 'center', paddingVertical: 16 },
})