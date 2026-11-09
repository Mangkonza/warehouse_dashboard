-- ==============================================================================
-- KU Engineering Research & Innovation Warehouse
-- Complete Fiscal Year 2568 (2025) Data Import Script
-- Generated automatically with strict constraint checks & data normalization
-- Target DB: ku_warehouse (PostgreSQL 18)
-- Total Records: 587
-- ==============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- Section 1: โครงการวิจัย ประจำปีงบประมาณ 2568 (37 รายการ)
-- ----------------------------------------------------------------------------
INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-1', 'วศ.กพส.1/2568', 'การใช้แอปพลิเคชั่นไลน์เพื่อการสื่อสารภายในคณะวิศวกรรมศาสตร์ กำแพงแสน', 'นางสาวอรุณรัตน์ บุญปองหา', 858, 'AE',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-2', 'วศ.กพส.2/2568', 'การศึกษาความสามารถของระบบเสริมการระบายอากาศของบ้านจัดสรรขนาด 140 ตารางเมตร', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-3', 'วศ.กพส.3/2568', 'การพัฒนาเว็บไซต์ Eng Connect ด้วยการเพิ่มการแสดงผลการวิเคราะห์เชิงสถิติและการทำเหมืองข้อความ', 'ผศ.ดร.ศศรส ใจจิตร์', 971, 'IE',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-4', 'วศ.กพส.4/2568', 'การปรับปรุงความแม่นยำของสินค้าคงคลัง : กรณีศึกษาคลังสินค้าอุปกรณ์กีฬา', 'ผศ.ดร.ภัทรพงษ์ ภาคภูมิ', 970, 'IE',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-5', 'วศ.กพส.5/2568', 'การไพโรไลซีสร่วมระหว่างพลาสติกและถ่านไฮโดรชาร์จากพลาสติก', 'ผศ.สวัสดิ์ ภูมิสวัสดิ์', 942, 'ME',
    'ดำเนินการ', 40000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-6', 'วศ.กพส.6/2568', 'Establishing an optimal base-stock level for a periodic review system with a partial replenishment in the face of supply disruption', 'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE',
    'ดำเนินการ', 2000, 0, 'คณะวิศวกรรมศาสตร์กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-7', NULL, 'การออกแบบวางระบบ และทดสอประสิทธิภาพ ระบบการผลิตน้ำดื่ม พระพิรุณตามมาตรฐานกระทรวงสาธารณสุข', 'รศ.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'ดำเนินการ', 0, 3707000, 'ทุนสนับสนุนการวิจัย วิทยาเขตกำแพงแสน ประจำปีงบประมาณ 2568', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-01-01'::date, '2026-01-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-8', NULL, 'การพัฒนาเทคโนโลยีดิจิทัลแพลตฟอร์มของการรวบรวมใบอ้อยเพื่อลดต้นทุนโลจิสติกส์ และส่งเสริมการใช้ประโยชน์พลังงานทดแทนในอุตสาหกรรมอ้อยและน้ำตาลทราย', 'รศ.ดร.กิตติพงษ์ ลาลุน', NULL, 'IE',
    'completed', 0, 0, 'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.) ร่วมกับ บริษัท อินโนวาเทค เอ็นเนอร์ยี่ จำกัด', 'ภายใน', NULL, 'applied',
    '2024-08-31'::date, '2025-08-31'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-9', NULL, 'ระบบการให้น้ำอย่างแม่นยำในสวนมะม่วงน้ำดอกไม้สีทองเพื่อการส่งออกจังหวัดขอนแก่นและจังหวัดชัยภูมิ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'ดำเนินการ', 0, 7658000, 'สำนักงานการวิจัยแห่งชาติ (วช.)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-05-01'::date, '2026-05-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-10', 'วศ.กพส.7/2568', 'การศึกษาคุณลักษณะการถ่ายเทความร้อนและการไหลของการหล่อเย็นภายในใบกังหันก๊าซ (Study of heat transfer and flow characteristics of cooling inside gas turbine blades)', 'ผศ.ดร.คมกฤษณ์ ชัยโย', 952, 'ME',
    'ดำเนินการ', 40000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-06-01'::date, '2026-06-01'::date, 2568, 'TRL1 ดำเนินโครงการเสร็จไป TRL3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-11', 'วศ.กพส. 8/2568', 'การผลิตเชื้อเพลิงทอริไฟด์จาก กากกาแฟ', 'รศ.วิจิตรา ภูมิสวัสดิ์', 947, 'ME',
    'completed', 40000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', NULL, 'applied',
    '2025-05-31'::date, '2026-05-31'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-12', 'วศ.กพส.9/2568', 'การพัฒนาระบบอัตโนมัติสำหรับงานบริการการศึกษาของนิสิตภาควิชาวิศวกรรมเกษตร คณะวิศวกรรมศาสตร์ กำแพงแสน ผ่านไลน์แอปพริเคชันแชทบอท', 'นางพีรดา จิตตา', 1158, 'ME',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-06-01'::date, '2027-06-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-13', 'วศ.กพส.บ.1/2568', 'การอบรมการผลิตกาบกล้วยและถ้วยจากกาบกล้วยและใบไม้เพื่อสร้างมูลค่าเพิ่มจากวัสดุธรรมชาติและลดขยะต้นทาง 2568', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'ดำเนินการ', 30000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-06-15'::date, '2025-12-14'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-14', NULL, 'การประยุกต์ใช้ระบบการจำลองแบบอัตโนมัติสำหรับคาดการณ์ปริมาณความต้องการน้ำชลประทานและปริมาณน้ำท่าผิวดินเพื่อสนับสนุนการบริหารจัดการน้ำในพื้นที่ลุ่มน้ำแม่กลอง', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'ดำเนินการ', 0, 1000000, 'สำนักงานการวิจัยแห่งชาติ (วช.)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-06-01'::date, '2026-06-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-15', NULL, 'การพัฒนาเครื่องวิเคราะห์คุณภาพกากน้ำตาลแลพน้ำเชื่อม แบบพกพาด้วยเทคนิค NIR', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'ดำเนินการ', 0, 2500000, 'บริษัท มิตรผลวิจัย พัฒนาอ้อยและน้ำตาล จำกัด', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-03-01'::date, '2025-06-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-16', NULL, 'การพัฒนาเครื่องวิเคราะห์สีน้ำเชื่อมแบบพกพา สำหรับตรวจวัดคุณภาพในกระบวนการผลิต', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'ดำเนินการ', 0, 300000, 'บริษัท มิตรผลวิจัย พัฒนาอ้อยและน้ำตาล จำกัด', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-03-01'::date, '2025-06-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-17', 'YF(KU)37.68', 'โมเดลคอมพิวเตอร์สำหรับบริหารจัดการฟาร์มโคนม', 'อ.ธีรวัฒน์ หวายฤทธิ์', 993, 'CPE',
    'ดำเนินการ', 300000, 0, 'ทุนอุดหนุนวิจัยเพื่อพัฒนานักวิจัยรุ่นใหม่ มก. ปี 2568', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-07-01'::date, '2026-07-01'::date, 2568, '1) แอปพลิเคชันเพื่อการจัดการโคนมระดับฝูง TRL42) ต้นแบบอุปกรณ์ตรวจวัดพฤติกรรมโคนมรายตัวแบบทันที TRL7 + Heat detection24Hr. 100%3) ต้นแบบเครื่องตรวจสอบสภาพอากาศในฟาร์มโคนม TRL7 + ขาย4) ต้นแบบเครื่องวัดองค์ประกอบน้ำนมดิบด้วยเทคนิค NIRS TRL4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-18', NULL, 'โครงการประมวลความรู้และจัดทำข้อเสนอการบริหารจัดการน้ำลุ่มน้ำแม่กลอง โดยใช้ประโยชน์จากผลงานวิจัย ระยะที่ 2', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'ดำเนินการ', 0, 969000, 'สำนักงานการวิจัยแห่งชาติ (วช.)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-07-01'::date, '2026-07-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-19', 'PRP6805031920', 'การพัฒนาพื้นที่เพื่อเตรียมความพร้อมรับมือกับปัญหาภัยแล้งและปัญหาอุทกภัยในพื้นที่เสี่ยงภัยที่มีความสำคัญทางเศรษฐกิจและสังคม', 'รศ.ดร.สมชาย ดอนเจดีย์', 878, 'IRE',
    'ดำเนินการ', 0, 14500000, 'สำนักงานพัฒนาการวิจัยการเกษตร (องค์การมหาชน)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-07-25'::date, '2026-07-24'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-20', 'วศ.กพส.บ.2/2568', 'การอบรมและสาธิตการใช้เตาประหยัดพลังงานและเตาเบ๊บซี เพื่อเพิ่มมูลค่าน้ำมันพืชใช้แล้วและวัสดุเหลือใช้ทางการเกษตรให้เป็นเชื้อเพลิงความร้อน พ.ศ. 2568', 'นายภัทรพล ชูราศรี', 1008, 'EEEC',
    'ดำเนินการ', 30000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-08-15'::date, '2026-08-15'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-21', 'วศ.กพส.10/2568', 'การวิเคราะห์โครงสร้างจุลภาคของคอนกรีตรีไซเคิลที่ผสมขยะพลาสติกด้วยกล้องจุลทรรศน์อิเล็กตรอนแบบส่องกราด (SEM)', 'รศ.กฤษณะ จันทรโชติ', 929, 'CE',
    'ดำเนินการ', 40000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-08-18'::date, '2026-08-17'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-22', 'วศ.กพส.บ.3/2568', 'การฝึกอบรมเชิงปฏิบัติการการผลิตกระถางเพาะชำจากวัสดุธรรมชาติด้วยเครื่องอัดกระถางแบบมือโยกและไฮดรอลิกเพื่อส่งเสริมเศรษฐกิจหมุนเวียนในระดับชุมชน พ.ศ. 2568', 'นายรัตนศักดิ์ ทรัพย์เย็น', 1007, 'EEEC',
    'ดำเนินการ', 30000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-09-15'::date, '2026-02-14'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-23', NULL, 'การพัฒนาเทคโนโลยีดิจิทัลแพลตฟอร์มของการรวบรวมใบอ้อยเพื่อลดต้นทุนโลจิสติกส์ และส่งเสริมการใช้ประโยชน์พลังงานทดแทนในอุตสาหกรรมอ้อยและน้ำตาลทราย', 'รศ.ดร.กิตติพงษ์ ลาลุน', 1157, 'IE',
    'ดำเนินการ', 0, 6543600, 'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.) ร่วมกับ บริษัท อินโนวาเทค เอ็นเนอร์ยี่ จำกัด', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2024-09-01'::date, '2025-09-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-24', 'วศ.กพส.1/2569', 'การพัฒนาเทคนิคการปรับแก้การสะท้อนแสงสำหรับการสร้างภาพไฮเปอร์สเปกทรัลอินฟราเรดย่านใกล้ของมะพร้าวน้ำหอม', 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 1153, 'AE',
    'ดำเนินการ', 20000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-11-01'::date, '2026-10-31'::date, 2568, 'ก่อน = 2หลัง = 4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-25', 'วศ.กพส.2-2569', 'การเพิ่มประสิทธิภาพของกระพ้อลำเลียงสำหรับการขนถ่ายข้าวเปลือกโดยใช้การจำลองดีอีเอ็ม', 'ผศ.ดร.ปรีดา ปรากฎมาก', 1159, 'ME',
    'ดำเนินการ', 38600, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-11-01'::date, '2026-10-31'::date, 2568, 'ก่อน = 1หลัง = 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-26', NULL, 'ศึกษาวิจัยการวิเคราะห์จุดอ่อนเชิงระบบด้านความมั่นคงปลอดภัยไชเบอร์ของภาคครัฐและกรอบแนวทางการยกระดับขีดความสามารถ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'ดำเนินการ', 0, 14000000, 'สำนักงานการวิจัยแห่งชาติ(วช.)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-11-11'::date, '2026-11-11'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-27', NULL, 'ศึกษาวิจัยการวิเคราะห์จุดอ่อน เชิงระบบด้านความมั่นคงปลอดภัยไชเบอร์ของภาครัฐและกรอบแนวทางการยกระดับขีดความสามารถ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'completed', 0, 0, 'สำนักงานการวิจัย แห่งชาติ(วช.)', 'ภายใน', NULL, 'applied',
    '2025-10-31'::date, '2026-10-31'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-28', NULL, 'การพัฒนาสมบัติทางกลและความทนทานของมอร์ต้าร์ที่รักษาการเสื่อมสภาพด้วยตัวเองโดยการใช้สารสร้างผลึกชนิดต่างๆ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'completed', 0, 0, 'สำนักงานการวิจัย แห่งชาติ(วช.)', 'ภายใน', NULL, 'applied',
    '2026-02-28'::date, '2028-02-29'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-29', NULL, 'ศึกษาวิจัยและสาธิตริเริ่มระบบช่วยติดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE',
    'completed', 0, 0, 'สำนักงานเร่งรัดการวิจัยและนวัตกรรมเพื่อเพิ่มความสามารถการแข่งขันและการพัฒนาพื้นที่ (องค์การมหาชน) กับ บริษัทโอทีเอส เซอร์วิสแอนด์ ซัพพลาย จำกัด', 'ภายใน', NULL, 'applied',
    '2024-10-01'::date, '2025-09-30'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-30', NULL, 'ระบบสนับสนุนการตัดสินใจสำหรับการออกแบบและการเพิ่มประสิทธิภาพอย่างยั่งยืนของเครือข่ายโซ่อุปทานหลังการเก็บเกี่ยวมะพร้าว', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968, 'IE',
    'completed', 20000, 0, 'ทุนอุดหนุนการวิจัย คณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569', 'ภายใน', NULL, 'applied',
    '2026-03-02'::date, '2027-03-02'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-31', NULL, 'การพัฒนาและถ่ายทอดเทคโนโลยีนวัตกรรมระบบควบคุมความปลอดภัยสำหรับปั้นจั่น(เครน)เหนือศีรษะด้วยเทคโนโลยี LiDAR เพื่อยกระดับความปลอดภัยของผู้ปฏิบัติงานและลดความเสี่ยงต่อสาธารณชน', 'อ.ดร.ณัฐพงษ์ สุขสบาย', 953, 'ME',
    'completed', 0, 0, 'สำนักงานการวิจัย แห่งชาติ (วช)', 'ภายใน', NULL, 'applied',
    '2026-03-02'::date, '2027-03-02'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-32', NULL, 'การพัฒนาพื้นที่เพื่อเตรียมความ พร้อมรับมือกับปัญหาภัยแล้งและ ปัญหาอุทกภัย ในพื้นที่เสี่ยงภัยที่มี ความสำคัญทางเศรษฐกิจและ สังคม ปีที่ 2', 'รศ.ดร.สมชาย ดอนเจดีย์', 1004, 'IRE',
    'completed', 0, 0, 'สำนักงานพัฒนาการวิจัย การเกษตร(สวก.)', 'ภายใน', NULL, 'applied',
    '2024-10-01'::date, '2027-04-03'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-33', NULL, 'การใช้เทคโนโลยีจัดการน้ำ-ปุ๋ยและจัดการผลิตมะม่วงน้ำดอกไม้สีทองที่เหมาะสมในพื้นที่ประสบภัยแล้งจังหวัดขอนแก่นและชัยภูมิเพื่อการส่งออกและผลิตนอกฤดู', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'completed', 0, 0, 'สำนักงานการวิจัยแห่งชาติ(วช.)', 'ภายใน', NULL, 'applied',
    '2026-04-03'::date, '2027-04-03'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-34', NULL, 'การพัฒนาระบบสารสนเทศเพื่อ ปรับปรุงกระบวนการติดตามและ วิเคราะห์ผลการดำเนินโครงการที่ เชื่อมโยงกับแผนยุทธศาสตร์ด้าน กิจการนิสิต: กรณีศึกษา มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน', 'ผศ.อธิวัฒน์ บุญมี', 963, 'IE',
    'completed', 20000, 0, 'ทุนอุดหนุนการวิจัย คณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569', 'ภายใน', NULL, 'applied',
    '2026-04-03'::date, '2027-04-03'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-35', NULL, 'ศึกษาวิจัยและสาธิตเริ่มระบบช่วยตัดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE',
    'completed', 0, 0, 'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ(บพช)', 'ภายใน', NULL, 'applied',
    '2026-05-04'::date, '2027-04-03'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res-2569-04-01', 'PRP6805031920', 'การพัฒนาพื้นที่เพื่อเตรียมความพร้อมรับมือกับปัญหาภัยแล้งและปัญหาอุทกภัยในพื้นที่เสี่ยงภัยที่มีความสำคัญทางเศรษฐกิจและสังคม', 'รศ.ดร.สมชาย ดอนเจดีย์', 878, 'IRE',
    'ดำเนินการ', 0, 14500000, 'สำนักงานพัฒนาการวิจัยการเกษตร (องค์การมหาชน)', 'ภายนอก', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-07-25'::date, '2026-07-24'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

