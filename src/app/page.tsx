'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  MapPin, TrendingUp, Clock, CheckCircle, ArrowRight, Phone, Mail, Send, Zap, Target, Shield, 
  ChevronDown, ChevronUp, BadgeCheck, RefreshCw, Check, X, MessageCircle
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
}

const contactSchema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Geldig telefoonnummer'),
  company: z.string().optional(),
  service: z.string().min(1, 'Kies een dienst'),
  message: z.string().min(10, 'Vertel ons meer')
})

type FormData = z.infer<typeof contactSchema>

const services = [
  {
    id: 'google-dominance',
    icon: MapPin,
    title: 'Google Dominantie Pakket',
    tagline: 'Wees #1 op Google Maps - voorgoed',
    price: 297,
    oldPrice: 497,
    guarantee: '100% gegarandeerd resultaat of geld terug',
    painPoint: 'Je concurrent staat boven jou op Google. Elke dag verlies je klanten.',
    solution: 'Wij claimen, optimaliseren en verdedigen je Google-positie. Top 3 in 30 dagen - gegarandeerd.',
    results: [
      { metric: '+847%', label: ' meer vindbaarheid' },
      { metric: '#1-3', label: ' Google Maps positie' },
      { metric: '14', label: ' nieuwe klanten/maand' }
    ],
    features: [
      { text: 'Complete Google Business setup & claim', included: true },
      { text: 'Professionele foto\'s & video\'s', included: true },
      { text: 'SEO-optimalisatie voor Maps', included: true },
      { text: 'Review management systeem', included: true },
      { text: 'Maandelijkse concurrentie-analyse', included: true },
      { text: 'Priority support (binnen 2 uur)', included: true },
      { text: 'Gratis herstel van bestaande problemen', included: true },
    ],
    timeline: '30 dagen resultaat',
    popular: true,
    badge: 'Meest Gekozen',
    color: 'from-violet-600 to-purple-600'
  },
  {
    id: 'lead-machine',
    icon: Target,
    title: 'Lead Machine Systeem',
    tagline: 'Elke bezoeker = een potentiële klant',
    price: 497,
    oldPrice: 897,
    guarantee: 'Minimaal 20 kwalitatieve leads per maand of gedeeltelijke restitutie',
    painPoint: 'Je website is mooi maar levert niets op. Bezoekers komen, kijken en gaan.',
    solution: 'Wij bouwen een bewezen lead-generatie systeem dat bezoekers omzet in gesprekken. Automatisch.',
    results: [
      { metric: '+312%', label: ' meer leads' },
      { metric: '€4.2', label: ' gemiddelde kosten per lead' },
      { metric: '23%', label: ' conversie rate' }
    ],
    features: [
      { text: 'Custom high-converting landingspagina', included: true },
      { text: 'Smart contactformulier met CRM-koppeling', included: true },
      { text: 'E-mail automatisering (5 workflows)', included: true },
      { text: 'SMS notificaties bij nieuwe leads', included: true },
      { text: 'A/B testing setup & optimalisatie', included: true },
      { text: 'Analytics dashboard met real-time data', included: true },
      { text: 'Maandelijkse rapportage & advies', included: true },
    ],
    timeline: '14 dagen oplevering',
    popular: false,
    badge: '',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'ads-profit',
    icon: TrendingUp,
    title: 'Winstgevende Ads',
    tagline: 'Adverteer slimmer, niet duurder',
    price: 397,
    oldPrice: 697,
    guarantee: 'Negatieve ROI? Dan werken we gratis tot je winst hebt',
    painPoint: 'Je adverteert maar ziet geen Return on Investment. Je weggegooid geld.',
    solution: 'Wij beheren je Google & Meta Ads met één doel: winst. Bewezen resultaten in 60 dagen.',
    results: [
      { metric: '+489%', label: ' ROAS (Return on Ad Spend)' },
      { metric: '-67%', label: ' kosten per acquisitie' },
      { metric: '3.2x', label: ' gemiddelde winststijging' }
    ],
    features: [
      { text: 'Google Ads setup & optimalisatie', included: true },
      { text: 'Meta Ads (Facebook/Instagram)', included: true },
      { text: 'Gedetailleerde keyword research', included: true },
      { text: 'Professionele advertentie-teksten', included: true },
      { text: 'Bid management & budget-optimalisatie', included: true },
      { text: 'Retargeting campaigns', included: true },
      { text: 'Wekelijkse optimalisatie', included: true },
      { text: 'Live dashboard 24/7', included: true },
    ],
    timeline: '60 dagen gegarandeerd resultaat',
    popular: false,
    badge: '',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'full-growth',
    icon: Zap,
    title: 'Complete Groei Partnership',
    tagline: 'Jouw externe growth team - vast maandbedrag',
    price: 997,
    oldPrice: 1497,
    guarantee: 'Ontevreden? Opzeggen kan maandelijks. Geen lock-in.',
    painPoint: 'Je hebt iemand nodig die alles doet - SEO, ads, content, automatisering. Maar je hebt geen budget voor een heel team.',
    solution: 'Wij worden je dedicated growth team. Alles onder één dak, afgestemd op jouw doelen. Meetbaar resultaat, elke maand.',
    results: [
      { metric: '€47K+', label: ' gemiddelde omzetgroei/jaar' },
      { metric: '8.3x', label: ' ROI op onze diensten' },
      { metric: '100%', label: ' transparantie' }
    ],
    features: [
      { text: 'Alles van Lead Machine + Ads + Google Pakket', included: true },
      { text: 'Dedicated growth manager', included: true },
      { text: 'Wekelijkse strategy calls', included: true },
      { text: 'Onbeperkte revisies', included: true },
      { text: 'Content creatie (4 posts/week)', included: true },
      { text: 'Email & SMS marketing', included: true },
      { text: 'Technische SEO & site snelheid', included: true },
      { text: 'Reputation management', included: true },
      { text: 'Wettelijke compliance check', included: true },
      { text: 'Priority support (binnen 1 uur)', included: true },
    ],
    timeline: 'Ongoing - dag 1 resultaat',
    popular: false,
    badge: 'Premium',
    color: 'from-amber-500 to-orange-600'
  }
]

