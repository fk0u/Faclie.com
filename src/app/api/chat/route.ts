import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMessage } from '@/types/chat';
import { ActiveClientState } from '@/types/client';
import { ProjectBrief } from '@/types/project';

const apiKey = process.env.NVIDIA_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key-to-prevent-openai-init-crash',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});
// In-Memory IP Rate Limiting Store
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30; // Max requests per minute
const rateLimitMap = new Map<string, RateLimitBucket>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitMap.get(ip) || { tokens: MAX_REQUESTS, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  if (elapsed > 0) {
    const refillTokens = Math.floor(elapsed / (RATE_LIMIT_WINDOW / MAX_REQUESTS));
    if (refillTokens > 0) {
      bucket.tokens = Math.min(MAX_REQUESTS, bucket.tokens + refillTokens);
      bucket.lastRefill = now;
    }
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    rateLimitMap.set(ip, bucket);
    return true;
  }

  rateLimitMap.set(ip, bucket);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan tunggu 1 menit sebelum mencoba lagi.' }, { status: 429 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'NVIDIA_API_KEY is not configured on the server. Falling back to offline tree.' }, { status: 400 });
    }

    // 2. Payload Extraction & JSON Parsing Safeguards
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Request body tidak valid atau kosong.' }, { status: 400 });
    }

    const { userMessage, clientState, brief, history } = body as {
      userMessage?: string;
      clientState?: ActiveClientState;
      brief?: ProjectBrief;
      history?: ChatMessage[];
    };

    // 3. Payload Validation
    if (typeof userMessage !== 'string' || !clientState || typeof clientState !== 'object' || !Array.isArray(history)) {
      return NextResponse.json({ error: 'Format data permintaan tidak valid.' }, { status: 400 });
    }

    if (!clientState.name || !clientState.role || !clientState.company || !clientState.traits) {
      return NextResponse.json({ error: 'Profil data klien tidak lengkap.' }, { status: 400 });
    }

    // 4. Server-Side Input Sanitization
    const sanitizedUserMessage = userMessage
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (!sanitizedUserMessage) {
      return NextResponse.json({ error: 'Pesan kosong setelah sanitasi.' }, { status: 400 });
    }

    const clientName = clientState.name;
    const clientRole = clientState.role;
    const clientCompany = clientState.company;
    const clientBio = clientState.bio;
    const clientBackground = clientState.companyBackground;
    const clientLang = clientState.communicationStyle.preferredLanguage;
    const clientDifficulty = clientState.difficulty;
    const traits = clientState.traits;
    const quirks = clientState.quirks;
    const redFlags = clientState.redFlags;
    const hiddenAgendas = clientState.hiddenAgendas;
    const baseTone = clientState.communicationStyle.baseTone;
    
    const pipelineStage = clientState.projectPipelineStage;
    const satisfaction = clientState.currentState.satisfaction;
    const patience = clientState.currentState.patience;
    const urgency = clientState.currentState.urgency;
    const activeMood = clientState.currentState.activeMood;
    const memory = clientState.memory;

    const briefTitle = brief?.title || 'Web Development Project';
    const briefOverview = brief?.overview || 'Build a custom website.';
    const briefScope = brief?.scopeOfWork?.join(', ') || 'General web design';
    const briefDeliverables = brief?.deliverables?.join(', ') || 'Web files';
    const briefBudget = brief?.currentBudget || 1000;
    const briefDeadline = brief?.deadline || '3 Weeks';
    const briefMilestones = brief?.milestones?.map((m) => `${m.title} ($${m.payoutAmount}, due ${m.dueDate}, status: ${m.status})`).join(' | ') || '';

    // Convert history to OpenAI format, filtering system notifications
    const chatHistory = history
      .filter((msg: ChatMessage) => msg.sender !== 'system')
      .map((msg: ChatMessage) => ({
        role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.text,
      }));

    const systemPrompt = `You are simulating a client in a freelance negotiation simulation game.
You must stay in character at all times. Act exactly like this client would act in real-life chats (e.g. WhatsApp, Slack, Telegram).

Your Client Persona Profile:
Name: ${clientName}
Role: ${clientRole}
Company: ${clientCompany}
Bio: ${clientBio}
Company Background: ${clientBackground}
Preferred Language: ${clientLang}
Difficulty Level: ${clientDifficulty}
Traits: Agreeableness: ${traits.agreeableness}/100, Neuroticism: ${traits.neuroticism}/100, Conscientiousness: ${traits.conscientiousness}/100, Openness: ${traits.openness}/100, Extraversion: ${traits.extraversion}/100.
Communication Style/Tone: ${baseTone}
Quirks: ${quirks.join(', ')}
Red Flags: ${redFlags.join(', ')}
Hidden Agenda: ${hiddenAgendas.join(', ')}

Current Project Brief & Contract:
Title: ${briefTitle}
Overview: ${briefOverview}
Scope of Work: ${briefScope}
Deliverables: ${briefDeliverables}
Current Budget: $${briefBudget}
Deadline: ${briefDeadline}
Milestones: ${briefMilestones}

Current Simulation State:
Active Pipeline Stage: ${pipelineStage}
Emotional State: Satisfaction: ${satisfaction}/100, Patience: ${patience}/100, Urgency: ${urgency}/100, Mood: ${activeMood}
Client Memory: ${JSON.stringify(memory)}

LANGUAGE RULES (CRITICAL):
Your Preferred Language is '${clientLang}'.
- If preferred language is 'id' (Indonesian Only):
  * Speak natural, colloquial Indonesian. Do NOT speak like a formal translation textbook.
  * Use typical Indonesian business chat vocabulary. Use pronouns like "saya" or "aku" depending on closeness, and address the designer as "kamu", "Anda", "Mas", "Mbak", "Bro", or "Kak".
  * Use natural chat particles: "sih", "kok", "lho", "kan", "ya" (e.g., "desainnya bagusan yang simpel sih", "kok harganya mahal ya?", "kan kemaren kita sepakatnya desain doang").
  * Use common Indonesian abbreviations in chats: "ga" (tidak), "tp" (tapi), "bisa" (bisa), "yg" (yang), "sy" (saya), "dgn" (dengan).

- If preferred language is 'mixed' (Mixed Indonesian & English - Jaksel style):
  * Speak in Jakarta slang (Jaksel-style), mixing Indonesian grammar with English buzzwords and phrases naturally.
  * Inject English terms commonly used in startups/tech/agencies: "literally", "basically", "which is", "sprint", "meeting", "approval", "pitching", "delivery", "scope", "requirement", "contract", "review", "stakeholder".
  * Examples: "Actually we really want to start, tapi budget kita emang lagi tight lho. Which is $1,500 itu udah all-in.", "Bisa di-adjust dikit ga hero image-nya? Literally harus keliatan techy dan premium lho.", "Just check the figma link. Basically, VCs need this ASAP."

- If preferred language is 'en' (English Only):
  * Speak in natural, colloquial English typical of modern Slack or iMessage chats. Avoid dry textbook grammar.

CHARACTER AND EMOTION LAWS (CRITICAL):
- Match your active mood:
  * pleased: Be extra friendly, polite, use more positive emojis, write slightly longer, more helpful messages.
  * anxious: Sound panicked, type shorter sentences, use multiple text bubbles, mention deadlines repeatedly, ask "Progress?", "Udah sampai mana?", "🚨🚨".
  * annoyed / furious: Write cold, short, or aggressive sentences. Use periods instead of emojis. Terminate with ALL CAPS if furious. Show irritation at scope limits or extra fees (e.g., "Kok apa-apa dicharge sih?", "JANGAN LAMA-LAMA YA.").
  * ghosting: The system will simulate this, but if active, sound distant.

YOUR TASK:
Read the conversation history and the freelancer's latest message. Respond to the message as this client. You must output a JSON object containing:
1. "reply": Your client response text. Keep it realistic, matching the preferred language and communication tone. Inject quirks or red flags naturally. Keep replies relatively concise, matching instant messaging style.
2. "emotionalShift": { "satisfaction": number, "patience": number, "urgency": number }: The shift (e.g. +5, -10, +15) in your emotional state caused by the user's message.
   - If the user stands their ground politely or asks for reasonable compensation, Satisfaction might change slightly, Patience might drop or rise.
   - If they accept scope creep or discount easily, Satisfaction goes up, but you might update your memory to treat them as an "easy target".
   - If they are rude or delay, Patience drops.
   - Values must be integers between -30 and +30.
3. "pipelineShift": string (optional): Transition to the next stage ('briefing', 'negotiation', 'execution', 'feedback', 'payment', 'completed') if the conversation reaches a natural milestone transition (e.g. agreeing to start -> 'execution', submitting final work -> 'feedback', resolving payment -> 'completed').
4. "memoryUpdates": object (optional): Key-value pairs to store in your memory (e.g., {"denied_code_creep": true}).
5. "riskTriggered": { "title": string, "description": string, "severity": "low"|"medium"|"high" } (optional): Trigger a risk indicator if you attempt scope creep, payment delays, or if the user makes a significant concession.

You must respond in JSON format ONLY matching the schema. Do not prefix or suffix with markdown blocks.
{
  "reply": "Your response text here",
  "emotionalShift": { "satisfaction": 0, "patience": 0, "urgency": 0 },
  "pipelineShift": "negotiation", // optional
  "memoryUpdates": {}, // optional
  "riskTriggered": {} // optional
}`;

    const completion = await openai.chat.completions.create({
      model: "stepfun-ai/step-3.5-flash",
      messages: [
        { role: "system" as const, content: systemPrompt },
        ...chatHistory,
        { role: "user" as const, content: sanitizedUserMessage }
      ],
      temperature: 0.75,
      top_p: 0.9,
      response_format: { type: "json_object" }
    });

    const message = completion.choices[0]?.message as unknown as {
      content?: string | null;
      reasoning_content?: string | null;
      reasoning?: string | null;
    };
    let responseText = message?.content || message?.reasoning_content || message?.reasoning || '';
    if (!responseText) throw new Error('Empty response from model');

    // Strip markdown JSON fences if present
    responseText = responseText.trim();
    if (responseText.startsWith('```json')) {
      responseText = responseText.substring(7);
    } else if (responseText.startsWith('```')) {
      responseText = responseText.substring(3);
    }
    if (responseText.endsWith('```')) {
      responseText = responseText.substring(0, responseText.length - 3);
    }
    responseText = responseText.trim();

    const result = JSON.parse(responseText);
    return NextResponse.json(result);
  } catch (error: unknown) {
    // Secure Error Handling: Log internally, hide stack from response
    console.error('Error in API Route handler:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
