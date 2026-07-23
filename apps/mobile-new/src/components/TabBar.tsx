import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const TABS = [
  { id: 'collezione', label: 'Collezione', icon: '🏠' },
  { id: 'cerca', label: 'Cerca', icon: '🔍' },
  { id: 'binder', label: 'Binder', icon: '📒' },
  { id: 'scanner', label: 'Scanner', icon: '📷' },
  { id: 'watchlist', label: 'Watchlist', icon: '👁️' },
  { id: 'profilo', label: 'Profilo', icon: '👤' },
]

export function TabBar({ active, onPress }: { active: string, onPress: (id: string) => void }) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onPress(tab.id)}>
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.id && styles.labelActive]}>{tab.label}</Text>
          {active === tab.id && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#D3D1C7', paddingBottom: 8 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8, position: 'relative' },
  icon: { fontSize: 18, marginBottom: 2 },
  label: { fontSize: 10, color: '#888780' },
  labelActive: { color: '#534AB7', fontWeight: '500' },
  indicator: { position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, backgroundColor: '#534AB7', borderRadius: 1 },
})