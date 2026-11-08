import { PrismaClient } from '@prisma/client';
import { DEFAULT_KPIS, STRATEGIC_PILLARS } from '../../warehouse_dashboard/src/config/kpiConfig';
import { DEFAULT_REPORTING_ROUNDS } from '../../warehouse_dashboard/src/lib/kpiEngine';

console.log('KPI Count:', DEFAULT_KPIS.length);
console.log('Pillars Count:', STRATEGIC_PILLARS.length);
console.log('Rounds Count:', DEFAULT_REPORTING_ROUNDS.length);
