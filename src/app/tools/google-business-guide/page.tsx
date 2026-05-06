'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, ExternalLink, Lightbulb, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { useBusinessProfile, useTemplates, useToolInputs } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'

interface Task { id: number; title: string; category: string; completed: boolean }

const categories = [
  { id: 'setup', label: '📌 Setup', color: 'violet' },
  { id: 'optimize', label: '⚡ Optimalisatie', color: 'blue' },
  { id: 'media', label: '📸 Media', color: 'green' },
  { id: 'reviews', label: '⭐ Reviews', color: 'yellow' },
  { id: 'posts', label: '📝 Posts', color: 'purple' },
  { id: 'questions', label: '❓ Vragen', color: 'cyan' },
  { id: 'maintenance', label: '🔧 Onderhoud', color: 'orange' }
]

const tasks = [
  // Setup
  { id: 1, title: 'Google Account aanmaken of inloggen', category: 'setup', completed: false },
  { id: 2, title: 'Ga naar business.google.com/business/setup', category: 'setup', completed: false },
  { id: 3, title: 'Zoek je bedrijfsnaam en klik op "Toevoegen"', category: 'setup', completed: false },
  { id: 4, title: 'Kies de juiste categorie voor je bedrijf', category: 'setup', completed: false },
  { id: 5, title: 'Voeg je adres toe (zorg dat het klopt!)', category: 'setup', completed: false },
  { id: 6, title: 'Kies of je klanten op bezoekadres ontvangt', category: 'setup', completed: false },
  { id: 7, title: 'Verifieer je bedrijf via telefoon of post', category: 'setup', completed: false },
  // Optimize
  { id: 8, title: 'Vul alle bedrijfsgegevens volledig in', category: 'optimize', completed: false },
  { id: 9, title: 'Kies relevante categorieën (tot 10)', category: 'optimize', completed: false },
  { id: 10, title: 'Voeg je website URL toe', category: 'optimize', completed: false },
  { id: 11, title: 'Stel openingstijden in voor elke dag', category: 'optimize', completed: false },
  { id: 12, title: 'Voeg speciale openingstijden toe voor feestdagen', category: 'optimize', completed: false },
  { id: 13, title: 'Schakel berichtenservice in', category: 'optimize', completed: false },
  // Media
  { id: 14, title: 'Upload 5+ professionele foto\'s van je bedrijf', category: 'media', completed: false },
  { id: 15, title: 'Voeg foto\'s toe van je team', category: 'media', completed: false },
  { id: 16, title: 'Voeg foto\'s toe van producten/diensten', category: 'media', completed: false },
  { id: 17, title: 'Voeg een video toe (30 seconden optimaal)', category: 'media', completed: false },
  // Reviews
  { id: 18, title: 'Stel automatische review-verzoeken in', category: 'reviews', completed: false },
  { id: 19, title: 'Reageer op alle bestaande reviews', category: 'reviews', completed: false },
  { id: 20, title: 'Vraag 3-5 tevreden klanten om een review', category: 'reviews', completed: false },
  // Posts
  { id: 21, title: 'Maak een "Welkom" post aan', category: 'posts', completed: false },
  { id: 22, title: 'Plaats wekelijks een update of aanbieding', category: 'posts', completed: false },
  { id: 23, title: ' Gebruik foto\'s bij elke post', category: 'posts', completed: false },
  // Questions
  { id: 24, title: 'Voeg veelgestelde vragen toe', category: 'questions', completed: false },
  { id: 25, title: 'Beantwoord alle vragen snel', category: 'questions', completed: false },
  // Maintenance
  { id: 26, title: 'Check maandelijks je statistieken', category: 'maintenance', completed: false },
  { id: 27, title: 'Update foto\'s elke 3 maanden', category: 'maintenance', completed: false },
  { id: 28, title: 'Monitor en reageer op nieuwe reviews', category: 'maintenance', completed: false }
]

