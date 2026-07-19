import { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { api } from '../../lib/api'
import { useRouter } from 'expo-router'

type ScanState = 'idle' | 'scanning' | 'result' | 'notfound'

interface ScanResult {
  cardId: string | null
  card: any | null
  confidence: number
  provider: string
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [result, setResult] = useState<ScanResult | null>(null)
  const cameraRef = useRef<any>(null)
  const router = useRouter()

  async function scanFromCamera() {
    if (!permission?.granted) {
      await requestPermission()
      return
    }

    setScanState('scanning')
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 0.8,
      })

      if (!photo?.base64) throw new Error('Foto non acquisita')

      const res = await api.post('/scan', { imageBase64: photo.base64 })
      setResult(res.data)
      setScanState(res.data.cardId ? 'result' : 'notfound')
    } catch (err) {
      Alert.alert('Errore', 'Scansione non riuscita. Riprova.')
      setScanState('idle')
    }
  }

  async function scanFromGallery() {
    const picked = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.8,
    })

    if (picked.canceled || !picked.assets[0]?.base64) return

    setScanState('scanning')
    try {
      const res = await api.post('/scan', { imageBase64: picked.assets[0].base64 })
      setResult(res.data)
      setScanState(res.data.cardId ? 'result' : 'notfound')
    } catch {
      Alert.alert('Errore', 'Scansione non riuscita. Riprova.')
      setScanState('idle')
    }
  }

  async function addToCollection() {
    if (!result?.cardId) return
    try {
      await api.post('/collection', { cardId: result.cardId })
      Alert.alert('Aggiunta!', 'Carta aggiunta alla tua collezione.')
      setScanState('idle')
      setResult(null)
    } catch {
      Alert.alert('Errore', "Impossibile aggiungere la carta.")
    }
  }

  if (!permission) return <View style={styles.container} />

  return (
    <View style={styles.container}>
      {/* Camera preview */}
      {(scanState === 'idle' || scanState === 'scanning') && permission.granted && (
        <CameraView ref={cameraRef} style={styles.camera}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Inquadra la carta nel riquadro</Text>
          </View>
        </CameraView>
      )}

      {!permission.granted && (
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>
            Permesso fotocamera necessario per la scansione
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Concedi permesso</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {scanState === 'scanning' && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7F77DD" />
          <Text style={styles.loadingText}>Analisi in corso...</Text>
        </View>
      )}

      {/* Risultato trovato */}
      {scanState === 'result' && result?.card && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Carta identificata</Text>
          <Text style={styles.confidence}>
            Confidenza: {(result.confidence * 100).toFixed(0)}%
          </Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardPlayer}>{result.card.playerName ?? result.card.name}</Text>
            <Text style={styles.cardSet}>{result.card.year} {result.card.setName}</Text>
            {result.card.parallel && (
              <Text style={styles.cardParallel}>{result.card.parallel}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={addToCollection}>
            <Text style={styles.buttonText}>Aggiungi alla collezione</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => setScanState('idle')}>
            <Text style={styles.buttonSecondaryText}>Scansiona un'altra carta</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Non trovata */}
      {scanState === 'notfound' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Carta non riconosciuta</Text>
          <Text style={styles.notFoundText}>
            La carta non è stata trovata nel database.
            Puoi cercarla manualmente o aggiungerla tu stesso.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/search')}
          >
            <Text style={styles.buttonText}>Cerca manualmente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={() => setScanState('idle')}>
            <Text style={styles.buttonSecondaryText}>Riprova scansione</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottoni azione */}
      {scanState === 'idle' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={scanFromCamera}>
            <Text style={styles.buttonText}>📷  Scansiona</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary} onPress={scanFromGallery}>
            <Text style={styles.buttonSecondaryText}>🖼  Scegli da galleria</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8' },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: {
    width: 260,
    height: 360,
    borderWidth: 2,
    borderColor: '#7F77DD',
    borderRadius: 12,
  },
  scanHint: { color: '#fff', marginTop: 16, fontSize: 14 },
  permissionBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permissionText: { color: '#444441', textAlign: 'center', marginBottom: 24, fontSize: 16 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 16 },
  resultContainer: { flex: 1, padding: 24 },
  resultTitle: { fontSize: 22, fontWeight: '500', color: '#2C2C2A', marginBottom: 4 },
  confidence: { fontSize: 13, color: '#888780', marginBottom: 20 },
  cardInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  cardPlayer: { fontSize: 20, fontWeight: '500', color: '#2C2C2A' },
  cardSet: { fontSize: 14, color: '#888780', marginTop: 4 },
  cardParallel: {
    fontSize: 13,
    color: '#534AB7',
    marginTop: 8,
    fontWeight: '500',
  },
  notFoundText: { color: '#888780', fontSize: 15, lineHeight: 22, marginBottom: 24 },
  button: {
    backgroundColor: '#534AB7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  buttonSecondary: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#534AB7',
  },
  buttonSecondaryText: { color: '#534AB7', fontSize: 16, fontWeight: '500' },
  actions: { padding: 24, gap: 12 },
})
