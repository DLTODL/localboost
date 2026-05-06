'use client'

import { useState, useEffect } from 'react'
import { Star, Copy, Check, MessageSquare, Sparkles, Building, ChevronRight, RotateCcw, ExternalLink, Loader2, Save } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useSelectedBusiness, copyWithToast, showToast } from '@/lib/useSharedData'
import { Skeleton, FormSkeleton } from '@/components/polish/Skeleton'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'

const businessTypes = [
  { id: 'restaurant', label: 'Restaurant/Café', emoji: '🍽️' },
  { id: 'salon', label: 'Salon/Schoonheid', emoji: '💅' },
  { id: 'autos', label: 'Auto/Motor', emoji: '🚗' },
  { id: 'loodgieter', label: 'Loodgieter', emoji: '🔧' },
  { id: 'elektricien', label: 'Elektricien', emoji: '⚡' },
  { id: 'timmerman', label: 'Timmerman', emoji: '🪚' },
  { id: 'schilder', label: 'Schilder', emoji: '🎨' },
  { id: 'huisarts', label: 'Huisarts/Kliniek', emoji: '🏥' },
  { id: 'tandarts', label: 'Tandarts', emoji: '🦷' },
  { id: 'fysio', label: 'Fysiotherapie', emoji: '💆' },
  { id: 'makelaar', label: 'Makelaar', emoji: '🏠' },
  { id: 'horeca', label: 'Hotel/B&B', emoji: '🏨' },
  { id: 'winkel', label: 'Winkel', emoji: '🛍️' },
  { id: 'overig', label: 'Overig', emoji: '✨' },
]

interface GeneratedMessage {
  type: 'sms' | 'whatsapp' | 'email'
  channel: string
  message: string
}

const generateMessages = (businessName: string, businessType: string, customerName: string, reviewLink: string): GeneratedMessage[] => {
  const firstName = customerName.split(' ')[0] || 'daar'
  const linkText = reviewLink || '[JE REVIEW LINK]'
  
  const templates: Record<string, { sms: string; whatsapp: string; email: string }> = {
    restaurant: {
      sms: `Hoi ${firstName}! Bedankt dat je bij ons gegeten hebt 🌟 Zou je ons een review willen geven? Het helpt ons enorm! Hier is de link: ${linkText} - Team ${businessName}`,
      whatsapp: `Hey ${firstName}! 👋\n\nLeuk dat je bij ${businessName} bent geweest! \n\nZou je ons een review willen geven? Het helpt ons enorm om meer mensen te helpen 😊\n\n👉 ${linkText}\n\nAlvast bedankt! 🍽️`,
      email: `Hey ${firstName},\n\nBedankt voor je bezoek aan ${businessName}! 🙏\n\nWe hopen dat je een heerlijke tijd hebt gehad. Als je even momentje hebt, zouden we het enorm waarderen als je een review achterlaat.\n\n👉 ${linkText}\n\nMet vriendelijke groet,\nTeam ${businessName}`
    },
    salon: {
      sms: `Hoi ${firstName}! Vond het leuk je te zien bij ${businessName} 💅 Check deze link en laat een review achter als je even tijd hebt: ${linkText} - Thanks!`,
      whatsapp: `Hey ${firstName}! 💕\n\nLeuk om je weer te zien in de salon! \n\nZou je ons een review willen geven? Het helpt andere mensen om ons te vinden 😊\n\n👉 ${linkText}\n\nBedankt! ✨`,
      email: `Hey ${firstName},\n\nBedankt voor je bezoek aan ${businessName}! 💅\n\nWe waarderen het enorm als je even de tijd neemt om een review achter te laten. Het helpt ons om te groeien!\n\n👉 ${linkText}\n\nTot snel!\n${businessName}`
    },
    default: {
      sms: `Hoi ${firstName}! Bedankt voor je vertrouwen in ${businessName} 🌟 Laat even een review achter via deze link: ${linkText} - Alvast bedankt!`,
      whatsapp: `Hey ${firstName}! 👋\n\nBedankt voor je vertrouwen in ${businessName}. We waarderen het enorm als je even de tijd neemt voor een review!\n\n👉 ${linkText}\n\nAlvast bedankt! 🙏`,
      email: `Hey ${firstName},\n\nBedankt voor je vertrouwen in ${businessName}.\n\nZou je ons een review willen geven? Het helpt ons enorm om meer mensen te helpen.\n\n👉 ${linkText}\n\nMet vriendelijke groet,\n${businessName}`
    }
  }

  const t = templates[businessType] || templates.default

  return [
    { type: 'sms', channel: 'SMS', message: t.sms },
    { type: 'whatsapp', channel: 'WhatsApp', message: t.whatsapp },
    { type: 'email', channel: 'Email', message: t.email }
  ]
}

