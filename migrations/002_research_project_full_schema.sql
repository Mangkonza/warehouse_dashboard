-- ==============================================================================
-- Migration: 002_research_project_full_schema.sql
-- Description: Expand core.research_projects with detailed TRL levels,
--              collaboration arrays, integration courses, and TRL output deliverables.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

-- 1. Ensure core schema exists
CREATE SCHEMA IF NOT EXISTS core;

-- 2. Add extended columns to core.research_projects if they do not exist
ALTER TABLE core.research_projects
    ADD COLUMN IF NOT EXISTS trl_start INTEGER CHECK (trl_start BETWEEN 1 AND 9),
    ADD COLUMN IF NOT EXISTS trl_end INTEGER CHECK (trl_end BETWEEN 1 AND 9),
    ADD COLUMN IF NOT EXISTS collaboration_types TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS project_natures TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS academic_service TEXT,
    ADD COLUMN IF NOT EXISTS cross_disciplinary TEXT;

-- 3. Table for Teaching Integration Courses (รายวิชาที่นำความรู้ไปสอน)
CREATE TABLE IF NOT EXISTS core.research_project_teaching_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES core.research_projects(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_name TEXT NOT NULL,
    department VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_research_teaching_course UNIQUE (project_id, course_code)
);

CREATE INDEX IF NOT EXISTS idx_research_teaching_courses_proj
    ON core.research_project_teaching_courses(project_id);
CREATE INDEX IF NOT EXISTS idx_research_teaching_courses_code
    ON core.research_project_teaching_courses(course_code);

-- 4. Table for Applied Integration Courses (รายวิชาที่นำผลงานวิจัยไปใช้)
CREATE TABLE IF NOT EXISTS core.research_project_applied_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES core.research_projects(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_name TEXT NOT NULL,
    department VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_research_applied_course UNIQUE (project_id, course_code)
);

CREATE INDEX IF NOT EXISTS idx_research_applied_courses_proj
    ON core.research_project_applied_courses(project_id);
CREATE INDEX IF NOT EXISTS idx_research_applied_courses_code
    ON core.research_project_applied_courses(course_code);

-- 5. Table for TRL Project Deliverables / Outputs (ผลงานและผลผลิตราย Output)
CREATE TABLE IF NOT EXISTS core.research_project_trl_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES core.research_projects(id) ON DELETE CASCADE,
    output_name TEXT NOT NULL,
    trl_level INTEGER CHECK (trl_level BETWEEN 1 AND 9),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_trl_outputs_proj
    ON core.research_project_trl_outputs(project_id);
CREATE INDEX IF NOT EXISTS idx_research_trl_outputs_level
    ON core.research_project_trl_outputs(trl_level);

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- To revert this migration, execute the following statements:
--
-- BEGIN;
-- DROP TABLE IF EXISTS core.research_project_trl_outputs;
-- DROP TABLE IF EXISTS core.research_project_applied_courses;
-- DROP TABLE IF EXISTS core.research_project_teaching_courses;
-- ALTER TABLE core.research_projects
--     DROP COLUMN IF EXISTS cross_disciplinary,
--     DROP COLUMN IF EXISTS academic_service,
--     DROP COLUMN IF EXISTS project_natures,
--     DROP COLUMN IF EXISTS collaboration_types,
--     DROP COLUMN IF EXISTS trl_end,
--     DROP COLUMN IF EXISTS trl_start;
-- COMMIT;
-- ==============================================================================
