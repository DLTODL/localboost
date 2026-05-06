'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Star, Search, FileText, Mail, Target, MapPin, MessageSquare, BarChart3, Zap, User } from 'lucide-react'
import { motion } from 'framer-motion'

const allTools = [
  {
    category: 'Gratis Tools',
    tools: [
      {
        name: 'Lead Finder',
        desc: 'Vind potentiele klanten in je regio',
        icon: '🎯',
        href: '/tools/lead-finder',
        color: 'from-red-600 to-orange-600',
        popular: true
      },
      {
        name: 'Review Generator',
        desc: 'Genereer gepersonaliseerde review verzoeken',
        icon: '⭐',
        href: '/tools/review-generator',
        color: 'from-yellow-600 to-amber-600',
        popular: true
      },
      {
        name: 'Social Post Generator',
        desc: 'AI social media posts voor je bedrijf',
        icon: '📱',
        href: '/tools/social-post-generator',
        color: 'from-pink-600 to-rose-600',
        popular: true
      },
      {
        name: 'SEO Scanner',
        desc: 'Analyseer elke website in seconden',
        icon: '🔍',
        href: '/tools/seo-scanner',
        color: 'from-blue-600 to-cyan-600',
        popular: false
      },
      {
        name: 'Local Keyword Finder',
        desc: 'Vind lokale zoekwoorden',
        icon: '📊',
        href: '/tools/local-keyword-finder',
        color: 'from-green-600 to-emerald-600',
        popular: false
      },
      {
        name: 'Competitor Scanner',
        desc: 'Ontdek wat je concurrenten doen',
        icon: '🔎',
        href: '/tools/competitor-scanner',
        color: 'from-orange-600 to-amber-600',
        popular: false
      },
      {
        name: 'Email Sequences',
        desc: 'Kopieer bewezen email templates',
        icon: '📧',
        href: '/tools/email-sequences',
        color: 'from-violet-600 to-purple-600',
        popular: false
      },
    ]
  },
  {
    category: 'Business Tools',
    tools: [
      {
        name: 'Google Business Guide',
        desc: 'Stap-voor-stap checklist om #1 te worden',
        icon: '📍',
        href: '/tools/google-business-guide',
        color: 'from-emerald-600 to-teal-600',
        popular: false
      },
      {
        name: 'Proposal Generator',
        desc: 'Genereer professionele voorstellen',
        icon: '📄',
        href: '/tools/proposal-generator',
        color: 'from-amber-600 to-orange-600',
        popular: false
      },
      {
        name: 'Quote Generator',
        desc: 'Genereer professionele offertes voor klanten',
        icon: '📋',
        href: '/tools/quote-generator',
        color: 'from-blue-600 to-indigo-600',
        popular: false
      },
      {
        name: 'ROI Calculator',
        desc: 'Bereken het rendement van je marketing investering',
        icon: '📈',
        href: '/tools/roi-calculator',
        color: 'from-green-600 to-teal-600',
        popular: false
      },
    ]
  }
]

// Quick access tools
const quickTools = [
  { name: 'Lead Finder', icon: '🎯', href: '/tools/lead-finder', color: 'from-red-600 to-orange-600' },
  { name: 'Review Generator', icon: '⭐', href: '/tools/review-generator', color: 'from-yellow-600 to-amber-600' },
  { name: 'Email Campaign', icon: '📧', href: '/tools/email-campaign-builder', color: 'from-violet-600 to-purple-600' },
  { name: 'Quote Generator', icon: '📋', href: '/tools/quote-generator', color: 'from-blue-600 to-indigo-600' },
]

const ONBOARDING_KEY = 'localboost_show_onboarding'

export default function ToolsHub() {
  const router = useRouter()
  const [recentTools, setRecentTools] = useState<{name: string; href: string; icon: string}[]>([])

  useEffect(() => {
    // Track recently viewed tools
    const stored = localStorage.getItem('localboost_recent_tools')
    if (stored) {
      try {
        setRecentTools(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const handleToolClick = (tool: typeof allTools[0]['tools'][0]) => {
    // Update recent tools
    const recent = [tool, ...recentTools.filter(t => t.name !== tool.name)].slice(0, 4)
    localStorage.setItem('localboost_recent_tools', JSON.stringify(recent))
    setRecentTools(recent)
  }

  // Check if user has completed onboarding
  const hasProfile = typeof window !== 'undefined' && localStorage.getItem('localboost_business_profile')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-black mb-4">
            Alle <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Gratis Tools</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Tools die je meteen kunt gebruiken - geen aanmelding, geen creditcard. Gewoon bouwen.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {allTools.map((section, sectionIndex) => (
          <div key={section.category} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              {sectionIndex === 0 ? (
                <Star className="w-6 h-6 text-yellow-400" />
              ) : (
                <BarChart3 className="w-6 h-6 text-violet-400" />
              )}
              {section.category}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={() => handleToolClick(tool)}
                  className="group relative bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 hover-lift"
                >
                  {tool.popular && (
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-xs font-bold">
                      POPULAIR
                    </div>
                  )}
                  
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-violet-300 transition">
                    {tool.name}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4">
                    {tool.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-violet-400 text-sm font-medium group-hover:gap-3 transition-all">
                    Gebruik gratis <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Setup Banner - for users without profile */}
        {!hasProfile && (
          <div className="mt-16 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/20">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                🚀
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Persoonlijke setup - 30 seconden</h2>
                <p className="text-slate-400 mb-4">Voer je bedrijfsnaam in en alle tools worden voor jou gepersonaliseerd. Pre-fill, snellere workflows, betere resultaten.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      localStorage.setItem(ONBOARDING_KEY, 'true')
                      router.push('/')
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 rounded-xl font-semibold flex items-center gap-2 transition"
                  >
                    Start Setup <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-400" />
            Snel toegang
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickTools.map(tool => (
              <Link
                key={tool.name}
                href={tool.href}
                onClick={() => handleToolClick({ name: tool.name, href: tool.href, icon: tool.icon } as any)}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 hover-lift transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-3 shadow-lg`}>
                  {tool.icon}
                </div>
                <div className="font-semibold group-hover:text-violet-300 transition">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klaar om te groeien?</h2>
          <p className="text-white/80 mb-6">
            Onze tools zijn gratis. Maar voor een complete groei strategie, zijn wij er voor je.
          </p>
          <a 
            href="/#contact" 
            className="inline-block bg-white text-violet-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition"
          >
            Neem contact op →
          </a>
        </div>
      </div>
    </div>
  )
}