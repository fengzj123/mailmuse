import { generateEmail } from '@/lib/qwen';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isUserPro, checkAndIncrementDailyUsage } from '@/lib/db';

const FREE_DAILY_LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to generate emails' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Check subscription status
    const isPro = await isUserPro(userEmail);

    // Check and increment daily usage for free users
    if (!isPro) {
      const { allowed, remaining, todayUsage } = await checkAndIncrementDailyUsage(userEmail, FREE_DAILY_LIMIT);

      if (!allowed) {
        return NextResponse.json(
          {
            error: 'Daily limit reached. Please upgrade to Pro for unlimited emails.',
            dailyLimit: FREE_DAILY_LIMIT,
            usedToday: todayUsage,
            remaining: 0,
          },
          { status: 403 }
        );
      }
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
