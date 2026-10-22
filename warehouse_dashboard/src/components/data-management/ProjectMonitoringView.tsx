'use client';

import React, { useState, useMemo } from 'react';
import { calculateProjectTimeline, STATUS_LABELS } from '../../lib/projectMonitoringEngine';
import { ProjectExtensionRecord, ProjectStatus, ProjectTimelineInfo } from '../../types/projectMonitoring';
import { ProjectExtensionModal } from './ProjectExtensionModal';
import { ConfirmActionModal } from '../common/ConfirmActionModal';
import {
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaHistory,
  FaCheck,
  FaArrowRight,
  FaUserTie,
  FaBuilding,
} from 'react-icons/fa';

interface ProjectMonitoringViewProps {
  projects: Record<string, any>[];
  onUpdateProject: (updated: Record<string, any>) => void;
}

export const ProjectMonitoringView: React.FC<ProjectMonitoringViewProps> = ({
  projects,
  onUpdateProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [extensionTarget, setExtensionTarget] = useState<Record<string, any> | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    detail?: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'success';
    onConfirm: () => void;
  } | null>(null);

  // Compute live timeline for each project
  const processedProjects = useMemo<(Record<string, any> & { _timeline: ProjectTimelineInfo })[]>(() => {
    return projects.map((p) => {
      const timeline = calculateProjectTimeline(p);
      return {
        ...p,
        _timeline: timeline,
      };
    });
  }, [projects]);

  // Statistics
  const stats = useMemo(() => {
    let total = processedProjects.length;
    let onTrack = 0;
    let extensionReq = 0;
    let extended = 0;
    let delayed = 0;
    let completed = 0;

    processedProjects.forEach((p) => {
      const st = p._timeline.status;
      if (st === 'active') onTrack++;
      else if (st === 'extension_requested') extensionReq++;
      else if (st === 'extended') extended++;
      else if (st === 'delayed') delayed++;
      else if (st === 'completed') completed++;
    });

    return { total, onTrack, extensionReq, extended, delayed, completed };
  }, [processedProjects]);

  // Filtered List
  const filteredList = useMemo(() => {
    return processedProjects.filter((p) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && p._timeline.status !== statusFilter) {
        return false;
      }
      // 2. Department Filter
      if (deptFilter !== 'all') {
        const d = String(p.department || '');
        if (!d.includes(deptFilter)) return false;
      }
      // 3. Search Term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = String(p.name || '').toLowerCase();
        const head = String(p.head || p.person || '').toLowerCase();
        const id = String(p.id || '').toLowerCase();
        if (!name.includes(q) && !head.includes(q) && !id.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [processedProjects, statusFilter, deptFilter, searchTerm]);

  // Handle Mark as Completed
  const handleMarkCompleted = (item: Record<string, any>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updated = {
      ...item,
      status: 'completed',
      closed_date: todayStr,
      is_completed: true,
    };
    onUpdateProject(updated);
  };

  const requestCloseProject = (item: Record<string, any>) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันการปิดโครงการวิจัย?',
      message: 'คุณต้องการเปลี่ยนสถานะโครงการเป็น "ปิดโครงการแล้ว" ใช่หรือไม่? ระบบจะบันทึกวันที่ปัจจุบันเป็นวันเสร็จสิ้นโครงการอย่างสมบูรณ์',
      detail: `โครงการ: ${item.name || item.id || ''}`,
      confirmText: 'ยืนยันปิดโครงการ',
      type: 'success',
      onConfirm: () => {
        handleMarkCompleted(item);
        setConfirmModal(null);
      },
    });
  };

  // Handle Approve Extension
  const handleApproveExtension = (item: Record<string, any>, extId: string) => {
    const exts: ProjectExtensionRecord[] = Array.isArray(item.extensions) ? [...item.extensions] : [];
    const updatedExts = exts.map((e) => {
      if (e.id === extId) {
        return { ...e, approval_status: 'approved' as const, approved_by: 'สวพ.มก.' };
      }
      return e;
    });
    const updated = {
      ...item,
      extensions: updatedExts,
      status: 'extended',
    };
    onUpdateProject(updated);
  };

  const requestApproveExtension = (item: Record<string, any>, extId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'อนุมัติการขอขยายระยะเวลาโครงการ?',
      message: 'ยืนยันมติอนุมัติการขอขยายเวลาจาก สวพ.มก. ระบบจะปรับสถานะโครงการเป็น "ขยายเวลาแล้ว" และคำนวณวันสิ้นสุดสัญญาใหม่ทันที',
      detail: `โครงการ: ${item.name || item.id || ''}`,
      confirmText: 'อนุมัติขยายเวลา',
      type: 'warning',
      onConfirm: () => {
        handleApproveExtension(item, extId);
        setConfirmModal(null);
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Summary Status Cards (Liquid Glass) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div
          onClick={() => setStatusFilter('all')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'all' ? '2px solid #00A651' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>โครงการทั้งหมด</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {stats.total} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('active')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'active' ? '2px solid #059669' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
            ดำเนินการตามแผน
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {stats.onTrack} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('extension_requested')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'extension_requested' ? '2px solid #d97706' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
            ยื่นขอขยายเวลา
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {stats.extensionReq} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('extended')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'extended' ? '2px solid #b45309' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b45309' }} />
            อยู่ระหว่างขยายเวลา
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            {stats.extended} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('delayed')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'delayed' ? '2px solid #dc2626' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
            ล่าช้ากว่ากำหนด
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {stats.delayed} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('completed')}
          className="glass-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: statusFilter === 'completed' ? '2px solid #475569' : undefined,
          }}
        >
          <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }} />
            ปิดโครงการแล้ว
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
            {stats.completed} <span style={{ fontSize: '14px', fontWeight: 500 }}>โครงการ</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="ค้นหาชื่อโครงการวิจัย, หัวหน้าโครงการ, รหัสโครงการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="glass-input"
            style={{ cursor: 'pointer', fontSize: '13px' }}
          >
            <option value="all">ทุกภาควิชา / ศูนย์</option>
            <option value="เกษตร">วิศวกรรมการเกษตร</option>
            <option value="คอมพิวเตอร์">วิศวกรรมคอมพิวเตอร์</option>
            <option value="ชลประทาน">วิศวกรรมชลประทาน</option>
            <option value="อาหาร">วิศวกรรมอาหาร</option>
            <option value="อุตสาหการ">วิศวกรรมอุตสาหการ</option>
            <option value="เครื่องกล">วิศวกรรมเครื่องกล</option>
            <option value="โยธา">วิศวกรรมโยธา</option>
            <option value="พลังงาน">ศูนย์พลังงานฯ</option>
            <option value="ประตู">ศูนย์ทดสอบประตูหน้าต่างฯ</option>
          </select>
        </div>
      </div>

      {/* 3. Project Monitoring Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredList.map((item, idx) => {
          const tl = item._timeline;
          const statusInfo = STATUS_LABELS[tl.status] || STATUS_LABELS.active;

          return (
            <div
              key={item._id || item.id || idx}
              className="glass-card"
              style={{
                padding: '20px 24px',
                borderLeft: `5px solid ${statusInfo.color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Row 1: Code, Status & Remaining Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {item.id || `P-${idx + 1}`}
                  </span>
                  <span
                    style={{
                      padding: '3px 12px',
                      borderRadius: '20px',
                      background: statusInfo.bg,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.border}`,
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {statusInfo.labelTh}
                  </span>
                  {tl.extensions.length > 0 && (
                    <span style={{ fontSize: '11.5px', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                      ขยายเวลาครั้งที่ {tl.extensions.length}
                    </span>
                  )}
                </div>

                {/* Days remaining badge */}
                <div>
                  {tl.status === 'completed' ? (
                    <span className="glow-badge-completed">
                      <FaCheckCircle /> ปิดโครงการแล้ว ({tl.closed_date || 'ตามกำหนด'})
                    </span>
                  ) : tl.is_overdue ? (
                    <span className="glow-badge-delayed">
                      <FaExclamationCircle /> เกินกำหนดสัญญา {Math.abs(tl.days_remaining)} วัน
                    </span>
                  ) : (
                    <span className="glow-badge-active">
                      <FaClock /> เหลือเวลาอีก {tl.days_remaining} วัน
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Project Title */}
              <div>
                <h4 style={{ fontSize: '15.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>
                  {item.name}
                </h4>
              </div>

              {/* Row 3: Meta (Head, Dept, Budget, Dates) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaUserTie style={{ color: '#00A651' }} />
                  <span>หัวหน้าโครงการ: <strong>{item.head || item.person || '-'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaBuilding style={{ color: '#0284c7' }} />
                  <span>สังกัด: <strong>{String(item.department || '-').replace(/ภาควิชา\n?/g, '')}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaCalendarAlt style={{ color: '#7c3aed' }} />
                  <span>
                    ช่วงสัญญา: {tl.start_date} <FaArrowRight style={{ fontSize: '10px', margin: '0 4px' }} /> {tl.end_date}
                  </span>
                </div>
              </div>

              {/* Row 4: Progress Bar & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingTop: '8px', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
                {/* Progress */}
                <div style={{ flex: 1, maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b', marginBottom: '4px' }}>
                    <span>ความก้าวหน้าตามเวลาสัญญา ({tl.duration_months} เดือน)</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{tl.progress_percent}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${tl.progress_percent}%`,
                        background: tl.is_overdue
                          ? '#ef4444'
                          : 'linear-gradient(90deg, #00A651 0%, #00c862 100%)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tl.status !== 'completed' && (
                    <>
                      {/* Request Extension Button */}
                      <button
                        type="button"
                        onClick={() => setExtensionTarget(item)}
                        className="glass-btn"
                        style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaClock style={{ color: '#b45309' }} />
                        ขอขยายเวลา
                      </button>

                      {/* Pending Extension Approval Button */}
                      {tl.extensions.some((e) => e.approval_status === 'pending') && (
                        <button
                          type="button"
                          onClick={() => {
                            const pendingExt = tl.extensions.find((e) => e.approval_status === 'pending');
                            if (pendingExt) requestApproveExtension(item, pendingExt.id);
                          }}
                          className="glass-btn"
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fef3c7',
                            borderColor: '#fde68a',
                            color: '#b45309',
                          }}
                        >
                          <FaCheck /> อนุมัติขยายเวลา (สวพ.มก.)
                        </button>
                      )}

                      {/* Close Project Button */}
                      <button
                        type="button"
                        onClick={() => requestCloseProject(item)}
                        className="glass-btn-primary"
                        style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaCheckCircle /> ปิดโครงการ
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Extension History Accordion if any */}
              {tl.extensions.length > 0 && (
                <div style={{ marginTop: '4px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(254, 243, 199, 0.4)', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaHistory /> ประวัติการขอขยายระยะเวลาโครงการ:
                  </div>
                  {tl.extensions.map((ext, eIdx) => (
                    <div key={ext.id || eIdx} style={{ fontSize: '12px', color: '#78350f', padding: '2px 0' }}>
                      • ครั้งที่ {ext.round} ({ext.duration_months} เดือน): ยื่น {ext.request_date} $\rightarrow$ วันสิ้นสุดใหม่ {ext.extended_end_date} [{ext.reason_detail}] - <strong>{ext.approval_status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <FaClock style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px' }} />
            <h4 style={{ fontSize: '16px', color: '#334155' }}>ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา</h4>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>ลองเปลี่ยนตัวกรองสถานะ หรือคำค้นหาใหม่อีกครั้ง</p>
          </div>
        )}
      </div>

      {/* Extension Modal */}
      {extensionTarget && (
        <ProjectExtensionModal
          isOpen={Boolean(extensionTarget)}
          onClose={() => setExtensionTarget(null)}
          projectItem={extensionTarget}
          onSaveExtension={(updatedItem) => {
            onUpdateProject(updatedItem);
            setExtensionTarget(null);
          }}
        />
      )}

      {/* Action Confirmation Modal */}
      {confirmModal && (
        <ConfirmActionModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          detail={confirmModal.detail}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};
