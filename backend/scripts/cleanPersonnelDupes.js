const path = require('path');
const fs = require('fs');
const { PrismaClient } = require(path.resolve(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

const TITLES = [
  'ศ.เกียรติคุณ ดร.', 'ศ.ดร.', 'ศ.', 'รศ.ดร.', 'รศ.', 'ผศ.ดร.', 'ผศ.',
  'อ.ดร.', 'ดร.', 'อาจารย์', 'อ.', 'นางสาว', 'น.ส.', 'นาง', 'นาย'
];

function cleanName(raw) {
  if (!raw) return '';
  let s = raw.trim();
  for (const t of TITLES) {
    if (s.startsWith(t)) {
      s = s.substring(t.length).trim();
      break;
    }
  }
  return s.replace(/\s+/g, ' ').trim();
}

async function cleanPersonnel() {
  try {
    console.log("=== เริ่มต้นกระบวนการ Clean ข้อมูลบุคลากรที่ชื่อ-นามสกุลซ้ำกัน ===");

    const allPersonnel = await prisma.personnel.findMany({
      include: {
        headResearchProjects: true,
        researchProjectMembers: true,
        academicDevProjects: true,
        publicationAuthors: true,
        academicServices: true,
        ipInventors: true,
        createdIps: true,
      },
      orderBy: { id: 'asc' }
    });

    console.log(`จำนวนบุคลากรทั้งหมดใน PostgreSQL ปัจจุบัน: ${allPersonnel.length} รายการ`);

    const groups = new Map();
    allPersonnel.forEach(p => {
      const first = (p.firstName || '').trim();
      const last = (p.lastName || '').trim();
      const name = cleanName(p.nameTh);
      const key = (first && last) ? cleanName(`${first} ${last}`) : name;

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(p);
    });

    const duplicateGroups = Array.from(groups.entries()).filter(([k, list]) => list.length > 1);
    console.log(`พบบุคคลที่มีชื่อ-นามสกุลซ้ำกัน: ${duplicateGroups.length} กลุ่ม`);

    let totalDeleted = 0;
    let totalMergedRelations = 0;

    for (const [key, records] of duplicateGroups) {
      console.log(`\n--------------------------------------------------`);
      console.log(`ประมวลผลกลุ่ม: "${key}" (พบซ้ำ ${records.length} แถว)`);

      // คำนวณคะแนนของแต่ละ record เพื่อเลือก Primary Record ที่สมบูรณ์ที่สุด
      // 1. มี Relation กับโครงการ/ผลงานวิจัย ได้คะแนนสูงสุด
      // 2. มี email ไม่ใช่ 'ไม่พบอีเมล' และไม่ว่าง
      // 3. มี departmentCode
      // 4. id น้อยที่สุด (มาก่อน)
      const scored = records.map(r => {
        const relationCount =
          r.headResearchProjects.length +
          r.researchProjectMembers.length +
          r.academicDevProjects.length +
          r.publicationAuthors.length +
          r.academicServices.length +
          r.ipInventors.length +
          r.createdIps.length;

        let score = relationCount * 1000;
        if (r.email && r.email !== 'ไม่พบอีเมล') score += 100;
        if (r.departmentCode && r.departmentCode !== 'DWT') score += 10;
        return { record: r, relationCount, score };
      });

      scored.sort((a, b) => b.score - a.score || a.record.id - b.record.id);

      const primary = scored[0].record;
      const duplicatesToDelete = scored.slice(1).map(s => s.record);

      console.log(`  -> เลือก Primary Record: id=${primary.id}, personId=${primary.personId}, nameTh="${primary.nameTh}", dept=${primary.departmentCode}, email=${primary.email}`);

      for (const dup of duplicatesToDelete) {
        console.log(`  -> เตรียมลบ Duplicate: id=${dup.id}, personId=${dup.personId}, nameTh="${dup.nameTh}", dept=${dup.departmentCode}`);

        // Re-link relations if any exist on the duplicate to the primary record
        if (dup.headResearchProjects.length > 0) {
          await prisma.researchProject.updateMany({
            where: { headPersonnelId: dup.id },
            data: { headPersonnelId: primary.id }
          });
          totalMergedRelations += dup.headResearchProjects.length;
        }

        if (dup.researchProjectMembers.length > 0) {
          for (const m of dup.researchProjectMembers) {
            // Check if member relation already exists on primary
            const exists = await prisma.researchProjectMember.findFirst({
              where: { projectId: m.projectId, personnelId: primary.id }
            });
            if (!exists) {
              await prisma.researchProjectMember.update({
                where: { id: m.id },
                data: { personnelId: primary.id }
              });
              totalMergedRelations++;
            } else {
              await prisma.researchProjectMember.delete({ where: { id: m.id } });
            }
          }
        }

        if (dup.academicDevProjects.length > 0) {
          await prisma.academicDevProject.updateMany({
            where: { headPersonnelId: dup.id },
            data: { headPersonnelId: primary.id }
          });
          totalMergedRelations += dup.academicDevProjects.length;
        }

        if (dup.publicationAuthors.length > 0) {
          for (const a of dup.publicationAuthors) {
            const exists = await prisma.publicationAuthor.findFirst({
              where: { publicationId: a.publicationId, personnelId: primary.id }
            });
            if (!exists) {
              await prisma.publicationAuthor.update({
                where: { id: a.id },
                data: { personnelId: primary.id }
              });
              totalMergedRelations++;
            } else {
              await prisma.publicationAuthor.delete({ where: { id: a.id } });
            }
          }
        }

        if (dup.academicServices.length > 0) {
          await prisma.academicService.updateMany({
            where: { providerPersonnelId: dup.id },
            data: { providerPersonnelId: primary.id }
          });
          totalMergedRelations += dup.academicServices.length;
        }

        if (dup.ipInventors.length > 0) {
          for (const inv of dup.ipInventors) {
            const exists = await prisma.ipInventor.findFirst({
              where: { ipId: inv.ipId, personnelId: primary.id }
            });
            if (!exists) {
              await prisma.ipInventor.update({
                where: { id: inv.id },
                data: { personnelId: primary.id }
              });
              totalMergedRelations++;
            } else {
              await prisma.ipInventor.delete({ where: { id: inv.id } });
            }
          }
        }

        if (dup.createdIps.length > 0) {
          await prisma.intellectualProperty.updateMany({
            where: { creatorPersonnelId: dup.id },
            data: { creatorPersonnelId: primary.id }
          });
          totalMergedRelations += dup.createdIps.length;
        }

        // Delete duplicate personnel record from PostgreSQL
        await prisma.personnel.delete({
          where: { id: dup.id }
        });
        totalDeleted++;
      }
    }

    const remainingCount = await prisma.personnel.count();
    console.log(`\n=== ผลการ Clean บุคลากรใน PostgreSQL ===`);
    console.log(`- ลบรายการซ้ำซ้อนออก: ${totalDeleted} แถว`);
    console.log(`- ผูกความสัมพันธ์โครงการใหม่: ${totalMergedRelations} รายการ`);
    console.log(`- จำนวนบุคลากรคงเหลือใน DB: ${remainingCount} รายการ (จากเดิม ${allPersonnel.length})`);

    // Synchronize JSON files
    syncJsonFiles();

  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ Clean ข้อมูล:", err);
  } finally {
    await prisma.$disconnect();
  }
}

function syncJsonFiles() {
  const jsonPaths = [
    path.resolve(__dirname, '../../warehouse_dashboard/src/data/personnel.json'),
    path.resolve(__dirname, '../../warehouse_dashboard/src/data/persisted_personnel.json'),
    path.resolve(__dirname, '../../data/all_data.json')
  ];

  for (const jPath of jsonPaths) {
    if (!fs.existsSync(jPath)) continue;
    try {
      if (jPath.endsWith('all_data.json')) {
        const raw = fs.readFileSync(jPath, 'utf8');
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.personnel)) {
          const before = data.personnel.length;
          const seen = new Set();
          data.personnel = data.personnel.filter(p => {
            const name = cleanName(p.name || p.name_th || `${p.first_name || ''} ${p.last_name || ''}`);
            if (!name) return true;
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
          });
          fs.writeFileSync(jPath, JSON.stringify(data, null, 2), 'utf8');
          console.log(`[JSON Sync] ${path.basename(jPath)}: ${before} -> ${data.personnel.length} รายการ`);
        }
      } else {
        const raw = fs.readFileSync(jPath, 'utf8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const before = list.length;
          const seen = new Set();
          const cleanedList = list.filter(p => {
            const name = cleanName(p.name || p.name_th || `${p.first_name || ''} ${p.last_name || ''}`);
            if (!name) return true;
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
          });
          fs.writeFileSync(jPath, JSON.stringify(cleanedList, null, 2), 'utf8');
          console.log(`[JSON Sync] ${path.basename(jPath)}: ${before} -> ${cleanedList.length} รายการ`);
        }
      }
    } catch (e) {
      console.warn(`[JSON Sync Error] ${jPath}:`, e.message);
    }
  }
}

cleanPersonnel();
