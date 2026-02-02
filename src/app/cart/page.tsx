'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke dashboard cart tab
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Mengalihkan...</p>
      </div>
    </div>
  )
}
