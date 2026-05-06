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
