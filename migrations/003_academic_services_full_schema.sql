-- ==============================================================================
-- Migration: 003_academic_services_full_schema.sql
-- Description: Align core.academic_services with the 6 official service categories,
--              date ranges (start/end date), hours spent, attendees count,
--              prefix and service provider details.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

-- 1. Ensure table core.academic_services has all required columns
CREATE TABLE IF NOT EXISTS core.academic_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_title TEXT NOT NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    target_group VARCHAR(255),
    service_category VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    hours_spent NUMERIC(6,2),
    attendees_count INTEGER,
    prefix VARCHAR(50),
    provider_name VARCHAR(255),
    fiscal_year_be INTEGER,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Alter table if core.academic_services already exists
ALTER TABLE core.academic_services
    ADD COLUMN IF NOT EXISTS start_date DATE,
    ADD COLUMN IF NOT EXISTS end_date DATE,
    ADD COLUMN IF NOT EXISTS hours_spent NUMERIC(6,2),
    ADD COLUMN IF NOT EXISTS attendees_count INTEGER,
    ADD COLUMN IF NOT EXISTS prefix VARCHAR(50),
    ADD COLUMN IF NOT EXISTS provider_name VARCHAR(255);

-- 3. Add constraint for the exact 6 service categories
ALTER TABLE core.academic_services
    DROP CONSTRAINT IF EXISTS chk_academic_service_category;

ALTER TABLE core.academic_services
    ADD CONSTRAINT chk_academic_service_category CHECK (
        service_category IN (
            'วิทยากร/อาจารย์พิเศษ',
            'วิชาการ',
            'วิชาชีพ',
            'ผู้ทรงคุณวุฒิ',
            'วิทยานิพนธ์ภายนอก',
            'ศึกษาดูงาน วศ.กพส.'
        )
    );

-- 4. Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_academic_services_category
    ON core.academic_services(service_category);
CREATE INDEX IF NOT EXISTS idx_academic_services_dates
    ON core.academic_services(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_academic_services_provider
    ON core.academic_services(provider_name);

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- To revert this migration, execute:
--
-- BEGIN;
-- ALTER TABLE core.academic_services
--     DROP CONSTRAINT IF EXISTS chk_academic_service_category;
-- DROP INDEX IF EXISTS core.idx_academic_services_provider;
-- DROP INDEX IF EXISTS core.idx_academic_services_dates;
-- DROP INDEX IF EXISTS core.idx_academic_services_category;
-- ALTER TABLE core.academic_services
--     DROP COLUMN IF EXISTS provider_name,
--     DROP COLUMN IF EXISTS prefix,
--     DROP COLUMN IF EXISTS attendees_count,
--     DROP COLUMN IF EXISTS hours_spent,
--     DROP COLUMN IF EXISTS end_date,
--     DROP COLUMN IF EXISTS start_date;
-- COMMIT;
-- ==============================================================================
