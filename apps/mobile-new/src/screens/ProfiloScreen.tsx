import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Carta } from '../types'

export function ProfiloScreen({ user, onLogout, carte }: {
  user: any
  onLogout: () => void
  carte: Carta[]
}) {
  const categorieStats = ['Calcio', 'Basket', 'F1', 'Baseball', 'Football'].map(cat => ({
    nome: cat,
    count: carte.filter(c => c.categoria === cat).length,
  })).filter(s => s.count > 0)

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.screenTitle}>Profilo</Text>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{user?.email?.[0]?.toUpperCase() ?? 'U'}</Text>
        </View>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <Text style={styles.profilePlan}>Piano Free</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{carte.length}</Text>
          <Text style={styles.statLabel}>Carte</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Sealed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Watchlist</Text>
        </View>
      </View>

      {categorieStats.length > 0 && (
        <View style={styles.menuCard}>
          <Text style={[styles.menuItemText, { padding: 16, fontWeight: '500' }]}>Per categoria</Text>
          {categorieStats.map((stat) => (
            <View key={stat.nome} style={styles.menuItem}>
              <Text style={styles.menuItemText}>{stat.nome}</Text>
              <Text style={styles.statBadge}>{stat.count} carte</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.menuCard}>
        {['Prodotti sigillati', 'Watchlist prezzi', 'Impostazioni'].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.btnLogout} onPress={onLogout}>
        <Text style={styles.btnLogoutText}>Esci dall'account</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1EFE8' },
  screenContent: { padding: 20, paddingBottom: 40 },
  screenTitle: { fontSize: 24, fontWeight: '500', color: '#2C2C2A', marginTop: 40, marginBottom: 20 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#534AB7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { fontSize: 28, color: '#fff', fontWeight: '500' },
  profileEmail: { fontSize: 16, color: '#2C2C2A', fontWeight: '500', marginBottom: 4 },
  profilePlan: { fontSize: 13, color: '#888780' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: '#D3D1C7' },
  statNum: { fontSize: 24, fontWeight: '500', color: '#534AB7' },
  statLabel: { fontSize: 12, color: '#888780', marginTop: 2 },
  statBadge: { fontSize: 13, color: '#534AB7', fontWeight: '500' },
  menuCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#D3D1C7', marginBottom: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#D3D1C7' },
  menuItemText: { fontSize: 15, color: '#2C2C2A' },
  menuItemArrow: { fontSize: 20, color: '#888780' },
  btnLogout: { borderRadius: 8, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E24B4A' },
  btnLogoutText: { color: '#E24B4A', fontSize: 16, fontWeight: '500' },
})