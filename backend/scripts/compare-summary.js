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

function readJsonFile(filename) {
  const dashDataBakDir = path.resolve(__dirname, '../../warehouse_dashboard/src/data.bak');
  const filePath = path.join(dashDataBakDir, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function runComparison() {
  console.log('🔍 Comparing JSON data vs PostgreSQL Database...');

  const results = [];

  // 1. Research
  const rJson = readJsonFile('persisted_research.json');
  const rDbCount = await prisma.researchProject.count();
  const rDbBudget = await prisma.researchProject.aggregate({
    _sum: { budgetInternal: true, budgetExternal: true },
  });
  const rJsonInternal = rJson.reduce((acc, x) => acc + (parseFloat(x.budget_internal || x.budget || 0) || 0), 0);
  const rJsonExternal = rJson.reduce((acc, x) => acc + (parseFloat(x.budget_external || 0) || 0), 0);
  results.push({
    metric: 'Research Projects Count',
    jsonValue: rJson.length,
    dbValue: rDbCount,
    match: rJson.length === rDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });
  results.push({
    metric: 'Research Budget Internal',
    jsonValue: rJsonInternal.toLocaleString(),
    dbValue: Number(rDbBudget._sum.budgetInternal).toLocaleString(),
    match: Math.abs(rJsonInternal - Number(rDbBudget._sum.budgetInternal)) < 1 ? '✅ MATCH' : '❌ MISMATCH',
  });
  results.push({
    metric: 'Research Budget External',
    jsonValue: rJsonExternal.toLocaleString(),
    dbValue: Number(rDbBudget._sum.budgetExternal).toLocaleString(),
    match: Math.abs(rJsonExternal - Number(rDbBudget._sum.budgetExternal)) < 1 ? '✅ MATCH' : '❌ MISMATCH',
  });

  // 2. Academic
  const aJson = readJsonFile('persisted_academic.json');
  const aDbCount = await prisma.academicDevProject.count();
  const aDbBudget = await prisma.academicDevProject.aggregate({
    _sum: { budget: true },
  });
  const aJsonBudget = aJson.reduce((acc, x) => acc + (parseFloat(x.budget || 0) || 0), 0);
  results.push({
    metric: 'Academic Dev Projects Count',
    jsonValue: aJson.length,
    dbValue: aDbCount,
    match: aJson.length === aDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });
  results.push({
    metric: 'Academic Total Budget',
    jsonValue: aJsonBudget.toLocaleString(),
    dbValue: Number(aDbBudget._sum.budget).toLocaleString(),
    match: Math.abs(aJsonBudget - Number(aDbBudget._sum.budget)) < 1 ? '✅ MATCH' : '❌ MISMATCH',
  });

  // 3. Publications
  const pJson = readJsonFile('persisted_publications.json');
  const pDbCount = await prisma.publication.count();
  results.push({
    metric: 'Publications Count',
    jsonValue: pJson.length,
    dbValue: pDbCount,
    match: pJson.length === pDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });

  // 4. Services
  const sJson = readJsonFile('persisted_services.json');
  const sDbCount = await prisma.academicService.count();
  const sDbStats = await prisma.academicService.aggregate({
    _sum: { hoursSpent: true, attendeesCount: true },
  });
  const sJsonHours = sJson.reduce((acc, x) => acc + (parseFloat(x.hours_spent || 0) || 0), 0);
  const sJsonAttendees = sJson.reduce((acc, x) => acc + (parseInt(x.attendees_count || 0, 10) || 0), 0);
  results.push({
    metric: 'Academic Services Count',
    jsonValue: sJson.length,
    dbValue: sDbCount,
    match: sJson.length === sDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });
  results.push({
    metric: 'Services Total Hours',
    jsonValue: sJsonHours.toFixed(1),
    dbValue: Number(sDbStats._sum.hoursSpent).toFixed(1),
    match: Math.abs(sJsonHours - Number(sDbStats._sum.hoursSpent)) < 1 ? '✅ MATCH' : '❌ MISMATCH',
  });
  results.push({
    metric: 'Services Total Attendees',
    jsonValue: sJsonAttendees.toLocaleString(),
    dbValue: Number(sDbStats._sum.attendeesCount).toLocaleString(),
    match: sJsonAttendees === Number(sDbStats._sum.attendeesCount) ? '✅ MATCH' : '❌ MISMATCH',
  });

  // 5. IP
  const ipJson = readJsonFile('persisted_ip.json');
  const ipDbCount = await prisma.intellectualProperty.count();
  results.push({
    metric: 'IP Records Total Count',
    jsonValue: ipJson.length,
    dbValue: ipDbCount,
    match: ipJson.length === ipDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });

  // 6. Personnel
  const persJson = readJsonFile('persisted_personnel.json');
  const persDbCount = await prisma.personnel.count();
  results.push({
    metric: 'Personnel Count',
    jsonValue: persJson.length,
    dbValue: persDbCount,
    match: persJson.length === persDbCount ? '✅ MATCH' : '❌ MISMATCH',
  });

  console.table(results);
}

runComparison()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
