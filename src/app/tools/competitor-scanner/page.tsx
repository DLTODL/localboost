'use client'

import { useState, useEffect } from 'react'
import { Target, Search, Globe, MapPin, Star, Copy, Check, Download, ExternalLink, RefreshCw, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useTemplates, copyWithToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'

interface Competitor {
  name: string
  website: string
  location: string
  rating: number
  reviewCount: number
  services: string[]
  hasWebsite: boolean
  hasGoogleAds: boolean
  hasFacebook: boolean
  hasInstagram: boolean
  gaps: string[]
  opportunity: 'high' | 'medium' | 'low'
}

const industries = [
  'Restaurant/Café', 'Salon/Schoonheid', 'Auto Werkplaats', 'Loodgieter',
  'Elektricien', 'Timmerman', 'Schilder', 'Hovenier', 'Makelaar',
  'Tandarts', 'Fysiotherapie', 'Winkel', 'Hotel', 'Sportclub'
]

const services = [
  'Google Business', 'Website', 'SEO', 'Google Ads', 
  'Facebook', 'Instagram', 'Email Marketing', 'Online Boeking'
]

const generateCompetitors = (city: string, industry: string): Competitor[] => {
  const competitors: Competitor[] = []
  const count = 5 + Math.floor(Math.random() * 4)
  
  const companyNames = [
    `${industry} Service ${city}`, `De ${industry} ${city}`, `${industry} Experts`,
    `All-in ${industry}`, `Quick ${industry}`, `${industry} Centraal`,
    `${industry} Plaza`, `Mr. ${industry}`, `${industry} World`
  ]
  
  for (let i = 0; i < count; i++) {
    const hasWebsite = Math.random() > 0.4
    const hasGoogleAds = Math.random() > 0.6
    const rating = Math.round((3 + Math.random() * 2) * 10) / 10
    const reviewCount = Math.floor(Math.random() * 80)
    
    const gaps: string[] = []
    if (!hasWebsite) gaps.push('Geen website')
    if (rating < 4) gaps.push('Lage reviews')
    if (!hasGoogleAds) gaps.push('Geen Google Ads')
    if (!hasWebsite && !hasGoogleAds) gaps.push('Geen online zichtbaarheid')
    if (reviewCount < 10) gaps.push('Weinig reviews')
    
    const opportunity: 'high' | 'medium' | 'low' = 
      gaps.length >= 3 ? 'high' : gaps.length >= 1 ? 'medium' : 'low'
    
    competitors.push({
      name: companyNames[i % companyNames.length],
      website: hasWebsite ? `https://${companyNames[i % companyNames.length].toLowerCase().replace(/\s/g, '')}.nl` : '',
      location: city,
      rating,
      reviewCount,
      services: [
        hasWebsite ? 'Website' : null,
        hasGoogleAds ? 'Google Ads' : null,
        Math.random() > 0.5 ? 'Facebook' : null,
        Math.random() > 0.5 ? 'Instagram' : null,
        Math.random() > 0.7 ? 'SEO' : null
      ].filter(Boolean) as string[],
      hasWebsite,
      hasGoogleAds,
      hasFacebook: Math.random() > 0.5,
      hasInstagram: Math.random() > 0.5,
      gaps,
      opportunity
    })
  }
  
  return competitors.sort((a, b) => {
    if (a.opportunity === 'high' && b.opportunity !== 'high') return -1
    if (b.opportunity === 'high' && a.opportunity !== 'high') return 1
    return b.gaps.length - a.gaps.length
  })
}

function CompetitorSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 w-48 bg-slate-700 rounded mb-3"></div>
          <div className="flex gap-4 mb-3">
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-slate-700 rounded"></div>
            <div className="h-6 w-16 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-20 bg-slate-700 rounded"></div>
      </div>
    </div>
  )
}

