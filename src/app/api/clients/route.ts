import { NextResponse } from 'next/server';
import { CLIENT_PERSONAS } from '@/features/clients/personas';

export async function GET() {
  // Returns raw catalog client personas metadata
  return NextResponse.json(CLIENT_PERSONAS);
}
