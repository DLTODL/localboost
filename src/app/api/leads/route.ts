import { NextResponse } from 'next/server';
import { getLeads, addLead } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add lead to database
    const newLead = addLead({
      name,
      email,
      phone,
      company: company || '',
      service,
      message: message || '',
      status: 'new'
    });

    // Send notification (async, don't wait)
    const publicUrl = process.env.NEXT_PUBLIC_URL || 'https://localboost-xi.vercel.app';
    fetch(`${publicUrl}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(console.error);

    return NextResponse.json({ 
      success: true, 
      id: newLead.id,
      message: 'Lead submitted successfully'
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
