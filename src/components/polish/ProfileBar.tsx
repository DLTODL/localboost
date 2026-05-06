'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, X, Check, ChevronDown, Building, MapPin } from 'lucide-react'
import { useBusinessProfile, showToast, copyWithToast } from '@/lib/useSharedData'

interface ProfileBarProps {
  className?: string
}

export default function ProfileBar({ className = '' }: ProfileBarProps) {
  const { profile } = useBusinessProfile()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!profile) return null

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
                <div className="font-medium text-white">{profile.name || 'Mijn Bedrijf'}</div>
                <div className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.city || 'Geen stad'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Instellingen</span>
            </Link>
          </div>
        </div>
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
