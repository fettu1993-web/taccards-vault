import { Redirect } from 'expo-router'
import { Tabs } from 'expo-router'
import { useAuthStore } from '../../stores/authStore'

export default function TabsLayout() {
  const { user, loading } = useAuthStore()

  if (loading) return null
  if (!user) return <Redirect href="/(auth)/login" />

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7F77DD',  // c-purple-400
        tabBarInactiveTintColor: '#888780', // c-gray-400
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#D3D1C7',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Portfolio', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="collection"
        options={{ title: 'Collezione', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="scan"
        options={{ title: 'Scansiona', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="market"
        options={{ title: 'Mercato', tabBarIcon: () => null }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profilo', tabBarIcon: () => null }}
      />
    </Tabs>
  )
}