INSERT INTO research_projects (
    legacy_id, code, name, head_name, head_personnel_id, head_department_code,
    status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature,
    start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at
) VALUES (
    'res________8_2568', 'วศ.กพส.8/2568', 'การผลิตเชื้อเพลิงทอริไฟด์จากกากกาแฟ', 'รศ.วิจิตรา ภูมิสวัสดิ์', 947, 'ME',
    'ดำเนินการ', 40000, 0, 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'ภายใน', 'ในประเทศ', 'สร้างความเข้มแข็ง',
    '2025-06-01'::date, '2026-06-01'::date, 2568, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget_internal = EXCLUDED.budget_internal,
    budget_external = EXCLUDED.budget_external,
    fiscal_year = 2568;

-- ----------------------------------------------------------------------------
-- Section 2: โครงการพัฒนาวิชาการ ประจำปีงบประมาณ 2568 (73 รายการ)
-- ----------------------------------------------------------------------------
INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-1', 'จ้างบำรุงรักษาระบบทะเบียนผู้ฝึกอาชีพ (JOB.DIPROM) ประจำปีงบประมาณ พ.ศ. 2568', 'ผศ.ดร.จักกริช พฤษการ', 986, 'CPE', 'กรมส่งเสริมอุตสาหกรรม', 420000,
    'มกราคม', 2568, '2025-01-15'::date, '2026-01-15'::date, NULL, NULL,
    '00307/68', 1, 0, 21000, 21000,
    21000, 294000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-2', 'โครงการพัฒนาระบบสารสนเทศในการรวบรวมสำรวจและประเมินศักยภาพเอสเอ็มอี เพื่อใช้ในการพิจารณาสินเชื่อเบื้องต้น ปีงบประมาณ พ.ศ. 2568', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'สำนักงานปลัดกระทรวงอุตสาหกรรม', 5000000,
    'มกราคม', 2568, '2025-01-16'::date, '2026-01-16'::date, '2025-06-02'::date, '2025-11-25'::date,
    '00391/68', 10, 0, 250000, 250000,
    250000, 3500000, '2207351Computer Application', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-3', 'โครงการระบบการออกเอกสารในรูปแบบอิเล็กทรอนิกส์ของกรมโรงงานอุตสาหกรรม ระยะที่ ๓ (DIW Electronic Document Phase ๓ ) แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร ๑ ระบบ', 'ผศ.ดร.จักกริช พฤษการ', 986, 'CPE', 'กรมโรงงานอุตสาหกรรม', 13500000,
    'มกราคม', 2568, '2025-02-25'::date, '2026-07-27'::date, NULL, NULL,
    '00394/68', 10, 20, 675000, 675000,
    675000, 9450000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-4', 'ค่าใช้จ่ายในการศึกษาเพื่อพัฒนาหลักเกณฑ์การดำเนินการเกี่ยวกับสัมปทานประกอบกิจการประปา', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมทรัพยากรน้ำ', 7860000,
    'มกราคม', 2568, '2025-01-16'::date, '2026-01-15'::date, '2025-08-01'::date, '2025-12-30'::date,
    '00395/68', 8, 1, 393000, 393000,
    393000, 5502000, '2207424วิศวกรรมการประปา', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-5', 'กิจกรรมการพัฒนาเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์สำหรับอุตสาหกรรมอาหารภายใต้โครงการซอฟต์พาวเวอร์ สาขาอาหาร ปีงบประมาณ พ.ศ. 2568', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมส่งเสริมอุตสาหกรรม', 3990000,
    'มกราคม', 2568, '2025-01-22'::date, '2026-12-31'::date, NULL, NULL,
    '00421/68', 7, 0, 199500, 199500,
    199500, 2793000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-6', 'ให้คำปรึกษาการออกแบบและสร้างระบบบ้าน Eco-houses แบบพึ่งพาพลังงานตัวเอง (โซล่าเซลล์) สำหรับรองรับอุทกภัย', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT', 'บริษัท ทรีดี เอนเนอร์จี จำกัด', 200000,
    'มกราคม', 2568, '2025-02-01'::date, '2027-01-31'::date, NULL, NULL,
    '00432/68', 1, 1, 10000, 10000,
    10000, 140000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-7', 'จ้างที่ปรึกษาโครงการระบบเชื่อมโยงข้อมูลเพื่อรองรับการดำเนินการทางอิเล็กทรอนิกส์ภายใต้อนุสัญญาบาเซล แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมโรงงานอุตสาหกรรม', 9000000,
    'มกราคม', 2568, '2025-01-02'::date, '2025-10-31'::date, NULL, NULL,
    '00442/68', 10, 5, 450000, 450000,
    450000, 6300000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-8', 'โครงการศึกษาจัดทำแผนแม่บทการบริหารจัดการทรัพยากรน้ำ ในเขตลุ่มน้ำท่าจีน ปรับปรุงช่วงที่ 1 (พ.ศ.2566 - 2580)', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 18594000,
    'กรกฎาคม', 2568, '2025-06-26'::date, '2026-12-31'::date, '2025-02-03'::date, '2026-12-31'::date,
    '01047/68', 13, 2, 929700, 929700,
    929700, 13015800, '2207441การจัดการโครงการแหล่งน้ำ', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-9', 'โครงการศึกษาจัดทำแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ปรับปรุงช่วงที่ 1 (พ.ศ.2566-2580)', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 18340000,
    'กรกฎาคม', 2568, '2025-06-26'::date, '2026-12-31'::date, '2025-01-29'::date, '2026-12-31'::date,
    '01046/68', 15, 2, 917000, 917000,
    917000, 12838000, '02207431Feasibility and EIA', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-10', 'โครงการผลิตต้นไม้ป่าขุดล้อมขนาดเล็กคืนสู่แผ่นดิน', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT', 'เจ้าของกิจการปลูกและขายต้นไม้ป่าทั่วไป', 350000,
    'กันยายน', 2568, '2025-09-04'::date, '2028-07-31'::date, NULL, NULL,
    '01159/68', 2, 1, 17500, 17500,
    17500, 245000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-11', 'โครงการค่าใช้จ่ายในการพัฒนาระบบตรวจวัดปริมาณน้ำเก็บกักในแหล่งน้ำขนาดเล็กพื้นที่ภาคตะวันออกเฉียงเหนือ ระยะที่ 3 เพื่อการพัฒนาศักยภาพการเก็บกักและบริหารจัดการทรัพยากรน้ำ กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมทรัพยากรน้ำ', 20000000,
    'กุมภาพันธ์', 2568, '2025-02-17'::date, '2026-03-31'::date, '2025-06-02'::date, '2025-10-31'::date,
    '00499/68', 10, 3, 1000000, 1000000,
    1000000, 14000000, '02207311Engineering Hydrology', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-12', 'ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ครั้งที่ 2', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT', 'หน่วยงานภาครัฐ และ เอกชน ที่เกี่ยวกับมาตรฐานประตู หน้าต่าง', 500000,
    'มิถุนายน', 2568, '2025-06-20'::date, '2025-12-31'::date, NULL, NULL,
    '00918/68', 0, 0, 25000, 25000,
    25000, 350000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-13', 'โครงการทดสอบคุณสมบัติมอร์ต้าร์ ของบริษัท คอร์มิกซ์ อินเตอร์เนชั่นแนล จำกัด', 'อ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 'บริษัท คอร์มิกซ์ อินเตอร์เนชั่นแนล จำกัด', 21600,
    'มีนาคม', 2568, '2025-03-15'::date, '2026-02-28'::date, NULL, NULL,
    '00555/68', 2, 0, 1080, 1080,
    1080, 15120, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-14', 'การออกแบบระบบควบคุมอัตโนมัติและวิเคราะห์ข้อมูล', 'รศ.ดร.ธนา ชีพสมทรง', 944, 'ME', 'ผู้ประกอบการ', 32000,
    'มีนาคม', 2568, '2025-03-28'::date, '2026-03-27'::date, NULL, NULL,
    '00620/68', 0, 0, 1600, 1600,
    1600, 22400, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-15', 'หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต', 'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE', 'บริษัท มิตรผลพัฒนา จำกัด', 1358823.53,
    'เมษายน', 2568, '2025-04-04'::date, '2026-11-06'::date, NULL, NULL,
    '00672/68', 20, 3, 67941.18, 67941.18,
    67941.18, 951176.47, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-16', 'การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'บริษัท อายิโนะโมะโต๊ะ จำกัด', 6793588,
    'พฤษภาคม', 2568, '2025-03-03'::date, '2026-02-28'::date, '2025-03-03'::date, '2026-02-28'::date,
    '00791/68', 8, 1, 339679.4, 339679.4,
    339679.4, 4755511.6, 'water resource management project02207441', NULL, NULL, 'ขอมอบอำนาจย้อนหลัง', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-17', 'การศึกษาพฤติกรรมการไหลของของไหลสำหรับอุปกรณ์แลกเปลี่ยนความร้อนแบบท่อ Vortex', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME', 'บริษัท สแกน อินเตอร์ จำกัด (มหาชน)', 50600,
    'พฤษภาคม', 2568, '2025-04-01'::date, '2025-09-30'::date, '2025-06-23'::date, '2026-03-13'::date,
    '00720/68', 1, 0, 2530, 2530,
    2530, 35420, 'การจัดการและเศรษฐศาสตร์ของพลังงาน01208442', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-18', 'โครงการทดสอบคุณสมบัติคอนกรีตในงานก่อสร้างจุดตัดทางหลวงหมายเลข 367 ของ บริษัท ยงคอนกรีต จำกัด (มหาชน)', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 'บริษัท ยงคอนกรีต จำกัด (มหาชน)', 63529.41,
    'พฤษภาคม', 2568, '2025-05-15'::date, '2026-03-31'::date, NULL, NULL,
    '00769/68', 2, 0, 3176.47, 3176.47,
    3176.47, 44470.59, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-19', 'จ้างบำรุงรักษาระบบข้อมูลเพื่อรองรับการขับเคลื่อนการใช้ประโยชน์ข้อมูลขนาดใหญ่', 'ผศ.ดร.จักกริช พฤษการ', 986, 'CPE', 'กรมส่งเสริมอุตสาหกรรม', 350000,
    'มิถุนายน', 2568, '2022-07-01'::date, '2026-01-30'::date, NULL, NULL,
    '00881/68', 2, 0, 17500, 17500,
    17500, 245000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-20', 'โครงการก่อสร้างถังเก็บน้ำใส 70,000 ลบ.ม.สถานีสูบน้ำมินบุรี ของ บริษัท วงษ์สยามก่อสร้าง จำกัด', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 'บริษัท วงษ์สยามก่อสร้าง จำกัด', 36000,
    'มิถุนายน', 2568, '2025-06-25'::date, '2025-11-30'::date, NULL, NULL,
    '00905/68', 2, 0, 1800, 1800,
    1800, 25200, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-21', 'ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ครั้งที่ 2', 'ผศ.ดร.วัชมา โพธิ์ทอง', 1014, 'DWT', 'ไม่ระบุผู้ว่าจ้าง', 500000,
    'มิ.ย.68', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-22', 'โครงการพัฒนาสื่อสร้างสรรค์ เสริมภาพลักษณ์องค์กรสู่ยุคดิจิทัล', 'นางสาวศศิธร ชลรัตน์อมฤต', 1105, 'OFS', 'หน่วยงานภาครัฐ/เอกชน/ผู้สนใจทั่วไป/ชุมชนภายนอก/บุคลากรและนิสิตทั่วไป', 250000,
    'กรกฎาคม', 2568, '2025-06-26'::date, '2026-06-25'::date, NULL, NULL,
    '00932/68', 5, 0, 12500, 12500,
    12500, 175000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-23', 'การทดสอบสมรรถนะอุปกรณ์ตัดหญ้าไหล่ทาง', 'ดร.นิติรงค์ พงษ์พานิช', 1090, 'NAMC', 'หน่วยงานภาครัฐ รัฐวิสาหกิจ ภาคเอกชน', 43700,
    'กรกฎาคม', 2568, '2025-07-01'::date, '2026-06-30'::date, NULL, NULL,
    '01072/68', 1, 0, 2185, 2185,
    2185, 30590, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-24', 'โครงการการออกแบบและปฏิบัติการให้น้ำแก่แปลงข้าวโพดขนาดใหญ่ด้วยระบบน้ำหยดแบบ Inline dripper (Low tape drip)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)', 25450,
    'กันยายน', 2568, '2025-09-04'::date, '2025-12-03'::date, NULL, NULL,
    '01212/68', 3, 0, 1272.5, 1272.5,
    1272.5, 17815, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-25', 'โครงการจัดทำแผนปรับปรุงและบำรุงรักษาอาคารและระบบชลประทาน ส่วนปรับปรุงบำรุงรักษา แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 4990000,
    'กันยายน', 2568, '2025-09-05'::date, '2026-12-31'::date, '2025-11-17'::date, '2026-03-31'::date,
    '01216/68', 9, 0, 249500, 249500,
    249500, 3493000, 'หลักวิศวกรรมชลประทาน02207111', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-26', 'โครงการศึกษางานซ่อมถังน้ำคอนกรีตขนาดใหญ่โดยใช้วัสดุซ่อมแซมสมรรถนะสูง แบบเทและฉาบ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 'การประปานครหลวง', 2226210,
    'กันยายน', 2568, '2025-09-15'::date, '2026-09-29'::date, '2025-12-08'::date, '2026-03-20'::date,
    '01201/68', 2, 0, 111310.5, 111310.5,
    111310.5, 1558347, 'Structural Damage and Rehabilitation203422', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-27', 'โครงการให้บริการทดสอบเครื่องยนต์ขนาดเล็กและน้ำมันเชื้อเพลิง ปีงบประมาณ 2569', 'นายพิสิษฐ์ อินทรวิรัตน์', 1155, 'NAMC', 'หน่วยงานภาครัฐ/รัฐวิสาหกิจ บริษัทเอกชน และประชาชนทั่วไปผู้สนใจ', 80000,
    'กันยายน', 2568, '2025-10-01'::date, '2026-09-30'::date, NULL, NULL,
    '01220/68', 2, 0, 4000, 4000,
    4000, 56000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-28', 'โครงการการทดสอบเครื่องจักรกลการเกษตร', 'นายทิตินัย เทียนแย้ม', 1093, 'NAMC', 'หน่วยงานภาครัฐ/รัฐวิสาหกิจ บริษัทเอกชน และประชาชนทั่วไปผู้สนใจ', 100000,
    'ตุลาคม', 2568, '2025-10-01'::date, '2026-09-30'::date, NULL, NULL,
    '00020/69', 2, 0, 5000, 5000,
    5000, 70000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-29', 'โครงการให้บริการด้านการพัฒนา ผลิตเครื่องมือเครื่องจักร และสิ่งประดิษฐ์ด้านการเกษตร พลังงานและสิ่งแวดล้อม (ปี 2569)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'หน่วยงานภาครัฐ/รัฐวิสาหกิจ บริษัทเอกชน และประชาชนทั่วไปผู้สนใจ', 300000,
    'ตุลาคม', 2568, '2025-10-01'::date, '2026-09-30'::date, '2025-10-01'::date, '2026-09-30'::date,
    '00029/69', 5, 1, 15000, 15000,
    15000, 210000, '02201495การเตรียมโครงงานวิศวกรรมเกษตร02201499โครงงานวิศวกรรมเกษตร', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-30', 'การอบรมเชิงปฏิบัติการและการทดสอบชุดสูบน้ำระบบไฮดรอลิคแบบปรับช่วงการทำงานประสิทธิภาพสูงขนาดใหญ่เพื่อการใช้งานด้านการบริหารและการจัดการน้ำในประเทศ', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT', 'บริษัท ฟิวเจอร์ ไลน์ โซลูชั่น', 200000,
    'ตุลาคม', 2568, '2025-12-01'::date, '2026-09-30'::date, NULL, NULL,
    '00042/69', 4, 0, 10000, 10000,
    10000, 140000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-31', 'โครงการให้บริการด้านการออกแบบ ติดตั้ง และพัฒนาเครื่องจักร อุปกรณ์ ที่เกี่ยวข้องกับการผลิตพลังงานทดแทน (ปี 2569)', 'ดร.อรรถวุทธิ์ รื่นเริงใจ', 1005, 'EEEC', 'ภาครัฐ เอกชน และประชาชน/ผู้สนใจทั่วไป', 1000000,
    'ตุลาคม', 2568, '2025-10-01'::date, '2026-09-30'::date, NULL, NULL,
    '00076/69', 5, 1, 50000, 50000,
    50000, 700000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-32', 'จ้างจัดหาระบบควบคุมประตูระบายน้ำจากระยะไกลในพื้นที่สำนักงานชลประทานที่ 10 ตำบลเขาพระงาม อำเภอเมืองลพบุรี จังหวัดลพบุรี', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 10 กรมชลประทาน', 24538000,
    'ตุลาคม', 2568, '2025-10-10'::date, '2028-07-30'::date, '2026-11-02'::date, '2027-04-30'::date,
    '00082/69', 5, 7, 300000, 300000,
    300000, 22738000, '02207545Flood Forecasting and Warning System', NULL, NULL, 'ค่าครุภัณฑ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-33', 'จ้างจัดหาระบบควบคุมระยะไกลของ ปตร.มหาราชและอาคารประกอบ สำนักงานชลประทานที่ 10 ตำบลตลุก อำเภอสรรพยา จังหวัดชัยนาท', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'สำนักงานชลประทานที่ 10 กรมชลประทาน', 24854700,
    'ตุลาคม', 2568, '2025-10-10'::date, '2028-07-30'::date, '2026-11-02'::date, '2027-04-30'::date,
    '00083/69', 5, 7, 300000, 300000,
    300000, 23054700, '02207545Flood Forecasting and Warning System', NULL, NULL, 'ค่าครุภัณฑ์', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-34', 'จ้างบริการบำรุงรักษาและซ่อมแซมแก้ไขคอมพิวเตอร์ ระบบสารสนเทศตามพระราชบัญญัติวัตถุอันตราย พ.ศ. 2535 ปีงบประมาณ พ.ศ. 2569', 'อาจารย์พฤษพล ตั้งสัจจะธรรม', 992, 'CPE', 'กรมโรงงานอุตสาหกรรม กระทรวงอุตสาหกรรม', 499200,
    'ตุลาคม', 2568, '2025-10-01'::date, '2026-12-30'::date, NULL, NULL,
    '00086/69', 2, 0, 24960, 24960,
    24960, 349440, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-35', 'โครงการทดสอบวัสดุทางวิศวกรรมโยธา ประจำปีงบประมาณ พ.ศ. 2569', 'รศ.กฤษณะ จันทรโชติ', 929, 'CE', 'ภาครัฐ เอกชน และประชาชน/ผู้สนใจทั่วไป', 1000000,
    'ตุลาคม', 2568, '2025-11-01'::date, '2026-10-31'::date, '2025-11-01'::date, '2026-03-31'::date,
    '00120/69', 17, 0, 50000, 50000,
    50000, 700000, '02232232การทดสอบวัสดุวิศวกรรมโยธาและการก่อสร้าง', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-36', 'โครงการให้บริการตรวจสอบเสถียรภาพของอาคาร 9 ประเภท', 'อ.ธิติพงศ์ โพธิสุทธิ์', 908, 'NAMC', 'หน่วยงานภาครัฐ รัฐวิสาหกิจ ภาคเอกชน เจ้าของอาคาร และอื่นๆ', 500000,
    'พฤศจิกายน', 2568, '2025-11-01'::date, '2026-09-30'::date, NULL, NULL,
    '00142/69', 25, 0, 25000, 25000,
    25000, 350000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-37', 'โครงการพัฒนาแนวทางการประเมินประสิทธิผลและความคุ้มค่าของงานอำนวยความปลอดภัยทางหลวง 1 โครงการ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'กรมทางหลวง', 20000000,
    'พฤศจิกายน', 2568, '2025-11-12'::date, '2027-06-30'::date, NULL, NULL,
    NULL, 4, 0, 1000000, 1000000,
    1000000, 14000000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-38', 'โครงการขับเคลื่อนภาคอุตสาหกรรมสู่การเปลี่ยนผ่านการผลิตที่ยั่งยืนและยกระดับความสามารถในการแข่งขันด้วยเทคโนโลยีหรือนวัตกรรม', 'ผศ.ดร.หทัยเทพ วงศ์สุวรรณ', 945, 'ME', 'สํานักงานเศรษฐกิจอุตสาหกรรม กระทรวงอุตสาหกรรม', 6190200,
    'พฤศจิกายน', 2568, '2025-11-13'::date, '2026-11-12'::date, '2025-06-22'::date, '2027-03-30'::date,
    NULL, 0, 8, 309510, 309510,
    309510, 4333140, '01208478การตรวจสอบและวิเคราะห์การสั่น01208476การเรียนรู้ของเครื่องสำหรับวิศวกรรมเครื่องกล', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-39', 'ค่าใช้จ่ายในการพัฒนาระบบแบบจำลองทางคณิตศาสตร์เพื่อการพยากรณ์น้ำฝน-น้ำท่าของพื้นที่ลุ่มน้ำประเทศไทย กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมทรัพยากรน้ำ', 18100000,
    'พฤศจิกายน', 2568, '2025-09-22'::date, '2026-12-31'::date, '2025-09-23'::date, '2026-09-30'::date,
    NULL, 10, 3, 869785, 869785,
    869785, 12881290, '02207351Computer Application for Irrigation Engineering', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-40', 'โครงการวิเคราะห์ข้อมูลเพื่อบูรณาการข้อมูลสำหรับการประเมินผลด้านทรัพยากรน้ำของประเทศ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'บริษัท คลิกเกอร์แล็บ จำกัด', 8000000,
    'พฤศจิกายน', 2568, '2025-09-24'::date, '2026-12-31'::date, '2025-09-25'::date, '2026-05-29'::date,
    NULL, 0, 0, 400000, 400000,
    400000, 5600000, '02207542Project Planning and Assessment', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-41', 'โครงการวิเคราะห์และจัดทำชุดความรู้การบริหารจัดการทรัพยากรน้ำระดับชุมชน', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 2500000,
    'พฤศจิกายน', 2568, '2025-10-01'::date, '2026-09-30'::date, '2025-10-01'::date, '2026-04-10'::date,
    NULL, 7, 0, 125000, 125000,
    125000, 1750000, '02207441Management of WRP', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-42', 'จ้างที่ปรึกษาโครงการระบบติดตามและควบคุมการครอบครองของเสียเคมีวัตถุ แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'กรมโรงงานอุตสาหกรรม', 10000000,
    'พฤศจิกายน', 2568, '2025-10-15'::date, '2026-10-15'::date, '2025-10-15'::date, '2026-10-15'::date,
    NULL, 7, 0, 500000, 500000,
    500000, 7000000, 'การออกแบบระบบสารสนเทศเพื่อติดตามและควบคุมการครอบครองของเสียเคมีวัตถุ', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-43', 'โครงการระบบการอนุญาตวัตถุอันตรายเพื่ออำนวยความสะดวกด้านการค้าการลงทุน แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ', 'ผศ.ดร.จักกริช พฤษการ', 986, 'CPE', 'กรมโรงงานอุตสาหกรรม', 20000000,
    'พฤศจิกายน', 2568, '2025-10-15'::date, '2026-10-15'::date, NULL, NULL,
    NULL, 13, 20, 1000000, 1000000,
    1000000, 14000000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-44', 'จ้างที่ปรึกษาโครงการปรับปรุงระบบเฝ้าระวังและเตือนภัยมลพิษระยะไกล (D-POMS) แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมโรงงานอุตสาหกรรม', 15000000,
    'พฤศจิกายน', 2568, '2025-10-01'::date, '2026-12-31'::date, '2025-11-24'::date, '2026-10-09'::date,
    NULL, 7, 4, 750000, 750000,
    750000, 10500000, '02207431Feasibility Study and Environment Impact Assessment', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-45', 'โครงการศึกษาจัดทำคู่มือแนวทางการบริหารจัดการน้ำในภาวะวิกฤติ (ตามมาตรา 24)', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 2000000,
    'พฤศจิกายน', 2568, '2025-11-10'::date, '2029-12-31'::date, '2025-10-01'::date, '2026-12-31'::date,
    NULL, 6, 1, 100000, 100000,
    100000, 1400000, '02207441Management of Water resources Project', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-46', 'โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 2990000,
    'พฤศจิกายน', 2568, '2025-11-24'::date, '2026-10-09'::date, '2025-10-01'::date, '2026-12-31'::date,
    NULL, 6, 1, 149500, 149500,
    149500, 2093000, '02207311Engineering Hydrology', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-47', 'ค่าใช้จ่ายในการจัดทำกลยุทธ์การกำหนดนโยบายและความร่วมมือด้านพลังงานของประเทศเพื่อรองรับการเปลี่ยนแปลงในระยะยาว', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'สำนักงานนโยบายและแผนพลังงาน', 1360000,
    'พฤศจิกายน', 2568, '2025-10-10'::date, '2026-10-31'::date, NULL, NULL,
    NULL, 5, 0, 68000, 68000,
    68000, 952000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-48', 'ค่าใช้จ่ายในการประเมิน วางแผน จัดทำนโยบายธรรมาภิบาลข้อมูล (Data Governance) กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 21864368,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-49', 'โครงการสนับสนุนการขับเคลื่อนภาคอุตสาหกรรมเพื่อการเติบโตที่ส่งผลต่อระบบเศรษฐกิจของประเทศ (กิจกรรมส่งเสริมการลงทุนเพื่อการขยายตัวภาคอุตสาหกรรมแห่งอนาคตและเศรษฐกิจหมุนเวียน)', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 8499528,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-50', 'จ้างติดตั้งและจัดทำระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ พื้นที่ฝั่งขวาแม่น้ำยม สำหรับงานเพิ่มประสิทธิภาพการบริหารจัดการน้ำฝั่งขวาแม่น้ำยมในเขตอำเภอบางระกำ จังหวัดพิษณุโลก ด้วยระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 15043000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-51', 'โครงการบริการวิเคราะห์เเก๊สเรือนกระจกด้วยเครื่อง Gas chromatography พ.ศ. 2569', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 900000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-52', 'ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ประจำปี 2569', 'ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 1015, 'DWT', 'ไม่ระบุผู้ว่าจ้าง', 1000000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-53', 'จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 1 ตำบลชุมแพ อำเภอชุมแพ จังหวัดขอนแก่น', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 24870300,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-54', 'จ้างจัดทำและติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำ สำหรับงานโครงการติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำในโครงการส่งน้ำและบำรุงรักษาหนองหวาย (แม่น้ำชี) ตำบลน้ำพอง อำเภอน้ำพอง จังหวัดขอนแก่น', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 24900000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-55', 'จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 2 ตำบลบ้านยาง อำเภอเกษตรสมบูรณ์ จังหวัดชัยภูมิ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 24461600,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-56', 'จ้างจัดทำโครงการพัฒนาระบบปัญญาประดิษฐ์ในการช่วยสนับสนุนการตัดสินใจในการบริหารจัดการน้ำของอ่างเก็บน้ำคลองกะทะ ตำบลฉลอง อำเภอเมืองภูเก็ต จังหวัดภูเก็ต', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 15637800,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-57', 'ค่าใช้จ่ายในการศึกษาและจัดทำหลักเกณฑ์ มาตรฐานเครื่องวัดน้ำหรือประเมินปริมาณน้ำที่ใช้เพื่อเพิ่มประสิทธิภาพการควบคุมการใช้ทรัพยากรน้ำสาธารณะที่มิใช่น้ำจากทางน้ำชลประทาน กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 4847000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-58', 'โครงการวิเคราะห์และจัดทำชุดความรู้การบริหารจัดการทรัพยากรน้ำชุมชน', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 2595440,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-59', 'จ้างที่ปรึกษาทบทวนแบบก่อสร้างศูนย์บริหารจัดการคุณภาพน้ำ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 335000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-60', 'โครงการประเมินปริมาณน้ำเสียชุมชนเพื่อการวางแผนระบบบำบัดน้ำเสียอย่างยั่งยืน', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 481000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-61', 'โครงการศึกษาความเหมาะสมและผลกระทบสิ่งแวดล้อม จัดหาแหล่งกักเก็บน้ำ อาคารประกอบ และโครงข่ายน้ำสำหรับใช้ในโครงการศูนย์ธุรกิจ EEC และเมืองใหม่น่าอยู่อัจฉริยะ จังหวัดชลบุรี', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 24000000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-62', 'จ้างจัดหาระบบควบคุมระยะไกลของประตูระบายน้ำพระเอกาทศรถ สำนักงานก่อสร้างชลประทานขนาดใหญ่ที่ 11 สำนักพัฒนาแหล่งน้ำขนาดใหญ่ กรมชลประทาน', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 15000000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-63', 'โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท วัสดุภัณฑ์ธุรกิจ จำกัด)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'ไม่ระบุผู้ว่าจ้าง', 350000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-64', 'โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท กลุ่ม 79 จำกัด)', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 'ไม่ระบุผู้ว่าจ้าง', 350000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-65', 'โครงการวิจัยและพัฒนาท่อโค้งและท่อสามทางซีเมนต์ใยหินไฮบริดชนิดทนความดันพลัส (HAC Plus)', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 150000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-66', 'งานจ้างศึกษาเบื้องต้นการตรวจสอบสภาพโครงสร้างคอนกรีตของเขื่อนเจ้าพระยาและการประเมินสภาพความเสียหายที่จะก่อให้เกิดการพังทลายในรูปแบบต่างๆ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 127500,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-67', 'โครงการสำรวจและออกแบบรายละเอียดสถานีสูบน้ำหนองปลาไหล แห่งที่ 4 เพื่อทดแทนสถานีสูบน้ำหนองปลาไหล 2 สถานีสูบน้ำหนองปลาไหล 3', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 3900000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-68', 'การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'บริษัท อายิโนะโมะโต๊ะ จำกัด', 6793588,
    'พฤษภาคม', 2568, '2025-03-03'::date, '2026-02-28'::date, '2025-03-03'::date, '2026-02-28'::date,
    '00791/68', 8, 1, 339679.4, 339679.4,
    339679.4, 4755511.6, 'water resource management project02207441', NULL, NULL, 'ขอมอบอำนาจย้อนหลัง', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-69', 'การจ้างดำเนินงานโครงการการประเมินผลสัมฤทธิ์โครงการของกรมทรัพยากรน้ำ กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร ประจำปีงบประมาณ พ.ศ. 2569', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'ไม่ระบุผู้ว่าจ้าง', 500000,
    '2-โครงการพัฒนาวิชาการ', 2568, '2024-10-01'::date, '2025-09-30'::date, NULL, NULL,
    NULL, 0, 0, 0, 0,
    0, 0, NULL, NULL, NULL, 'completed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-2569-01-01', 'โครงการพัฒนาแนวทางการประเมินประสิทธิผลและความคุ้มค่าของงานอำนวยความปลอดภัยทางหลวง 1 โครงการ', 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 'กรมทางหลวง', 20000000,
    'พฤศจิกายน', 2568, '2025-11-12'::date, '2027-06-30'::date, NULL, NULL,
    NULL, 4, 0, 1000000, 1000000,
    1000000, 14000000, NULL, NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-2569-02-02', 'โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 2990000,
    'พฤศจิกายน', 2568, '2025-11-24'::date, '2026-10-09'::date, '2025-10-01'::date, '2026-12-31'::date,
    NULL, 6, 1, 149500, 149500,
    149500, 2093000, '02207311Engineering Hydrology', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-2569-02-10', 'โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 'กรมชลประทาน', 2990000,
    'พฤศจิกายน', 2568, '2025-11-24'::date, '2026-10-09'::date, '2025-10-01'::date, '2026-12-31'::date,
    NULL, 6, 1, 149500, 149500,
    149500, 2093000, '02207311Engineering Hydrology', NULL, NULL, 'อนุมัติ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

