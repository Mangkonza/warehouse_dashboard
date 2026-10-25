import { AppRole } from '@/config/permissions';

export interface UserRoleItem {
  username: string;
  role: AppRole;
  isProtected?: boolean;
  displayName: string | null;
  note: string | null;
  grantedBy: string;
  grantedAt: string;
}

export interface RoleAuditLogItem {
  id: string;
  actorUsername: string;
  action: string;
  targetUsername: string;
  oldRole: string | null;
  newRole: string;
  createdAt: string;
}

export class RoleApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status = 400, code?: string) {
    super(message);
    this.name = 'RoleApiError';
    this.status = status;
    this.code = code;
  }
}

export const RoleManagementService = {
  async listRoles(params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: UserRoleItem[]; total: number; page: number; limit: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.role && params.role !== 'all') query.set('role', params.role);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const res = await fetch(`/api/v1/admin/roles?${query.toString()}`, {
      credentials: 'include',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new RoleApiError(json.message || 'ไม่สามารถโหลดข้อมูลสิทธิ์ผู้ใช้ได้', res.status, json.code);
    }

    return {
      items: json.data || [],
      total: json.total || 0,
      page: json.page || 1,
      limit: json.limit || 20,
      totalPages: json.totalPages || 1,
    };
  },

  async grantRole(data: {
    username: string;
    role: AppRole;
    displayName?: string;
    note?: string;
  }): Promise<UserRoleItem> {
    const res = await fetch('/api/v1/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new RoleApiError(json.message || 'ไม่สามารถเพิ่มสิทธิ์ผู้ใช้ได้', res.status, json.code);
    }

    return json.data;
  },

  async changeRole(
    username: string,
    data: { role: AppRole; displayName?: string; note?: string }
  ): Promise<UserRoleItem> {
    const res = await fetch(`/api/v1/admin/roles/${encodeURIComponent(username)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new RoleApiError(json.message || 'ไม่สามารถแก้ไขสิทธิ์ได้', res.status, json.code);
    }

    return json.data;
  },

  async revokeRole(username: string): Promise<void> {
    const res = await fetch(`/api/v1/admin/roles/${encodeURIComponent(username)}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new RoleApiError(json.message || 'ไม่สามารถเพิกถอนสิทธิ์ได้', res.status, json.code);
    }
  },

  async getAuditLogs(limit = 100): Promise<RoleAuditLogItem[]> {
    const res = await fetch(`/api/v1/admin/roles/audit-logs?limit=${limit}`, {
      credentials: 'include',
    });

    const json = await res.json();
    if (!res.ok) {
      throw new RoleApiError(json.message || 'ไม่สามารถโหลด Audit logs ได้', res.status, json.code);
    }

    return json.data || [];
  },
};
