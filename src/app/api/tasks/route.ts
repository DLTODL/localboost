import { NextResponse } from 'next/server';
import { getTasks, addTask, generateTasksForLead } from '@/lib/tasks';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId') ? parseInt(searchParams.get('leadId')!) : undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const tasks = getTasks({ leadId, status, category });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, title, description, category, priority, status, dueDate, generateForService } = body;

    // If generateForService is provided, generate tasks from template
    if (generateForService && leadId) {
      const tasks = generateTasksForLead(leadId, generateForService);
      return NextResponse.json({ 
        success: true, 
        message: `Generated ${tasks.length} tasks for service: ${generateForService}`,
        tasks 
      });
    }

    // Validate required fields for single task creation
    if (!title || !category || !priority) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = addTask({
      leadId: leadId || 0,
      title,
      description: description || '',
      category,
      priority,
      status: status || 'pending',
      dueDate
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}