-- Migration: 20261107195500_enforce_mandatory_fields
-- Description: Enforce NOT NULL, length expansions, and CHECK constraints for mandatory fields

-- =========================================================================
-- 1. Research Projects (โครงการวิจัย)
-- =========================================================================

-- Backfill existing nulls safely
UPDATE "research_projects"
SET "fiscal_year" = COALESCE("fiscal_year", 2568)
WHERE "fiscal_year" IS NULL;

UPDATE "research_projects"
SET "fund_type" = COALESCE("fund_type", 'ภายนอก')
WHERE "fund_type" IS NULL;

UPDATE "research_projects"
SET "start_date" = COALESCE("start_date", DATE '2024-10-01')
WHERE "start_date" IS NULL;

UPDATE "research_projects"
SET "end_date" = COALESCE("end_date", "start_date" + INTERVAL '1 year')
WHERE "end_date" IS NULL;

UPDATE "research_projects"
SET "project_nature" = COALESCE("project_nature", 'applied')
WHERE "project_nature" IS NULL OR TRIM("project_nature") = '';

-- Alter columns to NOT NULL
ALTER TABLE "research_projects"
  ALTER COLUMN "fiscal_year" SET NOT NULL,
  ALTER COLUMN "fund_type" SET NOT NULL,
  ALTER COLUMN "start_date" SET NOT NULL,
  ALTER COLUMN "end_date" SET NOT NULL,
  ALTER COLUMN "project_nature" SET NOT NULL,
  ALTER COLUMN "budget_internal" SET NOT NULL,
  ALTER COLUMN "budget_external" SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE "research_projects"
  DROP CONSTRAINT IF EXISTS "chk_research_date_order",
  ADD CONSTRAINT "chk_research_date_order" CHECK ("end_date" >= "start_date");

ALTER TABLE "research_projects"
  DROP CONSTRAINT IF EXISTS "chk_research_budget_non_negative",
  ADD CONSTRAINT "chk_research_budget_non_negative" CHECK ("budget_internal" >= 0 AND "budget_external" >= 0);

-- =========================================================================
-- 2. Academic Development Projects (โครงการพัฒนาวิชาการ)
-- =========================================================================

-- Backfill existing nulls safely
UPDATE "academic_dev_projects"
SET "legacy_id" = COALESCE("legacy_id", 'acad_' || "id"::text)
WHERE "legacy_id" IS NULL;

UPDATE "academic_dev_projects"
SET "client" = COALESCE("client", 'ไม่ระบุผู้ว่าจ้าง')
WHERE "client" IS NULL OR TRIM("client") = '';

UPDATE "academic_dev_projects"
SET "department_code" = COALESCE("department_code", 'OTH')
WHERE "department_code" IS NULL;

-- Alter columns to NOT NULL
ALTER TABLE "academic_dev_projects"
  ALTER COLUMN "legacy_id" SET NOT NULL,
  ALTER COLUMN "client" SET NOT NULL,
  ALTER COLUMN "department_code" SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE "academic_dev_projects"
  DROP CONSTRAINT IF EXISTS "chk_academic_date_order",
  ADD CONSTRAINT "chk_academic_date_order" CHECK ("end_date" IS NULL OR "start_date" IS NULL OR "end_date" >= "start_date");

ALTER TABLE "academic_dev_projects"
  DROP CONSTRAINT IF EXISTS "chk_academic_integration_dates",
  ADD CONSTRAINT "chk_academic_integration_dates" CHECK ("integration_end_date" IS NULL OR "integration_start_date" IS NULL OR "integration_end_date" >= "integration_start_date");

-- =========================================================================
-- 3. Publications (ผลงานตีพิมพ์)
-- =========================================================================

-- Backfill existing nulls safely
UPDATE "publications"
SET "budget" = COALESCE("budget", 0)
WHERE "budget" IS NULL;

UPDATE "publications"
SET "fiscal_year_be" = COALESCE("fiscal_year_be", 2568)
WHERE "fiscal_year_be" IS NULL;

UPDATE "publications"
SET "journal" = COALESCE("journal", 'วารสารวิชาการ')
WHERE "journal" IS NULL OR TRIM("journal") = '';

UPDATE "publications"
SET "volume" = COALESCE("volume", '-')
WHERE "volume" IS NULL OR TRIM("volume") = '';

UPDATE "publications"
SET "issue" = COALESCE("issue", '-')
WHERE "issue" IS NULL OR TRIM("issue") = '';

UPDATE "publications"
SET "page_start" = COALESCE("page_start", '1')
WHERE "page_start" IS NULL OR TRIM("page_start") = '';

UPDATE "publications"
SET "page_end" = COALESCE("page_end", '1')
WHERE "page_end" IS NULL OR TRIM("page_end") = '';

