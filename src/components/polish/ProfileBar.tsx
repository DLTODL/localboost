'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Building, MapPin, Users, Search, Star, FileText, Zap, Briefcase, Phone, Mail, ChevronRight } from 'lucide-react'
import { useBusinessProfile, useLeads } from '@/lib/useSharedData'

interface ProfileBarProps {
  className?: string
}

// Quick access to most-used tools
const quickTools = [
  { href: '/tools/lead-finder', label: 'Leads', icon: Search, color: 'text-orange-400', emoji: '🎯' },
  { href: '/tools/review-generator', label: 'Reviews', icon: Star, color: 'text-yellow-400', emoji: '⭐' },
  { href: '/tools/proposal-generator', label: 'Voorstel', icon: FileText, color: 'text-blue-400', emoji: '📄' },
]

export default function ProfileBar({ className = '' }: ProfileBarProps) {
  const { profile } = useBusinessProfile()
  const { leads } = useLeads()
  const [showLeadsPreview, setShowLeadsPreview] = useState(false)

  if (!profile) return null

  // Get hot leads count
  const hotLeads = leads.filter(l => l.status === 'new').length

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

            {/* Quick Tool Buttons */}
            <div className="hidden md:flex items-center gap-1">
              {quickTools.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                  title={tool.label}
                >
                  <span className="text-base">{tool.emoji}</span>
                  <span>{tool.label}</span>
                </Link>
              ))}
            </div>

            {/* CRM Badge with preview */}
            {leads.length > 0 && (
              <div 
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-300 cursor-pointer hover:bg-green-500/30 transition"
                onClick={() => setShowLeadsPreview(!showLeadsPreview)}
                title="Klik voor lead preview"
              >
                <Users className="w-3.5 h-3.5" />
                {leads.length} {leads.length === 1 ? 'lead' : 'leads'} in CRM
                <ChevronRight className={`w-3 h-3 transition-transform ${showLeadsPreview ? 'rotate-90' : ''}`} />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Last lead quick access */}
            {leads.length > 0 && (
              <Link
                href="/tools/review-generator"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-300 transition"
                title="Open laatste lead in Review Generator"
              >
                <Star className="w-4 h-4" />
                <span className="text-xs">{leads[0]?.name?.split(' ')[0] || 'Lead'}</span>
              </Link>
            )}
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Instellingen</span>
            </Link>
          </div>
        </div>

        {/* Leads Preview Dropdown */}
        {showLeadsPreview && leads.length > 0 && (
          <div className="absolute left-0 right-0 bg-slate-800 border-b border-slate-700 px-6 py-4 animate-slide-down z-30">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">Recente Leads ({leads.length} totaal)</h4>
                <Link href="/tools/lead-finder" className="text-xs text-violet-400 hover:text-violet-300">
                  Bekijk alle →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {leads.slice(0, 6).map(lead => (
                  <Link
                    key={lead.id}
                    href="/tools/review-generator"
                    className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-xs transition"
                    title={lead.name}
                  >
                    <div className="font-medium text-slate-200 truncate">{lead.name}</div>
                    <div className="text-slate-400 truncate">{lead.city || 'Onbekend'}</div>
                    <div className={`mt-1 text-xs ${
                      lead.status === 'new' ? 'text-green-400' : 
                      lead.status === 'contacted' ? 'text-blue-400' : 
                      'text-slate-500'
                    }`}>
                      {lead.status === 'new' ? '🆕 Nieuw' : lead.status}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
