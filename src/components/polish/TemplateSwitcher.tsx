'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Copy, Check, Download, Upload, Star, Trash2 } from 'lucide-react'
import { useTemplates, showToast, copyWithToast } from '@/lib/useSharedData'

interface TemplateSwitcherProps {
  toolId: string
  onApply: (data: Record<string, any>) => void
  currentData: Record<string, any>
}

export default function TemplateSwitcher({ toolId, onApply, currentData }: TemplateSwitcherProps) {
  const { templates, saveTemplate, deleteTemplate, getTemplatesForTool, applyTemplate } = useTemplates()
  const [isOpen, setIsOpen] = useState(false)
  const [showSave, setShowSave] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const toolTemplates = getTemplatesForTool(toolId)

  // Sort: most used first, then by last used
  const sortedTemplates = [...toolTemplates].sort((a, b) => {
    const countDiff = (b.useCount || 0) - (a.useCount || 0)
    if (countDiff !== 0) return countDiff
    return new Date(b.lastUsed || 0).getTime() - new Date(a.lastUsed || 0).getTime()
  })

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('.template-switcher')) {
        setIsOpen(false)
        setShowSave(false)
        setShowDeleteConfirm(null)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setShowSave(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleApply = useCallback((template: typeof toolTemplates[0]) => {
    applyTemplate(template.id) // Track usage
    onApply(template.data)
    showToast(`${template.name} geladen`, 'success')
    setIsOpen(false)
  }, [applyTemplate, onApply])

  const handleSave = useCallback(() => {
    if (!templateName.trim()) {
      showToast('Geef een naam op', 'error')
      return
    }
    saveTemplate(toolId, templateName, currentData)
    setTemplateName('')
    setShowSave(false)
    showToast('Template opgeslagen', 'success')
  }, [templateName, saveTemplate, toolId, currentData])

  const handleDelete = useCallback((id: string) => {
    if (showDeleteConfirm === id) {
      deleteTemplate(id)
      showToast('Template verwijderd', 'info')
      setShowDeleteConfirm(null)
    } else {
      setShowDeleteConfirm(id)
      // Auto-reset after 3 seconds
      setTimeout(() => setShowDeleteConfirm(prev => prev === id ? null : prev), 3000)
    }
  }, [showDeleteConfirm, deleteTemplate])

  const handleExport = () => {
    const data = JSON.stringify(toolTemplates, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${toolId}-templates.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Templates geëxporteerd', 'success')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          imported.forEach(t => {
            if (t.tool === toolId && t.data && t.name) {
              saveTemplate(toolId, t.name, t.data)
            }
          })
          showToast(`${imported.length} templates geïmporteerd`, 'success')
        }
      } catch {
        showToast('Ongeldig bestand', 'error')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="relative template-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${
          isOpen 
            ? 'bg-violet-600 text-white' 
            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
        }`}
        title="Templates (Sla je invoer op en hergebruik)"
      >
        <Star className="w-4 h-4" />
        Templates
        {toolTemplates.length > 0 && (
          <span className={`px-1.5 py-0.5 text-xs rounded-full ${
            isOpen ? 'bg-white/30 text-white' : 'bg-violet-600 text-white'
          }`}>
            {toolTemplates.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-bounce-in">
          <div className="p-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {showSave ? 'Template opslaan' : 'Templates'}
            </span>
            <button 
              onClick={() => { setIsOpen(false); setShowSave(false); }}
              className="text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {showSave ? (
              <div className="p-4 space-y-3">
                <div className="text-sm text-slate-400">
                  Sla je huidige invoer op als template om later snel te kunnen laden.
                </div>
                <input
                  type="text"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  placeholder="Bijv: Mijn Restaurant Setup"
                  className="w-full px-3 py-2.5 text-sm bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-violet-500 focus:outline-none transition"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-3 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition font-medium"
                  >
                    Opslaan ✓
                  </button>
                  <button
                    onClick={() => setShowSave(false)}
                    className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                  >
                    Annuleer
                  </button>
                </div>
              </div>
            ) : sortedTemplates.length === 0 ? (
              <div className="p-4 text-center">
                <div className="text-4xl mb-2">📋</div>
                <div className="text-sm text-slate-400">
                  Nog geen templates.
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Sla je huidige invoer op als template.
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {sortedTemplates.map(template => (
                  <div key={template.id} className="p-3 hover:bg-slate-700/50 transition group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{template.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleApply(template)}
                          className="p-1.5 text-violet-400 hover:bg-violet-600/30 rounded transition"
                          title="Toepassen"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className={`p-1.5 rounded transition ${
                            showDeleteConfirm === template.id
                              ? 'bg-red-600 text-white'
                              : 'text-red-400 hover:bg-red-600/30'
                          }`}
                          title={showDeleteConfirm === template.id ? 'Klik opnieuw om te verwijderen' : 'Verwijderen'}
                        >
                          {showDeleteConfirm === template.id ? (
                            <Trash2 className="w-3.5 h-3.5" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className={template.useCount ? 'text-violet-400' : ''}>
                        {template.useCount || 0}x gebruikt
                      </span>
                      {template.lastUsed && (
                        <>
                          <span>•</span>
                          <span>{new Date(template.lastUsed).toLocaleDateString('nl-NL')}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 space-y-2">
            {!showSave && (
              <button
                onClick={() => setShowSave(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition font-medium"
              >
                <Star className="w-4 h-4" />
                Sla huidige invoer op
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleExport}
                disabled={toolTemplates.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <label className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
