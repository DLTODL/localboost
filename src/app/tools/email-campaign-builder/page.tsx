'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Clock, Send, Check, AlertCircle, User, Briefcase, TrendingUp, Target, DollarSign, Users, Calendar, Loader2, Mail, Import, Star, ChevronRight, MapPin } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useSelectedBusiness, useTemplates, useLeads, copyWithToast, showToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'
import { FormSkeleton, EmailSkeleton } from '@/components/polish/Skeleton'
import { EmptyState } from '@/components/polish/EmptyState'

interface ClientData {
  name: string
  company: string
  industry: string
  service: string
  budget: string
  timeline: string
  goals: string
  painPoints: string[]
  email: string
}

interface Campaign {
  id: string
  name: string
  subject: string
  preview: string
  body: string
  delay: number
  dayOffset: number
}

const industryTemplates: Record<string, { painPoints: string[], services: string[] }> = {
  restaurant: {
    painPoints: ['Te weinig tafelreserveringen', 'Weinig online zichtbaarheid', 'Concurrende met bezorg-apps', 'Klantenreviews laag'],
    services: ['Social media package', 'Google Business optimalisatie', 'Review management systeem', 'Lunch/diner promotie']
  },
  salon: {
    painPoints: ['Nieuwe klanten werven', 'Afspraken gemist', 'Online boeken niet werkend', 'Concurrentie te groot'],
    services: ['Online boeking systeem', 'Instagram content', 'Loyalty programma', 'Lokale SEO']
  },
  loodgieter: {
    painPoints: ['Emergency leads niet gebeld', 'Geen website', 'Geen reviews strategie', 'Te afhankelijk van mond-tot-mond'],
    services: ['24/7 lead capture', 'Google Ads setup', 'Review automatiseren', 'Voorrang pakket']
  },
  default: {
    painPoints: ['Niet gevonden worden online', 'Geen gestructureerde marketing', 'Geen idee wat klanten willen', 'Te duur om adverteren'],
    services: ['Basis website', 'SEO optimalisatie', 'Social media', 'Email marketing']
  }
}

