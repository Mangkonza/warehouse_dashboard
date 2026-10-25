'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Spinner } from '@/components/ui/Spinner';
import {
  RoleManagementService,
  UserRoleItem,
  RoleAuditLogItem,
  RoleApiError,
} from '@/services/roleManagement.service';
import { AppRole } from '@/config/permissions';
import {
  FaUserShield,
  FaPlus,
  FaSearch,
  FaHistory,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaSyncAlt,
  FaInfoCircle,
  FaUsers,
  FaLock,
  FaShieldAlt,
} from 'react-icons/fa';

export function UserRoleManagementTab() {
  const { user } = useAuth();
  const currentUserRole = (user?.role as AppRole) || 'user';
  const currentUsername = user?.nontriAccount?.toLowerCase().trim() || '';

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'audit'>('users');
  const [users, setUsers] = useState<UserRoleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<RoleAuditLogItem[]>([]);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<UserRoleItem | null>(null);
  const [revokingTarget, setRevokingTarget] = useState<UserRoleItem | null>(null);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await RoleManagementService.listRoles({
        search,
        role: 'admin',
        page,
        limit: 20,
      });
      setUsers(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถโหลดรายชื่อผู้ดูแลระบบได้', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, page]);

  const loadAuditLogs = useCallback(async () => {
    setIsAuditLoading(true);
    try {
      const logs = await RoleManagementService.getAuditLogs(100);
      setAuditLogs(logs);
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถโหลด Audit logs ได้', 'error');
    } finally {
      setIsAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSubTab === 'users') {
      loadUsers();
    } else {
      loadAuditLogs();
    }
  }, [activeSubTab, loadUsers, loadAuditLogs]);

  // Format date Thai
  const formatDateTH = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-[#00A651] text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? <FaUserShield /> : <FaExclamationTriangle />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'users'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FaUsers />
            <span>รายชื่อผู้ดูแลระบบ (Admin) ({total})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'audit'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FaHistory />
            <span>ประวัติการเปลี่ยนสิทธิ์ (Audit Logs)</span>
          </button>
        </div>

        {activeSubTab === 'users' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#00A651] hover:bg-[#008a43] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FaPlus />
            <span>เพิ่มผู้ดูแลระบบ</span>
          </button>
        )}
      </div>

      {/* SUBTAB 1: USERS LIST */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls bar */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยบัญชีผู้ใช้ (b...) หรือชื่อ..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadUsers}
                title="รีเฟรชข้อมูล"
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <FaSyncAlt className={`text-xs ${isLoading ? 'animate-spin' : ''}`} />
                <span>รีเฟรช</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">บัญชีผู้ใช้ (Username)</th>
                  <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3 px-4">บทบาทในระบบ</th>
                  <th className="py-3 px-4">ให้สิทธิ์โดย</th>
                  <th className="py-3 px-4">วันที่บันทึก</th>
                  <th className="py-3 px-4">หมายเหตุ</th>
                  <th className="py-3 px-4 text-center w-36">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <Spinner size="md" className="mx-auto mb-2" />
                      <p className="text-xs">กำลังโหลดข้อมูลผู้ดูแลระบบ...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      ไม่พบข้อมูลผู้ดูแลระบบตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                ) : (
                  users.map((item, idx) => {
                    const isProtectedRow = Boolean(
                      item.isProtected ||
                        item.username === 'b6520503525' ||
                        item.username === 'b0123456789'
                    );
                    const isSelfRow = item.username.toLowerCase() === currentUsername;
                    const canEdit = !isProtectedRow && !isSelfRow;
                    const canRevoke = !isProtectedRow && !isSelfRow;

                    let disableReason = '';
                    if (isProtectedRow) disableReason = 'บัญชีนี้ได้รับการปกป้อง (Protected Account) ไม่สามารถแก้ไขหรือเพิกถอนได้';
                    else if (isSelfRow) disableReason = 'ไม่สามารถแก้ไขหรือเพิกถอนสิทธิ์ของตนเองได้';

                    return (
                      <tr key={item.username} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 text-xs">
                          {(page - 1) * 20 + idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          <span>{item.username}</span>
                          {isProtectedRow && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-sans font-bold">
                              <FaShieldAlt className="text-[9px]" />
                              <span>Protected</span>
                            </span>
                          )}
                          {isSelfRow && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans font-bold">
                              บัญชีของคุณ
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {item.displayName || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <RoleBadge role={item.role} />
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                          {item.grantedBy}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">
                          {formatDateTH(item.grantedAt)}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate" title={item.note || ''}>
                          {item.note || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {canEdit ? (
                              <button
                                onClick={() => setEditingTarget(item)}
                                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="แก้ไขข้อมูลผู้ดูแลระบบ"
                              >
                                <FaEdit />
                              </button>
                            ) : (
                              <span
                                className="p-1.5 text-slate-300 cursor-not-allowed"
                                title={disableReason}
                              >
                                <FaLock className="text-xs" />
                              </span>
                            )}

                            {canRevoke ? (
                              <button
                                onClick={() => setRevokingTarget(item)}
                                className="p-1.5 rounded-md hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                                title="เพิกถอนสิทธิ์ผู้ดูแลระบบ"
                              >
                                <FaTrash />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/30">
              <span>
                แสดง {users.length > 0 ? (page - 1) * 20 + 1 : 0} ถึง {Math.min(page * 20, total)} จากทั้งหมด {total} บัญชี
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  ก่อนหน้า
                </button>
                <span className="font-semibold text-slate-700">
                  หน้า {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
              <FaHistory className="text-slate-500" />
              <span>ประวัติการเปลี่ยนแปลงสิทธิ์ (100 รายการล่าสุด - อ่านอย่างเดียว)</span>
            </div>
            <button
              onClick={loadAuditLogs}
              title="รีเฟรชประวัติ"
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
            >
              <FaSyncAlt className={`text-xs ${isAuditLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">วันและเวลา</th>
                  <th className="py-3 px-4">ผู้ดำเนินการ (Actor)</th>
                  <th className="py-3 px-4">การดำเนินการ (Action)</th>
                  <th className="py-3 px-4">ผู้ใช้เป้าหมาย (Target)</th>
                  <th className="py-3 px-4">บทบาทเดิม</th>
                  <th className="py-3 px-4">บทบาทใหม่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isAuditLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Spinner size="md" className="mx-auto mb-2" />
                      <p className="text-xs">กำลังโหลดประวัติการเปลี่ยนสิทธิ์...</p>
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      ยังไม่มีประวัติการเปลี่ยนแปลงสิทธิ์ในระบบ
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, idx) => {
                    let actionBadge = (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    );
                    if (log.action === 'GRANT_ROLE') {
                      actionBadge = (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                          เพิ่มสิทธิ์
                        </span>
                      );
                    } else if (log.action === 'CHANGE_ROLE' || log.action === 'UPDATE_ROLE') {
                      actionBadge = (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                          แก้ไขข้อมูล
                        </span>
                      );
                    } else if (log.action === 'REVOKE_ROLE') {
                      actionBadge = (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                          เพิกถอนสิทธิ์
                        </span>
                      );
                    }

                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 text-xs">{idx + 1}</td>
                        <td className="py-3 px-4 text-slate-600 text-xs whitespace-nowrap">
                          {formatDateTH(log.createdAt)}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          {log.actorUsername}
                        </td>
                        <td className="py-3 px-4">{actionBadge}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {log.targetUsername}
                        </td>
                        <td className="py-3 px-4">
                          {log.oldRole ? <RoleBadge role={log.oldRole} short /> : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="py-3 px-4">
                          <RoleBadge role={log.newRole} short />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN */}
      {isAddModalOpen && (
        <AddRoleModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            showToast('เพิ่มผู้ดูแลระบบเรียบร้อยแล้ว');
            loadUsers();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('ku_roles_updated'));
            }
          }}
        />
      )}

      {/* MODAL: EDIT ADMIN */}
      {editingTarget && (
        <EditRoleModal
          target={editingTarget}
          onClose={() => setEditingTarget(null)}
          onSuccess={() => {
            setEditingTarget(null);
            showToast(`แก้ไขข้อมูลของ ${editingTarget.username} สำเร็จ`);
            loadUsers();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('ku_roles_updated'));
            }
          }}
        />
      )}

      {/* MODAL: CONFIRM REVOKE */}
      {revokingTarget && (
        <ConfirmRevokeModal
          target={revokingTarget}
          onClose={() => setRevokingTarget(null)}
          onSuccess={() => {
            setRevokingTarget(null);
            showToast(`เพิกถอนสิทธิ์ผู้ดูแลระบบของ ${revokingTarget.username} เรียบร้อยแล้ว`);
            loadUsers();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('ku_roles_updated'));
            }
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODALS
// -------------------------------------------------------------

function AddRoleModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normUsername = username.toLowerCase().trim();
    if (!normUsername) {
      setError('กรุณาระบุบัญชีผู้ใช้');
      return;
    }

    if (!normUsername.startsWith('b') || normUsername.length !== 11) {
      setError('บัญชีผู้ใช้ต้องขึ้นต้นด้วย b ตามด้วยตัวเลข 10 หลัก (เช่น b6520503525)');
      return;
    }

    setIsSubmitting(true);
    try {
      await RoleManagementService.grantRole({
        username: normUsername,
        role: 'admin',
        displayName: displayName.trim() || undefined,
        note: note.trim() || undefined,
      });
      onSuccess();
    } catch (err: any) {
      if (err instanceof RoleApiError && err.status === 409) {
        setError('บัญชีนี้ได้รับสิทธิ์ผู้ดูแลระบบอยู่แล้ว');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaUserShield className="text-[#00A651]" />
            <span>เพิ่มผู้ดูแลระบบ (Admin)</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
            &times;
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              บัญชีผู้ใช้งาน (Nontri Account / Username) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น b6520503525"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#00A651] focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              * ต้องขึ้นต้นด้วย b ตามด้วยตัวเลข 10 หลัก
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อ - นามสกุล (ถ้ามี)
            </label>
            <input
              type="text"
              placeholder="เช่น นายทดสอบ ระบบดี"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00A651] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              บทบาทที่จะได้รับ
            </label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">สิทธิ์ผู้ดูแลระบบ (Admin)</span>
              <RoleBadge role="admin" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุ / บันทึกการให้สิทธิ์ (ถ้ามี)
            </label>
            <textarea
              rows={2}
              placeholder="ระบุเหตุผล เช่น เจ้าหน้าที่ผู้ดูแลระบบประจำภาควิชา..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00A651] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#00A651] hover:bg-[#008a43] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <Spinner size="sm" /> : <FaPlus className="text-xs" />}
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditRoleModal({
  target,
  onClose,
  onSuccess,
}: {
  target: UserRoleItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [displayName, setDisplayName] = useState(target.displayName || '');
  const [note, setNote] = useState(target.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await RoleManagementService.changeRole(target.username, {
        role: 'admin',
        displayName: displayName.trim() || undefined,
        note: note.trim() || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถแก้ไขข้อมูลได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FaEdit className="text-blue-600" />
            <span>แก้ไขข้อมูลผู้ดูแลระบบ: {target.username}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">
            &times;
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">บทบาท:</span>
              <div className="mt-1">
                <RoleBadge role={target.role} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-slate-500">สถานะบัญชี:</span>
              <div className="mt-1 font-mono font-bold text-slate-700">
                {target.isProtected ? 'Protected Admin' : 'Admin'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่อ - นามสกุล
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00A651] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุ / บันทึกการเปลี่ยนแปลง
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00A651] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <Spinner size="sm" /> : <FaEdit className="text-xs" />}
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmRevokeModal({
  target,
  onClose,
  onSuccess,
}: {
  target: UserRoleItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRevoke = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await RoleManagementService.revokeRole(target.username);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเพิกถอนสิทธิ์');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-3 bg-rose-100 rounded-full">
            <FaTrash className="text-lg" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">ยืนยันการเพิกถอนสิทธิ์ผู้ดูแลระบบ</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          คุณแน่ใจหรือไม่ว่าต้องการเพิกถอนสิทธิ์ผู้ดูแลระบบของ{' '}
          <strong className="text-slate-900 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            {target.username}
          </strong>{' '}
          {target.displayName ? `(${target.displayName})` : ''}?
        </p>

        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-6 text-xs text-slate-600 space-y-1.5">
          <p className="flex items-center gap-2">
            <span>• บทบาทปัจจุบัน:</span>
            <RoleBadge role={target.role} short />
          </p>
          <p className="text-slate-500">
            • เมื่อเพิกถอนสิทธิ์ บัญชีนี้จะถูกปรับสถานะเป็น <b>ผู้ใช้งานทั่วไป (User)</b> โดยอัตโนมัติ และจะไม่สามารถเข้าถึงหน้าจัดการข้อมูลหรือหน้าสำหรับผู้ดูแลระบบได้อีก
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleRevoke}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Spinner size="sm" /> : <FaTrash className="text-xs" />}
            <span>ยืนยันเพิกถอนสิทธิ์</span>
          </button>
        </div>
      </div>
    </div>
  );
}
