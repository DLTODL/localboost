'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Euro, Users, Target, Calculator, RefreshCw, Save, Copy, Check, BarChart3, PieChart, ArrowRight, Info } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useTemplates, copyWithToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'

interface ROIInputs {
  monthlySpend: number
  expectedLeads: number
  leadConversionRate: number
  averageDealValue: number
  customerLifetimeValue: number
  campaignMonths: number
  industry: string
}

interface ROIResults {
  totalLeads: number
  totalConversions: number
  totalRevenue: number
  totalCost: number
  netProfit: number
  roi: number
  paybackMonths: number
  cpl: number
  cpo: number
  breakEvenLeads: number
  monthlyProjections: MonthlyProjection[]
}

interface MonthlyProjection {
  month: number
  leads: number
  conversions: number
  revenue: number
  costs: number
  profit: number
  cumulativeProfit: number
}

const industryBenchmarks: Record<string, { avgCPL: number, avgConvRate: number, avgDealValue: number }> = {
  'Restaurant/Café': { avgCPL: 8, avgConvRate: 5, avgDealValue: 45 },
  'Salon/Schoonheid': { avgCPL: 12, avgConvRate: 8, avgDealValue: 85 },
  'Auto Werkplaats': { avgCPL: 18, avgConvRate: 6, avgDealValue: 350 },
  'Loodgieter': { avgCPL: 25, avgConvRate: 10, avgDealValue: 250 },
  'Elektricien': { avgCPL: 28, avgConvRate: 9, avgDealValue: 220 },
  'Timmerman': { avgCPL: 22, avgConvRate: 7, avgDealValue: 1800 },
  'Makelaar': { avgCPL: 80, avgConvRate: 4, avgDealValue: 8000 },
  'Tandarts': { avgCPL: 35, avgConvRate: 12, avgDealValue: 500 },
  'Fysiotherapie': { avgCPL: 20, avgConvRate: 10, avgDealValue: 120 },
  'Winkel': { avgCPL: 10, avgConvRate: 4, avgDealValue: 75 },
  default: { avgCPL: 15, avgConvRate: 7, avgDealValue: 200 }
}

const industries = Object.keys(industryBenchmarks)

