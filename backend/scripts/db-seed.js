const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const DEPARTMENTS = [
  { code: 'AE', nameTh: 'ภาควิชาวิศวกรรมเกษตร', nameEn: 'Department of Agricultural Engineering', isCanonical: true },
  { code: 'CPE', nameTh: 'ภาควิชาวิศวกรรมคอมพิวเตอร์', nameEn: 'Department of Computer Engineering', isCanonical: true },
  { code: 'IRE', nameTh: 'ภาควิชาวิศวกรรมชลประทาน', nameEn: 'Department of Irrigation Engineering', isCanonical: true },
  { code: 'FE', nameTh: 'ภาควิชาวิศวกรรมอาหาร', nameEn: 'Department of Food Engineering', isCanonical: true },
  { code: 'IE', nameTh: 'ภาควิชาวิศวกรรมอุตสาหการ', nameEn: 'Department of Industrial Engineering', isCanonical: true },
  { code: 'ME', nameTh: 'ภาควิชาวิศวกรรมเครื่องกล', nameEn: 'Department of Mechanical Engineering', isCanonical: true },
  { code: 'CE', nameTh: 'ภาควิชาวิศวกรรมโยธา', nameEn: 'Department of Civil Engineering', isCanonical: true },
  { code: 'EEEC', nameTh: 'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม', nameEn: 'Energy and Environmental Engineering Center', isCanonical: true },
  { code: 'DWT', nameTh: 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร', nameEn: 'Door, Window and Curtain Wall Testing Center', isCanonical: true },
  { code: 'NAMC', nameTh: 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ', nameEn: 'National Agricultural Machinery Center', isCanonical: true },
  { code: 'OFS', nameTh: 'สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์ กำแพงแสน', nameEn: 'Office of the Secretary', isCanonical: true },
  { code: 'OTH', nameTh: 'อื่นๆ / ไม่ระบุ', nameEn: 'Other / External', isCanonical: false },
];

async function seed() {
  console.log('🌱 Starting idempotent database seeding...');

  // 1. Seed 12 Departments
  console.log('1. Seeding 12 departments...');
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {
        nameTh: dept.nameTh,
        nameEn: dept.nameEn,
        isCanonical: dept.isCanonical,
      },
      create: dept,
    });
  }
  console.log('   ✅ 12 departments seeded.');

  // 2. Seed Super Admin User b6520503525
  console.log('2. Seeding super_admin user b6520503525...');
  await prisma.userRole.upsert({
    where: { username: 'b6520503525' },
    update: {
      role: 'super_admin',
      displayName: 'Super Admin (b6520503525)',
      grantedBy: 'system',
      note: 'Initial system super admin account',
    },
    create: {
      username: 'b6520503525',
      role: 'super_admin',
      displayName: 'Super Admin (b6520503525)',
      grantedBy: 'system',
      note: 'Initial system super admin account',
    },
  });
  console.log('   ✅ Super admin b6520503525 seeded.');

  console.log('🎉 Seeding successfully completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
