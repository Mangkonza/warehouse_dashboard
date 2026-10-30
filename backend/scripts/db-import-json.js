const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const reportsDir = path.resolve(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const skippedRows = [];
const summary = {};

// ==========================================
// Data Cleansing Helpers
// ==========================================

function cleanStr(val) {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!s || s === '-' || s === 'nan' || s === 'NaT' || s === 'null' || s === 'undefined' || s === 'ü' || s === 'P') {
    return null;
  }
  return s;
}

function cleanNum(val) {
  if (val === null || val === undefined) return 0;
  const s = cleanStr(val);
  if (!s) return 0;
  const cleaned = s.replace(/[^0-9.-]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function cleanInt(val) {
  if (val === null || val === undefined) return null;
  const s = cleanStr(val);
  if (!s) return null;
  const cleaned = s.replace(/[^0-9-]/g, '');
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? null : n;
}

function parseDate(val) {
  const s = cleanStr(val);
  if (!s) return null;

  let y, m, d;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const parts = s.split('T')[0].split('-');
    y = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    d = parseInt(parts[2], 10);
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(s)) {
    const parts = s.split('/');
    d = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
    y = parseInt(parts[2], 10);
  } else {
    const dt = new Date(s);
    if (isNaN(dt.getTime())) return null;
    y = dt.getFullYear();
    m = dt.getMonth() + 1;
    d = dt.getDate();
  }

  // Buddhist Era detection (e.g. 2567 -> 2024)
  if (y > 2400) {
    y -= 543;
  }

  if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return new Date(`${y}-${pad(m)}-${pad(d)}T00:00:00.000Z`);
}

function mapDepartmentCode(raw) {
  const clean = cleanStr(raw);
  if (!clean) return 'OTH';
  const c = clean.toUpperCase();
  if (c.includes('เกษตร') || c.includes('ABE') || c.includes('AE')) return 'AE';
  if (c.includes('คอมพิวเตอร์') || c.includes('CPE')) return 'CPE';
  if (c.includes('ชลประทาน') || c.includes('IRE')) return 'IRE';
  if (c.includes('อาหาร') || c.includes('FE')) return 'FE';
  if (c.includes('อุตสาหการ') || c.includes('IE')) return 'IE';
  if (c.includes('เครื่องกล') || c.includes('ME')) return 'ME';
  if (c.includes('โยธา') || c.includes('CE')) return 'CE';
  if (c.includes('พลังงานและสิ่งแวดล้อม') || c.includes('EEEC')) return 'EEEC';
  if (c.includes('ประตู') || c.includes('DWT')) return 'DWT';
  if (c.includes('เครื่องจักรกลการเกษตร') || c.includes('NAMC')) return 'NAMC';
  if (c.includes('เลขานุการ') || c.includes('OFS')) return 'OFS';
  return 'OTH';
}

function readJsonFile(filename) {
  const dataBakDir = path.resolve(__dirname, '../../data.bak');
  const dashDataBakDir = path.resolve(__dirname, '../../warehouse_dashboard/src/data.bak');

  let filePath = path.join(dashDataBakDir, filename);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(dataBakDir, filename);
  }
  if (!fs.existsSync(filePath)) {
    console.warn(`[readJsonFile] Not found: ${filename}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ==========================================
// Main Import Logic
// ==========================================

async function main() {
  console.log('🚀 Starting db:import-json (reading ONLY from data.bak/)...');

  // Load personnel map for relational lookup
  const personnelMap = new Map(); // name -> id

  // ----------------------------------------------------
  // 1. Funding Sources
  // ----------------------------------------------------
  console.log('\n--- [1/9] Importing Funding Sources ---');
  const fundingSources = readJsonFile('funding_sources.json') || [];
  let fsCount = 0;
  for (const item of fundingSources) {
    const name = cleanStr(item.name || item.title);
    if (!name) continue;
    const existing = await prisma.fundingSource.findFirst({ where: { name } });
    if (!existing) {
      await prisma.fundingSource.create({
        data: {
          name,
          type: cleanStr(item.type),
        },
      });
    }
    fsCount++;
  }
  summary.funding_sources = { fileRows: fundingSources.length, imported: fsCount };
  console.log(`✅ Funding Sources: ${fsCount} imported.`);

  // ----------------------------------------------------
  // 2. Course Catalog
  // ----------------------------------------------------
  console.log('\n--- [2/9] Importing Course Catalog ---');
  const courses = readJsonFile('course_catalog.json') || [];
  let courseCount = 0;
  for (const item of courses) {
    const code = cleanStr(item.course_code || item.code || item.id);
    const nameTh = cleanStr(item.course_name_th || item.name_th || item.name || item.nameTh);
    if (!code || !nameTh) continue;
    const deptCode = mapDepartmentCode(item.department || item.department_code);

    await prisma.courseCatalog.upsert({
      where: { courseCode: code },
      update: {
        courseNameTh: nameTh,
        courseNameEn: cleanStr(item.course_name_en || item.name_en || item.nameEn),
        departmentCode: deptCode,
      },
      create: {
        courseCode: code,
        courseNameTh: nameTh,
        courseNameEn: cleanStr(item.course_name_en || item.name_en || item.nameEn),
        departmentCode: deptCode,
      },
    });
    courseCount++;
  }
  summary.course_catalog = { fileRows: courses.length, imported: courseCount };
  console.log(`✅ Course Catalog: ${courseCount} imported.`);

  // ----------------------------------------------------
  // 3. Personnel
  // ----------------------------------------------------
  console.log('\n--- [3/9] Importing Personnel ---');
  const personnelList = readJsonFile('persisted_personnel.json') || readJsonFile('personnel.json') || [];
  let personnelCount = 0;
  for (const item of personnelList) {
    const name = cleanStr(item.name || item.name_th || item.nameTh);
    if (!name) {
      skippedRows.push({ category: 'personnel', legacyId: item.id || item.person_id, reason: 'Missing name' });
      continue;
    }
    const personId = cleanStr(item.person_id || item.id);
    const deptCode = mapDepartmentCode(item.department || item.dept);

    const saved = await prisma.personnel.upsert({
      where: { personId: personId || `auto-p-${name}` },
      update: {
        titleTh: cleanStr(item.title_th || item.prefix || item.title),
        nameTh: name,
        nameEn: cleanStr(item.name_en || item.nameEn),
        position: cleanStr(item.position),
        departmentCode: deptCode,
        email: cleanStr(item.email),
      },
      create: {
        personId: personId || `auto-p-${name}`,
        titleTh: cleanStr(item.title_th || item.prefix || item.title),
        nameTh: name,
        nameEn: cleanStr(item.name_en || item.nameEn),
        position: cleanStr(item.position),
        departmentCode: deptCode,
        email: cleanStr(item.email),
      },
    });
    personnelMap.set(name, saved.id);
    // Also index without title
    const nameWithoutTitle = name.replace(/^(ศ\.|รศ\.|ผศ\.|อ\.|ดร\.|นาย|นาง|นางสาว)\s*/g, '').trim();
    personnelMap.set(nameWithoutTitle, saved.id);
    personnelCount++;
  }
  summary.personnel = { fileRows: personnelList.length, imported: personnelCount };
  console.log(`✅ Personnel: ${personnelCount} imported.`);

  // ----------------------------------------------------
  // 4. Research Projects
  // ----------------------------------------------------
  console.log('\n--- [4/9] Importing Research Projects ---');
  const researchList = readJsonFile('persisted_research.json') || readJsonFile('research.json') || [];
  let researchCount = 0;
  for (let idx = 0; idx < researchList.length; idx++) {
    const item = researchList[idx];
    const name = cleanStr(item.name || item.title);
    if (!name) {
      skippedRows.push({ category: 'research', index: idx, legacyId: item.id || item._id, reason: 'Missing project name' });
      continue;
    }
    const legacyId = cleanStr(item.id || item._id) || `res-${idx + 1}`;
    const headName = cleanStr(item.head || item.head_name);
    const headPersonnelId = headName ? personnelMap.get(headName) || null : null;
    const deptCode = mapDepartmentCode(item.department || item.dept);

    const createdProject = await prisma.researchProject.upsert({
      where: { legacyId },
      update: {
        code: cleanStr(item.code || item.id),
        name,
        nameEn: cleanStr(item.name_en),
        headName,
        headPersonnelId,
        headDepartmentCode: deptCode,
        status: cleanStr(item.status),
        budgetInternal: cleanNum(item.budget_internal || item.budget),
        budgetExternal: cleanNum(item.budget_external),
        fundSource: cleanStr(item.fund_source),
        fundType: cleanStr(item.fund_type),
        collaborationType: cleanStr(item.collaboration_type),
        projectNature: cleanStr(item.project_nature),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.start_date ? parseDate(item.start_date)?.getFullYear() : null),
        trlOutputs: cleanStr(item.trl_outputs),
      },
      create: {
        legacyId,
        code: cleanStr(item.code || item.id),
        name,
        nameEn: cleanStr(item.name_en),
        headName,
        headPersonnelId,
        headDepartmentCode: deptCode,
        status: cleanStr(item.status),
        budgetInternal: cleanNum(item.budget_internal || item.budget),
        budgetExternal: cleanNum(item.budget_external),
        fundSource: cleanStr(item.fund_source),
        fundType: cleanStr(item.fund_type),
        collaborationType: cleanStr(item.collaboration_type),
        projectNature: cleanStr(item.project_nature),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.start_date ? parseDate(item.start_date)?.getFullYear() : null),
        trlOutputs: cleanStr(item.trl_outputs),
      },
    });

    // Relational members
    await prisma.researchProjectMember.deleteMany({ where: { projectId: createdProject.id } });
    const membersRaw = cleanStr(item.members || item.co_researchers);
    if (membersRaw) {
      const memberNames = membersRaw.split(',').map((s) => s.trim()).filter(Boolean);
      for (const mName of memberNames) {
        await prisma.researchProjectMember.create({
          data: {
            projectId: createdProject.id,
            personName: mName,
            personnelId: personnelMap.get(mName) || null,
            role: 'co_researcher',
          },
        });
      }
    }

    // Relational departments
    await prisma.researchProjectDepartment.deleteMany({ where: { projectId: createdProject.id } });
    const deptsRaw = cleanStr(item.departments || item.department);
    if (deptsRaw) {
      const dList = deptsRaw.split(',').map((s) => s.trim()).filter(Boolean);
      for (const dName of dList) {
        const dCode = mapDepartmentCode(dName);
        await prisma.researchProjectDepartment.create({
          data: {
            projectId: createdProject.id,
            departmentCode: dCode,
            otherName: dCode === 'OTH' ? dName : null,
          },
        });
      }
    }

    researchCount++;
  }
  summary.research = { fileRows: researchList.length, imported: researchCount };
  console.log(`✅ Research Projects: ${researchCount} imported.`);

  // ----------------------------------------------------
  // 5. Academic Development Projects
  // ----------------------------------------------------
  console.log('\n--- [5/9] Importing Academic Development Projects ---');
  const academicList = readJsonFile('persisted_academic.json') || readJsonFile('academic.json') || [];
  let academicCount = 0;
  for (let idx = 0; idx < academicList.length; idx++) {
    const item = academicList[idx];
    const name = cleanStr(item.name || item.title);
    if (!name) {
      skippedRows.push({ category: 'academic', index: idx, legacyId: item.id || item._id, reason: 'Missing academic project name' });
      continue;
    }
    const legacyId = cleanStr(item.id || item._id) || `acad-${idx + 1}`;
    const headName = cleanStr(item.head || item.head_name);
    const headPersonnelId = headName ? personnelMap.get(headName) || null : null;
    const deptCode = mapDepartmentCode(item.department || item.dept);

    await prisma.academicDevProject.upsert({
      where: { legacyId },
      update: {
        name,
        headName,
        headPersonnelId,
        departmentCode: deptCode,
        client: cleanStr(item.client),
        budget: cleanNum(item.budget),
        month: cleanStr(item.month),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.start_date ? parseDate(item.start_date)?.getFullYear() : null),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        integrationStartDate: parseDate(item.integration_start_date),
        integrationEndDate: parseDate(item.integration_end_date),
      },
      create: {
        legacyId,
        name,
        headName,
        headPersonnelId,
        departmentCode: deptCode,
        client: cleanStr(item.client),
        budget: cleanNum(item.budget),
        month: cleanStr(item.month),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.start_date ? parseDate(item.start_date)?.getFullYear() : null),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        integrationStartDate: parseDate(item.integration_start_date),
        integrationEndDate: parseDate(item.integration_end_date),
      },
    });
    academicCount++;
  }
  summary.academic = { fileRows: academicList.length, imported: academicCount };
  console.log(`✅ Academic Dev Projects: ${academicCount} imported.`);

  // ----------------------------------------------------
  // 6. Publications
  // ----------------------------------------------------
  console.log('\n--- [6/9] Importing Publications ---');
  const pubList = readJsonFile('persisted_publications.json') || readJsonFile('publications.json') || [];
  let pubCount = 0;
  for (let idx = 0; idx < pubList.length; idx++) {
    const item = pubList[idx];
    const title = cleanStr(item.name || item.title);
    if (!title) {
      skippedRows.push({ category: 'publications', index: idx, legacyId: item.id || item._id, reason: 'Missing publication title' });
      continue;
    }
    const legacyId = cleanStr(item.id || item._id) || `pub-${idx + 1}`;
    const authorName = cleanStr(item.owner || item.first_author);
    const authorPersonnelId = authorName ? personnelMap.get(authorName) || null : null;
    const deptCode = mapDepartmentCode(item.department || item.dept);

    const createdPub = await prisma.publication.upsert({
      where: { legacyId },
      update: {
        title,
        type: cleanStr(item.type),
        level: cleanStr(item.level),
        journal: cleanStr(item.journal),
        volume: cleanStr(item.volume),
        issue: cleanStr(item.issue),
        pageStart: cleanStr(item.page_start),
        pageEnd: cleanStr(item.page_end),
        budget: cleanNum(item.budget),
        firstAuthorName: authorName,
        firstAuthorPersonnelId: authorPersonnelId,
        departmentCode: deptCode,
        fiscalYearBe: cleanInt(item.fiscal_year_be),
        month: cleanStr(item.month),
        monthYear: cleanStr(item.month_year),
        status: cleanStr(item.status),
        remarks: cleanStr(item.remarks),
      },
      create: {
        legacyId,
        title,
        type: cleanStr(item.type),
        level: cleanStr(item.level),
        journal: cleanStr(item.journal),
        volume: cleanStr(item.volume),
        issue: cleanStr(item.issue),
        pageStart: cleanStr(item.page_start),
        pageEnd: cleanStr(item.page_end),
        budget: cleanNum(item.budget),
        firstAuthorName: authorName,
        firstAuthorPersonnelId: authorPersonnelId,
        departmentCode: deptCode,
        fiscalYearBe: cleanInt(item.fiscal_year_be),
        month: cleanStr(item.month),
        monthYear: cleanStr(item.month_year),
        status: cleanStr(item.status),
        remarks: cleanStr(item.remarks),
      },
    });

    // Relational Authors
    await prisma.publicationAuthor.deleteMany({ where: { publicationId: createdPub.id } });
    if (authorName) {
      await prisma.publicationAuthor.create({
        data: {
          publicationId: createdPub.id,
          personName: authorName,
          personnelId: authorPersonnelId,
          affiliationType: 'internal',
        },
      });
    }

    const domestic = cleanStr(item.co_authors_domestic);
    if (domestic) {
      for (const dName of domestic.split(',').map((s) => s.trim()).filter(Boolean)) {
        await prisma.publicationAuthor.create({
          data: {
            publicationId: createdPub.id,
            personName: dName,
            personnelId: personnelMap.get(dName) || null,
            affiliationType: 'domestic',
          },
        });
      }
    }

    const foreign = cleanStr(item.co_authors_foreign);
    if (foreign) {
      for (const fName of foreign.split(',').map((s) => s.trim()).filter(Boolean)) {
        await prisma.publicationAuthor.create({
          data: {
            publicationId: createdPub.id,
            personName: fName,
            personnelId: null,
            affiliationType: 'foreign',
          },
        });
      }
    }

    pubCount++;
  }
  summary.publications = { fileRows: pubList.length, imported: pubCount };
  console.log(`✅ Publications: ${pubCount} imported.`);

  // ----------------------------------------------------
  // 7. Academic Services
  // ----------------------------------------------------
  console.log('\n--- [7/9] Importing Academic Services ---');
  const serviceList = readJsonFile('persisted_services.json') || readJsonFile('services.json') || [];
  let serviceCount = 0;
  for (let idx = 0; idx < serviceList.length; idx++) {
    const item = serviceList[idx];
    const name = cleanStr(item.name || item.topic_title || item.title);
    if (!name) {
      skippedRows.push({ category: 'services', index: idx, legacyId: item.id || item._id, reason: 'Missing service name/topic' });
      continue;
    }
    const legacyId = cleanStr(item.id || item._id) || `srv-${idx + 1}`;
    const providerName = cleanStr(item.person || item.provider_name);
    const providerPersonnelId = providerName ? personnelMap.get(providerName) || null : null;
    const deptCode = mapDepartmentCode(item.department || item.dept);

    // Validate service category to match CHECK constraint
    let cat = cleanStr(item.service_category || item.service_type);
    const validCategories = [
      'วิทยากร/อาจารย์พิเศษ',
      'วิชาการ',
      'วิชาชีพ',
      'ผู้ทรงคุณวุฒิ',
      'วิทยานิพนธ์ภายนอก',
      'ศึกษาดูงาน วศ.กพส.',
    ];
    if (!cat || !validCategories.includes(cat)) {
      cat = 'วิชาการ'; // Fallback default
    }

    await prisma.academicService.upsert({
      where: { legacyId },
      update: {
        name,
        serviceCategory: cat,
        providerName,
        providerPersonnelId,
        departmentCode: deptCode,
        targetGroup: cleanStr(item.target_group),
        hoursSpent: cleanNum(item.hours_spent),
        attendeesCount: cleanInt(item.attendees_count) || 0,
        date: parseDate(item.date),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.date ? parseDate(item.date)?.getFullYear() : null),
      },
      create: {
        legacyId,
        name,
        serviceCategory: cat,
        providerName,
        providerPersonnelId,
        departmentCode: deptCode,
        targetGroup: cleanStr(item.target_group),
        hoursSpent: cleanNum(item.hours_spent),
        attendeesCount: cleanInt(item.attendees_count) || 0,
        date: parseDate(item.date),
        startDate: parseDate(item.start_date),
        endDate: parseDate(item.end_date),
        fiscalYear: cleanInt(item.fiscal_year || item.year) || (item.date ? parseDate(item.date)?.getFullYear() : null),
      },
    });
    serviceCount++;
  }
  summary.services = { fileRows: serviceList.length, imported: serviceCount };
  console.log(`✅ Academic Services: ${serviceCount} imported.`);

  // ----------------------------------------------------
  // 8. Intellectual Properties (Importing ALL 21 records: 11 verified + 10 in-progress)
  // ----------------------------------------------------
  console.log('\n--- [8/9] Importing Intellectual Properties (All 21 Records) ---');
  const ipList = readJsonFile('persisted_ip.json') || readJsonFile('ip.json') || [];
  let ipCount = 0;

  for (let idx = 0; idx < ipList.length; idx++) {
    const item = ipList[idx];
    const title = cleanStr(item.name || item.title);
    if (!title) {
      skippedRows.push({ category: 'ip', index: idx, legacyId: item.id || item._id, reason: 'Missing IP title' });
      continue;
    }
    const legacyId = cleanStr(item.id || item._id) || `ip_${idx + 1}`;
    const creatorName = cleanStr(item.creator || item.inventors);
    const creatorPersonnelId = creatorName ? personnelMap.get(creatorName) || null : null;
    const deptCode = mapDepartmentCode(item.department || item.departments);

    let ipType = cleanStr(item.type);
    if (!ipType) {
      throw new Error(`[IP Import Error] Missing type for IP record index ${idx} (${title})`);
    }
    if (!['อนุสิทธิบัตร', 'สิทธิบัตร', 'ลิขสิทธิ์'].includes(ipType)) {
      throw new Error(`[IP Import Error] Invalid type "${ipType}" for IP record index ${idx} (${title})`);
    }

    // Records 12-21 or records without registration_number default status to 'อยู่ระหว่างดำเนินการ'
    const regNo = cleanStr(item.registration_number);
    const appNo = cleanStr(item.application_number);
    const ipStatus = cleanStr(item.status) || (!regNo && !appNo ? 'อยู่ระหว่างดำเนินการ' : 'ยื่นคำขอแล้ว');

    const createdIp = await prisma.intellectualProperty.upsert({
      where: { legacyId },
      update: {
        title,
        type: ipType,
        workCategory: cleanStr(item.work_category),
        workCharacter: cleanStr(item.work_character),
        creatorName,
        creatorPersonnelId,
        departmentCode: deptCode,
        applicationNumber: appNo,
        registrationNumber: regNo,
        filingDate: parseDate(item.filing_date),
        protectionStart: parseDate(item.protection_start),
        protectionEnd: parseDate(item.protection_end),
        supportAmount: cleanNum(item.support_amount),
        status: ipStatus,
        fiscalYear: cleanInt(item.fiscal_year),
        remarks: cleanStr(item.remarks),
      },
      create: {
        legacyId,
        title,
        type: ipType,
        workCategory: cleanStr(item.work_category),
        workCharacter: cleanStr(item.work_character),
        creatorName,
        creatorPersonnelId,
        departmentCode: deptCode,
        applicationNumber: appNo,
        registrationNumber: regNo,
        filingDate: parseDate(item.filing_date),
        protectionStart: parseDate(item.protection_start),
        protectionEnd: parseDate(item.protection_end),
        supportAmount: cleanNum(item.support_amount),
        status: ipStatus,
        fiscalYear: cleanInt(item.fiscal_year),
        remarks: cleanStr(item.remarks),
      },
    });

    // Relational Inventors
    await prisma.ipInventor.deleteMany({ where: { ipId: createdIp.id } });
    if (creatorName) {
      const invList = creatorName.split(',').map((s) => s.trim()).filter(Boolean);
      for (let i = 0; i < invList.length; i++) {
        const invName = invList[i];
        await prisma.ipInventor.create({
          data: {
            ipId: createdIp.id,
            personName: invName,
            personnelId: personnelMap.get(invName) || null,
            isLead: i === 0,
          },
        });
      }
    }

    // Relational Departments
    await prisma.ipDepartment.deleteMany({ where: { ipId: createdIp.id } });
    const deptsRaw = cleanStr(item.departments || item.department);
    if (deptsRaw) {
      const dList = deptsRaw.split(',').map((s) => s.trim()).filter(Boolean);
      for (const dName of dList) {
        const dCode = mapDepartmentCode(dName);
        await prisma.ipDepartment.create({
          data: {
            ipId: createdIp.id,
            departmentCode: dCode,
            otherName: dCode === 'OTH' ? dName : null,
          },
        });
      }
    }

    ipCount++;
  }

  summary.ip = {
    fileRows: ipList.length,
    imported: ipCount,
  };
  console.log(`✅ Intellectual Properties: all ${ipCount} records imported (including 10 in-progress).`);

  // ----------------------------------------------------
  // 9. Evaluations
  // ----------------------------------------------------
  console.log('\n--- [9/9] Importing Evaluations ---');
  const evaluationsObj = readJsonFile('persisted_evaluations.json') || readJsonFile('evaluations.json') || {};
  let evalCount = 0;
  const evalKeys = Object.keys(evaluationsObj);

  for (const key of evalKeys) {
    const record = evaluationsObj[key];
    if (!record) continue;

    // key format: "category_recordId" (e.g. "research_res-1", "publications_pub-2")
    const parts = key.split('_');
    const category = parts[0];
    const recordId = parts.slice(1).join('_');

    const sdgIds = Array.isArray(record.sdg_ids)
      ? record.sdg_ids.map((x) => parseInt(x, 10)).filter((x) => !isNaN(x))
      : [];

    await prisma.evaluation.upsert({
      where: {
        category_recordId: {
          category,
          recordId,
        },
      },
      update: {
        sdgIds,
        iType: cleanStr(record.i_type),
        journalIndex: cleanStr(record.journal_index),
        evaluatedBy: cleanStr(record.evaluated_by || 'system'),
        evaluatedAt: record.evaluated_at ? new Date(record.evaluated_at) : new Date(),
      },
      create: {
        category,
        recordId,
        sdgIds,
        iType: cleanStr(record.i_type),
        journalIndex: cleanStr(record.journal_index),
        evaluatedBy: cleanStr(record.evaluated_by || 'system'),
        evaluatedAt: record.evaluated_at ? new Date(record.evaluated_at) : new Date(),
      },
    });
    evalCount++;
  }
  summary.evaluations = { fileRows: evalKeys.length, imported: evalCount };
  console.log(`✅ Evaluations: ${evalCount} imported.`);

  // Write skipped rows report
  const skippedFilePath = path.join(reportsDir, 'import-skipped.json');
  fs.writeFileSync(skippedFilePath, JSON.stringify(skippedRows, null, 2), 'utf8');
  console.log(`\n📋 Skipped report written to: ${skippedFilePath}`);

  console.log('\n==========================================');
  console.log('🎉 db:import-json COMPLETE! SUMMARY:');
  console.table(summary);
  console.log('==========================================');
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
