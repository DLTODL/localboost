import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

export interface Task {
  id: number;
  leadId: number;
  title: string;
  description: string;
  category: 'setup' | 'optimize' | 'content' | 'reviews' | 'ads' | 'follow-up';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readTasks(): Task[] {
  ensureDataDir();
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  ensureDataDir();
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export function getTasks(filters?: { leadId?: number; status?: string; category?: string }): Task[] {
  let tasks = readTasks();
  if (filters?.leadId) {
    tasks = tasks.filter(t => t.leadId === filters.leadId);
  }
  if (filters?.status) {
    tasks = tasks.filter(t => t.status === filters.status);
  }
  if (filters?.category) {
    tasks = tasks.filter(t => t.category === filters.category);
  }
  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>): Task {
  const tasks = readTasks();
  const newTask: Task = {
    ...task,
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: number, updates: Partial<Task>): Task | null {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    completedAt: updates.status === 'completed' ? new Date().toISOString() : tasks[index].completedAt
  };
  saveTasks(tasks);
  return tasks[index];
}

export function deleteTask(id: number): boolean {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  saveTasks(tasks);
  return true;
}

// Generate tasks for a lead based on their selected service
export function generateTasksForLead(leadId: number, service: string): Task[] {
  const taskTemplates: Record<string, Partial<Task>[]> = {
    'google-dominance': [
      { title: 'Claim Google Business Profile', description: 'Create or claim the Google Business Profile for the client', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Complete business information', description: 'Fill in all business details: address, hours, phone, website', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Upload professional photos', description: 'Add 10+ high-quality photos of the business', category: 'content', priority: 'medium', status: 'pending' },
      { title: 'Write business description', description: 'Create compelling business description with keywords', category: 'content', priority: 'medium', status: 'pending' },
      { title: 'Set up review request system', description: 'Configure automated review requests', category: 'reviews', priority: 'high', status: 'pending' },
      { title: 'Optimize for local SEO', description: 'Add categories, attributes, and local keywords', category: 'optimize', priority: 'high', status: 'pending' },
      { title: 'Create first post', description: 'Publish welcome post with offer or highlight', category: 'content', priority: 'low', status: 'pending' },
      { title: 'Enable messaging', description: 'Turn on Google Messages for customer contact', category: 'setup', priority: 'low', status: 'pending' },
      { title: 'Schedule monthly audit', description: 'Set up recurring task for monthly profile audit', category: 'follow-up', priority: 'medium', status: 'pending' },
    ],
    'lead-machine': [
      { title: 'Create landing page', description: 'Build high-converting landing page for lead capture', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Set up CRM system', description: 'Configure CRM with contact management and pipelines', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Create email capture form', description: 'Design and implement email signup form', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Build email welcome sequence', description: 'Create 3-email welcome sequence for new leads', category: 'content', priority: 'medium', status: 'pending' },
      { title: 'Set up SMS notifications', description: 'Configure SMS alerts for new lead arrivals', category: 'setup', priority: 'medium', status: 'pending' },
      { title: 'Create lead follow-up sequence', description: 'Build 5-email follow-up sequence for unconverted leads', category: 'follow-up', priority: 'medium', status: 'pending' },
      { title: 'Set up analytics dashboard', description: 'Create tracking for leads, conversions, and sources', category: 'optimize', priority: 'high', status: 'pending' },
      { title: 'Configure form submissions', description: 'Set up form-to-email and form-to-CRM integrations', category: 'setup', priority: 'high', status: 'pending' },
    ],
    'ads-profit': [
      { title: 'Set up Google Ads account', description: 'Create or link Google Ads account', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Conduct keyword research', description: 'Identify high-value keywords for the business', category: 'optimize', priority: 'high', status: 'pending' },
      { title: 'Create campaign structure', description: 'Set up campaigns, ad groups, and targeting', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Write ad copy', description: 'Create compelling ad variations for testing', category: 'content', priority: 'medium', status: 'pending' },
      { title: 'Set up conversion tracking', description: 'Install and verify conversion tracking', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Configure landing pages', description: 'Ensure landing pages match ad messaging', category: 'optimize', priority: 'medium', status: 'pending' },
      { title: 'Set budget and bidding', description: 'Configure initial budget and bidding strategy', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Schedule first campaign review', description: 'Plan for 7-day performance review', category: 'follow-up', priority: 'medium', status: 'pending' },
    ],
    'full-growth': [
      { title: 'Complete Google Business setup', description: 'Full GMB setup and optimization', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Create lead capture system', description: 'Build complete lead generation funnel', category: 'setup', priority: 'high', status: 'pending' },
      { title: 'Set up Google Ads campaigns', description: 'Create and optimize Google Ads presence', category: 'ads', priority: 'high', status: 'pending' },
      { title: 'Build email marketing system', description: 'Set up email sequences and automations', category: 'content', priority: 'medium', status: 'pending' },
      { title: 'Create monthly reporting', description: 'Build automated monthly performance reports', category: 'follow-up', priority: 'medium', status: 'pending' },
      { title: 'Schedule weekly syncs', description: 'Set up recurring client calls', category: 'follow-up', priority: 'low', status: 'pending' },
    ]
  };

  const templates = taskTemplates[service] || taskTemplates['google-dominance'];
  const createdTasks: Task[] = [];

  for (const template of templates) {
    const task = addTask({
      leadId,
      title: template.title!,
      description: template.description!,
      category: template.category!,
      priority: template.priority!,
      status: 'pending',
      dueDate: undefined
    });
    createdTasks.push(task);
  }

  return createdTasks;
}

export default { getTasks, addTask, updateTask, deleteTask, generateTasksForLead };