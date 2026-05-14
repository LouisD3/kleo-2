'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/components/ui/Spinner.jsx'

/**
 * Legacy redirect: /profesor/clase → /profesor (Mis clases home)
 */
export default function LegacyClaseRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/profesor')
  }, [router])

  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  )
}
