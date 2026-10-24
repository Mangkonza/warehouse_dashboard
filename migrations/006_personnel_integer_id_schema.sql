-- ==============================================================================
-- Migration: 006_personnel_integer_id_schema.sql
-- Description: Refactor core.persons to use integer primary key (SERIAL/IDENTITY),
--              drop personnel_code, and align foreign keys on all related tables
--              (research, academic dev, academic services, publications, IP).
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

-- 1. Ensure core.departments exists
CREATE TABLE IF NOT EXISTS core.departments (
    id SERIAL PRIMARY KEY,
    department_code VARCHAR(50),
    department_name_th VARCHAR(255) NOT NULL UNIQUE,
    department_type VARCHAR(50) DEFAULT 'ภาควิชา',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create or adjust core.persons with auto-increment integer ID
CREATE TABLE IF NOT EXISTS core.persons (
    id SERIAL PRIMARY KEY,
    title_th VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    clean_name VARCHAR(255),
    academic_position VARCHAR(150),
    department VARCHAR(255),
    department_id INTEGER REFERENCES core.departments(id) ON DELETE SET NULL,
    email VARCHAR(150),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop personnel_code if it was previously present
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'core' AND table_name = 'persons' AND column_name = 'personnel_code'
    ) THEN
        ALTER TABLE core.persons DROP COLUMN personnel_code;
    END IF;
END $$;

-- Create Indexes for fast lookup and normalized search
CREATE INDEX IF NOT EXISTS idx_persons_name ON core.persons(name);
CREATE INDEX IF NOT EXISTS idx_persons_clean_name ON core.persons(clean_name);
CREATE INDEX IF NOT EXISTS idx_persons_department ON core.persons(department);
CREATE INDEX IF NOT EXISTS idx_persons_email ON core.persons(email);

-- 3. Check and update Foreign Keys on child modules to use INTEGER person_id
-- 3.1 Research project members
CREATE TABLE IF NOT EXISTS core.research_project_members (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(100) NOT NULL,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    person_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(50),
    department VARCHAR(255),
    role_name VARCHAR(50) DEFAULT 'ผู้ร่วมวิจัย',
    contribution_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_members_person_id
    ON core.research_project_members(person_id);

-- 3.2 Academic development project members
CREATE TABLE IF NOT EXISTS core.academic_dev_project_members (
    id SERIAL PRIMARY KEY,
    project_name TEXT NOT NULL,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    person_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(50),
    department VARCHAR(255),
    role_name VARCHAR(50) DEFAULT 'ผู้ร่วมโครงการ',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academic_dev_members_person_id
    ON core.academic_dev_project_members(person_id);

-- 3.3 Academic service providers
CREATE TABLE IF NOT EXISTS core.academic_service_providers (
    id SERIAL PRIMARY KEY,
    service_title TEXT NOT NULL,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    person_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(50),
    department VARCHAR(255),
    role_name VARCHAR(50) DEFAULT 'ผู้ให้บริการ',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_providers_person_id
    ON core.academic_service_providers(person_id);

-- 3.4 Academic publication authors
CREATE TABLE IF NOT EXISTS core.publication_authors (
    id SERIAL PRIMARY KEY,
    publication_title TEXT NOT NULL,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    person_name VARCHAR(255) NOT NULL,
    author_scope VARCHAR(50) DEFAULT 'ภายในประเทศ',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publication_authors_person_id
    ON core.publication_authors(person_id);

-- 3.5 Intellectual property inventors
CREATE TABLE IF NOT EXISTS core.ip_inventors (
    id SERIAL PRIMARY KEY,
    ip_title TEXT NOT NULL,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    person_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_inventors_person_id
    ON core.ip_inventors(person_id);

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- ==============================================================================
-- BEGIN;
-- ALTER TABLE core.persons ADD COLUMN IF NOT EXISTS personnel_code VARCHAR(50);
-- DROP INDEX IF EXISTS core.idx_ip_inventors_person_id;
-- DROP INDEX IF EXISTS core.idx_publication_authors_person_id;
-- DROP INDEX IF EXISTS core.idx_service_providers_person_id;
-- DROP INDEX IF EXISTS core.idx_academic_dev_members_person_id;
-- DROP INDEX IF EXISTS core.idx_research_members_person_id;
-- DROP INDEX IF EXISTS core.idx_persons_email;
-- DROP INDEX IF EXISTS core.idx_persons_department;
-- DROP INDEX IF EXISTS core.idx_persons_clean_name;
-- DROP INDEX IF EXISTS core.idx_persons_name;
-- COMMIT;
-- ==============================================================================
