'use client'

import { useState, useEffect } from 'react'
import OnboardingModal from './OnboardingModal'
import { ToastContainer } from '@/lib/toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  // Expose toast function globally for use across tools
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }))
      }
    }
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      <ToastContainer />
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  )
}
