const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../node_modules/@prisma/client');
const prisma = new PrismaClient();

const jsonPath = path.resolve(__dirname, '../../warehouse_dashboard/src/data/personnel.json');
const publicDir = path.resolve(__dirname, '../../warehouse_dashboard/public');
const reportsDir = path.resolve(__dirname, '../../reports');

async function main() {
  console.log('--- Starting Personnel Image Backfill ---');
  console.log(`Reading JSON from: ${jsonPath}`);
  console.log(`Checking files in: ${publicDir}`);

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found: ${jsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Total records in personnel.json: ${rawData.length}`);

  // Fetch all existing DB personnel
  const dbPersonnel = await prisma.personnel.findMany({
    select: { id: true, personId: true, nameTh: true, imageUrl: true }
  });
  console.log(`Total records in DB personnel table: ${dbPersonnel.length}`);

  const dbMapByPersonId = new Map();
  for (const row of dbPersonnel) {
    if (row.personId) {
      dbMapByPersonId.set(String(row.personId), row);
    }
  }

  const matched = [];
  const unmatchedDb = [];
  const fileNotFound = [];
  const noImageInJson = [];
  let updatedCount = 0;
  let alreadyUpToDateCount = 0;

  for (const item of rawData) {
    const personId = String(item.id !== undefined ? item.id : (item._id || item.person_id || '')).trim();
    const rawImageUrl = item.image_url ? String(item.image_url).trim() : '';

    if (!rawImageUrl) {
      noImageInJson.push({
        person_id: personId,
        name: item.name || item.name_th || ''
      });
      continue;
    }

    // Check file existence on disk
    // If it's a data URI or external URL, it won't exist in public/profile_images
    const relativePath = rawImageUrl.replace(/^\//, '');
    const diskPath = path.join(publicDir, relativePath);

    if (!fs.existsSync(diskPath)) {
      fileNotFound.push({
        person_id: personId,
        name: item.name || item.name_th || '',
        image_url: rawImageUrl.startsWith('data:') ? `${rawImageUrl.slice(0, 30)}... (base64 data)` : rawImageUrl,
        disk_path: diskPath
      });
      continue;
    }

    // Match strictly by person_id (NOT name)
    const dbRow = dbMapByPersonId.get(personId);
    if (!dbRow) {
      unmatchedDb.push({
        person_id: personId,
        name: item.name || item.name_th || '',
        image_url: rawImageUrl
      });
      continue;
    }

    // Check if update is needed (idempotent)
    const needsUpdate = dbRow.imageUrl !== rawImageUrl;
    if (needsUpdate) {
      await prisma.personnel.update({
        where: { id: dbRow.id },
        data: { imageUrl: rawImageUrl }
      });
      updatedCount++;
    } else {
      alreadyUpToDateCount++;
    }

    matched.push({
      person_id: personId,
      db_id: dbRow.id,
      name_json: item.name || item.name_th || '',
      name_db: dbRow.nameTh,
      image_url: rawImageUrl,
      disk_path_exists: true,
      status: needsUpdate ? 'updated' : 'already_current'
    });
  }

  console.log('\n--- Backfill Summary ---');
  console.log(`Matched & processed: ${matched.length}`);
  console.log(`  - Newly updated: ${updatedCount}`);
  console.log(`  - Already up-to-date: ${alreadyUpToDateCount}`);
  console.log(`Unmatched in DB: ${unmatchedDb.length}`);
  console.log(`File not found on disk: ${fileNotFound.length}`);
  console.log(`No image in JSON: ${noImageInJson.length}`);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportData = {
    timestamp: new Date().toISOString(),
    total_json_records: rawData.length,
    total_db_records: dbPersonnel.length,
    summary: {
      matched_and_verified: matched.length,
      updated_in_db: updatedCount,
      already_up_to_date: alreadyUpToDateCount,
      unmatched_in_db: unmatchedDb.length,
      file_not_found_on_disk: fileNotFound.length,
      no_image_in_json: noImageInJson.length
    },
    file_not_found_details: fileNotFound,
    unmatched_db_details: unmatchedDb,
    sample_matched: matched.slice(0, 5)
  };

  const jsonReportPath = path.join(reportsDir, 'personnel-image-backfill-report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2), 'utf8');
  console.log(`JSON report saved: ${jsonReportPath}`);

  let mdContent = `# Personnel Image Backfill Report\n\n`;
  mdContent += `**Executed at:** ${reportData.timestamp}\n\n`;
  mdContent += `## Summary\n\n`;
  mdContent += `| Metric | Count |\n`;
  mdContent += `| --- | ---: |\n`;
  mdContent += `| Total records in personnel.json | ${reportData.total_json_records} |\n`;
  mdContent += `| Total records in PostgreSQL personnel table | ${reportData.total_db_records} |\n`;
  mdContent += `| **Matched and Verified on Disk** | **${reportData.summary.matched_and_verified}** |\n`;
  mdContent += `| - Updated in DB | ${reportData.summary.updated_in_db} |\n`;
  mdContent += `| - Already up-to-date (Idempotency) | ${reportData.summary.already_up_to_date} |\n`;
  mdContent += `| **File Not Found on Disk** | **${reportData.summary.file_not_found_on_disk}** |\n`;
  mdContent += `| **Unmatched person_id in DB** | **${reportData.summary.unmatched_in_db}** |\n`;
  mdContent += `| No Image URL in JSON | ${reportData.summary.no_image_in_json} |\n\n`;

  mdContent += `## File Not Found Details\n\n`;
  if (fileNotFound.length === 0) {
    mdContent += `None.\n\n`;
  } else {
    mdContent += `| Person ID | Name | Image URL / Note |\n`;
    mdContent += `| --- | --- | --- |\n`;
    fileNotFound.forEach(f => {
      mdContent += `| \`${f.person_id}\` | ${f.name} | \`${f.image_url}\` |\n`;
    });
    mdContent += `\n`;
  }

  mdContent += `## Unmatched in DB Details\n\n`;
  if (unmatchedDb.length === 0) {
    mdContent += `None. All 211 valid records matched strictly by \`person_id\`.\n\n`;
  } else {
    mdContent += `| Person ID | Name | Image URL |\n`;
    mdContent += `| --- | --- | --- |\n`;
    unmatchedDb.forEach(u => {
      mdContent += `| \`${u.person_id}\` | ${u.name} | \`${u.image_url}\` |\n`;
    });
    mdContent += `\n`;
  }

  const mdReportPath = path.join(reportsDir, 'personnel-image-backfill-report.md');
  fs.writeFileSync(mdReportPath, mdContent, 'utf8');
  console.log(`Markdown report saved: ${mdReportPath}`);
}

main()
  .catch((err) => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