INSERT INTO academic_dev_projects (
    legacy_id, name, head_name, head_personnel_id, department_code, client, budget,
    month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date,
    record_number, co_members_internal, co_members_external, alloc_faculty, alloc_dept,
    alloc_ku, alloc_remaining, research_integration, patent_integration, characteristics, status, created_at, updated_at
) VALUES (
    'acad-2569-04-01', 'การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 'บริษัท อายิโนะโมะโต๊ะ จำกัด', 6793588,
    'พฤษภาคม', 2568, '2025-03-03'::date, '2026-02-28'::date, '2025-03-03'::date, '2026-02-28'::date,
    '00791/68', 8, 1, 339679.4, 339679.4,
    339679.4, 4755511.6, 'water resource management project02207441', NULL, NULL, 'ขอมอบอำนาจย้อนหลัง', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    budget = EXCLUDED.budget,
    fiscal_year = 2568;

-- ----------------------------------------------------------------------------
-- Section 3: งานทรัพย์สินทางปัญญา ประจำปีงบประมาณ 2568 (9 รายการ)
-- ----------------------------------------------------------------------------
INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-1', 'อุปกรณ์ผลิตลูกปูน', 'อนุสิทธิบัตร', 'รศ.ดร.นันทวัฒน์ ขมหวาน,รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    '2303000652', '22823', '2023-03-08'::date, '2023-11-23'::date, '2029-03-07'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', 'เบิกเงินสนับสนุนในส่วนของภาควิชาแล้ว5,000.00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-2', 'อุปกรณ์วัดความกรอบของเนื้อมะละกอผลดิบ', 'อนุสิทธิบัตร', 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล,นายวิชัย หมอยาดี', 1153, 'AE',
    '2303003816', '24730', '2023-12-26'::date, '2024-11-01'::date, '2029-12-25'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-3', 'เครื่องนึ่งและอบแห้งข้าวเปลือกด้วยเทคนิคฟลูอิไดซ์เบดสั่นร่วมกับการใช้ไอน้ำร้อนยวดยิ่ง', 'อนุสิทธิบัตร', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์,นางสาวพรพรรณ จิอู๋', 1156, 'FE',
    '2203002402', '24939', '2022-09-15'::date, '2024-12-17'::date, '2028-09-14'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-4', 'รถเข็นสี่ล้อเพื่อการเกษตรขับเคลื่อนด้วยระบบไฟฟ้า', 'อนุสิทธิบัตร', 'รศ.ดร. ศิวลักษณ์ ปฐวีรัตน์และคณะ', 847, 'AE',
    '2303003200', '24938', '2023-10-30'::date, '2024-12-17'::date, '2029-10-30'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-5', 'เครื่องกำจัดโลหะฟอสไฟต์ตกค้างในเศษเถ้าสารรม', 'อนุสิทธิบัตร', 'รศ.ดร.วัชรพล ชยประเสริฐและคณะ', 851, 'AE',
    '2203002196', '24733', '2022-09-01'::date, '2024-11-01'::date, '2028-08-31'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-6', 'Precast concrete with sacrificial anode cathodic protection', 'สิทธิบัตร', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE',
    'WO 2025/075554A1', 'WO 2025/075554A1', '2023-10-05'::date, '2025-04-10'::date, '2045-04-09'::date,
    20000, 2568, 'ได้รับความคุ้มครอง', 'เบิกเงินสนับสนุนจากภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-7', 'เครื่องกำจัดวัชพืชด้วยเปลวไฟสำหรับติดท้ายรถแทรกเตอร์', 'อนุสิทธิบัตร', 'รศ.ดร.ประเทือง อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์ ปั้นมยุรา', 845, 'AE',
    '2303002822', '25468', '2023-09-28'::date, '2025-03-27'::date, '2029-09-27'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-8', 'เครื่องกำจัดวัชพืชด้วยน้ำร้อนสำหรับติดท้ายรถแทรกเตอร์', 'อนุสิทธิบัตร', 'รศ.ดร.ประเทือง อุษาบริสุทธิ์,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,อ.ดร.ชัยยะ จันทรา,นายพงศ์พันธุ์ ปั้นมยุรา', 845, 'AE',
    '2303002824', '25469', '2023-09-28'::date, '2025-03-27'::date, '2029-09-27'::date,
    10000, 2568, 'ได้รับความคุ้มครอง', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

INSERT INTO intellectual_properties (
    legacy_id, title, type, creator_name, creator_personnel_id, department_code,
    application_number, registration_number, filing_date, protection_start, protection_end,
    support_amount, fiscal_year, status, remarks, created_at, updated_at
) VALUES (
    'ip-9', 'เครื่องวัดความต้านทานดินแบบอัตโนมัติสำหรับรถแทรกเตอร์', 'อนุสิทธิบัตร', 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE',
    '2503004483', '2503004483', '2024-11-01'::date, '2025-11-01'::date, '2031-10-31'::date,
    10000, 2568, 'ยื่นคำขอ', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year = 2568;

-- ----------------------------------------------------------------------------
-- Section 4: งานบริการวิชาการ ประจำปีงบประมาณ 2568 (325 รายการ)
-- ----------------------------------------------------------------------------
INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_001', 'คณะทำงานร่างแก้ไขข้อกำหนดการตรวจสภาท่า', 'วิชาการ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE',
    'สมาคมความปลอดภัยทางน้ำ', 1, 1, '2025-01-07'::date, '2025-01-07'::date, '2025-01-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_002', 'ประเมินข้อเสนอโครงการวิจัยประจำปีงบประมาณ 2568 ภายใต้แผนงาน Global Partnership', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)', 1, 1, '2025-01-14'::date, '2025-01-14'::date, '2025-01-14'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_003', 'พิจารณาผลงานทางวิชาการ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'สถาบันเทคโนโลยีพระจอมเกล้าคุณทหารลาดกระบัง', 1, 1, '2025-01-20'::date, '2025-01-20'::date, '2025-01-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_004', 'เป็นผู้ทรงคุณวุฒิพิจารณาหลักสูตรระดับปริญญาตรี ระดับปริญญาโท สาขาวิชาวิศวกรรมอาหาร', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'คณะวิศวกรรมและอุตสาหกรรมเกษตร มหาวิทยาลัยแม่โจ้', 7, 1, '2025-01-31'::date, '2025-01-31'::date, '2025-01-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_005', 'วิชา 01418385 Digital Image Processing หมู่ 800', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.เสกสรร มธุลาภรังสรรค์', 1160, 'CPE',
    'คณะวิทยาศาสตร์ ศรีราชา มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา', 21, 1, '2025-02-01'::date, '2025-02-01'::date, '2025-02-01'::date, 2568,
    '30 พ.ย.677,14,21,28 ธ.ค. 674,25 ม.ค. 68', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_006', 'ประชุมคณะกรรมการทรัพยากรน้ำแห่งชาติ ครั้งที่ 1/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการทรัพยากรนน้ำแห่งชาติ สทนช.', 1, 1, '2025-01-06'::date, '2025-01-06'::date, '2025-01-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_007', 'ประชุมคณะอนุกรรมาธิการศึกษาและแก้ไขปัญหาลุ่มน้ำวัง ครั้งที่ 3', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-09'::date, '2025-01-09'::date, '2025-01-09'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_008', 'ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 20', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-15'::date, '2025-01-15'::date, '2025-01-15'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_009', 'ประชุมคณะกรรมาธิการการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 43', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-16'::date, '2025-01-16'::date, '2025-01-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_010', 'ประชุมคณะอนุกรรมาธิการศึกษาและแก้ไขปัญหาลุ่มน้ำวัง ครั้งที่ 4', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-16'::date, '2025-01-16'::date, '2025-01-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_011', 'ผู้ทรงพิจารณาบทความทางวิชาการ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ศศิวมล ขาวโกมล', 1161, 'IRE',
    'วารสาร Journal of Environmental Management', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_012', 'ประชุมคณะกรรมการวิชาการลุ่มน้ำเจ้าพระยา', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการทรัพยากรน้ำแห่งชาติ สำนักงานทรัพยากรน้ำแห่งชาติ', 1, 1, '2025-01-24'::date, '2025-01-24'::date, '2025-01-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_013', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการทรัพยากรน้ำแห่งชาติ สำนักงานทรัพยากรน้ำแห่งชาติ', 1, 1, '2025-01-28'::date, '2025-01-28'::date, '2025-01-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_014', 'ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 21', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-22'::date, '2025-01-22'::date, '2025-01-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_015', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-01-29'::date, '2025-01-29'::date, '2025-01-29'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_016', 'ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 22', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-01-29'::date, '2025-01-29'::date, '2025-01-29'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_017', 'ประชุมคณะกรรมการพัฒนาหลักสูตรวิศวกรรมศาสตรบัณฑิต วิทยาลัยการชลประทาน ครั้งที่ 1/2568', 'วิชาการ', 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE',
    'วิทยาลัยการชลประทาน สถาบันสมทบมหาวิทยาลัยเกษตรศาสตร์ จ.นนทบุรี', 1, 1, '2025-01-30'::date, '2025-01-30'::date, '2025-01-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_018', 'ประชุมคณะกรรมการพัฒนาหลักสูตรวิศวกรรมศาสตรบัณฑิต วิทยาลัยการชลประทาน ครั้งที่ 1/2568', 'วิชาการ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'วิทยาลัยการชลประทาน สถาบันสมทบมหาวิทยาลัยเกษตรศาสตร์ จ.นนทบุรี', 1, 1, '2025-01-30'::date, '2025-01-30'::date, '2025-01-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_019', 'ประชุมคณะกรรมการพัฒนาหลักสูตรวิศวกรรมศาสตรบัณฑิต วิทยาลัยการชลประทาน ครั้งที่ 1/2568', 'วิชาการ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE',
    'วิทยาลัยการชลประทาน สถาบันสมทบมหาวิทยาลัยเกษตรศาสตร์ จ.นนทบุรี', 1, 1, '2025-01-30'::date, '2025-01-30'::date, '2025-01-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_020', 'วิทยากรและจัดแสดงนิทรรศการในด้านการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม การจัดการเศษวัสดุเหลือใช้จากการเกษตร ภายใต้โครงการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม ซึ่งจัดโดยจังหวัดนครปฐม ณ อาคารเอนกประสงค์โรงเรียนวัดไผ่หูช้าง ต.ไผ่หูช้าง อ.บางเลน จ.นครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้ว', 843, 'EEEC',
    'เกษตรกรจังหวัดนครปฐม', 1, 125, '2025-01-16'::date, '2025-01-16'::date, '2025-01-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_021', 'วิทยากรภายใต้โครงการพัฒนาบุคลากรสู่เศรษฐกิจมูลค่าสูงที่เป็นมิตรต่อสิ่งแวดล้อมในเขตเศรษฐกิจพิเศษภาคตะวันออก (ระยะที่ 2) ณ บ้านคลองใหญ่ ต.บ่อทอง อ.บ่อทอง จ.ชลบุรี', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้ว', 843, 'EEEC',
    'ประชาชนในพื้นที่', 1, 21, '2025-01-17'::date, '2025-01-17'::date, '2025-01-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_022', 'เครื่องผลิตปุ๋ยหมัก 7 วัน ณ กรมยุทธศึกษาทหารเรือ ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม', 'วิชาการ', 'นายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็น', 1007, 'EEEC',
    'กรมยุทธศึกษาทหารเรือ', 1, 8, '2025-01-28'::date, '2025-01-28'::date, '2025-01-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_023', 'เป็นผู้แทนองค์กรวิชาชีพเข้าร่วมประชุมการประเมินมาตรฐานวิชาชีพ ปีการศึกษา 2567', 'วิชาการ', 'นายเสกสรร สีหวงษ์', 1162, 'NAMC',
    'วิทยาลัยเกษตรและเทคโนโลยีนครราชสีมา สถาบันการอาชีวศึกษาเกษตร ภาคตะวันออกเฉียงเหนือ', 1, 1, '2025-01-22'::date, '2025-01-22'::date, '2025-01-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_024', 'กรรมการวิพากษ์หลักสูตร', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'คณะวิศวกรรมและอุตสาหการเกษตร มหาวิทยาลัยแม่โจ้', 1, 1, '2025-02-13'::date, '2025-02-13'::date, '2025-02-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_025', 'วิชา 01418385 Digital Image Processing หมู่ 870', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.เสกสรรค์ มธุลาภรังสรรค์', 988, 'CPE',
    'คณะวิทยาศาสตร์ ศรีราชา มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตศรีราชา', 24, 1, '2025-02-01'::date, '2025-02-01'::date, '2025-02-01'::date, 2568,
    '1,8,15, 22 ก.พ.681,8,15 มี.ค. 68', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_026', 'ให้คำปรึกษาและข้อเสนอแนะในการพัฒนาและปรับปรุงกระบวนการผลิตน้ำนมข้าวโพด', 'วิชาการ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'ศูนย์วิจัยข้าวโพดและข้าวฟ่างแห่งชาติ อ.ปากช่อง จ.นครราชสีมา', 7, 1, '2025-02-05'::date, '2025-02-05'::date, '2025-02-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_027', 'กรรมการสอบวิทยานิพนธ์ เรื่องThe Study of the influence of variability on hoek-brownparameters using random field theory', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 0.5, 1, '2025-02-07'::date, '2025-02-07'::date, '2025-02-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_028', 'กรรมการสอบวิทยานิพนธ์ เรื่องPrediction of failure envelopes of foundations using machinelearning algorithm and finite element limit analysis', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 0.5, 1, '2025-02-07'::date, '2025-02-07'::date, '2025-02-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_029', 'ซ่อมเครื่องทอดสุญญากาศ และฝึกอบรมการใช้งานและซ่อมบำรุงเครื่องทอดพร้อมอุปกรณ์ต่อพ่วงเบื้องต้น', 'วิชาชีพ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'สำนักพระราชวัง สวนจิตรลดา กรุงเทพมหานคร(โครงการอุทยานธรรมชาติวิทยาฯ อ.สาวนผึ้ง จ.ราชบุรี)', 1, 1, '2025-02-06'::date, '2025-02-06'::date, '2025-02-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_030', 'ผู้ทรงพิจารณาบทความทางวิชาการ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'วารสารแก่นเกษตร', 1, 1, '2025-02-17'::date, '2025-02-17'::date, '2025-02-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_031', 'การเขียนโปรแกรม Arduino IDE สำหรับการใช้แขนหุ่นยนต์เพื่อการศึกษา', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.พิเชษฐ์ สืบสายพรหม', 982, 'CPE',
    'โรงเรียนสิรินธรราชวิทยาลัยอ.เมือง จ.นครปฐม', 1, 1, '2025-02-01'::date, '2025-02-01'::date, '2025-02-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_032', 'เป็นผู้เชี่ยวชาญประเมินคุณภาพชุดสื่ออินโฟกราฟิก (ด้านเนื้อหา)', 'วิชาการ', 'ดร.ธนัญกรณ์ ใจผ่อง', 1092, 'NAMC',
    'คณะเทคโนโลยีการเกษตรสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 1, 1, '2025-02-01'::date, '2025-02-01'::date, '2025-02-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_033', 'เข้าร่วมประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 23', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สำนักงานเลขาธิการสภาผู้แทนราษฎร ในคณะกรรมาธิการบริการจัดทรัพยากรน้ำสภาผู้แทนราษฎร', 1, 1, '2025-02-05'::date, '2025-02-05'::date, '2025-02-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_034', 'เข้าร่วมประชุมคณะกรรมการทรัพยากรน้ำแห่งชาติ ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการทรัพยากรน้ำแห่งชาติ สทนช.', 1, 1, '2025-02-21'::date, '2025-02-21'::date, '2025-02-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_035', 'เข้าร่วมประชุมคณะอนุกรรมมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 25', 'วิชาการ', 'ผศ.ดร.ชูพันธ์ ชมภูจันทร์', 1163, 'IRE',
    'สำนักงานเลขาธิการสภาผู้แทนราษฎร', 1, 1, '2025-02-19'::date, '2025-02-19'::date, '2025-02-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_036', 'เข้าร่วมประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช.ภาค 2', 1, 1, '2025-02-25'::date, '2025-02-25'::date, '2025-02-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_037', 'เป็นอาจารย์พิเศษ บรรยายในหัวข้อ "Quality Management and Control"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE',
    'คณะวิทยาการจัดการ มหาวิทยาลัยสงขลานครินทร์', 3, 1, '2025-02-28'::date, '2025-02-28'::date, '2025-02-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_038', 'ร่วมจัดแสดงนิทรรศการผลงานวิจัยนวัตกรรมในงานเกษตรแฟร์ 2568 ณ โดมแอร์หน้าอาคารจักรพันธ์เพ็ญศิริ มหาวิทยาลัยเกษตรศาสตร์', 'วิชาการ', 'นายวีระพงษ์ กระแสธีปนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์', 1154, 'EEEC',
    'นักเรียน นักศึกษา อาจารย์ และประชาชนทั่วไป', 1, 200, '2025-01-31'::date, '2025-01-31'::date, '2025-01-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_039', 'คณะผู้บริหารและนิสิตแลกเปลี่ยนจาก Tokyo University of Agriculture (TUA) ประเทศญี่ปุ่น', 'ศึกษาดูงาน วศ.กพส.', 'ดร.อำพล ชุมเปีย (ที่ปรึกษา)นายภัทรพล ชูราศรีนางสาวอทิตยา แผ้วไพบูลย์', 1002, 'EEEC',
    'คณะผู้บริหารและนิสิตฯ', 1, 18, '2025-02-18'::date, '2025-02-18'::date, '2025-02-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_040', 'สาธิตการใช้งานเครื่องผลิตปุ๋ยหมัก 7 วัน ณ กรมยุทธศึกษาทหารเรือ ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้ว', 843, 'EEEC',
    'กรมยุทธศึกษาทหารเรือ ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม', 1, 15, '2025-02-24'::date, '2025-02-24'::date, '2025-02-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_041', 'โรงเรียนสาธิตแห่งมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ศูนย์วิจัยและพัฒนาการศึกษา เข้าใช้บริการเครื่องอัดภาชนะใบไม้', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายวีระพงษ์ กระแสธีปนางสาวธันยพร โส๊ะอ้นนายภัทรพล ชูราศรีนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'อาจารย์และนักเรียนระดับมัธยมศึกษาปีที่ 1', 1, 5, '2025-02-27'::date, '2025-02-27'::date, '2025-02-27'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_042', 'โครงการแลกเปลี่ยนนิสิตระหว่างมหาวิทยาลัยเกษตรศาสตร์ และ University of Tsukuba ประเทศญี่ปุ่น', 'ศึกษาดูงาน วศ.กพส.', 'นายอรรถวุทธิ์ รื่นเริงใจนายวีระพงษ์ กระแสธีปนางสาวธันยพร โส๊ะอ้นนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้วนางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 1154, 'EEEC',
    'Associate Professor Dr. Nakao NOMURA และนิสิตฯ', 1, 30, '2025-02-27'::date, '2025-02-27'::date, '2025-02-27'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_043', 'ทำสอบสมรรถนะรถเก็บเกี่ยวฟางและอัดฟาง', 'วิชาการ', 'นายกิตติเดช โพธิ์นิยมนายทิตินัย เทียนแย้มว่าที่ร.ต.พิสิษฐ์ อินทรวิรัตน์', 1155, 'NAMC',
    'แปลงเกษตรกร อ,โพธาราม จ.ราชบุรี', 1, 1, '2025-02-05'::date, '2025-02-05'::date, '2025-02-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_044', 'เป็นประธานภาค และเข้าร่วมประชุมวิชาการคอนกรีตประจำปี ครั้งที่ 19', 'วิชาการ', 'นายสุบรรณ สนิทอินทร์', 1094, 'NAMC',
    'สมาคมคอนกรีตแห่งประเทศไทย ร่วมกับภาควิชาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยอุบลราชธานี', 1, 1, '2025-02-19'::date, '2025-02-19'::date, '2025-02-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_045', 'เป็นกรรมการสอบวิทยานิพนธ์', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิชาวิศวกรรมโยธาคณะวิศวกรรมศาสตร์มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 3.5, 7, '2025-03-01'::date, '2025-03-01'::date, '2025-03-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_046', 'เป็นคณะกรรมการร่างปรับปรุงมาตรฐาน 2135-2545"เถ้าลอยจากถ่านหินใช้เป็นวัสดุผสมคอนกรีต"', 'วิชาการ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'สมาคมคอนกรีตแห่งประเทศไทย (สคท.)', 1, 1, '2025-03-01'::date, '2025-03-01'::date, '2025-03-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_047', 'เข้าร่วมประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-03-04'::date, '2025-03-04'::date, '2025-03-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_048', 'เข้าร่วมประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 26', 'วิชาการ', 'ผศ.ดร.ชูพันธ์ ชมภูจันทร์', 1163, 'IRE',
    'สำนักงานเลขาธิการสภาผู้แทนราษฎร ในคณะกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร', 1, 1, '2025-03-05'::date, '2025-03-05'::date, '2025-03-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_049', 'เป็นกรรมการสอบโครงร่างวิทยานิพนธ์นักศึกษาปริญญาเอก หัวข้อ "Sustainability of Rice Cultivation Practices in Chao Phraya Basin under the Impact of Extreme Weather Condotion: an Application of Sustainable Rice platorm Indicators"', 'วิทยานิพนธ์ภายนอก', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สถาบันพัฒนาสุขภาพอาเซียน มหาวิทยาลัยมหิดล', 1, 1, '2025-03-07'::date, '2025-03-07'::date, '2025-03-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_050', 'ประชุมคณะอนุกรรมการวิชาการและการบริหารจัดการน้ำลุ่มน้ำแม่กลอง ครั้งที่ 1/2568 ศาลากลางจังหวัดสมุทรสงคราม', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำฯ', 1, 1, '2025-03-10'::date, '2025-03-10'::date, '2025-03-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_051', 'แต่งตั้ง "คณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ"', 'วิชาชีพ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติ', 1, 1, '2025-03-04'::date, '2025-03-04'::date, '2025-03-04'::date, 2568,
    '4 มี.ค. 2568 เป็นต้นไป', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_052', 'ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 27', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สภาผู้แทนราษฎร', 1, 1, '2025-03-12'::date, '2025-03-12'::date, '2025-03-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_053', 'ประชุมเชิงปฏิบัติการเพื่อพัฒนาเครื่องมือคาดการณ์สมดุลน้ำในพื้นที่เขตพัฒนาพิเศษภาคตะวันออก ครั้งที่ 2', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานคณะกรรมการนโยบายเขตพัฒนาพิเศษภาคตะวันออก', 1, 1, '2025-03-21'::date, '2025-03-21'::date, '2025-03-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_054', 'ประชุมปรึกษาหารือกลุ่มย่อย ร่างแผนและแผนผังโครงสร้างพื้นฐาน : การจัดการน้ำ', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'กรมโยธาธิการและผังเมือง', 1, 1, '2025-03-19'::date, '2025-03-19'::date, '2025-03-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_055', 'แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำเจ้าพระยา"', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-03-18'::date, '2025-03-18'::date, '2025-03-18'::date, 2568,
    '18 มี.ค. 2568 เป็นต้นไป', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_056', 'แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำท่าจีน"', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-03-18'::date, '2025-03-18'::date, '2025-03-18'::date, 2568,
    '18 มี.ค. 2568 เป็นต้นไป', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_057', 'แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำเเม่กลอง"', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-03-18'::date, '2025-03-18'::date, '2025-03-18'::date, 2568,
    '18 มี.ค. 2568 เป็นต้นไป', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_058', 'ประชุมคณะกรรมการลุ่มน้ำแม่กลอง ครั้งที่ 2/2568', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-03-26'::date, '2025-03-26'::date, '2025-03-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_059', 'อาจารย์ประจำสาขาวิชาวิศวกรรมเคมี คณะวิศวกรรมศาสตร์ มหาวิทยาลัยสงขลานครินทร์ เข้าศึกษาดูงานวิจัยด้านพลังงานทดแทน', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายรัตนศักดิ์ ทรัพย์เย็น นางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'อาจารย์ประจำสาขาวิชาฯ', 1, 2, '2025-03-03'::date, '2025-03-03'::date, '2025-03-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_060', 'วิสาหกิจชุมชนบ้านท่าช้าง อ.ปากช่อง จ.นครราชสีมา เข้าศึกษาดูงานเครื่องอัดภาชนะใบไม้และนวัตกรรมต่างๆ', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'วิสาหกิจชุมชน', 1, 4, '2025-03-10'::date, '2025-03-10'::date, '2025-03-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_061', 'ร่วมสัมมนาวิชาการในหัวข้อ Climate Change Challenges, Plant Science Solutions', 'วิชาการ', 'ดร.ธนัญกรณ์ ใจผ่องนายทิตินัย เทียนแย้ม', 1092, 'NAMC',
    'Hiroshima University ประเทศญี่ปุ่น', 1, 1, '2025-03-12'::date, '2025-03-12'::date, '2025-03-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_062', '23rd AUN-QA Tier 1 Training Programme Assessment, Version 4.0', 'ศึกษาดูงาน วศ.กพส.', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'Bangkok, Thailand', 1, 1, '2025-03-11'::date, '2025-03-11'::date, '2025-03-11'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_063', '19th Assessor Training Workshop for AUN-QA Programme Assessment [Tier II]', 'ศึกษาดูงาน วศ.กพส.', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'Brunei Darussalam, Cambodia, Malaysia, the Philippines, Thailand, and Viet Nam', 1, 1, '2025-03-21'::date, '2025-03-21'::date, '2025-03-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_064', 'การออกแบบและก่อสร้างโครงสร้างคอนกรีตเสริม GFRP รุ่นที่ 4', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'วิศวกรรมสถานแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (วสท.)', 7.5, 1, '2025-04-26'::date, '2025-04-26'::date, '2025-04-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_065', 'เป็นผู้ทรงคุณวุฒิประเมินข้อเสนอโครงการวิจัย', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'คณะวิศวกรรมศาสตร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_066', 'ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-04-02'::date, '2025-04-02'::date, '2025-04-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_067', 'ผู้ทรงคุณวุฒิให้กับนิสิตต่างชาติ Ms. Mahroo Aghaabbasi, Student ID 6688081920 หัวข้อ"Barriers to Smart IrrigationTechnologies Adoption in Thailand Agricultural Sector."', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Environment, Development and Sustainability Program Graduate School, Chulalongkorn University', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_068', 'ประชุมเชิงปฏิบัติการ "ถอดบทเรียนการขับเคลื่อนการดำเนินงาน ภายใต้พระราชบัญญัติทรัพยากรน้ำ พ.ศ. 2561 หมวด 4 การจัดสรรน้ำและการใช้น้ำ ฯ"', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'กรมทรัพยากรน้ำ', 1, 1, '2025-04-30'::date, '2025-04-30'::date, '2025-04-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_069', 'เป็นประธานหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมไฟฟ้าเครื่องกลการผลิต มก.', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_070', 'เป็นประธานหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิทยาศาสตร์การกีฬาและการออกกำลังกาย มก.', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_071', 'เป็นกรรมการหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาวิศวกรรมทรัพยากรน้ำ มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_072', 'เป็นกรรมการหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิศวกรรมทรัพยากรน้ำ มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_073', 'เป็นกรรมการหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิศวกรรมเกษตร มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-04-01'::date, '2025-04-01'::date, '2025-04-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_074', 'Toward Net-Zero Production, Food Security and Sustainability"', 'ผู้ทรงคุณวุฒิ', 'ดร.ธนัญกรณ์ ใจผ่อง', 1092, 'NAMC',
    '11th Asian Crop Science Association Conference (ACSAC11) Taipei, Taiwan', 1, 1, '2025-05-19'::date, '2025-05-19'::date, '2025-05-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_075', 'ประเมินรายงานความก้าวหน้าโครงการวิจัย แผนงานกลุ่มอาหารมูลค่าสูง ประจำปี 2567', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)', 1, 1, '2025-05-02'::date, '2025-05-02'::date, '2025-05-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_076', 'คณะทำงานปรับปรุงมาตรฐานผลิตภัณฑ์อุตสาหกรรม เถ้าลอยจากถ่านหินใช้เป็นวัสดุผสมคอนกรีต', 'วิชาชีพ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'สมาคมคอนกรีตแห่งประเทศไทย (สคท.)', 3, 1, '2025-05-02'::date, '2025-05-02'::date, '2025-05-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_077', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'วารสาร Engineering and Technology Horizons', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_078', 'เป็นประธานกรรมการและผู้ทรงคุณวุฒิสอบวิทยานิพนธ์ เรื่อง การพัฒนานาโนซิลิการ่วมกับเส้นใยปาล์มน้ำมัน และเส้นใยป่านศรนารายณ์', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'คณะวิศวกรรมศาสตร์และสถาปัตยกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก เขตพื้นที่อุเทนถวาย', 2, 1, '2025-05-26'::date, '2025-05-26'::date, '2025-05-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_079', 'ให้คำปรึกษาและคำแนะนำด้านวิชาการเกี่ยวกับการรักษาคุณภาพมาตราฐาน และความปลอดภัยของบรรจุภัณฑ์น้ำพริก', 'วิชาการ', 'ภาควิชาวิศวกรรมอาหาร', 1164, 'FE',
    'เรือนจำกลางนครปฐม', 1, 1, '2025-05-19'::date, '2025-05-19'::date, '2025-05-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_080', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Agriculture', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_081', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Environmental and Sustainability Indicators', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_082', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Practice and Technology', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_083', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Science and Technology', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_084', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Science and Technology', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_085', 'ประชุมเชิงปฏิบัติการ "การขับเคลื่อน SDG Lab การบริหารจัดการน้ำเขิงพื่นที่ 3 จังหวัด ลุ่มน้ำแม่กล่องฯ"', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', 1, 1, '2025-05-02'::date, '2025-05-02'::date, '2025-05-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_086', 'เข้าร่วมประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ ../2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการล่มน้ำเจ้าพระยา สทนช.ภาค 2', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_087', 'ผู้ดำเนินรายการ "เสวนาวิชาการเรื่อง" ความเสี่ยงภัยพิบัติจากน้ำ 2025 ในภาวะภูมิอากาศสุดขั้ว"', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สมาคมนักอุทกวิทยาไทย', 1, 1, '2025-05-16'::date, '2025-05-16'::date, '2025-05-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_088', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 4/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา (ศาลากลางจังหวัดนครสวรรค์)', 1, 1, '2025-05-13'::date, '2025-05-13'::date, '2025-05-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_089', 'วิทยากรบรรยาย หลักสูตร "เทคนิคการควบคุมการเดินระบบและบำรุงรักษาระบบบำบัดน้ำเสียให้มีประสิทธิภาพ"', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-05-22'::date, '2025-05-22'::date, '2025-05-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_090', 'วิทยากรบรรยาย หลักสูตร "เทคนิคการควบคุมการเดินระบบและบำรุงรักษาระบบบำบัดน้ำเสียให้มีประสิทธิภาพ"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-05-22'::date, '2025-05-22'::date, '2025-05-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_091', 'ประชุมเตรียมการเพื่อสนับสนุนการดำเนินงานของคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 1/2568', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการล่มน้ำท่าจีน (ศาลากลางจังหวัดสุพรรณบุรี)', 1, 1, '2025-05-20'::date, '2025-05-20'::date, '2025-05-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_092', 'ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 3/2568 (ออนไลน์)', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการล่มน้ำท่าจีน (ศาลากลางจังหวัดสุพรรณบุรี)', 1, 1, '2025-05-23'::date, '2025-05-23'::date, '2025-05-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_093', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'วารสาร Engineering, Technology & Applied Science Research', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_094', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2025', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_095', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2026', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_096', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2027', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_097', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2028', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_098', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2029', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_099', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2030', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_100', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการ ThaiCID 2031', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_101', 'ประชุมคณะกรรมการลุ่มน้ำเม่กลอง ครั้งที่ 3/2568 (ออนไลน์)', 'วิชาชีพ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'คณะกรรมการล่มน้ำแม่กลอง (ศาลากลางจังหวัดราชบุรี)', 1, 1, '2025-05-02'::date, '2025-05-02'::date, '2025-05-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_102', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Pure and Applied Geophysics', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_103', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Engineering, and Applied Science Research', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_104', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Stochastic Environmental Research and Risk Assessment', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_105', 'กรรมการสอบวิทยานิพนธ์ปริญญาเอก "Assessment of Flood Risk and Impacts under Climate and Land use Changes in the Loei River Basin"', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'ภาควิชาวิศวกรรมโยธา มหาวิทยาลัยขอนแก่น', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_106', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_107', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_108', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_109', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_110', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_111', 'เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'งานประชุมวิชาการวิศวกรรมโยธาแห่งชาติ ครั้งที่ 30 (2568)', 1, 1, '2025-05-01'::date, '2025-05-01'::date, '2025-05-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_112', 'เป็นผู้ทรงคุณวุฒิพิจารณาบทความวารสารดอกพะยอมวิศวกรรมและเทคโนโลยี', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968, 'IE',
    'คณะเทคโนโลยีการเกษตรและเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครสวรรค์', 1, 1, '2025-05-20'::date, '2025-05-20'::date, '2025-05-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_113', 'ต้อนรับคณะผู้แทนจากภูมิภาคแอฟริกา พร้อมทั้งร่วมบรรยายในหัวข้อ “การลดขยะและการจัดการขยะในประเทศไทย”', 'วิทยากร/อาจารย์พิเศษ', 'นายอรรถวุทธิ์ รื่นเริงใจ', 1005, 'EEEC',
    'คณะผู้แทนจากภูมิภาคแอฟริกา', 1, 50, '2025-05-13'::date, '2025-05-13'::date, '2025-05-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_114', 'วิทยากรในการฝึกอบรมเชิงปฏิบัติการเรื่อง “การผลิตภาชนะจากใบไม้” ณ สถานพินิจและคุ้มครองเด็กและเยาวชนจังหวัดนครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายวีระพงษ์ กระแสธีปนางเนตรนภา วิชานงค์นายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนางสาวธันยพร โส๊ะอ้น', 843, 'EEEC',
    'สถานพินิจและคุ้มครองเด็กและเยาวชนจังหวัดนครปฐม', 1, 19, '2025-05-13'::date, '2025-05-13'::date, '2025-05-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_115', 'คณะศึกษาดูงานจาก Greenovation Hub (GHub) สาธารณรัฐประชาชนจีน เข้าเยี่ยมชมและแลกเปลี่ยนความร่วมมือด้านระบบเกษตรอาหารที่เป็นมิตรต่อสภาพอากาศและธรรมชาติในประเทศจีนและอาเซียน', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็น', 843, 'EEEC',
    'คณะศึกษาดูงานจาก GreenovationHub (GHub) สาธารณรัฐประชาชนจีน', 1, 6, '2025-05-14'::date, '2025-05-14'::date, '2025-05-14'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_116', 'เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “อิทธิพลของการเติมกราฟีนออกไซต์ต่อคุณสมบัติเชิงกลของคอนกรีต”', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 0.5, 1, '2025-06-05'::date, '2025-06-05'::date, '2025-06-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_117', 'เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “สมบัติทางกลและความทนไฟของคอนกรีตผสมด้วยของเสียพอลิเมอร์เสริมเส้นใยแก้ว”', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 0.5, 1, '2025-06-05'::date, '2025-06-05'::date, '2025-06-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_118', 'เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “พฤติกรรมการรับแรงอัดของเสาคอนกรีตเสริมด้วยแท่งพอลิเมอร์เสริมเส้นใยแก้วเสริมกำลังด้วยแผ่นคาร์บอนไฟเบอร์”', 'วิทยานิพนธ์ภายนอก', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'โครงการบัณฑิตศึกษา สาขาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต', 1, 1, '2025-06-05'::date, '2025-06-05'::date, '2025-06-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_119', 'การบรรยายหัวข้อ การปรับปรุงกระบวนการผลิตในอุตสาหกรรมอาหาร', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE',
    'โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม', 1, 1, '2025-06-13'::date, '2025-06-13'::date, '2025-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_120', 'การบรรยายหัวข้อ การประยุกต์ใช้ Dash Board ในอุตสาหกรรมอาหาร', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.วรัญญา อรรถเสนา', 980, 'CPE',
    'โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม', 1, 1, '2025-06-13'::date, '2025-06-13'::date, '2025-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_121', 'การบรรยายหัวข้อ การประยุกต์ใช้ IoT ในอุตสาหกรรมอาหาร', 'วิทยากร/อาจารย์พิเศษ', 'อ.ร้อยโทอนุมัติ อิงคนินันท์', 983, 'CPE',
    'โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม', 1, 1, '2025-06-13'::date, '2025-06-13'::date, '2025-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_122', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'วารสาร Discover Concrete and Cement', 1, 1, '2025-06-17'::date, '2025-06-17'::date, '2025-06-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_123', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'วารสาร Iranian Journal of Science and Technology,Transactions of Civil Engineering', 1, 1, '2025-06-10'::date, '2025-06-10'::date, '2025-06-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_124', 'วิทยากรบรรยาย หลักสูตร "ความรู้พื้นฐานเรื่องน้ำเสีย ระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบบำบัดน้ำเสีย"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-06-06'::date, '2025-06-06'::date, '2025-06-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_125', 'เข้าร่วมสัมมนาเพื่อส่งเสริมพัฒนาศักยภาพการดำเนินงานของคณะกรรมการลุ่มน้ำ', 'วิชาชีพ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'คณะกรรมการลุ่มน้ำแม่กลอง (โรงแรม รามาการ์เด้นส์ กทม.)', 1, 1, '2025-06-12'::date, '2025-06-12'::date, '2025-06-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_126', 'ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ ลุ่มน้ำท่าจีน ครั้งที่ 1/2568', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการลุ่มน้ำท่าจีน (ศาลากลางจังหวัดสุพรรณบุรี)', 1, 1, '2025-06-13'::date, '2025-06-13'::date, '2025-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_127', 'เข้าร่วมสัมมนาเพื่อส่งเสริมพัฒนาศักยภาพการดำเนินงานของคณะกรรมการลุ่มน้ำ', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการลุ่มน้ำท่าจีน (online)', 1, 1, '2025-06-12'::date, '2025-06-12'::date, '2025-06-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_128', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Agriculture', 1, 1, '2025-06-01'::date, '2025-06-01'::date, '2025-06-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_129', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Journal of Environmental Management', 1, 1, '2025-06-01'::date, '2025-06-01'::date, '2025-06-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_130', 'วิทยากรบรรยาย หลักสูตร "นโยบายการบริหารจัดการคณภาพน้ำ ในภาพรวมระดับประเทศ"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-06-05'::date, '2025-06-05'::date, '2025-06-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_131', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Practice and Technology', 1, 1, '2025-06-01'::date, '2025-06-01'::date, '2025-06-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_132', 'เป็นผู้ทรงคุณวุฒิบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Practice and Technology', 1, 1, '2025-06-01'::date, '2025-06-01'::date, '2025-06-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_133', 'การเป็นวิทยากรบรรยายในงาน Food Innovation Asia Conference 2024', 'วิทยากร/อาจารย์พิเศษ', 'ศ.ดร.รังสินี โสธรวิทย์', 1152, 'FE',
    'Food Innovation Asia Conference 2024', 1, 1, '2024-06-13'::date, '2024-06-13'::date, '2024-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_134', 'คณะกรรมการและกำหนดการสอบปากเปล่าขั้นสุดท้ายบัณฑิตวิทยาลัย (ประธาน)', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ภัทรพงษ์ ภาคภูมิ', 970, 'IE',
    'บัณฑิตวิทยาลัย มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-06-17'::date, '2025-06-17'::date, '2025-06-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_135', 'คณะกรรมการและกำหนดการสอบปากเปล่าขั้นสุดท้ายบัณฑิตวิทยาลัย (ประธาน)', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ภัทรพงษ์ ภาคภูมิ', 970, 'IE',
    'บัณฑิตวิทยาลัย มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-06-18'::date, '2025-06-18'::date, '2025-06-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_136', 'คณะกรรมการและกำหนดการสอบปากเปล่าขั้นสุดท้ายบัณฑิตวิทยาลัย (ประธาน)', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ภัทรพงษ์ ภาคภูมิ', 970, 'IE',
    'บัณฑิตวิทยาลัย มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-06-24'::date, '2025-06-24'::date, '2025-06-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_137', 'การทดสอบผลิตภัณฑ์ประตูบานเลื่อน', 'วิชาการ', 'ผศ.ดร.วัชมา โพธิ์ทอง,ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 852, 'DWT',
    'บริษัท คองช์ บิวดิ้ง แมททีเรียลส์ (ไทยแลนด์) จำกัด', 6, 26, '2025-06-20'::date, '2025-06-20'::date, '2025-06-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_138', 'การทดสอบผลิตภัณฑ์หน้าต่างบานเลื่อน/บานเปิด', 'วิชาการ', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT',
    'บริษัท แฮพส์เบิร์ก จำกัด', 6, 27, '2025-06-06'::date, '2025-06-06'::date, '2025-06-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_139', 'การทดสอบผลิตภัณฑ์ประตูบานเลื่อน', 'วิชาการ', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT',
    'บริษัท วินโดว์ เอเชีย จำกัด', 6, 14, '2025-06-13'::date, '2025-06-13'::date, '2025-06-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_140', 'การทดสอบผลิตภัณฑ์ LAVAMIC', 'วิชาการ', 'ผศ.ดร.วัชมา โพธิ์ทอง', 949, 'DWT',
    'บริษัท ช้างคอนซูเมอร์ จำกัด', 6, 1, '2025-06-27'::date, '2025-06-27'::date, '2025-06-27'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_141', 'เป็นอาจารย์พิเศษ รายวิชา 01208211 Workshop in Computer Aided Disigh and Drafting for Buildind Systems ประจำภาคต้น ปีการศึกษา 2568', 'วิทยากร/อาจารย์พิเศษ', 'ดร.นิติรงค์ พงษ์พานิช', 1090, 'NAMC',
    'สาขาวิศวกรรมเครื่องกล ภาคพิเศษ คณะวิศวกรรมศาสตร์ กำแพงแสน', 1, 1, '2025-06-23'::date, '2025-06-23'::date, '2025-06-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_142', 'โครงการฝึกอบรมเชิงปฏิบัติการใช้เทคโนโลยีปัญญาประดิษฐ์ (AI) ในการเลี้ยงปศุสัตว์', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.พิเชษฐ์ สืบสายพรหม', 982, 'CPE',
    'วิทยาลัยเกษตรและเทคโนโลยีกาญจนบุรี สถาบันการอาชีวศึกษาเกษตร ภาคกลาง อำเภอเมือง จังหวัดกาญจนบุรี', 1, 35, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_143', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ดร.ธนัญกรณ์ ใจผ่อง', 1092, 'OTH',
    'Sugar Tech', 1, 1, '2025-07-17'::date, '2025-07-17'::date, '2025-07-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_144', 'บรรยายหัวข้อ อัปเดตมาตรฐาน ACI 440-22 และ Spreadsheet ช่วยออกแบบ GFRP วัสดุใหม่แห่งความยั่งยืน โดย PJC', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'นิสิตนักศึกษา อาจารย์มหาวิทยาลัย และวิศกรที่อยู่ในอุสาหกรรมต่างๆ', 1, 1, '2025-07-23'::date, '2025-07-23'::date, '2025-07-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_145', 'สัมนาวิชาการ หัวข้อ Advance Technologica Solutions for Refurbishing Reinforced Concrete Affected Infrastructure Deteriorations (online)', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE',
    'dvance Technologica Solutions for Refurbishing Reinforced Concrete Affected Infrastructure Deteriorations(online)', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_146', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'Scientific Reports journal', 1, 1, '2025-07-18'::date, '2025-07-18'::date, '2025-07-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_147', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'Journal of Building Engineering', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_148', 'คณะอนุกรรรมการประชาสัมพันธ์', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'สภาวิศวกร', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_149', 'สัมมนา Thai Water Expo 2025 : Empowering Thailand''s Water Furure through Knowledge, Leadership, and Collaboration สร้างศักยภาพระบบน้ำไทยด้วยความรู้ ผู้นำและความร่วมมือ', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'เวที Water Forum 2025 ในงาน Thai Water Expo ณ ศูนย์การประชุมแห่งชาติสิริกิติ์', 1, 1, '2025-07-03'::date, '2025-07-03'::date, '2025-07-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_150', 'ประธานที่ประชุมวิชาการ Session by : Thai Hydrologist Association', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'เวที Water Forum 2025 ในงาน Thai Water Expo ณ ศูนย์การประชุมแห่งชาติสิริกิติ์', 1, 1, '2025-07-04'::date, '2025-07-04'::date, '2025-07-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_151', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water (Switzerland)', 1, 1, '2025-07-10'::date, '2025-07-10'::date, '2025-07-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_152', 'ประชุมเชิงปฏิบัติการสร้างการรับรู้ในการขับเคลื่อนการดำเนินงานลุ่มน้ำแม่กลอง ตามพรบ. ทรัพยากรน้ำ พ.ศ.2561 ณ โรงแรมเวสเทิร์นแกรนด์ราชบุรี อ.เมือง จ.ราชบุรี', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'ในคณะกรรมการลุ่มน้ำแม่กลอง สำนักงานทรัพยากรน้ำแห่งชาติภาค 2', 1, 1, '2025-07-03'::date, '2025-07-03'::date, '2025-07-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_153', 'บรรยายหัวข้อ "แนวทางการดำเนินงานแบบบูรณาการเพื่อขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา"', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช. ภาค 2 ณ โรงแรม เดอะคาวาลิ คาซ่ารีสอร์ท จ.พระนครศรีอยุธยา', 1, 1, '2025-07-22'::date, '2025-07-22'::date, '2025-07-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_154', 'ผู้ทรงคุณวุฒิดำเนินรายการบนเวทีคู่ขนานของการประชุมวิชาการด้านการชลประทานและการระบายน้ำแห่งชาติ ครั้งที่ 18 หรือ THAICID National Symposium 2025', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'คณะทำงานด้านวิชาการ THAICID กรมชลประทานปากเกร็ด จ.นนทบุรี', 1, 1, '2025-07-07'::date, '2025-07-07'::date, '2025-07-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_155', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Urban Climate', 1, 1, '2025-07-08'::date, '2025-07-08'::date, '2025-07-08'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_156', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Agriculture & Food Security', 1, 1, '2025-07-08'::date, '2025-07-08'::date, '2025-07-08'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_157', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Discover Applied Sciences', 1, 1, '2025-07-09'::date, '2025-07-09'::date, '2025-07-09'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_158', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Practice and Technology', 1, 1, '2025-07-10'::date, '2025-07-10'::date, '2025-07-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_159', 'สอบวิทยานิพนธ์ ปริญญาเอกหลักสูตรนานาชาติ หัวข้อ “SUSTAINABILITY OF RICE PRODUCTION SYSTEM AGAINST IMPACTSOF EXTERNAL FORCING FACTORS IN THE CHAO PHRAYA RIVER BASIN, THAILAND: A SYSTEMDYNAMICS MODELING”', 'วิทยานิพนธ์ภายนอก', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'AIHD มหาวิทยาลัยมหิดล', 1, 1, '2025-07-16'::date, '2025-07-16'::date, '2025-07-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_160', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Theoretical and Applied Climatology', 1, 1, '2025-07-17'::date, '2025-07-17'::date, '2025-07-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_161', 'ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ ลุ่มน้ำเจ้าพระยา', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช.ภาค 2 (ออนไลน์)', 1, 1, '2025-07-18'::date, '2025-07-18'::date, '2025-07-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_162', 'วิทยากรบรรยาย "การประยุกต์ใช้เทคโนโลยี IrriSAT กับพื้นที่ชลประทานในระดับโครงการ""แนวทางการต่อยอดการใช้งาน IrriSAT สำหรับโครงการกับสถานีตรวจวัดอากาศแบบอัตโนมัติ"', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE',
    'สำนักงานชลประทานที่ 12 อ.สรรพยา จ.ชัยนาท', 1, 1, '2025-07-24'::date, '2025-07-24'::date, '2025-07-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_163', 'วิทยากรบรรยาย "ติดตามและนำเสนอการใช้งาน IrriSAT กับพื้นที่ชลประทานในระดับโครงการ"', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE',
    'สำนักงานชลประทานที่ 12 อ.สรรพยา จ.ชัยนาท', 1, 1, '2025-07-25'::date, '2025-07-25'::date, '2025-07-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_164', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Water Science and Technology', 1, 1, '2025-07-25'::date, '2025-07-25'::date, '2025-07-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_165', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'Journal of Environmental Management', 1, 1, '2025-07-26'::date, '2025-07-26'::date, '2025-07-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_166', 'ประชุมรับฟังความคิดเห็น ครั้งที่ 1 โครงการค่าใช้จ่ายในการจัดทำหลักเกณฑ์การจัดสรรน้ำเพื่อการพิจารณาอนุญาตใช้ทรัพยากรน้ำสาธารณะ', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'กรมทรัพยากรน้ำ', 1, 1, '2025-07-30'::date, '2025-07-30'::date, '2025-07-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_167', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช.ภาค 2 (ออนไลน์)', 1, 1, '2025-07-30'::date, '2025-07-30'::date, '2025-07-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_168', 'ประชุมคณะอนุกรรมการบริหารจัดการสถานการณ์น้ำลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดพระนครศรีอยุธยา', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติ ภาค 2', 1, 1, '2025-07-31'::date, '2025-07-31'::date, '2025-07-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_169', 'ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ ลุ่มน้ำท่าจีน ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการลุ่มน้ำท่าจีน', 1, 1, '2025-07-31'::date, '2025-07-31'::date, '2025-07-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_170', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'วิชาชีพ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'Discover Sustainability (SNAPP)', 1, 1, '2025-07-31'::date, '2025-07-31'::date, '2025-07-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_171', 'เป็นประธานหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล มทร.อีสาน(โคราช)', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มทร.อีสาน(โคราช)', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_172', 'เป็นประธานหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล มทร.อีสาน(ขอนแก่น)', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มทร.อีสาน(ขอนแก่น)', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_173', 'เป็นประธานหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีเพื่อการพัฒนายั่งยืน มธ.', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยธรรมศาสตร์', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_174', 'เป็นประธานหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาบริหารงานวิศวกรรมการก่อสร้าง ม.เอเซียอาคเนย์', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'ม.เอเซียอาคเนย์', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_175', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาเทคโนโลยีเพื่อการพัฒนายั่งยืน มธ.', 'วิทยานิพนธ์ภายนอก', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยธรรมศาสตร์', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_176', 'เป็นกรรมกาหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาเทคโนโลยีการจัดการพลังงานและสิ่งแวดล้อม มธ.', 'วิทยานิพนธ์ภายนอก', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยธรรมศาสตร์', 1, 1, '2025-07-01'::date, '2025-07-01'::date, '2025-07-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_177', 'โรงเรียนวัดไทรใหญ่ (นนททิวากรราษฎร์บำรุง) จังหวัดนนทบุรี', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.พิเชษฐ์ สืบสายพรหม', 982, 'CPE',
    'ระดับภาคและกลุ่มจังหวัด', 1, 1, '2025-08-05'::date, '2025-08-05'::date, '2025-08-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_178', 'โรงเรียนวัดไทรใหญ่ (นนททิวากรราษฎร์บำรุง) จังหวัดนนทบุรี', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ธนา ชีพสมทรง', 944, 'ME',
    'ระดับภาคและกลุ่มจังหวัด', 1, 1, '2025-08-05'::date, '2025-08-05'::date, '2025-08-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_179', 'โรงเรียนวัดไทรใหญ่ (นนททิวากรราษฎร์บำรุง) จังหวัดนนทบุรี', 'วิทยากร/อาจารย์พิเศษ', 'อ.ร้อยโทอนุมัติ อิงคนินันท์', 983, 'CPE',
    'ระดับภาคและกลุ่มจังหวัด', 1, 1, '2025-08-05'::date, '2025-08-05'::date, '2025-08-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_180', 'ณ วิทยาลัยสารพัดช่างนครปฐม จ.นครปฐม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.พิเชษฐ์ สืบสายพรหม', 982, 'CPE',
    'สำนักงานศึกษาธิการจังหวัดนครปฐม', 1, 1, '2025-08-06'::date, '2025-08-06'::date, '2025-08-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_181', 'ณ วิทยาลัยสารพัดช่างนครปฐม จ.นครปฐม', 'ผู้ทรงคุณวุฒิ', 'อ.ร้อยโทอนุมัติ อิงคนินันท์', 983, 'CPE',
    'สำนักงานศึกษาธิการจังหวัดนครปฐม', 1, 1, '2025-08-06'::date, '2025-08-06'::date, '2025-08-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_182', 'ณ วิทยาลัยสารพัดช่างนครปฐม จ.นครปฐม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.หทัยเทพ วงศ์สุวรรณ', 945, 'ME',
    'สำนักงานศึกษาธิการจังหวัดนครปฐม', 1, 1, '2025-08-06'::date, '2025-08-06'::date, '2025-08-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_183', 'ณ วิทยาลัยสารพัดช่างนครปฐม จ.นครปฐม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ธนา ชีพสมทรง', 944, 'ME',
    'สำนักงานศึกษาธิการจังหวัดนครปฐม', 1, 1, '2025-08-06'::date, '2025-08-06'::date, '2025-08-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_184', 'ปัญหา Corrosion ในโครงสร้างคอนกรีต และการป้องกันแก้ไข', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE',
    'สำนักงานการอาชีพชัยพัฒนา จ.นครปฐม', 1, 1, '2025-08-14'::date, '2025-08-14'::date, '2025-08-14'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_185', 'Overview Agriculture in Thailand', 'วิทยากร/อาจารย์พิเศษ', 'ดร.ธนัญกรณ์ ใจผ่อง', 1092, 'OTH',
    'หมาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน', 1, 1, '2025-08-20'::date, '2025-08-20'::date, '2025-08-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_186', 'ประชุมเชิงปฏิบัติการสร้างการรับรู้ในการขับเคลื่อนการดำเนินงานลุ่มน้ำแม่กลอง ตาม พ.ร.บ.ทรัพยากรน้ำ พ.ศ. 2561', 'วิชาการ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'คณะกรรมการลุ่มน้ำแม่กลอง (สทนช.) ประชุมโรงแรมริเวอร์แคว อ.เมือง จ.กาญจนบุรี', 1, 1, '2025-08-07'::date, '2025-08-07'::date, '2025-08-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_187', 'วิทยากรบรรยาย "หลักการชลประทานในแปลงอ้อย"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'มหาวิทยาลัยเจ้าพระยา อ.เมือง จ.นครสวรรค์', 1, 1, '2025-08-22'::date, '2025-08-22'::date, '2025-08-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_188', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร KSCE Journal of Civil Engineering', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_189', 'ประชุมสภาคณะผู้บริหารบัณฑิตศึกษาแห่งประเทศไทย (สคบท) ครั้งที่ 3/2568', 'วิชาการ', 'รศ.ดร.เอกสิทธิ์ โฆสิตสกุลชัย', 876, 'IRE',
    'สภาคณะผู้บริหารบัณฑิตศึกษาแห่งประเทศไทย (สคบท) ณ ม.ราชภัฎอุดรธานี', 1, 1, '2025-08-17'::date, '2025-08-17'::date, '2025-08-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_190', 'ประชุมเตรียมการบริหารจัดการน้ำลุ่มน้ำเจ้าพระยาและลุ่มน้ำที่เกี่ยวข้อง', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำฯ สทนช.ภาค2', 1, 1, '2025-08-13'::date, '2025-08-13'::date, '2025-08-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_191', 'ประชุมเตรียมการบริหารจัดการน้ำลุ่มน้ำเจ้าพระยาและลุ่มน้ำที่เกี่ยวข้อง', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการลุ่มน้ำฯ สทนช.ภาค2', 1, 1, '2025-08-13'::date, '2025-08-13'::date, '2025-08-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_192', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-08-12'::date, '2025-08-12'::date, '2025-08-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_193', 'วิทยากรบรรยาย "การควบคุมดูแลระบบน้ำบำบัดน้ำเสีย"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-08-26'::date, '2025-08-26'::date, '2025-08-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_194', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Scientific Reports', 1, 1, '2025-08-11'::date, '2025-08-11'::date, '2025-08-11'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_195', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water Practice and Technology', 1, 1, '2025-08-17'::date, '2025-08-17'::date, '2025-08-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_196', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Journal of EnvironmentalManagement', 1, 1, '2025-08-17'::date, '2025-08-17'::date, '2025-08-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_197', 'วิทยากรบรรยาย "กิจกรรมร้อยอาชีพสู่ฝัน ครั้งที่ 16"', 'วิทยากร/อาจารย์พิเศษ', 'อ.ดร.ศศิวิมล ขาวโกมล', 885, 'IRE',
    'โรงเรียนเพลินพัฒนา', 1, 1, '2025-08-28'::date, '2025-08-28'::date, '2025-08-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_198', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-08-18'::date, '2025-08-18'::date, '2025-08-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_199', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Agriculture Systems', 1, 1, '2025-08-23'::date, '2025-08-23'::date, '2025-08-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_200', 'วิทยากรบรรยาย "การจัดการแปลงเกษตรด้วยระบบ Smart Farming', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE',
    'คณะผลิตกรรมการเกษตร มหาวิทยาลัยแม่โจ้', 1, 1, '2025-08-23'::date, '2025-08-23'::date, '2025-08-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_201', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water science and technology', 1, 1, '2025-08-25'::date, '2025-08-25'::date, '2025-08-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_202', 'ประชุมเตรียมกระบวนการ workshop เวทีบทเรียนการขับเคลื่อนมติการบริหารจัดการกลไกน้ำ ในคณะกรรมการลุ่มน้ำเจ้าพระยา', 'วิชาชีพ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำเจ้าพระยา ณ โรงแรมเอบีน่าเฮ้าส์ หลักสี่', 1, 1, '2025-08-26'::date, '2025-08-26'::date, '2025-08-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_203', 'ประชุมเตรียมการบริหารจัดการน้ำลุ่มน้ำเจ้าพระยาและลุ่มน้ำที่เกี่ยวข้อง', 'วิชาชีพ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำฯ สทนช.ภาค2', 1, 1, '2025-08-28'::date, '2025-08-28'::date, '2025-08-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_204', 'แต่งตั้งเป็น "อุปนายก" คณะกรรมการสมาคมนักอุทกวิทยาไทย วาระปี 2568-2569', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สมาคมนักอุทกวิทยาไทย', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_205', 'แต่งตั้งเป็น "กรรมการ" คณะกรรมการสมาคมนักอุทกวิทยาไทย วาระปี 2568-2569', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'สมาคมนักอุทกวิทยาไทย', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_206', 'แต่งตั้งเป็น "ที่ปรึกษาคณะทำงาน" คณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยา ด้วยโปรแกรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'สำนักงานเลขาธิการ THAICID ในคำสั่งคณะกรรมการด้านการชลประทานและระบายน้ำแห่งประเทศไทย', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_207', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water Practice and Technology', 1, 1, '2025-08-28'::date, '2025-08-28'::date, '2025-08-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_208', 'อาจารย์พิเศษสอนในรายวิชา ว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (โครงการ วมว.มก.)(ครั้งที่ 1)', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์นางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'นักเรียนในโครงการฯ', 1, 60, '2025-08-04'::date, '2025-08-04'::date, '2025-08-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_209', 'ให้การต้อนรับ บริษัท อัลลายด์เทคเอ็นจิเนียริ่ง จำกัด จังหวัดกาญจนบุรี ในการเข้าศึกษาดูงานเกี่ยวกับการพัฒนาเทคโนโลยีและการแลกเปลี่ยนองค์ความรู้ด้าน Gasifier และการผลิตไบโอชาร์ (Biochar)', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์', 843, 'EEEC',
    'บริษัท อัลลายด์เทคเอ็นจิเนียริ่ง จำกัด จังหวัดกาญจนบุรี', 1, 5, '2025-08-05'::date, '2025-08-05'::date, '2025-08-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_210', 'อาจารย์พิเศษสอนในรายวิชา ว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน (โครงการ วมว.มก.) (ครั้งที่ 2)', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'นักเรียนในโครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน', 1, 60, '2025-08-13'::date, '2025-08-13'::date, '2025-08-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_211', 'อาจารย์พิเศษสอนในรายวิชา ว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน(โครงการ วมว.มก.) (ครั้งที่ 3)', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนางเนตรนภา วิชานงค์นายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์', 843, 'EEEC',
    'นักเรียนในโครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน', 1, 60, '2025-08-18'::date, '2025-08-18'::date, '2025-08-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_212', 'จัดโครงการอบรมหลักสูตร “การอบรมและสาธิตการใช้เตาประหยัดพลังงานและเตาเบ๊บซี เพื่อเพิ่มมูลค่าน้ำมันพืชใช้แล้วและวัสดุเหลือใช้ทางการเกษตรให้เป็นเชื้อเพลิงความร้อน พ.ศ. 2568”', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนางเนตรนภา วิชานงค์นายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์นางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'ประชาชนทั่วไป', 1, 30, '2025-08-20'::date, '2025-08-20'::date, '2025-08-20'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_213', 'ให้การต้อนรับนิสิตแลกเปลี่ยนระหว่างมหาวิทยาลัยเกษตรศาสตร์ และ Okayama University ประเทศญี่ปุ่น', 'ศึกษาดูงาน วศ.กพส.', 'นายอรรถวุทธิ์ รื่นเริงใจนายภัทรพล ชูราศรีนางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 1005, 'EEEC',
    'นิสิตในโครงการฯ', 1, 20, '2025-08-26'::date, '2025-08-26'::date, '2025-08-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_214', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาความปลอดภัยของอาหารในผลิตผลทางการเกษตร มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_215', 'เป็นกรรมการหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมระบบการผลิตดิจิทัล มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_216', 'เป็นกรรมการหลักสูตร วิทยาศาสตรมหาบัณฑิต สาขาวิชาวิทยาศาสตร์และเทคโนโลยีสิ่งแวดล้อม มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_217', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาเทคโนโลยีและการจัดการสิ่งแวดล้อม มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_218', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาวิจัยและพัฒนากาชรเกษตร (นานาชาติ) มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_219', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมบัณฑิต สาขาวิศวกรรมอุตสาหการ มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_220', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาการจัดการวิศวกรรมและเทคโนโลยี มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์', 1, 1, '2025-08-01'::date, '2025-08-01'::date, '2025-08-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_221', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Journal of African Earth Sciences', 1, 1, '2025-09-04'::date, '2025-09-04'::date, '2025-09-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_222', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Chemical Engineering Journal Advances', 1, 1, '2025-09-06'::date, '2025-09-06'::date, '2025-09-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_223', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Discover Sustainability', 1, 1, '2025-09-06'::date, '2025-09-06'::date, '2025-09-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_224', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Uban Climate', 1, 1, '2025-09-19'::date, '2025-09-19'::date, '2025-09-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_225', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Modeling Earth Systems and Environment', 1, 1, '2025-09-21'::date, '2025-09-21'::date, '2025-09-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_226', 'ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 6/2568', 'วิชาการ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะกรรมการลุ่มน้ำท่าจีน', 1, 1, '2025-09-24'::date, '2025-09-24'::date, '2025-09-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_227', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-09-24'::date, '2025-09-24'::date, '2025-09-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_228', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Ecological Indicators', 1, 1, '2025-09-26'::date, '2025-09-26'::date, '2025-09-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_229', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Agricultural Systems', 1, 1, '2025-09-26'::date, '2025-09-26'::date, '2025-09-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_230', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ณ สำนักงานชลประทานที่ 12 จ.ชัยนาท', 1, 1, '2025-09-04'::date, '2025-09-04'::date, '2025-09-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_231', 'ประชุมสัมมนาถอดบทเรียนการติดตามประเมินผลการบริหารจัดการน้ำและมาตรการรองรับในช่วงฤดูแล้ว ปี 2567/68', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการลุ่มน้ำ สำนักงานทรัพยากรน้ำแห่งชาติ', 1, 1, '2025-09-23'::date, '2025-09-23'::date, '2025-09-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_232', 'ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม ครั้งที่ 1/2568', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'คณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม', 1, 1, '2025-09-26'::date, '2025-09-26'::date, '2025-09-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_233', 'ประชุมประจำปี 2568', 'วิชาการ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', 1, 1, '2025-09-26'::date, '2025-09-26'::date, '2025-09-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_234', 'ประชุมระดมสมอง เรื่อง กำหนดแผนงานวิจัยด้านทรัพยากรน้ำและการผลักดันผลงานวิจัยไปสู่การใช้ประโยชน์ (2571-2575)', 'วิชาชีพ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว)', 1, 1, '2025-09-24'::date, '2025-09-24'::date, '2025-09-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_235', 'ให้การต้อนรับคณะจาก UI Green', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรี', 843, 'EEEC',
    'คณะจาก UI Green', 1, 7, '2025-09-03'::date, '2025-09-03'::date, '2025-09-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_236', 'ให้การต้อนรับคณะอนุรักษ์ไบโอปราณ เข้าศึกษาดูงานเครื่องอัดภาชนะจากใบไม้และเครื่องอัดกระถางจากวัสดุธรรมชาติ', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์นางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'คณะอนุรักษ์ไบโอปราณ', 1, 2, '2025-09-05'::date, '2025-09-05'::date, '2025-09-05'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_237', 'บริษัท สยามวู้ดแลนด์ จำกัด อำเภอลำลูกกา จังหวัดปทุมธานี เข้าใช้บริการเครื่องอัดภาชนะใบไม้', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนางสาวธันยพร โส๊ะอ้น', 843, 'EEEC',
    'บริษัท สยามวู้ดแลนด์ จำกัด', 1, 2, '2025-09-12'::date, '2025-09-12'::date, '2025-09-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_238', 'เทคโนโลยีนวัตกรรมการผลิตข้าวคุณภาพ 5 ป. ปลอดการเผา การจัดการและการใช้ประโยชน์ฟางข้าว', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'เทศบาลตำบลบางเลน', 1, 70, '2025-09-23'::date, '2025-09-23'::date, '2025-09-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_239', 'เป็นผู้ทรงคุณวุฒิประเมินข้อเสนอโครงการวิจัยเพื่อขอรับทุนอุดหนุนงานวิจัยจากงบประมาณด้านวิทยาศาสตร์ วิจัยและนวัตกรรม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ', 1, 1, '2025-10-26'::date, '2025-10-26'::date, '2025-10-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_240', 'เป็นผู้ทรงคุณวุฒิประเมินข้อเสนอโครงการวิจัยเพื่อขอรับทุนอุดหนุนงานวิจัยจากงบประมาณด้านวิทยาศาสตร์ วิจัยและนวัตกรรม', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ', 1, 1, '2025-10-26'::date, '2025-10-26'::date, '2025-10-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_241', 'โครงการส่งน้ำและบำรุงรักษาเจ้าพระยา เรื่องการเสื่อมสภาพของโครงสร้างคอนกรีตตเสริมเหล็ก และบริษัทฯ', 'วิชาการ', 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE',
    'บริษัท ซีพีเอส ซัคเซส จำกัด', 1, 1, '2025-10-08'::date, '2025-10-08'::date, '2025-10-08'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_242', 'กิจกรรมเผยแพร่องค์ความรู้การผลิตกระทงสาย EM รักษ์โลกโดยสมาคมอนุรักษ์สิ่งแวดล้อมล้อมชุมชนไทย ร่วมกับ การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย ณ วัดโตนด (หลวงพ่อสำเร็จ) อ.บางกรวย จ.นนทบุรี', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'ขยายผลสู่ชุมชน (บ้าน วัด โรงเรียน) ที่อยู่ริมน้ำ', 1, 1, '2025-10-18'::date, '2025-10-18'::date, '2025-10-18'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_243', 'โครงการวิจัย การส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก โดยสำนักส่งเสริมและฝึกอบรม ม.เกษตร กำแพงแสน', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'อ.ศรีประจันต์,อ.เดิมบางนางบวช', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_244', 'โครงการวิจัย การส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก โดยสำนักส่งเสริมและฝึกอบรม ม.เกษตร กำแพงแสน', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'โตโลโปตี้ อ.อู่ทอง สุพรรณบุรี', 1, 1, '2025-10-16'::date, '2025-10-16'::date, '2025-10-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_245', 'การจัดการฟางข้าวและการใช้ประโยชน์ จากวัสดุเหลือใช้ทางการเกษตร ที่ศูนย์ข้าวชุมชน ตำบลทุ่งขวาง ตำบลหลักเมตร นครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'ศูนย์ข้าวชุมชน ตำบลทุ่งขวาง ตำบลหลักเมตร นครปฐม', 1, 1, '2025-10-30'::date, '2025-10-30'::date, '2025-10-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_246', 'จัดโครงการอบรมหลักสูตร “การฝึกอบรมเชิงปฏิบัติการการผลิตกระถางเพาะชำจากวัสดุธรรมชาติด้วยเครื่องอัดกระถางแบบมือโยกและไฮดรอลิก เพื่อส่งเสริมเศรษฐกิจหมุนเวียนในระดับชุมชน พ.ศ. 2568”', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนางเนตรนภา วิชานงค์นายภัทรพล ชูราศรีนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้นนายสมเกียรติ อิ่มจันทร์นางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'ประชาชนทั่วไป', 1, 46, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_247', 'ให้การต้อนรับคุณครูและนักเรียนชั้นมัธยมศึกษาปีที่ 5 จากโรงเรียนสาธิตแห่งมหาวิทยาลัยเกษตรศาสตร์ ศูนย์วิจัยและพัฒนาการศึกษาที่ได้จัดทำโครงการการศึกษารอบรู้เฉพาะเรื่อง เรื่อง การออกแบบกระถางเพาะชำจากเปลือกข้าวโพด เข้าใช้บริการเครื่องอัดกระถางวัสดุจากธรรมชาติ', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายรัตนศักดิ์ ทรัพย์เย็นนายเจษฎาพร ด้วงแก้วนางสาวธันยพร โส๊ะอ้น', 843, 'EEEC',
    'คุณครูและนักเรียนชั้นมัธยมศึกษาปีที่ 5 จากโรงเรียนสาธิตแห่งมหาวิทยาลัยเกษตรศาสตร์', 1, 2, '2025-10-06'::date, '2025-10-06'::date, '2025-10-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_248', 'จัดโครงการอบรมหลักสูตร “การออกแบบและปฏิบัติการให้น้ำแก่แปลงข้าวโพดขนาดใหญ่ด้วยระบบน้ำหยดแบบ Inline dripper (Low tape drip)”', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนางเนตรนภา วิชานงค์นายภัทรพล ชูราศรีนางสาวธันยพร โส๊ะอ้นนางณีรนุช ยอดเพชรนางสาวอทิตยา แผ้วไพบูลย์', 843, 'EEEC',
    'บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)', 1, 10, '2025-10-08'::date, '2025-10-08'::date, '2025-10-08'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_249', 'วิทยากรโครงการจัดทำแผนยกระดับชุมชนอุดมสุขสู่การเป็นแกนกลางการเกษตร ปีบัญชี 2568 ให้กับกลุ่มวิสาหกิจชุมชนศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง ในหัวข้อ "การแปรรูปผลิตภัณฑ์จากข้าวเพื่อเพิ่มมูลค่าผลผลิต" ณ ศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง อำเภอกำแพงแสน จังหวัดนครปฐม จัดโดยสำนักส่งเสริมและฝึกอบรม กำแพงแสน ร่วมกับ สำนักงาน ธ.ก.ส.จังหวัดนครปฐม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC',
    'กลุ่มวิสาหกิจชุมชนศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง', 1, 20, '2025-10-30'::date, '2025-10-30'::date, '2025-10-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_250', 'อบรมเชิงปฏิบัติการ การสร้างระบบ NIR สำหรับการวิเคราะห์ประจำวัน', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE',
    'บริษัทศรีตรังแอโกรอินดัสทรี จำกัด(มหาชน) สาขาเลย', 1, 1, '2025-10-30'::date, '2025-10-30'::date, '2025-10-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_251', 'ประชุมรับฟังความคิดเห็น ครั้งที่ 2 โครงการค่าใช้จ่ายในการจัดทำหลักเกณฑ์การจัดสรรน้ำเพื่อการพิจารณาอนุฐาตใช้ทรัพยากรน้ำสาธารณะ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'กรมทรัพยากรน้ำ', 1, 1, '2025-10-03'::date, '2025-10-03'::date, '2025-10-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_252', 'ประชุมระดับความคิดเห็นต่อการจัดทำสมุดปกขาว "อว. For Water"', 'วิชาชีพ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานสภานโยบายการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรมแห่งชาติ (สอวช.)', 1, 1, '2025-10-07'::date, '2025-10-07'::date, '2025-10-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_253', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-10-07'::date, '2025-10-07'::date, '2025-10-07'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_254', 'ประชุมอนุกรรมการขับเคลื่อนแผนแม่บทและแผนงานโครงการในเขตลุ่มน้ำท่าจีน ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดสุพรรณบุรี', 'วิชาชีพ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'สำนักงานคณะกรรมการลุ่มน้ำท่าจีน', 1, 1, '2025-10-16'::date, '2025-10-16'::date, '2025-10-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_255', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'วารสาร Pure and Applied Geophysics', 1, 1, '2025-10-15'::date, '2025-10-15'::date, '2025-10-15'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_256', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-10-19'::date, '2025-10-19'::date, '2025-10-19'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_257', 'ประชุมคณะอนุกรรมการกลั่นกรองแผนปฏิบัติการด้านทรัพยากรน้ำลุ่มน้ำแม่กลอง ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดราชบุรี', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 (คณะกรรมการลุ่มน้ำแม่กลอง)', 1, 1, '2025-10-21'::date, '2025-10-21'::date, '2025-10-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_258', 'สอนในหัวข้อ Transboundary water and water footprint', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'หลักสูตร ASIAN Studies for Sustainable Development program บัณฑิตวิทยาลัย มหาวิทยาลัยมหิดล', 1, 1, '2025-10-31'::date, '2025-10-31'::date, '2025-10-31'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_259', 'แต่งตั้งผู้ทรงคุณวุฒิสำหรับการจ้างที่ปรึกษาเพื่อศึกษาแนวทางการควบคุมอาคารและจัดทำคู่มือมาตรการสำหรับอาคารในการปรับตัว(Adaptation )และการเตรียมพร้อมในการรับมือ (Resilience) กับการเปลี่ยนแปลงสภาพภูมิอากาศ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'กรมโยธาธิการและผังเมือง คำสั่งที่ 3471/2568 ลว 27 ต.ค. 2568', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_260', 'เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาวิจัยและพัฒนากาชรเกษตร (นานาชาติ) มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_261', 'เป็นกรรมการหลักสูตร วท.บ.โภชนศาสตร์และเทคโนโลยีอาหารสัตว์', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_262', 'เป็นกรรมการหลักสูตร ป.รด. โภชนศาสตร์และเทคโนโลยีอาหารสัตว์', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_263', 'เป็นกรรมการหลักสูตร วทบ.เทคโนโลยีชีวภาพทางการเกษตร', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_264', 'เป็นกรรมการหลักสูตร วศม.วิศวกรรมอาหาร', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_265', 'เป็นกรรมการหลักสูตร วศ.ด.บ.วิศวกรรมอาหาร', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_266', 'เป็นกรรมการหลักสูตร วศ.บ.วิศวกรรมอุตสาหการ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_267', 'เป็นกรรมการหลักสูตร วศ.บ.วิศวกรรมชลประทาน', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_268', 'เป็นประธานบัณฑิตวิทยาลัยวิศวกรรมศาสตร์นานาชาติสิรินธร ไทย-เยอรมัน มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_269', 'เป็นประธานสถาบันวิจัยและพัฒนา มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_270', 'เป็นประธานสำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 'วิชาการ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_271', 'เป็นกรรมการคณะแพทยศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยศรีนครินทรวิโรฒ', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_272', 'เป็นกรรมการคณะวิศวกรรมศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยศรีนครินทรวิโรฒ', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_273', 'เป็นกรรมการคณะศิลปศาสตร์ มทร. ธัญญะบุรี', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_274', 'คณะการแพทย์บูรณาการ มทร. ธัญญะบุรี', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_275', 'เป็นกรรมการคณะสถาปัตยกรรมศาสตร์และการออกแบบ มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_276', 'เป็นกรรมการคณะวิศวกรรมศาสตร์ ม.อบ.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยอุบลราชธานี', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_277', 'เป็นกรรมการวิทยาศาสตร์ ม.อบ.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยอุบลราชธานี', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_278', 'เป็นกรรมการคณะมนุษยศาสตร์ มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_279', 'เป็นกรรมการคณะศิลปะศาสตร์และวิทยาศาสตร์ มก.', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_280', 'เป็นกรรมการคณะพาณิชยนาวี', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_281', 'เป็นกรรมการคณะวิทยาศาสตร์และวิศวกรรมศาสตร์', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME',
    'มหาวิทยาลัยเกษตรศาสตร์กพส.', 1, 1, '2025-10-01'::date, '2025-10-01'::date, '2025-10-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_282', 'เข้าร่วมเป็นคณะทำงานกลั่นกรองโครงการบ้านมั่นคงเมืองชนบท และสินเชื่อเพื่อการพัฒนาภาคกรุงเทพฯปริมณฑลและตะวันออก', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชา สนิทอินทร์', 1165, 'CE',
    'องค์กรชุมชน/ชุมชนท้องถิ่น', 1, 1, '2025-10-28'::date, '2025-10-28'::date, '2025-10-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_283', 'โครงการพัฒนาศักยภาพการบริหารจัดการคุณภาพน้ำ องค์กรปกครองส่วนท้องถิ่น รุ่นที่ 8 (ครั้งที่ 1/2569)', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'การบริหารจัดการน้ำเสียของประเทศไทย', 1, 1, '2025-11-13'::date, '2025-11-13'::date, '2025-11-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_284', 'โครงการพัฒนาศักยภาพการบริหารจัดการคุณภาพน้ำ องค์กรปกครองส่วนท้องถิ่น รุ่นที่ 8 (ครั้งที่ 1/2569)', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE',
    'การบริหารจัดการน้ำเสียของประเทศไทย', 1, 1, '2025-11-12'::date, '2025-11-12'::date, '2025-11-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_285', 'วิวัฒนาการของการตรวจสอบคุณภาพผลผลิตเกษตรแบบไม่ทำลาย: จาก NIR สู่ Hyperspectral Imaging', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.สิรินาฏ น้อยพิทักษ์', 848, 'AE',
    'อ.เมืองนนทบุรี นนทบุรี', 1, 1, '2025-11-03'::date, '2025-11-03'::date, '2025-11-03'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_286', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'Journal of Building Pathology and Rehabilition', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_287', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE',
    'Scientific Reports', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_288', 'เป็นประธานการสอบวิทยานิพนธ์ เรื่อง Co-precipitated proteins based on Bambara groundnut protein isolate and acid solublecollagen:Preparation,characterization and film formation', 'วิชาการ', 'ศ.ดร.รังสินี โสธรวิทย์', 1152, 'FE',
    'มหาวิทยาลัยสงขลานครินทร์ คณะอุตสาหกรรมเกษตร', 1, 1, '2025-01-01'::date, '2025-01-01'::date, '2025-01-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_289', 'เป็นคณะกรรมการตรวจประกันคุณภาพเครือข่ายมหาวิทยาลัยอาเซียน (Asean University Network Quality Assurance,AUN-QA)', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.เบญญา กสานติสกุล', 1166, 'ME',
    'การศึกษาระดับอุดมศึกษาในภูมิภาคให้เป็นมาตรฐานเดียวกัน', 1, 1, '2025-11-17'::date, '2025-11-17'::date, '2025-11-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_290', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Bioresource Technology Reports', 1, 1, '2025-11-02'::date, '2025-11-02'::date, '2025-11-02'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_291', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Ecological Indicators', 1, 1, '2025-11-04'::date, '2025-11-04'::date, '2025-11-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_292', 'ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 7/2568 online', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 (คณะกรรมการลุ่มน้ำท่าจีน)', 1, 1, '2025-11-06'::date, '2025-11-06'::date, '2025-11-06'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_293', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Ecological Indicators', 1, 1, '2025-11-09'::date, '2025-11-09'::date, '2025-11-09'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_294', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-11-10'::date, '2025-11-10'::date, '2025-11-10'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_295', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water practice and technology', 1, 1, '2025-11-11'::date, '2025-11-11'::date, '2025-11-11'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_296', 'วิทยากรบรรยาย "ความรู้พื้นฐานเรื่องน้ำเสีย ระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบบำบัดน้ำเสีย"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-11-12'::date, '2025-11-12'::date, '2025-11-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_297', 'วิทยากรบรรยาย "นโยบายการบริหารจัดการคุณภาพน้ำ ในภาพรวมระดับประเทศ"', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'องค์การจัดการน้ำเสีย', 1, 1, '2025-11-13'::date, '2025-11-13'::date, '2025-11-13'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_298', 'ประชุมคณะกรรมการลุ่มน้ำแม่กลอง ครั้งที่ 5/2568 ณ ศาลากลางจังหวัดราชบุรี', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 (คณะกรรมการลุ่มน้ำแม่กลอง)', 1, 1, '2025-11-04'::date, '2025-11-04'::date, '2025-11-04'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_299', 'วิทยากรเสวนา "สถานการณ์น้ำท่วม บรรเทาได้ด้วยวิจัย และนวัตกรรม" หัวข้อ สถานการณ์และแนวโน้มน้ำท่วม', 'วิทยากร/อาจารย์พิเศษ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'สำนักงานการวิจัยแห่งชาติ (วช.) กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม', 1, 1, '2025-11-14'::date, '2025-11-14'::date, '2025-11-14'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_300', 'วิทยากรเสวนา "สถานการณ์น้ำท่วม บรรเทาได้ด้วยวิจัย และนวัตกรรม" หัวข้อ บทเรียน และข้อเสนอแนะการน้ำในพื้นที่ภาคกลาง', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานการวิจัยแห่งชาติ (วช.) กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม', 1, 1, '2025-11-14'::date, '2025-11-14'::date, '2025-11-14'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_301', 'นำเสนอหัวข้อความท้าทายต่อการขับเคลื่อนมิต "ข้อท้าทายต่อการขับเคลื่อนการส่งเสริมความเข้มแข็งกลไกการบริหารจัดการน้ำเชิงพื้นที่" ในงานสัชชาสุขภาพแห่งชาติ ครั้งที่ 18', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานคณะกรรมการสุขภาพแห่งชาติ ในฐานะกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิในคณะกรรมการ ลุ่มน้ำเจ้าพระยา', 1, 1, '2025-11-28'::date, '2025-11-28'::date, '2025-11-28'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_302', 'ประชุมคณะทำงานด้านวิชาการ THAICID ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คณะทำงานด้านวิชาการ THAICID กรมชลประทานปากเกร็ด จ.นนทบุรี', 1, 1, '2025-11-17'::date, '2025-11-17'::date, '2025-11-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_303', 'ประชุมคณะทำงานด้านวิชาการ THAICID ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE',
    'คณะทำงานด้านวิชาการ THAICID กรมชลประทานปากเกร็ด จ.นนทบุรี', 1, 1, '2025-11-17'::date, '2025-11-17'::date, '2025-11-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_304', 'ประชุมคณะทำงานด้านวิชาการ THAICID ครั้งที่ 1/2569', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'คณะทำงานด้านวิชาการ THAICID กรมชลประทานปากเกร็ด จ.นนทบุรี', 1, 1, '2025-11-17'::date, '2025-11-17'::date, '2025-11-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_305', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water practice and technology', 1, 1, '2025-11-21'::date, '2025-11-21'::date, '2025-11-21'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_306', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water', 1, 1, '2025-11-23'::date, '2025-11-23'::date, '2025-11-23'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_307', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water Resources Management', 1, 1, '2025-11-25'::date, '2025-11-25'::date, '2025-11-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_308', 'แต่งตั้งคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'คำสั่งกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม ที่ 203/2568 ลว. 30 พ.ย. 2568', 1, 1, '2025-11-30'::date, '2025-11-30'::date, '2025-11-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_309', 'แต่งตั้งคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'คำสังกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม ที่ 203/2568 ลว. 30 พ.ย. 2568', 1, 1, '2025-11-30'::date, '2025-11-30'::date, '2025-11-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_310', 'แต่งตั้งคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.จุติเทพ วงษ์เพชร์', 1167, 'IRE',
    'คำสั่งกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม ที่ 203/2568 ลว. 30 พ.ย. 2568', 1, 1, '2025-11-30'::date, '2025-11-30'::date, '2025-11-30'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_311', 'ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC- HMS เพื่อการบริหารจัดการน้ำท่วม ครั้งที่ 2/2568', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC- HMS', 1, 1, '2025-11-25'::date, '2025-11-25'::date, '2025-11-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_312', 'ศูนย์สัตว์ทดลองแห่งชาติ มหาวิทยาลัยมหิดล เข้าศึกษาดูงานเครื่องอัดกระถาง และผลิตภัณฑ์', 'ศึกษาดูงาน วศ.กพส.', 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจนายภัทรพล ชูราศรีนางสาวธันยพร โส๊ะอ้น', 843, 'EEEC',
    'ศูนย์สัตว์ทดลองแห่งชาติ มหาวิทยาลัยมหิดล', 1, 20, '2025-11-12'::date, '2025-11-12'::date, '2025-11-12'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_313', 'ประชุมคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน ครั้งที่ 1/2568', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สำนักงานการวิจัยแห่งชาติ (วช.)', 1, 1, '2025-12-01'::date, '2025-12-01'::date, '2025-12-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_314', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water practice and technology', 1, 1, '2025-12-09'::date, '2025-12-09'::date, '2025-12-09'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_315', 'ประชุมคณะกรรมการและที่ปรึกษา สมาคมนักอุทกวิทยาไทย', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'สมาคมนักอุทกวิทยาไทย วาระปี 2568-2569 ครั้งที่ 2/2568', 1, 1, '2025-12-11'::date, '2025-12-11'::date, '2025-12-11'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_316', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Ecological Indicators', 1, 1, '2025-12-16'::date, '2025-12-16'::date, '2025-12-16'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_317', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Biresource Technology Reports', 1, 1, '2025-12-17'::date, '2025-12-17'::date, '2025-12-17'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_318', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'วารสาร Water practice and technology', 1, 1, '2025-12-22'::date, '2025-12-22'::date, '2025-12-22'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_319', 'วิทยากรบรรยาย', 'วิทยากร/อาจารย์พิเศษ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'กิจกรรมเสวานาหัวข้อ "เราจะมีส่วนร่วมในการบริหารทรัพยากรน้ำระดับลุ่มน้ำเจ้าพระยาอย่างไร" ณ โรงแรม คลาสสิค คามิโอ อยุธยา จ.พระนครศรีอยุธยา', 1, 1, '2025-12-24'::date, '2025-12-24'::date, '2025-12-24'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_320', 'ได้รับแต่งตั้งเป็นประธานคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE',
    'ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68', 1, 1, '2025-12-01'::date, '2025-12-01'::date, '2025-12-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_321', 'ได้รับแต่งตั้งเป็นรองประธานคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE',
    'ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68', 1, 1, '2025-12-01'::date, '2025-12-01'::date, '2025-12-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_322', 'ได้รับแต่งตั้งเป็นอนุกรรมการ ในคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ', 'ผู้ทรงคุณวุฒิ', 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE',
    'ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68', 1, 1, '2025-12-01'::date, '2025-12-01'::date, '2025-12-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_323', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE',
    'ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68', 1, 1, '2025-12-01'::date, '2025-12-01'::date, '2025-12-01'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_324', 'เป็นผู้ทรงคุณวุฒิประเมินบทความนานาชาติ', 'ผู้ทรงคุณวุฒิ', 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE',
    'วารสาร Engineering, Technology & Applied Science Research', 1, 1, '2025-12-26'::date, '2025-12-26'::date, '2025-12-26'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

