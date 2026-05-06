'use client'

import { useState, useEffect } from 'react'
import { Mail, Copy, Check, Send, Clock, Users, MessageSquare, Tag, FileText, Sparkles } from 'lucide-react'
import { copyWithToast, useBusinessProfile, useToolInputs, useTemplates } from '@/lib/useSharedData'
import TemplateSwitcher from '@/components/polish/TemplateSwitcher'
import ProfileBar from '@/components/polish/ProfileBar'

interface Sequence {
  id: string
  title: string
  subject: string
  delay: string
  content: string
  useCase: string
}

const sequences: Sequence[] = [
  {
    id: 'welcome',
    title: 'Welkomstserie',
    subject: 'Welkom bij [Bedrijfsnaam] - Hier is wat je kunt verwachten',
    delay: 'Direct',
    useCase: 'Nieuwe klant of subscriber',
    content: `Beste [Naam],

Welkom bij [Bedrijfsnaam]! 👋

Leuk dat je er bent. Hier is wat je de komende dagen kunt verwachten:

📅 Dag 1-2: We nemen contact met je op om kennis te maken
📈 Dag 3-7: We sturen je onze beste tips en tricks
🎁 Dag 14: Een exclusieve aanbieding alleen voor jou

Ondertussen... heb je vragen?.Reply gewoon op deze email - ik lees alles.

Tot snel!

[Je naam]
[Bedrijfsnaam]`
  },
  {
    id: 'follow-up',
    title: 'Follow-up na contact',
    subject: 'Even checken - nog vragen over [dienst/product]?',
    delay: '2 uur na geen reactie',
    useCase: 'Na eerste contactformulier',
    content: `Hey [Naam],

Ik wilde even checken of je mijn vorige email hebt ontvangen.

Geen zorgen als je even geen tijd hebt - ik wil gewoon zeker weten dat je alle info hebt die je nodig hebt.

Even samenvatten waar ik je mee kan helpen:
✓ [Dienst 1] - [korte beschrijving]
✓ [Dienst 2] - [korte beschrijving]
✓ [Dienst 3] - [korte beschrijving]

Wil je even bellen om te kijken wat het beste past bij jouw situatie? Ik heb morgen tussen 10:00 en 14:00 vrij.

[Je naam]`
  },
  {
    id: 'value-sequence',
    title: 'Waarde email',
    subject: '[Tips die je helpt met jouw probleem]',
    delay: 'Dag 3 na inschrijving',
    useCase: 'Nieuwe subscriber',
    content: `Hoi [Naam],

Veel bedrijven in [jouw branche] hebben hetzelfde probleem: [gemeenschappelijk probleem].

Hier is hoe sommige van onze klanten dit hebben opgelost:

1. [Tip 1 met voorbeeld]
2. [Tip 2 met voorbeeld]  
3. [Tip 3 met voorbeeld]

Deze tips werken het beste als je ze combineert. Wil je dat we even kijken wat het beste voor jouw situatie werkt?

PS: De volgende email in deze serie bevat een speciaal aanbod alleen voor jou.

[Je naam]`
  },
  {
    id: 'offer',
    title: 'Aanbieding / CTA',
    subject: 'Je persoonlijke aanbieding -限时优惠',
    delay: 'Dag 7 na inschrijving',
    useCase: 'Na waarde-emails',
    content: `Hey [Naam],

Ik hoop dat je de vorige emails waardevol hebt gevonden!

Als je klaar bent om de volgende stap te zetten, heb ik iets speciaals voor je:

🎁 [AANBIEDING NAAM]
[Specifieke beschrijving van wat ze krijgen]

✍️ Hoe het werkt:
1. Klik op de button hieronder
2. Kies je gewenste startdatum
3. Wij regelen de rest

👉 [BUTTON: Ik wil graag beginnen]

Deze aanbieding is persoonlijk voor jou en verloopt over [X] dagen.

Nog vragen? Reply gewoon - ik ben er voor je.

[Je naam]`
  },
  {
    id: 'review-request',
    title: 'Review verzoek',
    subject: 'Bedankt voor je vertrouwen! Kun je ons helpen?',
    delay: '1 dag na aankoop/dienst',
    useCase: 'Na levering dienst',
    content: `Hey [Naam],

Nogmaals bedankt dat je voor [Bedrijfsnaam] hebt gekozen! 🙏

We willen graag weten hoe we het hebben gedaan. Als je een momentje hebt:

⭐⭐⭐⭐⭐ Zou je ons een review willen geven op [Google/Facebook/etc]?
Het helpt ons enorm om meer ondernemers zoals jij te helpen.

👉 [LINK NAAR REVIEW PAGINA]

Nog geen 5 sterren? Geen probleem - reply me en vertel wat we beter kunnen doen. Ik neem elke feedback serieus.

Nogmaals bedankt!

[Je naam]`
  },
  {
    id: 're-engagement',
    title: 'Heractivatie',
    subject: 'Lang niet gesproken - alles goed daar?',
    delay: '30 dagen inactief',
    useCase: 'Lange tijd geen contact',
    content: `Hey [Naam],

Het is alweer een tijdje geleden dat we contact hebben gehad - alles goed daar?

Ik wilde even checken of je nog ergens mee geholpen bent. Ondertussen hebben we een paar nieuwe dingen die je misschien interessant vindt:

🆕 [Nieuwe dienst/functie 1]
🆕 [Nieuwe dienst/functie 2]

Geen actie nodig van je als je nu even geen tijd hebt - ik wilde gewoon even laten weten dat we er zijn als je ons nodig hebt.

Groetjes,

[Je naam]`
  }
]

