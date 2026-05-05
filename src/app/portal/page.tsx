'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, Clock, AlertCircle, Package, MapPin, TrendingUp,
  FileText, Star, MessageSquare, Camera, ChevronRight, Eye, Loader2,
  LogOut
} from 'lucide-react'
import { showToast } from '@/lib/toast'

interface Service {
  id: string
  label: string
  icon: any
  color: string
}

interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: string
}

const services: Service[] = [
  { id: 'google-dominance', label: 'Google Dominantie', icon: MapPin, color: 'from-violet-600 to-purple-600' },
  { id: 'lead-machine', label: 'Lead Machine', icon: TrendingUp, color: 'from-blue-600 to-cyan-600' },
  { id: 'ads-profit', label: 'Winstgevende Ads', icon: Package, color: 'from-green-600 to-emerald-600' },
]

const milestones: Record<string, Milestone[]> = {
  'google-dominance': [
    { id: 'g1', title: 'Account setup', description: 'Google Business account aangemaakt en geverifieerd', completed: false },
    { id: 'g2', title: 'Profiel optimalisatie', description: 'Alle informatie ingevuld en geoptimaliseerd', completed: false },
    { id: 'g3', title: 'Foto\'s uploaden', description: '10+ foto\'s van je bedrijf geüpload', completed: false },
    { id: 'g4', title: 'Eerste post', description: 'Welkomst-post geplaatst op je profiel', completed: false },
    { id: 'g5', title: 'Review-campagne', description: 'Systeem voor review-requests geactiveerd', completed: false },
    { id: 'g6', title: 'Lokale SEO', description: 'Lokale SEO optimalisatie voltooid', completed: false },
  ],
  'lead-machine': [
    { id: 'l1', title: 'Landingspagina', description: 'High-converting landingspagina gebouwd', completed: false },
    { id: 'l2', title: 'CRM instellen', description: 'CRM systeem geconfigureerd met automations', completed: false },
    { id: 'l3', title: 'E-mail flows', description: '5 e-mail automatiseringen geactiveerd', completed: false },
    { id: 'l4', title: 'SMS notificaties', description: 'SMS notificaties bij nieuwe leads geactiveerd', completed: false },
    { id: 'l5', title: 'Analytics', description: 'Analytics dashboard live en werkend', completed: false },
  ],
  'ads-profit': [
    { id: 'a1', title: 'Account setup', description: 'Google Ads account ingesteld en geconfigureerd', completed: false },
    { id: 'a2', title: 'Zoekwoorden onderzoek', description: 'Doelzoekwoorden geïdentificeerd en ingesteld', completed: false },
    { id: 'a3', title: 'Landing page check', description: 'Landing page geanalyseerd en suggesties gedaan', completed: false },
    { id: 'a4', title: 'Conversie-tracking', description: 'Conversie-tracking geïnstalleerd', completed: false },
    { id: 'a5', title: 'Eerste campagnes', description: 'Campagnes live en geoptimaliseerd', completed: false },
  ],
}

const quickActions = [
  { icon: MessageSquare, label: 'Stel een vraag', color: 'text-blue-400', bg: 'bg-blue-600/20 hover:bg-blue-600/30' },
  { icon: FileText, label: 'Bekijk rapport', color: 'text-green-400', bg: 'bg-green-600/20 hover:bg-green-600/30' },
  { icon: Camera, label: 'Upload foto\'s', color: 'text-purple-400', bg: 'bg-purple-600/20 hover:bg-purple-600/30' },
  { icon: Star, label: 'Geef feedback', color: 'text-yellow-400', bg: 'bg-yellow-600/20 hover:bg-yellow-600/30' },
]

