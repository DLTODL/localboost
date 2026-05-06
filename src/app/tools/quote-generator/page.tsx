'use client'

import { useState, useEffect } from 'react'
import { FileText, Copy, Check, Download, Save, RefreshCw, Building, User, Mail, Phone, MapPin, Briefcase, Euro, Clock, Shield, Star, Send, ChevronDown, ChevronUp, Printer } from 'lucide-react'
import { useBusinessProfile, useToolInputs, useSelectedBusiness, useTemplates, copyWithToast, useLeads, showToast } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'

interface QuoteLine {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface QuoteData {
  clientName: string
  clientCompany: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  quoteNumber: string
  validDays: number
  paymentTerms: string
  notes: string
  lines: QuoteLine[]
  discount: number
  taxRate: number
}

const defaultLine: QuoteLine = { description: '', quantity: 1, unitPrice: 0, total: 0 }

const serviceSuggestions = [
  'Website Ontwikkeling',
  'SEO Optimalisatie',
  'Google Ads Setup',
  'Social Media Management',
  'Logo Ontwerp',
  'Huisstijl Pakket',
  'Email Marketing Setup',
  'Online Boeking Systeem',
  'Review Management',
  'Lokaal SEO Pakket',
  'Content Creatie',
  'Video Productie',
  'Onderhoud & Support',
  'Hosting & Domein'
]

const paymentTermsOptions = [
  'Betaling binnen 14 dagen',
  '50% vooruit, 50% bij oplevering',
  'Per factuur na levering',
  'Maandelijkse betaling',
  'Betaling in 3 termijnen'
]

function QuoteSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-slate-700 rounded"></div>
      <div className="h-4 w-full bg-slate-700 rounded"></div>
      <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
      <div className="h-40 bg-slate-700 rounded mt-6"></div>
    </div>
  )
}

