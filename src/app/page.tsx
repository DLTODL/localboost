'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  MapPin, TrendingUp, Clock, CheckCircle, ArrowRight, Phone, Mail, Send, Zap, Target, Shield, 
  ChevronDown, ChevronUp, BadgeCheck, RefreshCw, Check, X, MessageCircle, Play, Eye, Users,
  Star, Building, Wrench, Car, Scissors, Store, Utensils, Heart, Award, DollarSign,
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, BookOpen, Calculator,
  FileText, BarChart3, Search, Settings
} from 'lucide-react'
import Link from 'next/link'

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
  phone: z.string().min(10, 'Telefoonnummer'),
  company: z.string().optional(),
  service: z.string().min(1, 'Kies een pakket')
})

type FormData = z.infer<typeof contactSchema>

// Tool categories with explanations
const toolCategories = [
  {
    category: 'Vindbaarheid',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    description: 'Zorg dat klanten je online kunnen vinden',
    tools: [
      { name: 'Google Business Guide', href: '/tools/google-business-guide', desc: 'Claim en optimaliseer je Google Maps profiel', why: '87% van klanten zoekt lokaal via Google. Zonder.complete profiel=onzichtbaar.' },
      { name: 'SEO Scanner', href: '/tools/seo-scanner', desc: 'Analyseer je website voor Google', why: 'Je website kan technisch perfect zijn maar nog steeds niet ranken. Vind problemen.' },
      { name: 'Lead Finder', href: '/tools/lead-finder', desc: 'Vind potentiële klanten in je regio', why: 'Weet wie je potentële klanten zijn. targeting is效果好 dan adverteren.' }
    ]
  },
  {
    category: 'Sociale Bewijsvoering',
    icon: Star,
    color: 'from-yellow-500 to-amber-500',
    description: 'Bouw vertrouwen met beoordelingen',
    tools: [
      { name: 'Review Generator', href: '/tools/review-generator', desc: 'Genereer automatisch review verzoeken', why: '93% leest reviews voor een aankoop. Positieve reviews = directe omzet.' },
      { name: 'Social Post Generator', href: '/tools/social-post-generator', desc: 'Creëer consistente social media content', why: 'Consistente aanwezigheid = bekendheid = vertrouwen = verkoop.' }
    ]
  },
  {
    category: 'Conversie',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    description: 'Zet bezoekers om in klanten',
    tools: [
      { name: 'Proposal Generator', href: '/tools/proposal-generator', desc: 'Genereer professionele offertes', why: 'Een professionele offerte = professioneel bedrijf = hogere SLUITPERCENTAGE.' },
      { name: 'Lead Conversion Calculator', href: '/tools/lead-conversion-calculator', desc: ' zie waar je leads verloren gaan', why: 'Ken je funnel. Verbeter zwakste schakel. Automatisch meer omzet.' },
      { name: 'Marketing Strategie', href: '/tools/marketing-strategy-builder', desc: 'Krijg een plan op maat', why: 'Zonder plan = willekeurig Marketing = weggegooid geld. Plan = meetbaar resultaat.' }
    ]
  },
  {
    category: 'Automatisering',
    icon: Settings,
    color: 'from-purple-500 to-violet-500',
    description: 'Laat systemen voor je werken',
    tools: [
      { name: 'Email Campaign Builder', href: '/tools/email-campaign-builder', desc: 'Bouw automatische email sequences', why: 'Automatisering = schaal. 1 email = 1000 contacts. Workflow = tijd besparen.' },
      { name: 'Email Sequences', href: '/tools/email-sequences', desc: 'Gebruik kant-en-klare templates', why: 'Herhaalbaarheid = schaal. Templates = consistentie = automatisering.' }
    ]
  }
]

