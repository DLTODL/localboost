'use client'

import { useState, useEffect } from 'react'
import OnboardingModal from './OnboardingModal'
import { ToastContainer } from '@/lib/toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if onboarding is complete OR if explicitly triggered
    const onboardingDone = localStorage.getItem('localboost_onboarding_done')
    const showOnboarding = localStorage.getItem('localboost_show_onboarding')
    
    // Show onboarding if: not done OR explicitly triggered (e.g., from Settings)
    if (showOnboarding) {
      localStorage.removeItem('localboost_show_onboarding')
      setShowOnboarding(true)
    } else if (!onboardingDone) {
      // First time user: delay 1.5s for better UX
      const timer = setTimeout(() => setShowOnboarding(true), 1500)
      return () => clearTimeout(timer)
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
