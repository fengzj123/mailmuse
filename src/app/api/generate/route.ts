import { generateEmail } from '@/lib/qwen';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, recipientRole, senderBackground, emailPurpose, tone, language } = body;

    if (!scenario || !recipientRole || !emailPurpose) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const email = await generateEmail({
      scenario,
      recipientRole,
      senderBackground,
      emailPurpose,
      tone: tone || 'formal',
      language: language || 'English',
    });

    return NextResponse.json({ email });
  } catch (error: unknown) {
    console.error('Generate email error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}
