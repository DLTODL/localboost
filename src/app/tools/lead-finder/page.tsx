'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Building, Phone, Mail, Globe, Copy, Check, Filter, Download, Star, ExternalLink, Save, Trash2 } from 'lucide-react'

interface Lead {
  id: number
  name: string
  address: string
  city: string
  phone: string
  website: string
  rating: number
  reviewCount: number
  lastReview: string
  needs: string[]
  priority: 'hot' | 'warm' | 'cold'
}

const industries = [
  'Loodgieter', 'Elektricien', 'Schilder', 'Hovenier', 'Timmerman',
  'Bakker', 'Café', 'Restaurant', 'Salon', 'Fysiotherapie',
  'Tandarts', 'Dokter', 'Makelaar', 'Autogarage', 'Fietsenmaker',
  'Kinderopvang', 'Schoenmaker', 'Naaimaker', 'Glazenmaker', 'Dakdekker'
]

const cities = [
  'Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Groningen',
  'Maastricht', 'Eindhoven', 'Leiden', 'Delft', 'Almere',
  'Breda', 'Nijmegen', 'Enschede', 'Arnhem', 'Haarlem'
]

// Generate mock leads based on input
const generateLeads = (city: string, industry: string): Lead[] => {
  const leads: Lead[] = []
  const count = 8 + Math.floor(Math.random() * 5)
  
  for (let i = 0; i < count; i++) {
    const hasWebsite = Math.random() > 0.4
    const hasPhone = Math.random() > 0.1
    const rating = Math.round((3 + Math.random() * 2) * 10) / 10
    const reviewCount = Math.floor(Math.random() * 50)
    
    let priority: 'hot' | 'warm' | 'cold' = 'cold'
    if (!hasWebsite && rating < 4) priority = 'hot'
    else if (!hasWebsite || rating < 4) priority = 'warm'
    
    const needs: string[] = []
    if (!hasWebsite) needs.push('Website nodig')
    if (rating < 4.2) needs.push('Reviews verbeteren')
    if (needs.length === 0) needs.push('SEO optimalisatie')
    
    leads.push({
      id: i + 1,
      name: `${industry} Bedrijf ${i + 1}`,
      address: `${Math.floor(Math.random() * 200) + 1} ${['Kerkstraat', 'Dorpsstraat', 'Hoofdstraat', 'Industrieweg', ' Stationsstraat'][Math.floor(Math.random() * 5)]}`,
      city: city,
      phone: hasPhone ? `06 ${Math.floor(Math.random() * 90000000) + 10000000}` : '',
      website: hasWebsite ? `https://${industry.toLowerCase()}${i + 1}${city.toLowerCase()}.nl` : '',
      rating,
      reviewCount,
      lastReview: `${Math.floor(Math.random() * 30) + 1} dagen geleden`,
      needs,
      priority
    })
  }
  
  return leads.sort((a, b) => {
    const priorityOrder = { hot: 0, warm: 1, cold: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

export default function LeadFinder() {
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [filterPriority, setFilterPriority] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

  const handleSearch = () => {
    if (!city || !industry) return
    setLoading(true)
    setSearched(false)
    
    setTimeout(() => {
      const results = generateLeads(city, industry)
      setLeads(results)
      setSearched(true)
      setLoading(false)
    }, 1500)
  }

  const copyLead = (lead: Lead, field: 'phone' | 'all') => {
    const text = field === 'phone' && lead.phone 
      ? lead.phone 
      : `${lead.name}\n${lead.address}, ${lead.city}\n${lead.phone}\n${lead.website}\n\nBehoeften: ${lead.needs.join(', ')}`
    
    navigator.clipboard.writeText(text)
    setCopiedId(lead.id)
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(field === 'phone' ? 'Telefoonnummer gekopieerd!' : 'Lead info gekopieerd!')
    }
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredLeads = filterPriority === 'all' 
    ? leads 
    : leads.filter(l => l.priority === filterPriority)

  const hotLeads = leads.filter(l => l.priority === 'hot').length
  const warmLeads = leads.filter(l => l.priority === 'warm').length

  const exportCSV = () => {
    const headers = ['Naam', 'Adres', 'Plaats', 'Telefoon', 'Website', 'Rating', 'Reviews', 'Prioriteit', 'Behoeften']
    const rows = filteredLeads.map(l => [
      l.name, l.address, l.city, l.phone, l.website, l.rating, l.reviewCount, l.priority, l.needs.join('; ')
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${city}_${industry}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(`${filteredLeads.length} leads geexporteerd!`)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-black">Lead Finder</h1>
          </div>
          <p className="text-slate-400">Vind potentiele klanten in je regio - gratis te gebruiken</p>
        </div>

        {/* Search */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Stad</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="">Selecteer stad...</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Branche</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="">Selecteer branche...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!city || !industry || loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <span className="animate-pulse">Zoeken...</span>
                ) : (
                  <><Search className="w-5 h-5" /> Vind Leads</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-white">{leads.length}</div>
                <div className="text-sm text-slate-400">Totaal leads</div>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                <div className="text-2xl font-black text-red-400">{hotLeads}</div>
                <div className="text-sm text-red-400">Hot leads 🔥</div>
              </div>
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
                <div className="text-2xl font-black text-orange-400">{warmLeads}</div>
                <div className="text-sm text-orange-400">Warm leads</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="text-2xl font-black text-green-400">{filteredLeads.length}</div>
                <div className="text-sm text-slate-400">Getoond</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {(['all', 'hot', 'warm', 'cold'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterPriority(f)}
                    className={`px-4 py-2 rounded-xl font-medium transition ${
                      filterPriority === f 
                        ? f === 'hot' ? 'bg-red-600 text-white' :
                          f === 'warm' ? 'bg-orange-600 text-white' :
                          f === 'cold' ? 'bg-blue-600 text-white' :
                          'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {f === 'all' ? 'Alle' : f === 'hot' ? '🔥 Hot' : f === 'warm' ? 'Warm' : 'Cold'}
                  </button>
                ))}
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
              >
                <Download className="w-4 h-4" /> Exporteer CSV
              </button>
            </div>

            {/* Leads List */}
            <div className="space-y-3">
              {filteredLeads.map(lead => (
                <div 
                  key={lead.id}
                  className={`bg-slate-800 rounded-xl p-5 border transition ${
                    lead.priority === 'hot' ? 'border-red-500/50' :
                    lead.priority === 'warm' ? 'border-orange-500/50' :
                    'border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          lead.priority === 'hot' ? 'bg-red-600 text-white' :
                          lead.priority === 'warm' ? 'bg-orange-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {lead.priority === 'hot' ? '🔥 HOT' : lead.priority === 'warm' ? 'WARM' : 'COLD'}
                        </span>
                        <h3 className="font-bold text-lg">{lead.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{lead.rating}</span>
                          <span className="text-slate-500 text-sm">({lead.reviewCount} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {lead.address}, {lead.city}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.website && (
                          <span className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
                              Website
                            </a>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {lead.needs.map((need, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {lead.phone && (
                        <button
                          onClick={() => copyLead(lead, 'phone')}
                          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                          title="Kopieer telefoonnummer"
                        >
                          {copiedId === lead.id ? <Check className="w-5 h-5 text-green-400" /> : <Phone className="w-5 h-5" />}
                        </button>
                      )}
                      <button
                        onClick={() => copyLead(lead, 'all')}
                        className="p-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition"
                        title="Kopieer alle info"
                      >
                        {copiedId === lead.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Wil je dat wij deze leads voor je contacteren?</h3>
              <p className="text-white/80 mb-4">Wij sturen een gepersonaliseerde email naar alle hot leads</p>
              <a href="/#contact" className="inline-block bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
                Neem contact op →
              </a>
            </div>
          </>
        )}

        {/* Empty State */}
        {!searched && !loading && (
          <div className="text-center py-16 text-slate-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Voer een stad en branche in om leads te vinden</p>
          </div>
        )}
      </div>
    </div>
  )
}
