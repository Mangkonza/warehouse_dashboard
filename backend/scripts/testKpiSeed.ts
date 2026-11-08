import { PrismaClient } from '@prisma/client';
import { DEFAULT_KPIS, STRATEGIC_PILLARS } from '../../frontend/src/config/kpiConfig';
import { DEFAULT_REPORTING_ROUNDS } from '../../frontend/src/lib/kpiEngine';

console.log('KPI Count:', DEFAULT_KPIS.length);
console.log('Pillars Count:', STRATEGIC_PILLARS.length);
console.log('Rounds Count:', DEFAULT_REPORTING_ROUNDS.length);
