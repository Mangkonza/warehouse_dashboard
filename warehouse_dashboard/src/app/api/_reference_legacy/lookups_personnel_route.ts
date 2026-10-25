import { NextRequest, NextResponse } from 'next/server';
import { getAllPersonnel, searchPersonnel } from '@/lib/personnelService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const personnel = q ? searchPersonnel(q, limit) : getAllPersonnel().slice(0, limit);

    return NextResponse.json({
      status: 'success',
      total: personnel.length,
      data: personnel,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch personnel' },
      { status: 500 }
    );
  }
}