INSERT INTO academic_services (
    legacy_id, name, service_category, provider_name, provider_personnel_id, department_code,
    target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year,
    remarks, created_at, updated_at
) VALUES (
    'srv_68_325', 'ภาควิชาวิศวกรรมชลประทาน คณะวิศวกรรมศาสตร์ กำแพงแสน ร่วมการประชุม ณ ห้องประชุมศูนย์ปฏิบัติการน้ำอัจฉริยะ สำนักงานชลประทานที่ 1 (SWOC1) จังหวัดเชียงใหม่', 'วิชาการ', 'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', 883, 'IRE',
    'กรมชลประทาน วางกรอบงานวิจัยบริหารจัดการน้ำ โครงการอุโมงค์ผันน้ำแม่แตง–แม่งัด–แม่กวง', 1, 1, '2025-12-25'::date, '2025-12-25'::date, '2025-12-25'::date, 2568,
    NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    fiscal_year = 2568;

-- ----------------------------------------------------------------------------
-- Section 5: ผลงานตีพิมพ์ ประจำปีงบประมาณ 2568 (143 รายการ)
-- ----------------------------------------------------------------------------
INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-1', 'กรรมวิธีการสกัดลิกนินจากปาล์ม', 'เตรียมความพร้อม', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.กันต์ธกรณ์ เขาทอง', 948, 'ME', 2568,
    'ม.ค.68', NULL, 'in_press', NULL, 'นายปกรณ์เกียรติ พงษ์สรอย,นายวสุ นิยมทอง,นายณัฐพล เชาว์พร้อมรร.สาธิต', NULL,
    FALSE, TRUE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-2', 'A simple and cost-effective method to measure moisture content for multigrain', 'ตีพิมพ์', 'นานาชาติ', 'Internation Journal of Agricultural Technology, March 2025', '21', '2', '563', '578',
    10000, 'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, 'AE', 2568,
    'เม.ย.68', NULL, 'published', NULL, 'รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์,รศ.ดร.สิรินาฏ น้อยพิทักษณ์,', NULL,
    FALSE, TRUE, FALSE, 'Q3ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-3', 'Development and performance test of a mechanical rice weeder attached to a narrow steel-wheeled tractor', 'ตีพิมพ์', 'นานาชาติ', 'Internation Journal of Agricultural and Biological Engineering', '18', '2', '1', '4',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'เม.ย.68', NULL, 'published', NULL, 'อ.ดร.ชัยยะ จันทรา,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,ผศ.ดร.ภวินท์ ธัญภัทรานนท์,ผศ.ดร.วันรัฐ อับดุลลากาซิม', NULL,
    FALSE, TRUE, FALSE, 'Q2ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-4', 'Development and performance Testing of a Combined Cultivating Implement and Organic Fertilizer Applicator for Sugarcane Ratooning', 'เตรียมความพร้อมตีพิมพ์', 'นานาชาติ', 'AgriEngineering, 2025', '7', '105', '1', '14',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'เม.ย.68', NULL, 'in_press', NULL, 'รศ.ดร.แก้วกานต์ พวงสมบัติ,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', NULL,
    FALSE, TRUE, FALSE, 'ค่าลงทะเบียนตีพิมพ์ Q1บิกเงินส่วนเกินที่เหลือจากภาควิชาแล้ว จำนวน 20,000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-5', 'Compaction Characteristics under Modified Proctor and Agriculture Engineering Tests Influenced by Organic Matter Application Level', 'ตีพิมพ์', 'นานาชาติ', 'Malaysian Journal of Soil Science, 2025', '29', '-', '189', '197',
    10000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'เม.ย.68', NULL, 'published', NULL, 'อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,แสงทอง, ทิพย์วรรณ', NULL,
    FALSE, TRUE, FALSE, 'Q3ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-6', 'กลไกกรีดฝักข้าวโพดอ่อนปรับความลึกอัตโนมัติ', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 1153, 'AE', 2568,
    'เม.ย.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-7', 'กระบวนการก่อรูปแบบเมมเบรน อิเล็กโทรไลต์ชนิดเจลในเซลล์ อิเล็กโทรไลต์', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล', 899, 'FE', 2568,
    'เม.ย.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-8', 'Calibration and Temperature Compensation of a Low-Cost Capacitive Soil Moisture Sensor for Precision Irrigation in Thailand', 'ตีพิมพ์', 'นานาชาติ', 'Technology & Applied Science Research,April 2025', '15', '2', '21123', '21128',
    20000, 'ผศ.ดร.ชูพันธ์ ชมภูจันทร์', 1163, 'IRE', 2568,
    'พ.ค.68 ', NULL, 'published', 'Q2', 'นายนภัสกร ชุสี,ผศ.ดร.พิเชษฐ์ สืบสายพรหม,อ.ร้อยโท อนุมัติ อิงคนินันท์', NULL,
    FALSE, TRUE, FALSE, 'Q2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-9', 'Piezometer Time-Lag and Pore Pressure Ratio for Identification of Dam Internal Erosion', 'ตีพิมพ์', 'นานาชาติ', 'Civil Engineering Journal,March 2025', '11', '3', '1162', '1179',
    20000, 'ผศ.บรรพต กุลสุวรรณ', 926, 'CE', 2568,
    'พ.ค.68 ', NULL, 'published', NULL, 'Wiphada Thepjunthra,Warakorn Mairaing,Montri Jinakulwipat,Thawatchai Chalermpornchai', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสมทบในส่วนของภาควิชาแล้วจำนวน 20,000 บาท', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-10', 'The Effect of Irrigation Practices on Stress-Related Physiological Characteristics, Water Productivity, and Water Footprint in Rice Cultivation', 'ตีพิมพ์', 'นานาชาติ', 'Environmental and Sustainability Indicatiors,April 2025', '26', '100695', '1', '13',
    20000, 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 2568,
    'พ.ค.68 ', NULL, 'published', NULL, 'Bittawat Wichaidist,Amornrat Intrman,Pawit Junhom,Songsak Puttrawutichai,Chawakorn Rewtragulpaibul', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-11', 'การพัฒนาไถระเบิดดินดานสองขาเรียงตามแนวการเคลื่อนที่แบบปรับความลึกขาไถอัตโนมัติ', 'ตีพิมพ์', 'ชาติ', 'วารสารวิชาการเกษตรเดือนกันยายน-ธันวาคม 2567', '42', '3', '234', '244',
    5000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'พ.ค.68 ', NULL, 'published', NULL, 'นายชานน ชะเอง,อ.ดร.ชัยยะ จันทรา,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์,ผศ.ดร.วันรัฐ อับดุลลากาซิม', NULL,
    FALSE, TRUE, FALSE, 'TCI 1เบิกเงินสนับสนุนในส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-12', 'Evaluation of durian maturity using short-range, coded-light, three-dimensional scanner with machine learning', 'ตีพิมพ์', 'นานาชาติ', 'Postharvest Biology and Technology, January 2025', '222', '113342', '1', '7',
    20000, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 1153, 'AE', 2568,
    'พ.ค.68 ', NULL, 'published', NULL, 'รศ.ดร.ธนา ชีพสมทรง,รศ.ดร.อาทิตย์ พวงสมบัติ,รศ.ดร.แก้วกานต์ พวงสมบัติ,ดร.พีรพงษ์ แสงวนางค์กูล,ศ.ดร.จริงแท้ ศิริพานิช', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสนับสนุนในส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-13', 'Evaluating river basin plans’ effects on water stress in Thailand’s economic development area', 'ตีพิมพ์', 'นานาชาติ', 'Internation Journal of Water Resources Development, October 2024', '40', '6', '967', '988',
    20000, 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 2568,
    'พ.ค.68 ', NULL, 'published', NULL, 'Supatchaya Chuanpongpanich,Jutithep Vongphet,Thunwadee Tachapattaworakul Suksaroj, Bancha Kwanyuen,Songsak Puttrawutichai,Tawatchai Tingsanchali', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสนับสนุนในส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-14', 'แผ่นแปะบรรเทาอาการโรคริดสีดวงทวาร', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.กันต์ธกรณ์ เขาทอง', 948, 'ME', 2568,
    'พ.ค.68 ', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-15', 'Assessing Water Use Efficiency and Stress in Thailand''s River Basins: Trends, Challenges, and Policy Strategies', 'ตีพิมพ์', 'นานาชาติ', 'sustainability 2025', '17', '-', '4477(1)', '4477(26)',
    20000, 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', 881, 'IRE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Chaiyapong Thepprasit,Bawornrat Sukrakanchana', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-16', 'Durability of precast prestressed concrete pile in exposure severe environment', 'ตีพิมพ์', 'นานาชาติ', 'Journal of Metals, Materials and Minerals', '35', '1', 'e1917(1)', 'e1917(12)',
    20000, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Pinai Mungsantisuk', NULL,
    FALSE, TRUE, FALSE, 'Q2ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-17', 'Enhancing Durability in Recycled Concrete: Investigating Chloride Permeability with Recycled Aggregates and Plastic Waste', 'ตีพิมพ์', 'นานาชาติ', 'Civil Engineeribg Journal,เดือน July, 2025', '11', '7', '2983', '2998',
    20000, 'รศ.กฤษณะ จันทรโชติ', 929, 'CE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Somchai Prayongphan,Wanchai Yodsudjai,Wiphada Thepjunthra,Chokchai Trakolkul,Siranya Thongchart', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-18', 'รถไถเดินตามสำหรับกำจัดวัชพืช', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'มิ.ย.68', NULL, 'in_press', NULL, 'ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภาวัตน์,อ.ดร.ชัยยะ จันทรา,นายประเสริฐศักดิ์ ภักดีวงษ์,นางสาวปดิวรดา อนันตศิริ', NULL,
    FALSE, TRUE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-19', 'Sustainable Interlocking Blocks Containing Sugarcane Bagasse Ash: Structural Integrity, Cost Efficiency, and Environmental Benefits', 'ตีพิมพ์', 'นานาชาติ', 'Civil Engineeribg Journal,May, 2025', '11', '5', '-', '-',
    20000, 'รศ.ดร.กมล อมรฟ้า', 925, 'CE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'ผศ.ดร.นิธิรัชต์ สงวนเดือน', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสนับสนุนจากภาคโยธาแล้วจำนวน 10,000 บาท', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-20', 'Effective Heuristics for Solving the Multi-ltem Uncapacitated Lot-Sizing Problem Under Near-Minimal Storage Capacities', 'ตีพิมพ์', 'นานาชาติ', 'Computation,เดือนมิถุนายน 2568', '13', '148', '1', '38',
    20000, 'ผศ.ดร.วรุฒน์ บุญภักดี', 1169, 'IE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Duangrat Hirunyasiri,Peerayuth Charnsethikul', NULL,
    FALSE, TRUE, FALSE, 'Q2ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-21', 'Restrained Shrinkage Behavior of High-Strength Concrete with Various Synthetic Fiber and Cellulose Fiber Proportions', 'ตีพิมพ์', 'นานาชาติ', 'Journal of Materials in Civil Engineering,March 2025', '37', '6', '04025165(1)', '04025165(9)',
    6000, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Panisa Sangkeaw,Chanachai Thongchom,Lapyote Prasitisopin,Withit Pansuk', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสนับสนุนจากภาคแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-22', 'An empirical investigation into enhancing natural convection heat transfer through corona wind in a needle-to-cylinder configuration', 'ตีพิมพ์', 'นานาชาติ', 'Case Studies in Thermal Engineering, 2025', '68', '-', '105864', '-',
    5000, 'รศ.กันต์ธกรณ์ เขาทอง', 948, 'ME', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'Chakrit Savanjumrat,Jetsadaporn Priyadumkol,Weerachai Chaiworapuek', NULL,
    FALSE, TRUE, FALSE, 'Q1เบิกเงินสนับสนุนจากภาคแล้วจำนวน 5,000 บาท', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-23', 'ผลของสารก่อผลึกต่อความพรุนและการดูดซึมน้ำในมอร์ต้าร์', 'ตีพิมพ์', 'ชาติ', 'The Journal of Industrial Technology,January 2025', '21', '1', '2697', '5548',
    5000, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'ทักษ์ดนัย เขียวอ่อน,สุวิมล สัจจวาณิชย์,ไพศาล คงคาฉุยฉาย,ประเสริฐ สุวรรณวิทยา,ประหยัด นันทศีล', NULL,
    FALSE, TRUE, FALSE, 'TCI1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-24', 'Development and Performance Testing of a Combined Cultivating Implement and Organic Fertilizer Applicator for Sugarcane Ratooning', 'ตีพิมพ์', 'นานาชาติ', 'AgriEngineering, 2025', '7', '105', '1', '14',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'มิ.ย.68', NULL, 'published', NULL, 'รศ.ดร.แก้วกานต์ พวงสมบัติ,ผศ.ดร.วันรัฐ อับดุลลากาซิม,อ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-25', 'Integration of independentiy preprocessed spectra to improve classification of repeatedly fried durian chips using portable near-infrared spectrometer and machine Learning', 'เตรียมความพร้อมตีพิมพ์ระดับนานาชาติ', 'นานาชาติ', 'AIMS Agriculture and Food', '-', '-', '-', '-',
    20000, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 1153, 'AE', 2568,
    'ก.ค.68', NULL, 'in_press', NULL, 'รศ.ดร.อาทิตย์ พวงสมบัติ,รศ.ดร.แก้วกานต์ พวงสมบัติ,รศ.ดร.สิรินาฎ น้อยพิทักษ์', NULL,
    FALSE, TRUE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-26', 'การพัฒนาผลิตภัณฑ์ข้าวเกรียบมันสำปะหลังพร้อมรับประทานด้วยวิธีไมโครเวฟ', 'ตีพิมพ์', 'ชาติ', 'วารสารวิจัยและส่งเสริมวิชาการเกษตร เดือนพฤษภาคม-สิงหาคม 2567', '41', '2', '145', '156',
    5000, 'ผศ.ดร.วงศ์ผกา วงศ์รัตน์', 901, 'FE', 2568,
    'ก.ค.68', NULL, 'published', 'TCI1', 'กมลพร มีหนองใหญ่,ชนิตา ประสิทธิ์กาญจน์,ณัฐริกา สัปคง,อ.ดร.สยุมพร รัตน์พันธ์', NULL,
    FALSE, TRUE, FALSE, 'TCI1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-27', 'Effective nonlocal finite element formulation for free vibration analysis of S-FGM doubly curved nanoshells based on linear strain–displacement relations using TSDT', 'ตีพิมพ์', 'นานาชาติ', 'Computers & Mathematics with Applications,February 2025', '179', '-', '77', '102',
    4000, 'ผศ.ดร.การันต์ คล้ายฉ่ำ', 918, 'CE', 2568,
    'ก.ค.68', NULL, 'published', NULL, 'Weeraphan Jiammeepreecha,Komkorn Chaidachatorn,Boonchai Phungpaingam,Somchai Chucheepsakul', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-28', 'Modeling of multiphase heat transfer and transport behaviors of paddy in rotary drum drying by CFD-DEM', 'ตีพิมพ์', 'นานาชาติ', 'Case Studies in Thermal Engineering, September 2025', '73', '-', '106551(1)', '106551(21)',
    20000, 'ผศ.ดร.ปรีดา ปรากฎมาก', 1159, 'ME', 2568,
    'ส.ค.68', NULL, 'published', NULL, 'Chaiwat Rattanamechaiskul,Nittaya Junka', NULL,
    FALSE, TRUE, FALSE, 'Q1ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-29', 'Natural deep eutectic solvent polyphenol and cellulose from jackfruit peel as binary bio‑fillers in jackfruit seed flour/poly (vinyl alcohol)‑based sustainable composite films', 'ตีพิมพ์', 'นานาชาติ', 'Cellulose,June 2025', '-', '-', '1', '20',
    20000, 'ศ.ดร.รังสินี โสธรวิทย์', 1152, 'FE', 2568,
    'ส.ค.68', NULL, 'published', 'Q1', 'Aungkana Orsuwan', NULL,
    FALSE, TRUE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-30', 'Effects of Mixing Techniques on Properties of Reactive Powder Concrete Containing Fly Ash', 'ตีพิมพ์', 'นานาชาติ', 'Engineering Access,June-December 2025', '11', '2', '200', '205',
    2500, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'FE', 2568,
    'ส.ค.68', NULL, 'published', NULL, 'Jinhao Wei,Nida Chaimoon,Krit Chaimoon', NULL,
    FALSE, TRUE, FALSE, 'Q3ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-31', 'อุปกรณ์ไฟฟ้าช็อตที่มีค่ากระแสไฟฟ้าขาออกไม่เกินสองมิลลิแอมป์', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', 1156, 'FE', 2568,
    'ก.ย.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-32', 'Flow Measurement Using Bypass Flow Meters for Smart Farming Applications', 'ตีพิมพ์', 'ชาติ', 'วารสาร Science and Engineering Connect,March 2025', '48', '1', '69', '90',
    5000, 'รศ.ดร.สมชาย ดอนเจดีย์', 878, 'IRE', 2568,
    'ก.ย.68', NULL, 'published', 'TCI 1', 'Varawoot Vudhivanich,Nimit Cherdchanpipat,Sudtawee Wanitjaratkit,Apisit Nuching,Phatchareeya Waiphara,Chaiya Phounphotisop,Paisan Wannakua', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-33', 'Integration of independently preprocessed spectra to improve classification of repeatedly fried durian chips using portable near-infrared spectrometer and machine learning', 'ตีพิมพ์', 'นานาชาติ', 'วารสาร AIMS Agriculture and Food,เดือน July 2025', '10', '3', '577', '595',
    20000, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', 1153, 'AE', 2568,
    'ก.ย.68', NULL, 'published', NULL, 'รศ.ดร.อาทิตย์ พวงสมบัติ,รศ.ดร.แก้วกานต์ พวงสมบัติ,รศ.ดร.สิรินาฎ น้อยพิทักษ์', NULL,
    FALSE, TRUE, FALSE, 'Q2ส่งเบิกส่วนของภาควิชาแล้ว', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-34', 'A machine learning approach to sustainable land use: Integrating Markov chains and XGBoost for black galingale cultivation in Thailand', 'เตรียมความพร้อมตีพิมพ์ระดับนานาชาติ', 'นานาชาติ', 'Environmental and Sustainability Indicators,August 30, 2025', '2025', '28', '100896(1)', '100896(15)',
    20000, 'รศ.ดร.ศศรส ใจจิตร์', 971, 'IE', 2568,
    'ต.ค.68', NULL, 'in_press', 'Q1', 'Punpiti Piamsa-nga,Aphisak Witthayapraphakorn', NULL,
    FALSE, TRUE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-35', 'เครื่องทดสอบมุมกองวัสดุ', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'ผศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    'ต.ค.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-36', 'เครื่องทดสอบค่าสัมประสิทธิ์ความเสียดทานสถิตระหว่างวัตถุกับพื้นผิว', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'ผศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    'ต.ค.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-37', 'เครื่องทดสอบสัมประสิทธิ์การกระดอนของวัสดุ', 'เตรียมความพร้อมจดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'ผศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    'ต.ค.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกร่างคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-38', 'การวิเคราะห์ปริมาณการไหลพื้นฐานของลุ่มน้ำป่าสัก', 'ตีพิมพ์', 'ชาติ', 'วารสารวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา เดือนมกราคม-มิถุนายน 2569', '10', '1', '73', '81',
    1666, 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE', 2568,
    'ต.ค.68', NULL, 'published', 'TCI 1', 'วิชญพงศ์ ปรางงาม,ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-39', 'Deep reinforcement Learning for multiple reservoir operation planning in the Chao Phraya River Basin', 'ตีพิมพ์', 'นานาชาติ', 'Modeling Earth Systems and Environment (2025) 11:102', '11', '102', '1', '17',
    2857, 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE', 2568,
    'ต.ค.68', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-40', 'Axial compressive performance of sustainable BFRP-confined rectangular columns using recycled brick aggregates', 'ตีพิมพ์', 'นานาชาติ', 'Composites part C: Open Access', '18(2025)', '100653', '1', '15',
    20000, 'ผศ.ชิษณุพงศ์ สุธัมมะ', 919, 'CE', 2568,
    'ต.ค.68', NULL, 'published', 'Q1', 'Ali Ejaz b, Muhammad Jawed Iqbal,Ekkachai Yooprasertchai,Qudeer Hussain Sua-iam,Burachat Chatveera,Preeda Chaimahawan,Panumas Saingam', NULL,
    FALSE, TRUE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-41', 'การประเมินความคุ้มค่าทางด้านเศรษฐศาสตร์ของการใช้งานรถสวัสดิการ ภายในมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน', 'ตีพิมพ์', 'ชาติ', 'วารสารวิชาการ มทร.สุวรรณภูมิ', '13', '2', '183', '198',
    5000, 'รศ.ดร.นิภาวรรณ กุลสุวรรณ', 928, 'CE', 2568,
    'พ.ย.68 ', NULL, 'published', 'TCI 1', 'นาบปณิธาน กลั่นเกษรผศ.บรรพต กุลสุวรรณรศ.กฤษณะ จันทรโชติ', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-42', 'การพัฒนาอุโมงค์อบแห้งพลังงานแสงอาทิตย์สำหรับมันเส้น', 'ตีพิมพ์', 'ชาติ', 'วารสารวิศวกรรมศษสตร์และนวัตกรรม', '17', '4', '11', '17',
    5000, 'ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 852, 'AE', 2568,
    'พ.ย.68 ', NULL, 'published', 'TCI 1', 'นายจิรวัฒน์ สิริพัฒนาสมบัติ', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-43', 'การพัฒนากลไกปลูกต้นกล้าอ้อยในแนวดิ่งสำหรับอุปกรณ์ปลูกต้นกล้าอ้อย', 'ตีพิมพ์', 'ชาติ', 'วารสารวิชาการเกษตร', '42', '3', '245', '256',
    5000, 'ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 852, 'AE', 2568,
    'พ.ย.68 ', NULL, 'published', 'TCI 1', 'นายภธร จันทรอุดม', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-44', 'การวัดทอร์กที่เพลาชุดลำเลียงปุ๋ยรูปดาว', 'ตีพิมพ์', 'ชาติ', 'วารสารวิศวกรรมศาสตร์และนวัตกรรม', '18', '3', '14', '23',
    5000, 'ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล', 852, 'AE', 2568,
    'พ.ย.68 ', NULL, 'published', 'TCI 1', 'นายวิชเรศ ฟุ้งเฟื่อง รศ.ดร.ประเทือง อุษาบริสุทธิ์', NULL,
    FALSE, TRUE, FALSE, 'TCI 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-45', 'Analysis of the alternative air ductwork by Numerical airflow behavior combined with the New Economic index and standard', 'ตีพิมพ์', 'นานาชาติ', 'Energy and Built Environment', '6', '5', '941', '969',
    20000, 'รศ.กันต์ธกรณ์ เขาทอง', 948, 'ME', 2568,
    'พ.ย.68 ', NULL, 'published', 'Q1', 'Pattaramon Tanadecha ,Kunthakorn Khaothong', NULL,
    FALSE, TRUE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-46', 'Physiological indicators drive climate-smart and sustainable AWD irrigation in rice systems', 'เตรียมความพร้อมตีพิมพ์ระดับนานาชาติ', 'นานาชาติ', 'Physiological indicators drive climate-smart and sustainable AWD irrigation in rice systems', '2025', '15', '39660', '-',
    20000, 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 2568,
    'พ.ย.68 ', NULL, 'in_press', 'Q1', 'Bittawat Wichaidist, Amornrat Intrman, Pavit Junhom, Songsak Puttrawutichai, Chawakorn Rewtragulpaibul, Chaisri suksaroj', NULL,
    FALSE, TRUE, FALSE, 'Q1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-47', 'Development of Determination Methods for Nitrogen Contentin Dendrobium Sonia Earsakul using Near Infrared Hyperspectral Imaging for Plant Health Assessmen', 'เตรียมความพร้อมตีพิมพ์ระดับนานาชาติ', 'นานาชาติ', '-', '-', '-', '-', '-',
    1500, 'รศ.ดร.สิรินาฏ น้อยพิทักษ์', 848, 'AE', 2568,
    'พ.ย.68 ', NULL, 'in_press', NULL, 'pacharaphon chiangngoen,Supatida Abdullakasim,Anupun Terdwongworakul', NULL,
    FALSE, TRUE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-48', 'เครื่องวัดความต้านทานดินแบบอัตโนมัติสำหรับรถแทรกเตอร์', 'เตรียมความพร้อมขออนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    'ธ.ค.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกรางคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-49', 'เครื่องทดลองวัดมุมกองเชิงพลวัตของวัสดุเม็ดในถังหมุนแบบผนังคลื่น', 'เตรียมความพร้อมขออนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '-', '-', '-', '-',
    20000, 'ผศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    'ธ.ค.68', NULL, 'in_press', NULL, NULL, NULL,
    FALSE, FALSE, FALSE, 'ค่าบริการยกรางคำขอ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-50', 'อุปกรณ์ไฟฟ้าช็อตที่มีค่ากระแสไฟฟ้าขาออกไม่เกินสองมิลลิแอมป์', 'เตรียม ความพร้อม จดอนุสิทธิบัตร', 'ชาติ', 'อนุสิทธิบัตร', '1', '1', '1', '10',
    20000, 'รศ.ดร.เชาว์ อินทร์ประสิทธิ์', NULL, 'FE', 2568,
    'รวม68', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-51', 'การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตรของประเทศ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-52', 'การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตร ของประเทศ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์', 857, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-53', 'เป็นผู้ทรงคุณวุฒิ ประเมินบทความนานาชาติ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', NULL, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-54', 'ประชุมคณะอนุกรรมการวิชาการ กรรมการลุ่มน้ำท่าจีน ครั้งที่ 1/2569 online', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-55', 'กรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ปีการศึกษา 2567', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-56', 'ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-57', 'ประชุมรับฟังความคิดเห็นต่อรายงานผลดำเนินการศึกษาและวางแนวทางการแก้ปัญหาอุทกภัยหาดใหญ่อย่างยั่งยืน', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-58', 'วิทยากรบรรยาย "แนวทางการจัดสรรน้ำและการใช้น้ำ และการจัดลำดับความสำคัญของการใช้น้ำ ประกอบการพิจารณาอนุญาตการใช้น้ำในภาวะน้ำแล้ง/น้ำท่วม ในมุมมองของผู้แทนคณะ กรรมการลุ่มน้ำ"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-59', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-60', 'ประชุมหารือแลกเปลี่ยนและรับฟังข้อเสนอแนะโครงการก่อสร้างระบบป้องกันน้ำท่วมพื้นที่ชุมชนเมืองสมุทรสงคราม', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-61', 'เป็นผู้เชี่ยวชาญ "จัดทำร่างประกาศเชิญชวน ร่างเอกสารสำหรับคัดเลือกเอกชน ร่างเอกสารสัญญาร่วมลงทุน"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-62', 'เป็นอนุกรรมการในสมาคมวิศวกรรมสถานแห่ง ประเทศไทย ในพระราชูปถัมภ์', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-63', 'เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินใหม่ห้องปฏิบัติการทดสอบ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-64', 'เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินความสามารถและประสบการณ์เหมาะสม', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-65', 'แต่งตั้งคณะอนุกรรมการวิศวกรรมวัสดุคอนกรีต การซ่อมแซม และการบำรุงรักษาเพื่อความยั่งยืนในคณะกรรมการสาขาวิศวกรรมโยธา ประจำปี 2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-66', 'เป็นกรรมการสอบ วิทยานิพนธ์ของนักศึกษา', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-67', 'แต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์และคณะกรรมการสอบวิทยานิพนธ์ ที่ 21/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-68', 'แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-69', 'เป็นอาจารย์พิเศษ บรรยายในหัวข้อ "Quality Management and Control"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-70', 'วิทยากรค่ายพัฒนาทักษะทางวิชาการ ในหัวข้อ กิจกรรมศาสตร์ของวัสดุและการประคอง', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ', 968, 'IE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-71', 'การบริหารจัดการวัสดุเหลือใช้ทางการเกษตร "การใช้ประโยชน์ฟางข้าวและแกลบ"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ', 843, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-72', 'บริษัท มินริน จำกัด เข้าศึกษาดูงานเครื่องอัดภาชนะใบไม้', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, NULL, NULL, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-73', 'มหาวิทยาลัยสงขลานครินทร์ เข้าศึกษาดูงานและหารือด้านก๊าซชีวภาพ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.นงลักษณ์ เล็กรุ่งเรือง', NULL, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-74', 'วิทยากรการบรรยายในการสัมมนาเชิงปฏิบัติการด้านการพัฒนาผลิตภัณฑ์จากวัสดุเหลือใช้จากกระบวนการผลิตข้าว จ.อยุธยา', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.นงลักษณ์ เล็กรุ่งเรือง', NULL, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-75', 'Review ต้นฉบับบทความวิจัยวารสารระดับนานาชาติ Computers and Electronics In Agriculture 1 เรื่อง', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-76', 'แต่งตั้งผู้ทรงคุณวุฒิพิจารณาบทความวิจัยเพื่อตีพิมพ์ลงวารสารวิชาการ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (ฉบับที่ 349)', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-77', 'แต่งตั้งที่ปรึกษาภายใน ด้านการพัฒนาคุณภาพการศึกษาสู่ความเป็นเลิศ มหาวิทยาลัยเกษตรศาสตร์', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-78', 'Mechanical, fatigue, and microstructural properties of rubber wood fly ash-based alkali-activated concrete', 'ตีพิมพ์', 'นานาชาติ', 'Case Studies in Construction Materials', '2025', '23', 'e05539', '10',
    3333, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-79', 'The Study of the impact of water channel obstructions in the lower Mun River on flooding', 'ตีพิมพ์', 'ชาติ', 'Journal of Applied Research on Science and Technology (JARST)', '24', '3', '1', '12',
    5000, 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-80', 'Performance comparison between gradient orifice and uniform orifice distributors in rotating fluidization for coated jasmine rice', 'เตรียมความพร้อมตีพิมพ์', 'นานาชาติ', 'Journal of Food Engineering', '2026', '408', '112898', '112903',
    800, 'รศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-81', 'Determining the Optimal Order Quantity for Perishable Products Affected by Stochastic Transportation Delays', 'เตรียมความพร้อมตีพิมพ์', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '2025', '1', '1', '21',
    20000, 'ผศ.ดร.จิรเกียรติ ทรายทอง', 966, 'IE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-82', 'การออกแบบและพัฒนาเครื่องกำจัดวัชพืชแบบไม่ใช้สารเคมีต่อท้ายรถแทรกเตอร์', 'ตีพิมพ์', 'ชาติ', 'วารสารวิชาการเกษตร', '43', '3', '241', '251',
    5000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-83', 'A low-cost sensor-based roller weeder to support non-chemical weed control in smallholder rice systems', 'ตีพิมพ์', 'นานาชาติ', 'Journal of the Saudi Society of Agricultural Sciences', '24', '1', '1', '12',
    20000, 'รศ.ดร.ประเทือง อุษาบริสุทธิ์', 849, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-84', 'การปรับปรุงประสิทธิภาพแถวคอยยานพาหนะและการลำเลียงสินค้าผ่านการจำลองสถานการณ์ : กรณีศึกษา (Improving the Efficiency of Vehicle Queuing and Product Conveyance through Simulation : A Case Study)', 'ตีพิมพ์', 'ชาติ', 'Journal of Engineering and Digital Technology (JEDT)', '13', '2', '39', '54',
    5000, 'ผศ.ดร.อณจ ชัยมณี', 969, 'IE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-85', 'ประชุมคณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 1/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์', 869, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-86', 'เป็นผู้ให้การอบรมเกษตรกรสาธิตระบบให้น้ำและปุ๋ยอย่างแม่นยำ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-87', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการน้ำเจ้าพระยา ครั้งที่ 1/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-88', 'ประชุมคณะอนุกรรมการบริหารจัดการสถานการณ์น้ำลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-89', 'วิทยากรบรรยาย "ประเด็นการมีส่วนร่วมในการบริหารจัดการพื้นที่รับน้ำเพื่อการพัฒนาอย่างยั่งยืน"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-90', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-91', 'ประชุมสัมมนาระดมความคิดเห็นกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิ 22 ลุ่มน้ำ เพื่อขับเคลื่อนการพัฒนาลุ่มน้ำอย่างยั่งยืน', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-92', 'วิทยากรให้ความรู้หัวข้อ "โครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในแม่น้ำปิงสายหลัก"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.วิษุวัฒก์ แต้สมบัติ', 879, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-93', 'วิทยากรบรรยายการประชุมเสวนาวิชาการ เรื่อง รู้ทัน การ เปลี่ยนแปลงพร้อมรับมือแล้งนี้', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.วราวุฒิ วุฒิวณิชย์', NULL, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-94', 'ประชุมเสวนาวิชาการ เรื่อง รู้ทัน การเปลี่ยนแปลง พร้อมรับมือแล้งนี้', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-95', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Vector and Raster Data Analysis & Terrain Analysis and Hydrological Modeling ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-96', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Geospatial Modelling for Water Resources Management ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-97', 'อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Remote Sensing in Hydrology ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-98', 'กรรมการสอบเค้าโครงวิทยานิพนธ์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เกศวรา สิทธิโชค', 884, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-99', 'เป็นประธานกรรมการสอบป้องกันวิทยานิพนธ์', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ศ.ดร.รังสินี โสธรวิทย์', NULL, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-100', 'ส่งเสริมและสนับสนุนการวิจัยและนวัตกรรมภายใต้แผนงานน้ำมั่นคง ไม่ท่วม ไม่แล้ง ใน 10 จังหวัดด้านการเกษตร', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-101', 'เป็นผู้ทรงคุณวุฒิในการประชุมระดมสมองเพื่อจัดทำกรอบการวิจัยและนวัตกรรม ประจำปีงบประมาณ 2570 ด้านเศรษฐกิจและการเกษตร', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-102', '7th Asia Pacific International Conference on Industrial Engineering and Operations Management Bangkok, Thailand, March 25-27, 2026', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'นางสาวธันยพร โส๊ะอ้น นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว', NULL, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-103', 'วิทยากรการอบรมเชิงปฏิบัติการสร้างมูลค่าเพิ่มเศษวัสดุเหลือใช้ทางการเกษตร โครงการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม กิจกรรม จัดตั้ง "Green Gain Hub" ระดับจังหวัด ณ ต.บางไทรป่า อ.บางเลน จ.นครปฐม', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.นงลักษณ์ เล็กรุ่งเรือง นายภัทรพล ชูราศรี นายรัตนศักดิ์ ทรัพย์เย็น', NULL, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-104', 'จัดนิทรรศการ ภายใต้โครงการวิจัยการส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก ณ ศูนย์ส่งเสริมและฝึกอบรมการเกษตรแห่งชาติ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'นายรัตนศักดิ์ ทรัพย์เย็น นายเจษฎาพร ด้วงแก้ว', 1007, 'EEEC', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-105', 'เป็นวิทยากรบรรยายในงานสัมมนาความรู้ Design Precaign Strucyural Members with GFRP', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-106', 'เข้าร่วมดำเนินงานโครงการวิจัย การศึกษาความเป็นไปได้ในการปรับปรุงรายการตรวจสอบสภาพอาคารเขื่อนทดแทนน้ำเก่า เพื่อลดความเสี่ยงต่อความเสียหายต่อพื้นที่เกษตรกรรม', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-107', 'เป็นประธานกรรมการและผู้ทรงคุณวุฒิสอบหัวข้อและ เค้าโครงวิทยานิพนธ์', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-108', 'เป็นกรรมการสอบวิทยานิพนธ์ โครงการบัณฑิตศึกษา ในหัวข้อ การประยุกต์ใช้วิธีการตกตะกอนแคลเซียมคาร์บอเนต โดยเชื้อจุลินทรีย์ในมอตาร์ (ออนไลน์)', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-109', 'กรรมการสอบ ป้องกันสารนิพนธ์ของนักศึกษา ระดับปริญญาโท', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-110', 'Invited Speaker ในการประชุมวิชาการ Inaugural Meeting of the Tropical Crops Machinery Branch of the Chinese Society for Agricultural Machinery and the High-Quality Development Forum on Tropical Crop Machinery', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-111', 'Postharvest detection of anthracnose (Colletotrichum asianum) on mango fruit (Mangifera indica L.cv Namdokmai Sithong) using near-infrared response', 'ตีพิมพ์', 'นานาชาติ', 'BMC Plant Biology', '26', '136', '1', '13',
    1666, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', NULL, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-112', 'Sustainable Packaging Film From Chitosan Reinforced With Rice Husk Cellulose Nanocrystals', 'ตีพิมพ์', 'นานาชาติ', 'Packaging Technology and Science', '1', '39', '125', '136',
    20000, 'ศ.ดร.รังสินี โสธรวิทย์', NULL, 'FE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-113', 'Shear Behavior of Ultra-High-Performance Concrete Shear Pockets with Large-sized Studs in Full-Depth Precast Concrete Bridge Deck under Push-off Tests', 'ตีพิมพ์', 'นานาชาติ', 'Applied Science and Engineering Progress', '2025', '3', '1', '14',
    20000, 'รศ.ดร.นันทวัฒน์ ขมหวาน', 922, 'CE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-114', 'Maturity assessment-based dry matter content in Mon Thong durian pulp using machine learning and near-infrared hyperspectral image analysis', 'ตีพิมพ์', 'นานาชาติ', 'IEEE Access', '14', '1', '23542', '23555',
    20000, 'รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร', 985, 'CPE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-115', 'Productivity Improvement of the Coconut Water Conveying System Using Simulation Modeling: A Case Study', 'ตีพิมพ์', 'ชาติ', 'Engineering and Technology Horizons (ETH)', '43', '1', '430102', '430107',
    5000, 'อ.ดร.ปริญญา กวีกิจบัณฑิต', 972, 'IE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-116', 'In vestor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model', 'ตีพิมพ์', 'นานาชาติ', 'Sustainability', '2026', '18', '1', '25',
    20000, 'ผศ.ดร.ศศิวิมล ขาวโกมล', 885, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-117', 'Prototype Framework for Agricultural Drought Monitoring in Northern Thailand Using Satellite-Based Evaporative Stress index', 'เตรียมความพร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    3675, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-118', 'เป็นประธานกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศ ระดับสายสนับสนุน', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.เบญญา กสานติกุล', 946, 'ME', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-119', 'เป็นผู้ทรงคุณวุฒิในการประชุมปรึกษาหารือทางวิชาการเพื่อให้คำแนะนำและแลกเปลี่ยนแนวคิดในหัวข้อ"เทคโนโลยีและการจัดการโรงเรือนปิดสำหรับการปลูกหญ้าหวานเชิงพาณิชย์"', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-120', 'ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-121', 'ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-122', 'ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 3/2569', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.บัญชา ขวัญยืน', 875, 'IRE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-123', 'เป็นผู้ทรงคุณวุฒิในการประเมินผลกระทบของโครงการ ภายใต้โครงการเรื่อง ระบบการให้น้ำอย่างแม่นยำในสวนมะม่วงน้ำดอกไม้สีทองเพื่อการส่งออกจ.ขอนแก่นและจ.ชัยภูมิ', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'รศ.ดร.รณฤทธิ์ ฤทธิรณ', 903, 'FE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-124', 'Keynote Speaker ในการสัมมนาออนไลน์ CAU-KU Online Workshop on Intelligent Agricultural Machinery and Smart Agriculture', 'บทความวิจัยในวารสาร', 'ระดับนานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    0, 'ผศ.ดร.วันรัฐ อับดุลลากาซิม', 845, 'AE', 2568,
    '3-งานบริการวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-125', 'Impact of high-pressure homogenization and ultrasonic techniques on production and characterization of carboxymethyl cellulose from lignocellulosic rice husks', 'ตีพิมพ์', 'นานาชาติ', 'Biomass Conversion and Biorefinery', '1', '16', 'Article no. 172', '10',
    20000, 'ศ.ดร.รังสินี โสธรวิทย์', NULL, 'FE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-126', 'Prototype Framework for Agricultural Drought Monitoring in Northern Thailand Using Satellite-Based Evaporative Stress Index', 'ตีพิมพ์', 'นานาชาติ', 'Journal of Agrometeorology', '28', '1', '80', '87',
    20000, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-127', 'Gully erosion susceptibility assessment in Jhang-Ping and Ping-Lin watersheds: a risk-based model using conditioning indicators', 'ตีพิมพ์', 'นานาชาติ', 'Environmental Earth Sciences', '84', '1', '677', '682',
    2857, 'ผศ.ดร.ชูพันธุ์ ชมภูจันทร์', 872, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-128', 'Exploring Natural Cotton FRP as a Sustainable Method for Confinement of Concrete Made with Natural and Recycled Aggregates', 'ตีพิมพ์', 'นานาชาติ', 'Journal of Natural Fibers', '28', '2634403/1', '1', '28',
    20000, 'ผศ.ชิษณุพงศ์ สุธัมมะ', 919, 'CE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-129', 'From Experiment to Prediction: Machine Learning Solutions for Concrete Strength Assessment with Steel Clamps', 'ตีพิมพ์', 'นานาชาติ', 'Buildings', '16(2026)', '851/4', '1', '26',
    20000, 'ผศ.ชิษณุพงศ์ สุธัมมะ', 919, 'CE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-130', 'การประเมินค่าปริมาณของแข็งที่ละลายได้ของผลแตงโมพันธุ์ซอนญ่าด้วยเทคนิคภาพสเปกโทรสโกปีอินฟราเรดย่านใกล้', 'ตีพิมพ์', 'ชาติ', 'วารสารวิชาการเกษตร', '43', '3', '230', '240',
    5000, 'รศ.ดร.แก้วกานต์ พวงสมบัติ', 846, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-131', 'Investor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model', 'เตรียมความ พร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'ผศ.ดร.ศศิวิมล ขาวโกมล', 885, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-132', 'กรรมวิธีการผลิต เพกทินชนิดเมทอกซิลต่ำโดยใช้กระบวนการอิเล็กโทรลิซิส', 'เตรียมความ พร้อมขอสิทธิบัตร', 'ชาติ', 'สิทธิบัตร', '1', '1', '1', '10',
    20000, 'รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล', 899, 'FE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-133', 'Evaluating the quality of pellets durian peel waste: potential and carbon footprint on production', 'เตรียมความพร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'รศ.ดร.พิมพ์พรรณ ปรืองาม', 854, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-134', 'Intermolecularly aggregated complexation between faba bean protein and purified (NADES-retrieved) acidic phenolics is inferior to its soy protein-phenolic counterpart', 'ตีพิมพ์', 'นานาชาติ', 'วารสาร International Journal of Biological Macromolecules', '1', '357', '151575', '151580',
    20000, 'ศ.ดร.รังสินี โสธรวิทย์', NULL, 'FE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-135', 'Interpreting Satellite Rainfall Bias Correction Through a Rainfall-Runoff Framework in a Monsoon-Influenced River Basin: The Phetchaburi River Basin, Thailand', 'เตรียมความพร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'ผศ.ดร.จุติเทพ วงษ์เพ็ชร์', 883, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-136', 'Water-centric nexus assessment and critical land-use thresholds for economic crops in central Thailand', 'เตรียมความพร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'รศ.ดร.ชัยศรี สุขสาโรจน์', 877, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-137', 'Multiple reservoir optimization using constraint programming for water scarcity resilience in the chao Phraya River Basin', 'ตีพิมพ์', 'นานาชาติ', 'Applied Water Science (2026) 16:135', '16', '135', '1', '25',
    2857, 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-138', 'Filter-based short-wave infrared imaging combined with machine learning for non-destructive quality assessment of durian pulp', 'ตีพิมพ์', 'นานาชาติ', 'Postharvest Biology and Technology', '239', '114365', '1', '10',
    2500, 'ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล', NULL, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-139', 'Synergistic role of supra-GQDs on the mechanical and durability properties of metakaolin-modified concreteSynergistic role of supra-GQDs on the mechanical and durability properties of metakaolin-modified concrete', 'ตีพิมพ์', 'นานาชาติ', 'Results in Engineering Journal', '2026', '30', '110290', '110295',
    6000, 'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์', 921, 'CE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-140', 'จานหมุนแบบรูกระจายขนาดในเครื่องฟลูอิไดซ์เบด', 'เตรียมความพร้อม', 'ชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'รศ.ดร.ปรีดา ปรากฏมาก', 951, 'ME', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-141', 'Water Use Efficiency and Carbon Trade-Offs of Gravit and Pump Irrigation in Rice Cultivation', 'เตรียมความพร้อม', 'นานาชาติ', 'วารสารวิชาการคณะวิศวกรรมศาสตร์', '1', '1', '1', '10',
    20000, 'ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย', 873, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-142', 'A hybrid artificial neural network-Aspen Plus framework for CO2-enhanced biomass gasification and gas turbine performance', 'ตีพิมพ์', 'นานาชาติ', 'Journal of Environmental Chemical Engineering', '14', '2', '121712', '121717',
    3333, 'นายจิรัฐ มั่นเกษม', 1095, 'AE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

INSERT INTO publications (
    legacy_id, title, type, level, journal, volume, issue, page_start, page_end,
    budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be,
    month, month_year, status, quartile, co_authors_domestic, co_authors_foreign,
    has_international_coauthor, has_domestic_coauthor, has_foreign_coauthor, remarks, created_at, updated_at
) VALUES (
    'pub-143', 'Predictive performances of machine learning-and deep learning-based univariate and multivariate reservoir inflow predictions in the Chao Phraya River Basin', 'ตีพิมพ์', 'นานาชาติ', 'Modeling Earth Systems and Environment (2026)12:171', '12', '171', '1', '24',
    2500, 'รศ.ดร.วราวุธ วุฒิวณิชย์', 874, 'IRE', 2568,
    '4-ผลงานทางวิชาการ', NULL, 'published', 'Q1', NULL, NULL,
    FALSE, FALSE, FALSE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    fiscal_year_be = 2568;

COMMIT;