export default function QuoteGenerator() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('quote-generator')
  const { business: selectedBusiness } = useSelectedBusiness()
  const { saveTemplate, getTemplatesForTool } = useTemplates()
  const { addLead } = useLeads()

  const savedTemplates = getTemplatesForTool('quote-generator')

  const [quote, setQuote] = useState<QuoteData>({
    clientName: inputs.clientName || '',
    clientCompany: inputs.clientCompany || '',
    clientEmail: inputs.clientEmail || '',
    clientPhone: inputs.clientPhone || '',
    clientAddress: inputs.clientAddress || '',
    quoteNumber: `OFF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    validDays: inputs.validDays || 30,
    paymentTerms: inputs.paymentTerms || paymentTermsOptions[0],
    notes: inputs.notes || '',
    lines: inputs.lines?.length > 0 ? inputs.lines : [{ ...defaultLine }],
    discount: inputs.discount || 0,
    taxRate: 21
  })

  const [generated, setGenerated] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedLine, setExpandedLine] = useState<number | null>(0)
  const [savingToCRM, setSavingToCRM] = useState(false)

  // Pre-fill from profile or selected business
  useEffect(() => {
    if (!inputs.clientName && profile) {
      setQuote(prev => ({
        ...prev,
        clientName: profile.name || '',
        clientEmail: profile.email || '',
        clientPhone: profile.phone || '',
        clientAddress: `${profile.city}`
      }))
    }
    if (!inputs.clientName && selectedBusiness) {
      setQuote(prev => ({
        ...prev,
        clientName: selectedBusiness.name || '',
        clientCompany: selectedBusiness.name || '',
        clientEmail: selectedBusiness.email || '',
        clientPhone: selectedBusiness.phone || '',
        clientAddress: selectedBusiness.address || selectedBusiness.city || ''
      }))
    }
  }, [profile, selectedBusiness, inputs.clientName])

  const subtotal = quote.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0)
  const discountAmount = subtotal * (quote.discount / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (quote.taxRate / 100)
  const grandTotal = afterDiscount + taxAmount

  const updateLine = (index: number, field: keyof QuoteLine, value: string | number) => {
    setQuote(prev => {
      const lines = [...prev.lines]
      lines[index] = { ...lines[index], [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        lines[index].total = lines[index].quantity * lines[index].unitPrice
      }
      return { ...prev, lines }
    })
  }

  const addLine = () => {
    setQuote(prev => ({ ...prev, lines: [...prev.lines, { ...defaultLine }] }))
    setExpandedLine(quote.lines.length)
  }

  const removeLine = (index: number) => {
    if (quote.lines.length === 1) return
    setQuote(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index) }))
  }

  const addServiceSuggestion = (service: string) => {
    const existingIndex = quote.lines.findIndex(l => l.description === service)
    if (existingIndex >= 0) return
    setQuote(prev => ({
      ...prev,
      lines: [...prev.lines, { description: service, quantity: 1, unitPrice: 0, total: 0 }]
    }))
    setExpandedLine(quote.lines.length)
  }

  const handleSaveInputs = () => {
    saveInputs({
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientAddress: quote.clientAddress,
      validDays: quote.validDays,
      paymentTerms: quote.paymentTerms,
      notes: quote.notes,
      lines: quote.lines,
      discount: quote.discount
    })
    showToast('Invoer opgeslagen', 'success')
  }

  const generateQuote = () => {
    if (!quote.clientName || quote.lines.every(l => !l.description)) return
    setGenerated(true)
    saveInputs({
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientAddress: quote.clientAddress,
      validDays: quote.validDays,
      paymentTerms: quote.paymentTerms,
      notes: quote.notes,
      lines: quote.lines,
      discount: quote.discount
    })
  }

  const handleCopyQuote = async () => {
    const text = formatQuoteAsText()
    await copyWithToast(text, 'Offerte gekopieerd!')
  }

  const handleSaveToCRM = () => {
    if (!quote.clientName) return
    setSavingToCRM(true)
    addLead({
      name: quote.clientName,
      company: quote.clientCompany,
      email: quote.clientEmail,
      phone: quote.clientPhone,
      city: quote.clientAddress,
      notes: `Offerte ${quote.quoteNumber}: €${grandTotal.toFixed(2)}\n${quote.lines.filter(l => l.description).map(l => `• ${l.description}: €${l.total.toFixed(2)}`).join('\n')}`,
      status: 'new',
      lastContacted: null,
      industry: quote.lines[0]?.description || ''
    })
    setSavingToCRM(false)
    showToast('Opgeslagen in CRM', 'success')
  }

  const formatQuoteAsText = () => {
    const today = new Date().toLocaleDateString('nl-NL')
    const validUntil = new Date(Date.now() + quote.validDays * 86400000).toLocaleDateString('nl-NL')
    
    let text = `${'='.repeat(50)}\nOFFERTE ${quote.quoteNumber}\n${'='.repeat(50)}\n\n`
    text += `Datum: ${today}\nGeldig tot: ${validUntil}\n\n`
    text += `${'-'.repeat(40)}\nCLIENT\n${'-'.repeat(40)}\n`
    text += `${quote.clientName}\n`
    if (quote.clientCompany) text += `${quote.clientCompany}\n`
    if (quote.clientAddress) text += `${quote.clientAddress}\n`
    if (quote.clientEmail) text += `${quote.clientEmail}\n`
    if (quote.clientPhone) text += `${quote.clientPhone}\n`
    text += `\n${'-'.repeat(40)}\nDIENSTEN\n${'-'.repeat(40)}\n`
    
    quote.lines.filter(l => l.description).forEach((line, i) => {
      text += `${i + 1}. ${line.description}\n`
      text += `   Aantal: ${line.quantity} × €${line.unitPrice.toFixed(2)} = €${line.total.toFixed(2)}\n`
    })
    
    text += `\n${'-'.repeat(40)}\nFINANCIEEL\n${'-'.repeat(40)}\n`
    text += `Subtotaal: €${subtotal.toFixed(2)}\n`
    if (quote.discount > 0) text += `Korting (${quote.discount}%): -€${discountAmount.toFixed(2)}\n`
    text += `BTW (${quote.taxRate}%): €${taxAmount.toFixed(2)}\n`
    text += `${'─'.repeat(30)}\n`
    text += `TOTAAL: €${grandTotal.toFixed(2)}\n`
    text += `${'─'.repeat(30)}\n\n`
    
    text += `Betaalvoorwaarden: ${quote.paymentTerms}\n`
    if (quote.notes) text += `\nOpmerkingen:\n${quote.notes}\n`
    
    text += `\n${'='.repeat(50)}\n`
    if (profile) {
      text += `${profile.name}\n`
      if (profile.email) text += `${profile.email}\n`
      if (profile.phone) text += `${profile.phone}\n`
    }
    
    return text
  }

  const resetForm = () => {
    setQuote({
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      quoteNumber: `OFF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      validDays: 30,
      paymentTerms: paymentTermsOptions[0],
      notes: '',
      lines: [{ ...defaultLine }],
      discount: 0,
      taxRate: 21
    })
    setGenerated(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📋</span>
              <div>
                <h1 className="text-3xl font-black">Quote Generator</h1>
                <p className="text-slate-400">Genereer professionele offertes voor klanten</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TemplateSwitcher
                toolId="quote-generator"
                onApply={(data) => {
                  if (data.clientName) setQuote(prev => ({ ...prev, clientName: data.clientName }))
                  if (data.lines?.length) setQuote(prev => ({ ...prev, lines: data.lines }))
                  if (data.discount !== undefined) setQuote(prev => ({ ...prev, discount: data.discount }))
                }}
                currentData={quote}
              />
              <button
                onClick={handleSaveInputs}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                Opslaan
              </button>
            </div>
          </div>
        </div>

        {!generated ? (
          <>
            {/* Client Info */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-violet-400" />
                Klantgegevens
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Contactpersoon *</label>
                  <input
                    type="text"
                    value={quote.clientName}
                    onChange={e => setQuote(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Naam van de klant"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Bedrijfsnaam</label>
                  <input
                    type="text"
                    value={quote.clientCompany}
                    onChange={e => setQuote(prev => ({ ...prev, clientCompany: e.target.value }))}
                    placeholder="Bedrijfsnaam (optioneel)"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={quote.clientEmail}
                    onChange={e => setQuote(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="email@voorbeeld.nl"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Telefoon</label>
                  <input
                    type="tel"
                    value={quote.clientPhone}
                    onChange={e => setQuote(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="06-12345678"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Adres / Plaats</label>
                  <input
                    type="text"
                    value={quote.clientAddress}
                    onChange={e => setQuote(prev => ({ ...prev, clientAddress: e.target.value }))}
                    placeholder="Straat 123, 1234AB Amsterdam"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-400" />
                Diensten & Prijzen
              </h2>
              
              {/* Quick Add */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 mb-2">Snel toevoegen:</div>
                <div className="flex flex-wrap gap-2">
                  {serviceSuggestions.slice(0, 8).map(s => (
                    <button
                      key={s}
                      onClick={() => addServiceSuggestion(s)}
                      className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-violet-600 text-slate-300 hover:text-white rounded-lg transition"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                {quote.lines.map((line, index) => (
                  <div key={index} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-800/50 transition"
                      onClick={() => setExpandedLine(expandedLine === index ? null : index)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {line.description || <span className="text-slate-500">Nieuwe dienst...</span>}
                        </div>
                        {line.total > 0 && (
                          <div className="text-sm text-emerald-400">€{line.total.toFixed(2)}</div>
                        )}
                      </div>
                      {expandedLine === index ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                      {quote.lines.length > 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); removeLine(index) }}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {expandedLine === index && (
                      <div className="px-4 pb-4 pt-0 grid grid-cols-4 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs text-slate-500 mb-1">Omschrijving</label>
                          <input
                            type="text"
                            value={line.description}
                            onChange={e => updateLine(index, 'description', e.target.value)}
                            placeholder="Dienst omschrijving"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Aantal</label>
                          <input
                            type="number"
                            value={line.quantity}
                            onChange={e => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                            min="1"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Prijs/stuk (€)</label>
                          <input
                            type="number"
                            value={line.unitPrice}
                            onChange={e => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none transition"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addLine}
                className="mt-4 w-full py-3 border-2 border-dashed border-slate-700 hover:border-violet-500 rounded-xl text-slate-400 hover:text-violet-400 transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span> Regel toevoegen
              </button>

              {/* Totals */}
              <div className="mt-6 bg-slate-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Subtotaal</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    Korting
                    <input
                      type="number"
                      value={quote.discount}
                      onChange={e => setQuote(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-center text-sm"
                    />
                    %
                  </span>
                  <span className="font-medium">{quote.discount > 0 ? `-€${discountAmount.toFixed(2)}` : '—'}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">BTW ({quote.taxRate}%)</span>
                  <span className="font-medium">€{taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-lg">Totaal</span>
                  <span className="font-black text-2xl text-emerald-400">€{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Offerte Details
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Offerte Nummer</label>
                  <input
                    type="text"
                    value={quote.quoteNumber}
                    onChange={e => setQuote(prev => ({ ...prev, quoteNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Geldig (dagen)</label>
                  <input
                    type="number"
                    value={quote.validDays}
                    onChange={e => setQuote(prev => ({ ...prev, validDays: parseInt(e.target.value) || 30 }))}
                    min="1"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Betaalvoorwaarden</label>
                  <select
                    value={quote.paymentTerms}
                    onChange={e => setQuote(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition"
                  >
                    {paymentTermsOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Opmerkingen</label>
                  <textarea
                    value={quote.notes}
                    onChange={e => setQuote(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Extra opmerkingen of voorwaarden..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-4">
              <button
                onClick={generateQuote}
                disabled={!quote.clientName || quote.lines.every(l => !l.description)}
                className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition"
              >
                <FileText className="w-6 h-6" />
                Genereer Offerte
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Generated Quote Preview */}
            <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl mb-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    {profile ? (
                      <>
                        <div className="text-2xl font-black mb-1">{profile.name}</div>
                        {profile.email && <div className="text-white/80 text-sm">{profile.email}</div>}
                        {profile.phone && <div className="text-white/80 text-sm">{profile.phone}</div>}
                      </>
                    ) : (
                      <div className="text-2xl font-black mb-1">Jouw Bedrijfsnaam</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black">OFFERTE</div>
                    <div className="text-white/80 text-sm mt-1">{quote.quoteNumber}</div>
                    <div className="text-white/60 text-xs mt-2">
                      Geldig t/m {new Date(Date.now() + quote.validDays * 86400000).toLocaleDateString('nl-NL')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client & Date */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Aan</div>
                  <div className="font-bold text-lg">{quote.clientName}</div>
                  {quote.clientCompany && <div>{quote.clientCompany}</div>}
                  {quote.clientAddress && <div className="text-slate-600">{quote.clientAddress}</div>}
                  {quote.clientEmail && <div className="text-slate-600">{quote.clientEmail}</div>}
                  {quote.clientPhone && <div className="text-slate-600">{quote.clientPhone}</div>}
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Datum</div>
                  <div className="font-medium">{new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Lines */}
              <div className="px-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Omschrijving</th>
                      <th className="text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-20">Aantal</th>
                      <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">Prijs</th>
                      <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">Totaal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.lines.filter(l => l.description).map((line, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-4 font-medium">{line.description}</td>
                        <td className="py-4 text-center text-slate-600">{line.quantity}</td>
                        <td className="py-4 text-right text-slate-600">€{line.unitPrice.toFixed(2)}</td>
                        <td className="py-4 text-right font-medium">€{line.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="px-8 py-6 bg-slate-50">
                <div className="flex justify-end">
                  <div className="w-72">
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Subtotaal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {quote.discount > 0 && (
                      <div className="flex justify-between py-2 text-slate-600">
                        <span>Korting ({quote.discount}%)</span>
                        <span className="text-red-500">-€{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>BTW ({quote.taxRate}%)</span>
                      <span>€{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-slate-300 font-bold text-lg mt-2">
                      <span>Totaal</span>
                      <span className="text-violet-600">€{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-slate-50 border-t">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Betaalvoorwaarden</div>
                    <div className="text-sm text-slate-600">{quote.paymentTerms}</div>
                  </div>
                  {quote.notes && (
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opmerkingen</div>
                      <div className="text-sm text-slate-600">{quote.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCopyQuote}
                className="flex-1 min-w-[160px] py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-5 h-5" />
                {copiedId === 'quote' ? 'Gekopieerd!' : 'Kopieer Tekst'}
              </button>
              <button
                onClick={handleSaveToCRM}
                disabled={savingToCRM}
                className="flex-1 min-w-[160px] py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <Save className="w-5 h-5" />
                {savingToCRM ? 'Opslaan...' : 'Opslaan in CRM'}
              </button>
              <button
                onClick={() => window.print()}
                className="py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button
                onClick={() => setGenerated(false)}
                className="py-3 px-6 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-5 h-5" />
                Bewerk
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
