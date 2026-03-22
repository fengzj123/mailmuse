import OpenAI from 'openai';

function getClient() {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY environment variable is not set');
  }

  return new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: apiKey,
  });
}

export async function generateEmail(params: {
  scenario: string;
  recipientRole: string;
  senderBackground: string;
  emailPurpose: string;
  tone: string;
  language: string;
}) {
  const { scenario, recipientRole, senderBackground, emailPurpose, tone, language } = params;

  const toneInstructions = {
    formal: 'Use formal, professional language with proper greetings and sign-offs',
    casual: 'Use friendly, conversational tone while remaining professional',
    friendly: 'Use warm, approachable language with slight casualness',
  };

  const languageInstruction = language !== 'English'
    ? `Write the email in ${language}.`
    : '';

  const prompt = `You are a professional email writer. Write a ${tone} email for the following scenario:

Scenario: ${scenario}
Recipient: ${recipientRole}
Sender Background: ${senderBackground}
Email Purpose: ${emailPurpose}

Requirements:
- ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.formal}
- ${languageInstruction}
- Length: Short to medium (1-3 paragraphs)
- Include a clear subject line (prefix with "Subject: ")
- Include a professional greeting
- Include a sign-off
- Focus on the core purpose without fluff

Output ONLY the email with subject line, no explanations or additional text.`;

  const client = getClient();

  try {
    const response = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writing assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
