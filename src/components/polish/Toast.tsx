'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  onRemove: (id: number) => void
}

const toastStyles = {
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

export function Toast({ id, message, type, onRemove }: ToastProps) {
  const style = toastStyles[type]
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
      <span className="font-medium text-sm flex-1">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-white/60 hover:text-white transition flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: { id: number; message: string; type: 'success' | 'error' | 'info' }[]
  onRemove: (id: number) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
