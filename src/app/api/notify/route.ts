import { NextResponse } from 'next/server';

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  created_at: string
}

export async function POST(request: Request) {
  try {
    const lead: Lead = await request.json();
    
    // Format message for Telegram
    const serviceLabels: Record<string, string> = {
      'google-dominance': 'Google Dominantie Pakket',
      'lead-machine': 'Lead Machine Systeem',
      'ads-profit': 'Winstgevende Ads',
      'full-growth': 'Complete Groei Partnership'
    };

    const serviceLabel = serviceLabels[lead.service] || lead.service;

    const message = `🆕 *Nieuwe Lead!*

👤 *Naam:* ${lead.name}
📧 *Email:* ${lead.email}
📱 *Telefoon:* ${lead.phone}
🏢 *Bedrijf:* ${lead.company || '-'}
📦 *Dienst:* ${serviceLabel}

💬 *Bericht:*
${lead.message || 'Geen bericht'}

⏰ ${new Date(lead.created_at).toLocaleString('nl-NL')}`;

    // Send to Telegram if configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    // Also log to console for debugging
    console.log('New lead received:', lead);

    return NextResponse.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 });
  }
}
