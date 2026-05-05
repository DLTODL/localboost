'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return { showToast: () => {} }
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
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
        min-w-[200px] max-w-sm pointer-events-auto
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