'use client'

import { useState } from 'react'
import { Star, Copy, Check, MessageSquare, Send, Phone, Mail, MessageCircle, ExternalLink, Sparkles, Building } from 'lucide-react'

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

const generateMessages = (businessName: string, businessType: string, customerName: string): GeneratedMessage[] => {
  const firstName = customerName.split(' ')[0] || 'daar'
  
  const templates: Record<string, { sms: string; whatsapp: string; email: string }> = {
    restaurant: {
      sms: `Hoi ${firstName}! Bedankt dat je bij ons gegeten hebt 🌟 Zou je ons een review willen geven? Het helpt ons enorm! Hier is de link: [JE REVIEW LINK] - Team ${businessName}`,
      whatsapp: `Hey ${firstName}! 👋\n\nLeuk dat je bij ${businessName} bent geweest! \n\nZou je ons een review willen geven? Het helpt ons enorm om meer mensen te helpen 😊\n\n👉 [JE REVIEW LINK]\n\nAlvast bedankt! 🍽️`,
      email: `Hey ${firstName},\n\nBedankt voor je bezoek aan ${businessName}! 🙏\n\nWe hopen dat je een heerlijke tijd hebt gehad. Als je even momentje hebt, zouden we het enorm waarderen als je een review achterlaat.\n\n👉 [JE REVIEW LINK]\n\nMet vriendelijke groet,\nTeam ${businessName}`
    },
    salon: {
      sms: `Hoi ${firstName}! Vond het leuk je te zien bij ${businessName} 💅 Check deze link en laat een review achter als je even tijd hebt: [JE REVIEW LINK] - Thanks!`,
      whatsapp: `Hey ${firstName}! 💕\n\nLeuk om je weer te zien in de salon! \n\nZou je ons een review willen geven? Het helpt andere mensen om ons te vinden 😊\n\n👉 [JE REVIEW LINK]\n\nBedankt! ✨`,
      email: `Hey ${firstName},\n\nBedankt voor je bezoek aan ${businessName}! 💅\n\nWe waarderen het enorm als je even de tijd neemt om een review achter te laten. Het helpt ons om te groeien!\n\n👉 [JE REVIEW LINK]\n\nTot snel!\n${businessName}`
    },
    default: {
      sms: `Hoi ${firstName}! Bedankt voor je vertrouwen in ${businessName} 🌟 Laat even een review achter via deze link: [JE REVIEW LINK] - Alvast bedankt!`,
      whatsapp: `Hey ${firstName}! 👋\n\nBedankt voor je vertrouwen in ${businessName}. We waarderen het enorm als je even de tijd neemt voor een review!\n\n👉 [JE REVIEW LINK]\n\nAlvast bedankt! 🙏`,
      email: `Hey ${firstName},\n\nBedankt voor je vertrouwen in ${businessName}.\n\nZou je ons een review willen geven? Het helpt ons enorm om meer mensen te helpen.\n\n👉 [JE REVIEW LINK]\n\nMet vriendelijke groet,\n${businessName}`
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
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [messages, setMessages] = useState<GeneratedMessage[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp')

  const handleGenerate = () => {
    const generated = generateMessages(businessName, businessType, customerName)
    setMessages(generated)
    setStep(3)
  }

  const copyMessage = (type: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(type)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const currentMessage = messages.find(m => m.type === activeTab)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">⭐</span>
            <h1 className="text-3xl font-black">Review Generator</h1>
          </div>
          <p className="text-slate-400">Genereer gepersonaliseerde review-verzoeken in 30 seconden</p>
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

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
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
                  placeholder="Bijv. De Loodgieter Amsterdam"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Type bedrijf</label>
                <div className="grid grid-cols-3 gap-2">
                  {businessTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setBusinessType(type.id)}
                      className={`p-3 rounded-xl border text-left transition ${
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
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!businessName}
              className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl font-semibold transition"
            >
              Volgende stap →
            </button>
          </div>
        )}

        {/* Step 2: Customer Info */}
        {step === 2 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-400" />
              Klantgegevens
            </h2>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">Naam klant *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Bijv. Jan de Vries"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Vul de naam in van de klant die je een review-verzoek wilt sturen
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
              >
                ← Terug
              </button>
              <button
                onClick={handleGenerate}
                disabled={!customerName}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-5 h-5" />
                Genereer Berichten
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && messages.length > 0 && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Check className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-bold">Berichten gegenereerd voor {customerName}!</div>
                  <div className="text-sm text-slate-400">{businessName} - {businessTypes.find(t => t.id === businessType)?.label}</div>
                </div>
              </div>
              
              {/* Channel Tabs */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: 'sms', icon: MessageCircle, label: 'SMS' },
                  { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                  { id: 'email', icon: Mail, label: 'Email' }
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
                    <tab.icon className="w-4 h-4" />
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
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => copyMessage(activeTab, currentMessage?.message || '')}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  {copiedId === activeTab ? (
                    <><Check className="w-5 h-5" /> Gekopieerd!</>
                  ) : (
                    <><Copy className="w-5 h-5" /> Kopieer {activeTab === 'sms' ? 'SMS' : activeTab === 'whatsapp' ? 'WhatsApp' : 'Email'}</>
                  )}
                </button>
              </div>
            </div>

            {/* Google Review Link Section */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="font-bold mb-4">📍 Google Review Link</h3>
              <p className="text-sm text-slate-400 mb-4">
                Vervang [JE REVIEW LINK] in de berichten met je daadwerkelijke Google review link.
              </p>
              <div className="bg-slate-900 rounded-xl p-4">
                <code className="text-sm text-violet-400">
                  https://g.page/r/[JOUW-BEDRIJF]/review
                </code>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Tip: Zoek op Google naar je bedrijf en klik op "Review achterlaten" om je link te kopiëren
              </p>
            </div>

            {/* Generate Another */}
            <button
              onClick={() => {
                setStep(1)
                setCustomerName('')
                setMessages([])
              }}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition"
            >
              ← Genereer nieuw bericht
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-center">
          <h3 className="font-bold mb-2">Wil je dit automatiseren?</h3>
          <p className="text-white/80 text-sm mb-4">Wij zetten een automatisch review-verzoek systeem op dat na elke klant een bericht stuurt</p>
          <a href="/#contact" className="inline-block bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold">
            Vraag offer aan →
          </a>
        </div>
      </div>
    </div>
  )
}
