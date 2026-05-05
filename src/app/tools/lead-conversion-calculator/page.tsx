'use client'

import { useState } from 'react'
import { TrendingUp, Users, DollarSign, Target, ArrowDown, Loader2, Check, AlertCircle } from 'lucide-react'
import { copyWithToast } from '@/lib/useSharedData'

interface FunnelData {
  monthlyLeads: number
  websiteVisitors: number
  currentRate: number
  avgDealValue: number
  salesCycle: string
  industry: string
}

interface ConversionMetrics {
  stage: string
  fromLeads: number
  toLeads: number
  rate: number
  color: string
}

interface ROIOutput {
  metric: string
  current: string
  potential: string
  improvement: string
  icon: string
}

export default function LeadConversionCalculator() {
  const [formData, setFormData] = useState<FunnelData>({
    monthlyLeads: 50,
    websiteVisitors: 1000,
    currentRate: 2,
    avgDealValue: 500,
    salesCycle: '1-2 weken',
    industry: ''
  })
  const [results, setResults] = useState<{
    funnel: ConversionMetrics[]
    roi: ROIOutput[]
    totalPotential: number
    improvement: number
  } | null>(null)
  const [calculating, setCalculating] = useState(false)

  const industries = [
    'Loodgieter', 'Elektricien', 'Restaurant', 'Salon', 'Makelaar',
    'Tandarts', 'Fysiotherapie', 'Auto Werkplaats', 'Schilder', 'Overig'
  ]

  const calculateFunnel = () => {
    setCalculating(true)
    
    setTimeout(() => {
      const { monthlyLeads, websiteVisitors, currentRate, avgDealValue } = formData
      
      // Calculate conversion rates based on industry benchmarks
      const industryMultipliers: Record<string, number> = {
        restaurant: 1.2,
        salon: 1.5,
        loodgieter: 2.0,
        elektricien: 2.0,
        makelaar: 0.8,
        tandarts: 1.3,
        fysiotherapie: 1.4,
        auto: 1.1,
        schilder: 1.6,
        overig: 1.0
      }
      
      const multiplier = industryMultipliers[formData.industry.toLowerCase()] || 1.0
      
      // Funnel stages
      const visitors = websiteVisitors
      const websiteLeads = Math.round(visitors * (0.05 * multiplier)) // 5% becomes lead
      const qualifiedLeads = Math.round(websiteLeads * 0.4) // 40% qualified
      const proposals = Math.round(qualifiedLeads * 0.5) // 50% gets proposal
      const deals = Math.round(proposals * (currentRate / 100)) // current close rate
      const lostDeals = proposals - deals
      
      const funnel: ConversionMetrics[] = [
        { stage: 'Website Bezoekers', fromLeads: visitors, toLeads: websiteLeads, rate: 5 * multiplier, color: 'from-blue-500 to-cyan-500' },
        { stage: 'Eerste Contact', fromLeads: websiteLeads, toLeads: qualifiedLeads, rate: 40, color: 'from-violet-500 to-purple-500' },
        { stage: 'Offerte Gestuurd', fromLeads: qualifiedLeads, toLeads: proposals, rate: 50, color: 'from-amber-500 to-orange-500' },
        { stage: ' Gewonnen', fromLeads: proposals, toLeads: deals, rate: currentRate, color: 'from-green-500 to-emerald-500' }
      ]
      
      // Calculate current vs potential
      const currentRevenue = deals * avgDealValue
      const improvedDeals = Math.round(proposals * 0.15) // 15% improvement in close rate
      const potentialRevenue = (deals + improvedDeals) * avgDealValue
      
      const roi: ROIOutput[] = [
        {
          metric: 'Maandelijkse Omzet',
          current: `€${currentRevenue.toLocaleString()}`,
          potential: `€${potentialRevenue.toLocaleString()}`,
          improvement: `${Math.round((improvedDeals / deals) * 100)}% meer deals`,
          icon: '💰'
        },
        {
          metric: 'Reactierate Website',
          current: `${(5 * multiplier).toFixed(1)}%`,
          potential: `${(7 * multiplier).toFixed(1)}%`,
          improvement: '40% stijging mogelijk',
          icon: '📊'
        },
        {
          metric: 'Sluitpercentage',
          current: `${currentRate}%`,
          potential: `${currentRate + 8}%`,
          improvement: 'Professionele opvolging',
          icon: '🎯'
        },
        {
          metric: 'Gemiddelde Deal Waarde',
          current: `€${avgDealValue}`,
          potential: `€${Math.round(avgDealValue * 1.2)}`,
          improvement: '20% verhoging mogelijk',
          icon: '📈'
        }
      ]
      
      setResults({
        funnel,
        roi,
        totalPotential: potentialRevenue - currentRevenue,
        improvement: Math.round((improvedDeals / deals) * 100)
      })
      
      setCalculating(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📊</span>
            <h1 className="text-3xl font-black">Lead Conversion Calculator</h1>
          </div>
          <p className="text-slate-400">Zie precies waar je leads blijven steken en hoe je meer kunt sluiten</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-violet-400" />
                Jouw Branch
              </h2>
              <select
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="">Selecteer branche...</option>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Verkeer & Leads
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website bezoekers/maand</label>
                  <input
                    type="number"
                    value={formData.websiteVisitors}
                    onChange={(e) => setFormData(prev => ({ ...prev, websiteVisitors: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nieuwe leads/maand</label>
                  <input
                    type="number"
                    value={formData.monthlyLeads}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyLeads: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Huidige Prestaties
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Huidige sluippercentage (%)</label>
                  <input
                    type="number"
                    value={formData.currentRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Gemiddeld in Nederland: 5-8%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Gemiddelde deal waarde (€)</label>
                  <input
                    type="number"
                    value={formData.avgDealValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, avgDealValue: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateFunnel}
              disabled={calculating || !formData.industry}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyseren...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Analyseer Mijn Funnel
                </>
              )}
            </button>
          </div>

          {/* Right: Results */}
          <div>
            {results ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-center">
                  <p className="text-green-100 text-sm mb-2">Potentiële Maandelijkse Groei</p>
                  <p className="text-4xl font-black text-white">+€{results.totalPotential.toLocaleString()}</p>
                  <p className="text-green-100 text-sm mt-2">{results.improvement}% meer deals sluiten</p>
                </div>

                {/* Funnel Visualization */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold mb-4">Jouw Conversion Funnel</h3>
                  <div className="space-y-3">
                    {results.funnel.map((stage, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{stage.stage}</span>
                          <span className="text-sm text-slate-400">{stage.toLeads} ({stage.rate}%)</span>
                        </div>
                        <div className="h-8 bg-slate-900 rounded-lg overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-1000 flex items-center justify-end pr-3`}
                            style={{ width: `${Math.min(stage.rate * 10, 100)}%` }}
                          >
                            {index < results.funnel.length - 1 && (
                              <ArrowDown className="w-4 h-4 text-white/50" />
                            )}
                          </div>
                        </div>
                        {index < results.funnel.length - 1 && (
                          <div className="flex items-center gap-2 my-1 text-xs text-slate-500">
                            <AlertCircle className="w-3 h-3" />
                            {Math.round((1 - stage.rate / 100) * results.funnel[index].toLeads)} gaan verloren
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROI Breakdown */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold mb-4">Verbeterpotentieel</h3>
                  <div className="space-y-3">
                    {results.roi.map((item, index) => (
                      <div key={index} className="bg-slate-900 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded">{item.improvement}</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-1">{item.metric}</p>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-slate-500">Nu</p>
                            <p className="font-bold text-red-400">{item.current}</p>
                          </div>
                          <ArrowDown className="w-4 h-4 text-slate-600 rotate-[-90deg]" />
                          <div>
                            <p className="text-xs text-slate-500">Potentieel</p>
                            <p className="font-bold text-green-400">{item.potential}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700 text-center">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Vul je gegevens in om je conversie funnel te analyseren
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
