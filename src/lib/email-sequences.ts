import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SEQUENCES_FILE = path.join(DATA_DIR, 'email-sequences.json');
const EMAILS_FILE = path.join(DATA_DIR, 'sent-emails.json');

export interface EmailSequence {
  id: number;
  leadId: number;
  name: string;
  service: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  currentStep: number;
  steps: EmailStep[];
  createdAt: string;
  updatedAt: string;
  lastSentAt?: string;
  completedAt?: string;
}

export interface EmailStep {
  stepNumber: number;
  subject: string;
  template: string;
  delayDays: number;
  sentAt?: string;
  status: 'pending' | 'sent' | 'skipped' | 'failed';
}

export interface SentEmail {
  id: number;
  leadId: number;
  sequenceId: number;
  stepNumber: number;
  to: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed' | 'bounced';
  sentAt: string;
  error?: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readSequences(): EmailSequence[] {
  ensureDataDir();
  if (!fs.existsSync(SEQUENCES_FILE)) {
    fs.writeFileSync(SEQUENCES_FILE, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(SEQUENCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSequences(sequences: EmailSequence[]): void {
  ensureDataDir();
  fs.writeFileSync(SEQUENCES_FILE, JSON.stringify(sequences, null, 2));
}

function readSentEmails(): SentEmail[] {
  ensureDataDir();
  if (!fs.existsSync(EMAILS_FILE)) {
    fs.writeFileSync(EMAILS_FILE, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(EMAILS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveSentEmails(emails: SentEmail[]): void {
  ensureDataDir();
  fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
}

export function getSequences(filters?: { leadId?: number; status?: string }): EmailSequence[] {
  let sequences = readSequences();
  if (filters?.leadId) {
    sequences = sequences.filter(s => s.leadId === filters.leadId);
  }
  if (filters?.status) {
    sequences = sequences.filter(s => s.status === filters.status);
  }
  return sequences.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSequence(id: number): EmailSequence | null {
  const sequences = readSequences();
  return sequences.find(s => s.id === id) || null;
}

export function createSequence(leadId: number, service: string, name: string): EmailSequence {
  const sequences = readSequences();
  
  // Get email templates based on service
  const templates = getEmailTemplates(service);
  
  const newSequence: EmailSequence = {
    id: sequences.length > 0 ? Math.max(...sequences.map(s => s.id)) + 1 : 1,
    leadId,
    name,
    service,
    status: 'active',
    currentStep: 0,
    steps: templates.map((t, i) => ({
      stepNumber: i + 1,
      subject: t.subject,
      template: t.body,
      delayDays: t.delayDays,
      status: 'pending'
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  sequences.push(newSequence);
  saveSequences(sequences);
  return newSequence;
}

export function updateSequenceStatus(id: number, status: EmailSequence['status']): EmailSequence | null {
  const sequences = readSequences();
  const index = sequences.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  sequences[index].status = status;
  sequences[index].updatedAt = new Date().toISOString();
  if (status === 'completed') {
    sequences[index].completedAt = new Date().toISOString();
  }
  saveSequences(sequences);
  return sequences[index];
}

export function markStepSent(sequenceId: number, stepNumber: number): boolean {
  const sequences = readSequences();
  const seqIndex = sequences.findIndex(s => s.id === sequenceId);
  if (seqIndex === -1) return false;
  
  const stepIndex = sequences[seqIndex].steps.findIndex(s => s.stepNumber === stepNumber);
  if (stepIndex === -1) return false;
  
  sequences[seqIndex].steps[stepIndex].status = 'sent';
  sequences[seqIndex].steps[stepIndex].sentAt = new Date().toISOString();
  sequences[seqIndex].currentStep = stepNumber;
  sequences[seqIndex].lastSentAt = new Date().toISOString();
  sequences[seqIndex].updatedAt = new Date().toISOString();
  
  // Check if all steps completed
  const allDone = sequences[seqIndex].steps.every(s => s.status === 'sent');
  if (allDone) {
    sequences[seqIndex].status = 'completed';
    sequences[seqIndex].completedAt = new Date().toISOString();
  }
  
  saveSequences(sequences);
  return true;
}

export function logSentEmail(email: Omit<SentEmail, 'id' | 'sentAt'>): SentEmail {
  const emails = readSentEmails();
  const newEmail: SentEmail = {
    ...email,
    id: emails.length > 0 ? Math.max(...emails.map(e => e.id)) + 1 : 1,
    sentAt: new Date().toISOString()
  };
  emails.push(newEmail);
  saveSentEmails(emails);
  return newEmail;
}

export function getSentEmails(filters?: { leadId?: number; sequenceId?: number }): SentEmail[] {
  let emails = readSentEmails();
  if (filters?.leadId) {
    emails = emails.filter(e => e.leadId === filters.leadId);
  }
  if (filters?.sequenceId) {
    emails = emails.filter(e => e.sequenceId === filters.sequenceId);
  }
  return emails.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

// Email templates for each service
interface EmailTemplate {
  subject: string;
  body: string;
  delayDays: number;
}

function getEmailTemplates(service: string): EmailTemplate[] {
  const templates: Record<string, EmailTemplate[]> = {
    'google-dominance': [
      {
        subject: 'Welkom! Je Google Business profiel is in goede handen',
        body: `Beste {{name}},

Welkom bij LocalBoost! We zijn begonnen met het optimaliseren van je Google Business profiel.

Wat kun je verwachten de komende dagen:
✅ Verificatie van je bedrijfsprofiel
✅ Optimalisatie van je bedrijfsinformatie
✅ Fotografie en visuele content
✅ Lokale SEO optimalisatie

Over 3 dagen ontvang je je eerste voortgangsrapportage.

Als je vragen hebt, reply gewoon op deze email - we staan voor je klaar!

Met vriendelijke groet,
Team LocalBoost`,
        delayDays: 0
      },
      {
        subject: 'Je profiel is live! Hier is je eerste rapport',
        body: `Beste {{name}},

Geweldig nieuws! Je Google Business profiel is nu volledig geoptimaliseerd en zichtbaar voor potentiële klanten in jouw regio.

📊 Wat we hebben gedaan:
• Je bedrijfsinformatie volledig ingevuld
• Foto's en video's toegevoegd
• Categorieën en attributen geoptimaliseerd
• Lokale SEO signals versterkt

📈 Volgende stappen:
De komende 2 weken monitoren we je positie en sturen we je wekelijkse updates.

Blijf alerts for nieuwe klantbeoordelingen - die helpen je positie enorm!

Met groet,
Team LocalBoost`,
        delayDays: 3
      },
      {
        subject: 'Hoe word je #1 op Google Maps',
        body: `Beste {{name}},

Je vraagt je misschien af: "Hoe komen we nou op plek 1 in Google Maps?"

Hier zijn 3 bewezen tips:

1️⃣ VERZAMEL RECENSIES
Vraag tevreden klanten om een review. Dit is veruit de belangrijkste factor voor je Google ranking.

2️⃣ POST REGELMATIG
Google houdt van actieve bedrijven. Publiceer wekelijks updates, aanbiedingen of nieuws.

3️⃣ ANTWOORD OP VRAGEN
Beantwoord alle vragen die binnenkomen snel en professioneel. Dit toont dat je betrokken bent.

Heb je al reviews ontvangen? Laat het me weten - we helpen je ze professioneel te beantwoorden.

Team LocalBoost`,
        delayDays: 7
      },
      {
        subject: 'Je week 2 update - positie verbetering',
        body: `Beste {{name}},

We zijn nu 2 weken onderweg en ik heb goed nieuws.

Je Google zichtbaarheid is aan het verbeteren! We zien stap voor stap beweging in de juiste richting.

Wat je zelf kunt doen deze week:
🔹 Vraag 3-5 klanten om een review (tips in vorige email)
🔹 Check of alle informatie accuraat is op Google
🔹 Bekijk je concurrenten - wat doen zij goed?

Aan het einde van de maand krijg je een volledig rapport met je nieuwe ranking.

Nog vragen? Ik sta klaar!

Team LocalBoost`,
        delayDays: 14
      }
    ],
    'lead-machine': [
      {
        subject: 'Je lead machine is opgebouwd!',
        body: `Beste {{name}},

Welkom bij LocalBoost! Je lead generation systeem is nu operationeel.

🎯 Wat we hebben gebouwd:
• High-converting landingspagina
• Slim contactformulier met directe notificaties
• E-mail automatisering voor opvolging
• Real-time analytics dashboard

📬 De eerste leads komen binnen
Zodra je eerste lead binnenkomt, ontvang je direct een e-mail en SMS notificatie.

Je landing page is nu live en klaar om verkeer te ontvangen.

Over 7 dagen: Eerste resultaten rapport.

Team LocalBoost`,
        delayDays: 0
      },
      {
        subject: 'Je eerste leads zijn binnen! (waarschijnlijk)',
        body: `Beste {{name}},

Na 7 dagen zouden je eerste leads binnen moeten zijn gekomen.

Heb je al reacties ontvangen via je website?

Als JA: Gefeliciteerd! Noteer hun contactgegevens goed.
Als NEE: Geen zorgen, we kijken wat we kunnen optimaliseren.

Wat helpt nu:
📧 Check je spamfolder
📱 Zorg dat notificaties aan staan
🔧 Als het nodig is, passen we je landingspagina aan

Laat me weten hoe het gaat!

Team LocalBoost`,
        delayDays: 7
      },
      {
        subject: '5 tips om meer leads te krijgen',
        body: `Beste {{name}},

Hier zijn 5 tips om het maximale uit je lead machine te halen:

1️⃣ DEEL JE LANDING PAGE
Plaats je landingspagina link op je social media, in je email signature, en in je nieuwsbrieven.

2️⃣ GOOGLE ADS
Overweeg een klein Google Ads budget om snel meer verkeer te krijgen. Wij kunnen dit voor je instellen.

3️⃣ RETARGETING
Bezoekers die je site verlaten kan je later via ads weer terugbrengen. Dit verhoogt conversie significant.

4️⃣ MEER AANBODINGEN
Hoe meer ценность je biedt, hoe meer mensen reageren. Denk aan een gratis ebook, checklist of demo.

5️⃣ SOCIAL PROOF
Voeg testimonials en case studies toe aan je landingspagina.

Welke tip spreekt je het meeste aan?

Team LocalBoost`,
        delayDays: 14
      }
    ],
    'ads-profit': [
      {
        subject: 'Je Google Ads campagnes zijn live!',
        body: `Beste {{name}},

Goed nieuws! Je Google Ads campagnes draaien nu.

Wat we hebben ingesteld:
✅ Google Ads account volledig geconfigureerd
✅ Zoekwoorden onderzoek afgerond
✅ Doelgroep targeting ingesteld
✅ Conversie tracking geïnstalleerd
✅ Meerdere ad variaties voor A/B testing

📊 Monitoring
We monitoren je campagnes 24/7 en optimaliseren automatisch.

⏰ Eerste resultaten na 7 dagen
Aan het einde van de week ontvang je je eerste performance rapport.

Belangrijk: Het kan 3-5 dagen duren voordat Google genoeg data heeft om je ads optimaal te tonen.

Vragen? Reply maar!

Team LocalBoost`,
        delayDays: 0
      },
      {
        subject: 'Week 1 resultaat - je ads presteren!',
        body: `Beste {{name}},

Je eerste week Google Ads is voorbij. Hier is je rapport:

📊 KEY METRICS
• Aantal vertoningen: [data]
• Klikken: [data]
• CTR (click-through rate): [data]%
• Geconverteerd: [data] leads

De komende week focussen we op:
🔹 Budget optimalisatie
🔹 Keyword fine-tuning
🔹 Ad copy verbeteringen

Gemiddeld zien onze klanten na 2-3 weken significant betere resultaten, dus we zijn op de goede weg!

Blijf geduldig - Google Ads is een marathon, geen sprint.

Team LocalBoost`,
        delayDays: 7
      },
      {
        subject: 'Maand 1 complete analyse - ROI rapport',
        body: `Beste {{name}},

Je eerste maand Google Ads is compleet! Hier is je volledige analyse:

📈 PRESTATIES
• Totaal besteed: €[bedrag]
• Leads gegenereerd: [aantal]
• Cost per lead: €[cpl]
• Conversie rate: [percentage]%

💡 OPTIMALISATIE SUGGESTIES
Op basis van de data hebben we enkele aanbevelingen:
1. [Suggestie 1]
2. [Suggestie 2]
3. [Suggestie 3]

De komende maand richten we ons op:
• Verlagen cost per lead
• Verhogen conversie rate
• Testen nieuwe ad copy

Klaar voor een belletje om de resultaten te bespreken?

Team LocalBoost`,
        delayDays: 30
      }
    ],
    'full-growth': [
      {
        subject: 'Welkom bij je Complete Groei Partnership!',
        body: `Beste {{name}},

Welkom bij LocalBoost! Je Full Growth partnership is nu actief.

Wat we allemaal voor je doen:
🎯 GOOGLE DOMINANTIE
Je #1 positie op Google Maps en zoeken

📧 LEAD GENERATIE
Systematisch kwalitatieve leads aantrekken

📈 GOOGLE ADS
Winstgevende advertentiecampagnes

📊 FULL SERVICE
Maandelijkse rapportage en strategie

📅 JE START
We beginnen met een intake gesprek om alles perfect in te richten.

Je ontvangt binnen 24 uur een uitnodiging voor je onboarding call.

Daarna zie je ons wekelijkse updates en maandelijkse rapporten.

We zijn enthousiast om met je te werken!

Team LocalBoost`,
        delayDays: 0
      },
      {
        subject: 'Je onboarding is gepland!',
        body: `Beste {{name}},

Vandaag bereiden we je volledige groei-strategie voor.

Onze eerste stap is een intake gesprek om te begrijpen:
• Je bedrijf en doelen
• Je doelgroep en concurrenten
• Wat succespercentage voor jou betekent

📅 VERWACHT
• Dag 1-3: Intake en strategie ontwikkeling
• Dag 4-7: Setup en configuratie
• Week 2: Eerste campagnes live
• Week 4: Eerste resultaten rapport

⏰ Binnen 48 uur ontvang je je persoonlijke uitnodiging voor de onboarding call.

Bereid het volgende voor:
✓ Google Ads toegang (als je hebt)
✓ Analytics toegang (als je hebt)
✓ Je doelstellingen voor dit jaar

Zie je snel!

Team LocalBoost`,
        delayDays: 2
      },
      {
        subject: 'Week 1 update - alles staat live!',
        body: `Beste {{name}},

Je eerste week bij LocalBoost is voorbij!

✅ WAT WE HEBBEN GEZIEN
• Google Business profiel: Geoptimaliseerd
• Lead machine: Operationeel
• Ads campagnes: Testfase gestart

📊 VOLGENDE WEEK
We verwachten de eerste echte resultaten van je campagnes.

Je wekelijkse update ontvang je volgende week donderdag.

Vragen? Ik ben er voor je!

Team LocalBoost`,
        delayDays: 7
      }
    ]
  };

  return templates[service] || templates['google-dominance'];
}

export default { 
  getSequences, 
  getSequence, 
  createSequence, 
  updateSequenceStatus,
  markStepSent,
  logSentEmail,
  getSentEmails
};