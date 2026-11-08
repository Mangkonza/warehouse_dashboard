import { NextRequest, NextResponse } from 'next/server';
import { bulkSaveEvaluations } from '@/lib/serverDataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'กรุณาส่งรายการที่ต้องการประเมิน' },
        { status: 400 }
      );
    }

    const savedList = bulkSaveEvaluations(body.items);

    return NextResponse.json({
      status: 'success',
      message: `ประเมินรายการที่เลือกสำเร็จ (${savedList.length} รายการ)`,
      total: savedList.length,
      data: savedList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to bulk save evaluations' },
      { status: 500 }
    );
  }
}