export default function EmailSequences() {
  const { profile } = useBusinessProfile()
  const { inputs, saveInputs } = useToolInputs('email-sequences')
  const { saveTemplate, getTemplatesForTool } = useTemplates()
  const savedTemplates = getTemplatesForTool('email-sequences')
  
  const [activeTab, setActiveTab] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showContent, setShowContent] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  // Save inputs on change
  useEffect(() => {
    saveInputs({ filter })
  }, [filter, saveInputs])

  const filteredSequences = activeTab === 'all' 
    ? sequences 
    : sequences.filter(s => s.useCase.toLowerCase().includes(activeTab.toLowerCase()))

  const copyToClipboard = async (text: string, id: string) => {
    await copyWithToast(text, 'Email gekopieerd!')
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ProfileBar />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📧</span>
              <div>
                <h1 className="text-3xl font-black">Email Sequences</h1>
                <p className="text-slate-400">Kopieer bewezen email templates voor klantwerving en nurturing</p>
              </div>
            </div>
            <a
              href="/tools/email-campaign-builder"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm transition"
            >
              <FileText className="w-4 h-4" />
              Bouw Campaign →
            </a>
          </div>
          <div className="mt-3">
            <TemplateSwitcher
              toolId="email-sequences"
              onApply={(data) => {
                // Email sequences are read-only templates, apply any saved search context
              }}
              currentData={{ savedCount: savedTemplates.length }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-violet-400">{sequences.length}</div>
            <div className="text-sm text-slate-400">Templates</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-400">100%</div>
            <div className="text-sm text-slate-400">Gratis te gebruiken</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">Direct</div>
            <div className="text-sm text-slate-400">1-klik kopiëren</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'contact', 'subscriber', 'aankoop', 'inactief'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                activeTab === tab 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab === 'all' ? 'Alle' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sequences */}
        <div className="space-y-4">
          {filteredSequences.map(seq => (
            <div 
              key={seq.id}
              className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-slate-750 transition"
                onClick={() => setShowContent(showContent === seq.id ? null : seq.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-violet-600/20 text-violet-300 rounded text-xs font-medium">
                        {seq.delay}
                      </span>
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                        {seq.useCase}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{seq.title}</h3>
                    <p className="text-slate-400 text-sm mb-2">
                      <span className="text-slate-500">Onderwerp:</span> {seq.subject}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(seq.content, seq.id)
                      }}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium flex items-center gap-2 transition"
                    >
                      {copiedId === seq.id ? (
                        <><Check className="w-4 h-4" /> Gekopieerd!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Kopieer</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {showContent === seq.id && (
                <div className="px-6 pb-6 border-t border-slate-700 pt-4">
                  <div className="bg-slate-900 rounded-xl p-4">
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">
                      {seq.content}
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(seq.content, seq.id)}
                    className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                  >
                    {copiedId === seq.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copiedId === seq.id ? 'Gekopieerd!' : 'Kopieer volledige email'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Wil je dat wij dit voor je automatiseren?</h3>
          <p className="text-white/80 mb-4">Wij zetten deze sequences op en zorgen dat ze op het juiste moment worden verstuurd</p>
          <a href="/#contact" className="inline-block bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition">
            Vraag offer aan →
          </a>
        </div>
      </div>
    </div>
  )
}