export default function ClientPortal() {
  const [email, setEmail] = useState('')
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeService, setActiveService] = useState<string>('google-dominance')
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!email) {
      setError('Voer je e-mailadres in')
      showToast('Vul eerst je e-mailadres in', 'error')
      return
    }
    
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      if (email.includes('@') && email.includes('.')) {
        setClientData({
          name: 'Demo Klant',
          email: email,
          service: 'google-dominance',
          startDate: '2026-04-15',
          milestones: milestones['google-dominance'],
          tasks: []
        })
        showToast('Welkom terug!', 'success')
      } else {
        setError('Ongeldig e-mailadres')
        showToast('Ongeldig e-mailadres', 'error')
      }
      setLoading(false)
    }, 1200)
  }

  const handleLogout = () => {
    setClientData(null)
    setEmail('')
    showToast('Je bent uitgelogd', 'info')
  }

  const toggleMilestone = (id: string) => {
    setActiveMilestone(activeMilestone === id ? null : id)
  }

  const getProgress = () => {
    if (!clientData) return 0
    const total = clientData.milestones.length
    const completed = clientData.milestones.filter((m: Milestone) => m.completed).length
    return Math.round((completed / total) * 100)
  }

  const getDaysRemaining = () => {
    if (!clientData) return 0
    const start = new Date(clientData.startDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return 30 - daysPassed
  }

  const currentMilestones = clientData?.milestones || []

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-6 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Client Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">Volg je voortgang in real-time</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Hulp nodig?</div>
            <div className="text-blue-400">info@localboost.nl</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {!clientData ? (
          /* Login Section */
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Welkom bij je Klantportaal</h2>
              <p className="text-slate-400 mt-2">
                Voer je e-mailadres in om je voortgang te bekijken
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="je@email.nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                />
                <button
                  onClick={handleLookup}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Zoeken
                    </>
                  ) : (
                    'Bekijk'
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>
            
            <div className="mt-8 text-center text-sm text-slate-500 bg-slate-900/50 rounded-xl p-4">
              <p className="font-medium">Test e-mail: any@valid.email</p>
            </div>
          </div>
        ) : (
          /* Client Dashboard */
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-600/30 shadow-lg shadow-violet-500/10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    👋 Welkom terug, {clientData.name}!
                  </h2>
                  <p className="text-slate-400 flex items-center gap-2 mt-1">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Je {services.find(s => s.id === clientData.service)?.label} service is actief
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-green-400">{getProgress()}%</div>
                  <div className="text-sm text-slate-400">Voltooid</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Service Voortgang
              </h3>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-slate-400">Gestart: {new Date(clientData.startDate).toLocaleDateString('nl-NL')}</span>
                <span className="text-violet-400 font-medium">{getDaysRemaining()} dagen resterend</span>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Mijlpalen
              </h3>
              <div className="space-y-3">
                {currentMilestones.map((milestone: Milestone, index: number) => {
                  const isNext = index === currentMilestones.filter((m: Milestone) => !m.completed).length - 1
                  return (
                    <div
                      key={milestone.id}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                        activeMilestone === milestone.id ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'
                      }`}
                      onClick={() => toggleMilestone(milestone.id)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        milestone.completed 
                          ? 'bg-green-600 shadow-lg shadow-green-500/30' 
                          : isNext
                            ? 'bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30'
                            : 'bg-slate-600'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-medium ${milestone.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {milestone.title}
                          </h4>
                          {milestone.completed && milestone.completedAt && (
                            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded">
                              {new Date(milestone.completedAt).toLocaleDateString('nl-NL')}
                            </span>
                          )}
                          {isNext && !milestone.completed && (
                            <span className="text-xs text-violet-400 bg-violet-600/20 px-2 py-0.5 rounded">
                              Volgende
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{milestone.description}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${activeMilestone === milestone.id ? 'rotate-90' : ''}`} />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Service Selector */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-400" />
                Switch Service (Demo)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setActiveService(service.id)
                      setClientData({
                        ...clientData,
                        service: service.id,
                        milestones: milestones[service.id]
                      })
                    }}
                    className={`p-4 rounded-xl border transition ${
                      clientData.service === service.id
                        ? `bg-gradient-to-br ${service.color} border-transparent shadow-lg`
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <service.icon className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{service.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Snelle Acties
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => showToast(`${action.label} - binnenkort beschikbaar`, 'info')}
                    className={`flex items-center gap-3 p-4 rounded-xl ${action.bg} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-slate-500 border-t border-slate-800">
        <div className="flex items-center justify-center gap-2">
          <span>🚀</span>
          <span>LocalBoost - Lokale Groei, Meetbaar Resultaat</span>
        </div>
      </footer>
    </div>
  )
}