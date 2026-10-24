-- ==============================================================================
-- คลังข้อมูล (Data Warehouse) คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์
-- สคริปต์โครงสร้างฐานข้อมูลสำหรับการใช้งานจริง (Production DDL & Seed Data)
-- สำหรับ PostgreSQL 15+ / Supabase / Cloud Database
-- สถาปัตยกรรม 2 ชั้น: core (3NF Relational Model) และ analytics (Kimball Star Schema)
-- ==============================================================================

-- 1. ส่วนขยายและการสร้าง Schemas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS analytics;

-- ==============================================================================
-- 1. CORE LAYER (schema: core)
-- Normalized 3NF Relational Model สำหรับ Single Source of Truth และ Web App CRUD
-- ==============================================================================

-- ตารางที่ 1: คณะ / ส่วนงาน
CREATE TABLE IF NOT EXISTS core.faculties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_code VARCHAR(30) UNIQUE NOT NULL,
    faculty_name_th VARCHAR(255) NOT NULL,
    faculty_name_en VARCHAR(255),
    campus_name VARCHAR(100) NOT NULL DEFAULT 'กำแพงแสน',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางที่ 2: ภาควิชา / ศูนย์ / สำนักงาน
CREATE TABLE IF NOT EXISTS core.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES core.faculties(id) ON DELETE CASCADE,
    department_code VARCHAR(50),
    department_name_th VARCHAR(255) NOT NULL,
    department_name_en VARCHAR(255),
    department_type VARCHAR(50) NOT NULL, -- 'ภาควิชา', 'ศูนย์', 'สำนักงานเลขานุการ', 'สำนัก'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_faculty_dept UNIQUE (faculty_id, department_name_th)
);

CREATE INDEX IF NOT EXISTS idx_departments_faculty ON core.departments(faculty_id);

-- ตารางที่ 3: บุคลากร / อาจารย์ / นักวิจัย
CREATE TABLE IF NOT EXISTS core.persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    title_th VARCHAR(50),
    first_name_th VARCHAR(150) NOT NULL,
    last_name_th VARCHAR(150) NOT NULL,
    full_name_normalized VARCHAR(300) NOT NULL,
    academic_position VARCHAR(100),
    personnel_type VARCHAR(50) DEFAULT 'บุคลากรภายใน', -- 'บุคลากรภายใน', 'ภายนอก', 'นิสิต'
    email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_persons_department ON core.persons(department_id);
CREATE INDEX IF NOT EXISTS idx_persons_normalized_name ON core.persons(full_name_normalized);

