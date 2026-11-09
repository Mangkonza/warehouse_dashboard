-- ==============================================================================
-- KU Engineering Research & Innovation Warehouse
-- Comprehensive Intellectual Property (All Years) Import & Normalization Script
-- Generated with web form field mapping, constraint validation & relational linking
-- Target DB: ku_warehouse (PostgreSQL 18)
-- ==============================================================================

BEGIN;

-- 1. Remove obsolete dummy placeholder records (REG-PAT-*, REG-PET-*)
DELETE FROM intellectual_properties WHERE registration_number LIKE 'REG-%';

-- 2. Ensure all inventors/faculty members are present in personnel
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'ศ.ดร.รังสินี โสธรวิทย์', 'ศ.ดร.', 'รังสินี', 'โสธรวิทย์', 'FE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'รังสินี' AND last_name = 'โสธรวิทย์');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 'ศ.ดร.', 'อนุพันธ์', 'เทอดวงศ์วรกุล', 'AE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'อนุพันธ์' AND last_name = 'เทอดวงศ์วรกุล');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 'รศ.ดร.', 'เชาว์', 'อินทร์ประสิทธิ์', 'FE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'เชาว์' AND last_name = 'อินทร์ประสิทธิ์');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'รศ.ดร.มนต์ทิพย์ ช่ำชอง', 'รศ.ดร.', 'มนต์ทิพย์', 'ช่ำชอง', 'FE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'มนต์ทิพย์' AND last_name = 'ช่ำชอง');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'ดร.ปาริฉัตร เสริมวุฒิสาร', 'ดร.', 'ปาริฉัตร', 'เสริมวุฒิสาร', 'AE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ปาริฉัตร' AND last_name = 'เสริมวุฒิสาร');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'อ.ง่ายงาม ประจวบวัน', 'อ.', 'ง่ายงาม', 'ประจวบวัน', 'FE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ง่ายงาม' AND last_name = 'ประจวบวัน');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'นายระวี อยู่สำราญ', 'นาย', 'ระวี', 'อยู่สำราญ', 'IRE', 'บุคลากร', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ระวี' AND last_name = 'อยู่สำราญ');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'รศ.ประภาศรี สิงหรัตน์', 'รศ.', 'ประภาศรี', 'สิงหรัตน์', 'AE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ประภาศรี' AND last_name = 'สิงหรัตน์');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'นางสาวธันยพร โส๊ะอ้น', 'นางสาว', 'ธันยพร', 'โส๊ะอ้น', 'EEEC', 'บุคลากร', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ธันยพร' AND last_name = 'โส๊ะอ้น');

-- 3. Intellectual Property Records (Patents, Petty Patents, Copyrights)
-- [สิทธิบัตร] 10466 - เครื่องปอกเปลือกมะพร้าว
UPDATE intellectual_properties
SET 
    registration_number = '10466',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2001-01-01'::date,
    protection_end = '2021-01-01'::date,
    fiscal_year = 2544,
    creator_name = 'รศ.ดร.มงคล กวางวโรภาส',
    creator_personnel_id = 968,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '10466';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-001', 'เครื่องปอกเปลือกมะพร้าว', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.มงคล กวางวโรภาส',
    968, 'IE', NULL, '10466',
    NULL, '2001-01-01'::date, '2021-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2544, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '10466'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '10466'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.มงค', 968, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '10466'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.มงค'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'กวางวโรภาส', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '10466'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'กวางวโรภาส'
  );

-- [สิทธิบัตร] 12532 - เครื่องขัดผิวเมล็ดพริกไทยดำ
UPDATE intellectual_properties
SET 
    registration_number = '12532',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2002-01-01'::date,
    protection_end = '2022-01-01'::date,
    fiscal_year = 2545,
    creator_name = 'รศ.ดร.มงคล กวางวโรภาส',
    creator_personnel_id = 968,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '12532';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-002', 'เครื่องขัดผิวเมล็ดพริกไทยดำ', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.มงคล กวางวโรภาส',
    968, 'IE', NULL, '12532',
    NULL, '2002-01-01'::date, '2022-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2545, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '12532'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '12532'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.มงค', 968, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '12532'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.มงค'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'กวางวโรภาส', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '12532'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'กวางวโรภาส'
  );

-- [สิทธิบัตร] 1604 - เชื้อเพลิงอัดแท่งจากเหง้ามันสำปะหลังและกรรมวิธีการ
UPDATE intellectual_properties
SET 
    registration_number = '1604',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2004-01-01'::date,
    protection_end = '2024-01-01'::date,
    fiscal_year = 2547,
    creator_name = 'รศ.ดร.ประเทือง อุษาบริสุทธิ์',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '1604';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-003', 'เชื้อเพลิงอัดแท่งจากเหง้ามันสำปะหลังและกรรมวิธีการผลิต', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์',
    849, 'AE', NULL, '1604',
    NULL, '2004-01-01'::date, '2024-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2547, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '1604'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '1604'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '1604'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เทือง อุษาบริสุทธิ์', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '1604'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เทือง อุษาบริสุทธิ์'
  );

-- [สิทธิบัตร] 22491 - เครื่องขัดผิวท่อนอ้อย
UPDATE intellectual_properties
SET 
    registration_number = '22491',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2027-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'รศ.ดร.มงคล กวางวโรภาส',
    creator_personnel_id = 968,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '22491';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-004', 'เครื่องขัดผิวท่อนอ้อย', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.มงคล กวางวโรภาส',
    968, 'IE', NULL, '22491',
    NULL, '2007-01-01'::date, '2027-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '22491'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.มงค', 968, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.มงค'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'กวางวโรภาส', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'กวางวโรภาส'
  );

-- [สิทธิบัตร] 22492 - เครื่องเกี่ยวนวดข้าวโพดชนิดลากจูงโดยรถแทรกเตอร์
UPDATE intellectual_properties
SET 
    registration_number = '22492',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2027-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'รศ.วิชา หมั่นทำการ',
    creator_personnel_id = 1006,
    department_code = 'EEEC',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '22492';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-005', 'เครื่องเกี่ยวนวดข้าวโพดชนิดลากจูงโดยรถแทรกเตอร์', 'สิทธิบัตร', NULL, NULL, 'รศ.วิชา หมั่นทำการ',
    1006, 'EEEC', NULL, '22492',
    NULL, '2007-01-01'::date, '2027-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '22492'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'EEEC'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22492'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'EEEC'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.วิชา หมั่นทำการ', 1006, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22492'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.วิชา หมั่นทำการ'
  );

-- [สิทธิบัตร] 22595 - เครื่องปอกเปลือกผลมะพร้าวอ่อน
UPDATE intellectual_properties
SET 
    registration_number = '22595',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2027-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'ศ.ดร.บัณฑิต จริโมภาส',
    creator_personnel_id = 972,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '22595';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-006', 'เครื่องปอกเปลือกผลมะพร้าวอ่อน', 'สิทธิบัตร', NULL, NULL, 'ศ.ดร.บัณฑิต จริโมภาส',
    972, 'IE', NULL, '22595',
    NULL, '2007-01-01'::date, '2027-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '22595'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22595'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.บัณฑิต จริโมภาส', 972, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22595'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.บัณฑิต จริโมภาส'
  );

-- [สิทธิบัตร] 22669 - เครื่องปอกเปลือกข้าวโพดฝักอ่อนแบบลูกกลิ้ง
UPDATE intellectual_properties
SET 
    registration_number = '22669',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2027-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1),
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '22669';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-007', 'เครื่องปอกเปลือกข้าวโพดฝักอ่อนแบบลูกกลิ้ง', 'สิทธิบัตร', NULL, NULL, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล',
    (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), 'AE', NULL, '22669',
    NULL, '2007-01-01'::date, '2027-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '22669'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22669'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุ', (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '22669'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุ'
  );

-- [สิทธิบัตร] 30853 - เครื่องนวดข้าวน้ำนม
UPDATE intellectual_properties
SET 
    registration_number = '30853',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2011-01-01'::date,
    protection_end = '2031-01-01'::date,
    fiscal_year = 2554,
    creator_name = 'รศ.วิชา หมั่นทำการ',
    creator_personnel_id = 1006,
    department_code = 'EEEC',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: นานาชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '30853';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-008', 'เครื่องนวดข้าวน้ำนม', 'สิทธิบัตร', NULL, NULL, 'รศ.วิชา หมั่นทำการ',
    1006, 'EEEC', NULL, '30853',
    NULL, '2011-01-01'::date, '2031-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2554, 'ระดับผลงาน: นานาชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '30853'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'EEEC'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '30853'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'EEEC'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.วิชา หมั่นทำการ', 1006, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '30853'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.วิชา หมั่นทำการ'
  );

-- [สิทธิบัตร] 29687 - เครื่องตัดและสับต้นข้าวโพดแบบใช้ต้นกำลังจากแทรคเตอ
UPDATE intellectual_properties
SET 
    registration_number = '29687',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2011-01-01'::date,
    protection_end = '2031-01-01'::date,
    fiscal_year = 2554,
    creator_name = 'ผศ.ดร.สุวรรณ หอมหวล',
    creator_personnel_id = 1013,
    department_code = 'DWT',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '29687';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-009', 'เครื่องตัดและสับต้นข้าวโพดแบบใช้ต้นกำลังจากแทรคเตอร์ขนาดเล็ก', 'สิทธิบัตร', NULL, NULL, 'ผศ.ดร.สุวรรณ หอมหวล',
    1013, 'DWT', NULL, '29687',
    NULL, '2011-01-01'::date, '2031-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2554, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '29687'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'DWT'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '29687'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'DWT'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.สุวรรณ หอมหว', 1013, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '29687'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.สุวรรณ หอมหว'
  );

