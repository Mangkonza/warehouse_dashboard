-- Ensure required database roles exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ku_app') THEN
        CREATE ROLE ku_app WITH LOGIN PASSWORD 'ku_app_secret_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ku_admin') THEN
        CREATE ROLE ku_admin WITH LOGIN PASSWORD 'ku_admin_secret_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ku_owner') THEN
        CREATE ROLE ku_owner WITH LOGIN SUPERUSER PASSWORD 'ku_owner_secret_2026';
    END IF;
END
$$;

--
-- PostgreSQL database dump
--

-- \restrict dnheXEGuMQIfIi79ERO4QCEpsZvGWUOfZrHVJfdaYXIkPk23ywysBtBfIhzwSOE

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.strategic_sub_indicators DROP CONSTRAINT IF EXISTS strategic_sub_indicators_indicator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_plans DROP CONSTRAINT IF EXISTS strategic_plans_strategy_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicators DROP CONSTRAINT IF EXISTS strategic_indicators_strategy_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicators DROP CONSTRAINT IF EXISTS strategic_indicators_plan_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicator_round_results DROP CONSTRAINT IF EXISTS strategic_indicator_round_results_sub_indicator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicator_round_results DROP CONSTRAINT IF EXISTS strategic_indicator_round_results_round_id_fkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicator_round_results DROP CONSTRAINT IF EXISTS strategic_indicator_round_results_indicator_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_head_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_head_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_project_departments DROP CONSTRAINT IF EXISTS research_project_departments_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.research_project_departments DROP CONSTRAINT IF EXISTS research_project_departments_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.publications DROP CONSTRAINT IF EXISTS publications_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_publication_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.personnel DROP CONSTRAINT IF EXISTS personnel_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_ip_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ip_departments DROP CONSTRAINT IF EXISTS ip_departments_ip_id_fkey;
ALTER TABLE IF EXISTS ONLY public.ip_departments DROP CONSTRAINT IF EXISTS ip_departments_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.intellectual_properties DROP CONSTRAINT IF EXISTS intellectual_properties_creator_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.course_catalog DROP CONSTRAINT IF EXISTS course_catalog_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_services DROP CONSTRAINT IF EXISTS academic_services_provider_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_services DROP CONSTRAINT IF EXISTS academic_services_department_code_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_dev_projects DROP CONSTRAINT IF EXISTS academic_dev_projects_head_personnel_id_fkey;
ALTER TABLE IF EXISTS ONLY public.academic_dev_projects DROP CONSTRAINT IF EXISTS academic_dev_projects_department_code_fkey;
ALTER TABLE IF EXISTS ONLY core.strategic_kpis DROP CONSTRAINT IF EXISTS strategic_kpis_faculty_id_fkey;
ALTER TABLE IF EXISTS ONLY core.research_projects DROP CONSTRAINT IF EXISTS research_projects_managing_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_project_id_fkey;
ALTER TABLE IF EXISTS ONLY core.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_person_id_fkey;
ALTER TABLE IF EXISTS ONLY core.publications DROP CONSTRAINT IF EXISTS publications_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_publication_id_fkey;
ALTER TABLE IF EXISTS ONLY core.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_person_id_fkey;
ALTER TABLE IF EXISTS ONLY core.persons DROP CONSTRAINT IF EXISTS persons_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.kpi_targets DROP CONSTRAINT IF EXISTS kpi_targets_kpi_id_fkey;
ALTER TABLE IF EXISTS ONLY core.kpi_actuals DROP CONSTRAINT IF EXISTS kpi_actuals_kpi_id_fkey;
ALTER TABLE IF EXISTS ONLY core.kpi_actuals DROP CONSTRAINT IF EXISTS kpi_actuals_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_person_id_fkey;
ALTER TABLE IF EXISTS ONLY core.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_ip_id_fkey;
ALTER TABLE IF EXISTS ONLY core.intellectual_properties DROP CONSTRAINT IF EXISTS intellectual_properties_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.departments DROP CONSTRAINT IF EXISTS departments_faculty_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_services DROP CONSTRAINT IF EXISTS academic_services_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_service_providers DROP CONSTRAINT IF EXISTS academic_service_providers_service_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_service_providers DROP CONSTRAINT IF EXISTS academic_service_providers_person_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_dev_projects DROP CONSTRAINT IF EXISTS academic_dev_projects_managing_department_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_dev_project_members DROP CONSTRAINT IF EXISTS academic_dev_project_members_project_id_fkey;
ALTER TABLE IF EXISTS ONLY core.academic_dev_project_members DROP CONSTRAINT IF EXISTS academic_dev_project_members_person_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_start_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_leader_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_funding_source_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_end_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_core_project_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_tier_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_publication_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_first_author_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_core_pub_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_kpi_performance DROP CONSTRAINT IF EXISTS fact_kpi_performance_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_kpi_performance DROP CONSTRAINT IF EXISTS fact_kpi_performance_kpi_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_kpi_performance DROP CONSTRAINT IF EXISTS fact_kpi_performance_core_actual_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_kpi_performance DROP CONSTRAINT IF EXISTS fact_kpi_performance_as_of_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_lead_inventor_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_ip_type_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_grant_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_filing_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_expiration_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_core_ip_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_services DROP CONSTRAINT IF EXISTS fact_academic_services_service_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_services DROP CONSTRAINT IF EXISTS fact_academic_services_provider_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_services DROP CONSTRAINT IF EXISTS fact_academic_services_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_services DROP CONSTRAINT IF EXISTS fact_academic_services_core_service_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_start_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_organization_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_leader_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_end_date_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_core_project_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_strategic_kpi DROP CONSTRAINT IF EXISTS dim_strategic_kpi_kpi_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_researcher DROP CONSTRAINT IF EXISTS dim_researcher_person_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_organization DROP CONSTRAINT IF EXISTS dim_organization_faculty_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_organization DROP CONSTRAINT IF EXISTS dim_organization_department_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_research_project_members DROP CONSTRAINT IF EXISTS bridge_research_project_members_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_research_project_members DROP CONSTRAINT IF EXISTS bridge_research_project_members_fact_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_publication_authors DROP CONSTRAINT IF EXISTS bridge_publication_authors_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_publication_authors DROP CONSTRAINT IF EXISTS bridge_publication_authors_fact_id_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_ip_inventors DROP CONSTRAINT IF EXISTS bridge_ip_inventors_researcher_key_fkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_ip_inventors DROP CONSTRAINT IF EXISTS bridge_ip_inventors_fact_id_fkey;
DROP TRIGGER IF EXISTS trg_role_audit_logs_append_only ON public.role_audit_logs;
DROP INDEX IF EXISTS public.uq_ip_type_reg_num;
DROP INDEX IF EXISTS public.strategic_sub_indicators_indicator_id_idx;
DROP INDEX IF EXISTS public.strategic_strategies_fiscal_year_idx;
DROP INDEX IF EXISTS public.strategic_strategies_code_key;
DROP INDEX IF EXISTS public.strategic_plans_strategy_id_idx;
DROP INDEX IF EXISTS public.strategic_plans_strategy_id_code_key;
DROP INDEX IF EXISTS public.strategic_indicators_strategy_id_idx;
DROP INDEX IF EXISTS public.strategic_indicators_plan_id_idx;
DROP INDEX IF EXISTS public.strategic_indicator_round_results_round_id_idx;
DROP INDEX IF EXISTS public.strategic_indicator_round_results_indicator_sub_round_key;
DROP INDEX IF EXISTS public.strategic_indicator_round_results_indicator_id_idx;
DROP INDEX IF EXISTS public.role_audit_logs_target_username_idx;
DROP INDEX IF EXISTS public.role_audit_logs_actor_username_idx;
DROP INDEX IF EXISTS public.research_projects_status_idx;
DROP INDEX IF EXISTS public.research_projects_legacy_id_key;
DROP INDEX IF EXISTS public.research_projects_head_department_code_idx;
DROP INDEX IF EXISTS public.research_projects_fiscal_year_idx;
DROP INDEX IF EXISTS public.research_project_members_project_id_idx;
DROP INDEX IF EXISTS public.research_project_members_personnel_id_idx;
DROP INDEX IF EXISTS public.research_project_departments_project_id_idx;
DROP INDEX IF EXISTS public.research_project_departments_department_code_idx;
DROP INDEX IF EXISTS public.publications_type_idx;
DROP INDEX IF EXISTS public.publications_legacy_id_key;
DROP INDEX IF EXISTS public.publications_fiscal_year_be_idx;
DROP INDEX IF EXISTS public.publications_department_code_idx;
DROP INDEX IF EXISTS public.publication_authors_publication_id_idx;
DROP INDEX IF EXISTS public.publication_authors_personnel_id_idx;
DROP INDEX IF EXISTS public.personnel_person_id_key;
DROP INDEX IF EXISTS public.personnel_name_th_idx;
DROP INDEX IF EXISTS public.personnel_department_code_idx;
DROP INDEX IF EXISTS public.kpi_reporting_rounds_fiscal_year_idx;
DROP INDEX IF EXISTS public.kpi_option_lookups_field_key_value_key;
DROP INDEX IF EXISTS public.kpi_option_lookups_field_key_idx;
DROP INDEX IF EXISTS public.ip_inventors_personnel_id_idx;
DROP INDEX IF EXISTS public.ip_inventors_ip_id_idx;
DROP INDEX IF EXISTS public.ip_departments_ip_id_idx;
DROP INDEX IF EXISTS public.ip_departments_department_code_idx;
DROP INDEX IF EXISTS public.intellectual_properties_type_idx;
DROP INDEX IF EXISTS public.intellectual_properties_legacy_id_key;
DROP INDEX IF EXISTS public.intellectual_properties_fiscal_year_idx;
DROP INDEX IF EXISTS public.intellectual_properties_department_code_idx;
DROP INDEX IF EXISTS public.evaluations_category_record_id_key;
DROP INDEX IF EXISTS public.evaluations_category_idx;
DROP INDEX IF EXISTS public.academic_services_service_category_idx;
DROP INDEX IF EXISTS public.academic_services_legacy_id_key;
DROP INDEX IF EXISTS public.academic_services_fiscal_year_idx;
DROP INDEX IF EXISTS public.academic_services_department_code_idx;
DROP INDEX IF EXISTS public.academic_dev_projects_legacy_id_key;
DROP INDEX IF EXISTS public.academic_dev_projects_fiscal_year_idx;
DROP INDEX IF EXISTS public.academic_dev_projects_department_code_idx;
DROP INDEX IF EXISTS core.idx_strategic_kpis_fac;
DROP INDEX IF EXISTS core.idx_service_providers_service;
DROP INDEX IF EXISTS core.idx_service_providers_person;
DROP INDEX IF EXISTS core.idx_research_projects_fy;
DROP INDEX IF EXISTS core.idx_research_projects_dept;
DROP INDEX IF EXISTS core.idx_research_projects_code;
DROP INDEX IF EXISTS core.idx_research_members_project;
DROP INDEX IF EXISTS core.idx_research_members_person;
DROP INDEX IF EXISTS core.idx_publications_quartile;
DROP INDEX IF EXISTS core.idx_publications_fy;
DROP INDEX IF EXISTS core.idx_publications_dept;
DROP INDEX IF EXISTS core.idx_publication_authors_pub;
DROP INDEX IF EXISTS core.idx_publication_authors_pers;
DROP INDEX IF EXISTS core.idx_persons_normalized_name;
DROP INDEX IF EXISTS core.idx_persons_department;
DROP INDEX IF EXISTS core.idx_kpi_targets_kpi;
DROP INDEX IF EXISTS core.idx_kpi_targets_fy;
DROP INDEX IF EXISTS core.idx_kpi_actuals_kpi;
DROP INDEX IF EXISTS core.idx_kpi_actuals_fy;
DROP INDEX IF EXISTS core.idx_kpi_actuals_dept;
DROP INDEX IF EXISTS core.idx_ip_reg_no;
DROP INDEX IF EXISTS core.idx_ip_inventors_pers;
DROP INDEX IF EXISTS core.idx_ip_inventors_ip;
DROP INDEX IF EXISTS core.idx_ip_dept;
DROP INDEX IF EXISTS core.idx_ip_app_no;
DROP INDEX IF EXISTS core.idx_departments_faculty;
DROP INDEX IF EXISTS core.idx_academic_services_fy;
DROP INDEX IF EXISTS core.idx_academic_services_dept;
DROP INDEX IF EXISTS core.idx_academic_services_date;
DROP INDEX IF EXISTS core.idx_academic_dev_members_proj;
DROP INDEX IF EXISTS core.idx_academic_dev_members_pers;
DROP INDEX IF EXISTS core.idx_academic_dev_fy;
DROP INDEX IF EXISTS core.idx_academic_dev_dept;
DROP INDEX IF EXISTS analytics.idx_f_services_provider;
DROP INDEX IF EXISTS analytics.idx_f_services_org;
DROP INDEX IF EXISTS analytics.idx_f_services_date;
DROP INDEX IF EXISTS analytics.idx_f_research_org;
DROP INDEX IF EXISTS analytics.idx_f_research_leader;
DROP INDEX IF EXISTS analytics.idx_f_research_funding;
DROP INDEX IF EXISTS analytics.idx_f_research_date;
DROP INDEX IF EXISTS analytics.idx_f_pub_tier;
DROP INDEX IF EXISTS analytics.idx_f_pub_org;
DROP INDEX IF EXISTS analytics.idx_f_pub_date;
DROP INDEX IF EXISTS analytics.idx_f_pub_author;
DROP INDEX IF EXISTS analytics.idx_f_kpi_perf_org;
DROP INDEX IF EXISTS analytics.idx_f_kpi_perf_kpi;
DROP INDEX IF EXISTS analytics.idx_f_kpi_perf_fy;
DROP INDEX IF EXISTS analytics.idx_f_ip_org;
DROP INDEX IF EXISTS analytics.idx_f_ip_inventor;
DROP INDEX IF EXISTS analytics.idx_f_ip_grant_date;
DROP INDEX IF EXISTS analytics.idx_f_ip_filing_date;
DROP INDEX IF EXISTS analytics.idx_f_academic_dev_org;
DROP INDEX IF EXISTS analytics.idx_f_academic_dev_leader;
DROP INDEX IF EXISTS analytics.idx_f_academic_dev_date;
DROP INDEX IF EXISTS analytics.idx_dim_researcher_person;
DROP INDEX IF EXISTS analytics.idx_dim_org_fac;
DROP INDEX IF EXISTS analytics.idx_dim_org_dept;
DROP INDEX IF EXISTS analytics.idx_dim_kpi_core_id;
DROP INDEX IF EXISTS analytics.idx_dim_date_fy;
DROP INDEX IF EXISTS analytics.idx_dim_date_fq;
DROP INDEX IF EXISTS analytics.idx_br_res_researcher;
DROP INDEX IF EXISTS analytics.idx_br_pub_researcher;
DROP INDEX IF EXISTS analytics.idx_br_ip_researcher;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.system_health_check DROP CONSTRAINT IF EXISTS system_health_check_pkey;
ALTER TABLE IF EXISTS ONLY public.strategic_sub_indicators DROP CONSTRAINT IF EXISTS strategic_sub_indicators_pkey;
ALTER TABLE IF EXISTS ONLY public.strategic_strategies DROP CONSTRAINT IF EXISTS strategic_strategies_pkey;
ALTER TABLE IF EXISTS ONLY public.strategic_plans DROP CONSTRAINT IF EXISTS strategic_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicators DROP CONSTRAINT IF EXISTS strategic_indicators_pkey;
ALTER TABLE IF EXISTS ONLY public.strategic_indicator_round_results DROP CONSTRAINT IF EXISTS strategic_indicator_round_results_pkey;
ALTER TABLE IF EXISTS ONLY public.role_audit_logs DROP CONSTRAINT IF EXISTS role_audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.research_projects DROP CONSTRAINT IF EXISTS research_projects_pkey;
ALTER TABLE IF EXISTS ONLY public.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_pkey;
ALTER TABLE IF EXISTS ONLY public.research_project_departments DROP CONSTRAINT IF EXISTS research_project_departments_pkey;
ALTER TABLE IF EXISTS ONLY public.publications DROP CONSTRAINT IF EXISTS publications_pkey;
ALTER TABLE IF EXISTS ONLY public.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_pkey;
ALTER TABLE IF EXISTS ONLY public.personnel DROP CONSTRAINT IF EXISTS personnel_pkey;
ALTER TABLE IF EXISTS ONLY public.kpi_reporting_rounds DROP CONSTRAINT IF EXISTS kpi_reporting_rounds_pkey;
ALTER TABLE IF EXISTS ONLY public.kpi_option_lookups DROP CONSTRAINT IF EXISTS kpi_option_lookups_pkey;
ALTER TABLE IF EXISTS ONLY public.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_pkey;
ALTER TABLE IF EXISTS ONLY public.ip_departments DROP CONSTRAINT IF EXISTS ip_departments_pkey;
ALTER TABLE IF EXISTS ONLY public.intellectual_properties DROP CONSTRAINT IF EXISTS intellectual_properties_pkey;
ALTER TABLE IF EXISTS ONLY public.funding_sources DROP CONSTRAINT IF EXISTS funding_sources_pkey;
ALTER TABLE IF EXISTS ONLY public.evaluations DROP CONSTRAINT IF EXISTS evaluations_pkey;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_pkey;
ALTER TABLE IF EXISTS ONLY public.course_catalog DROP CONSTRAINT IF EXISTS course_catalog_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_services DROP CONSTRAINT IF EXISTS academic_services_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_dev_projects DROP CONSTRAINT IF EXISTS academic_dev_projects_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY core.strategic_kpis DROP CONSTRAINT IF EXISTS uq_strategic_kpis_code;
ALTER TABLE IF EXISTS ONLY core.research_project_members DROP CONSTRAINT IF EXISTS uq_research_project_member;
ALTER TABLE IF EXISTS ONLY core.publication_authors DROP CONSTRAINT IF EXISTS uq_publication_author;
ALTER TABLE IF EXISTS ONLY core.kpi_targets DROP CONSTRAINT IF EXISTS uq_kpi_target;
ALTER TABLE IF EXISTS ONLY core.kpi_actuals DROP CONSTRAINT IF EXISTS uq_kpi_actual;
ALTER TABLE IF EXISTS ONLY core.ip_inventors DROP CONSTRAINT IF EXISTS uq_ip_inventor;
ALTER TABLE IF EXISTS ONLY core.departments DROP CONSTRAINT IF EXISTS uq_faculty_dept;
ALTER TABLE IF EXISTS ONLY core.academic_dev_project_members DROP CONSTRAINT IF EXISTS uq_dev_project_member;
ALTER TABLE IF EXISTS ONLY core.academic_service_providers DROP CONSTRAINT IF EXISTS uq_academic_service_provider;
ALTER TABLE IF EXISTS ONLY core.strategic_kpis DROP CONSTRAINT IF EXISTS strategic_kpis_pkey;
ALTER TABLE IF EXISTS ONLY core.research_projects DROP CONSTRAINT IF EXISTS research_projects_pkey;
ALTER TABLE IF EXISTS ONLY core.research_project_members DROP CONSTRAINT IF EXISTS research_project_members_pkey;
ALTER TABLE IF EXISTS ONLY core.publications DROP CONSTRAINT IF EXISTS publications_pkey;
ALTER TABLE IF EXISTS ONLY core.publication_authors DROP CONSTRAINT IF EXISTS publication_authors_pkey;
ALTER TABLE IF EXISTS ONLY core.persons DROP CONSTRAINT IF EXISTS persons_pkey;
ALTER TABLE IF EXISTS ONLY core.kpi_targets DROP CONSTRAINT IF EXISTS kpi_targets_pkey;
ALTER TABLE IF EXISTS ONLY core.kpi_actuals DROP CONSTRAINT IF EXISTS kpi_actuals_pkey;
ALTER TABLE IF EXISTS ONLY core.ip_inventors DROP CONSTRAINT IF EXISTS ip_inventors_pkey;
ALTER TABLE IF EXISTS ONLY core.intellectual_properties DROP CONSTRAINT IF EXISTS intellectual_properties_pkey;
ALTER TABLE IF EXISTS ONLY core.faculties DROP CONSTRAINT IF EXISTS faculties_pkey;
ALTER TABLE IF EXISTS ONLY core.faculties DROP CONSTRAINT IF EXISTS faculties_faculty_code_key;
ALTER TABLE IF EXISTS ONLY core.departments DROP CONSTRAINT IF EXISTS departments_pkey;
ALTER TABLE IF EXISTS ONLY core.academic_services DROP CONSTRAINT IF EXISTS academic_services_pkey;
ALTER TABLE IF EXISTS ONLY core.academic_service_providers DROP CONSTRAINT IF EXISTS academic_service_providers_pkey;
ALTER TABLE IF EXISTS ONLY core.academic_dev_projects DROP CONSTRAINT IF EXISTS academic_dev_projects_pkey;
ALTER TABLE IF EXISTS ONLY core.academic_dev_project_members DROP CONSTRAINT IF EXISTS academic_dev_project_members_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_strategic_kpi DROP CONSTRAINT IF EXISTS uq_dim_strategic_kpi;
ALTER TABLE IF EXISTS ONLY analytics.dim_researcher DROP CONSTRAINT IF EXISTS uq_dim_researcher;
ALTER TABLE IF EXISTS ONLY analytics.dim_organization DROP CONSTRAINT IF EXISTS uq_dim_org;
ALTER TABLE IF EXISTS ONLY analytics.dim_ip_type DROP CONSTRAINT IF EXISTS uq_dim_ip_type;
ALTER TABLE IF EXISTS ONLY analytics.fact_research_projects DROP CONSTRAINT IF EXISTS fact_research_projects_pkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_publications DROP CONSTRAINT IF EXISTS fact_publications_pkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_kpi_performance DROP CONSTRAINT IF EXISTS fact_kpi_performance_pkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_intellectual_properties DROP CONSTRAINT IF EXISTS fact_intellectual_properties_pkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_services DROP CONSTRAINT IF EXISTS fact_academic_services_pkey;
ALTER TABLE IF EXISTS ONLY analytics.fact_academic_dev_projects DROP CONSTRAINT IF EXISTS fact_academic_dev_projects_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_strategic_kpi DROP CONSTRAINT IF EXISTS dim_strategic_kpi_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_researcher DROP CONSTRAINT IF EXISTS dim_researcher_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_publication_tier DROP CONSTRAINT IF EXISTS dim_publication_tier_tier_code_key;
ALTER TABLE IF EXISTS ONLY analytics.dim_publication_tier DROP CONSTRAINT IF EXISTS dim_publication_tier_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_organization DROP CONSTRAINT IF EXISTS dim_organization_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_ip_type DROP CONSTRAINT IF EXISTS dim_ip_type_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_funding_source DROP CONSTRAINT IF EXISTS dim_funding_source_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_funding_source DROP CONSTRAINT IF EXISTS dim_funding_source_funding_source_name_key;
ALTER TABLE IF EXISTS ONLY analytics.dim_date DROP CONSTRAINT IF EXISTS dim_date_pkey;
ALTER TABLE IF EXISTS ONLY analytics.dim_date DROP CONSTRAINT IF EXISTS dim_date_full_date_key;
ALTER TABLE IF EXISTS ONLY analytics.bridge_research_project_members DROP CONSTRAINT IF EXISTS bridge_research_project_members_pkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_publication_authors DROP CONSTRAINT IF EXISTS bridge_publication_authors_pkey;
ALTER TABLE IF EXISTS ONLY analytics.bridge_ip_inventors DROP CONSTRAINT IF EXISTS bridge_ip_inventors_pkey;
ALTER TABLE IF EXISTS public.system_health_check ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.role_audit_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.research_projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.research_project_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.research_project_departments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.publications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.publication_authors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.personnel ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.kpi_option_lookups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ip_inventors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ip_departments ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.intellectual_properties ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.funding_sources ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.evaluations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.academic_services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.academic_dev_projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_research_projects ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_publications ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_kpi_performance ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_intellectual_properties ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_academic_services ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.fact_academic_dev_projects ALTER COLUMN fact_id DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_strategic_kpi ALTER COLUMN kpi_key DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_researcher ALTER COLUMN researcher_key DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_publication_tier ALTER COLUMN tier_key DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_organization ALTER COLUMN organization_key DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_ip_type ALTER COLUMN ip_type_key DROP DEFAULT;
ALTER TABLE IF EXISTS analytics.dim_funding_source ALTER COLUMN funding_source_key DROP DEFAULT;
DROP TABLE IF EXISTS public.user_roles;
DROP SEQUENCE IF EXISTS public.system_health_check_id_seq;
DROP TABLE IF EXISTS public.system_health_check;
DROP TABLE IF EXISTS public.strategic_sub_indicators;
DROP TABLE IF EXISTS public.strategic_strategies;
DROP TABLE IF EXISTS public.strategic_plans;
DROP TABLE IF EXISTS public.strategic_indicators;
DROP TABLE IF EXISTS public.strategic_indicator_round_results;
DROP SEQUENCE IF EXISTS public.role_audit_logs_id_seq;
DROP TABLE IF EXISTS public.role_audit_logs;
DROP SEQUENCE IF EXISTS public.research_projects_id_seq;
DROP TABLE IF EXISTS public.research_projects;
DROP SEQUENCE IF EXISTS public.research_project_members_id_seq;
DROP TABLE IF EXISTS public.research_project_members;
DROP SEQUENCE IF EXISTS public.research_project_departments_id_seq;
DROP TABLE IF EXISTS public.research_project_departments;
DROP SEQUENCE IF EXISTS public.publications_id_seq;
DROP TABLE IF EXISTS public.publications;
DROP SEQUENCE IF EXISTS public.publication_authors_id_seq;
DROP TABLE IF EXISTS public.publication_authors;
DROP SEQUENCE IF EXISTS public.personnel_id_seq;
DROP TABLE IF EXISTS public.personnel;
DROP TABLE IF EXISTS public.kpi_reporting_rounds;
DROP SEQUENCE IF EXISTS public.kpi_option_lookups_id_seq;
DROP TABLE IF EXISTS public.kpi_option_lookups;
DROP SEQUENCE IF EXISTS public.ip_inventors_id_seq;
DROP TABLE IF EXISTS public.ip_inventors;
DROP SEQUENCE IF EXISTS public.ip_departments_id_seq;
DROP TABLE IF EXISTS public.ip_departments;
DROP SEQUENCE IF EXISTS public.intellectual_properties_id_seq;
DROP TABLE IF EXISTS public.intellectual_properties;
DROP SEQUENCE IF EXISTS public.funding_sources_id_seq;
DROP TABLE IF EXISTS public.funding_sources;
DROP SEQUENCE IF EXISTS public.evaluations_id_seq;
DROP TABLE IF EXISTS public.evaluations;
DROP TABLE IF EXISTS public.departments;
DROP TABLE IF EXISTS public.course_catalog;
DROP SEQUENCE IF EXISTS public.academic_services_id_seq;
DROP TABLE IF EXISTS public.academic_services;
DROP SEQUENCE IF EXISTS public.academic_dev_projects_id_seq;
DROP TABLE IF EXISTS public.academic_dev_projects;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS core.strategic_kpis;
DROP TABLE IF EXISTS core.research_projects;
DROP TABLE IF EXISTS core.research_project_members;
DROP TABLE IF EXISTS core.publications;
DROP TABLE IF EXISTS core.publication_authors;
DROP TABLE IF EXISTS core.persons;
DROP TABLE IF EXISTS core.kpi_targets;
DROP TABLE IF EXISTS core.kpi_actuals;
DROP TABLE IF EXISTS core.ip_inventors;
DROP TABLE IF EXISTS core.intellectual_properties;
DROP TABLE IF EXISTS core.faculties;
DROP TABLE IF EXISTS core.departments;
DROP TABLE IF EXISTS core.academic_services;
DROP TABLE IF EXISTS core.academic_service_providers;
DROP TABLE IF EXISTS core.academic_dev_projects;
DROP TABLE IF EXISTS core.academic_dev_project_members;
DROP VIEW IF EXISTS analytics.v_researcher_360_portfolio;
DROP VIEW IF EXISTS analytics.v_research_summary_by_dept;
DROP VIEW IF EXISTS analytics.v_publications_top_tier;
DROP VIEW IF EXISTS analytics.v_kpi_performance_dashboard;
DROP VIEW IF EXISTS analytics.v_academic_dev_revenue_share;
DROP SEQUENCE IF EXISTS analytics.fact_research_projects_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_research_projects;
DROP SEQUENCE IF EXISTS analytics.fact_publications_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_publications;
DROP SEQUENCE IF EXISTS analytics.fact_kpi_performance_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_kpi_performance;
DROP SEQUENCE IF EXISTS analytics.fact_intellectual_properties_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_intellectual_properties;
DROP SEQUENCE IF EXISTS analytics.fact_academic_services_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_academic_services;
DROP SEQUENCE IF EXISTS analytics.fact_academic_dev_projects_fact_id_seq;
DROP TABLE IF EXISTS analytics.fact_academic_dev_projects;
DROP SEQUENCE IF EXISTS analytics.dim_strategic_kpi_kpi_key_seq;
DROP TABLE IF EXISTS analytics.dim_strategic_kpi;
DROP SEQUENCE IF EXISTS analytics.dim_researcher_researcher_key_seq;
DROP TABLE IF EXISTS analytics.dim_researcher;
DROP SEQUENCE IF EXISTS analytics.dim_publication_tier_tier_key_seq;
DROP TABLE IF EXISTS analytics.dim_publication_tier;
DROP SEQUENCE IF EXISTS analytics.dim_organization_organization_key_seq;
DROP TABLE IF EXISTS analytics.dim_organization;
DROP SEQUENCE IF EXISTS analytics.dim_ip_type_ip_type_key_seq;
DROP TABLE IF EXISTS analytics.dim_ip_type;
DROP SEQUENCE IF EXISTS analytics.dim_funding_source_funding_source_key_seq;
DROP TABLE IF EXISTS analytics.dim_funding_source;
DROP TABLE IF EXISTS analytics.dim_date;
DROP TABLE IF EXISTS analytics.bridge_research_project_members;
DROP TABLE IF EXISTS analytics.bridge_publication_authors;
DROP TABLE IF EXISTS analytics.bridge_ip_inventors;
DROP FUNCTION IF EXISTS public.prevent_role_audit_logs_mutation();
DROP FUNCTION IF EXISTS analytics.sync_dim_organization();
DROP FUNCTION IF EXISTS analytics.populate_dim_date(p_start_date date, p_end_date date);
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS core;
DROP SCHEMA IF EXISTS analytics;
--
-- Name: analytics; Type: SCHEMA; Schema: -; Owner: ku_admin
--

