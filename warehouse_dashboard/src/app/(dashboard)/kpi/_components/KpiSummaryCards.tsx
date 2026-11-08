'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { KPIComputedResult } from '@/types/kpi';

interface OverallStats {
  total: number;
  achieved: number;
  inProgress?: number;
  onTrack?: number;
  atRisk?: number;
  behind: number;
  avgScore: number;
}

interface KpiSummaryCardsProps {
  stats: OverallStats;
  /** รายการ KPI ทั้งหมด (ก่อนกรองสถานะ) ใช้สำหรับ drill-down ภายในการ์ด */
  items?: KPIComputedResult[];
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
  selectedStrategy?: string;
  onSelectStrategy?: (strategy: string) => void;
}

type Bucket = 'achieved' | 'in_progress' | 'behind';
type OpenPanel = null | 'strategy' | 'achieved' | 'behind' | `bin-${number}`;

const TONE: Record<Bucket, { main: string; deep: string; soft: string; glow: string; label: string }> = {
  achieved: { main: '#10b981', deep: '#047857', soft: '#d1fae5', glow: '#34d399', label: 'บรรลุ' },
  in_progress: { main: '#f59e0b', deep: '#b45309', soft: '#fef3c7', glow: '#fbbf24', label: 'กำลังดำเนินการ' },
  behind: { main: '#f43f5e', deep: '#be123c', soft: '#ffe4e6', glow: '#fb7185', label: 'ต้องเร่งรัด' },
};

const bucketOf = (s: KPIComputedResult['status']): Bucket =>
  s === 'achieved' ? 'achieved' : s === 'behind' ? 'behind' : 'in_progress';

const strategyOf = (k: KPIComputedResult) =>
  k.kpi.strategyCode || (k.kpi.code || '').split('-')[0] || 'อื่น ๆ';

const BINS = [50, 60, 70, 80, 90];

const css = `
.kx-card{position:relative;border-radius:22px;padding:18px 20px;min-height:214px;display:flex;flex-direction:column;gap:12px;
  transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s ease,border-color .2s ease;outline:none;isolation:isolate}
.kx-card[data-click="true"]{cursor:pointer}
.kx-card[data-click="true"]:hover{transform:translateY(-4px)}
.kx-card:focus-visible{box-shadow:0 0 0 3px #10b98166!important}
.kx-deco{position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:-1;pointer-events:none}
.kx-label{font-size:13px;font-weight:700;letter-spacing:.02em}
.kx-num{font-size:58px;font-weight:800;line-height:.95;letter-spacing:-2.5px;font-variant-numeric:tabular-nums}
.kx-chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;padding:4px 10px;border-radius:999px;white-space:nowrap}
.kx-btn{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:6px 12px;border-radius:10px;border:1px solid transparent;
  cursor:pointer;transition:all .15s ease;background:transparent;font-family:inherit}
.kx-btn:hover{filter:brightness(.96);transform:translateY(-1px)}
.kx-dot{width:11px;height:11px;border-radius:3px;transition:transform .12s ease,box-shadow .12s ease;cursor:pointer}
.kx-dot:hover{transform:scale(1.6);z-index:2}
.kx-bar{flex:1;border-radius:7px 7px 3px 3px;cursor:pointer;transition:all .15s ease;transform-origin:bottom;animation:kxGrow .6s cubic-bezier(.2,.8,.2,1) both}
.kx-bar:hover{filter:brightness(1.08)}
.kx-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;transition:background .12s ease}
.kx-row:hover{background:#f1f5f9}
.kx-pop{position:absolute;top:calc(100% + 10px);left:0;width:min(380px,92vw);z-index:60;background:rgba(255,255,255,.96);
  backdrop-filter:blur(14px);border:1px solid #e2e8f0;border-radius:18px;box-shadow:0 24px 48px -12px rgba(15,23,42,.28);
  padding:14px;animation:kxPop .18s ease both;cursor:default;color:#0f172a}
.kx-scroll{max-height:320px;overflow:auto;margin:0 -4px;padding:0 4px}
.kx-scroll::-webkit-scrollbar{width:6px}.kx-scroll::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:9px}
@keyframes kxGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes kxPop{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
@keyframes kxPulse{0%{box-shadow:0 0 0 0 #f43f5e88}100%{box-shadow:0 0 0 12px #f43f5e00}}
@keyframes kxSweep{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:var(--off)}}
`;

