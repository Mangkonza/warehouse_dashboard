-- ==============================================================================
-- KU Engineering Research & Innovation Warehouse
-- Complete Fiscal Year 2569 (2026) Data Import Script
-- Generated automatically with strict constraint checks & data normalization
-- Target DB: ku_warehouse (PostgreSQL 18)
-- ==============================================================================

BEGIN;

-- 1. Insert faculty members if not already present
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'ศ.ดร.รังสินี โสธรวิทย์', 'ศ.ดร.', 'รังสินี', 'โสธรวิทย์', 'FE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'รังสินี' AND last_name = 'โสธรวิทย์');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 'ศ.ดร.', 'อนุพันธ์', 'เทอดวงศ์วรกุล', 'AE', 'อาจารย์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'อนุพันธ์' AND last_name = 'เทอดวงศ์วรกุล');
INSERT INTO personnel (name_th, title_th, first_name, last_name, department_code, position, created_at, updated_at)
SELECT 'นางสาวธันยพร โส๊ะอ้น', 'นางสาว', 'ธันยพร', 'โส๊ะอ้น', 'EEEC', 'บุคลากร', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM personnel WHERE first_name = 'ธันยพร' AND last_name = 'โส๊ะอ้น');


-- ----------------------------------------------------------------------------
-- Section 1: โครงการวิจัย ประจำเดือนมกราคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-01-01', NULL, 'ศึกษาวิจัยการวิเคราะห์จุดอ่อน เชิงระบบด้านความมั่นคงปลอดภัยไชเบอร์ของภาครัฐและกรอบแนวทางการยกระดับขีดความสามารถ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'กำลังดำเนินการ', 0.0, 14000000.0, 'สำนักงานการวิจัย แห่งชาติ(วช.)', 'ภายนอก', 'ไม่มี', 'applied',
    '2025-11-01'::date, '2026-11-01'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-01-02', NULL, 'การพัฒนาสมบัติทางกลและความทนทานของมอร์ต้าร์ที่รักษาการเสื่อมสภาพด้วยตัวเองโดยการใช้สารสร้างผลึกชนิดต่างๆ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'กำลังดำเนินการ', 0.0, 600000.0, 'สำนักงานการวิจัย แห่งชาติ(วช.)', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-03-01'::date, '2028-03-01'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 2: โครงการพัฒนาวิชาการ ประจำเดือนมกราคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-01', 'โครงการพัฒนาแนวทางการประเมินประสิทธิผลและความคุ้มค่าของงานอำนวยความปลอดภัยทางหลวง 1 โครงการ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'กรมทางหลวง', 19600023.0,
    2940003.4499999997, 980001.1499999999, 980001.1499999999, 980001.1499999999, 13720016.1,
    4, 0, NULL, NULL,
    NULL, '2025-11-12'::date, '2027-06-30'::date, NULL, NULL,
    '00340/69', NULL, 'กำลังดำเนินการ', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-02', 'ค่าใช้จ่ายในการประเมิน วางแผน จัดทำนโยบายธรรมาภิบาลข้อมูล (Data Governance) กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'กรมทรัพยากรน้ำ', 21864368.0,
    3279655.1999999997, 1093218.4, 1093218.4, 1093218.4, 15305057.6,
    0, 9, NULL, NULL,
    NULL, '2026-01-19'::date, '2027-12-30'::date, NULL, NULL,
    '00341/69', NULL, 'กำลังดำเนินการ', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-03', 'โครงการสนับสนุนการขับเคลื่อนภาคอุตสาหกรรมเพื่อการเติบโตที่ส่งผลต่อระบบเศรษฐกิจของประเทศ (กิจกรรมส่งเสริมการลงทุนเพื่อการขยายตัวภาคอุตสาหกรรมแห่งอนาคตและเศรษฐกิจหมุนเวียน)', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE', 'กรมโรงงานอุตสาหกรรม', 8499528.0,
    1274929.2, 424976.39999999997, 424976.39999999997, 424976.39999999997, 5949669.6,
    12, 3, NULL, NULL,
    NULL, '2025-12-25'::date, '2026-12-30'::date, NULL, NULL,
    '00361/69', NULL, 'กำลังดำเนินการ', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-04', 'จ้างติดตั้งและจัดทำระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ พื้นที่ฝั่งขวาแม่น้ำยม สำหรับงานเพิ่มประสิทธิภาพการบริหารจัดการน้ำฝั่งขวาแม่น้ำยมในเขตอำเภอบางระกำ จังหวัดพิษณุโลก ด้วยระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 3 กรมชลประทาน', 15043000.0,
    825000.0, 275000.0, 275000.0, 275000.0, 13393000.0,
    8, 3, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-02-01'::date, '2028-02-20'::date, '2026-11-02'::date, '2027-03-31'::date,
    '00378/69', '9543000', 'ค่าครุภัณฑ์', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-05', 'โครงการบริการวิเคราะห์เเก๊สเรือนกระจกด้วยเครื่อง Gas chromatography พ.ศ. 2569', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'นิสิตในภาควิชาวิศวกรรมชลประทาน (เฉพาะบัณฑิตศึกษา) -  อาจารย์และนักวิจัยในภาควิชาวิศวกรรมชลประทาน -  บุคลากรภายใน-ภายนอก มหาวิทยาลัยเกษตรศาสตร์ - หน่วยงานภาคเอกชน บริษัท ห้างร้าน และบุคคลทั่วไป', 900000.0,
    135000.0, 45000.0, 45000.0, 45000.0, 630000.0,
    10, 0, '02207591 เทคนิคการวิจัยทางวิศวกรรมชลประทาน', NULL,
    NULL, '2026-01-13'::date, '2026-12-31'::date, '2026-02-01'::date, '2026-12-30'::date,
    '00394/69', NULL, 'กำลังดำเนินการ', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-01-06', 'ค่าใช้จ่ายในการจัดทำกลยุทธ์การกำหนดนโยบายและความร่วมมือด้านพลังงานของประเทศเพื่อรองรับการเปลี่ยนแปลงในระยะยาว', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'สำนักงานนโยบายและแผนพลังงาน', 1360000.0,
    204000.0, 68000.0, 68000.0, 68000.0, 952000.0,
    5, 0, NULL, NULL,
    NULL, '2025-10-10'::date, '2026-10-31'::date, NULL, NULL,
    '00401/69', NULL, 'กำลังดำเนินการ', 'มกราคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 3: ผลงานบริการวิชาการ ประจำเดือนมกราคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-01', 'การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตรของประเทศ', 'วิชาการ', 'สถาบันไทย-เยอรมัน', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'AE', 3.0, 30, '2026-01-19'::date, '2026-01-19'::date, '2026-01-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-02', 'การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตร ของประเทศ', 'วิชาการ', 'สถาบันไทย-เยอรมัน', 'ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', 857,
    'AE', 3.0, 30, '2026-01-20'::date, '2026-01-20'::date, '2026-01-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-03', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Journal of Food  Composition and Analysis', 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1),
    'AE', 3.0, 30, '2026-01-14'::date, '2026-01-14'::date, '2026-01-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-04', 'ประชุมคณะอนุกรรมการวิชาการ กรรมการลุ่มน้ำท่าจีน  ครั้งที่ 1/2569 online', 'ผู้ทรงคุณวุฒิ', 'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2   (คณะกรรมการลุ่มน้ำท่าจีน)', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-05'::date, '2026-01-05'::date, '2026-01-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-05', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-06'::date, '2026-01-06'::date, '2026-01-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-06', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Sustainable Production and Consumption', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-08'::date, '2026-01-08'::date, '2026-01-08'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-07', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-08'::date, '2026-01-08'::date, '2026-01-08'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-08', 'กรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ปีการศึกษา 2567', 'ผู้ทรงคุณวุฒิ', 'หน่วยงานภายนอก/ประชาชนทั่วไป', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872,
    'IRE', 3.0, 30, '2026-01-16'::date, '2026-01-16'::date, '2026-01-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-09', 'ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา  ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำเจ้าพระยา (ประชุมออนไลน์)', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-01-12'::date, '2026-01-12'::date, '2026-01-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-10', 'ประชุมรับฟังความคิดเห็นต่อรายงานผลดำเนินการศึกษาและวางแนวทางการแก้ปัญหาอุทกภัยหาดใหญ่อย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'พื้นที่อำเภอหาดใหญ่ จ.สงขลา ในคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-01-12'::date, '2026-01-12'::date, '2026-01-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-11', 'วิทยากรบรรยาย "แนวทางการจัดสรรน้ำและการใช้น้ำ และการจัดลำดับความสำคัญของการใช้น้ำ ประกอบการพิจารณาอนุญาตการใช้น้ำในภาวะน้ำแล้ง/น้ำท่วม ในมุมมองของผู้แทนคณะ กรรมการลุ่มน้ำ"', 'วิทยากร/อาจารย์พิเศษ', 'กรมทรัพยากรน้ำ ณ โรงแรมเวสต์เกตเรสซิเดนซ์ อำเภอบางใหญ่ จ.นนทบุรี', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-01-13'::date, '2026-01-13'::date, '2026-01-13'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-12', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำเจ้าพระยา ณ ศาลากลางจังหวัดนครสวรรค์', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-01-12'::date, '2026-01-12'::date, '2026-01-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-13', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-19'::date, '2026-01-19'::date, '2026-01-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-14', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร CLEAN -  Soil, Air, Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-19'::date, '2026-01-19'::date, '2026-01-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-15', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Bioresource Technology Reports', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-23'::date, '2026-01-23'::date, '2026-01-23'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-16', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-01-24'::date, '2026-01-24'::date, '2026-01-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-17', 'ประชุมหารือแลกเปลี่ยนและรับฟังข้อเสนอแนะโครงการก่อสร้างระบบป้องกันน้ำท่วมพื้นที่ชุมชนเมืองสมุทรสงคราม', 'วิชาการ', 'สำนักงานโยธาธิการและผังเมือง ศาลากลางจังหวัดสมุทรสงคราม', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-01-26'::date, '2026-01-26'::date, '2026-01-26'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-18', 'เป็นผู้เชี่ยวชาญ "จัดทำร่างประกาศเชิญชวน ร่างเอกสารสำหรับคัดเลือกเอกชน  ร่างเอกสารสัญญาร่วมลงทุน"', 'วิชาการ', 'เมืองพัทยา จังหวัดชลบุรี', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-01-01'::date, '2026-01-01'::date, '2026-01-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-19', 'เป็นอนุกรรมการในสมาคมวิศวกรรมสถานแห่ง ประเทศไทย ในพระราชูปถัมภ์', 'ผู้ทรงคุณวุฒิ', 'สมาคมวิศวกรรมสถานแห่งประเทศไทย', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-01-01'::date, '2026-01-01'::date, '2026-01-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-20', 'เป็นอนุกรรมการในสมาคมวิศวกรรมสถานแห่ง ประเทศไทย ในพระราชูปถัมภ์', 'ผู้ทรงคุณวุฒิ', 'สมาคมวิศวกรรมสถานแห่งประเทศไทย', 'ดร.ปาณิศา แสงแก้ว', 930,
    'CE', 3.0, 30, '2026-01-01'::date, '2026-01-01'::date, '2026-01-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-21', 'เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินใหม่ห้องปฏิบัติการทดสอบ', 'ผู้ทรงคุณวุฒิ', 'บริษัท ซีพีเอฟ  (ประเทศไทย)  จำกัด มหาชน โรงงานผลิตอาหารสัตว์ กม.21   จ.สมุทรปราการ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-01-15'::date, '2026-01-15'::date, '2026-01-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-22', 'เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินความสามารถและประสบการณ์เหมาะสม', 'ผู้ทรงคุณวุฒิ', 'บริษัท ซีพีเอฟ  (ประเทศไทย) จำกัด มหาชน โรงงานผลิตอาหารสัตว์น้ำ จ.สมุทรสาคร', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-01-20'::date, '2026-01-20'::date, '2026-01-21'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-23', 'แต่งตั้งคณะอนุกรรมการวิศวกรรมวัสดุคอนกรีต  การซ่อมแซม และการบำรุงรักษาเพื่อความยั่งยืนในคณะกรรมการสาขาวิศวกรรมโยธา ประจำปี 2569', 'ผู้ทรงคุณวุฒิ', 'สมาคมวิศวกรรมสถานแห่งประเทศไทย ที่024/2569', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-01-01'::date, '2026-01-01'::date, '2026-01-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-24', 'แต่งตั้งคณะอนุกรรมการวิศวกรรมวัสดุคอนกรีต การซ่อมแซม และการบำรุงรักษาเพื่อความยั่งยืนในคณะกรรมการสาขาวิศวกรรมโยธา ประจำปี 2569', 'ผู้ทรงคุณวุฒิ', 'สมาคมวิศวกรรมสถานแห่งประเทศไทย ที่024/2569', 'ดร.ปาณิศา แสงแก้ว', 930,
    'CE', 3.0, 30, '2026-01-01'::date, '2026-01-01'::date, '2026-01-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-25', 'เป็นกรรมการสอบ วิทยานิพนธ์ของนักศึกษา', 'วิทยานิพนธ์ภายนอก', 'โครงการบัณฑิตศึกษา  สาขาวิชาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 8, '2026-01-29'::date, '2026-01-29'::date, '2026-01-29'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-26', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Iranian Journal  of Science and  Technology, Transactions of Civil Engineering', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-01-29'::date, '2026-01-29'::date, '2026-01-29'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-27', 'แต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์และคณะกรรมการสอบวิทยานิพนธ์ ที่ 21/2569', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-01-26'::date, '2026-01-26'::date, '2026-01-26'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-28', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-01-20'::date, '2026-01-20'::date, '2026-01-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-29', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-01-25'::date, '2026-01-25'::date, '2026-01-25'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-30', 'เป็นอาจารย์พิเศษ  บรรยายในหัวข้อ "Quality Management and Control"', 'วิทยากร/อาจารย์พิเศษ', 'คณะวิทยาการจัดการ มหาวิทยาลัยสงขลานครินทร์', 'ผศ.ดร.จิรเกียรติ  ทรายทอง', 966,
    'IE', 4.0, 30, '2026-01-17'::date, '2026-01-17'::date, '2026-01-18'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-31', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการ  OR-NET 2026', 'ผศ.ดร.อธิวัฒน์  บุญมี', 963,
    'IE', 3.0, 30, '2026-01-12'::date, '2026-01-12'::date, '2026-01-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-32', 'วิทยากรค่ายพัฒนาทักษะทางวิชาการ ในหัวข้อ กิจกรรมศาสตร์ของวัสดุและการประคอง', 'วิทยากร/อาจารย์พิเศษ', 'คณะศิลปศาสตร์และวิทยาศาสตร์ มก กพส', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968,
    'IE', 3.0, 30, '2026-01-31'::date, '2026-01-31'::date, '2026-01-31'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-33', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการระดับชาติ OR-NET2026', 'รศ.ดร.ศศรส  ใจจิตร์', 971,
    'IE', 3.0, 30, '2026-01-22'::date, '2026-01-22'::date, '2026-01-22'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-34', 'การบริหารจัดการวัสดุเหลือใช้ทางการเกษตร "การใช้ประโยชน์ฟางข้าวและแกลบ"', 'วิทยากร/อาจารย์พิเศษ', 'กรมการข้าว', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843,
    'EEEC', 3.0, 100, '2026-01-27'::date, '2026-01-27'::date, '2026-01-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-35', 'บริษัท มินริน จำกัด เข้าศึกษาดูงานเครื่องอัดภาชนะใบไม้', 'ศึกษาดูงาน วศ.กพส.', 'บริษัท มินริน จำกัด', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายรัตนศักดิ์ ทรัพย์เย็น นางสาวธันยพร โส๊ะอ้น นายสมเกียรติ อิ่มจันทร์ นางสาวอทิตยา แผ้วไพบูลย์', (SELECT id FROM personnel WHERE first_name = 'ธันยพร' LIMIT 1),
    'EEEC', 3.0, 2, '2026-01-07'::date, '2026-01-07'::date, '2026-01-07'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-36', 'มหาวิทยาลัยสงขลานครินทร์ เข้าศึกษาดูงานและหารือด้านก๊าซชีวภาพ', 'ศึกษาดูงาน วศ.กพส.', 'อาจารย์ประจำสาขาวิชาวิศวกรรมเคมี', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง', 843,
    'EEEC', 3.0, 2, '2026-01-19'::date, '2026-01-19'::date, '2026-01-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-37', 'วิทยากรการบรรยายในการสัมมนาเชิงปฏิบัติการด้านการพัฒนาผลิตภัณฑ์จากวัสดุเหลือใช้จากกระบวนการผลิตข้าว  จ.อยุธยา', 'วิทยากร/อาจารย์พิเศษ', 'เกษตรกร แล้วเจ้าหน้าที่กรมการข้าว/เจ้าหน้าที่โครงการ', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง', 843,
    'EEEC', 3.0, 100, '2026-01-27'::date, '2026-01-27'::date, '2026-01-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-38', 'Review ต้นฉบับบทความวิจัยวารสารระดับนานาชาติ Computers and Electronics In Agriculture 1 เรื่อง', 'วิชาการ', 'วารสาร Computers and Electronics in Agriculture', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'AE', 3.0, 30, '2026-01-20'::date, '2026-01-20'::date, '2026-01-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-39', 'แต่งตั้งผู้ทรงคุณวุฒิพิจารณาบทความวิจัยเพื่อตีพิมพ์ลงวารสารวิชาการ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (ฉบับที่ 349)', 'วิชาการ', 'ภาครัฐและเอกชน', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-01-23'::date, '2026-01-23'::date, '2026-01-23'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-01-40', 'แต่งตั้งที่ปรึกษาภายใน ด้านการพัฒนาคุณภาพการศึกษาสู่ความเป็นเลิศ มหาวิทยาลัยเกษตรศาสตร์', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-01-28'::date, '2026-01-28'::date, '2026-01-28'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 4: สิ่งตีพิมพ์ ประจำเดือนมกราคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-01', 'Mechanical, fatigue, and microstructural properties of rubber wood fly ash-based alkali-activated concrete', 'ตีพิมพ์', 'นานาชาติ', 3333.0,
    'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 'Case Studies in Construction Materials', '2025',
    '23', 'e05539', 'e05539', 'Q1',
    NULL, 'Tavorn Kuasakul, Wisitsak Tabyang, Suraparb Keawsawasvong, Chanachai Thongchom, Cherdsak Suksiripattanapong', false, true, true,
    2569, 'มกราคม', 'มกราคม 2569', 'Q1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-02', 'Physiological indicators drive climate-smart and sustainable AWD irrigation in rice systems', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'Scientific Reports', '15',
    '39660', '1', '13', 'Q1',
    NULL, 'Bittawat Wichaidist, Amornrat Intrman, Pavit Jumhom, Songsak Puttrawutichai, Chawakorn Rewtragulpaibul', false, true, true,
    2569, 'มกราคม', 'มกราคม 2569', 'Q1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-03', 'The Study of the impact of water channel obstructions in the lower Mun River on flooding', 'ตีพิมพ์', 'ชาติ', 5000.0,
    'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'Journal of Applied Research on Science and Technology (JARST)', '24',
    '3', '1', '12', NULL,
    NULL, 'นางสาวสุภาพร ทองเต็ม,  นายวัชระ องค์โชติยะกุล', false, true, false,
    2569, 'มกราคม', 'มกราคม 2569', 'TCI1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-04', 'Performance comparison between gradient orifice and uniform   orifice distributors in rotating fluidization for coated jasmine rice', 'เตรียมความพร้อมตีพิมพ์', 'นานาชาติ', 800.0,
    'รศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 'Journal of Food Engineering', '2026',
    '408', '112898', '112898', NULL,
    'Dr.Andrew Warew', NULL, true, false, true,
    2569, 'มกราคม', 'มกราคม 2569', 'ค่าตรวจสอบผู้เชี่ยวชาญให้บริการปรึกษาวิจัย', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-05', 'Determining the Optimal Order Quantity for Perishable Products Affected by Stochastic Transportation Delays', 'เตรียมความพร้อมตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE', 'เตรียมความพร้อมตีพิมพ์', '2025',
    '1', '1', '21', 'Q2',
    NULL, 'Banthita Kanchanasathita, Atchara Wangpa, Apisit Pitakcheun', false, true, true,
    2569, 'มกราคม', 'มกราคม 2569', 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-06', 'การออกแบบและพัฒนาเครื่องกำจัดวัชพืชแบบไม่ใช้สารเคมีต่อท้ายรถแทรกเตอร์', 'ตีพิมพ์', 'ชาติ', 5000.0,
    'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 'วารสารวิชาการเกษตร', '43',
    '3', '241', '251', NULL,
    NULL, 'พงศ์พันธุ์ ปั้นนมยุรา อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', false, true, false,
    2569, 'มกราคม', 'มกราคม 2569', 'TCI1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-07', 'A low-cost sensor-based roller weeder to support non-chemical weed control in smallholder rice systems', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 'Journal of the Saudi Society of Agricultural Sciences', '24',
    '1', '1', '12', 'Q1',
    NULL, 'นางสาวปดิวรดา อนันตศิริ ผศ.ดร.วันรัฐ อับดุลลากาซิม อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์ อ.ดร.ชัยยะ จันทรา นายประเสริฐศักดิ์ ภักดีวงศ์', false, true, false,
    2569, 'มกราคม', 'มกราคม 2569', 'Q1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-08', 'การปรับปรุงประสิทธิภาพแถวคอยยานพาหนะและการลำเลียงสินค้าผ่านการจำลองสถานการณ์ : กรณีศึกษา (Improving the Efficiency of Vehicle Queuing and Product Conveyance through Simulation : A Case Study)', 'ตีพิมพ์', 'ชาติ', 5000.0,
    'ผศ.ดร.อณจ ชัยมณี', 969, 'IE', 'Journal of Engineering and Digital Technology (JEDT)', '13',
    '2', '39', '54', NULL,
    NULL, 'สุรีพร ยืนยงค อิทธณณัฏฐ ปลูกฝง  บูรณสิวรรธ ขำทัพ', false, true, false,
    2569, 'มกราคม', 'มกราคม 2569', 'TCI1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-01-09', 'Performance comparison between gradient orifice and uniform orifice distributors in rotating fluidization for coated jasmine rice', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 'Journal of Food Engineering', '2026',
    '408', '112898', '112898', 'Q1',
    NULL, 'ผศ.ดร.วัชมา พธิ์ทอง รศ.ดร.ชียวัฒน์ รัตนมีชัย รศ.ดร.นิตยา จันกา', false, true, false,
    2569, 'มกราคม', 'มกราคม 2569', 'Q1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 5: ทรัพย์สินทางปัญญา ประจำเดือนมกราคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, remarks, created_at, updated_at
) VALUES (
    'ip-2569-01-01', 'ชุดอุปกรณ์ตรวจวัดความชื้นของเมล็ดพืช', 'อนุสิทธิบัตร', 'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, 'AE',
    '2403001791', '26189', '2024-06-17'::date, '2025-08-19'::date, '2030-06-16'::date,
    10000.0, 2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    support_amount = EXCLUDED.support_amount,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 6: โครงการพัฒนาวิชาการ ประจำเดือนกุมภาพันธ์ 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-01', 'ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ประจำปี 2569', 'ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 852, 'OTH', 'หน่วยงานภาครัฐ/หน่วยงานภาคเอกชน', 1000000.0,
    150000.0, 50000.0, 50000.0, 50000.0, 700000.0,
    2, 0, NULL, NULL,
    NULL, '2026-01-22'::date, '2027-01-30'::date, NULL, NULL,
    '00420/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-02', 'โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 2990000.0,
    448500.0, 149500.0, 149500.0, 149500.0, 2093000.0,
    6, 1, '02207311 Engineering Hydrology', NULL,
    NULL, '2025-11-24'::date, '2026-10-09'::date, '2025-10-01'::date, '2026-12-31'::date,
    '00423/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-03', 'โครงการจัดทำแผนปรับปรุงและบำรุงรักษาอาคารและระบบชลประทาน ส่วนปรับปรุงบำรุงรักษา แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 4990000.0,
    748500.0, 249500.0, 249500.0, 249500.0, 3493000.0,
    9, 1, '02207111 หลักวิศวกรรมชลประทาน', NULL,
    NULL, '2026-01-28'::date, '2027-02-26'::date, '2026-01-28'::date, '2026-04-03'::date,
    '00429/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-04', 'จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 1 ตำบลชุมแพ อำเภอชุมแพ จังหวัดขอนแก่น', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 6  กรมชลประทาน', 24870300.0,
    900000.0, 300000.0, 300000.0, 300000.0, 23070300.0,
    8, 3, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-02-02'::date, '2029-07-31'::date, '2026-11-30'::date, '2027-03-31'::date,
    '00430/69', '18870300', 'ค่าครุภัณฑ์', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-05', 'จ้างจัดทำและติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำ สำหรับงานโครงการติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำในโครงการส่งน้ำและบำรุงรักษาหนองหวาย (แม่น้ำชี) ตำบลน้ำพอง อำเภอน้ำพอง จังหวัดขอนแก่น', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 6  กรมชลประทาน', 24900000.0,
    900000.0, 300000.0, 300000.0, 300000.0, 23100000.0,
    8, 3, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-02-02'::date, '2029-07-31'::date, '2026-11-23'::date, '2027-03-31'::date,
    '00431/69', '18900000', 'ค่าครุภัณฑ์', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-06', 'จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 2 ตำบลบ้านยาง อำเภอเกษตรสมบูรณ์ จังหวัดชัยภูมิ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 6  กรมชลประทาน', 24461600.0,
    900000.0, 300000.0, 300000.0, 300000.0, 22661600.0,
    8, 3, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-02-02'::date, '2029-07-31'::date, '2026-11-30'::date, '2027-03-31'::date,
    '00432/69', '18461600', 'ค่าครุภัณฑ์', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-07', 'จ้างจัดทำโครงการพัฒนาระบบปัญญาประดิษฐ์ในการช่วยสนับสนุนการตัดสินใจในการบริหารจัดการน้ำของอ่างเก็บน้ำคลองกะทะ ตำบลฉลอง อำเภอเมืองภูเก็ต จังหวัดภูเก็ต', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'โครงการชลประทานภูเก็ต สำนักงานชลประทานที่ 15 กรมชลประทาน', 15637800.0,
    557700.0, 185900.0, 185900.0, 185900.0, 14522400.0,
    9, 4, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-02-16'::date, '2028-10-31'::date, '2027-11-22'::date, '2028-03-31'::date,
    '00456/69', '11919800', 'ค่าครุภัณฑ์', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-08', 'ค่าใช้จ่ายในการศึกษาและจัดทำหลักเกณฑ์ มาตรฐานเครื่องวัดน้ำหรือประเมินปริมาณน้ำที่ใช้เพื่อเพิ่มประสิทธิภาพการควบคุมการใช้ทรัพยากรน้ำสาธารณะที่มิใช่น้ำจากทางน้ำชลประทาน กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมทรัพยากรน้ำ', 4847000.0,
    727050.0, 242350.0, 242350.0, 242350.0, 3392900.0,
    11, 4, '02207311 Engineering Hydrology', NULL,
    NULL, '2026-02-03'::date, '2026-12-30'::date, '2026-02-03'::date, '2027-02-26'::date,
    '00457/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-09', 'โครงการวิเคราะห์และจัดทำชุดความรู้การบริหารจัดการทรัพยากรน้ำชุมชน', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE', 'สำนักงาน ทรัพยากรน้ำแห่งชาติ', 2595440.0,
    389316.0, 129772.0, 129772.0, 129772.0, 1816808.0,
    8, 2, NULL, NULL,
    NULL, '2026-03-01'::date, '2026-12-31'::date, NULL, NULL,
    '00472/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-10', 'โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 2999000.0,
    449850.0, 149950.0, 149950.0, 149950.0, 2099300.0,
    7, 2, '02207311 Engineering Hydrology', NULL,
    NULL, '2026-02-05'::date, '2027-02-01'::date, '2026-02-06'::date, '2027-02-01'::date,
    '00473/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-02-11', 'จ้างที่ปรึกษาทบทวนแบบก่อสร้างศูนย์บริหารจัดการคุณภาพน้ำ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'องค์การจัดการน้ำเสีย', 335000.0,
    50250.0, 16750.0, 16750.0, 16750.0, 234500.0,
    4, 1, '0203481 วิศวกรรมสุขาภิบาลและการประปา', NULL,
    NULL, '2026-01-19'::date, '2026-12-30'::date, '2026-01-19'::date, '2026-12-30'::date,
    '00474/69', NULL, 'กำลังดำเนินการ', 'กุมภาพันธ์', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 7: ผลงานบริการวิชาการ ประจำเดือนกุมภาพันธ์ 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-01', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศระดับคณะ และวิทยาเขต มหาวิทยาลัยเกษตรศาสตร์ ประจำปีการศึกษา 2567', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-06'::date, '2026-02-06'::date, '2026-02-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-02', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศระดับคณะ และวิทยาเขต มหาวิทยาลัยเกษตรศาสตร์ ประจำปีการศึกษา 2567', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-24'::date, '2026-02-24'::date, '2026-02-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-03', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-02'::date, '2026-02-02'::date, '2026-02-02'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-04', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-04'::date, '2026-02-04'::date, '2026-02-04'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-05', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-05'::date, '2026-02-05'::date, '2026-02-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-06', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-03'::date, '2026-02-03'::date, '2026-02-03'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-07', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-02-07'::date, '2026-02-07'::date, '2026-02-07'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-08', 'วิทยากรบรรยายในหัวข้อ "นโยบายการบริหารจัดการคุณภาพน้ำในภาพรวมระดับประเทศ"', 'วิทยากร/อาจารย์พิเศษ', 'องค์การจัดการน้ำเสีย', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-02-26'::date, '2026-02-26'::date, '2026-02-26'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-09', 'ผู้ดำเนินรายการ เสวนาวิชาการ เรื่อง "ประสบการณ์น้ำท่วมเชียงใหม่-หาดใหญ่ เราเรียนรู้อะไร ควรเตรียมการและปรับตัวอย่างไร', 'วิชาชีพ', 'สมาคมนักอุทกวิทยาไทย  อ.ปากเกร็ด จ.นนทบุรี', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-02-20'::date, '2026-02-20'::date, '2026-02-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-10', 'วิทยากรบรรยายในหัวข้อ "ความรู้พื้นฐานเรื่องน้ำเสียระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบ บำบัดน้ำเสีย"', 'วิทยากร/อาจารย์พิเศษ', 'องค์การจัดการน้ำเสีย', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881,
    'IRE', 3.0, 30, '2026-02-25'::date, '2026-02-25'::date, '2026-02-25'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-11', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Energy Nexus', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-25'::date, '2026-02-25'::date, '2026-02-25'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-12', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Journal of hydrology', 'ผศ.ดร.เกศวรา สิทธิโชค', 884,
    'IRE', 3.0, 30, '2026-02-02'::date, '2026-02-02'::date, '2026-02-02'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-13', 'ประชุมกรรมการลุ่มน้ำท่าจีนครั้งที่ 1/69', 'ผู้ทรงคุณวุฒิ', 'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  (คณะกรรมการลุ่มน้ำท่าจีน)', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-04'::date, '2026-02-04'::date, '2026-02-04'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-14', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-05'::date, '2026-02-05'::date, '2026-02-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-15', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-06'::date, '2026-02-06'::date, '2026-02-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-16', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-06'::date, '2026-02-06'::date, '2026-02-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-17', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-09'::date, '2026-02-09'::date, '2026-02-09'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-18', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-02-12'::date, '2026-02-12'::date, '2026-02-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-19', 'วิทยากรค่ายพัฒนาทักษะทางวิชาการ ในหัวข้อ กิจกรรมศาสตร์ของวัสดุและการประคอง', 'วิทยากร/อาจารย์พิเศษ', 'คณะศิลปศาสตร์และวิทยาศาสตร์ มก กพส', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968,
    'IE', 3.0, 30, '2026-02-01'::date, '2026-02-01'::date, '2026-02-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-20', 'Review ต้นฉบับบทความวิจัยวารสารระดับนานาชาติ Computers and Electronics In Agriculture 1 เรื่อง', 'วิชาการ', 'วารสาร Computers and Electronics in Agriculture', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'FE', 3.0, 30, '2026-02-04'::date, '2026-02-04'::date, '2026-02-04'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-21', 'เป็นอาจารย์พิเศษบรรยาย "การตรวจสอบคุณภาพผลผลิตทางการเกษตรแบบไม่ทำลาย"', 'ผู้ทรงคุณวุฒิ', 'คณะเกษตรศาสตร์ ทรัพยากรธรรมชาติและสิ่งแวดล้อม ม.นเรศวร', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-02-19'::date, '2026-02-19'::date, '2026-02-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-22', 'เป็นผู้ให้การอบรมเกษตรกรสาธิตระบบให้น้ำและปุ๋ยอย่างแม่นยำ', 'ผู้ทรงคุณวุฒิ', 'กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก จ.ขอนแก่น และกลุ่มสตรีสหกรณ์การเกษตรไม้ผลบ้านโหล่น จ.ชัยภูมิ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-02-28'::date, '2026-02-28'::date, '2026-02-28'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-23', 'คณะกรรมการอำนวยการ ทสม. ระดับจังหวัด  จังหวัดนครปฐม', 'ผู้ทรงคุณวุฒิ', 'สำนักงานจังหวัดนครปฐม', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843,
    'EEEC', 3.0, 30, '2026-02-09'::date, '2026-02-09'::date, '2026-02-09'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-24', 'วิทยากรค่ายพัฒนาทักษะทางวิชาการ ในหัวข้อ กิจกรรมศาสตร์ของวัสดุและการประคอง', 'วิทยากร/อาจารย์พิเศษ', 'คณะศิลปศาสตร์และวิทยาศาสตร์ มก กพส', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968,
    'IE', 3.0, 30, '2026-02-01'::date, '2026-02-01'::date, '2026-02-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-25', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการระดับชาติ OR-NET2026', 'รศ.ดร.ศศรส  ใจจิตร์', 971,
    'IE', 3.0, 30, '2026-02-05'::date, '2026-02-05'::date, '2026-02-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-26', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการระดับชาติ OR-NET2027', 'ผศ.ดร.อณจ ชัยมณี', 969,
    'IE', 3.0, 30, '2026-02-05'::date, '2026-02-05'::date, '2026-02-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-27', 'เป็นคณะกรรมการอำนวยการและคณะกรรมการวิชาการของสมาคมคอนกรีตประจำปี  พ.ศ.2569-2570', 'วิชาการ', 'สาธารณะชนและประเทศชาติ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-02-03'::date, '2026-02-03'::date, '2026-02-03'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-28', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Iranian Journal of Science and Technology, Transactions of Civil Engineering', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-02-11'::date, '2026-02-11'::date, '2026-02-11'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-29', 'แต่งตั้งคณะกรรมการยุววิศวกร ประจำปี 2569-2571', 'ผู้ทรงคุณวุฒิ', 'สมาคมวิศวกรรมสถาน แห่งประเทศไทย  ในพระราชูปถัมภ์', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-02-09'::date, '2026-02-09'::date, '2026-02-09'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-30', 'วิทยากรบรรยายในหัวข้อ "โครงการก่อสร้างอาคารนวัตกรรมการเรียนรู้ทางวิศวกรรมศาสตร์"', 'วิทยากร/อาจารย์พิเศษ', 'นักศึกษาและอาจารย์ โครงการฝึกอบรมทางวิชาชีพและศึกษาดูงานสถานประกอบการ', 'นายณัฐพล เสรีเผ่าวงษ์', 867,
    'OFS', 3.0, 30, '2026-02-19'::date, '2026-02-19'::date, '2026-02-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-31', 'จัดแสดงนิทรรศการผลงานวิจัยนวัตกรรมในงานเกษตรแฟร์ ประจำปี 2569', 'วิชาการ', 'ประชาชนทั่วไป', 'นายภัทรพล ชูราศรี นายรัตนศักดิ์ ทรัพย์เย็น นางสาวธันยพร โส๊ะอ้น', (SELECT id FROM personnel WHERE first_name = 'ธันยพร' LIMIT 1),
    'EEEC', 3.0, 150, '2026-02-07'::date, '2026-02-07'::date, '2026-02-07'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-32', 'นักศึกษาปีที่ 1  คณะศิลปศาสตร์และวิทยาศาสตร์ เข้าศึกษาดูงาน', 'ศึกษาดูงาน วศ.กพส.', 'นักศึกษาปีที่ 1', 'นางเนตรนภา วิชานงค์ นายภัทรพล ชูราศรี นางสาวอทิตยา แผ้วไพบูลย์', 1006,
    'EEEC', 3.0, 40, '2026-02-03'::date, '2026-02-03'::date, '2026-02-03'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-33', 'เข้าร่วมการประชุมคณะกรรมการอำนวยการ ทสม. ระดับจังหวัด  จังหวัดนครปฐม', 'วิชาการ', 'คณะกรรมการอำนวยการ ทสม. ระดับจังหวัด จังหวัดนครปฐม', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง', 843,
    'EEEC', 3.0, 20, '2026-02-09'::date, '2026-02-09'::date, '2026-02-09'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-34', 'สำนักส่งเสริมฯ นำทีมผู้ประกอบการ เข้าศึกษาดูงาน', 'ศึกษาดูงาน วศ.กพส.', 'ผู้ประกอบการ', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายภัทรพล ชูราศรี นายรัตนศักดิ์ ทรัพย์เย็น นางณีรนุช ยอดเพชร นางสาวอทิตยา แผ้วไพบูลย์', 843,
    'EEEC', 3.0, 3, '2026-02-10'::date, '2026-02-10'::date, '2026-02-10'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-35', 'คณะศึกษาดูงานจากสำนักงานส่งเสริมการปกครองท้องถิ่นจังหวัดนครปฐม ในการจัดกิจกรรมศึกษาเรียนรู้ “การกำจัดเศษใบไม้และกิ่งไม้ในบ้านเรือนและชุมชน ด้วยเตาเผาไร้ควัน” เพื่อสนับสนุนการดำเนินงานตามแผนปฏิบัติการจัดการขยะมูลฝอยชุมชน “จังหวัดสะอาด”  ประจำปี พ.ศ. 2569', 'ศึกษาดูงาน วศ.กพส.', 'ผู้แทนกลุ่มงานบริการสาธารณะและประสานงานท้องถิ่นอำเภอ', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายอรรถวุทธิ์ รื่นเริงใจ นายภัทรพล ชูราศรี นายเจษฎาพร ด้วงแก้ว นางสาวอทิตยา แผ้วไพบูลย์', 843,
    'EEEC', 3.0, 4, '2026-02-12'::date, '2026-02-12'::date, '2026-02-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-36', 'จัดนิทรรศการในงาน 3 อ. FOR FIT ณ สำนักส่งเสริมและฝึกอบรม กำแพงแสน', 'วิชาการ', 'ประชาชนทั่วไป', 'นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว', 1007,
    'EEEC', 3.0, 40, '2026-02-12'::date, '2026-02-12'::date, '2026-02-14'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-37', 'จัดนิทรรศการ ในงาน green gain day ต.กระตีบ  อ.กำแพงแสน จ.นครปฐม', 'วิชาการ', 'เกษตรกรและชุมชน', 'นางสาวธันยพร โส๊ะอ้น นางณีรนุช ยอดเพชร', (SELECT id FROM personnel WHERE first_name = 'ธันยพร' LIMIT 1),
    'EEEC', 3.0, 30, '2026-02-24'::date, '2026-02-24'::date, '2026-02-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-02-38', 'ส่งมอบเครื่องอัดกระถางวัสดุจากธรรมชาติและเครื่องผสมวัสดุ พร้อมสาธิตการใช้งาน ให้กับโรงเรียนกาบเชิงวิทยา อำเภอกาบเชิง จังหวัดสุรินทร์', 'ศึกษาดูงาน วศ.กพส.', 'คณะครูโรงเรียนกาบเชิงวิทยา อำเภอกาบเชิง จังหวัดสุรินทร์', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว นายสมเกียรติ อิ่มจันทร์ นางสาวอทิตยา แผ้วไพบูลย์', 843,
    'EEEC', 3.0, 3, '2026-02-24'::date, '2026-02-24'::date, '2026-02-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 8: โครงการวิจัย ประจำเดือนมีนาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-03-01', NULL, 'ศึกษาวิจัยและสาธิตริเริ่มระบบช่วยติดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE',
    'กำลังดำเนินการ', 0.0, 16050200.0, 'สำนักงานเร่งรัดการวิจัยและนวัตกรรมเพื่อเพิ่มความสามารถการแข่งขันและการพัฒนาพื้นที่ (องค์การมหาชน)  กับ บริษัทโอทีเอส เซอร์วิสแอนด์ ซัพพลาย จำกัด', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-03-01'::date, '2027-03-01'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-03-02', NULL, 'ระบบสนับสนุนการตัดสินใจสำหรับการออกแบบและการเพิ่มประสิทธิภาพอย่างยั่งยืนของเครือข่ายโซ่อุปทานหลังการเก็บเกี่ยวมะพร้าว', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968, 'IE',
    'กำลังดำเนินการ', 20000.0, 0.0, 'ทุนอุดหนุนการวิจัย คณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569', 'ภายใน', 'ไม่มี', 'applied',
    '2026-03-03'::date, '2027-03-03'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-03-03', NULL, 'การพัฒนาและถ่ายทอดเทคโนโลยีนวัตกรรมระบบควบคุมความปลอดภัยสำหรับปั้นจั่น(เครน)เหนือศีรษะด้วยเทคโนโลยี LiDAR เพื่อยกระดับความปลอดภัยของผู้ปฏิบัติงานและลดความเสี่ยงต่อสาธารณชน', 'อ.ดร.ณัฐพงษ์ สุขสบาย', 953, 'ME',
    'กำลังดำเนินการ', 0.0, 1628000.0, 'สำนักงานการวิจัย แห่งชาติ (วช)', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-03-03'::date, '2027-03-03'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 9: โครงการพัฒนาวิชาการ ประจำเดือนมีนาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-01', 'โครงการประเมินปริมาณน้ำเสียชุมชนเพื่อการวางแผนระบบบำบัดน้ำเสียอย่างยั่งยืน', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE', 'องค์การจัดการน้ำเสีย', 481000.0,
    72150.0, 24050.0, 24050.0, 24050.0, 336700.0,
    2, 1, '02207424 วิศวกรรมการประปา', NULL,
    NULL, '2026-02-05'::date, '2026-09-30'::date, '2026-02-15'::date, '2026-09-30'::date,
    '00520/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-02', 'โครงการศึกษาความเหมาะสมและผลกระทบสิ่งแวดล้อม จัดหาแหล่งกักเก็บน้ำ อาคารประกอบ และโครงข่ายน้ำสำหรับใช้ในโครงการศูนย์ธุรกิจ EEC และเมืองใหม่น่าอยู่อัจฉริยะ จังหวัดชลบุรี', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 24000000.0,
    3600000.0, 1200000.0, 1200000.0, 1200000.0, 16800000.0,
    15, 2, '02207431 Feasibility and EIA', NULL,
    NULL, '2026-02-24'::date, '2028-01-31'::date, '2026-06-01'::date, '2026-12-31'::date,
    '00515/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-03', 'จ้างจัดหาระบบควบคุมระยะไกลของประตูระบายน้ำพระเอกาทศรถ สำนักงานก่อสร้างชลประทานขนาดใหญ่ที่ 11 สำนักพัฒนาแหล่งน้ำขนาดใหญ่ กรมชลประทาน', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานก่อสร้างชลประทานขนาดใหญ่ที่ 11 สำนักพัฒนาแหล่งน้ำขนาดใหญ่ กรมชลประทาน', 15000000.0,
    900000.0, 300000.0, 300000.0, 300000.0, 13200000.0,
    8, 3, '02207545 Flood Forecasting and Warning System', NULL,
    NULL, '2026-03-03'::date, '2028-06-30'::date, '2027-01-04'::date, '2027-03-31'::date,
    '00565/69', '9000000', 'ค่าครุภัณฑ์', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-04', 'โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท วัสดุภัณฑ์ธุรกิจ จำกัด)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'บริษัท วัสดุภัณฑ์ธุรกิจ จำกัด', 350000.0,
    52500.0, 17500.0, 17500.0, 17500.0, 245000.0,
    6, 2, NULL, NULL,
    NULL, '2026-03-01'::date, '2027-02-28'::date, NULL, NULL,
    '00582/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-05', 'โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท กลุ่ม 79 จำกัด)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'บริษัท กลุ่ม 79 จำกัด', 350000.0,
    52500.0, 17500.0, 17500.0, 17500.0, 245000.0,
    6, 2, NULL, NULL,
    NULL, '2026-03-01'::date, '2027-02-28'::date, NULL, NULL,
    '00583/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-06', 'โครงการวิจัยและพัฒนาท่อโค้งและท่อสามทางซีเมนต์ใยหินไฮบริดชนิดทนความดันพลัส  (HAC Plus)', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'บริษัท ท่อน้ำสากล  จำกัด', 150000.0,
    22500.0, 7500.0, 7500.0, 7500.0, 105000.0,
    4, 0, '02207423 การออกอบบระบบท่อและระบบชลประทานภายใต้แรงดัน 02207423 การออกแบบระบบท่อและระบบชลประทานภายใต้แรงดัน', NULL,
    NULL, '2026-03-11'::date, '2026-12-30'::date, '2026-04-01'::date, '2026-04-30'::date,
    '00586/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-07', 'งานจ้างศึกษาเบื้องต้นการตรวจสอบสภาพโครงสร้างคอนกรีตของเขื่อนเจ้าพระยาและการประเมินสภาพความเสียหายที่จะก่อให้เกิดการพังทลายในรูปแบบต่างๆ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'ศูนย์เทคโนโลยีโลหะและวัสดุ สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ (สวทช.)', 127500.0,
    19125.0, 6375.0, 6375.0, 6375.0, 89250.0,
    3, 0, '02207423 การออกแบบระบบท่อและระบบชลประทานภายใต้แรงดัน', NULL,
    NULL, '2026-03-24'::date, '2026-12-31'::date, '2026-04-01'::date, '2026-09-30'::date,
    '00626/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-03-08', 'โครงการสำรวจและออกแบบรายละเอียดสถานีสูบน้ำหนองปลาไหล แห่งที่ 4 เพื่อทดแทนสถานีสูบน้ำหนองปลาไหล 2 สถานีสูบน้ำหนองปลาไหล 3', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'บริษัท จัดการและพัฒนาทรัพยากรน้ำภาคตะวันออก จำกัด (มหาชน)', 3900000.0,
    585000.0, 195000.0, 195000.0, 195000.0, 2730000.0,
    6, 4, '02207542 Project Planning and Assessment', NULL,
    NULL, '2026-03-23'::date, '2026-12-31'::date, '2026-06-01'::date, '2026-11-30'::date,
    '00630/69', NULL, 'กำลังดำเนินการ', 'มีนาคม', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 10: ผลงานบริการวิชาการ ประจำเดือนมีนาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-01', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการวิศวรรมและการก่อสร้างระดับชาติ ครั้งที่ 6 (The Sixth National Engineering and Construction Conference (The 6 NECC)) ออนไลน์', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-03-26'::date, '2026-03-26'::date, '2026-03-26'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-02', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการวิศวรรมและการก่อสร้างระดับชาติ ครั้งที่ 6 (The Sixth National Engineering and Construction Conference  (The 6 NECC)) ออนไลน์', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-03-27'::date, '2026-03-27'::date, '2026-03-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-03', 'ประชุมคณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-03-05'::date, '2026-03-05'::date, '2026-03-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-04', 'เป็นผู้ให้การอบรมเกษตรกรสาธิตระบบให้น้ำและปุ๋ยอย่างแม่นยำ', 'ผู้ทรงคุณวุฒิ', 'กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก  จ.ขอนแก่น และกลุ่มสตรีสหกรณ์การเกษตรไม้ผลบ้านโหล่น จ.ชัยภูมิ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-03-02'::date, '2026-03-02'::date, '2026-03-02'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-05', 'ประชุมคณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 1/2569', 'วิชาการ', 'หน่วยงานภายนอก/ประชาชนทั่วไป', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-03-05'::date, '2026-03-05'::date, '2026-03-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-06', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการน้ำเจ้าพระยา ครั้งที่ 1/2569', 'วิชาการ', 'คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติ ภาค 2 จ.นนทบุรี', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-04'::date, '2026-03-04'::date, '2026-03-04'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-07', 'ประชุมคณะอนุกรรมการบริหารจัดการสถานการณ์น้ำลุ่มน้ำเจ้าพระยา  ครั้งที่ 2/2569', 'วิชาการ', 'คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-06'::date, '2026-03-06'::date, '2026-03-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-08', 'วิทยากรบรรยาย "ประเด็นการมีส่วนร่วมในการบริหารจัดการพื้นที่รับน้ำเพื่อการพัฒนาอย่างยั่งยืน"', 'วิชาการ', 'การประชุมแลกเปลี่ยนสถานการณ์การบริหารจัดการน้ำของประเทศไทย เพื่อการพัฒนาและขับเคลื่อนนโยบายสาธารณะแบบมีส่วนร่วมของจังหวัดพระนครศรีอยุธยา ณ อาคารสุขภาพแห่งชาติ กระทรวงสาธารณสุข จ.นนทบุรี', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-05'::date, '2026-03-05'::date, '2026-03-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-09', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำเจ้าพระยา จ.นครสวรรค์', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-10'::date, '2026-03-10'::date, '2026-03-10'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-10', 'ประชุมสัมมนาระดมความคิดเห็นกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิ 22 ลุ่มน้ำ เพื่อขับเคลื่อนการพัฒนาลุ่มน้ำอย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำฯ สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 จ.นนทบุรี', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-27'::date, '2026-03-27'::date, '2026-03-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-11', 'ประชุมสัมมนาระดมความคิดเห็นกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิ 22 ลุ่มน้ำ เพื่อขับเคลื่อนการพัฒนาลุ่มน้ำอย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำฯ สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 จ.นนทบุรี', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-03-27'::date, '2026-03-27'::date, '2026-03-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-12', 'ประชุมสัมมนาระดมความคิดเห็นกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิ 22 ลุ่มน้ำ เพื่อขับเคลื่อนการพัฒนาลุ่มน้ำอย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'คณะกรรมการลุ่มน้ำฯ สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 จ.นนทบุรี', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872,
    'IRE', 3.0, 30, '2026-03-28'::date, '2026-03-28'::date, '2026-03-28'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-13', 'วิทยากรให้ความรู้หัวข้อ "โครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในแม่น้ำปิงสายหลัก"', 'วิทยากร/อาจารย์พิเศษ', 'โครงการฝึกอบรม การจัดการความรู้ นวัตกรรม และเสริมสร้างธรรมาภิบาลขององค์กรเพื่อการบริหารจัดการน้ำอย่างยั่งยืน สำนักงานชลประทานที่ 1', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879,
    'IRE', 3.0, 30, '2026-03-13'::date, '2026-03-13'::date, '2026-03-13'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-14', 'วิทยากรบรรยายการประชุมเสวนาวิชาการ เรื่อง รู้ทัน การ เปลี่ยนแปลงพร้อมรับมือแล้งนี้', 'วิทยากร/อาจารย์พิเศษ', 'สำนักงานทรัพยากรน้ำแห่งชาติ จ.นนทบุรี', 'รศ.ดร.วราวุฒิ วุฒิวณิชย์', 874,
    'IRE', 3.0, 30, '2026-03-30'::date, '2026-03-30'::date, '2026-03-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-15', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water Supply', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-03-21'::date, '2026-03-21'::date, '2026-03-21'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-16', 'ประชุมเสวนาวิชาการ  เรื่อง รู้ทัน การเปลี่ยนแปลง  พร้อมรับมือแล้งนี้', 'ผู้ทรงคุณวุฒิ', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-03-30'::date, '2026-03-30'::date, '2026-03-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-17', 'ประชุมเสวนาวิชาการ  เรื่อง รู้ทัน การเปลี่ยนแปลง  พร้อมรับมือแล้งนี้', 'ผู้ทรงคุณวุฒิ', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-03-30'::date, '2026-03-30'::date, '2026-03-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-18', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics  in Advanced Water Resources Engineering หัวข้อ Vector and Raster Data Analysis & Terrain Analysis and Hydrological Modeling ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม  ม.มหิดล วิทยาเขตศาลายา', 'วิทยากร/อาจารย์พิเศษ', 'นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม  ม.มหิดล วิทยาเขตศาลายา', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872,
    'IRE', 3.0, 30, '2026-03-17'::date, '2026-03-17'::date, '2026-03-17'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-19', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Geospatial Modelling for Water Resources Management ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'วิทยากร/อาจารย์พิเศษ', 'นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม  ม.มหิดล วิทยาเขตศาลายา', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872,
    'IRE', 3.0, 30, '2026-03-24'::date, '2026-03-24'::date, '2026-03-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-20', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Remote Sensing in Hydrology ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'วิทยากร/อาจารย์พิเศษ', 'นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม  ม.มหิดล วิทยาเขตศาลายา', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872,
    'IRE', 3.0, 30, '2026-03-31'::date, '2026-03-31'::date, '2026-03-31'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-21', 'กรรมการสอบเค้าโครงวิทยานิพนธ์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น', 'วิทยานิพนธ์ภายนอก', 'นักศึกษาปริญญาโท คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น', 'ผศ.ดร.เกศวรา สิทธิโชค', 884,
    'IRE', 3.0, 30, '2026-03-24'::date, '2026-03-24'::date, '2026-03-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-22', 'เป็นประธานกรรมการสอบป้องกันวิทยานิพนธ์', 'ผู้ทรงคุณวุฒิ', 'สาขาวิชาวิทยาศาสตร์และเทคโนโลยีอาหาร  คณะอุตสาหกรรมเกษตร มหาวิทยาลัยสงขลานครินทร์', 'ศ.ดร.รังสินี โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1),
    'FE', 3.0, 30, '2026-03-16'::date, '2026-03-16'::date, '2026-03-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-23', 'ส่งเสริมและสนับสนุนการวิจัยและนวัตกรรมภายใต้แผนงานน้ำมั่นคง ไม่ท่วม ไม่แล้ง ใน 10 จังหวัดด้านการเกษตร', 'ผู้ทรงคุณวุฒิ', 'กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก  จ.ขอนแก่น และกลุ่มสตรีสหกรณ์การเกษตรไม้ผลบ้านโหล่น จ.ชัยภูมิ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-03-12'::date, '2026-03-12'::date, '2026-03-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-24', 'เป็นผู้ทรงคุณวุฒิในการประชุมระดมสมองเพื่อจัดทำกรอบการวิจัยและนวัตกรรม ประจำปีงบประมาณ 2570  ด้านเศรษฐกิจและการเกษตร', 'ผู้ทรงคุณวุฒิ', 'สำนักงานการวิจัยแห่งชาติ (วช.)', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-03-26'::date, '2026-03-26'::date, '2026-03-26'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-25', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'การประชุมวิชาการระดับชาติ IE Network 2026', 'ผศ.ปริญญา  พัฒนวสันต์พร', 967,
    'IE', 3.0, 30, '2026-03-19'::date, '2026-03-19'::date, '2026-03-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-26', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', '7th Asia Pacific International Conference on Industrial Engineering and Operations Management Bangkok, Thailand,  March 25-27, 2026', 'อ.ดร.ปริญญา กวีกิจบัณฑิต', 972,
    'IE', 3.0, 30, '2026-03-25'::date, '2026-03-25'::date, '2026-03-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-27', '7th Asia Pacific International Conference on Industrial Engineering and Operations Management Bangkok, Thailand, March 25-27, 2026', 'วิทยากร/อาจารย์พิเศษ', 'เกษตรกรใน อ.นครชัยศรี  จ.นครปฐม', 'นางสาวธันยพร โส๊ะอ้น นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว', (SELECT id FROM personnel WHERE first_name = 'ธันยพร' LIMIT 1),
    'EEEC', 3.0, 50, '2026-03-10'::date, '2026-03-10'::date, '2026-03-10'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-28', 'วิทยากรการอบรมเชิงปฏิบัติการสร้างมูลค่าเพิ่มเศษวัสดุเหลือใช้ทางการเกษตร โครงการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม กิจกรรม จัดตั้ง "Green Gain Hub" ระดับจังหวัด ณ ต.บางไทรป่า อ.บางเลน จ.นครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'เกษตรกรใน อ.บางเลน  จ.นครปฐม', 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายภัทรพล ชูราศรี นายรัตนศักดิ์ ทรัพย์เย็น', 843,
    'EEEC', 3.0, 50, '2026-03-13'::date, '2026-03-13'::date, '2026-03-13'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-29', 'จัดนิทรรศการ ภายใต้โครงการวิจัยการส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก ณ ศูนย์ส่งเสริมและฝึกอบรมการเกษตรแห่งชาติ', 'วิชาการ', 'หน่วยงานภาครัฐและเอกชน ผู้ประกอบการ นักศึกษาและบุคลากรในมหาวิทยาลัย ผู้ที่สนใจทั่วไป', 'นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว', 1007,
    'EEEC', 3.0, 150, '2026-03-27'::date, '2026-03-27'::date, '2026-03-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-30', 'เป็นวิทยากรบรรยายในงานสัมมนาความรู้ Design Precaign Strucyural Members with GFRP', 'วิทยากร/อาจารย์พิเศษ', 'มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-03-20'::date, '2026-03-20'::date, '2026-03-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-31', 'เข้าร่วมดำเนินงานโครงการวิจัย การศึกษาความเป็นไปได้ในการปรับปรุงรายการตรวจสอบสภาพอาคารเขื่อนทดแทนน้ำเก่า เพื่อลดความเสี่ยงต่อความเสียหายต่อพื้นที่เกษตรกรรม', 'วิชาการ', 'ชป.สวทช.', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922,
    'CE', 3.0, 30, '2026-03-06'::date, '2026-03-06'::date, '2026-03-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-32', 'เป็นประธานกรรมการและผู้ทรงคุณวุฒิสอบหัวข้อและ เค้าโครงวิทยานิพนธ์', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-03-25'::date, '2026-03-25'::date, '2026-03-25'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-33', 'เป็นกรรมการสอบวิทยานิพนธ์  โครงการบัณฑิตศึกษา ในหัวข้อ การประยุกต์ใช้วิธีการตกตะกอนแคลเซียมคาร์บอเนต โดยเชื้อจุลินทรีย์ในมอตาร์ (ออนไลน์)', 'วิทยานิพนธ์ภายนอก', 'โครงการบัณฑิตศึกษา  สาขาวิศวรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต ต.คลองหนึ่ง  อ.คลองหลวง จ.ปทุมธานี', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-03-24'::date, '2026-03-24'::date, '2026-03-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-34', 'กรรมการสอบ ป้องกันสารนิพนธ์ของนักศึกษา ระดับปริญญาโท', 'วิชาการ', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922,
    'CE', 3.0, 30, '2026-03-25'::date, '2026-03-25'::date, '2026-03-25'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-03-35', 'Invited Speaker ในการประชุมวิชาการ Inaugural Meeting of the Tropical Crops Machinery Branch of the Chinese Society for Agricultural Machinery and the High-Quality Development Forum on Tropical Crop Machinery', 'วิทยากร/อาจารย์พิเศษ', 'Chinese Society for Agricultural Machinery (CSAM)', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'AE', 3.0, 150, '2026-03-28'::date, '2026-03-28'::date, '2026-04-02'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 11: สิ่งตีพิมพ์ ประจำเดือนมีนาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-01', 'Postharvest detection of anthracnose (Colletotrichum asianum) on mango fruit (Mangifera indica L.cv Namdokmai Sithong) using near-infrared response', 'ตีพิมพ์', 'นานาชาติ', 1666.0,
    'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), 'AE', 'BMC Plant Biology', '26',
    '136', '1', '13', 'Q1',
    NULL, 'Apiwat Junto,  Thitima Phanomsophon,  Sneha Sharma, Kannapot Kaewsorn,  Jiraporn Sripinyowanich Jongyingcharoen,  Cheewanun Dachoupakan Sirisomboon,  Panan Rerngsamran,  Panmanas Sirisomboon, Pimpen Pornchaloempong, Norhashila Hashim,  Prabhas Chongstitvatana', false, true, true,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-02', 'Sustainable Packaging Film From Chitosan Reinforced     With Rice Husk Cellulose Nanocrystals', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ศ.ดร.รังสินี โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', 'Packaging Technology and Science', '1',
    '39', '125', '136', 'Q2',
    NULL, 'นางสาวน้ำฝน สามสาลี, นางสาวจิตรวดี มีราศรี', false, true, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-03', 'Shear Behavior of Ultra-High-Performance Concrete Shear Pockets with Large-sized Studs in Full-Depth Precast Concrete Bridge Deck under Push-off Tests', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 'Applied Science and Engineering Progress', '2025',
    '3', '1', '14', 'Q1',
    NULL, 'Krissachai Sriboonma, Kittipoom Rodsin', false, true, true,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-04', 'Maturity assessment-based dry matter content in Mon Thong durian pulp using machine learning and near-infrared hyperspectral image analysis', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร', 985, 'CPE', 'IEEE Access', '14',
    '1', '23542', '23555', 'Q1',
    NULL, 'นายอนุพันธ์ เทอดวงศ์วรกุล, นายธนา ชีพสมทรง, นายศุภชัย กุลมุติวัฒน์, นายพีรพงษ์ แสงวนางศ์กูล', false, true, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q1 เบิกภาคการอาหาร  4,000 บาท, เบิกภาคคอม 4,000 บาท เบิกภาคเกษตร  2 ท่าน 8,000 บาท', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-05', 'Determining the Optimal Order Quantity for Perishable Products Affected by Stochastic Transportation Delays', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE', 'Logistics', '10',
    '1', '1', '19', 'Q2',
    NULL, 'นางสาวบัณฑิตา กาญจนสาธิต, นางสาวอัจฉรา วังป่า, นายอภิสิทธิ์ พิทักษ์ชื่น', false, true, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q2 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-06', 'Productivity Improvement of the Coconut Water Conveying System Using Simulation Modeling: A Case Study', 'ตีพิมพ์', 'ชาติ', 5000.0,
    'อ.ดร.ปริญญา กวีกิจบัณฑิต', 972, 'IE', 'Engineering and Technology Horizons (ETH)', '43',
    '1', '430102', '430102', NULL,
    NULL, 'นายภูเมศวร์ แสงระยับ, นายจิรวัฒน์ จิระชาติวงษ์ชัย, นางสาวภาสุรีย์ ล้ำสกุล', false, true, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'TCI1 ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-07', 'In vestor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ดร.ศศิวิมล ขาวโกมล', 885, 'IRE', 'Sustainability', '2026',
    '18', '1', '25', 'Q1',
    NULL, 'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', false, true, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-03-08', 'Prototype Framework for Agricultural Drought Monitoring in Northern Thailand Using Satellite-Based Evaporative Stress index', 'เตรียมความพร้อม', 'นานาชาติ', 3675.0,
    'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', NULL,
    NULL, NULL, false, false, false,
    2569, 'มีนาคม', 'มีนาคม 2569', 'ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 12: ทรัพย์สินทางปัญญา ประจำเดือนมีนาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, remarks, created_at, updated_at
) VALUES (
    'ip-2569-03-01', 'รถไถเดินตามสำหรับกำจัดวัชพืช', 'อนุสิทธิบัตร', 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE',
    '2503001568', '27126', '2025-04-29'::date, '2026-01-13'::date, '2031-04-28'::date,
    10000.0, 2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    support_amount = EXCLUDED.support_amount,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 13: โครงการวิจัย ประจำเดือนเมษายน 2569
-- ----------------------------------------------------------------------------
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-04-01', NULL, 'การพัฒนาพื้นที่เพื่อเตรียมความ พร้อมรับมือกับปัญหาภัยแล้งและ ปัญหาอุทกภัย ในพื้นที่เสี่ยงภัยที่มี ความสำคัญทางเศรษฐกิจและ สังคม ปีที่ 2', 'รศ.ดร.สมชาย ดอนเจดีย์', 878, 'IRE',
    'กำลังดำเนินการ', 0.0, 9478000.0, 'สำนักงานพัฒนาการวิจัย การเกษตร(สวก.)', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-04-01'::date, '2027-04-04'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-04-02', NULL, 'การใช้เทคโนโลยีจัดการน้ำ-ปุ๋ยและจัดการผลิตมะม่วงน้ำดอกไม้สีทองที่เหมาะสมในพื้นที่ประสบภัยแล้งจังหวัดขอนแก่นและชัยภูมิเพื่อการส่งออกและผลิตนอกฤดู', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'กำลังดำเนินการ', 0.0, 6857000.0, 'สำนักงานการวิจัยแห่งชาติ(วช.)', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-04-04'::date, '2027-04-04'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-04-03', NULL, 'การพัฒนาระบบสารสนเทศเพื่อ ปรับปรุงกระบวนการติดตามและ วิเคราะห์ผลการดำเนินโครงการที่ เชื่อมโยงกับแผนยุทธศาสตร์ด้าน กิจการนิสิต: กรณีศึกษา  มหาวิทยาลัยเกษตรศาสตร์  วิทยาเขตกำแพงแสน', 'ผศ.อธิวัฒน์ บุญมี', 963, 'IE',
    'กำลังดำเนินการ', 20000.0, 0.0, 'ทุนอุดหนุนการวิจัย  คณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569', 'ภายใน', 'ไม่มี', 'applied',
    '2026-04-04'::date, '2027-04-04'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 14: โครงการพัฒนาวิชาการ ประจำเดือนเมษายน 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-04-01', 'การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย ระยะที่ 2', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'บริษัท  อายิโนะโมะโต๊ะ จำกัด', 7543647.0,
    1131547.05, 377182.35000000003, 377182.35000000003, 377182.35000000003, 5280552.9,
    6, 1, '02207321 การออกแบบระบบชลประทานในฟาร์ม', NULL,
    NULL, '2026-03-05'::date, '2027-12-30'::date, '2026-03-31'::date, '2027-02-20'::date,
    '00725/69', NULL, 'กำลังดำเนินการ', 'เมษายน', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    alloc_overhead, alloc_faculty, alloc_dept, alloc_ku, alloc_remaining,
    co_members_internal, co_members_external, research_integration, patent_integration,
    characteristics, start_date, end_date, integration_start_date, integration_end_date,
    record_number, remarks, status, month, fiscal_year, created_at, updated_at
) VALUES (
    'acad-2569-04-02', 'การจ้างดำเนินงานโครงการการประเมินผลสัมฤทธิ์โครงการของกรมทรัพยากรน้ำ กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร ประจำปีงบประมาณ พ.ศ. 2569', 'ผศ.ดร.ไชยาพงษ์  เทพประสิทธิ์', 869, 'IRE', 'กรมทรัพยากรน้ำ', 500000.0,
    75000.0, 25000.0, 25000.0, 25000.0, 350000.0,
    1, 2, '02207542 Project Planning and Assessment', NULL,
    NULL, '2026-04-29'::date, '2027-01-29'::date, '2026-06-15'::date, '2026-12-30'::date,
    '00779/69', NULL, 'กำลังดำเนินการ', 'เมษายน', 2569, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 15: ผลงานบริการวิชาการ ประจำเดือนเมษายน 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-01', 'เป็นประธานกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศ ระดับสายสนับสนุน', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-04-30'::date, '2026-04-30'::date, '2026-04-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-02', 'เป็นผู้ทรงคุณวุฒิในการประชุมปรึกษาหารือทางวิชาการเพื่อให้คำแนะนำและแลกเปลี่ยนแนวคิดในหัวข้อ"เทคโนโลยีและการจัดการโรงเรือนปิดสำหรับการปลูกหญ้าหวานเชิงพาณิชย์"', 'ผู้ทรงคุณวุฒิ', 'บริษัท ชิล ทอล์ค จำกัด', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-04-10'::date, '2026-04-10'::date, '2026-04-10'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-03', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-04-16'::date, '2026-04-16'::date, '2026-04-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-04', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ  ครั้งที่ 31 (2569)', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-04-16'::date, '2026-04-16'::date, '2026-04-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-05', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'ผู้ทรงคุณวุฒิ', 'คณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-04-16'::date, '2026-04-16'::date, '2026-04-16'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-06', 'ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'ผู้ทรงคุณวุฒิ', 'ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-04-17'::date, '2026-04-17'::date, '2026-04-17'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-07', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 3/2569', 'ผู้ทรงคุณวุฒิ', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-04-22'::date, '2026-04-22'::date, '2026-04-22'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-08', 'เป็นผู้ทรงคุณวุฒิในการประชุมปรึกษาหารือทางวิชาการเพื่อให้คำแนะนำและแลกเปลี่ยนแนวคิดในหัวข้อ"เทคโนโลยีและการจัดการโรงเรือนปิดสำหรับการปลูกหญ้าหวานเชิงพาณิชย์"', 'ผู้ทรงคุณวุฒิ', 'บริษัท ชิล ทอล์ค จำกัด', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-04-10'::date, '2026-04-10'::date, '2026-04-10'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-09', 'เป็นผู้ทรงคุณวุฒิในการประเมินผลกระทบของโครงการ ภายใต้โครงการเรื่อง ระบบการให้น้ำอย่างแม่นยำในสวนมะม่วงน้ำดอกไม้สีทองเพื่อการส่งออกจ.ขอนแก่นและจ.ชัยภูมิ', 'ผู้ทรงคุณวุฒิ', 'กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก จ.ขอนแก่น และกลุ่มสตรีสหกรณ์บ้านโหล่น จ.ชัยภูมิ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903,
    'FE', 3.0, 30, '2026-04-27'::date, '2026-04-27'::date, '2026-04-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-10', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'สอบความก้าวหน้าวิทยานิพนธ์', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-04-28'::date, '2026-04-28'::date, '2026-04-28'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-04-11', 'Keynote Speaker ในการสัมมนาออนไลน์ CAU-KU Online Workshop on Intelligent Agricultural Machinery and Smart Agriculture', 'วิทยากร/อาจารย์พิเศษ', 'China Agricultural University', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'AE', 3.0, 50, '2026-04-24'::date, '2026-04-24'::date, '2026-04-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 16: สิ่งตีพิมพ์ ประจำเดือนเมษายน 2569
-- ----------------------------------------------------------------------------
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-01', 'Impact of high-pressure homogenization and ultrasonic techniques on production  and characterization of carboxymethyl cellulose from lignocellulosic rice husks', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ศ.ดร.รังสินี โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', 'Biomass Conversion and Biorefinery', '1',
    '16', 'Article no. 172', 'Article no. 172', 'Q2',
    NULL, 'Namfon Samsallee, Jitrawadee Meerasri, Thidarat Bumrungpakdee, Maria Bernardita PerezGago, and Rungsinee Sothornvit,', false, true, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-02', 'Prototype Framework for Agricultural Drought Monitoring in Northern Thailand Using Satellite-Based Evaporative Stress Index', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 'Journal of Agrometeorology', '28',
    '1', '80', '87', 'Q2',
    NULL, 'นางสาวนพนภา บุญพิน ดร.พัชรียา ไวภารา', false, true, false,
    2569, 'เมษายน', 'เมษายน 2569', 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-03', 'Gully erosion susceptibility assessment in Jhang-Ping and          Ping-Lin watersheds: a risk-based model using conditioning indicators', 'ตีพิมพ์', 'นานาชาติ', 2857.0,
    'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 'Environmental Earth Sciences', '84',
    '1', '677', '677', 'Q1',
    'Asst.Prof.Dr.Wen-Yan Zhang, Chih-Wei Chuang, Fu-jun Tu, Shu-Tzu Chen, Hsiu-Hui Huang', NULL, true, false, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-04', 'Exploring Natural Cotton  FRP as a Sustainable Method for Confinement of Concrete Made with Natural and Recycled Aggregates', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ชิษณุพงศ์ สุธัมมะ', 919, 'CE', 'Journal of Natural Fibers', '28',
    '2634403/1', '1', '28', 'Q2',
    NULL, 'Panumas Saingam, Burachat Chatveera, Gritsada Sua-lam, Preeda Chaimahawan, Chisanuphong Suthumma, Panuwat Joyklad, Qudeer Hussain and  Afaq Ahmad', false, true, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-05', 'From Experiment to Prediction: Machine Learning Solutions for Concrete Strength Assessment with Steel Clamps', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ชิษณุพงศ์ สุธัมมะ', 919, 'CE', 'Buildings', '16(2026)',
    '851/4', '1', '26', 'Q1',
    NULL, 'Panumas Saingam, Burachat Chatveera, Gritsada Sua-lam, Preeda Chaimahawan, Chisanuphong Suthumma, Panuwat Joyklad, Qudeer Hussain and  Afaq Ahmad', false, true, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-06', 'การประเมินค่าปริมาณของแข็งที่ละลายได้ของผลแตงโมพันธุ์ซอนญ่าด้วยเทคนิคภาพสเปกโทรสโกปีอินฟราเรดย่านใกล้', 'ตีพิมพ์', 'ชาติ', 5000.0,
    'รศ.ดร.แก้วกานต์ พวงสมบัติ', 846, 'AE', 'วารสารวิชาการเกษตร', '43',
    '3', '230', '240', NULL,
    NULL, 'นายพชร สืบสรวง, ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล, รศ.ดร.อาทิตย์ พวงสมบัติ, รศ.อมรเดช พุทธิพิพัฒน์ขจร', false, true, false,
    2569, 'เมษายน', 'เมษายน 2569', 'TCI1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-07', 'Investor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model', 'เตรียมความ พร้อม', 'นานาชาติ', 20000.0,
    'ผศ.ดร.ศศิวิมล ขาวโกมล', 885, 'IRE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', 'Q1',
    NULL, 'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', false, true, false,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1 ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-08', 'กรรมวิธีการผลิต เพกทินชนิดเมทอกซิลต่ำโดยใช้กระบวนการอิเล็กโทรลิซิส', 'เตรียมความ พร้อมขอสิทธิบัตร', 'ชาติ', 20000.0,
    'รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล', 899, 'FE', 'สิทธิบัตร', '1',
    '1', '1', '1', NULL,
    NULL, NULL, false, false, false,
    2569, 'เมษายน', 'เมษายน 2569', 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-09', 'Evaluating the quality of pellets durian peel waste: potential and carbon footprint on production', 'เตรียมความพร้อม', 'นานาชาติ', 20000.0,
    'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, 'AE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', 'Q1',
    NULL, 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ รศ.ดร.ประเทือง อุษาบริสุทธิ์', false, true, false,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1 ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-10', 'Intermolecularly aggregated complexation between faba bean protein and purified (NADES-retrieved) acidic phenolics is inferior to its soy protein-phenolic counterpart', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ศ.ดร.รังสินี โสธรวิทย์', (SELECT id FROM personnel WHERE first_name = 'รังสินี' LIMIT 1), 'FE', 'วารสาร International Journal of Biological Macromolecules', '1',
    '357', '151575', '151575', 'Q1',
    'Laychintong Ly', NULL, true, false, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-11', 'Evaluating the quality of pellets durian peel waste: potential and carbon footprint on production', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, 'AE', 'Sustainable Chemistry for Climate Action', '8',
    '1', '100196', '100196', 'Q1',
    NULL, 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ รศ.ดร.ประเทือง อุษาบริสุทธิ์', false, true, false,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-12', 'Interpreting Satellite Rainfall Bias Correction Through a Rainfall-Runoff Framework in a Monsoon-Influenced River Basin: The Phetchaburi River Basin, Thailand', 'เตรียมความพร้อม', 'นานาชาติ', 20000.0,
    'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', 883, 'IRE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', 'Q1',
    NULL, 'Thirasak Saion, Ketvara Sittichok, Songsak Puttrawtichai, Chaiyapong Thepprasit, Pklpech Samanmit, Bancha Kwanyen , Sasiwimol Khawkomol', false, true, true,
    2569, 'เมษายน', 'เมษายน 2569', 'Q1 ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-04-13', 'Water-centric nexus assessment and critical land-use thresholds for economic crops in central Thailand', 'เตรียมความพร้อม', 'นานาชาติ', 20000.0,
    'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', NULL,
    NULL, 'Thunwadee tachapattaworakul suksaroj, noppadon kowsuvon, saudee maprasit, apirak srisook, wichukorn Suriyawongpaisal, songsak puttrawutichai, polpech samanmit,  nuttaya namin', false, true, true,
    2569, 'เมษายน', 'เมษายน 2569', 'ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 17: โครงการวิจัย ประจำเดือนพฤษภาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, academic_service, teaching_courses, applied_courses,
    trl_start, trl_end, remarks, created_at, updated_at
) VALUES (
    'res-2569-05-01', NULL, 'ศึกษาวิจัยและสาธิตเริ่มระบบช่วยตัดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE',
    'กำลังดำเนินการ', 0.0, 18000200.0, 'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ(บพช)', 'ภายนอก', 'ไม่มี', 'applied',
    '2026-05-05'::date, '2027-04-04'::date, 2569, NULL, NULL, NULL,
    NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 18: ผลงานบริการวิชาการ ประจำเดือนพฤษภาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-01', 'อนุกรรมการวิชาการรายสาขาคณะที่ 48/25 เครื่องจักรแปรรูปอาหาร', 'ผู้ทรงคุณวุฒิ', 'สำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม ถ.พระรามที่ 6 แขวงทุ่งพญาไทย เขตราชเทวี', 'อ.ธิติพงศ์ โพธิ์สุทธิ์', 908,
    'FE', 3.0, 30, '2026-05-29'::date, '2026-05-29'::date, '2026-05-29'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-02', 'เป็นกรรมการสอบวิทยานิพนธ์ของนักศึกษา สาขาวิศวกรรมโยธา จำนวน 10 ราย', 'วิทยานิพนธ์ภายนอก', 'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต จ.ปทุมธานี', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-05-05'::date, '2026-05-05'::date, '2026-05-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-03', 'เป็นวิทยากรการประชุมเชิงปฏิบัติการวิพากษ์ร่างรายงานการประเมินตนเอง (SAR) ตามเกณฑ์ EdPEx ผ่าน Zoom', 'วิทยากร/อาจารย์พิเศษ', 'วิทยาลัยชุมชนสมุทรสาคร', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-05-15'::date, '2026-05-15'::date, '2026-05-15'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-04', 'เป็นวิทยากรการประชุมเชิงปฏิบัติการวิพากษ์ร่างรายงานการประเมินตนเอง (SAR) ตามเกณฑ์ EdPEx ผ่าน Zoom', 'วิทยากร/อาจารย์พิเศษ', 'วิทยาลัยชุมชนสมุทรสาคร', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-05-22'::date, '2026-05-22'::date, '2026-05-22'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-05', 'ให้คำปรึกษาในการบริการ  QS Coach ครั้งที่ 1', 'ผู้ทรงคุณวุฒิ', 'มหาวิทยาลัยเกษตรศาสตร์', 'รศ.ดร.เบญญา กสานติกุล', 946,
    'ME', 3.0, 30, '2026-05-20'::date, '2026-05-20'::date, '2026-05-20'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-06', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Civil Engineering Infrastures Journal Certificate of Reviewing', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-05-08'::date, '2026-05-08'::date, '2026-05-08'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-07', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'Silicon', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-05-14'::date, '2026-05-14'::date, '2026-05-14'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-08', 'เป็นกรรมการสอบการศึกษาโครงการวิจัยเฉพาะเรื่อง ระดับบัณฑิตศึกษา เรื่องการศึกษาประสิทธิภาพการซ่อมแซมตัวเองของคอนกรีตที่ประยุกต์ใช้วัสดุคริสตัลไลน์ ภายใต้สภาวะแรงดันน้ำ', 'ผู้ทรงคุณวุฒิ', 'โครงการเทคโนโลยีวิศวกรรมโยธา ภาควิชาวิศวกรรมโยธา  คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี กทม.', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921,
    'CE', 3.0, 30, '2026-05-21'::date, '2026-05-21'::date, '2026-05-21'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-09', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water practice and technology', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-03'::date, '2026-05-03'::date, '2026-05-03'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-10', 'กรรมการสอบวิทยานิพนธ์ จำนวน 2 เรื่อง', 'ผู้ทรงคุณวุฒิ', 'นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'ผศ.ดร.ชุพันธุ์ ชมภุจันทร์', 872,
    'IRE', 3.0, 30, '2026-05-07'::date, '2026-05-07'::date, '2026-05-07'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-11', 'ผู้ทรงคุณวุฒิ เสวนางาน Water Resilience Forum 2/2026 หัวข้อ "Water Economy : พลิกน้ำ  สร้างชาติ"', 'ผู้ทรงคุณวุฒิ', 'คณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-05-07'::date, '2026-05-07'::date, '2026-05-07'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-12', 'ประธานการประชุมวิชาการ THAIWATER', 'วิทยากร/อาจารย์พิเศษ', 'สมาคมนักอุทกนักวิทยาแห่งประเทศไทย  ณ ศูนย์การประชุมแห่งชาติสิริกิติ์', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-06-03'::date, '2026-06-03'::date, '2026-06-03'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-13', 'ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม  ครั้งที่ 2/2569', 'ผู้ทรงคุณวุฒิ', 'คณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม ณ กรมชลประทาน สามเสน', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-05-08'::date, '2026-05-08'::date, '2026-05-08'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-14', 'ผู้เชี่ยวชาญ "ความร่วมมือในการปฏิบัติราชการ" ร่างเอกสารประกวดราคางานจ้างด้วยวิธีประกวดราคาอิเล้กทรอนิกส์ (e-bidding)', 'วิชาการ', 'สำนักงาน ป.ป.ช. ประจำจังหวัดบึงกาฬ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-05-01'::date, '2026-05-01'::date, '2026-05-01'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-15', 'การแต่งตั้งคณะกรรมการบริหารสมาคมศิษย์เก่าวิศวกรรมชลประทาน  ที่ 25/2569 ในพระบรมราชูปถัมภ์', 'ผู้ทรงคุณวุฒิ', 'สมาคมศิษย์เก่าวิศวกรรมชลประทาน', 'รศ.ดร.สมชาย ดอนเจดีย์', 878,
    'IRE', 3.0, 30, '2026-05-05'::date, '2026-05-05'::date, '2026-05-05'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-16', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-11'::date, '2026-05-11'::date, '2026-05-11'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-17', 'วิทยากรฝึกอบรมเชิงปฏิบัติการ "หลักสูตร ผู้อำนวยการโครงการ  รุ่นที่ 23"', 'วิทยากร/อาจารย์พิเศษ', 'สถาบันพัฒนาการชลประทาน กรมชลประทาน', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-05-12'::date, '2026-05-12'::date, '2026-05-12'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-18', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water Resources Management', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-18'::date, '2026-05-18'::date, '2026-05-18'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-19', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Energy Nexus', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-19'::date, '2026-05-19'::date, '2026-05-19'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-20', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Water', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-24'::date, '2026-05-24'::date, '2026-05-24'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-21', 'เข้าร่วมการประชุมหัววหน้าภาควิชาวิศวกรรมโยธาแห่งชาติ ครั้งที่ 1/2569', 'วิชาชีพ', 'วิศวกรรมสถานแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (วสท)', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-05-27'::date, '2026-05-27'::date, '2026-05-27'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-22', 'สัมมนาแลกเปลี่ยนเรียนรู้ : เสริมศักยภาพการจัดการน้ำด้วย AI', 'วิทยากร/อาจารย์พิเศษ', 'สถาบันสารสนเทศ ทรัพยากรน้ำ (องค์กรมหาชน)', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-05-29'::date, '2026-05-29'::date, '2026-05-29'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-23', 'วิทยากร การเสนาวิชาการ เรื่อง "แนวทางการรับมือวิกฤตน้ำและภัยพิบัติ : น้ำท่วม น้ำแล้ง น้ำเพื่อพลังงาน น้ำเพื่อระบบนิเวศ ปี 2569-2570', 'วิทยากร/อาจารย์พิเศษ', 'สมาคมนักอุทกวิทยาไทย', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-05-22'::date, '2026-05-22'::date, '2026-05-22'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-24', 'พิธีกรการเสนาวิชาการ เรื่อง "แนวทางการรับมือวิกฤตน้ำและภัยพิบัติ : น้ำท่วม น้ำแล้ง น้ำเพื่อพลังงาน น้ำเพื่อระบบนิเวศ ปี 2569-2570', 'วิทยากร/อาจารย์พิเศษ', 'สมาคมนักอุทกวิทยาไทย', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-05-22'::date, '2026-05-22'::date, '2026-05-22'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-25', 'แต่งตั้งคณะทำงานวางแผนและส่งเสริมการบริหารจัดการทรัพยากรน้ำเพื่อเพิ่มผลิตภาพการใช้น้ำ', 'ผู้ทรงคุณวุฒิ', 'คำสั่งสำนังานทรัพยากร น้ำแห่งชาติ ที่ 77/2569  ลว. 6 พ.ค. 69', 'รศ.ดร.บัญชา ขวัญยืน', 875,
    'IRE', 3.0, 30, '2026-05-06'::date, '2026-05-06'::date, '2026-05-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-26', 'แต่งตั้งคณะทำงานวางแผนและส่งเสริมการบริหารจัดการทรัพยากรน้ำเพื่อเพิ่มผลิตภาพการใช้น้ำ', 'ผู้ทรงคุณวุฒิ', 'คำสั่งสำนังานทรัพยากร น้ำแห่งชาติ ที่ 77/2569  ลว. 6 พ.ค. 69', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869,
    'IRE', 3.0, 30, '2026-05-06'::date, '2026-05-06'::date, '2026-05-06'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-27', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'วารสาร Food and Energy Security', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877,
    'IRE', 3.0, 30, '2026-05-30'::date, '2026-05-30'::date, '2026-05-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-28', 'กรรมการเครือข่ายการวิจัยดำเนินงานแห่งประเทศไทย', 'ผู้ทรงคุณวุฒิ', 'เครื่อข่ายการวิจัยและดำเนินงานแห่งประเทสไทย  การจัดประชุมวิชาการระดับชาติด้านหารวิจัยดำเนินงานและวารสรไทยการวิจัยดำเนินงาน', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968,
    'IE', 3.0, 30, '2026-05-01'::date, '2026-05-01'::date, '2030-04-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-29', 'กรรมการเครือข่ายการวิจัยดำเนินงานแห่งประเทศไทย', 'ผู้ทรงคุณวุฒิ', 'เครื่อข่ายการวิจัยและดำเนินงานแห่งประเทสไทย  การจัดประชุมวิชาการระดับชาติด้านหารวิจัยดำเนินงานและวารสรไทยการวิจัยดำเนินงาน', 'ผศ.ดร.ภัทรพงษ์  ภาคภูมิ', 970,
    'IE', 3.0, 30, '2026-05-01'::date, '2026-05-01'::date, '2030-04-30'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO academic_services (
    legacy_id, name, service_category, target_group, provider_name, provider_personnel_id,
    department_code, hours_spent, attendees_count, date, start_date, end_date,
    fiscal_year, remarks, created_at, updated_at
) VALUES (
    'serv-2569-05-30', 'ผู้ทรงคุณวุฒิประเมินคุณภาพภายในระดับหลักสูตร ของสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง จำนวน 2 หลักสูตร ได้แก่  (1) หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเกษตรอัจฉริยะ (2) หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมระบบอุตสาหกรรมเกษตร (ต่อเนื่อง)', 'ผู้ทรงคุณวุฒิ', 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 'ผศ.ดร.วันรัฐ  อับดุลลากาซิม', 845,
    'AE', 6.0, 20, '2026-05-15'::date, '2026-05-15'::date, '2026-05-15'::date,
    2569, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    name = EXCLUDED.name,
    service_category = EXCLUDED.service_category,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    updated_at = CURRENT_TIMESTAMP;

-- ----------------------------------------------------------------------------
-- Section 19: สิ่งตีพิมพ์ ประจำเดือนพฤษภาคม 2569
-- ----------------------------------------------------------------------------
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-01', 'Multiple reservoir optimization using constraint programming for water scarcity resilience in the chao Phraya River Basin', 'ตีพิมพ์', 'นานาชาติ', 2857.0,
    'รศ.ดร.วราวุธ  วุฒิวณิชย์', 874, 'IRE', 'Applied Water Science (2026) 16:135', '16',
    '135', '1', '25', 'Q1',
    NULL, 'wudhichart sawangphol,  areeya rittima, yutthana phankamolsil, jidapa kraisangka, allan sriatana tabucanon,  Yutthana Talaluxmana', false, true, true,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-02', 'Filter-based short-wave infrared imaging combined with machine learning for non-destructive quality assessment of durian pulp', 'ตีพิมพ์', 'นานาชาติ', 2500.0,
    'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', (SELECT id FROM personnel WHERE first_name = 'อนุพันธ์' LIMIT 1), 'AE', 'Postharvest Biology and Technology', '239',
    '114365', '1', '1', 'Q1',
    NULL, 'Surasak Promnioy,  Kttisak Phetpan,  Dimas Firmanda Al Riza, Sneha Sharma,  Panmanas Sirisomboon, Anupun Terdwongworakul, Jetsada Posom,  Jeerayut Hongwiangjan', false, true, true,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-03', 'Synergistic role of supra-GQDs on the  mechanical and durability properties of metakaolin-modified concreteSynergistic role of supra-GQDs on the  mechanical and durability properties of metakaolin-modified concrete', 'ตีพิมพ์', 'นานาชาติ', 6000.0,
    'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 'Results in Engineering Journal', '2026',
    '30', '110290', '110290', 'Q1',
    NULL, 'Khemissara Yodprasert,  Jintara Lawongkerd,  Suppamit Nuntawattananukula  Lapyote Prasittisopin,  Peem Nuaklong', false, true, true,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-04', 'จานหมุนแบบรูกระจายขนาดในเครื่องฟลูอิไดซ์เบด', 'เตรียมความพร้อม', 'ชาติ', 20000.0,
    'รศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', NULL,
    NULL, NULL, false, false, false,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'ค่าบริการยกร่าง (สิทธิบัตรการประดิษฐ์)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-05', 'Water Use Efficiency and Carbon Trade-Offs of Gravit and Pump Irrigation in Rice Cultivation', 'เตรียมความพร้อม', 'นานาชาติ', 20000.0,
    'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'เตรียมความพร้อมตีพิมพ์', '1',
    '1', '1', '1', 'Q1',
    NULL, NULL, false, false, false,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1 ค่าธรรมเนียมตีพิมพ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-06', 'A hybrid artificial neural network-Aspen Plus framework for CO2-enhanced biomass gasification and gas turbine performance', 'ตีพิมพ์', 'นานาชาติ', 3333.0,
    'นายจิรัฐ มั่นเกษม', 1095, 'AE', 'Journal of Environmental Chemical Engineering', '14',
    '2', '121712', '121712', 'Q1',
    NULL, 'Chandran, R.,  Arpornwichanop. A., Mankasem, J., Duon N. and Prasertcharoensuk, P', false, true, true,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-07', 'Interpreting Satellite Rainfall Bias Correction Through a Rainfall-Runoff Framework in a Monsoon-Influenced River Basin: The Phetchaburi River Basin, Thailand', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', 883, 'IRE', 'Water', '2026',
    '18(8)', '1', '33', 'Q1',
    NULL, 'นายธีระศักดิ์ ซ้ายอ่อน , ผศ.ดร.เกศวรา สิทธิโชค,  ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย, ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์ , อ.พลเพชร สมานมิตร, รศ.ดร.บัญชา ขวัญยืน, ผศ.ดร. ศศิวิมล ขาวโกมล', false, true, false,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-08', 'Water-centric nexus assessment and critical land-use thresholds for economic crops in central Thailand', 'ตีพิมพ์', 'นานาชาติ', 20000.0,
    'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'Environmental and Sustainability Indicators', '30',
    '101193', '1', '15', 'Q1',
    NULL, 'ธันวดี เตชะภัททวรกุล สุขสาโรจน์, นพดล โค้วสุวรรณ,  สะอุดีมะประสิทธิ์,  อภิรักษ์ ศรีสุข,  วิชชุกร สุริยะวงศ์ไพศาล,  ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย, อ.พลเพชร สมานมิตร, นางสาวณัฐธยาน์ นามอินทร์', false, true, false,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;
INSERT INTO publications (
    legacy_id, title, type, level, budget, first_author_name, first_author_personnel_id,
    department_code, journal, volume, issue, page_start, page_end, quartile,
    co_authors_foreign, co_authors_domestic, has_foreign_coauthor, has_domestic_coauthor, has_international_coauthor,
    fiscal_year_be, month, month_year, remarks, created_at, updated_at
) VALUES (
    'pub-2569-05-09', 'Predictive performances         of machine learning-and deep learning-based univariate and multivariate reservoir inflow predictions in the Chao Phraya River Basin', 'ตีพิมพ์', 'นานาชาติ', 2500.0,
    'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE', 'Modeling Earth Systems and Environment (2026)12:171', '12',
    '171', '1', '24', 'Q1',
    NULL, 'Areeya Rittima, Jidapa. Kraisangsa Pheeranat Dornpunya, Wudhichart Sawangphol. Yutthana Phankamolsil, Allan Sriratana Tabucanon. Yutthana Talaluxmana', false, true, true,
    2569, 'พฤษภาคม', 'พฤษภาคม 2569', 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (legacy_id) DO UPDATE SET
    title = EXCLUDED.title,
    budget = EXCLUDED.budget,
    updated_at = CURRENT_TIMESTAMP;

COMMIT;