export default function ReviewGenerator() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('review-generator')
  const { business: selectedBusiness } = useSelectedBusiness()
  
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [reviewLink, setReviewLink] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp')
  const [generating, setGenerating] = useState(false)
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [savedLeads, setSavedLeads] = useState<any[]>([])
  const [showLeadPicker, setShowLeadPicker] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Skeleton loading simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Load saved leads for quick fill
  useEffect(() => {
    const stored = localStorage.getItem('localboost_leads')
    if (stored) {
      try {
        setSavedLeads(JSON.parse(stored))
      } catch {}
    }
  }, [])

  // Pre-fill from profile or selected business
  useEffect(() => {
    if (selectedBusiness) {
      if (selectedBusiness.name && !inputs.businessName) setBusinessName(selectedBusiness.name)
      if (selectedBusiness.phone && !inputs.reviewLink) setReviewLink(selectedBusiness.phone)
    }
    if (profile) {
      if (profile.name && !inputs.businessName && !selectedBusiness) setBusinessName(profile.name)
      if (profile.googleReviewLink && !inputs.reviewLink) setReviewLink(profile.googleReviewLink)
    }
  }, [profile, selectedBusiness, inputs.businessName, inputs.reviewLink])

  // Save inputs on change
  useEffect(() => {
    if (businessName || customerName) {
      saveInputs({ businessName, customerName, reviewLink, businessType })
    }
  }, [businessName, customerName, reviewLink, businessType, saveInputs])

  const handleGenerate = () => {
    if (!businessName || !customerName) return
    setGenerating(true)
    
    setTimeout(() => {
      const generated = generateMessages(businessName, businessType, customerName, reviewLink)
      setMessages(generated)
      setStep(3)
      setGenerating(false)
    }, 800)
  }

  const handleLoadSavedLead = (lead: any) => {
    setBusinessName(lead.company || lead.name)
    setCustomerName(lead.name)
    if (lead.phone) setReviewLink(lead.phone)
    setShowLeadPicker(false)
    showToast('Lead geladen uit CRM', 'success')
  }

  const handleCopy = async (type: string, text: string) => {
    await copyWithToast(text, `${type === 'sms' ? 'SMS' : type === 'whatsapp' ? 'WhatsApp' : 'Email'} gekopieerd!`)
    setCopiedId(type)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReset = () => {
    setStep(1)
    setCustomerName('')
    setMessages([])
    setCopiedId(null)
  }

  const currentMessage = messages.find(m => m.type === activeTab)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      <div className="max-w-3xl mx-auto p-6">
        <div className={isInitialLoad ? 'hidden' : ''}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">⭐</span>
                <div>
                  <h1 className="text-3xl font-black">Review Generator</h1>
                  <p className="text-slate-400">Genereer gepersonaliseerde review-verzoeken</p>
                </div>
              </div>
              <TemplateSwitcher 
                toolId="review-generator"
                onApply={(data) => {
                  if (data.businessName) setBusinessName(data.businessName)
                  if (data.businessType) setBusinessType(data.businessType)
                  if (data.reviewLink) setReviewLink(data.reviewLink)
                }}
                currentData={{ businessName, businessType, reviewLink }}
              />
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full transition ${s <= step ? 'bg-violet-600' : 'bg-slate-700'}`} />
                <div className="text-xs text-slate-500 mt-1">{
                  s === 1 ? 'Bedrijf' : s === 2 ? 'Klant' : 'Genereer'
                }</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Loading */}
        {isInitialLoad && (
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">⭐</span>
                  <div>
                    <Skeleton width={200} height={32} className="mb-2" />
                    <Skeleton width={280} height={18} />
                  </div>
                </div>
                <Skeleton width={140} height={40} />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1">
                  <Skeleton height={8} className="rounded-full" />
                </div>
              ))}
            </div>
            <FormSkeleton fields={4} />
          </div>
        )}

          {/* Step 1: Business Info */}
          {step === 1 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-slide-up">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-violet-400" />
              Jouw Bedrijf
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="De Loodgieter Amsterdam"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Type bedrijf</label>
                <div className="grid grid-cols-3 gap-2">
                  {businessTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setBusinessType(type.id)}
                      className={`p-3 rounded-xl border text-left transition hover-lift ${
                        businessType === type.id
                          ? 'bg-violet-600/20 border-violet-500'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xl mb-1">{type.emoji}</div>
                      <div className="text-xs">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Google Review Link (optioneel)</label>
                <input
                  type="url"
                  value={reviewLink}
                  onChange={(e) => setReviewLink(e.target.value)}
                  placeholder="https://g.page/r/.../review"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!businessName}
              className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              Volgende <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Customer Info */}
        {step === 2 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-slide-up">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-400" />
              Klantgegevens
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Laad uit CRM (optioneel)</label>
              <button
                type="button"
                onClick={() => setShowLeadPicker(!showLeadPicker)}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                <Star className="w-4 h-4" />
                {showLeadPicker ? 'Verberg leads' : `Laad saved lead (${savedLeads.length})`}
              </button>
              {showLeadPicker && savedLeads.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto bg-slate-900 rounded-xl divide-y divide-slate-700">
                  {savedLeads.slice(0, 5).map(lead => (
                    <button
                      key={lead.id}
                      onClick={() => handleLoadSavedLead(lead)}
                      className="w-full p-2 text-left hover:bg-slate-800 transition"
                    >
                      <div className="text-sm font-medium">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.city} • {lead.company || 'Geen bedrijf'}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">Naam klant *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Jan de Vries"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
              />
              <p className="text-xs text-slate-500 mt-2">
                Vul de naam in van de klant die je een review-verzoek wilt sturen
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
              >
                ← Terug
              </button>
              <button
                onClick={handleGenerate}
                disabled={!customerName || generating}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {generating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Genereren...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Genereer Berichten</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && messages.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="font-bold">Berichten gegenereerd voor {customerName}!</div>
                  <div className="text-sm text-slate-400">{businessName}</div>
                </div>
              </div>
              
              {/* Channel Tabs */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'sms', icon: '💬', label: 'SMS' },
                  { id: 'whatsapp', icon: '📱', label: 'WhatsApp' },
                  { id: 'email', icon: '📧', label: 'Email' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Message Preview */}
              <div className="bg-slate-900 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">
                  {currentMessage?.message}
                </pre>
              </div>

              {/* Actions */}
              <button
                onClick={() => handleCopy(activeTab, currentMessage?.message || '')}
                className="w-full mt-4 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {copiedId === activeTab ? (
                  <><Check className="w-5 h-5" /> Gekopieerd!</>
                ) : (
                  <><Copy className="w-5 h-5" /> Kopieer Bericht</>
                )}
              </button>
            </div>

            {/* Generate Another */}
            <button
              onClick={handleReset}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-5 h-5" /> Nieuw bericht genereren
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
