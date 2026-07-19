import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuthStore()
  const router = useRouter()

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    try {
      await signIn(email, password)
      router.replace('/(tabs)')
    } catch (err: any) {
      Alert.alert('Errore', err.message ?? 'Accesso non riuscito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>TacCards Vault</Text>
        <Text style={styles.subtitle}>Il tuo portfolio di carte sportive</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888780"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888780"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Non hai un account? </Text>
            <Link href="/(auth)/register">
              <Text style={styles.link}>Registrati</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1EFE8' },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: '500', color: '#534AB7', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888780', textAlign: 'center', marginTop: 4, marginBottom: 40 },
  form: { gap: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#2C2C2A',
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  button: {
    backgroundColor: '#534AB7',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#888780', fontSize: 14 },
  link: { color: '#534AB7', fontSize: 14, fontWeight: '500' },
})