-- [สิทธิบัตร] 264731 - การสร้างโปรตีนคอนจูเกตด้วยวิธีการปั่นด้วยไฟฟ้าสถิต
UPDATE intellectual_properties
SET 
    registration_number = '264731',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2013-01-01'::date,
    protection_end = '2033-01-01'::date,
    fiscal_year = 2556,
    creator_name = 'ดร.กอบศักดิ์ กาญจนาพงศ์กุล',
    creator_personnel_id = 899,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: นานาชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '264731';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-010', 'การสร้างโปรตีนคอนจูเกตด้วยวิธีการปั่นด้วยไฟฟ้าสถิต', 'สิทธิบัตร', NULL, NULL, 'ดร.กอบศักดิ์ กาญจนาพงศ์กุล',
    899, 'FE', NULL, '264731',
    NULL, '2013-01-01'::date, '2033-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2556, 'ระดับผลงาน: นานาชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '264731'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '264731'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ดร.กอบศักดิ์ กาญจนาพงศ์กุ', 899, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '264731'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ดร.กอบศักดิ์ กาญจนาพงศ์กุ'
  );

-- [สิทธิบัตร] 40587 - เครื่องตรวจความผิดปกติของนม ยู. เอช. ที. หรือผลิตภ
UPDATE intellectual_properties
SET 
    registration_number = '40587',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2014-01-01'::date,
    protection_end = '2034-01-01'::date,
    fiscal_year = 2557,
    creator_name = 'ผศ.ดร.สุวรรณ หอมหวล',
    creator_personnel_id = 1013,
    department_code = 'DWT',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '40587';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-011', 'เครื่องตรวจความผิดปกติของนม ยู. เอช. ที. หรือผลิตภัณฑ์อาหารเหลวบรรจุกล่องแบบไม่ทำลาย', 'สิทธิบัตร', NULL, NULL, 'ผศ.ดร.สุวรรณ หอมหวล',
    1013, 'DWT', NULL, '40587',
    NULL, '2014-01-01'::date, '2034-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2557, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '40587'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'DWT'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '40587'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'DWT'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.สุวรรณ หอมหว', 1013, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '40587'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.สุวรรณ หอมหว'
  );

-- [สิทธิบัตร] 43733 - เครื่องทำความสะอาดแบบแห้งและขูดผิวหัวมันสำปะหลัง
UPDATE intellectual_properties
SET 
    registration_number = '43733',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2015-01-01'::date,
    protection_end = '2035-01-01'::date,
    fiscal_year = 2558,
    creator_name = 'อ.ง่ายงาม ประจวบวัน',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'ง่ายงาม' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '43733';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-012', 'เครื่องทำความสะอาดแบบแห้งและขูดผิวหัวมันสำปะหลัง', 'สิทธิบัตร', NULL, NULL, 'อ.ง่ายงาม ประจวบวัน',
    (SELECT id FROM personnel WHERE first_name = 'ง่ายงาม' LIMIT 1), 'FE', NULL, '43733',
    NULL, '2015-01-01'::date, '2035-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2558, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '43733'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '43733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ง่ายงาม ปร', (SELECT id FROM personnel WHERE first_name = 'ง่ายงาม' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '43733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ง่ายงาม ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'จวบวัน', (SELECT id FROM personnel WHERE first_name = 'ง่ายงาม' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '43733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'จวบวัน'
  );

-- [สิทธิบัตร] 163220 - พลาสติกย่อยสลายได้จากแป้งกล้วยร่วมกับแป้งกล้วยดัดแ
UPDATE intellectual_properties
SET 
    registration_number = '163220',
    application_number = '1301004503',
    filing_date = '2013-08-14'::date,
    protection_start = '2017-06-08'::date,
    protection_end = NULL,
    fiscal_year = 2560,
    creator_name = 'ศ.ดร.รังสินี  โสธรวิทย์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '163220';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-013', 'พลาสติกย่อยสลายได้จากแป้งกล้วยร่วมกับแป้งกล้วยดัดแปร', 'สิทธิบัตร', NULL, NULL, 'ศ.ดร.รังสินี  โสธรวิทย์',
    (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', '1301004503', '163220',
    '2013-08-14'::date, '2017-06-08'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2560, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '163220'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '163220'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.รังสินี  โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '163220'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.รังสินี  โสธรวิทย์'
  );

-- [สิทธิบัตร] 84494 - กรรมวิธีการผลิตฟิล์มบริโภคได้จากมะม่วงและผลิตภัณฑ์
UPDATE intellectual_properties
SET 
    registration_number = '84494',
    application_number = '1001001990',
    filing_date = '2010-12-24'::date,
    protection_start = '2021-10-01'::date,
    protection_end = '2030-12-23'::date,
    fiscal_year = 2564,
    creator_name = 'ศ.ดร.รังสินี  โสธรวิทย์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '84494';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-014', 'กรรมวิธีการผลิตฟิล์มบริโภคได้จากมะม่วงและผลิตภัณฑ์ที่ได้จากกรรมวิธีดังกล่าว', 'สิทธิบัตร', NULL, NULL, 'ศ.ดร.รังสินี  โสธรวิทย์',
    (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', '1001001990', '84494',
    '2010-12-24'::date, '2021-10-01'::date, '2030-12-23'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '84494'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '84494'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.รังสินี  โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '84494'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.รังสินี  โสธรวิทย์'
  );

-- [สิทธิบัตร] 87903 - อุปกรณ์วัดปริมาตรของแข็งในเนื้อวัสดุพรุน
UPDATE intellectual_properties
SET 
    registration_number = '87903',
    application_number = '1201004496',
    filing_date = '2012-09-04'::date,
    protection_start = '2022-05-05'::date,
    protection_end = '2032-09-03'::date,
    fiscal_year = 2565,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '87903';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-015', 'อุปกรณ์วัดปริมาตรของแข็งในเนื้อวัสดุพรุน', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    851, 'AE', '1201004496', '87903',
    '2012-09-04'::date, '2022-05-05'::date, '2032-09-03'::date, 0.0, 'ได้รับความคุ้มครอง',
    2565, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '87903'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87903'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87903'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87903'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87903'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );

-- [สิทธิบัตร] 87402 - เครื่องเล่นเกมส์ยิงปืนใหญ่
UPDATE intellectual_properties
SET 
    registration_number = '87402',
    application_number = '0901000267',
    filing_date = '2009-01-23'::date,
    protection_start = '2022-04-08'::date,
    protection_end = '2029-01-22'::date,
    fiscal_year = 2565,
    creator_name = 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    creator_personnel_id = 847,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '87402';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-016', 'เครื่องเล่นเกมส์ยิงปืนใหญ่', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    847, 'AE', '0901000267', '87402',
    '2009-01-23'::date, '2022-04-08'::date, '2029-01-22'::date, 0.0, 'ได้รับความคุ้มครอง',
    2565, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '87402'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87402'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ศิว', 847, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87402'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ศิว'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ักษณ์ ปฐวีรัตน์', 847, false
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '87402'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ักษณ์ ปฐวีรัตน์'
  );

-- [สิทธิบัตร] 93302 - สารเคลือบผิวผักและผลไม้ชนิดผงจากพอลิเมอร์ชีวภาพและ
UPDATE intellectual_properties
SET 
    registration_number = '93302',
    application_number = '1501001399',
    filing_date = '2015-03-13'::date,
    protection_start = '2023-04-27'::date,
    protection_end = '2035-03-12'::date,
    fiscal_year = 2560,
    creator_name = 'ศ.ดร.รังสินี  โสธรวิทย์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = '93302';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-017', 'สารเคลือบผิวผักและผลไม้ชนิดผงจากพอลิเมอร์ชีวภาพและกรรมวิธีการผลิต', 'สิทธิบัตร', NULL, NULL, 'ศ.ดร.รังสินี  โสธรวิทย์',
    (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', '1501001399', '93302',
    '2015-03-13'::date, '2023-04-27'::date, '2035-03-12'::date, 0.0, 'ได้รับความคุ้มครอง',
    2560, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = '93302'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '93302'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.รังสินี  โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = '93302'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.รังสินี  โสธรวิทย์'
  );

-- [สิทธิบัตร] WO 2025/075554A1 - Precast concrete with sacrificial anode cathodic p
UPDATE intellectual_properties
SET 
    registration_number = 'WO 2025/075554A1',
    application_number = NULL,
    filing_date = '2023-10-05'::date,
    protection_start = '2025-04-10'::date,
    protection_end = NULL,
    fiscal_year = 2568,
    creator_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    creator_personnel_id = 922,
    department_code = 'CE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: นานาชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'สิทธิบัตร' AND registration_number = 'WO 2025/075554A1';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pat-018', 'Precast concrete with sacrificial anode cathodic protection', 'สิทธิบัตร', NULL, NULL, 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    922, 'CE', NULL, 'WO 2025/075554A1',
    '2023-10-05'::date, '2025-04-10'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2568, 'ระดับผลงาน: นานาชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'สิทธิบัตร' AND registration_number = 'WO 2025/075554A1'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CE'
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = 'WO 2025/075554A1'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.นันทวัฒน์  ขมหวาน', 922, true
FROM intellectual_properties ip
WHERE ip.type = 'สิทธิบัตร' AND ip.registration_number = 'WO 2025/075554A1'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน'
  );

-- [อนุสิทธิบัตร] 2193 - กรรมวิธีการผลิตฟิล์มรับประทานได้จากกล้วยน้ำว้าและผ
UPDATE intellectual_properties
SET 
    registration_number = '2193',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2005-01-01'::date,
    protection_end = '2011-01-01'::date,
    fiscal_year = 2548,
    creator_name = 'ศ.ดร.รังสินี  โสธรวิทย์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '2193';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-001', 'กรรมวิธีการผลิตฟิล์มรับประทานได้จากกล้วยน้ำว้าและผลิตภัณฑ์ที่ได้จากกรรมวิธีนั้น', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.รังสินี  โสธรวิทย์',
    (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', NULL, '2193',
    NULL, '2005-01-01'::date, '2011-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2548, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '2193'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '2193'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.รังสินี  โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '2193'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.รังสินี  โสธรวิทย์'
  );

