import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message?: string;
  status: string;
  notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read leads from JSON file
export function getLeads(): Lead[] {
  ensureDataDir();
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save leads to JSON file
export function saveLeads(leads: Lead[]): void {
  ensureDataDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Add a new lead
export function addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  leads.push(newLead);
  saveLeads(leads);
  return newLead;
}

// Update lead status
export function updateLeadStatus(id: number, status: string): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  leads[index].updated_at = new Date().toISOString();
  saveLeads(leads);
  return leads[index];
}

export default { getLeads, addLead, updateLeadStatus };
