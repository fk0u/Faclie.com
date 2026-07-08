import { NextResponse } from 'next/server';

export async function GET() {
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const customKey = process.env.LLM_API_KEY;
  const provider = process.env.LLM_PROVIDER;

  let activeProvider = 'none';
  let modelName = 'local-tree';
  let isOnline = false;

  if (provider) {
    activeProvider = provider;
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'custom-model';
  } else if (nvidiaKey) {
    activeProvider = 'nvidia';
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'stepfun-ai/step-3.5-flash';
  } else if (openaiKey) {
    activeProvider = 'openai';
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'gpt-4o-mini';
  } else if (geminiKey) {
    activeProvider = 'gemini';
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'gemini-1.5-flash';
  } else if (groqKey) {
    activeProvider = 'groq';
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
  } else if (customKey) {
    activeProvider = 'custom';
    isOnline = true;
    modelName = process.env.LLM_MODEL || 'custom-model';
  }

  return NextResponse.json({
    online: isOnline,
    provider: activeProvider,
    model: modelName,
  });
}
