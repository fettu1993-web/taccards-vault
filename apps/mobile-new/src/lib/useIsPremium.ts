import { useState, useEffect } from 'react'
import { apiFetch } from './api'

export function useIsPremium() {
  const [isPremium, setIsPremium] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    apiFetch('/stripe/status')
      .then((res) => {
        console.log('isPremium response:', JSON.stringify(res))
        setIsPremium(res.isPremium ?? false)
      })
      .catch((e) => {
        console.log('isPremium error:', e)
        setIsPremium(false)
      })
      .finally(() => setLoading(false))
  }, [])

  return { isPremium, loading }
}