'use client'

import { ReactNode } from 'react'
import { Search, FileText, Users, Mail, Star, AlertCircle, Inbox, LucideIcon } from 'lucide-react'

type IconType = 'search' | 'file' | 'users' | 'mail' | 'star' | 'alert' | 'inbox'

interface EmptyStateProps {
  icon?: IconType | ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const iconMap: Record<IconType, LucideIcon> = {
  search: Search,
  file: FileText,
  users: Users,
  mail: Mail,
  star: Star,
  alert: AlertCircle,
  inbox: Inbox,
}

export function EmptyState({ icon = 'inbox', title, description, action, className = '' }: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' && icon in iconMap ? iconMap[icon as IconType] : null

  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800/50 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent className="w-10 h-10 text-slate-600" />
        ) : (
          icon
        )}
      </div>
      <h3 className="text-xl font-bold text-slate-400 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Preset empty states for common scenarios
export function NoLeadsEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="users"
      title="Nog geen leads"
      description="Gebruik de Lead Finder om potentiële klanten te zoeken in jouw regio"
      action={
        onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition"
          >
            Start Lead Finder
          </button>
        )
      }
    />
  )
}

export function NoResultsEmpty({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="Geen resultaten gevonden"
      description="Probeer andere zoektermen of pas je filters aan"
      action={
        onReset && (
          <button
            onClick={onReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
          >
            Reset filters
          </button>
        )
      }
    />
  )
}

export function NoTemplatesEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon="star"
      title="Nog geen templates"
      description="Sla je huidige invoer op als template voor snelle toegang later"
      action={
        onAction && (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium transition"
          >
            Maak je eerste template
          </button>
        )
      }
    />
  )
}

export function NoCampaignEmpty() {
  return (
    <EmptyState
      icon="mail"
      title="Nog geen campaign"
      description="Vul de klantgegevens in en klik op 'Genereer Campaign' om te beginnen"
    />
  )
}

export function ErrorEmpty({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="alert"
      title="Er ging iets mis"
      description={message || 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.'}
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
          >
            Probeer opnieuw
          </button>
        )
      }
    />
  )
}