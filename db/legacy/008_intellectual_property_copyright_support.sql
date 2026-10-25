-- ==============================================================================
-- Migration: 008_intellectual_property_copyright_support.sql
-- Description: Expand core.intellectual_properties to support 'ลิขสิทธิ์' (Copyright),
--              increase application_number and registration_number length to VARCHAR(50),
--              add work_category and work_character nullable columns for copyright,
--              and add right_holder/owner column.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

-- 1. Drop existing type check constraint and re-add with 'ลิขสิทธิ์'
ALTER TABLE core.intellectual_properties
  DROP CONSTRAINT IF EXISTS chk_ip_type;

ALTER TABLE core.intellectual_properties
  ADD CONSTRAINT chk_ip_type CHECK (type IN ('อนุสิทธิบัตร', 'สิทธิบัตร', 'ลิขสิทธิ์'));

-- 2. Alter application_number and registration_number to VARCHAR(50)
ALTER TABLE core.intellectual_properties
  ALTER COLUMN application_number TYPE VARCHAR(50);

ALTER TABLE core.intellectual_properties
  ALTER COLUMN registration_number TYPE VARCHAR(50);

-- 3. Ensure protection dates are nullable
ALTER TABLE core.intellectual_properties
  ALTER COLUMN protection_start DROP NOT NULL,
  ALTER COLUMN protection_end DROP NOT NULL;

-- 4. Add copyright-specific fields (nullable for backward compatibility with patents)
ALTER TABLE core.intellectual_properties
  ADD COLUMN IF NOT EXISTS work_category VARCHAR(100),
  ADD COLUMN IF NOT EXISTS work_character VARCHAR(255),
  ADD COLUMN IF NOT EXISTS right_holder VARCHAR(255);

-- 5. Add index for registration_number and work_category
CREATE INDEX IF NOT EXISTS idx_ip_work_category ON core.intellectual_properties(work_category);

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- ==============================================================================
-- BEGIN;
-- DROP INDEX IF EXISTS idx_ip_work_category;
-- ALTER TABLE core.intellectual_properties DROP COLUMN IF EXISTS work_category;
-- ALTER TABLE core.intellectual_properties DROP COLUMN IF EXISTS work_character;
-- ALTER TABLE core.intellectual_properties DROP COLUMN IF EXISTS right_holder;
-- ALTER TABLE core.intellectual_properties ALTER COLUMN application_number TYPE VARCHAR(10);
-- ALTER TABLE core.intellectual_properties ALTER COLUMN registration_number TYPE VARCHAR(10);
-- ALTER TABLE core.intellectual_properties DROP CONSTRAINT IF EXISTS chk_ip_type;
-- ALTER TABLE core.intellectual_properties ADD CONSTRAINT chk_ip_type CHECK (type IN ('อนุสิทธิบัตร', 'สิทธิบัตร'));
-- COMMIT;
-- ==============================================================================
