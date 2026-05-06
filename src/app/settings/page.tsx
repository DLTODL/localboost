'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings, Trash2, Download, Upload, AlertTriangle, Check, Database, User, Bell, Shield } from 'lucide-react'
import { useBusinessProfile, clearAllData, showToast } from '@/lib/useSharedData'

export default function SettingsPage() {
  const { profile, clearProfile } = useBusinessProfile()
  const [showClearProfile, setShowClearProfile] = useState(false)
  const [showClearAll, setShowClearAll] = useState(false)

  const handleClearProfile = () => {
    clearProfile()
    setShowClearProfile(false)
    showToast('Bedrijfsprofiel gewist', 'info')
  }

  const handleClearAll = () => {
    clearAllData()
    setShowClearAll(false)
    showToast('Alle data verwijderd', 'info')
    setTimeout(() => window.location.reload(), 500)
  }

  const handleExportAll = () => {
    const data: Record<string, any> = {}
    const keys = [
      'localboost_business_profile',
      'localboost_leads',
      'localboost_templates',
      'localboost_tool_inputs',
      'localboost_onboarding_done'
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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-2xl font-bold">Instellingen</h1>
              <p className="text-slate-400 text-sm">Beheer je data en voorkeuren</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Business Profile */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Bedrijfsprofiel</h2>
                <p className="text-sm text-slate-400">Jouw bedrijfsinformatie voor pre-fill</p>
              </div>
            </div>

            {profile ? (
              <div className="bg-slate-900 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Bedrijfsnaam</div>
                    <div className="font-medium">{profile.name || '-'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Type</div>
                    <div className="font-medium">{profile.type || '-'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Plaats</div>
                    <div className="font-medium">{profile.city || '-'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Email</div>
                    <div className="font-medium">{profile.email || '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl p-4 mb-4 text-center text-slate-400 text-sm">
                Nog geen bedrijfsprofiel ingesteld
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium text-center transition"
              >
                {profile ? 'Bewerk Profiel' : 'Start Onboarding'}
              </Link>
              {profile && (
                <button
                  onClick={() => setShowClearProfile(true)}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {showClearProfile && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Weet je het zeker?</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">Dit verwijdert je bedrijfsprofiel maar behoudt je leads en templates.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearProfile}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                  >
                    Ja, verwijder profiel
                  </button>
                  <button
                    onClick={() => setShowClearProfile(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
                  >
                    Annuleer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Data Beheer</h2>
                <p className="text-sm text-slate-400">Backup, import en wis data</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportAll}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Import Backup
                <input type="file" accept=".json" onChange={handleImportAll} className="hidden" />
              </label>
            </div>

            <div className="mt-4">
              {showClearAll ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Weet je het zeker?</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Dit verwijdert AL je data: profiel, leads, templates en tool inputs. Dit kan niet ongedaan worden.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                    >
                      Ja, wis alles
                    </button>
                    <button
                      onClick={() => setShowClearAll(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
                    >
                      Annuleer
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearAll(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Wis Alle Data
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Tools</h2>
                <p className="text-sm text-slate-400">Snelle toegang tot alle tools</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link href="/tools/lead-finder" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium">Lead Finder</div>
              </Link>
              <Link href="/tools/review-generator" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-medium">Review Generator</div>
              </Link>
              <Link href="/tools/proposal-generator" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-sm font-medium">Voorstel Generator</div>
              </Link>
              <Link href="/tools/email-campaign-builder" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">📧</div>
                <div className="text-sm font-medium">Email Campaign</div>
              </Link>
              <Link href="/tools/seo-scanner" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">🔍</div>
                <div className="text-sm font-medium">SEO Scanner</div>
              </Link>
              <Link href="/dashboard" className="bg-slate-900 rounded-xl p-3 hover:bg-slate-700 transition text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-medium">Dashboard</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}