-- [อนุสิทธิบัตร] 2403 - เครื่องกระเทาะผลหมาก
UPDATE intellectual_properties
SET 
    registration_number = '2403',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2006-01-01'::date,
    protection_end = '2012-01-01'::date,
    fiscal_year = 2549,
    creator_name = 'ศ.ดร.บัณฑิต จริโมภาส',
    creator_personnel_id = 972,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '2403';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-002', 'เครื่องกระเทาะผลหมาก', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.บัณฑิต จริโมภาส',
    972, 'IE', NULL, '2403',
    NULL, '2006-01-01'::date, '2012-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2549, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '2403'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '2403'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.บัณฑิต จริโมภาส', 972, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '2403'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.บัณฑิต จริโมภาส'
  );

-- [อนุสิทธิบัตร] 3489 - เครื่องเปิดมะพร้าวอ่อน
UPDATE intellectual_properties
SET 
    registration_number = '3489',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2013-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'ศ.ดร.บัณฑิต จริโมภาส',
    creator_personnel_id = 972,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3489';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-003', 'เครื่องเปิดมะพร้าวอ่อน', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.บัณฑิต จริโมภาส',
    972, 'IE', NULL, '3489',
    NULL, '2007-01-01'::date, '2013-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3489'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3489'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.บัณฑิต จริโมภาส', 972, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3489'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.บัณฑิต จริโมภาส'
  );

-- [อนุสิทธิบัตร] 3594 - เครื่องเปิดผลมะพร้าวอ่อนชนิดที่จับยึดผลเคลื่อนจากด
UPDATE intellectual_properties
SET 
    registration_number = '3594',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2013-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'ศ.ดร.บัณฑิต จริโมภาส',
    creator_personnel_id = 972,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3594';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-004', 'เครื่องเปิดผลมะพร้าวอ่อนชนิดที่จับยึดผลเคลื่อนจากด้านบนลงล่าง', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.บัณฑิต จริโมภาส',
    972, 'IE', NULL, '3594',
    NULL, '2007-01-01'::date, '2013-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3594'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3594'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.บัณฑิต จริโมภาส', 972, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3594'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.บัณฑิต จริโมภาส'
  );

-- [อนุสิทธิบัตร] 3625 - อุปกรณ์จับยึดผลมะพร้าวอ่อนสำหรับเครื่องเปิดผลมะพร้
UPDATE intellectual_properties
SET 
    registration_number = '3625',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2007-01-01'::date,
    protection_end = '2013-01-01'::date,
    fiscal_year = 2550,
    creator_name = 'ศ.ดร.บัณฑิต จริโมภาส',
    creator_personnel_id = 972,
    department_code = 'IE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3625';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-005', 'อุปกรณ์จับยึดผลมะพร้าวอ่อนสำหรับเครื่องเปิดผลมะพร้าวอ่อน', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.บัณฑิต จริโมภาส',
    972, 'IE', NULL, '3625',
    NULL, '2007-01-01'::date, '2013-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2550, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '3625'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3625'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.บัณฑิต จริโมภาส', 972, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '3625'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.บัณฑิต จริโมภาส'
  );

-- [อนุสิทธิบัตร] 4948 - อุปกรณ์อุ่นอาหารจากไอน้ำของหม้อหุงข้าว
UPDATE intellectual_properties
SET 
    registration_number = '4948',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2009-01-01'::date,
    protection_end = '2015-01-01'::date,
    fiscal_year = 2552,
    creator_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    creator_personnel_id = 903,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '4948';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-006', 'อุปกรณ์อุ่นอาหารจากไอน้ำของหม้อหุงข้าว', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    903, 'FE', NULL, '4948',
    NULL, '2009-01-01'::date, '2015-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2552, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '4948'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '4948'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ', 903, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '4948'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ'
  );

-- [อนุสิทธิบัตร] 6666 - ผลิตภัณฑ์กำจัดศัตรูพืช
UPDATE intellectual_properties
SET 
    registration_number = '6666',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2011-01-01'::date,
    protection_end = '2017-01-01'::date,
    fiscal_year = 2554,
    creator_name = 'อ.ดร.พิเชษฐ์  สืบสายพรหม',
    creator_personnel_id = 982,
    department_code = 'CPE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '6666';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-007', 'ผลิตภัณฑ์กำจัดศัตรูพืช', 'อนุสิทธิบัตร', NULL, NULL, 'อ.ดร.พิเชษฐ์  สืบสายพรหม',
    982, 'CPE', NULL, '6666',
    NULL, '2011-01-01'::date, '2017-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2554, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '6666'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CPE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '6666'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CPE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.พิเชษฐ์  สืบสายพรหม', 982, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '6666'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.พิเชษฐ์  สืบสายพรหม'
  );

-- [อนุสิทธิบัตร] 7600 - สูตรอาหารข้นสำหรับโคนมที่มีกากใบมันสำปะหลังเป็นส่ว
UPDATE intellectual_properties
SET 
    registration_number = '7600',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2012-01-01'::date,
    protection_end = '2018-01-01'::date,
    fiscal_year = 2555,
    creator_name = 'รศ.ประภาศรี สิงหรัตน์',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '7600';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-008', 'สูตรอาหารข้นสำหรับโคนมที่มีกากใบมันสำปะหลังเป็นส่วนผสม', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ประภาศรี สิงหรัตน์',
    849, 'AE', NULL, '7600',
    NULL, '2012-01-01'::date, '2018-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2555, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '7600'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '7600'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '7600'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ภาศรี สิงหรัตน์', (SELECT id FROM personnel WHERE first_name = 'ประภาศรี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '7600'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ภาศรี สิงหรัตน์'
  );

-- [อนุสิทธิบัตร] 8226 - กรรมวิธีการผลิตสารตั้งต้นสำหรับการผลิตเอทานอลจากก้
UPDATE intellectual_properties
SET 
    registration_number = '8226',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2013-01-01'::date,
    protection_end = '2019-01-01'::date,
    fiscal_year = 2556,
    creator_name = 'รศ.ประภาศรี สิงหรัตน์',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8226';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-009', 'กรรมวิธีการผลิตสารตั้งต้นสำหรับการผลิตเอทานอลจากก้านใบมันสำปะหลัง', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ประภาศรี สิงหรัตน์',
    849, 'AE', NULL, '8226',
    NULL, '2013-01-01'::date, '2019-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2556, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8226'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8226'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8226'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ภาศรี สิงหรัตน์', (SELECT id FROM personnel WHERE first_name = 'ประภาศรี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8226'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ภาศรี สิงหรัตน์'
  );

-- [อนุสิทธิบัตร] 8227 - เครื่องคัดขนาดเส้นผ่านศูนย์กลางผักและผลไม้ที่มีรูป
UPDATE intellectual_properties
SET 
    registration_number = '8227',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2013-01-01'::date,
    protection_end = '2019-01-01'::date,
    fiscal_year = 2556,
    creator_name = 'รศ.ประภาศรี สิงหรัตน์',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8227';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-010', 'เครื่องคัดขนาดเส้นผ่านศูนย์กลางผักและผลไม้ที่มีรูปร่างที่เรียวยาว', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ประภาศรี สิงหรัตน์',
    849, 'AE', NULL, '8227',
    NULL, '2013-01-01'::date, '2019-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2556, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8227'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8227'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8227'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ภาศรี สิงหรัตน์', (SELECT id FROM personnel WHERE first_name = 'ประภาศรี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8227'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ภาศรี สิงหรัตน์'
  );

-- [อนุสิทธิบัตร] 7826 - กรรมวิธีการผลิตกระดาษดูดซับก๊าซเอทิลีนและผลิตภัณฑ์
UPDATE intellectual_properties
SET 
    registration_number = '7826',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2013-01-01'::date,
    protection_end = '2019-01-01'::date,
    fiscal_year = 2556,
    creator_name = 'ศ.ดร.รังสินี  โสธรวิทย์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '7826';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-011', 'กรรมวิธีการผลิตกระดาษดูดซับก๊าซเอทิลีนและผลิตภัณฑ์ที่ได้จากกรรมวิธีนั้น', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.รังสินี  โสธรวิทย์',
    (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', NULL, '7826',
    NULL, '2013-01-01'::date, '2019-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2556, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '7826'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '7826'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.รังสินี  โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '7826'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.รังสินี  โสธรวิทย์'
  );

-- [อนุสิทธิบัตร] 8491 - เครื่องแยกผลปาล์มน้ำมันออกจากช่อทะลายย่อย
UPDATE intellectual_properties
SET 
    registration_number = '8491',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2013-01-01'::date,
    protection_end = '2019-01-01'::date,
    fiscal_year = 2556,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8491';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-012', 'เครื่องแยกผลปาล์มน้ำมันออกจากช่อทะลายย่อย', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    851, 'AE', NULL, '8491',
    NULL, '2013-01-01'::date, '2019-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2556, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8491'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8491'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );

-- [อนุสิทธิบัตร] 8717 - อิฐบล็อกซีเมนต์ผสมเถ้าเหง่ามันสำปะหลัง
UPDATE intellectual_properties
SET 
    registration_number = '8717',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2014-01-01'::date,
    protection_end = '2020-01-01'::date,
    fiscal_year = 2557,
    creator_name = 'ผศ.ดร.กมล  อมรฟ้า',
    creator_personnel_id = 885,
    department_code = 'IRE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8717';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-013', 'อิฐบล็อกซีเมนต์ผสมเถ้าเหง่ามันสำปะหลัง', 'อนุสิทธิบัตร', NULL, NULL, 'ผศ.ดร.กมล  อมรฟ้า',
    885, 'IRE', NULL, '8717',
    NULL, '2014-01-01'::date, '2020-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2557, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '8717'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IRE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8717'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IRE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.กม', 885, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8717'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.กม'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อมรฟ้า', 925, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '8717'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อมรฟ้า'
  );

