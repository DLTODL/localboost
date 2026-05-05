'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, Play, Pause, SkipForward, Eye, Clock, CheckCircle, 
  XCircle, AlertCircle, ChevronRight, Send, Archive
} from 'lucide-react'

interface EmailSequence {
  id: number
  leadId: number
  name: string
  service: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  currentStep: number
  steps: EmailStep[]
  createdAt: string
  lastSentAt?: string
}

interface EmailStep {
  stepNumber: number
  subject: string
  template: string
  delayDays: number
  sentAt?: string
  status: 'pending' | 'sent' | 'skipped' | 'failed'
}

interface Lead {
  id: number
  name: string
  email: string
  company: string
  service: string
}

export default function EmailSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [seqRes, leadsRes] = await Promise.all([
        fetch('/api/email-sequences'),
        fetch('/api/leads')
      ])
      const seqData = await seqRes.json()
      const leadsData = await leadsRes.json()
      setSequences(seqData.sequences || [])
      setLeads(leadsData.leads || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSequence = async (leadId: number, service: string) => {
    try {
      const res = await fetch('/api/email-sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, service })
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Error creating sequence:', error)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/email-sequences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating sequence:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white'
      case 'paused': return 'bg-yellow-600 text-white'
      case 'completed': return 'bg-blue-600 text-white'
      case 'cancelled': return 'bg-red-600 text-white'
      default: return 'bg-slate-600 text-white'
    }
  }

  const getStepStatusIcon = (step: EmailStep) => {
    switch (step.status) {
      case 'sent': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'skipped': return <SkipForward className="w-5 h-5 text-yellow-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-slate-500" />
    }
  }

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      'google-dominance': 'Google Dominantie',
      'lead-machine': 'Lead Machine',
      'ads-profit': 'Winstgevende Ads',
      'full-growth': 'Full Growth'
    }
    return labels[service] || service
  }

  const filteredSequences = filter === 'all' 
    ? sequences 
    : sequences.filter(s => s.status === filter)

  const stats = {
    total: sequences.length,
    active: sequences.filter(s => s.status === 'active').length,
    completed: sequences.filter(s => s.status === 'completed').length,
    totalEmailsSent: sequences.reduce((acc, s) => acc + s.steps.filter(st => st.status === 'sent').length, 0)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Mail className="w-8 h-8 text-violet-400" />
              Email Sequences
            </h1>
            <p className="text-slate-400 mt-1">Automated email nurture sequences for leads</p>
          </div>
          <div className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleString('nl-NL')}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sequences', value: stats.total, icon: '📧' },
            { label: 'Active', value: stats.active, icon: '🟢' },
            { label: 'Completed', value: stats.completed, icon: '✅' },
            { label: 'Emails Sent', value: stats.totalEmailsSent, icon: '📬' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Create Sequence Section */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Start New Sequence</h2>
          <div className="flex gap-4">
            <select 
              id="lead-select"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl"
              defaultValue=""
            >
              <option value="" disabled>Select a lead</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name} ({lead.company || 'No company'})</option>
              ))}
            </select>
            <select 
              id="service-select"
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl"
              defaultValue="google-dominance"
            >
              <option value="google-dominance">Google Dominantie</option>
              <option value="lead-machine">Lead Machine</option>
              <option value="ads-profit">Winstgevende Ads</option>
              <option value="full-growth">Full Growth</option>
            </select>
            <button
              onClick={() => {
                const leadId = (document.getElementById('lead-select') as HTMLSelectElement).value
                const service = (document.getElementById('service-select') as HTMLSelectElement).value
                if (leadId) createSequence(parseInt(leadId), service)
              }}
              className="px-6 py-3 bg-violet-600 rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              Create Sequence
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'paused', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Sequences List */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : filteredSequences.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No email sequences found. Create one above!
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filteredSequences.map((sequence) => (
                <div key={sequence.id} className="p-6 hover:bg-slate-750 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{sequence.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sequence.status)}`}>
                          {sequence.status}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                          {getServiceLabel(sequence.service)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Lead ID: {sequence.leadId}</span>
                        <span>•</span>
                        <span>Step {sequence.currentStep} of {sequence.steps.length}</span>
                        <span>•</span>
                        <span>Created: {new Date(sequence.createdAt).toLocaleDateString('nl-NL')}</span>
                        {sequence.lastSentAt && (
                          <>
                            <span>•</span>
                            <span>Last sent: {new Date(sequence.lastSentAt).toLocaleDateString('nl-NL')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sequence.status === 'active' && (
                        <button
                          onClick={() => updateStatus(sequence.id, 'paused')}
                          className="p-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30"
                          title="Pause"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      )}
                      {sequence.status === 'paused' && (
                        <button
                          onClick={() => updateStatus(sequence.id, 'active')}
                          className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                          title="Resume"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedSequence(sequence)}
                        className="p-2 bg-violet-600/20 text-violet-400 rounded-lg hover:bg-violet-600/30"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {sequence.steps.map((step, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded ${
                            step.status === 'sent' ? 'bg-green-500' :
                            step.status === 'failed' ? 'bg-red-500' :
                            i === sequence.currentStep ? 'bg-violet-500' :
                            'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                      {sequence.steps.map((step, i) => (
                        <span key={i}>D{step.delayDays}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedSequence && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedSequence.name}</h2>
                <button
                  onClick={() => setSelectedSequence(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedSequence.status)}`}>
                      {selectedSequence.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Service:</span>
                    <span className="ml-2">{getServiceLabel(selectedSequence.service)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Lead ID:</span>
                    <span className="ml-2">{selectedSequence.leadId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Created:</span>
                    <span className="ml-2">{new Date(selectedSequence.createdAt).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold mt-6 mb-3">Email Steps</h3>
                <div className="space-y-3">
                  {selectedSequence.steps.map((step, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        {getStepStatusIcon(step)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">Step {step.stepNumber}</span>
                            <span className="text-xs text-slate-500">Day {step.delayDays}</span>
                          </div>
                          <div className="text-sm font-semibold">{step.subject}</div>
                          <div className="text-xs text-slate-400 mt-2 line-clamp-2">{step.template}</div>
                          {step.sentAt && (
                            <div className="text-xs text-green-400 mt-2">
                              Sent: {new Date(step.sentAt).toLocaleString('nl-NL')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}