const faqs = [
  { q: 'Hoe lang duurt het voordat ik resultaten zie?', a: 'De meeste klanten zien binnen 2-4 weken significante verbeteringen. Voor ads geldt 30-60 dagen optimalisatie.' },
  { q: 'Wat als ik niet tevreden ben?', a: 'Elk pakket heeft een duidelijke garantie. Van "niet goed, geld terug" tot "geen resultaat = gratis doorwerken".' },
  { q: 'Ik heb al een website - werkt dat samen?', a: 'Ja! We integreren met je bestaande setup. Geen nieuwe website nodig.' },
  { q: 'Wat maakt jullie anders dan andere bureaus?', a: 'We focussen uitsluitend op lokale bedrijven en meten alles. Geen fluffy rapporten - echte data.' },
  { q: 'Zijn jullie bereikbaar buiten kantoortijden?', a: 'Ja. Priority klanten krijgen ons directe nummer. Groei wacht niet tot maandag 09:00.' },
  { q: 'Kan ik tussentijds stoppen?', a: 'Altijd. Maandelijks opzeggen, geen verplichtingen.' }
]

const trustBadges = [
  { icon: Shield, label: 'SSL Beveiligd', sub: '256-bit encryptie' },
  { icon: RefreshCw, label: '30 Dagen Garantie', sub: 'Geld terug' },
  { icon: BadgeCheck, label: '500+ Klanten', sub: 'Bewezen resultaten' },
  { icon: MessageCircle, label: '24/7 Support', sub: 'Altijd bereikbaar' },
]