-- Alter columns to NOT NULL
ALTER TABLE "publications"
  ALTER COLUMN "budget" SET NOT NULL,
  ALTER COLUMN "fiscal_year_be" SET NOT NULL,
  ALTER COLUMN "journal" SET NOT NULL,
  ALTER COLUMN "volume" SET NOT NULL,
  ALTER COLUMN "issue" SET NOT NULL,
  ALTER COLUMN "page_start" SET NOT NULL,
  ALTER COLUMN "page_end" SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE "publications"
  DROP CONSTRAINT IF EXISTS "chk_publication_budget_non_negative",
  ADD CONSTRAINT "chk_publication_budget_non_negative" CHECK ("budget" >= 0);

ALTER TABLE "publications"
  DROP CONSTRAINT IF EXISTS "chk_publication_page_range",
  ADD CONSTRAINT "chk_publication_page_range" CHECK (
    "page_start" !~ '^\d+$' OR "page_end" !~ '^\d+$' OR ("page_end"::integer >= "page_start"::integer)
  );

-- =========================================================================
-- 4. Academic Services (งานบริการวิชาการ)
-- =========================================================================

-- Backfill existing nulls safely
UPDATE "academic_services"
SET "target_group" = COALESCE("target_group", 'บุคคลทั่วไป')
WHERE "target_group" IS NULL OR TRIM("target_group") = '';

UPDATE "academic_services"
SET "start_date" = COALESCE("start_date", "date", DATE '2024-10-01')
WHERE "start_date" IS NULL;

UPDATE "academic_services"
SET "end_date" = COALESCE("end_date", "start_date")
WHERE "end_date" IS NULL;

UPDATE "academic_services"
SET "hours_spent" = 1
WHERE "hours_spent" IS NULL OR "hours_spent" <= 0;

UPDATE "academic_services"
SET "attendees_count" = 1
WHERE "attendees_count" IS NULL OR "attendees_count" <= 0;

-- Alter columns to NOT NULL
ALTER TABLE "academic_services"
  ALTER COLUMN "target_group" SET NOT NULL,
  ALTER COLUMN "start_date" SET NOT NULL,
  ALTER COLUMN "end_date" SET NOT NULL,
  ALTER COLUMN "hours_spent" SET NOT NULL,
  ALTER COLUMN "attendees_count" SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE "academic_services"
  DROP CONSTRAINT IF EXISTS "chk_service_date_order",
  ADD CONSTRAINT "chk_service_date_order" CHECK ("end_date" >= "start_date");

ALTER TABLE "academic_services"
  DROP CONSTRAINT IF EXISTS "chk_service_positive_metrics",
  ADD CONSTRAINT "chk_service_positive_metrics" CHECK ("hours_spent" > 0 AND "attendees_count" > 0);

-- =========================================================================
-- 5. Intellectual Properties (ทรัพย์สินทางปัญญา)
-- =========================================================================

-- Expand registration_number column to VARCHAR(50) (accommodating foreign patents up to 20+ chars)
ALTER TABLE "intellectual_properties"
  ALTER COLUMN "registration_number" TYPE VARCHAR(50);

-- Backfill existing nulls safely
UPDATE "intellectual_properties"
SET "registration_number" = '00000' || "id"::text
WHERE "type" = 'อนุสิทธิบัตร' AND ("registration_number" IS NULL OR TRIM("registration_number") = '');

UPDATE "intellectual_properties"
SET "registration_number" = COALESCE("registration_number", '-')
WHERE "registration_number" IS NULL;

UPDATE "intellectual_properties"
SET "protection_start" = COALESCE("protection_start", "filing_date", DATE '2024-10-01')
WHERE "protection_start" IS NULL;

UPDATE "intellectual_properties"
SET "protection_end" = COALESCE("protection_end", "protection_start" + INTERVAL '6 years')
WHERE "protection_end" IS NULL AND "type" != 'ลิขสิทธิ์';

-- Alter columns to NOT NULL
ALTER TABLE "intellectual_properties"
  ALTER COLUMN "registration_number" SET NOT NULL,
  ALTER COLUMN "protection_start" SET NOT NULL;

-- Add CHECK constraints
ALTER TABLE "intellectual_properties"
  DROP CONSTRAINT IF EXISTS "chk_ip_petty_patent_reg_no",
  ADD CONSTRAINT "chk_ip_petty_patent_reg_no" CHECK (
    "type" != 'อนุสิทธิบัตร' OR (TRIM("registration_number") != '' AND "registration_number" != '-')
  );

ALTER TABLE "intellectual_properties"
  DROP CONSTRAINT IF EXISTS "chk_ip_protection_dates",
  ADD CONSTRAINT "chk_ip_protection_dates" CHECK (
    "protection_end" IS NULL OR "protection_start" IS NULL OR "protection_end" >= "protection_start"
  );
