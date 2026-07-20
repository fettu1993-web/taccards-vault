import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')

const SLIDES = [
  {
    emoji: '📊',
    title: 'Traccia la tua collezione',
    subtitle: 'Aggiungi le tue carte, monitora il valore di mercato e calcola il ROI come un investitore.',
  },
  {
    emoji: '🔍',
    title: 'Cerca e aggiungi in secondi',
    subtitle: 'Sfoglia il catalogo, scegli grade e condizione, e tieni tutto sotto controllo.',
  },
  {
    emoji: '📦',
    title: 'Sealed products inclusi',
    subtitle: 'Traccia anche box e case sigillati. Il tuo portafoglio carte completo, in un unico posto.',
  },
]

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)

  const isLast = index === SLIDES.length - 1
  const slide = SLIDES[index]

  async function handleNext() {
    if (isLast) {
      await AsyncStorage.setItem('onboarding_done', 'true')
      onDone()
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <View style={s.root}>
      {/* Dots */}
      <View style={s.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[s.dot, i === index && s.dotActive]} />
        ))}
      </View>

      {/* Content */}
      <View style={s.content}>
        <Text style={s.emoji}>{slide.emoji}</Text>
        <Text style={s.title}>{slide.title}</Text>
        <Text style={s.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <TouchableOpacity style={s.btn} onPress={handleNext}>
          <Text style={s.btnText}>{isLast ? 'Inizia ora' : 'Continua'}</Text>
        </TouchableOpacity>
        {!isLast && (
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.setItem('onboarding_done', 'true')
            onDone()
          }}>
            <Text style={s.skip}>Salta</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1EFE8', paddingHorizontal: 32, paddingVertical: 60, justifyContent: 'space-between' },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D3D1C7' },
  dotActive: { backgroundColor: '#534AB7', width: 24 },
  content: { alignItems: 'center', gap: 20 },
  emoji: { fontSize: 72 },
  title: { fontSize: 28, fontWeight: '700', color: '#2C2C2A', textAlign: 'center', lineHeight: 36 },
  subtitle: { fontSize: 16, color: '#888780', textAlign: 'center', lineHeight: 24 },
  actions: { gap: 16, alignItems: 'center' },
  btn: { backgroundColor: '#534AB7', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  skip: { color: '#888780', fontSize: 14 },
})