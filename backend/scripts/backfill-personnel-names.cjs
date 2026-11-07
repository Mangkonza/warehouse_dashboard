#!/usr/bin/env node
/**
 * Idempotent, re-runnable backfill script for splitting personnel name_th into first_name and last_name.
 * Default mode: DRY-RUN.
 * To commit changes to the database: pass --apply flag.
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isApply = process.argv.includes('--apply');
const reportsDir = path.resolve(__dirname, '../../reports');

// Single source of truth prefix list: app prefix dropdown options + standard academic/civil titles, sorted longest-first
const KNOWN_TITLES = [
  'ศาสตราจารย์ดร.', 'รองศาสตราจารย์ดร.', 'ผู้ช่วยศาสตราจารย์ดร.',
  'ศาสตราจารย์ ดร.', 'รองศาสตราจารย์ ดร.', 'ผู้ช่วยศาสตราจารย์ ดร.',
  'ศาสตราจารย์', 'รองศาสตราจารย์', 'ผู้ช่วยศาสตราจารย์',
  'ศ.ดร.', 'รศ.ดร.', 'ผศ.ดร.', 'อ.ดร.',
  'ศ. ดร.', 'รศ. ดร.', 'ผศ. ดร.', 'อ. ดร.',
  'อาจารย์ ดร.', 'อาจารย์', 'อ.', 'ดร.',
  'นางสาว', 'น.ส.', 'นาง', 'นาย',
  'ว่าที่ร.ต. ดร.', 'ว่าที่ ร.ต. ดร.', 'ว่าที่ร.ต.', 'ว่าที่ ร.ต.',
  'Prof. Dr.', 'Prof.', 'Assoc. Prof.', 'Asst. Prof.', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'
].sort((a, b) => b.length - a.length);

/**
 * Parsing algorithm specified by Phase 1b:
 * 1. Normalize legacy full name: Unicode NFC, trim, replace NBSP / zero-width characters with normal spaces, collapse repeated whitespace.
 * 2. Strip leading title. First try row's own prefix value; otherwise match LONGEST known title at the start.
 * 3. After stripping, trim again. Split on the FIRST whitespace run: first_name = first token; last_name = everything after it.
 * 4. Flag for manual review when: only one token; empty; or 3+ tokens.
 * 5. Do not set prefix column from parsing if it already has a value; only fill prefix if empty AND known title was found.
 */
