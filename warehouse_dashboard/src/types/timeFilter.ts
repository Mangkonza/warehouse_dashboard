export type TimeFilterMode = 'academic' | 'fiscal' | 'manual' | 'all';
export type AcademicSemester = 'all' | 'first' | 'second' | 'summer';
export type FiscalQuarter = 'all' | 'q1' | 'q2' | 'q3' | 'q4';

export interface TimeFilterState {
  mode: TimeFilterMode;
  academicYear: string;         // '2569', '2568', '2567', '2566', '2565', 'all'
  academicSemester: AcademicSemester; // 'all', 'first', 'second', 'summer'
  fiscalYear: string;           // '2569', '2568', '2567', '2566', '2565', 'all'
  fiscalQuarter: FiscalQuarter; // 'all', 'q1', 'q2', 'q3', 'q4'
  manualYear: string;           // '2569', '2568', '2567', '2566', '2565', 'all'
  manualMonths: number[];       // 1 - 12 (Jan - Dec)
}

export const DEFAULT_TIME_FILTER: TimeFilterState = {
  mode: 'all',
  academicYear: '2568',
  academicSemester: 'first',
  fiscalYear: '2568',
  fiscalQuarter: 'all',
  manualYear: '2568',
  manualMonths: [],
};

export const getTimeFilterLabel = (filter: TimeFilterState): string => {
  if (filter.mode === 'all') {
    return 'แสดงข้อมูลทั้งหมด';
  }
  if (filter.mode === 'academic') {
    const semMap: Record<AcademicSemester, string> = {
      all: 'ทุกภาคการศึกษา',
      first: 'ภาคต้น',
      second: 'ภาคปลาย',
      summer: 'ภาคฤดูร้อน',
    };
    const yrStr = filter.academicYear === 'all' ? 'ทุกปีการศึกษา' : `ปีการศึกษา ${filter.academicYear}`;
    return `${yrStr} • ${semMap[filter.academicSemester]}`;
  }
  if (filter.mode === 'fiscal') {
    const qMap: Record<FiscalQuarter, string> = {
      all: 'ทั้งปีงบประมาณ',
      q1: 'ไตรมาส 1 (ต.ค. - ธ.ค.)',
      q2: 'ไตรมาส 2 (ม.ค. - มี.ค.)',
      q3: 'ไตรมาส 3 (เม.ย. - มิ.ย.)',
      q4: 'ไตรมาส 4 (ก.ค. - ก.ย.)',
    };
    const yrStr = filter.fiscalYear === 'all' ? 'ทุกปีงบประมาณ' : `ปีงบประมาณ ${filter.fiscalYear}`;
    return `${yrStr} • ${qMap[filter.fiscalQuarter]}`;
  }
  if (filter.mode === 'manual') {
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthsStr =
      filter.manualMonths.length === 12 || filter.manualMonths.length === 0
        ? 'ทุกเดือน'
        : filter.manualMonths.map((m) => months[m - 1]).join(', ');
    const yrStr = filter.manualYear === 'all' ? 'ทุกปี' : `ปี ${filter.manualYear}`;
    return `${yrStr} • เดือน: ${monthsStr}`;
  }
  return 'เลือกช่วงเวลา';
};

// สกัดข้อมูลปี พ.ศ. และเดือน (1-12) จาก Object ข้อมูลใดๆ
export const extractItemDateInfo = (item: any): { yearBE: number; month?: number } => {
  const str = JSON.stringify(item);

  let yearBE: number | undefined;
  let month: number | undefined;

  // 1. ตรวจหาปี พ.ศ. (2560 - 2575)
  const beMatch = str.match(/256[0-9]|257[0-9]/);
  if (beMatch) {
    yearBE = parseInt(beMatch[0], 10);
  } else {
    // ตรวจหาปี 196x (ในไฟล์ Excel ภาษาไทยบางครั้งปี 2568 ถูกเก็บเป็น 1968)
    const excelMatch = str.match(/196([0-9])|197([0-9])/);
    if (excelMatch) {
      const suffix = excelMatch[1] || excelMatch[2];
      const prefix = excelMatch[0].startsWith('196') ? 2560 : 2570;
      yearBE = prefix + parseInt(suffix, 10);
    } else {
      // ตรวจหาปี ค.ศ. (2020 - 2030)
      const ceMatch = str.match(/202([0-9])|203([0-9])/);
      if (ceMatch) {
        yearBE = parseInt(ceMatch[0], 10) + 543;
      }
    }
  }

  // 2. ตรวจหาเดือน (1 - 12)
  if (item.month) {
    const mStr = String(item.month).trim();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const idx = months.findIndex((m) => mStr.includes(m));
    if (idx !== -1) month = idx + 1;
  }

  if (!month) {
    if (/(ม\.ค\.|มกราคม|-01-|\/01\/|\.01\.)/.test(str)) month = 1;
    else if (/(ก\.พ\.|กุมภาพันธ์|-02-|\/02\/|\.02\.)/.test(str)) month = 2;
    else if (/(มี\.ค\.|มีนาคม|-03-|\/03\/|\.03\.)/.test(str)) month = 3;
    else if (/(เม\.ย\.|เมษายน|-04-|\/04\/|\.04\.)/.test(str)) month = 4;
    else if (/(พ\.ค\.|พฤษภาคม|-05-|\/05\/|\.05\.)/.test(str)) month = 5;
    else if (/(มิ\.ย\.|มิถุนายน|-06-|\/06\/|\.06\.)/.test(str)) month = 6;
    else if (/(ก\.ค\.|กรกฎาคม|-07-|\/07\/|\.07\.)/.test(str)) month = 7;
    else if (/(ส\.ค\.|สิงหาคม|-08-|\/08\/|\.08\.)/.test(str)) month = 8;
    else if (/(ก\.ย\.|กันยายน|-09-|\/09\/|\.09\.)/.test(str)) month = 9;
    else if (/(ต\.ค\.|ตุลาคม|-10-|\/10\/|\.10\.)/.test(str)) month = 10;
    else if (/(พ\.ย\.|พฤศจิกายน|-11-|\/11\/|\.11\.)/.test(str)) month = 11;
    else if (/(ธ\.ค\.|ธันวาคม|-12-|\/12\/|\.12\.)/.test(str)) month = 12;
  }

  return { yearBE: yearBE || 2568, month };
};

