'use client'

import { useState } from 'react'
import { Target, TrendingUp, DollarSign, Users, MapPin, Star, Clock, AlertCircle, Check, Loader2 } from 'lucide-react'
import { copyWithToast, useTemplates } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'

interface LeadData {
  industry: string
  location: string
  monthlyBudget: string
  currentChannels: string[]
  painPoint: string
}

interface StrategyOutput {
  channel: string
  action: string
  why: string
  priority: 'high' | 'medium' | 'low'
  expectedROI: string
}

const industries = [
  'Restaurant/Café', 'Salon/Schoonheid', 'Auto Werkplaats', 'Loodgieter',
  'Elektricien', 'Timmerman', 'Schilder', 'Hovenier', 'Makelaar',
  'Tandarts', 'Fysiotherapie', 'Winkel', 'Hotel', 'Sportclub', 
  'Bakker', 'Fietsenmaker', 'Kinderopvang', 'Glazenmaker'
]

const channels = [
  'Google Ads', 'Facebook/Instagram', 'SEO', 'Mond-tot-mond',
  'Google Business', 'Website', 'Bezorg-apps', 'Groupon/Deal'
]

const strategiesByIndustry: Record<string, StrategyOutput[]> = {
  restaurant: [
    { channel: 'Google Business', action: 'Optimaliseer foto\'s, antwoord op alle reviews, voeg menu toe', why: '74% zoekt lokaal via Google Maps voor restaurants', priority: 'high', expectedROI: '300-500%' },
    { channel: 'Instagram Reels', action: 'Post dagelijks korte video\'s van gerechten, keuken, ambiance', why: 'Reels hebben 3x meer reach dan foto\'s', priority: 'high', expectedROI: '200-400%' },
    { channel: 'Loyalty Program', action: 'Digital loyalty systeem via WhatsApp - 5e maaltijd gratis', why: 'Herhaalklanten zijn 5x waardevoller', priority: 'medium', expectedROI: '150-250%' },
    { channel: 'Bezorgpartner', action: 'Start met Thuisbezorgd/UberEats voor nieuwe klanten', why: 'Bezorg groeit 40% YoY', priority: 'medium', expectedROI: '50-100%' }
  ],
  salon: [
    { channel: 'Instagram + TikTok', action: 'Voor/na transformaties, Behind-the-scenes', why: '94% van salonzoekers gebruikt Instagram', priority: 'high', expectedROI: '250-400%' },
    { channel: 'Online Boeking', action: 'Boekingssysteem 24/7 actief, herinneringen automatisch', why: '60% van afspraken buiten kantooruren', priority: 'high', expectedROI: '200-300%' },
    { channel: 'Google Business', action: 'Reviews vragen na behandeling, antwoord op alle reviews', why: '4.5+ sterren = 50% meer clicks', priority: 'high', expectedROI: '300-500%' },
    { channel: 'Loyalty', action: 'Stempelkaart via app, verjaardag-korting', why: 'Herhaalbezoek is 6x goedkoper dan nieuwe klant', priority: 'medium', expectedROI: '100-200%' }
  ],
  loodgieter: [
    { channel: 'Google Ads', action: 'Bied op noodgevallen keywords, 24/7 advertentie', why: 'Emergency searches = immediate need', priority: 'high', expectedROI: '400-800%' },
    { channel: 'SEO Lokaal', action: 'Google Business + Reviews + Lokale content', why: 'Lokaal SEO = gratis verkeer', priority: 'high', expectedROI: '500-1000%' },
    { channel: 'WhatsApp', action: 'Direct bereikbaar, snelle offertes, herinneringen', why: '92% leest WhatsApp binnen 1 minuut', priority: 'medium', expectedROI: '200-400%' },
    { channel: 'Preventief Onderhoud', action: 'Abonneeservice aanbieden voor terugkerende klanten', why: 'Voorspelbare omzet', priority: 'medium', expectedROI: '150-300%' }
  ],
  default: [
    { channel: 'Google Business', action: '100% invullen, foto\'s uploaden, reviews monitoren', why: 'Lokaal zoeken groeit ieder jaar', priority: 'high', expectedROI: '300-500%' },
    { channel: 'Website', action: 'Mobiel-vriendelijk, snel ladend, duidelijke CTA', why: 'Website = 24/ verkoper', priority: 'high', expectedROI: '200-400%' },
    { channel: 'Email/WhatsApp', action: 'Nieuwsbrief met waarde, niet alleen aanbiedingen', why: 'Email marketing = 1:42 ROI gemiddeld', priority: 'medium', expectedROI: '150-250%' },
    { channel: 'Social Media', action: 'Consistentie > perfectie, post wekelijks', why: 'Bekendheid = vertrouwen = verkoop', priority: 'medium', expectedROI: '100-200%' }
  ]
}

