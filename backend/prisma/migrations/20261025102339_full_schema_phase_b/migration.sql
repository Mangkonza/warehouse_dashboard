-- CreateTable
CREATE TABLE "departments" (
    "code" VARCHAR(10) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "is_canonical" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "personnel" (
    "id" SERIAL NOT NULL,
    "person_id" VARCHAR(50),
    "title_th" VARCHAR(50),
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "position" VARCHAR(100),
    "department_code" VARCHAR(10),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_projects" (
    "id" SERIAL NOT NULL,
    "legacy_id" VARCHAR(100),
    "code" VARCHAR(100),
    "name" VARCHAR(500) NOT NULL,
    "name_en" VARCHAR(500),
    "head_name" VARCHAR(255),
    "head_personnel_id" INTEGER,
    "head_department_code" VARCHAR(10),
    "status" VARCHAR(50),
    "budget_internal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "budget_external" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "fund_source" VARCHAR(255),
    "fund_type" VARCHAR(100),
    "collaboration_type" VARCHAR(100),
    "project_nature" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,
    "fiscal_year" INTEGER,
    "trl_outputs" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_project_members" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "person_name" VARCHAR(255) NOT NULL,
    "personnel_id" INTEGER,
    "role" VARCHAR(100),

    CONSTRAINT "research_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_project_departments" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "department_code" VARCHAR(10) NOT NULL,
    "other_name" VARCHAR(255),

    CONSTRAINT "research_project_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_dev_projects" (
    "id" SERIAL NOT NULL,
    "legacy_id" VARCHAR(100),
    "name" VARCHAR(500) NOT NULL,
    "head_name" VARCHAR(255),
    "head_personnel_id" INTEGER,
    "department_code" VARCHAR(10),
    "client" VARCHAR(255),
    "budget" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "month" VARCHAR(50),
    "fiscal_year" INTEGER,
    "start_date" DATE,
    "end_date" DATE,
    "integration_start_date" DATE,
    "integration_end_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_dev_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" SERIAL NOT NULL,
    "legacy_id" VARCHAR(100),
    "title" VARCHAR(500) NOT NULL,
    "type" VARCHAR(100),
    "level" VARCHAR(50),
    "journal" VARCHAR(500),
    "volume" VARCHAR(50),
    "issue" VARCHAR(50),
    "page_start" VARCHAR(50),
    "page_end" VARCHAR(50),
    "budget" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "first_author_name" VARCHAR(255),
    "first_author_personnel_id" INTEGER,
    "department_code" VARCHAR(10),
    "fiscal_year_be" INTEGER,
    "month" VARCHAR(50),
    "month_year" VARCHAR(50),
    "status" VARCHAR(50),
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_authors" (
    "id" SERIAL NOT NULL,
    "publication_id" INTEGER NOT NULL,
    "person_name" VARCHAR(255) NOT NULL,
    "personnel_id" INTEGER,
    "affiliation_type" VARCHAR(50),

    CONSTRAINT "publication_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_services" (
    "id" SERIAL NOT NULL,
    "legacy_id" VARCHAR(100),
    "name" VARCHAR(500) NOT NULL,
    "service_category" VARCHAR(100) NOT NULL,
    "provider_name" VARCHAR(255),
    "provider_personnel_id" INTEGER,
    "department_code" VARCHAR(10),
    "target_group" VARCHAR(255),
    "hours_spent" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "attendees_count" INTEGER NOT NULL DEFAULT 0,
    "date" DATE,
    "start_date" DATE,
    "end_date" DATE,
    "fiscal_year" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intellectual_properties" (
    "id" SERIAL NOT NULL,
    "legacy_id" VARCHAR(100),
    "title" VARCHAR(500) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "work_category" VARCHAR(100),
    "work_character" VARCHAR(100),
    "creator_name" VARCHAR(255),
    "creator_personnel_id" INTEGER,
    "department_code" VARCHAR(10),
    "application_number" VARCHAR(50),
    "registration_number" VARCHAR(50),
    "filing_date" DATE,
    "protection_start" DATE,
    "protection_end" DATE,
    "support_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(50),
    "fiscal_year" INTEGER,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intellectual_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_inventors" (
    "id" SERIAL NOT NULL,
    "ip_id" INTEGER NOT NULL,
    "person_name" VARCHAR(255) NOT NULL,
    "personnel_id" INTEGER,
    "is_lead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ip_inventors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ip_departments" (
    "id" SERIAL NOT NULL,
    "ip_id" INTEGER NOT NULL,
    "department_code" VARCHAR(10) NOT NULL,
    "other_name" VARCHAR(255),

    CONSTRAINT "ip_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "record_id" VARCHAR(100) NOT NULL,
    "sdg_ids" INTEGER[],
    "i_type" VARCHAR(50),
    "journal_index" VARCHAR(100),
    "evaluated_by" VARCHAR(100),
    "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "username" VARCHAR(100) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(255),
    "granted_by" VARCHAR(100),
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "role_audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "actor_username" VARCHAR(100) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "target_username" VARCHAR(100) NOT NULL,
    "old_role" VARCHAR(50),
    "new_role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funding_sources" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100),

    CONSTRAINT "funding_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_catalog" (
    "course_code" VARCHAR(20) NOT NULL,
    "course_name_th" VARCHAR(255) NOT NULL,
    "course_name_en" VARCHAR(255),
    "department_code" VARCHAR(10),

    CONSTRAINT "course_catalog_pkey" PRIMARY KEY ("course_code")
);

-- CreateIndex
CREATE UNIQUE INDEX "personnel_person_id_key" ON "personnel"("person_id");

-- CreateIndex
CREATE INDEX "personnel_department_code_idx" ON "personnel"("department_code");

-- CreateIndex
CREATE INDEX "personnel_name_th_idx" ON "personnel"("name_th");

-- CreateIndex
CREATE UNIQUE INDEX "research_projects_legacy_id_key" ON "research_projects"("legacy_id");

-- CreateIndex
CREATE INDEX "research_projects_fiscal_year_idx" ON "research_projects"("fiscal_year");

-- CreateIndex
CREATE INDEX "research_projects_head_department_code_idx" ON "research_projects"("head_department_code");

-- CreateIndex
CREATE INDEX "research_projects_status_idx" ON "research_projects"("status");

-- CreateIndex
CREATE INDEX "research_project_members_project_id_idx" ON "research_project_members"("project_id");

-- CreateIndex
CREATE INDEX "research_project_members_personnel_id_idx" ON "research_project_members"("personnel_id");

-- CreateIndex
CREATE INDEX "research_project_departments_project_id_idx" ON "research_project_departments"("project_id");

-- CreateIndex
CREATE INDEX "research_project_departments_department_code_idx" ON "research_project_departments"("department_code");

-- CreateIndex
CREATE UNIQUE INDEX "academic_dev_projects_legacy_id_key" ON "academic_dev_projects"("legacy_id");

-- CreateIndex
CREATE INDEX "academic_dev_projects_fiscal_year_idx" ON "academic_dev_projects"("fiscal_year");

-- CreateIndex
CREATE INDEX "academic_dev_projects_department_code_idx" ON "academic_dev_projects"("department_code");

-- CreateIndex
CREATE UNIQUE INDEX "publications_legacy_id_key" ON "publications"("legacy_id");

-- CreateIndex
CREATE INDEX "publications_fiscal_year_be_idx" ON "publications"("fiscal_year_be");

-- CreateIndex
CREATE INDEX "publications_department_code_idx" ON "publications"("department_code");

-- CreateIndex
CREATE INDEX "publications_type_idx" ON "publications"("type");

-- CreateIndex
CREATE INDEX "publication_authors_publication_id_idx" ON "publication_authors"("publication_id");

-- CreateIndex
CREATE INDEX "publication_authors_personnel_id_idx" ON "publication_authors"("personnel_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_services_legacy_id_key" ON "academic_services"("legacy_id");

-- CreateIndex
CREATE INDEX "academic_services_fiscal_year_idx" ON "academic_services"("fiscal_year");

-- CreateIndex
CREATE INDEX "academic_services_department_code_idx" ON "academic_services"("department_code");

-- CreateIndex
CREATE INDEX "academic_services_service_category_idx" ON "academic_services"("service_category");

-- CreateIndex
CREATE UNIQUE INDEX "intellectual_properties_legacy_id_key" ON "intellectual_properties"("legacy_id");

-- CreateIndex
CREATE INDEX "intellectual_properties_fiscal_year_idx" ON "intellectual_properties"("fiscal_year");

-- CreateIndex
CREATE INDEX "intellectual_properties_department_code_idx" ON "intellectual_properties"("department_code");

-- CreateIndex
CREATE INDEX "intellectual_properties_type_idx" ON "intellectual_properties"("type");

-- CreateIndex
CREATE INDEX "ip_inventors_ip_id_idx" ON "ip_inventors"("ip_id");

-- CreateIndex
CREATE INDEX "ip_inventors_personnel_id_idx" ON "ip_inventors"("personnel_id");

-- CreateIndex
CREATE INDEX "ip_departments_ip_id_idx" ON "ip_departments"("ip_id");

-- CreateIndex
CREATE INDEX "ip_departments_department_code_idx" ON "ip_departments"("department_code");

-- CreateIndex
CREATE INDEX "evaluations_category_idx" ON "evaluations"("category");

-- CreateIndex
CREATE UNIQUE INDEX "evaluations_category_record_id_key" ON "evaluations"("category", "record_id");

-- CreateIndex
CREATE INDEX "role_audit_logs_target_username_idx" ON "role_audit_logs"("target_username");

-- CreateIndex
CREATE INDEX "role_audit_logs_actor_username_idx" ON "role_audit_logs"("actor_username");

-- AddForeignKey
ALTER TABLE "personnel" ADD CONSTRAINT "personnel_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_projects" ADD CONSTRAINT "research_projects_head_personnel_id_fkey" FOREIGN KEY ("head_personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_projects" ADD CONSTRAINT "research_projects_head_department_code_fkey" FOREIGN KEY ("head_department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_project_members" ADD CONSTRAINT "research_project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_project_members" ADD CONSTRAINT "research_project_members_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_project_departments" ADD CONSTRAINT "research_project_departments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "research_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_project_departments" ADD CONSTRAINT "research_project_departments_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_dev_projects" ADD CONSTRAINT "academic_dev_projects_head_personnel_id_fkey" FOREIGN KEY ("head_personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_dev_projects" ADD CONSTRAINT "academic_dev_projects_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_services" ADD CONSTRAINT "academic_services_provider_personnel_id_fkey" FOREIGN KEY ("provider_personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_services" ADD CONSTRAINT "academic_services_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intellectual_properties" ADD CONSTRAINT "intellectual_properties_creator_personnel_id_fkey" FOREIGN KEY ("creator_personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ip_inventors" ADD CONSTRAINT "ip_inventors_ip_id_fkey" FOREIGN KEY ("ip_id") REFERENCES "intellectual_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ip_inventors" ADD CONSTRAINT "ip_inventors_personnel_id_fkey" FOREIGN KEY ("personnel_id") REFERENCES "personnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ip_departments" ADD CONSTRAINT "ip_departments_ip_id_fkey" FOREIGN KEY ("ip_id") REFERENCES "intellectual_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ip_departments" ADD CONSTRAINT "ip_departments_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_catalog" ADD CONSTRAINT "course_catalog_department_code_fkey" FOREIGN KEY ("department_code") REFERENCES "departments"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- ==========================================================
-- Custom Domain Constraints & Security Triggers (Phase B)
-- ==========================================================

-- 1. Partial Unique Index on Intellectual Properties (type, registration_number)
CREATE UNIQUE INDEX IF NOT EXISTS uq_ip_type_reg_num 
ON intellectual_properties (type, registration_number) 
WHERE registration_number IS NOT NULL AND registration_number <> '';

-- 2. CHECK constraint on IP type (3 valid types)
ALTER TABLE intellectual_properties 
ADD CONSTRAINT chk_ip_type 
CHECK (type IN ('อนุสิทธิบัตร', 'สิทธิบัตร', 'ลิขสิทธิ์'));

-- 3. CHECK constraint on Academic Services category (6 valid categories)
ALTER TABLE academic_services 
ADD CONSTRAINT chk_service_category 
CHECK (service_category IN (
    'วิทยากร/อาจารย์พิเศษ',
    'วิชาการ',
    'วิชาชีพ',
    'ผู้ทรงคุณวุฒิ',
    'วิทยานิพนธ์ภายนอก',
    'ศึกษาดูงาน วศ.กพส.'
));

-- 4. Role Audit Log Append-Only Trigger
CREATE OR REPLACE FUNCTION prevent_role_audit_logs_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'role_audit_logs is append-only: UPDATE and DELETE operations are strictly prohibited.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_role_audit_logs_append_only ON role_audit_logs;
CREATE TRIGGER trg_role_audit_logs_append_only
BEFORE UPDATE OR DELETE ON role_audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_role_audit_logs_mutation();

-- 5. Grant limited CRUD to app users and revoke mutation on audit logs
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ku_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ku_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ku_admin;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO ku_admin;
REVOKE UPDATE, DELETE ON role_audit_logs FROM ku_app;
REVOKE UPDATE, DELETE ON role_audit_logs FROM ku_admin;
