import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backendUrl';
import { aggregateSdgsData, SdgFilterParams } from '@/lib/sdgAggregationService';

export const dynamic = 'force-dynamic';

async function fetchFromBackend(endpoint: string): Promise<any | null> {
  const candidates = [
    getBackendUrl(),
    'http://backend:8000',
    'http://ku_warehouse_backend:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
  ];
  const uniqueCandidates = Array.from(new Set(candidates.filter(Boolean)));

  for (const base of uniqueCandidates) {
    try {
      const cleanBase = base.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
      const res = await fetch(`${cleanBase}${endpoint}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

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
          const json = await fetchFromBackend(`/api/v1/data/${cat}`);
          if (json && Array.isArray(json.data)) {
            customDatasets[cat] = json.data;
          } else {
            customDatasets[cat] = [];
          }
        } catch (e) {
          console.error(`[API /api/sdgs/aggregation] Error fetching data for ${cat}:`, e);
          customDatasets[cat] = [];
        }
      }),
      (async () => {
        try {
          const json = await fetchFromBackend('/api/v1/evaluation');
          if (json && Array.isArray(json.data)) {
            const map: Record<string, any> = {};
            json.data.forEach((ev: any) => {
              if (ev && ev.id) map[ev.id] = ev;
              if (ev && ev.category && ev.record_id) {
                map[`${ev.category.toLowerCase()}_${ev.record_id}`] = ev;
              }
            });
            customEvaluations = map;
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
