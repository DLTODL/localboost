import { NextResponse } from 'next/server'
import { getLeads, updateLeadStatus } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const leads = getLeads()
    const lead = leads.find(l => l.id === id)
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    return NextResponse.json({ lead })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { status, notes, follow_up_date } = body
    
    const leads = getLeads()
    const index = leads.findIndex(l => l.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    // Update fields
    if (status) leads[index].status = status
    if (notes !== undefined) leads[index].notes = notes
    if (follow_up_date !== undefined) leads[index].follow_up_date = follow_up_date
    leads[index].updated_at = new Date().toISOString()
    
    const fs = require('fs')
    const path = require('path')
    const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json')
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))
    
    return NextResponse.json({ success: true, lead: leads[index] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const leads = getLeads()
    const filtered = leads.filter(l => l.id !== id)
    
    const fs = require('fs')
    const path = require('path')
    const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json')
    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}