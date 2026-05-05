'use client'

import { useState, useEffect, useCallback } from 'react'

export interface BusinessProfile {
  name: string
  type: string
  city: string
  phone: string
  email: string
  website: string
  description: string
  googleReviewLink: string
}

export interface SavedLead {
  id: number
  name: string
  phone: string
  email: string
  company: string
  city: string
  notes: string
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  createdAt: string
  lastContacted: string | null
}

const STORAGE_KEYS = {
  businessProfile: 'localboost_business_profile',
  leads: 'localboost_leads',
  templates: 'localboost_templates',
  onboardingComplete: 'localboost_onboarding_done',
  favoriteTools: 'localboost_favorite_tools'
}

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.businessProfile)
    if (stored) {
      setProfile(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const saveProfile = useCallback((data: BusinessProfile) => {
    setProfile(data)
    localStorage.setItem(STORAGE_KEYS.businessProfile, JSON.stringify(data))
  }, [])

  const clearProfile = useCallback(() => {
    setProfile(null)
    localStorage.removeItem(STORAGE_KEYS.businessProfile)
  }, [])

  return { profile, saveProfile, clearProfile, loading }
}

export function useLeads() {
  const [leads, setLeads] = useState<SavedLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.leads)
    if (stored) {
      setLeads(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const addLead = useCallback((lead: Omit<SavedLead, 'id' | 'createdAt'>) => {
    const newLead: SavedLead = {
      ...lead,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    setLeads(prev => {
      const updated = [newLead, ...prev]
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(updated))
      return updated
    })
    return newLead
  }, [])

  const updateLead = useCallback((id: number, updates: Partial<SavedLead>) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === id ? { ...l, ...updates } : l)
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteLead = useCallback((id: number) => {
    setLeads(prev => {
      const updated = prev.filter(l => l.id !== id)
      localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(updated))
      return updated
    })
  }, [])

  return { leads, addLead, updateLead, deleteLead, loading }
}

export function useOnboarding() {
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.onboardingComplete)
    setComplete(stored === 'true')
    setLoading(false)
  }, [])

  const finishOnboarding = useCallback(() => {
    setComplete(true)
    localStorage.setItem(STORAGE_KEYS.onboardingComplete, 'true')
  }, [])

  const resetOnboarding = useCallback(() => {
    setComplete(false)
    localStorage.removeItem(STORAGE_KEYS.onboardingComplete)
  }, [])

  return { complete, finishOnboarding, resetOnboarding, loading }
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return { toast, showToast }
}

export function Toast({ toast }: { toast: { message: string; type: string } | null }) {
  if (!toast) return null
  
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-violet-600'
  }[toast.type] || 'bg-violet-600'

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-pulse`}>
      {toast.message}
    </div>
  )
}
