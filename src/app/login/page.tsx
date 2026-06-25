'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const authToken = localStorage.getItem('user_id')
    if (authToken) {
      router.push('/dashboard')
    }
  }, [router])

  return <LoginForm />
}
