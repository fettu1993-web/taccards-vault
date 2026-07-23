import { useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Modal, Image, Platform
} from 'react-native'
import { Carta } from '../types'

const { width } = Dimensions.get('window')
const IS_WEB = Platform.OS === 'web'
const IS_MOBILE_WEB = IS_WEB && width < 768

const PAGE_WIDTH = IS_MOBILE_WEB
  ? (width - 16) / 2
  : (Math.min(width * 0.48, 400))

const SLOT_WIDTH_MOBILE = (PAGE_WIDTH - 8) / 3
const GAP = 3
interface Props {
  carte: Carta[]
}

export function BinderScreen({ carte }: Props) {
  const [currentSpread, setCurrentSpread] = useState(0)
  const [selectedCarta, setSelectedCarta] = useState<Carta | null>(null)

  const SLOTS_PER_SPREAD = 18
  const totalSpreads = Math.max(1, Math.ceil(carte.length / SLOTS_PER_SPREAD))
  const startIdx = currentSpread * SLOTS_PER_SPREAD
  const carteSpread = carte.slice(startIdx, startIdx + SLOTS_PER_SPREAD)

  const leftSlots: (Carta | null)[] = [
    ...carteSpread.slice(0, 9),
    ...Array(Math.max(0, 9 - carteSpread.slice(0, 9).length)).fill(null)
  ]
  const rightSlots: (Carta | null)[] = [
    ...carteSpread.slice(9, 18),
    ...Array(Math.max(0, 9 - carteSpread.slice(9, 18).length)).fill(null)
  ]

  function renderSlot(carta: Carta | null, idx: number) {
    return (
      <TouchableOpacity
        key={idx}
        style={styles.slot}
        onPress={() => carta && setSelectedCarta(carta)}
        activeOpacity={carta ? 0.85 : 1}
      >
        {carta ? (
          <View style={styles.sleeve}>
            <View style={styles.sleeveShine} />
            <View style={styles.sleeveBorder} />
            {carta.imageUrl ? (
              <Image source={{ uri: carta.imageUrl }} style={styles.cardImage} resizeMode="cover" />
            ) : (
              <View style={styles.cardInner}>
                <Text style={styles.cardPlayer} numberOfLines={2}>{carta.player}</Text>
                <Text style={styles.cardSet} numberOfLines={1}>{carta.set}</Text>
                {carta.grade && carta.grade !== 'Raw' ? (
                  <View style={styles.gradeBadge}>
                    <Text style={styles.gradeText}>{carta.grade}</Text>
                  </View>
                ) : null}
                <Text style={styles.cardValue}>€{carta.currentPrice ?? '—'}</Text>
              </View>
            )}
            {carta.imageUrl && carta.grade && carta.grade !== 'Raw' && (
              <View style={styles.gradeBadgeOverlay}>
                <Text style={styles.gradeText}>{carta.grade}</Text>
              </View>
            )}
            {carta.imageUrl && (
              <View style={styles.priceOverlay}>
                <Text style={styles.priceOverlayText}>€{carta.currentPrice ?? '—'}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <View style={styles.emptySleeveShine} />
            <Text style={styles.plusIcon}>+</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  function renderPage(slots: (Carta | null)[], side: 'left' | 'right') {
    return (
      <View style={[styles.page, side === 'left' ? styles.pageLeft : styles.pageRight]}>
        <View style={[styles.rings, side === 'left' ? styles.ringsRight : styles.ringsLeft]}>
          {[0, 1, 2].map(i => <View key={i} style={styles.ring} />)}
        </View>
        <View style={styles.grid}>
          {slots.map((carta, idx) => renderSlot(carta, idx))}
        </View>
        <Text style={styles.pageNumber}>
          {side === 'left' ? currentSpread * 2 + 1 : currentSpread * 2 + 2}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📒 Il mio Binder</Text>
        <Text style={styles.subtitle}>{carte.length} carte · {totalSpreads} {totalSpreads === 1 ? 'apertura' : 'aperture'}</Text>
      </View>

      <View style={styles.spread}>
        {renderPage(leftSlots, 'left')}
        <View style={styles.spine}>
          <View style={styles.spineInner} />
        </View>
        {renderPage(rightSlots, 'right')}
      </View>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, currentSpread === 0 && styles.navBtnDisabled]}
          onPress={() => setCurrentSpread(p => Math.max(0, p - 1))}
          disabled={currentSpread === 0}
        >
          <Text style={[styles.navBtnText, currentSpread === 0 && styles.navBtnTextDisabled]}>← Prec</Text>
        </TouchableOpacity>
        <View style={styles.dots}>
          {Array(totalSpreads).fill(null).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentSpread(i)}>
              <View style={[styles.dot, i === currentSpread && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.navBtn, currentSpread === totalSpreads - 1 && styles.navBtnDisabled]}
          onPress={() => setCurrentSpread(p => Math.min(totalSpreads - 1, p + 1))}
          disabled={currentSpread === totalSpreads - 1}
        >
          <Text style={[styles.navBtnText, currentSpread === totalSpreads - 1 && styles.navBtnTextDisabled]}>Succ →</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedCarta} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setSelectedCarta(null)} activeOpacity={1}>
          <View style={styles.modal}>
            {selectedCarta?.imageUrl && (
              <Image source={{ uri: selectedCarta.imageUrl }} style={styles.modalImage} resizeMode="contain" />
            )}
            <Text style={styles.modalPlayer}>{selectedCarta?.player}</Text>
            <Text style={styles.modalSet}>{selectedCarta?.set}</Text>
            {selectedCarta?.grade && selectedCarta.grade !== 'Raw' && (
              <View style={styles.modalGradeBadge}>
                <Text style={styles.modalGradeText}>{selectedCarta.grade}</Text>
              </View>
            )}
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>Acquistato</Text>
                <Text style={styles.modalStatValue}>€{selectedCarta?.buyPrice ?? '—'}</Text>
              </View>
              <View style={styles.modalDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>Valore</Text>
                <Text style={styles.modalStatValue}>€{selectedCarta?.currentPrice ?? '—'}</Text>
              </View>
              <View style={styles.modalDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>ROI</Text>
                <Text style={[styles.modalStatValue, { color: '#4CAF50' }]}>
                  {selectedCarta?.buyPrice && selectedCarta?.currentPrice
                    ? `+${(((selectedCarta.currentPrice - selectedCarta.buyPrice) / selectedCarta.buyPrice) * 100).toFixed(0)}%`
                    : '—'}
                </Text>
              </View>
            </View>
            <Text style={styles.modalHint}>Tocca per chiudere</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },

  header: {
    paddingHorizontal: 16,
    paddingTop: IS_WEB ? 52 : 48,
    paddingBottom: IS_WEB ? 12 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: IS_WEB ? 20 : 18, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: IS_WEB ? 12 : 11, color: 'rgba(255,255,255,0.5)' },

  spread: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: IS_WEB ? 8 : 4,
    marginBottom: IS_WEB ? 8 : 4,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  page: {
    flex: 1,
    backgroundColor: '#2a2a3e',
    padding: IS_WEB ? 8 : 6,
    paddingBottom: 20,
  },
  pageLeft: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
  pageRight: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },

  spine: { width: IS_WEB ? 12 : 8, backgroundColor: '#111122', alignItems: 'center', justifyContent: 'center' },
  spineInner: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 8, borderRadius: 1 },

  rings: {
    position: 'absolute', top: 0, bottom: 0, width: 16,
    justifyContent: 'space-evenly', alignItems: 'center', zIndex: 10,
  },
  ringsLeft: { left: -8 },
  ringsRight: { right: -8 },
  ring: {
    width: IS_WEB ? 14 : 10,
    height: IS_WEB ? 14 : 10,
    borderRadius: IS_WEB ? 7 : 5,
    backgroundColor: '#111122',
    borderWidth: 2,
    borderColor: '#444',
  },

  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: IS_WEB ? 4 : 3,
    padding: IS_WEB ? 4 : 3,
    alignContent: 'flex-start',
    width: '100%',
  },

  slot: {
    width: IS_WEB ? '31%' : SLOT_WIDTH_MOBILE,
    height: IS_WEB ? undefined : SLOT_WIDTH_MOBILE * 1.4,
    aspectRatio: IS_WEB ? 0.71 : undefined,
    borderRadius: 4,
    overflow: 'hidden',
    margin: IS_WEB ? '1%' : 0,
  },

  sleeve: {
    flex: 1,
    backgroundColor: 'rgba(180,210,255,0.12)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(180,210,255,0.35)',
    overflow: 'hidden',
  },
  sleeveShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderTopLeftRadius: 4, borderTopRightRadius: 4, zIndex: 2,
  },
  sleeveBorder: {
    position: 'absolute', top: 2, left: 2, right: 2, bottom: 2,
    borderRadius: 3, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', zIndex: 2,
  },
  cardImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardInner: { flex: 1, padding: 4, justifyContent: 'space-between' },
  cardPlayer: { fontSize: IS_WEB ? 8 : 7, fontWeight: '700', color: '#fff', lineHeight: 10 },
  cardSet: { fontSize: IS_WEB ? 6 : 5, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
  gradeBadge: {
    backgroundColor: '#534AB7', borderRadius: 2,
    paddingHorizontal: 3, paddingVertical: 1, alignSelf: 'flex-start', marginTop: 2,
  },
  gradeText: { fontSize: 6, color: '#fff', fontWeight: '700' },
  cardValue: { fontSize: IS_WEB ? 8 : 7, fontWeight: '700', color: '#a78bfa', marginTop: 2 },

  gradeBadgeOverlay: {
    position: 'absolute', top: 3, left: 3,
    backgroundColor: '#534AB7', borderRadius: 2,
    paddingHorizontal: 3, paddingVertical: 1, zIndex: 3,
  },
  priceOverlay: {
    position: 'absolute', bottom: 3, right: 3,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 3,
    paddingHorizontal: 3, paddingVertical: 2, zIndex: 3,
  },
  priceOverlayText: { fontSize: 7, color: '#a78bfa', fontWeight: '700' },

  emptySlot: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  emptySleeveShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  plusIcon: { fontSize: IS_WEB ? 14 : 10, color: 'rgba(255,255,255,0.15)' },

  pageNumber: {
    position: 'absolute', bottom: 4, fontSize: 8,
    color: 'rgba(255,255,255,0.2)', width: '100%', textAlign: 'center',
  },

  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: IS_WEB ? 12 : 8,
    paddingTop: IS_WEB ? 0 : 4,
  },
  navBtn: {
    paddingHorizontal: IS_WEB ? 16 : 12,
    paddingVertical: IS_WEB ? 8 : 6,
    backgroundColor: '#534AB7', borderRadius: 8,
  },
  navBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  navBtnText: { color: '#fff', fontWeight: '600', fontSize: IS_WEB ? 13 : 12 },
  navBtnTextDisabled: { color: 'rgba(255,255,255,0.3)' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotActive: { backgroundColor: '#534AB7' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modal: {
    backgroundColor: '#2a2a3e', borderRadius: 16, padding: 24,
    width: IS_WEB ? width - 64 : width - 48,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  modalImage: {
    width: IS_WEB ? 160 : 130,
    height: IS_WEB ? 220 : 180,
    borderRadius: 8, marginBottom: 16,
  },
  modalPlayer: { fontSize: IS_WEB ? 20 : 17, fontWeight: '700', color: '#fff', textAlign: 'center' },
  modalSet: { fontSize: IS_WEB ? 13 : 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'center' },
  modalGradeBadge: { backgroundColor: '#534AB7', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  modalGradeText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  modalStats: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  modalStat: { flex: 1, alignItems: 'center' },
  modalDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' },
  modalStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  modalStatValue: { fontSize: IS_WEB ? 16 : 14, fontWeight: '700', color: '#fff', marginTop: 4 },
  modalHint: { fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 20 },
})