-- [อนุสิทธิบัตร] 9088 - การออกแบบและพัฒนาเครื่องระเหยน้ำสับปะรดโดยใช้เทคนิ
UPDATE intellectual_properties
SET 
    registration_number = '9088',
    application_number = '1403000230',
    filing_date = '2014-03-13'::date,
    protection_start = '2014-08-29'::date,
    protection_end = '2020-03-12'::date,
    fiscal_year = 2557,
    creator_name = 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '9088';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-014', 'การออกแบบและพัฒนาเครื่องระเหยน้ำสับปะรดโดยใช้เทคนิคการพ่นฝอยภายใต้สภาวะสุญญากาศ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), 'FE', '1403000230', '9088',
    '2014-03-13'::date, '2014-08-29'::date, '2020-03-12'::date, 0.0, 'ได้รับความคุ้มครอง',
    2557, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '9088'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '9088'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.เชาว์ อินทร์ปร', (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '9088'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.เชาว์ อินทร์ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '9088'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );

-- [อนุสิทธิบัตร] 9626 - ผลิตภัณฑ์ซอสเข้มข้นที่ได้จากการหมักพืชผักผลไม้และด
UPDATE intellectual_properties
SET 
    registration_number = '9626',
    application_number = '1403000446',
    filing_date = '2014-05-08'::date,
    protection_start = '2015-03-06'::date,
    protection_end = NULL,
    fiscal_year = 2557,
    creator_name = 'นางสาวคนิจฐา บุญเฟื่อง',
    creator_personnel_id = 913,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '9626';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-015', 'ผลิตภัณฑ์ซอสเข้มข้นที่ได้จากการหมักพืชผักผลไม้และดอกไม้พื้นบ้านด้วยลูกแป้งข้าวหมากและกรรมวิธี', 'อนุสิทธิบัตร', NULL, NULL, 'นางสาวคนิจฐา บุญเฟื่อง',
    913, 'FE', '1403000446', '9626',
    '2014-05-08'::date, '2015-03-06'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2557, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '9626'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '9626'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นางสาวคนิจฐา บุญเฟื่อง', 913, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '9626'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นางสาวคนิจฐา บุญเฟื่อง'
  );

-- [อนุสิทธิบัตร] 5931 - กรรมวิธีและสูตรอาหารข้นสำหรับโคนมที่มีแหล่งโปรตีนจ
UPDATE intellectual_properties
SET 
    registration_number = '5931',
    application_number = NULL,
    filing_date = NULL,
    protection_start = '2014-01-01'::date,
    protection_end = '2020-01-01'::date,
    fiscal_year = 2557,
    creator_name = 'รศ.ประภาศรี สิงหรัตน์',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '5931';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-016', 'กรรมวิธีและสูตรอาหารข้นสำหรับโคนมที่มีแหล่งโปรตีนจากใบโสนอินเดียที่ผ่านกระบวนการอบแห้ง', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ประภาศรี สิงหรัตน์',
    849, 'AE', NULL, '5931',
    NULL, '2014-01-01'::date, '2020-01-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2557, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '5931'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '5931'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '5931'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ภาศรี สิงหรัตน์', (SELECT id FROM personnel WHERE first_name = 'ประภาศรี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '5931'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ภาศรี สิงหรัตน์'
  );

-- [อนุสิทธิบัตร] 13103 - ชุดอุปกรณ์แซะช่อทะลายย่อยออกจากทะลายปาล์มน้ำมัน
UPDATE intellectual_properties
SET 
    registration_number = '13103',
    application_number = '1603001143',
    filing_date = '2016-06-30'::date,
    protection_start = '2017-09-15'::date,
    protection_end = '2022-06-29'::date,
    fiscal_year = 2560,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '13103';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-017', 'ชุดอุปกรณ์แซะช่อทะลายย่อยออกจากทะลายปาล์มน้ำมัน', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    851, 'AE', '1603001143', '13103',
    '2016-06-30'::date, '2017-09-15'::date, '2022-06-29'::date, 0.0, 'ได้รับความคุ้มครอง',
    2560, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '13103'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13103'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13103'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13103'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13103'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );

-- [อนุสิทธิบัตร] 13777 - ผลิตภัณฑ์ข้าวหมากสีจากผักผลไม้และดอกไม้และกรรมวิธี
UPDATE intellectual_properties
SET 
    registration_number = '13777',
    application_number = '1603001057',
    filing_date = '2016-06-16'::date,
    protection_start = '2018-04-24'::date,
    protection_end = '2022-06-15'::date,
    fiscal_year = 2564,
    creator_name = 'นางสาวคนิจฐา บุญเฟื่อง',
    creator_personnel_id = 913,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '13777';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-018', 'ผลิตภัณฑ์ข้าวหมากสีจากผักผลไม้และดอกไม้และกรรมวิธีการผลิต', 'อนุสิทธิบัตร', NULL, NULL, 'นางสาวคนิจฐา บุญเฟื่อง',
    913, 'FE', '1603001057', '13777',
    '2016-06-16'::date, '2018-04-24'::date, '2022-06-15'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '13777'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13777'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นางสาวคนิจฐา บุญเฟื่อง', 913, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '13777'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นางสาวคนิจฐา บุญเฟื่อง'
  );

-- [อนุสิทธิบัตร] 16248 - เครื่องกะเทาะผลสบู่ดำ
UPDATE intellectual_properties
SET 
    registration_number = '16248',
    application_number = '1903002199',
    filing_date = '2019-08-28'::date,
    protection_start = '2020-05-20'::date,
    protection_end = '2025-08-27'::date,
    fiscal_year = 2563,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '16248';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-019', 'เครื่องกะเทาะผลสบู่ดำ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    851, 'AE', '1903002199', '16248',
    '2019-08-28'::date, '2020-05-20'::date, '2025-08-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '16248'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16248'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16248'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16248'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16248'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );

-- [อนุสิทธิบัตร] 16107 - เครื่องแยกกรดไขมันอิสระออกจากน้ำมันปาล์มดิบ
UPDATE intellectual_properties
SET 
    registration_number = '16107',
    application_number = '1803002345',
    filing_date = '2018-10-11'::date,
    protection_start = '2020-04-02'::date,
    protection_end = '2024-10-10'::date,
    fiscal_year = 2563,
    creator_name = 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '16107';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-020', 'เครื่องแยกกรดไขมันอิสระออกจากน้ำมันปาล์มดิบ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), 'FE', '1803002345', '16107',
    '2018-10-11'::date, '2020-04-02'::date, '2024-10-10'::date, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '16107'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16107'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.เชาว์ อินทร์ปร', (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16107'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.เชาว์ อินทร์ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '16107'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );

-- [อนุสิทธิบัตร] 17002 - กรรมวิธีการผลิตสารหอมระเหยผงจากข้าวหอมมะลิหุงสุกด้
UPDATE intellectual_properties
SET 
    registration_number = '17002',
    application_number = '1903002007',
    filing_date = '2019-08-07'::date,
    protection_start = '2020-12-02'::date,
    protection_end = '2025-08-06'::date,
    fiscal_year = 2563,
    creator_name = 'รศ.ดร.มนต์ทิพย์  ช่ำชอง',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'มนต์ทิพย์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17002';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-021', 'กรรมวิธีการผลิตสารหอมระเหยผงจากข้าวหอมมะลิหุงสุกด้วยเทคนิคเอนแคปซูเลชัน', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.มนต์ทิพย์  ช่ำชอง',
    (SELECT id FROM personnel WHERE first_name = 'มนต์ทิพย์' LIMIT 1), 'FE', '1903002007', '17002',
    '2019-08-07'::date, '2020-12-02'::date, '2025-08-06'::date, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17002'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17002'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.มนต์ทิพย์  ช่ำชอง', (SELECT id FROM personnel WHERE first_name = 'มนต์ทิพย์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17002'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.มนต์ทิพย์  ช่ำชอง'
  );

-- [อนุสิทธิบัตร] 15932 - กรรมวิธีการผลิตหัวจ่ายน้ำ (Sprinkler) แบบเลื่อนเก็
UPDATE intellectual_properties
SET 
    registration_number = '15932',
    application_number = '1903000765',
    filing_date = '2019-03-27'::date,
    protection_start = '2020-02-18'::date,
    protection_end = '2025-03-26'::date,
    fiscal_year = 2563,
    creator_name = 'นายระวี อยู่สำราญ',
    creator_personnel_id = 843,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '15932';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-022', 'กรรมวิธีการผลิตหัวจ่ายน้ำ (Sprinkler) แบบเลื่อนเก็บหัวได้ (POP-UP) โดยใช้ท่อพีวีซี (PVC)', 'อนุสิทธิบัตร', NULL, NULL, 'นายระวี อยู่สำราญ',
    843, 'AE', '1903000765', '15932',
    '2019-03-27'::date, '2020-02-18'::date, '2025-03-26'::date, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '15932'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15932'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายร', 843, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15932'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'วี อยู่สำราญ', (SELECT id FROM personnel WHERE first_name = 'ระวี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15932'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'วี อยู่สำราญ'
  );

