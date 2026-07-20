import { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from './src/lib/supabase'
import { apiFetch } from './src/lib/api'
import { Carta, mapUserCard } from './src/types'
import { TabBar } from './src/components/TabBar'
import { Toast, ToastMessage } from './src/components/Toast'
import { LoginScreen } from './src/screens/LoginScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { CollezioneScreen } from './src/screens/CollezioneScreen'
import { CercaScreen } from './src/screens/CercaScreen'
import { ScannerScreen } from './src/screens/ScannerScreen'
import { SealedProductsScreen } from './src/screens/SealedProductsScreen'
import { ProfiloScreen } from './src/screens/ProfiloScreen'
import { CartaDetailScreen } from './src/screens/CartaDetailScreen'
import { AdminScreen } from './src/screens/AdminScreen'

const ADMIN_EMAIL = 'fettu1993@gmail.com'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState('collezione')
  const [collezione, setCollezione] = useState<Carta[]>([])
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [cartaDettaglio, setCartaDettaglio] = useState<Carta | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)

  const user = session?.user
  const token = session?.access_token
  const isAdmin = user?.email === ADMIN_EMAIL

  function showToast(text: string, type: 'success' | 'error') {
    setToast({ text, type })
  }

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
    AsyncStorage.getItem('onboarding_done').then(val => {
      setShowOnboarding(val !== 'true')
    })
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

  if (loading || showOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '500', color: '#534AB7', marginBottom: 16 }}>TacCards Vault</Text>
        <ActivityIndicator color="#534AB7" />
      </View>
    )
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={() => setShowOnboarding(false)} />
  }

  if (!user) return <LoginScreen onLogin={setSession} />

  const handleLogout = () => {
    supabase.auth.signOut()
    setSession(null)
    setCollezione([])
  }

  async function handleAggiungi(
    carta: Carta,
    purchasePrice: number,
    condition: string,
    gradeCompany: string | null,
    gradeValue: string | null
  ) {
    try {
      await apiFetch('/collection', {
        method: 'POST',
        body: JSON.stringify({
          cardId: carta.cardId,
          condition,
          gradeCompany: gradeCompany ?? undefined,
          gradeValue: gradeValue ?? undefined,
          purchasePrice,
        }),
      })
      await fetchCollection()
      showToast(`✅ ${carta.player} aggiunta alla collezione!`, 'success')
    } catch (e: any) {
      showToast(typeof e === 'string' ? e : e?.message || 'Non è stato possibile aggiungere la carta.', 'error')
    }
  }

  async function handleRimuovi(id: string) {
    try {
      await apiFetch(`/collection/${id}`, { method: 'DELETE' })
      setCollezione(prev => prev.filter(c => c.id !== id))
      showToast('Carta rimossa dalla collezione.', 'success')
    } catch (e: any) {
      showToast(e.message || 'Non è stato possibile rimuovere la carta.', 'error')
    }
  }

  if (showAdmin && isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1EFE8' }}>
        <AdminScreen onBack={() => setShowAdmin(false)} />
        <Toast message={toast} onHide={() => setToast(null)} />
      </View>
    )
  }

  if (cartaDettaglio) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F1EFE8' }}>
        <CartaDetailScreen
          carta={cartaDettaglio}
          onBack={() => setCartaDettaglio(null)}
          onRimuovi={(id) => {
            handleRimuovi(id)
            setCartaDettaglio(null)
          }}
        />
        <Toast message={toast} onHide={() => setToast(null)} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F1EFE8' }}>
      {activeTab === 'collezione' && (
        <CollezioneScreen
          carte={collezione}
          onRimuovi={handleRimuovi}
          loading={loadingCollection}
          onCartaPress={setCartaDettaglio}
        />
      )}
      {activeTab === 'cerca' && (
        <CercaScreen
          collezione={collezione}
          onAggiungi={handleAggiungi}
          onToast={showToast}
        />
      )}
      {activeTab === 'scanner' && <ScannerScreen />}
      {activeTab === 'sealed' && <SealedProductsScreen />}
      {activeTab === 'profilo' && (
        <ProfiloScreen
          user={user}
          onLogout={handleLogout}
          carte={collezione}
          onAdmin={isAdmin ? () => setShowAdmin(true) : undefined}
        />
      )}
      <TabBar active={activeTab} onPress={setActiveTab} />
      <Toast message={toast} onHide={() => setToast(null)} />
    </View>
  )
}