export default function MarketingStrategyBuilder() {
  const { saveTemplate, getTemplatesForTool } = useTemplates()
  const savedTemplates = getTemplatesForTool('marketing-strategy-builder')
  const [leadData, setLeadData] = useState<LeadData>({
    industry: '',
    location: '',
    monthlyBudget: '',
    currentChannels: [],
    painPoint: ''
  })
  const [strategy, setStrategy] = useState<StrategyOutput[]>([])
  const [generating, setGenerating] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState('')

  const handleChannelToggle = (channel: string) => {
    setLeadData(prev => ({
      ...prev,
      currentChannels: prev.currentChannels.includes(channel)
        ? prev.currentChannels.filter(c => c !== channel)
        : [...prev.currentChannels, channel]
    }))
  }

  const generateStrategy = () => {
    setGenerating(true)
    
    setTimeout(() => {
      const industryKey = Object.keys(strategiesByIndustry).find(key => 
        leadData.industry?.toLowerCase().includes(key)
      ) || 'default'
      
      let strategies = strategiesByIndustry[industryKey] || strategiesByIndustry.default
      
      // Remove already used channels
      if (leadData.currentChannels.length > 0) {
        strategies = strategies.filter(s => !leadData.currentChannels.includes(s.channel))
      }
      
      setStrategy(strategies)
      setGenerating(false)
    }, 1500)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🎯</span>
              <div>
                <h1 className="text-3xl font-black">Marketing Strategie Builder</h1>
                <p className="text-slate-400">Krijg een persoonlijk marketingplan op maat voor jouw bedrijf</p>
              </div>
            </div>
            <TemplateSwitcher
              toolId="marketing-strategy-builder"
              onApply={(data) => {
                if (data.industry) setLeadData(prev => ({ ...prev, industry: data.industry }))
                if (data.location) setLeadData(prev => ({ ...prev, location: data.location }))
              }}
              currentData={{ industry: leadData.industry, location: leadData.location }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            {/* Industry */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-400" />
                Welke branche?
              </h2>
              <select
                value={leadData.industry}
                onChange={(e) => {
                  setLeadData(prev => ({ ...prev, industry: e.target.value }))
                  setSelectedIndustry(e.target.value.toLowerCase())
                }}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="">Selecteer branche...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                Waar zitten je klanten?
              </h2>
              <input
                type="text"
                value={leadData.location}
                onChange={(e) => setLeadData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Bijv. Amsterdam, Rotterdam, Utrecht..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            {/* Budget */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                Marketing budget per maand
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {['€0-100', '€100-500', '€500+'].map(budget => (
                  <button
                    key={budget}
                    onClick={() => setLeadData(prev => ({ ...prev, monthlyBudget: budget }))}
                    className={`p-3 rounded-xl border transition ${
                      leadData.monthlyBudget === budget 
                        ? 'bg-violet-600 border-violet-500' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Channels */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Wat doe je al?
              </h2>
              <p className="text-sm text-slate-400 mb-4">Selecteer wat je momenteel gebruikt (voor betere aanbevelingen)</p>
              <div className="grid grid-cols-2 gap-2">
                {channels.map(channel => (
                  <button
                    key={channel}
                    onClick={() => handleChannelToggle(channel)}
                    className={`p-3 rounded-xl border transition text-left flex items-center gap-2 ${
                      leadData.currentChannels.includes(channel)
                        ? 'bg-violet-600 border-violet-500'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {leadData.currentChannels.includes(channel) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 border border-slate-600 rounded" />
                    )}
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            {/* Pain Point */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Grootste uitdaging
              </h2>
              <textarea
                value={leadData.painPoint}
                onChange={(e) => setLeadData(prev => ({ ...prev, painPoint: e.target.value }))}
                placeholder="Bijv. Ik wil meer vaste klanten, maar adverteren is te duur..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none h-24 resize-none"
              />
            </div>

            <button
              onClick={generateStrategy}
              disabled={generating || !leadData.industry}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Strategie bouwen...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Bouw Mijn Strategie
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Jouw Persoonlijke Strategie
            </h2>
            
            {strategy.length === 0 ? (
              <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700 text-center">
                <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Vul je gegevens in en krijg een strategie op maat
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {strategy.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{item.channel}</p>
                          <p className="text-sm text-green-400">{item.expectedROI} expected ROI</p>
                        </div>
                      </div>
                      <Clock className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ACTIE</p>
                        <p className="text-slate-200">{item.action}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">WAAROM DIT WERKT</p>
                        <p className="text-sm text-slate-400">{item.why}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
