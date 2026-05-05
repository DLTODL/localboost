'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Search, MapPin, Star, TrendingUp, Users, Clock, CheckCircle, 
  ArrowRight, Menu, X, Phone, Mail, Instagram, Facebook,
  ChevronDown, Play, Pause, Send, Zap, Target, Award, Building,
  Calendar, BarChart3, MessageSquare, Globe, Shield, Heart, Eye
} from 'lucide-react'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  company: z.string().optional(),
  service: z.string().min(1, 'Select a service'),
  message: z.string().min(10, 'Tell us more')
})

type FormData = z.infer<typeof contactSchema>

// Services data
const services = [
  {
    id: 'google-business',
    icon: MapPin,
    title: 'Google Business Profile',
    price: 49,
    original: 99,
    description: 'Complete Google Business optimization - get found on maps instantly',
    features: [
      'Complete profile setup',
      'Photo & video library',
      'Service area configuration',
      'Posts & updates',
      'Review management',
      'Q&A optimization'
    ],
    timeline: '24 hours',
    popular: false
  },
  {
    id: 'seo-audit',
    icon: Search,
    title: 'SEO Audit & Strategy',
    price: 79,
    original: 149,
    description: 'Comprehensive analysis with actionable roadmap',
    features: [
      'Technical SEO audit',
      'Keyword research',
      'Competitor analysis',
      'Content gaps',
      'Backlink analysis',
      'Custom action plan'
    ],
    timeline: '48 hours',
    popular: true
  },
  {
    id: 'lead-capture',
    icon: Target,
    title: 'Lead Capture System',
    price: 149,
    original: 299,
    description: 'Turn your website into a lead-generating machine',
    features: [
      'Custom contact forms',
      'Email notifications',
      'CRM integration',
      'Lead scoring',
      'Analytics dashboard',
      'A/B testing'
    ],
    timeline: '3 days',
    popular: false
  },
  {
    id: 'local-ads',
    icon: TrendingUp,
    title: 'Google Ads Management',
    price: 199,
    original: 399,
    description: 'Profitable campaigns that actually convert',
    features: [
      'Campaign setup',
      'Keyword targeting',
      'Ad copywriting',
      'Bid management',
      'Monthly optimization',
      'Detailed reporting'
    ],
    timeline: 'Ongoing',
    popular: false
  },
  {
    id: 'social-media',
    icon: Instagram,
    title: 'Social Media Growth',
    price: 149,
    original: 299,
    description: 'Build your brand presence online',
    features: [
      'Content strategy',
      'Post design',
      'Hashtag research',
      'Engagement automation',
      'Growth analytics',
      'Monthly strategy calls'
    ],
    timeline: 'Weekly',
    popular: false
  },
  {
    id: 'full-presence',
    icon: Globe,
    title: 'Complete Online Presence',
    price: 299,
    original: 599,
    description: 'Everything you need to dominate locally',
    features: [
      'All services included',
      'Priority support',
      'Dedicated manager',
      'Monthly strategy',
      'Unlimited revisions',
      'White-label reports'
    ],
    timeline: 'Ongoing',
    popular: false
  }
]

// Testimonials
const testimonials = [
  {
    name: 'Jan de Vries',
    role: 'Eigenaar',
    company: 'De Vries Loodgieters',
    image: '👨‍🔧',
    rating: 5,
    text: 'Onze booking is 3x gestegen sinds LocalBoost ons heeft geholpen. Fantastisch!',
    increase: '+215%'
  },
  {
    name: 'Maria Jansen',
    role: ' eigenaresse',
    company: ' Beauty Salon Maria',
    image: '👩‍🎨',
    rating: 5,
    text: 'Eindelijk een bureau dat snapt wat lokale bedrijven nodig hebben. Aanraden!',
    increase: '+180%'
  },
  {
    name: 'Pieter Smit',
    role: 'Eigenaar',
    company: 'Smit Autos',
    image: '👨‍🔧',
    rating: 5,
    text: 'Mijn Google Ads nu winstgevend. Top service en support.',
    increase: '+340%'
  }
]

// Case studies
const caseStudies = [
  {
    company: 'Bakkerij Jansen',
    industry: 'Bakker',
    result: '+450%',
    timeline: '6 maanden',
    image: '🥖'
  },
  {
    company: 'Tuincentrum nl',
    industry: 'Tuinieren',
    result: '+280%',
    timeline: '4 maanden',
    image: '🌱'
  },
  {
    company: 'Fitness Club Utrecht',
    industry: 'Fitness',
    result: '+320%',
    timeline: '5 maanden',
    image: '💪'
  }
]

// Stats
const stats = [
  { value: '500+', label: 'Lokale Bedrijven', icon: Building },
  { value: '2.5M+', label: 'Weergaves', icon: Eye },
  { value: '98%', label: 'Klanttevredenheid', icon: Heart },
  { value: '€10M+', label: 'Revenue Gegenereerd', icon: TrendingUp }
]

// Process steps
const process = [
  { num: '01', title: 'Discovery Call', desc: 'We luisteren naar je wensen en analyseren je situatie' },
  { num: '02', title: 'Strategy Plan', desc: 'Op maat gemaakt plan met heldere stappen en verwachte resultaten' },
  { num: '03', title: 'Implementation', desc: 'We bouwen en optimaliseren met focus op meetbare resultaten' },
  { num: '04', title: 'Growth', desc: 'Je ontvangt maandelijkse rapportages en continue optimalisatie' }
]

