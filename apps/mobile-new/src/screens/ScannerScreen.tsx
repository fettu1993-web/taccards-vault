import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export function ScannerScreen() {
  return (
    <View style={styles.centered}>
      <Text style={styles.scannerIcon}>📷</Text>
      <Text style={styles.scannerTitle}>Scansiona carta</Text>
      <Text style={styles.scannerSub}>Inquadra la carta con la fotocamera per identificarla automaticamente</Text>
      <TouchableOpacity style={styles.btnPrimary}>
        <Text style={styles.btnPrimaryText}>Apri fotocamera</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F1EFE8' },
  scannerIcon: { fontSize: 64, marginBottom: 16 },
  scannerTitle: { fontSize: 22, fontWeight: '500', color: '#2C2C2A', marginBottom: 8 },
  scannerSub: { fontSize: 15, color: '#888780', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btnPrimary: { backgroundColor: '#534AB7', borderRadius: 8, padding: 16, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '500' },
})