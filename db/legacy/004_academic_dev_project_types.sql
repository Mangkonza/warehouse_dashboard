-- ==============================================================================
-- Migration: 004_academic_dev_project_types.sql
-- Description: Align core.academic_dev_projects with academic project categories,
--              sub-types, custom other description, record number, and remarks.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

-- 1. Ensure table core.academic_dev_projects has new columns
ALTER TABLE core.academic_dev_projects
    ADD COLUMN IF NOT EXISTS project_type_category VARCHAR(100),
    ADD COLUMN IF NOT EXISTS project_sub_types TEXT[],
    ADD COLUMN IF NOT EXISTS project_type_other TEXT,
    ADD COLUMN IF NOT EXISTS record_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS remarks TEXT;

-- 2. Add constraint for the exact 5 academic project categories
ALTER TABLE core.academic_dev_projects
    DROP CONSTRAINT IF EXISTS chk_academic_dev_project_category;

ALTER TABLE core.academic_dev_projects
    ADD CONSTRAINT chk_academic_dev_project_category CHECK (
        project_type_category IS NULL OR project_type_category IN (
            'งานบริการด้านวิจัย',
            'งานที่ปรึกษา',
            'งานบริการด้านฝึกอบรม',
            'งานด้านบริการ',
            'งานบริการอื่นๆ'
        )
    );

-- 3. Create Indexes for fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_academic_dev_project_category
    ON core.academic_dev_projects(project_type_category);

CREATE INDEX IF NOT EXISTS idx_academic_dev_record_number
    ON core.academic_dev_projects(record_number);

-- 4. Add column comments for documentation integrity
COMMENT ON COLUMN core.academic_dev_projects.project_type_category IS 'ประเภทโครงการพัฒนาวิชาการ (5 ประเภทหลัก: งานบริการด้านวิจัย, งานที่ปรึกษา, งานบริการด้านฝึกอบรม, งานด้านบริการ, งานบริการอื่นๆ)';
COMMENT ON COLUMN core.academic_dev_projects.project_sub_types IS 'ประเภทย่อยของโครงการพัฒนาวิชาการ (บันทึกเป็น array ของข้อความ)';
COMMENT ON COLUMN core.academic_dev_projects.project_type_other IS 'ระบุรายละเอียดเพิ่มเติมเมื่อเลือกประเภทย่อย อื่นๆ';
COMMENT ON COLUMN core.academic_dev_projects.record_number IS 'เลขระเบียนโครงการพัฒนาวิชาการ';
COMMENT ON COLUMN core.academic_dev_projects.remarks IS 'หมายเหตุเพิ่มเติมของโครงการพัฒนาวิชาการ';

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- To revert this migration, execute:
--
-- BEGIN;
-- ALTER TABLE core.academic_dev_projects
--     DROP CONSTRAINT IF EXISTS chk_academic_dev_project_category;
-- DROP INDEX IF EXISTS core.idx_academic_dev_record_number;
-- DROP INDEX IF EXISTS core.idx_academic_dev_project_category;
-- ALTER TABLE core.academic_dev_projects
--     DROP COLUMN IF EXISTS remarks,
--     DROP COLUMN IF EXISTS record_number,
--     DROP COLUMN IF EXISTS project_type_other,
--     DROP COLUMN IF EXISTS project_sub_types,
--     DROP COLUMN IF EXISTS project_type_category;
-- COMMIT;
-- ==============================================================================