CREATE SCHEMA analytics;


ALTER SCHEMA analytics OWNER TO ku_admin;

--
-- Name: core; Type: SCHEMA; Schema: -; Owner: ku_admin
--

CREATE SCHEMA core;


ALTER SCHEMA core OWNER TO ku_admin;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: populate_dim_date(date, date); Type: FUNCTION; Schema: analytics; Owner: ku_admin
--

CREATE FUNCTION analytics.populate_dim_date(p_start_date date, p_end_date date) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION analytics.populate_dim_date(p_start_date date, p_end_date date) OWNER TO ku_admin;

--
-- Name: sync_dim_organization(); Type: FUNCTION; Schema: analytics; Owner: ku_admin
--

CREATE FUNCTION analytics.sync_dim_organization() RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION analytics.sync_dim_organization() OWNER TO ku_admin;

--
-- Name: prevent_role_audit_logs_mutation(); Type: FUNCTION; Schema: public; Owner: ku_owner
--

CREATE FUNCTION public.prevent_role_audit_logs_mutation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    RAISE EXCEPTION 'role_audit_logs is append-only: UPDATE and DELETE operations are strictly prohibited.';
END;
$$;


ALTER FUNCTION public.prevent_role_audit_logs_mutation() OWNER TO ku_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bridge_ip_inventors; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.bridge_ip_inventors (
    fact_id integer NOT NULL,
    researcher_key integer NOT NULL,
    inventor_role character varying(50) DEFAULT 'ผู้ประดิษฐ์'::character varying,
    contribution_percent numeric(5,2)
);


