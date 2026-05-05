'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

// Shared global toast state - single source of truth
let toastListeners: ((toasts: Toast[]) => void)[] = []
let globalToasts: Toast[] = []

function notifyListeners() {
  toastListeners.forEach(listener => listener([...globalToasts]))
}

function addToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const toast: Toast = { id: Date.now(), message, type }
  globalToasts = [...globalToasts, toast]
  notifyListeners()
  
  // Auto remove after 3.5 seconds
  setTimeout(() => {
    globalToasts = globalToasts.filter(t => t.id !== toast.id)
    notifyListeners()
  }, 3500)
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  addToast(message, type)
}

export async function copyWithToast(text: string, successMessage: string = 'Gekopieerd!') {
  try {
    await navigator.clipboard.writeText(text)
    addToast(successMessage, 'success')
    return true
  } catch {
    addToast('Kon niet kopiëren', 'error')
    return false
  }
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  useEffect(() => {
    toastListeners.push(setToasts)
    setToasts([...globalToasts])
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts)
    }
  }, [])

  const removeToast = useCallback((id: number) => {
    globalToasts = globalToasts.filter(t => t.id !== id)
    notifyListeners()
  }, [])

  return { toasts, removeToast }
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const styles = {
    success: {
      bg: 'bg-emerald-600',
      border: 'border-emerald-500/30',
      icon: CheckCircle,
      iconColor: 'text-emerald-200'
    },
    error: {
      bg: 'bg-red-600',
      border: 'border-red-500/30',
      icon: AlertCircle,
      iconColor: 'text-red-200'
    },
    info: {
      bg: 'bg-violet-600',
      border: 'border-violet-500/30',
      icon: Info,
      iconColor: 'text-violet-200'
    }
  }
  
  const style = styles[toast.type]
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        ${style.bg} text-white px-4 py-3 rounded-xl shadow-2xl 
        border ${style.border} flex items-center gap-3 
        min-w-[200px] max-w-sm
      `}
    >
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
      <span className="font-medium text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/60 hover:text-white transition flex-shrink-0 p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}