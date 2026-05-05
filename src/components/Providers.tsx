'use client'

import { useState, useEffect } from 'react'
import OnboardingModal from './OnboardingModal'
import { Toast } from '@/lib/useSharedData'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    setMounted(true)
    // Check if onboarding is complete
    const onboardingDone = localStorage.getItem('localboost_onboarding_done')
    if (!onboardingDone) {
      // Delay showing onboarding by 1.5 seconds to let page load
      const timer = setTimeout(() => setShowOnboarding(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Expose toast function globally
  useEffect(() => {
    (window as any).showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type })
      setTimeout(() => setToast(null), 3000)
    }
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
      {toast && (
        <div className={`fixed bottom-6 right-6 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-violet-600'} text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-pulse`}>
          {toast.message}
        </div>
      )}
    </>
  )
}
