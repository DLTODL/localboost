'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, Download, Send, User, Building, Mail, Phone, 
  Calendar, CheckCircle, Clock, AlertCircle, Copy, Check
} from 'lucide-react'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  status: string
  notes?: string
  follow_up_date?: string
  created_at: string
  updated_at: string
}

interface ProposalConfig {
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  service: string
  duration: string
  startDate: string
  deliverables: string[]
  investment: number
  paymentTerms: string
  customTerms: string
  signatures: {
    company: string
    date: string
  }
}

const serviceDetails: Record<string, {
  title: string
  price: number
  features: string[]
  timeline: string
}> = {
  'google-dominance': {
    title: 'Google Dominantie Pakket',
    price: 297,
    features: [
      'Complete Google Business setup & claim',
      'Professionele foto\'s & video\'s',
      'SEO-optimalisatie voor Maps',
      'Review management systeem',
      'Maandelijkse concurrentie-analyse',
      'Priority support (binnen 2 uur)',
      'Gratis herstel van bestaande problemen'
    ],
    timeline: '30 dagen resultaat'
  },
  'lead-machine': {
    title: 'Lead Machine Systeem',
    price: 497,
    features: [
      'Custom high-converting landingspagina',
      'Smart contactformulier met CRM-koppeling',
      'E-mail automatisering (5 workflows)',
      'SMS notificaties bij nieuwe leads',
      'A/B testing setup & optimalisatie',
      'Analytics dashboard met real-time data',
      'Maandelijkse rapportage & advies'
    ],
    timeline: '14 dagen oplevering'
  },
  'ads-profit': {
    title: 'Winstgevende Ads',
    price: 397,
    features: [
      'Google Ads account setup & optimalisatie',
      'Zoekwoorden onderzoek & targeting',
      'Conversie-tracking installatie',
      'Landing page analyse & suggesties',
      'Maandelijkse performance rapportage',
      'Budget optimalisatie',
      '24/7 campaign monitoring'
    ],
    timeline: '7 dagen opzet, 30 dagen resultaten'
  },
  'full-growth': {
    title: 'Complete Groei Partnership',
    price: 997,
    features: [
      'Alles van Google Dominantie Pakket',
      'Alles van Lead Machine Systeem',
      'Alles van Winstgevende Ads',
      'Dedicated account manager',
      'Wekelijkse strategie calls',
      'Prioriteit ondersteuning',
      'Maandelijkse ROI reviews',
      'Onbeperkte aanpassingen'
    ],
    timeline: '90 dagen transformatie programma'
  }
}

