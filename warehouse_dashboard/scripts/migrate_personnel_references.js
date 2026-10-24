const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

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

const personnelPath = path.join(dataDir, 'personnel.json');
const personnel = JSON.parse(fs.readFileSync(personnelPath, 'utf-8'));

function matchPerson(rawName) {
  if (!rawName) return null;
  const clean = normalizePersonName(rawName);
  if (!clean) return null;

  // 1. Exact match on clean_name or full name
  const exact = personnel.find(
    (p) =>
      p.clean_name.toLowerCase() === clean.toLowerCase() ||
      p.name.toLowerCase() === rawName.trim().toLowerCase()
  );
  if (exact) return exact;

  // 2. First name + last name matching
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    const firstName = parts[0].toLowerCase();
    const lastName = parts[parts.length - 1].toLowerCase();
    const candidates = personnel.filter((p) => {
      const pClean = p.clean_name.toLowerCase();
      return pClean.includes(firstName) && pClean.includes(lastName);
    });
    if (candidates.length === 1) return candidates[0];
  }

  // 3. First name exact match if unique in system
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

  // 4. If comma present (multiple authors), match the first
  if (rawName.includes(',')) {
    const firstPerson = rawName.split(',')[0].trim();
    return matchPerson(firstPerson);
  }

  return null;
}

const stats = {};

function migrateFile(fileName, personField, idField, isCoMembersSupported = false) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return null;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let matched = 0;
  let unmatched = 0;
  const unmatchedNames = new Set();

  const migrated = data.map((item) => {
    const rawName = item[personField];
    const match = matchPerson(rawName);
    const updated = { ...item };

    if (match) {
      updated[idField] = match.id;
      matched++;
    } else {
      updated[idField] = null;
      if (rawName && String(rawName).trim() && rawName !== '-') {
        unmatched++;
        unmatchedNames.add(rawName.trim());
      }
    }

    // Also migrate co_members or co_researchers if present
    if (isCoMembersSupported && Array.isArray(updated.co_researchers)) {
      updated.co_researchers = updated.co_researchers.map((co) => {
        if (typeof co === 'object' && co.name) {
          const coMatch = matchPerson(co.name);
          return {
            ...co,
            person_id: coMatch ? coMatch.id : null,
          };
        }
        return co;
      });
    }

    return updated;
  });

  fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2), 'utf-8');

  // Also update persisted_ file if it exists or create it
  const persistedPath = path.join(dataDir, `persisted_${fileName.replace('persisted_', '')}`);
  fs.writeFileSync(persistedPath, JSON.stringify(migrated, null, 2), 'utf-8');

  return {
    total: data.length,
    matched,
    unmatched,
    unmatchedNames: Array.from(unmatchedNames),
  };
}

console.log('=== Starting Personnel References Migration ===');

stats.research = migrateFile('research.json', 'head', 'head_id', true);
stats.academic = migrateFile('academic.json', 'head', 'head_id');
stats.services = migrateFile('services.json', 'person', 'person_id');
stats.publications = migrateFile('publications.json', 'owner', 'owner_id');
stats.ip = migrateFile('ip.json', 'creator', 'person_id');

// Also ensure publication has both owner_id and person_id
const pubPath = path.join(dataDir, 'publications.json');
const pubData = JSON.parse(fs.readFileSync(pubPath, 'utf-8'));
const syncedPub = pubData.map(p => ({
  ...p,
  person_id: p.owner_id || null,
}));
fs.writeFileSync(pubPath, JSON.stringify(syncedPub, null, 2), 'utf-8');
const persistedPubPath = path.join(dataDir, 'persisted_publications.json');
fs.writeFileSync(persistedPubPath, JSON.stringify(syncedPub, null, 2), 'utf-8');

console.log('Migration Result Summary:');
console.log(JSON.stringify(stats, null, 2));