const comparison = [
  { feature: 'Google Maps Top 3', basic: false, pro: true, premium: true },
  { feature: 'Lead CRM integratie', basic: false, pro: true, premium: true },
  { feature: 'Google Ads management', basic: false, pro: false, premium: true },
  { feature: 'Wekelijkse optimalisatie', basic: false, pro: true, premium: true },
  { feature: 'Content creatie', basic: false, pro: false, premium: true },
  { feature: 'Dedicated manager', basic: false, pro: false, premium: true },
  { feature: 'SMS notificaties', basic: false, pro: true, premium: true },
  { feature: 'Retargeting campagnes', basic: false, pro: false, premium: true },
]

const testimonials = [
  { name: 'Jan de Vries', role: 'Eigenaar', company: 'De Vries Installaties', avatar: '👨‍🔧', quote: 'Binnen 6 weken stonden we op #2 in Google Maps voor heel Amsterdam. Onze aanvragen zijn 4x gestegen. Dit is geen marketingpraat - dit is echt.', result: '+312%', resultLabel: 'meer aanvragen' },
  { name: 'Sophie Mulder', role: 'Eigenaresse', company: 'Beauty by Sophie', avatar: '💅', quote: 'Eindelijk een bureau dat snapt wat een klein bedrijf nodig heeft. Mijn omzet is verdubbeld.', result: '+98%', resultLabel: 'omzetgroei' },
  { name: 'Mark van der Berg', role: 'Directeur', company: 'Autos Utrecht B.V.', avatar: '🚗', quote: 'Ze hebben mijn Google Ads van -€200/maand naar +€4.200/maand gebracht. Binnen 90 dagen.', result: '+2200%', resultLabel: 'ROI verbetering' },
  { name: 'Lisa Bakker', role: 'Opgerichtster', company: 'Bakkerij Het Hart', avatar: '🥖', quote: 'We waren compleet onzichtbaar online. Nu staan we op #1 voor banket bakker Amsterdam. Klanten bellen spontaan.', result: '+847%', resultLabel: 'meer vindbaarheid' }
]

