'use client'

import { useState } from 'react'

interface ScanResult {
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
}

export default function SEOScanner() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScanResult | null>(null)

  const scanWebsite = async () => {
    if (!url) return
    setLoading(true)
    
    // Simulate API call - in production this would call our backend
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock results for demo
    setResults({
      score: 67,
      score_breakdown: {
        title: 80,
        meta: 60,
        headings: 70,
        images: 50,
        speed: 65,
        mobile: 75
      },
      issues: [
        {
          severity: 'high',
          message: 'Meta description ontbreekt',
          recommendation: 'Voeg een meta description van 150-160 tekens toe'
        },
        {
          severity: 'high',
          message: 'Geen SSL certificaat gedetecteerd',
          recommendation: 'Installeer een SSL certificaat voor veilige verbinding'
        },
        {
          severity: 'medium',
          message: 'Afbeeldingen missen alt-tekst',
          recommendation: 'Voeg alt-tekst toe aan alle afbeeldingen'
        },
        {
          severity: 'medium',
          message: 'Pagina laadt langzaam',
          recommendation: 'Comprimeer afbeeldingen en gebruik browser caching'
        },
        {
          severity: 'low',
          message: 'Geen structured data gevonden',
          recommendation: 'Voeg Schema.org markup toe voor zoekmachines'
        }
      ]
    })
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-700 border-red-200'
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔍 SEO Scanner</h1>
          <p className="text-slate-400">Analyseer een website en krijg direct verbeterpunten</p>
        </div>

        {/* URL Input */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://voorbeeld.nl"
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
            />
            <button
              onClick={scanWebsite}
              disabled={loading || !url}
              className="px-6 py-3 bg-violet-600 rounded-xl font-semibold hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? 'Scannen...' : 'Scan nu'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
              <div className={`text-8xl font-black mb-2 ${getScoreColor(results.score)}`}>
                {results.score}
              </div>
              <div className="text-slate-400">SEO Score</div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(results.score_breakdown).map(([key, value]) => (
                <div key={key} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}%</div>
                  <div className="text-sm text-slate-400 capitalize">{key}</div>
                </div>
              ))}
            </div>

            {/* Issues */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Gevonden Problemen</h2>
              <div className="space-y-3">
                {results.issues.map((issue, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${getSeverityColor(issue.severity)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold capitalize">{issue.severity}</span>
                      <span>—</span>
                      <span>{issue.message}</span>
                    </div>
                    <div className="text-sm opacity-80">💡 {issue.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Wil je dat wij dit oplossen?</h3>
              <p className="text-white/80 mb-4">Wij verbeteren je SEO en zorgen dat je hoger rankt in Google</p>
              <a href="/#contact" className="inline-block bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
                Vraag gratis analyse aan
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
