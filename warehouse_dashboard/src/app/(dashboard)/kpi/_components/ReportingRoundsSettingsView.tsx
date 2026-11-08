'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaRedoAlt,
  FaSave,
  FaTrashAlt,
} from 'react-icons/fa';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { KPIReportingRoundConfig } from '@/types/kpi';
import {
  DEFAULT_REPORTING_ROUNDS,
  getStoredReportingRounds,
  saveStoredReportingRounds,
  formatRoundDateRange,
} from '@/lib/kpiEngine';

export function ReportingRoundsSettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/kpi';

  const [rounds, setRounds] = useState<KPIReportingRoundConfig[]>(() => getStoredReportingRounds());
  const [savedBanner, setSavedBanner] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    setRounds(getStoredReportingRounds());
  }, []);

  const handleAddRound = () => {
    const nextOrder = rounds.length + 1;
    const newRound: KPIReportingRoundConfig = {
      id: `round-custom-${Date.now()}`,
      name: `รอบรายงานที่ ${nextOrder} (เช่น รอบ 12 เดือน)`,
      startDate: '2025-10-01',
      endDate: '2026-09-30',
      dueDate: '2026-10-15',
      isCumulative: true,
      fiscalYear: '2569',
      sortOrder: nextOrder,
    };
    setRounds((prev) => [...prev, newRound]);
  };

  const handleUpdateField = (
    idx: number,
    field: keyof KPIReportingRoundConfig,
    value: any
  ) => {
    setErrorMsg('');
    setRounds((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const updated = { ...r, [field]: value };
        if (field === 'startDate' && value && updated.endDate && value > updated.endDate) {
          updated.endDate = '';
        }
        if (field === 'endDate' && value && updated.startDate && value < updated.startDate) {
          updated.startDate = '';
        }
        return updated;
      })
    );
  };

  const handleDeleteRound = (idx: number) => {
    if (rounds.length <= 1) {
      setErrorMsg('ต้องมีรอบการรายงานผลอย่างน้อย 1 รอบในระบบ');
      return;
    }
    setRounds((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleResetDefault = () => {
    setRounds(DEFAULT_REPORTING_ROUNDS);
    saveStoredReportingRounds(DEFAULT_REPORTING_ROUNDS);
    setSavedBanner('คืนค่ารอบการรายงานผลเริ่มต้น (รอบ 6 เดือน / รอบ 9 เดือน) เรียบร้อยแล้ว');
    setTimeout(() => setSavedBanner(''), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    for (const r of rounds) {
      if (!r.name || !r.name.trim()) {
        setErrorMsg('กรุณาระบุ "ชื่อรอบการรายงานผล" ให้ครบทุกรอบ');
        return;
      }
      if (r.startDate && r.endDate && r.endDate < r.startDate) {
        setErrorMsg(`รอบ "${r.name}": วันสิ้นสุดช่วงข้อมูลต้องไม่เกิดก่อนวันเริ่มต้น`);
        return;
      }
    }

    saveStoredReportingRounds(rounds);
    setSavedBanner('บันทึกการตั้งค่ารอบการรายงานผลกลางเรียบร้อยแล้ว');
    setTimeout(() => {
      router.push(returnTo);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* แถบหัวหน้า (Header มาตรฐานธีมสีเขียว มก.) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #006838 0%, #00A651 100%)',
          color: '#ffffff',
          padding: '20px 28px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 16px rgba(0, 104, 56, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => router.push(returnTo)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.35)',
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="ย้อนกลับ"
          >
            <FaArrowLeft />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendarCheck style={{ fontSize: '18px' }} />
              <h1 style={{ margin: 0, fontSize: '19px', fontWeight: 700 }}>
                ตั้งค่ารอบการรายงานผล (ค่ากลางของระบบ)
              </h1>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              กำหนดชื่อรอบ ช่วงวันที่ของข้อมูล กำหนดส่ง และการนับสะสมจากต้นปี เพื่อให้ทุกตัวชี้วัดเลือกใช้งานร่วมกัน
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefault}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.4)',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <FaRedoAlt style={{ fontSize: '11px' }} />
          <span>คืนค่ารอบมาตรฐาน</span>
        </button>
      </div>

      {savedBanner && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #86efac',
            color: '#047857',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <FaCheckCircle />
          <span>{savedBanner}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#006838' }}>
                รายการรอบการรายงานผลกลาง ({rounds.length} รอบ)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                ชื่อรอบกับช่วงวันที่เป็นคนละฟิลด์ เช่น ช่วง ต.ค. 2568 – ก.ค. 2569 (10 เดือน) สามารถตั้งชื่อว่า &ldquo;รอบ 9 เดือน&rdquo; ได้ และการแก้ไขช่วงวันที่ภายหลังจะไม่กระทบข้อมูลเก่า
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddRound}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #00A651',
                backgroundColor: '#f0fbf5',
                color: '#00A651',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FaPlus style={{ fontSize: '11px' }} />
              <span>+ เพิ่มรอบการรายงานผล (เช่น 12 เดือน, รายไตรมาส)</span>
            </button>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                minWidth: '880px',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#eaf4ee', color: '#14532d' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', width: '22%' }}>
                    ชื่อรอบการรายงานผล
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', width: '22%' }}>
                    วันเริ่มต้นช่วงข้อมูล
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', width: '22%' }}>
                    วันสิ้นสุดช่วงข้อมูล
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', width: '18%' }}>
                    กำหนดส่งรายงาน
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', width: '11%' }}>
                    นับสะสมจากต้นปี
                  </th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', width: '5%' }}>ลบ</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r, idx) => (
                  <tr
                    key={r.id}
                    style={{
                      borderTop: '1px solid #e2e8f0',
                      backgroundColor: idx % 2 === 1 ? '#fafcfb' : '#ffffff',
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      <input
                        type="text"
                        value={r.name}
                        onChange={(e) => handleUpdateField(idx, 'name', e.target.value)}
                        placeholder="เช่น รอบ 6 เดือน"
                        style={{
                          width: '100%',
                          height: '36px',
                          padding: '0 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                        }}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                        ช่วงที่แสดง: {formatRoundDateRange(r, true)}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <DatePicker
                        value={r.startDate}
                        maxDate={r.endDate || undefined}
                        onChange={(_d, iso) => handleUpdateField(idx, 'startDate', iso)}
                        placeholder="เลือกวันเริ่มต้น..."
                      />
                    </td>

                    <td style={{ padding: '12px' }}>
                      <DatePicker
                        value={r.endDate}
                        minDate={r.startDate || undefined}
                        onChange={(_d, iso) => handleUpdateField(idx, 'endDate', iso)}
                        placeholder="เลือกวันสิ้นสุด..."
                      />
                    </td>

                    <td style={{ padding: '12px' }}>
                      <DatePicker
                        value={r.dueDate || ''}
                        minDate={r.startDate || undefined}
                        onChange={(_d, iso) => handleUpdateField(idx, 'dueDate', iso)}
                        placeholder="เลือกวันกำหนดส่ง..."
                      />
                    </td>

                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          color: r.isCumulative ? '#047857' : '#64748b',
                        }}
                      >
                        <Checkbox
                          checked={r.isCumulative}
                          onCheckedChange={(checked) =>
                            handleUpdateField(idx, 'isCumulative', Boolean(checked))
                          }
                        />
                        <span>{r.isCumulative ? 'เปิด (สะสม)' : 'เฉพาะรอบ'}</span>
                      </label>
                    </td>

                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteRound(idx)}
                        style={{
                          border: 'none',
                          background: '#fee2e2',
                          color: '#dc2626',
                          borderRadius: '6px',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="ลบรอบการรายงานผลนี้"
                      >
                        <FaTrashAlt style={{ fontSize: '12px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#475569',
            }}
          >
            <FaInfoCircle style={{ color: '#00A651', flexShrink: 0 }} />
            <span>
              เมื่อเพิ่มหรือแก้ไขรอบการรายงานผลในหน้านี้ ฟอร์มตั้งค่าตัวชี้วัดและตารางรายงานผลตัวชี้วัดยุทธศาสตร์จะอัปเดตรอบให้เลือกโดยอัตโนมัติ โดยเก็บผลการดำเนินงานเป็นแถวต่อรอบ
            </span>
          </div>
        </div>

        {/* ปุ่มบันทึกขวาล่างตามมาตรฐานหน้าอื่น */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            paddingTop: '4px',
            paddingBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => router.push(returnTo)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #00A651',
              backgroundColor: '#ffffff',
              color: '#00A651',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#00A651',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 166, 81, 0.25)',
            }}
          >
            <FaSave />
            <span>บันทึกการตั้งค่ารอบการรายงานผล</span>
          </button>
        </div>
      </form>
    </div>
  );
}
