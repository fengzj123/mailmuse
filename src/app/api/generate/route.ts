import { generateEmail } from '@/lib/qwen';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isUserPro } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to generate emails' },
        { status: 401 }
      );
    }

    // Check subscription status
    const isPro = await isUserPro(session.user.email);

    if (!isPro) {
      return NextResponse.json(
        { error: 'Free limit reached. Please upgrade to Pro for unlimited emails.' },
        { status: 403 }
      );
    }

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

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate email: ${message}` },
      { status: 500 }
    );
  }
}
