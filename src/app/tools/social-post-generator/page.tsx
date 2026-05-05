'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, RefreshCw, MessageSquare, Instagram, Facebook, Linkedin, Twitter, Calendar } from 'lucide-react'

const businessTypes = [
  'Restaurant/Café', 'Salon/Schoonheid', 'Auto Werkplaats', 'Loodgieter',
  'Elektricien', 'Timmerman', 'Schilder', 'Hovenier', 'Makelaar',
  'Tandarts', 'Fysiotherapie', 'Winkel', 'Hotel', 'Sportclub', 'Overig'
]

const postTypes = [
  { id: 'promo', label: 'Aanbieding', emoji: '🎁', desc: 'Promotie of korting' },
  { id: 'info', label: ' Informatie', emoji: 'ℹ️', desc: 'Over je diensten' },
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
  
  // Instagram
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
      `⭐ " Zo'n goede ervaring bij ${business}! "\n\n- Tevreden klant\n\nBedankt voor het vertrouwen! 🙏`,
      `Review van de week: " ${business} heeft mijn verwachtingen overtroffen! "\n\nBedankt! ⭐⭐⭐⭐⭐`,
    ],
    seasonal: [
      `${new Date().getMonth() === 11 ? '🎄' : new Date().getMonth() === 5 ? '☀️' : '🌸'} Seizoens-tip van ${business}!\n\nDit is het perfecte moment om [dienst] te boeken. Bel nu voor een afspraak!`,
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

  // Facebook
  posts.push({
    platform: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    content: `${business} heeft iets te vieren! 🎉\n\nWij geloven in goede service en tevreden klanten. Kom langs en ervaar het zelf!\n\n📍 [ADRES]\n📞 [TELEFOON]\n\nDeel dit bericht met vrienden die dit kunnen gebruiken!`,
    hashtags: [],
    optimalTime: '13:00 - 15:00 uur'
  })

  // LinkedIn
  posts.push({
    platform: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    content: `${business} - Jouw partner voor [dienst]\n\nMet jarenlange ervaring en een team van gedreven professionals staan wij klaar voor jouw project.\n\nInteresse? Neem contact op voor een vrijblijvend gesprek.`,
    hashtags: ['lokaalondernemen', 'zakelijk', 'innovatie'],
    optimalTime: '7:00 - 8:30 uur'
  })

  return posts
}

export default function SocialPostGenerator() {
  const [business, setBusiness] = useState('')
  const [postType, setPostType] = useState('')
  const [posts, setPosts] = useState<GeneratedPost[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Instagram')

  const handleGenerate = () => {
    if (!business || !postType) return
    setLoading(true)
    
    setTimeout(() => {
      const generated = generatePosts(business, postType)
      setPosts(generated)
      setActiveTab(generated[0].platform)
      setLoading(false)
    }, 1500)
  }

  const copyPost = (platform: string, post: GeneratedPost) => {
    const fullPost = `${post.content}\n\n${post.hashtags.map(h => '#' + h).join(' ')}`
    navigator.clipboard.writeText(fullPost)
    setCopiedId(platform)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const currentPost = posts.find(p => p.platform === activeTab)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📱</span>
            <h1 className="text-3xl font-black">Social Post Generator</h1>
          </div>
          <p className="text-slate-400">Genereer Social Media posts voor je lokale bedrijf - gratis</p>
        </div>

        {/* Input */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Bedrijfsnaam *</label>
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Bijv. De Loodgieter Amsterdam"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Type post *</label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
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

        {/* Results */}
        {posts.length > 0 && (
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
                    onClick={() => copyPost(activeTab, currentPost)}
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
                        onClick={() => copyPost(post.platform, post)}
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
          </>
        )}

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-center">
          <h3 className="font-bold mb-2">Wil je dit automatiseren?</h3>
          <p className="text-white/80 text-sm mb-4">Wij zetten een complete social media strategie op voor je bedrijf</p>
          <a href="/#contact" className="inline-block bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold">
            Vraag offer aan →
          </a>
        </div>
      </div>
    </div>
  )
}
