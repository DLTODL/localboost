'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, Plus, Clock, AlertTriangle, Trash2, 
  Filter, ChevronDown, Calendar, User, Target, 
  CheckCircle, XCircle, Edit2, Save, X, Play, Pause
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

const priorityColors: Record<string, string> = {
  'high': 'border-l-red-500',
  'medium': 'border-l-yellow-500',
  'low': 'border-l-slate-500'
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
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    leadId: 0,
    title: '',
    description: '',
    category: 'setup' as Task['category'],
    priority: 'medium' as Task['priority'],
    dueDate: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

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
      console.error('Error fetching data:', error)
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
      const data = await res.json()
      if (data.success) {
        fetchData()
        setShowAddForm(false)
        setNewTask({
          leadId: 0,
          title: '',
          description: '',
          category: 'setup',
          priority: 'medium',
          dueDate: ''
        })
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchData()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const generateTasksForLead = async (leadId: number, service: string) => {
    if (!confirm(`Generate tasks for this lead's service (${service})?`)) return
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, generateForService: service })
      })
      const data = await res.json()
      if (data.success) {
        alert(`Generated ${data.tasks?.length || 0} tasks!`)
        fetchData()
      }
    } catch (error) {
      console.error('Error generating tasks:', error)
    }
  }

  const getLeadName = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId)
    return lead ? lead.name : `Lead #${leadId}`
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
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-violet-400" />
              Task Manager
            </h1>
            <p className="text-slate-400 mt-1">Manage tasks for each lead and service delivery</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, emoji: '📋' },
            { label: 'Pending', value: stats.pending, emoji: '⏳' },
            { label: 'In Progress', value: stats.inProgress, emoji: '🔄' },
            { label: 'Done', value: stats.completed, emoji: '✅' },
            { label: 'High Priority', value: stats.highPriority, emoji: '🚨' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400 text-sm">Filter:</span>
            </div>
            <select
              value={filterLead}
              onChange={(e) => setFilterLead(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <option value="all">All Leads</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {(filterLead !== 'all' || filterStatus !== 'all' || filterCategory !== 'all') && (
              <button
                onClick={() => { setFilterLead('all'); setFilterStatus('all'); setFilterCategory('all') }}
                className="px-3 py-2 text-sm text-slate-400 hover:text-white"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
              No tasks found. Create one or generate tasks for a lead!
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-slate-800 rounded-xl p-4 border border-slate-700 border-l-4 ${priorityColors[task.priority]} hover:bg-slate-750 transition`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[task.category]}`}>
                        {categoryLabels[task.category]}
                      </span>
                      {task.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-600/20 text-red-300 rounded text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> High
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {getLeadName(task.leadId)}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                        </span>
                      )}
                      <span>Created: {new Date(task.createdAt).toLocaleDateString('nl-NL')}</span>
                      {task.completedAt && (
                        <span className="text-green-400">
                          Completed: {new Date(task.completedAt).toLocaleDateString('nl-NL')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30"
                        title="Start Task"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                        title="Complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {task.status === 'pending' || task.status === 'in-progress' ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30"
                        title="Mark Complete"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Task Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-lg w-full">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Lead</label>
                  <select
                    value={newTask.leadId}
                    onChange={(e) => setNewTask({ ...newTask, leadId: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                  >
                    <option value={0}>Select a lead</option>
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name} ({lead.company || 'No company'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg h-24"
                    placeholder="Task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task['category'] })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Due Date (optional)</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
                  />
                </div>
                <button
                  onClick={createTask}
                  disabled={!newTask.title || !newTask.leadId}
                  className="w-full py-3 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700 transition disabled:opacity-50"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}