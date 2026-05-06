'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Sparkles, Copy, Check, RefreshCw, Instagram, Facebook, Linkedin, Calendar, X, ExternalLink, Send, Building, MapPin } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useSelectedBusiness, useLeads, copyWithToast, useCrossToolBridge } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'
import { FormSkeleton } from '@/components/polish/Skeleton'

const postTypes = [
  { id: 'promo', label: 'Aanbieding', emoji: '🎁', desc: 'Promotie of korting' },
  { id: 'info', label: 'Informatie', emoji: 'ℹ️', desc: 'Over je diensten' },
  { id: 'social', label: 'Sociaal', emoji: '👥', desc: 'Team, achter de schermen' },
  { id: 'testimonial', label: 'Review', emoji: '⭐', desc: 'Klanttevredenheid' },
  { id: 'seasonal', label: 'Seizoensgebonden', emoji: '🌸', desc: 'Jaargetijde, feestdagen' },
]

interface GeneratedPost {
  platform: string
  icon: React.ReactNode
  content: string
  hashtags: string[]
  optimalTime: string
}

const generatePosts = (business: string, type: string): GeneratedPost[] => {
  const posts: GeneratedPost[] = []
  
  const instagramTemplates: Record<string, string[]> = {
    promo: [
      `✂️ Nieuwe aanbieding bij ${business}! ✂️\n\nDit seizoen sparen we je geld. Bestel nu en krijg [X]% korting!\n\n💬 DM voor meer info\n📍 [ADRES]`,
      `🎉 SPOT DE PRIJS! 🎉\n\nBij ${business} vind je de beste [product/dienst] voor de leukste prijs. Kom langs deze week!\n\n#lokaal #aanbieding #${business.toLowerCase().replace(/\s/g, '')}`,
    ],
    info: [
      `Wist je dat...?\n\nBij ${business} helpen we je met [dienst]. Vraag vrijblijvend om informatie!\n\n💬 Stuur ons een DM`,
      `${business} staat voor kwaliteit! ✅\n\nOnze [dienst] wordt uitgevoerd door ervaren vakmensen. BEL [TELEFOON] voor een gratis intake!`,
    ],
    social: [
      `Teamwork makes the dream work! 💪\n\nOns team bij ${business} staat klaar om je te helpen. Kom langs en maak kennis!\n\n#team #lokaal`,
      `Achter de schermen bij ${business} 🔧\n\nZo ziet een werkdag eruit bij ons. Geen dag is hetzelfde!`,
    ],
    testimonial: [
      `⭐ "Zo'n goede ervaring bij ${business}!"\n\n- Tevreden klant\n\nBedankt voor het vertrouwen! 🙏`,
      `Review van de week: "${business} heeft mijn verwachtingen overtroffen!"\n\nBedankt! ⭐⭐⭐⭐⭐`,
    ],
    seasonal: [
      `🌸 Seizoens-tip van ${business}!\n\nDit is het perfecte moment om [dienst] te boeken. Bel nu voor een afspraak!`,
    ]
  }

  const template = instagramTemplates[type] || instagramTemplates.info
  const selectedTemplate = template[Math.floor(Math.random() * template.length)]

  posts.push({
    platform: 'Instagram',
    icon: <Instagram className="w-5 h-5" />,
    content: selectedTemplate,
    hashtags: ['lokaal', business.toLowerCase().replace(/\s/g, ''), type === 'promo' ? 'aanbieding' : 'lokaalbedrijf'],
    optimalTime: '9:00 - 11:00 uur'
  })

  posts.push({
    platform: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    content: `${business} heeft iets te vieren! 🎉\n\nWij geloven in goede service en tevreden klanten. Kom langs en ervaar het zelf!\n\n📍 [ADRES]\n📞 [TELEFOON]\n\nDeel dit bericht met vrienden die dit kunnen gebruiken!`,
    hashtags: [],
    optimalTime: '13:00 - 15:00 uur'
  })

  posts.push({
    platform: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    content: `${business} - Jouw partner voor [dienst]\n\nMet jarenlange ervaring en een team van gedreven professionals staan wij klaar voor jouw project.\n\nInteresse? Neem contact op voor een vrijblijvend gesprek.`,
    hashtags: ['lokaalondernemen', 'zakelijk', 'innovatie'],
    optimalTime: '7:00 - 8:30 uur'
  })

  return posts
}