const stop = (e: React.SyntheticEvent) => e.stopPropagation();

/* ---------------- Popover + list ---------------- */

function Popover({
  title,
  count,
  color,
  onClose,
  align = 'left',
  children,
}: {
  title: string;
  count?: number;
  color: string;
  onClose: () => void;
  align?: 'left' | 'right';
  children: React.ReactNode;
}) {
  return (
    <div
      className="kx-pop"
      style={align === 'right' ? { left: 'auto', right: 0 } : undefined}
      onClick={stop}
      onKeyDown={stop}
      role="dialog"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: color }} />
        <div style={{ fontSize: 14, fontWeight: 800 }}>{title}</div>
        {count !== undefined && (
          <span className="kx-chip" style={{ background: `${color}1f`, color }}>
            {count}
          </span>
        )}
        <button
          aria-label="ปิด"
          onClick={onClose}
          className="kx-btn"
          style={{ marginLeft: 'auto', padding: '2px 8px', color: '#64748b', fontSize: 16 }}
        >
          ×
        </button>
      </div>
      <div className="kx-scroll">{children}</div>
    </div>
  );
}

function KpiRows({ list }: { list: KPIComputedResult[] }) {
  if (!list.length)
    return <div style={{ fontSize: 13, color: '#94a3b8', padding: '16px 4px', textAlign: 'center' }}>ไม่มีรายการ</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {list.map((k) => {
        const t = TONE[bucketOf(k.status)];
        const p = Math.round(k.percentage);
        return (
          <div key={k.kpi.id} className="kx-row" title={k.kpi.title}>
            <span
              className="kx-chip"
              style={{ background: t.soft, color: t.deep, minWidth: 54, justifyContent: 'center', fontFamily: 'ui-monospace,monospace' }}
            >
              {k.kpi.code}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {k.kpi.title}
              </div>
              <div style={{ height: 4, borderRadius: 9, background: '#eef2f7', marginTop: 5, overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, Math.max(2, p))}%`, height: '100%', background: t.main, borderRadius: 9 }} />
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: t.deep, fontVariantNumeric: 'tabular-nums', minWidth: 44, textAlign: 'right' }}>
              {p}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Main ---------------- */

export function KpiSummaryCards({
  stats,
  items = [],
  selectedStatus = 'all',
  onSelectStatus,
  selectedStrategy = 'all',
  onSelectStrategy,
}: KpiSummaryCardsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<OpenPanel>(null);
  const [hoverBin, setHoverBin] = useState<number | null>(null);
  const [tip, setTip] = useState<{ k: KPIComputedResult; x: number; y: number } | null>(null);
  const wafCardRef = useRef<HTMLDivElement>(null);

  const total = stats.total || 0;
  const inProgress = stats.inProgress ?? stats.onTrack ?? 0;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const avg = Math.max(0, Math.min(100, stats.avgScore || 0));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  /* ---- derived data ---- */
  const groups = useMemo(() => {
    const achieved: KPIComputedResult[] = [];
    const progress: KPIComputedResult[] = [];
    const behind: KPIComputedResult[] = [];
    items.forEach((k) => {
      const b = bucketOf(k.status);
      (b === 'achieved' ? achieved : b === 'behind' ? behind : progress).push(k);
    });
    achieved.sort((a, b) => b.percentage - a.percentage);
    behind.sort((a, b) => a.percentage - b.percentage);
    const bins: KPIComputedResult[][] = BINS.map(() => []);
    progress.forEach((k) => {
      const i = Math.min(4, Math.max(0, Math.floor((k.percentage - 50) / 10)));
      bins[i].push(k);
    });
    bins.forEach((b) => b.sort((x, y) => y.percentage - x.percentage));
    return { achieved, progress, behind, bins };
  }, [items]);

  const strategies = useMemo(() => {
    const map = new Map<string, { code: string; name: string; sum: number; n: number; ach: number }>();
    items.forEach((k) => {
      const code = strategyOf(k);
      const g = map.get(code) || { code, name: k.kpi.strategyName || '', sum: 0, n: 0, ach: 0 };
      g.sum += Math.min(100, k.percentage);
      g.n += 1;
      if (k.status === 'achieved') g.ach += 1;
      if (!g.name && k.kpi.strategyName) g.name = k.kpi.strategyName;
      map.set(code, g);
    });
    return Array.from(map.values())
      .map((g) => ({ ...g, avg: Math.round(g.sum / g.n) }))
      .sort((a, b) => a.code.localeCompare(b.code, 'th', { numeric: true }));
  }, [items]);

  /* waffle: ใช้ข้อมูลจริงถ้ามี ไม่มีก็สร้างจากตัวเลขสรุป */
  const waffle: { bucket: Bucket; k?: KPIComputedResult }[] = useMemo(() => {
    if (items.length) {
      const order: Bucket[] = ['achieved', 'in_progress', 'behind'];
      return [...items]
        .sort((a, b) => order.indexOf(bucketOf(a.status)) - order.indexOf(bucketOf(b.status)) || b.percentage - a.percentage)
        .map((k) => ({ bucket: bucketOf(k.status), k }));
    }
    return [
      ...Array.from({ length: stats.achieved }, () => ({ bucket: 'achieved' as Bucket })),
      ...Array.from({ length: inProgress }, () => ({ bucket: 'in_progress' as Bucket })),
      ...Array.from({ length: stats.behind }, () => ({ bucket: 'behind' as Bucket })),
    ];
  }, [items, stats.achieved, stats.behind, inProgress]);

  const binCounts = groups.bins.map((b) => b.length);
  const maxBin = Math.max(1, ...binCounts);

  /* ---- helpers ---- */
  const toggleStatus = (key: string) => {
    if (!onSelectStatus) return;
    onSelectStatus(selectedStatus === key ? 'all' : key);
  };
  const togglePanel = (p: OpenPanel) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((cur) => (cur === p ? null : p));
  };
  const cardA11y = (key: string) => ({
    'data-click': String(!!onSelectStatus),
    role: onSelectStatus ? 'button' : undefined,
    tabIndex: onSelectStatus ? 0 : undefined,
    'aria-pressed': onSelectStatus ? selectedStatus === key : undefined,
    onClick: () => toggleStatus(key),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleStatus(key);
      }
    },
  });
  const lightCard = (key: string, b: Bucket): React.CSSProperties => {
    const t = TONE[b];
    const active = selectedStatus === key;
    return {
      background: '#ffffff',
      border: `1.5px solid ${active ? t.main : '#e8edf3'}`,
      boxShadow: active
        ? `0 0 0 4px ${t.main}22, 0 18px 36px -14px ${t.main}66`
        : '0 1px 2px rgba(15,23,42,.04), 0 8px 24px -16px rgba(15,23,42,.18)',
      zIndex: open && open.startsWith(key === 'in_progress' ? 'bin' : key) ? 30 : undefined,
    };
  };
  const Aurora = ({ color }: { color: string }) => (
    <div className="kx-deco">
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -70,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}33 0%, ${color}00 70%)`,
        }}
      />
    </div>
  );

  /* ---- gauge geometry ---- */
  const R = 78;
  const LEN = Math.PI * R;
  const off = LEN * (1 - avg / 100);
  const theta = Math.PI * (1 - avg / 100);
  const nx = 100 + R * Math.cos(theta);
  const ny = 96 - R * Math.sin(theta);
  const grade =
    avg >= 80 ? { t: 'ดีเยี่ยม', c: '#10b981', text: '#047857', soft: '#d1fae5' } :
    avg >= 50 ? { t: 'ปานกลาง', c: '#f59e0b', text: '#b45309', soft: '#fef3c7' } :
    { t: '', c: '#f43f5e', text: '#be123c', soft: '#ffe4e6' };

  const heroActive = selectedStatus === 'all';

  return (
    <div ref={rootRef}>
      <style>{css}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {/* ============ 1) คะแนนความสำเร็จเฉลี่ย — Gauge (white theme) ============ */}
        <div
          className="kx-card"
          {...cardA11y('all')}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: `1.5px solid ${heroActive ? '#10b981' : '#e8edf3'}`,
            boxShadow: heroActive
              ? '0 0 0 4px rgba(16,185,129,.18), 0 18px 36px -14px rgba(16,185,129,.35)'
              : '0 1px 2px rgba(15,23,42,.04), 0 8px 24px -16px rgba(15,23,42,.18)',
            zIndex: open === 'strategy' ? 30 : undefined,
          }}
        >
          <Aurora color="#10b981" />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="kx-label" style={{ color: '#0f172a' }}>คะแนนความสำเร็จเฉลี่ย</span>
            {grade.t ? (
              <span className="kx-chip" style={{ background: grade.soft, color: grade.text, border: `1px solid ${grade.c}44` }}>
                {grade.t}
              </span>
            ) : null}
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginTop: -2 }}>
            <svg width="100%" viewBox="0 0 200 108" style={{ maxWidth: 230, overflow: 'visible' }} aria-hidden>
              <defs>
                <linearGradient id="kxGauge" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="kxGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
              <path d={`M ${100 - R} 96 A ${R} ${R} 0 0 1 ${100 + R} 96`} fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round" />
              <path
                d={`M ${100 - R} 96 A ${R} ${R} 0 0 1 ${100 + R} 96`}
                fill="none"
                stroke="url(#kxGauge)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={LEN}
                strokeDashoffset={off}
                style={{ ['--len' as string]: LEN, ['--off' as string]: off, animation: 'kxSweep 1s cubic-bezier(.2,.8,.2,1) both' } as React.CSSProperties}
              />
              {[0, 50, 100].map((v) => {
                const a = Math.PI * (1 - v / 100);
                return (
                  <text key={v} x={100 + (R + 16) * Math.cos(a)} y={100 - (R + 16) * Math.sin(a) + 3} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="700">
                    {v}
                  </text>
                );
              })}
              <circle cx={nx} cy={ny} r="9" fill={grade.c} filter="url(#kxGlow)" opacity=".25" />
              <circle cx={nx} cy={ny} r="6" fill="#fff" stroke={grade.c} strokeWidth="3" />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
              <span className="kx-num" style={{ color: '#0f172a', fontSize: 52 }}>{stats.avgScore}</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#64748b', marginLeft: 2 }}>%</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              จาก <b style={{ color: '#0f172a' }}>{total}</b> ตัวชี้วัด
            </span>
            {strategies.length > 0 && (
              <button
                className="kx-btn"
                onClick={togglePanel('strategy')}
                onKeyDown={stop}
                aria-expanded={open === 'strategy'}
                style={{ background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0' }}
              >
                แยกตามยุทธศาสตร์ <span style={{ transform: open === 'strategy' ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }}>▾</span>
              </button>
            )}
          </div>

          {open === 'strategy' && (
            <Popover title="คะแนนเฉลี่ยรายยุทธศาสตร์" count={strategies.length} color="#10b981" onClose={() => setOpen(null)}>
              <div style={{ fontSize: 11.5, color: '#64748b', margin: '-4px 0 8px' }}>คลิกเพื่อกรองตารางตามยุทธศาสตร์</div>
              {strategies.map((s) => {
                const b: Bucket = s.avg >= 100 ? 'achieved' : s.avg >= 50 ? 'in_progress' : 'behind';
                const t = TONE[b];
                const active = selectedStrategy === s.code;
                return (
                  <div
                    key={s.code}
                    className="kx-row"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onSelectStrategy?.(active ? 'all' : s.code);
                      setOpen(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSelectStrategy?.(active ? 'all' : s.code);
                        setOpen(null);
                      }
                    }}
                    style={{ cursor: onSelectStrategy ? 'pointer' : 'default', background: active ? '#ecfdf5' : undefined, outline: active ? '1.5px solid #10b981' : undefined }}
                  >
                    <span className="kx-chip" style={{ background: '#0b1220', color: '#fff', minWidth: 42, justifyContent: 'center' }}>{s.code}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name || `ยุทธศาสตร์ ${s.code}`}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 9, background: '#eef2f7', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(2, s.avg)}%`, height: '100%', background: t.main, borderRadius: 9 }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>บรรลุ {s.ach}/{s.n}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: t.deep, minWidth: 44, textAlign: 'right' }}>{s.avg}%</div>
                  </div>
                );
              })}
            </Popover>
          )}
        </div>

        {/* ============ 2) บรรลุเป้าหมาย — Waffle map ============ */}
        <div ref={wafCardRef} className="kx-card" {...cardA11y('achieved')} style={lightCard('achieved', 'achieved')}>
          <Aurora color={TONE.achieved.main} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="kx-label" style={{ color: TONE.achieved.deep }}>บรรลุเป้าหมาย</span>
            <span className="kx-chip" style={{ background: TONE.achieved.soft, color: TONE.achieved.deep }}>≥ 100%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span className="kx-num" style={{ color: TONE.achieved.main }}>{stats.achieved}</span>
            <div style={{ paddingBottom: 6, lineHeight: 1.2 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>ข้อ</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TONE.achieved.deep }}>{pct(stats.achieved)}% ของทั้งหมด</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto' }} onMouseLeave={() => setTip(null)}>
            {waffle.map((d, i) => {
              const t = TONE[d.bucket];
              const on = d.bucket === 'achieved';
              return (
                <div
                  key={d.k?.kpi.id ?? i}
                  className="kx-dot"
                  style={{
                    background: on ? t.main : `${t.main}38`,
                    boxShadow: on ? `0 0 0 1px ${t.main}22, 0 2px 6px ${t.main}55` : undefined,
                    animation: `kxPop .3s ${Math.min(i * 12, 600)}ms both`,
                  }}
                  onClick={stop}
                  onMouseEnter={(e) => {
                    if (!d.k || !wafCardRef.current) return;
                    const c = wafCardRef.current.getBoundingClientRect();
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setTip({ k: d.k, x: r.left - c.left + r.width / 2, y: r.top - c.top });
                  }}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {(Object.keys(TONE) as Bucket[]).map((b) => (
                <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: b === 'achieved' ? TONE[b].main : `${TONE[b].main}55` }} />
                  {TONE[b].label}
                </span>
              ))}
            </div>
            {items.length > 0 && (
              <button
                className="kx-btn"
                onClick={togglePanel('achieved')}
                onKeyDown={stop}
                style={{ background: TONE.achieved.soft, color: TONE.achieved.deep }}
              >
                ดูรายการ ▾
              </button>
            )}
          </div>

          {tip && (
            <div
              style={{
                position: 'absolute',
                left: Math.max(90, Math.min(tip.x, (wafCardRef.current?.clientWidth ?? 300) - 90)),
                top: tip.y - 8,
                transform: 'translate(-50%,-100%)',
                background: '#0f172a',
                color: '#fff',
                padding: '8px 10px',
                borderRadius: 10,
                fontSize: 11.5,
                width: 180,
                pointerEvents: 'none',
                zIndex: 40,
                boxShadow: '0 10px 24px rgba(15,23,42,.35)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>{tip.k.kpi.code}</span>
                <span style={{ color: TONE[bucketOf(tip.k.status)].glow }}>{Math.round(tip.k.percentage)}%</span>
              </div>
              <div style={{ color: '#cbd5e1', marginTop: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {tip.k.kpi.title}
              </div>
            </div>
          )}

          {open === 'achieved' && (
            <Popover title="ตัวชี้วัดที่บรรลุเป้าหมาย" count={groups.achieved.length} color={TONE.achieved.main} onClose={() => setOpen(null)}>
              <KpiRows list={groups.achieved} />
            </Popover>
          )}
        </div>

        {/* ============ 3) กำลังดำเนินการ — Histogram ============ */}
        <div className="kx-card" {...cardA11y('in_progress')} style={lightCard('in_progress', 'in_progress')}>
          <Aurora color={TONE.in_progress.main} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="kx-label" style={{ color: TONE.in_progress.deep }}>กำลังดำเนินการ</span>
            <span className="kx-chip" style={{ background: TONE.in_progress.soft, color: TONE.in_progress.deep }}>50–99%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span className="kx-num" style={{ color: TONE.in_progress.main }}>{inProgress}</span>
            <div style={{ paddingBottom: 6, lineHeight: 1.2 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>ข้อ</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TONE.in_progress.deep }}>
                {hoverBin !== null ? `ช่วง ${BINS[hoverBin]}–${BINS[hoverBin] + 9}% : ${binCounts[hoverBin]} ข้อ` : `${pct(inProgress)}% ของทั้งหมด`}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 62 }} onMouseLeave={() => setHoverBin(null)}>
              {BINS.map((b, i) => {
                const n = binCounts[i];
                const h = items.length ? Math.max(8, (n / maxBin) * 100) : 8 + i * 4;
                const isOpen = open === `bin-${i}`;
                const hot = hoverBin === i || isOpen;
                return (
                  <div
                    key={b}
                    role="button"
                    tabIndex={0}
                    aria-label={`ช่วง ${b}-${b + 9}% จำนวน ${n} ข้อ`}
                    className="kx-bar"
                    onMouseEnter={() => setHoverBin(i)}
                    onClick={togglePanel(`bin-${i}`)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') setOpen(isOpen ? null : `bin-${i}`);
                    }}
                    style={{
                      height: `${h}%`,
                      position: 'relative',
                      animationDelay: `${i * 70}ms`,
                      background: hot
                        ? `linear-gradient(180deg, ${TONE.in_progress.glow}, ${TONE.in_progress.deep})`
                        : `linear-gradient(180deg, ${TONE.in_progress.main}cc, ${TONE.in_progress.main}66)`,
                      boxShadow: hot ? `0 6px 14px ${TONE.in_progress.main}55` : undefined,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: -16,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        color: TONE.in_progress.deep,
                        opacity: items.length ? 1 : 0,
                      }}
                    >
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              {BINS.map((b) => (
                <span key={b} style={{ flex: 1, textAlign: 'center', fontSize: 10.5, color: '#94a3b8', fontWeight: 700 }}>
                  {b}+
                </span>
              ))}
            </div>
          </div>

          {open?.startsWith('bin-') && (() => {
            const i = Number(open.split('-')[1]);
            return (
              <Popover
                title={`ความสำเร็จ ${BINS[i]}–${BINS[i] + 9}%`}
                count={groups.bins[i].length}
                color={TONE.in_progress.main}
                onClose={() => setOpen(null)}
              >
                <div style={{ fontSize: 11.5, color: '#64748b', margin: '-4px 0 8px' }}>
                  {i === 4 ? 'ใกล้บรรลุเป้าหมาย — ผลักดันอีกนิด' : 'คลิกแท่งอื่นเพื่อดูช่วงอื่น'}
                </div>
                <KpiRows list={groups.bins[i]} />
              </Popover>
            );
          })()}
        </div>

        {/* ============ 4) ต้องเร่งรัด — Watchlist ============ */}
        <div className="kx-card" {...cardA11y('behind')} style={lightCard('behind', 'behind')}>
          <Aurora color={TONE.behind.main} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="kx-label" style={{ color: TONE.behind.deep, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 99,
                  background: TONE.behind.main,
                  animation: stats.behind > 0 ? 'kxPulse 1.6s infinite' : undefined,
                }}
              />
              ต้องเร่งรัด
            </span>
            <span className="kx-chip" style={{ background: TONE.behind.soft, color: TONE.behind.deep }}>≤ 49%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span className="kx-num" style={{ color: TONE.behind.main }}>{stats.behind}</span>
            <div style={{ paddingBottom: 6, lineHeight: 1.2 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>ข้อ</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TONE.behind.deep }}>{pct(stats.behind)}% ของทั้งหมด</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groups.behind.slice(0, 3).map((k) => {
              const p = Math.round(k.percentage);
              return (
                <div key={k.kpi.id} title={k.kpi.title} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#334155', minWidth: 48, fontFamily: 'ui-monospace,monospace' }}>{k.kpi.code}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 9, background: TONE.behind.soft, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.max(3, p * 2)}%`, height: '100%', borderRadius: 9, background: `linear-gradient(90deg, ${TONE.behind.deep}, ${TONE.behind.glow})` }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: TONE.behind.deep, minWidth: 34, textAlign: 'right' }}>{p}%</span>
                </div>
              );
            })}
            {items.length > 0 && groups.behind.length === 0 && (
              <div style={{ fontSize: 12.5, fontWeight: 700, color: TONE.achieved.deep }}>🎉 ไม่มีตัวชี้วัดที่ต้องเร่งรัด</div>
            )}
            {groups.behind.length > 0 && (
              <button
                className="kx-btn"
                onClick={togglePanel('behind')}
                onKeyDown={stop}
                style={{ alignSelf: 'flex-end', background: TONE.behind.main, color: '#fff', boxShadow: `0 6px 14px ${TONE.behind.main}55` }}
              >
                ดูทั้งหมด {groups.behind.length} ข้อ ▾
              </button>
            )}
          </div>

          {open === 'behind' && (
            <Popover title="ตัวชี้วัดที่ต้องเร่งรัด" count={groups.behind.length} color={TONE.behind.main} onClose={() => setOpen(null)} align="right">
              <div style={{ fontSize: 11.5, color: '#64748b', margin: '-4px 0 8px' }}>เรียงจากห่างเป้าหมายมากที่สุด</div>
              <KpiRows list={groups.behind} />
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}