// Packages with clear value
const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: 97,
    tagline: 'Perfect voor的第一步',
    description: 'Alles wat je nodig hebt om online start',
    color: 'from-slate-600 to-slate-700',
    features: [
      'Google Business optimalisatie',
      'SEO scan + rapport',
      '10 gratis lead credits',
      'Review request templates',
      'Social media templates'
    ],
    cta: 'Start Starter',
    popular: false
  },
  {
    id: 'groei',
    name: 'Groei',
    price: 197,
    tagline: 'Meest gekozen pakket',
    description: 'Groei je klantenbestand Meetbaar',
    color: 'from-violet-600 to-purple-600',
    features: [
      'Alles uit Starter',
      '50 lead credits',
      'Email campaign builder',
      'Priority support',
      'Maandelijkse KPI rapportage'
    ],
    cta: 'Start Groei',
    popular: true
  },
  {
    id: 'zakelijk',
    name: 'Zakelijk',
    price: 497,
    tagline: 'Complete oplossing voor ernstige ondernemers',
    description: 'Full-service marketing support without het dure bureau',
    color: 'from-amber-600 to-orange-600',
    features: [
      'Alles uit Groei',
      'Unlimited lead credits',
      'Dedicated account manager',
      'Wekelijkse strategie calls',
      'Custom automatisering',
      'White-label opties'
    ],
    cta: 'Start Zakelijk',
    popular: false
  }
]

// Testimonials with real numbers
const testimonials = [
  { name: 'Jan', company: 'Loodgieter Amsterdam', result: '+340%', quote: 'Van 1 offerte/week naar 4/dag. De tools doen het werk.', avatar: '👨‍🔧' },
  { name: 'Sophie', company: 'Schoonheidssalon', result: '+180%', quote: 'Mijn agenda is voller dan ik aankan. Ik werk nu only 4 dagen.', avatar: '💅' },
  { name: 'Mark', company: 'Autobedrijf', result: '+520%', quote: 'Google #1 voor auto importeren Amsterdam. Klanten bellen nu ons.', avatar: '🚗' }
]

const faqs = [
  { q: 'Hoe snel zie ik resultaten?', a: 'De meeste klanten zien binnen 14 dagen verbetering in vindbaarheid. Lead generatie hangt af van je markt.' },
  { q: 'Wat als het niet werkt?', a: 'We geven een 30-dagen niet-goed-geld-terug-garantie. Risico=0.' },
  { q: 'Kan ik tussentijds opzeggen?', a: 'Ja, maandelijks opzeggen. Geen verbintenis.' },
  { q: 'Werkt dit voor mijn type bedrijf?', a: 'We zijn gespecialiseerd in lokale B2C bedrijven. Vraag een gratis intake.' }
]