// Lead Picker Dropdown Component
function LeadPickerDropdown({ onSelect, onClose }: { onSelect: (lead: any) => void; onClose: () => void }) {
  const { leads } = useLeads()
  const [search, setSearch] = useState('')

  const filteredLeads = search
    ? leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()))
    : leads.slice(0, 5)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.lead-picker-dropdown')) {
        onClose()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  if (leads.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 p-4 lead-picker-dropdown">
        <div className="text-sm text-slate-400 text-center">
          <p>Geen leads in CRM</p>
          <Link href="/tools/lead-finder" className="text-violet-400 hover:text-violet-300 mt-2 inline-block">
            Zoek leads →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 lead-picker-dropdown">
      <div className="p-2 border-b border-slate-700">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek in CRM..."
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm outline-none focus:border-violet-500"
          autoFocus
        />
      </div>
      <div className="max-h-48 overflow-y-auto p-1">
        {filteredLeads.length > 0 ? (
          filteredLeads.map(lead => (
            <button
              key={lead.id}
              onClick={() => onSelect(lead)}
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
          ))
        ) : (
          <div className="p-4 text-center text-sm text-slate-500">
            Geen resultaten
          </div>
        )}
      </div>
      <div className="p-2 border-t border-slate-700">
        <Link href="/tools/lead-finder" className="flex items-center justify-center gap-2 py-2 text-xs text-violet-400 hover:text-violet-300 transition">
          Bekijk alle leads in CRM →
        </Link>
      </div>
    </div>
  )
}