-- ตารางที่ 4: โครงการวิจัย
CREATE TABLE IF NOT EXISTS core.research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(100),
    project_name_th TEXT NOT NULL,
    project_name_en TEXT,
    managing_department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    collaboration_type VARCHAR(50), -- 'ในประเทศ', 'ต่างประเทศ', 'ไม่มี'
    project_character VARCHAR(150),
    funding_source VARCHAR(255),
    funding_type VARCHAR(50), -- 'ทุนภายใน', 'ทุนภายนอก'
    trl_level VARCHAR(20), -- 'TRL 1' - 'TRL 9'
    integration_type VARCHAR(150),
    duration_months INTEGER,
    budget_amount NUMERIC(14,2),
    budget_internal NUMERIC(14,2) DEFAULT 0,
    budget_external NUMERIC(14,2) DEFAULT 0,
    fiscal_year_be INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    source_ref VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_projects_dept ON core.research_projects(managing_department_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_fy ON core.research_projects(fiscal_year_be);
CREATE INDEX IF NOT EXISTS idx_research_projects_code ON core.research_projects(project_code);

-- ตารางที่ 5: ผู้ร่วมโครงการวิจัยและบทบาท
CREATE TABLE IF NOT EXISTS core.research_project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES core.research_projects(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL, -- 'หัวหน้าโครงการ', 'ผู้ร่วมวิจัย', 'Mentor'
    contribution_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_research_project_member UNIQUE (project_id, person_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_research_members_project ON core.research_project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_research_members_person ON core.research_project_members(person_id);

-- ตารางที่ 6: โครงการพัฒนาวิชาการ
CREATE TABLE IF NOT EXISTS core.academic_dev_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name_th TEXT NOT NULL,
    managing_department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    client_category VARCHAR(100), -- 'ภาครัฐ', 'รัฐวิสาหกิจ', 'เอกชน', 'ชุมชน'
    client_frequency VARCHAR(50), -- 'ครั้งแรก', 'มากกว่า 1 ครั้ง'
    internal_members_count INTEGER DEFAULT 0,
    external_members_count INTEGER DEFAULT 0,
    budget_total NUMERIC(14,2) NOT NULL,
    overhead_15_pct NUMERIC(14,2),
    faculty_share_5_pct NUMERIC(14,2),
    dept_share_5_pct NUMERIC(14,2),
    ku_share_5_pct NUMERIC(14,2),
    integration_type VARCHAR(150),
    policy_alignment VARCHAR(150),
    fiscal_year_be INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    integrated_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academic_dev_dept ON core.academic_dev_projects(managing_department_id);
CREATE INDEX IF NOT EXISTS idx_academic_dev_fy ON core.academic_dev_projects(fiscal_year_be);

-- ตารางที่ 7: ผู้ร่วมโครงการพัฒนาวิชาการ
CREATE TABLE IF NOT EXISTS core.academic_dev_project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES core.academic_dev_projects(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL, -- 'หัวหน้าโครงการ', 'ผู้ร่วมโครงการ'
    affiliation_type VARCHAR(50), -- 'ภายใน', 'ภายนอก'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_dev_project_member UNIQUE (project_id, person_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_academic_dev_members_proj ON core.academic_dev_project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_academic_dev_members_pers ON core.academic_dev_project_members(person_id);

-- ตารางที่ 8: งานบริการวิชาการ
CREATE TABLE IF NOT EXISTS core.academic_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_title TEXT NOT NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    target_group VARCHAR(255),
    service_category VARCHAR(100) NOT NULL, -- 'วิทยากร/อาจารย์พิเศษ', 'วิชาการ', 'วิชาชีพ', 'ผู้ทรงคุณวุฒิ', 'วิทยานิพนธ์ภายนอก', 'ศึกษาดูงาน'
    service_date DATE,
    hours_spent NUMERIC(6,2),
    attendees_count INTEGER,
    fiscal_year_be INTEGER NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academic_services_dept ON core.academic_services(department_id);
CREATE INDEX IF NOT EXISTS idx_academic_services_fy ON core.academic_services(fiscal_year_be);
CREATE INDEX IF NOT EXISTS idx_academic_services_date ON core.academic_services(service_date);

-- ตารางที่ 9: ผู้ให้บริการวิชาการ
CREATE TABLE IF NOT EXISTS core.academic_service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES core.academic_services(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    role_name VARCHAR(50) DEFAULT 'ผู้ให้บริการ',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_academic_service_provider UNIQUE (service_id, person_id)
);

CREATE INDEX IF NOT EXISTS idx_service_providers_service ON core.academic_service_providers(service_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_person ON core.academic_service_providers(person_id);

-- ตารางที่ 10: ผลงานทางวิชาการและสิ่งตีพิมพ์
CREATE TABLE IF NOT EXISTS core.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_title TEXT NOT NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    publication_type VARCHAR(100) NOT NULL, -- 'วารสาร', 'การประชุมวิชาการ', 'เตรียมความพร้อม'
    publication_level VARCHAR(50) NOT NULL, -- 'นานาชาติ', 'ชาติ'
    journal_or_conf_name TEXT,
    quartile_or_tier VARCHAR(50), -- 'Q1', 'Q2', 'Q3', 'Q4', 'TCI 1', 'TCI 2'
    has_international_coauthor BOOLEAN DEFAULT FALSE,
    has_domestic_coauthor BOOLEAN DEFAULT FALSE,
    funding_amount NUMERIC(12,2),
    publication_date DATE,
    fiscal_year_be INTEGER NOT NULL,
    volume VARCHAR(50),
    issue VARCHAR(50),
    page_range VARCHAR(100),
    doi VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publications_dept ON core.publications(department_id);
CREATE INDEX IF NOT EXISTS idx_publications_fy ON core.publications(fiscal_year_be);
CREATE INDEX IF NOT EXISTS idx_publications_quartile ON core.publications(quartile_or_tier);

-- ตารางที่ 11: ผู้ร่วมประพันธ์บทความ
CREATE TABLE IF NOT EXISTS core.publication_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES core.publications(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    author_role VARCHAR(50) NOT NULL, -- 'First Author', 'Corresponding Author', 'Co-Author'
    author_scope VARCHAR(50), -- 'เจ้าของผลงานหลัก', 'ผู้ร่วมต่างชาติ', 'ผู้ร่วมภายในประเทศ'
    contribution_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_publication_author UNIQUE (publication_id, person_id, author_role)
);

CREATE INDEX IF NOT EXISTS idx_publication_authors_pub ON core.publication_authors(publication_id);
CREATE INDEX IF NOT EXISTS idx_publication_authors_pers ON core.publication_authors(person_id);

-- ตารางที่ 12: ทรัพย์สินทางปัญญา
CREATE TABLE IF NOT EXISTS core.intellectual_properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_title TEXT NOT NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    ip_category VARCHAR(100) NOT NULL, -- 'สิทธิบัตรการประดิษฐ์', 'สิทธิบัตรการออกแบบผลิตภัณฑ์', 'อนุสิทธิบัตร', 'ลิขสิทธิ์'
    application_no VARCHAR(100),
    registration_no VARCHAR(100),
    filing_date DATE,
    registration_date DATE,
    expiration_date DATE,
    registration_year_be INTEGER,
    protection_status VARCHAR(50), -- 'อยู่ในระยะเวลาคุ้มครอง', 'หมดอายุ', 'อยู่ระหว่างยื่นขอ'
    protection_level VARCHAR(50) DEFAULT 'ชาติ',
    funding_support_amount NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_dept ON core.intellectual_properties(department_id);
CREATE INDEX IF NOT EXISTS idx_ip_app_no ON core.intellectual_properties(application_no);
CREATE INDEX IF NOT EXISTS idx_ip_reg_no ON core.intellectual_properties(registration_no);

-- ตารางที่ 13: ผู้ประดิษฐ์ทรัพย์สินทางปัญญา
CREATE TABLE IF NOT EXISTS core.ip_inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_id UUID NOT NULL REFERENCES core.intellectual_properties(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    inventor_role VARCHAR(50) DEFAULT 'ผู้ประดิษฐ์', -- 'ผู้ประดิษฐ์หลัก', 'ผู้ร่วมประดิษฐ์'
    contribution_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_ip_inventor UNIQUE (ip_id, person_id)
);

CREATE INDEX IF NOT EXISTS idx_ip_inventors_ip ON core.ip_inventors(ip_id);
CREATE INDEX IF NOT EXISTS idx_ip_inventors_pers ON core.ip_inventors(person_id);

-- ตารางที่ 14: ตัวชี้วัดยุทธศาสตร์
CREATE TABLE IF NOT EXISTS core.strategic_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES core.faculties(id) ON DELETE CASCADE,
    strategy_no VARCHAR(50) NOT NULL, -- เช่น 'ยุทธศาสตร์ที่ 2.1'
    strategy_name TEXT NOT NULL,
    plan_no VARCHAR(50), -- เช่น 'แผนงานที่ 2.1-1'
    plan_name TEXT,
    kpi_code VARCHAR(50) NOT NULL, -- เช่น '2.1-1'
    kpi_name TEXT NOT NULL,
    kpi_description TEXT,
    measurement_unit VARCHAR(50) NOT NULL, -- 'ร้อยละ', 'โครงการ', 'เรื่อง', 'บาท', 'หลักสูตร'
    collection_cycle VARCHAR(50) DEFAULT 'ปีงบประมาณ',
    is_automated_calc BOOLEAN DEFAULT FALSE,
    calc_formula_code VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_strategic_kpis_code UNIQUE (faculty_id, kpi_code)
);

CREATE INDEX IF NOT EXISTS idx_strategic_kpis_fac ON core.strategic_kpis(faculty_id);

-- ตารางที่ 15: ค่าเป้าหมายตัวชี้วัดประจำปีงบประมาณ
CREATE TABLE IF NOT EXISTS core.kpi_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID NOT NULL REFERENCES core.strategic_kpis(id) ON DELETE CASCADE,
    fiscal_year_be INTEGER NOT NULL,
    target_value NUMERIC(14,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_kpi_target UNIQUE (kpi_id, fiscal_year_be)
);

CREATE INDEX IF NOT EXISTS idx_kpi_targets_kpi ON core.kpi_targets(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_targets_fy ON core.kpi_targets(fiscal_year_be);

-- ตารางที่ 16: ผลการดำเนินงานจริงตามรอบการประเมิน
CREATE TABLE IF NOT EXISTS core.kpi_actuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_id UUID NOT NULL REFERENCES core.strategic_kpis(id) ON DELETE CASCADE,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    fiscal_year_be INTEGER NOT NULL,
    evaluation_period VARCHAR(50) NOT NULL, -- 'รอบ 6 เดือน (ต.ค.-มี.ค.)', 'รอบ 12 เดือน (ต.ค.-ก.ย.)'
    actual_value NUMERIC(14,2),
    achievement_rate NUMERIC(6,2),
    is_manual_override BOOLEAN DEFAULT FALSE,
    responsible_person VARCHAR(150),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_kpi_actual UNIQUE (kpi_id, department_id, fiscal_year_be, evaluation_period)
);

CREATE INDEX IF NOT EXISTS idx_kpi_actuals_kpi ON core.kpi_actuals(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_actuals_dept ON core.kpi_actuals(department_id);
CREATE INDEX IF NOT EXISTS idx_kpi_actuals_fy ON core.kpi_actuals(fiscal_year_be);


-- ==============================================================================
-- 2. ANALYTICS LAYER (schema: analytics)
-- Dimensional Model (Star Schema + Bridge Tables) สำหรับ BI Dashboards & Reports
-- ==============================================================================

-- 2.1 DIMENSIONS (ตารางมิติ)

-- มิติที่ 1: มิติเวลา (Conformed Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_date (
    date_key INTEGER PRIMARY KEY, -- e.g. 20250115
    full_date DATE NOT NULL UNIQUE,
    day_of_month INTEGER NOT NULL,
    month_no INTEGER NOT NULL,
    month_name_th VARCHAR(50) NOT NULL,
    quarter INTEGER NOT NULL,
    year_ad INTEGER NOT NULL,
    year_be INTEGER NOT NULL,
    fiscal_year_be INTEGER NOT NULL,
    fiscal_year_ad INTEGER NOT NULL,
    fiscal_quarter VARCHAR(10) NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4'
    academic_year_be INTEGER NOT NULL,
    is_weekend BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_dim_date_fy ON analytics.dim_date(fiscal_year_be);
CREATE INDEX IF NOT EXISTS idx_dim_date_fq ON analytics.dim_date(fiscal_quarter);

-- มิติที่ 2: โครงสร้างองค์กร (Conformed Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_organization (
    organization_key SERIAL PRIMARY KEY,
    faculty_id UUID REFERENCES core.faculties(id) ON DELETE SET NULL,
    department_id UUID REFERENCES core.departments(id) ON DELETE SET NULL,
    campus_name VARCHAR(100) NOT NULL DEFAULT 'วิทยาเขตกำแพงแสน',
    faculty_code VARCHAR(50) NOT NULL,
    faculty_name_th VARCHAR(255) NOT NULL,
    department_code VARCHAR(50),
    department_name_th VARCHAR(255) NOT NULL,
    department_type VARCHAR(50) NOT NULL,
    CONSTRAINT uq_dim_org UNIQUE (faculty_id, department_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_org_fac ON analytics.dim_organization(faculty_id);
CREATE INDEX IF NOT EXISTS idx_dim_org_dept ON analytics.dim_organization(department_id);

-- มิติที่ 3: นักวิจัยและบุคลากร (Conformed Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_researcher (
    researcher_key SERIAL PRIMARY KEY,
    person_id UUID NOT NULL REFERENCES core.persons(id) ON DELETE CASCADE,
    full_name_th VARCHAR(300) NOT NULL,
    title_th VARCHAR(50),
    first_name_th VARCHAR(150) NOT NULL,
    last_name_th VARCHAR(150) NOT NULL,
    academic_position VARCHAR(100),
    department_name_th VARCHAR(255),
    faculty_name_th VARCHAR(255),
    personnel_type VARCHAR(50) DEFAULT 'บุคลากรภายใน',
    email VARCHAR(150),
    CONSTRAINT uq_dim_researcher UNIQUE (person_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_researcher_person ON analytics.dim_researcher(person_id);

-- มิติที่ 4: แหล่งทุนวิจัย (Specific Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_funding_source (
    funding_source_key SERIAL PRIMARY KEY,
    funding_source_name VARCHAR(255) NOT NULL UNIQUE,
    funding_type VARCHAR(50) NOT NULL, -- 'ทุนภายใน', 'ทุนภายนอก'
    funding_sector VARCHAR(100) NOT NULL -- 'หน่วยงานภาครัฐ/กองทุนวิจัย', 'ภาคเอกชน/อุตสาหกรรม', 'มหาวิทยาลัย/คณะ', 'ต่างประเทศ'
);

-- มิติที่ 5: ตัวชี้วัดยุทธศาสตร์ (Specific Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_strategic_kpi (
    kpi_key SERIAL PRIMARY KEY,
    kpi_id UUID NOT NULL REFERENCES core.strategic_kpis(id) ON DELETE CASCADE,
    strategy_no VARCHAR(50) NOT NULL,
    strategy_name TEXT NOT NULL,
    plan_no VARCHAR(50),
    plan_name TEXT,
    kpi_code VARCHAR(50) NOT NULL,
    kpi_name TEXT NOT NULL,
    measurement_unit VARCHAR(50) NOT NULL,
    collection_cycle VARCHAR(50) DEFAULT 'ปีงบประมาณ',
    is_automated_calc BOOLEAN DEFAULT FALSE,
    CONSTRAINT uq_dim_strategic_kpi UNIQUE (kpi_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_kpi_core_id ON analytics.dim_strategic_kpi(kpi_id);

-- มิติที่ 6: มาตรฐานคุณภาพวารสารและสิ่งตีพิมพ์ (Specific Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_publication_tier (
    tier_key SERIAL PRIMARY KEY,
    tier_code VARCHAR(50) NOT NULL UNIQUE, -- 'SCOPUS_Q1', 'SCOPUS_Q2', 'SCOPUS_Q3', 'SCOPUS_Q4', 'TCI_1', 'TCI_2', 'CONFERENCE', 'OTHER'
    tier_name VARCHAR(100) NOT NULL,
    database_source VARCHAR(100) NOT NULL, -- 'Scopus', 'TCI', 'International Conference', 'National Conference'
    publication_level VARCHAR(50) NOT NULL, -- 'นานาชาติ', 'ชาติ'
    is_top_tier BOOLEAN DEFAULT FALSE
);

-- มิติที่ 7: ประเภททรัพย์สินทางปัญญา (Specific Dimension)
CREATE TABLE IF NOT EXISTS analytics.dim_ip_type (
    ip_type_key SERIAL PRIMARY KEY,
    ip_category VARCHAR(100) NOT NULL, -- 'สิทธิบัตรการประดิษฐ์', 'สิทธิบัตรการออกแบบผลิตภัณฑ์', 'อนุสิทธิบัตร', 'ลิขสิทธิ์'
    protection_level VARCHAR(50) DEFAULT 'ชาติ',
    statutory_duration_years INTEGER,
    CONSTRAINT uq_dim_ip_type UNIQUE (ip_category, protection_level)
);


-- 2.2 FACT TABLES (ตารางข้อเท็จจริง)

-- Fact 1: โครงการวิจัย
CREATE TABLE IF NOT EXISTS analytics.fact_research_projects (
    fact_id SERIAL PRIMARY KEY,
    core_project_id UUID REFERENCES core.research_projects(id) ON DELETE CASCADE,
    start_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    end_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    leader_researcher_key INTEGER REFERENCES analytics.dim_researcher(researcher_key),
    funding_source_key INTEGER REFERENCES analytics.dim_funding_source(funding_source_key),
    -- Degenerate Dimensions
    project_code VARCHAR(100),
    collaboration_type VARCHAR(50),
    project_character VARCHAR(150),
    trl_level VARCHAR(20),
    integration_type VARCHAR(150),
    duration_months INTEGER,
    -- Measures
    project_count INTEGER DEFAULT 1,
    budget_total NUMERIC(14,2) DEFAULT 0,
    budget_internal NUMERIC(14,2) DEFAULT 0,
    budget_external NUMERIC(14,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_research_org ON analytics.fact_research_projects(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_research_date ON analytics.fact_research_projects(start_date_key);
CREATE INDEX IF NOT EXISTS idx_f_research_leader ON analytics.fact_research_projects(leader_researcher_key);
CREATE INDEX IF NOT EXISTS idx_f_research_funding ON analytics.fact_research_projects(funding_source_key);

-- Fact 2: โครงการพัฒนาวิชาการและการจัดสรรเงิน
CREATE TABLE IF NOT EXISTS analytics.fact_academic_dev_projects (
    fact_id SERIAL PRIMARY KEY,
    core_project_id UUID REFERENCES core.academic_dev_projects(id) ON DELETE CASCADE,
    start_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    end_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    leader_researcher_key INTEGER REFERENCES analytics.dim_researcher(researcher_key),
    -- Degenerate Dimensions
    client_name VARCHAR(255),
    client_category VARCHAR(100),
    client_frequency VARCHAR(50),
    policy_alignment VARCHAR(150),
    integration_type VARCHAR(150),
    -- Measures
    project_count INTEGER DEFAULT 1,
    budget_total NUMERIC(14,2) DEFAULT 0,
    overhead_15_pct NUMERIC(14,2) DEFAULT 0,
    faculty_share_5_pct NUMERIC(14,2) DEFAULT 0,
    dept_share_5_pct NUMERIC(14,2) DEFAULT 0,
    ku_share_5_pct NUMERIC(14,2) DEFAULT 0,
    internal_members_count INTEGER DEFAULT 0,
    external_members_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_academic_dev_org ON analytics.fact_academic_dev_projects(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_academic_dev_date ON analytics.fact_academic_dev_projects(start_date_key);
CREATE INDEX IF NOT EXISTS idx_f_academic_dev_leader ON analytics.fact_academic_dev_projects(leader_researcher_key);

-- Fact 3: งานบริการวิชาการ
CREATE TABLE IF NOT EXISTS analytics.fact_academic_services (
    fact_id SERIAL PRIMARY KEY,
    core_service_id UUID REFERENCES core.academic_services(id) ON DELETE CASCADE,
    service_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    provider_researcher_key INTEGER REFERENCES analytics.dim_researcher(researcher_key),
    -- Degenerate Dimensions
    service_category VARCHAR(100),
    target_group_name VARCHAR(255),
    target_group_sector VARCHAR(100),
    -- Measures
    service_count INTEGER DEFAULT 1,
    hours_spent NUMERIC(6,2) DEFAULT 0,
    attendees_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_services_org ON analytics.fact_academic_services(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_services_date ON analytics.fact_academic_services(service_date_key);
CREATE INDEX IF NOT EXISTS idx_f_services_provider ON analytics.fact_academic_services(provider_researcher_key);

-- Fact 4: ผลงานทางวิชาการและสิ่งตีพิมพ์
CREATE TABLE IF NOT EXISTS analytics.fact_publications (
    fact_id SERIAL PRIMARY KEY,
    core_pub_id UUID REFERENCES core.publications(id) ON DELETE CASCADE,
    publication_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    first_author_key INTEGER REFERENCES analytics.dim_researcher(researcher_key),
    tier_key INTEGER REFERENCES analytics.dim_publication_tier(tier_key),
    -- Degenerate Dimensions
    publication_type VARCHAR(100),
    journal_name TEXT,
    volume VARCHAR(50),
    issue VARCHAR(50),
    page_range VARCHAR(100),
    doi VARCHAR(150),
    has_international_coauthor BOOLEAN DEFAULT FALSE,
    has_domestic_coauthor BOOLEAN DEFAULT FALSE,
    -- Measures
    publication_count INTEGER DEFAULT 1,
    funding_amount NUMERIC(12,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_pub_org ON analytics.fact_publications(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_pub_tier ON analytics.fact_publications(tier_key);
CREATE INDEX IF NOT EXISTS idx_f_pub_date ON analytics.fact_publications(publication_date_key);
CREATE INDEX IF NOT EXISTS idx_f_pub_author ON analytics.fact_publications(first_author_key);

-- Fact 5: ทรัพย์สินทางปัญญา
CREATE TABLE IF NOT EXISTS analytics.fact_intellectual_properties (
    fact_id SERIAL PRIMARY KEY,
    core_ip_id UUID REFERENCES core.intellectual_properties(id) ON DELETE CASCADE,
    filing_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    grant_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    expiration_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    lead_inventor_key INTEGER REFERENCES analytics.dim_researcher(researcher_key),
    ip_type_key INTEGER REFERENCES analytics.dim_ip_type(ip_type_key),
    -- Degenerate Dimensions
    application_no VARCHAR(100),
    registration_no VARCHAR(100),
    protection_status VARCHAR(50),
    -- Measures
    ip_count INTEGER DEFAULT 1,
    funding_support_amount NUMERIC(12,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_ip_org ON analytics.fact_intellectual_properties(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_ip_filing_date ON analytics.fact_intellectual_properties(filing_date_key);
CREATE INDEX IF NOT EXISTS idx_f_ip_grant_date ON analytics.fact_intellectual_properties(grant_date_key);
CREATE INDEX IF NOT EXISTS idx_f_ip_inventor ON analytics.fact_intellectual_properties(lead_inventor_key);

-- Fact 6: ผลการดำเนินงานตัวชี้วัดยุทธศาสตร์
CREATE TABLE IF NOT EXISTS analytics.fact_kpi_performance (
    fact_id SERIAL PRIMARY KEY,
    core_actual_id UUID REFERENCES core.kpi_actuals(id) ON DELETE CASCADE,
    kpi_key INTEGER NOT NULL REFERENCES analytics.dim_strategic_kpi(kpi_key),
    organization_key INTEGER NOT NULL REFERENCES analytics.dim_organization(organization_key),
    as_of_date_key INTEGER REFERENCES analytics.dim_date(date_key),
    -- Degenerate Dimensions
    fiscal_year_be INTEGER NOT NULL,
    evaluation_period VARCHAR(50) NOT NULL, -- 'รอบ 6 เดือน (ต.ค.-มี.ค.)', 'รอบ 12 เดือน (ต.ค.-ก.ย.)'
    responsible_person VARCHAR(150),
    is_manual_override BOOLEAN DEFAULT FALSE,
    -- Measures
    target_value NUMERIC(14,2) DEFAULT 0,
    actual_value NUMERIC(14,2) DEFAULT 0,
    achievement_rate NUMERIC(6,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_f_kpi_perf_kpi ON analytics.fact_kpi_performance(kpi_key);
CREATE INDEX IF NOT EXISTS idx_f_kpi_perf_org ON analytics.fact_kpi_performance(organization_key);
CREATE INDEX IF NOT EXISTS idx_f_kpi_perf_fy ON analytics.fact_kpi_performance(fiscal_year_be);


-- 2.3 BRIDGE TABLES (ความสัมพันธ์ Many-to-Many สำหรับ Researcher 360°)

-- Bridge 1: ผู้ร่วมโครงการวิจัย
CREATE TABLE IF NOT EXISTS analytics.bridge_research_project_members (
    fact_id INTEGER NOT NULL REFERENCES analytics.fact_research_projects(fact_id) ON DELETE CASCADE,
    researcher_key INTEGER NOT NULL REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL, -- 'หัวหน้าโครงการ', 'ผู้ร่วมวิจัย', 'Mentor'
    contribution_percent NUMERIC(5,2),
    PRIMARY KEY (fact_id, researcher_key, role_name)
);

CREATE INDEX IF NOT EXISTS idx_br_res_researcher ON analytics.bridge_research_project_members(researcher_key);

-- Bridge 2: ผู้ร่วมประพันธ์ผลงานตีพิมพ์
CREATE TABLE IF NOT EXISTS analytics.bridge_publication_authors (
    fact_id INTEGER NOT NULL REFERENCES analytics.fact_publications(fact_id) ON DELETE CASCADE,
    researcher_key INTEGER NOT NULL REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE,
    author_role VARCHAR(50) NOT NULL, -- 'First Author', 'Corresponding Author', 'Co-Author'
    author_scope VARCHAR(50), -- 'เจ้าของผลงานหลัก', 'ผู้ร่วมต่างชาติ', 'ผู้ร่วมภายในประเทศ'
    contribution_percent NUMERIC(5,2),
    PRIMARY KEY (fact_id, researcher_key, author_role)
);

CREATE INDEX IF NOT EXISTS idx_br_pub_researcher ON analytics.bridge_publication_authors(researcher_key);

-- Bridge 3: ผู้ร่วมประดิษฐ์ทรัพย์สินทางปัญญา
CREATE TABLE IF NOT EXISTS analytics.bridge_ip_inventors (
    fact_id INTEGER NOT NULL REFERENCES analytics.fact_intellectual_properties(fact_id) ON DELETE CASCADE,
    researcher_key INTEGER NOT NULL REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE,
    inventor_role VARCHAR(50) DEFAULT 'ผู้ประดิษฐ์', -- 'ผู้ประดิษฐ์หลัก', 'ผู้ร่วมประดิษฐ์'
    contribution_percent NUMERIC(5,2),
    PRIMARY KEY (fact_id, researcher_key)
);

CREATE INDEX IF NOT EXISTS idx_br_ip_researcher ON analytics.bridge_ip_inventors(researcher_key);


-- ==============================================================================
-- 3. AUTOMATED PROCEDURES & FUNCTIONS (ฟังก์ชันระบบ)
-- ==============================================================================

-- 3.1 ฟังก์ชันสร้างข้อมูลปฏิทินและมิติเวลา (analytics.dim_date) อัตโนมัติ
CREATE OR REPLACE FUNCTION analytics.populate_dim_date(p_start_date DATE, p_end_date DATE)
RETURNS VOID AS $$
DECLARE
    v_curr_date DATE := p_start_date;
    v_month INT;
    v_year_ad INT;
    v_year_be INT;
    v_fy_ad INT;
    v_fy_be INT;
    v_fq VARCHAR(10);
    v_acad_be INT;
    v_month_th VARCHAR(50);
BEGIN
    WHILE v_curr_date <= p_end_date LOOP
        v_month := EXTRACT(MONTH FROM v_curr_date)::INT;
        v_year_ad := EXTRACT(YEAR FROM v_curr_date)::INT;
        v_year_be := v_year_ad + 543;
        
        -- ปีงบประมาณไทย เริ่มต้น 1 ตุลาคม (ต.ค. - ธ.ค. เป็น Q1 ของปีงบถัดไป)
        IF v_month >= 10 THEN
            v_fy_ad := v_year_ad + 1;
            v_fy_be := v_year_be + 1;
            v_fq := 'Q1';
        ELSIF v_month <= 3 THEN
            v_fy_ad := v_year_ad;
            v_fy_be := v_year_be;
            v_fq := 'Q2';
        ELSIF v_month <= 6 THEN
            v_fy_ad := v_year_ad;
            v_fy_be := v_year_be;
            v_fq := 'Q3';
        ELSE
            v_fy_ad := v_year_ad;
            v_fy_be := v_year_be;
            v_fq := 'Q4';
        END IF;
        
        -- ปีการศึกษาไทย (ภาคการศึกษาแรกเริ่มประมาณ มิ.ย.)
        IF v_month >= 6 THEN
            v_acad_be := v_year_be;
        ELSE
            v_acad_be := v_year_be - 1;
        END IF;

        -- ชื่อเดือนภาษาไทย
        v_month_th := CASE v_month
            WHEN 1 THEN 'มกราคม'
            WHEN 2 THEN 'กุมภาพันธ์'
            WHEN 3 THEN 'มีนาคม'
            WHEN 4 THEN 'เมษายน'
            WHEN 5 THEN 'พฤษภาคม'
            WHEN 6 THEN 'มิถุนายน'
            WHEN 7 THEN 'กรกฎาคม'
            WHEN 8 THEN 'สิงหาคม'
            WHEN 9 THEN 'กันยายน'
            WHEN 10 THEN 'ตุลาคม'
            WHEN 11 THEN 'พฤศจิกายน'
            WHEN 12 THEN 'ธันวาคม'
        END;

        INSERT INTO analytics.dim_date (
            date_key,
            full_date,
            day_of_month,
            month_no,
            month_name_th,
            quarter,
            year_ad,
            year_be,
            fiscal_year_be,
            fiscal_year_ad,
            fiscal_quarter,
            academic_year_be,
            is_weekend
        )
        VALUES (
            TO_CHAR(v_curr_date, 'YYYYMMDD')::INT,
            v_curr_date,
            EXTRACT(DAY FROM v_curr_date)::INT,
            v_month,
            v_month_th,
            EXTRACT(QUARTER FROM v_curr_date)::INT,
            v_year_ad,
            v_year_be,
            v_fy_be,
            v_fy_ad,
            v_fq,
            v_acad_be,
            EXTRACT(ISODOW FROM v_curr_date) IN (6, 7)
        )
        ON CONFLICT (date_key) DO UPDATE SET
            full_date = EXCLUDED.full_date,
            day_of_month = EXCLUDED.day_of_month,
            month_no = EXCLUDED.month_no,
            month_name_th = EXCLUDED.month_name_th,
            quarter = EXCLUDED.quarter,
            year_ad = EXCLUDED.year_ad,
            year_be = EXCLUDED.year_be,
            fiscal_year_be = EXCLUDED.fiscal_year_be,
            fiscal_year_ad = EXCLUDED.fiscal_year_ad,
            fiscal_quarter = EXCLUDED.fiscal_quarter,
            academic_year_be = EXCLUDED.academic_year_be,
            is_weekend = EXCLUDED.is_weekend;

        v_curr_date := v_curr_date + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3.2 ฟังก์ชันซิงค์โครงสร้างองค์กรเข้าสู่มิติ analytics.dim_organization
CREATE OR REPLACE FUNCTION analytics.sync_dim_organization()
RETURNS VOID AS $$
BEGIN
    INSERT INTO analytics.dim_organization (
        faculty_id,
        department_id,
        campus_name,
        faculty_code,
        faculty_name_th,
        department_code,
        department_name_th,
        department_type
    )
    SELECT 
        f.id AS faculty_id,
        d.id AS department_id,
        f.campus_name,
        f.faculty_code,
        f.faculty_name_th,
        d.department_code,
        d.department_name_th,
        d.department_type
    FROM core.departments d
    JOIN core.faculties f ON d.faculty_id = f.id
    ON CONFLICT (faculty_id, department_id) DO UPDATE SET
        campus_name = EXCLUDED.campus_name,
        faculty_code = EXCLUDED.faculty_code,
        faculty_name_th = EXCLUDED.faculty_name_th,
        department_code = EXCLUDED.department_code,
        department_name_th = EXCLUDED.department_name_th,
        department_type = EXCLUDED.department_type;
END;
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- 4. INITIAL MASTER / SEED DATA (ข้อมูลตั้งต้นพร้อมใช้งานทันที)
-- ==============================================================================

-- 4.1 เติมข้อมูลมิติเวลาย้อนหลังและล่วงหน้า (2020 - 2035)
SELECT analytics.populate_dim_date('2020-01-01'::DATE, '2035-12-31'::DATE);

-- 4.2 ข้อมูลตั้งต้นคณะ (วิทยาเขตกำแพงแสน)
INSERT INTO core.faculties (faculty_code, faculty_name_th, faculty_name_en, campus_name) VALUES
('ENG_KPS', 'คณะวิศวกรรมศาสตร์ กำแพงแสน', 'Faculty of Engineering at Kamphaeng Saen', 'กำแพงแสน'),
('AGR_KPS', 'คณะเกษตร กำแพงแสน', 'Faculty of Agriculture at Kamphaeng Saen', 'กำแพงแสน'),
('FLAS_KPS', 'คณะศิลปศาสตร์และวิทยาศาสตร์', 'Faculty of Liberal Arts and Science', 'กำแพงแสน'),
('EDU_KPS', 'คณะศึกษาศาสตร์และพัฒนศาสตร์', 'Faculty of Education and Development Sciences', 'กำแพงแสน'),
('SPS_KPS', 'คณะวิทยาศาสตร์การกีฬาและพัฒนศาสตร์', 'Faculty of Sports Science', 'กำแพงแสน'),
('VET_KPS', 'คณะสัตวแพทยศาสตร์ กำแพงแสน', 'Faculty of Veterinary Medicine at Kamphaeng Saen', 'กำแพงแสน'),
('HTI_KPS', 'คณะอุตสาหกรรมบริการ', 'Faculty of Hospitality Industry', 'กำแพงแสน')
ON CONFLICT (faculty_code) DO NOTHING;

-- 4.3 ข้อมูลตั้งต้นภาควิชา/ศูนย์ คณะวิศวกรรมศาสตร์ กำแพงแสน
INSERT INTO core.departments (faculty_id, department_code, department_name_th, department_name_en, department_type)
SELECT f.id, v.dept_code, v.dept_name_th, v.dept_name_en, v.dept_type
FROM core.faculties f
CROSS JOIN (VALUES
    ('AE', 'ภาควิชาวิศวกรรมเกษตร', 'Department of Agricultural Engineering', 'ภาควิชา'),
    ('IE', 'ภาควิชาวิศวกรรมชลประทาน', 'Department of Irrigation Engineering', 'ภาควิชา'),
    ('FE', 'ภาควิชาวิศวกรรมการอาหาร', 'Department of Food Engineering', 'ภาควิชา'),
    ('CE', 'ภาควิชาวิศวกรรมโยธา', 'Department of Civil Engineering', 'ภาควิชา'),
    ('ME', 'ภาควิชาวิศวกรรมเครื่องกล', 'Department of Mechanical Engineering', 'ภาควิชา'),
    ('CPE', 'ภาควิชาวิศวกรรมคอมพิวเตอร์', 'Department of Computer Engineering', 'ภาควิชา'),
    ('ENE', 'ภาควิชาวิศวกรรมสิ่งแวดล้อมและทรัพยากร', 'Department of Environmental Engineering', 'ภาควิชา'),
    ('IND', 'ภาควิชาวิศวกรรมอุตสาหการ', 'Department of Industrial Engineering', 'ภาควิชา'),
    ('DEAN_OFFICE', 'สำนักงานเลขานุการคณะวิศวกรรมศาสตร์ กำแพงแสน', 'Dean Office', 'สำนักงานเลขานุการ')
) AS v(dept_code, dept_name_th, dept_name_en, dept_type)
WHERE f.faculty_code = 'ENG_KPS'
ON CONFLICT (faculty_id, department_name_th) DO NOTHING;

-- ซิงค์เข้า dim_organization
SELECT analytics.sync_dim_organization();

-- 4.4 ข้อมูลตั้งต้นมิติคุณภาพวารสารและสิ่งตีพิมพ์
INSERT INTO analytics.dim_publication_tier (tier_code, tier_name, database_source, publication_level, is_top_tier) VALUES
('SCOPUS_Q1', 'Scopus Quartile 1', 'Scopus', 'นานาชาติ', TRUE),
('SCOPUS_Q2', 'Scopus Quartile 2', 'Scopus', 'นานาชาติ', TRUE),
('SCOPUS_Q3', 'Scopus Quartile 3', 'Scopus', 'นานาชาติ', FALSE),
('SCOPUS_Q4', 'Scopus Quartile 4', 'Scopus', 'นานาชาติ', FALSE),
('TCI_1', 'TCI กลุ่ม 1', 'TCI', 'ชาติ', FALSE),
('TCI_2', 'TCI กลุ่ม 2', 'TCI', 'ชาติ', FALSE),
('CONFERENCE', 'การประชุมวิชาการระดับชาติ/นานาชาติ', 'Conference Proceedings', 'นานาชาติ', FALSE),
('OTHER', 'สิ่งพิมพ์วิชาการอื่นๆ / เตรียมความพร้อม', 'Other', 'ชาติ', FALSE)
ON CONFLICT (tier_code) DO NOTHING;

-- 4.5 ข้อมูลตั้งต้นมิติประเภททรัพย์สินทางปัญญา
INSERT INTO analytics.dim_ip_type (ip_category, protection_level, statutory_duration_years) VALUES
('สิทธิบัตรการประดิษฐ์', 'ชาติ', 20),
('สิทธิบัตรการออกแบบผลิตภัณฑ์', 'ชาติ', 10),
('อนุสิทธิบัตร', 'ชาติ', 10),
('ลิขสิทธิ์', 'ชาติ', 50),
('สิทธิบัตรนานาชาติ (PCT)', 'นานาชาติ', 20)
ON CONFLICT (ip_category, protection_level) DO NOTHING;

-- 4.6 ข้อมูลตั้งต้นมิติแหล่งทุนวิจัย
INSERT INTO analytics.dim_funding_source (funding_source_name, funding_type, funding_sector) VALUES
('สำนักงานการวิจัยแห่งชาติ (วช.)', 'ทุนภายนอก', 'หน่วยงานภาครัฐ/กองทุนวิจัย'),
('หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)', 'ทุนภายนอก', 'หน่วยงานภาครัฐ/กองทุนวิจัย'),
('หน่วยบริหารและจัดการทุนด้านการพัฒนากำลังคน และทุนด้านการพัฒนาสถาบันอุดมศึกษา การวิจัยและการสร้างนวัตกรรม (บพค.)', 'ทุนภายนอก', 'หน่วยงานภาครัฐ/กองทุนวิจัย'),
('สำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว.)', 'ทุนภายนอก', 'หน่วยงานภาครัฐ/กองทุนวิจัย'),
('ทุนอุดหนุนวิจัย มหาวิทยาลัยเกษตรศาสตร์', 'ทุนภายใน', 'มหาวิทยาลัย/คณะ'),
('ทุนอุดหนุนวิจัย วิทยาเขตกำแพงแสน', 'ทุนภายใน', 'มหาวิทยาลัย/คณะ'),
('ทุนวิจัยคณะวิศวกรรมศาสตร์ กำแพงแสน', 'ทุนภายใน', 'มหาวิทยาลัย/คณะ'),
('ภาคเอกชนและอุตสาหกรรม', 'ทุนภายนอก', 'ภาคเอกชน/อุตสาหกรรม')
ON CONFLICT (funding_source_name) DO NOTHING;


-- ==============================================================================
-- 5. ANALYTICAL VIEWS (วิวสรุปผลสำหรับ BI Dashboards & Executive Reports)
-- ==============================================================================

-- วิวที่ 1: สรุปภาพรวมโครงการวิจัยและงบประมาณแยกตามภาควิชาและปีงบประมาณ (KPI 2.1)
CREATE OR REPLACE VIEW analytics.v_research_summary_by_dept AS
SELECT 
    dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    fund.funding_type AS "ประเภททุน",
    fund.funding_source_name AS "แหล่งทุน",
    COUNT(f.fact_id) AS "จำนวนโครงการ",
    SUM(f.budget_total) AS "งบประมาณรวมทั้งสิ้น",
    SUM(f.budget_internal) AS "งบประมาณทุนภายใน",
    SUM(f.budget_external) AS "งบประมาณทุนภายนอก"
FROM analytics.fact_research_projects f
JOIN analytics.dim_organization org ON f.organization_key = org.organization_key
JOIN analytics.dim_date dt ON f.start_date_key = dt.date_key
LEFT JOIN analytics.dim_funding_source fund ON f.funding_source_key = fund.funding_source_key
GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th, fund.funding_type, fund.funding_source_name;

-- วิวที่ 2: สรุปผลงานตีพิมพ์ Scopus Q1-Q4, TCI และความร่วมมือระดับนานาชาติ (KPI 2.1 & KPI 4.1)
CREATE OR REPLACE VIEW analytics.v_publications_top_tier AS
SELECT 
    dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    COUNT(f.fact_id) AS "จำนวนสิ่งตีพิมพ์ทั้งหมด",
    COUNT(f.fact_id) FILTER (WHERE pt.tier_code = 'SCOPUS_Q1') AS "Scopus_Q1",
    COUNT(f.fact_id) FILTER (WHERE pt.tier_code = 'SCOPUS_Q2') AS "Scopus_Q2",
    COUNT(f.fact_id) FILTER (WHERE pt.tier_code = 'SCOPUS_Q3') AS "Scopus_Q3",
    COUNT(f.fact_id) FILTER (WHERE pt.tier_code = 'SCOPUS_Q4') AS "Scopus_Q4",
    COUNT(f.fact_id) FILTER (WHERE pt.tier_code LIKE 'TCI%') AS "TCI",
    COUNT(f.fact_id) FILTER (WHERE f.has_international_coauthor = TRUE) AS "มีผู้ร่วมวิจัยต่างชาติ",
    ROUND(
        (COUNT(f.fact_id) FILTER (WHERE f.has_international_coauthor = TRUE)::numeric / NULLIF(COUNT(f.fact_id), 0)) * 100, 
        2
    ) AS "สัดส่วนความร่วมมือต่างชาติ_pct",
    SUM(f.funding_amount) AS "งบสนับสนุนค่าตีพิมพ์รวม"
FROM analytics.fact_publications f
JOIN analytics.dim_organization org ON f.organization_key = org.organization_key
JOIN analytics.dim_date dt ON f.publication_date_key = dt.date_key
LEFT JOIN analytics.dim_publication_tier pt ON f.tier_key = pt.tier_key
GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th;

-- วิวที่ 3: สรุปโครงการพัฒนาวิชาการและการจัดสรรเงินรายได้ (15%, 5%, 5%, 5%)
CREATE OR REPLACE VIEW analytics.v_academic_dev_revenue_share AS
SELECT 
    dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    COUNT(f.fact_id) AS "จำนวนโครงการ",
    SUM(f.budget_total) AS "งบประมาณรวม",
    SUM(f.overhead_15_pct) AS "ค่าอำนวยการ_15_pct",
    SUM(f.faculty_share_5_pct) AS "ส่วนแบ่งคณะ_5_pct",
    SUM(f.dept_share_5_pct) AS "ส่วนแบ่งภาควิชา_5_pct",
    SUM(f.ku_share_5_pct) AS "ส่วนแบ่งมหาวิทยาลัย_5_pct",
    SUM(f.internal_members_count) AS "บุคลากรภายในร่วมโครงการ_คนครั้ง",
    SUM(f.external_members_count) AS "ผู้เชี่ยวชาญภายนอก_คนครั้ง"
FROM analytics.fact_academic_dev_projects f
JOIN analytics.dim_organization org ON f.organization_key = org.organization_key
JOIN analytics.dim_date dt ON f.start_date_key = dt.date_key
GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th;

-- วิวที่ 4: สรุปพอร์ตโฟลิโอผลงานนักวิจัยครบวงจร 360 องศา (Researcher 360°)
CREATE OR REPLACE VIEW analytics.v_researcher_360_portfolio AS
SELECT 
    res.researcher_key,
    res.full_name_th AS "อาจารย์_นักวิจัย",
    res.academic_position AS "ตำแหน่งทางวิชาการ",
    res.department_name_th AS "ภาควิชา",
    res.faculty_name_th AS "คณะ",
    COUNT(DISTINCT br_res.fact_id) AS "โครงการวิจัยทั้งหมด",
    COUNT(DISTINCT br_res.fact_id) FILTER (WHERE br_res.role_name = 'หัวหน้าโครงการ') AS "หัวหน้าโครงการวิจัย",
    COUNT(DISTINCT br_res.fact_id) FILTER (WHERE br_res.role_name = 'ผู้ร่วมวิจัย') AS "ผู้ร่วมวิจัย",
    COUNT(DISTINCT br_pub.fact_id) AS "ผลงานตีพิมพ์ทั้งหมด",
    COUNT(DISTINCT br_pub.fact_id) FILTER (WHERE pt.is_top_tier = TRUE) AS "ผลงาน_Scopus_Q1_Q2",
    COUNT(DISTINCT br_ip.fact_id) AS "ทรัพย์สินทางปัญญาทั้งหมด",
    COALESCE(SUM(serv.hours_spent), 0) AS "ชั่วโมงบริการวิชาการรวม"
FROM analytics.dim_researcher res
LEFT JOIN analytics.bridge_research_project_members br_res ON res.researcher_key = br_res.researcher_key
LEFT JOIN analytics.bridge_publication_authors br_pub ON res.researcher_key = br_pub.researcher_key
LEFT JOIN analytics.fact_publications pub ON br_pub.fact_id = pub.fact_id
LEFT JOIN analytics.dim_publication_tier pt ON pub.tier_key = pt.tier_key
LEFT JOIN analytics.bridge_ip_inventors br_ip ON res.researcher_key = br_ip.researcher_key
LEFT JOIN analytics.fact_academic_services serv ON res.researcher_key = serv.provider_researcher_key
GROUP BY res.researcher_key, res.full_name_th, res.academic_position, res.department_name_th, res.faculty_name_th;

-- วิวที่ 5: สรุปผลการประเมินตัวชี้วัดยุทธศาสตร์ (KPI Executive Dashboard)
CREATE OR REPLACE VIEW analytics.v_kpi_performance_dashboard AS
SELECT 
    org.faculty_name_th AS "คณะ_ส่วนงาน",
    kpi.strategy_no AS "ยุทธศาสตร์",
    kpi.plan_no AS "แผนงาน",
    kpi.kpi_code AS "รหัส_KPI",
    kpi.kpi_name AS "ชื่อตัวชี้วัด",
    kpi.measurement_unit AS "หน่วยนับ",
    f.fiscal_year_be AS "ปีงบประมาณ",
    f.evaluation_period AS "รอบการประเมิน",
    f.target_value AS "เป้าหมาย",
    f.actual_value AS "ผลงานจริง",
    f.achievement_rate AS "ความสำเร็จ_pct",
    CASE 
        WHEN f.achievement_rate >= 100 THEN 'บรรลุเป้าหมาย (On Track)'
        WHEN f.achievement_rate >= 80 THEN 'ใกล้บรรลุเป้าหมาย (Watchlist)'
        ELSE 'ยังไม่บรรลุเป้าหมาย (Need Action)'
    END AS "สถานะประเมิน",
    f.responsible_person AS "ผู้รับผิดชอบ"
FROM analytics.fact_kpi_performance f
JOIN analytics.dim_strategic_kpi kpi ON f.kpi_key = kpi.kpi_key
JOIN analytics.dim_organization org ON f.organization_key = org.organization_key;
