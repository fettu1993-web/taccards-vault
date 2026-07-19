import { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { supabase } from './src/lib/supabase'
import { apiFetch } from './src/lib/api'
import { Carta, mapUserCard } from './src/types'
import { TabBar } from './src/components/TabBar'
import { LoginScreen } from './src/screens/LoginScreen'
import { CollezioneScreen } from './src/screens/CollezioneScreen'
import { CercaScreen } from './src/screens/CercaScreen'
import { ScannerScreen } from './src/screens/ScannerScreen'
import { ProfiloScreen } from './src/screens/ProfiloScreen'
import { Alert } from 'react-native'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('collezione')
  const [collezione, setCollezione] = useState<Carta[]>([])
  const [loadingCollection, setLoadingCollection] = useState(false)

  const user = session?.user
  const token = session?.access_token

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (token) fetchCollection()
  }, [token])

  async function fetchCollection() {
    setLoadingCollection(true)
    try {
      const res = await apiFetch('/collection')
      setCollezione(res.data.map(mapUserCard))
    } catch (e) {
      console.error('Errore caricamento collezione:', e)
    }
    setLoadingCollection(false)
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '500', color: '#534AB7', marginBottom: 16 }}>TacCards Vault</Text>
        <ActivityIndicator color="#534AB7" />
      </View>
    )
  }

  if (!user) return <LoginScreen onLogin={setSession} />

  const handleLogout = () => {
    supabase.auth.signOut()
    setSession(null)
    setCollezione([])
  }

 async function handleAggiungi(carta: Carta, purchasePrice: number) {
  try {
    await apiFetch('/collection', {
      method: 'POST',
      body: JSON.stringify({ cardId: carta.cardId, condition: 'raw', purchasePrice }),
    })
    await fetchCollection()
    Alert.alert('✅ Aggiunta!', `${carta.player} è stata aggiunta alla tua collezione.`)
  } catch (e: any) {
    Alert.alert('Errore', e.message || 'Non è stato possibile aggiungere la carta.')
  }
}
  async function handleRimuovi(id: string) {
    try {
      await apiFetch(`/collection/${id}`, { method: 'DELETE' })
      setCollezione(prev => prev.filter(c => c.id !== id))
    } catch (e: any) {
      Alert.alert('Errore', e.message || 'Non è stato possibile rimuovere la carta.')
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F1EFE8' }}>
      {activeTab === 'collezione' && <CollezioneScreen carte={collezione} onRimuovi={handleRimuovi} loading={loadingCollection} />}
      {activeTab === 'cerca' && <CercaScreen collezione={collezione} onAggiungi={handleAggiungi} />}
      {activeTab === 'scanner' && <ScannerScreen />}
      {activeTab === 'profilo' && <ProfiloScreen user={user} onLogout={handleLogout} carte={collezione} />}
      <TabBar active={activeTab} onPress={setActiveTab} />
    </View>
  )
}