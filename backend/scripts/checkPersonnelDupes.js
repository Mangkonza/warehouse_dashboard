const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function check() {
  try {
    const list = await prisma.personnel.findMany({
      include: {
        headResearchProjects: true,
        researchProjectMembers: true,
        academicDevProjects: true,
        publicationAuthors: true,
        academicServices: true,
        ipInventors: true,
        createdIps: true,
      }
    });
    console.log("Total personnel in PostgreSQL:", list.length);
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

    const counts = {};
    const recordsMap = {};
    list.forEach(p => {
      const first = (p.firstName || "").trim();
      const last = (p.lastName || "").trim();
      const name = cleanName(p.nameTh);
      const key = (first && last) ? cleanName(`${first} ${last}`) : name;
      counts[key] = (counts[key] || 0) + 1;
      if (!recordsMap[key]) recordsMap[key] = [];
      recordsMap[key].push(p);
    });
    const dupes = Object.entries(counts).filter(([k, v]) => v > 1);
    console.log("Postgres duplicate names (without title) count:", dupes.length);
    dupes.forEach(([k, v]) => {
      console.log(`\n=== Duplicate: "${k}" (count = ${v}) ===`);
      recordsMap[k].forEach(r => {
        const relations = [];
        if (r.headResearchProjects.length) relations.push(`headResearch: ${r.headResearchProjects.length}`);
        if (r.researchProjectMembers.length) relations.push(`memberResearch: ${r.researchProjectMembers.length}`);
        if (r.academicDevProjects.length) relations.push(`academic: ${r.academicDevProjects.length}`);
        if (r.publicationAuthors.length) relations.push(`publications: ${r.publicationAuthors.length}`);
        if (r.academicServices.length) relations.push(`services: ${r.academicServices.length}`);
        if (r.ipInventors.length) relations.push(`ipInventors: ${r.ipInventors.length}`);
        if (r.createdIps.length) relations.push(`createdIps: ${r.createdIps.length}`);
        const relStr = relations.length ? `[RELATIONS: ${relations.join(', ')}]` : '[NO RELATIONS]';
        console.log(`  id=${r.id}, personId="${r.personId}", title="${r.titleTh}", nameTh="${r.nameTh}", dept="${r.departmentCode}", email="${r.email}" ${relStr}`);
      });
    });
  } catch (err) {
    console.error("Prisma error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
