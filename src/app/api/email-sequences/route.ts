import { NextResponse } from 'next/server';
import { getSequences, createSequence, getSequence, updateSequenceStatus, getSentEmails } from '@/lib/email-sequences';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId') ? parseInt(searchParams.get('leadId')!) : undefined;
    const status = searchParams.get('status') || undefined;
    const sequenceId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : undefined;

    if (sequenceId) {
      const sequence = getSequence(sequenceId);
      if (!sequence) {
        return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
      }
      return NextResponse.json({ sequence });
    }

    if (leadId) {
      const sequences = getSequences({ leadId });
      const sentEmails = getSentEmails({ leadId });
      return NextResponse.json({ sequences, sentEmails });
    }

    const sequences = getSequences({ status });
    return NextResponse.json({ sequences });
  } catch (error) {
    console.error('Error fetching sequences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, service, name } = body;

    if (!leadId || !service) {
      return NextResponse.json({ error: 'Missing required fields: leadId, service' }, { status: 400 });
    }

    const sequence = createSequence(leadId, service, name || `${service} email sequence`);
    return NextResponse.json({ success: true, sequence });
  } catch (error) {
    console.error('Error creating sequence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields: id, status' }, { status: 400 });
    }

    const sequence = updateSequenceStatus(id, status);
    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, sequence });
  } catch (error) {
    console.error('Error updating sequence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}