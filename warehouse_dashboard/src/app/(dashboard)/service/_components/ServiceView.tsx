'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { PastelIllustratedKpiCard } from '@/components/ui/PastelIllustratedKpiCard';

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
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <TimeFilterBar
            value={timeFilter}
            onChange={setTimeFilter}
            onReset={resetTimeFilter}
            totalCount={validData.length}
          />

          <DepartmentSelect
            value={selectedDept}
            onChange={setSelectedDept}
            allowAll
            allLabel="ทุกภาควิชา / ศูนย์"
            allValue="all"
            size="sm"
            className="w-[180px]"
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {/* Smart Activity Role Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              padding: '0 12px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '12.5px',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
              outline: 'none',
              height: '36px',
              minWidth: '210px',
              boxSizing: 'border-box',
            }}
            aria-label="ลักษณะบทบาทงานบริการวิชาการ"
          >
            <option value="all">ทุกลักษณะบทบาท ({validData.length})</option>
            <option value="คณะกรรมการ/อนุกรรมการ/คณะทำงาน">คณะกรรมการ / อนุกรรมการ</option>
            <option value="วิทยากร/บรรยายพิเศษ">วิทยากร / บรรยายพิเศษ</option>
            <option value="ผู้ทรงคุณวุฒิ/ประเมินผลงาน">ผู้ทรงคุณวุฒิ / ประเมินผลงาน</option>
            <option value="ศึกษาดูงาน/ต้อนรับ">ศึกษาดูงาน / ต้อนรับ</option>
            <option value="กรรมการสอบวิทยานิพนธ์ภายนอก">กรรมการสอบวิทยานิพนธ์</option>
            <option value="ที่ปรึกษา/บริการวิชาชีพ/ตรวจวัด">ที่ปรึกษา / บริการวิชาชีพ</option>
            <option value="งานบริการวิชาการอื่นๆ">งานบริการวิชาการอื่นๆ</option>
          </select>

          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
          />
        </div>
      </div>

      {/* ZONE 2: Decorative Pastel Illustrated KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        <PastelIllustratedKpiCard
          variant="amber-spark"
          label="งานบริการวิชาการทั้งหมด"
          value={validData.length}
          unit="ครั้ง"
          badgeText={`เฉลี่ย ${avgPerMonth} ครั้ง/เดือน`}
          progressPercent={88}
          subtitle="ให้บริการสูงสุดในช่วงเดือนมกราคม (43-47 ครั้ง)"
        />

        <PastelIllustratedKpiCard
          variant="peach-people"
          label="บุคลากรผู้ให้บริการวิชาการ"
          value={uniquePersons.size}
          unit="ท่าน"
          badgeText={`เฉลี่ย ${avgPerStaff} ครั้ง/ท่าน`}
          progressPercent={76}
          subtitle="ผู้ให้บริการสูงสุดคือ รศ.ดร.บัญชา ขวัญยืน"
        />

        <PastelIllustratedKpiCard
          variant="indigo-network"
          label="เครือข่ายผู้รับบริการภายนอก"
          value={uniqueTargets.size}
          unit="หน่วยงาน"
          badgeText="ครอบคลุมทุกภาคส่วน"
          progressPercent={92}
          subtitle="หน่วยงานภาครัฐ ชุมชน สถานศึกษา และภาคเอกชน"
        />

        <PastelIllustratedKpiCard
          variant="teal-globe"
          label="หน่วยงานที่ร่วมดำเนินการ"
          value="10"
          unit="หน่วยงาน"
          badgeText="มีส่วนร่วมครบ 100%"
          progressPercent={100}
          subtitle="ครอบคลุมทั้ง 7 ภาควิชา และ 3 ศูนย์ปฏิบัติการ"
        />
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
