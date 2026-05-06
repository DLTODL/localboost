'use client'

import { useState, useEffect, useCallback } from 'react'
import OnboardingModal from './OnboardingModal'
import { ToastContainer } from '@/lib/toast'
import { useOnboarding } from '@/lib/useSharedData'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { complete: onboardingComplete } = useOnboarding()

  useEffect(() => {
    setMounted(true)
    // Check if onboarding is complete OR if explicitly triggered
    const onboardingDone = localStorage.getItem('localboost_onboarding_done')
    const showOnboarding = localStorage.getItem('localboost_show_onboarding')
    const dismissedBanner = localStorage.getItem('localboost_banner_dismissed')
    
    // Show onboarding if: not done OR explicitly triggered (e.g., from Settings)
    if (showOnboarding) {
      localStorage.removeItem('localboost_show_onboarding')
      setShowOnboarding(true)
    } else if (!onboardingDone) {
      // First time user: delay 1.5s for better UX
      const timer = setTimeout(() => setShowOnboarding(true), 1500)
      return () => clearTimeout(timer)
    } else if (onboardingDone && !dismissedBanner) {
      // Returning user with profile but banner not dismissed - show welcome back
      const hasProfile = localStorage.getItem('localboost_business_profile')
      if (hasProfile) {
        const timer = setTimeout(() => setShowWelcomeBanner(true), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [onboardingComplete])

  const dismissBanner = () => {
    setShowWelcomeBanner(false)
    localStorage.setItem('localboost_banner_dismissed', 'true')
  }

  if (!mounted) return <>{children}</>

  return (
    <>
      {children}
      <ToastContainer />
      
      {/* Welcome back banner for returning users */}
      {showWelcomeBanner && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 animate-slide-down">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span>👋</span>
              <span>Welkom terug! Je profiel is geladen. <a href="/tools/lead-finder" className="underline font-medium">Start met leads zoeken →</a></span>
            </div>
            <button 
              onClick={dismissBanner}
              className="text-white/70 hover:text-white text-sm"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
      
      {showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  )
}