export default function SocialPostGenerator() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('social-post-generator')
  const { business: selectedBusiness, selectBusiness } = useSelectedBusiness()
  const { getLastBusiness } = useCrossToolBridge()

  const [business, setBusiness] = useState('')
  const [industry, setIndustry] = useState('')
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showLeadPicker, setShowLeadPicker] = useState(false)

  // Initial load skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 600)
    return () => clearTimeout(timer)
  }, [])
  const [postType, setPostType] = useState('')
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Instagram')

  // Pre-fill from profile or shared business selection
  useEffect(() => {
    // Priority: 1) URL params, 2) Selected business from Lead Finder, 3) Profile
    if (selectedBusiness) {
      if (selectedBusiness.name) {
        setBusiness(selectedBusiness.name)
      }
      if (selectedBusiness.industry) {
        setIndustry(selectedBusiness.industry)
      }
    } else {
      // Check for last business from cross-tool bridge
      const lastBusiness = getLastBusiness()
      if (lastBusiness) {
        setBusiness(lastBusiness.name || '')
        setIndustry(lastBusiness.industry || '')
      } else if (profile && profile.name) {
        setBusiness(profile.name)
        if (profile.type) setIndustry(profile.type)
      }
    }
  }, [profile, selectedBusiness, getLastBusiness])

  // Save inputs on change
  useEffect(() => {
    if (business || postType || industry) {
      saveInputs({ business, postType, industry })
    }
  }, [business, postType, industry, saveInputs])

  const handleGenerate = () => {
    if (!business || !postType) return
    setLoading(true)
    
    setTimeout(() => {
      const generated = generatePosts(business, postType)
      setPosts(generated)
      setActiveTab(generated[0].platform)
      setLoading(false)
    }, 1200)
  }

  const handleCopy = async (platform: string, post: GeneratedPost) => {
    const fullPost = `${post.content}\n\n${post.hashtags.map(h => '#' + h).join(' ')}`
    await copyWithToast(fullPost, 'Post gekopieerd!')
    setCopiedId(platform)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const currentPost = posts.find(p => p.platform === activeTab)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      {isInitialLoad ? (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📱</span>
            <div>
              <h1 className="text-3xl font-black">Social Post Generator</h1>
              <p className="text-slate-400">Laden...</p>
            </div>
          </div>
          <FormSkeleton fields={3} />
        </div>
      ) : (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📱</span>
              <div>
                <h1 className="text-3xl font-black">Social Post Generator</h1>
                <p className="text-slate-400">Genereer Social Media posts voor je lokale bedrijf</p>
              </div>
            </div>
            <TemplateSwitcher
              toolId="social-post-generator"
              onApply={(data) => {
                if (data.business) setBusiness(data.business)
                if (data.industry) setIndustry(data.industry)
                if (data.postType) setPostType(data.postType)
              }}
              currentData={{ business, industry, postType }}
            />
          </div>
        </div>

        {/* Input */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-slate-300">Genereer posts voor:</h2>
            {selectedBusiness && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg text-xs">
                <span className="text-violet-400">🎯</span>
                <span className="text-violet-300">Geladen uit Lead Finder</span>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Bedrijfsnaam</label>
              <div className="relative">
                <input
                  type="text"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  placeholder="De Loodgieter Amsterdam"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition pr-20"
                />
                <button
                  onClick={() => setShowLeadPicker(!showLeadPicker)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                  title="Laad uit CRM"
                >
                  CRM
                </button>
              </div>
              {/* Lead Picker Dropdown */}
              {showLeadPicker && (
                <LeadPickerDropdown
                  onSelect={(lead) => {
                    setBusiness(lead.company || lead.name)
                    setIndustry(lead.industry || '')
                    selectBusiness({
                      name: lead.company || lead.name,
                      phone: lead.phone,
                      email: lead.email,
                      website: '',
                      address: lead.address || '',
                      city: lead.city,
                      industry: lead.industry || ''
                    })
                    setShowLeadPicker(false)
                  }}
                  onClose={() => setShowLeadPicker(false)}
                />
              )}
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
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type post</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
              >
                <option value="">Selecteer type...</option>
                {postTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!business || !postType || loading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Genereren...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Genereer Posts</>
            )}
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-lg font-medium text-violet-300">Social posts genereren...</div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-slate-700/50 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-slate-700/30 rounded-xl animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-slate-700/30 rounded-xl animate-pulse"></div>
                <div className="h-10 bg-slate-700/30 rounded-xl animate-pulse"></div>
                <div className="h-10 bg-slate-700/30 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && posts.length > 0 && (
          <>
            {/* Platform Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {posts.map(post => (
                <button
                  key={post.platform}
                  onClick={() => setActiveTab(post.platform)}
                  className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap transition ${
                    activeTab === post.platform
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {post.icon}
                  {post.platform}
                </button>
              ))}
            </div>

            {/* Post Preview */}
            {currentPost && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden mb-6">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                    {currentPost.icon}
                  </div>
                  <div>
                    <div className="font-bold">{business}</div>
                    <div className="text-xs text-slate-400">{currentPost.platform}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-white mb-4">{currentPost.content}</pre>
                  
                  {currentPost.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentPost.hashtags.map((tag, i) => (
                        <span key={i} className="text-violet-400 text-sm">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    Beste tijd: {currentPost.optimalTime}
                  </div>
                  <button
                    onClick={() => handleCopy(activeTab, currentPost)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium flex items-center gap-2 transition"
                  >
                    {copiedId === activeTab ? (
                      <><Check className="w-4 h-4" /> Gekopieerd!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Kopieer</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* All Posts Preview */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="font-bold mb-4">📋 Alle Posts</h3>
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.platform} className="p-4 bg-slate-900 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 font-medium">
                        {post.icon} {post.platform}
                      </span>
                      <button
                        onClick={() => handleCopy(post.platform, post)}
                        className="text-sm text-violet-400 hover:text-violet-300"
                      >
                        {copiedId === post.platform ? '✓ Gekopieerd' : 'Kopieer'}
                      </button>
                    </div>
                    <pre className="text-sm text-slate-400 whitespace-pre-wrap">{post.content.slice(0, 100)}...</pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-tool: Create Email Sequence */}
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">📧 Bijpassende Email Sequence</h3>
                  <p className="text-sm text-slate-400">Genereer een email campaign gebaseerd op dit bedrijf</p>
                </div>
                <Link
                  href="/tools/email-campaign-builder"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  Maak Sequence
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
              <span className="text-5xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">Genereer je eerste social post</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Voer je bedrijfsnaam in, kies een type post en klik op genereren om AI-gecreëerde content te krijgen
            </p>
            {(!business || !postType) && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-300 rounded-lg text-sm">
                <span>👆 Vul eerst de velden hierboven in</span>
              </div>
            )}
          </div>
        )}
      </div>
      )}
    </div>
  )
}
