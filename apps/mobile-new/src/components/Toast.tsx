import { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet, View } from 'react-native'

export type ToastType = 'success' | 'error'

export interface ToastMessage {
  text: string
  type: ToastType
}

export function Toast({ message, onHide }: { message: ToastMessage | null, onHide: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!message) return
    opacity.setValue(0)
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide())
  }, [message])

  if (!message) return null

  return (
    <Animated.View style={[s.wrap, message.type === 'error' ? s.error : s.success, { opacity }]}>
      <Text style={s.text}>{message.text}</Text>
    </Animated.View>
  )
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 90, left: 20, right: 20, borderRadius: 12, padding: 16, zIndex: 999, alignItems: 'center' },
  success: { backgroundColor: '#3B6D11' },
  error: { backgroundColor: '#A32D2D' },
  text: { color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' },
})