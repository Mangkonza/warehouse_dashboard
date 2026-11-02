'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { FaHandshake, FaUsers, FaGlobeAsia, FaBuilding, FaUndoAlt } from 'react-icons/fa';

export function ServiceView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    fiscalYear,
    setFiscalYear,
    selectedRole,
    setSelectedRole,
    strategicFilter,
    setStrategicFilter,
    countsByFiscalYear,
  } = useServiceData(timeFilter);

  const hasFilter =
    fiscalYear !== 'all' ||
    selectedDept !== 'all' ||
    selectedRole !== 'all' ||
    strategicFilter !== 'all' ||
    searchTerm.trim() !== '';

  const handleResetAll = () => {
    resetTimeFilter();
    setFiscalYear('all');
    setSelectedDept('all');
    setSelectedRole('all');
    setStrategicFilter('all');
    setSearchTerm('');
  };

  const avgPerMonth = (validData.length / 12).toFixed(1);
  const avgPerStaff = uniquePersons.size > 0 ? (validData.length / uniquePersons.size).toFixed(1) : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ZONE 1: Global Filter Bar (Sticky Docked Under Header) */}
      <div
        style={{
          position: 'sticky',
          top: '50px',
          zIndex: 40,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <TimeFilterBar
          value={timeFilter}
          onChange={setTimeFilter}
          onReset={resetTimeFilter}
          totalCount={validData.length}
        />

        {/* Fiscal Year Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            fontSize: '12px',
            fontWeight: 500,
            height: '32px',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          {[
            { id: 'all', label: `ทั้งหมด (${countsByFiscalYear.all || validData.length})` },
            { id: '2568', label: `ปีงบ 2568 (${countsByFiscalYear['2568'] || 236})` },
            { id: '2569', label: `ปีงบ 2569 (${countsByFiscalYear['2569'] || 70})` },
          ].map((tab) => {
            const active = fiscalYear === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFiscalYear(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: active ? '#ffffff' : 'transparent',
                  color: active ? '#b45309' : '#64748b',
                  fontWeight: active ? 700 : 500,
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <DepartmentSelect
          value={selectedDept}
          onChange={setSelectedDept}
          allowAll
          allLabel="ทุกภาควิชา / ศูนย์"
          allValue="all"
          size="sm"
          className="w-[170px]"
        />

        {/* Smart Activity Role Dropdown */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '9px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            cursor: 'pointer',
            fontWeight: 500,
            outline: 'none',
            height: '32px',
            boxSizing: 'border-box',
            maxWidth: '200px',
          }}
        >
          <option value="all">ทุกลักษณะบทบาท ({validData.length})</option>
          <option value="คณะกรรมการ/อนุกรรมการ/คณะทำงาน">คณะกรรมการ/อนุกรรมการ</option>
          <option value="วิทยากร/บรรยายพิเศษ">วิทยากร/บรรยายพิเศษ</option>
          <option value="ผู้ทรงคุณวุฒิ/ประเมินผลงาน">ผู้ทรงคุณวุฒิ/ประเมิน</option>
          <option value="ศึกษาดูงาน/ต้อนรับ">ศึกษาดูงาน/ต้อนรับ</option>
          <option value="กรรมการสอบวิทยานิพนธ์ภายนอก">กรรมการสอบวิทยานิพนธ์</option>
          <option value="ที่ปรึกษา/บริการวิชาชีพ/ตรวจวัด">ที่ปรึกษา/บริการวิชาชีพ</option>
          <option value="งานบริการวิชาการอื่นๆ">งานอื่นๆ</option>
        </select>

        {/* Strategic Filter (ISEE / IAM / SDGs) */}
        <StrategicFilterSelect
          value={strategicFilter}
          onChange={setStrategicFilter}
        />

        {hasFilter && (
          <button
            type="button"
            onClick={handleResetAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #fed7aa',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              height: '32px',
              boxSizing: 'border-box',
              marginLeft: 'auto',
            }}
          >
            <FaUndoAlt style={{ fontSize: '11px' }} />
            <span>ล้างตัวกรอง</span>
          </button>
        )}
      </div>

      {/* ZONE 2: Executive Bento KPI Cards in Amber Peach Palette */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Services */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              งานบริการวิชาการทั้งหมด
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
              }}
            >
              <FaHandshake style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {validData.length} <span style={{ fontSize: '16px', fontWeight: 600, color: '#92400e' }}>ครั้ง</span>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              เฉลี่ย ~{avgPerMonth} ครั้ง/เดือน • ม.ค. พีคสูงสุด (43-47 ครั้ง)
            </div>
          </div>
        </div>

        {/* Card 2: Active Contributors */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              บุคลากรผู้ให้บริการวิชาการ
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
              }}
            >
              <FaUsers style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {uniquePersons.size} <span style={{ fontSize: '16px', fontWeight: 600, color: '#92400e' }}>ท่าน</span>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              เฉลี่ย {avgPerStaff} ครั้ง/ท่าน • สูงสุด รศ.ดร.บัญชา (54 ครั้ง)
            </div>
          </div>
        </div>

        {/* Card 3: Network Reach */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              เครือข่ายผู้รับบริการภายนอก
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
              }}
            >
              <FaGlobeAsia style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {uniqueTargets.size} <span style={{ fontSize: '16px', fontWeight: 600, color: '#92400e' }}>หน่วยงาน</span>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              ครอบคลุมหน่วยงานรัฐ ชุมชน เอกชน และสากล
            </div>
          </div>
        </div>

        {/* Card 4: Participating Units */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              หน่วยงานที่ร่วมดำเนินการ
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
              }}
            >
              <FaBuilding style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              10 <span style={{ fontSize: '16px', fontWeight: 600, color: '#92400e' }}>หน่วยงาน</span>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              7 ภาควิชา • 3 ศูนย์วิจัย (บุคลากรมีส่วนร่วม 100%)
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3: 4 Dimension Tabs Charts */}
      <ServiceCharts
        validData={validData}
        onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
        onSelectType={(type) => setSelectedRole(type === selectedRole ? 'all' : type)}
        onSelectPerson={(person) => setSearchTerm(searchTerm === person ? '' : person)}
      />

      {/* ZONE 4: Interactive Service Explorer Table */}
      <ServiceTable
        filteredData={filteredData}
        totalCount={validData.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        selectedType={selectedRole}
        onTypeChange={setSelectedRole}
      />
    </div>
  );
}
