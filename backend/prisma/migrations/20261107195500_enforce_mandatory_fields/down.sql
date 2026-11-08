-- Rollback Migration: 20261107195500_enforce_mandatory_fields\down.sql

-- 1. Research Projects
ALTER TABLE "research_projects"
  DROP CONSTRAINT IF EXISTS "chk_research_date_order",
  DROP CONSTRAINT IF EXISTS "chk_research_budget_non_negative",
  ALTER COLUMN "fiscal_year" DROP NOT NULL,
  ALTER COLUMN "fund_type" DROP NOT NULL,
  ALTER COLUMN "start_date" DROP NOT NULL,
  ALTER COLUMN "end_date" DROP NOT NULL,
  ALTER COLUMN "project_nature" DROP NOT NULL;

-- 2. Academic Development Projects
ALTER TABLE "academic_dev_projects"
  DROP CONSTRAINT IF EXISTS "chk_academic_date_order",
  DROP CONSTRAINT IF EXISTS "chk_academic_integration_dates",
  ALTER COLUMN "legacy_id" DROP NOT NULL,
  ALTER COLUMN "client" DROP NOT NULL,
  ALTER COLUMN "department_code" DROP NOT NULL;

-- 3. Publications
ALTER TABLE "publications"
  DROP CONSTRAINT IF EXISTS "chk_publication_budget_non_negative",
  DROP CONSTRAINT IF EXISTS "chk_publication_page_range",
  ALTER COLUMN "fiscal_year_be" DROP NOT NULL,
  ALTER COLUMN "journal" DROP NOT NULL,
  ALTER COLUMN "volume" DROP NOT NULL,
  ALTER COLUMN "issue" DROP NOT NULL,
  ALTER COLUMN "page_start" DROP NOT NULL,
  ALTER COLUMN "page_end" DROP NOT NULL;

-- 4. Academic Services
ALTER TABLE "academic_services"
  DROP CONSTRAINT IF EXISTS "chk_service_date_order",
  DROP CONSTRAINT IF EXISTS "chk_service_positive_metrics",
  ALTER COLUMN "target_group" DROP NOT NULL,
  ALTER COLUMN "start_date" DROP NOT NULL,
  ALTER COLUMN "end_date" DROP NOT NULL;

-- 5. Intellectual Properties
ALTER TABLE "intellectual_properties"
  DROP CONSTRAINT IF EXISTS "chk_ip_petty_patent_reg_no",
  DROP CONSTRAINT IF EXISTS "chk_ip_protection_dates",
  ALTER COLUMN "registration_number" DROP NOT NULL,
  ALTER COLUMN "protection_start" DROP NOT NULL;
