const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const personnelPath = path.join(dataDir, 'personnel.json');
const ipPath = path.join(dataDir, 'ip.json');
const persistedIpPath = path.join(dataDir, 'persisted_ip.json');

const personnel = JSON.parse(fs.readFileSync(personnelPath, 'utf-8'));
const ipList = JSON.parse(fs.readFileSync(ipPath, 'utf-8'));

const PREFIXES = [
  'ศาสตราจารย์ ดร.', 'รองศาสตราจารย์ ดร.', 'ผู้ช่วยศาสตราจารย์ ดร.',
  'ศ.ดร.', 'รศ.ดร.', 'ผศ.ดร.', 'ดร.',
  'ศ.', 'รศ.', 'ผศ.',
  'อาจารย์ ดร.', 'อาจารย์', 'อ.ดร.', 'อ.',
  'นางสาว', 'นาง', 'นาย',
  'ว่าที่ร.ต.', 'ว่าที่ ร.ต.',
];

function normalizePersonName(rawName) {
  if (!rawName) return '';
  let clean = String(rawName).replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF]/g, ' ').trim();
  clean = clean.replace(/\(หัวหน้าโครงการ\)/gi, '');
  clean = clean.replace(/\(ที่ปรึกษา\)/gi, '');
  clean = clean.replace(/และคณะ/gi, '');
  clean = clean.replace(/,\s*et al\.?/gi, '');
  clean = clean.replace(/\s+/g, ' ').trim();

  for (const prefix of PREFIXES) {
    if (clean.startsWith(prefix)) {
      clean = clean.substring(prefix.length).trim();
      break;
    }
  }
  return clean.replace(/\s+/g, ' ').trim();
}

function matchPerson(rawName) {
  if (!rawName) return null;
  const clean = normalizePersonName(rawName);
  if (!clean) return null;

  // 1. Exact match
  const exact = personnel.find(
    (p) =>
      p.clean_name.toLowerCase() === clean.toLowerCase() ||
      p.name.toLowerCase() === rawName.trim().toLowerCase()
  );
  if (exact) return exact;

  // 2. First + Last name
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    const fn = parts[0].toLowerCase();
    const ln = parts[parts.length - 1].toLowerCase();
    const candidates = personnel.filter((p) => {
      const pClean = p.clean_name.toLowerCase();
      return pClean.includes(fn) && pClean.includes(ln);
    });
    if (candidates.length === 1) return candidates[0];
  }

  // 3. Unique First name
  if (parts.length >= 1 && parts[0].length >= 3) {
    const fn = parts[0].toLowerCase();
    const candidateMatches = personnel.filter((p) => {
      const pParts = p.clean_name.toLowerCase().split(' ').filter(Boolean);
      return pParts[0] === fn;
    });
    if (candidateMatches.length === 1) {
      return candidateMatches[0];
    }
  }

  return null;
}

let totalInventors = 0;
let matchedInventors = 0;
let unmatchedInventors = 0;
const unmatchedInventorNames = new Set();

const migratedIp = ipList.map((item, ipIndex) => {
  const title = item.name || item.title || '';
  
  // Parse inventors
  const rawCreator = item.creator || '';
  const creatorNames = rawCreator
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const inventors = [];
  const itemDepartments = new Set();

  creatorNames.forEach((cName, sortOrder) => {
    totalInventors++;
    const matched = matchPerson(cName);
    if (matched) {
      matchedInventors++;
      inventors.push({
        person_id: matched.id,
        name: matched.name,
        prefix: matched.title_th || '',
        clean_name: matched.clean_name || normalizePersonName(matched.name),
        department: matched.department || '',
        sort_order: sortOrder + 1,
      });
      if (matched.department) itemDepartments.add(matched.department);
    } else {
      unmatchedInventors++;
      unmatchedInventorNames.add(cName);
      inventors.push({
        person_id: null,
        name: cName,
        prefix: '',
        clean_name: normalizePersonName(cName),
        department: item.department || '',
        sort_order: sortOrder + 1,
      });
      if (item.department) itemDepartments.add(item.department);
    }
  });

  // Normalize Type
  let ipType = item.type || 'อนุสิทธิบัตร';
  if (ipType === 'สิทธิบัตรการประดิษฐ์' || ipType === 'P') {
    ipType = 'สิทธิบัตร';
  } else if (!ipType.includes('สิทธิบัตร')) {
    ipType = 'อนุสิทธิบัตร';
  }

  // Parse application_number and registration_number
  let appNo = item.application_number || '';
  let regNo = item.registration_number || '';
  let filingDate = item.filing_date || '';
  let remarks = item.remarks || '';

  if (item.req_no) {
    const rawReq = String(item.req_no).trim();
    if (rawReq.includes('/')) {
      const parts = rawReq.split('/').map((s) => s.trim());
      const digits0 = parts[0].replace(/\D/g, '');
      const digits1 = parts[1].replace(/\D/g, '');
      if (digits0.length === 10) {
        appNo = digits0;
      } else if (digits0.length > 0) {
        appNo = digits0.padStart(10, '0');
      }
      if (digits1.length === 10) {
        regNo = digits1;
      } else if (digits1.length > 0) {
        regNo = digits1.padStart(10, '0');
      }
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawReq)) {
      // Date in req_no
      filingDate = rawReq;
    } else if (rawReq.startsWith('WO')) {
      remarks = `เลขอ้างอิงสากล: ${rawReq}`;
    } else {
      const digits = rawReq.replace(/\D/g, '');
      if (digits.length === 10) {
        appNo = digits;
      } else if (digits.length > 0) {
        appNo = digits.padStart(10, '0');
      }
    }
  }

  const distinctDepts = Array.from(itemDepartments).filter(Boolean);

  return {
    _id: item._id || `ip_${ipIndex + 1}`,
    id: item.id || `ip_${ipIndex + 1}`,
    title,
    name: title,
    type: ipType,
    inventors,
    creator: inventors.map((i) => i.name).join(', ') || rawCreator,
    department: distinctDepts.join(', ') || item.department || '',
    departments: distinctDepts,
    filing_date: filingDate,
    application_number: appNo,
    registration_number: regNo,
    protection_start: item.protection_start || '',
    protection_end: item.protection_end || '',
    support_amount: item.support_amount !== undefined ? Number(item.support_amount) : 0,
    remarks,
    req_no: appNo ? (regNo ? `${appNo} / ${regNo}` : appNo) : (regNo || item.req_no || ''),
    status: regNo || item.protection_start ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอแล้ว',
    person_id: inventors.find((i) => i.person_id)?.person_id || null,
    updatedAt: new Date().toISOString(),
  };
});

fs.writeFileSync(ipPath, JSON.stringify(migratedIp, null, 2), 'utf-8');
fs.writeFileSync(persistedIpPath, JSON.stringify(migratedIp, null, 2), 'utf-8');

console.log('=== IP Migration Results ===');
console.log('Total IP Records:', migratedIp.length);
console.log('Total Inventor Names:', totalInventors);
console.log('Matched Inventors:', matchedInventors);
console.log('Unmatched Inventors:', unmatchedInventors);
console.log('Unmatched Inventor Names List:', Array.from(unmatchedInventorNames));
