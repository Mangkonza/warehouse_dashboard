import { NextRequest, NextResponse } from 'next/server';
import { aggregateSdgsData, SdgFilterParams } from '@/lib/sdgAggregationService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const year = searchParams.get('year') || undefined;
    const compareYearsCount = searchParams.get('compareYearsCount')
      ? parseInt(searchParams.get('compareYearsCount')!, 10)
      : 3;
    const department = searchParams.get('department') || 'all';
    const category = searchParams.get('category') || 'all';
    const strategicFilter = searchParams.get('strategicFilter') || 'all';
    const selectedSdg = searchParams.get('selectedSdg')
      ? parseInt(searchParams.get('selectedSdg')!, 10)
      : null;
    const monthFrom = searchParams.get('monthFrom')
      ? parseInt(searchParams.get('monthFrom')!, 10)
      : undefined;
    const monthTo = searchParams.get('monthTo')
      ? parseInt(searchParams.get('monthTo')!, 10)
      : undefined;

    const params: SdgFilterParams = {
      year,
      compareYearsCount,
      department,
      category,
      strategicFilter,
      selectedSdg,
      monthFrom,
      monthTo,
    };

    const result = aggregateSdgsData(params);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/sdgs/aggregation] Error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate SDG data', details: error.message },
      { status: 500 }
    );
  }
}
