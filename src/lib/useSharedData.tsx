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
  address?: string
  industry?: string
}

export interface ToolTemplate {
  id: string
  tool: string
  name: string
  data: Record<string, any>
  createdAt: string
}

const STORAGE_KEYS = {
  businessProfile: 'localboost_business_profile',
  leads: 'localboost_leads',
  templates: 'localboost_templates',
  onboardingComplete: 'localboost_onboarding_done',
  favoriteTools: 'localboost_favorite_tools',
  toolInputs: 'localboost_tool_inputs',
  selectedBusiness: 'localboost_selected_business',
}

// ==================
// BUSINESS PROFILE
// ==================
export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.businessProfile)
    if (stored) {
      try {
        setProfile(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse business profile:', e)
      }
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

// ==================
// SELECTED BUSINESS (Cross-tool)
// ==================
export interface SelectedBusiness {
  name: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  industry: string
  rating?: number
  reviewCount?: number
}

export function useSelectedBusiness() {
  const [business, setBusiness] = useState<SelectedBusiness | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.selectedBusiness)
    if (stored) {
      try {
        setBusiness(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse selected business:', e)
      }
    }
    setLoading(false)
  }, [])


  const selectBusiness = useCallback((data: SelectedBusiness) => {
    setBusiness(data)
    localStorage.setItem(STORAGE_KEYS.selectedBusiness, JSON.stringify(data))
  }, [])

  const clearSelectedBusiness = useCallback(() => {
    setBusiness(null)
    localStorage.removeItem(STORAGE_KEYS.selectedBusiness)
  }, [])

  return { business, selectBusiness, clearSelectedBusiness, loading }
}

// ==================
// LEADS CRM
// ==================
export function useLeads() {
  const [leads, setLeads] = useState<SavedLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.leads)
    if (stored) {
      try {
        setLeads(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse leads:', e)
      }
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

  const saveLeadFromFinder = useCallback((finderLead: {
    name: string
    phone: string
    website: string
    address: string
    city: string
    needs: string[]
  }) => {
    return addLead({
      name: finderLead.name,
      phone: finderLead.phone,
      email: '',
      company: finderLead.name,
      city: finderLead.city,
      notes: `Needs: ${finderLead.needs.join(', ')}`,
      status: 'new',
      lastContacted: null,
      address: finderLead.address,
      industry: finderLead.needs[0] || ''
    })
  }, [addLead])

  return { leads, addLead, updateLead, deleteLead, saveLeadFromFinder, loading }
}

// ==================
// TEMPLATES
// ==================
export function useTemplates() {
  const [templates, setTemplates] = useState<ToolTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.templates)
    if (stored) {
      try {
        setTemplates(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse templates:', e)
      }
    }
    setLoading(false)
  }, [])

  const saveTemplate = useCallback((tool: string, name: string, data: Record<string, any>) => {
    const newTemplate: ToolTemplate = {
      id: `${tool}_${Date.now()}`,
      tool,
      name,
      data,
      createdAt: new Date().toISOString()
    }
    setTemplates(prev => {
      const updated = [newTemplate, ...prev]
      localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(updated))
      return updated
    })
    return newTemplate
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id)
      localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getTemplatesForTool = useCallback((tool: string) => {
    return templates.filter(t => t.tool === tool)
  }, [templates])

  return { templates, saveTemplate, deleteTemplate, getTemplatesForTool, loading }
}

// ==================
// TOOL INPUT PERSISTENCE
// ==================
export function useToolInputs(toolId: string) {
  const [inputs, setInputs] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.toolInputs)
    if (stored) {
      try {
        const allInputs = JSON.parse(stored)
        setInputs(allInputs[toolId] || {})
      } catch (e) {
        console.error('Failed to parse tool inputs:', e)
      }
    }
    setLoading(false)
  }, [toolId])

  const saveInputs = useCallback((newInputs: Record<string, any>) => {
    setInputs(newInputs)
    const stored = localStorage.getItem(STORAGE_KEYS.toolInputs)
    const allInputs = stored ? JSON.parse(stored) : {}
    allInputs[toolId] = newInputs
    localStorage.setItem(STORAGE_KEYS.toolInputs, JSON.stringify(allInputs))
  }, [toolId])

  const clearInputs = useCallback(() => {
    setInputs({})
    const stored = localStorage.getItem(STORAGE_KEYS.toolInputs)
    if (stored) {
      const allInputs = JSON.parse(stored)
      delete allInputs[toolId]
      localStorage.setItem(STORAGE_KEYS.toolInputs, JSON.stringify(allInputs))
    }
  }, [toolId])

  return { inputs, saveInputs, clearInputs, loading }
}

// ==================
// ONBOARDING
// ==================
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

// ==================
// TOAST SYSTEM
// ==================
// Re-export from toast.tsx for backwards compatibility
export { showToast, copyWithToast, useToasts } from './toast'

// ==================
// CROSS-TOOL NOTIFICATIONS
// ==================
export type CrossToolEvent = {
  type: 'lead_saved' | 'business_selected' | 'template_applied'
  toolId: string
  data: Record<string, any>
  timestamp: string
}

const crossToolListeners: Set<(event: CrossToolEvent) => void> = new Set()

export function subscribeToCrossToolEvents(callback: (event: CrossToolEvent) => void) {
  crossToolListeners.add(callback)
  return () => crossToolListeners.delete(callback)
}

function emitCrossToolEvent(event: CrossToolEvent) {
  crossToolListeners.forEach(cb => cb(event))
}

export function notifyLeadSaved(toolId: string, leadData: Record<string, any>) {
  emitCrossToolEvent({ type: 'lead_saved', toolId, data: leadData, timestamp: new Date().toISOString() })
}

export function notifyBusinessSelected(toolId: string, businessData: Record<string, any>) {
  emitCrossToolEvent({ type: 'business_selected', toolId, data: businessData, timestamp: new Date().toISOString() })
}

export function notifyTemplateApplied(toolId: string, templateData: Record<string, any>) {
  emitCrossToolEvent({ type: 'template_applied', toolId, data: templateData, timestamp: new Date().toISOString() })
}

// ==================
// CLEAR ALL DATA
// ==================
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  // Dispatch event to reset toast state
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('localboost_clear_data'))
  }
}
