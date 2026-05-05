'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'skeleton'
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }
  
  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Preset skeleton components for common patterns
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton width={64} height={24} />
            <Skeleton width={160} height={24} />
          </div>
          <div className="flex flex-wrap gap-4">
            <Skeleton width={128} height={16} />
            <Skeleton width={96} height={16} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton width={96} height={24} />
            <Skeleton width={128} height={24} />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton width={40} height={40} />
          <Skeleton width={40} height={40} />
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
      <Skeleton width={120} height={20} />
      <div className="space-y-3">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            <Skeleton width={80} height={14} className="mb-2" />
            <Skeleton height={48} />
          </div>
        ))}
      </div>
      <Skeleton height={48} className="mt-6" />
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="border-b border-slate-700 p-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} height={16} className="flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-slate-700/50 last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <Skeleton key={colIndex} height={16} className="flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <Skeleton width={48} height={32} className="mb-2" />
      <Skeleton width={80} height={16} />
    </div>
  )
}

export function LeadFinderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function EmailSkeleton() {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1">
          <Skeleton width={120} height={18} className="mb-2" />
          <Skeleton width={80} height={14} />
        </div>
        <Skeleton width={80} height={36} />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={64} height={64} />
        <div className="space-y-2">
          <Skeleton width={160} height={24} />
          <Skeleton width={120} height={16} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
      </div>
    </div>
  )
}