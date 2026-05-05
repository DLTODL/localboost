import { NextResponse } from 'next/server'
import { getLeads, addLead, updateLeadStatus } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { status, startDate, endDate } = body
    
    let leads = getLeads()
    
    // Apply filters
    if (status && status !== 'all') {
      leads = leads.filter(l => l.status === status)
    }
    
    // Date range filter
    if (startDate) {
      leads = leads.filter(l => new Date(l.created_at) >= new Date(startDate))
    }
    if (endDate) {
      leads = leads.filter(l => new Date(l.created_at) <= new Date(endDate))
    }
    
    // Calculate stats
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      won: leads.filter(l => l.status === 'won').length,
      lost: leads.filter(l => l.status === 'lost').length,
      avgResponseTime: '2.4 uur', // Mock for now
      conversionRate: leads.length > 0 ? ((leads.filter(l => l.status === 'won').length / leads.length) * 100).toFixed(1) + '%' : '0%'
    }
    
    return NextResponse.json({ leads, stats })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to filter leads' }, { status: 500 })
  }
}