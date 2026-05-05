'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, User, Building, CheckCircle, ChevronRight, ChevronLeft, RotateCcw, Mail } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useSelectedBusiness, copyWithToast, showToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'

interface ProposalData {
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  service: string
  customizations: string
}

const services = [
  { id: 'google-dominance', name: 'Google Dominantie Pakket', price: 297, features: ['Google Business setup', 'SEO optimalisatie', 'Review management', 'Maandelijkse rapportage'] },
  { id: 'lead-machine', name: 'Lead Machine Systeem', price: 497, features: ['High-converting landingspagina', 'CRM integratie', 'Email automatisering', 'Analytics dashboard'] },
  { id: 'ads-profit', name: 'Winstgevende Ads', price: 397, features: ['Google Ads setup', 'Meta Ads management', 'Retargeting campagnes', 'Wekelijkse optimalisatie'] },
  { id: 'full-growth', name: 'Complete Groei Partnership', price: 997, features: ['Alles van bovenstaande', 'Dedicated manager', 'Wekelijkse calls', 'Onbeperkte revisies'] }
]

export default function ProposalGenerator() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('proposal-generator')
  
  const [step, setStep] = useState(1)
  const [data, setData] = useState<ProposalData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    service: '',
    customizations: ''
  })
  const [generated, setGenerated] = useState(false)

  const selectedService = services.find(s => s.id === data.service)

  // Pre-fill from profile
  useEffect(() => {
    if (profile) {
      if (profile.name && !inputs.ourCompany) {
        // We don't auto-fill company name from profile since that's the client
      }
    }
  }, [profile, inputs])

  const handleInputChange = (field: keyof ProposalData, value: string) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    saveInputs(newData)
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const generateProposal = () => {
    setGenerated(true)
  }

  const getProposalText = () => {
    if (!selectedService) return ''

    return `BEDANKT VOOR UW INTERESSE

Geachte ${data.clientName},

Bedankt voor uw interesse in onze diensten. Hierbij ontvangt u een vrijblijvend voorstel op maat.

─────────────────────────────────
UW SITUATIE
─────────────────────────────────

Op basis van uw vraag begrijp ik dat ${data.clientCompany} op zoek is naar manieren om online meer klanten aan te trekken. Wij helpen lokale bedrijven zoals u om meetbaar te groeien.

─────────────────────────────────
ONZE OPLOSSING: ${selectedService.name.toUpperCase()}
─────────────────────────────────

Wij stellen het volgende pakket samen:

${selectedService.features.map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

─────────────────────────────────
INVESTERING
─────────────────────────────────

Eenmalige investering: €${selectedService.price},-
(Inclusief implementatie en eerste maand support)

Betaling: Na levering, op factuur
Levertijd: 14-30 dagen

─────────────────────────────────
WAT U KRIJGT
─────────────────────────────────

✓ Volledige implementatie
✓ 30 dagen garantie (niet goed, geld terug)
✓ Communicatie via vast aanspreekpunt
✓ Maandelijkse voortgangsrapportage
✓ Support via telefoon en email

─────────────────────────────────
VERVOLGSTAPPEN
─────────────────────────────────

1. Akkoord geven op dit voorstel
2. Wij plannen een intake gesprek
3. Start implementatie binnen 5 werkdagen

Dit voorstel is 14 dagen geldig.

Met vriendelijke groet,

LocalBoost
📧 hello@localboost.nl
📱 +31 6 12345678

─────────────────────────────────
ACCORDANTIE
─────────────────────────────────

Naam: ${data.clientName}
Bedrijf: ${data.clientCompany}
Datum: ${new Date().toLocaleDateString('nl-NL')}
Handtekening: _______________________`
  }

  const handleDownload = async () => {
    const text = getProposalText()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Voorstel_${data.clientCompany || 'LocalBoost'}_${new Date().toLocaleDateString('nl-NL')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Voorstel gedownload!', 'success')
  }

  const handleReset = () => {
    setStep(1)
    setData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      service: '',
      customizations: ''
    })
    setGenerated(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📄</span>
              <div>
                <h1 className="text-3xl font-black">Proposal Generator</h1>
                <p className="text-slate-400">Genereer een professioneel voorstel in 2 minuten</p>
              </div>
            </div>
            {/* Cross-tool: Email Sequence */}
            <a
              href="/tools/email-campaign-builder"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm transition"
            >
              <Mail className="w-4 h-4" />
              Email Sequence →
            </a>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full transition ${s <= step ? 'bg-violet-600' : 'bg-slate-700'}`} />
              <div className="text-xs text-slate-500 mt-1">Stap {s}</div>
            </div>
          ))}
        </div>

        {/* Step 1: Client Info */}
        {step === 1 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-slide-up">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-400" />
              Klantgegevens
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Naam *</label>
                <input
                  type="text"
                  value={data.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Jan de Vries"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="jan@voorbeeld.nl"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Telefoon</label>
                  <input
                    type="tel"
                    value={data.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="06 12345678"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Bedrijfsnaam *</label>
                <input
                  type="text"
                  value={data.clientCompany}
                  onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                  placeholder="De Vries Installaties"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!data.clientName || !data.clientCompany}
              className="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              Volgende <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {step === 2 && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-slide-up">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-violet-400" />
              Kies dienst
            </h2>
            <div className="space-y-3">
              {services.map(service => (
                <div
                  key={service.id}
                  onClick={() => handleInputChange('service', service.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition hover-lift ${
                    data.service === service.id
                      ? 'bg-violet-600/20 border-violet-500'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-slate-400">{service.features.slice(0, 2).join(', ')}</div>
                    </div>
                    <div className="text-2xl font-bold text-violet-400">€{service.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={prevStep} className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition">
                ← Terug
              </button>
              <button
                onClick={nextStep}
                disabled={!data.service}
                className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl font-semibold transition"
              >
                Volgende →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Generate */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Voorstel preview
              </h2>
              {selectedService && (
                <div className="bg-slate-900 rounded-xl p-4 text-sm mb-4">
                  <div className="text-slate-400 mb-2">Voor: {data.clientName} - {data.clientCompany}</div>
                  <div className="text-violet-400 font-semibold mb-2">{selectedService.name}</div>
                  <div className="text-slate-500">Investering: €{selectedService.price},-</div>
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Extra opmerkingen (optioneel)</label>
                <textarea
                  value={data.customizations}
                  onChange={(e) => handleInputChange('customizations', e.target.value)}
                  placeholder="Bijzondere wensen of aanpassingen..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none resize-none transition"
                />
              </div>

              {/* Cross-tool: Email Campaign */}
              <a
                href="/tools/email-campaign-builder"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm transition"
              >
                <Mail className="w-4 h-4" />
                Bijbehorende Email Campaign Bouwen →
              </a>
            </div>

            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6">
              <h3 className="font-bold mb-2">📋 Voorstel downloaden</h3>
              <p className="text-white/80 text-sm mb-4">Genereer een tekstbestand dat je kunt versturen</p>
              <button
                onClick={generateProposal}
                className="w-full py-4 bg-white text-violet-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
              >
                <Download className="w-5 h-5" />
                Genereer & Download
              </button>
            </div>

            {generated && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                  <CheckCircle className="w-5 h-5" />
                  Voorstel gegenereerd!
                </div>
                <p className="text-sm text-slate-300 mb-3">Het voorstel is klaar om te downloaden.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-5 h-5" /> Download
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <button onClick={prevStep} className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition">
              ← Terug
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
