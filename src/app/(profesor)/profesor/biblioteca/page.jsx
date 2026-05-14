'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BibliotecaRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/profesor/programa')
  }, [router])

  return null
}
