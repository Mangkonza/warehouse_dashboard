-- ==============================================================================
-- Migration: 007_intellectual_property_schema.sql
-- Description: Create core.intellectual_properties table and core.ip_inventors
--              junction table with 10-char application/registration numbers,
--              protection date ranges, support amount (NUMERIC 14,2), and
--              inventor sort order referencing core.persons(id).
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

-- 1. Ensure core.intellectual_properties table exists with unified fields
CREATE TABLE IF NOT EXISTS core.intellectual_properties (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'อนุสิทธิบัตร' หรือ 'สิทธิบัตร'
    filing_date DATE,
    application_number VARCHAR(10),
    registration_number VARCHAR(10),
    protection_start DATE,
    protection_end DATE,
    support_amount NUMERIC(14, 2) DEFAULT 0.00,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_ip_type CHECK (type IN ('อนุสิทธิบัตร', 'สิทธิบัตร')),
    CONSTRAINT chk_ip_protection_dates CHECK (
        protection_end IS NULL OR protection_start IS NULL OR protection_end >= protection_start
    ),
    CONSTRAINT chk_ip_support_positive CHECK (support_amount >= 0)
);

-- 2. Create core.ip_inventors junction table
CREATE TABLE IF NOT EXISTS core.ip_inventors (
    id SERIAL PRIMARY KEY,
    ip_id INTEGER NOT NULL REFERENCES core.intellectual_properties(id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES core.persons(id) ON DELETE SET NULL,
    inventor_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(50),
    department VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for performance and searchability
CREATE INDEX IF NOT EXISTS idx_ip_title ON core.intellectual_properties(title);
CREATE INDEX IF NOT EXISTS idx_ip_type ON core.intellectual_properties(type);
CREATE INDEX IF NOT EXISTS idx_ip_application_number ON core.intellectual_properties(application_number);
CREATE INDEX IF NOT EXISTS idx_ip_registration_number ON core.intellectual_properties(registration_number);
CREATE INDEX IF NOT EXISTS idx_ip_filing_date ON core.intellectual_properties(filing_date);
CREATE INDEX IF NOT EXISTS idx_ip_protection_start ON core.intellectual_properties(protection_start);

CREATE INDEX IF NOT EXISTS idx_ip_inventors_ip_id ON core.ip_inventors(ip_id);
CREATE INDEX IF NOT EXISTS idx_ip_inventors_person_id ON core.ip_inventors(person_id);
CREATE INDEX IF NOT EXISTS idx_ip_inventors_sort_order ON core.ip_inventors(ip_id, sort_order);

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- ==============================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS core.ip_inventors CASCADE;
-- DROP TABLE IF EXISTS core.intellectual_properties CASCADE;
-- COMMIT;
-- ==============================================================================
