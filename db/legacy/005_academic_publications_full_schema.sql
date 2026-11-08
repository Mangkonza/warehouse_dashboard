-- ==============================================================================
-- Migration: 005_academic_publications_full_schema.sql
-- Description: Align core.publications with the academic publications add/edit schema:
--              name (title), type (3 types), level (ชาติ/นานาชาติ), budget, owner,
--              foreign & domestic co-authors, department, journal/conference info,
--              volume, issue, page ranges, remarks, and month-year.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

-- 1. Ensure table core.publications exists and has all required columns
CREATE TABLE IF NOT EXISTS core.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_title TEXT NOT NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    publication_type VARCHAR(100) NOT NULL,
    publication_level VARCHAR(50) NOT NULL,
    journal_or_conf_name TEXT,
    funding_amount NUMERIC(14,2) DEFAULT 0,
    fiscal_year_be INTEGER,
    volume VARCHAR(50),
    issue VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Alter table to ensure all new/standardized columns exist
ALTER TABLE core.publications
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS level VARCHAR(50),
    ADD COLUMN IF NOT EXISTS budget NUMERIC(14,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS owner TEXT,
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES core.persons(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS department VARCHAR(255),
    ADD COLUMN IF NOT EXISTS co_authors_foreign TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS co_authors_domestic TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS journal TEXT,
    ADD COLUMN IF NOT EXISTS volume VARCHAR(50),
    ADD COLUMN IF NOT EXISTS issue VARCHAR(50),
    ADD COLUMN IF NOT EXISTS page_start VARCHAR(50),
    ADD COLUMN IF NOT EXISTS page_end VARCHAR(50),
    ADD COLUMN IF NOT EXISTS remarks TEXT,
    ADD COLUMN IF NOT EXISTS month_year VARCHAR(50),
    ADD COLUMN IF NOT EXISTS month VARCHAR(20),
    ADD COLUMN IF NOT EXISTS fiscal_year_be INTEGER;

-- 3. Add check constraints for valid values
ALTER TABLE core.publications
    DROP CONSTRAINT IF EXISTS chk_publication_type;

ALTER TABLE core.publications
    ADD CONSTRAINT chk_publication_type CHECK (
        type IS NULL OR type IN (
            'เตรียมความพร้อมตีพิมพ์',
            'เตรียมความพร้อมจดอนุสิทธิบัตร',
            'ตีพิมพ์'
        )
    );

ALTER TABLE core.publications
    DROP CONSTRAINT IF EXISTS chk_publication_level;

ALTER TABLE core.publications
    ADD CONSTRAINT chk_publication_level CHECK (
        level IS NULL OR level IN (
            'ชาติ',
            'นานาชาติ'
        )
    );

ALTER TABLE core.publications
    DROP CONSTRAINT IF EXISTS chk_publication_budget_positive;

ALTER TABLE core.publications
    ADD CONSTRAINT chk_publication_budget_positive CHECK (
        budget IS NULL OR budget >= 0
    );

-- 4. Create Indexes for fast querying, filtering, and search
CREATE INDEX IF NOT EXISTS idx_publications_name
    ON core.publications(name);

CREATE INDEX IF NOT EXISTS idx_publications_type
    ON core.publications(type);

CREATE INDEX IF NOT EXISTS idx_publications_level
    ON core.publications(level);

CREATE INDEX IF NOT EXISTS idx_publications_owner
    ON core.publications(owner);

CREATE INDEX IF NOT EXISTS idx_publications_month_year
    ON core.publications(month_year);

CREATE INDEX IF NOT EXISTS idx_publications_fiscal_year_be
    ON core.publications(fiscal_year_be);

-- 5. Add Comments
COMMENT ON COLUMN core.publications.name IS 'ชื่อผลงานทางวิชาการ (บังคับ)';
COMMENT ON COLUMN core.publications.type IS 'ชนิดของผลงาน (เตรียมความพร้อมตีพิมพ์ / เตรียมความพร้อมจดอนุสิทธิบัตร / ตีพิมพ์)';
COMMENT ON COLUMN core.publications.level IS 'ระดับ (ชาติ / นานาชาติ)';
COMMENT ON COLUMN core.publications.budget IS 'จำนวนเงินสนับสนุน (บาท ไม่ติดลบ)';
COMMENT ON COLUMN core.publications.owner IS 'เจ้าของผลงาน';
COMMENT ON COLUMN core.publications.co_authors_foreign IS 'ผู้ร่วมต่างชาติ (array ของชื่อ)';
COMMENT ON COLUMN core.publications.co_authors_domestic IS 'ผู้ร่วมภายในประเทศ (array ของชื่อ)';
COMMENT ON COLUMN core.publications.department IS 'สังกัดภาควิชา/สาขาวิชา';
COMMENT ON COLUMN core.publications.journal IS 'รายละเอียดวารสาร/การประชุม (สำหรับอนุสิทธิบัตรจะระบุเป็น อนุสิทธิบัตร)';
COMMENT ON COLUMN core.publications.volume IS 'Volume';
COMMENT ON COLUMN core.publications.issue IS 'Issue';
COMMENT ON COLUMN core.publications.page_start IS 'Page start';
COMMENT ON COLUMN core.publications.page_end IS 'Page end';
COMMENT ON COLUMN core.publications.remarks IS 'หมายเหตุ';
COMMENT ON COLUMN core.publications.month_year IS 'เดือน/ปี (พ.ศ.) สำหรับจัดกลุ่มและกรองข้อมูล';

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- To revert this migration, execute:
--
-- BEGIN;
-- ALTER TABLE core.publications
--     DROP CONSTRAINT IF EXISTS chk_publication_budget_positive;
-- ALTER TABLE core.publications
--     DROP CONSTRAINT IF EXISTS chk_publication_level;
-- ALTER TABLE core.publications
--     DROP CONSTRAINT IF EXISTS chk_publication_type;
-- DROP INDEX IF EXISTS core.idx_publications_fiscal_year_be;
-- DROP INDEX IF EXISTS core.idx_publications_month_year;
-- DROP INDEX IF EXISTS core.idx_publications_owner;
-- DROP INDEX IF EXISTS core.idx_publications_level;
-- DROP INDEX IF EXISTS core.idx_publications_type;
-- DROP INDEX IF EXISTS core.idx_publications_name;
-- ALTER TABLE core.publications
--     DROP COLUMN IF EXISTS month,
--     DROP COLUMN IF EXISTS month_year,
--     DROP COLUMN IF EXISTS remarks,
--     DROP COLUMN IF EXISTS page_end,
--     DROP COLUMN IF EXISTS page_start,
--     DROP COLUMN IF EXISTS co_authors_domestic,
--     DROP COLUMN IF EXISTS co_authors_foreign,
--     DROP COLUMN IF EXISTS owner_id,
--     DROP COLUMN IF EXISTS owner,
--     DROP COLUMN IF EXISTS budget,
--     DROP COLUMN IF EXISTS level,
--     DROP COLUMN IF EXISTS type,
--     DROP COLUMN IF EXISTS name;
-- COMMIT;
-- ==============================================================================