ALTER TABLE analytics.bridge_ip_inventors OWNER TO ku_admin;

--
-- Name: bridge_publication_authors; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.bridge_publication_authors (
    fact_id integer NOT NULL,
    researcher_key integer NOT NULL,
    author_role character varying(50) NOT NULL,
    author_scope character varying(50),
    contribution_percent numeric(5,2)
);


ALTER TABLE analytics.bridge_publication_authors OWNER TO ku_admin;

--
-- Name: bridge_research_project_members; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.bridge_research_project_members (
    fact_id integer NOT NULL,
    researcher_key integer NOT NULL,
    role_name character varying(50) NOT NULL,
    contribution_percent numeric(5,2)
);


ALTER TABLE analytics.bridge_research_project_members OWNER TO ku_admin;

--
-- Name: dim_date; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_date (
    date_key integer NOT NULL,
    full_date date NOT NULL,
    day_of_month integer NOT NULL,
    month_no integer NOT NULL,
    month_name_th character varying(50) NOT NULL,
    quarter integer NOT NULL,
    year_ad integer NOT NULL,
    year_be integer NOT NULL,
    fiscal_year_be integer NOT NULL,
    fiscal_year_ad integer NOT NULL,
    fiscal_quarter character varying(10) NOT NULL,
    academic_year_be integer NOT NULL,
    is_weekend boolean DEFAULT false
);


ALTER TABLE analytics.dim_date OWNER TO ku_admin;

--
-- Name: dim_funding_source; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_funding_source (
    funding_source_key integer NOT NULL,
    funding_source_name character varying(255) NOT NULL,
    funding_type character varying(50) NOT NULL,
    funding_sector character varying(100) NOT NULL
);


ALTER TABLE analytics.dim_funding_source OWNER TO ku_admin;

--
-- Name: dim_funding_source_funding_source_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_funding_source_funding_source_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_funding_source_funding_source_key_seq OWNER TO ku_admin;

--
-- Name: dim_funding_source_funding_source_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_funding_source_funding_source_key_seq OWNED BY analytics.dim_funding_source.funding_source_key;


--
-- Name: dim_ip_type; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_ip_type (
    ip_type_key integer NOT NULL,
    ip_category character varying(100) NOT NULL,
    protection_level character varying(50) DEFAULT 'ชาติ'::character varying,
    statutory_duration_years integer
);


ALTER TABLE analytics.dim_ip_type OWNER TO ku_admin;

--
-- Name: dim_ip_type_ip_type_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_ip_type_ip_type_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_ip_type_ip_type_key_seq OWNER TO ku_admin;

--
-- Name: dim_ip_type_ip_type_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_ip_type_ip_type_key_seq OWNED BY analytics.dim_ip_type.ip_type_key;


--
-- Name: dim_organization; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_organization (
    organization_key integer NOT NULL,
    faculty_id uuid,
    department_id uuid,
    campus_name character varying(100) DEFAULT 'วิทยาเขตกำแพงแสน'::character varying NOT NULL,
    faculty_code character varying(50) NOT NULL,
    faculty_name_th character varying(255) NOT NULL,
    department_code character varying(50),
    department_name_th character varying(255) NOT NULL,
    department_type character varying(50) NOT NULL
);


ALTER TABLE analytics.dim_organization OWNER TO ku_admin;

--
-- Name: dim_organization_organization_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_organization_organization_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_organization_organization_key_seq OWNER TO ku_admin;

--
-- Name: dim_organization_organization_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_organization_organization_key_seq OWNED BY analytics.dim_organization.organization_key;


--
-- Name: dim_publication_tier; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_publication_tier (
    tier_key integer NOT NULL,
    tier_code character varying(50) NOT NULL,
    tier_name character varying(100) NOT NULL,
    database_source character varying(100) NOT NULL,
    publication_level character varying(50) NOT NULL,
    is_top_tier boolean DEFAULT false
);


ALTER TABLE analytics.dim_publication_tier OWNER TO ku_admin;

--
-- Name: dim_publication_tier_tier_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_publication_tier_tier_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_publication_tier_tier_key_seq OWNER TO ku_admin;

--
-- Name: dim_publication_tier_tier_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_publication_tier_tier_key_seq OWNED BY analytics.dim_publication_tier.tier_key;


--
-- Name: dim_researcher; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_researcher (
    researcher_key integer NOT NULL,
    person_id uuid NOT NULL,
    full_name_th character varying(300) NOT NULL,
    title_th character varying(50),
    first_name_th character varying(150) NOT NULL,
    last_name_th character varying(150) NOT NULL,
    academic_position character varying(100),
    department_name_th character varying(255),
    faculty_name_th character varying(255),
    personnel_type character varying(50) DEFAULT 'บุคลากรภายใน'::character varying,
    email character varying(150)
);


ALTER TABLE analytics.dim_researcher OWNER TO ku_admin;

--
-- Name: dim_researcher_researcher_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_researcher_researcher_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_researcher_researcher_key_seq OWNER TO ku_admin;

--
-- Name: dim_researcher_researcher_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_researcher_researcher_key_seq OWNED BY analytics.dim_researcher.researcher_key;


--
-- Name: dim_strategic_kpi; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.dim_strategic_kpi (
    kpi_key integer NOT NULL,
    kpi_id uuid NOT NULL,
    strategy_no character varying(50) NOT NULL,
    strategy_name text NOT NULL,
    plan_no character varying(50),
    plan_name text,
    kpi_code character varying(50) NOT NULL,
    kpi_name text NOT NULL,
    measurement_unit character varying(50) NOT NULL,
    collection_cycle character varying(50) DEFAULT 'ปีงบประมาณ'::character varying,
    is_automated_calc boolean DEFAULT false
);


ALTER TABLE analytics.dim_strategic_kpi OWNER TO ku_admin;

--
-- Name: dim_strategic_kpi_kpi_key_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.dim_strategic_kpi_kpi_key_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.dim_strategic_kpi_kpi_key_seq OWNER TO ku_admin;

--
-- Name: dim_strategic_kpi_kpi_key_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.dim_strategic_kpi_kpi_key_seq OWNED BY analytics.dim_strategic_kpi.kpi_key;


--
-- Name: fact_academic_dev_projects; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_academic_dev_projects (
    fact_id integer NOT NULL,
    core_project_id uuid,
    start_date_key integer,
    end_date_key integer,
    organization_key integer NOT NULL,
    leader_researcher_key integer,
    client_name character varying(255),
    client_category character varying(100),
    client_frequency character varying(50),
    policy_alignment character varying(150),
    integration_type character varying(150),
    project_count integer DEFAULT 1,
    budget_total numeric(14,2) DEFAULT 0,
    overhead_15_pct numeric(14,2) DEFAULT 0,
    faculty_share_5_pct numeric(14,2) DEFAULT 0,
    dept_share_5_pct numeric(14,2) DEFAULT 0,
    ku_share_5_pct numeric(14,2) DEFAULT 0,
    internal_members_count integer DEFAULT 0,
    external_members_count integer DEFAULT 0
);


ALTER TABLE analytics.fact_academic_dev_projects OWNER TO ku_admin;

--
-- Name: fact_academic_dev_projects_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_academic_dev_projects_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_academic_dev_projects_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_academic_dev_projects_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_academic_dev_projects_fact_id_seq OWNED BY analytics.fact_academic_dev_projects.fact_id;


--
-- Name: fact_academic_services; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_academic_services (
    fact_id integer NOT NULL,
    core_service_id uuid,
    service_date_key integer,
    organization_key integer NOT NULL,
    provider_researcher_key integer,
    service_category character varying(100),
    target_group_name character varying(255),
    target_group_sector character varying(100),
    service_count integer DEFAULT 1,
    hours_spent numeric(6,2) DEFAULT 0,
    attendees_count integer DEFAULT 0
);


ALTER TABLE analytics.fact_academic_services OWNER TO ku_admin;

--
-- Name: fact_academic_services_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_academic_services_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_academic_services_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_academic_services_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_academic_services_fact_id_seq OWNED BY analytics.fact_academic_services.fact_id;


--
-- Name: fact_intellectual_properties; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_intellectual_properties (
    fact_id integer NOT NULL,
    core_ip_id uuid,
    filing_date_key integer,
    grant_date_key integer,
    expiration_date_key integer,
    organization_key integer NOT NULL,
    lead_inventor_key integer,
    ip_type_key integer,
    application_no character varying(100),
    registration_no character varying(100),
    protection_status character varying(50),
    ip_count integer DEFAULT 1,
    funding_support_amount numeric(12,2) DEFAULT 0
);


ALTER TABLE analytics.fact_intellectual_properties OWNER TO ku_admin;

--
-- Name: fact_intellectual_properties_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_intellectual_properties_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_intellectual_properties_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_intellectual_properties_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_intellectual_properties_fact_id_seq OWNED BY analytics.fact_intellectual_properties.fact_id;


--
-- Name: fact_kpi_performance; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_kpi_performance (
    fact_id integer NOT NULL,
    core_actual_id uuid,
    kpi_key integer NOT NULL,
    organization_key integer NOT NULL,
    as_of_date_key integer,
    fiscal_year_be integer NOT NULL,
    evaluation_period character varying(50) NOT NULL,
    responsible_person character varying(150),
    is_manual_override boolean DEFAULT false,
    target_value numeric(14,2) DEFAULT 0,
    actual_value numeric(14,2) DEFAULT 0,
    achievement_rate numeric(6,2) DEFAULT 0
);


ALTER TABLE analytics.fact_kpi_performance OWNER TO ku_admin;

--
-- Name: fact_kpi_performance_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_kpi_performance_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_kpi_performance_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_kpi_performance_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_kpi_performance_fact_id_seq OWNED BY analytics.fact_kpi_performance.fact_id;


--
-- Name: fact_publications; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_publications (
    fact_id integer NOT NULL,
    core_pub_id uuid,
    publication_date_key integer,
    organization_key integer NOT NULL,
    first_author_key integer,
    tier_key integer,
    publication_type character varying(100),
    journal_name text,
    volume character varying(50),
    issue character varying(50),
    page_range character varying(100),
    doi character varying(150),
    has_international_coauthor boolean DEFAULT false,
    has_domestic_coauthor boolean DEFAULT false,
    publication_count integer DEFAULT 1,
    funding_amount numeric(12,2) DEFAULT 0
);


ALTER TABLE analytics.fact_publications OWNER TO ku_admin;

--
-- Name: fact_publications_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_publications_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_publications_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_publications_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_publications_fact_id_seq OWNED BY analytics.fact_publications.fact_id;


--
-- Name: fact_research_projects; Type: TABLE; Schema: analytics; Owner: ku_admin
--

CREATE TABLE analytics.fact_research_projects (
    fact_id integer NOT NULL,
    core_project_id uuid,
    start_date_key integer,
    end_date_key integer,
    organization_key integer NOT NULL,
    leader_researcher_key integer,
    funding_source_key integer,
    project_code character varying(100),
    collaboration_type character varying(50),
    project_character character varying(150),
    trl_level character varying(20),
    integration_type character varying(150),
    duration_months integer,
    project_count integer DEFAULT 1,
    budget_total numeric(14,2) DEFAULT 0,
    budget_internal numeric(14,2) DEFAULT 0,
    budget_external numeric(14,2) DEFAULT 0
);


ALTER TABLE analytics.fact_research_projects OWNER TO ku_admin;

--
-- Name: fact_research_projects_fact_id_seq; Type: SEQUENCE; Schema: analytics; Owner: ku_admin
--

CREATE SEQUENCE analytics.fact_research_projects_fact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE analytics.fact_research_projects_fact_id_seq OWNER TO ku_admin;

--
-- Name: fact_research_projects_fact_id_seq; Type: SEQUENCE OWNED BY; Schema: analytics; Owner: ku_admin
--

ALTER SEQUENCE analytics.fact_research_projects_fact_id_seq OWNED BY analytics.fact_research_projects.fact_id;


--
-- Name: v_academic_dev_revenue_share; Type: VIEW; Schema: analytics; Owner: ku_admin
--

CREATE VIEW analytics.v_academic_dev_revenue_share AS
 SELECT dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    count(f.fact_id) AS "จำนวนโครงการ",
    sum(f.budget_total) AS "งบประมาณรวม",
    sum(f.overhead_15_pct) AS "ค่าอำนวยการ_15_pct",
    sum(f.faculty_share_5_pct) AS "ส่วนแบ่งคณะ_5_pct",
    sum(f.dept_share_5_pct) AS "ส่วนแบ่งภาควิชา_5_pct",
    sum(f.ku_share_5_pct) AS "ส่วนแบ่งมหาวิทยาลัย_5_pct",
    sum(f.internal_members_count) AS "บุคลากรภายในร่วมโครงก",
    sum(f.external_members_count) AS "ผู้เชี่ยวชาญภายนอก_คน"
   FROM ((analytics.fact_academic_dev_projects f
     JOIN analytics.dim_organization org ON ((f.organization_key = org.organization_key)))
     JOIN analytics.dim_date dt ON ((f.start_date_key = dt.date_key)))
  GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th;


ALTER VIEW analytics.v_academic_dev_revenue_share OWNER TO ku_admin;

--
-- Name: v_kpi_performance_dashboard; Type: VIEW; Schema: analytics; Owner: ku_admin
--

CREATE VIEW analytics.v_kpi_performance_dashboard AS
 SELECT org.faculty_name_th AS "คณะ_ส่วนงาน",
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
            WHEN (f.achievement_rate >= (100)::numeric) THEN 'บรรลุเป้าหมาย (On Track)'::text
            WHEN (f.achievement_rate >= (80)::numeric) THEN 'ใกล้บรรลุเป้าหมาย (Watchlist)'::text
            ELSE 'ยังไม่บรรลุเป้าหมาย (Need Action)'::text
        END AS "สถานะประเมิน",
    f.responsible_person AS "ผู้รับผิดชอบ"
   FROM ((analytics.fact_kpi_performance f
     JOIN analytics.dim_strategic_kpi kpi ON ((f.kpi_key = kpi.kpi_key)))
     JOIN analytics.dim_organization org ON ((f.organization_key = org.organization_key)));


ALTER VIEW analytics.v_kpi_performance_dashboard OWNER TO ku_admin;

--
-- Name: v_publications_top_tier; Type: VIEW; Schema: analytics; Owner: ku_admin
--

