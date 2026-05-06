'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Building, MapPin, Users, Search, Star, FileText, ChevronRight, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { useBusinessProfile, useLeads, useCrossToolBridge } from '@/lib/useSharedData'

interface ProfileBarProps {
  className?: string
}

// Quick access to most-used tools
const quickTools = [
  { href: '/tools/lead-finder', label: 'Leads', emoji: '🎯', color: 'from-red-500 to-orange-500' },
  { href: '/tools/review-generator', label: 'Reviews', emoji: '⭐', color: 'from-yellow-500 to-amber-500' },
  { href: '/tools/proposal-generator', label: 'Voorstel', emoji: '📄', color: 'from-blue-500 to-indigo-500' },
  { href: '/tools/email-campaign-builder', label: 'Email', emoji: '📧', color: 'from-violet-500 to-purple-500' },
]

const statusColors: Record<string, string> = {
  new: 'bg-green-500/20 text-green-400 border-green-500/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  qualified: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  won: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  lost: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export default function ProfileBar({ className = '' }: ProfileBarProps) {
  const { profile } = useBusinessProfile()
  const { leads } = useLeads()
  const { getLastBusiness } = useCrossToolBridge()
  const [showLeadsPreview, setShowLeadsPreview] = useState(false)
  const [showQuickTools, setShowQuickTools] = useState(false)
  const [lastBusiness, setLastBusiness] = useState<any>(null)

  useEffect(() => {
    const business = getLastBusiness()
    if (business) setLastBusiness(business)
  }, [getLastBusiness])

  if (!profile) return null

  const newLeads = leads.filter(l => l.status === 'new').length
  const contactedLeads = leads.filter(l => l.status === 'contacted').length

  return (
    <div className={`bg-slate-800/80 backdrop-blur border-b border-slate-700 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Quick Profile View */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-white flex items-center gap-2">
                  {profile.name || 'Mijn Bedrijf'}
                  {profile.type && (
                    <span className="px-1.5 py-0.5 bg-violet-600/30 text-violet-300 text-xs rounded font-normal">
                      {profile.type}
                    </span>
                  )}
                </div>
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city || 'Geen stad'}
                </div>
              </div>
            </div>

            {/* CRM Stats */}
            {leads.length > 0 && (
              <div className="hidden lg:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 rounded-lg text-xs">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300 font-medium">{leads.length}</span>
                  <span className="text-slate-500">totaal</span>
                </div>
                {newLeads > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 rounded-lg text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-400 font-medium">{newLeads}</span>
                    <span className="text-green-400/70">nieuw</span>
                  </div>
                )}
                {contactedLeads > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 rounded-lg text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-blue-400 font-medium">{contactedLeads}</span>
                    <span className="text-blue-400/70">contact</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Tool Buttons - Dropdown on mobile */}
            <div className="relative">
              <button
                onClick={() => setShowQuickTools(!showQuickTools)}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                <span>Tools</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${showQuickTools ? 'rotate-90' : ''}`} />
              </button>
              <div className="hidden md:flex items-center gap-1">
                {quickTools.map(tool => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition group"
                    title={tool.label}
                  >
                    <span className={`w-5 h-5 rounded bg-gradient-to-br ${tool.color} flex items-center justify-center text-xs`}>
                      {tool.emoji}
                    </span>
                    <span className="hidden lg:inline">{tool.label}</span>
                  </Link>
                ))}
              </div>
              {/* Mobile dropdown */}
              {showQuickTools && (
                <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-xl z-50 min-w-[160px]">
                  {quickTools.map(tool => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
                      onClick={() => setShowQuickTools(false)}
                    >
                      <span className={`w-6 h-6 rounded bg-gradient-to-br ${tool.color} flex items-center justify-center text-sm`}>
                        {tool.emoji}
                      </span>
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Last Business Quick Access */}
            {lastBusiness && (
              <Link
                href="/tools/review-generator"
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 rounded-lg transition"
                title={`Laatste: ${lastBusiness.name}`}
              >
                <span className="text-base">🎯</span>
                <div className="text-xs">
                  <div className="text-violet-300 font-medium truncate max-w-[100px]">{lastBusiness.name}</div>
                  <div className="text-violet-400/70">Review Generator</div>
                </div>
              </Link>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Leads Preview Toggle */}
            {leads.length > 0 && (
              <button
                onClick={() => setShowLeadsPreview(!showLeadsPreview)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition ${
                  showLeadsPreview
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CRM</span>
                <ChevronRight className={`w-3 h-3 transition-transform ${showLeadsPreview ? 'rotate-90' : ''}`} />
              </button>
            )}
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
              title="Instellingen"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Instellingen</span>
            </Link>
          </div>
        </div>

        {/* Leads Preview Panel */}
        {showLeadsPreview && leads.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/50 animate-slide-down">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-300">CRM Leads</h4>
                <span className="px-1.5 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                  {leads.length} totaal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/tools/review-generator"
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                >
                  ⭐ Review Generator
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="/tools/lead-finder" className="text-xs text-violet-400 hover:text-violet-300">
                  Lead Finder →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {leads.slice(0, 6).map(lead => (
                <Link
                  key={lead.id}
                  href="/tools/review-generator"
                  className="group p-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition hover:scale-[1.02]"
                  title={`${lead.name} - ${lead.city || 'Onbekend'}`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="font-medium text-slate-200 text-sm truncate group-hover:text-white">
                      {lead.name}
                    </div>
                    {lead.status === 'new' && (
                      <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-1 animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{lead.city || lead.company || 'Onbekend'}</div>
                  <div className={`mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${
                    statusColors[lead.status] || statusColors.new
                  }`}>
                    {lead.status === 'new' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>}
                    {lead.status === 'contacted' && <Clock className="w-2.5 h-2.5" />}
                    {lead.status === 'qualified' && <CheckCircle className="w-2.5 h-2.5" />}
                    {lead.status === 'won' && <TrendingUp className="w-2.5 h-2.5" />}
                    <span className="capitalize">
                      {lead.status === 'new' ? 'Nieuw' :
                       lead.status === 'contacted' ? 'Contact' :
                       lead.status === 'qualified' ? 'Gekwalificeerd' :
                       lead.status === 'won' ? 'Gewonnen' : lead.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {leads.length > 6 && (
              <div className="mt-2 text-center">
                <Link
                  href="/tools/lead-finder"
                  className="text-xs text-slate-500 hover:text-slate-400 transition"
                >
                  + {leads.length - 6} meer leads bekijken →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for tool pages
export function CompactProfileBar() {
  const { profile } = useBusinessProfile()

  if (!profile) return null

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm">
      <Building className="w-4 h-4 text-violet-400" />
      <span className="text-slate-300">{profile.name}</span>
      <span className="text-slate-500">•</span>
      <span className="text-slate-400">{profile.city}</span>
    </div>
  )
}
