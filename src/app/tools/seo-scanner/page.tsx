'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Globe, Shield, AlertTriangle, CheckCircle, 
  Clock, Image, Smartphone, ExternalLink, RefreshCw, Zap
} from 'lucide-react'
import { useTemplates, useToolInputs } from '@/lib/useSharedData'
import Link from 'next/link'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'
import { FormSkeleton, CardSkeleton } from '@/components/polish/Skeleton'

interface ScanResult {
  url: string
  statusCode?: number
  score: number
  issues: { severity: 'high' | 'medium' | 'low', message: string, recommendation: string }[]
  score_breakdown: {
    title: number
    meta: number
    headings: number
    images: number
    speed: number
    mobile: number
  }
  summary?: {
    title: string
    metaDesc: string
    h1Count: number
    imageCount: number
    hasSSL: boolean
    hasSchema: boolean
  }
  error?: string
}

export default function SEOScanner() {
  const { saveTemplate, getTemplatesForTool } = useTemplates()
  const savedTemplates = getTemplatesForTool('seo-scanner')
  const { inputs, saveInputs } = useToolInputs('seo-scanner')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Initial load skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Normalize URL: prepend https:// if missing
  const normalizeUrl = (input: string) => {
    let url = input.trim()
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }

  // Pre-fill URL from saved inputs
  useEffect(() => {
    if (inputs.url) setUrl(inputs.url)
  }, [inputs.url])

  // Save URL on change
  useEffect(() => {
    if (url) saveInputs({ url })
  }, [url, saveInputs])

  const scanWebsite = async () => {
    if (!url) return
    const normalizedUrl = normalizeUrl(url)
    setLoading(true)
    setResults(null)
    
    try {
      const res = await fetch('/api/seo-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl })
      })
      const data = await res.json()
      setResults(data)
      setScanHistory(prev => [data, ...prev.slice(0, 4)])
    } catch (error) {
      setResults({
        url: normalizedUrl,
        score: 0,
        error: 'Scan mislukt',
        issues: [{
          severity: 'high',
          message: 'Verbindingsfout',
          recommendation: 'Probeer het later opnieuw'
        }],
        score_breakdown: {
          title: 0, meta: 0, headings: 0, images: 0, speed: 0, mobile: 0
        }
      })
    }
    
    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') scanWebsite()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-600/10'
    if (score >= 60) return 'from-amber-500/20 to-amber-600/10'
    return 'from-red-500/20 to-red-600/10'
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/10 border-red-500/30 text-red-300'
    if (severity === 'medium') return 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    return 'bg-blue-500/10 border-blue-500/30 text-blue-300'
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') return <AlertTriangle className="w-4 h-4" />
    if (severity === 'medium') return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const breakdownItems = results ? [
    { key: 'title', icon: Globe, label: 'Title Tag', value: results.score_breakdown.title },
    { key: 'meta', icon: Search, label: 'Meta Description', value: results.score_breakdown.meta },
    { key: 'headings', icon: AlertTriangle, label: 'Heading Structuur', value: results.score_breakdown.headings },
    { key: 'images', icon: Image, label: 'Afbeeldingen', value: results.score_breakdown.images },
    { key: 'speed', icon: Shield, label: 'SSL & Speed', value: results.score_breakdown.speed },
    { key: 'mobile', icon: Smartphone, label: 'Mobiel', value: results.score_breakdown.mobile },
  ] : []

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      {isInitialLoad ? (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            <div>
              <h1 className="text-3xl font-black">SEO Scanner</h1>
              <p className="text-slate-400">Laden...</p>
            </div>
          </div>
          <FormSkeleton fields={1} />
          <div className="grid lg:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔍</span>
              <div>
                <h1 className="text-3xl font-black">SEO Scanner</h1>
                <p className="text-slate-400">Analyseer een website en krijg direct concrete verbeterpunten</p>
              </div>
            </div>
            <TemplateSwitcher
              toolId="seo-scanner"
              onApply={(data) => {
                if (data.url) setUrl(data.url)
              }}
              currentData={{ url }}
            />
          </div>
        </div>

        {/* URL Input */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://jouwwebsite.nl"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/50 outline-none transition text-white placeholder:text-slate-600"
              />
            </div>
            <button
              onClick={scanWebsite}
              disabled={loading || !url}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Scannen...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Scan Nu
                </>
              )}
            </button>
          </div>
          {results?.error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
              {results.error}
            </div>
          )}
        </div>

        {/* Results */}
        {results && !results.error && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Score */}
            <div className={`bg-gradient-to-br ${getScoreGradient(results.score)} rounded-2xl p-8 border border-slate-700 text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className={`text-8xl font-black mb-2 ${getScoreColor(results.score)}`}>
                  {results.score}
                </div>
                <div className="text-slate-400 text-lg">SEO Score</div>
                {results.statusCode && (
                  <div className="mt-2 text-sm text-slate-500">
                    HTTP {results.statusCode}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {results.summary && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="font-semibold mb-4 text-slate-300">Samenvatting</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-slate-500 mb-1">Titel</div>
                    <div className="text-white truncate">{results.summary.title}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-slate-500 mb-1">H1 Headings</div>
                    <div className="text-white">{results.summary.h1Count}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-slate-500 mb-1">Afbeeldingen</div>
                    <div className="text-white">{results.summary.imageCount}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-slate-500 mb-1">SSL</div>
                    <div className={results.summary.hasSSL ? 'text-emerald-400' : 'text-red-400'}>
                      {results.summary.hasSSL ? 'Beveiligd' : 'Onbeveiligd'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {breakdownItems.map(({ key, icon: Icon, label, value }) => (
                <div key={key} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}%</div>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Issues */}
            {results.issues.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Gevonden Problemen ({results.issues.length})
                </h2>
                <div className="space-y-3">
                  {results.issues.map((issue, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5">{getSeverityIcon(issue.severity)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize">{issue.severity}</span>
                            <span>-</span>
                            <span>{issue.message}</span>
                          </div>
                          <div className="text-sm opacity-80 flex items-start gap-2">
                            <span>Tip:</span>
                            <span>{issue.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Good */}
            {results.issues.length === 0 && results.score >= 80 && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-emerald-300 mb-2">Uitstekend!</h3>
                <p className="text-emerald-300/80">Deze website scoort goed op alle belangrijke SEO punten.</p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-6 border border-violet-500/20 text-center">
              <h3 className="text-xl font-bold mb-2">Wil je dat wij dit oplossen?</h3>
              <p className="text-white/70 mb-4">Wij verbeteren je SEO en zorgen dat je hoger rankt in Google</p>
              <Link 
                href="/#contact" 
                className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Vraag gratis analyse aan
              </Link>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-700 rounded-full animate-spin border-t-violet-500" />
            </div>
            <div className="mt-6 text-slate-400">Website analyseren...</div>
            <div className="mt-2 text-sm text-slate-500">Dit kan even duren afhankelijk van de website</div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-300">Voer een URL in om te scannen</h3>
            <p className="text-slate-500">Krijg een complete SEO-analyse met directe verbeterpunten</p>
          </div>
        )}

        {/* Scan History */}
        {scanHistory.length > 1 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Recente scans</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {scanHistory.map((scan, i) => (
                <button
                  key={i}
                  onClick={() => setResults(scan)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-white">{new URL(scan.url).hostname}</span>
                  <span className={`text-sm font-semibold ${getScoreColor(scan.score)}`}>{scan.score}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
