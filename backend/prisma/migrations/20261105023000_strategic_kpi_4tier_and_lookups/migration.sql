-- CreateTable: kpi_option_lookups
CREATE TABLE IF NOT EXISTS "kpi_option_lookups" (
    "id" SERIAL NOT NULL,
    "field_key" VARCHAR(50) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_option_lookups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "kpi_option_lookups_field_key_value_key" ON "kpi_option_lookups"("field_key", "value");
CREATE INDEX IF NOT EXISTS "kpi_option_lookups_field_key_idx" ON "kpi_option_lookups"("field_key");

-- CreateTable: strategic_strategies
CREATE TABLE IF NOT EXISTS "strategic_strategies" (
    "id" VARCHAR(64) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "pillar_group" VARCHAR(255),
    "fiscal_year" INTEGER NOT NULL DEFAULT 2569,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategic_strategies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "strategic_strategies_code_key" ON "strategic_strategies"("code");
CREATE INDEX IF NOT EXISTS "strategic_strategies_fiscal_year_idx" ON "strategic_strategies"("fiscal_year");

-- CreateTable: strategic_plans (with unique constraint on [strategy_id, code])
CREATE TABLE IF NOT EXISTS "strategic_plans" (
    "id" VARCHAR(64) NOT NULL,
    "strategy_id" VARCHAR(64) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "is_department_project" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategic_plans_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "strategic_plans_strategy_id_code_key" ON "strategic_plans"("strategy_id", "code");
CREATE INDEX IF NOT EXISTS "strategic_plans_strategy_id_idx" ON "strategic_plans"("strategy_id");

ALTER TABLE "strategic_plans" DROP CONSTRAINT IF EXISTS "strategic_plans_strategy_id_fkey";
ALTER TABLE "strategic_plans" ADD CONSTRAINT "strategic_plans_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "strategic_strategies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: kpi_reporting_rounds
CREATE TABLE IF NOT EXISTS "kpi_reporting_rounds" (
    "id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "due_date" DATE,
    "is_cumulative" BOOLEAN NOT NULL DEFAULT true,
    "fiscal_year" INTEGER NOT NULL DEFAULT 2569,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kpi_reporting_rounds_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "kpi_reporting_rounds_fiscal_year_idx" ON "kpi_reporting_rounds"("fiscal_year");

-- CreateTable: strategic_indicators
CREATE TABLE IF NOT EXISTS "strategic_indicators" (
    "id" VARCHAR(64) NOT NULL,
    "strategy_id" VARCHAR(64) NOT NULL,
    "plan_id" VARCHAR(64) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50) NOT NULL DEFAULT 'research',
    "fiscal_year" VARCHAR(20) NOT NULL DEFAULT '2569',
    "collection_period" VARCHAR(100) NOT NULL DEFAULT 'ปีงบประมาณ',
    "value_type" VARCHAR(100) NOT NULL DEFAULT 'จำนวนนับ',
    "reporting_levels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unit" VARCHAR(100) NOT NULL,
    "target_operator" VARCHAR(20) NOT NULL DEFAULT 'gte',
    "target_value" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "target_label" VARCHAR(100),
    "department_target" VARCHAR(100),
    "formula_method" VARCHAR(50) NOT NULL DEFAULT 'SUM',
    "calc_type" VARCHAR(50) NOT NULL DEFAULT 'manual',
    "dataset_key" VARCHAR(50) NOT NULL DEFAULT 'research',
    "active_round_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reporters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "responsible_unit" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategic_indicators_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "strategic_indicators_strategy_id_idx" ON "strategic_indicators"("strategy_id");
CREATE INDEX IF NOT EXISTS "strategic_indicators_plan_id_idx" ON "strategic_indicators"("plan_id");

ALTER TABLE "strategic_indicators" DROP CONSTRAINT IF EXISTS "strategic_indicators_strategy_id_fkey";
ALTER TABLE "strategic_indicators" ADD CONSTRAINT "strategic_indicators_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "strategic_strategies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "strategic_indicators" DROP CONSTRAINT IF EXISTS "strategic_indicators_plan_id_fkey";
ALTER TABLE "strategic_indicators" ADD CONSTRAINT "strategic_indicators_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "strategic_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: strategic_sub_indicators
CREATE TABLE IF NOT EXISTS "strategic_sub_indicators" (
    "id" VARCHAR(64) NOT NULL,
    "indicator_id" VARCHAR(64) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "unit" VARCHAR(100) NOT NULL,
    "formula_role" VARCHAR(50) NOT NULL DEFAULT 'sum_part',
    "value_source" VARCHAR(50) NOT NULL DEFAULT 'manual',
    "linked_dataset_key" VARCHAR(50),
    "target" VARCHAR(100),
    "reporters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "strategic_sub_indicators_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "strategic_sub_indicators_indicator_id_idx" ON "strategic_sub_indicators"("indicator_id");

ALTER TABLE "strategic_sub_indicators" DROP CONSTRAINT IF EXISTS "strategic_sub_indicators_indicator_id_fkey";
ALTER TABLE "strategic_sub_indicators" ADD CONSTRAINT "strategic_sub_indicators_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "strategic_indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: strategic_indicator_round_results
CREATE TABLE IF NOT EXISTS "strategic_indicator_round_results" (
    "id" VARCHAR(64) NOT NULL,
    "indicator_id" VARCHAR(64) NOT NULL,
    "sub_indicator_id" VARCHAR(64),
    "round_id" VARCHAR(64) NOT NULL,
    "actual_value" DECIMAL(15,2),
    "actual_text" VARCHAR(255),
    "evidence" TEXT,
    "remarks" TEXT,
    "reporter" VARCHAR(255),
    "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "strategic_indicator_round_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "strategic_indicator_round_results_indicator_sub_round_key" ON "strategic_indicator_round_results"("indicator_id", "sub_indicator_id", "round_id");
CREATE INDEX IF NOT EXISTS "strategic_indicator_round_results_indicator_id_idx" ON "strategic_indicator_round_results"("indicator_id");
CREATE INDEX IF NOT EXISTS "strategic_indicator_round_results_round_id_idx" ON "strategic_indicator_round_results"("round_id");

ALTER TABLE "strategic_indicator_round_results" DROP CONSTRAINT IF EXISTS "strategic_indicator_round_results_indicator_id_fkey";
ALTER TABLE "strategic_indicator_round_results" ADD CONSTRAINT "strategic_indicator_round_results_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "strategic_indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "strategic_indicator_round_results" DROP CONSTRAINT IF EXISTS "strategic_indicator_round_results_sub_indicator_id_fkey";
ALTER TABLE "strategic_indicator_round_results" ADD CONSTRAINT "strategic_indicator_round_results_sub_indicator_id_fkey" FOREIGN KEY ("sub_indicator_id") REFERENCES "strategic_sub_indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "strategic_indicator_round_results" DROP CONSTRAINT IF EXISTS "strategic_indicator_round_results_round_id_fkey";
ALTER TABLE "strategic_indicator_round_results" ADD CONSTRAINT "strategic_indicator_round_results_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "kpi_reporting_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed default lookup options for OptionPopoverSelect
INSERT INTO "kpi_option_lookups" ("field_key", "value", "label", "is_custom", "sort_order") VALUES
  ('collection_period', 'ปีงบประมาณ', 'ปีงบประมาณ', false, 1),
  ('collection_period', 'ปีการศึกษา', 'ปีการศึกษา', false, 2),
  ('collection_period', 'ปีปฏิทิน', 'ปีปฏิทิน', false, 3),
  ('collection_period', 'ภาคการศึกษา', 'ภาคการศึกษา', false, 4),
  ('collection_period', 'ไตรมาส', 'ไตรมาส', false, 5),
  ('value_type', 'จำนวนนับ', 'จำนวนนับ', false, 1),
  ('value_type', 'ร้อยละ', 'ร้อยละ', false, 2),
  ('value_type', 'ค่าเฉลี่ย', 'ค่าเฉลี่ย', false, 3),
  ('value_type', 'สัดส่วน A:B', 'สัดส่วน A:B', false, 4),
  ('value_type', 'จำนวนเงิน', 'จำนวนเงิน', false, 5),
  ('value_type', 'คะแนน', 'คะแนน', false, 6),
  ('value_type', 'ข้อความ/ระดับ', 'ข้อความ/ระดับ', false, 7),
  ('reporting_level', 'คณะ', 'คณะ', false, 1),
  ('reporting_level', 'ส่วนงาน', 'ส่วนงาน', false, 2)
ON CONFLICT ("field_key", "value") DO NOTHING;

-- Seed default reporting rounds
INSERT INTO "kpi_reporting_rounds" ("id", "name", "start_date", "end_date", "due_date", "is_cumulative", "fiscal_year", "sort_order") VALUES
  ('round-6m', 'รอบ 6 เดือน', '2025-10-01', '2026-03-31', '2026-04-10', true, 2569, 1),
  ('round-9m', 'รอบ 9 เดือน', '2025-10-01', '2026-07-31', '2026-08-10', true, 2569, 2)
ON CONFLICT ("id") DO NOTHING;