-- [อนุสิทธิบัตร] 15938 - เครื่องสกัดแคโรทีนอยด์จากน้ำมันปาล์มดิบระดับกึ่งอุ
UPDATE intellectual_properties
SET 
    registration_number = '15938',
    application_number = '1803000565',
    filing_date = '2018-03-07'::date,
    protection_start = '2020-02-19'::date,
    protection_end = NULL,
    fiscal_year = 2563,
    creator_name = 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '15938';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-023', 'เครื่องสกัดแคโรทีนอยด์จากน้ำมันปาล์มดิบระดับกึ่งอุตสาหกรรม', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์',
    (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), 'FE', '1803000565', '15938',
    '2018-03-07'::date, '2020-02-19'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '15938'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.เชาว์ อินทร์ปร', (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.เชาว์ อินทร์ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '15938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );

-- [อนุสิทธิบัตร] 17078 - อุปกรณ์กันน้ำ
UPDATE intellectual_properties
SET 
    registration_number = '17078',
    application_number = '1803002339',
    filing_date = '2018-10-10'::date,
    protection_start = '2020-12-18'::date,
    protection_end = '2024-10-09'::date,
    fiscal_year = 2563,
    creator_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    creator_personnel_id = 922,
    department_code = 'CE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17078';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-024', 'อุปกรณ์กันน้ำ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    922, 'CE', '1803002339', '17078',
    '2018-10-10'::date, '2020-12-18'::date, '2024-10-09'::date, 0.0, 'ได้รับความคุ้มครอง',
    2563, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17078'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17078'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.นันทวัฒน์  ขมหวาน', 922, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17078'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน'
  );

-- [อนุสิทธิบัตร] 17670 - ระบบและวิธีการสำหรับการวิเคราะห์คุณภาพยางก้อนถ้วยด
UPDATE intellectual_properties
SET 
    registration_number = '17670',
    application_number = '1703001792',
    filing_date = '2016-03-01'::date,
    protection_start = '2021-05-05'::date,
    protection_end = '2022-02-28'::date,
    fiscal_year = 2564,
    creator_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    creator_personnel_id = 903,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17670';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-025', 'ระบบและวิธีการสำหรับการวิเคราะห์คุณภาพยางก้อนถ้วยด้วยเทคนิคสเปกโตรสโคปีชนิดแสงอินฟราเรดย่านใกล้', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    903, 'FE', '1703001792', '17670',
    '2016-03-01'::date, '2021-05-05'::date, '2022-02-28'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '17670'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17670'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ', 903, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '17670'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ'
  );

-- [อนุสิทธิบัตร] 18395 - อุปกรณ์ควบคุมทางเดินแสง
UPDATE intellectual_properties
SET 
    registration_number = '18395',
    application_number = '1603001893',
    filing_date = '2016-09-23'::date,
    protection_start = '2021-10-18'::date,
    protection_end = '2022-09-22'::date,
    fiscal_year = 2564,
    creator_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    creator_personnel_id = 903,
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '18395';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-026', 'อุปกรณ์ควบคุมทางเดินแสง', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ',
    903, 'FE', '1603001893', '18395',
    '2016-09-23'::date, '2021-10-18'::date, '2022-09-22'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '18395'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '18395'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.รณฤทธิ์  ฤทธิรณ', 903, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '18395'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.รณฤทธิ์  ฤทธิรณ'
  );

-- [อนุสิทธิบัตร] 19301 - อุปกรณ์ผูกลวด
UPDATE intellectual_properties
SET 
    registration_number = '19301',
    application_number = '1903002196',
    filing_date = '2019-08-28'::date,
    protection_start = '2022-02-17'::date,
    protection_end = '2025-08-27'::date,
    fiscal_year = 2565,
    creator_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    creator_personnel_id = 922,
    department_code = 'CE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '19301';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-027', 'อุปกรณ์ผูกลวด', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    922, 'CE', '1903002196', '19301',
    '2019-08-28'::date, '2022-02-17'::date, '2025-08-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2565, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '19301'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '19301'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.นันทวัฒน์  ขมหวาน', 922, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '19301'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน'
  );

-- [อนุสิทธิบัตร] 20072 - มีดผ่าทุเรียนสุก
UPDATE intellectual_properties
SET 
    registration_number = '20072',
    application_number = '2003001994',
    filing_date = '2020-08-20'::date,
    protection_start = '2022-08-17'::date,
    protection_end = '2026-08-19'::date,
    fiscal_year = 2564,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20072';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-028', 'มีดผ่าทุเรียนสุก', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ',
    851, 'AE', '2003001994', '20072',
    '2020-08-20'::date, '2022-08-17'::date, '2026-08-19'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20072'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20072'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20072'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20072'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20072'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );

-- [อนุสิทธิบัตร] 20344 - ระบบและกรรมวิธีการประเมินความแข็งแรงและความงอกของเ
UPDATE intellectual_properties
SET 
    registration_number = '20344',
    application_number = '2103001150',
    filing_date = '2021-04-28'::date,
    protection_start = '2022-11-09'::date,
    protection_end = '2027-04-27'::date,
    fiscal_year = 2565,
    creator_name = 'ดร.ปาริฉัตร เสริมวุฒิสาร',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'ปาริฉัตร' LIMIT 1),
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20344';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-029', 'ระบบและกรรมวิธีการประเมินความแข็งแรงและความงอกของเมล็ดพันธุ์', 'อนุสิทธิบัตร', NULL, NULL, 'ดร.ปาริฉัตร เสริมวุฒิสาร',
    (SELECT id FROM personnel WHERE first_name = 'ปาริฉัตร' LIMIT 1), 'AE', '2103001150', '20344',
    '2021-04-28'::date, '2022-11-09'::date, '2027-04-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2565, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20344'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20344'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ดร.ปาริฉัตร เสริมวุฒิสาร', (SELECT id FROM personnel WHERE first_name = 'ปาริฉัตร' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20344'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ดร.ปาริฉัตร เสริมวุฒิสาร'
  );

-- [อนุสิทธิบัตร] 20394 - อุปกรณ์กันน้ำ
UPDATE intellectual_properties
SET 
    registration_number = '20394',
    application_number = '2103002718',
    filing_date = '2021-09-20'::date,
    protection_start = '2022-11-15'::date,
    protection_end = '2027-09-19'::date,
    fiscal_year = 2565,
    creator_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    creator_personnel_id = 922,
    department_code = 'CE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ | ยื่นต่อยอดเชิงพาณิชย์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20394';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-030', 'อุปกรณ์กันน้ำ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    922, 'CE', '2103002718', '20394',
    '2021-09-20'::date, '2022-11-15'::date, '2027-09-19'::date, 0.0, 'ได้รับความคุ้มครอง',
    2565, 'ระดับผลงาน: ชาติ | ยื่นต่อยอดเชิงพาณิชย์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '20394'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20394'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.นันทวัฒน์  ขมหวาน', 922, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '20394'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน'
  );

-- [อนุสิทธิบัตร] 21862 - เครื่องมือวัดระดับน้ำด้วยหลักการวัดค่าความต้านทานไ
UPDATE intellectual_properties
SET 
    registration_number = '21862',
    application_number = '1903002214',
    filing_date = '2019-08-28'::date,
    protection_start = '2023-06-15'::date,
    protection_end = '2025-08-27'::date,
    fiscal_year = 2566,
    creator_name = 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์',
    creator_personnel_id = 869,
    department_code = 'IRE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '21862';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-031', 'เครื่องมือวัดระดับน้ำด้วยหลักการวัดค่าความต้านทานไฟฟ้า', 'อนุสิทธิบัตร', NULL, NULL, 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์',
    869, 'IRE', '1903002214', '21862',
    '2019-08-28'::date, '2023-06-15'::date, '2025-08-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2566, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '21862'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'IRE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '21862'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'IRE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.ไชยาพงษ์ เทพปร', 869, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '21862'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.ไชยาพงษ์ เทพปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '21862'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );

-- [อนุสิทธิบัตร] 22737 - แหวนเตเปอร์ (Taper ring gauge) ป้องกันการรั่วซึมน้
UPDATE intellectual_properties
SET 
    registration_number = '22737',
    application_number = '1903002205',
    filing_date = '2019-08-28'::date,
    protection_start = '2023-11-03'::date,
    protection_end = '2025-08-27'::date,
    fiscal_year = 2566,
    creator_name = 'นายระวี อยู่สำราญ',
    creator_personnel_id = 843,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22737';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-032', 'แหวนเตเปอร์ (Taper ring gauge) ป้องกันการรั่วซึมน้ำ', 'อนุสิทธิบัตร', NULL, NULL, 'นายระวี อยู่สำราญ',
    843, 'AE', '1903002205', '22737',
    '2019-08-28'::date, '2023-11-03'::date, '2025-08-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2566, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22737'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22737'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายร', 843, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22737'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'วี อยู่สำราญ', (SELECT id FROM personnel WHERE first_name = 'ระวี' LIMIT 1), false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22737'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'วี อยู่สำราญ'
  );

-- [อนุสิทธิบัตร] 22485 - กรรมวิธีการผลิตนมมะพร้าวอัดเม็ด
UPDATE intellectual_properties
SET 
    registration_number = '22485',
    application_number = '2003002093',
    filing_date = '2020-08-28'::date,
    protection_start = '2023-11-30'::date,
    protection_end = '2026-08-27'::date,
    fiscal_year = 2564,
    creator_name = 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    creator_personnel_id = 847,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22485';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-033', 'กรรมวิธีการผลิตนมมะพร้าวอัดเม็ด', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    847, 'AE', '2003002093', '22485',
    '2020-08-28'::date, '2023-11-30'::date, '2026-08-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2564, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22485'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22485'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ศิว', 847, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22485'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ศิว'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ักษณ์ ปฐวีรัตน์', 847, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22485'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ักษณ์ ปฐวีรัตน์'
  );

