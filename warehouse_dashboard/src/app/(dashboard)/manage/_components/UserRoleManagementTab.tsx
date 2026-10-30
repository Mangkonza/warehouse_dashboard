'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { Spinner } from '@/components/ui/Spinner';
import { TopSegmentedTabs, TabItem } from '@/components/ui/TopSegmentedTabs';
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
  FaTrashAlt,
  FaExclamationTriangle,
  FaSyncAlt,
  FaInbox,
} from 'react-icons/fa';

export function UserRoleManagementTab() {
  const { user } = useAuth();
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
        role: 'all',
        page,
        limit: 20,
      });
      setUsers(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถโหลดรายชื่อผู้เข้าใช้งานได้', 'error');
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
      showToast(err.message || 'ไม่สามารถโหลดประวัติการเปลี่ยนสิทธิ์ได้', 'error');
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

  const roleTabs: TabItem<'users' | 'audit'>[] = [
    { key: 'users', label: 'รายชื่อผู้ดูแลระบบ', count: total },
    { key: 'audit', label: 'ประวัติการเปลี่ยนสิทธิ์', count: auditLogs.length > 0 ? auditLogs.length : undefined },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

      {/* Top Segmented Tabs (เหมือนหน้า ระบบจัดการข้อมูล ไม่มี Card ล้อมรอบ) */}
      <div style={{ width: '100%' }}>
        <TopSegmentedTabs
          activeCategory={activeSubTab}
          onSelectCategory={setActiveSubTab}
          tabs={roleTabs}
        />
      </div>

      {/* SUBTAB 1: USERS LIST (Single Card เหมือนหน้า ระบบจัดการข้อมูล) */}
      {activeSubTab === 'users' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Action & Filter Bar */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* ซ้าย: ช่องค้นหา */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 12px',
                width: '100%',
                maxWidth: '280px',
                minWidth: '180px',
              }}
            >
              <FaSearch style={{ color: '#94a3b8', marginRight: '8px', fontSize: '13px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="ค้นหาด้วยบัญชีผู้ใช้ (b...) หรือชื่อ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  color: '#1e293b',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0 4px',
                    fontSize: '15px',
                  }}
                  title="ล้างคำค้นหา"
                >
                  &times;
                </button>
              )}
            </div>

            {/* ขวา: ปุ่มรีเฟรช และ ปุ่มเพิ่มผู้ดูแลระบบ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={loadUsers}
                title="รีเฟรชข้อมูล"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <FaSyncAlt className={isLoading ? 'animate-spin' : ''} style={{ fontSize: '12px', color: '#64748b' }} />
                <span>รีเฟรช</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #00A651',
                  backgroundColor: '#00A651',
                  color: '#ffffff',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <FaPlus style={{ fontSize: '11px' }} />
                <span>เพิ่มผู้ดูแลระบบ</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ width: '64px', textAlign: 'center', padding: '10px 12px' }}>ลำดับที่</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>บัญชีผู้ใช้เครือข่ายนนทรี</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>ชื่อ - นามสกุล</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>บทบาทในระบบ</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>ให้สิทธิ์โดย</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>วันที่บันทึก</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>หมายเหตุ</th>
                  <th style={{ width: '90px', textAlign: 'center', padding: '10px 12px' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <Spinner size="md" className="mx-auto mb-2" />
                      <p className="text-xs">กำลังโหลดข้อมูลผู้เข้าใช้งาน...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                      <FaInbox style={{ fontSize: '32px', color: '#cbd5e1', margin: '0 auto 8px auto', display: 'block' }} />
                      <span style={{ fontSize: '14px' }}>ไม่พบรายการผู้เข้าใช้งานที่ตรงกับเงื่อนไขการค้นหา</span>
                    </td>
                  </tr>
                ) : (
                  users.map((item, idx) => {
                    const isSelfRow = item.username.toLowerCase() === currentUsername;

                    return (
                      <tr
                        key={item.username}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                          transition: 'background-color 0.15s ease',
                        }}
                        className="hover:!bg-[#f0fbf5]"
                      >
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontSize: '12.5px' }}>
                          {(page - 1) * 20 + idx + 1}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500, color: '#0f172a', fontFamily: 'monospace' }}>
                          <span>{item.username}</span>
                          {isSelfRow && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans font-bold">
                              บัญชีของคุณ
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#334155' }}>
                          {item.displayName || '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div className="flex justify-center">
                            <RoleBadge role={item.role} />
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', fontSize: '12.5px' }}>
                          {item.grantedBy}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                          {formatDateTH(item.grantedAt)}
                        </td>
                        <td
                          style={{
                            padding: '10px 12px',
                            textAlign: 'center',
                            color: '#64748b',
                            fontSize: '12.5px',
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={item.note || ''}
                        >
                          {item.note || '-'}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => setEditingTarget(item)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#e5a812',
                              cursor: 'pointer',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '13px',
                              transition: 'background-color 0.15s',
                            }}
                            title="แก้ไขข้อมูลและระดับสิทธิ์ (Admin / User)"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef3c7')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (isSelfRow) {
                                showToast('ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้', 'error');
                                return;
                              }
                              setRevokingTarget(item);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: isSelfRow ? 'not-allowed' : 'pointer',
                              opacity: isSelfRow ? 0.35 : 1,
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '13px',
                              marginLeft: '2px',
                              transition: 'background-color 0.15s',
                            }}
                            title={isSelfRow ? 'ไม่สามารถลบบัญชีของตนเองที่กำลังใช้งานอยู่ได้' : 'ลบรายการ / เพิกถอนสิทธิ์'}
                            onMouseEnter={(e) => {
                              if (!isSelfRow) e.currentTarget.style.backgroundColor = '#fee2e2';
                            }}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <FaTrashAlt />
                          </button>
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

      {/* SUBTAB 2: AUDIT LOGS (Single Card เหมือนหน้า ระบบจัดการข้อมูล) */}
      {activeSubTab === 'audit' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
              <FaHistory className="text-[#00A651]" />
              <span>ประวัติการเปลี่ยนแปลงสิทธิ์</span>
            </div>
            <button
              type="button"
              onClick={loadAuditLogs}
              title="รีเฟรชประวัติ"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <FaSyncAlt className={isAuditLoading ? 'animate-spin' : ''} style={{ fontSize: '12px', color: '#64748b' }} />
              <span>รีเฟรช</span>
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  <th style={{ width: '64px', textAlign: 'center', padding: '10px 12px' }}>ลำดับที่</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>วันและเวลา</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>ผู้ดำเนินการ</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>การดำเนินการ</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>ผู้ใช้เป้าหมาย</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>บทบาทเดิม</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>บทบาทใหม่</th>
                </tr>
              </thead>
              <tbody>
                {isAuditLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Spinner size="md" className="mx-auto mb-2" />
                      <p className="text-xs">กำลังโหลดประวัติการเปลี่ยนสิทธิ์...</p>
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
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
                          แก้ไขข้อมูล/ระดับสิทธิ์
                        </span>
                      );
                    } else if (log.action === 'REVOKE_ROLE') {
                      actionBadge = (
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                          ลบรายการ/เพิกถอนสิทธิ์
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={log.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                        }}
                        className="hover:!bg-[#f0fbf5]"
                      >
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontSize: '12.5px' }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#475569', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                          {formatDateTH(log.createdAt)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 500, color: '#0f172a' }}>
                          {log.actorUsername}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{actionBadge}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 500, color: '#0f172a' }}>
                          {log.targetUsername}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {log.oldRole ? (
                            <div className="flex justify-center">
                              <RoleBadge role={log.oldRole} short />
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div className="flex justify-center">
                            <RoleBadge role={log.newRole} short />
                          </div>
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

      {/* MODAL: ADD USER/ADMIN */}
      {isAddModalOpen && (
        <AddRoleModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            showToast('เพิ่มผู้ใช้งานเรียบร้อยแล้ว');
            loadUsers();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('ku_roles_updated'));
            }
          }}
        />
      )}

      {/* MODAL: EDIT ROLE (รองรับการปรับลดสิทธิ์จาก Admin เป็น User ธรรมดา) */}
      {editingTarget && (
        <EditRoleModal
          target={editingTarget}
          isSelf={editingTarget.username.toLowerCase() === currentUsername}
          onClose={() => setEditingTarget(null)}
          onSuccess={() => {
            setEditingTarget(null);
            showToast(`บันทึกการเปลี่ยนแปลงของ ${editingTarget.username} สำเร็จ`);
            loadUsers();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('ku_roles_updated'));
            }
          }}
        />
      )}

      {/* MODAL: CONFIRM DELETE / REVOKE */}
      {revokingTarget && (
        <ConfirmRevokeModal
          target={revokingTarget}
          onClose={() => setRevokingTarget(null)}
          onSuccess={() => {
            setRevokingTarget(null);
            showToast(`ลบรายการของ ${revokingTarget.username} เรียบร้อยแล้ว`);
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
  const [role, setRole] = useState<AppRole>('admin');
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

    if (!/^b\d{9,10}$/.test(normUsername)) {
      setError('บัญชีผู้ใช้ต้องขึ้นต้นด้วย b ตามด้วยตัวเลข 10 หลัก (เช่น b6520503525)');
      return;
    }

    setIsSubmitting(true);
    try {
      await RoleManagementService.grantRole({
        username: normUsername,
        role,
        displayName: displayName.trim() || undefined,
        note: note.trim() || undefined,
      });
      onSuccess();
    } catch (err: any) {
      if (err instanceof RoleApiError && err.status === 409) {
        setError('บัญชีนี้ได้รับสิทธิ์ดังกล่าวอยู่แล้ว');
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
            <span>เพิ่มผู้ดูแลระบบ / กำหนดสิทธิ์ผู้ใช้</span>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              บทบาทในระบบ (Role)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  role === 'admin'
                    ? 'border-[#00A651] bg-emerald-50/70 ring-1 ring-[#00A651]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">ผู้ดูแลระบบ</div>
                  <div className="text-[11px] text-slate-500">จัดการข้อมูลและระบบได้ทั้งหมด</div>
                </div>
                <RoleBadge role="admin" />
              </button>

              <button
                type="button"
                onClick={() => setRole('user')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  role === 'user'
                    ? 'border-slate-500 bg-slate-50 ring-1 ring-slate-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">ผู้ใช้งานทั่วไป</div>
                  <div className="text-[11px] text-slate-500">ดูรายงานและแดชบอร์ด</div>
                </div>
                <RoleBadge role="user" />
              </button>
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
  isSelf,
  onClose,
  onSuccess,
}: {
  target: UserRoleItem;
  isSelf: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [role, setRole] = useState<AppRole>((target.role as AppRole) || 'admin');
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
        role,
        displayName: displayName.trim(),
        note: note.trim(),
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
            <FaEdit className="text-[#e5a812]" />
            <span>แก้ไขข้อมูลและสิทธิ์: {target.username}</span>
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              บทบาทในระบบ (Role)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={isSelf}
                onClick={() => setRole('admin')}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  role === 'admin'
                    ? 'border-[#00A651] bg-emerald-50/70 ring-1 ring-[#00A651]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                } ${isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">ผู้ดูแลระบบ</div>
                  <div className="text-[11px] text-slate-500">สิทธิ์ Admin เต็มรูปแบบ</div>
                </div>
                <RoleBadge role="admin" />
              </button>

              <button
                type="button"
                disabled={isSelf}
                onClick={() => setRole('user')}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  role === 'user'
                    ? 'border-slate-500 bg-slate-50 ring-1 ring-slate-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                } ${isSelf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">ผู้ใช้งานทั่วไป</div>
                  <div className="text-[11px] text-slate-500">ลดสิทธิ์เป็น User ธรรมดา</div>
                </div>
                <RoleBadge role="user" />
              </button>
            </div>
            {isSelf && (
              <p className="text-[11px] text-amber-600 mt-1">
                * ไม่สามารถปรับลดระดับสิทธิ์ของบัญชีที่คุณกำลังใช้งานอยู่ได้ (สามารถแก้ไขชื่อ-นามสกุลและหมายเหตุได้)
              </p>
            )}
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
              className="px-5 py-2 rounded-lg bg-[#00A651] hover:bg-[#008a43] text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
      setError(err.message || 'เกิดข้อผิดพลาดในการลบรายการ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 text-rose-600 mb-4">
          <div className="p-3 bg-rose-100 rounded-full">
            <FaTrashAlt className="text-lg" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">ยืนยันการลบรายการผู้ใช้งาน</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการและเพิกถอนสิทธิ์ของ{' '}
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
            • เมื่อลบรายการนี้ บัญชีจะถูกถอนออกจากรายชื่อผู้ดูแลระบบและกลับเป็น <b>ผู้ใช้งานทั่วไป (User)</b> ทันที
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
            {isSubmitting ? <Spinner size="sm" /> : <FaTrashAlt className="text-xs" />}
            <span>ยืนยันการลบ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
