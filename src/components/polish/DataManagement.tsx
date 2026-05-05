'use client'

import { useState } from 'react'
import { Trash2, Download, Upload, AlertTriangle, Check } from 'lucide-react'
import { clearAllData, showToast } from '@/lib/useSharedData'

export default function DataManagement() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const handleClearAll = () => {
    clearAllData()
    setShowConfirm(false)
    showToast('Alle data verwijderd', 'info')
    // Force reload to reset state
    setTimeout(() => window.location.reload(), 500)
  }

  const handleExportAll = () => {
    const data: Record<string, any> = {}
    const keys = [
      'localboost_business_profile',
      'localboost_leads',
      'localboost_templates',
      'localboost_tool_inputs',
    ]
    
    keys.forEach(key => {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          data[key] = JSON.parse(item)
        } catch {
          data[key] = item
        }
      }
    })
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `localboost-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2000)
    showToast('Backup gedownload', 'success')
  }

  const handleImportAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value))
        })
        showToast('Data geïmporteerd. Herlaad de pagina.', 'success')
        setTimeout(() => window.location.reload(), 1000)
      } catch {
        showToast('Ongeldig backup bestand', 'error')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <h4 className="font-semibold text-white mb-3">Data Beheer</h4>
      
      <div className="space-y-3">
        <button
          onClick={handleExportAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          {exportDone ? <Check className="w-4 h-4 text-green-400" /> : <Download className="w-4 h-4" />}
          Export alle data
        </button>
        
        <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition cursor-pointer">
          <Upload className="w-4 h-4" />
          Import backup
          <input type="file" accept=".json" onChange={handleImportAll} className="hidden" />
        </label>
        
        {showConfirm ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              Weet je het zeker?
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
              >
                Ja, verwijder alles
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
              >
                Annuleer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            Wis alle data
          </button>
        )}
      </div>
    </div>
  )
}