-- [อนุสิทธิบัตร] 22823 - อุปกรณ์ผลิตลูกปูน
UPDATE intellectual_properties
SET 
    registration_number = '22823',
    application_number = '2303000652',
    filing_date = '2023-03-08'::date,
    protection_start = '2023-11-23'::date,
    protection_end = '2029-03-07'::date,
    fiscal_year = 2566,
    creator_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    creator_personnel_id = 922,
    department_code = 'CE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22823';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-034', 'อุปกรณ์ผลิตลูกปูน', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.นันทวัฒน์  ขมหวาน',
    922, 'CE', '2303000652', '22823',
    '2023-03-08'::date, '2023-11-23'::date, '2029-03-07'::date, 0.0, 'ได้รับความคุ้มครอง',
    2566, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22823'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'CE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22823'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'CE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.นันทวัฒน์  ขมหวาน', 922, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22823'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.นันทวัฒน์  ขมหวาน'
  );

-- [อนุสิทธิบัตร] 22999 - เครื่องเชื่อมผ้าทอด้วยลมร้อนและรีดร้อน
UPDATE intellectual_properties
SET 
    registration_number = '22999',
    application_number = '2103002620',
    filing_date = '2021-09-14'::date,
    protection_start = '2024-01-08'::date,
    protection_end = '2027-09-13'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.กันต์ธกรณ์ เขาทอง',
    creator_personnel_id = 948,
    department_code = 'ME',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22999';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-035', 'เครื่องเชื่อมผ้าทอด้วยลมร้อนและรีดร้อน', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.กันต์ธกรณ์ เขาทอง',
    948, 'ME', '2103002620', '22999',
    '2021-09-14'::date, '2024-01-08'::date, '2027-09-13'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '22999'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22999'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.กันต์ธกรณ์ เขาทอง', 948, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '22999'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.กันต์ธกรณ์ เขาทอง'
  );

-- [อนุสิทธิบัตร] 23276 - ชุดขาไถระเบิดดินดานแบบปรับความลึกอัตโนมัติ
UPDATE intellectual_properties
SET 
    registration_number = '23276',
    application_number = '2303000850',
    filing_date = '2023-03-25'::date,
    protection_start = '2024-03-07'::date,
    protection_end = '2029-03-24'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.ประเทือง อุษาบริสุทธิ์และคณะ',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '23276';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-036', 'ชุดขาไถระเบิดดินดานแบบปรับความลึกอัตโนมัติ', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์และคณะ',
    849, 'AE', '2303000850', '23276',
    '2023-03-25'::date, '2024-03-07'::date, '2029-03-24'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '23276'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '23276'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '23276'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เทือง อุษาบริสุทธิ์', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '23276'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เทือง อุษาบริสุทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'คณ', 906, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '23276'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'คณ'
  );

-- [อนุสิทธิบัตร] 24174 - เครื่องปอกเปลือกชิ้นมะม่วง
UPDATE intellectual_properties
SET 
    registration_number = '24174',
    application_number = '2303002857',
    filing_date = '2023-10-02'::date,
    protection_start = '2024-03-31'::date,
    protection_end = '2029-10-01'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.สิรินาฏ  น้อยพิทักษ์ และคณะ',
    creator_personnel_id = 848,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24174';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-037', 'เครื่องปอกเปลือกชิ้นมะม่วง', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.สิรินาฏ  น้อยพิทักษ์ และคณะ',
    848, 'AE', '2303002857', '24174',
    '2023-10-02'::date, '2024-03-31'::date, '2029-10-01'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24174'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24174'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.สิรินาฏ  น้อยพิทักษ์', 848, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24174'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.สิรินาฏ  น้อยพิทักษ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'คณ', 906, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24174'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'คณ'
  );

-- [อนุสิทธิบัตร] 24135 - เครื่องคั่วเมล็ดกาแฟแบบควบคุมความดัน
UPDATE intellectual_properties
SET 
    registration_number = '24135',
    application_number = '2003002073',
    filing_date = '2020-08-27'::date,
    protection_start = '2024-07-23'::date,
    protection_end = '2026-08-26'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์ และนายพีระพงศ์ กัทสี',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24135';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-038', 'เครื่องคั่วเมล็ดกาแฟแบบควบคุมความดัน', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์ และนายพีระพงศ์ กัทสี',
    (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), 'FE', '2003002073', '24135',
    '2020-08-27'::date, '2024-07-23'::date, '2026-08-26'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24135'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24135'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.เชาว์ อินทร์ปร', (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24135'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.เชาว์ อินทร์ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24135'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายพีร', 859, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24135'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายพีร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'พงศ์ กัทสี', 908, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24135'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'พงศ์ กัทสี'
  );

-- [อนุสิทธิบัตร] 24733 - เครื่องกำจัดโลหะฟอสไฟต์ตกค้างในเศษเถ้าสารรม
UPDATE intellectual_properties
SET 
    registration_number = '24733',
    application_number = '2203002196',
    filing_date = '2022-09-01'::date,
    protection_start = '2024-11-01'::date,
    protection_end = '2028-08-31'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.วัชรพล  ชยประเสริฐ และคณะ',
    creator_personnel_id = 851,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24733';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-039', 'เครื่องกำจัดโลหะฟอสไฟต์ตกค้างในเศษเถ้าสารรม', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.วัชรพล  ชยประเสริฐ และคณะ',
    851, 'AE', '2203002196', '24733',
    '2022-09-01'::date, '2024-11-01'::date, '2028-08-31'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24733'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.วัชรพ', 851, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.วัชรพ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ชยปร', 851, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ชยปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐ', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'คณ', 906, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24733'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'คณ'
  );

-- [อนุสิทธิบัตร] 24730 - อุปกรณ์วัดความกรอบของเนื้องมะละกอผลดิบ
UPDATE intellectual_properties
SET 
    registration_number = '24730',
    application_number = '230300816',
    filing_date = '2023-12-26'::date,
    protection_start = '2024-11-01'::date,
    protection_end = '2029-12-25'::date,
    fiscal_year = 2567,
    creator_name = 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล และนายวิชัย หมอยาดี',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1),
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24730';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-040', 'อุปกรณ์วัดความกรอบของเนื้องมะละกอผลดิบ', 'อนุสิทธิบัตร', NULL, NULL, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล และนายวิชัย หมอยาดี',
    (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), 'AE', '230300816', '24730',
    '2023-12-26'::date, '2024-11-01'::date, '2029-12-25'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24730'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24730'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุ', (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24730'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายวิชัย หมอยาดี', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24730'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายวิชัย หมอยาดี'
  );

-- [อนุสิทธิบัตร] 24939 - เครื่องนึ่งและอบแห้งข้าวเปลือกด้วยเทคนิคฟลูอิไดซ์เ
UPDATE intellectual_properties
SET 
    registration_number = '24939',
    application_number = '2203002402',
    filing_date = '2022-09-15'::date,
    protection_start = '2024-12-17'::date,
    protection_end = '2028-09-14'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.เชาว์  อินทร์ประสิทธิ์ และนางสาวพรพรรณ จิอู๋',
    creator_personnel_id = (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1),
    department_code = 'FE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24939';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-041', 'เครื่องนึ่งและอบแห้งข้าวเปลือกด้วยเทคนิคฟลูอิไดซ์เบดสั่นร่วมกับการใช้ไอน้ำร้อนยวดยิ่ง', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.เชาว์  อินทร์ประสิทธิ์ และนางสาวพรพรรณ จิอู๋',
    (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), 'FE', '2203002402', '24939',
    '2022-09-15'::date, '2024-12-17'::date, '2028-09-14'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24939'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'FE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24939'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'FE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.เชาว์  อินทร์ปร', (SELECT id FROM personnel WHERE first_name = 'เชาว์' LIMIT 1), true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24939'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.เชาว์  อินทร์ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'สิทธิ์', 876, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24939'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'สิทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นางสาวพรพรรณ จิอู๋', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24939'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นางสาวพรพรรณ จิอู๋'
  );

-- [อนุสิทธิบัตร] 24938 - รถเข็นสี่ล้อเพื่อการเกษตรขับเคลื่อนด้วยระบบไฟฟ้า
UPDATE intellectual_properties
SET 
    registration_number = '24938',
    application_number = '2303003200',
    filing_date = '2023-10-31'::date,
    protection_start = '2024-12-17'::date,
    protection_end = '2029-10-30'::date,
    fiscal_year = 2567,
    creator_name = 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    creator_personnel_id = 847,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24938';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-042', 'รถเข็นสี่ล้อเพื่อการเกษตรขับเคลื่อนด้วยระบบไฟฟ้า', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    847, 'AE', '2303003200', '24938',
    '2023-10-31'::date, '2024-12-17'::date, '2029-10-30'::date, 0.0, 'ได้รับความคุ้มครอง',
    2567, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '24938'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ศิว', 847, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ศิว'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ักษณ์ ปฐวีรัตน์', 847, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '24938'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ักษณ์ ปฐวีรัตน์'
  );

-- [อนุสิทธิบัตร] 25468 - เครื่องกำจัดวัชพืชด้วยเปลวไฟสำหรับติดท้ายรถแทรกเตอ
UPDATE intellectual_properties
SET 
    registration_number = '25468',
    application_number = '2303002822',
    filing_date = '2023-09-28'::date,
    protection_start = '2025-03-27'::date,
    protection_end = '2029-09-27'::date,
    fiscal_year = 2568,
    creator_name = 'รศ.ดร.ประเทือง  อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์  ปั้นมยุรา',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '25468';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-043', 'เครื่องกำจัดวัชพืชด้วยเปลวไฟสำหรับติดท้ายรถแทรกเตอร์', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ประเทือง  อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์  ปั้นมยุรา',
    849, 'AE', '2303002822', '25468',
    '2023-09-28'::date, '2025-03-27'::date, '2029-09-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2568, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '25468'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เทือง  อุษาบริสุทธิ์', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เทือง  อุษาบริสุทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.วันรัฐ อับดุ', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.วันรัฐ อับดุ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ากาซิม', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ากาซิม'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', 857, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.ชัยย', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.ชัยย'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'จันทรา', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'จันทรา'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายพงศ์พันธุ์  ปั้นมยุรา', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25468'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายพงศ์พันธุ์  ปั้นมยุรา'
  );

