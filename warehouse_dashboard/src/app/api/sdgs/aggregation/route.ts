import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backendUrl';
import { aggregateSdgsData, SdgFilterParams } from '@/lib/sdgAggregationService';

export const dynamic = 'force-dynamic';

// ดึง BACKEND_URL ผ่าน helper ส่วนกลาง (throw error ใน production หากไม่ได้กำหนด)
const getBackend = () => getBackendUrl();

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

    const categoriesToFetch =
      category && category !== 'all'
        ? [category]
        : ['research', 'academic', 'publications', 'ip', 'service'];

    const customDatasets: Record<string, any[]> = {};
    let customEvaluations: Record<string, any> = {};

    await Promise.all([
      ...categoriesToFetch.map(async (cat) => {
        try {
          const res = await fetch(`${getBackend()}/api/v1/data/${cat}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            customDatasets[cat] = Array.isArray(json.data) ? json.data : [];
          }
        } catch (e) {
          console.error(`[API /api/sdgs/aggregation] Error fetching data for ${cat}:`, e);
          customDatasets[cat] = [];
        }
      }),
      (async () => {
        try {
          const res = await fetch(`${getBackend()}/api/v1/evaluation`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.data)) {
              const map: Record<string, any> = {};
              json.data.forEach((ev: any) => {
                if (ev && ev.id) map[ev.id] = ev;
                if (ev && ev.category && ev.record_id) {
                  map[`${ev.category.toLowerCase()}_${ev.record_id}`] = ev;
                }
              });
              customEvaluations = map;
            }
          }
        } catch (e) {
          console.error('[API /api/sdgs/aggregation] Error fetching evaluations:', e);
        }
      })(),
    ]);

    const result = aggregateSdgsData(params, customDatasets, customEvaluations);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/sdgs/aggregation] Error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate SDG data', details: error.message },
      { status: 500 }
    );
  }
}