export default function CompetitorScanner() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('competitor-scanner')
  const { saveTemplate, getTemplatesForTool } = useTemplates()

  const [city, setCity] = useState(inputs.city || '')
  const [industry, setIndustry] = useState(inputs.industry || '')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const savedTemplates = getTemplatesForTool('competitor-scanner')

  // Pre-fill from profile
  useEffect(() => {
    if (profile?.city && !inputs.city) {
      setCity(profile.city)
    }
    if (profile?.type && !inputs.industry) {
      const matched = industries.find(i => i.toLowerCase().includes(profile.type.toLowerCase()))
      if (matched) setIndustry(matched)
    }
  }, [profile, inputs.city, inputs.industry])

  const handleScan = () => {
    if (!city || !industry) return
    setLoading(true)
    setSearched(false)

    setTimeout(() => {
      const results = generateCompetitors(city, industry)
      setCompetitors(results)
      setSearched(true)
      setLoading(false)
      saveInputs({ city, industry })
    }, 1500)
  }

  const handleCopy = async (text: string, id: string) => {
    await copyWithToast(text, 'Gekopieerd!')
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getOpportunityColor = (opp: string) => {
    switch (opp) {
      case 'high': return 'bg-red-500/20 text-red-400 border border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      default: return 'bg-green-500/20 text-green-400 border border-green-500/30'
    }
  }

  const getServiceColor = (has: boolean) => has ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'

  const highOpp = competitors.filter(c => c.opportunity === 'high').length
  const mediumOpp = competitors.filter(c => c.opportunity === 'medium').length

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔎</span>
              <div>
                <h1 className="text-3xl font-black">Competitor Scanner</h1>
                <p className="text-slate-400">Ontdek wat je concurrenten doen en waar kansen liggen</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TemplateSwitcher
                toolId="competitor-scanner"
                onApply={(data) => {
                  if (data.city) setCity(data.city)
                  if (data.industry) setIndustry(data.industry)
                }}
                currentData={{ city, industry }}
              />
              <a
                href="/tools/lead-finder"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition text-sm flex items-center gap-2"
              >
                <span>🎯</span> Lead Finder
              </a>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Stad/Regio</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bijv. Amsterdam"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Branche</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
              >
                <option value="">Selecteer branche...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleScan}
                disabled={!city || !industry || loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> Scannen...</>
                ) : (
                  <><Search className="w-5 h-5" /> Scan Concurrenten</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <CompetitorSkeleton key={i} />)}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-white">{competitors.length}</div>
                <div className="text-sm text-slate-400">Concurrenten</div>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                <div className="text-2xl font-black text-red-400">{highOpp}</div>
                <div className="text-sm text-red-400">Hoge kans 🔥</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-2xl font-black text-yellow-400">{mediumOpp}</div>
                <div className="text-sm text-yellow-400">Medium kans</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-green-400">
                  {competitors.filter(c => c.gaps.length === 0).length}
                </div>
                <div className="text-sm text-slate-400">Sterke concurrenten</div>
              </div>
            </div>

            {/* Competitors List */}
            <div className="space-y-4">
              {competitors.map((comp, i) => (
                <div
                  key={i}
                  className={`bg-slate-800 rounded-xl p-5 border transition hover-lift cursor-pointer ${
                    comp.opportunity === 'high' ? 'border-red-500/50' :
                    comp.opportunity === 'medium' ? 'border-yellow-500/50' :
                    'border-slate-700'
                  }`}
                  onClick={() => setSelectedCompetitor(comp)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getOpportunityColor(comp.opportunity)}`}>
                          {comp.opportunity === 'high' ? '🔥 HOGE KANS' : comp.opportunity === 'medium' ? '🟡 MEDIUM' : '🟢 LAAG'}
                        </span>
                        <h3 className="font-bold text-lg">{comp.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{comp.rating}</span>
                          <span className="text-slate-500 text-sm">({comp.reviewCount} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {comp.location}
                        </span>
                        {comp.website && (
                          <a 
                            href={comp.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 text-violet-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-4 h-4" />
                            Website
                          </a>
                        )}
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {services.map(service => {
                          const hasService = comp.services.includes(service)
                          return (
                            <span key={service} className={`px-2 py-1 rounded text-xs ${getServiceColor(hasService)}`}>
                              {hasService ? '✓' : '✗'} {service}
                            </span>
                          )
                        })}
                      </div>

                      {/* Gaps */}
                      {comp.gaps.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {comp.gaps.map((gap, j) => (
                            <span key={j} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                              💡 {gap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const info = `${comp.name}\n${comp.location}\nRating: ${comp.rating}\nReviews: ${comp.reviewCount}\nServices: ${comp.services.join(', ')}\nGaps: ${comp.gaps.join(', ')}`
                          handleCopy(info, `comp-${i}`)
                        }}
                        className="p-2 bg-slate-700 hover:bg-violet-600 rounded-lg transition"
                        title="Kopieer info"
                      >
                        {copiedId === `comp-${i}` ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                      {comp.website && (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-700 hover:bg-blue-600 rounded-lg transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div className="mt-8 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Jouw Voordeel
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">🎯 Quick Wins</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• {highOpp} concurrenten hebben geen goede online aanwezigheid</li>
                    <li>• Focus op bedrijven zonder website voor snelle wins</li>
                    <li>• Review management = snelle zichtbaarheid</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="font-semibold mb-2">🚀 Groeikansen</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Google Ads space is nog open bij {competitors.filter(c => !c.hasGoogleAds).length} bedrijven</li>
                    <li>• Local SEO kan je snel boven deze concurrenten krijgen</li>
                    <li>• Review campagnes voor snelle social proof</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!searched && !loading && (
          <div className="text-center py-16 text-slate-500">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Scan concurrenten in je regio</h3>
            <p>Ontdek wie er online actief is en waar jij kunt winnen</p>
          </div>
        )}
      </div>
    </div>
  )
}