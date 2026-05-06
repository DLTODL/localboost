'use client'

import Link from 'next/link'
import { ArrowRight, Star, Search, FileText, Mail, Target, MapPin, MessageSquare, BarChart3 } from 'lucide-react'

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

export default function ToolsHub() {
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
                <a
                  key={tool.name}
                  href={tool.href}
                  className="group relative bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10"
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
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Quote Generator Promo */}
        <div className="mt-16 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl p-8 border border-blue-500/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">📋 Nieuw: Quote Generator</h2>
              <p className="text-slate-400">Genereer professionele, printbare offertes voor je klanten met automatische berekeningen.</p>
            </div>
            <a 
              href="/tools/quote-generator" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold flex items-center gap-2 transition"
            >
              Probeer nu <ArrowRight className="w-4 h-4" />
            </a>
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
