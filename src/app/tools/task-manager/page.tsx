'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, Plus, Clock, AlertTriangle, Trash2, 
  Filter, Calendar, User, Play, CheckCircle
} from 'lucide-react'

interface Task {
  id: number
  leadId: number
  title: string
  description: string
  category: 'setup' | 'optimize' | 'content' | 'reviews' | 'ads' | 'follow-up'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate?: string
  completedAt?: string
  createdAt: string
}

interface Lead {
  id: number
  name: string
  email: string
  company: string
  service: string
}

const categoryColors: Record<string, string> = {
  'setup': 'bg-violet-600/20 text-violet-300',
  'optimize': 'bg-blue-600/20 text-blue-300',
  'content': 'bg-green-600/20 text-green-300',
  'reviews': 'bg-yellow-600/20 text-yellow-300',
  'ads': 'bg-purple-600/20 text-purple-300',
  'follow-up': 'bg-cyan-600/20 text-cyan-300'
}

const categoryLabels: Record<string, string> = {
  'setup': 'Setup',
  'optimize': 'Optimalisatie',
  'content': 'Content',
  'reviews': 'Reviews',
  'ads': 'Ads',
  'follow-up': 'Follow-up'
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filterLead, setFilterLead] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    leadId: 0,
    title: '',
    description: '',
    category: 'setup' as Task['category'],
    priority: 'medium' as Task['priority'],
    dueDate: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, leadsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/leads')
      ])
      const tasksData = await tasksRes.json()
      const leadsData = await leadsRes.json()
      setTasks(tasksData.tasks || [])
      setLeads(leadsData.leads || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async () => {
    if (!newTask.title || !newTask.leadId) return
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (res.ok) { fetchData(); setShowAddForm(false); setNewTask({ leadId: 0, title: '', description: '', category: 'setup', priority: 'medium', dueDate: '' }) }
    } catch (error) { console.error('Error:', error) }
  }

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchData()
    } catch (error) { console.error('Error:', error) }
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try { await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); fetchData() } catch (error) { console.error('Error:', error) }
  }

  const generateTasks = async (leadId: number, service: string) => {
    if (!confirm(`Generate tasks for ${service}?`)) return
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, generateForService: service })
      })
      const data = await res.json()
      if (data.success) { alert(`Generated ${data.tasks?.length || 0} tasks!`); fetchData() }
    } catch (error) { console.error('Error:', error) }
  }

  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId)
    return lead ? lead.name : `#${leadId}`
  }

  const filteredTasks = tasks.filter(t => {
    if (filterLead !== 'all' && t.leadId !== parseInt(filterLead)) return false
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (filterCategory !== 'all' && t.category !== filterCategory) return false
    return true
  })

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">✅ Taak Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Beheer taken voor elke lead en servicedelivery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Totaal', value: stats.total },
            { label: 'Openstaand', value: stats.pending },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Klaar', value: stats.completed }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select value={filterLead} onChange={(e) => setFilterLead(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
            <option value="all">Alle Leads</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
            <option value="all">Alle Status</option>
            <option value="pending">Openstaand</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Klaar</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm">
            <option value="all">Alle Categorieën</option>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={() => setShowAddForm(true)} className="ml-auto px-4 py-2 bg-violet-600 rounded-lg font-medium hover:bg-violet-700 transition text-sm">
            + Taak Toevoegen
          </button>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {loading ? <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">Laden...</div> :
           filteredTasks.length === 0 ? <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">Geen taken gevonden</div> :
           filteredTasks.map(task => (
            <div key={task.id} className={`bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 border-l-4 ${task.priority === 'high' ? 'border-l-red-500' : task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-slate-500'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[task.category]}`}>{categoryLabels[task.category]}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{getLeadName(task.leadId)}</span>
                    {task.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString('nl-NL')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.status === 'pending' && <button onClick={() => updateTaskStatus(task.id, 'in-progress')} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30" title="Start"><Play className="w-4 h-4" /></button>}
                  {task.status !== 'completed' && <button onClick={() => updateTaskStatus(task.id, 'completed')} className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30" title="Klaar"><CheckCircle className="w-4 h-4" /></button>}
                  <button onClick={() => deleteTask(task.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30" title="Verwijder"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-lg w-full">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Nieuwe Taak</h2>
                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-700 rounded-lg">✕</button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Lead</label>
                  <select value={newTask.leadId} onChange={(e) => setNewTask({...newTask, leadId: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                    <option value={0}>Selecteer lead...</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.company || 'Geen bedrijf'})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Titel</label>
                  <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" placeholder="Taak titel" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Beschrijving</label>
                  <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg h-20" placeholder="Beschrijving" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Categorie</label>
                    <select value={newTask.category} onChange={(e) => setNewTask({...newTask, category: e.target.value as Task['category']})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                      {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Prioriteit</label>
                    <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
                      <option value="high">Hoog</option><option value="medium">Medium</option><option value="low">Laag</option>
                    </select>
                  </div>
                </div>
                <button onClick={createTask} disabled={!newTask.title || !newTask.leadId} className="w-full py-3 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-50">Taak Aanmaken</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
