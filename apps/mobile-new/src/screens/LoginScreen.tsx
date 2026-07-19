import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'

export function LoginScreen({ onLogin }: { onLogin: (session: any) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) { setError('Inserisci email e password'); return }
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else onLogin(data.session)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TacCards Vault</Text>
      <Text style={styles.logoSub}>Il tuo portfolio di carte sportive</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888780"
          value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888780"
          value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>Accedi</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: '500', color: '#534AB7', marginBottom: 8 },
  logoSub: { fontSize: 16, color: '#888780', marginBottom: 48 },
  form: { width: '100%', maxWidth: 400, gap: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, fontSize: 16, color: '#2C2C2A', borderWidth: 0.5, borderColor: '#D3D1C7' },
  errorText: { color: '#A32D2D', fontSize: 14, textAlign: 'center' },
  btnPrimary: { backgroundColor: '#534AB7', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '500' },
})