CREATE VIEW analytics.v_publications_top_tier AS
 SELECT dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    count(f.fact_id) AS "จำนวนสิ่งตีพิมพ์ทั้งห",
    count(f.fact_id) FILTER (WHERE ((pt.tier_code)::text = 'SCOPUS_Q1'::text)) AS "Scopus_Q1",
    count(f.fact_id) FILTER (WHERE ((pt.tier_code)::text = 'SCOPUS_Q2'::text)) AS "Scopus_Q2",
    count(f.fact_id) FILTER (WHERE ((pt.tier_code)::text = 'SCOPUS_Q3'::text)) AS "Scopus_Q3",
    count(f.fact_id) FILTER (WHERE ((pt.tier_code)::text = 'SCOPUS_Q4'::text)) AS "Scopus_Q4",
    count(f.fact_id) FILTER (WHERE ((pt.tier_code)::text ~~ 'TCI%'::text)) AS "TCI",
    count(f.fact_id) FILTER (WHERE (f.has_international_coauthor = true)) AS "มีผู้ร่วมวิจัยต่างชาต",
    round((((count(f.fact_id) FILTER (WHERE (f.has_international_coauthor = true)))::numeric / (NULLIF(count(f.fact_id), 0))::numeric) * (100)::numeric), 2) AS "สัดส่วนความร่วมมือต่า",
    sum(f.funding_amount) AS "งบสนับสนุนค่าตีพิมพ์ร"
   FROM (((analytics.fact_publications f
     JOIN analytics.dim_organization org ON ((f.organization_key = org.organization_key)))
     JOIN analytics.dim_date dt ON ((f.publication_date_key = dt.date_key)))
     LEFT JOIN analytics.dim_publication_tier pt ON ((f.tier_key = pt.tier_key)))
  GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th;


ALTER VIEW analytics.v_publications_top_tier OWNER TO ku_admin;

--
-- Name: v_research_summary_by_dept; Type: VIEW; Schema: analytics; Owner: ku_admin
--

CREATE VIEW analytics.v_research_summary_by_dept AS
 SELECT dt.fiscal_year_be AS "ปีงบประมาณ",
    org.faculty_name_th AS "คณะ",
    org.department_name_th AS "ภาควิชา",
    fund.funding_type AS "ประเภททุน",
    fund.funding_source_name AS "แหล่งทุน",
    count(f.fact_id) AS "จำนวนโครงการ",
    sum(f.budget_total) AS "งบประมาณรวมทั้งสิ้น",
    sum(f.budget_internal) AS "งบประมาณทุนภายใน",
    sum(f.budget_external) AS "งบประมาณทุนภายนอก"
   FROM (((analytics.fact_research_projects f
     JOIN analytics.dim_organization org ON ((f.organization_key = org.organization_key)))
     JOIN analytics.dim_date dt ON ((f.start_date_key = dt.date_key)))
     LEFT JOIN analytics.dim_funding_source fund ON ((f.funding_source_key = fund.funding_source_key)))
  GROUP BY dt.fiscal_year_be, org.faculty_name_th, org.department_name_th, fund.funding_type, fund.funding_source_name;


ALTER VIEW analytics.v_research_summary_by_dept OWNER TO ku_admin;

--
-- Name: v_researcher_360_portfolio; Type: VIEW; Schema: analytics; Owner: ku_admin
--

CREATE VIEW analytics.v_researcher_360_portfolio AS
 SELECT res.researcher_key,
    res.full_name_th AS "อาจารย์_นักวิจัย",
    res.academic_position AS "ตำแหน่งทางวิชาการ",
    res.department_name_th AS "ภาควิชา",
    res.faculty_name_th AS "คณะ",
    count(DISTINCT br_res.fact_id) AS "โครงการวิจัยทั้งหมด",
    count(DISTINCT br_res.fact_id) FILTER (WHERE ((br_res.role_name)::text = 'หัวหน้าโครงการ'::text)) AS "หัวหน้าโครงการวิจัย",
    count(DISTINCT br_res.fact_id) FILTER (WHERE ((br_res.role_name)::text = 'ผู้ร่วมวิจัย'::text)) AS "ผู้ร่วมวิจัย",
    count(DISTINCT br_pub.fact_id) AS "ผลงานตีพิมพ์ทั้งหมด",
    count(DISTINCT br_pub.fact_id) FILTER (WHERE (pt.is_top_tier = true)) AS "ผลงาน_Scopus_Q1_Q2",
    count(DISTINCT br_ip.fact_id) AS "ทรัพย์สินทางปัญญาทั้ง",
    COALESCE(sum(serv.hours_spent), (0)::numeric) AS "ชั่วโมงบริการวิชาการร"
   FROM ((((((analytics.dim_researcher res
     LEFT JOIN analytics.bridge_research_project_members br_res ON ((res.researcher_key = br_res.researcher_key)))
     LEFT JOIN analytics.bridge_publication_authors br_pub ON ((res.researcher_key = br_pub.researcher_key)))
     LEFT JOIN analytics.fact_publications pub ON ((br_pub.fact_id = pub.fact_id)))
     LEFT JOIN analytics.dim_publication_tier pt ON ((pub.tier_key = pt.tier_key)))
     LEFT JOIN analytics.bridge_ip_inventors br_ip ON ((res.researcher_key = br_ip.researcher_key)))
     LEFT JOIN analytics.fact_academic_services serv ON ((res.researcher_key = serv.provider_researcher_key)))
  GROUP BY res.researcher_key, res.full_name_th, res.academic_position, res.department_name_th, res.faculty_name_th;


ALTER VIEW analytics.v_researcher_360_portfolio OWNER TO ku_admin;

--
-- Name: academic_dev_project_members; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.academic_dev_project_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    person_id uuid NOT NULL,
    role_name character varying(50) NOT NULL,
    affiliation_type character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.academic_dev_project_members OWNER TO ku_admin;

--
-- Name: academic_dev_projects; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.academic_dev_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_name_th text NOT NULL,
    managing_department_id uuid,
    client_name character varying(255),
    client_category character varying(100),
    client_frequency character varying(50),
    internal_members_count integer DEFAULT 0,
    external_members_count integer DEFAULT 0,
    budget_total numeric(14,2) NOT NULL,
    overhead_15_pct numeric(14,2),
    faculty_share_5_pct numeric(14,2),
    dept_share_5_pct numeric(14,2),
    ku_share_5_pct numeric(14,2),
    integration_type character varying(150),
    policy_alignment character varying(150),
    fiscal_year_be integer NOT NULL,
    start_date date,
    end_date date,
    integrated_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.academic_dev_projects OWNER TO ku_admin;

--
-- Name: academic_service_providers; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.academic_service_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_id uuid NOT NULL,
    person_id uuid NOT NULL,
    role_name character varying(50) DEFAULT 'ผู้ให้บริการ'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.academic_service_providers OWNER TO ku_admin;

--
-- Name: academic_services; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.academic_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topic_title text NOT NULL,
    department_id uuid,
    target_group character varying(255),
    service_category character varying(100) NOT NULL,
    service_date date,
    hours_spent numeric(6,2),
    attendees_count integer,
    fiscal_year_be integer NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.academic_services OWNER TO ku_admin;

--
-- Name: departments; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    faculty_id uuid NOT NULL,
    department_code character varying(50),
    department_name_th character varying(255) NOT NULL,
    department_name_en character varying(255),
    department_type character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.departments OWNER TO ku_admin;

