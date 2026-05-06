'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, TrendingUp, Copy, Check, Download, RefreshCw, BarChart3, Globe, Star, Filter } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useTemplates, copyWithToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'

interface Keyword {
  keyword: string
  volume: number
  difficulty: number
  cpc: number
  opportunity: 'high' | 'medium' | 'low'
  type: 'informational' | 'navigational' | 'transactional'
}

const generateKeywords = (city: string, industry: string): Keyword[] => {
  const baseKeywords: Omit<Keyword, 'opportunity' | 'type'>[] = [
    { keyword: `${industry} ${city}`, volume: 1200, difficulty: 65, cpc: 2.50 },
    { keyword: `${industry} in de buurt`, volume: 890, difficulty: 45, cpc: 2.20 },
    { keyword: `goedkope ${industry}`, volume: 720, difficulty: 58, cpc: 1.80 },
    { keyword: `${industry} offerte`, volume: 650, difficulty: 42, cpc: 3.10 },
    { keyword: `beste ${industry} ${city}`, volume: 540, difficulty: 71, cpc: 2.80 },
    { keyword: `${industry} aan huis`, volume: 480, difficulty: 38, cpc: 2.40 },
    { keyword: `24 uur ${industry}`, volume: 420, difficulty: 52, cpc: 3.20 },
    { keyword: `${industry} vergelijken`, volume: 380, difficulty: 35, cpc: 1.60 },
    { keyword: `ervaren ${industry}`, volume: 350, difficulty: 48, cpc: 2.30 },
    { keyword: `${industry} prijs`, volume: 320, difficulty: 55, cpc: 2.70 },
    { keyword: `${industry} noodgeval`, volume: 290, difficulty: 30, cpc: 4.10 },
    { keyword: `lokale ${industry}`, volume: 270, difficulty: 40, cpc: 2.00 },
    { keyword: `${industry} review`, volume: 250, difficulty: 62, cpc: 1.90 },
    { keyword: `klant reviews ${industry}`, volume: 220, difficulty: 58, cpc: 1.70 },
    { keyword: `${industry} garanderen`, volume: 180, difficulty: 25, cpc: 2.60 },
  ]

  return baseKeywords.map((k, i): Keyword => ({
    ...k,
    opportunity: (k.difficulty < 40 ? 'high' : k.difficulty < 60 ? 'medium' : 'low') as Keyword['opportunity'],
    type: (i % 3 === 0 ? 'transactional' : i % 3 === 1 ? 'informational' : 'navigational') as Keyword['type']
  })).sort((a, b) => b.opportunity === 'high' ? -1 : 1)
}

function KeywordSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 w-40 bg-slate-700 rounded mb-2"></div>
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-20 bg-slate-700 rounded"></div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <Search className="w-16 h-16 mx-auto mb-4 text-slate-600" />
      <h3 className="text-xl font-bold text-slate-400 mb-2">Vind lokale zoekwoorden</h3>
      <p className="text-slate-500">Voer een stad en branche in om te beginnen</p>
    </div>
  )
}

