'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, Plus, Trash2, Calendar, User, Play, CheckCircle, X,
  Loader2, AlertCircle
} from 'lucide-react'
import { ListSkeleton } from '@/components/polish/Skeleton'
import { EmptyState } from '@/components/polish/EmptyState'
import { showToast } from '@/lib/toast'

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
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
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
    if (!newTask.title || !newTask.leadId) {
      showToast('Vul alle verplichte velden in', 'error')
      return
    }
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })
      if (res.ok) {
        showToast('Taak aangemaakt!', 'success')
        fetchData()
        setShowAddForm(false)
        setNewTask({ leadId: 0, title: '', description: '', category: 'setup', priority: 'medium', dueDate: '' })
      } else {
        throw new Error('Failed to create')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('Kon taak niet aanmaken', 'error')
    }
  }

  const updateTaskStatus = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        showToast(status === 'completed' ? 'Taak voltooid!' : 'Taak gestart', 'success')
        fetchData()
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('Kon status niet updaten', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteTask = async (id: number) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Taak verwijderd', 'info')
        fetchData()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('Kon taak niet verwijderen', 'error')
    } finally {
      setDeletingId(null)
    }
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-violet-400" />
            Taak Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Beheer taken voor elke lead en servicedelivery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Totaal', value: stats.total, color: 'text-white' },
            { label: 'Openstaand', value: stats.pending, color: 'text-blue-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
            { label: 'Klaar', value: stats.completed, color: 'text-green-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select 
            value={filterLead} 
            onChange={(e) => setFilterLead(e.target.value)} 
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">Alle Leads</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">Alle Status</option>
            <option value="pending">Openstaand</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Klaar</option>
          </select>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)} 
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="all">Alle Categorieën</option>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button 
            onClick={() => setShowAddForm(true)} 
            className="ml-auto px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Taak Toevoegen
          </button>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {loading ? (
            <ListSkeleton items={4} />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon="check"
              title={filterStatus !== 'all' ? 'Geen taken in deze categorie' : 'Nog geen taken'}
              description={
                filterStatus !== 'all'
                  ? 'Pas de filter aan of maak een nieuwe taak'
                  : 'Maak je eerste taak aan om je werk te organiseren'
              }
              action={
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 rounded-xl font-medium transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Taak Toevoegen
                </button>
              }
            />
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 border-l-4 transition-all hover:bg-slate-800/70 ${
                  task.priority === 'high' ? 'border-l-red-500' :
                  task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-slate-500'
                } ${deletingId === task.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[task.category]}`}>{categoryLabels[task.category]}</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {getLeadName(task.leadId)}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        disabled={updatingId === task.id}
                        className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 hover:scale-110 transition-all disabled:opacity-50"
                        title="Start"
                      >
                        {updatingId === task.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        disabled={updatingId === task.id}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 hover:scale-110 transition-all disabled:opacity-50"
                        title="Klaar"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      disabled={deletingId === task.id}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 hover:scale-110 transition-all disabled:opacity-50"
                      title="Verwijder"
                    >
                      {deletingId === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Modal */}
        {showAddForm && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all"
            onClick={(e) => e.target === e.currentTarget && setShowAddForm(false)}
          >
            <div className="bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-700 shadow-2xl">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-400" />
                  Nieuwe Taak
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Lead *</label>
                  <select
                    value={newTask.leadId}
                    onChange={(e) => setNewTask({...newTask, leadId: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    <option value={0}>Selecteer lead...</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.company || 'Geen bedrijf'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Titel *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Taak titel"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Beschrijving</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none h-20"
                    placeholder="Beschrijving"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Categorie</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value as Task['category']})}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      {Object.entries(categoryLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Prioriteit</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="high">Hoog</option>
                      <option value="medium">Medium</option>
                      <option value="low">Laag</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={createTask}
                  disabled={!newTask.title || !newTask.leadId}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  Taak Aanmaken
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}