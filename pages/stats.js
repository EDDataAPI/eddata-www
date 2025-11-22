import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function StatsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /status page where statistics are now integrated
    router.replace('/status')
  }, [router])

  return null
}