function DifficultyBar({ difficulty }: { difficulty: number }) {
  const color = difficulty < 40 ? 'bg-green-500' : difficulty < 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${difficulty}%` }}></div>
      </div>
      <span className="text-xs text-slate-400">{difficulty}</span>
    </div>
  )
}

export default function LocalKeywordFinder() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('local-keyword-finder')
  const { saveTemplate, getTemplatesForTool } = useTemplates()

  const [city, setCity] = useState(inputs.city || '')
  const [industry, setIndustry] = useState(inputs.industry || '')
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null)
  const [filterOpportunity, setFilterOpportunity] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [sortBy, setSortBy] = useState<'volume' | 'difficulty' | 'cpc'>('volume')

  const savedTemplates = getTemplatesForTool('local-keyword-finder')

  // Pre-fill from profile
  useEffect(() => {
    if (profile?.city && !inputs.city) {
      setCity(profile.city)
    }
  }, [profile, inputs.city])

  const handleSearch = () => {
    if (!city || !industry) return
    setLoading(true)
    setSearched(false)

    setTimeout(() => {
      const results = generateKeywords(city, industry)
      setKeywords(results)
      setSearched(true)
      setLoading(false)
      saveInputs({ city, industry })
    }, 1000)
  }

  const filteredKeywords = keywords
    .filter(k => filterOpportunity === 'all' || k.opportunity === filterOpportunity)
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume
      if (sortBy === 'difficulty') return a.difficulty - b.difficulty
      return b.cpc - a.cpc
    })

  const handleCopy = async (keyword: string) => {
    await copyWithToast(`"${keyword}" gekopieerd!`, 'success')
    setCopiedKeyword(keyword)
    setTimeout(() => setCopiedKeyword(null), 2000)
  }

  const handleExportCSV = () => {
    const headers = ['Keyword', 'Volume', 'Difficulty', 'CPC', 'Opportunity', 'Type']
    const rows = filteredKeywords.map(k => [
      k.keyword, k.volume, k.difficulty, k.cpc, k.opportunity, k.type
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keywords_${city}_${industry}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    copyWithToast(`${filteredKeywords.length} zoekwoorden geëxporteerd!`, 'success')
  }

  const handleSaveAsTemplate = () => {
    saveTemplate('local-keyword-finder', `${city} - ${industry}`, { city, industry })
    copyWithToast('Template opgeslagen!', 'success')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔑</span>
              <div>
                <h1 className="text-3xl font-black">Local Keyword Finder</h1>
                <p className="text-slate-400">Vind de beste lokale zoekwoorden voor SEO</p>
              </div>
            </div>
            <TemplateSwitcher
              toolId="local-keyword-finder"
              onApply={(data) => {
                if (data.city) setCity(data.city)
                if (data.industry) setIndustry(data.industry)
              }}
              currentData={{ city, industry }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Stad</label>
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
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Bijv. Loodgieter"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                disabled={!city || !industry || loading}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> Zoeken...</>
                ) : (
                  <><Search className="w-5 h-5" /> Vind Keywords</>
                )}
              </button>
              {savedTemplates.length > 0 && (
                <select
                  onChange={(e) => {
                    const t = savedTemplates.find(t => t.id === e.target.value)
                    if (t) {
                      setCity(t.data.city)
                      setIndustry(t.data.industry)
                    }
                    e.target.value = ''
                  }}
                  className="px-3 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl cursor-pointer transition"
                  title="Laad template"
                >
                  <option value="">📁</option>
                  {savedTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <KeywordSkeleton key={i} />)}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-white">{keywords.length}</div>
                <div className="text-sm text-slate-400">Totaal</div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <div className="text-2xl font-black text-green-400">
                  {keywords.filter(k => k.opportunity === 'high').length}
                </div>
                <div className="text-sm text-green-400">High Opportunity</div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-2xl font-black text-yellow-400">
                  {keywords.filter(k => k.opportunity === 'medium').length}
                </div>
                <div className="text-sm text-yellow-400">Medium</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-blue-400">
                  {Math.round(keywords.reduce((sum, k) => sum + k.volume, 0) / keywords.length)}
                </div>
                <div className="text-sm text-slate-400">Avg. Volume</div>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex gap-2">
                {(['all', 'high', 'medium', 'low'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterOpportunity(f)}
                    className={`px-4 py-2 rounded-xl font-medium transition ${
                      filterOpportunity === f
                        ? f === 'high' ? 'bg-green-600 text-white'
                          : f === 'medium' ? 'bg-yellow-600 text-white'
                          : f === 'low' ? 'bg-red-600 text-white'
                          : 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {f === 'all' ? 'Alle' : f === 'high' ? '🟢 High' : f === 'medium' ? '🟡 Medium' : '🔴 Low'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
                >
                  <option value="volume">Sorteer: Volume</option>
                  <option value="difficulty">Sorteer: Difficulty</option>
                  <option value="cpc">Sorteer: CPC</option>
                </select>
                <button
                  onClick={handleSaveAsTemplate}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
                >
                  💾 Save
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {/* Keywords List */}
            {filteredKeywords.length > 0 ? (
              <div className="space-y-2">
                {filteredKeywords.map((keyword, i) => (
                  <div
                    key={i}
                    className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            keyword.opportunity === 'high' ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                              : keyword.opportunity === 'medium' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-red-600/20 text-red-400 border border-red-500/30'
                          }`}>
                            {keyword.opportunity === 'high' ? '🟢 HIGH' : keyword.opportunity === 'medium' ? '🟡 MED' : '🔴 LOW'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            keyword.type === 'transactional' ? 'bg-blue-600/20 text-blue-400'
                              : keyword.type === 'informational' ? 'bg-purple-600/20 text-purple-400'
                              : 'bg-slate-600/20 text-slate-400'
                          }`}>
                            {keyword.type === 'transactional' ? '🛒 Transactional' 
                              : keyword.type === 'informational' ? '📚 Informational'
                              : '🧭 Navigational'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{keyword.keyword}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {keyword.volume}/maand
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <DifficultyBar difficulty={keyword.difficulty} />
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            €{keyword.cpc.toFixed(2)} CPC
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(keyword.keyword)}
                        className="p-3 bg-slate-700 hover:bg-violet-600 rounded-xl transition"
                        title="Kopieer zoekwoord"
                      >
                        {copiedKeyword === keyword.keyword ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>Geen zoekwoorden gevonden met deze filters</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!searched && !loading && <EmptyState />}
      </div>
    </div>
  )
}