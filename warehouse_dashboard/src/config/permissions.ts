export type AppRole = 'user' | 'admin';

export type AppResource =
  | 'overview'
  | 'research'
  | 'academic'
  | 'publications'
  | 'service'
  | 'ip'
  | 'kpi'
  | 'personnel'
  | 'studio'
  | 'evaluation'
  | 'monitoring'
  | 'manage'
  | 'user_roles';

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  user: 1,
  admin: 2,
};

export const RESOURCE_REQUIRED_ROLE: Record<AppResource, AppRole> = {
  overview: 'user',
  research: 'user',
  academic: 'user',
  publications: 'user',
  service: 'user',
  ip: 'user',
  kpi: 'admin',
  personnel: 'user',
  studio: 'admin',
  evaluation: 'admin',
  monitoring: 'admin',
  manage: 'admin',
  user_roles: 'admin',
};

export function canAccess(role: AppRole | string = 'user', resource: AppResource): boolean {
  const normalizedRole: AppRole = role === 'admin' ? 'admin' : 'user';
  const requiredRole = RESOURCE_REQUIRED_ROLE[resource] || 'user';
  return ROLE_HIERARCHY[normalizedRole] >= ROLE_HIERARCHY[requiredRole];
}

export const ROLE_LABELS_TH: Record<AppRole, string> = {
  user: 'ผู้ใช้งานทั่วไป',
  admin: 'ผู้ดูแลระบบ (Admin)',
};
