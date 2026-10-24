'use client';

import React, { useState } from 'react';
import { ColumnDef, CategoryKey } from '@/types/dataManagement';
import { getDepartmentAbbr, CATEGORIES_CONFIG } from '@/config/dataManagementConfig';
import { DepartmentBadge, RecordDetailDrawer, LevelBadge, formatDateBE, formatMoney } from '@/components/ui';
import { getCachedEvaluations } from '@/lib/dataService';
import {
  FaUser,
  FaEdit,
  FaTrashAlt,
  FaInbox,
  FaUsers,
  FaClock,
} from 'react-icons/fa';
import { calculateProjectTimeline, STATUS_LABELS } from '@/lib/projectMonitoringEngine';
import { SDGS_DATA } from '@/config/sdgConfig';
import { detectSDGsFromText } from '@/lib/sdgEngine';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { autoDetectJournalRanking } from '@/lib/journalRankingEngine';

interface DataTableProps {
  columns: ColumnDef[];
  data: any[];
  startIndex: number;
  onEdit: (item: any, index: number) => void;
  onDelete: (item: any, index: number) => void;
  readOnly?: boolean;
  categoryKey?: string;
  currentPage?: number;
  onRowClick?: (item: any, index: number) => void;
  hideCheckbox?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  startIndex,
  onEdit,
  onDelete,
  readOnly = false,
  categoryKey,
  currentPage = 1,
  onRowClick,
  hideCheckbox = false,
}) => {
  // Drawer แสดงรายละเอียดข้อมูลแบบเต็ม (Record Detail Drawer)
  const [selectedDrawerIndex, setSelectedDrawerIndex] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (item: any, idx: number, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea, [data-prevent-drawer="true"]')) {
      return;
    }
    if (onRowClick) {
      onRowClick(item, idx);
      return;
    }
    setSelectedDrawerIndex(idx);
    setIsDrawerOpen(true);
  };

  const renderCell = (col: ColumnDef, item: any, itemIndex: number) => {
    const rawVal = item[col.key];

    // กรณีมีฟังก์ชัน format เฉพาะ
    if (col.format) {
      return col.format(rawVal, item);
    }

    if (rawVal === undefined || rawVal === null || rawVal === '' || rawVal === 'nan' || rawVal === 'NaT') {
      return <span style={{ color: '#cbd5e1' }}>-</span>;
    }

    switch (col.type) {
      case 'avatar':
        return (
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '1.5px solid #e2e8f0',
            }}
          >
            {rawVal ? (
              <img
                src={rawVal}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <FaUser style={{ color: '#94a3b8', fontSize: '14px' }} />
            )}
          </div>
        );

      case 'currency':
        const num = Number(rawVal);
        if (isNaN(num) || num === 0) return <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>;
        return (
          <span style={{ fontWeight: 600, color: '#059669', fontFamily: 'monospace', fontSize: '13px' }}>
            {formatMoney(num)}
          </span>
        );

      case 'date':
        return (
          <span style={{ fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
            {formatDateBE(rawVal)}
          </span>
        );

      case 'badge':
        let bg = '#f1f5f9';
        let text = '#475569';
        let border = '#e2e8f0';

        if (col.key === 'level') {
          return <LevelBadge value={rawVal} />;
        }

        if (col.key === 'department') {
          let deptText = String(rawVal ?? '');
          if ((!deptText || deptText === 'ü' || deptText === 'P' || deptText === '-' || deptText === 'nan') && (item as any)?.creator) {
            deptText = String((item as any).creator);
          }
          const depts = Array.from(new Set(deptText.split(',').map((s) => s.trim()).filter(Boolean)));
          if (depts.length === 0) return <span style={{ color: '#cbd5e1' }}>-</span>;
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
              {depts.map((d, idx) => (
                <DepartmentBadge key={idx} value={d} />
              ))}
            </div>
          );
        }

        if (col.badgeColorMap) {
          const colors = col.badgeColorMap(rawVal);
          bg = colors.bg;
          text = colors.text;
          border = colors.border || border;
        } else if (col.key === 'type' || col.key === 'month') {
          bg = '#eff6ff';
          text = '#1d4ed8';
          border = '#bfdbfe';
        } else if (col.key === 'service_type' || col.key === 'service_category') {
          if (rawVal === 'วิทยากร/อาจารย์พิเศษ') {
            bg = '#eff6ff'; text = '#1d4ed8'; border = '#bfdbfe';
          } else if (rawVal === 'วิชาการ') {
            bg = '#ecfdf5'; text = '#047857'; border = '#a7f3d0';
          } else if (rawVal === 'วิชาชีพ') {
            bg = '#faf5ff'; text = '#7e22ce'; border = '#e9d5ff';
          } else if (rawVal === 'ผู้ทรงคุณวุฒิ') {
            bg = '#fffbeb'; text = '#b45309'; border = '#fde68a';
          } else if (rawVal === 'วิทยานิพนธ์ภายนอก') {
            bg = '#f0fdfa'; text = '#0f766e'; border = '#99f6e4';
          } else if (rawVal === 'ศึกษาดูงาน วศ.กพส.') {
            bg = '#fff1f2'; text = '#be123c'; border = '#fecdd3';
          } else {
            bg = '#f8fafc'; text = '#475569'; border = '#e2e8f0';
          }
        }

        return (
          <span
            style={{
              display: 'inline-block',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: bg,
              color: text,
              border: `1px solid ${border}`,
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: 'default',
            }}
            title={String(rawVal || '')}
          >
            {col.key === 'service_type' || col.key === 'service_category'
              ? String(rawVal || '-')
              : String(rawVal).replace('ภาควิชา', '')}
          </span>
        );

      case 'status': {
        const tl = calculateProjectTimeline(item);
        const statusInfo = STATUS_LABELS[tl.status] || STATUS_LABELS.active;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {statusInfo.labelTh}
            </span>
            <span style={{ fontSize: '10.5px', color: tl.is_overdue ? '#dc2626' : '#64748b' }}>
              {tl.status === 'completed'
                ? 'ปิดแล้ว'
                : tl.is_overdue
                ? `เกิน ${Math.abs(tl.days_remaining)} วัน`
                : `เหลือ ${tl.days_remaining} วัน`}
            </span>
          </div>
        );
      }

      case 'sdg': {
        let sdgCode = String(rawVal || '').trim();
        if (!sdgCode || sdgCode === '-' || sdgCode === 'nan') {
          const detected = detectSDGsFromText(item.name || '', item.department);
          if (detected.length > 0) sdgCode = detected[0].sdg.code;
        }

        const numMatch = sdgCode.match(/\d+/);
        const sdgNum = numMatch ? parseInt(numMatch[0], 10) : 0;
        const sdgInfo = SDGS_DATA[sdgNum];

        if (!sdgInfo) {
          return <span style={{ color: '#cbd5e1' }}>-</span>;
        }

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: `${sdgInfo.color}15`,
              color: sdgInfo.color,
              border: `1px solid ${sdgInfo.color}40`,
              whiteSpace: 'nowrap',
            }}
            title={`${sdgInfo.code}: ${sdgInfo.nameTh}`}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sdgInfo.color }} />
            {sdgInfo.code}
          </span>
        );
      }

      case 'quartile': {
        let tierStr = String(rawVal || '').trim();
        if (!tierStr || tierStr === 'nan' || tierStr === '-') {
          const detected = autoDetectJournalRanking(item.journal || item.name || '');
          if (detected) tierStr = detected.tier;
        }

        const tierStyle = JOURNAL_TIER_STYLES[tierStr as keyof typeof JOURNAL_TIER_STYLES] || {
          bg: '#f1f5f9',
          text: '#475569',
          border: '#e2e8f0',
          glow: 'none',
        };

        return (
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: "'Kanit', sans-serif",
              backgroundColor: tierStyle.bg,
              color: tierStyle.text,
              border: `1px solid ${tierStyle.border}`,
              whiteSpace: 'nowrap',
            }}
          >
            {tierStr || 'ระดับชาติ'}
          </span>
        );
      }

      case 'members': {
        const mems = Array.isArray(item.members) ? item.members : [];
        const count = mems.length > 0 ? mems.length : 1;
        const hasExternal = mems.some((m: any) => m.affiliation_type && m.affiliation_type !== 'eng_kps');

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: hasExternal ? '#fef3c7' : '#f1f5f9',
              color: hasExternal ? '#b45309' : '#475569',
              border: hasExternal ? '1px solid #fde68a' : '1px solid #e2e8f0',
              cursor: 'pointer',
            }}
            title={
              mems.length > 0
                ? mems.map((m: any) => `${m.role}: ${m.name} (${m.organization || 'วิศวะ กพส.'})`).join('\n')
                : `หัวหน้าโครงการ: ${item.head || item.person || '-'}`
            }
          >
            <FaUsers style={{ fontSize: '11px' }} />
            {count} ท่าน {hasExternal && '(ภายนอก)'}
          </span>
        );
      }

      case 'academic_members': {
        const inCount = Number(item.co_members_internal) || 0;
        const outCount = Number(item.co_members_external) || 0;
        const totalCo = inCount + outCount;
        if (inCount === 0 && outCount === 0) {
          return <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>;
        }
        return (
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}
            title={`ผู้ร่วมโครงการรวม ${totalCo} คน (ภายใน: ${inCount} คน, ภายนอก: ${outCount} คน)`}
          >
            {inCount > 0 && (
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  border: '1px solid #bae6fd',
                  whiteSpace: 'nowrap',
                }}
              >
                ใน {inCount} คน
              </span>
            )}
            {outCount > 0 && (
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  whiteSpace: 'nowrap',
                }}
              >
                นอก {outCount} คน
              </span>
            )}
          </div>
        );
      }

      case 'research_budget': {
        const hasInternal = item.budget_internal !== undefined && item.budget_internal !== null && item.budget_internal !== '' && item.budget_internal !== '-' && item.budget_internal !== 'nan';
        const hasExternal = item.budget_external !== undefined && item.budget_external !== null && item.budget_external !== '' && item.budget_external !== '-' && item.budget_external !== 'nan';
        const internalStr = hasInternal ? `${formatMoney(item.budget_internal)} บาท` : '-';
        const externalStr = hasExternal ? `${formatMoney(item.budget_external)} บาท` : '-';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#059669', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
              ภายใน: {internalStr}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              ภายนอก: {externalStr}
            </span>
          </div>
        );
      }

      case 'research_duration': {
        const start = item.start_date ? formatDateBE(item.start_date) : '';
        const end = item.end_date ? formatDateBE(item.end_date) : '';
        if (start && end && start !== '-' && end !== '-') {
          return (
            <span style={{ fontSize: '12px', color: '#334155', whiteSpace: 'nowrap' }}>
              {start} – {end}
            </span>
          );
        }
        if (start && start !== '-') {
          return (
            <span style={{ fontSize: '12px', color: '#334155', whiteSpace: 'nowrap' }}>
              {start}
            </span>
          );
        }
        if (item.duration && item.duration !== '-' && item.duration !== 'nan') {
          return (
            <span style={{ fontSize: '12px', color: '#334155', whiteSpace: 'nowrap' }}>
              {String(item.duration)}
            </span>
          );
        }
        return <span style={{ color: '#cbd5e1' }}>-</span>;
      }

      case 'academic_budget': {
        const b = Number(rawVal !== undefined && rawVal !== null && rawVal !== '' ? rawVal : item.budget || 0);
        if (isNaN(b) || b === 0) return <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>;
        const facPercent = item.percent_faculty !== undefined && item.percent_faculty !== null ? Number(item.percent_faculty) : 5;
        const depPercent = item.percent_dept !== undefined && item.percent_dept !== null ? Number(item.percent_dept) : 5;
        const kuPercent = item.percent_ku !== undefined && item.percent_ku !== null ? Number(item.percent_ku) : 5;
        const fac =
          item.alloc_faculty !== undefined && item.alloc_faculty !== null && item.alloc_faculty !== ''
            ? Number(item.alloc_faculty)
            : (b * facPercent) / 100;
        const dep =
          item.alloc_dept !== undefined && item.alloc_dept !== null && item.alloc_dept !== ''
            ? Number(item.alloc_dept)
            : (b * depPercent) / 100;
        const ku =
          item.alloc_ku !== undefined && item.alloc_ku !== null && item.alloc_ku !== ''
            ? Number(item.alloc_ku)
            : (b * kuPercent) / 100;
        const totalDeduct = fac + dep + ku;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
            <span style={{ fontWeight: 600, color: '#059669', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'nowrap' }}>
              {formatMoney(b)} บาท
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              หักรวม: {formatMoney(totalDeduct)} บาท
            </span>
          </div>
        );
      }

      case 'academic_timeline': {
        const start = item.start_date ? formatDateBE(item.start_date) : '';
        const end = item.end_date ? formatDateBE(item.end_date) : '';
        if (start && end && start !== '-' && end !== '-') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
              <span style={{ fontSize: '12px', color: '#1e293b', whiteSpace: 'nowrap' }}>
                {start}
              </span>
              <span style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                ถึง {end}
              </span>
            </div>
          );
        }
        if (start && start !== '-') {
          return (
            <span style={{ fontSize: '12px', color: '#1e293b', whiteSpace: 'nowrap' }}>
              {start}
            </span>
          );
        }
        if (item.month && item.month !== '-' && item.month !== 'nan') {
          return (
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                whiteSpace: 'nowrap',
              }}
            >
              {item.month}
            </span>
          );
        }
        return <span style={{ color: '#cbd5e1' }}>-</span>;
      }

      case 'publication_journal': {
        const journal = item.journal || rawVal || '-';
        const volParts: string[] = [];
        if (item.volume) volParts.push(`Volume ${item.volume}`);
        if (item.issue) volParts.push(`Issue ${item.issue}`);
        if (item.page_start || item.page_end) {
          volParts.push(`Page ${item.page_start || '-'}${item.page_end ? '–' + item.page_end : ''}`);
        }
        const line2 = volParts.length > 0
          ? volParts.join(', ')
          : 'Volume -, Issue -, Page -';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '13px',
                color: '#1e293b',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              title={String(journal)}
            >
              {journal}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              {line2}
            </span>
          </div>
        );
      }

      case 'ip_req_info': {
        const reqNo = item.application_number || item.req_no || rawVal || '-';
        const filing = item.filing_date ? formatDateBE(item.filing_date) : '-';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: 500, color: '#334155', whiteSpace: 'nowrap' }}>
              {reqNo}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              วันที่ยื่นคำขอ: {filing}
            </span>
          </div>
        );
      }

      case 'ip_reg_info': {
        const regNo = item.registration_number || item.reg_no || '-';
        const prot = item.protection_period || (item.protection_start ? `${formatDateBE(item.protection_start)} – ${formatDateBE(item.protection_end)}` : '-');
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '12.5px', fontWeight: 500, color: '#334155', whiteSpace: 'nowrap' }}>
              {regNo}
            </span>
            <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
              ระยะเวลาความคุ้มครอง: {prot}
            </span>
          </div>
        );
      }

      case 'academic_character': {
        const chars = Array.isArray(rawVal)
          ? rawVal
          : typeof rawVal === 'string' && rawVal
          ? rawVal.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        if (chars.length === 0) return <span style={{ color: '#cbd5e1' }}>-</span>;
        return (
          <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {chars.map((c: string, idx: number) => {
              const isPolicy = c.includes('นโยบาย');
              return (
                <span
                  key={idx}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: isPolicy ? '#ecfdf5' : '#f5f3ff',
                    color: isPolicy ? '#047857' : '#6d28d9',
                    border: `1px solid ${isPolicy ? '#a7f3d0' : '#ddd6fe'}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c}
                </span>
              );
            })}
          </div>
        );
      }

      case 'academic_integration': {
        const resList = Array.isArray(item.research_projects) ? item.research_projects : [];
        const patent = item.patent_integration ? String(item.patent_integration).trim() : '';
        if (resList.length === 0 && !patent) {
          return <span style={{ color: '#cbd5e1' }}>-</span>;
        }
        const resTooltip = resList.map((r: any) => `[${r.code}] ${r.name}`).join('\n');
        const fullTooltip = [
          resList.length > 0 ? `โครงการวิจัย (${resList.length} รายการ):\n${resTooltip}` : '',
          patent ? `สิทธิบัตร:\n${patent}` : '',
          item.integration_start_date ? `ช่วงบูรณาการ: ${item.integration_start_date} ถึง ${item.integration_end_date || '-'}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');

        return (
          <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }} title={fullTooltip}>
            {resList.length > 0 && (
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  whiteSpace: 'nowrap',
                  cursor: 'help',
                }}
              >
                วิจัย ({resList.length})
              </span>
            )}
            {patent && (
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#fdf4ff',
                  color: '#86198f',
                  border: '1px solid #f0abfc',
                  whiteSpace: 'nowrap',
                  cursor: 'help',
                }}
              >
                สิทธิบัตร
              </span>
            )}
          </div>
        );
      }

      case 'email':
        return (
          <a
            href={`mailto:${rawVal}`}
            style={{ color: '#0284c7', textDecoration: 'none', fontSize: '13px', fontWeight: 400 }}
            title={String(rawVal)}
          >
            {rawVal}
          </a>
        );

      default:
        // คอลัมน์ชื่อโครงการ / ชื่องาน / ชื่อผลงาน / ชื่อบุคลากร (ไม่ตัวหนา: fontWeight: 400 แสดงสูงสุด 2 บรรทัด)
        if (col.key === 'name') {
          const strVal = String(rawVal);
          return (
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 400,
                color: '#0f172a',
                lineHeight: '1.45',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
              title={strVal}
            >
              {strVal}
            </div>
          );
        }

        // คอลัมน์รหัส (id, req_no)
        if (col.key === 'id' || col.key === 'req_no') {
          return (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: 500,
                color: '#475569',
              }}
              title={String(rawVal)}
            >
              {String(rawVal)}
            </span>
          );
        }

        // คอลัมน์ชื่อบุคคล / หัวหน้าโครงการ / เจ้าของผลงาน / ผู้ว่าจ้าง / คอลัมน์ข้อความทั่วไป (ไม่ตัวหนา ตัดทอน 1 บรรทัด)
        const strVal = String(rawVal);
        const isIncompletePersonnel = categoryKey === 'personnel' && col.key === 'name' && (
          !item.position || !String(item.position).trim() ||
          !item.email || !String(item.email).trim() || item.email === 'ไม่พบอีเมล' ||
          !item.image_url || !String(item.image_url).trim()
        );

        return (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                fontSize: '13.5px',
                color: '#334155',
                fontWeight: 400,
              }}
              title={strVal}
            >
              {strVal}
            </span>

            {isIncompletePersonnel && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  whiteSpace: 'nowrap',
                }}
              >
                ข้อมูลไม่ครบ
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '13.5px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#00A651' }}>
            <th
              style={{
                width: '4%',
                minWidth: '42px',
                textAlign: 'center',
                padding: '12px 6px',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                backgroundColor: '#00A651',
                borderBottom: '2px solid #008f44',
                verticalAlign: 'middle',
                whiteSpace: 'nowrap',
              }}
            >
              #
            </th>
            {columns.map((col) => {
              const isDept = col.key === 'department';
              return (
                <th
                  key={col.key}
                  style={{
                    width: col.width || (isDept ? '10%' : 'auto'),
                    textAlign: isDept ? 'left' : col.align || 'left',
                    padding: col.type === 'avatar' ? '10px 4px' : '11px 8px',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '13px',
                    backgroundColor: '#00A651',
                    whiteSpace: 'nowrap', // หัวตารางทุกหน้ามีบรรทัดเดียวเสมอ เพื่อความ Consistent
                    lineHeight: '1.2',
                    verticalAlign: 'middle',
                    borderBottom: '2px solid #008f44',
                  }}
                  title={col.key === 'image_url' ? 'รูปภาพประจำตัว / รูปโปรไฟล์' : col.label.replace('\n', ' ')}
                >
                  {col.label.replace('\n', ' ')}
                </th>
              );
            })}
            {!readOnly && (
              <th
                style={{
                  width: '5%',
                  minWidth: '70px',
                  textAlign: 'center',
                  padding: '12px 6px',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  backgroundColor: '#00A651',
                  borderBottom: '2px solid #008f44',
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                }}
              >
                จัดการ
              </th>
            )}
          </tr>
        </thead>
        <tbody key={`tbody-${categoryKey || 'cat'}-${currentPage || 1}-${startIndex}`}>
          {data.length > 0 ? (
            data.map((item, idx) => {
              const rowNum = startIndex + idx + 1;
              const rowKey =
                item._id ||
                (item.id && item.id !== 'nan'
                  ? `${item.id}_${startIndex + idx}`
                  : `row_${categoryKey || 'cat'}_${startIndex + idx}_${item.name ? String(item.name).slice(0, 20) : idx}`);
              return (
                <tr
                  key={rowKey}
                  onClick={(e) => handleRowClick(item, idx, e)}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                    transition: 'background-color 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fbf5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#fafcfb' : '#ffffff')}
                >
                  <td style={{ textAlign: 'center', padding: '11px 6px', color: '#94a3b8', fontSize: '13px', verticalAlign: 'top' }}>
                    {rowNum}
                  </td>
                  {columns.map((col) => {
                    const isDept = col.key === 'department';
                    return (
                      <td
                        key={col.key}
                        style={{
                          width: col.width || (isDept ? '10%' : undefined),
                          padding: col.type === 'avatar' ? '7px 4px' : '11px 8px',
                          textAlign: isDept ? 'left' : col.align || 'left',
                          verticalAlign: isDept ? 'middle' : 'top',
                          color: '#1e293b',
                          overflow: 'visible',
                          wordBreak: 'break-word',
                        }}
                        title={typeof item[col.key] === 'string' || typeof item[col.key] === 'number' ? String(item[col.key]) : undefined}
                      >
                        {renderCell(col, item, idx)}
                      </td>
                    );
                  })}
                  {!readOnly && (
                    <td style={{ textAlign: 'center', padding: '8px 4px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item, idx);
                        }}
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
                        title="แก้ไขข้อมูล"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef3c7')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item, idx);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          marginLeft: '2px',
                          transition: 'background-color 0.15s',
                        }}
                        title="ลบรายการ"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length + (readOnly ? 1 : 2)}
                style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}
              >
                <FaInbox style={{ fontSize: '32px', color: '#cbd5e1', marginBottom: '8px', display: 'block', margin: '0 auto 8px auto' }} />
                <span style={{ fontSize: '14px' }}>ไม่พบรายการข้อมูลที่ตรงกับเงื่อนไขการค้นหา</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* RecordDetailDrawer Component */}
      <RecordDetailDrawer
        isOpen={isDrawerOpen && selectedDrawerIndex !== null && selectedDrawerIndex < data.length}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDrawerIndex(null);
        }}
        item={selectedDrawerIndex !== null && selectedDrawerIndex < data.length ? data[selectedDrawerIndex] : null}
        categoryKey={categoryKey}
        config={categoryKey ? CATEGORIES_CONFIG[categoryKey as CategoryKey] : undefined}
        onEdit={(item, idx) => {
          setIsDrawerOpen(false);
          onEdit(item, idx);
        }}
        onDelete={(item, idx) => {
          setIsDrawerOpen(false);
          onDelete(item, idx);
        }}
        onPrev={() => {
          if (selectedDrawerIndex !== null && selectedDrawerIndex > 0) {
            setSelectedDrawerIndex(selectedDrawerIndex - 1);
          }
        }}
        onNext={() => {
          if (selectedDrawerIndex !== null && selectedDrawerIndex < data.length - 1) {
            setSelectedDrawerIndex(selectedDrawerIndex + 1);
          }
        }}
        hasPrev={selectedDrawerIndex !== null && selectedDrawerIndex > 0}
        hasNext={selectedDrawerIndex !== null && selectedDrawerIndex < data.length - 1}
        currentIndex={selectedDrawerIndex ?? 0}
        totalInPage={data.length}
        readOnly={readOnly}
      />
    </div>
  );
};
