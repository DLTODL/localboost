'use client';

import { useState } from 'react';
import { MapPin, CheckCircle, Clock, AlertTriangle, ExternalLink, Camera, Star, MessageSquare, Settings, ChevronRight, Copy, Check } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  link?: string;
}

const gbpTasks: TaskItem[] = [
  { id: 'claim', title: 'Claim je Google Business Profile', description: 'Ga naar business.google.com en claim jouw bedrijf.', category: 'setup', completed: false, link: 'https://business.google.com' },
  { id: 'verify', title: 'Verifieer je bedrijf', description: 'Google stuurt een postkaart met een verificatiecode.', category: 'setup', completed: false },
  { id: 'category', title: 'Kies de juiste categorie', description: 'Selecteer de meest specifieke categorie.', category: 'setup', completed: false },
  { id: 'name', title: 'Optimaliseer bedrijfsnaam', description: 'Gebruik je officiële bedrijfsnaam EXACT.', category: 'optimize', completed: false },
  { id: 'address', title: 'Controleer adres', description: 'Zorg dat het adres 100% correct is.', category: 'optimize', completed: false },
  { id: 'hours', title: 'Stel openingstijden in', description: 'Voeg speciale uren toe voor vakanties.', category: 'optimize', completed: false },
  { id: 'phone', title: 'Telefoonnummer controleren', description: 'Gebruik een lokaal telefoonnummer.', category: 'optimize', completed: false },
  { id: 'website', title: 'Koppel je website', description: 'Zorg dat de website URL correct is.', category: 'optimize', completed: false },
  { id: 'logo', title: 'Upload logo', description: 'Vierkante afbeelding, minimaal 720x720 pixels.', category: 'media', completed: false },
  { id: 'cover', title: 'Upload cover foto', description: 'Horizontale foto die je bedrijf representeert.', category: 'media', completed: false },
  { id: 'photos', title: 'Voeg 10+ foto\'s toe', description: 'Interieur, exterieur, team, producten.', category: 'media', completed: false },
  { id: '360tour', title: 'Overweeg 360 tour', description: 'Virtual tour verhoogt engagement met 50%.', category: 'media', completed: false },
  { id: 'review-link', title: 'Vraag om reviews', description: 'Stuur klanten een direct link naar je review pagina.', category: 'reviews', completed: false },
  { id: 'respond', title: 'Reageer op alle reviews', description: 'Bedank voor positieve, los op voor negatieve.', category: 'reviews', completed: false },
  { id: 'posts', title: 'Gebruik Google Posts', description: 'Plaats wekelijks updates over aanbiedingen.', category: 'posts', completed: false },
  { id: 'questions', title: 'Voeg veelgestelde vragen toe', description: 'Stel zelf vragen en beantwoord ze.', category: 'qa', completed: false },
  { id: 'messaging', title: 'Activeer berichtenservice', description: 'Klanten kunnen je direct een bericht sturen.', category: 'qa', completed: false },
  { id: 'insights', title: 'Check maandelijks je inzichten', description: 'Meet hoe mensen je vinden.', category: 'maintenance', completed: false },
  { id: 'competitor', title: 'Vergelijk met concurrenten', description: 'Check wat zij doen.', category: 'maintenance', completed: false },
];

const categories = [
  { id: 'setup', label: 'Setup', icon: MapPin, color: 'violet' },
  { id: 'optimize', label: 'Optimalisatie', icon: Settings, color: 'blue' },
  { id: 'media', label: 'Media', icon: Camera, color: 'green' },
  { id: 'reviews', label: 'Reviews', icon: Star, color: 'yellow' },
  { id: 'posts', label: 'Posts', icon: MessageSquare, color: 'purple' },
  { id: 'qa', label: 'Vragen', icon: MessageSquare, color: 'cyan' },
  { id: 'maintenance', label: 'Onderhoud', icon: Clock, color: 'gray' },
];

const colorMap: Record<string, string> = {
  violet: 'bg-violet-600',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  purple: 'bg-purple-600',
  cyan: 'bg-cyan-600',
  gray: 'bg-slate-600',
};

export default function GoogleBusinessGuide() {
  const [tasks, setTasks] = useState<TaskItem[]>(gbpTasks);
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === activeCategory);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-400" />
            Google Business Profile Guide
          </h1>
          <p className="text-slate-400 mt-2">Stapsgewijze handleiding voor optimalisatie</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">Complete setup progress</span>
            <span className="text-2xl font-bold text-green-400">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-sm text-slate-400">{completedCount} van {tasks.length} taken voltooid</div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${activeCategory === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Alle ({tasks.length})
          </button>
          {categories.map(cat => {
            const count = tasks.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition flex items-center gap-2 ${activeCategory === cat.id ? `${colorMap[cat.color]} text-white` : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-600/30 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-blue-400" />
            Quick Start Links
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Google Business</span>
              <ExternalLink className="w-4 h-4 ml-auto text-slate-500" />
            </a>
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition">
              <MapPin className="w-5 h-5 text-green-400" />
              <span>Google Maps</span>
              <ExternalLink className="w-4 h-4 ml-auto text-slate-500" />
            </a>
            <button onClick={() => copyLink('https://g.page/r/-/buffer/review', 'review-link')} className="flex items-center gap-2 bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Review Link</span>
              {copiedLink === 'review-link' ? <Check className="w-4 h-4 ml-auto text-green-400" /> : <Copy className="w-4 h-4 ml-auto text-slate-500" />}
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTasks.map(task => {
            const cat = categories.find(c => c.id === task.category);
            return (
              <div key={task.id} className={`bg-slate-800 rounded-xl p-5 border transition ${task.completed ? 'border-green-600/30 bg-green-600/5' : 'border-slate-700 hover:border-slate-600'}`}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id)} className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${task.completed ? 'bg-green-600 border-green-600' : 'border-slate-500 hover:border-violet-500'}`}>
                    {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
                      {cat && <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorMap[cat.color]} text-white`}>{cat.label}</span>}
                    </div>
                    <p className={`text-sm ${task.completed ? 'text-slate-500' : 'text-slate-400'}`}>{task.description}</p>
                    {task.link && (
                      <a href={task.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300">
                        Open link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-amber-600/10 rounded-xl p-6 border border-amber-600/30">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Pro Tips
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /><span>Foto\'s krijgen 42% meer klikken</span></li>
            <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /><span>Responstijd moet onder 24 uur zijn</span></li>
            <li className="flex items-start gap-2"><ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" /><span>Posts met aanbiedingen krijgen 3x meer engagement</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}