export default function GoogleBusinessGuide() {
  const { profile } = useBusinessProfile()
  const { saveTemplate, getTemplatesForTool } = useTemplates()
  const { inputs, saveInputs } = useToolInputs('google-business-guide')
  const savedTemplates = getTemplatesForTool('google-business-guide')
  
  const [taskList, setTaskList] = useState<Task[]>(tasks.map(t => ({ ...t })))
  const [expandedCategory, setExpandedCategory] = useState<string | null>('setup')
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false)

  // Pre-fill showOnlyIncomplete from saved inputs
  useEffect(() => {
    if (inputs.showOnlyIncomplete !== undefined) {
      setShowOnlyIncomplete(inputs.showOnlyIncomplete)
    }
  }, [inputs.showOnlyIncomplete])

  // Save showOnlyIncomplete on change
  useEffect(() => {
    saveInputs({ showOnlyIncomplete })
  }, [showOnlyIncomplete, saveInputs])

  const toggleTask = (id: number) => {
    setTaskList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const getCategoryTasks = (categoryId: string) => taskList.filter(t => t.category === categoryId)
  const getCategoryProgress = (categoryId: string) => {
    const catTasks = getCategoryTasks(categoryId)
    const done = catTasks.filter(t => t.completed).length
    return { done, total: catTasks.length, percent: Math.round((done / catTasks.length) * 100) }
  }

  const totalDone = taskList.filter(t => t.completed).length
  const totalPercent = Math.round((totalDone / taskList.length) * 100)

  const filteredTasks = showOnlyIncomplete ? taskList.filter(t => !t.completed) : taskList

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">🏪 Google Business Setup Guide{profile?.name ? ` – ${profile.name}` : ''}</h1>
              <p className="text-slate-400 text-sm mt-1">Volg deze stappen om je Google Business profiel te optimaliseren</p>
            </div>
            <TemplateSwitcher
              toolId="google-business-guide"
              onApply={(data) => {
                // Guide is checklist-based, templates save task completion states
              }}
              currentData={{ progress: totalPercent }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Progress */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div><span className="text-3xl font-bold">{totalPercent}%</span><span className="text-slate-400 ml-2">compleet</span></div>
            <div className="text-slate-400">{totalDone} van {taskList.length} taken</div>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500" style={{ width: `${totalPercent}%` }} />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <a href="https://business.google.com" target="_blank" rel="noopener" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800 transition text-center">
            <div className="text-xl mb-1">🌐</div><div className="text-sm font-medium">Google Business</div>
          </a>
          <a href="https://maps.google.com" target="_blank" rel="noopener" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800 transition text-center">
            <div className="text-xl mb-1">📍</div><div className="text-sm font-medium">Google Maps</div>
          </a>
          <a href="https://www.google.com/maps/reserve" target="_blank" rel="noopener" className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800 transition text-center">
            <div className="text-xl mb-1">⭐</div><div className="text-sm font-medium">Review Pagina</div>
          </a>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)} className={`px-4 py-2 rounded-lg font-medium transition text-sm ${showOnlyIncomplete ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-800'}`}>
            Alleen openstaand
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {categories.map(cat => {
            const progress = getCategoryProgress(cat.id)
            const catTasks = getCategoryTasks(cat.id).filter(t => !showOnlyIncomplete || !t.completed)
            if (showOnlyIncomplete && catTasks.length === 0) return null
            
            return (
              <div key={cat.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
                <button onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)} className="w-full p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{cat.label}</span>
                    <span className="text-sm text-slate-400">{progress.done}/{progress.total}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <span className="text-sm text-slate-400">{progress.percent}%</span>
                    {expandedCategory === cat.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>
                {expandedCategory === cat.id && (
                  <div className="p-4 pt-0 space-y-2">
                    {catTasks.map(task => (
                      <div key={task.id} onClick={() => toggleTask(task.id)} className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${task.completed ? 'bg-emerald-600/10 border-emerald-600/30' : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}`}>
                        {task.completed ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />}
                        <span className={task.completed ? 'text-slate-400 line-through' : ''}>{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Pro Tips */}
        <div className="mt-6 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-xl p-6 border border-amber-600/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-400" /> Pro Tips</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Vul ALTIJD alle velden in - dit helpt je ranking</li>
            <li>• Upload regelmatig nieuwe foto's - Google houdt van verse content</li>
            <li>• Vraag actief om reviews van tevreden klanten</li>
            <li>• Reageer binnen 24 uur op alle vragen en reviews</li>
            <li>• Post wekelijks om je profiel actief te houden</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
