'use client'

import { useState } from 'react'
import { 
  CheckCircle, Clock, AlertCircle, Package, MapPin, TrendingUp,
  FileText, Star, MessageSquare, Camera, ChevronRight, Eye
} from 'lucide-react'

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

const taskCategories = [
  { id: 'setup', label: 'Setup', icon: Package, color: 'violet' },
  { id: 'optimize', label: 'Optimalisatie', icon: TrendingUp, color: 'blue' },
  { id: 'content', label: 'Content', icon: FileText, color: 'green' },
  { id: 'reviews', label: 'Reviews', icon: Star, color: 'yellow' },
  { id: 'ads', label: 'Ads', icon: MessageSquare, color: 'purple' },
]

export default function ClientPortal() {
  const [email, setEmail] = useState('')
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeService, setActiveService] = useState<string>('google-dominance')

  const handleLookup = async () => {
    if (!email) {
      setError('Voer je e-mailadres in')
      return
    }
    
    setLoading(true)
    setError('')
    
    // Simulate API call - in production this would check a database
    setTimeout(() => {
      // Mock client data
      if (email.includes('@')) {
        setClientData({
          name: 'Demo Klant',
          email: email,
          service: 'google-dominance',
          startDate: '2026-04-15',
          milestones: milestones['google-dominance'],
          tasks: []
        })
      } else {
        setError('Ongeldig e-mailadres')
      }
      setLoading(false)
    }, 1000)
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
            <h1 className="text-2xl font-bold">LocalBoost Client Portal</h1>
            <p className="text-slate-400 text-sm">Volg je voortgang in real-time</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">Hulp nodig?</div>
            <div className="text-blue-400">info@localboost.nl</div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        {!clientData ? (
          /* Login Section */
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <div className="text-center mb-8">
              <Eye className="w-12 h-12 text-violet-400 mx-auto mb-4" />
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
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleLookup}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Zoeken...' : 'Bekijk'}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-3">{error}</p>
              )}
            </div>
            
            <div className="mt-8 text-center text-sm text-slate-500">
              <p>Test e-mail: any@valid.email</p>
            </div>
          </div>
        ) : (
          /* Client Dashboard */
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-600/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Welkom terug, {clientData.name}!</h2>
                  <p className="text-slate-400">Je {services.find(s => s.id === clientData.service)?.label} service is actief</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">{getProgress()}%</div>
                  <div className="text-sm text-slate-400">Voltooid</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">Service Voortgang</h3>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-slate-400">
                <span>Gestart: {new Date(clientData.startDate).toLocaleDateString('nl-NL')}</span>
                <span>{getDaysRemaining()} dagen resterend</span>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Mijlpalen
              </h3>
              <div className="space-y-4">
                {currentMilestones.map((milestone: Milestone, index: number) => (
                  <div key={milestone.id} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-green-600' 
                        : index === currentMilestones.filter((m: Milestone) => !m.completed).length 
                          ? 'bg-violet-600 animate-pulse' 
                          : 'bg-slate-600'
                    }`}>
                      {milestone.completed ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${milestone.completed ? 'text-slate-400 line-through' : ''}`}>
                          {milestone.title}
                        </h4>
                        {milestone.completed && milestone.completedAt && (
                          <span className="text-xs text-slate-500">
                            {new Date(milestone.completedAt).toLocaleDateString('nl-NL')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Selector (for demo) */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-4">Switch Service (Demo)</h3>
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
                        ? `bg-gradient-to-br ${service.color} border-transparent`
                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
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
              <h3 className="font-semibold mb-4">Snelle Acties</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>Stel een vraag</span>
                </button>
                <button className="flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left">
                  <FileText className="w-5 h-5 text-green-400" />
                  <span>Bekijk rapport</span>
                </button>
                <button className="flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <span>Upload foto's</span>
                </button>
                <button className="flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Geef feedback</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => setClientData(null)}
              className="w-full py-3 text-slate-400 hover:text-white transition"
            >
              Uitloggen
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-slate-500 border-t border-slate-800">
        LocalBoost - Lokale Groei, Meetbaar Resultaat
      </footer>
    </div>
  )
}