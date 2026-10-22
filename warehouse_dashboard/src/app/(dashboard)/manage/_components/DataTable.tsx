'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@/types/dataManagement';
import { getDepartmentAbbr } from '@/config/dataManagementConfig';
import {
  FaUser,
  FaEdit,
  FaTrashAlt,
  FaInbox,
  FaExpandAlt,
  FaCopy,
  FaCheck,
  FaFileAlt,
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
}) => {
  // ติดตามว่าแถวใดและคอลัมน์ใดถูกคลิกเพื่อขยายดูชื่อเต็มแบบ Inline
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  // Modal แสดงรายละเอียดชื่อเต็มพร้อมปุ่มคัดลอก
  const [modalDetail, setModalDetail] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    rowItem?: any;
  } | null>(null);

  const [hasCopied, setHasCopied] = useState(false);

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenModal = (title: string, content: string, rowItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setHasCopied(false);
    setModalDetail({
      isOpen: true,
      title,
      content,
      rowItem,
    });
  };

  const handleCopyText = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
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

    const cellKey = `${item._id || item.id || 'row'}_${col.key}_${itemIndex}`;
    const isExpanded = Boolean(expandedKeys[cellKey]);

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
            {num.toLocaleString()}
          </span>
        );

      case 'date':
        return (
          <span style={{ fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
            {String(rawVal).substring(0, 10)}
          </span>
        );

      case 'badge':
        let bg = '#f1f5f9';
        let text = '#475569';
        let border = '#e2e8f0';

        if (col.key === 'department') {
          let deptText = String(rawVal ?? '');
          if ((!deptText || deptText === 'ü' || deptText === 'P' || deptText === '-' || deptText === 'nan') && (item as any)?.creator) {
            deptText = String((item as any).creator);
          }
          const abbr = getDepartmentAbbr(deptText);
          const abbrList = abbr === '-' ? ['-'] : abbr.split(',').map((s: string) => s.trim()).filter(Boolean);

          return (
            <div style={{ display: 'inline-flex', gap: '4px', justifyContent: col.align === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap', alignItems: 'center' }}>
              {abbrList.map((ab: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: "'Kanit', sans-serif",
                    backgroundColor: ab === '-' ? '#94a3b8' : '#990000',
                    color: '#ffffff',
                    border: `1px solid ${ab === '-' ? '#94a3b8' : '#990000'}`,
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                  }}
                  title={deptText}
                >
                  {ab}
                </span>
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
            title={String(rawVal)}
          >
            {String(rawVal).replace('ภาควิชา', '')}
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

      case 'academic_budget': {
        const b = Number(rawVal !== undefined && rawVal !== null && rawVal !== '' ? rawVal : item.budget || 0);
        if (isNaN(b) || b === 0) return <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>;
        const mgt = Math.round(b * 0.15);
        const fac = Math.round(b * 0.05);
        const dep = Math.round(b * 0.05);
        const ku = Math.round(b * 0.05);
        const rem = b - (mgt + fac + dep + ku);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
            <span style={{ fontWeight: 700, color: '#059669', fontFamily: 'monospace', fontSize: '13.5px', whiteSpace: 'nowrap' }}>
              {b.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: '10.5px',
                color: '#64748b',
                cursor: 'help',
                whiteSpace: 'nowrap',
              }}
              title={`การจัดสรรงบประมาณ (หักอัตโนมัติ 30%):\n- ค่าอำนวยการ (15%): ${mgt.toLocaleString()} บาท\n- คณะ (5%): ${fac.toLocaleString()} บาท\n- ภาควิชา (5%): ${dep.toLocaleString()} บาท\n- มก. (5%): ${ku.toLocaleString()} บาท\n- งบดำเนินงานคงเหลือ (70%): ${rem.toLocaleString()} บาท`}
            >
              หัก 30% ({ (mgt + fac + dep + ku).toLocaleString() })
            </span>
          </div>
        );
      }

      case 'academic_timeline': {
        const start = item.start_date ? String(item.start_date).substring(0, 10) : '';
        const end = item.end_date ? String(item.end_date).substring(0, 10) : '';
        if (start && end) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '11.5px', color: '#1e293b', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {start}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                ถึง {end}
              </span>
            </div>
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
        // คอลัมน์ชื่อโครงการ / ชื่องาน / ชื่อผลงาน / ชื่อบุคลากร (ไม่ตัวหนา: fontWeight: 400 และคลิกดูชื่อเต็มได้)
        if (col.key === 'name') {
          const strVal = String(rawVal);
          const isLong = strVal.length > 38;

          return (
            <div style={{ position: 'relative' }}>
              <div
                onClick={isLong ? (e) => toggleExpand(cellKey, e) : undefined}
                style={{
                  fontSize: '13.5px',
                  fontWeight: 400, // ไม่ตัวหนาตามคำขอของผู้ใช้
                  color: '#0f172a',
                  lineHeight: '1.45',
                  display: isExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: isExpanded ? 'visible' : 'hidden',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  cursor: isLong ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                }}
                title={isLong ? `${strVal} (คลิกเพื่อดูชื่อเต็ม)` : strVal}
              >
                {strVal}
              </div>

              {/* ปุ่มดูชื่อแบบเต็ม / ย่อข้อความ เมื่อข้อความยาว */}
              {isLong && (
                <div style={{ marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(cellKey, e)}
                    style={{
                      background: 'none',
                      border: `1px solid ${isExpanded ? '#bbf7d0' : '#e2e8f0'}`,
                      backgroundColor: isExpanded ? '#f0fdf4' : '#f8fafc',
                      color: isExpanded ? '#00A651' : '#0284c7',
                      fontSize: '11px',
                      fontWeight: 500,
                      borderRadius: '4px',
                      padding: '1px 6px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                    title={isExpanded ? 'คลิกเพื่อย่อข้อความ' : 'คลิกเพื่อดูชื่อเต็มในตาราง'}
                  >
                    <span>{isExpanded ? 'ย่อ ▴' : 'ดูเต็ม ▾'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleOpenModal(col.label.replace('\n', ' '), strVal, item, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px 4px',
                      fontSize: '10px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                    title="เปิดหน้าต่างป๊อปอัปดูชื่อฉบับเต็ม"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00A651')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <FaExpandAlt />
                  </button>
                </div>
              )}
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

        // คอลัมน์ชื่อบุคคล / หัวหน้าโครงการ / เจ้าของผลงาน / ผู้ว่าจ้าง / คอลัมน์ข้อความทั่วไป (ไม่ตัวหนา และคลิกดูชื่อเต็มได้)
        const strVal = String(rawVal);
        const isLongText = strVal.length > 25;

        return (
          <div style={{ position: 'relative' }}>
            <span
              onClick={isLongText ? (e) => toggleExpand(cellKey, e) : undefined}
              style={{
                display: isExpanded ? 'block' : 'inline-block',
                overflow: isExpanded ? 'visible' : 'hidden',
                textOverflow: isExpanded ? 'clip' : 'ellipsis',
                whiteSpace: isExpanded ? 'normal' : 'nowrap',
                maxWidth: '100%',
                wordBreak: isExpanded ? 'break-word' : 'normal',
                fontSize: '13.5px',
                color: '#334155',
                fontWeight: 400, // ไม่ตัวหนาตามคำขอของผู้ใช้
                cursor: isLongText ? 'pointer' : 'default',
              }}
              title={isLongText ? `${strVal} (คลิกเพื่อดูชื่อเต็ม)` : strVal}
            >
              {strVal}
            </span>

            {isLongText && (
              <span
                onClick={(e) => toggleExpand(cellKey, e)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '10.5px',
                  color: isExpanded ? '#00A651' : '#0284c7',
                  backgroundColor: isExpanded ? '#f0fdf4' : '#f8fafc',
                  border: `1px solid ${isExpanded ? '#bbf7d0' : '#e2e8f0'}`,
                  borderRadius: '3px',
                  padding: '0 4px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                }}
                title={isExpanded ? 'ย่อ' : 'ดูเต็ม'}
              >
                {isExpanded ? 'ย่อ ▴' : '...'}
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
          minWidth: categoryKey === 'research' ? '1320px' : '1100px',
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
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                  padding: col.type === 'avatar' ? '10px 4px' : '11px 10px',
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
            ))}
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
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fbf5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#fafcfb' : '#ffffff')}
                >
                  <td style={{ textAlign: 'center', padding: '11px 6px', color: '#94a3b8', fontSize: '13px', verticalAlign: 'top' }}>
                    {rowNum}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: col.type === 'avatar' ? '7px 4px' : '11px 8px',
                        textAlign: col.align || 'left',
                        verticalAlign: 'top',
                        color: '#1e293b',
                        overflow: 'visible',
                        wordBreak: 'break-word',
                      }}
                      title={typeof item[col.key] === 'string' || typeof item[col.key] === 'number' ? String(item[col.key]) : undefined}
                    >
                      {renderCell(col, item, idx)}
                    </td>
                  ))}
                  {!readOnly && (
                    <td style={{ textAlign: 'center', padding: '8px 4px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                      <button
                        onClick={() => onEdit(item, idx)}
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
                        onClick={() => onDelete(item, idx)}
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

      {/* Modal หน้าต่างป๊อปอัปแสดงชื่อเต็ม (Full Title / Detail View Modal) */}
      {modalDetail && modalDetail.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setModalDetail(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '640px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              animation: 'fadeIn 0.18s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal สีเขียว KU */}
            <div
              style={{
                backgroundColor: '#00A651',
                padding: '16px 20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaFileAlt style={{ fontSize: '16px' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                  {modalDetail.title || 'รายละเอียดฉบับเต็ม'}
                </h3>
              </div>
              <button
                onClick={() => setModalDetail(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '0 4px',
                  lineHeight: 1,
                  opacity: 0.85,
                }}
                title="ปิดหน้าต่าง"
              >
                &times;
              </button>
            </div>

            {/* Content แสดงชื่อแบบเต็ม */}
            <div style={{ padding: '22px' }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 18px',
                  fontSize: '14.5px',
                  color: '#0f172a',
                  lineHeight: '1.6',
                  fontWeight: 400,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {modalDetail.content}
              </div>

              {/* ป้ายข้อมูลบริบทประกอบ (ถ้ามี) */}
              {modalDetail.rowItem && (
                <div
                  style={{
                    marginTop: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '12px',
                  }}
                >
                  {modalDetail.rowItem.id && (
                    <span style={{ padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '6px', color: '#475569' }}>
                      รหัส: <strong>{modalDetail.rowItem.id}</strong>
                    </span>
                  )}
                  {modalDetail.rowItem.department && (
                    <span style={{ padding: '3px 10px', backgroundColor: '#990000', borderRadius: '12px', color: '#ffffff', border: '1px solid #990000', fontSize: '13px', fontWeight: 600, fontFamily: "'Kanit', sans-serif" }}>
                      ภาควิชา: <strong>{getDepartmentAbbr(modalDetail.rowItem.department)}</strong>
                    </span>
                  )}
                  {(modalDetail.rowItem.head ||
                    modalDetail.rowItem.owner ||
                    modalDetail.rowItem.creator ||
                    modalDetail.rowItem.person) && (
                    <span style={{ padding: '4px 10px', backgroundColor: '#eff6ff', borderRadius: '6px', color: '#1e40af' }}>
                      ผู้รับผิดชอบ: <strong>{modalDetail.rowItem.head || modalDetail.rowItem.owner || modalDetail.rowItem.creator || modalDetail.rowItem.person}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => handleCopyText(modalDetail.content)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: hasCopied ? '#00A651' : '#334155',
                  fontWeight: 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {hasCopied ? <FaCheck style={{ color: '#00A651' }} /> : <FaCopy />}
                <span>{hasCopied ? 'คัดลอกสำเร็จแล้ว' : 'คัดลอกข้อความ'}</span>
              </button>
              <button
                type="button"
                onClick={() => setModalDetail(null)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#00A651',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