-- [อนุสิทธิบัตร] 25469 - เครื่องกำจัดวัชพืชด้วยน้ำร้อนสำหรับติดท้ายรถแทรกเต
UPDATE intellectual_properties
SET 
    registration_number = '25469',
    application_number = '2303002824',
    filing_date = '2023-09-28'::date,
    protection_start = '2025-03-27'::date,
    protection_end = '2029-09-27'::date,
    fiscal_year = 2568,
    creator_name = 'รศ.ดร.ประเทือง  อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์  ปั้นมยุรา',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '25469';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-044', 'เครื่องกำจัดวัชพืชด้วยน้ำร้อนสำหรับติดท้ายรถแทรกเตอร์', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ประเทือง  อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์  ปั้นมยุรา',
    849, 'AE', '2303002824', '25469',
    '2023-09-28'::date, '2025-03-27'::date, '2029-09-27'::date, 0.0, 'ได้รับความคุ้มครอง',
    2568, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '25469'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เทือง  อุษาบริสุทธิ์', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เทือง  อุษาบริสุทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.วันรัฐ อับดุ', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.วันรัฐ อับดุ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ากาซิม', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ากาซิม'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', 857, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.ชัยย', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.ชัยย'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'จันทรา', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'จันทรา'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายพงศ์พันธุ์  ปั้นมยุรา', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '25469'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายพงศ์พันธุ์  ปั้นมยุรา'
  );

-- [อนุสิทธิบัตร] 26189 - ชุดอุปกรณ์ตรวจวัดความชื้นของเมล็ดพืช
UPDATE intellectual_properties
SET 
    registration_number = '26189',
    application_number = '2403001791',
    filing_date = '2024-06-17'::date,
    protection_start = '2025-08-19'::date,
    protection_end = '2030-06-16'::date,
    fiscal_year = 2568,
    creator_name = 'รศ.ดร.พิมพ์พรรณ ปรืองาม, รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    creator_personnel_id = 854,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '26189';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-045', 'ชุดอุปกรณ์ตรวจวัดความชื้นของเมล็ดพืช', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.พิมพ์พรรณ ปรืองาม, รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์',
    854, 'AE', '2403001791', '26189',
    '2024-06-17'::date, '2025-08-19'::date, '2030-06-16'::date, 0.0, 'ได้รับความคุ้มครอง',
    2568, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '26189'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '26189'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '26189'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.พิมพ์พรรณ ปรืองาม'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ศิว', 847, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '26189'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ศิว'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ักษณ์ ปฐวีรัตน์', 847, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '26189'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ักษณ์ ปฐวีรัตน์'
  );

-- [อนุสิทธิบัตร] 27126 - รถไถเดินตามสำหรับกำจัดวัชพืช
UPDATE intellectual_properties
SET 
    registration_number = '27126',
    application_number = '2503001568',
    filing_date = '2025-04-29'::date,
    protection_start = '2026-01-13'::date,
    protection_end = '2031-04-28'::date,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ประเทือง อุษาบริสุทธิ์, ผศ.ดร.วันรัฐ อับดุลลากาซิม,ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์, อ.ดร.ชัยยะ จันทรา, นายประเสริฐศักดิ์ ภักดีวงษ์, นางสาวปดิวรดา อนันตศิริ',
    creator_personnel_id = 849,
    department_code = 'AE',
    work_category = NULL,
    work_character = NULL,
    remarks = 'ระดับผลงาน: ชาติ',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'อนุสิทธิบัตร' AND registration_number = '27126';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-pet-046', 'รถไถเดินตามสำหรับกำจัดวัชพืช', 'อนุสิทธิบัตร', NULL, NULL, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์, ผศ.ดร.วันรัฐ อับดุลลากาซิม,ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์, อ.ดร.ชัยยะ จันทรา, นายประเสริฐศักดิ์ ภักดีวงษ์, นางสาวปดิวรดา อนันตศิริ',
    849, 'AE', '2503001568', '27126',
    '2025-04-29'::date, '2026-01-13'::date, '2031-04-28'::date, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ระดับผลงาน: ชาติ', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'อนุสิทธิบัตร' AND registration_number = '27126'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'AE'
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'AE'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปร', 849, true
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เทือง อุษาบริสุทธิ์', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เทือง อุษาบริสุทธิ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.วันรัฐ อับดุ', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.วันรัฐ อับดุ'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ากาซิม', 845, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ากาซิม'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', 857, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'อ.ดร.ชัยย', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'อ.ดร.ชัยย'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'จันทรา', 856, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'จันทรา'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นายปร', 849, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นายปร'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'เสริฐศักดิ์ ภักดีวงษ์', 1099, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'เสริฐศักดิ์ ภักดีวงษ์'
  );
INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'นางสาวปดิวรดา อนันตศิริ', NULL, false
FROM intellectual_properties ip
WHERE ip.type = 'อนุสิทธิบัตร' AND ip.registration_number = '27126'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'นางสาวปดิวรดา อนันตศิริ'
  );

