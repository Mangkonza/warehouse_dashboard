SET client_encoding = 'UTF8';
TRUNCATE TABLE kpi_option_lookups;
INSERT INTO kpi_option_lookups (field_key, value, label, is_custom, sort_order) VALUES
  ('collection_period', 'ปีงบประมาณ', 'ปีงบประมาณ', false, 1),
  ('collection_period', 'ปีการศึกษา', 'ปีการศึกษา', false, 2),
  ('collection_period', 'ปีปฏิทิน', 'ปีปฏิทิน', false, 3),
  ('collection_period', 'ภาคการศึกษา', 'ภาคการศึกษา', false, 4),
  ('collection_period', 'ไตรมาส', 'ไตรมาส', false, 5),
  ('value_type', 'จำนวนนับ', 'จำนวนนับ', false, 1),
  ('value_type', 'ร้อยละ', 'ร้อยละ', false, 2),
  ('value_type', 'ค่าเฉลี่ย', 'ค่าเฉลี่ย', false, 3),
  ('value_type', 'สัดส่วน A:B', 'สัดส่วน A:B', false, 4),
  ('value_type', 'จำนวนเงิน', 'จำนวนเงิน', false, 5),
  ('value_type', 'คะแนน', 'คะแนน', false, 6),
  ('value_type', 'ข้อความ/ระดับ', 'ข้อความ/ระดับ', false, 7),
  ('reporting_level', 'คณะ', 'คณะ', false, 1),
  ('reporting_level', 'ส่วนงาน', 'ส่วนงาน', false, 2)
ON CONFLICT (field_key, value) DO NOTHING;

UPDATE kpi_reporting_rounds SET name = 'รอบ 6 เดือน' WHERE id = 'round-6m';
UPDATE kpi_reporting_rounds SET name = 'รอบ 9 เดือน' WHERE id = 'round-9m';
