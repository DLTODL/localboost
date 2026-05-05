'use client'

import { useState, useEffect, useCallback } from 'react'

interface ToastData {
  message: string
  type: 'success' | 'error' | 'info'
}

declare global {
  interface Window {
    showToast?: (message: string, type?: string) => void
  }
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    window.showToast = showToast as (message: string, type?: string) => void
  }, [showToast])

  return { toast, showToast }
}

export function ToastContainer() {
  const { toast } = useToast()

  if (!toast) return null

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-violet-600'
  }[toast.type]

  return (
    <div 
      className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl z-[100] font-medium`}
    >
      {toast.message}
    </div>
  )
}

export async function copyWithToast(text: string, successMessage: string = 'Gekopieerd!') {
  try {
    await navigator.clipboard.writeText(text)
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(successMessage, 'success')
    }
    return true
  } catch {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast('Kon niet kopiëren', 'error')
    }
    return false
  }
}
