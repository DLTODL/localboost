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
    return [];
  }
  try {
    const data = fs.readFileSync(SEQUENCES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSequences(sequences: EmailSequence[]) {
  ensureDataDir();
  fs.writeFileSync(SEQUENCES_FILE, JSON.stringify(sequences, null, 2));
}

function readSentEmails(): SentEmail[] {
  ensureDataDir();
  if (!fs.existsSync(EMAILS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(EMAILS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSentEmails(emails: SentEmail[]) {
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
  return sequences;
}

export function getSequence(id: number): EmailSequence | undefined {
  const sequences = readSequences();
  return sequences.find(s => s.id === id);
}

export function createSequence(leadId: number, service: string, name: string): EmailSequence {
  const sequences = readSequences();
  const now = new Date().toISOString();
  
  const steps: EmailStep[] = [
    { stepNumber: 1, subject: `Succesvolle bedrijven in ${service} beginnen hier`, template: 'warm_intro', delayDays: 1, status: 'pending' },
    { stepNumber: 2, subject: `${service} tip die je concurrentie niet kent`, template: 'value_tip', delayDays: 4, status: 'pending' },
    { stepNumber: 3, subject: `Passed de kogel? Speciaal aanbod`, template: 'offer', delayDays: 8, status: 'pending' },
    { stepNumber: 4, subject: 'Deze kans verdwijnt binnenkort', template: 'final', delayDays: 14, status: 'pending' },
  ];

  const newSequence: EmailSequence = {
    id: Date.now(),
    leadId,
    name,
    service,
    status: 'active',
    currentStep: 0,
    steps,
    createdAt: now,
    updatedAt: now,
  };

  sequences.push(newSequence);
  writeSequences(sequences);
  return newSequence;
}

export function updateSequenceStatus(id: number, status: string): EmailSequence | undefined {
  const sequences = readSequences();
  const index = sequences.findIndex(s => s.id === id);
  if (index === -1) return undefined;

  sequences[index].status = status as EmailSequence['status'];
  sequences[index].updatedAt = new Date().toISOString();
  
  if (status === 'completed') {
    sequences[index].completedAt = new Date().toISOString();
  }

  writeSequences(sequences);
  return sequences[index];
}

export function getSentEmails(filters?: { leadId?: number; sequenceId?: number }): SentEmail[] {
  let emails = readSentEmails();
  if (filters?.leadId) {
    emails = emails.filter(e => e.leadId === filters.leadId);
  }
  if (filters?.sequenceId) {
    emails = emails.filter(e => e.sequenceId === filters.sequenceId);
  }
  return emails;
}

export function recordSentEmail(email: Omit<SentEmail, 'id'>): SentEmail {
  const emails = readSentEmails();
  const newEmail: SentEmail = {
    ...email,
    id: Date.now(),
  };
  emails.push(newEmail);
  writeSentEmails(emails);
  return newEmail;
}