// Lead Picker Button Component
function LeadPickerButton({ onSelect }: { onSelect: (lead: any) => void }) {
  const { leads } = useLeads()
  const [showPicker, setShowPicker] = useState(false)

  if (leads.length === 0) {
    return (
      <Link
        href="/tools/lead-finder"
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg transition"
      >
        <Users className="w-4 h-4" />
        Zoek leads →
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg transition"
      >
        <Users className="w-4 h-4" />
        Laad uit CRM ({leads.length})
        <ChevronRight className={`w-3 h-3 transition-transform ${showPicker ? 'rotate-90' : ''}`} />
      </button>

      {showPicker && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 lead-picker">
          <div className="p-3 border-b border-slate-700">
            <div className="text-sm font-medium text-slate-300">Kies een lead uit CRM</div>
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {leads.slice(0, 8).map(lead => (
              <button
                key={lead.id}
                onClick={() => {
                  onSelect(lead)
                  setShowPicker(false)
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 transition text-left"
              >
                <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center text-sm">
                  {lead.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{lead.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {lead.city || 'Onbekend'}
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-xs ${
                  lead.status === 'new' ? 'bg-green-500/20 text-green-400' : 'bg-slate-600/50 text-slate-400'
                }`}>
                  {lead.status === 'new' ? 'Nieuw' : lead.status}
                </span>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-700">
            <Link href="/tools/lead-finder" className="flex items-center justify-center gap-2 py-2 text-xs text-violet-400 hover:text-violet-300 transition">
              Bekijk alle leads in Lead Finder →
            </Link>
          </div>
        </div>
      )}

      {/* Close on outside click */}
      {showPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
      )}
    </div>
  )
}

export default function EmailCampaignBuilder() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('email-campaign-builder')
  const { business: selectedBusiness } = useSelectedBusiness()
  const { saveTemplate, getTemplatesForTool } = useTemplates()

  const savedTemplates = getTemplatesForTool('email-campaign-builder')

  const [clientData, setClientData] = useState<ClientData>({
    name: '',
    company: '',
    industry: '',
    service: '',
    budget: '',
    timeline: '',
    goals: '',
    painPoints: [],
    email: ''
  })
  const [campaign, setCampaign] = useState<Campaign[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Initial load skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: keyof ClientData, value: string | string[]) => {
    setClientData(prev => ({ ...prev, [field]: value }))
  }

  const selectTemplate = (template: string) => {
    setSelectedTemplate(template)
    const data = industryTemplates[template] || industryTemplates.default
    handleInputChange('painPoints', data.painPoints)
  }

  const generateCampaign = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const emails: Campaign[] = [
        {
          id: 'day1-warmup',
          name: 'Dag 1 - Warm Intro',
          subject: `Succesvolle bedrijven in ${clientData.industry} beginnen hier`,
          preview: 'Persoonlijke intro om relatie op te bouwen',
          body: `Hey ${clientData.name.split(' ')[0]},

Wat ik zie bij succesvolle ${clientData.industry} bedrijven?

Ze hebben één ding gemeen: een systeem dat constant nieuwe klanten aantrekt, zonder dat ze er constant achteraan moeten.

Ik heb even gekeken naar ${clientData.company} - jullie hebben een mooie basis, maar ik denk dat we samen iets kunnen neerzetten wat echt impact maakt.

Mijn vraag: als ik je binnen 30 dagen 5 nieuwe gekwalificeerde leads kan bezorgen, wat zou dat betekenen voor jullie omzet?

Laten we kennismaken - vrijblijvend, 15 minuten.

Groet`,
          delay: 0,
          dayOffset: 1
        },
        {
          id: 'day4-value',
          name: 'Dag 4 - Waarde Tip',
          subject: `${clientData.industry} tip die je concurrentie niet kent`,
          preview: 'Gratis waarde om vertrouwen op te bouwen',
          body: `Hey ${clientData.name.split(' ')[0]},

Snel tipje van mijn sluier: de meeste ${clientData.industry} bedrijven verliezen klanten omdat ze niet top-of-mind zijn op het moment dat iemand een probleem heeft.

De oplossing? Automatische herinneringen, reviews strategie, en een lokale SEO presence die je concurrentie weg blaast.

Dit is precies wat we doen voor bedrijven zoals die van jou.

Meer weten binnenkort?

Groet`,
          delay: 3,
          dayOffset: 4
        },
        {
          id: 'day8-offer',
          name: 'Dag 8 - Aanbod',
          subject: `Passed de kogel? Speciaal aanbod voor ${clientData.company}`,
          preview: 'Persoonlijk aanbod op maat',
          body: `Hey ${clientData.name.split(' ')[0]},

Ik weet dat je druk bent, dus ik zal kort zijn.

We hebben een speciale onboarding voor bedrijven zoals ${clientData.company} - we garanderen resultaat, niet alleen beloftes.

Wat we kunnen doen voor jullie:
• ${clientData.service || 'Op maat gemaakte marketing strategie'}
• Gegarandeerd X nieuwe leads per maand
• Alles geautomatiseerd, jullie focussen op jullie werk

Prijs is eerlijk, resultaat is meetbaar.

Interesse? Dan plannen we even.

Groet`,
          delay: 7,
          dayOffset: 8
        },
        {
          id: 'day14-final',
          name: 'Dag 14 - Laatste kans',
          subject: 'Deze kans verdwijnt binnenkort',
          preview: 'Urgency met duidelijke call-to-action',
          body: `Hey ${clientData.name.split(' ')[0]},

Dit is je laatste herinnering:

De plekken voor onze klantenmonitor zijn beperkt, en ik geef eerlijk toe dat ik de komende weken vol zit.

Als je echt serieus bent over groei voor ${clientData.company}, moeten we nu praten.

Anders? Geen probleem. Ik hoop dat je success hebt, met of zonder ons.

Groet`,
          delay: 13,
          dayOffset: 14
        }
      ]
      
      setCampaign(emails)
      setGenerating(false)
    }, 2000)
  }

  const copyEmail = async (email: Campaign) => {
    const fullEmail = `Onderwerp: ${email.subject}\n\n${email.body}`
    await copyWithToast(fullEmail, 'Email gekopieerd!')
    setCopiedId(email.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Pre-fill from business profile, selected business, or URL params (cross-tool)
  useEffect(() => {
    // Check URL params first (from Proposal Generator)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const urlClient = params.get('client')
      const urlCompany = params.get('company')
      
      if (urlClient && !inputs.company) {
        setClientData(prev => ({ ...prev, name: decodeURIComponent(urlClient), company: decodeURIComponent(urlCompany || urlClient) }))
      }
    }
    
    if (selectedBusiness) {
      if (selectedBusiness.name && !inputs.company) {
        setClientData(prev => ({ ...prev, name: selectedBusiness.name, company: selectedBusiness.name }))
      }
      if (selectedBusiness.industry) {
        setClientData(prev => ({ ...prev, industry: selectedBusiness.industry }))
        const template = Object.keys(industryTemplates).find(t =>
          selectedBusiness.industry?.toLowerCase().includes(t)
        ) || 'default'
        selectTemplate(template)
      }
      if (selectedBusiness.email) setClientData(prev => ({ ...prev, email: selectedBusiness.email }))
    } else if (profile) {
      if (profile.name && !inputs.company) {
        setClientData(prev => ({ ...prev, name: profile.name, company: profile.name }))
      }
      if (profile.type) {
        setClientData(prev => ({ ...prev, industry: profile.type }))
        const template = Object.keys(industryTemplates).find(t =>
          profile.type?.toLowerCase().includes(t)
        ) || 'default'
        selectTemplate(template)
      }
      if (profile.email) setClientData(prev => ({ ...prev, email: profile.email }))
    }
  }, [profile, selectedBusiness, inputs.company])

  // Save inputs on change
  useEffect(() => {
    if (clientData.name || clientData.company) {
      saveInputs(clientData)
    }
  }, [clientData, saveInputs])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      {isInitialLoad ? (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📧</span>
            <div>
              <h1 className="text-3xl font-black">Email Campaign Builder</h1>
              <p className="text-slate-400">Laden...</p>
            </div>
          </div>
          <FormSkeleton fields={5} />
          <div className="grid lg:grid-cols-2 gap-8">
            <FormSkeleton fields={4} />
            <div className="space-y-4">
              {[1,2,3,4].map(i => <EmailSkeleton key={i} />)}
            </div>
          </div>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📧</span>
              <div>
                <h1 className="text-3xl font-black">Email Campaign Builder</h1>
                <p className="text-slate-400">Bouwen automatische email sequences die verkopen - geen adviseur nodig</p>
              </div>
            </div>
            {(selectedBusiness || profile) && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                <span className="text-green-400 text-sm">✓ Zakelijke data geladen</span>
                <button
                  onClick={() => {
                    setClientData({ name: '', company: '', industry: '', service: '', budget: '', timeline: '', goals: '', painPoints: [], email: '' })
                  }}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
          <div className="mt-4">
            <TemplateSwitcher
              toolId="email-campaign-builder"
              onApply={(data) => {
                if (data.name) handleInputChange('name', data.name)
                if (data.company) handleInputChange('company', data.company)
                if (data.industry) {
                  handleInputChange('industry', data.industry)
                  const template = Object.keys(industryTemplates).find(t =>
                    data.industry?.toLowerCase().includes(t)
                  ) || 'default'
                  selectTemplate(template)
                }
                if (data.service) handleInputChange('service', data.service)
                if (data.email) handleInputChange('email', data.email)
              }}
              currentData={{ name: clientData.name, company: clientData.company, industry: clientData.industry, service: clientData.service, email: clientData.email }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Client Input */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-400" />
                Kies je branche
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(industryTemplates).filter(t => t !== 'default').map(industry => (
                  <button
                    key={industry}
                    onClick={() => selectTemplate(industry)}
                    className={`p-3 rounded-xl border transition text-left ${
                      selectedTemplate === industry 
                        ? 'bg-violet-600 border-violet-500 text-white' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="capitalize">{industry}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-violet-400" />
                  Klant details
                </h2>
                <LeadPickerButton
                  onSelect={(lead) => {
                    handleInputChange('name', lead.name)
                    handleInputChange('company', lead.company || lead.name)
                    if (lead.email) handleInputChange('email', lead.email)
                    if (lead.industry) handleInputChange('industry', lead.industry)
                    showToast(`${lead.name} geladen uit CRM`, 'success')
                  }}
                />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Naam</label>
                    <input
                      type="text"
                      value={clientData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Jan de Vries"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Bedrijf</label>
                    <input
                      type="text"
                      value={clientData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="De Vries BV"
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="jan@bedrijf.nl"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Aangeboden dienst</label>
                  <input
                    type="text"
                    value={clientData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="Lokale SEO + Social Media"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pain Points */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Pijn punten
              </h2>
              <div className="space-y-2">
                {industryTemplates[selectedTemplate]?.painPoints.map((point, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-900/80 transition">
                    <input
                      type="checkbox"
                      checked={clientData.painPoints.includes(point)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('painPoints', [...clientData.painPoints, point])
                        } else {
                          handleInputChange('painPoints', clientData.painPoints.filter(p => p !== point))
                        }
                      }}
                      className="w-5 h-5 rounded border-slate-600 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-slate-200">{point}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCampaign}
              disabled={generating || !clientData.name || !clientData.company}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Genereren...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Genereer Campaign
                </>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Email Sequence Preview
            </h2>
            
            {campaign.length === 0 && !generating ? (
              <EmptyState
                icon="mail"
                title="Nog geen campaign"
                description="Vul de klantgegevens in en klik op 'Genereer Campaign' om te beginnen"
              />
            ) : generating ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                      <div>
                        <div className="h-4 w-32 bg-slate-700 rounded mb-1"></div>
                        <div className="h-3 w-16 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-full bg-slate-700 rounded"></div>
                      <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
                      <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {campaign.map((email, index) => (
                  <div 
                    key={email.id}
                    className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm font-bold">
                          {email.dayOffset}
                        </div>
                        <div>
                          <p className="font-semibold">{email.name}</p>
                          <p className="text-sm text-slate-400">Dag {email.dayOffset}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyEmail(email)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition"
                      >
                        {copiedId === email.id ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Onderwerp</p>
                        <p className="font-medium text-violet-300">{email.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Preview</p>
                        <p className="text-sm text-slate-400">{email.preview}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Body</p>
                        <p className="text-sm text-slate-300 whitespace-pre-line">{email.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  )
}