export default function ProposalGenerator() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [proposal, setProposal] = useState<ProposalConfig>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    service: '',
    duration: '3 maanden',
    startDate: '',
    deliverables: [],
    investment: 0,
    paymentTerms: 'Maandelijks achteraf',
    customTerms: '',
    signatures: {
      company: 'LocalBoost',
      date: new Date().toISOString().split('T')[0]
    }
  })
  const [generated, setGenerated] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead)
    const details = serviceDetails[lead.service] || serviceDetails['google-dominance']
    setProposal({
      ...proposal,
      clientName: lead.name,
      clientEmail: lead.email,
      clientPhone: lead.phone,
      clientCompany: lead.company || '',
      service: lead.service,
      investment: details.price,
      deliverables: details.features,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }

  const handleGenerate = () => {
    setGenerated(true)
  }

  const copyProposal = () => {
    const text = generateProposalText()
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const downloadProposal = () => {
    const text = generateProposalText()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LocalBoost_Voorstel_${proposal.clientName.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateProposalText = () => {
    const serviceInfo = serviceDetails[proposal.service] || serviceDetails['google-dominance']
    return `
═══════════════════════════════════════════════════════════════
                    LOCALBOOST VOORSTEL
═══════════════════════════════════════════════════════════════

Datum: ${new Date().toLocaleDateString('nl-NL')}
Offerte ID: LB-${Date.now().toString().slice(-8)}

───────────────────────────────────────────────────────────────
                         PARTIJEN
───────────────────────────────────────────────────────────────

AANBIEDER:
LocalBoost
E: info@localboost.nl
T: +31 (0)20 123 4567

Klant:
${proposal.clientName}
${proposal.clientCompany ? `Bedrijf: ${proposal.clientCompany}` : ''}
E: ${proposal.clientEmail}
T: ${proposal.clientPhone}

───────────────────────────────────────────────────────────────
                      DIENSTEN OVERZICHT
───────────────────────────────────────────────────────────────

Pakket: ${serviceInfo.title}
Looptijd: ${proposal.duration}
Startdatum: ${proposal.startDate}

Aangeboden diensten:
${proposal.deliverables.map((d, i) => `  ${i + 1}. ${d}`).join('\n')}

Timeline: ${serviceInfo.timeline}

───────────────────────────────────────────────────────────────
                       INVESTERING
───────────────────────────────────────────────────────────────

Maandelijkse investering: €${proposal.investment},-
Betalingsperiode: ${proposal.paymentTerms}

Totaal contractwaarde (3 maanden): €${proposal.investment * 3},-

───────────────────────────────────────────────────────────────
                    EXTRA VOORWAARDEN
───────────────────────────────────────────────────────────────

${proposal.customTerms || 'Geen aanvullende voorwaarden van toepassing.'}

───────────────────────────────────────────────────────────────
                         GARANTIE
───────────────────────────────────────────────────────────────

Wij garanderen resultaten. Als wij niet leveren wat we beloven,
werken we gratis totdat we dat wel doen. Jouw succes is onze
prioriteit.

───────────────────────────────────────────────────────────────
                      HANDTEKENING
───────────────────────────────────────────────────────────────

Dit voorstel is geldig tot: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')}

Door akkoord te gaan met dit voorstel gaat u akkoord met de
algemene voorwaarden van LocalBoost.

Klant: _______________________ Datum: ${proposal.signatures.date}
LocalBoost: _______________________ Datum: _______________

───────────────────────────────────────────────────────────────
                    CONTACT INFORMATIE
───────────────────────────────────────────────────────────────

Heb je vragen? Neem gerust contact op.

📧 info@localboost.nl
📱 +31 (0)20 123 4567

Met vriendelijke groet,
Team LocalBoost

═══════════════════════════════════════════════════════════════
Dit voorstel is opgesteld door LocalBoost - Lokale Groei, Meetbaar Resultaat
═══════════════════════════════════════════════════════════════
`.trim()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-violet-400" />
            Proposal Generator
          </h1>
          <p className="text-slate-400 mt-2">
            Genereer professionele voorstellen voor je leads
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left: Configuration */}
          <div className="space-y-6">
            {/* Step 1: Select Lead */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-violet-400" />
                Stap 1: Selecteer Lead
              </h2>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white"
                onChange={(e) => {
                  const lead = leads.find(l => l.id === parseInt(e.target.value))
                  if (lead) handleLeadSelect(lead)
                }}
                defaultValue=""
              >
                <option value="">Kies een lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} - {lead.company || 'Geen bedrijf'} ({lead.status})
                  </option>
                ))}
              </select>
              
              {selectedLead && (
                <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-slate-400">Naam:</span> {selectedLead.name}</div>
                    <div><span className="text-slate-400">Email:</span> {selectedLead.email}</div>
                    <div><span className="text-slate-400">Tel:</span> {selectedLead.phone}</div>
                    <div><span className="text-slate-400">Bedrijf:</span> {selectedLead.company || '-'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Configure Proposal */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Stap 2: Configureer Voorstel
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Looptijd</label>
                    <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2"
                      value={proposal.duration}
                      onChange={(e) => setProposal({...proposal, duration: e.target.value})}
                    >
                      <option value="1 maand">1 maand</option>
                      <option value="3 maanden">3 maanden</option>
                      <option value="6 maanden">6 maanden</option>
                      <option value="12 maanden">12 maanden</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Startdatum</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2"
                      value={proposal.startDate}
                      onChange={(e) => setProposal({...proposal, startDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Betalingstermijn</label>
                  <select 
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2"
                    value={proposal.paymentTerms}
                    onChange={(e) => setProposal({...proposal, paymentTerms: e.target.value})}
                  >
                    <option value="Maandelijks achteraf">Maandelijks achteraf</option>
                    <option value="Kwartaal vooruit">Kwartaal vooruit (2% korting)</option>
                    <option value="Jaarlijks vooruit">Jaarlijks vooruit (5% korting)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Aanvullende voorwaarden</label>
                  <textarea 
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 h-20"
                    placeholder="Eventuele aanvullende voorwaarden..."
                    value={proposal.customTerms}
                    onChange={(e) => setProposal({...proposal, customTerms: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Investment */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-green-400" />
                Stap 3: Investering
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-green-400">€{proposal.investment}</div>
                <div className="text-slate-400">per maand</div>
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Totaal contract: €{proposal.investment * (proposal.duration === '1 maand' ? 1 : proposal.duration === '3 maanden' ? 3 : proposal.duration === '6 maanden' ? 6 : 12)}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedLead}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Genereer Voorstel
            </button>
          </div>

          {/* Right: Preview */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
              <span className="font-medium">Voorstel Preview</span>
              <div className="flex gap-2">
                <button 
                  onClick={copyProposal}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                  title="Kopieer tekst"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button 
                  onClick={downloadProposal}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                  title="Download als tekst"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 h-[600px] overflow-y-auto">
              {generated ? (
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                  {generateProposalText()}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Selecteer een lead en klik op "Genereer Voorstel"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold">{leads.filter(l => l.status === 'new').length}</div>
            <div className="text-sm text-slate-400">Nieuwe Leads</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold">{leads.filter(l => l.status === 'contacted').length}</div>
            <div className="text-sm text-slate-400">Gecontacteerd</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold">{leads.filter(l => l.status === 'won').length}</div>
            <div className="text-sm text-slate-400">Gewonnen</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold">
              €{leads.filter(l => l.status === 'won').length * 497}
            </div>
            <div className="text-sm text-slate-400">Potentiële Omzet</div>
          </div>
        </div>
      </div>
    </div>
  )
}