--
-- Name: faculties; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.faculties (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    faculty_code character varying(30) NOT NULL,
    faculty_name_th character varying(255) NOT NULL,
    faculty_name_en character varying(255),
    campus_name character varying(100) DEFAULT 'กำแพงแสน'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.faculties OWNER TO ku_admin;

--
-- Name: intellectual_properties; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.intellectual_properties (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_title text NOT NULL,
    department_id uuid,
    ip_category character varying(100) NOT NULL,
    application_no character varying(100),
    registration_no character varying(100),
    filing_date date,
    registration_date date,
    expiration_date date,
    registration_year_be integer,
    protection_status character varying(50),
    protection_level character varying(50) DEFAULT 'ชาติ'::character varying,
    funding_support_amount numeric(12,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.intellectual_properties OWNER TO ku_admin;

--
-- Name: ip_inventors; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.ip_inventors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_id uuid NOT NULL,
    person_id uuid NOT NULL,
    inventor_role character varying(50) DEFAULT 'ผู้ประดิษฐ์'::character varying,
    contribution_percent numeric(5,2),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.ip_inventors OWNER TO ku_admin;

--
-- Name: kpi_actuals; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.kpi_actuals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kpi_id uuid NOT NULL,
    department_id uuid,
    fiscal_year_be integer NOT NULL,
    evaluation_period character varying(50) NOT NULL,
    actual_value numeric(14,2),
    achievement_rate numeric(6,2),
    is_manual_override boolean DEFAULT false,
    responsible_person character varying(150),
    remarks text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.kpi_actuals OWNER TO ku_admin;

--
-- Name: kpi_targets; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.kpi_targets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kpi_id uuid NOT NULL,
    fiscal_year_be integer NOT NULL,
    target_value numeric(14,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.kpi_targets OWNER TO ku_admin;

--
-- Name: persons; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.persons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_id uuid,
    title_th character varying(50),
    first_name_th character varying(150) NOT NULL,
    last_name_th character varying(150) NOT NULL,
    full_name_normalized character varying(300) NOT NULL,
    academic_position character varying(100),
    personnel_type character varying(50) DEFAULT 'บุคลากรภายใน'::character varying,
    email character varying(150),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.persons OWNER TO ku_admin;

--
-- Name: publication_authors; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.publication_authors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    person_id uuid NOT NULL,
    author_role character varying(50) NOT NULL,
    author_scope character varying(50),
    contribution_percent numeric(5,2),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.publication_authors OWNER TO ku_admin;

--
-- Name: publications; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.publications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_title text NOT NULL,
    department_id uuid,
    publication_type character varying(100) NOT NULL,
    publication_level character varying(50) NOT NULL,
    journal_or_conf_name text,
    quartile_or_tier character varying(50),
    has_international_coauthor boolean DEFAULT false,
    has_domestic_coauthor boolean DEFAULT false,
    funding_amount numeric(12,2),
    publication_date date,
    fiscal_year_be integer NOT NULL,
    volume character varying(50),
    issue character varying(50),
    page_range character varying(100),
    doi character varying(150),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.publications OWNER TO ku_admin;

--
-- Name: research_project_members; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.research_project_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    person_id uuid NOT NULL,
    role_name character varying(50) NOT NULL,
    contribution_percent numeric(5,2),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.research_project_members OWNER TO ku_admin;

--
-- Name: research_projects; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.research_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_code character varying(100),
    project_name_th text NOT NULL,
    project_name_en text,
    managing_department_id uuid,
    collaboration_type character varying(50),
    project_character character varying(150),
    funding_source character varying(255),
    funding_type character varying(50),
    trl_level character varying(20),
    integration_type character varying(150),
    duration_months integer,
    budget_amount numeric(14,2),
    budget_internal numeric(14,2) DEFAULT 0,
    budget_external numeric(14,2) DEFAULT 0,
    fiscal_year_be integer NOT NULL,
    start_date date,
    end_date date,
    source_ref character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.research_projects OWNER TO ku_admin;

--
-- Name: strategic_kpis; Type: TABLE; Schema: core; Owner: ku_admin
--

CREATE TABLE core.strategic_kpis (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    faculty_id uuid NOT NULL,
    strategy_no character varying(50) NOT NULL,
    strategy_name text NOT NULL,
    plan_no character varying(50),
    plan_name text,
    kpi_code character varying(50) NOT NULL,
    kpi_name text NOT NULL,
    kpi_description text,
    measurement_unit character varying(50) NOT NULL,
    collection_cycle character varying(50) DEFAULT 'ปีงบประมาณ'::character varying,
    is_automated_calc boolean DEFAULT false,
    calc_formula_code character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE core.strategic_kpis OWNER TO ku_admin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ku_owner;

--
-- Name: academic_dev_projects; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.academic_dev_projects (
    id integer NOT NULL,
    legacy_id character varying(100) NOT NULL,
    name character varying(500) NOT NULL,
    head_name character varying(255),
    head_personnel_id integer,
    department_code character varying(10) NOT NULL,
    client character varying(255) NOT NULL,
    budget numeric(15,2) DEFAULT 0 NOT NULL,
    month character varying(50),
    fiscal_year integer,
    start_date date,
    end_date date,
    integration_start_date date,
    integration_end_date date,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    alloc_dept numeric(15,2) DEFAULT 0,
    alloc_faculty numeric(15,2) DEFAULT 0,
    alloc_ku numeric(15,2) DEFAULT 0,
    alloc_overhead numeric(15,2) DEFAULT 0,
    alloc_remaining numeric(15,2) DEFAULT 0,
    characteristics character varying(255),
    co_members_external integer DEFAULT 0,
    co_members_internal integer DEFAULT 0,
    patent_integration text,
    project_sub_types text,
    project_type_category character varying(100),
    record_number character varying(100),
    remarks text,
    research_integration text,
    research_projects text,
    service_receiver_type character varying(50),
    status character varying(50),
    CONSTRAINT chk_academic_date_order CHECK (((end_date IS NULL) OR (start_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT chk_academic_integration_dates CHECK (((integration_end_date IS NULL) OR (integration_start_date IS NULL) OR (integration_end_date >= integration_start_date)))
);


ALTER TABLE public.academic_dev_projects OWNER TO ku_owner;

--
-- Name: academic_dev_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.academic_dev_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_dev_projects_id_seq OWNER TO ku_owner;

--
-- Name: academic_dev_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.academic_dev_projects_id_seq OWNED BY public.academic_dev_projects.id;


--
-- Name: academic_services; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.academic_services (
    id integer NOT NULL,
    legacy_id character varying(100),
    name character varying(500) NOT NULL,
    service_category character varying(100) NOT NULL,
    provider_name character varying(255),
    provider_personnel_id integer,
    department_code character varying(10),
    target_group character varying(255) NOT NULL,
    hours_spent numeric(8,2) DEFAULT 0 NOT NULL,
    attendees_count integer DEFAULT 0 NOT NULL,
    date date,
    start_date date NOT NULL,
    end_date date NOT NULL,
    fiscal_year integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    remarks text,
    CONSTRAINT chk_service_category CHECK (((service_category)::text = ANY ((ARRAY['วิทยากร/อาจารย์พิเศษ'::character varying, 'วิชาการ'::character varying, 'วิชาชีพ'::character varying, 'ผู้ทรงคุณวุฒิ'::character varying, 'วิทยานิพนธ์ภายนอก'::character varying, 'ศึกษาดูงาน วศ.กพส.'::character varying])::text[]))),
    CONSTRAINT chk_service_date_order CHECK ((end_date >= start_date)),
    CONSTRAINT chk_service_positive_metrics CHECK (((hours_spent > (0)::numeric) AND (attendees_count > 0)))
);


ALTER TABLE public.academic_services OWNER TO ku_owner;

--
-- Name: academic_services_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.academic_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_services_id_seq OWNER TO ku_owner;

--
-- Name: academic_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.academic_services_id_seq OWNED BY public.academic_services.id;


--
-- Name: course_catalog; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.course_catalog (
    course_code character varying(20) NOT NULL,
    course_name_th character varying(255) NOT NULL,
    course_name_en character varying(255),
    department_code character varying(10)
);


ALTER TABLE public.course_catalog OWNER TO ku_owner;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.departments (
    code character varying(10) NOT NULL,
    name_th character varying(255) NOT NULL,
    name_en character varying(255),
    is_canonical boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.departments OWNER TO ku_owner;

--
-- Name: evaluations; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.evaluations (
    id integer NOT NULL,
    category character varying(50) NOT NULL,
    record_id character varying(100) NOT NULL,
    sdg_ids integer[],
    i_type character varying(50),
    journal_index character varying(100),
    evaluated_by character varying(100),
    evaluated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.evaluations OWNER TO ku_owner;

--
-- Name: evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.evaluations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluations_id_seq OWNER TO ku_owner;

--
-- Name: evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.evaluations_id_seq OWNED BY public.evaluations.id;


--
-- Name: funding_sources; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.funding_sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(100)
);


ALTER TABLE public.funding_sources OWNER TO ku_owner;

--
-- Name: funding_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.funding_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funding_sources_id_seq OWNER TO ku_owner;

--
-- Name: funding_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.funding_sources_id_seq OWNED BY public.funding_sources.id;


--
-- Name: intellectual_properties; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.intellectual_properties (
    id integer NOT NULL,
    legacy_id character varying(100),
    title character varying(500) NOT NULL,
    type character varying(50) NOT NULL,
    work_category character varying(100),
    work_character character varying(100),
    creator_name character varying(255),
    creator_personnel_id integer,
    department_code character varying(10),
    application_number character varying(50),
    registration_number character varying(50) NOT NULL,
    filing_date date,
    protection_start date NOT NULL,
    protection_end date,
    support_amount numeric(15,2) DEFAULT 0 NOT NULL,
    status character varying(50),
    fiscal_year integer,
    remarks text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    owner character varying(255) DEFAULT 'มหาวิทยาลัยเกษตรศาสตร์'::character varying,
    right_holder character varying(255) DEFAULT 'มหาวิทยาลัยเกษตรศาสตร์'::character varying,
    CONSTRAINT chk_ip_petty_patent_reg_no CHECK ((((type)::text <> 'อนุสิทธิบัตร'::text) OR ((TRIM(BOTH FROM registration_number) <> ''::text) AND ((registration_number)::text <> '-'::text)))),
    CONSTRAINT chk_ip_protection_dates CHECK (((protection_end IS NULL) OR (protection_start IS NULL) OR (protection_end >= protection_start))),
    CONSTRAINT chk_ip_type CHECK (((type)::text = ANY ((ARRAY['อนุสิทธิบัตร'::character varying, 'สิทธิบัตร'::character varying, 'ลิขสิทธิ์'::character varying])::text[])))
);


ALTER TABLE public.intellectual_properties OWNER TO ku_owner;

--
-- Name: intellectual_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.intellectual_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intellectual_properties_id_seq OWNER TO ku_owner;

--
-- Name: intellectual_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.intellectual_properties_id_seq OWNED BY public.intellectual_properties.id;


--
-- Name: ip_departments; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.ip_departments (
    id integer NOT NULL,
    ip_id integer NOT NULL,
    department_code character varying(10) NOT NULL,
    other_name character varying(255)
);


ALTER TABLE public.ip_departments OWNER TO ku_owner;

--
-- Name: ip_departments_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.ip_departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_departments_id_seq OWNER TO ku_owner;

--
-- Name: ip_departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.ip_departments_id_seq OWNED BY public.ip_departments.id;


--
-- Name: ip_inventors; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.ip_inventors (
    id integer NOT NULL,
    ip_id integer NOT NULL,
    person_name character varying(255) NOT NULL,
    personnel_id integer,
    is_lead boolean DEFAULT false NOT NULL
);


ALTER TABLE public.ip_inventors OWNER TO ku_owner;

--
-- Name: ip_inventors_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.ip_inventors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_inventors_id_seq OWNER TO ku_owner;

--
-- Name: ip_inventors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.ip_inventors_id_seq OWNED BY public.ip_inventors.id;


--
-- Name: kpi_option_lookups; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.kpi_option_lookups (
    id integer NOT NULL,
    field_key character varying(50) NOT NULL,
    value character varying(255) NOT NULL,
    label character varying(255) NOT NULL,
    is_custom boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kpi_option_lookups OWNER TO ku_owner;

--
-- Name: kpi_option_lookups_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.kpi_option_lookups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kpi_option_lookups_id_seq OWNER TO ku_owner;

--
-- Name: kpi_option_lookups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.kpi_option_lookups_id_seq OWNED BY public.kpi_option_lookups.id;


--
-- Name: kpi_reporting_rounds; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.kpi_reporting_rounds (
    id character varying(64) NOT NULL,
    name character varying(255) NOT NULL,
    start_date date,
    end_date date,
    due_date date,
    is_cumulative boolean DEFAULT true NOT NULL,
    fiscal_year integer DEFAULT 2569 NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kpi_reporting_rounds OWNER TO ku_owner;

--
-- Name: personnel; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.personnel (
    id integer NOT NULL,
    person_id character varying(50),
    title_th character varying(50),
    name_th character varying(255) NOT NULL,
    name_en character varying(255),
    "position" character varying(100),
    department_code character varying(10),
    email character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    image_url character varying(500),
    first_name character varying(150),
    last_name character varying(150)
);


ALTER TABLE public.personnel OWNER TO ku_owner;

--
-- Name: personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personnel_id_seq OWNER TO ku_owner;

--
-- Name: personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.personnel_id_seq OWNED BY public.personnel.id;


--
-- Name: publication_authors; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.publication_authors (
    id integer NOT NULL,
    publication_id integer NOT NULL,
    person_name character varying(255) NOT NULL,
    personnel_id integer,
    affiliation_type character varying(50)
);


ALTER TABLE public.publication_authors OWNER TO ku_owner;

--
-- Name: publication_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.publication_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_authors_id_seq OWNER TO ku_owner;

--
-- Name: publication_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.publication_authors_id_seq OWNED BY public.publication_authors.id;


--
-- Name: publications; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.publications (
    id integer NOT NULL,
    legacy_id character varying(100),
    title character varying(500) NOT NULL,
    type character varying(100),
    level character varying(50),
    journal character varying(500) NOT NULL,
    volume character varying(50) NOT NULL,
    issue character varying(50) NOT NULL,
    page_start character varying(50) NOT NULL,
    page_end character varying(50) NOT NULL,
    budget numeric(15,2) DEFAULT 0 NOT NULL,
    first_author_name character varying(255),
    first_author_personnel_id integer,
    department_code character varying(10),
    fiscal_year_be integer NOT NULL,
    month character varying(50),
    month_year character varying(50),
    status character varying(50),
    remarks text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    co_authors_domestic text,
    co_authors_foreign text,
    has_domestic_coauthor boolean DEFAULT false,
    has_foreign_coauthor boolean DEFAULT false,
    has_international_coauthor boolean DEFAULT false,
    quartile character varying(10),
    CONSTRAINT chk_publication_budget_non_negative CHECK ((budget >= (0)::numeric)),
    CONSTRAINT chk_publication_page_range CHECK ((((page_start)::text !~ '^\d+$'::text) OR ((page_end)::text !~ '^\d+$'::text) OR ((page_end)::integer >= (page_start)::integer)))
);


ALTER TABLE public.publications OWNER TO ku_owner;

--
-- Name: publications_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.publications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publications_id_seq OWNER TO ku_owner;

--
-- Name: publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.publications_id_seq OWNED BY public.publications.id;


--
-- Name: research_project_departments; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.research_project_departments (
    id integer NOT NULL,
    project_id integer NOT NULL,
    department_code character varying(10) NOT NULL,
    other_name character varying(255)
);


ALTER TABLE public.research_project_departments OWNER TO ku_owner;

--
-- Name: research_project_departments_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.research_project_departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.research_project_departments_id_seq OWNER TO ku_owner;

--
-- Name: research_project_departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.research_project_departments_id_seq OWNED BY public.research_project_departments.id;


--
-- Name: research_project_members; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.research_project_members (
    id integer NOT NULL,
    project_id integer NOT NULL,
    person_name character varying(255) NOT NULL,
    personnel_id integer,
    role character varying(100)
);


ALTER TABLE public.research_project_members OWNER TO ku_owner;

--
-- Name: research_project_members_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.research_project_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.research_project_members_id_seq OWNER TO ku_owner;

--
-- Name: research_project_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.research_project_members_id_seq OWNED BY public.research_project_members.id;


--
-- Name: research_projects; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.research_projects (
    id integer NOT NULL,
    legacy_id character varying(100),
    code character varying(100),
    name character varying(500) NOT NULL,
    name_en character varying(500),
    head_name character varying(255),
    head_personnel_id integer,
    head_department_code character varying(10),
    status character varying(50),
    budget_internal numeric(15,2) DEFAULT 0 NOT NULL,
    budget_external numeric(15,2) DEFAULT 0 NOT NULL,
    fund_source character varying(255),
    fund_type character varying(100) NOT NULL,
    collaboration_type character varying(100),
    project_nature character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    fiscal_year integer NOT NULL,
    trl_outputs text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    academic_service text,
    applied_courses text,
    cross_disciplinary text,
    integration text,
    remarks text,
    teaching_courses text,
    trl_end integer,
    trl_start integer,
    CONSTRAINT chk_research_budget_non_negative CHECK (((budget_internal >= (0)::numeric) AND (budget_external >= (0)::numeric))),
    CONSTRAINT chk_research_date_order CHECK ((end_date >= start_date))
);


ALTER TABLE public.research_projects OWNER TO ku_owner;

--
-- Name: research_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.research_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.research_projects_id_seq OWNER TO ku_owner;

--
-- Name: research_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.research_projects_id_seq OWNED BY public.research_projects.id;


--
-- Name: role_audit_logs; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.role_audit_logs (
    id bigint NOT NULL,
    actor_username character varying(100) NOT NULL,
    action character varying(50) NOT NULL,
    target_username character varying(100) NOT NULL,
    old_role character varying(50),
    new_role character varying(50) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.role_audit_logs OWNER TO ku_owner;

--
-- Name: role_audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.role_audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_audit_logs_id_seq OWNER TO ku_owner;

--
-- Name: role_audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.role_audit_logs_id_seq OWNED BY public.role_audit_logs.id;


--
-- Name: strategic_indicator_round_results; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.strategic_indicator_round_results (
    id character varying(64) NOT NULL,
    indicator_id character varying(64) NOT NULL,
    sub_indicator_id character varying(64),
    round_id character varying(64) NOT NULL,
    actual_value numeric(15,2),
    actual_text character varying(255),
    evidence text,
    remarks text,
    reporter character varying(255),
    status character varying(30) DEFAULT 'draft'::character varying NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.strategic_indicator_round_results OWNER TO ku_owner;

--
-- Name: strategic_indicators; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.strategic_indicators (
    id character varying(64) NOT NULL,
    strategy_id character varying(64) NOT NULL,
    plan_id character varying(64) NOT NULL,
    code character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    category character varying(50) DEFAULT 'research'::character varying NOT NULL,
    fiscal_year character varying(20) DEFAULT '2569'::character varying NOT NULL,
    collection_period character varying(100) DEFAULT 'ปีงบประมาณ'::character varying NOT NULL,
    value_type character varying(100) DEFAULT 'จำนวนนับ'::character varying NOT NULL,
    reporting_levels text[] DEFAULT ARRAY[]::text[],
    unit character varying(100) NOT NULL,
    target_operator character varying(20) DEFAULT 'gte'::character varying NOT NULL,
    target_value numeric(15,2) DEFAULT 0 NOT NULL,
    target_label character varying(100),
    department_target character varying(100),
    formula_method character varying(50) DEFAULT 'SUM'::character varying NOT NULL,
    calc_type character varying(50) DEFAULT 'manual'::character varying NOT NULL,
    dataset_key character varying(50) DEFAULT 'research'::character varying NOT NULL,
    active_round_ids text[] DEFAULT ARRAY[]::text[],
    reporters text[] DEFAULT ARRAY[]::text[],
    responsible_unit character varying(255),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dataset_keys text[] DEFAULT ARRAY[]::text[],
    manual_excluded_project_ids text[] DEFAULT ARRAY[]::text[],
    manual_included_project_ids text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.strategic_indicators OWNER TO ku_owner;

--
-- Name: strategic_plans; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.strategic_plans (
    id character varying(64) NOT NULL,
    strategy_id character varying(64) NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(500) NOT NULL,
    is_department_project boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.strategic_plans OWNER TO ku_owner;

--
-- Name: strategic_strategies; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.strategic_strategies (
    id character varying(64) NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(500) NOT NULL,
    pillar_group character varying(255),
    fiscal_year integer DEFAULT 2569 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.strategic_strategies OWNER TO ku_owner;

--
-- Name: strategic_sub_indicators; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.strategic_sub_indicators (
    id character varying(64) NOT NULL,
    indicator_id character varying(64) NOT NULL,
    title character varying(500) NOT NULL,
    unit character varying(100) NOT NULL,
    formula_role character varying(50) DEFAULT 'sum_part'::character varying NOT NULL,
    value_source character varying(50) DEFAULT 'manual'::character varying NOT NULL,
    linked_dataset_key character varying(50),
    target character varying(100),
    reporters text[] DEFAULT ARRAY[]::text[],
    sort_order integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.strategic_sub_indicators OWNER TO ku_owner;

--
-- Name: system_health_check; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.system_health_check (
    id integer NOT NULL,
    status text DEFAULT 'ok'::text NOT NULL,
    checked_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.system_health_check OWNER TO ku_owner;

--
-- Name: system_health_check_id_seq; Type: SEQUENCE; Schema: public; Owner: ku_owner
--

CREATE SEQUENCE public.system_health_check_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_health_check_id_seq OWNER TO ku_owner;

--
-- Name: system_health_check_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ku_owner
--

ALTER SEQUENCE public.system_health_check_id_seq OWNED BY public.system_health_check.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: ku_owner
--

CREATE TABLE public.user_roles (
    username character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    display_name character varying(255),
    granted_by character varying(100),
    granted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    note text,
    updated_at timestamp(3) without time zone NOT NULL,
    is_protected boolean DEFAULT false NOT NULL,
    otp character varying(50),
    password character varying(255),
    CONSTRAINT check_user_role CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.user_roles OWNER TO ku_owner;

--
-- Name: dim_funding_source funding_source_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_funding_source ALTER COLUMN funding_source_key SET DEFAULT nextval('analytics.dim_funding_source_funding_source_key_seq'::regclass);


--
-- Name: dim_ip_type ip_type_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_ip_type ALTER COLUMN ip_type_key SET DEFAULT nextval('analytics.dim_ip_type_ip_type_key_seq'::regclass);


--
-- Name: dim_organization organization_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_organization ALTER COLUMN organization_key SET DEFAULT nextval('analytics.dim_organization_organization_key_seq'::regclass);


--
-- Name: dim_publication_tier tier_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_publication_tier ALTER COLUMN tier_key SET DEFAULT nextval('analytics.dim_publication_tier_tier_key_seq'::regclass);


--
-- Name: dim_researcher researcher_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_researcher ALTER COLUMN researcher_key SET DEFAULT nextval('analytics.dim_researcher_researcher_key_seq'::regclass);


--
-- Name: dim_strategic_kpi kpi_key; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_strategic_kpi ALTER COLUMN kpi_key SET DEFAULT nextval('analytics.dim_strategic_kpi_kpi_key_seq'::regclass);


--
-- Name: fact_academic_dev_projects fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_academic_dev_projects_fact_id_seq'::regclass);


--
-- Name: fact_academic_services fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_academic_services_fact_id_seq'::regclass);


--
-- Name: fact_intellectual_properties fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_intellectual_properties_fact_id_seq'::regclass);


--
-- Name: fact_kpi_performance fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_kpi_performance_fact_id_seq'::regclass);


--
-- Name: fact_publications fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_publications_fact_id_seq'::regclass);


--
-- Name: fact_research_projects fact_id; Type: DEFAULT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects ALTER COLUMN fact_id SET DEFAULT nextval('analytics.fact_research_projects_fact_id_seq'::regclass);


--
-- Name: academic_dev_projects id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_dev_projects ALTER COLUMN id SET DEFAULT nextval('public.academic_dev_projects_id_seq'::regclass);


--
-- Name: academic_services id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_services ALTER COLUMN id SET DEFAULT nextval('public.academic_services_id_seq'::regclass);


--
-- Name: evaluations id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.evaluations ALTER COLUMN id SET DEFAULT nextval('public.evaluations_id_seq'::regclass);


--
-- Name: funding_sources id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.funding_sources ALTER COLUMN id SET DEFAULT nextval('public.funding_sources_id_seq'::regclass);


--
-- Name: intellectual_properties id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.intellectual_properties ALTER COLUMN id SET DEFAULT nextval('public.intellectual_properties_id_seq'::regclass);


--
-- Name: ip_departments id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_departments ALTER COLUMN id SET DEFAULT nextval('public.ip_departments_id_seq'::regclass);


--
-- Name: ip_inventors id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_inventors ALTER COLUMN id SET DEFAULT nextval('public.ip_inventors_id_seq'::regclass);


--
-- Name: kpi_option_lookups id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.kpi_option_lookups ALTER COLUMN id SET DEFAULT nextval('public.kpi_option_lookups_id_seq'::regclass);


--
-- Name: personnel id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.personnel ALTER COLUMN id SET DEFAULT nextval('public.personnel_id_seq'::regclass);


--
-- Name: publication_authors id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publication_authors ALTER COLUMN id SET DEFAULT nextval('public.publication_authors_id_seq'::regclass);


--
-- Name: publications id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publications ALTER COLUMN id SET DEFAULT nextval('public.publications_id_seq'::regclass);


--
-- Name: research_project_departments id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_departments ALTER COLUMN id SET DEFAULT nextval('public.research_project_departments_id_seq'::regclass);


--
-- Name: research_project_members id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_members ALTER COLUMN id SET DEFAULT nextval('public.research_project_members_id_seq'::regclass);


--
-- Name: research_projects id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_projects ALTER COLUMN id SET DEFAULT nextval('public.research_projects_id_seq'::regclass);


--
-- Name: role_audit_logs id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.role_audit_logs ALTER COLUMN id SET DEFAULT nextval('public.role_audit_logs_id_seq'::regclass);


--
-- Name: system_health_check id; Type: DEFAULT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.system_health_check ALTER COLUMN id SET DEFAULT nextval('public.system_health_check_id_seq'::regclass);


--
-- Name: bridge_ip_inventors bridge_ip_inventors_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_ip_inventors
    ADD CONSTRAINT bridge_ip_inventors_pkey PRIMARY KEY (fact_id, researcher_key);


--
-- Name: bridge_publication_authors bridge_publication_authors_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_publication_authors
    ADD CONSTRAINT bridge_publication_authors_pkey PRIMARY KEY (fact_id, researcher_key, author_role);


--
-- Name: bridge_research_project_members bridge_research_project_members_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_research_project_members
    ADD CONSTRAINT bridge_research_project_members_pkey PRIMARY KEY (fact_id, researcher_key, role_name);


--
-- Name: dim_date dim_date_full_date_key; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_date
    ADD CONSTRAINT dim_date_full_date_key UNIQUE (full_date);


--
-- Name: dim_date dim_date_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_date
    ADD CONSTRAINT dim_date_pkey PRIMARY KEY (date_key);


--
-- Name: dim_funding_source dim_funding_source_funding_source_name_key; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_funding_source
    ADD CONSTRAINT dim_funding_source_funding_source_name_key UNIQUE (funding_source_name);


--
-- Name: dim_funding_source dim_funding_source_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_funding_source
    ADD CONSTRAINT dim_funding_source_pkey PRIMARY KEY (funding_source_key);


--
-- Name: dim_ip_type dim_ip_type_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_ip_type
    ADD CONSTRAINT dim_ip_type_pkey PRIMARY KEY (ip_type_key);


--
-- Name: dim_organization dim_organization_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_organization
    ADD CONSTRAINT dim_organization_pkey PRIMARY KEY (organization_key);


--
-- Name: dim_publication_tier dim_publication_tier_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_publication_tier
    ADD CONSTRAINT dim_publication_tier_pkey PRIMARY KEY (tier_key);


--
-- Name: dim_publication_tier dim_publication_tier_tier_code_key; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_publication_tier
    ADD CONSTRAINT dim_publication_tier_tier_code_key UNIQUE (tier_code);


--
-- Name: dim_researcher dim_researcher_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_researcher
    ADD CONSTRAINT dim_researcher_pkey PRIMARY KEY (researcher_key);


--
-- Name: dim_strategic_kpi dim_strategic_kpi_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_strategic_kpi
    ADD CONSTRAINT dim_strategic_kpi_pkey PRIMARY KEY (kpi_key);


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_pkey PRIMARY KEY (fact_id);


--
-- Name: fact_academic_services fact_academic_services_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services
    ADD CONSTRAINT fact_academic_services_pkey PRIMARY KEY (fact_id);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_pkey PRIMARY KEY (fact_id);


--
-- Name: fact_kpi_performance fact_kpi_performance_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance
    ADD CONSTRAINT fact_kpi_performance_pkey PRIMARY KEY (fact_id);


--
-- Name: fact_publications fact_publications_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_pkey PRIMARY KEY (fact_id);


--
-- Name: fact_research_projects fact_research_projects_pkey; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_pkey PRIMARY KEY (fact_id);


--
-- Name: dim_ip_type uq_dim_ip_type; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_ip_type
    ADD CONSTRAINT uq_dim_ip_type UNIQUE (ip_category, protection_level);


--
-- Name: dim_organization uq_dim_org; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_organization
    ADD CONSTRAINT uq_dim_org UNIQUE (faculty_id, department_id);


--
-- Name: dim_researcher uq_dim_researcher; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_researcher
    ADD CONSTRAINT uq_dim_researcher UNIQUE (person_id);


--
-- Name: dim_strategic_kpi uq_dim_strategic_kpi; Type: CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_strategic_kpi
    ADD CONSTRAINT uq_dim_strategic_kpi UNIQUE (kpi_id);


--
-- Name: academic_dev_project_members academic_dev_project_members_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_project_members
    ADD CONSTRAINT academic_dev_project_members_pkey PRIMARY KEY (id);


--
-- Name: academic_dev_projects academic_dev_projects_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_projects
    ADD CONSTRAINT academic_dev_projects_pkey PRIMARY KEY (id);


--
-- Name: academic_service_providers academic_service_providers_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_service_providers
    ADD CONSTRAINT academic_service_providers_pkey PRIMARY KEY (id);


--
-- Name: academic_services academic_services_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_services
    ADD CONSTRAINT academic_services_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: faculties faculties_faculty_code_key; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.faculties
    ADD CONSTRAINT faculties_faculty_code_key UNIQUE (faculty_code);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: intellectual_properties intellectual_properties_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.intellectual_properties
    ADD CONSTRAINT intellectual_properties_pkey PRIMARY KEY (id);


--
-- Name: ip_inventors ip_inventors_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.ip_inventors
    ADD CONSTRAINT ip_inventors_pkey PRIMARY KEY (id);


--
-- Name: kpi_actuals kpi_actuals_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_actuals
    ADD CONSTRAINT kpi_actuals_pkey PRIMARY KEY (id);


--
-- Name: kpi_targets kpi_targets_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_targets
    ADD CONSTRAINT kpi_targets_pkey PRIMARY KEY (id);


--
-- Name: persons persons_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.persons
    ADD CONSTRAINT persons_pkey PRIMARY KEY (id);


--
-- Name: publication_authors publication_authors_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publication_authors
    ADD CONSTRAINT publication_authors_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: research_project_members research_project_members_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_project_members
    ADD CONSTRAINT research_project_members_pkey PRIMARY KEY (id);


--
-- Name: research_projects research_projects_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_projects
    ADD CONSTRAINT research_projects_pkey PRIMARY KEY (id);


--
-- Name: strategic_kpis strategic_kpis_pkey; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.strategic_kpis
    ADD CONSTRAINT strategic_kpis_pkey PRIMARY KEY (id);


--
-- Name: academic_service_providers uq_academic_service_provider; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_service_providers
    ADD CONSTRAINT uq_academic_service_provider UNIQUE (service_id, person_id);


--
-- Name: academic_dev_project_members uq_dev_project_member; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_project_members
    ADD CONSTRAINT uq_dev_project_member UNIQUE (project_id, person_id, role_name);


--
-- Name: departments uq_faculty_dept; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.departments
    ADD CONSTRAINT uq_faculty_dept UNIQUE (faculty_id, department_name_th);


--
-- Name: ip_inventors uq_ip_inventor; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.ip_inventors
    ADD CONSTRAINT uq_ip_inventor UNIQUE (ip_id, person_id);


--
-- Name: kpi_actuals uq_kpi_actual; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_actuals
    ADD CONSTRAINT uq_kpi_actual UNIQUE (kpi_id, department_id, fiscal_year_be, evaluation_period);


--
-- Name: kpi_targets uq_kpi_target; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_targets
    ADD CONSTRAINT uq_kpi_target UNIQUE (kpi_id, fiscal_year_be);


--
-- Name: publication_authors uq_publication_author; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publication_authors
    ADD CONSTRAINT uq_publication_author UNIQUE (publication_id, person_id, author_role);


--
-- Name: research_project_members uq_research_project_member; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_project_members
    ADD CONSTRAINT uq_research_project_member UNIQUE (project_id, person_id, role_name);


--
-- Name: strategic_kpis uq_strategic_kpis_code; Type: CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.strategic_kpis
    ADD CONSTRAINT uq_strategic_kpis_code UNIQUE (faculty_id, kpi_code);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_dev_projects academic_dev_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_dev_projects
    ADD CONSTRAINT academic_dev_projects_pkey PRIMARY KEY (id);


--
-- Name: academic_services academic_services_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_services
    ADD CONSTRAINT academic_services_pkey PRIMARY KEY (id);


--
-- Name: course_catalog course_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.course_catalog
    ADD CONSTRAINT course_catalog_pkey PRIMARY KEY (course_code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (code);


--
-- Name: evaluations evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_pkey PRIMARY KEY (id);


--
-- Name: funding_sources funding_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.funding_sources
    ADD CONSTRAINT funding_sources_pkey PRIMARY KEY (id);


--
-- Name: intellectual_properties intellectual_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.intellectual_properties
    ADD CONSTRAINT intellectual_properties_pkey PRIMARY KEY (id);


--
-- Name: ip_departments ip_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_departments
    ADD CONSTRAINT ip_departments_pkey PRIMARY KEY (id);


--
-- Name: ip_inventors ip_inventors_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_inventors
    ADD CONSTRAINT ip_inventors_pkey PRIMARY KEY (id);


--
-- Name: kpi_option_lookups kpi_option_lookups_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.kpi_option_lookups
    ADD CONSTRAINT kpi_option_lookups_pkey PRIMARY KEY (id);


--
-- Name: kpi_reporting_rounds kpi_reporting_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.kpi_reporting_rounds
    ADD CONSTRAINT kpi_reporting_rounds_pkey PRIMARY KEY (id);


--
-- Name: personnel personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_pkey PRIMARY KEY (id);


--
-- Name: publication_authors publication_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: research_project_departments research_project_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_departments
    ADD CONSTRAINT research_project_departments_pkey PRIMARY KEY (id);


--
-- Name: research_project_members research_project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT research_project_members_pkey PRIMARY KEY (id);


--
-- Name: research_projects research_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_pkey PRIMARY KEY (id);


--
-- Name: role_audit_logs role_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.role_audit_logs
    ADD CONSTRAINT role_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: strategic_indicator_round_results strategic_indicator_round_results_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicator_round_results
    ADD CONSTRAINT strategic_indicator_round_results_pkey PRIMARY KEY (id);


--
-- Name: strategic_indicators strategic_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicators
    ADD CONSTRAINT strategic_indicators_pkey PRIMARY KEY (id);


--
-- Name: strategic_plans strategic_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_plans
    ADD CONSTRAINT strategic_plans_pkey PRIMARY KEY (id);


--
-- Name: strategic_strategies strategic_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_strategies
    ADD CONSTRAINT strategic_strategies_pkey PRIMARY KEY (id);


--
-- Name: strategic_sub_indicators strategic_sub_indicators_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_sub_indicators
    ADD CONSTRAINT strategic_sub_indicators_pkey PRIMARY KEY (id);


--
-- Name: system_health_check system_health_check_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.system_health_check
    ADD CONSTRAINT system_health_check_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (username);


--
-- Name: idx_br_ip_researcher; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_br_ip_researcher ON analytics.bridge_ip_inventors USING btree (researcher_key);


--
-- Name: idx_br_pub_researcher; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_br_pub_researcher ON analytics.bridge_publication_authors USING btree (researcher_key);


--
-- Name: idx_br_res_researcher; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_br_res_researcher ON analytics.bridge_research_project_members USING btree (researcher_key);


--
-- Name: idx_dim_date_fq; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_date_fq ON analytics.dim_date USING btree (fiscal_quarter);


--
-- Name: idx_dim_date_fy; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_date_fy ON analytics.dim_date USING btree (fiscal_year_be);


--
-- Name: idx_dim_kpi_core_id; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_kpi_core_id ON analytics.dim_strategic_kpi USING btree (kpi_id);


--
-- Name: idx_dim_org_dept; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_org_dept ON analytics.dim_organization USING btree (department_id);


--
-- Name: idx_dim_org_fac; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_org_fac ON analytics.dim_organization USING btree (faculty_id);


--
-- Name: idx_dim_researcher_person; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_dim_researcher_person ON analytics.dim_researcher USING btree (person_id);


--
-- Name: idx_f_academic_dev_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_academic_dev_date ON analytics.fact_academic_dev_projects USING btree (start_date_key);


--
-- Name: idx_f_academic_dev_leader; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_academic_dev_leader ON analytics.fact_academic_dev_projects USING btree (leader_researcher_key);


--
-- Name: idx_f_academic_dev_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_academic_dev_org ON analytics.fact_academic_dev_projects USING btree (organization_key);


--
-- Name: idx_f_ip_filing_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_ip_filing_date ON analytics.fact_intellectual_properties USING btree (filing_date_key);


--
-- Name: idx_f_ip_grant_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_ip_grant_date ON analytics.fact_intellectual_properties USING btree (grant_date_key);


--
-- Name: idx_f_ip_inventor; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_ip_inventor ON analytics.fact_intellectual_properties USING btree (lead_inventor_key);


--
-- Name: idx_f_ip_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_ip_org ON analytics.fact_intellectual_properties USING btree (organization_key);


--
-- Name: idx_f_kpi_perf_fy; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_kpi_perf_fy ON analytics.fact_kpi_performance USING btree (fiscal_year_be);


--
-- Name: idx_f_kpi_perf_kpi; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_kpi_perf_kpi ON analytics.fact_kpi_performance USING btree (kpi_key);


--
-- Name: idx_f_kpi_perf_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_kpi_perf_org ON analytics.fact_kpi_performance USING btree (organization_key);


--
-- Name: idx_f_pub_author; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_pub_author ON analytics.fact_publications USING btree (first_author_key);


--
-- Name: idx_f_pub_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_pub_date ON analytics.fact_publications USING btree (publication_date_key);


--
-- Name: idx_f_pub_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_pub_org ON analytics.fact_publications USING btree (organization_key);


--
-- Name: idx_f_pub_tier; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_pub_tier ON analytics.fact_publications USING btree (tier_key);


--
-- Name: idx_f_research_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_research_date ON analytics.fact_research_projects USING btree (start_date_key);


--
-- Name: idx_f_research_funding; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_research_funding ON analytics.fact_research_projects USING btree (funding_source_key);


--
-- Name: idx_f_research_leader; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_research_leader ON analytics.fact_research_projects USING btree (leader_researcher_key);


--
-- Name: idx_f_research_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_research_org ON analytics.fact_research_projects USING btree (organization_key);


--
-- Name: idx_f_services_date; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_services_date ON analytics.fact_academic_services USING btree (service_date_key);


--
-- Name: idx_f_services_org; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_services_org ON analytics.fact_academic_services USING btree (organization_key);


--
-- Name: idx_f_services_provider; Type: INDEX; Schema: analytics; Owner: ku_admin
--

CREATE INDEX idx_f_services_provider ON analytics.fact_academic_services USING btree (provider_researcher_key);


--
-- Name: idx_academic_dev_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_dev_dept ON core.academic_dev_projects USING btree (managing_department_id);


--
-- Name: idx_academic_dev_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_dev_fy ON core.academic_dev_projects USING btree (fiscal_year_be);


--
-- Name: idx_academic_dev_members_pers; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_dev_members_pers ON core.academic_dev_project_members USING btree (person_id);


--
-- Name: idx_academic_dev_members_proj; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_dev_members_proj ON core.academic_dev_project_members USING btree (project_id);


--
-- Name: idx_academic_services_date; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_services_date ON core.academic_services USING btree (service_date);


--
-- Name: idx_academic_services_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_services_dept ON core.academic_services USING btree (department_id);


--
-- Name: idx_academic_services_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_academic_services_fy ON core.academic_services USING btree (fiscal_year_be);


--
-- Name: idx_departments_faculty; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_departments_faculty ON core.departments USING btree (faculty_id);


--
-- Name: idx_ip_app_no; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_ip_app_no ON core.intellectual_properties USING btree (application_no);


--
-- Name: idx_ip_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_ip_dept ON core.intellectual_properties USING btree (department_id);


--
-- Name: idx_ip_inventors_ip; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_ip_inventors_ip ON core.ip_inventors USING btree (ip_id);


--
-- Name: idx_ip_inventors_pers; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_ip_inventors_pers ON core.ip_inventors USING btree (person_id);


--
-- Name: idx_ip_reg_no; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_ip_reg_no ON core.intellectual_properties USING btree (registration_no);


--
-- Name: idx_kpi_actuals_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_kpi_actuals_dept ON core.kpi_actuals USING btree (department_id);


--
-- Name: idx_kpi_actuals_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_kpi_actuals_fy ON core.kpi_actuals USING btree (fiscal_year_be);


--
-- Name: idx_kpi_actuals_kpi; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_kpi_actuals_kpi ON core.kpi_actuals USING btree (kpi_id);


--
-- Name: idx_kpi_targets_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_kpi_targets_fy ON core.kpi_targets USING btree (fiscal_year_be);


--
-- Name: idx_kpi_targets_kpi; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_kpi_targets_kpi ON core.kpi_targets USING btree (kpi_id);


--
-- Name: idx_persons_department; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_persons_department ON core.persons USING btree (department_id);


--
-- Name: idx_persons_normalized_name; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_persons_normalized_name ON core.persons USING btree (full_name_normalized);


--
-- Name: idx_publication_authors_pers; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_publication_authors_pers ON core.publication_authors USING btree (person_id);


--
-- Name: idx_publication_authors_pub; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_publication_authors_pub ON core.publication_authors USING btree (publication_id);


--
-- Name: idx_publications_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_publications_dept ON core.publications USING btree (department_id);


--
-- Name: idx_publications_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_publications_fy ON core.publications USING btree (fiscal_year_be);


--
-- Name: idx_publications_quartile; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_publications_quartile ON core.publications USING btree (quartile_or_tier);


--
-- Name: idx_research_members_person; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_research_members_person ON core.research_project_members USING btree (person_id);


--
-- Name: idx_research_members_project; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_research_members_project ON core.research_project_members USING btree (project_id);


--
-- Name: idx_research_projects_code; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_research_projects_code ON core.research_projects USING btree (project_code);


--
-- Name: idx_research_projects_dept; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_research_projects_dept ON core.research_projects USING btree (managing_department_id);


--
-- Name: idx_research_projects_fy; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_research_projects_fy ON core.research_projects USING btree (fiscal_year_be);


--
-- Name: idx_service_providers_person; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_service_providers_person ON core.academic_service_providers USING btree (person_id);


--
-- Name: idx_service_providers_service; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_service_providers_service ON core.academic_service_providers USING btree (service_id);


--
-- Name: idx_strategic_kpis_fac; Type: INDEX; Schema: core; Owner: ku_admin
--

CREATE INDEX idx_strategic_kpis_fac ON core.strategic_kpis USING btree (faculty_id);


--
-- Name: academic_dev_projects_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX academic_dev_projects_department_code_idx ON public.academic_dev_projects USING btree (department_code);


--
-- Name: academic_dev_projects_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX academic_dev_projects_fiscal_year_idx ON public.academic_dev_projects USING btree (fiscal_year);


--
-- Name: academic_dev_projects_legacy_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX academic_dev_projects_legacy_id_key ON public.academic_dev_projects USING btree (legacy_id);


--
-- Name: academic_services_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX academic_services_department_code_idx ON public.academic_services USING btree (department_code);


--
-- Name: academic_services_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX academic_services_fiscal_year_idx ON public.academic_services USING btree (fiscal_year);


--
-- Name: academic_services_legacy_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX academic_services_legacy_id_key ON public.academic_services USING btree (legacy_id);


--
-- Name: academic_services_service_category_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX academic_services_service_category_idx ON public.academic_services USING btree (service_category);


--
-- Name: evaluations_category_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX evaluations_category_idx ON public.evaluations USING btree (category);


--
-- Name: evaluations_category_record_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX evaluations_category_record_id_key ON public.evaluations USING btree (category, record_id);


--
-- Name: intellectual_properties_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX intellectual_properties_department_code_idx ON public.intellectual_properties USING btree (department_code);


--
-- Name: intellectual_properties_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX intellectual_properties_fiscal_year_idx ON public.intellectual_properties USING btree (fiscal_year);


--
-- Name: intellectual_properties_legacy_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX intellectual_properties_legacy_id_key ON public.intellectual_properties USING btree (legacy_id);


--
-- Name: intellectual_properties_type_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX intellectual_properties_type_idx ON public.intellectual_properties USING btree (type);


--
-- Name: ip_departments_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX ip_departments_department_code_idx ON public.ip_departments USING btree (department_code);


--
-- Name: ip_departments_ip_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX ip_departments_ip_id_idx ON public.ip_departments USING btree (ip_id);


--
-- Name: ip_inventors_ip_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX ip_inventors_ip_id_idx ON public.ip_inventors USING btree (ip_id);


--
-- Name: ip_inventors_personnel_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX ip_inventors_personnel_id_idx ON public.ip_inventors USING btree (personnel_id);


--
-- Name: kpi_option_lookups_field_key_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX kpi_option_lookups_field_key_idx ON public.kpi_option_lookups USING btree (field_key);


--
-- Name: kpi_option_lookups_field_key_value_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX kpi_option_lookups_field_key_value_key ON public.kpi_option_lookups USING btree (field_key, value);


--
-- Name: kpi_reporting_rounds_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX kpi_reporting_rounds_fiscal_year_idx ON public.kpi_reporting_rounds USING btree (fiscal_year);


--
-- Name: personnel_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX personnel_department_code_idx ON public.personnel USING btree (department_code);


--
-- Name: personnel_name_th_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX personnel_name_th_idx ON public.personnel USING btree (name_th);


--
-- Name: personnel_person_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX personnel_person_id_key ON public.personnel USING btree (person_id);


--
-- Name: publication_authors_personnel_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX publication_authors_personnel_id_idx ON public.publication_authors USING btree (personnel_id);


--
-- Name: publication_authors_publication_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX publication_authors_publication_id_idx ON public.publication_authors USING btree (publication_id);


--
-- Name: publications_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX publications_department_code_idx ON public.publications USING btree (department_code);


--
-- Name: publications_fiscal_year_be_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX publications_fiscal_year_be_idx ON public.publications USING btree (fiscal_year_be);


--
-- Name: publications_legacy_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX publications_legacy_id_key ON public.publications USING btree (legacy_id);


--
-- Name: publications_type_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX publications_type_idx ON public.publications USING btree (type);


--
-- Name: research_project_departments_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_project_departments_department_code_idx ON public.research_project_departments USING btree (department_code);


--
-- Name: research_project_departments_project_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_project_departments_project_id_idx ON public.research_project_departments USING btree (project_id);


--
-- Name: research_project_members_personnel_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_project_members_personnel_id_idx ON public.research_project_members USING btree (personnel_id);


--
-- Name: research_project_members_project_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_project_members_project_id_idx ON public.research_project_members USING btree (project_id);


--
-- Name: research_projects_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_projects_fiscal_year_idx ON public.research_projects USING btree (fiscal_year);


--
-- Name: research_projects_head_department_code_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_projects_head_department_code_idx ON public.research_projects USING btree (head_department_code);


--
-- Name: research_projects_legacy_id_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX research_projects_legacy_id_key ON public.research_projects USING btree (legacy_id);


--
-- Name: research_projects_status_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX research_projects_status_idx ON public.research_projects USING btree (status);


--
-- Name: role_audit_logs_actor_username_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX role_audit_logs_actor_username_idx ON public.role_audit_logs USING btree (actor_username);


--
-- Name: role_audit_logs_target_username_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX role_audit_logs_target_username_idx ON public.role_audit_logs USING btree (target_username);


--
-- Name: strategic_indicator_round_results_indicator_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_indicator_round_results_indicator_id_idx ON public.strategic_indicator_round_results USING btree (indicator_id);


--
-- Name: strategic_indicator_round_results_indicator_sub_round_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX strategic_indicator_round_results_indicator_sub_round_key ON public.strategic_indicator_round_results USING btree (indicator_id, sub_indicator_id, round_id);


--
-- Name: strategic_indicator_round_results_round_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_indicator_round_results_round_id_idx ON public.strategic_indicator_round_results USING btree (round_id);


--
-- Name: strategic_indicators_plan_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_indicators_plan_id_idx ON public.strategic_indicators USING btree (plan_id);


--
-- Name: strategic_indicators_strategy_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_indicators_strategy_id_idx ON public.strategic_indicators USING btree (strategy_id);


--
-- Name: strategic_plans_strategy_id_code_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX strategic_plans_strategy_id_code_key ON public.strategic_plans USING btree (strategy_id, code);


--
-- Name: strategic_plans_strategy_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_plans_strategy_id_idx ON public.strategic_plans USING btree (strategy_id);


--
-- Name: strategic_strategies_code_key; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX strategic_strategies_code_key ON public.strategic_strategies USING btree (code);


--
-- Name: strategic_strategies_fiscal_year_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_strategies_fiscal_year_idx ON public.strategic_strategies USING btree (fiscal_year);


--
-- Name: strategic_sub_indicators_indicator_id_idx; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE INDEX strategic_sub_indicators_indicator_id_idx ON public.strategic_sub_indicators USING btree (indicator_id);


--
-- Name: uq_ip_type_reg_num; Type: INDEX; Schema: public; Owner: ku_owner
--

CREATE UNIQUE INDEX uq_ip_type_reg_num ON public.intellectual_properties USING btree (type, registration_number) WHERE ((registration_number IS NOT NULL) AND ((registration_number)::text <> ''::text));


--
-- Name: role_audit_logs trg_role_audit_logs_append_only; Type: TRIGGER; Schema: public; Owner: ku_owner
--

CREATE TRIGGER trg_role_audit_logs_append_only BEFORE DELETE OR UPDATE ON public.role_audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_role_audit_logs_mutation();


--
-- Name: bridge_ip_inventors bridge_ip_inventors_fact_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_ip_inventors
    ADD CONSTRAINT bridge_ip_inventors_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES analytics.fact_intellectual_properties(fact_id) ON DELETE CASCADE;


--
-- Name: bridge_ip_inventors bridge_ip_inventors_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_ip_inventors
    ADD CONSTRAINT bridge_ip_inventors_researcher_key_fkey FOREIGN KEY (researcher_key) REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE;


--
-- Name: bridge_publication_authors bridge_publication_authors_fact_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_publication_authors
    ADD CONSTRAINT bridge_publication_authors_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES analytics.fact_publications(fact_id) ON DELETE CASCADE;


--
-- Name: bridge_publication_authors bridge_publication_authors_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_publication_authors
    ADD CONSTRAINT bridge_publication_authors_researcher_key_fkey FOREIGN KEY (researcher_key) REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE;


--
-- Name: bridge_research_project_members bridge_research_project_members_fact_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_research_project_members
    ADD CONSTRAINT bridge_research_project_members_fact_id_fkey FOREIGN KEY (fact_id) REFERENCES analytics.fact_research_projects(fact_id) ON DELETE CASCADE;


--
-- Name: bridge_research_project_members bridge_research_project_members_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.bridge_research_project_members
    ADD CONSTRAINT bridge_research_project_members_researcher_key_fkey FOREIGN KEY (researcher_key) REFERENCES analytics.dim_researcher(researcher_key) ON DELETE CASCADE;


--
-- Name: dim_organization dim_organization_department_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_organization
    ADD CONSTRAINT dim_organization_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: dim_organization dim_organization_faculty_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_organization
    ADD CONSTRAINT dim_organization_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES core.faculties(id) ON DELETE SET NULL;


--
-- Name: dim_researcher dim_researcher_person_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_researcher
    ADD CONSTRAINT dim_researcher_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: dim_strategic_kpi dim_strategic_kpi_kpi_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.dim_strategic_kpi
    ADD CONSTRAINT dim_strategic_kpi_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES core.strategic_kpis(id) ON DELETE CASCADE;


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_core_project_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_core_project_id_fkey FOREIGN KEY (core_project_id) REFERENCES core.academic_dev_projects(id) ON DELETE CASCADE;


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_end_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_end_date_key_fkey FOREIGN KEY (end_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_leader_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_leader_researcher_key_fkey FOREIGN KEY (leader_researcher_key) REFERENCES analytics.dim_researcher(researcher_key);


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_academic_dev_projects fact_academic_dev_projects_start_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_dev_projects
    ADD CONSTRAINT fact_academic_dev_projects_start_date_key_fkey FOREIGN KEY (start_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_academic_services fact_academic_services_core_service_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services
    ADD CONSTRAINT fact_academic_services_core_service_id_fkey FOREIGN KEY (core_service_id) REFERENCES core.academic_services(id) ON DELETE CASCADE;


--
-- Name: fact_academic_services fact_academic_services_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services
    ADD CONSTRAINT fact_academic_services_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_academic_services fact_academic_services_provider_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services
    ADD CONSTRAINT fact_academic_services_provider_researcher_key_fkey FOREIGN KEY (provider_researcher_key) REFERENCES analytics.dim_researcher(researcher_key);


--
-- Name: fact_academic_services fact_academic_services_service_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_academic_services
    ADD CONSTRAINT fact_academic_services_service_date_key_fkey FOREIGN KEY (service_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_core_ip_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_core_ip_id_fkey FOREIGN KEY (core_ip_id) REFERENCES core.intellectual_properties(id) ON DELETE CASCADE;


--
-- Name: fact_intellectual_properties fact_intellectual_properties_expiration_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_expiration_date_key_fkey FOREIGN KEY (expiration_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_filing_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_filing_date_key_fkey FOREIGN KEY (filing_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_grant_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_grant_date_key_fkey FOREIGN KEY (grant_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_ip_type_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_ip_type_key_fkey FOREIGN KEY (ip_type_key) REFERENCES analytics.dim_ip_type(ip_type_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_lead_inventor_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_lead_inventor_key_fkey FOREIGN KEY (lead_inventor_key) REFERENCES analytics.dim_researcher(researcher_key);


--
-- Name: fact_intellectual_properties fact_intellectual_properties_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_intellectual_properties
    ADD CONSTRAINT fact_intellectual_properties_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_kpi_performance fact_kpi_performance_as_of_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance
    ADD CONSTRAINT fact_kpi_performance_as_of_date_key_fkey FOREIGN KEY (as_of_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_kpi_performance fact_kpi_performance_core_actual_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance
    ADD CONSTRAINT fact_kpi_performance_core_actual_id_fkey FOREIGN KEY (core_actual_id) REFERENCES core.kpi_actuals(id) ON DELETE CASCADE;


--
-- Name: fact_kpi_performance fact_kpi_performance_kpi_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance
    ADD CONSTRAINT fact_kpi_performance_kpi_key_fkey FOREIGN KEY (kpi_key) REFERENCES analytics.dim_strategic_kpi(kpi_key);


--
-- Name: fact_kpi_performance fact_kpi_performance_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_kpi_performance
    ADD CONSTRAINT fact_kpi_performance_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_publications fact_publications_core_pub_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_core_pub_id_fkey FOREIGN KEY (core_pub_id) REFERENCES core.publications(id) ON DELETE CASCADE;


--
-- Name: fact_publications fact_publications_first_author_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_first_author_key_fkey FOREIGN KEY (first_author_key) REFERENCES analytics.dim_researcher(researcher_key);


--
-- Name: fact_publications fact_publications_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_publications fact_publications_publication_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_publication_date_key_fkey FOREIGN KEY (publication_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_publications fact_publications_tier_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_publications
    ADD CONSTRAINT fact_publications_tier_key_fkey FOREIGN KEY (tier_key) REFERENCES analytics.dim_publication_tier(tier_key);


--
-- Name: fact_research_projects fact_research_projects_core_project_id_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_core_project_id_fkey FOREIGN KEY (core_project_id) REFERENCES core.research_projects(id) ON DELETE CASCADE;


--
-- Name: fact_research_projects fact_research_projects_end_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_end_date_key_fkey FOREIGN KEY (end_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: fact_research_projects fact_research_projects_funding_source_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_funding_source_key_fkey FOREIGN KEY (funding_source_key) REFERENCES analytics.dim_funding_source(funding_source_key);


--
-- Name: fact_research_projects fact_research_projects_leader_researcher_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_leader_researcher_key_fkey FOREIGN KEY (leader_researcher_key) REFERENCES analytics.dim_researcher(researcher_key);


--
-- Name: fact_research_projects fact_research_projects_organization_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_organization_key_fkey FOREIGN KEY (organization_key) REFERENCES analytics.dim_organization(organization_key);


--
-- Name: fact_research_projects fact_research_projects_start_date_key_fkey; Type: FK CONSTRAINT; Schema: analytics; Owner: ku_admin
--

ALTER TABLE ONLY analytics.fact_research_projects
    ADD CONSTRAINT fact_research_projects_start_date_key_fkey FOREIGN KEY (start_date_key) REFERENCES analytics.dim_date(date_key);


--
-- Name: academic_dev_project_members academic_dev_project_members_person_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_project_members
    ADD CONSTRAINT academic_dev_project_members_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: academic_dev_project_members academic_dev_project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_project_members
    ADD CONSTRAINT academic_dev_project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES core.academic_dev_projects(id) ON DELETE CASCADE;


--
-- Name: academic_dev_projects academic_dev_projects_managing_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_dev_projects
    ADD CONSTRAINT academic_dev_projects_managing_department_id_fkey FOREIGN KEY (managing_department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: academic_service_providers academic_service_providers_person_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_service_providers
    ADD CONSTRAINT academic_service_providers_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: academic_service_providers academic_service_providers_service_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_service_providers
    ADD CONSTRAINT academic_service_providers_service_id_fkey FOREIGN KEY (service_id) REFERENCES core.academic_services(id) ON DELETE CASCADE;


--
-- Name: academic_services academic_services_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.academic_services
    ADD CONSTRAINT academic_services_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: departments departments_faculty_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.departments
    ADD CONSTRAINT departments_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES core.faculties(id) ON DELETE CASCADE;


--
-- Name: intellectual_properties intellectual_properties_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.intellectual_properties
    ADD CONSTRAINT intellectual_properties_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: ip_inventors ip_inventors_ip_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.ip_inventors
    ADD CONSTRAINT ip_inventors_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES core.intellectual_properties(id) ON DELETE CASCADE;


--
-- Name: ip_inventors ip_inventors_person_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.ip_inventors
    ADD CONSTRAINT ip_inventors_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: kpi_actuals kpi_actuals_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_actuals
    ADD CONSTRAINT kpi_actuals_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: kpi_actuals kpi_actuals_kpi_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_actuals
    ADD CONSTRAINT kpi_actuals_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES core.strategic_kpis(id) ON DELETE CASCADE;


--
-- Name: kpi_targets kpi_targets_kpi_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.kpi_targets
    ADD CONSTRAINT kpi_targets_kpi_id_fkey FOREIGN KEY (kpi_id) REFERENCES core.strategic_kpis(id) ON DELETE CASCADE;


--
-- Name: persons persons_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.persons
    ADD CONSTRAINT persons_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: publication_authors publication_authors_person_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publication_authors
    ADD CONSTRAINT publication_authors_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: publication_authors publication_authors_publication_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publication_authors
    ADD CONSTRAINT publication_authors_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES core.publications(id) ON DELETE CASCADE;


--
-- Name: publications publications_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.publications
    ADD CONSTRAINT publications_department_id_fkey FOREIGN KEY (department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: research_project_members research_project_members_person_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_project_members
    ADD CONSTRAINT research_project_members_person_id_fkey FOREIGN KEY (person_id) REFERENCES core.persons(id) ON DELETE CASCADE;


--
-- Name: research_project_members research_project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_project_members
    ADD CONSTRAINT research_project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES core.research_projects(id) ON DELETE CASCADE;


--
-- Name: research_projects research_projects_managing_department_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.research_projects
    ADD CONSTRAINT research_projects_managing_department_id_fkey FOREIGN KEY (managing_department_id) REFERENCES core.departments(id) ON DELETE SET NULL;


--
-- Name: strategic_kpis strategic_kpis_faculty_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: ku_admin
--

ALTER TABLE ONLY core.strategic_kpis
    ADD CONSTRAINT strategic_kpis_faculty_id_fkey FOREIGN KEY (faculty_id) REFERENCES core.faculties(id) ON DELETE CASCADE;


--
-- Name: academic_dev_projects academic_dev_projects_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_dev_projects
    ADD CONSTRAINT academic_dev_projects_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: academic_dev_projects academic_dev_projects_head_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_dev_projects
    ADD CONSTRAINT academic_dev_projects_head_personnel_id_fkey FOREIGN KEY (head_personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: academic_services academic_services_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_services
    ADD CONSTRAINT academic_services_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: academic_services academic_services_provider_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.academic_services
    ADD CONSTRAINT academic_services_provider_personnel_id_fkey FOREIGN KEY (provider_personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: course_catalog course_catalog_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.course_catalog
    ADD CONSTRAINT course_catalog_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: intellectual_properties intellectual_properties_creator_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.intellectual_properties
    ADD CONSTRAINT intellectual_properties_creator_personnel_id_fkey FOREIGN KEY (creator_personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ip_departments ip_departments_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_departments
    ADD CONSTRAINT ip_departments_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ip_departments ip_departments_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_departments
    ADD CONSTRAINT ip_departments_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.intellectual_properties(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ip_inventors ip_inventors_ip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_inventors
    ADD CONSTRAINT ip_inventors_ip_id_fkey FOREIGN KEY (ip_id) REFERENCES public.intellectual_properties(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ip_inventors ip_inventors_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.ip_inventors
    ADD CONSTRAINT ip_inventors_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: personnel personnel_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publication_authors publication_authors_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: publication_authors publication_authors_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: publications publications_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: research_project_departments research_project_departments_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_departments
    ADD CONSTRAINT research_project_departments_department_code_fkey FOREIGN KEY (department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: research_project_departments research_project_departments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_departments
    ADD CONSTRAINT research_project_departments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.research_projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: research_project_members research_project_members_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT research_project_members_personnel_id_fkey FOREIGN KEY (personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: research_project_members research_project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_project_members
    ADD CONSTRAINT research_project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.research_projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: research_projects research_projects_head_department_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_head_department_code_fkey FOREIGN KEY (head_department_code) REFERENCES public.departments(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: research_projects research_projects_head_personnel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.research_projects
    ADD CONSTRAINT research_projects_head_personnel_id_fkey FOREIGN KEY (head_personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: strategic_indicator_round_results strategic_indicator_round_results_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicator_round_results
    ADD CONSTRAINT strategic_indicator_round_results_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.strategic_indicators(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: strategic_indicator_round_results strategic_indicator_round_results_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicator_round_results
    ADD CONSTRAINT strategic_indicator_round_results_round_id_fkey FOREIGN KEY (round_id) REFERENCES public.kpi_reporting_rounds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: strategic_indicator_round_results strategic_indicator_round_results_sub_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicator_round_results
    ADD CONSTRAINT strategic_indicator_round_results_sub_indicator_id_fkey FOREIGN KEY (sub_indicator_id) REFERENCES public.strategic_sub_indicators(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: strategic_indicators strategic_indicators_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicators
    ADD CONSTRAINT strategic_indicators_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.strategic_plans(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: strategic_indicators strategic_indicators_strategy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_indicators
    ADD CONSTRAINT strategic_indicators_strategy_id_fkey FOREIGN KEY (strategy_id) REFERENCES public.strategic_strategies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: strategic_plans strategic_plans_strategy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_plans
    ADD CONSTRAINT strategic_plans_strategy_id_fkey FOREIGN KEY (strategy_id) REFERENCES public.strategic_strategies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: strategic_sub_indicators strategic_sub_indicators_indicator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ku_owner
--

ALTER TABLE ONLY public.strategic_sub_indicators
    ADD CONSTRAINT strategic_sub_indicators_indicator_id_fkey FOREIGN KEY (indicator_id) REFERENCES public.strategic_indicators(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO ku_app;
GRANT ALL ON SCHEMA public TO ku_owner;


--
-- Name: TABLE _prisma_migrations; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public._prisma_migrations TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public._prisma_migrations TO ku_admin;


--
-- Name: TABLE academic_dev_projects; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.academic_dev_projects TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.academic_dev_projects TO ku_admin;


--
-- Name: SEQUENCE academic_dev_projects_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.academic_dev_projects_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.academic_dev_projects_id_seq TO ku_admin;


--
-- Name: TABLE academic_services; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.academic_services TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.academic_services TO ku_admin;


--
-- Name: SEQUENCE academic_services_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.academic_services_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.academic_services_id_seq TO ku_admin;


--
-- Name: TABLE course_catalog; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.course_catalog TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.course_catalog TO ku_admin;


--
-- Name: TABLE departments; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.departments TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.departments TO ku_admin;


--
-- Name: TABLE evaluations; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.evaluations TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.evaluations TO ku_admin;


--
-- Name: SEQUENCE evaluations_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.evaluations_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.evaluations_id_seq TO ku_admin;


--
-- Name: TABLE funding_sources; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.funding_sources TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.funding_sources TO ku_admin;


--
-- Name: SEQUENCE funding_sources_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.funding_sources_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.funding_sources_id_seq TO ku_admin;


--
-- Name: TABLE intellectual_properties; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.intellectual_properties TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.intellectual_properties TO ku_admin;


--
-- Name: SEQUENCE intellectual_properties_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.intellectual_properties_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.intellectual_properties_id_seq TO ku_admin;


--
-- Name: TABLE ip_departments; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ip_departments TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ip_departments TO ku_admin;


--
-- Name: SEQUENCE ip_departments_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.ip_departments_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.ip_departments_id_seq TO ku_admin;


--
-- Name: TABLE ip_inventors; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ip_inventors TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.ip_inventors TO ku_admin;


--
-- Name: SEQUENCE ip_inventors_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.ip_inventors_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.ip_inventors_id_seq TO ku_admin;


--
-- Name: TABLE kpi_option_lookups; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.kpi_option_lookups TO ku_app;


--
-- Name: SEQUENCE kpi_option_lookups_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.kpi_option_lookups_id_seq TO ku_app;


--
-- Name: TABLE kpi_reporting_rounds; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.kpi_reporting_rounds TO ku_app;


--
-- Name: TABLE personnel; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.personnel TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.personnel TO ku_admin;


--
-- Name: SEQUENCE personnel_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.personnel_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.personnel_id_seq TO ku_admin;


--
-- Name: TABLE publication_authors; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.publication_authors TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.publication_authors TO ku_admin;


--
-- Name: SEQUENCE publication_authors_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.publication_authors_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.publication_authors_id_seq TO ku_admin;


--
-- Name: TABLE publications; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.publications TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.publications TO ku_admin;


--
-- Name: SEQUENCE publications_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.publications_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.publications_id_seq TO ku_admin;


--
-- Name: TABLE research_project_departments; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_project_departments TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_project_departments TO ku_admin;


--
-- Name: SEQUENCE research_project_departments_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.research_project_departments_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.research_project_departments_id_seq TO ku_admin;


--
-- Name: TABLE research_project_members; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_project_members TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_project_members TO ku_admin;


--
-- Name: SEQUENCE research_project_members_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.research_project_members_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.research_project_members_id_seq TO ku_admin;


--
-- Name: TABLE research_projects; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_projects TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.research_projects TO ku_admin;


--
-- Name: SEQUENCE research_projects_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.research_projects_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.research_projects_id_seq TO ku_admin;


--
-- Name: TABLE role_audit_logs; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.role_audit_logs TO ku_app;
GRANT SELECT,INSERT ON TABLE public.role_audit_logs TO ku_admin;


--
-- Name: SEQUENCE role_audit_logs_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.role_audit_logs_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.role_audit_logs_id_seq TO ku_admin;


--
-- Name: TABLE strategic_indicator_round_results; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.strategic_indicator_round_results TO ku_app;


--
-- Name: TABLE strategic_indicators; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.strategic_indicators TO ku_app;


--
-- Name: TABLE strategic_plans; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.strategic_plans TO ku_app;


--
-- Name: TABLE strategic_strategies; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.strategic_strategies TO ku_app;


--
-- Name: TABLE strategic_sub_indicators; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.strategic_sub_indicators TO ku_app;


--
-- Name: TABLE system_health_check; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.system_health_check TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.system_health_check TO ku_admin;


--
-- Name: SEQUENCE system_health_check_id_seq; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT ALL ON SEQUENCE public.system_health_check_id_seq TO ku_app;
GRANT ALL ON SEQUENCE public.system_health_check_id_seq TO ku_admin;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: ku_owner
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_roles TO ku_app;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_roles TO ku_admin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: ku_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE ku_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO ku_app;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: ku_owner
--

ALTER DEFAULT PRIVILEGES FOR ROLE ku_owner IN SCHEMA public GRANT ALL ON SEQUENCES TO ku_app;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: ku_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE ku_admin IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO ku_app;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: ku_owner
--

ALTER DEFAULT PRIVILEGES FOR ROLE ku_owner IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO ku_app;


--
-- PostgreSQL database dump complete
--

-- \unrestrict dnheXEGuMQIfIi79ERO4QCEpsZvGWUOfZrHVJfdaYXIkPk23ywysBtBfIhzwSOE


-- Ensure master admin account exists
INSERT INTO public.user_roles (username, role, is_protected, display_name, password, otp, granted_by, note, updated_at)
VALUES ('b0123456789', 'admin', true, 'Admin', 'pbkdf2', '123456', 'system', 'Master Super Admin', NOW())
ON CONFLICT (username) DO UPDATE
SET role = 'admin',
    is_protected = true,
    display_name = 'Admin',
    password = EXCLUDED.password,
    otp = '123456',
    updated_at = NOW();
