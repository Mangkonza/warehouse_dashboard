import { NextRequest, NextResponse } from 'next/server';
import {
  readEvaluations,
  getEvaluation,
  saveEvaluation,
  migrateExistingEvaluations,
} from '@/lib/serverDataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const recordId = searchParams.get('record_id');

    // Run migration check once on query if needed
    if (searchParams.get('migrate') === 'true') {
      const mig = migrateExistingEvaluations();
      return NextResponse.json({ status: 'success', migrated: mig });
    }

    if (category && recordId) {
      const single = getEvaluation(category, recordId);
      return NextResponse.json({
        status: 'success',
        data: single,
      });
    }

    const all = readEvaluations();
    let list = Object.values(all);

    if (category) {
      const catLower = category.toLowerCase();
      list = list.filter((item) => item.category.toLowerCase() === catLower);
    }

    return NextResponse.json({
      status: 'success',
      total: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.category || !body.record_id) {
      return NextResponse.json(
        { status: 'error', message: 'กรุณาระบุหมวดหมู่และรหัสรายการ' },
        { status: 400 }
      );
    }

    // Save and compute evaluation status
    const saved = saveEvaluation(body);

    return NextResponse.json({
      status: 'success',
      message: 'บันทึกการประเมินเรียบร้อยแล้ว',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save evaluation' },
      { status: 500 }
    );
  }
}