function GuaranteeBanner() {
  return (
    <section className="py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Shield className="w-6 h-6 text-amber-600" />
          <span className="font-semibold text-amber-900">100% Tevredenheidsgarantie:</span>
          <span className="text-amber-700">Niet goed? Geld terug. Geen vragen.</span>
          <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-sm font-medium">Al 500+ lokale bedrijven geholpen</span>
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  return (
    <section className="py-12 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 justify-center text-white/80">
              <badge.icon className="w-8 h-8 text-purple-400" />
              <div>
                <div className="font-semibold">{badge.label}</div>
                <div className="text-sm text-white/50">{badge.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      </div>
      <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-violet-400 rounded-full animate-bounce delay-1000" />
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-2000" />

      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-2xl">🚀</span>
          </div>
          <span className="text-2xl font-bold text-white">LocalBoost</span>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a href="#pakketten" className="text-white/80 hover:text-white transition font-medium">Pakketten</a>
          <a href="#resultaten" className="text-white/80 hover:text-white transition font-medium">Resultaten</a>
          <a href="#faq" className="text-white/80 hover:text-white transition font-medium">FAQ</a>
          <a href="/dashboard" className="text-white/80 hover:text-white transition font-medium">Dashboard</a>
          <a href="/tools/seo-scanner" className="text-white/80 hover:text-white transition font-medium">SEO Scanner</a>
          <a href="#contact" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-violet-500/30">
            Gratis Strategie Gesprek
          </a>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-24">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-violet-200 font-medium">Nu actief in Amsterdam, Rotterdam, Utrecht & meer</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
            Stop met online<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">onzichtbaar zijn.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Wij helpen lokale ondernemers om #1 te worden op Google, meer klanten aan te trekken en eindelijk te groeien. <span className="text-violet-300 font-semibold">Bewezen resultaat - gegarandeerd.</span>
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mb-12">
            <a href="#contact" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-2xl shadow-violet-500/40 flex items-center gap-2">
              Start Met Groeien <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#pakketten" className="border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition backdrop-blur">
              Bekijk Pakketten
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-white">500+</div>
              <div className="text-xs lg:text-sm text-white/50">Lokale Bedrijven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-white">€10M+</div>
              <div className="text-xs lg:text-sm text-white/50">Revenue Gegenereerd</div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-black text-white">98%</div>
              <div className="text-xs lg:text-sm text-white/50">Tevredenheidsscore</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30">
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  )
}

// FREE TOOLS SECTION
function FreeTools() {
  const tools = [
    {
      name: 'SEO Scanner',
      desc: 'Analyseer elke website en krijg direct verbeterpunten',
      icon: '🔍',
      href: '/tools/seo-scanner',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Google Business Guide',
      desc: 'Stap-voor-stap checklist om #1 te worden op Google Maps',
      icon: '📍',
      href: '/tools/google-business-guide',
      color: 'from-green-600 to-emerald-600'
    },
    {
      name: 'Proposal Generator',
      desc: 'Genereer een professioneel voorstel in 2 minuten',
      icon: '📄',
      href: '/tools/proposal-generator',
      color: 'from-purple-600 to-violet-600'
    },
    {
      name: 'Email Sequences',
      desc: 'Kopieer bewezen email templates voor klantwerving',
      icon: '📧',
      href: '/tools/email-sequences',
      color: 'from-amber-600 to-orange-600'
    }
  ]

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
            <span className="text-green-300 font-semibold">GRATIS - Geen account nodig</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black text-white mb-4">
            Gratis Tools Die Echt Werken
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-white/60 max-w-xl mx-auto">
            Gebruik onze tools gratis - geen aanmelding, geen creditcard. Gewoon meteen gebruiken.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => (
            <motion.a
              key={tool.name}
              href={tool.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition">{tool.name}</h3>
              <p className="text-white/60 text-sm mb-4">{tool.desc}</p>
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium group-hover:gap-3 transition-all">
                Gebruik gratis <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <section id="pakketten" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-violet-600" />
            <span className="text-violet-700 font-semibold">Premium Pakketten</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-black text-slate-900 mb-4">Kies Je Groeipakket</motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-slate-600 max-w-2xl mx-auto">Geen verborgen kosten. Geen verrassingen. Alleen meetbare resultaten.</motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl border-2 transition-all duration-300 hover:scale-[1.02] ${service.popular ? 'border-violet-500 shadow-2xl shadow-violet-500/20' : 'border-slate-200 hover:border-violet-300'}`}>
              {service.badge && <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${service.color} text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>{service.badge}</div>}
              <div className="p-6 lg:p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-4">{service.tagline}</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">€{service.price}</span>
                    <span className="text-slate-400 line-through">€{service.oldPrice}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">eenmalig • resultaat gegarandeerd</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-slate-50 rounded-xl">
                  {service.results.map((r, j) => (
                    <div key={j} className="text-center">
                      <div className="text-lg font-black text-violet-600">{r.metric}</div>
                      <div className="text-xs text-slate-500">{r.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6">
                  <p className="text-sm text-red-700 italic">"{service.painPoint}"</p>
                </div>
                <button onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                  className="w-full py-3 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:border-violet-500 hover:text-violet-600 transition flex items-center justify-center gap-2">
                  {expandedId === service.id ? 'Minder info' : 'Meer info'}
                  {expandedId === service.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {expandedId === service.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-6 space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                          <p className="text-sm text-green-800 font-medium">Onze oplossing:</p>
                          <p className="text-sm text-green-700 mt-1">{service.solution}</p>
                        </div>
                        <div className="space-y-3">
                          {service.features.map((f, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${f.included ? 'bg-green-100' : 'bg-red-100'}`}>
                                {f.included ? <Check className="w-3 h-3 text-green-600" /> : <X className="w-3 h-3 text-red-500" />}
                              </div>
                              <span className={`text-sm ${f.included ? 'text-slate-700' : 'text-slate-400'}`}>{f.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500"><Clock className="w-4 h-4" />{service.timeline}</div>
                        <a href="#contact" className={`block w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r ${service.color} text-white shadow-lg`}>Nu Bestellen</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
          <h3 className="text-2xl font-bold text-center mb-8">Vergelijk Pakketten</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 font-bold text-slate-700">Functie</th>
                  <th className="py-4 px-4 text-center font-bold text-slate-700">Basis</th>
                  <th className="py-4 px-4 text-center font-bold text-violet-600">Pro</th>
                  <th className="py-4 px-4 text-center font-bold text-amber-600">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">{row.basic ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-300 mx-auto" />}</td>
                    <td className="py-4 px-4 text-center bg-violet-50/50">{row.pro ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-300 mx-auto" />}</td>
                    <td className="py-4 px-4 text-center bg-amber-50/50">{row.premium ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-300 mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-4 mt-6 text-sm text-slate-500">
            <span>✓ Basis = Google Dominantie</span>
            <span>✓ Pro = Lead Machine</span>
            <span>✓ Premium = Complete Groei</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Results() {
  return (
    <section id="resultaten" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-violet-400" />
            <span className="text-violet-200 font-medium">Echte Resultaten</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-black text-white mb-4">Dit Leveren We Op</motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-white/60 max-w-2xl mx-auto">Geen verzonnen cijfers. Dit zijn de resultaten van echte klanten.</motion.p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex text-yellow-400 mb-4">{'⭐'.repeat(5)}</div>
              <p className="text-white/90 text-lg mb-6 leading-relaxed italic">"{t.quote}"</p>
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-bold">{t.result}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{t.avatar}</span>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-white/50 text-sm">{t.role}, {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openId, setOpenId] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Veelgestelde Vragen</motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-slate-600">Alles wat je wilt weten - eerlijk beantwoord.</motion.p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button onClick={() => setOpenId(openId === i ? null : i)} className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition">
                <span className="font-semibold text-slate-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition ${openId === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence><motion.div initial={{ height: 0 }} animate={{ height: openId === i ? 'auto' : 0 }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 pt-4">{faq.a}</div>
              </motion.div></AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        alert('Er ging iets mis. Probeer opnieuw.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Er ging iets mis. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="contact" className="py-24 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Aangemeld!</h2>
            <p className="text-white/80 mb-6">We nemen binnen 24 uur contact met je op. Check je inbox!</p>
            <button onClick={() => setSubmitted(false)} className="text-white underline">Nog een bericht sturen</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-r from-violet-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <span className="text-white">Gratis Strategie Gesprek</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Klaar om te groeien?</h2>
            <p className="text-xl text-white/80 mb-8">
              Plan een gratis consult gesprek. We analyseren je situatie en geven concrete next steps - gegarandeerd.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white">
                <Phone className="w-6 h-6" />
                <span>+31 6 12345678</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Mail className="w-6 h-6" />
                <span>hello@localboost.nl</span>
              </div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Vraag gratis consult aan</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input {...register('name')} placeholder="Je naam *" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('phone')} placeholder="Telefoonnummer *" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <input {...register('email')} placeholder="E-mailadres *" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              <input {...register('company')} placeholder="Bedrijfsnaam (optioneel)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
              <select {...register('service')} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                <option value="">Kies een pakket *</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.title} - €{s.price}</option>)}
              </select>
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
              <textarea {...register('message')} placeholder="Vertel over je uitdagingen *" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none" />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <span className="animate-pulse">Versturen...</span> : <>Verstuur Bericht <Send className="w-5 h-5" /></>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚀</span>
              <span className="text-2xl font-bold text-white">LocalBoost</span>
            </div>
            <p className="text-white/60">Jouw partner voor lokale online groei. #1 in Google - gegarandeerd.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Pakketten</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#pakketten" className="hover:text-white">Google Dominantie</a></li>
              <li><a href="#pakketten" className="hover:text-white">Lead Machine</a></li>
              <li><a href="#pakketten" className="hover:text-white">Winstgevende Ads</a></li>
              <li><a href="#pakketten" className="hover:text-white">Complete Groei</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#resultaten" className="hover:text-white">Resultaten</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +31 6 12345678</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@localboost.nl</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40">
          <p>© 2026 LocalBoost. Alle rechten voorbehouden. KvK: 12345678</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <GuaranteeBanner />
      <TrustStrip />
      <Services />
      <Results />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