function NumberInput({ label, value, onChange, min = 0, max, step = 1, prefix = '', suffix = '', hint }: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{prefix}</span>}
        <input
          type="number"
          value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{suffix}</span>}
      </div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, sub, color, help }: {
  icon: any
  label: string
  value: string
  sub?: string
  color: string
  help?: string
}) {
  return (
    <div className={`bg-slate-800 rounded-xl p-4 border ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        {help && (
          <div className="group relative">
            <Info className="w-4 h-4 text-slate-500 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 bg-slate-700 text-white text-xs rounded-lg p-2 z-10">
              {help}
            </div>
          </div>
        )}
      </div>
      <div className="text-2xl font-black mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function calculateROI(inputs: ROIInputs): ROIResults {
  const { monthlySpend, expectedLeads, leadConversionRate, averageDealValue, customerLifetimeValue, campaignMonths } = inputs

  const totalLeads = expectedLeads * campaignMonths
  const totalConversions = Math.floor(totalLeads * (leadConversionRate / 100))
  const totalRevenue = totalConversions * averageDealValue
  const totalCost = monthlySpend * campaignMonths
  const netProfit = totalRevenue - totalCost
  const roi = totalCost > 0 ? ((netProfit / totalCost) * 100) : 0
  const cpl = expectedLeads > 0 ? monthlySpend / expectedLeads : 0
  const cpo = totalLeads > 0 ? totalCost / totalLeads : 0
  const breakEvenLeads = averageDealValue > 0 ? Math.ceil(totalCost / averageDealValue) : 0

  const avgMonthlyConv = (totalLeads / campaignMonths) * (leadConversionRate / 100)
  const paybackMonths = avgMonthlyConv > 0 ? totalCost / (avgMonthlyConv * averageDealValue) : 0

  // Monthly projections
  const monthlyProjections: MonthlyProjection[] = []
  let cumulativeProfit = 0

  for (let m = 1; m <= campaignMonths; m++) {
    const monthLeads = expectedLeads
    const monthConversions = Math.floor(monthLeads * (leadConversionRate / 100))
    const monthRevenue = monthConversions * averageDealValue
    const monthCost = monthlySpend
    const monthProfit = monthRevenue - monthCost
    cumulativeProfit += monthProfit

    monthlyProjections.push({
      month: m,
      leads: monthLeads,
      conversions: monthConversions,
      revenue: monthRevenue,
      costs: monthCost,
      profit: monthProfit,
      cumulativeProfit
    })
  }

  return { totalLeads, totalConversions, totalRevenue, totalCost, netProfit, roi, paybackMonths, cpl, cpo, breakEvenLeads, monthlyProjections }
}

export default function ROICalculator() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('roi-calculator')
  const { saveTemplate, getTemplatesForTool } = useTemplates()

  const savedTemplates = getTemplatesForTool('roi-calculator')

  const [formData, setFormData] = useState<ROIInputs>({
    monthlySpend: inputs.monthlySpend || 500,
    expectedLeads: inputs.expectedLeads || 50,
    leadConversionRate: inputs.leadConversionRate || 7,
    averageDealValue: inputs.averageDealValue || 200,
    customerLifetimeValue: inputs.customerLifetimeValue || 500,
    campaignMonths: inputs.campaignMonths || 6,
    industry: inputs.industry || ''
  })

  const [results, setResults] = useState<ROIResults | null>(null)
  const [showBenchmark, setShowBenchmark] = useState(false)

  // Pre-fill from profile
  useEffect(() => {
    if (profile?.type && !inputs.industry) {
      const matched = industries.find(i => i.toLowerCase().includes(profile.type.toLowerCase()))
      if (matched) setFormData(prev => ({ ...prev, industry: matched }))
    }
  }, [profile, inputs.industry])

  const updateField = (field: keyof ROIInputs, value: number | string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const applyBenchmark = () => {
    const bench = industryBenchmarks[formData.industry] || industryBenchmarks.default
    setFormData(prev => ({
      ...prev,
      expectedLeads: Math.round(prev.monthlySpend / bench.avgCPL),
      leadConversionRate: bench.avgConvRate,
      averageDealValue: bench.avgDealValue
    }))
    setShowBenchmark(false)
  }

  const calculate = () => {
    const res = calculateROI(formData)
    setResults(res)
    saveInputs(formData)
  }

  const handleCopyResults = async () => {
    if (!results) return
    const text = `ROI Analyse - ${formData.industry || 'Marketing Campagne'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Investering: €${formData.monthlySpend}/maand × ${formData.campaignMonths} maanden = €${results.totalCost}
Verwachte leads: ${results.totalLeads} (${results.cpl.toFixed(2)} CPL)
Verwachte conversies: ${results.totalConversions} (${formData.leadConversionRate}%)
Gemiddelde deal waarde: €${formData.averageDealValue}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Totale omzet: €${results.totalRevenue.toFixed(2)}
Totale kosten: €${results.totalCost.toFixed(2)}
Nettowinst: €${results.netProfit.toFixed(2)}
ROI: ${results.roi.toFixed(1)}%
Payback: ${results.paybackMonths.toFixed(1)} maanden`
    await copyWithToast(text, 'ROI Analyse gekopieerd!')
  }

  const resetForm = () => {
    setFormData({
      monthlySpend: 500,
      expectedLeads: 50,
      leadConversionRate: 7,
      averageDealValue: 200,
      customerLifetimeValue: 500,
      campaignMonths: 6,
      industry: ''
    })
    setResults(null)
  }

  const roiColor = results ? (results.roi >= 100 ? 'border-emerald-500/30' : results.roi >= 0 ? 'border-yellow-500/30' : 'border-red-500/30') : 'border-slate-700'
  const roiTextColor = results ? (results.roi >= 100 ? 'text-emerald-400' : results.roi >= 0 ? 'text-yellow-400' : 'text-red-400') : ''

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📈</span>
              <div>
                <h1 className="text-3xl font-black">ROI Calculator</h1>
                <p className="text-slate-400">Bereken het rendement van je marketing investering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TemplateSwitcher
                toolId="roi-calculator"
                onApply={(data) => {
                  const updates: Partial<ROIInputs> = {}
                  if (data.monthlySpend) updates.monthlySpend = data.monthlySpend
                  if (data.expectedLeads) updates.expectedLeads = data.expectedLeads
                  if (data.leadConversionRate) updates.leadConversionRate = data.leadConversionRate
                  if (data.averageDealValue) updates.averageDealValue = data.averageDealValue
                  if (data.campaignMonths) updates.campaignMonths = data.campaignMonths
                  if (data.industry) updates.industry = data.industry
                  setFormData(prev => ({ ...prev, ...updates }))
                }}
                currentData={formData}
              />
            </div>
          </div>
        </div>

        {!results ? (
          <>
            {/* Input Form */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-violet-400" />
                  Campagne Instellingen
                </h2>
                <select
                  value={formData.industry}
                  onChange={e => updateField('industry', e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm"
                >
                  <option value="">Selecteer branche...</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {formData.industry && (
                <div className="mb-4 bg-violet-600/20 border border-violet-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-violet-300 font-medium">Benchmarks voor {formData.industry}:</span>
                    <span className="text-slate-400 ml-2">
                      CPL €{industryBenchmarks[formData.industry].avgCPL} | Conv {industryBenchmarks[formData.industry].avgConvRate}% | Deal €{industryBenchmarks[formData.industry].avgDealValue}
                    </span>
                  </div>
                  <button
                    onClick={applyBenchmark}
                    className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition flex-shrink-0 ml-3"
                  >
                    Pas toe
                  </button>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <NumberInput
                  label="Maandelijkse Investering"
                  value={formData.monthlySpend}
                  onChange={v => updateField('monthlySpend', v)}
                  prefix="€"
                  hint="Je maandelijkse marketing budget"
                />
                <NumberInput
                  label="Verwachte Leads per Maand"
                  value={formData.expectedLeads}
                  onChange={v => updateField('expectedLeads', v)}
                  hint="Aantal nieuwe leads per maand"
                />
                <NumberInput
                  label="Conversie Rate (%)"
                  value={formData.leadConversionRate}
                  onChange={v => updateField('leadConversionRate', v)}
                  min={0.1}
                  max={100}
                  step={0.1}
                  suffix="%"
                  hint="Percentage leads dat klant wordt"
                />
                <NumberInput
                  label="Gemiddelde Deal Waarde (€)"
                  value={formData.averageDealValue}
                  onChange={v => updateField('averageDealValue', v)}
                  prefix="€"
                  hint="Gemiddeld order/klant waarde"
                />
                <NumberInput
                  label="Customer Lifetime Value (€)"
                  value={formData.customerLifetimeValue}
                  onChange={v => updateField('customerLifetimeValue', v)}
                  prefix="€"
                  hint="Totale waarde klant over tijd (optioneel)"
                />
                <NumberInput
                  label="Campagne Duur (maanden)"
                  value={formData.campaignMonths}
                  onChange={v => updateField('campaignMonths', v)}
                  min={1}
                  max={60}
                  hint="Hoe lang draait de campagne"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculate}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition"
            >
              <Calculator className="w-6 h-6" />
              Bereken ROI
            </button>
          </>
        ) : (
          <>
            {/* Results Summary */}
            <div className={`bg-slate-800 rounded-2xl p-6 mb-6 border-2 ${roiColor}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  ROI Analyse Resultaten
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyResults}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                  >
                    <Copy className="w-4 h-4" />
                    Kopieer
                  </button>
                  <button
                    onClick={() => setResults(null)}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Opnieuw
                  </button>
                </div>
              </div>

              {/* Hero Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                  <div className={`text-4xl font-black mb-1 ${roiTextColor}`}>
                    {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(0)}%
                  </div>
                  <div className="text-sm text-slate-400">ROI</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                  <div className={`text-4xl font-black mb-1 ${results.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {results.netProfit >= 0 ? '+' : ''}€{Math.abs(results.netProfit).toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-400">Nettowinst</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                  <div className="text-4xl font-black text-white mb-1">{results.paybackMonths.toFixed(1)}</div>
                  <div className="text-sm text-slate-400">Payback (mnd)</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                  <div className="text-4xl font-black text-white mb-1">€{results.cpl.toFixed(2)}</div>
                  <div className="text-sm text-slate-400">Kosten/Lead</div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid md:grid-cols-4 gap-3">
                <MetricCard
                  icon={Target}
                  label="Totale Leads"
                  value={results.totalLeads.toString()}
                  sub={`${results.cpl.toFixed(2)} CPL`}
                  color="border-slate-700"
                  help="Totaal aantal leads over de hele campagne"
                />
                <MetricCard
                  icon={Users}
                  label="Conversies"
                  value={results.totalConversions.toString()}
                  sub={`${formData.leadConversionRate}% conversie`}
                  color="border-slate-700"
                  help="Verwachte aantal nieuwe klanten"
                />
                <MetricCard
                  icon={Euro}
                  label="Totale Omzet"
                  value={`€${(results.totalRevenue / 1000).toFixed(1)}K`}
                  sub={`€${formData.averageDealValue}/deal`}
                  color="border-slate-700"
                />
                <MetricCard
                  icon={TrendingDown}
                  label="Totale Kosten"
                  value={`€${(results.totalCost / 1000).toFixed(1)}K`}
                  sub={`€${formData.monthlySpend}/maand`}
                  color="border-slate-700"
                />
              </div>
            </div>

            {/* Break-Even & Payback */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-400" />
                Break-Even Analyse
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-2">Break-Even Leads</div>
                  <div className="text-3xl font-black text-white">{results.breakEvenLeads}</div>
                  <div className="text-xs text-slate-500 mt-1">leads nodig om kosten te dekken</div>
                  <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${Math.min(100, (results.totalConversions / Math.max(1, results.breakEvenLeads)) * 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{results.totalConversions} van {results.breakEvenLeads} leads → break-even</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-sm text-slate-400 mb-2">Kosten per Order</div>
                  <div className="text-3xl font-black text-white">€{results.cpo.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-1">gemiddelde kosten per conversie</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${results.cpo <= formData.averageDealValue ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, (results.cpo / formData.averageDealValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Deal waarde: €{formData.averageDealValue}</div>
                </div>
              </div>
            </div>

            {/* Monthly Projections */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Maandelijkse Projecties
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-400 font-medium">Maand</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Leads</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Conv.</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Omzet</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Kosten</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Winst</th>
                      <th className="text-right py-2 text-slate-400 font-medium">Cumulatief</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.monthlyProjections.map(pm => (
                      <tr key={pm.month} className="border-b border-slate-700/50">
                        <td className="py-2.5 font-medium">Maand {pm.month}</td>
                        <td className="py-2.5 text-right text-slate-300">{pm.leads}</td>
                        <td className="py-2.5 text-right text-slate-300">{pm.conversions}</td>
                        <td className="py-2.5 text-right text-emerald-400">€{pm.revenue.toFixed(0)}</td>
                        <td className="py-2.5 text-right text-red-400">€{pm.costs.toFixed(0)}</td>
                        <td className={`py-2.5 text-right font-medium ${pm.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pm.profit >= 0 ? '+' : ''}€{pm.profit.toFixed(0)}
                        </td>
                        <td className={`py-2.5 text-right font-bold ${pm.cumulativeProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pm.cumulativeProfit >= 0 ? '+' : ''}€{pm.cumulativeProfit.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verdict */}
            <div className={`rounded-2xl p-6 border ${results.roi >= 100 ? 'bg-emerald-500/10 border-emerald-500/30' : results.roi >= 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${results.roi >= 100 ? 'bg-emerald-500/20' : results.roi >= 0 ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
                  {results.roi >= 100 ? (
                    <TrendingUp className={`w-6 h-6 ${results.roi >= 100 ? 'text-emerald-400' : ''}`} />
                  ) : results.roi >= 0 ? (
                    <BarChart3 className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${results.roi >= 100 ? 'text-emerald-400' : results.roi >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {results.roi >= 100 ? 'Uitstekende Investering!' : results.roi >= 0 ? 'Positief Rendement Verwacht' : 'Negatief Rendement - Heroverwegen'}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {results.roi >= 100
                      ? `Met een ROI van ${results.roi.toFixed(0)}% is deze campagne zeer rendabel. Je investeert €${results.totalCost.toFixed(0)} en verwacht €${Math.abs(results.netProfit).toFixed(0)} winst te maken over ${formData.campaignMonths} maanden. Break-even na ${results.paybackMonths.toFixed(1)} maanden.`
                      : results.roi >= 0
                      ? `Deze campagne heeft een positief maar beperkt rendement. Overweeg je CPL te verlagen of conversie rate te verhogen voor betere resultaten.`
                      : `Deze campagne kost meer dan het oplevert. Heroverweeg de instellingen: hogere conversie rate, lagere CPL of hogere deal waarden nodig.`}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
