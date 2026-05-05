'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface ToastData {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastItemProps {
  toast: ToastData
  onRemove: (id: number) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-violet-600'
  }[toast.type] || 'bg-violet-600'

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[toast.type] || 'ℹ'

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div 
      className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[200px] animate-slide-in`}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
        {icon}
      </span>
      <span className="font-medium">{toast.message}</span>
    </div>
  )
}

// Global toast state
let toastListeners: ((toasts: ToastData[]) => void)[] = []
let globalToasts: ToastData[] = []

function notifyListeners() {
  toastListeners.forEach(listener => listener([...globalToasts]))
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const toast: ToastData = { id: Date.now(), message, type }
  globalToasts = [...globalToasts, toast]
  notifyListeners()
  
  // Also set on window for backwards compatibility
  if (typeof window !== 'undefined') {
    (window as any).showToast = (msg: string, t: string) => showToast(msg, t as any)
  }
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    globalToasts = globalToasts.filter(t => t.id !== toast.id)
    notifyListeners()
  }, 3000)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const counterRef = useRef(0)

  useEffect(() => {
    // Add listener
    toastListeners.push(setToasts)
    
    // Initialize with current state
    setToasts([...globalToasts])
    
    // Set global window function
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast
    }
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts)
    }
  }, [])

  const removeToast = useCallback((id: number) => {
    globalToasts = globalToasts.filter(t => t.id !== id)
    notifyListeners()
  }, [])

  return { toasts, showToast, removeToast }
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div 
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2"
      style={{
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'hidden'
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

export async function copyWithToast(text: string, successMessage: string = 'Gekopieerd!') {
  try {
    await navigator.clipboard.writeText(text)
    showToast(successMessage, 'success')
    return true
  } catch {
    showToast('Kon niet kopiëren', 'error')
    return false
  }
}