function parsePersonName(fullName, currentPrefix) {
  if (!fullName) {
    return {
      prefix: currentPrefix || '',
      firstName: '',
      lastName: '',
      needsReview: true,
      reason: 'Empty full name',
      newPrefixToSet: null,
    };
  }

  // 1. Unicode NFC & clean whitespaces
  let clean = String(fullName)
    .normalize('NFC')
    .replace(/[\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\uFEFF\u200b]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const existingPrefix = String(currentPrefix || '').trim();
  let detectedTitle = '';

  // 2. Strip leading title
  // First try the row's own prefix value
  if (existingPrefix && clean.startsWith(existingPrefix)) {
    clean = clean.substring(existingPrefix.length).trim();
    detectedTitle = existingPrefix;
  } else {
    for (const title of KNOWN_TITLES) {
      if (clean.startsWith(title)) {
        clean = clean.substring(title.length).trim();
        detectedTitle = title;
        break;
      }
    }
  }

  // Check for concatenated title (e.g. prefix was "ผศ." but name started with "ผศ.ดร.")
  for (const title of KNOWN_TITLES) {
    if (clean.startsWith(title)) {
      clean = clean.substring(title.length).trim();
      if (!detectedTitle) detectedTitle = title;
      break;
    }
  }

  clean = clean.trim().replace(/\s+/g, ' ');
  const tokens = clean.split(' ').filter(Boolean);

  let firstName = '';
  let lastName = '';
  let needsReview = false;
  let reason = '';

  if (tokens.length === 0) {
    needsReview = true;
    reason = 'Empty name after stripping title';
  } else if (tokens.length === 1) {
    firstName = tokens[0];
    needsReview = true;
    reason = 'Only one token (missing last name)';
  } else if (tokens.length === 2) {
    firstName = tokens[0];
    lastName = tokens[1];
  } else {
    // 3+ tokens (ambiguous multi-word first/last name)
    firstName = tokens[0];
    lastName = tokens.slice(1).join(' ');
    needsReview = true;
    reason = `3+ tokens (${tokens.length} tokens): ambiguous multi-word name`;
  }

  // Rule 5: Only fill prefix if empty AND known title was found
  let newPrefixToSet = null;
  if (!existingPrefix && detectedTitle) {
    newPrefixToSet = detectedTitle;
  }

  return {
    prefix: existingPrefix || detectedTitle,
    firstName,
    lastName,
    needsReview,
    reason,
    newPrefixToSet,
  };
}

async function run() {
  console.log(`================================================================`);
  console.log(` Personnel Name Split Backfill`);
  console.log(` Mode: ${isApply ? '>>> APPLY (Writing to DB inside Transaction) <<<' : 'DRY-RUN (No changes written to DB)'}`);
  console.log(`================================================================`);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const allPersonnel = await prisma.personnel.findMany({
    orderBy: { id: 'asc' },
  });

  const totalRows = allPersonnel.length;
  let skippedCount = 0;
  let okCount = 0;
  let flaggedCount = 0;
  let prefixBackfilledCount = 0;

  const toUpdate = [];
  const flaggedRows = [];
  const sampleOk = [];

  for (const person of allPersonnel) {
    // Idempotent: only process rows where first_name IS NULL
    if (person.firstName !== null && person.firstName !== undefined && person.firstName !== '') {
      skippedCount++;
      continue;
    }

    const parsed = parsePersonName(person.nameTh, person.titleTh);

    if (parsed.newPrefixToSet) {
      prefixBackfilledCount++;
    }

    if (parsed.needsReview) {
      flaggedCount++;
      let finalFirst = parsed.firstName;
      let finalLast = parsed.lastName;
      if (person.id === 222 || (finalFirst === 'อดิศร' && finalLast.startsWith('แสงสุข'))) {
        finalLast = 'แสงสุข';
      }
      flaggedRows.push({
        id: person.id,
        person_id: person.personId || '',
        original_full_name: person.nameTh,
        parsed_first: finalFirst,
        parsed_last: finalLast,
        reason: parsed.reason,
      });
      if (finalFirst && finalLast) {
        toUpdate.push({
          id: person.id,
          firstName: finalFirst,
          lastName: finalLast,
          newPrefix: parsed.newPrefixToSet,
        });
      }
    } else {
      okCount++;
      toUpdate.push({
        id: person.id,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        newPrefix: parsed.newPrefixToSet,
      });

      if (sampleOk.length < 10) {
        sampleOk.push({
          id: person.id,
          original: person.nameTh,
          prefix: person.titleTh || parsed.prefix,
          first_name: parsed.firstName,
          last_name: parsed.lastName,
        });
      }
    }
  }

  // Write flagged rows to CSV
  const csvPath = path.join(reportsDir, 'personnel_name_backfill_flagged.csv');
  const csvHeaders = 'id,person_id,original_full_name,parsed_first,parsed_last,reason\n';
  const csvRows = flaggedRows
    .map((r) => `${r.id},"${r.person_id}","${(r.original_full_name || '').replace(/"/g, '""')}","${(r.parsed_first || '').replace(/"/g, '""')}","${(r.parsed_last || '').replace(/"/g, '""')}","${r.reason}"`)
    .join('\n');
  fs.writeFileSync(csvPath, csvHeaders + csvRows, 'utf8');

  // Summary
  console.log(`\nExecution Summary:`);
  console.log(`- Total personnel rows in DB: ${totalRows}`);
  console.log(`- Rows skipped (already populated): ${skippedCount}`);
  console.log(`- Rows parsed OK with high confidence: ${okCount}`);
  console.log(`- Rows flagged for manual review: ${flaggedCount}`);
  console.log(`- Rows with prefix newly detected/backfilled: ${prefixBackfilledCount}`);
  console.log(`- Flagged rows CSV report saved to: ${csvPath}\n`);

  console.log(`Sample of 10 parsed rows:`);
  console.table(sampleOk);

  if (flaggedRows.length > 0) {
    console.log(`\nFlagged rows for manual review (${flaggedRows.length}):`);
    console.table(flaggedRows);
  }

  // Apply changes if flag is present
  if (isApply) {
    console.log(`\nApplying updates to database inside a single atomic transaction...`);
    await prisma.$transaction(async (tx) => {
      for (const item of toUpdate) {
        const data = {
          firstName: item.firstName,
          lastName: item.lastName,
        };
        if (item.newPrefix) {
          data.titleTh = item.newPrefix;
        }
        await tx.personnel.update({
          where: { id: item.id },
          data,
        });
      }
    });
    console.log(`[SUCCESS] Applied ${toUpdate.length} personnel name updates to database successfully.`);
  } else {
    console.log(`\n[DRY-RUN] No updates were written to the database.`);
    console.log(`To apply these changes, re-run with: node backend/scripts/backfill-personnel-names.cjs --apply`);
  }
}

run()
  .catch((e) => {
    console.error('Backfill error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
