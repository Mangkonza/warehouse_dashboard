-- ==============================================================================
-- Migration: 008_evaluation_schema.sql
-- Description: Create core.evaluations table for SDGs, I am / I see, and Q / TCI
--              evaluation values keyed by category and record ID.
-- Author: Engineering Data Warehouse System
-- ==============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS core;

CREATE TABLE IF NOT EXISTS core.evaluations (
    id VARCHAR(150) PRIMARY KEY, -- '${category}_${record_id}'
    category VARCHAR(50) NOT NULL, -- 'research', 'academic', 'publications', 'service', 'ip'
    record_id VARCHAR(100) NOT NULL,
    sdg_ids INTEGER[] DEFAULT '{}',
    i_type VARCHAR(20) CHECK (i_type IS NULL OR i_type IN ('I_AM', 'I_SEE')),
    journal_index JSONB, -- { "type": "Q"|"TCI", "value": "Q1"|... }
    evaluated_by VARCHAR(150),
    evaluated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_category_record UNIQUE (category, record_id)
);

CREATE INDEX IF NOT EXISTS idx_evaluations_category ON core.evaluations(category);
CREATE INDEX IF NOT EXISTS idx_evaluations_record_id ON core.evaluations(record_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_i_type ON core.evaluations(i_type);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluated_at ON core.evaluations(evaluated_at);

COMMIT;
