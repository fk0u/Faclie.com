import { NextResponse } from 'next/server';
import { INITIAL_BRIEFS } from '@/store/useProjectStore';

export async function GET() {
  // Returns raw brief specifications catalog
  return NextResponse.json(INITIAL_BRIEFS);
}