-- [ลิขสิทธิ์] ว1.012355 - โปรแกรมจำลองการผสมอนุภาคในเครื่องผสมแบบถังหมุนโดยค
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012355',
    application_number = '462897',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012355';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-001', 'โปรแกรมจำลองการผสมอนุภาคในเครื่องผสมแบบถังหมุนโดยคำนึงถึงแรงยึดเหนี่ยวและการสึกหรอของอุปกรณ์', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462897', 'ว1.012355',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012355'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012355'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012355'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012366 - โปรแกรมจำลองการปล่อยวัสดุในไซโลเพื่อศึกษาลักษณะการ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012366',
    application_number = '462916',
    filing_date = '2025-10-21'::date,
    protection_start = '2025-11-26'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012366';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-002', 'โปรแกรมจำลองการปล่อยวัสดุในไซโลเพื่อศึกษาลักษณะการไหลของวัสดุด้วยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462916', 'ว1.012366',
    '2025-10-21'::date, '2025-11-26'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012366'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012366'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012366'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012367 - โปรแกรมจำลองการผสมวัสดุรูปร่างหลายทรงกลมในเครื่องผ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012367',
    application_number = '462917',
    filing_date = '2025-10-21'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012367';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-003', 'โปรแกรมจำลองการผสมวัสดุรูปร่างหลายทรงกลมในเครื่องผสมแบบ KitchenAid โดยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462917', 'ว1.012367',
    '2025-10-21'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012367'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012367'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012367'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012364 - โปรแกรมจำลองการวิเคราะห์อัตราการผสมในเครื่องผสมแบบ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012364',
    application_number = '462895',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012364';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-004', 'โปรแกรมจำลองการวิเคราะห์อัตราการผสมในเครื่องผสมแบบใบกวนด้วยวิธีองค์ประกอบไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462895', 'ว1.012364',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012364'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012364'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012364'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012363 - โปรแกรมจำลองการคัดแยกผลผลิตด้วยถังหมุนอัตโนมัติ โด
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012363',
    application_number = '462894',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012363';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-005', 'โปรแกรมจำลองการคัดแยกผลผลิตด้วยถังหมุนอัตโนมัติ โดยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462894', 'ว1.012363',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012363'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012363'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012363'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012365 - โปรแกรมจำลองการทำงานของเครื่องป้อนชิ้นส่วนแบบชามสั
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012365',
    application_number = '462896',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012365';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-006', 'โปรแกรมจำลองการทำงานของเครื่องป้อนชิ้นส่วนแบบชามสั่นด้วยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462896', 'ว1.012365',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012365'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012365'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012365'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012362 - โปรแกรมจำลองตะแกรงสั่นแบบเอียงสำหรับคัดแยกวัสดุโดย
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012362',
    application_number = '462893',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012362';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-007', 'โปรแกรมจำลองตะแกรงสั่นแบบเอียงสำหรับคัดแยกวัสดุโดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462893', 'ว1.012362',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012362'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012362'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012362'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012361 - โปรแกรมจำลองการป้อนวัสดุด้วยสกรูระยะก้าวแปรผัน (Va
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012361',
    application_number = '462892',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012361';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-008', 'โปรแกรมจำลองการป้อนวัสดุด้วยสกรูระยะก้าวแปรผัน (Variable Pitch Screw Feeder) โดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462892', 'ว1.012361',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012361'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012361'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012361'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012359 - โปรแกรมจำลองการทำงานของเครื่องโรตารี่ฟีดเดอร์สำหรั
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012359',
    application_number = '462890',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012359';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-009', 'โปรแกรมจำลองการทำงานของเครื่องโรตารี่ฟีดเดอร์สำหรับลำเลียงวัสดุเม็ดโดยวิธีการจำลองการเคลื่อนที่ของอนุภาคไม่ต่อเนื่อง', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462890', 'ว1.012359',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012359'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012359'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012359'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012360 - โปรแกรมจำลองการถ่ายเทความร้อนในเครื่องอบแห้งสุญญาก
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012360',
    application_number = '462891',
    filing_date = '2025-10-20'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012360';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-010', 'โปรแกรมจำลองการถ่ายเทความร้อนในเครื่องอบแห้งสุญญากาศแบบกรวยสกรูคู่โดยใช้วิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462891', 'ว1.012360',
    '2025-10-20'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012360'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012360'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012360'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012398 - โปรแกรมจำลองการทำงานของเครื่องผสมแบบริบบอนด้วยวิธี
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012398',
    application_number = '462524',
    filing_date = '2025-10-07'::date,
    protection_start = '2025-12-01'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012398';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-011', 'โปรแกรมจำลองการทำงานของเครื่องผสมแบบริบบอนด้วยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM) โดยใช้ LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462524', 'ว1.012398',
    '2025-10-07'::date, '2025-12-01'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012398'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012398'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012398'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012399 - โปรแกรมจำลองการคัดแยกเมล็ดข้าวหักออกจากข้าวเต็มเมล
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012399',
    application_number = '462525',
    filing_date = '2025-10-07'::date,
    protection_start = '2025-12-01'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012399';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-012', 'โปรแกรมจำลองการคัดแยกเมล็ดข้าวหักออกจากข้าวเต็มเมล็ดด้วยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462525', 'ว1.012399',
    '2025-10-07'::date, '2025-12-01'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012399'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012399'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012399'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012394 - โปรแกรมจำลองการทำงานของเครื่องผสมแบบแรงเฉือนสูงโดย
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012394',
    application_number = '462520',
    filing_date = '2025-10-07'::date,
    protection_start = '2025-12-01'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012394';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-013', 'โปรแกรมจำลองการทำงานของเครื่องผสมแบบแรงเฉือนสูงโดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462520', 'ว1.012394',
    '2025-10-07'::date, '2025-12-01'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012394'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012394'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012394'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012395 - โปรแกรมจำลองเครื่องหว่านปุ๋ยแบบจานเหวี่ยงชนิดสามใบ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012395',
    application_number = '462521',
    filing_date = '2025-10-07'::date,
    protection_start = '2025-12-01'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012395';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-015', 'โปรแกรมจำลองเครื่องหว่านปุ๋ยแบบจานเหวี่ยงชนิดสามใบ (Three-blade Disc Fertilizer Spreader) ด้วยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462521', 'ว1.012395',
    '2025-10-07'::date, '2025-12-01'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012395'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012395'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012395'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012396 - โปรแกรมจำลองการผสมวัสดุด้วยเครื่องผสมแบบกรวยสกรูเด
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012396',
    application_number = '462522',
    filing_date = '2025-10-07'::date,
    protection_start = '2025-12-01'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012396';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-016', 'โปรแกรมจำลองการผสมวัสดุด้วยเครื่องผสมแบบกรวยสกรูเดี่ยว (Nauta Mixer)โดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462522', 'ว1.012396',
    '2025-10-07'::date, '2025-12-01'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012396'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012396'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012396'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012356 - โปรแกรมคอมพิวเตอร์สำหรับการจำลองการผสมคอนกรีตด้วยเ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012356',
    application_number = '462158',
    filing_date = '2025-09-29'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012356';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-017', 'โปรแกรมคอมพิวเตอร์สำหรับการจำลองการผสมคอนกรีตด้วยเครื่องผสมแบบเพลาคู่โดยวิธีอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462158', 'ว1.012356',
    '2025-09-29'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012356'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012356'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012356'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012357 - โปรแกรมจำลองการทำงานของเครื่องผสมอาหาร (KitchenAid
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012357',
    application_number = '462159',
    filing_date = '2025-09-29'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012357';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-018', 'โปรแกรมจำลองการทำงานของเครื่องผสมอาหาร (KitchenAid) ด้วยการกระจายขนาดอนุภาคแบบปกติ โดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง (DEM)', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462159', 'ว1.012357',
    '2025-09-29'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012357'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012357'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012357'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.012358 - โปรแกรมจำลองการเคลื่อนที่ของวัสดุในโรตารี่ดรัมด้วย
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.012358',
    application_number = '462160',
    filing_date = '2025-09-29'::date,
    protection_start = '2025-11-27'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012358';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-019', 'โปรแกรมจำลองการเคลื่อนที่ของวัสดุในโรตารี่ดรัมด้วยวิธีอนุภาคไม่ต่อเนื่อง (DEM)บนแพลตฟอร์ม LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '462160', 'ว1.012358',
    '2025-09-29'::date, '2025-11-27'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.012358'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012358'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.012358'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000039 - โปรแกรมจำลองการขนถ่ายวัสดุด้วยสายพานลำเลียงเกลียวส
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000039',
    application_number = '461939',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000039';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-020', 'โปรแกรมจำลองการขนถ่ายวัสดุด้วยสายพานลำเลียงเกลียวสั่นแบบแนวตั้งโดยวิธีการจำลองอนุภาคไม่ต่อเนื่อง', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461939', 'ว1.000039',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000039'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000039'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000039'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000038 - โปรแกรมจำลองการลำเลียงวัสดุด้วย Apron Conveyorโดยใ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000038',
    application_number = '461938',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000038';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-021', 'โปรแกรมจำลองการลำเลียงวัสดุด้วย Apron Conveyorโดยใช้วิธีองค์ประกอบไม่ต่อเนื่อง (DEM) ผ่านโอเพนซอร์ส LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461938', 'ว1.000038',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000038'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000038'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000038'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000037 - โปรแกรมจำลองการทำงานของเครื่องผสมวัตถุดิบทรงลูกบาศ
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000037',
    application_number = '461937',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000037';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-022', 'โปรแกรมจำลองการทำงานของเครื่องผสมวัตถุดิบทรงลูกบาศก์ด้วยวิธีองค์ประกอบไม่ต่อเนื่อง (DEM) บนแพลตฟอร์มโอเพนซอร์ส LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461937', 'ว1.000037',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000037'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000037'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000037'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000036 - โปรแกรมจำลองการลำเลียงอนุภาคซูเปอร์ควอดริกบนสายพาน
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000036',
    application_number = '461936',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000036';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-023', 'โปรแกรมจำลองการลำเลียงอนุภาคซูเปอร์ควอดริกบนสายพานลูกกลิ้งโค้ง 180 องศาด้วยโอเพน ซอร์ส LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461936', 'ว1.000036',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000036'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000036'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000036'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000035 - โปรแกรมจำลองการทำงานของเครื่องผสมคอนกรีตแบบแพลเนตต
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000035',
    application_number = '461935',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000035';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-024', 'โปรแกรมจำลองการทำงานของเครื่องผสมคอนกรีตแบบแพลเนตตารีด้วยวิธีองค์ประกอบไม่ต่อเนื่อง (DEM) บนแพลตฟอร์มโอเพนซอร์ส LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461935', 'ว1.000035',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000035'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000035'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000035'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000034 - โปรแกรมจำลองการลำเลียงวัสดุเม็ดบนพื้นเอียงที่สั่นส
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000034',
    application_number = '461934',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000034';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-025', 'โปรแกรมจำลองการลำเลียงวัสดุเม็ดบนพื้นเอียงที่สั่นสะเทือนโดยใช้ซอฟต์แวร์ LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461934', 'ว1.000034',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000034'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000034'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000034'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );

-- [ลิขสิทธิ์] ว1.000033 - โปรแกรมจำลองการเคลื่อนที่ของระบบกระพ้อลำเลียงแบบสา
UPDATE intellectual_properties
SET 
    registration_number = 'ว1.000033',
    application_number = '461933',
    filing_date = '2025-09-23'::date,
    protection_start = '2026-01-21'::date,
    protection_end = NULL,
    fiscal_year = 2569,
    creator_name = 'รศ.ดร.ปรีดา ปรากฎมาก',
    creator_personnel_id = 951,
    department_code = 'ME',
    work_category = 'วรรณกรรม',
    work_character = 'โปรแกรมคอมพิวเตอร์',
    remarks = 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์',
    status = 'ได้รับความคุ้มครอง',
    owner = 'มหาวิทยาลัยเกษตรศาสตร์',
    right_holder = 'มหาวิทยาลัยเกษตรศาสตร์',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000033';

INSERT INTO intellectual_properties (
    legacy_id, title, type, work_category, work_character, creator_name,
    creator_personnel_id, department_code, application_number, registration_number,
    filing_date, protection_start, protection_end, support_amount, status,
    fiscal_year, remarks, owner, right_holder, created_at, updated_at
)
SELECT
    'ip-cpr-026', 'โปรแกรมจำลองการเคลื่อนที่ของระบบกระพ้อลำเลียงแบบสามมิติด้วยซอฟต์แวร์LIGGGHTS', 'ลิขสิทธิ์', 'วรรณกรรม', 'โปรแกรมคอมพิวเตอร์', 'รศ.ดร.ปรีดา ปรากฎมาก',
    951, 'ME', '461933', 'ว1.000033',
    '2025-09-23'::date, '2026-01-21'::date, NULL, 0.0, 'ได้รับความคุ้มครอง',
    2569, 'ลิขสิทธิ์ประเภทวรรณกรรม ลักษณะงาน โปรแกรมคอมพิวเตอร์', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยเกษตรศาสตร์',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM intellectual_properties 
    WHERE type = 'ลิขสิทธิ์' AND registration_number = 'ว1.000033'
);

-- Link department in ip_departments
INSERT INTO ip_departments (ip_id, department_code)
SELECT ip.id, 'ME'
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000033'
  AND NOT EXISTS (
      SELECT 1 FROM ip_departments d 
      WHERE d.ip_id = ip.id AND d.department_code = 'ME'
  );

INSERT INTO ip_inventors (ip_id, person_name, personnel_id, is_lead)
SELECT ip.id, 'รศ.ดร.ปรีดา ปรากฎมาก', 951, true
FROM intellectual_properties ip
WHERE ip.type = 'ลิขสิทธิ์' AND ip.registration_number = 'ว1.000033'
  AND NOT EXISTS (
      SELECT 1 FROM ip_inventors inv 
      WHERE inv.ip_id = ip.id AND inv.person_name = 'รศ.ดร.ปรีดา ปรากฎมาก'
  );


COMMIT;