function Hero() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-32 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
          <span className="text-xl font-bold text-white">LocalBoost</span>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a href="#tools" className="text-white/70 hover:text-white transition text-sm">Tools</a>
          <a href="#werkwijze" className="text-white/70 hover:text-white transition text-sm">Hoe het werkt</a>
          <a href="#prijzen" className="text-white/70 hover:text-white transition text-sm">Prijzen</a>
          <a href="#contact" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition text-sm">
            Vraag info
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm">Al 500+ lokale bedrijven geholpen</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
            De meeste lokale ondernemers<br />
            <span className="text-violet-400">zijn onzichtbaar online.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            97% van klanten zoekt online voordat ze kopen. Als je niet vindbaar bent, 
            besta je niet voor ze. Wij zorgen dat je wordt gevonden.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mb-16">
            <a href="#prijzen" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition flex items-center gap-2">
              Bekijk pakketten <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#tools" className="border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition">
              Gratis proberen
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div>
              <div className="text-3xl font-black text-white">500+</div>
              <div className="text-white/50 text-sm">Bedrijven</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">€10M</div>
              <div className="text-white/50 text-sm">Omzet gegenereerd</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">97%</div>
              <div className="text-white/50 text-sm">Succesrate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="py-24 bg-white text-slate-900">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Het probleem is simpel</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Je concurrent staat op Google. Jij niet. Elke dag verlies je klanten 
              aan iemand die never heeft van je gehoord.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-red-900">Wat er Mis is</h3>
              <ul className="space-y-2 text-red-800">
                <li>• Je bent niet te vinden op Google</li>
                <li>• 0 beoordelingen of slechte reviews</li>
                <li>• Geen consistent online présence</li>
                <li>• Adverteren werkt niet voor je</li>
                <li>• Website levert niets op</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-green-900">De Oplossing</h3>
              <ul className="space-y-2 text-green-800">
                <li>• #1 op Google Maps in je regio</li>
                <li>• Stroom van positieve reviews</li>
                <li>• Geautomatiseerde lead flow</li>
                <li>• Meetingbare ROI</li>
                <li>• Volledig inzicht in resultaten</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ToolsShowcase() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  return (
    <section id="tools" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
              <span className="text-violet-700 font-semibold text-sm">GRATIS - Geen account nodig</span>
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
              Tools die Echt Wat Opleveren
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Geen fluff. Gebruik deze tools gratis - ze werken meteen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {toolCategories.map((category, catIndex) => (
              <motion.div key={category.category} variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Category Header */}
                <div className={`px-6 py-4 bg-gradient-to-r ${category.color} flex items-center gap-3`}>
                  <category.icon className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">{category.category}</span>
                  <span className="text-white/70 text-sm ml-auto">{category.tools.length} tools</span>
                </div>
                
                {/* Tools in category */}
                <div className="p-4 space-y-3">
                  {category.tools.map((tool, i) => (
                    <Link 
                      key={tool.name}
                      href={tool.href}
                      className="block p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 group-hover:text-violet-700 transition">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1">{tool.desc}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500" />
                      </div>
                      {/* WHY explanation */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs text-violet-700 font-medium">
                          <span className="text-violet-400">WAAROM:</span> {tool.why}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SocialProof() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
              Echte Resultaten
            </h2>
            <p className="text-slate-600">
              Geen fictieve cases. Dit is wat bestaande klanten ervaren.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-slate-50 rounded-2xl p-6">
                <div className="text-4xl mb-4">{t.avatar}</div>
                <div className="text-3xl font-black text-violet-600 mb-2">{t.result}</div>
                <p className="text-slate-700 text-sm mb-4">"{t.quote}"</p>
                <div className="font-medium text-slate-900">{t.name}</div>
                <div className="text-sm text-slate-500">{t.company}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="prijzen" className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">
              Kies het Pakket dat bij je Past
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Geen verborgen kosten. Geen verrassingen. Start waar je wil,
              upgrade wanneer je groeit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} 
                className={`relative bg-white rounded-2xl border-2 ${p.popular ? 'border-violet-500 shadow-xl shadow-violet-500/20' : 'border-slate-200'}`}
              >
                {p.popular && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r ${p.color} rounded-full text-xs font-bold text-white`}>
                    POPULAIR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{p.tagline}</p>
                  
                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-black text-slate-900">€{p.price}</span>
                    <span className="text-slate-400">/maand</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-6">{p.description}</p>

                  <div className="space-y-3 mb-6">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <a href="#contact" className={`block w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r ${p.color} text-white`}>
                    {p.cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              🔒 30-dagen garantie • Maandelijks opzeggen • Geen verbintenis
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = (_data: FormData) => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Aangemaakt!</h3>
          <p className="text-white/70">We nemen binnen 24 uur contact met je op.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white">
      <div className="max-w-xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Start Met Groeien</h2>
            <p className="text-white/60">Vertel ons wat je nodig hebt. Binnen 24 uur contact.</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input 
                {...register('name')}
                placeholder="Je naam *"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input 
                {...register('email')}
                placeholder="E-mailadres *"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input 
                {...register('phone')}
                placeholder="Telefoonnummer *"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <select 
                {...register('service')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-violet-500"
              >
                <option value="" className="text-slate-900">Kies een pakket *</option>
                {packages.map(p => (
                  <option key={p.id} value={p.id} className="text-slate-900">{p.name} - €{p.price}/maand</option>
                ))}
              </select>
              {errors.service && <p className="text-red-400 text-xs mt-1">{errors.service.message}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-bold hover:opacity-90 transition mt-4">
              Verstuur aanvraag
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Veelgestelde vragen</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                <span className="font-medium text-slate-900">{faq.q}</span>
                {open === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-4">
                    <p className="text-slate-600">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 bg-slate-950 text-white/60 text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🚀</span>
            <span className="font-bold text-white">LocalBoost</span>
          </div>
          <p>© 2026 LocalBoost. Alle rechten voorbehouden.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Voorwaarden</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />
      <Problem />
      <ToolsShowcase />
      <SocialProof />
      <Pricing />
      <Contact />
      <FAQ />
      <Footer />
    </main>
  )
}