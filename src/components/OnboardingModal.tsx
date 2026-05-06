'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, Building, MapPin, Phone, Mail, Globe, Check, Sparkles } from 'lucide-react'

interface OnboardingProps {
  onComplete: () => void
}

const businessTypes = [
  'Restaurant/Café', 'Salon/Schoonheid', 'Auto Werkplaats', 'Loodgieter',
  'Elektricien', 'Timmerman', 'Schilder', 'Hovenier', 'Makelaar',
  'Tandarts', 'Fysiotherapie', 'Winkel', 'Hotel', 'Sportclub', 'Overig'
]

const steps = [
  { title: 'Welkom', subtitle: 'Laten we je profiel opzetten' },
  { title: 'Bedrijf', subtitle: 'Basis informatie' },
  { title: 'Contact', subtitle: 'Hoe klanten je bereiken' },
  { title: 'Klaar!', subtitle: 'Je bent klaar om te beginnen' }
]

export default function OnboardingModal({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    type: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    googleReviewLink: ''
  })
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onComplete])

  // Focus first input on step 1
  useEffect(() => {
    if (step === 1 && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [step])

  // Trap focus within modal
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstEl = focusableElements[0] as HTMLElement
    const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    // Initial focus
    firstEl?.focus()

    return () => modal.removeEventListener('keydown', handleTab)
  }, [])

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleComplete = () => {
    // Save to localStorage
    localStorage.setItem('localboost_business_profile', JSON.stringify(data))
    localStorage.setItem('localboost_onboarding_done', 'true')
    onComplete()
  }

  const canContinue = () => {
    if (step === 0) return true
    if (step === 1) return data.name && data.type
    if (step === 2) return data.city
    return true
  }

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="w-full max-w-lg bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Welkom bij LocalBoost</h2>
                <p className="text-white/70 text-sm">Stap {step + 1} van {steps.length}</p>
              </div>
            </div>
            <button 
              onClick={handleComplete}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex gap-1 mt-4">
            {steps.map((_, i) => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full transition ${
                  i <= step ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-1">{steps[step].title}</h3>
          <p className="text-slate-400 mb-6">{steps[step].subtitle}</p>

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <p className="text-violet-300 text-sm">
                  Wij helpen je met het bouwen van je online aanwezigheid. 
                  Vul even je basisgegevens in en we personaliseren alles voor jou.
                </p>
              </div>
              <div className="space-y-2">
                {[
                  '✓ 10 gratis tools voor lokale groei',
                  '✓ Gepersonaliseerde templates',
                  '✓ Sla je gegevens op voor later',
                  '✓ Geen account nodig'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Bedrijfsnaam *</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={data.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Bijv. De Loodgieter Amsterdam"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Type bedrijf *</label>
                <select
                  value={data.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                >
                  <option value="">Selecteer type...</option>
                  {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Stad/Regio *</label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Bijv. Amsterdam"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Telefoon</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="06 12345678"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="info@voorbeeld.nl"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Website</label>
                <input
                  type="url"
                  value={data.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://jouwwebsite.nl"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Google Review Link</label>
                <input
                  type="url"
                  value={data.googleReviewLink}
                  onChange={(e) => handleChange('googleReviewLink', e.target.value)}
                  placeholder="https://g.page/r/.../review"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Je bent klaar!</h3>
              <p className="text-slate-400 mb-6">
                {data.name} is ingesteld. Al je tools worden nu gepersonaliseerd.
              </p>
              <div className="bg-slate-900 rounded-xl p-4 text-left">
                <div className="text-sm text-slate-400 mb-2">Jouw profiel:</div>
                <div className="space-y-1 text-sm">
                  <div>🏢 {data.name || '-'}</div>
                  <div>📍 {data.city || '-'}</div>
                  {data.phone && <div>📱 {data.phone}</div>}
                  {data.email && <div>📧 {data.email}</div>}
                  {data.website && <div>🌐 {data.website}</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          {/* Step completion hint */}
          {step > 0 && step < steps.length - 1 && (
            <div className="text-center text-xs text-slate-500 mb-3">
              {step === 1 && !data.name ? '✓ Bedrijfsnaam nodig om door te gaan' :
               step === 1 && !data.type ? '✓ Type bedrijf nodig om door te gaan' :
               '✓ Verplichte velden ingevuld'}
            </div>
          )}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition text-sm"
              >
                ← Terug
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canContinue()}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm"
              >
                {step === 1 && !data.city ? 'Overslaan' : 'Volgende'} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm"
              >
                <Sparkles className="w-4 h-4" /> Start met Bouwen!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