// Hero Section
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5kZG9ub24iPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDMwaDZ2NTBIMzZ6bTUuNTUgNTBIMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <span className="text-2xl font-bold text-white">LocalBoost</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <a href="#diensten" className="text-white/80 hover:text-white transition">Diensten</a>
          <a href="#resultaten" className="text-white/80 hover:text-white transition">Resultaten</a>
          <a href="#over-ons" className="text-white/80 hover:text-white transition">Over Ons</a>
          <a href="#contact" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Gratis Consult
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Nu 40% korting - Beperkt aanbod</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Stop met verliezen.<br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Begin met winnen.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl text-white/70 max-w-xl">
              Wij helpen lokale bedrijven om online gevonden te worden en meer klanten aan te trekken. 
              Bewezen strategieën, meetbare resultaten.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a href="#contact" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center gap-2">
                Gratis Audit <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#diensten" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition">
                Bekijk Diensten
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {['👨‍💼', '👩‍💼', '👨‍🎨', '👩‍🔧'].map((emoji, i) => (
                  <span key={i} className="text-3xl">{emoji}</span>
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400">{'⭐'.repeat(5)}</div>
                <p className="text-white/60 text-sm">500+ lokale bedrijven</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 4).map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold animate-bounce">
              +247% Groei
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  )
}

// Stats Strip
function StatsStrip() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Services Section
function Services() {
  const [filter, setFilter] = useState('all')

  return (
    <section id="diensten" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-medium">Onze Diensten</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Complete Oplossingen
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-slate-600 max-w-2xl mx-auto">
            Alles wat je nodig hebt om online te groeien. Geen verborgen kosten, geen verrassingen.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border transition-all hover:scale-[1.02] ${
                service.popular 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20' 
                  : 'border-slate-200 shadow-xl'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full font-semibold text-sm">
                  Meest Gekozen
                </div>
              )}

              <service.icon className="w-10 h-10 text-purple-600 mb-4" />

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-slate-900">€{service.price}</span>
                <span className="text-slate-400 line-through">€{service.original}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.description}</p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Clock className="w-4 h-4" />
                {service.timeline}
              </div>

              <a href="#contact" className={`block w-full py-4 rounded-xl font-semibold text-center transition ${
                service.popular
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-slate-900 text-white'
              }`}>
                Nu Bestellen
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works
function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <span className="text-white/80">Hoe We Werken</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Jouw Groeiplan
          </h2>
          <p className="text-xl text-white/60">
            Simpel, effectief, meetbaar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="text-8xl font-bold text-white/10">{step.num}</div>
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </div>
              {i < process.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 text-white/20 w-8 h-8" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials
function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-medium">Social Proof</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Resultaten Die Tellen
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="flex text-yellow-400 mb-4">{'⭐'.repeat(5)}</div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-500 text-sm">{testimonial.role} @ {testimonial.company}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{testimonial.increase}</div>
                  <div className="text-slate-500 text-sm">groei</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case Studies */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Case Studies</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-4">{study.image}</div>
                <div className="font-bold text-slate-900">{study.company}</div>
                <div className="text-slate-500 text-sm">{study.industry}</div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-3xl font-bold text-green-600">{study.result}</div>
                  <div className="text-slate-500 text-sm">in {study.timeline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Contact Section
function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <section id="contact" className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Aangemeld!</h2>
            <p className="text-white/80 mb-6">
              We nemen binnen 24 uur contact met je op. Check je inbox!
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-white underline"
            >
              Nog een bericht sturen
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
              <span className="text-white">Gratis Consult</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Klaar om te groeien?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Plan een gratis consult gesprek. We analyseren je huidige situatie en 
              geven concrete next steps.
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Vraag je gratis consult aan
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('name')}
                    placeholder="Je naam *"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register('phone')}
                    placeholder="Telefoonnummer *"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <input
                {...register('email')}
                placeholder="E-mailadres *"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

              <input
                {...register('company')}
                placeholder="Bedrijfsnaam (optioneel)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />

              <select
                {...register('service')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Kies een dienst *</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.title} - €{s.price}</option>
                ))}
              </select>
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}

              <textarea
                {...register('message')}
                placeholder="Vertel ons over je uitdagingen *"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Versturen...</span>
                ) : (
                  <>
                    Verstuur Bericht <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Footer
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
            <p className="text-white/60">
              Jouw partner voor lokale online groei.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Diensten</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#diensten" className="hover:text-white">Google Business</a></li>
              <li><a href="#diensten" className="hover:text-white">SEO Audit</a></li>
              <li><a href="#diensten" className="hover:text-white">Lead Capture</a></li>
              <li><a href="#diensten" className="hover:text-white">Google Ads</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Bedrijf</h4>
            <ul className="space-y-2 text-white/60">
              <li><a href="#over-ons" className="hover:text-white">Over Ons</a></li>
              <li><a href="#resultaten" className="hover:text-white">Resultaten</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-white/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +31 6 12345678
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@localboost.nl
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40">
          <p>© 2026 LocalBoost. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page
export default function Home() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <Services />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}