// ตรวจสอบว่ารายการข้อมูลตรงตามตัวกรองเวลาหรือไม่
export const itemMatchesTimeFilter = (item: any, filter: TimeFilterState): boolean => {
  if (filter.mode === 'all') return true;

  const dateInfo = extractItemDateInfo(item);
  const str = JSON.stringify(item);

  // 1. กรองตามปีการศึกษา & ภาคการศึกษา
  if (filter.mode === 'academic') {
    if (filter.academicYear !== 'all') {
      const targetYear = parseInt(filter.academicYear, 10);
      if (dateInfo.yearBE !== targetYear) {
        // ตรวจว่าใน text มีปีที่ระบุหรือไม่
        if (!str.includes(filter.academicYear)) return false;
      }
    }

    if (filter.academicSemester !== 'all') {
      if (filter.academicSemester === 'first') {
        // ภาคต้น: มิ.ย. (6) - ต.ค. (10)
        if (dateInfo.month && ![6, 7, 8, 9, 10].includes(dateInfo.month)) {
          if (!str.includes('ภาคต้น') && !str.includes('เทอม 1')) return false;
        }
      } else if (filter.academicSemester === 'second') {
        // ภาคปลาย: พ.ย. (11) - มี.ค. (3)
        if (dateInfo.month && ![11, 12, 1, 2, 3].includes(dateInfo.month)) {
          if (!str.includes('ภาคปลาย') && !str.includes('เทอม 2')) return false;
        }
      } else if (filter.academicSemester === 'summer') {
        // ภาคฤดูร้อน: เม.ย. (4) - พ.ค. (5)
        if (dateInfo.month && ![4, 5].includes(dateInfo.month)) {
          if (!str.includes('ฤดูร้อน') && !str.includes('summer')) return false;
        }
      }
    }

    return true;
  }

  // 2. กรองตามปีงบประมาณ & ไตรมาส
  if (filter.mode === 'fiscal') {
    if (filter.fiscalYear !== 'all') {
      const targetYear = parseInt(filter.fiscalYear, 10);
      if (dateInfo.yearBE !== targetYear && !str.includes(filter.fiscalYear)) {
        return false;
      }
    }

    if (filter.fiscalQuarter !== 'all') {
      if (filter.fiscalQuarter === 'q1') {
        // ไตรมาส 1: ต.ค. (10) - ธ.ค. (12)
        if (dateInfo.month && ![10, 11, 12].includes(dateInfo.month)) return false;
      } else if (filter.fiscalQuarter === 'q2') {
        // ไตรมาส 2: ม.ค. (1) - มี.ค. (3)
        if (dateInfo.month && ![1, 2, 3].includes(dateInfo.month)) return false;
      } else if (filter.fiscalQuarter === 'q3') {
        // ไตรมาส 3: เม.ย. (4) - มิ.ย. (6)
        if (dateInfo.month && ![4, 5, 6].includes(dateInfo.month)) return false;
      } else if (filter.fiscalQuarter === 'q4') {
        // ไตรมาส 4: ก.ค. (7) - ก.ย. (9)
        if (dateInfo.month && ![7, 8, 9].includes(dateInfo.month)) return false;
      }
    }

    return true;
  }

  // 3. กรองแบบ Manual
  if (filter.mode === 'manual') {
    if (filter.manualYear !== 'all') {
      const targetYear = parseInt(filter.manualYear, 10);
      if (dateInfo.yearBE !== targetYear && !str.includes(filter.manualYear)) {
        return false;
      }
    }

    if (filter.manualMonths && filter.manualMonths.length > 0 && filter.manualMonths.length < 12) {
      if (dateInfo.month && !filter.manualMonths.includes(dateInfo.month)) {
        return false;
      }
    }

    return true;
  }

  return true;
};
