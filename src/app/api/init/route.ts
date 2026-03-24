import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Database init error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
