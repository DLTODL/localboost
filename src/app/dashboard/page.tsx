'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, ArrowRight } from 'lucide-react'
import { ListSkeleton } from '@/components/polish/Skeleton'
import { EmptyState } from '@/components/polish/EmptyState'
import { showToast } from '@/lib/useSharedData'

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
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      showToast('Kon leads niet laden', 'error')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
    } catch (error) {
      showToast('Kon status niet updaten', 'error')
    }
  }

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.status === filter)

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    won: leads.filter(l => l.status === 'won').length,
    lost: leads.filter(l => l.status === 'lost').length
  }

  const serviceLabels: Record<string, string> = {
    'google-dominance': 'Google Dominantie',
    'lead-machine': 'Lead Machine',
    'ads-profit': 'Winstgevende Ads',
    'full-growth': 'Full Growth'
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-600 text-white',
    contacted: 'bg-yellow-600 text-white',
    won: 'bg-green-600 text-white',
    lost: 'bg-red-600 text-white'
  }

  const statusLabels: Record<string, string> = {
    new: 'Nieuw',
    contacted: 'Gecontacteerd',
    won: 'Gewonnen',
    lost: 'Verloren'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">📊 Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Beheer je leads en track resultaten</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/settings" className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Instellingen
              </Link>
              <div className="text-sm text-slate-500">
                Laatst bijgewerkt: {new Date().toLocaleString('nl-NL')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Totaal', value: stats.total, bg: 'from-slate-700 to-slate-800' },
            { label: 'Nieuw', value: stats.new, bg: 'from-blue-600/20 to-blue-700/10' },
            { label: 'Gecontacteerd', value: stats.contacted, bg: 'from-yellow-600/20 to-yellow-700/10' },
            { label: 'Gewonnen', value: stats.won, bg: 'from-green-600/20 to-green-700/10' },
            { label: 'Verloren', value: stats.lost, bg: 'from-red-600/20 to-red-700/10' }
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.bg} rounded-xl p-4 border border-slate-700/50`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tools Quick Access */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Link href="/tools/seo-scanner" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition group">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold text-sm">SEO Scanner</div>
            <div className="text-xs text-slate-400">Analyseer websites</div>
          </Link>
          <Link href="/tools/proposal-generator" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition group">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold text-sm">Voorstel Generator</div>
            <div className="text-xs text-slate-400">Genereer voorstellen</div>
          </Link>
          <Link href="/tools/task-manager" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition group">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-semibold text-sm">Taak Manager</div>
            <div className="text-xs text-slate-400">Beheer taken</div>
          </Link>
          <Link href="/tools/email-sequences" className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition group">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-semibold text-sm">Email Sequences</div>
            <div className="text-xs text-slate-400">Automatische emails</div>
          </Link>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {['all', 'new', 'contacted', 'won', 'lost'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                filter === status 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {status === 'all' ? 'Alle' : statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="p-6">
              <ListSkeleton items={5} />
            </div>
          ) : filteredLeads.length === 0 ? (
            <EmptyState
              icon="search"
              title="Geen leads in deze categorie"
              description={
                filter === 'all'
                  ? 'Leads van de website komen hier terecht. Nog geen leads ontvangen.'
                  : 'Probeer een andere filter of wacht tot er nieuwe leads binnenkomen.'
              }
              action={
                <Link
                  href="/tools/lead-finder"
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 rounded-xl font-medium transition inline-flex items-center gap-2"
                >
                  Vind leads <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr className="text-sm text-slate-400">
                  <th className="text-left p-3 font-medium">Naam</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Contact</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Bedrijf</th>
                  <th className="text-left p-3 font-medium">Dienst</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Datum</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px] md:hidden">{lead.email}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="text-sm">{lead.email}</div>
                      <div className="text-xs text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-slate-300 text-sm">{lead.company || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-violet-600/20 text-violet-300 rounded text-xs">
                        {serviceLabels[lead.service] || lead.service}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs hidden sm:table-cell">
                      {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="p-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusColors[lead.status]}`}
                      >
                        <option value="new">Nieuw</option>
                        <option value="contacted">Gecontacteerd</option>
                        <option value="won">Gewonnen</option>
                        <option value="lost">Verloren</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Revenue Estimate */}
        {stats.won > 0 && (
          <div className="mt-6 bg-gradient-to-r from-green-600/20 to-emerald-600/10 rounded-xl p-4 border border-green-600/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Geschatte maandelijkse omzet</div>
                <div className="text-3xl font-bold text-emerald-400">
                  €{stats.won * 497}+
                </div>
              </div>
              <div className="text-right text-sm text-slate-400">
                {stats.won} gewonnen × €497 gemiddeld
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
