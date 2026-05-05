'use client'

import { useState, useEffect } from 'react'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  status: string
  created_at: string
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    // In production, this would call an API endpoint
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
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

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">📊 LocalBoost Dashboard</h1>
            <p className="text-slate-400">Manage your leads and track results</p>
          </div>
          <div className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleString('nl-NL')}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Totaal', value: stats.total, emoji: '📨' },
            { label: 'Nieuw', value: stats.new, emoji: '🆕' },
            { label: 'Gecontacteerd', value: stats.contacted, emoji: '📞' },
            { label: 'Gewonnen', value: stats.won, emoji: '✅' },
            { label: 'Verloren', value: stats.lost, emoji: '❌' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'new', 'contacted', 'won', 'lost'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'Alle' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Laden...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Geen leads gevonden in deze categorie
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="text-left p-4 font-semibold">Naam</th>
                  <th className="text-left p-4 font-semibold">Contact</th>
                  <th className="text-left p-4 font-semibold">Bedrijf</th>
                  <th className="text-left p-4 font-semibold">Dienst</th>
                  <th className="text-left p-4 font-semibold">Datum</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-700 hover:bg-slate-750">
                    <td className="p-4">
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-slate-400">{lead.message?.slice(0, 50)}...</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{lead.email}</div>
                      <div className="text-sm text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="p-4 text-slate-300">{lead.company || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-violet-600/20 text-violet-300 rounded text-sm">
                        {lead.service}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(lead.created_at).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${
                          lead.status === 'new' ? 'bg-blue-600 text-white' :
                          lead.status === 'contacted' ? 'bg-yellow-600 text-white' :
                          lead.status === 'won' ? 'bg-green-600 text-white' :
                          'bg-red-600 text-white'
                        }`}
                      >
                        <option value="new">Nieuw</option>
                        <option value="contacted">Gecontacteerd</option>
                        <option value="won">Gewonnen</option>
                        <option value="lost">Verloren</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm">
                        Bekijk
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <button className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-left hover:bg-slate-750 transition">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold">SEO Scanner</div>
            <div className="text-sm text-slate-400">Analyseer een website</div>
          </button>
          <button className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-left hover:bg-slate-750 transition">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold">Proposal Generator</div>
            <div className="text-sm text-slate-400">Genereer een voorstel</div>
          </button>
          <button className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-left hover:bg-slate-750 transition">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold">Analytics</div>
            <div className="text-sm text-slate-400">Bekijk statistieken</div>
          </button>
        </div>
      </div>
    </div>
  )
}
