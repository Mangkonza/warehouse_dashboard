-- AlterTable
ALTER TABLE "academic_dev_projects"
  ADD COLUMN IF NOT EXISTS "alloc_dept" DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "alloc_faculty" DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "alloc_ku" DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "alloc_overhead" DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "alloc_remaining" DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "characteristics" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "co_members_external" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "co_members_internal" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "patent_integration" TEXT,
  ADD COLUMN IF NOT EXISTS "project_sub_types" TEXT,
  ADD COLUMN IF NOT EXISTS "project_type_category" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "record_number" VARCHAR(100),
  ADD COLUMN IF NOT EXISTS "remarks" TEXT,
  ADD COLUMN IF NOT EXISTS "research_integration" TEXT,
  ADD COLUMN IF NOT EXISTS "research_projects" TEXT,
  ADD COLUMN IF NOT EXISTS "service_receiver_type" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "status" VARCHAR(50);

-- AlterTable
ALTER TABLE "academic_services"
  ADD COLUMN IF NOT EXISTS "remarks" TEXT;

-- AlterTable
ALTER TABLE "intellectual_properties"
  ADD COLUMN IF NOT EXISTS "owner" VARCHAR(255) DEFAULT 'มหาวิทยาลัยเกษตรศาสตร์',
  ADD COLUMN IF NOT EXISTS "right_holder" VARCHAR(255) DEFAULT 'มหาวิทยาลัยเกษตรศาสตร์';

-- AlterTable
ALTER TABLE "publications"
  ADD COLUMN IF NOT EXISTS "co_authors_domestic" TEXT,
  ADD COLUMN IF NOT EXISTS "co_authors_foreign" TEXT,
  ADD COLUMN IF NOT EXISTS "has_domestic_coauthor" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "has_foreign_coauthor" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "has_international_coauthor" BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS "quartile" VARCHAR(10);

-- AlterTable
ALTER TABLE "research_projects"
  ADD COLUMN IF NOT EXISTS "academic_service" TEXT,
  ADD COLUMN IF NOT EXISTS "applied_courses" TEXT,
  ADD COLUMN IF NOT EXISTS "cross_disciplinary" TEXT,
  ADD COLUMN IF NOT EXISTS "integration" TEXT,
  ADD COLUMN IF NOT EXISTS "remarks" TEXT,
  ADD COLUMN IF NOT EXISTS "teaching_courses" TEXT,
  ADD COLUMN IF NOT EXISTS "trl_end" INTEGER,
  ADD COLUMN IF NOT EXISTS "trl_start" INTEGER;

-- AlterTable
ALTER TABLE "strategic_indicators"
  ADD COLUMN IF NOT EXISTS "dataset_keys" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "manual_excluded_project_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS "manual_included_project_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "user_roles"
  ADD COLUMN IF NOT EXISTS "otp" VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);
