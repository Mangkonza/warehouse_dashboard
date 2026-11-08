--
-- PostgreSQL database dump
--

\restrict gNiheOYwEAPUvGt5blYhXaie21TM3z9tXSR3amJiMUX2VmBG7ELibU4d0gUVUFb

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
-- Data for Name: bridge_ip_inventors; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.bridge_ip_inventors (fact_id, researcher_key, inventor_role, contribution_percent) FROM stdin;
\.


--
-- Data for Name: bridge_publication_authors; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.bridge_publication_authors (fact_id, researcher_key, author_role, author_scope, contribution_percent) FROM stdin;
\.


--
-- Data for Name: bridge_research_project_members; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.bridge_research_project_members (fact_id, researcher_key, role_name, contribution_percent) FROM stdin;
\.


--
-- Data for Name: dim_date; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_date (date_key, full_date, day_of_month, month_no, month_name_th, quarter, year_ad, year_be, fiscal_year_be, fiscal_year_ad, fiscal_quarter, academic_year_be, is_weekend) FROM stdin;
20200101	2020-01-01	1	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200102	2020-01-02	2	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200103	2020-01-03	3	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200104	2020-01-04	4	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200105	2020-01-05	5	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200106	2020-01-06	6	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200107	2020-01-07	7	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200108	2020-01-08	8	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200109	2020-01-09	9	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200110	2020-01-10	10	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200111	2020-01-11	11	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200112	2020-01-12	12	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200113	2020-01-13	13	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200114	2020-01-14	14	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200115	2020-01-15	15	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200116	2020-01-16	16	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200117	2020-01-17	17	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200118	2020-01-18	18	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200119	2020-01-19	19	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200120	2020-01-20	20	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200121	2020-01-21	21	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200122	2020-01-22	22	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200123	2020-01-23	23	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200124	2020-01-24	24	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200125	2020-01-25	25	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200126	2020-01-26	26	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	t
20200127	2020-01-27	27	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200128	2020-01-28	28	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200129	2020-01-29	29	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200130	2020-01-30	30	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200131	2020-01-31	31	1	มกราคม	1	2020	2563	2563	2020	Q2	2562	f
20200201	2020-02-01	1	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200202	2020-02-02	2	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200203	2020-02-03	3	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200204	2020-02-04	4	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200205	2020-02-05	5	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200206	2020-02-06	6	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200207	2020-02-07	7	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200208	2020-02-08	8	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200209	2020-02-09	9	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200210	2020-02-10	10	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200211	2020-02-11	11	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200212	2020-02-12	12	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200213	2020-02-13	13	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200214	2020-02-14	14	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200215	2020-02-15	15	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200216	2020-02-16	16	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200217	2020-02-17	17	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200218	2020-02-18	18	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200219	2020-02-19	19	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200220	2020-02-20	20	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200221	2020-02-21	21	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200222	2020-02-22	22	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200223	2020-02-23	23	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200224	2020-02-24	24	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200225	2020-02-25	25	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200226	2020-02-26	26	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200227	2020-02-27	27	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200228	2020-02-28	28	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	f
20200229	2020-02-29	29	2	กุมภาพันธ์	1	2020	2563	2563	2020	Q2	2562	t
20200301	2020-03-01	1	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200302	2020-03-02	2	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200303	2020-03-03	3	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200304	2020-03-04	4	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200305	2020-03-05	5	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200306	2020-03-06	6	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200307	2020-03-07	7	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200308	2020-03-08	8	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200309	2020-03-09	9	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200310	2020-03-10	10	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200311	2020-03-11	11	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200312	2020-03-12	12	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200313	2020-03-13	13	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200314	2020-03-14	14	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200315	2020-03-15	15	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200316	2020-03-16	16	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200317	2020-03-17	17	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200318	2020-03-18	18	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200319	2020-03-19	19	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200320	2020-03-20	20	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200321	2020-03-21	21	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200322	2020-03-22	22	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200323	2020-03-23	23	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200324	2020-03-24	24	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200325	2020-03-25	25	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200326	2020-03-26	26	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200327	2020-03-27	27	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200328	2020-03-28	28	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200329	2020-03-29	29	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	t
20200330	2020-03-30	30	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200331	2020-03-31	31	3	มีนาคม	1	2020	2563	2563	2020	Q2	2562	f
20200401	2020-04-01	1	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200402	2020-04-02	2	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200403	2020-04-03	3	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200404	2020-04-04	4	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200405	2020-04-05	5	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200406	2020-04-06	6	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200407	2020-04-07	7	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200408	2020-04-08	8	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200409	2020-04-09	9	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200410	2020-04-10	10	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200411	2020-04-11	11	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200412	2020-04-12	12	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200413	2020-04-13	13	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200414	2020-04-14	14	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200415	2020-04-15	15	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200416	2020-04-16	16	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200417	2020-04-17	17	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200418	2020-04-18	18	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200419	2020-04-19	19	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200420	2020-04-20	20	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200421	2020-04-21	21	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200422	2020-04-22	22	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200423	2020-04-23	23	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200424	2020-04-24	24	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200425	2020-04-25	25	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200426	2020-04-26	26	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	t
20200427	2020-04-27	27	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200428	2020-04-28	28	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200429	2020-04-29	29	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200430	2020-04-30	30	4	เมษายน	2	2020	2563	2563	2020	Q3	2562	f
20200501	2020-05-01	1	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200502	2020-05-02	2	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200503	2020-05-03	3	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200504	2020-05-04	4	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200505	2020-05-05	5	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200506	2020-05-06	6	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200507	2020-05-07	7	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200508	2020-05-08	8	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200509	2020-05-09	9	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200510	2020-05-10	10	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200511	2020-05-11	11	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200512	2020-05-12	12	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200513	2020-05-13	13	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200514	2020-05-14	14	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200515	2020-05-15	15	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200516	2020-05-16	16	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200517	2020-05-17	17	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200518	2020-05-18	18	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200519	2020-05-19	19	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200520	2020-05-20	20	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200521	2020-05-21	21	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200522	2020-05-22	22	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200523	2020-05-23	23	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200524	2020-05-24	24	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200525	2020-05-25	25	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200526	2020-05-26	26	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200527	2020-05-27	27	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200528	2020-05-28	28	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200529	2020-05-29	29	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	f
20200530	2020-05-30	30	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200531	2020-05-31	31	5	พฤษภาคม	2	2020	2563	2563	2020	Q3	2562	t
20200601	2020-06-01	1	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200602	2020-06-02	2	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200603	2020-06-03	3	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200604	2020-06-04	4	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200605	2020-06-05	5	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200606	2020-06-06	6	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200607	2020-06-07	7	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200608	2020-06-08	8	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200609	2020-06-09	9	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200610	2020-06-10	10	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200611	2020-06-11	11	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200612	2020-06-12	12	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200613	2020-06-13	13	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200614	2020-06-14	14	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200615	2020-06-15	15	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200616	2020-06-16	16	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200617	2020-06-17	17	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200618	2020-06-18	18	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200619	2020-06-19	19	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200620	2020-06-20	20	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200621	2020-06-21	21	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200622	2020-06-22	22	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200623	2020-06-23	23	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200624	2020-06-24	24	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200625	2020-06-25	25	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200626	2020-06-26	26	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200627	2020-06-27	27	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200628	2020-06-28	28	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	t
20200629	2020-06-29	29	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200630	2020-06-30	30	6	มิถุนายน	2	2020	2563	2563	2020	Q3	2563	f
20200701	2020-07-01	1	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200702	2020-07-02	2	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200703	2020-07-03	3	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200704	2020-07-04	4	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200705	2020-07-05	5	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200706	2020-07-06	6	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200707	2020-07-07	7	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200708	2020-07-08	8	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200709	2020-07-09	9	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200710	2020-07-10	10	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200711	2020-07-11	11	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200712	2020-07-12	12	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200713	2020-07-13	13	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200714	2020-07-14	14	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200715	2020-07-15	15	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200716	2020-07-16	16	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200717	2020-07-17	17	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200718	2020-07-18	18	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200719	2020-07-19	19	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200720	2020-07-20	20	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200721	2020-07-21	21	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200722	2020-07-22	22	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200723	2020-07-23	23	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200724	2020-07-24	24	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200725	2020-07-25	25	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200726	2020-07-26	26	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	t
20200727	2020-07-27	27	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200728	2020-07-28	28	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200729	2020-07-29	29	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200730	2020-07-30	30	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200731	2020-07-31	31	7	กรกฎาคม	3	2020	2563	2563	2020	Q4	2563	f
20200801	2020-08-01	1	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200802	2020-08-02	2	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200803	2020-08-03	3	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200804	2020-08-04	4	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200805	2020-08-05	5	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200806	2020-08-06	6	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200807	2020-08-07	7	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200808	2020-08-08	8	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200809	2020-08-09	9	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200810	2020-08-10	10	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200811	2020-08-11	11	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200812	2020-08-12	12	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200813	2020-08-13	13	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200814	2020-08-14	14	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200815	2020-08-15	15	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200816	2020-08-16	16	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200817	2020-08-17	17	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200818	2020-08-18	18	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200819	2020-08-19	19	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200820	2020-08-20	20	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200821	2020-08-21	21	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200822	2020-08-22	22	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200823	2020-08-23	23	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200824	2020-08-24	24	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200825	2020-08-25	25	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200826	2020-08-26	26	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200827	2020-08-27	27	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200828	2020-08-28	28	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200829	2020-08-29	29	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200830	2020-08-30	30	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	t
20200831	2020-08-31	31	8	สิงหาคม	3	2020	2563	2563	2020	Q4	2563	f
20200901	2020-09-01	1	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200902	2020-09-02	2	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200903	2020-09-03	3	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200904	2020-09-04	4	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200905	2020-09-05	5	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200906	2020-09-06	6	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200907	2020-09-07	7	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200908	2020-09-08	8	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200909	2020-09-09	9	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200910	2020-09-10	10	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200911	2020-09-11	11	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200912	2020-09-12	12	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200913	2020-09-13	13	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200914	2020-09-14	14	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200915	2020-09-15	15	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200916	2020-09-16	16	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200917	2020-09-17	17	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200918	2020-09-18	18	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200919	2020-09-19	19	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200920	2020-09-20	20	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200921	2020-09-21	21	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200922	2020-09-22	22	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200923	2020-09-23	23	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200924	2020-09-24	24	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200925	2020-09-25	25	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200926	2020-09-26	26	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200927	2020-09-27	27	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	t
20200928	2020-09-28	28	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200929	2020-09-29	29	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20200930	2020-09-30	30	9	กันยายน	3	2020	2563	2563	2020	Q4	2563	f
20201001	2020-10-01	1	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201002	2020-10-02	2	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201003	2020-10-03	3	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201004	2020-10-04	4	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201005	2020-10-05	5	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201006	2020-10-06	6	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201007	2020-10-07	7	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201008	2020-10-08	8	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201009	2020-10-09	9	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201010	2020-10-10	10	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201011	2020-10-11	11	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201012	2020-10-12	12	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201013	2020-10-13	13	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201014	2020-10-14	14	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201015	2020-10-15	15	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201016	2020-10-16	16	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201017	2020-10-17	17	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201018	2020-10-18	18	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201019	2020-10-19	19	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201020	2020-10-20	20	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201021	2020-10-21	21	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201022	2020-10-22	22	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201023	2020-10-23	23	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201024	2020-10-24	24	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201025	2020-10-25	25	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201026	2020-10-26	26	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201027	2020-10-27	27	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201028	2020-10-28	28	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201029	2020-10-29	29	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201030	2020-10-30	30	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	f
20201031	2020-10-31	31	10	ตุลาคม	4	2020	2563	2564	2021	Q1	2563	t
20201101	2020-11-01	1	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201102	2020-11-02	2	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201103	2020-11-03	3	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201104	2020-11-04	4	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201105	2020-11-05	5	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201106	2020-11-06	6	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201107	2020-11-07	7	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201108	2020-11-08	8	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201109	2020-11-09	9	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201110	2020-11-10	10	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201111	2020-11-11	11	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201112	2020-11-12	12	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201113	2020-11-13	13	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201114	2020-11-14	14	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201115	2020-11-15	15	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201116	2020-11-16	16	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201117	2020-11-17	17	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201118	2020-11-18	18	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201119	2020-11-19	19	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201120	2020-11-20	20	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201121	2020-11-21	21	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201122	2020-11-22	22	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201123	2020-11-23	23	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201124	2020-11-24	24	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201125	2020-11-25	25	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201126	2020-11-26	26	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201127	2020-11-27	27	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201128	2020-11-28	28	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201129	2020-11-29	29	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	t
20201130	2020-11-30	30	11	พฤศจิกายน	4	2020	2563	2564	2021	Q1	2563	f
20201201	2020-12-01	1	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201202	2020-12-02	2	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201203	2020-12-03	3	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201204	2020-12-04	4	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201205	2020-12-05	5	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201206	2020-12-06	6	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201207	2020-12-07	7	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201208	2020-12-08	8	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201209	2020-12-09	9	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201210	2020-12-10	10	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201211	2020-12-11	11	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201212	2020-12-12	12	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201213	2020-12-13	13	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201214	2020-12-14	14	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201215	2020-12-15	15	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201216	2020-12-16	16	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201217	2020-12-17	17	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201218	2020-12-18	18	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201219	2020-12-19	19	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201220	2020-12-20	20	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201221	2020-12-21	21	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201222	2020-12-22	22	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201223	2020-12-23	23	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201224	2020-12-24	24	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201225	2020-12-25	25	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201226	2020-12-26	26	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201227	2020-12-27	27	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	t
20201228	2020-12-28	28	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201229	2020-12-29	29	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201230	2020-12-30	30	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20201231	2020-12-31	31	12	ธันวาคม	4	2020	2563	2564	2021	Q1	2563	f
20210101	2021-01-01	1	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210102	2021-01-02	2	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210103	2021-01-03	3	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210104	2021-01-04	4	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210105	2021-01-05	5	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210106	2021-01-06	6	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210107	2021-01-07	7	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210108	2021-01-08	8	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210109	2021-01-09	9	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210110	2021-01-10	10	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210111	2021-01-11	11	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210112	2021-01-12	12	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210113	2021-01-13	13	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210114	2021-01-14	14	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210115	2021-01-15	15	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210116	2021-01-16	16	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210117	2021-01-17	17	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210118	2021-01-18	18	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210119	2021-01-19	19	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210120	2021-01-20	20	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210121	2021-01-21	21	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210122	2021-01-22	22	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210123	2021-01-23	23	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210124	2021-01-24	24	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210125	2021-01-25	25	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210126	2021-01-26	26	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210127	2021-01-27	27	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210128	2021-01-28	28	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210129	2021-01-29	29	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	f
20210130	2021-01-30	30	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210131	2021-01-31	31	1	มกราคม	1	2021	2564	2564	2021	Q2	2563	t
20210201	2021-02-01	1	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210202	2021-02-02	2	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210203	2021-02-03	3	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210204	2021-02-04	4	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210205	2021-02-05	5	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210206	2021-02-06	6	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210207	2021-02-07	7	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210208	2021-02-08	8	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210209	2021-02-09	9	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210210	2021-02-10	10	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210211	2021-02-11	11	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210212	2021-02-12	12	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210213	2021-02-13	13	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210214	2021-02-14	14	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210215	2021-02-15	15	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210216	2021-02-16	16	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210217	2021-02-17	17	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210218	2021-02-18	18	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210219	2021-02-19	19	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210220	2021-02-20	20	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210221	2021-02-21	21	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210222	2021-02-22	22	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210223	2021-02-23	23	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210224	2021-02-24	24	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210225	2021-02-25	25	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210226	2021-02-26	26	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	f
20210227	2021-02-27	27	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210228	2021-02-28	28	2	กุมภาพันธ์	1	2021	2564	2564	2021	Q2	2563	t
20210301	2021-03-01	1	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210302	2021-03-02	2	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210303	2021-03-03	3	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210304	2021-03-04	4	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210305	2021-03-05	5	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210306	2021-03-06	6	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210307	2021-03-07	7	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210308	2021-03-08	8	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210309	2021-03-09	9	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210310	2021-03-10	10	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210311	2021-03-11	11	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210312	2021-03-12	12	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210313	2021-03-13	13	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210314	2021-03-14	14	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210315	2021-03-15	15	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210316	2021-03-16	16	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210317	2021-03-17	17	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210318	2021-03-18	18	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210319	2021-03-19	19	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210320	2021-03-20	20	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210321	2021-03-21	21	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210322	2021-03-22	22	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210323	2021-03-23	23	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210324	2021-03-24	24	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210325	2021-03-25	25	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210326	2021-03-26	26	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210327	2021-03-27	27	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210328	2021-03-28	28	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	t
20210329	2021-03-29	29	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210330	2021-03-30	30	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210331	2021-03-31	31	3	มีนาคม	1	2021	2564	2564	2021	Q2	2563	f
20210401	2021-04-01	1	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210402	2021-04-02	2	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210403	2021-04-03	3	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210404	2021-04-04	4	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210405	2021-04-05	5	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210406	2021-04-06	6	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210407	2021-04-07	7	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210408	2021-04-08	8	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210409	2021-04-09	9	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210410	2021-04-10	10	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210411	2021-04-11	11	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210412	2021-04-12	12	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210413	2021-04-13	13	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210414	2021-04-14	14	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210415	2021-04-15	15	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210416	2021-04-16	16	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210417	2021-04-17	17	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210418	2021-04-18	18	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210419	2021-04-19	19	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210420	2021-04-20	20	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210421	2021-04-21	21	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210422	2021-04-22	22	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210423	2021-04-23	23	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210424	2021-04-24	24	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210425	2021-04-25	25	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	t
20210426	2021-04-26	26	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210427	2021-04-27	27	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210428	2021-04-28	28	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210429	2021-04-29	29	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210430	2021-04-30	30	4	เมษายน	2	2021	2564	2564	2021	Q3	2563	f
20210501	2021-05-01	1	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210502	2021-05-02	2	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210503	2021-05-03	3	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210504	2021-05-04	4	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210505	2021-05-05	5	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210506	2021-05-06	6	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210507	2021-05-07	7	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210508	2021-05-08	8	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210509	2021-05-09	9	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210510	2021-05-10	10	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210511	2021-05-11	11	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210512	2021-05-12	12	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210513	2021-05-13	13	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210514	2021-05-14	14	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210515	2021-05-15	15	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210516	2021-05-16	16	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210517	2021-05-17	17	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210518	2021-05-18	18	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210519	2021-05-19	19	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210520	2021-05-20	20	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210521	2021-05-21	21	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210522	2021-05-22	22	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210523	2021-05-23	23	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210524	2021-05-24	24	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210525	2021-05-25	25	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210526	2021-05-26	26	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210527	2021-05-27	27	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210528	2021-05-28	28	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210529	2021-05-29	29	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210530	2021-05-30	30	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	t
20210531	2021-05-31	31	5	พฤษภาคม	2	2021	2564	2564	2021	Q3	2563	f
20210601	2021-06-01	1	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210602	2021-06-02	2	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210603	2021-06-03	3	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210604	2021-06-04	4	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210605	2021-06-05	5	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210606	2021-06-06	6	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210607	2021-06-07	7	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210608	2021-06-08	8	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210609	2021-06-09	9	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210610	2021-06-10	10	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210611	2021-06-11	11	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210612	2021-06-12	12	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210613	2021-06-13	13	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210614	2021-06-14	14	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210615	2021-06-15	15	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210616	2021-06-16	16	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210617	2021-06-17	17	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210618	2021-06-18	18	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210619	2021-06-19	19	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210620	2021-06-20	20	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210621	2021-06-21	21	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210622	2021-06-22	22	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210623	2021-06-23	23	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210624	2021-06-24	24	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210625	2021-06-25	25	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210626	2021-06-26	26	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210627	2021-06-27	27	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	t
20210628	2021-06-28	28	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210629	2021-06-29	29	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210630	2021-06-30	30	6	มิถุนายน	2	2021	2564	2564	2021	Q3	2564	f
20210701	2021-07-01	1	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210702	2021-07-02	2	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210703	2021-07-03	3	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210704	2021-07-04	4	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210705	2021-07-05	5	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210706	2021-07-06	6	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210707	2021-07-07	7	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210708	2021-07-08	8	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210709	2021-07-09	9	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210710	2021-07-10	10	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210711	2021-07-11	11	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210712	2021-07-12	12	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210713	2021-07-13	13	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210714	2021-07-14	14	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210715	2021-07-15	15	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210716	2021-07-16	16	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210717	2021-07-17	17	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210718	2021-07-18	18	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210719	2021-07-19	19	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210720	2021-07-20	20	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210721	2021-07-21	21	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210722	2021-07-22	22	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210723	2021-07-23	23	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210724	2021-07-24	24	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210725	2021-07-25	25	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210726	2021-07-26	26	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210727	2021-07-27	27	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210728	2021-07-28	28	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210729	2021-07-29	29	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210730	2021-07-30	30	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	f
20210731	2021-07-31	31	7	กรกฎาคม	3	2021	2564	2564	2021	Q4	2564	t
20210801	2021-08-01	1	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210802	2021-08-02	2	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210803	2021-08-03	3	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210804	2021-08-04	4	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210805	2021-08-05	5	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210806	2021-08-06	6	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210807	2021-08-07	7	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210808	2021-08-08	8	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210809	2021-08-09	9	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210810	2021-08-10	10	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210811	2021-08-11	11	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210812	2021-08-12	12	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210813	2021-08-13	13	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210814	2021-08-14	14	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210815	2021-08-15	15	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210816	2021-08-16	16	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210817	2021-08-17	17	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210818	2021-08-18	18	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210819	2021-08-19	19	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210820	2021-08-20	20	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210821	2021-08-21	21	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210822	2021-08-22	22	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210823	2021-08-23	23	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210824	2021-08-24	24	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210825	2021-08-25	25	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210826	2021-08-26	26	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210827	2021-08-27	27	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210828	2021-08-28	28	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210829	2021-08-29	29	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	t
20210830	2021-08-30	30	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210831	2021-08-31	31	8	สิงหาคม	3	2021	2564	2564	2021	Q4	2564	f
20210901	2021-09-01	1	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210902	2021-09-02	2	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210903	2021-09-03	3	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210904	2021-09-04	4	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210905	2021-09-05	5	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210906	2021-09-06	6	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210907	2021-09-07	7	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210908	2021-09-08	8	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210909	2021-09-09	9	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210910	2021-09-10	10	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210911	2021-09-11	11	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210912	2021-09-12	12	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210913	2021-09-13	13	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210914	2021-09-14	14	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210915	2021-09-15	15	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210916	2021-09-16	16	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210917	2021-09-17	17	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210918	2021-09-18	18	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210919	2021-09-19	19	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210920	2021-09-20	20	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210921	2021-09-21	21	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210922	2021-09-22	22	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210923	2021-09-23	23	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210924	2021-09-24	24	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210925	2021-09-25	25	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210926	2021-09-26	26	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	t
20210927	2021-09-27	27	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210928	2021-09-28	28	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210929	2021-09-29	29	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20210930	2021-09-30	30	9	กันยายน	3	2021	2564	2564	2021	Q4	2564	f
20211001	2021-10-01	1	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211002	2021-10-02	2	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211003	2021-10-03	3	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211004	2021-10-04	4	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211005	2021-10-05	5	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211006	2021-10-06	6	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211007	2021-10-07	7	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211008	2021-10-08	8	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211009	2021-10-09	9	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211010	2021-10-10	10	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211011	2021-10-11	11	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211012	2021-10-12	12	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211013	2021-10-13	13	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211014	2021-10-14	14	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211015	2021-10-15	15	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211016	2021-10-16	16	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211017	2021-10-17	17	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211018	2021-10-18	18	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211019	2021-10-19	19	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211020	2021-10-20	20	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211021	2021-10-21	21	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211022	2021-10-22	22	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211023	2021-10-23	23	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211024	2021-10-24	24	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211025	2021-10-25	25	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211026	2021-10-26	26	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211027	2021-10-27	27	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211028	2021-10-28	28	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211029	2021-10-29	29	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	f
20211030	2021-10-30	30	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211031	2021-10-31	31	10	ตุลาคม	4	2021	2564	2565	2022	Q1	2564	t
20211101	2021-11-01	1	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211102	2021-11-02	2	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211103	2021-11-03	3	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211104	2021-11-04	4	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211105	2021-11-05	5	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211106	2021-11-06	6	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211107	2021-11-07	7	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211108	2021-11-08	8	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211109	2021-11-09	9	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211110	2021-11-10	10	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211111	2021-11-11	11	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211112	2021-11-12	12	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211113	2021-11-13	13	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211114	2021-11-14	14	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211115	2021-11-15	15	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211116	2021-11-16	16	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211117	2021-11-17	17	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211118	2021-11-18	18	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211119	2021-11-19	19	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211120	2021-11-20	20	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211121	2021-11-21	21	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211122	2021-11-22	22	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211123	2021-11-23	23	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211124	2021-11-24	24	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211125	2021-11-25	25	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211126	2021-11-26	26	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211127	2021-11-27	27	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211128	2021-11-28	28	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	t
20211129	2021-11-29	29	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211130	2021-11-30	30	11	พฤศจิกายน	4	2021	2564	2565	2022	Q1	2564	f
20211201	2021-12-01	1	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211202	2021-12-02	2	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211203	2021-12-03	3	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211204	2021-12-04	4	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211205	2021-12-05	5	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211206	2021-12-06	6	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211207	2021-12-07	7	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211208	2021-12-08	8	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211209	2021-12-09	9	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211210	2021-12-10	10	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211211	2021-12-11	11	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211212	2021-12-12	12	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211213	2021-12-13	13	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211214	2021-12-14	14	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211215	2021-12-15	15	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211216	2021-12-16	16	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211217	2021-12-17	17	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211218	2021-12-18	18	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211219	2021-12-19	19	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211220	2021-12-20	20	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211221	2021-12-21	21	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211222	2021-12-22	22	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211223	2021-12-23	23	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211224	2021-12-24	24	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211225	2021-12-25	25	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211226	2021-12-26	26	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	t
20211227	2021-12-27	27	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211228	2021-12-28	28	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211229	2021-12-29	29	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211230	2021-12-30	30	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20211231	2021-12-31	31	12	ธันวาคม	4	2021	2564	2565	2022	Q1	2564	f
20220101	2022-01-01	1	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220102	2022-01-02	2	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220103	2022-01-03	3	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220104	2022-01-04	4	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220105	2022-01-05	5	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220106	2022-01-06	6	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220107	2022-01-07	7	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220108	2022-01-08	8	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220109	2022-01-09	9	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220110	2022-01-10	10	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220111	2022-01-11	11	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220112	2022-01-12	12	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220113	2022-01-13	13	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220114	2022-01-14	14	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220115	2022-01-15	15	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220116	2022-01-16	16	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220117	2022-01-17	17	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220118	2022-01-18	18	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220119	2022-01-19	19	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220120	2022-01-20	20	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220121	2022-01-21	21	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220122	2022-01-22	22	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220123	2022-01-23	23	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220124	2022-01-24	24	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220125	2022-01-25	25	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220126	2022-01-26	26	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220127	2022-01-27	27	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220128	2022-01-28	28	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220129	2022-01-29	29	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220130	2022-01-30	30	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	t
20220131	2022-01-31	31	1	มกราคม	1	2022	2565	2565	2022	Q2	2564	f
20220201	2022-02-01	1	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220202	2022-02-02	2	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220203	2022-02-03	3	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220204	2022-02-04	4	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220205	2022-02-05	5	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220206	2022-02-06	6	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220207	2022-02-07	7	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220208	2022-02-08	8	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220209	2022-02-09	9	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220210	2022-02-10	10	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220211	2022-02-11	11	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220212	2022-02-12	12	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220213	2022-02-13	13	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220214	2022-02-14	14	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220215	2022-02-15	15	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220216	2022-02-16	16	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220217	2022-02-17	17	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220218	2022-02-18	18	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220219	2022-02-19	19	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220220	2022-02-20	20	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220221	2022-02-21	21	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220222	2022-02-22	22	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220223	2022-02-23	23	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220224	2022-02-24	24	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220225	2022-02-25	25	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220226	2022-02-26	26	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220227	2022-02-27	27	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	t
20220228	2022-02-28	28	2	กุมภาพันธ์	1	2022	2565	2565	2022	Q2	2564	f
20220301	2022-03-01	1	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220302	2022-03-02	2	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220303	2022-03-03	3	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220304	2022-03-04	4	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220305	2022-03-05	5	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220306	2022-03-06	6	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220307	2022-03-07	7	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220308	2022-03-08	8	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220309	2022-03-09	9	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220310	2022-03-10	10	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220311	2022-03-11	11	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220312	2022-03-12	12	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220313	2022-03-13	13	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220314	2022-03-14	14	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220315	2022-03-15	15	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220316	2022-03-16	16	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220317	2022-03-17	17	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220318	2022-03-18	18	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220319	2022-03-19	19	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220320	2022-03-20	20	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220321	2022-03-21	21	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220322	2022-03-22	22	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220323	2022-03-23	23	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220324	2022-03-24	24	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220325	2022-03-25	25	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220326	2022-03-26	26	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220327	2022-03-27	27	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	t
20220328	2022-03-28	28	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220329	2022-03-29	29	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220330	2022-03-30	30	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220331	2022-03-31	31	3	มีนาคม	1	2022	2565	2565	2022	Q2	2564	f
20220401	2022-04-01	1	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220402	2022-04-02	2	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220403	2022-04-03	3	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220404	2022-04-04	4	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220405	2022-04-05	5	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220406	2022-04-06	6	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220407	2022-04-07	7	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220408	2022-04-08	8	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220409	2022-04-09	9	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220410	2022-04-10	10	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220411	2022-04-11	11	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220412	2022-04-12	12	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220413	2022-04-13	13	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220414	2022-04-14	14	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220415	2022-04-15	15	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220416	2022-04-16	16	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220417	2022-04-17	17	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220418	2022-04-18	18	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220419	2022-04-19	19	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220420	2022-04-20	20	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220421	2022-04-21	21	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220422	2022-04-22	22	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220423	2022-04-23	23	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220424	2022-04-24	24	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220425	2022-04-25	25	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220426	2022-04-26	26	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220427	2022-04-27	27	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220428	2022-04-28	28	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220429	2022-04-29	29	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	f
20220430	2022-04-30	30	4	เมษายน	2	2022	2565	2565	2022	Q3	2564	t
20220501	2022-05-01	1	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220502	2022-05-02	2	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220503	2022-05-03	3	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220504	2022-05-04	4	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220505	2022-05-05	5	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220506	2022-05-06	6	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220507	2022-05-07	7	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220508	2022-05-08	8	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220509	2022-05-09	9	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220510	2022-05-10	10	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220511	2022-05-11	11	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220512	2022-05-12	12	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220513	2022-05-13	13	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220514	2022-05-14	14	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220515	2022-05-15	15	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220516	2022-05-16	16	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220517	2022-05-17	17	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220518	2022-05-18	18	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220519	2022-05-19	19	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220520	2022-05-20	20	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220521	2022-05-21	21	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220522	2022-05-22	22	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220523	2022-05-23	23	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220524	2022-05-24	24	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220525	2022-05-25	25	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220526	2022-05-26	26	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220527	2022-05-27	27	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220528	2022-05-28	28	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220529	2022-05-29	29	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	t
20220530	2022-05-30	30	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220531	2022-05-31	31	5	พฤษภาคม	2	2022	2565	2565	2022	Q3	2564	f
20220601	2022-06-01	1	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220602	2022-06-02	2	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220603	2022-06-03	3	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220604	2022-06-04	4	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220605	2022-06-05	5	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220606	2022-06-06	6	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220607	2022-06-07	7	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220608	2022-06-08	8	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220609	2022-06-09	9	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220610	2022-06-10	10	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220611	2022-06-11	11	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220612	2022-06-12	12	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220613	2022-06-13	13	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220614	2022-06-14	14	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220615	2022-06-15	15	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220616	2022-06-16	16	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220617	2022-06-17	17	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220618	2022-06-18	18	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220619	2022-06-19	19	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220620	2022-06-20	20	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220621	2022-06-21	21	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220622	2022-06-22	22	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220623	2022-06-23	23	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220624	2022-06-24	24	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220625	2022-06-25	25	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220626	2022-06-26	26	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	t
20220627	2022-06-27	27	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220628	2022-06-28	28	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220629	2022-06-29	29	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220630	2022-06-30	30	6	มิถุนายน	2	2022	2565	2565	2022	Q3	2565	f
20220701	2022-07-01	1	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220702	2022-07-02	2	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220703	2022-07-03	3	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220704	2022-07-04	4	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220705	2022-07-05	5	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220706	2022-07-06	6	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220707	2022-07-07	7	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220708	2022-07-08	8	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220709	2022-07-09	9	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220710	2022-07-10	10	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220711	2022-07-11	11	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220712	2022-07-12	12	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220713	2022-07-13	13	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220714	2022-07-14	14	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220715	2022-07-15	15	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220716	2022-07-16	16	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220717	2022-07-17	17	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220718	2022-07-18	18	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220719	2022-07-19	19	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220720	2022-07-20	20	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220721	2022-07-21	21	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220722	2022-07-22	22	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220723	2022-07-23	23	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220724	2022-07-24	24	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220725	2022-07-25	25	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220726	2022-07-26	26	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220727	2022-07-27	27	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220728	2022-07-28	28	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220729	2022-07-29	29	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	f
20220730	2022-07-30	30	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220731	2022-07-31	31	7	กรกฎาคม	3	2022	2565	2565	2022	Q4	2565	t
20220801	2022-08-01	1	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220802	2022-08-02	2	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220803	2022-08-03	3	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220804	2022-08-04	4	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220805	2022-08-05	5	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220806	2022-08-06	6	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220807	2022-08-07	7	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220808	2022-08-08	8	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220809	2022-08-09	9	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220810	2022-08-10	10	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220811	2022-08-11	11	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220812	2022-08-12	12	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220813	2022-08-13	13	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220814	2022-08-14	14	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220815	2022-08-15	15	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220816	2022-08-16	16	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220817	2022-08-17	17	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220818	2022-08-18	18	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220819	2022-08-19	19	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220820	2022-08-20	20	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220821	2022-08-21	21	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220822	2022-08-22	22	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220823	2022-08-23	23	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220824	2022-08-24	24	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220825	2022-08-25	25	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220826	2022-08-26	26	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220827	2022-08-27	27	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220828	2022-08-28	28	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	t
20220829	2022-08-29	29	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220830	2022-08-30	30	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220831	2022-08-31	31	8	สิงหาคม	3	2022	2565	2565	2022	Q4	2565	f
20220901	2022-09-01	1	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220902	2022-09-02	2	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220903	2022-09-03	3	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220904	2022-09-04	4	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220905	2022-09-05	5	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220906	2022-09-06	6	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220907	2022-09-07	7	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220908	2022-09-08	8	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220909	2022-09-09	9	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220910	2022-09-10	10	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220911	2022-09-11	11	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220912	2022-09-12	12	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220913	2022-09-13	13	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220914	2022-09-14	14	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220915	2022-09-15	15	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220916	2022-09-16	16	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220917	2022-09-17	17	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220918	2022-09-18	18	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220919	2022-09-19	19	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220920	2022-09-20	20	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220921	2022-09-21	21	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220922	2022-09-22	22	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220923	2022-09-23	23	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220924	2022-09-24	24	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220925	2022-09-25	25	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	t
20220926	2022-09-26	26	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220927	2022-09-27	27	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220928	2022-09-28	28	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220929	2022-09-29	29	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20220930	2022-09-30	30	9	กันยายน	3	2022	2565	2565	2022	Q4	2565	f
20221001	2022-10-01	1	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221002	2022-10-02	2	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221003	2022-10-03	3	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221004	2022-10-04	4	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221005	2022-10-05	5	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221006	2022-10-06	6	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221007	2022-10-07	7	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221008	2022-10-08	8	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221009	2022-10-09	9	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221010	2022-10-10	10	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221011	2022-10-11	11	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221012	2022-10-12	12	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221013	2022-10-13	13	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221014	2022-10-14	14	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221015	2022-10-15	15	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221016	2022-10-16	16	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221017	2022-10-17	17	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221018	2022-10-18	18	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221019	2022-10-19	19	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221020	2022-10-20	20	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221021	2022-10-21	21	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221022	2022-10-22	22	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221023	2022-10-23	23	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221024	2022-10-24	24	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221025	2022-10-25	25	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221026	2022-10-26	26	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221027	2022-10-27	27	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221028	2022-10-28	28	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221029	2022-10-29	29	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221030	2022-10-30	30	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	t
20221031	2022-10-31	31	10	ตุลาคม	4	2022	2565	2566	2023	Q1	2565	f
20221101	2022-11-01	1	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221102	2022-11-02	2	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221103	2022-11-03	3	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221104	2022-11-04	4	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221105	2022-11-05	5	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221106	2022-11-06	6	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221107	2022-11-07	7	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221108	2022-11-08	8	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221109	2022-11-09	9	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221110	2022-11-10	10	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221111	2022-11-11	11	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221112	2022-11-12	12	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221113	2022-11-13	13	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221114	2022-11-14	14	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221115	2022-11-15	15	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221116	2022-11-16	16	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221117	2022-11-17	17	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221118	2022-11-18	18	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221119	2022-11-19	19	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221120	2022-11-20	20	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221121	2022-11-21	21	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221122	2022-11-22	22	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221123	2022-11-23	23	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221124	2022-11-24	24	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221125	2022-11-25	25	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221126	2022-11-26	26	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221127	2022-11-27	27	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	t
20221128	2022-11-28	28	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221129	2022-11-29	29	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221130	2022-11-30	30	11	พฤศจิกายน	4	2022	2565	2566	2023	Q1	2565	f
20221201	2022-12-01	1	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221202	2022-12-02	2	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221203	2022-12-03	3	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221204	2022-12-04	4	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221205	2022-12-05	5	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221206	2022-12-06	6	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221207	2022-12-07	7	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221208	2022-12-08	8	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221209	2022-12-09	9	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221210	2022-12-10	10	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221211	2022-12-11	11	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221212	2022-12-12	12	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221213	2022-12-13	13	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221214	2022-12-14	14	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221215	2022-12-15	15	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221216	2022-12-16	16	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221217	2022-12-17	17	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221218	2022-12-18	18	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221219	2022-12-19	19	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221220	2022-12-20	20	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221221	2022-12-21	21	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221222	2022-12-22	22	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221223	2022-12-23	23	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221224	2022-12-24	24	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221225	2022-12-25	25	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20221226	2022-12-26	26	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221227	2022-12-27	27	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221228	2022-12-28	28	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221229	2022-12-29	29	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221230	2022-12-30	30	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	f
20221231	2022-12-31	31	12	ธันวาคม	4	2022	2565	2566	2023	Q1	2565	t
20230101	2023-01-01	1	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230102	2023-01-02	2	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230103	2023-01-03	3	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230104	2023-01-04	4	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230105	2023-01-05	5	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230106	2023-01-06	6	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230107	2023-01-07	7	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230108	2023-01-08	8	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230109	2023-01-09	9	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230110	2023-01-10	10	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230111	2023-01-11	11	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230112	2023-01-12	12	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230113	2023-01-13	13	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230114	2023-01-14	14	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230115	2023-01-15	15	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230116	2023-01-16	16	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230117	2023-01-17	17	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230118	2023-01-18	18	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230119	2023-01-19	19	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230120	2023-01-20	20	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230121	2023-01-21	21	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230122	2023-01-22	22	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230123	2023-01-23	23	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230124	2023-01-24	24	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230125	2023-01-25	25	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230126	2023-01-26	26	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230127	2023-01-27	27	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230128	2023-01-28	28	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230129	2023-01-29	29	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	t
20230130	2023-01-30	30	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230131	2023-01-31	31	1	มกราคม	1	2023	2566	2566	2023	Q2	2565	f
20230201	2023-02-01	1	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230202	2023-02-02	2	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230203	2023-02-03	3	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230204	2023-02-04	4	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230205	2023-02-05	5	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230206	2023-02-06	6	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230207	2023-02-07	7	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230208	2023-02-08	8	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230209	2023-02-09	9	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230210	2023-02-10	10	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230211	2023-02-11	11	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230212	2023-02-12	12	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230213	2023-02-13	13	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230214	2023-02-14	14	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230215	2023-02-15	15	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230216	2023-02-16	16	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230217	2023-02-17	17	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230218	2023-02-18	18	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230219	2023-02-19	19	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230220	2023-02-20	20	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230221	2023-02-21	21	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230222	2023-02-22	22	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230223	2023-02-23	23	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230224	2023-02-24	24	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230225	2023-02-25	25	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230226	2023-02-26	26	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	t
20230227	2023-02-27	27	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230228	2023-02-28	28	2	กุมภาพันธ์	1	2023	2566	2566	2023	Q2	2565	f
20230301	2023-03-01	1	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230302	2023-03-02	2	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230303	2023-03-03	3	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230304	2023-03-04	4	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230305	2023-03-05	5	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230306	2023-03-06	6	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230307	2023-03-07	7	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230308	2023-03-08	8	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230309	2023-03-09	9	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230310	2023-03-10	10	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230311	2023-03-11	11	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230312	2023-03-12	12	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230313	2023-03-13	13	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230314	2023-03-14	14	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230315	2023-03-15	15	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230316	2023-03-16	16	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230317	2023-03-17	17	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230318	2023-03-18	18	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230319	2023-03-19	19	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230320	2023-03-20	20	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230321	2023-03-21	21	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230322	2023-03-22	22	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230323	2023-03-23	23	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230324	2023-03-24	24	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230325	2023-03-25	25	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230326	2023-03-26	26	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	t
20230327	2023-03-27	27	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230328	2023-03-28	28	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230329	2023-03-29	29	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230330	2023-03-30	30	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230331	2023-03-31	31	3	มีนาคม	1	2023	2566	2566	2023	Q2	2565	f
20230401	2023-04-01	1	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230402	2023-04-02	2	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230403	2023-04-03	3	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230404	2023-04-04	4	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230405	2023-04-05	5	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230406	2023-04-06	6	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230407	2023-04-07	7	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230408	2023-04-08	8	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230409	2023-04-09	9	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230410	2023-04-10	10	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230411	2023-04-11	11	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230412	2023-04-12	12	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230413	2023-04-13	13	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230414	2023-04-14	14	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230415	2023-04-15	15	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230416	2023-04-16	16	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230417	2023-04-17	17	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230418	2023-04-18	18	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230419	2023-04-19	19	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230420	2023-04-20	20	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230421	2023-04-21	21	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230422	2023-04-22	22	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230423	2023-04-23	23	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230424	2023-04-24	24	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230425	2023-04-25	25	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230426	2023-04-26	26	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230427	2023-04-27	27	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230428	2023-04-28	28	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	f
20230429	2023-04-29	29	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230430	2023-04-30	30	4	เมษายน	2	2023	2566	2566	2023	Q3	2565	t
20230501	2023-05-01	1	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230502	2023-05-02	2	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230503	2023-05-03	3	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230504	2023-05-04	4	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230505	2023-05-05	5	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230506	2023-05-06	6	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230507	2023-05-07	7	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230508	2023-05-08	8	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230509	2023-05-09	9	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230510	2023-05-10	10	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230511	2023-05-11	11	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230512	2023-05-12	12	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230513	2023-05-13	13	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230514	2023-05-14	14	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230515	2023-05-15	15	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230516	2023-05-16	16	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230517	2023-05-17	17	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230518	2023-05-18	18	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230519	2023-05-19	19	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230520	2023-05-20	20	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230521	2023-05-21	21	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230522	2023-05-22	22	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230523	2023-05-23	23	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230524	2023-05-24	24	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230525	2023-05-25	25	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230526	2023-05-26	26	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230527	2023-05-27	27	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230528	2023-05-28	28	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	t
20230529	2023-05-29	29	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230530	2023-05-30	30	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230531	2023-05-31	31	5	พฤษภาคม	2	2023	2566	2566	2023	Q3	2565	f
20230601	2023-06-01	1	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230602	2023-06-02	2	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230603	2023-06-03	3	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230604	2023-06-04	4	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230605	2023-06-05	5	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230606	2023-06-06	6	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230607	2023-06-07	7	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230608	2023-06-08	8	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230609	2023-06-09	9	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230610	2023-06-10	10	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230611	2023-06-11	11	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230612	2023-06-12	12	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230613	2023-06-13	13	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230614	2023-06-14	14	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230615	2023-06-15	15	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230616	2023-06-16	16	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230617	2023-06-17	17	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230618	2023-06-18	18	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230619	2023-06-19	19	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230620	2023-06-20	20	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230621	2023-06-21	21	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230622	2023-06-22	22	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230623	2023-06-23	23	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230624	2023-06-24	24	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230625	2023-06-25	25	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	t
20230626	2023-06-26	26	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230627	2023-06-27	27	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230628	2023-06-28	28	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230629	2023-06-29	29	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230630	2023-06-30	30	6	มิถุนายน	2	2023	2566	2566	2023	Q3	2566	f
20230701	2023-07-01	1	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230702	2023-07-02	2	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230703	2023-07-03	3	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230704	2023-07-04	4	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230705	2023-07-05	5	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230706	2023-07-06	6	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230707	2023-07-07	7	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230708	2023-07-08	8	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230709	2023-07-09	9	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230710	2023-07-10	10	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230711	2023-07-11	11	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230712	2023-07-12	12	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230713	2023-07-13	13	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230714	2023-07-14	14	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230715	2023-07-15	15	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230716	2023-07-16	16	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230717	2023-07-17	17	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230718	2023-07-18	18	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230719	2023-07-19	19	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230720	2023-07-20	20	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230721	2023-07-21	21	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230722	2023-07-22	22	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230723	2023-07-23	23	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230724	2023-07-24	24	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230725	2023-07-25	25	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230726	2023-07-26	26	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230727	2023-07-27	27	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230728	2023-07-28	28	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230729	2023-07-29	29	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230730	2023-07-30	30	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	t
20230731	2023-07-31	31	7	กรกฎาคม	3	2023	2566	2566	2023	Q4	2566	f
20230801	2023-08-01	1	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230802	2023-08-02	2	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230803	2023-08-03	3	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230804	2023-08-04	4	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230805	2023-08-05	5	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230806	2023-08-06	6	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230807	2023-08-07	7	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230808	2023-08-08	8	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230809	2023-08-09	9	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230810	2023-08-10	10	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230811	2023-08-11	11	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230812	2023-08-12	12	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230813	2023-08-13	13	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230814	2023-08-14	14	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230815	2023-08-15	15	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230816	2023-08-16	16	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230817	2023-08-17	17	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230818	2023-08-18	18	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230819	2023-08-19	19	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230820	2023-08-20	20	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230821	2023-08-21	21	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230822	2023-08-22	22	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230823	2023-08-23	23	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230824	2023-08-24	24	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230825	2023-08-25	25	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230826	2023-08-26	26	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230827	2023-08-27	27	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	t
20230828	2023-08-28	28	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230829	2023-08-29	29	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230830	2023-08-30	30	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230831	2023-08-31	31	8	สิงหาคม	3	2023	2566	2566	2023	Q4	2566	f
20230901	2023-09-01	1	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230902	2023-09-02	2	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230903	2023-09-03	3	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230904	2023-09-04	4	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230905	2023-09-05	5	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230906	2023-09-06	6	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230907	2023-09-07	7	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230908	2023-09-08	8	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230909	2023-09-09	9	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230910	2023-09-10	10	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230911	2023-09-11	11	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230912	2023-09-12	12	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230913	2023-09-13	13	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230914	2023-09-14	14	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230915	2023-09-15	15	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230916	2023-09-16	16	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230917	2023-09-17	17	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230918	2023-09-18	18	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230919	2023-09-19	19	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230920	2023-09-20	20	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230921	2023-09-21	21	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230922	2023-09-22	22	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230923	2023-09-23	23	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230924	2023-09-24	24	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20230925	2023-09-25	25	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230926	2023-09-26	26	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230927	2023-09-27	27	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230928	2023-09-28	28	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230929	2023-09-29	29	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	f
20230930	2023-09-30	30	9	กันยายน	3	2023	2566	2566	2023	Q4	2566	t
20231001	2023-10-01	1	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231002	2023-10-02	2	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231003	2023-10-03	3	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231004	2023-10-04	4	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231005	2023-10-05	5	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231006	2023-10-06	6	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231007	2023-10-07	7	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231008	2023-10-08	8	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231009	2023-10-09	9	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231010	2023-10-10	10	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231011	2023-10-11	11	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231012	2023-10-12	12	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231013	2023-10-13	13	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231014	2023-10-14	14	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231015	2023-10-15	15	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231016	2023-10-16	16	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231017	2023-10-17	17	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231018	2023-10-18	18	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231019	2023-10-19	19	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231020	2023-10-20	20	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231021	2023-10-21	21	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231022	2023-10-22	22	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231023	2023-10-23	23	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231024	2023-10-24	24	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231025	2023-10-25	25	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231026	2023-10-26	26	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231027	2023-10-27	27	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231028	2023-10-28	28	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231029	2023-10-29	29	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	t
20231030	2023-10-30	30	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231031	2023-10-31	31	10	ตุลาคม	4	2023	2566	2567	2024	Q1	2566	f
20231101	2023-11-01	1	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231102	2023-11-02	2	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231103	2023-11-03	3	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231104	2023-11-04	4	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231105	2023-11-05	5	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231106	2023-11-06	6	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231107	2023-11-07	7	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231108	2023-11-08	8	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231109	2023-11-09	9	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231110	2023-11-10	10	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231111	2023-11-11	11	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231112	2023-11-12	12	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231113	2023-11-13	13	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231114	2023-11-14	14	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231115	2023-11-15	15	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231116	2023-11-16	16	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231117	2023-11-17	17	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231118	2023-11-18	18	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231119	2023-11-19	19	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231120	2023-11-20	20	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231121	2023-11-21	21	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231122	2023-11-22	22	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231123	2023-11-23	23	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231124	2023-11-24	24	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231125	2023-11-25	25	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231126	2023-11-26	26	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	t
20231127	2023-11-27	27	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231128	2023-11-28	28	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231129	2023-11-29	29	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231130	2023-11-30	30	11	พฤศจิกายน	4	2023	2566	2567	2024	Q1	2566	f
20231201	2023-12-01	1	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231202	2023-12-02	2	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231203	2023-12-03	3	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231204	2023-12-04	4	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231205	2023-12-05	5	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231206	2023-12-06	6	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231207	2023-12-07	7	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231208	2023-12-08	8	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231209	2023-12-09	9	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231210	2023-12-10	10	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231211	2023-12-11	11	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231212	2023-12-12	12	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231213	2023-12-13	13	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231214	2023-12-14	14	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231215	2023-12-15	15	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231216	2023-12-16	16	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231217	2023-12-17	17	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231218	2023-12-18	18	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231219	2023-12-19	19	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231220	2023-12-20	20	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231221	2023-12-21	21	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231222	2023-12-22	22	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231223	2023-12-23	23	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231224	2023-12-24	24	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231225	2023-12-25	25	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231226	2023-12-26	26	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231227	2023-12-27	27	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231228	2023-12-28	28	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231229	2023-12-29	29	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	f
20231230	2023-12-30	30	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20231231	2023-12-31	31	12	ธันวาคม	4	2023	2566	2567	2024	Q1	2566	t
20240101	2024-01-01	1	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240102	2024-01-02	2	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240103	2024-01-03	3	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240104	2024-01-04	4	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240105	2024-01-05	5	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240106	2024-01-06	6	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240107	2024-01-07	7	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240108	2024-01-08	8	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240109	2024-01-09	9	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240110	2024-01-10	10	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240111	2024-01-11	11	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240112	2024-01-12	12	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240113	2024-01-13	13	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240114	2024-01-14	14	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240115	2024-01-15	15	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240116	2024-01-16	16	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240117	2024-01-17	17	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240118	2024-01-18	18	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240119	2024-01-19	19	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240120	2024-01-20	20	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240121	2024-01-21	21	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240122	2024-01-22	22	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240123	2024-01-23	23	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240124	2024-01-24	24	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240125	2024-01-25	25	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240126	2024-01-26	26	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240127	2024-01-27	27	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240128	2024-01-28	28	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	t
20240129	2024-01-29	29	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240130	2024-01-30	30	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240131	2024-01-31	31	1	มกราคม	1	2024	2567	2567	2024	Q2	2566	f
20240201	2024-02-01	1	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240202	2024-02-02	2	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240203	2024-02-03	3	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240204	2024-02-04	4	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240205	2024-02-05	5	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240206	2024-02-06	6	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240207	2024-02-07	7	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240208	2024-02-08	8	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240209	2024-02-09	9	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240210	2024-02-10	10	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240211	2024-02-11	11	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240212	2024-02-12	12	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240213	2024-02-13	13	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240214	2024-02-14	14	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240215	2024-02-15	15	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240216	2024-02-16	16	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240217	2024-02-17	17	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240218	2024-02-18	18	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240219	2024-02-19	19	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240220	2024-02-20	20	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240221	2024-02-21	21	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240513	2024-05-13	13	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240222	2024-02-22	22	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240223	2024-02-23	23	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240224	2024-02-24	24	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240225	2024-02-25	25	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	t
20240226	2024-02-26	26	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240227	2024-02-27	27	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240228	2024-02-28	28	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240229	2024-02-29	29	2	กุมภาพันธ์	1	2024	2567	2567	2024	Q2	2566	f
20240301	2024-03-01	1	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240302	2024-03-02	2	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240303	2024-03-03	3	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240304	2024-03-04	4	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240305	2024-03-05	5	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240306	2024-03-06	6	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240307	2024-03-07	7	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240308	2024-03-08	8	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240309	2024-03-09	9	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240310	2024-03-10	10	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240311	2024-03-11	11	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240312	2024-03-12	12	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240313	2024-03-13	13	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240314	2024-03-14	14	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240315	2024-03-15	15	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240316	2024-03-16	16	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240317	2024-03-17	17	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240318	2024-03-18	18	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240319	2024-03-19	19	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240320	2024-03-20	20	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240321	2024-03-21	21	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240322	2024-03-22	22	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240323	2024-03-23	23	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240324	2024-03-24	24	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240325	2024-03-25	25	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240326	2024-03-26	26	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240327	2024-03-27	27	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240328	2024-03-28	28	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240329	2024-03-29	29	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	f
20240330	2024-03-30	30	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240331	2024-03-31	31	3	มีนาคม	1	2024	2567	2567	2024	Q2	2566	t
20240401	2024-04-01	1	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240402	2024-04-02	2	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240403	2024-04-03	3	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240404	2024-04-04	4	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240405	2024-04-05	5	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240406	2024-04-06	6	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240407	2024-04-07	7	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240408	2024-04-08	8	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240409	2024-04-09	9	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240410	2024-04-10	10	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240411	2024-04-11	11	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240412	2024-04-12	12	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240413	2024-04-13	13	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240414	2024-04-14	14	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240415	2024-04-15	15	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240416	2024-04-16	16	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240417	2024-04-17	17	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240418	2024-04-18	18	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240419	2024-04-19	19	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240420	2024-04-20	20	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240421	2024-04-21	21	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240422	2024-04-22	22	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240423	2024-04-23	23	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240424	2024-04-24	24	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240425	2024-04-25	25	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240426	2024-04-26	26	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240427	2024-04-27	27	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240428	2024-04-28	28	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	t
20240429	2024-04-29	29	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240430	2024-04-30	30	4	เมษายน	2	2024	2567	2567	2024	Q3	2566	f
20240501	2024-05-01	1	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240502	2024-05-02	2	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240503	2024-05-03	3	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240504	2024-05-04	4	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240505	2024-05-05	5	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240506	2024-05-06	6	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240507	2024-05-07	7	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240508	2024-05-08	8	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240509	2024-05-09	9	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240510	2024-05-10	10	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240511	2024-05-11	11	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240512	2024-05-12	12	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240514	2024-05-14	14	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240515	2024-05-15	15	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240516	2024-05-16	16	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240517	2024-05-17	17	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240518	2024-05-18	18	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240519	2024-05-19	19	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240520	2024-05-20	20	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240521	2024-05-21	21	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240522	2024-05-22	22	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240523	2024-05-23	23	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240524	2024-05-24	24	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240525	2024-05-25	25	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240526	2024-05-26	26	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	t
20240527	2024-05-27	27	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240528	2024-05-28	28	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240529	2024-05-29	29	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240530	2024-05-30	30	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240531	2024-05-31	31	5	พฤษภาคม	2	2024	2567	2567	2024	Q3	2566	f
20240601	2024-06-01	1	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240602	2024-06-02	2	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240603	2024-06-03	3	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240604	2024-06-04	4	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240605	2024-06-05	5	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240606	2024-06-06	6	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240607	2024-06-07	7	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240608	2024-06-08	8	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240609	2024-06-09	9	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240610	2024-06-10	10	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240611	2024-06-11	11	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240612	2024-06-12	12	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240613	2024-06-13	13	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240614	2024-06-14	14	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240615	2024-06-15	15	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240616	2024-06-16	16	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240617	2024-06-17	17	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240618	2024-06-18	18	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240619	2024-06-19	19	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240620	2024-06-20	20	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240621	2024-06-21	21	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240622	2024-06-22	22	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240623	2024-06-23	23	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240624	2024-06-24	24	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240625	2024-06-25	25	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240626	2024-06-26	26	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240627	2024-06-27	27	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240628	2024-06-28	28	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	f
20240629	2024-06-29	29	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240630	2024-06-30	30	6	มิถุนายน	2	2024	2567	2567	2024	Q3	2567	t
20240701	2024-07-01	1	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240702	2024-07-02	2	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240703	2024-07-03	3	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240704	2024-07-04	4	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240705	2024-07-05	5	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240706	2024-07-06	6	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240707	2024-07-07	7	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240708	2024-07-08	8	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240709	2024-07-09	9	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240710	2024-07-10	10	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240711	2024-07-11	11	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240712	2024-07-12	12	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240713	2024-07-13	13	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240714	2024-07-14	14	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240715	2024-07-15	15	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240716	2024-07-16	16	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240717	2024-07-17	17	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240718	2024-07-18	18	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240719	2024-07-19	19	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240720	2024-07-20	20	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240721	2024-07-21	21	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240722	2024-07-22	22	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240723	2024-07-23	23	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240724	2024-07-24	24	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240725	2024-07-25	25	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240726	2024-07-26	26	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240727	2024-07-27	27	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240728	2024-07-28	28	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	t
20240729	2024-07-29	29	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240730	2024-07-30	30	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240731	2024-07-31	31	7	กรกฎาคม	3	2024	2567	2567	2024	Q4	2567	f
20240801	2024-08-01	1	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240802	2024-08-02	2	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240803	2024-08-03	3	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240804	2024-08-04	4	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240805	2024-08-05	5	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240806	2024-08-06	6	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240807	2024-08-07	7	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240808	2024-08-08	8	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240809	2024-08-09	9	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240810	2024-08-10	10	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240811	2024-08-11	11	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240812	2024-08-12	12	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240813	2024-08-13	13	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240814	2024-08-14	14	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240815	2024-08-15	15	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240816	2024-08-16	16	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240817	2024-08-17	17	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240818	2024-08-18	18	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240819	2024-08-19	19	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240820	2024-08-20	20	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240821	2024-08-21	21	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240822	2024-08-22	22	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240823	2024-08-23	23	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240824	2024-08-24	24	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240825	2024-08-25	25	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240826	2024-08-26	26	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240827	2024-08-27	27	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240828	2024-08-28	28	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240829	2024-08-29	29	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240830	2024-08-30	30	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	f
20240831	2024-08-31	31	8	สิงหาคม	3	2024	2567	2567	2024	Q4	2567	t
20240901	2024-09-01	1	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240902	2024-09-02	2	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240903	2024-09-03	3	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240904	2024-09-04	4	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240905	2024-09-05	5	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240906	2024-09-06	6	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240907	2024-09-07	7	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240908	2024-09-08	8	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240909	2024-09-09	9	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240910	2024-09-10	10	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240911	2024-09-11	11	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240912	2024-09-12	12	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240913	2024-09-13	13	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240914	2024-09-14	14	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240915	2024-09-15	15	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240916	2024-09-16	16	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240917	2024-09-17	17	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240918	2024-09-18	18	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240919	2024-09-19	19	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240920	2024-09-20	20	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240921	2024-09-21	21	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240922	2024-09-22	22	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240923	2024-09-23	23	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240924	2024-09-24	24	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240925	2024-09-25	25	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240926	2024-09-26	26	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240927	2024-09-27	27	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20240928	2024-09-28	28	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240929	2024-09-29	29	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	t
20240930	2024-09-30	30	9	กันยายน	3	2024	2567	2567	2024	Q4	2567	f
20241001	2024-10-01	1	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241002	2024-10-02	2	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241003	2024-10-03	3	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241004	2024-10-04	4	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241005	2024-10-05	5	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241006	2024-10-06	6	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241007	2024-10-07	7	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241008	2024-10-08	8	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241009	2024-10-09	9	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241010	2024-10-10	10	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241011	2024-10-11	11	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241012	2024-10-12	12	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241013	2024-10-13	13	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241014	2024-10-14	14	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241015	2024-10-15	15	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241016	2024-10-16	16	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241017	2024-10-17	17	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241018	2024-10-18	18	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241019	2024-10-19	19	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241020	2024-10-20	20	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241021	2024-10-21	21	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241022	2024-10-22	22	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241023	2024-10-23	23	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241024	2024-10-24	24	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241025	2024-10-25	25	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241026	2024-10-26	26	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241027	2024-10-27	27	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	t
20241028	2024-10-28	28	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241029	2024-10-29	29	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241030	2024-10-30	30	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241031	2024-10-31	31	10	ตุลาคม	4	2024	2567	2568	2025	Q1	2567	f
20241101	2024-11-01	1	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241102	2024-11-02	2	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241103	2024-11-03	3	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241104	2024-11-04	4	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241105	2024-11-05	5	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241106	2024-11-06	6	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241107	2024-11-07	7	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241108	2024-11-08	8	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241109	2024-11-09	9	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241110	2024-11-10	10	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241111	2024-11-11	11	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241112	2024-11-12	12	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241113	2024-11-13	13	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241114	2024-11-14	14	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241115	2024-11-15	15	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241116	2024-11-16	16	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241117	2024-11-17	17	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241118	2024-11-18	18	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241119	2024-11-19	19	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241120	2024-11-20	20	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241121	2024-11-21	21	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241122	2024-11-22	22	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241123	2024-11-23	23	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241124	2024-11-24	24	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241125	2024-11-25	25	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241126	2024-11-26	26	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241127	2024-11-27	27	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241128	2024-11-28	28	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241129	2024-11-29	29	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	f
20241130	2024-11-30	30	11	พฤศจิกายน	4	2024	2567	2568	2025	Q1	2567	t
20241201	2024-12-01	1	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241202	2024-12-02	2	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241203	2024-12-03	3	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241204	2024-12-04	4	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241205	2024-12-05	5	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241206	2024-12-06	6	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241207	2024-12-07	7	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241208	2024-12-08	8	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241209	2024-12-09	9	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241210	2024-12-10	10	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241211	2024-12-11	11	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241212	2024-12-12	12	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241213	2024-12-13	13	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241214	2024-12-14	14	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241215	2024-12-15	15	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241216	2024-12-16	16	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241217	2024-12-17	17	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241218	2024-12-18	18	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241219	2024-12-19	19	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241220	2024-12-20	20	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241221	2024-12-21	21	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241222	2024-12-22	22	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241223	2024-12-23	23	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241224	2024-12-24	24	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241225	2024-12-25	25	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241226	2024-12-26	26	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241227	2024-12-27	27	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241228	2024-12-28	28	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241229	2024-12-29	29	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	t
20241230	2024-12-30	30	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20241231	2024-12-31	31	12	ธันวาคม	4	2024	2567	2568	2025	Q1	2567	f
20250101	2025-01-01	1	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250102	2025-01-02	2	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250103	2025-01-03	3	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250104	2025-01-04	4	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250105	2025-01-05	5	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250106	2025-01-06	6	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250107	2025-01-07	7	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250108	2025-01-08	8	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250109	2025-01-09	9	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250110	2025-01-10	10	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250111	2025-01-11	11	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250112	2025-01-12	12	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250113	2025-01-13	13	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250114	2025-01-14	14	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250115	2025-01-15	15	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250116	2025-01-16	16	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250117	2025-01-17	17	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250118	2025-01-18	18	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250119	2025-01-19	19	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250120	2025-01-20	20	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250121	2025-01-21	21	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250122	2025-01-22	22	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250123	2025-01-23	23	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250124	2025-01-24	24	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250125	2025-01-25	25	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250126	2025-01-26	26	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	t
20250127	2025-01-27	27	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250128	2025-01-28	28	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250129	2025-01-29	29	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250130	2025-01-30	30	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250131	2025-01-31	31	1	มกราคม	1	2025	2568	2568	2025	Q2	2567	f
20250201	2025-02-01	1	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250202	2025-02-02	2	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250203	2025-02-03	3	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250204	2025-02-04	4	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250205	2025-02-05	5	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250206	2025-02-06	6	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250207	2025-02-07	7	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250208	2025-02-08	8	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250209	2025-02-09	9	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250210	2025-02-10	10	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250211	2025-02-11	11	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250212	2025-02-12	12	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250213	2025-02-13	13	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250214	2025-02-14	14	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250215	2025-02-15	15	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250216	2025-02-16	16	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250217	2025-02-17	17	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250218	2025-02-18	18	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250219	2025-02-19	19	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250220	2025-02-20	20	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250221	2025-02-21	21	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250222	2025-02-22	22	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250223	2025-02-23	23	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	t
20250224	2025-02-24	24	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250225	2025-02-25	25	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250226	2025-02-26	26	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250227	2025-02-27	27	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250228	2025-02-28	28	2	กุมภาพันธ์	1	2025	2568	2568	2025	Q2	2567	f
20250301	2025-03-01	1	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250302	2025-03-02	2	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250303	2025-03-03	3	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250304	2025-03-04	4	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250305	2025-03-05	5	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250306	2025-03-06	6	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250307	2025-03-07	7	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250308	2025-03-08	8	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250309	2025-03-09	9	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250310	2025-03-10	10	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250311	2025-03-11	11	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250312	2025-03-12	12	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250313	2025-03-13	13	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250314	2025-03-14	14	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250315	2025-03-15	15	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250316	2025-03-16	16	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250317	2025-03-17	17	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250318	2025-03-18	18	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250319	2025-03-19	19	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250320	2025-03-20	20	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250321	2025-03-21	21	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250322	2025-03-22	22	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250323	2025-03-23	23	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250324	2025-03-24	24	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250325	2025-03-25	25	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250326	2025-03-26	26	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250327	2025-03-27	27	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250328	2025-03-28	28	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250329	2025-03-29	29	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250330	2025-03-30	30	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	t
20250331	2025-03-31	31	3	มีนาคม	1	2025	2568	2568	2025	Q2	2567	f
20250401	2025-04-01	1	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250402	2025-04-02	2	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250403	2025-04-03	3	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250404	2025-04-04	4	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250405	2025-04-05	5	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250406	2025-04-06	6	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250407	2025-04-07	7	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250408	2025-04-08	8	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250409	2025-04-09	9	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250410	2025-04-10	10	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250411	2025-04-11	11	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250412	2025-04-12	12	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250413	2025-04-13	13	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250414	2025-04-14	14	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250415	2025-04-15	15	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250416	2025-04-16	16	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250417	2025-04-17	17	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250418	2025-04-18	18	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250419	2025-04-19	19	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250420	2025-04-20	20	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250421	2025-04-21	21	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250422	2025-04-22	22	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250423	2025-04-23	23	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250424	2025-04-24	24	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250425	2025-04-25	25	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250426	2025-04-26	26	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250427	2025-04-27	27	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	t
20250428	2025-04-28	28	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250429	2025-04-29	29	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250430	2025-04-30	30	4	เมษายน	2	2025	2568	2568	2025	Q3	2567	f
20250501	2025-05-01	1	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250502	2025-05-02	2	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250503	2025-05-03	3	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250504	2025-05-04	4	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250505	2025-05-05	5	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250506	2025-05-06	6	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250507	2025-05-07	7	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250508	2025-05-08	8	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250509	2025-05-09	9	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250510	2025-05-10	10	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250511	2025-05-11	11	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250512	2025-05-12	12	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250513	2025-05-13	13	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250514	2025-05-14	14	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250515	2025-05-15	15	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250516	2025-05-16	16	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250517	2025-05-17	17	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250518	2025-05-18	18	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250519	2025-05-19	19	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250520	2025-05-20	20	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250521	2025-05-21	21	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250522	2025-05-22	22	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250523	2025-05-23	23	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250524	2025-05-24	24	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250525	2025-05-25	25	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250526	2025-05-26	26	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250527	2025-05-27	27	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250528	2025-05-28	28	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250529	2025-05-29	29	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250530	2025-05-30	30	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	f
20250531	2025-05-31	31	5	พฤษภาคม	2	2025	2568	2568	2025	Q3	2567	t
20250601	2025-06-01	1	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250602	2025-06-02	2	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250603	2025-06-03	3	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250604	2025-06-04	4	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250605	2025-06-05	5	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250606	2025-06-06	6	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250607	2025-06-07	7	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250608	2025-06-08	8	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250609	2025-06-09	9	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250610	2025-06-10	10	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250611	2025-06-11	11	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250612	2025-06-12	12	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250613	2025-06-13	13	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250614	2025-06-14	14	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250615	2025-06-15	15	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250616	2025-06-16	16	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250617	2025-06-17	17	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250618	2025-06-18	18	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250619	2025-06-19	19	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250620	2025-06-20	20	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250621	2025-06-21	21	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250622	2025-06-22	22	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250623	2025-06-23	23	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250624	2025-06-24	24	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250625	2025-06-25	25	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250626	2025-06-26	26	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250627	2025-06-27	27	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250628	2025-06-28	28	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250629	2025-06-29	29	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	t
20250630	2025-06-30	30	6	มิถุนายน	2	2025	2568	2568	2025	Q3	2568	f
20250701	2025-07-01	1	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250702	2025-07-02	2	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250703	2025-07-03	3	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250704	2025-07-04	4	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250705	2025-07-05	5	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250706	2025-07-06	6	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250707	2025-07-07	7	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250708	2025-07-08	8	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250709	2025-07-09	9	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250710	2025-07-10	10	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250711	2025-07-11	11	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250712	2025-07-12	12	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250713	2025-07-13	13	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250714	2025-07-14	14	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250715	2025-07-15	15	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250716	2025-07-16	16	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250717	2025-07-17	17	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250718	2025-07-18	18	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250719	2025-07-19	19	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250720	2025-07-20	20	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250721	2025-07-21	21	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250722	2025-07-22	22	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250723	2025-07-23	23	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250724	2025-07-24	24	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250725	2025-07-25	25	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250726	2025-07-26	26	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250727	2025-07-27	27	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	t
20250728	2025-07-28	28	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250729	2025-07-29	29	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250730	2025-07-30	30	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250731	2025-07-31	31	7	กรกฎาคม	3	2025	2568	2568	2025	Q4	2568	f
20250801	2025-08-01	1	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250802	2025-08-02	2	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250803	2025-08-03	3	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250804	2025-08-04	4	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250805	2025-08-05	5	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250806	2025-08-06	6	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250807	2025-08-07	7	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250808	2025-08-08	8	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250809	2025-08-09	9	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250810	2025-08-10	10	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250811	2025-08-11	11	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250812	2025-08-12	12	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250813	2025-08-13	13	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250814	2025-08-14	14	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250815	2025-08-15	15	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250816	2025-08-16	16	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250817	2025-08-17	17	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250818	2025-08-18	18	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250819	2025-08-19	19	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250820	2025-08-20	20	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250821	2025-08-21	21	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250822	2025-08-22	22	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250823	2025-08-23	23	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250824	2025-08-24	24	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250825	2025-08-25	25	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250826	2025-08-26	26	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250827	2025-08-27	27	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250828	2025-08-28	28	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250829	2025-08-29	29	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	f
20250830	2025-08-30	30	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250831	2025-08-31	31	8	สิงหาคม	3	2025	2568	2568	2025	Q4	2568	t
20250901	2025-09-01	1	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250902	2025-09-02	2	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250903	2025-09-03	3	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250904	2025-09-04	4	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250905	2025-09-05	5	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250906	2025-09-06	6	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250907	2025-09-07	7	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250908	2025-09-08	8	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250909	2025-09-09	9	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250910	2025-09-10	10	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250911	2025-09-11	11	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250912	2025-09-12	12	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250913	2025-09-13	13	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250914	2025-09-14	14	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250915	2025-09-15	15	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250916	2025-09-16	16	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250917	2025-09-17	17	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250918	2025-09-18	18	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250919	2025-09-19	19	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250920	2025-09-20	20	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250921	2025-09-21	21	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250922	2025-09-22	22	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250923	2025-09-23	23	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250924	2025-09-24	24	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250925	2025-09-25	25	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250926	2025-09-26	26	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250927	2025-09-27	27	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250928	2025-09-28	28	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	t
20250929	2025-09-29	29	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20250930	2025-09-30	30	9	กันยายน	3	2025	2568	2568	2025	Q4	2568	f
20251001	2025-10-01	1	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251002	2025-10-02	2	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251003	2025-10-03	3	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251004	2025-10-04	4	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251005	2025-10-05	5	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251006	2025-10-06	6	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251007	2025-10-07	7	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251008	2025-10-08	8	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251009	2025-10-09	9	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251010	2025-10-10	10	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251011	2025-10-11	11	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251012	2025-10-12	12	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251013	2025-10-13	13	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251014	2025-10-14	14	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251015	2025-10-15	15	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251016	2025-10-16	16	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251017	2025-10-17	17	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251018	2025-10-18	18	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251019	2025-10-19	19	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251020	2025-10-20	20	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251021	2025-10-21	21	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251022	2025-10-22	22	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251023	2025-10-23	23	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251024	2025-10-24	24	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251025	2025-10-25	25	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251026	2025-10-26	26	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	t
20251027	2025-10-27	27	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251028	2025-10-28	28	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251029	2025-10-29	29	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251030	2025-10-30	30	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251031	2025-10-31	31	10	ตุลาคม	4	2025	2568	2569	2026	Q1	2568	f
20251101	2025-11-01	1	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251102	2025-11-02	2	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251103	2025-11-03	3	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251104	2025-11-04	4	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251105	2025-11-05	5	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251106	2025-11-06	6	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251107	2025-11-07	7	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251108	2025-11-08	8	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251109	2025-11-09	9	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251110	2025-11-10	10	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251111	2025-11-11	11	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251112	2025-11-12	12	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251113	2025-11-13	13	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251114	2025-11-14	14	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251115	2025-11-15	15	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251116	2025-11-16	16	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251117	2025-11-17	17	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251118	2025-11-18	18	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251119	2025-11-19	19	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251120	2025-11-20	20	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251121	2025-11-21	21	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20260501	2026-05-01	1	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20251122	2025-11-22	22	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251123	2025-11-23	23	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251124	2025-11-24	24	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251125	2025-11-25	25	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251126	2025-11-26	26	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251127	2025-11-27	27	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251128	2025-11-28	28	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	f
20251129	2025-11-29	29	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251130	2025-11-30	30	11	พฤศจิกายน	4	2025	2568	2569	2026	Q1	2568	t
20251201	2025-12-01	1	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251202	2025-12-02	2	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251203	2025-12-03	3	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251204	2025-12-04	4	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251205	2025-12-05	5	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251206	2025-12-06	6	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251207	2025-12-07	7	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251208	2025-12-08	8	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251209	2025-12-09	9	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251210	2025-12-10	10	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251211	2025-12-11	11	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251212	2025-12-12	12	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251213	2025-12-13	13	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251214	2025-12-14	14	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251215	2025-12-15	15	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251216	2025-12-16	16	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251217	2025-12-17	17	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251218	2025-12-18	18	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251219	2025-12-19	19	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251220	2025-12-20	20	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251221	2025-12-21	21	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251222	2025-12-22	22	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251223	2025-12-23	23	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251224	2025-12-24	24	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251225	2025-12-25	25	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251226	2025-12-26	26	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251227	2025-12-27	27	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251228	2025-12-28	28	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	t
20251229	2025-12-29	29	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251230	2025-12-30	30	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20251231	2025-12-31	31	12	ธันวาคม	4	2025	2568	2569	2026	Q1	2568	f
20260101	2026-01-01	1	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260102	2026-01-02	2	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260103	2026-01-03	3	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260104	2026-01-04	4	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260105	2026-01-05	5	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260106	2026-01-06	6	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260107	2026-01-07	7	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260108	2026-01-08	8	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260109	2026-01-09	9	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260110	2026-01-10	10	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260111	2026-01-11	11	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260112	2026-01-12	12	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260113	2026-01-13	13	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260114	2026-01-14	14	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260115	2026-01-15	15	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260116	2026-01-16	16	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260117	2026-01-17	17	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260118	2026-01-18	18	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260119	2026-01-19	19	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260120	2026-01-20	20	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260121	2026-01-21	21	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260122	2026-01-22	22	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260123	2026-01-23	23	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260124	2026-01-24	24	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260125	2026-01-25	25	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260126	2026-01-26	26	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260127	2026-01-27	27	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260128	2026-01-28	28	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260129	2026-01-29	29	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260130	2026-01-30	30	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	f
20260131	2026-01-31	31	1	มกราคม	1	2026	2569	2569	2026	Q2	2568	t
20260201	2026-02-01	1	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260202	2026-02-02	2	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260203	2026-02-03	3	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260204	2026-02-04	4	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260205	2026-02-05	5	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260206	2026-02-06	6	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260207	2026-02-07	7	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260208	2026-02-08	8	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260209	2026-02-09	9	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260210	2026-02-10	10	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260211	2026-02-11	11	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260212	2026-02-12	12	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260213	2026-02-13	13	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260214	2026-02-14	14	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260215	2026-02-15	15	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260216	2026-02-16	16	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260217	2026-02-17	17	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260218	2026-02-18	18	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260219	2026-02-19	19	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260220	2026-02-20	20	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260221	2026-02-21	21	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260222	2026-02-22	22	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260223	2026-02-23	23	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260224	2026-02-24	24	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260225	2026-02-25	25	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260226	2026-02-26	26	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260227	2026-02-27	27	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	f
20260228	2026-02-28	28	2	กุมภาพันธ์	1	2026	2569	2569	2026	Q2	2568	t
20260301	2026-03-01	1	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260302	2026-03-02	2	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260303	2026-03-03	3	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260304	2026-03-04	4	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260305	2026-03-05	5	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260306	2026-03-06	6	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260307	2026-03-07	7	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260308	2026-03-08	8	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260309	2026-03-09	9	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260310	2026-03-10	10	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260311	2026-03-11	11	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260312	2026-03-12	12	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260313	2026-03-13	13	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260314	2026-03-14	14	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260315	2026-03-15	15	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260316	2026-03-16	16	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260317	2026-03-17	17	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260318	2026-03-18	18	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260319	2026-03-19	19	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260320	2026-03-20	20	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260321	2026-03-21	21	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260322	2026-03-22	22	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260323	2026-03-23	23	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260324	2026-03-24	24	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260325	2026-03-25	25	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260326	2026-03-26	26	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260327	2026-03-27	27	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260328	2026-03-28	28	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260329	2026-03-29	29	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	t
20260330	2026-03-30	30	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260331	2026-03-31	31	3	มีนาคม	1	2026	2569	2569	2026	Q2	2568	f
20260401	2026-04-01	1	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260402	2026-04-02	2	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260403	2026-04-03	3	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260404	2026-04-04	4	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260405	2026-04-05	5	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260406	2026-04-06	6	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260407	2026-04-07	7	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260408	2026-04-08	8	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260409	2026-04-09	9	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260410	2026-04-10	10	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260411	2026-04-11	11	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260412	2026-04-12	12	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260413	2026-04-13	13	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260414	2026-04-14	14	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260415	2026-04-15	15	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260416	2026-04-16	16	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260417	2026-04-17	17	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260418	2026-04-18	18	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260419	2026-04-19	19	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260420	2026-04-20	20	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260421	2026-04-21	21	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260422	2026-04-22	22	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260423	2026-04-23	23	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260424	2026-04-24	24	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260425	2026-04-25	25	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260426	2026-04-26	26	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	t
20260427	2026-04-27	27	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260428	2026-04-28	28	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260429	2026-04-29	29	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260430	2026-04-30	30	4	เมษายน	2	2026	2569	2569	2026	Q3	2568	f
20260502	2026-05-02	2	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260503	2026-05-03	3	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260504	2026-05-04	4	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260505	2026-05-05	5	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260506	2026-05-06	6	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260507	2026-05-07	7	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260508	2026-05-08	8	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260509	2026-05-09	9	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260510	2026-05-10	10	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260511	2026-05-11	11	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260512	2026-05-12	12	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260513	2026-05-13	13	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260514	2026-05-14	14	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260515	2026-05-15	15	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260516	2026-05-16	16	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260517	2026-05-17	17	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260518	2026-05-18	18	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260519	2026-05-19	19	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260520	2026-05-20	20	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260521	2026-05-21	21	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260522	2026-05-22	22	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260523	2026-05-23	23	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260524	2026-05-24	24	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260525	2026-05-25	25	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260526	2026-05-26	26	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260527	2026-05-27	27	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260528	2026-05-28	28	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260529	2026-05-29	29	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	f
20260530	2026-05-30	30	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260531	2026-05-31	31	5	พฤษภาคม	2	2026	2569	2569	2026	Q3	2568	t
20260601	2026-06-01	1	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260602	2026-06-02	2	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260603	2026-06-03	3	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260604	2026-06-04	4	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260605	2026-06-05	5	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260606	2026-06-06	6	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260607	2026-06-07	7	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260608	2026-06-08	8	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260609	2026-06-09	9	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260610	2026-06-10	10	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260611	2026-06-11	11	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260612	2026-06-12	12	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260613	2026-06-13	13	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260614	2026-06-14	14	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260615	2026-06-15	15	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260616	2026-06-16	16	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260617	2026-06-17	17	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260618	2026-06-18	18	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260619	2026-06-19	19	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260620	2026-06-20	20	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260621	2026-06-21	21	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260622	2026-06-22	22	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260623	2026-06-23	23	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260624	2026-06-24	24	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260625	2026-06-25	25	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260626	2026-06-26	26	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260627	2026-06-27	27	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260628	2026-06-28	28	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	t
20260629	2026-06-29	29	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260630	2026-06-30	30	6	มิถุนายน	2	2026	2569	2569	2026	Q3	2569	f
20260701	2026-07-01	1	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260702	2026-07-02	2	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260703	2026-07-03	3	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260704	2026-07-04	4	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260705	2026-07-05	5	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260706	2026-07-06	6	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260707	2026-07-07	7	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260708	2026-07-08	8	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260709	2026-07-09	9	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260710	2026-07-10	10	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260711	2026-07-11	11	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260712	2026-07-12	12	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260713	2026-07-13	13	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260714	2026-07-14	14	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260715	2026-07-15	15	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260716	2026-07-16	16	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260717	2026-07-17	17	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260718	2026-07-18	18	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260719	2026-07-19	19	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260720	2026-07-20	20	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260721	2026-07-21	21	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260722	2026-07-22	22	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260723	2026-07-23	23	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260724	2026-07-24	24	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260725	2026-07-25	25	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260726	2026-07-26	26	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	t
20260727	2026-07-27	27	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260728	2026-07-28	28	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260729	2026-07-29	29	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260730	2026-07-30	30	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260731	2026-07-31	31	7	กรกฎาคม	3	2026	2569	2569	2026	Q4	2569	f
20260801	2026-08-01	1	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260802	2026-08-02	2	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260803	2026-08-03	3	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260804	2026-08-04	4	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260805	2026-08-05	5	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260806	2026-08-06	6	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260807	2026-08-07	7	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260808	2026-08-08	8	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260809	2026-08-09	9	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260810	2026-08-10	10	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260811	2026-08-11	11	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260812	2026-08-12	12	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260813	2026-08-13	13	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260814	2026-08-14	14	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260815	2026-08-15	15	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260816	2026-08-16	16	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260817	2026-08-17	17	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260818	2026-08-18	18	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260819	2026-08-19	19	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260820	2026-08-20	20	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260821	2026-08-21	21	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260822	2026-08-22	22	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260823	2026-08-23	23	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260824	2026-08-24	24	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260825	2026-08-25	25	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260826	2026-08-26	26	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260827	2026-08-27	27	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260828	2026-08-28	28	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260829	2026-08-29	29	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260830	2026-08-30	30	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	t
20260831	2026-08-31	31	8	สิงหาคม	3	2026	2569	2569	2026	Q4	2569	f
20260901	2026-09-01	1	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260902	2026-09-02	2	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260903	2026-09-03	3	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260904	2026-09-04	4	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260905	2026-09-05	5	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260906	2026-09-06	6	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260907	2026-09-07	7	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260908	2026-09-08	8	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260909	2026-09-09	9	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260910	2026-09-10	10	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260911	2026-09-11	11	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260912	2026-09-12	12	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260913	2026-09-13	13	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260914	2026-09-14	14	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260915	2026-09-15	15	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260916	2026-09-16	16	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260917	2026-09-17	17	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260918	2026-09-18	18	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260919	2026-09-19	19	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260920	2026-09-20	20	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260921	2026-09-21	21	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260922	2026-09-22	22	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260923	2026-09-23	23	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260924	2026-09-24	24	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260925	2026-09-25	25	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260926	2026-09-26	26	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260927	2026-09-27	27	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	t
20260928	2026-09-28	28	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260929	2026-09-29	29	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20260930	2026-09-30	30	9	กันยายน	3	2026	2569	2569	2026	Q4	2569	f
20261001	2026-10-01	1	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261002	2026-10-02	2	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261003	2026-10-03	3	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261004	2026-10-04	4	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261005	2026-10-05	5	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261006	2026-10-06	6	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261007	2026-10-07	7	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261008	2026-10-08	8	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261009	2026-10-09	9	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261010	2026-10-10	10	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261011	2026-10-11	11	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261012	2026-10-12	12	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261013	2026-10-13	13	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261014	2026-10-14	14	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261015	2026-10-15	15	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261016	2026-10-16	16	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261017	2026-10-17	17	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261018	2026-10-18	18	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261019	2026-10-19	19	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261020	2026-10-20	20	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261021	2026-10-21	21	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261022	2026-10-22	22	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261023	2026-10-23	23	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261024	2026-10-24	24	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261025	2026-10-25	25	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261026	2026-10-26	26	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261027	2026-10-27	27	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261028	2026-10-28	28	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261029	2026-10-29	29	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261030	2026-10-30	30	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	f
20261031	2026-10-31	31	10	ตุลาคม	4	2026	2569	2570	2027	Q1	2569	t
20261101	2026-11-01	1	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261102	2026-11-02	2	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261103	2026-11-03	3	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261104	2026-11-04	4	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261105	2026-11-05	5	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261106	2026-11-06	6	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261107	2026-11-07	7	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261108	2026-11-08	8	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261109	2026-11-09	9	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261110	2026-11-10	10	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261111	2026-11-11	11	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261112	2026-11-12	12	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261113	2026-11-13	13	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261114	2026-11-14	14	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261115	2026-11-15	15	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261116	2026-11-16	16	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261117	2026-11-17	17	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261118	2026-11-18	18	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261119	2026-11-19	19	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261120	2026-11-20	20	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261121	2026-11-21	21	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261122	2026-11-22	22	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261123	2026-11-23	23	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261124	2026-11-24	24	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261125	2026-11-25	25	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261126	2026-11-26	26	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261127	2026-11-27	27	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261128	2026-11-28	28	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261129	2026-11-29	29	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	t
20261130	2026-11-30	30	11	พฤศจิกายน	4	2026	2569	2570	2027	Q1	2569	f
20261201	2026-12-01	1	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261202	2026-12-02	2	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261203	2026-12-03	3	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261204	2026-12-04	4	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261205	2026-12-05	5	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261206	2026-12-06	6	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261207	2026-12-07	7	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261208	2026-12-08	8	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261209	2026-12-09	9	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261210	2026-12-10	10	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261211	2026-12-11	11	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261212	2026-12-12	12	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261213	2026-12-13	13	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261214	2026-12-14	14	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261215	2026-12-15	15	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261216	2026-12-16	16	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261217	2026-12-17	17	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261218	2026-12-18	18	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261219	2026-12-19	19	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261220	2026-12-20	20	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261221	2026-12-21	21	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261222	2026-12-22	22	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261223	2026-12-23	23	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261224	2026-12-24	24	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261225	2026-12-25	25	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261226	2026-12-26	26	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261227	2026-12-27	27	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	t
20261228	2026-12-28	28	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261229	2026-12-29	29	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261230	2026-12-30	30	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20261231	2026-12-31	31	12	ธันวาคม	4	2026	2569	2570	2027	Q1	2569	f
20270101	2027-01-01	1	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270102	2027-01-02	2	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270103	2027-01-03	3	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270104	2027-01-04	4	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270105	2027-01-05	5	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270106	2027-01-06	6	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270107	2027-01-07	7	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270108	2027-01-08	8	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270109	2027-01-09	9	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270110	2027-01-10	10	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270111	2027-01-11	11	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270112	2027-01-12	12	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270113	2027-01-13	13	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270114	2027-01-14	14	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270115	2027-01-15	15	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270116	2027-01-16	16	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270117	2027-01-17	17	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270118	2027-01-18	18	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270119	2027-01-19	19	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270120	2027-01-20	20	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270121	2027-01-21	21	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270122	2027-01-22	22	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270123	2027-01-23	23	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270124	2027-01-24	24	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270125	2027-01-25	25	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270126	2027-01-26	26	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270127	2027-01-27	27	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270128	2027-01-28	28	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270129	2027-01-29	29	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	f
20270130	2027-01-30	30	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270131	2027-01-31	31	1	มกราคม	1	2027	2570	2570	2027	Q2	2569	t
20270201	2027-02-01	1	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270202	2027-02-02	2	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270203	2027-02-03	3	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270204	2027-02-04	4	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270205	2027-02-05	5	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270206	2027-02-06	6	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270207	2027-02-07	7	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270208	2027-02-08	8	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270209	2027-02-09	9	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270210	2027-02-10	10	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270211	2027-02-11	11	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270212	2027-02-12	12	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270213	2027-02-13	13	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270214	2027-02-14	14	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270215	2027-02-15	15	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270216	2027-02-16	16	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270217	2027-02-17	17	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270218	2027-02-18	18	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270219	2027-02-19	19	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270220	2027-02-20	20	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270221	2027-02-21	21	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270222	2027-02-22	22	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270223	2027-02-23	23	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270224	2027-02-24	24	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270225	2027-02-25	25	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270226	2027-02-26	26	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	f
20270227	2027-02-27	27	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270228	2027-02-28	28	2	กุมภาพันธ์	1	2027	2570	2570	2027	Q2	2569	t
20270301	2027-03-01	1	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270302	2027-03-02	2	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270303	2027-03-03	3	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270304	2027-03-04	4	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270305	2027-03-05	5	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270306	2027-03-06	6	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270307	2027-03-07	7	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270308	2027-03-08	8	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270309	2027-03-09	9	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270310	2027-03-10	10	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270311	2027-03-11	11	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270312	2027-03-12	12	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270313	2027-03-13	13	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270314	2027-03-14	14	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270315	2027-03-15	15	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270316	2027-03-16	16	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270317	2027-03-17	17	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270318	2027-03-18	18	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270319	2027-03-19	19	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270320	2027-03-20	20	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270321	2027-03-21	21	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270322	2027-03-22	22	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270323	2027-03-23	23	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270324	2027-03-24	24	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270325	2027-03-25	25	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270326	2027-03-26	26	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270327	2027-03-27	27	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270328	2027-03-28	28	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	t
20270329	2027-03-29	29	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270330	2027-03-30	30	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270331	2027-03-31	31	3	มีนาคม	1	2027	2570	2570	2027	Q2	2569	f
20270401	2027-04-01	1	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270402	2027-04-02	2	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270403	2027-04-03	3	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270404	2027-04-04	4	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270405	2027-04-05	5	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270406	2027-04-06	6	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270407	2027-04-07	7	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270408	2027-04-08	8	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270409	2027-04-09	9	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270410	2027-04-10	10	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270411	2027-04-11	11	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270412	2027-04-12	12	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270413	2027-04-13	13	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270414	2027-04-14	14	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270415	2027-04-15	15	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270416	2027-04-16	16	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270417	2027-04-17	17	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270418	2027-04-18	18	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270419	2027-04-19	19	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270420	2027-04-20	20	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270421	2027-04-21	21	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270422	2027-04-22	22	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270423	2027-04-23	23	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270424	2027-04-24	24	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270425	2027-04-25	25	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	t
20270426	2027-04-26	26	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270427	2027-04-27	27	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270428	2027-04-28	28	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270429	2027-04-29	29	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270430	2027-04-30	30	4	เมษายน	2	2027	2570	2570	2027	Q3	2569	f
20270501	2027-05-01	1	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270502	2027-05-02	2	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270503	2027-05-03	3	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270504	2027-05-04	4	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270505	2027-05-05	5	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270506	2027-05-06	6	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270507	2027-05-07	7	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270508	2027-05-08	8	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270509	2027-05-09	9	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270510	2027-05-10	10	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270511	2027-05-11	11	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270512	2027-05-12	12	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270513	2027-05-13	13	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270514	2027-05-14	14	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270515	2027-05-15	15	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270516	2027-05-16	16	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270517	2027-05-17	17	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270518	2027-05-18	18	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270519	2027-05-19	19	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270520	2027-05-20	20	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270521	2027-05-21	21	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270522	2027-05-22	22	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270523	2027-05-23	23	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270524	2027-05-24	24	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270525	2027-05-25	25	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270526	2027-05-26	26	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270527	2027-05-27	27	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270528	2027-05-28	28	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270529	2027-05-29	29	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270530	2027-05-30	30	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	t
20270531	2027-05-31	31	5	พฤษภาคม	2	2027	2570	2570	2027	Q3	2569	f
20270601	2027-06-01	1	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270602	2027-06-02	2	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270603	2027-06-03	3	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270604	2027-06-04	4	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270605	2027-06-05	5	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270606	2027-06-06	6	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270607	2027-06-07	7	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270608	2027-06-08	8	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270609	2027-06-09	9	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270610	2027-06-10	10	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270611	2027-06-11	11	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270612	2027-06-12	12	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270613	2027-06-13	13	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270614	2027-06-14	14	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270615	2027-06-15	15	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270616	2027-06-16	16	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270617	2027-06-17	17	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270618	2027-06-18	18	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270619	2027-06-19	19	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270620	2027-06-20	20	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270621	2027-06-21	21	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270622	2027-06-22	22	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270623	2027-06-23	23	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270624	2027-06-24	24	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270625	2027-06-25	25	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270626	2027-06-26	26	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270627	2027-06-27	27	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	t
20270628	2027-06-28	28	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270629	2027-06-29	29	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270630	2027-06-30	30	6	มิถุนายน	2	2027	2570	2570	2027	Q3	2570	f
20270701	2027-07-01	1	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270702	2027-07-02	2	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270703	2027-07-03	3	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270704	2027-07-04	4	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270705	2027-07-05	5	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270706	2027-07-06	6	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270707	2027-07-07	7	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270708	2027-07-08	8	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270709	2027-07-09	9	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270710	2027-07-10	10	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270711	2027-07-11	11	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270712	2027-07-12	12	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270713	2027-07-13	13	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270714	2027-07-14	14	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270715	2027-07-15	15	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270716	2027-07-16	16	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270717	2027-07-17	17	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270718	2027-07-18	18	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270719	2027-07-19	19	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270720	2027-07-20	20	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270721	2027-07-21	21	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270722	2027-07-22	22	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270723	2027-07-23	23	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270724	2027-07-24	24	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270725	2027-07-25	25	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270726	2027-07-26	26	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270727	2027-07-27	27	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270728	2027-07-28	28	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270729	2027-07-29	29	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270730	2027-07-30	30	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	f
20270731	2027-07-31	31	7	กรกฎาคม	3	2027	2570	2570	2027	Q4	2570	t
20270801	2027-08-01	1	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270802	2027-08-02	2	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270803	2027-08-03	3	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270804	2027-08-04	4	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270805	2027-08-05	5	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270806	2027-08-06	6	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270807	2027-08-07	7	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270808	2027-08-08	8	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270809	2027-08-09	9	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270810	2027-08-10	10	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270811	2027-08-11	11	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270812	2027-08-12	12	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270813	2027-08-13	13	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270814	2027-08-14	14	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270815	2027-08-15	15	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270816	2027-08-16	16	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270817	2027-08-17	17	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270818	2027-08-18	18	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270819	2027-08-19	19	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270820	2027-08-20	20	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270821	2027-08-21	21	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270822	2027-08-22	22	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270823	2027-08-23	23	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270824	2027-08-24	24	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270825	2027-08-25	25	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270826	2027-08-26	26	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270827	2027-08-27	27	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270828	2027-08-28	28	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270829	2027-08-29	29	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	t
20270830	2027-08-30	30	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270831	2027-08-31	31	8	สิงหาคม	3	2027	2570	2570	2027	Q4	2570	f
20270901	2027-09-01	1	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270902	2027-09-02	2	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270903	2027-09-03	3	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270904	2027-09-04	4	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270905	2027-09-05	5	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270906	2027-09-06	6	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270907	2027-09-07	7	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270908	2027-09-08	8	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270909	2027-09-09	9	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270910	2027-09-10	10	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270911	2027-09-11	11	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270912	2027-09-12	12	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270913	2027-09-13	13	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270914	2027-09-14	14	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270915	2027-09-15	15	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270916	2027-09-16	16	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270917	2027-09-17	17	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270918	2027-09-18	18	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270919	2027-09-19	19	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270920	2027-09-20	20	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270921	2027-09-21	21	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270922	2027-09-22	22	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270923	2027-09-23	23	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270924	2027-09-24	24	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270925	2027-09-25	25	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270926	2027-09-26	26	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	t
20270927	2027-09-27	27	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270928	2027-09-28	28	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270929	2027-09-29	29	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20270930	2027-09-30	30	9	กันยายน	3	2027	2570	2570	2027	Q4	2570	f
20271001	2027-10-01	1	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271002	2027-10-02	2	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271003	2027-10-03	3	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271004	2027-10-04	4	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271005	2027-10-05	5	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271006	2027-10-06	6	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271007	2027-10-07	7	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271008	2027-10-08	8	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271009	2027-10-09	9	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271010	2027-10-10	10	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271011	2027-10-11	11	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271012	2027-10-12	12	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271013	2027-10-13	13	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271014	2027-10-14	14	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271015	2027-10-15	15	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271016	2027-10-16	16	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271017	2027-10-17	17	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271018	2027-10-18	18	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271019	2027-10-19	19	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271020	2027-10-20	20	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271021	2027-10-21	21	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271022	2027-10-22	22	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271023	2027-10-23	23	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271024	2027-10-24	24	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271025	2027-10-25	25	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271026	2027-10-26	26	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271027	2027-10-27	27	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271028	2027-10-28	28	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271029	2027-10-29	29	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	f
20271030	2027-10-30	30	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271031	2027-10-31	31	10	ตุลาคม	4	2027	2570	2571	2028	Q1	2570	t
20271101	2027-11-01	1	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271102	2027-11-02	2	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271103	2027-11-03	3	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271104	2027-11-04	4	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271105	2027-11-05	5	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271106	2027-11-06	6	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271107	2027-11-07	7	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271108	2027-11-08	8	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271109	2027-11-09	9	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271110	2027-11-10	10	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271111	2027-11-11	11	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271112	2027-11-12	12	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271113	2027-11-13	13	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271114	2027-11-14	14	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271115	2027-11-15	15	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271116	2027-11-16	16	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271117	2027-11-17	17	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271118	2027-11-18	18	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271119	2027-11-19	19	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271120	2027-11-20	20	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271121	2027-11-21	21	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271122	2027-11-22	22	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271123	2027-11-23	23	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271124	2027-11-24	24	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271125	2027-11-25	25	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271126	2027-11-26	26	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271127	2027-11-27	27	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271128	2027-11-28	28	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	t
20271129	2027-11-29	29	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271130	2027-11-30	30	11	พฤศจิกายน	4	2027	2570	2571	2028	Q1	2570	f
20271201	2027-12-01	1	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271202	2027-12-02	2	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271203	2027-12-03	3	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271204	2027-12-04	4	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271205	2027-12-05	5	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271206	2027-12-06	6	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271207	2027-12-07	7	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271208	2027-12-08	8	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271209	2027-12-09	9	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271210	2027-12-10	10	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271211	2027-12-11	11	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271212	2027-12-12	12	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271213	2027-12-13	13	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271214	2027-12-14	14	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271215	2027-12-15	15	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271216	2027-12-16	16	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271217	2027-12-17	17	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271218	2027-12-18	18	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271219	2027-12-19	19	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271220	2027-12-20	20	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271221	2027-12-21	21	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271222	2027-12-22	22	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271223	2027-12-23	23	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271224	2027-12-24	24	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271225	2027-12-25	25	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271226	2027-12-26	26	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	t
20271227	2027-12-27	27	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271228	2027-12-28	28	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271229	2027-12-29	29	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271230	2027-12-30	30	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20271231	2027-12-31	31	12	ธันวาคม	4	2027	2570	2571	2028	Q1	2570	f
20280101	2028-01-01	1	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280102	2028-01-02	2	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280103	2028-01-03	3	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280104	2028-01-04	4	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280105	2028-01-05	5	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280106	2028-01-06	6	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280107	2028-01-07	7	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280108	2028-01-08	8	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280109	2028-01-09	9	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280110	2028-01-10	10	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280111	2028-01-11	11	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280112	2028-01-12	12	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280113	2028-01-13	13	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280114	2028-01-14	14	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280115	2028-01-15	15	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280116	2028-01-16	16	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280117	2028-01-17	17	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280118	2028-01-18	18	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280119	2028-01-19	19	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280120	2028-01-20	20	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280121	2028-01-21	21	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280122	2028-01-22	22	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280123	2028-01-23	23	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280124	2028-01-24	24	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280125	2028-01-25	25	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280126	2028-01-26	26	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280127	2028-01-27	27	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280128	2028-01-28	28	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280129	2028-01-29	29	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280130	2028-01-30	30	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	t
20280131	2028-01-31	31	1	มกราคม	1	2028	2571	2571	2028	Q2	2570	f
20280201	2028-02-01	1	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280202	2028-02-02	2	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280203	2028-02-03	3	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280204	2028-02-04	4	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280205	2028-02-05	5	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280206	2028-02-06	6	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280207	2028-02-07	7	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280208	2028-02-08	8	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280209	2028-02-09	9	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280210	2028-02-10	10	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280211	2028-02-11	11	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280212	2028-02-12	12	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280213	2028-02-13	13	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280214	2028-02-14	14	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280215	2028-02-15	15	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280216	2028-02-16	16	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280217	2028-02-17	17	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280218	2028-02-18	18	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280219	2028-02-19	19	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280220	2028-02-20	20	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280221	2028-02-21	21	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280222	2028-02-22	22	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280223	2028-02-23	23	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280224	2028-02-24	24	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280225	2028-02-25	25	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280226	2028-02-26	26	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280227	2028-02-27	27	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	t
20280228	2028-02-28	28	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280229	2028-02-29	29	2	กุมภาพันธ์	1	2028	2571	2571	2028	Q2	2570	f
20280301	2028-03-01	1	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280302	2028-03-02	2	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280303	2028-03-03	3	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280304	2028-03-04	4	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280305	2028-03-05	5	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280306	2028-03-06	6	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280307	2028-03-07	7	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280308	2028-03-08	8	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280309	2028-03-09	9	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280310	2028-03-10	10	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280311	2028-03-11	11	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280312	2028-03-12	12	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280313	2028-03-13	13	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280314	2028-03-14	14	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280315	2028-03-15	15	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280316	2028-03-16	16	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280317	2028-03-17	17	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280318	2028-03-18	18	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280319	2028-03-19	19	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280320	2028-03-20	20	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280321	2028-03-21	21	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280322	2028-03-22	22	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280323	2028-03-23	23	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280324	2028-03-24	24	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280325	2028-03-25	25	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280326	2028-03-26	26	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	t
20280327	2028-03-27	27	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280328	2028-03-28	28	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280329	2028-03-29	29	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280330	2028-03-30	30	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280331	2028-03-31	31	3	มีนาคม	1	2028	2571	2571	2028	Q2	2570	f
20280401	2028-04-01	1	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280402	2028-04-02	2	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280403	2028-04-03	3	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280404	2028-04-04	4	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280405	2028-04-05	5	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280406	2028-04-06	6	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280407	2028-04-07	7	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280408	2028-04-08	8	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280409	2028-04-09	9	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280410	2028-04-10	10	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280411	2028-04-11	11	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280412	2028-04-12	12	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280413	2028-04-13	13	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280414	2028-04-14	14	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280415	2028-04-15	15	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280416	2028-04-16	16	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280417	2028-04-17	17	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280418	2028-04-18	18	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280419	2028-04-19	19	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280420	2028-04-20	20	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280421	2028-04-21	21	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280422	2028-04-22	22	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280423	2028-04-23	23	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280424	2028-04-24	24	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280425	2028-04-25	25	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280426	2028-04-26	26	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280427	2028-04-27	27	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280428	2028-04-28	28	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	f
20280429	2028-04-29	29	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280430	2028-04-30	30	4	เมษายน	2	2028	2571	2571	2028	Q3	2570	t
20280501	2028-05-01	1	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280502	2028-05-02	2	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280503	2028-05-03	3	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280504	2028-05-04	4	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280505	2028-05-05	5	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280506	2028-05-06	6	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280507	2028-05-07	7	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280508	2028-05-08	8	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280509	2028-05-09	9	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280510	2028-05-10	10	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280511	2028-05-11	11	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280512	2028-05-12	12	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280513	2028-05-13	13	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280514	2028-05-14	14	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280515	2028-05-15	15	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280516	2028-05-16	16	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280517	2028-05-17	17	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280518	2028-05-18	18	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280519	2028-05-19	19	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280520	2028-05-20	20	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280521	2028-05-21	21	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280522	2028-05-22	22	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280523	2028-05-23	23	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280524	2028-05-24	24	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280525	2028-05-25	25	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280526	2028-05-26	26	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280527	2028-05-27	27	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280528	2028-05-28	28	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	t
20280529	2028-05-29	29	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280530	2028-05-30	30	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280531	2028-05-31	31	5	พฤษภาคม	2	2028	2571	2571	2028	Q3	2570	f
20280601	2028-06-01	1	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280602	2028-06-02	2	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280603	2028-06-03	3	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280604	2028-06-04	4	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280605	2028-06-05	5	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280606	2028-06-06	6	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280607	2028-06-07	7	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280608	2028-06-08	8	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280609	2028-06-09	9	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280610	2028-06-10	10	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280611	2028-06-11	11	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280612	2028-06-12	12	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280613	2028-06-13	13	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280614	2028-06-14	14	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280615	2028-06-15	15	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280616	2028-06-16	16	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280617	2028-06-17	17	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280618	2028-06-18	18	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280619	2028-06-19	19	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280620	2028-06-20	20	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280621	2028-06-21	21	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280622	2028-06-22	22	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280623	2028-06-23	23	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280624	2028-06-24	24	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280625	2028-06-25	25	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	t
20280626	2028-06-26	26	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280627	2028-06-27	27	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280628	2028-06-28	28	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280629	2028-06-29	29	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280630	2028-06-30	30	6	มิถุนายน	2	2028	2571	2571	2028	Q3	2571	f
20280701	2028-07-01	1	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280702	2028-07-02	2	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280703	2028-07-03	3	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280704	2028-07-04	4	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280705	2028-07-05	5	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280706	2028-07-06	6	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280707	2028-07-07	7	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280708	2028-07-08	8	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280709	2028-07-09	9	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280710	2028-07-10	10	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280711	2028-07-11	11	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280712	2028-07-12	12	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280713	2028-07-13	13	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280714	2028-07-14	14	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280715	2028-07-15	15	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280716	2028-07-16	16	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280717	2028-07-17	17	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280718	2028-07-18	18	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280719	2028-07-19	19	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280720	2028-07-20	20	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280721	2028-07-21	21	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280722	2028-07-22	22	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280723	2028-07-23	23	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280724	2028-07-24	24	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280725	2028-07-25	25	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280726	2028-07-26	26	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280727	2028-07-27	27	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280728	2028-07-28	28	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280729	2028-07-29	29	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280730	2028-07-30	30	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	t
20280731	2028-07-31	31	7	กรกฎาคม	3	2028	2571	2571	2028	Q4	2571	f
20280801	2028-08-01	1	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280802	2028-08-02	2	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280803	2028-08-03	3	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280804	2028-08-04	4	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280805	2028-08-05	5	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280806	2028-08-06	6	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280807	2028-08-07	7	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280808	2028-08-08	8	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280809	2028-08-09	9	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280810	2028-08-10	10	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280811	2028-08-11	11	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280812	2028-08-12	12	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280813	2028-08-13	13	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280814	2028-08-14	14	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280815	2028-08-15	15	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280816	2028-08-16	16	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280817	2028-08-17	17	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280818	2028-08-18	18	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280819	2028-08-19	19	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280820	2028-08-20	20	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280821	2028-08-21	21	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280822	2028-08-22	22	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280823	2028-08-23	23	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280824	2028-08-24	24	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280825	2028-08-25	25	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280826	2028-08-26	26	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280827	2028-08-27	27	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	t
20280828	2028-08-28	28	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280829	2028-08-29	29	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280830	2028-08-30	30	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280831	2028-08-31	31	8	สิงหาคม	3	2028	2571	2571	2028	Q4	2571	f
20280901	2028-09-01	1	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280902	2028-09-02	2	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280903	2028-09-03	3	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280904	2028-09-04	4	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280905	2028-09-05	5	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280906	2028-09-06	6	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280907	2028-09-07	7	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280908	2028-09-08	8	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280909	2028-09-09	9	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280910	2028-09-10	10	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280911	2028-09-11	11	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280912	2028-09-12	12	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280913	2028-09-13	13	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280914	2028-09-14	14	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280915	2028-09-15	15	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280916	2028-09-16	16	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280917	2028-09-17	17	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280918	2028-09-18	18	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280919	2028-09-19	19	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280920	2028-09-20	20	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280921	2028-09-21	21	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280922	2028-09-22	22	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280923	2028-09-23	23	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280924	2028-09-24	24	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20280925	2028-09-25	25	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280926	2028-09-26	26	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280927	2028-09-27	27	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280928	2028-09-28	28	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280929	2028-09-29	29	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	f
20280930	2028-09-30	30	9	กันยายน	3	2028	2571	2571	2028	Q4	2571	t
20281001	2028-10-01	1	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281002	2028-10-02	2	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281003	2028-10-03	3	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281004	2028-10-04	4	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281005	2028-10-05	5	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281006	2028-10-06	6	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281007	2028-10-07	7	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281008	2028-10-08	8	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281009	2028-10-09	9	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281010	2028-10-10	10	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281011	2028-10-11	11	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281012	2028-10-12	12	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281013	2028-10-13	13	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281014	2028-10-14	14	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281015	2028-10-15	15	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281016	2028-10-16	16	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281017	2028-10-17	17	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281018	2028-10-18	18	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281019	2028-10-19	19	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281020	2028-10-20	20	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281021	2028-10-21	21	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281022	2028-10-22	22	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281023	2028-10-23	23	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281024	2028-10-24	24	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281025	2028-10-25	25	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281026	2028-10-26	26	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281027	2028-10-27	27	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281028	2028-10-28	28	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281029	2028-10-29	29	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	t
20281030	2028-10-30	30	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281031	2028-10-31	31	10	ตุลาคม	4	2028	2571	2572	2029	Q1	2571	f
20281101	2028-11-01	1	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281102	2028-11-02	2	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281103	2028-11-03	3	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281104	2028-11-04	4	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281105	2028-11-05	5	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281106	2028-11-06	6	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281107	2028-11-07	7	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281108	2028-11-08	8	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281109	2028-11-09	9	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281110	2028-11-10	10	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281111	2028-11-11	11	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281112	2028-11-12	12	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281113	2028-11-13	13	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281114	2028-11-14	14	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281115	2028-11-15	15	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281116	2028-11-16	16	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281117	2028-11-17	17	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281118	2028-11-18	18	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281119	2028-11-19	19	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281120	2028-11-20	20	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281121	2028-11-21	21	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281122	2028-11-22	22	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281123	2028-11-23	23	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281124	2028-11-24	24	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281125	2028-11-25	25	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281126	2028-11-26	26	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	t
20281127	2028-11-27	27	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281128	2028-11-28	28	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281129	2028-11-29	29	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281130	2028-11-30	30	11	พฤศจิกายน	4	2028	2571	2572	2029	Q1	2571	f
20281201	2028-12-01	1	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281202	2028-12-02	2	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281203	2028-12-03	3	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281204	2028-12-04	4	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281205	2028-12-05	5	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281206	2028-12-06	6	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281207	2028-12-07	7	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281208	2028-12-08	8	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281209	2028-12-09	9	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281210	2028-12-10	10	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281211	2028-12-11	11	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281212	2028-12-12	12	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281213	2028-12-13	13	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281214	2028-12-14	14	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281215	2028-12-15	15	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281216	2028-12-16	16	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281217	2028-12-17	17	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281218	2028-12-18	18	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281219	2028-12-19	19	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281220	2028-12-20	20	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281221	2028-12-21	21	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281222	2028-12-22	22	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281223	2028-12-23	23	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281224	2028-12-24	24	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281225	2028-12-25	25	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281226	2028-12-26	26	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281227	2028-12-27	27	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281228	2028-12-28	28	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281229	2028-12-29	29	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	f
20281230	2028-12-30	30	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20281231	2028-12-31	31	12	ธันวาคม	4	2028	2571	2572	2029	Q1	2571	t
20290101	2029-01-01	1	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290102	2029-01-02	2	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290103	2029-01-03	3	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290104	2029-01-04	4	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290105	2029-01-05	5	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290106	2029-01-06	6	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290107	2029-01-07	7	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290108	2029-01-08	8	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290109	2029-01-09	9	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290110	2029-01-10	10	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290111	2029-01-11	11	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290112	2029-01-12	12	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290113	2029-01-13	13	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290114	2029-01-14	14	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290115	2029-01-15	15	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290116	2029-01-16	16	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290117	2029-01-17	17	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290118	2029-01-18	18	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290119	2029-01-19	19	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290120	2029-01-20	20	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290121	2029-01-21	21	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290122	2029-01-22	22	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290123	2029-01-23	23	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290124	2029-01-24	24	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290125	2029-01-25	25	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290126	2029-01-26	26	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290127	2029-01-27	27	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290128	2029-01-28	28	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	t
20290129	2029-01-29	29	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290130	2029-01-30	30	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290131	2029-01-31	31	1	มกราคม	1	2029	2572	2572	2029	Q2	2571	f
20290201	2029-02-01	1	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290202	2029-02-02	2	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290203	2029-02-03	3	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290204	2029-02-04	4	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290205	2029-02-05	5	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290206	2029-02-06	6	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290207	2029-02-07	7	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290208	2029-02-08	8	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290209	2029-02-09	9	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290210	2029-02-10	10	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290211	2029-02-11	11	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290212	2029-02-12	12	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290213	2029-02-13	13	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290214	2029-02-14	14	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290215	2029-02-15	15	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290216	2029-02-16	16	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290217	2029-02-17	17	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290218	2029-02-18	18	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290219	2029-02-19	19	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290220	2029-02-20	20	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290221	2029-02-21	21	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290222	2029-02-22	22	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290223	2029-02-23	23	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290224	2029-02-24	24	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290225	2029-02-25	25	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	t
20290226	2029-02-26	26	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290227	2029-02-27	27	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290228	2029-02-28	28	2	กุมภาพันธ์	1	2029	2572	2572	2029	Q2	2571	f
20290301	2029-03-01	1	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290302	2029-03-02	2	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290303	2029-03-03	3	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290304	2029-03-04	4	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290305	2029-03-05	5	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290306	2029-03-06	6	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290307	2029-03-07	7	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290308	2029-03-08	8	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290309	2029-03-09	9	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290310	2029-03-10	10	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290311	2029-03-11	11	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290312	2029-03-12	12	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290313	2029-03-13	13	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290314	2029-03-14	14	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290315	2029-03-15	15	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290316	2029-03-16	16	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290317	2029-03-17	17	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290318	2029-03-18	18	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290319	2029-03-19	19	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290320	2029-03-20	20	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290321	2029-03-21	21	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290322	2029-03-22	22	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290323	2029-03-23	23	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290324	2029-03-24	24	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290325	2029-03-25	25	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290326	2029-03-26	26	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290327	2029-03-27	27	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290328	2029-03-28	28	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290329	2029-03-29	29	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290330	2029-03-30	30	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	f
20290331	2029-03-31	31	3	มีนาคม	1	2029	2572	2572	2029	Q2	2571	t
20290401	2029-04-01	1	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290402	2029-04-02	2	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290403	2029-04-03	3	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290404	2029-04-04	4	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290405	2029-04-05	5	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290406	2029-04-06	6	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290407	2029-04-07	7	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290408	2029-04-08	8	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290409	2029-04-09	9	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290410	2029-04-10	10	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290411	2029-04-11	11	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290412	2029-04-12	12	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290413	2029-04-13	13	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290414	2029-04-14	14	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290415	2029-04-15	15	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290416	2029-04-16	16	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290417	2029-04-17	17	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290418	2029-04-18	18	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290419	2029-04-19	19	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290420	2029-04-20	20	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290421	2029-04-21	21	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290422	2029-04-22	22	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290423	2029-04-23	23	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290424	2029-04-24	24	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290425	2029-04-25	25	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290426	2029-04-26	26	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290427	2029-04-27	27	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290428	2029-04-28	28	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290429	2029-04-29	29	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	t
20290430	2029-04-30	30	4	เมษายน	2	2029	2572	2572	2029	Q3	2571	f
20290501	2029-05-01	1	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290502	2029-05-02	2	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290503	2029-05-03	3	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290504	2029-05-04	4	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290505	2029-05-05	5	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290506	2029-05-06	6	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290507	2029-05-07	7	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290508	2029-05-08	8	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290509	2029-05-09	9	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290510	2029-05-10	10	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290511	2029-05-11	11	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290512	2029-05-12	12	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290513	2029-05-13	13	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290514	2029-05-14	14	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290515	2029-05-15	15	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290516	2029-05-16	16	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290517	2029-05-17	17	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290518	2029-05-18	18	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290519	2029-05-19	19	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290520	2029-05-20	20	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290521	2029-05-21	21	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290522	2029-05-22	22	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290523	2029-05-23	23	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290524	2029-05-24	24	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290525	2029-05-25	25	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290526	2029-05-26	26	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290527	2029-05-27	27	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	t
20290528	2029-05-28	28	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290529	2029-05-29	29	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290530	2029-05-30	30	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290531	2029-05-31	31	5	พฤษภาคม	2	2029	2572	2572	2029	Q3	2571	f
20290601	2029-06-01	1	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290602	2029-06-02	2	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290603	2029-06-03	3	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290604	2029-06-04	4	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290605	2029-06-05	5	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290606	2029-06-06	6	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290607	2029-06-07	7	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290608	2029-06-08	8	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290609	2029-06-09	9	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290610	2029-06-10	10	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290611	2029-06-11	11	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290612	2029-06-12	12	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290613	2029-06-13	13	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290614	2029-06-14	14	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290615	2029-06-15	15	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290616	2029-06-16	16	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290617	2029-06-17	17	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290618	2029-06-18	18	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290619	2029-06-19	19	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290620	2029-06-20	20	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290621	2029-06-21	21	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290622	2029-06-22	22	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290623	2029-06-23	23	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290624	2029-06-24	24	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290625	2029-06-25	25	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290626	2029-06-26	26	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290627	2029-06-27	27	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290628	2029-06-28	28	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290629	2029-06-29	29	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	f
20290630	2029-06-30	30	6	มิถุนายน	2	2029	2572	2572	2029	Q3	2572	t
20290701	2029-07-01	1	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290702	2029-07-02	2	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290703	2029-07-03	3	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290704	2029-07-04	4	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290705	2029-07-05	5	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290706	2029-07-06	6	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290707	2029-07-07	7	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290708	2029-07-08	8	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290709	2029-07-09	9	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290710	2029-07-10	10	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290711	2029-07-11	11	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290712	2029-07-12	12	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290713	2029-07-13	13	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290714	2029-07-14	14	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290715	2029-07-15	15	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290716	2029-07-16	16	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290717	2029-07-17	17	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290718	2029-07-18	18	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290719	2029-07-19	19	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290720	2029-07-20	20	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290721	2029-07-21	21	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290722	2029-07-22	22	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290723	2029-07-23	23	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290724	2029-07-24	24	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290725	2029-07-25	25	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290726	2029-07-26	26	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290727	2029-07-27	27	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290728	2029-07-28	28	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290729	2029-07-29	29	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	t
20290730	2029-07-30	30	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290731	2029-07-31	31	7	กรกฎาคม	3	2029	2572	2572	2029	Q4	2572	f
20290801	2029-08-01	1	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290802	2029-08-02	2	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290803	2029-08-03	3	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290804	2029-08-04	4	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290805	2029-08-05	5	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290806	2029-08-06	6	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290807	2029-08-07	7	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290808	2029-08-08	8	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290809	2029-08-09	9	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290810	2029-08-10	10	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290811	2029-08-11	11	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290812	2029-08-12	12	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290813	2029-08-13	13	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290814	2029-08-14	14	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290815	2029-08-15	15	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290816	2029-08-16	16	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290817	2029-08-17	17	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290818	2029-08-18	18	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290819	2029-08-19	19	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290820	2029-08-20	20	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290821	2029-08-21	21	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290822	2029-08-22	22	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290823	2029-08-23	23	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290824	2029-08-24	24	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290825	2029-08-25	25	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290826	2029-08-26	26	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	t
20290827	2029-08-27	27	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290828	2029-08-28	28	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290829	2029-08-29	29	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290830	2029-08-30	30	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290831	2029-08-31	31	8	สิงหาคม	3	2029	2572	2572	2029	Q4	2572	f
20290901	2029-09-01	1	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290902	2029-09-02	2	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290903	2029-09-03	3	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290904	2029-09-04	4	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290905	2029-09-05	5	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290906	2029-09-06	6	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290907	2029-09-07	7	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290908	2029-09-08	8	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290909	2029-09-09	9	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290910	2029-09-10	10	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290911	2029-09-11	11	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290912	2029-09-12	12	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290913	2029-09-13	13	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290914	2029-09-14	14	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290915	2029-09-15	15	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290916	2029-09-16	16	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290917	2029-09-17	17	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290918	2029-09-18	18	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290919	2029-09-19	19	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290920	2029-09-20	20	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290921	2029-09-21	21	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290922	2029-09-22	22	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290923	2029-09-23	23	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290924	2029-09-24	24	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290925	2029-09-25	25	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290926	2029-09-26	26	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290927	2029-09-27	27	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290928	2029-09-28	28	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	f
20290929	2029-09-29	29	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20290930	2029-09-30	30	9	กันยายน	3	2029	2572	2572	2029	Q4	2572	t
20291001	2029-10-01	1	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291002	2029-10-02	2	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291003	2029-10-03	3	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291004	2029-10-04	4	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291005	2029-10-05	5	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291006	2029-10-06	6	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291007	2029-10-07	7	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291008	2029-10-08	8	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291009	2029-10-09	9	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291010	2029-10-10	10	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291011	2029-10-11	11	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291012	2029-10-12	12	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291013	2029-10-13	13	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291014	2029-10-14	14	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291015	2029-10-15	15	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291016	2029-10-16	16	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291017	2029-10-17	17	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291018	2029-10-18	18	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291019	2029-10-19	19	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291020	2029-10-20	20	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291021	2029-10-21	21	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291022	2029-10-22	22	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291023	2029-10-23	23	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291024	2029-10-24	24	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291025	2029-10-25	25	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291026	2029-10-26	26	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291027	2029-10-27	27	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291028	2029-10-28	28	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	t
20291029	2029-10-29	29	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291030	2029-10-30	30	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291031	2029-10-31	31	10	ตุลาคม	4	2029	2572	2573	2030	Q1	2572	f
20291101	2029-11-01	1	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291102	2029-11-02	2	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291103	2029-11-03	3	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291104	2029-11-04	4	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291105	2029-11-05	5	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291106	2029-11-06	6	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291107	2029-11-07	7	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291108	2029-11-08	8	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291109	2029-11-09	9	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291110	2029-11-10	10	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291111	2029-11-11	11	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291112	2029-11-12	12	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291113	2029-11-13	13	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291114	2029-11-14	14	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291115	2029-11-15	15	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291116	2029-11-16	16	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291117	2029-11-17	17	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291118	2029-11-18	18	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291119	2029-11-19	19	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291120	2029-11-20	20	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291121	2029-11-21	21	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291122	2029-11-22	22	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291123	2029-11-23	23	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291124	2029-11-24	24	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291125	2029-11-25	25	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	t
20291126	2029-11-26	26	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291127	2029-11-27	27	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291128	2029-11-28	28	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291129	2029-11-29	29	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291130	2029-11-30	30	11	พฤศจิกายน	4	2029	2572	2573	2030	Q1	2572	f
20291201	2029-12-01	1	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291202	2029-12-02	2	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291203	2029-12-03	3	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291204	2029-12-04	4	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291205	2029-12-05	5	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291206	2029-12-06	6	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291207	2029-12-07	7	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291208	2029-12-08	8	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291209	2029-12-09	9	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291210	2029-12-10	10	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291211	2029-12-11	11	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291212	2029-12-12	12	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291213	2029-12-13	13	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291214	2029-12-14	14	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291215	2029-12-15	15	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291216	2029-12-16	16	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291217	2029-12-17	17	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291218	2029-12-18	18	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291219	2029-12-19	19	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291220	2029-12-20	20	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291221	2029-12-21	21	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291222	2029-12-22	22	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291223	2029-12-23	23	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291224	2029-12-24	24	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291225	2029-12-25	25	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291226	2029-12-26	26	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291227	2029-12-27	27	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291228	2029-12-28	28	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20291229	2029-12-29	29	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291230	2029-12-30	30	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	t
20291231	2029-12-31	31	12	ธันวาคม	4	2029	2572	2573	2030	Q1	2572	f
20300101	2030-01-01	1	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300102	2030-01-02	2	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300103	2030-01-03	3	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300104	2030-01-04	4	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300105	2030-01-05	5	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300106	2030-01-06	6	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300107	2030-01-07	7	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300108	2030-01-08	8	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300109	2030-01-09	9	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300110	2030-01-10	10	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300111	2030-01-11	11	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300112	2030-01-12	12	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300113	2030-01-13	13	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300114	2030-01-14	14	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300115	2030-01-15	15	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300116	2030-01-16	16	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300117	2030-01-17	17	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300118	2030-01-18	18	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300119	2030-01-19	19	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300120	2030-01-20	20	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300121	2030-01-21	21	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300122	2030-01-22	22	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300123	2030-01-23	23	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300124	2030-01-24	24	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300125	2030-01-25	25	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300126	2030-01-26	26	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300127	2030-01-27	27	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	t
20300128	2030-01-28	28	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300129	2030-01-29	29	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300130	2030-01-30	30	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300131	2030-01-31	31	1	มกราคม	1	2030	2573	2573	2030	Q2	2572	f
20300201	2030-02-01	1	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300202	2030-02-02	2	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300203	2030-02-03	3	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300204	2030-02-04	4	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300205	2030-02-05	5	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300206	2030-02-06	6	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300207	2030-02-07	7	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300208	2030-02-08	8	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300209	2030-02-09	9	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300210	2030-02-10	10	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300211	2030-02-11	11	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300212	2030-02-12	12	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300213	2030-02-13	13	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300214	2030-02-14	14	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300215	2030-02-15	15	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300216	2030-02-16	16	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300217	2030-02-17	17	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300218	2030-02-18	18	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300219	2030-02-19	19	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300220	2030-02-20	20	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300221	2030-02-21	21	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300222	2030-02-22	22	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300223	2030-02-23	23	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300224	2030-02-24	24	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	t
20300225	2030-02-25	25	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300226	2030-02-26	26	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300227	2030-02-27	27	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300228	2030-02-28	28	2	กุมภาพันธ์	1	2030	2573	2573	2030	Q2	2572	f
20300301	2030-03-01	1	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300302	2030-03-02	2	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300303	2030-03-03	3	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300304	2030-03-04	4	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300305	2030-03-05	5	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300306	2030-03-06	6	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300307	2030-03-07	7	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300308	2030-03-08	8	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300309	2030-03-09	9	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300310	2030-03-10	10	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300311	2030-03-11	11	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300312	2030-03-12	12	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300313	2030-03-13	13	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300314	2030-03-14	14	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300315	2030-03-15	15	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300316	2030-03-16	16	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300317	2030-03-17	17	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300318	2030-03-18	18	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300319	2030-03-19	19	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300320	2030-03-20	20	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300321	2030-03-21	21	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300322	2030-03-22	22	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300323	2030-03-23	23	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300324	2030-03-24	24	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300325	2030-03-25	25	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300326	2030-03-26	26	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300327	2030-03-27	27	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300328	2030-03-28	28	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300329	2030-03-29	29	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	f
20300330	2030-03-30	30	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300331	2030-03-31	31	3	มีนาคม	1	2030	2573	2573	2030	Q2	2572	t
20300401	2030-04-01	1	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300402	2030-04-02	2	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300403	2030-04-03	3	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300404	2030-04-04	4	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300405	2030-04-05	5	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300406	2030-04-06	6	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300407	2030-04-07	7	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300408	2030-04-08	8	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300409	2030-04-09	9	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300410	2030-04-10	10	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300411	2030-04-11	11	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300412	2030-04-12	12	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300413	2030-04-13	13	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300414	2030-04-14	14	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300415	2030-04-15	15	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300416	2030-04-16	16	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300417	2030-04-17	17	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300418	2030-04-18	18	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300419	2030-04-19	19	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300420	2030-04-20	20	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300421	2030-04-21	21	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300422	2030-04-22	22	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300423	2030-04-23	23	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300424	2030-04-24	24	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300425	2030-04-25	25	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300426	2030-04-26	26	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300427	2030-04-27	27	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300428	2030-04-28	28	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	t
20300429	2030-04-29	29	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300430	2030-04-30	30	4	เมษายน	2	2030	2573	2573	2030	Q3	2572	f
20300501	2030-05-01	1	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300502	2030-05-02	2	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300503	2030-05-03	3	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300504	2030-05-04	4	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300505	2030-05-05	5	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300506	2030-05-06	6	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300507	2030-05-07	7	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300508	2030-05-08	8	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300509	2030-05-09	9	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300510	2030-05-10	10	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300511	2030-05-11	11	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300512	2030-05-12	12	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300513	2030-05-13	13	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300514	2030-05-14	14	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300515	2030-05-15	15	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300516	2030-05-16	16	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300517	2030-05-17	17	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300518	2030-05-18	18	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300519	2030-05-19	19	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300520	2030-05-20	20	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300521	2030-05-21	21	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300522	2030-05-22	22	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300523	2030-05-23	23	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300524	2030-05-24	24	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300525	2030-05-25	25	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300526	2030-05-26	26	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	t
20300527	2030-05-27	27	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300528	2030-05-28	28	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300529	2030-05-29	29	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300530	2030-05-30	30	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300531	2030-05-31	31	5	พฤษภาคม	2	2030	2573	2573	2030	Q3	2572	f
20300601	2030-06-01	1	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300602	2030-06-02	2	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300603	2030-06-03	3	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300604	2030-06-04	4	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300605	2030-06-05	5	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300606	2030-06-06	6	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300607	2030-06-07	7	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300608	2030-06-08	8	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300609	2030-06-09	9	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300610	2030-06-10	10	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300611	2030-06-11	11	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300612	2030-06-12	12	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300613	2030-06-13	13	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300614	2030-06-14	14	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300615	2030-06-15	15	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300616	2030-06-16	16	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300617	2030-06-17	17	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300618	2030-06-18	18	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300619	2030-06-19	19	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300620	2030-06-20	20	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300621	2030-06-21	21	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300622	2030-06-22	22	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300623	2030-06-23	23	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300624	2030-06-24	24	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300625	2030-06-25	25	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300626	2030-06-26	26	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300627	2030-06-27	27	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300628	2030-06-28	28	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	f
20300629	2030-06-29	29	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300630	2030-06-30	30	6	มิถุนายน	2	2030	2573	2573	2030	Q3	2573	t
20300701	2030-07-01	1	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300702	2030-07-02	2	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300703	2030-07-03	3	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300704	2030-07-04	4	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300705	2030-07-05	5	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300706	2030-07-06	6	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300707	2030-07-07	7	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300708	2030-07-08	8	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300709	2030-07-09	9	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300710	2030-07-10	10	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300711	2030-07-11	11	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300712	2030-07-12	12	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300713	2030-07-13	13	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300714	2030-07-14	14	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300715	2030-07-15	15	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300716	2030-07-16	16	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300717	2030-07-17	17	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300718	2030-07-18	18	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300719	2030-07-19	19	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300720	2030-07-20	20	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300721	2030-07-21	21	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300722	2030-07-22	22	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300723	2030-07-23	23	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300724	2030-07-24	24	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300725	2030-07-25	25	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300726	2030-07-26	26	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300727	2030-07-27	27	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300728	2030-07-28	28	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	t
20300729	2030-07-29	29	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300730	2030-07-30	30	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300731	2030-07-31	31	7	กรกฎาคม	3	2030	2573	2573	2030	Q4	2573	f
20300801	2030-08-01	1	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300802	2030-08-02	2	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300803	2030-08-03	3	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300804	2030-08-04	4	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300805	2030-08-05	5	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300806	2030-08-06	6	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300807	2030-08-07	7	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300808	2030-08-08	8	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300809	2030-08-09	9	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300810	2030-08-10	10	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300811	2030-08-11	11	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300812	2030-08-12	12	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300813	2030-08-13	13	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300814	2030-08-14	14	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300815	2030-08-15	15	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300816	2030-08-16	16	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300817	2030-08-17	17	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300818	2030-08-18	18	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300819	2030-08-19	19	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300820	2030-08-20	20	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300821	2030-08-21	21	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300822	2030-08-22	22	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300823	2030-08-23	23	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300824	2030-08-24	24	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300825	2030-08-25	25	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300826	2030-08-26	26	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300827	2030-08-27	27	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300828	2030-08-28	28	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300829	2030-08-29	29	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300830	2030-08-30	30	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	f
20300831	2030-08-31	31	8	สิงหาคม	3	2030	2573	2573	2030	Q4	2573	t
20300901	2030-09-01	1	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300902	2030-09-02	2	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300903	2030-09-03	3	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300904	2030-09-04	4	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300905	2030-09-05	5	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300906	2030-09-06	6	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300907	2030-09-07	7	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300908	2030-09-08	8	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300909	2030-09-09	9	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300910	2030-09-10	10	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300911	2030-09-11	11	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300912	2030-09-12	12	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300913	2030-09-13	13	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300914	2030-09-14	14	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300915	2030-09-15	15	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300916	2030-09-16	16	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300917	2030-09-17	17	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300918	2030-09-18	18	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300919	2030-09-19	19	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300920	2030-09-20	20	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300921	2030-09-21	21	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300922	2030-09-22	22	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300923	2030-09-23	23	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300924	2030-09-24	24	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300925	2030-09-25	25	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300926	2030-09-26	26	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300927	2030-09-27	27	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20300928	2030-09-28	28	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300929	2030-09-29	29	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	t
20300930	2030-09-30	30	9	กันยายน	3	2030	2573	2573	2030	Q4	2573	f
20301001	2030-10-01	1	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301002	2030-10-02	2	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301003	2030-10-03	3	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301004	2030-10-04	4	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301005	2030-10-05	5	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301006	2030-10-06	6	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301007	2030-10-07	7	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301008	2030-10-08	8	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301009	2030-10-09	9	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301010	2030-10-10	10	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301011	2030-10-11	11	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301012	2030-10-12	12	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301013	2030-10-13	13	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301014	2030-10-14	14	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301015	2030-10-15	15	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301016	2030-10-16	16	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301017	2030-10-17	17	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301018	2030-10-18	18	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301019	2030-10-19	19	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301020	2030-10-20	20	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301021	2030-10-21	21	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301022	2030-10-22	22	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301023	2030-10-23	23	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301024	2030-10-24	24	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301025	2030-10-25	25	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301026	2030-10-26	26	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301027	2030-10-27	27	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	t
20301028	2030-10-28	28	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301029	2030-10-29	29	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301030	2030-10-30	30	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301031	2030-10-31	31	10	ตุลาคม	4	2030	2573	2574	2031	Q1	2573	f
20301101	2030-11-01	1	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301102	2030-11-02	2	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301103	2030-11-03	3	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301104	2030-11-04	4	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301105	2030-11-05	5	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301106	2030-11-06	6	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301107	2030-11-07	7	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301108	2030-11-08	8	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301109	2030-11-09	9	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301110	2030-11-10	10	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301111	2030-11-11	11	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301112	2030-11-12	12	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301113	2030-11-13	13	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301114	2030-11-14	14	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301115	2030-11-15	15	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301116	2030-11-16	16	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301117	2030-11-17	17	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301118	2030-11-18	18	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301119	2030-11-19	19	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301120	2030-11-20	20	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301121	2030-11-21	21	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301122	2030-11-22	22	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301123	2030-11-23	23	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301124	2030-11-24	24	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301125	2030-11-25	25	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301126	2030-11-26	26	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301127	2030-11-27	27	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301128	2030-11-28	28	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301129	2030-11-29	29	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	f
20301130	2030-11-30	30	11	พฤศจิกายน	4	2030	2573	2574	2031	Q1	2573	t
20301201	2030-12-01	1	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301202	2030-12-02	2	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301203	2030-12-03	3	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301204	2030-12-04	4	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301205	2030-12-05	5	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301206	2030-12-06	6	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301207	2030-12-07	7	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301208	2030-12-08	8	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301209	2030-12-09	9	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301210	2030-12-10	10	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301211	2030-12-11	11	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301212	2030-12-12	12	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301213	2030-12-13	13	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301214	2030-12-14	14	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301215	2030-12-15	15	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301216	2030-12-16	16	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301217	2030-12-17	17	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301218	2030-12-18	18	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301219	2030-12-19	19	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301220	2030-12-20	20	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301221	2030-12-21	21	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301222	2030-12-22	22	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301223	2030-12-23	23	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301224	2030-12-24	24	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301225	2030-12-25	25	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301226	2030-12-26	26	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301227	2030-12-27	27	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301228	2030-12-28	28	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301229	2030-12-29	29	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	t
20301230	2030-12-30	30	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20301231	2030-12-31	31	12	ธันวาคม	4	2030	2573	2574	2031	Q1	2573	f
20310101	2031-01-01	1	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310102	2031-01-02	2	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310103	2031-01-03	3	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310104	2031-01-04	4	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310105	2031-01-05	5	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310106	2031-01-06	6	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310107	2031-01-07	7	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310108	2031-01-08	8	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310109	2031-01-09	9	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310110	2031-01-10	10	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310111	2031-01-11	11	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310112	2031-01-12	12	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310113	2031-01-13	13	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310114	2031-01-14	14	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310115	2031-01-15	15	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310116	2031-01-16	16	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310117	2031-01-17	17	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310118	2031-01-18	18	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310119	2031-01-19	19	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310120	2031-01-20	20	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310121	2031-01-21	21	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310122	2031-01-22	22	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310123	2031-01-23	23	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310124	2031-01-24	24	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310125	2031-01-25	25	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310126	2031-01-26	26	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	t
20310127	2031-01-27	27	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310128	2031-01-28	28	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310129	2031-01-29	29	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310130	2031-01-30	30	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310131	2031-01-31	31	1	มกราคม	1	2031	2574	2574	2031	Q2	2573	f
20310201	2031-02-01	1	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310202	2031-02-02	2	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310203	2031-02-03	3	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310204	2031-02-04	4	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310205	2031-02-05	5	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310206	2031-02-06	6	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310207	2031-02-07	7	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310208	2031-02-08	8	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310209	2031-02-09	9	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310210	2031-02-10	10	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310211	2031-02-11	11	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310212	2031-02-12	12	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310213	2031-02-13	13	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310214	2031-02-14	14	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310215	2031-02-15	15	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310216	2031-02-16	16	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310217	2031-02-17	17	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310218	2031-02-18	18	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310219	2031-02-19	19	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310220	2031-02-20	20	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310221	2031-02-21	21	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310222	2031-02-22	22	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310223	2031-02-23	23	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	t
20310224	2031-02-24	24	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310225	2031-02-25	25	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310226	2031-02-26	26	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310227	2031-02-27	27	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310228	2031-02-28	28	2	กุมภาพันธ์	1	2031	2574	2574	2031	Q2	2573	f
20310301	2031-03-01	1	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310302	2031-03-02	2	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310303	2031-03-03	3	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310304	2031-03-04	4	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310305	2031-03-05	5	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310306	2031-03-06	6	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310307	2031-03-07	7	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310308	2031-03-08	8	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310309	2031-03-09	9	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310310	2031-03-10	10	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310311	2031-03-11	11	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310312	2031-03-12	12	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310313	2031-03-13	13	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310314	2031-03-14	14	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310315	2031-03-15	15	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310316	2031-03-16	16	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310317	2031-03-17	17	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310318	2031-03-18	18	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310319	2031-03-19	19	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310320	2031-03-20	20	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310321	2031-03-21	21	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310322	2031-03-22	22	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310323	2031-03-23	23	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310324	2031-03-24	24	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310325	2031-03-25	25	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310326	2031-03-26	26	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310327	2031-03-27	27	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310328	2031-03-28	28	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310329	2031-03-29	29	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310330	2031-03-30	30	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	t
20310331	2031-03-31	31	3	มีนาคม	1	2031	2574	2574	2031	Q2	2573	f
20310401	2031-04-01	1	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310402	2031-04-02	2	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310403	2031-04-03	3	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310404	2031-04-04	4	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310405	2031-04-05	5	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310406	2031-04-06	6	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310407	2031-04-07	7	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310408	2031-04-08	8	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310409	2031-04-09	9	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310410	2031-04-10	10	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310411	2031-04-11	11	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310412	2031-04-12	12	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310413	2031-04-13	13	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310414	2031-04-14	14	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310415	2031-04-15	15	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310416	2031-04-16	16	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310417	2031-04-17	17	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310418	2031-04-18	18	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310419	2031-04-19	19	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310420	2031-04-20	20	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310421	2031-04-21	21	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310422	2031-04-22	22	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310423	2031-04-23	23	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310424	2031-04-24	24	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310425	2031-04-25	25	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310426	2031-04-26	26	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310427	2031-04-27	27	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	t
20310428	2031-04-28	28	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310429	2031-04-29	29	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310430	2031-04-30	30	4	เมษายน	2	2031	2574	2574	2031	Q3	2573	f
20310501	2031-05-01	1	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310502	2031-05-02	2	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310503	2031-05-03	3	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310504	2031-05-04	4	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310505	2031-05-05	5	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310506	2031-05-06	6	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310507	2031-05-07	7	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310508	2031-05-08	8	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310509	2031-05-09	9	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310510	2031-05-10	10	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310511	2031-05-11	11	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310512	2031-05-12	12	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310513	2031-05-13	13	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310514	2031-05-14	14	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310515	2031-05-15	15	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310516	2031-05-16	16	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310517	2031-05-17	17	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310518	2031-05-18	18	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310519	2031-05-19	19	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310520	2031-05-20	20	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310521	2031-05-21	21	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310522	2031-05-22	22	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310523	2031-05-23	23	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310524	2031-05-24	24	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310525	2031-05-25	25	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310526	2031-05-26	26	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310527	2031-05-27	27	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310528	2031-05-28	28	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310529	2031-05-29	29	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310530	2031-05-30	30	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	f
20310531	2031-05-31	31	5	พฤษภาคม	2	2031	2574	2574	2031	Q3	2573	t
20310601	2031-06-01	1	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310602	2031-06-02	2	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310603	2031-06-03	3	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310604	2031-06-04	4	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310605	2031-06-05	5	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310606	2031-06-06	6	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310607	2031-06-07	7	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310608	2031-06-08	8	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310609	2031-06-09	9	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310610	2031-06-10	10	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310611	2031-06-11	11	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310612	2031-06-12	12	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310613	2031-06-13	13	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310614	2031-06-14	14	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310615	2031-06-15	15	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310616	2031-06-16	16	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310617	2031-06-17	17	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310618	2031-06-18	18	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310619	2031-06-19	19	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310620	2031-06-20	20	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310621	2031-06-21	21	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310622	2031-06-22	22	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310623	2031-06-23	23	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310624	2031-06-24	24	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310625	2031-06-25	25	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310626	2031-06-26	26	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310627	2031-06-27	27	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310628	2031-06-28	28	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310629	2031-06-29	29	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	t
20310630	2031-06-30	30	6	มิถุนายน	2	2031	2574	2574	2031	Q3	2574	f
20310701	2031-07-01	1	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310702	2031-07-02	2	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310703	2031-07-03	3	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310704	2031-07-04	4	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310705	2031-07-05	5	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310706	2031-07-06	6	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310707	2031-07-07	7	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310708	2031-07-08	8	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310709	2031-07-09	9	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310710	2031-07-10	10	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310711	2031-07-11	11	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310712	2031-07-12	12	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310713	2031-07-13	13	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310714	2031-07-14	14	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310715	2031-07-15	15	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310716	2031-07-16	16	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310717	2031-07-17	17	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310718	2031-07-18	18	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310719	2031-07-19	19	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310720	2031-07-20	20	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310721	2031-07-21	21	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310722	2031-07-22	22	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310723	2031-07-23	23	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310724	2031-07-24	24	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310725	2031-07-25	25	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310726	2031-07-26	26	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310727	2031-07-27	27	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	t
20310728	2031-07-28	28	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310729	2031-07-29	29	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310730	2031-07-30	30	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310731	2031-07-31	31	7	กรกฎาคม	3	2031	2574	2574	2031	Q4	2574	f
20310801	2031-08-01	1	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310802	2031-08-02	2	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310803	2031-08-03	3	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310804	2031-08-04	4	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310805	2031-08-05	5	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310806	2031-08-06	6	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310807	2031-08-07	7	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310808	2031-08-08	8	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310809	2031-08-09	9	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310810	2031-08-10	10	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310811	2031-08-11	11	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310812	2031-08-12	12	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310813	2031-08-13	13	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310814	2031-08-14	14	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310815	2031-08-15	15	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310816	2031-08-16	16	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310817	2031-08-17	17	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310818	2031-08-18	18	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310819	2031-08-19	19	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310820	2031-08-20	20	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310821	2031-08-21	21	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310822	2031-08-22	22	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310823	2031-08-23	23	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310824	2031-08-24	24	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310825	2031-08-25	25	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310826	2031-08-26	26	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310827	2031-08-27	27	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310828	2031-08-28	28	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310829	2031-08-29	29	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	f
20310830	2031-08-30	30	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310831	2031-08-31	31	8	สิงหาคม	3	2031	2574	2574	2031	Q4	2574	t
20310901	2031-09-01	1	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310902	2031-09-02	2	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310903	2031-09-03	3	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310904	2031-09-04	4	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310905	2031-09-05	5	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310906	2031-09-06	6	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310907	2031-09-07	7	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310908	2031-09-08	8	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310909	2031-09-09	9	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310910	2031-09-10	10	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310911	2031-09-11	11	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310912	2031-09-12	12	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310913	2031-09-13	13	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310914	2031-09-14	14	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310915	2031-09-15	15	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310916	2031-09-16	16	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310917	2031-09-17	17	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310918	2031-09-18	18	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310919	2031-09-19	19	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310920	2031-09-20	20	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310921	2031-09-21	21	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310922	2031-09-22	22	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310923	2031-09-23	23	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310924	2031-09-24	24	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310925	2031-09-25	25	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310926	2031-09-26	26	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310927	2031-09-27	27	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310928	2031-09-28	28	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	t
20310929	2031-09-29	29	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20310930	2031-09-30	30	9	กันยายน	3	2031	2574	2574	2031	Q4	2574	f
20311001	2031-10-01	1	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311002	2031-10-02	2	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311003	2031-10-03	3	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311004	2031-10-04	4	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311005	2031-10-05	5	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311006	2031-10-06	6	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311007	2031-10-07	7	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311008	2031-10-08	8	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311009	2031-10-09	9	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311010	2031-10-10	10	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311011	2031-10-11	11	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311012	2031-10-12	12	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311013	2031-10-13	13	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311014	2031-10-14	14	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311015	2031-10-15	15	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311016	2031-10-16	16	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311017	2031-10-17	17	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311018	2031-10-18	18	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311019	2031-10-19	19	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311020	2031-10-20	20	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311021	2031-10-21	21	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311022	2031-10-22	22	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311023	2031-10-23	23	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311024	2031-10-24	24	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311025	2031-10-25	25	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311026	2031-10-26	26	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	t
20311027	2031-10-27	27	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311028	2031-10-28	28	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311029	2031-10-29	29	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311030	2031-10-30	30	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311031	2031-10-31	31	10	ตุลาคม	4	2031	2574	2575	2032	Q1	2574	f
20311101	2031-11-01	1	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311102	2031-11-02	2	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311103	2031-11-03	3	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311104	2031-11-04	4	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311105	2031-11-05	5	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311106	2031-11-06	6	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311107	2031-11-07	7	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311108	2031-11-08	8	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311109	2031-11-09	9	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311110	2031-11-10	10	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311111	2031-11-11	11	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311112	2031-11-12	12	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311113	2031-11-13	13	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311114	2031-11-14	14	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311115	2031-11-15	15	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311116	2031-11-16	16	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311117	2031-11-17	17	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311118	2031-11-18	18	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311119	2031-11-19	19	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311120	2031-11-20	20	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311121	2031-11-21	21	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311122	2031-11-22	22	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311123	2031-11-23	23	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311124	2031-11-24	24	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311125	2031-11-25	25	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311126	2031-11-26	26	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311127	2031-11-27	27	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311128	2031-11-28	28	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	f
20311129	2031-11-29	29	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311130	2031-11-30	30	11	พฤศจิกายน	4	2031	2574	2575	2032	Q1	2574	t
20311201	2031-12-01	1	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311202	2031-12-02	2	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311203	2031-12-03	3	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311204	2031-12-04	4	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311205	2031-12-05	5	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311206	2031-12-06	6	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311207	2031-12-07	7	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311208	2031-12-08	8	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311209	2031-12-09	9	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311210	2031-12-10	10	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311211	2031-12-11	11	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311212	2031-12-12	12	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311213	2031-12-13	13	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311214	2031-12-14	14	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311215	2031-12-15	15	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311216	2031-12-16	16	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311217	2031-12-17	17	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311218	2031-12-18	18	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311219	2031-12-19	19	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311220	2031-12-20	20	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311221	2031-12-21	21	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311222	2031-12-22	22	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311223	2031-12-23	23	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311224	2031-12-24	24	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311225	2031-12-25	25	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311226	2031-12-26	26	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311227	2031-12-27	27	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311228	2031-12-28	28	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	t
20311229	2031-12-29	29	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311230	2031-12-30	30	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20311231	2031-12-31	31	12	ธันวาคม	4	2031	2574	2575	2032	Q1	2574	f
20320101	2032-01-01	1	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320102	2032-01-02	2	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320103	2032-01-03	3	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320104	2032-01-04	4	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320105	2032-01-05	5	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320106	2032-01-06	6	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320107	2032-01-07	7	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320108	2032-01-08	8	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320109	2032-01-09	9	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320110	2032-01-10	10	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320111	2032-01-11	11	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320112	2032-01-12	12	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320113	2032-01-13	13	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320114	2032-01-14	14	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320115	2032-01-15	15	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320116	2032-01-16	16	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320117	2032-01-17	17	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320118	2032-01-18	18	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320119	2032-01-19	19	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320120	2032-01-20	20	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320121	2032-01-21	21	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320122	2032-01-22	22	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320123	2032-01-23	23	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320124	2032-01-24	24	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320125	2032-01-25	25	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320126	2032-01-26	26	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320127	2032-01-27	27	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320128	2032-01-28	28	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320129	2032-01-29	29	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320130	2032-01-30	30	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	f
20320131	2032-01-31	31	1	มกราคม	1	2032	2575	2575	2032	Q2	2574	t
20320201	2032-02-01	1	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320202	2032-02-02	2	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320203	2032-02-03	3	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320204	2032-02-04	4	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320205	2032-02-05	5	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320206	2032-02-06	6	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320207	2032-02-07	7	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320208	2032-02-08	8	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320209	2032-02-09	9	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320210	2032-02-10	10	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320211	2032-02-11	11	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320212	2032-02-12	12	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320213	2032-02-13	13	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320214	2032-02-14	14	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320215	2032-02-15	15	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320216	2032-02-16	16	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320217	2032-02-17	17	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320218	2032-02-18	18	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320219	2032-02-19	19	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320220	2032-02-20	20	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320221	2032-02-21	21	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320222	2032-02-22	22	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320223	2032-02-23	23	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320224	2032-02-24	24	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320225	2032-02-25	25	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320226	2032-02-26	26	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320227	2032-02-27	27	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	f
20320228	2032-02-28	28	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320229	2032-02-29	29	2	กุมภาพันธ์	1	2032	2575	2575	2032	Q2	2574	t
20320301	2032-03-01	1	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320302	2032-03-02	2	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320303	2032-03-03	3	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320304	2032-03-04	4	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320305	2032-03-05	5	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320306	2032-03-06	6	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320307	2032-03-07	7	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320308	2032-03-08	8	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320309	2032-03-09	9	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320310	2032-03-10	10	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320311	2032-03-11	11	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320312	2032-03-12	12	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320313	2032-03-13	13	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320314	2032-03-14	14	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320315	2032-03-15	15	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320316	2032-03-16	16	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320317	2032-03-17	17	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320318	2032-03-18	18	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320319	2032-03-19	19	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320320	2032-03-20	20	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320321	2032-03-21	21	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320322	2032-03-22	22	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320323	2032-03-23	23	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320324	2032-03-24	24	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320325	2032-03-25	25	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320326	2032-03-26	26	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320327	2032-03-27	27	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320328	2032-03-28	28	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	t
20320329	2032-03-29	29	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320330	2032-03-30	30	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320331	2032-03-31	31	3	มีนาคม	1	2032	2575	2575	2032	Q2	2574	f
20320401	2032-04-01	1	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320402	2032-04-02	2	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320403	2032-04-03	3	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320404	2032-04-04	4	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320405	2032-04-05	5	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320406	2032-04-06	6	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320407	2032-04-07	7	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320408	2032-04-08	8	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320409	2032-04-09	9	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320410	2032-04-10	10	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320411	2032-04-11	11	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320412	2032-04-12	12	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320413	2032-04-13	13	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320414	2032-04-14	14	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320415	2032-04-15	15	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320416	2032-04-16	16	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320417	2032-04-17	17	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320418	2032-04-18	18	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320419	2032-04-19	19	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320420	2032-04-20	20	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320421	2032-04-21	21	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320422	2032-04-22	22	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320423	2032-04-23	23	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320424	2032-04-24	24	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320425	2032-04-25	25	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	t
20320426	2032-04-26	26	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320427	2032-04-27	27	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320428	2032-04-28	28	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320429	2032-04-29	29	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320430	2032-04-30	30	4	เมษายน	2	2032	2575	2575	2032	Q3	2574	f
20320501	2032-05-01	1	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320502	2032-05-02	2	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320503	2032-05-03	3	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320504	2032-05-04	4	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320505	2032-05-05	5	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320506	2032-05-06	6	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320507	2032-05-07	7	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320508	2032-05-08	8	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320509	2032-05-09	9	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320510	2032-05-10	10	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320511	2032-05-11	11	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320512	2032-05-12	12	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320513	2032-05-13	13	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320514	2032-05-14	14	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320515	2032-05-15	15	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320516	2032-05-16	16	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320517	2032-05-17	17	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320518	2032-05-18	18	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320519	2032-05-19	19	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320520	2032-05-20	20	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320521	2032-05-21	21	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320522	2032-05-22	22	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320523	2032-05-23	23	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320524	2032-05-24	24	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320525	2032-05-25	25	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320526	2032-05-26	26	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320527	2032-05-27	27	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320528	2032-05-28	28	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320529	2032-05-29	29	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320530	2032-05-30	30	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	t
20320531	2032-05-31	31	5	พฤษภาคม	2	2032	2575	2575	2032	Q3	2574	f
20320601	2032-06-01	1	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320602	2032-06-02	2	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320603	2032-06-03	3	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320604	2032-06-04	4	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320605	2032-06-05	5	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320606	2032-06-06	6	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320607	2032-06-07	7	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320608	2032-06-08	8	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320609	2032-06-09	9	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320610	2032-06-10	10	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320611	2032-06-11	11	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320612	2032-06-12	12	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320613	2032-06-13	13	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320614	2032-06-14	14	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320615	2032-06-15	15	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320616	2032-06-16	16	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320617	2032-06-17	17	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320618	2032-06-18	18	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320619	2032-06-19	19	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320620	2032-06-20	20	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320621	2032-06-21	21	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320622	2032-06-22	22	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320623	2032-06-23	23	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320624	2032-06-24	24	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320625	2032-06-25	25	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320626	2032-06-26	26	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320627	2032-06-27	27	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	t
20320628	2032-06-28	28	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320629	2032-06-29	29	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320630	2032-06-30	30	6	มิถุนายน	2	2032	2575	2575	2032	Q3	2575	f
20320701	2032-07-01	1	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320702	2032-07-02	2	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320703	2032-07-03	3	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320704	2032-07-04	4	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320705	2032-07-05	5	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320706	2032-07-06	6	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320707	2032-07-07	7	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320708	2032-07-08	8	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320709	2032-07-09	9	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320710	2032-07-10	10	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320711	2032-07-11	11	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320712	2032-07-12	12	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320713	2032-07-13	13	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320714	2032-07-14	14	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320715	2032-07-15	15	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320716	2032-07-16	16	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320717	2032-07-17	17	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320718	2032-07-18	18	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320719	2032-07-19	19	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320720	2032-07-20	20	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320721	2032-07-21	21	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320722	2032-07-22	22	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320723	2032-07-23	23	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320724	2032-07-24	24	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320725	2032-07-25	25	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320726	2032-07-26	26	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320727	2032-07-27	27	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320728	2032-07-28	28	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320729	2032-07-29	29	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320730	2032-07-30	30	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	f
20320731	2032-07-31	31	7	กรกฎาคม	3	2032	2575	2575	2032	Q4	2575	t
20320801	2032-08-01	1	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320802	2032-08-02	2	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320803	2032-08-03	3	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320804	2032-08-04	4	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320805	2032-08-05	5	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320806	2032-08-06	6	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320807	2032-08-07	7	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320808	2032-08-08	8	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320809	2032-08-09	9	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320810	2032-08-10	10	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320811	2032-08-11	11	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320812	2032-08-12	12	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320813	2032-08-13	13	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320814	2032-08-14	14	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320815	2032-08-15	15	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320816	2032-08-16	16	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320817	2032-08-17	17	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320818	2032-08-18	18	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320819	2032-08-19	19	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320820	2032-08-20	20	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320821	2032-08-21	21	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320822	2032-08-22	22	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320823	2032-08-23	23	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320824	2032-08-24	24	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320825	2032-08-25	25	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320826	2032-08-26	26	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320827	2032-08-27	27	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320828	2032-08-28	28	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320829	2032-08-29	29	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	t
20320830	2032-08-30	30	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320831	2032-08-31	31	8	สิงหาคม	3	2032	2575	2575	2032	Q4	2575	f
20320901	2032-09-01	1	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320902	2032-09-02	2	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320903	2032-09-03	3	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320904	2032-09-04	4	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320905	2032-09-05	5	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320906	2032-09-06	6	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320907	2032-09-07	7	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320908	2032-09-08	8	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320909	2032-09-09	9	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320910	2032-09-10	10	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320911	2032-09-11	11	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320912	2032-09-12	12	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320913	2032-09-13	13	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320914	2032-09-14	14	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320915	2032-09-15	15	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320916	2032-09-16	16	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320917	2032-09-17	17	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320918	2032-09-18	18	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320919	2032-09-19	19	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320920	2032-09-20	20	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320921	2032-09-21	21	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320922	2032-09-22	22	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320923	2032-09-23	23	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320924	2032-09-24	24	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320925	2032-09-25	25	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320926	2032-09-26	26	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	t
20320927	2032-09-27	27	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320928	2032-09-28	28	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320929	2032-09-29	29	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20320930	2032-09-30	30	9	กันยายน	3	2032	2575	2575	2032	Q4	2575	f
20321001	2032-10-01	1	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321002	2032-10-02	2	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321003	2032-10-03	3	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321004	2032-10-04	4	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321005	2032-10-05	5	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321006	2032-10-06	6	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321007	2032-10-07	7	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321008	2032-10-08	8	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321009	2032-10-09	9	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321010	2032-10-10	10	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321011	2032-10-11	11	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321012	2032-10-12	12	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321013	2032-10-13	13	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321014	2032-10-14	14	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321015	2032-10-15	15	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321016	2032-10-16	16	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321017	2032-10-17	17	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321018	2032-10-18	18	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321019	2032-10-19	19	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321020	2032-10-20	20	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321021	2032-10-21	21	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321022	2032-10-22	22	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321023	2032-10-23	23	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321024	2032-10-24	24	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321025	2032-10-25	25	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321026	2032-10-26	26	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321027	2032-10-27	27	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321028	2032-10-28	28	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321029	2032-10-29	29	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	f
20321030	2032-10-30	30	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321031	2032-10-31	31	10	ตุลาคม	4	2032	2575	2576	2033	Q1	2575	t
20321101	2032-11-01	1	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321102	2032-11-02	2	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321103	2032-11-03	3	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321104	2032-11-04	4	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321105	2032-11-05	5	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321106	2032-11-06	6	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321107	2032-11-07	7	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321108	2032-11-08	8	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321109	2032-11-09	9	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321110	2032-11-10	10	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321111	2032-11-11	11	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321112	2032-11-12	12	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321113	2032-11-13	13	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321114	2032-11-14	14	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321115	2032-11-15	15	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321116	2032-11-16	16	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321117	2032-11-17	17	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321118	2032-11-18	18	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321119	2032-11-19	19	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321120	2032-11-20	20	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321121	2032-11-21	21	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321122	2032-11-22	22	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321123	2032-11-23	23	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321124	2032-11-24	24	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321125	2032-11-25	25	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321126	2032-11-26	26	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321127	2032-11-27	27	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321128	2032-11-28	28	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	t
20321129	2032-11-29	29	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321130	2032-11-30	30	11	พฤศจิกายน	4	2032	2575	2576	2033	Q1	2575	f
20321201	2032-12-01	1	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321202	2032-12-02	2	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321203	2032-12-03	3	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321204	2032-12-04	4	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321205	2032-12-05	5	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321206	2032-12-06	6	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321207	2032-12-07	7	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321208	2032-12-08	8	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321209	2032-12-09	9	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321210	2032-12-10	10	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321211	2032-12-11	11	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321212	2032-12-12	12	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321213	2032-12-13	13	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321214	2032-12-14	14	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321215	2032-12-15	15	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321216	2032-12-16	16	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321217	2032-12-17	17	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321218	2032-12-18	18	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321219	2032-12-19	19	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321220	2032-12-20	20	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321221	2032-12-21	21	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321222	2032-12-22	22	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321223	2032-12-23	23	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321224	2032-12-24	24	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321225	2032-12-25	25	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321226	2032-12-26	26	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	t
20321227	2032-12-27	27	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321228	2032-12-28	28	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321229	2032-12-29	29	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321230	2032-12-30	30	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20321231	2032-12-31	31	12	ธันวาคม	4	2032	2575	2576	2033	Q1	2575	f
20330101	2033-01-01	1	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330102	2033-01-02	2	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330103	2033-01-03	3	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330104	2033-01-04	4	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330105	2033-01-05	5	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330106	2033-01-06	6	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330107	2033-01-07	7	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330108	2033-01-08	8	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330109	2033-01-09	9	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330110	2033-01-10	10	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330111	2033-01-11	11	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330112	2033-01-12	12	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330113	2033-01-13	13	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330114	2033-01-14	14	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330115	2033-01-15	15	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330116	2033-01-16	16	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330117	2033-01-17	17	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330118	2033-01-18	18	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330119	2033-01-19	19	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330120	2033-01-20	20	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330121	2033-01-21	21	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330122	2033-01-22	22	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330123	2033-01-23	23	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330124	2033-01-24	24	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330125	2033-01-25	25	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330126	2033-01-26	26	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330127	2033-01-27	27	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330128	2033-01-28	28	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330129	2033-01-29	29	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330130	2033-01-30	30	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	t
20330131	2033-01-31	31	1	มกราคม	1	2033	2576	2576	2033	Q2	2575	f
20330201	2033-02-01	1	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330202	2033-02-02	2	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330203	2033-02-03	3	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330204	2033-02-04	4	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330205	2033-02-05	5	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330206	2033-02-06	6	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330207	2033-02-07	7	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330208	2033-02-08	8	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330209	2033-02-09	9	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330210	2033-02-10	10	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330211	2033-02-11	11	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330212	2033-02-12	12	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330213	2033-02-13	13	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330214	2033-02-14	14	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330215	2033-02-15	15	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330216	2033-02-16	16	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330217	2033-02-17	17	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330218	2033-02-18	18	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330219	2033-02-19	19	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330220	2033-02-20	20	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330221	2033-02-21	21	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330222	2033-02-22	22	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330223	2033-02-23	23	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330224	2033-02-24	24	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330225	2033-02-25	25	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330226	2033-02-26	26	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330227	2033-02-27	27	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	t
20330228	2033-02-28	28	2	กุมภาพันธ์	1	2033	2576	2576	2033	Q2	2575	f
20330301	2033-03-01	1	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330302	2033-03-02	2	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330303	2033-03-03	3	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330304	2033-03-04	4	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330305	2033-03-05	5	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330306	2033-03-06	6	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330307	2033-03-07	7	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330308	2033-03-08	8	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330309	2033-03-09	9	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330310	2033-03-10	10	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330311	2033-03-11	11	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330312	2033-03-12	12	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330313	2033-03-13	13	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330314	2033-03-14	14	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330315	2033-03-15	15	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330316	2033-03-16	16	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330317	2033-03-17	17	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330318	2033-03-18	18	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330319	2033-03-19	19	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330320	2033-03-20	20	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330321	2033-03-21	21	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330322	2033-03-22	22	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330323	2033-03-23	23	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330324	2033-03-24	24	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330325	2033-03-25	25	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330326	2033-03-26	26	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330327	2033-03-27	27	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	t
20330328	2033-03-28	28	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330329	2033-03-29	29	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330330	2033-03-30	30	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330331	2033-03-31	31	3	มีนาคม	1	2033	2576	2576	2033	Q2	2575	f
20330401	2033-04-01	1	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330402	2033-04-02	2	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330403	2033-04-03	3	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330404	2033-04-04	4	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330405	2033-04-05	5	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330406	2033-04-06	6	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330407	2033-04-07	7	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330408	2033-04-08	8	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330409	2033-04-09	9	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330410	2033-04-10	10	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330411	2033-04-11	11	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330412	2033-04-12	12	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330413	2033-04-13	13	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330414	2033-04-14	14	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330415	2033-04-15	15	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330416	2033-04-16	16	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330417	2033-04-17	17	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330418	2033-04-18	18	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330419	2033-04-19	19	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330420	2033-04-20	20	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330421	2033-04-21	21	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330422	2033-04-22	22	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330423	2033-04-23	23	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330424	2033-04-24	24	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330425	2033-04-25	25	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330426	2033-04-26	26	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330427	2033-04-27	27	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330428	2033-04-28	28	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330429	2033-04-29	29	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	f
20330430	2033-04-30	30	4	เมษายน	2	2033	2576	2576	2033	Q3	2575	t
20330501	2033-05-01	1	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330502	2033-05-02	2	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330503	2033-05-03	3	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330504	2033-05-04	4	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330505	2033-05-05	5	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330506	2033-05-06	6	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330507	2033-05-07	7	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330508	2033-05-08	8	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330509	2033-05-09	9	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330510	2033-05-10	10	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330511	2033-05-11	11	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330512	2033-05-12	12	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330513	2033-05-13	13	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330514	2033-05-14	14	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330515	2033-05-15	15	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330516	2033-05-16	16	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330517	2033-05-17	17	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330518	2033-05-18	18	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330519	2033-05-19	19	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330520	2033-05-20	20	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330521	2033-05-21	21	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330522	2033-05-22	22	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330523	2033-05-23	23	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330524	2033-05-24	24	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330525	2033-05-25	25	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330526	2033-05-26	26	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330527	2033-05-27	27	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330528	2033-05-28	28	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330529	2033-05-29	29	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	t
20330530	2033-05-30	30	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330531	2033-05-31	31	5	พฤษภาคม	2	2033	2576	2576	2033	Q3	2575	f
20330601	2033-06-01	1	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330602	2033-06-02	2	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330603	2033-06-03	3	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330604	2033-06-04	4	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330605	2033-06-05	5	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330606	2033-06-06	6	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330607	2033-06-07	7	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330608	2033-06-08	8	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330609	2033-06-09	9	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330610	2033-06-10	10	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330611	2033-06-11	11	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330612	2033-06-12	12	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330613	2033-06-13	13	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330614	2033-06-14	14	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330615	2033-06-15	15	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330616	2033-06-16	16	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330617	2033-06-17	17	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330618	2033-06-18	18	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330619	2033-06-19	19	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330620	2033-06-20	20	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330621	2033-06-21	21	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330622	2033-06-22	22	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330623	2033-06-23	23	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330624	2033-06-24	24	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330625	2033-06-25	25	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330626	2033-06-26	26	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	t
20330627	2033-06-27	27	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330628	2033-06-28	28	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330629	2033-06-29	29	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330630	2033-06-30	30	6	มิถุนายน	2	2033	2576	2576	2033	Q3	2576	f
20330701	2033-07-01	1	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330702	2033-07-02	2	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330703	2033-07-03	3	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330704	2033-07-04	4	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330705	2033-07-05	5	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330706	2033-07-06	6	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330707	2033-07-07	7	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330708	2033-07-08	8	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330709	2033-07-09	9	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330710	2033-07-10	10	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330711	2033-07-11	11	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330712	2033-07-12	12	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330713	2033-07-13	13	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330714	2033-07-14	14	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330715	2033-07-15	15	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330716	2033-07-16	16	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330717	2033-07-17	17	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330718	2033-07-18	18	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330719	2033-07-19	19	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330720	2033-07-20	20	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330721	2033-07-21	21	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330722	2033-07-22	22	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330723	2033-07-23	23	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330724	2033-07-24	24	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330725	2033-07-25	25	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330726	2033-07-26	26	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330727	2033-07-27	27	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330728	2033-07-28	28	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330729	2033-07-29	29	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	f
20330730	2033-07-30	30	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330731	2033-07-31	31	7	กรกฎาคม	3	2033	2576	2576	2033	Q4	2576	t
20330801	2033-08-01	1	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330802	2033-08-02	2	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330803	2033-08-03	3	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330804	2033-08-04	4	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330805	2033-08-05	5	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330806	2033-08-06	6	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330807	2033-08-07	7	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330808	2033-08-08	8	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330809	2033-08-09	9	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330810	2033-08-10	10	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330811	2033-08-11	11	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330812	2033-08-12	12	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330813	2033-08-13	13	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330814	2033-08-14	14	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330815	2033-08-15	15	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330816	2033-08-16	16	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330817	2033-08-17	17	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330818	2033-08-18	18	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330819	2033-08-19	19	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330820	2033-08-20	20	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330821	2033-08-21	21	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330822	2033-08-22	22	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330823	2033-08-23	23	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330824	2033-08-24	24	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330825	2033-08-25	25	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330826	2033-08-26	26	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330827	2033-08-27	27	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330828	2033-08-28	28	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	t
20330829	2033-08-29	29	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330830	2033-08-30	30	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330831	2033-08-31	31	8	สิงหาคม	3	2033	2576	2576	2033	Q4	2576	f
20330901	2033-09-01	1	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330902	2033-09-02	2	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330903	2033-09-03	3	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330904	2033-09-04	4	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330905	2033-09-05	5	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330906	2033-09-06	6	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330907	2033-09-07	7	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330908	2033-09-08	8	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330909	2033-09-09	9	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330910	2033-09-10	10	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330911	2033-09-11	11	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330912	2033-09-12	12	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330913	2033-09-13	13	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330914	2033-09-14	14	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330915	2033-09-15	15	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330916	2033-09-16	16	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330917	2033-09-17	17	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330918	2033-09-18	18	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330919	2033-09-19	19	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330920	2033-09-20	20	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330921	2033-09-21	21	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330922	2033-09-22	22	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330923	2033-09-23	23	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330924	2033-09-24	24	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330925	2033-09-25	25	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	t
20330926	2033-09-26	26	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330927	2033-09-27	27	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330928	2033-09-28	28	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330929	2033-09-29	29	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20330930	2033-09-30	30	9	กันยายน	3	2033	2576	2576	2033	Q4	2576	f
20331001	2033-10-01	1	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331002	2033-10-02	2	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331003	2033-10-03	3	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331004	2033-10-04	4	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331005	2033-10-05	5	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331006	2033-10-06	6	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331007	2033-10-07	7	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331008	2033-10-08	8	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331009	2033-10-09	9	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331010	2033-10-10	10	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331011	2033-10-11	11	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331012	2033-10-12	12	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331013	2033-10-13	13	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331014	2033-10-14	14	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331015	2033-10-15	15	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331016	2033-10-16	16	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331017	2033-10-17	17	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331018	2033-10-18	18	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331019	2033-10-19	19	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331020	2033-10-20	20	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331021	2033-10-21	21	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331022	2033-10-22	22	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331023	2033-10-23	23	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331024	2033-10-24	24	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331025	2033-10-25	25	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331026	2033-10-26	26	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331027	2033-10-27	27	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331028	2033-10-28	28	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331029	2033-10-29	29	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331030	2033-10-30	30	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	t
20331031	2033-10-31	31	10	ตุลาคม	4	2033	2576	2577	2034	Q1	2576	f
20331101	2033-11-01	1	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331102	2033-11-02	2	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331103	2033-11-03	3	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331104	2033-11-04	4	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331105	2033-11-05	5	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331106	2033-11-06	6	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331107	2033-11-07	7	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331108	2033-11-08	8	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331109	2033-11-09	9	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331110	2033-11-10	10	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331111	2033-11-11	11	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331112	2033-11-12	12	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331113	2033-11-13	13	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331114	2033-11-14	14	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331115	2033-11-15	15	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331116	2033-11-16	16	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331117	2033-11-17	17	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331118	2033-11-18	18	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331119	2033-11-19	19	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331120	2033-11-20	20	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331121	2033-11-21	21	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331122	2033-11-22	22	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331123	2033-11-23	23	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331124	2033-11-24	24	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331125	2033-11-25	25	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331126	2033-11-26	26	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331127	2033-11-27	27	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	t
20331128	2033-11-28	28	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331129	2033-11-29	29	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331130	2033-11-30	30	11	พฤศจิกายน	4	2033	2576	2577	2034	Q1	2576	f
20331201	2033-12-01	1	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331202	2033-12-02	2	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331203	2033-12-03	3	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331204	2033-12-04	4	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331205	2033-12-05	5	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331206	2033-12-06	6	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331207	2033-12-07	7	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331208	2033-12-08	8	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331209	2033-12-09	9	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331210	2033-12-10	10	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331211	2033-12-11	11	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331212	2033-12-12	12	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331213	2033-12-13	13	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331214	2033-12-14	14	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331215	2033-12-15	15	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331216	2033-12-16	16	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331217	2033-12-17	17	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331218	2033-12-18	18	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331219	2033-12-19	19	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331220	2033-12-20	20	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331221	2033-12-21	21	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331222	2033-12-22	22	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331223	2033-12-23	23	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331224	2033-12-24	24	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331225	2033-12-25	25	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20331226	2033-12-26	26	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331227	2033-12-27	27	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331228	2033-12-28	28	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331229	2033-12-29	29	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331230	2033-12-30	30	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	f
20331231	2033-12-31	31	12	ธันวาคม	4	2033	2576	2577	2034	Q1	2576	t
20340101	2034-01-01	1	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340102	2034-01-02	2	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340103	2034-01-03	3	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340104	2034-01-04	4	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340105	2034-01-05	5	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340106	2034-01-06	6	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340107	2034-01-07	7	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340108	2034-01-08	8	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340109	2034-01-09	9	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340110	2034-01-10	10	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340111	2034-01-11	11	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340112	2034-01-12	12	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340113	2034-01-13	13	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340114	2034-01-14	14	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340115	2034-01-15	15	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340116	2034-01-16	16	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340117	2034-01-17	17	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340118	2034-01-18	18	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340119	2034-01-19	19	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340120	2034-01-20	20	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340121	2034-01-21	21	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340122	2034-01-22	22	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340123	2034-01-23	23	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340124	2034-01-24	24	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340125	2034-01-25	25	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340126	2034-01-26	26	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340127	2034-01-27	27	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340128	2034-01-28	28	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340129	2034-01-29	29	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	t
20340130	2034-01-30	30	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340131	2034-01-31	31	1	มกราคม	1	2034	2577	2577	2034	Q2	2576	f
20340201	2034-02-01	1	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340202	2034-02-02	2	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340203	2034-02-03	3	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340204	2034-02-04	4	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340205	2034-02-05	5	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340206	2034-02-06	6	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340207	2034-02-07	7	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340208	2034-02-08	8	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340209	2034-02-09	9	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340210	2034-02-10	10	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340211	2034-02-11	11	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340212	2034-02-12	12	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340213	2034-02-13	13	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340214	2034-02-14	14	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340215	2034-02-15	15	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340216	2034-02-16	16	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340217	2034-02-17	17	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340218	2034-02-18	18	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340219	2034-02-19	19	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340220	2034-02-20	20	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340221	2034-02-21	21	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340222	2034-02-22	22	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340223	2034-02-23	23	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340224	2034-02-24	24	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340225	2034-02-25	25	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340226	2034-02-26	26	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	t
20340227	2034-02-27	27	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340228	2034-02-28	28	2	กุมภาพันธ์	1	2034	2577	2577	2034	Q2	2576	f
20340301	2034-03-01	1	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340302	2034-03-02	2	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340303	2034-03-03	3	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340304	2034-03-04	4	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340305	2034-03-05	5	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340306	2034-03-06	6	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340307	2034-03-07	7	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340308	2034-03-08	8	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340309	2034-03-09	9	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340310	2034-03-10	10	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340311	2034-03-11	11	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340312	2034-03-12	12	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340313	2034-03-13	13	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340314	2034-03-14	14	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340315	2034-03-15	15	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340316	2034-03-16	16	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340317	2034-03-17	17	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340318	2034-03-18	18	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340319	2034-03-19	19	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340320	2034-03-20	20	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340321	2034-03-21	21	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340322	2034-03-22	22	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340323	2034-03-23	23	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340324	2034-03-24	24	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340325	2034-03-25	25	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340326	2034-03-26	26	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	t
20340327	2034-03-27	27	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340328	2034-03-28	28	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340329	2034-03-29	29	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340330	2034-03-30	30	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340331	2034-03-31	31	3	มีนาคม	1	2034	2577	2577	2034	Q2	2576	f
20340401	2034-04-01	1	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340402	2034-04-02	2	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340403	2034-04-03	3	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340404	2034-04-04	4	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340405	2034-04-05	5	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340406	2034-04-06	6	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340407	2034-04-07	7	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340408	2034-04-08	8	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340409	2034-04-09	9	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340410	2034-04-10	10	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340411	2034-04-11	11	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340412	2034-04-12	12	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340413	2034-04-13	13	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340414	2034-04-14	14	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340415	2034-04-15	15	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340416	2034-04-16	16	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340417	2034-04-17	17	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340418	2034-04-18	18	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340419	2034-04-19	19	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340420	2034-04-20	20	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340421	2034-04-21	21	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340422	2034-04-22	22	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340423	2034-04-23	23	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340424	2034-04-24	24	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340425	2034-04-25	25	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340426	2034-04-26	26	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340427	2034-04-27	27	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340428	2034-04-28	28	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	f
20340429	2034-04-29	29	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340430	2034-04-30	30	4	เมษายน	2	2034	2577	2577	2034	Q3	2576	t
20340501	2034-05-01	1	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340502	2034-05-02	2	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340503	2034-05-03	3	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340504	2034-05-04	4	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340505	2034-05-05	5	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340506	2034-05-06	6	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340507	2034-05-07	7	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340508	2034-05-08	8	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340509	2034-05-09	9	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340510	2034-05-10	10	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340511	2034-05-11	11	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340512	2034-05-12	12	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340513	2034-05-13	13	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340514	2034-05-14	14	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340515	2034-05-15	15	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340516	2034-05-16	16	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340517	2034-05-17	17	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340518	2034-05-18	18	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340519	2034-05-19	19	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340520	2034-05-20	20	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340521	2034-05-21	21	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340522	2034-05-22	22	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340523	2034-05-23	23	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340524	2034-05-24	24	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340525	2034-05-25	25	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340526	2034-05-26	26	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340527	2034-05-27	27	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340528	2034-05-28	28	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	t
20340529	2034-05-29	29	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340530	2034-05-30	30	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340531	2034-05-31	31	5	พฤษภาคม	2	2034	2577	2577	2034	Q3	2576	f
20340601	2034-06-01	1	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340602	2034-06-02	2	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340603	2034-06-03	3	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340604	2034-06-04	4	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340605	2034-06-05	5	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340606	2034-06-06	6	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340607	2034-06-07	7	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340608	2034-06-08	8	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340609	2034-06-09	9	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340610	2034-06-10	10	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340611	2034-06-11	11	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340612	2034-06-12	12	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340613	2034-06-13	13	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340614	2034-06-14	14	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340615	2034-06-15	15	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340616	2034-06-16	16	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340617	2034-06-17	17	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340618	2034-06-18	18	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340619	2034-06-19	19	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340620	2034-06-20	20	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340621	2034-06-21	21	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340622	2034-06-22	22	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340623	2034-06-23	23	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340624	2034-06-24	24	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340625	2034-06-25	25	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	t
20340626	2034-06-26	26	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340627	2034-06-27	27	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340628	2034-06-28	28	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340629	2034-06-29	29	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340630	2034-06-30	30	6	มิถุนายน	2	2034	2577	2577	2034	Q3	2577	f
20340701	2034-07-01	1	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340702	2034-07-02	2	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340703	2034-07-03	3	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340704	2034-07-04	4	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340705	2034-07-05	5	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340706	2034-07-06	6	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340707	2034-07-07	7	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340708	2034-07-08	8	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340709	2034-07-09	9	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340710	2034-07-10	10	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340711	2034-07-11	11	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340712	2034-07-12	12	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340713	2034-07-13	13	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340714	2034-07-14	14	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340715	2034-07-15	15	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340716	2034-07-16	16	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340717	2034-07-17	17	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340718	2034-07-18	18	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340719	2034-07-19	19	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340720	2034-07-20	20	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340721	2034-07-21	21	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340722	2034-07-22	22	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340723	2034-07-23	23	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340724	2034-07-24	24	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340725	2034-07-25	25	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340726	2034-07-26	26	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340727	2034-07-27	27	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340728	2034-07-28	28	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340729	2034-07-29	29	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340730	2034-07-30	30	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	t
20340731	2034-07-31	31	7	กรกฎาคม	3	2034	2577	2577	2034	Q4	2577	f
20340801	2034-08-01	1	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340802	2034-08-02	2	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340803	2034-08-03	3	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340804	2034-08-04	4	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340805	2034-08-05	5	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340806	2034-08-06	6	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340807	2034-08-07	7	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340808	2034-08-08	8	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340809	2034-08-09	9	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340810	2034-08-10	10	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340811	2034-08-11	11	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340812	2034-08-12	12	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340813	2034-08-13	13	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340814	2034-08-14	14	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340815	2034-08-15	15	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340816	2034-08-16	16	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340817	2034-08-17	17	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340818	2034-08-18	18	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340819	2034-08-19	19	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340820	2034-08-20	20	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340821	2034-08-21	21	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340822	2034-08-22	22	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340823	2034-08-23	23	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340824	2034-08-24	24	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340825	2034-08-25	25	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340826	2034-08-26	26	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340827	2034-08-27	27	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	t
20340828	2034-08-28	28	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340829	2034-08-29	29	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340830	2034-08-30	30	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340831	2034-08-31	31	8	สิงหาคม	3	2034	2577	2577	2034	Q4	2577	f
20340901	2034-09-01	1	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340902	2034-09-02	2	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340903	2034-09-03	3	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340904	2034-09-04	4	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340905	2034-09-05	5	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340906	2034-09-06	6	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340907	2034-09-07	7	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340908	2034-09-08	8	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340909	2034-09-09	9	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340910	2034-09-10	10	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340911	2034-09-11	11	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340912	2034-09-12	12	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340913	2034-09-13	13	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340914	2034-09-14	14	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340915	2034-09-15	15	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340916	2034-09-16	16	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340917	2034-09-17	17	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340918	2034-09-18	18	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340919	2034-09-19	19	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340920	2034-09-20	20	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340921	2034-09-21	21	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340922	2034-09-22	22	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340923	2034-09-23	23	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340924	2034-09-24	24	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20340925	2034-09-25	25	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340926	2034-09-26	26	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340927	2034-09-27	27	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340928	2034-09-28	28	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340929	2034-09-29	29	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	f
20340930	2034-09-30	30	9	กันยายน	3	2034	2577	2577	2034	Q4	2577	t
20341001	2034-10-01	1	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341002	2034-10-02	2	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341003	2034-10-03	3	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341004	2034-10-04	4	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341005	2034-10-05	5	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341006	2034-10-06	6	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341007	2034-10-07	7	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341008	2034-10-08	8	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341009	2034-10-09	9	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341010	2034-10-10	10	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341011	2034-10-11	11	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341012	2034-10-12	12	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341013	2034-10-13	13	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341014	2034-10-14	14	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341015	2034-10-15	15	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341016	2034-10-16	16	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341017	2034-10-17	17	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341018	2034-10-18	18	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341019	2034-10-19	19	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341020	2034-10-20	20	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341021	2034-10-21	21	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341022	2034-10-22	22	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341023	2034-10-23	23	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341024	2034-10-24	24	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341025	2034-10-25	25	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341026	2034-10-26	26	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341027	2034-10-27	27	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341028	2034-10-28	28	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341029	2034-10-29	29	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	t
20341030	2034-10-30	30	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341031	2034-10-31	31	10	ตุลาคม	4	2034	2577	2578	2035	Q1	2577	f
20341101	2034-11-01	1	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341102	2034-11-02	2	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341103	2034-11-03	3	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341104	2034-11-04	4	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341105	2034-11-05	5	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341106	2034-11-06	6	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341107	2034-11-07	7	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341108	2034-11-08	8	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341109	2034-11-09	9	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341110	2034-11-10	10	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341111	2034-11-11	11	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341112	2034-11-12	12	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341113	2034-11-13	13	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341114	2034-11-14	14	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341115	2034-11-15	15	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341116	2034-11-16	16	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341117	2034-11-17	17	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341118	2034-11-18	18	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341119	2034-11-19	19	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341120	2034-11-20	20	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341121	2034-11-21	21	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341122	2034-11-22	22	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341123	2034-11-23	23	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341124	2034-11-24	24	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341125	2034-11-25	25	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341126	2034-11-26	26	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	t
20341127	2034-11-27	27	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341128	2034-11-28	28	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341129	2034-11-29	29	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341130	2034-11-30	30	11	พฤศจิกายน	4	2034	2577	2578	2035	Q1	2577	f
20341201	2034-12-01	1	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341202	2034-12-02	2	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341203	2034-12-03	3	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341204	2034-12-04	4	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341205	2034-12-05	5	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341206	2034-12-06	6	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341207	2034-12-07	7	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341208	2034-12-08	8	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341209	2034-12-09	9	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341210	2034-12-10	10	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341211	2034-12-11	11	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341212	2034-12-12	12	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341213	2034-12-13	13	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341214	2034-12-14	14	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341215	2034-12-15	15	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341216	2034-12-16	16	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341217	2034-12-17	17	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341218	2034-12-18	18	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341219	2034-12-19	19	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341220	2034-12-20	20	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341221	2034-12-21	21	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341222	2034-12-22	22	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341223	2034-12-23	23	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341224	2034-12-24	24	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341225	2034-12-25	25	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341226	2034-12-26	26	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341227	2034-12-27	27	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341228	2034-12-28	28	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341229	2034-12-29	29	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	f
20341230	2034-12-30	30	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20341231	2034-12-31	31	12	ธันวาคม	4	2034	2577	2578	2035	Q1	2577	t
20350101	2035-01-01	1	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350102	2035-01-02	2	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350103	2035-01-03	3	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350104	2035-01-04	4	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350105	2035-01-05	5	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350106	2035-01-06	6	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350107	2035-01-07	7	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350108	2035-01-08	8	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350109	2035-01-09	9	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350110	2035-01-10	10	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350111	2035-01-11	11	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350112	2035-01-12	12	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350113	2035-01-13	13	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350114	2035-01-14	14	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350115	2035-01-15	15	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350116	2035-01-16	16	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350117	2035-01-17	17	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350118	2035-01-18	18	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350119	2035-01-19	19	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350120	2035-01-20	20	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350121	2035-01-21	21	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350122	2035-01-22	22	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350123	2035-01-23	23	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350124	2035-01-24	24	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350125	2035-01-25	25	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350126	2035-01-26	26	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350127	2035-01-27	27	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350128	2035-01-28	28	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	t
20350129	2035-01-29	29	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350130	2035-01-30	30	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350131	2035-01-31	31	1	มกราคม	1	2035	2578	2578	2035	Q2	2577	f
20350201	2035-02-01	1	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350202	2035-02-02	2	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350203	2035-02-03	3	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350204	2035-02-04	4	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350205	2035-02-05	5	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350206	2035-02-06	6	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350207	2035-02-07	7	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350208	2035-02-08	8	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350209	2035-02-09	9	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350210	2035-02-10	10	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350211	2035-02-11	11	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350212	2035-02-12	12	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350213	2035-02-13	13	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350214	2035-02-14	14	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350215	2035-02-15	15	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350216	2035-02-16	16	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350217	2035-02-17	17	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350218	2035-02-18	18	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350219	2035-02-19	19	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350220	2035-02-20	20	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350221	2035-02-21	21	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350222	2035-02-22	22	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350223	2035-02-23	23	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350224	2035-02-24	24	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350225	2035-02-25	25	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	t
20350226	2035-02-26	26	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350227	2035-02-27	27	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350228	2035-02-28	28	2	กุมภาพันธ์	1	2035	2578	2578	2035	Q2	2577	f
20350301	2035-03-01	1	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350302	2035-03-02	2	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350303	2035-03-03	3	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350304	2035-03-04	4	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350305	2035-03-05	5	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350306	2035-03-06	6	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350307	2035-03-07	7	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350308	2035-03-08	8	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350309	2035-03-09	9	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350310	2035-03-10	10	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350311	2035-03-11	11	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350312	2035-03-12	12	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350313	2035-03-13	13	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350314	2035-03-14	14	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350315	2035-03-15	15	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350316	2035-03-16	16	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350317	2035-03-17	17	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350318	2035-03-18	18	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350319	2035-03-19	19	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350320	2035-03-20	20	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350321	2035-03-21	21	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350322	2035-03-22	22	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350323	2035-03-23	23	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350324	2035-03-24	24	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350325	2035-03-25	25	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350326	2035-03-26	26	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350327	2035-03-27	27	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350328	2035-03-28	28	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350329	2035-03-29	29	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350330	2035-03-30	30	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	f
20350331	2035-03-31	31	3	มีนาคม	1	2035	2578	2578	2035	Q2	2577	t
20350401	2035-04-01	1	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350402	2035-04-02	2	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350403	2035-04-03	3	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350404	2035-04-04	4	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350405	2035-04-05	5	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350406	2035-04-06	6	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350407	2035-04-07	7	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350408	2035-04-08	8	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350409	2035-04-09	9	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350410	2035-04-10	10	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350411	2035-04-11	11	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350412	2035-04-12	12	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350413	2035-04-13	13	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350414	2035-04-14	14	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350415	2035-04-15	15	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350416	2035-04-16	16	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350417	2035-04-17	17	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350418	2035-04-18	18	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350419	2035-04-19	19	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350420	2035-04-20	20	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350421	2035-04-21	21	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350422	2035-04-22	22	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350423	2035-04-23	23	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350424	2035-04-24	24	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350425	2035-04-25	25	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350426	2035-04-26	26	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350427	2035-04-27	27	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350428	2035-04-28	28	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350429	2035-04-29	29	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	t
20350430	2035-04-30	30	4	เมษายน	2	2035	2578	2578	2035	Q3	2577	f
20350501	2035-05-01	1	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350502	2035-05-02	2	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350503	2035-05-03	3	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350504	2035-05-04	4	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350505	2035-05-05	5	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350506	2035-05-06	6	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350507	2035-05-07	7	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350508	2035-05-08	8	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350509	2035-05-09	9	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350510	2035-05-10	10	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350511	2035-05-11	11	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350512	2035-05-12	12	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350513	2035-05-13	13	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350514	2035-05-14	14	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350515	2035-05-15	15	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350516	2035-05-16	16	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350517	2035-05-17	17	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350518	2035-05-18	18	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350519	2035-05-19	19	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350520	2035-05-20	20	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350521	2035-05-21	21	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350522	2035-05-22	22	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350523	2035-05-23	23	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350524	2035-05-24	24	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350525	2035-05-25	25	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350526	2035-05-26	26	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350527	2035-05-27	27	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	t
20350528	2035-05-28	28	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350529	2035-05-29	29	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350530	2035-05-30	30	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350531	2035-05-31	31	5	พฤษภาคม	2	2035	2578	2578	2035	Q3	2577	f
20350601	2035-06-01	1	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350602	2035-06-02	2	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350603	2035-06-03	3	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350604	2035-06-04	4	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350605	2035-06-05	5	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350606	2035-06-06	6	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350607	2035-06-07	7	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350608	2035-06-08	8	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350609	2035-06-09	9	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350610	2035-06-10	10	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350611	2035-06-11	11	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350612	2035-06-12	12	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350613	2035-06-13	13	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350614	2035-06-14	14	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350615	2035-06-15	15	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350616	2035-06-16	16	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350617	2035-06-17	17	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350618	2035-06-18	18	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350619	2035-06-19	19	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350620	2035-06-20	20	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350621	2035-06-21	21	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350622	2035-06-22	22	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350623	2035-06-23	23	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350624	2035-06-24	24	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350625	2035-06-25	25	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350626	2035-06-26	26	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350627	2035-06-27	27	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350628	2035-06-28	28	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350629	2035-06-29	29	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	f
20350630	2035-06-30	30	6	มิถุนายน	2	2035	2578	2578	2035	Q3	2578	t
20350701	2035-07-01	1	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350702	2035-07-02	2	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350703	2035-07-03	3	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350704	2035-07-04	4	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350705	2035-07-05	5	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350706	2035-07-06	6	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350707	2035-07-07	7	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350708	2035-07-08	8	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350709	2035-07-09	9	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350710	2035-07-10	10	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350711	2035-07-11	11	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350712	2035-07-12	12	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350713	2035-07-13	13	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350714	2035-07-14	14	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350715	2035-07-15	15	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350716	2035-07-16	16	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350717	2035-07-17	17	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350718	2035-07-18	18	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350719	2035-07-19	19	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350720	2035-07-20	20	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350721	2035-07-21	21	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350722	2035-07-22	22	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350723	2035-07-23	23	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350724	2035-07-24	24	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350725	2035-07-25	25	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350726	2035-07-26	26	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350727	2035-07-27	27	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350728	2035-07-28	28	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350729	2035-07-29	29	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	t
20350730	2035-07-30	30	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350731	2035-07-31	31	7	กรกฎาคม	3	2035	2578	2578	2035	Q4	2578	f
20350801	2035-08-01	1	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350802	2035-08-02	2	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350803	2035-08-03	3	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350804	2035-08-04	4	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350805	2035-08-05	5	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350806	2035-08-06	6	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350807	2035-08-07	7	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350808	2035-08-08	8	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350809	2035-08-09	9	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350810	2035-08-10	10	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350811	2035-08-11	11	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350812	2035-08-12	12	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350813	2035-08-13	13	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350814	2035-08-14	14	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350815	2035-08-15	15	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350816	2035-08-16	16	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350817	2035-08-17	17	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350818	2035-08-18	18	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350819	2035-08-19	19	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350820	2035-08-20	20	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350821	2035-08-21	21	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350822	2035-08-22	22	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350823	2035-08-23	23	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350824	2035-08-24	24	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350825	2035-08-25	25	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350826	2035-08-26	26	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	t
20350827	2035-08-27	27	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350828	2035-08-28	28	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350829	2035-08-29	29	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350830	2035-08-30	30	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350831	2035-08-31	31	8	สิงหาคม	3	2035	2578	2578	2035	Q4	2578	f
20350901	2035-09-01	1	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350902	2035-09-02	2	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350903	2035-09-03	3	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350904	2035-09-04	4	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350905	2035-09-05	5	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350906	2035-09-06	6	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350907	2035-09-07	7	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350908	2035-09-08	8	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350909	2035-09-09	9	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350910	2035-09-10	10	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350911	2035-09-11	11	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350912	2035-09-12	12	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350913	2035-09-13	13	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350914	2035-09-14	14	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350915	2035-09-15	15	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350916	2035-09-16	16	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350917	2035-09-17	17	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350918	2035-09-18	18	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350919	2035-09-19	19	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350920	2035-09-20	20	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350921	2035-09-21	21	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350922	2035-09-22	22	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350923	2035-09-23	23	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350924	2035-09-24	24	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350925	2035-09-25	25	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350926	2035-09-26	26	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350927	2035-09-27	27	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350928	2035-09-28	28	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	f
20350929	2035-09-29	29	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20350930	2035-09-30	30	9	กันยายน	3	2035	2578	2578	2035	Q4	2578	t
20351001	2035-10-01	1	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351002	2035-10-02	2	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351003	2035-10-03	3	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351004	2035-10-04	4	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351005	2035-10-05	5	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351006	2035-10-06	6	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351007	2035-10-07	7	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351008	2035-10-08	8	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351009	2035-10-09	9	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351010	2035-10-10	10	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351011	2035-10-11	11	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351012	2035-10-12	12	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351013	2035-10-13	13	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351014	2035-10-14	14	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351015	2035-10-15	15	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351016	2035-10-16	16	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351017	2035-10-17	17	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351018	2035-10-18	18	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351019	2035-10-19	19	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351020	2035-10-20	20	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351021	2035-10-21	21	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351022	2035-10-22	22	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351023	2035-10-23	23	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351024	2035-10-24	24	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351025	2035-10-25	25	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351026	2035-10-26	26	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351027	2035-10-27	27	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351028	2035-10-28	28	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	t
20351029	2035-10-29	29	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351030	2035-10-30	30	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351031	2035-10-31	31	10	ตุลาคม	4	2035	2578	2579	2036	Q1	2578	f
20351101	2035-11-01	1	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351102	2035-11-02	2	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351103	2035-11-03	3	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351104	2035-11-04	4	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351105	2035-11-05	5	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351106	2035-11-06	6	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351107	2035-11-07	7	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351108	2035-11-08	8	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351109	2035-11-09	9	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351110	2035-11-10	10	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351111	2035-11-11	11	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351112	2035-11-12	12	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351113	2035-11-13	13	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351114	2035-11-14	14	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351115	2035-11-15	15	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351116	2035-11-16	16	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351117	2035-11-17	17	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351118	2035-11-18	18	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351119	2035-11-19	19	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351120	2035-11-20	20	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351121	2035-11-21	21	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351122	2035-11-22	22	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351123	2035-11-23	23	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351124	2035-11-24	24	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351125	2035-11-25	25	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	t
20351126	2035-11-26	26	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351127	2035-11-27	27	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351128	2035-11-28	28	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351129	2035-11-29	29	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351130	2035-11-30	30	11	พฤศจิกายน	4	2035	2578	2579	2036	Q1	2578	f
20351201	2035-12-01	1	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351202	2035-12-02	2	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351203	2035-12-03	3	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351204	2035-12-04	4	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351205	2035-12-05	5	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351206	2035-12-06	6	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351207	2035-12-07	7	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351208	2035-12-08	8	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351209	2035-12-09	9	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351210	2035-12-10	10	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351211	2035-12-11	11	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351212	2035-12-12	12	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351213	2035-12-13	13	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351214	2035-12-14	14	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351215	2035-12-15	15	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351216	2035-12-16	16	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351217	2035-12-17	17	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351218	2035-12-18	18	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351219	2035-12-19	19	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351220	2035-12-20	20	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351221	2035-12-21	21	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351222	2035-12-22	22	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351223	2035-12-23	23	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351224	2035-12-24	24	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351225	2035-12-25	25	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351226	2035-12-26	26	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351227	2035-12-27	27	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351228	2035-12-28	28	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
20351229	2035-12-29	29	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351230	2035-12-30	30	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	t
20351231	2035-12-31	31	12	ธันวาคม	4	2035	2578	2579	2036	Q1	2578	f
\.


--
-- Data for Name: dim_funding_source; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_funding_source (funding_source_key, funding_source_name, funding_type, funding_sector) FROM stdin;
1	สำนักงานการวิจัยแห่งชาติ (วช.)	ทุนภายนอก	หน่วยงานภาครัฐ/กองทุนวิจัย
2	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)	ทุนภายนอก	หน่วยงานภาครัฐ/กองทุนวิจัย
3	หน่วยบริหารและจัดการทุนด้านการพัฒนากำลังคน และทุนด้านการพัฒนาสถาบันอุดมศึกษา การวิจัยและการสร้างนวัตกรรม (บพค.)	ทุนภายนอก	หน่วยงานภาครัฐ/กองทุนวิจัย
4	สำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว.)	ทุนภายนอก	หน่วยงานภาครัฐ/กองทุนวิจัย
5	ทุนอุดหนุนวิจัย มหาวิทยาลัยเกษตรศาสตร์	ทุนภายใน	มหาวิทยาลัย/คณะ
6	ทุนอุดหนุนวิจัย วิทยาเขตกำแพงแสน	ทุนภายใน	มหาวิทยาลัย/คณะ
7	ทุนวิจัยคณะวิศวกรรมศาสตร์ กำแพงแสน	ทุนภายใน	มหาวิทยาลัย/คณะ
8	ภาคเอกชนและอุตสาหกรรม	ทุนภายนอก	ภาคเอกชน/อุตสาหกรรม
\.


--
-- Data for Name: dim_ip_type; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_ip_type (ip_type_key, ip_category, protection_level, statutory_duration_years) FROM stdin;
1	สิทธิบัตรการประดิษฐ์	ชาติ	20
2	สิทธิบัตรการออกแบบผลิตภัณฑ์	ชาติ	10
3	อนุสิทธิบัตร	ชาติ	10
4	ลิขสิทธิ์	ชาติ	50
5	สิทธิบัตรนานาชาติ (PCT)	นานาชาติ	20
\.


--
-- Data for Name: dim_organization; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_organization (organization_key, faculty_id, department_id, campus_name, faculty_code, faculty_name_th, department_code, department_name_th, department_type) FROM stdin;
1	bc628edc-757c-4d75-8d38-5b99b1eee5d3	7fb427a2-af05-40c7-9d0f-6a8f2730d9cc	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	AE	ภาควิชาวิศวกรรมเกษตร	ภาควิชา
2	bc628edc-757c-4d75-8d38-5b99b1eee5d3	2dcbd36c-539b-4f15-b3df-faf1f5fbe1cd	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	IE	ภาควิชาวิศวกรรมชลประทาน	ภาควิชา
3	bc628edc-757c-4d75-8d38-5b99b1eee5d3	b341cdb3-29ec-47a0-88ca-4b544f25c67b	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	FE	ภาควิชาวิศวกรรมการอาหาร	ภาควิชา
4	bc628edc-757c-4d75-8d38-5b99b1eee5d3	64abfa63-16b7-4cfd-ac1d-1452682a3938	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	CE	ภาควิชาวิศวกรรมโยธา	ภาควิชา
5	bc628edc-757c-4d75-8d38-5b99b1eee5d3	2dabcbe2-176d-44c5-9feb-80d5b074942e	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	ME	ภาควิชาวิศวกรรมเครื่องกล	ภาควิชา
6	bc628edc-757c-4d75-8d38-5b99b1eee5d3	3d6d0d62-ac35-442c-bb5e-86462387d7ea	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	CPE	ภาควิชาวิศวกรรมคอมพิวเตอร์	ภาควิชา
7	bc628edc-757c-4d75-8d38-5b99b1eee5d3	c03365a8-10d2-47d5-b9a1-9faa40abf315	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	ENE	ภาควิชาวิศวกรรมสิ่งแวดล้อมและทรัพยากร	ภาควิชา
8	bc628edc-757c-4d75-8d38-5b99b1eee5d3	00e0b662-afc1-46b4-99b8-0c05da46dfad	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	IND	ภาควิชาวิศวกรรมอุตสาหการ	ภาควิชา
9	bc628edc-757c-4d75-8d38-5b99b1eee5d3	1a6168b4-0295-4f6c-bd6f-bc33ca2c759f	กำแพงแสน	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	DEAN_OFFICE	สำนักงานเลขานุการคณะวิศวกรรมศาสตร์ กำแพงแสน	สำนักงานเลขานุการ
\.


--
-- Data for Name: dim_publication_tier; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_publication_tier (tier_key, tier_code, tier_name, database_source, publication_level, is_top_tier) FROM stdin;
1	SCOPUS_Q1	Scopus Quartile 1	Scopus	นานาชาติ	t
2	SCOPUS_Q2	Scopus Quartile 2	Scopus	นานาชาติ	t
3	SCOPUS_Q3	Scopus Quartile 3	Scopus	นานาชาติ	f
4	SCOPUS_Q4	Scopus Quartile 4	Scopus	นานาชาติ	f
5	TCI_1	TCI กลุ่ม 1	TCI	ชาติ	f
6	TCI_2	TCI กลุ่ม 2	TCI	ชาติ	f
7	CONFERENCE	การประชุมวิชาการระดับชาติ/นานาชาติ	Conference Proceedings	นานาชาติ	f
8	OTHER	สิ่งพิมพ์วิชาการอื่นๆ / เตรียมความพร้อม	Other	ชาติ	f
\.


--
-- Data for Name: dim_researcher; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_researcher (researcher_key, person_id, full_name_th, title_th, first_name_th, last_name_th, academic_position, department_name_th, faculty_name_th, personnel_type, email) FROM stdin;
\.


--
-- Data for Name: dim_strategic_kpi; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.dim_strategic_kpi (kpi_key, kpi_id, strategy_no, strategy_name, plan_no, plan_name, kpi_code, kpi_name, measurement_unit, collection_cycle, is_automated_calc) FROM stdin;
\.


--
-- Data for Name: fact_academic_dev_projects; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_academic_dev_projects (fact_id, core_project_id, start_date_key, end_date_key, organization_key, leader_researcher_key, client_name, client_category, client_frequency, policy_alignment, integration_type, project_count, budget_total, overhead_15_pct, faculty_share_5_pct, dept_share_5_pct, ku_share_5_pct, internal_members_count, external_members_count) FROM stdin;
\.


--
-- Data for Name: fact_academic_services; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_academic_services (fact_id, core_service_id, service_date_key, organization_key, provider_researcher_key, service_category, target_group_name, target_group_sector, service_count, hours_spent, attendees_count) FROM stdin;
\.


--
-- Data for Name: fact_intellectual_properties; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_intellectual_properties (fact_id, core_ip_id, filing_date_key, grant_date_key, expiration_date_key, organization_key, lead_inventor_key, ip_type_key, application_no, registration_no, protection_status, ip_count, funding_support_amount) FROM stdin;
\.


--
-- Data for Name: fact_kpi_performance; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_kpi_performance (fact_id, core_actual_id, kpi_key, organization_key, as_of_date_key, fiscal_year_be, evaluation_period, responsible_person, is_manual_override, target_value, actual_value, achievement_rate) FROM stdin;
\.


--
-- Data for Name: fact_publications; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_publications (fact_id, core_pub_id, publication_date_key, organization_key, first_author_key, tier_key, publication_type, journal_name, volume, issue, page_range, doi, has_international_coauthor, has_domestic_coauthor, publication_count, funding_amount) FROM stdin;
\.


--
-- Data for Name: fact_research_projects; Type: TABLE DATA; Schema: analytics; Owner: ku_admin
--

COPY analytics.fact_research_projects (fact_id, core_project_id, start_date_key, end_date_key, organization_key, leader_researcher_key, funding_source_key, project_code, collaboration_type, project_character, trl_level, integration_type, duration_months, project_count, budget_total, budget_internal, budget_external) FROM stdin;
\.


--
-- Data for Name: academic_dev_project_members; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.academic_dev_project_members (id, project_id, person_id, role_name, affiliation_type, created_at) FROM stdin;
\.


--
-- Data for Name: academic_dev_projects; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.academic_dev_projects (id, project_name_th, managing_department_id, client_name, client_category, client_frequency, internal_members_count, external_members_count, budget_total, overhead_15_pct, faculty_share_5_pct, dept_share_5_pct, ku_share_5_pct, integration_type, policy_alignment, fiscal_year_be, start_date, end_date, integrated_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: academic_service_providers; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.academic_service_providers (id, service_id, person_id, role_name, created_at) FROM stdin;
\.


--
-- Data for Name: academic_services; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.academic_services (id, topic_title, department_id, target_group, service_category, service_date, hours_spent, attendees_count, fiscal_year_be, remarks, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.departments (id, faculty_id, department_code, department_name_th, department_name_en, department_type, is_active, created_at, updated_at) FROM stdin;
7fb427a2-af05-40c7-9d0f-6a8f2730d9cc	bc628edc-757c-4d75-8d38-5b99b1eee5d3	AE	ภาควิชาวิศวกรรมเกษตร	Department of Agricultural Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
2dcbd36c-539b-4f15-b3df-faf1f5fbe1cd	bc628edc-757c-4d75-8d38-5b99b1eee5d3	IE	ภาควิชาวิศวกรรมชลประทาน	Department of Irrigation Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
b341cdb3-29ec-47a0-88ca-4b544f25c67b	bc628edc-757c-4d75-8d38-5b99b1eee5d3	FE	ภาควิชาวิศวกรรมการอาหาร	Department of Food Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
64abfa63-16b7-4cfd-ac1d-1452682a3938	bc628edc-757c-4d75-8d38-5b99b1eee5d3	CE	ภาควิชาวิศวกรรมโยธา	Department of Civil Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
2dabcbe2-176d-44c5-9feb-80d5b074942e	bc628edc-757c-4d75-8d38-5b99b1eee5d3	ME	ภาควิชาวิศวกรรมเครื่องกล	Department of Mechanical Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
3d6d0d62-ac35-442c-bb5e-86462387d7ea	bc628edc-757c-4d75-8d38-5b99b1eee5d3	CPE	ภาควิชาวิศวกรรมคอมพิวเตอร์	Department of Computer Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
c03365a8-10d2-47d5-b9a1-9faa40abf315	bc628edc-757c-4d75-8d38-5b99b1eee5d3	ENE	ภาควิชาวิศวกรรมสิ่งแวดล้อมและทรัพยากร	Department of Environmental Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
00e0b662-afc1-46b4-99b8-0c05da46dfad	bc628edc-757c-4d75-8d38-5b99b1eee5d3	IND	ภาควิชาวิศวกรรมอุตสาหการ	Department of Industrial Engineering	ภาควิชา	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
1a6168b4-0295-4f6c-bd6f-bc33ca2c759f	bc628edc-757c-4d75-8d38-5b99b1eee5d3	DEAN_OFFICE	สำนักงานเลขานุการคณะวิศวกรรมศาสตร์ กำแพงแสน	Dean Office	สำนักงานเลขานุการ	t	2026-10-22 07:13:08.110716+00	2026-10-22 07:13:08.110716+00
\.


--
-- Data for Name: faculties; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.faculties (id, faculty_code, faculty_name_th, faculty_name_en, campus_name, created_at, updated_at) FROM stdin;
bc628edc-757c-4d75-8d38-5b99b1eee5d3	ENG_KPS	คณะวิศวกรรมศาสตร์ กำแพงแสน	Faculty of Engineering at Kamphaeng Saen	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
58405cfd-29a3-4439-876a-fbe6dd4c11b2	AGR_KPS	คณะเกษตร กำแพงแสน	Faculty of Agriculture at Kamphaeng Saen	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
6aa961a6-e20d-4bf9-a727-d6f91d98d0fb	FLAS_KPS	คณะศิลปศาสตร์และวิทยาศาสตร์	Faculty of Liberal Arts and Science	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
b07fe033-07c0-4c5b-b35b-68d77fadaace	EDU_KPS	คณะศึกษาศาสตร์และพัฒนศาสตร์	Faculty of Education and Development Sciences	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
5ce90ed5-348c-4470-90b8-ca3c0e751e1c	SPS_KPS	คณะวิทยาศาสตร์การกีฬาและพัฒนศาสตร์	Faculty of Sports Science	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
f9143086-9ed0-4bec-8714-700867db6b7b	VET_KPS	คณะสัตวแพทยศาสตร์ กำแพงแสน	Faculty of Veterinary Medicine at Kamphaeng Saen	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
7fe0c518-c28c-4eef-9af4-ebb4e9554487	HTI_KPS	คณะอุตสาหกรรมบริการ	Faculty of Hospitality Industry	กำแพงแสน	2026-10-22 07:13:08.110279+00	2026-10-22 07:13:08.110279+00
\.


--
-- Data for Name: intellectual_properties; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.intellectual_properties (id, ip_title, department_id, ip_category, application_no, registration_no, filing_date, registration_date, expiration_date, registration_year_be, protection_status, protection_level, funding_support_amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ip_inventors; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.ip_inventors (id, ip_id, person_id, inventor_role, contribution_percent, created_at) FROM stdin;
\.


--
-- Data for Name: kpi_actuals; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.kpi_actuals (id, kpi_id, department_id, fiscal_year_be, evaluation_period, actual_value, achievement_rate, is_manual_override, responsible_person, remarks, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: kpi_targets; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.kpi_targets (id, kpi_id, fiscal_year_be, target_value, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: persons; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.persons (id, department_id, title_th, first_name_th, last_name_th, full_name_normalized, academic_position, personnel_type, email, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: publication_authors; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.publication_authors (id, publication_id, person_id, author_role, author_scope, contribution_percent, created_at) FROM stdin;
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.publications (id, publication_title, department_id, publication_type, publication_level, journal_or_conf_name, quartile_or_tier, has_international_coauthor, has_domestic_coauthor, funding_amount, publication_date, fiscal_year_be, volume, issue, page_range, doi, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: research_project_members; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.research_project_members (id, project_id, person_id, role_name, contribution_percent, created_at) FROM stdin;
\.


--
-- Data for Name: research_projects; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.research_projects (id, project_code, project_name_th, project_name_en, managing_department_id, collaboration_type, project_character, funding_source, funding_type, trl_level, integration_type, duration_months, budget_amount, budget_internal, budget_external, fiscal_year_be, start_date, end_date, source_ref, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: strategic_kpis; Type: TABLE DATA; Schema: core; Owner: ku_admin
--

COPY core.strategic_kpis (id, faculty_id, strategy_no, strategy_name, plan_no, plan_name, kpi_code, kpi_name, kpi_description, measurement_unit, collection_cycle, is_automated_calc, calc_formula_code, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
69f15e9c-58c2-434d-9629-e644d9f0a03b	e406c019e53a39be63eeb9bd8003f25803115d2a3958f8ddeb1dbe9bafb03f2d	2026-10-25 19:34:22.655876+00	20261025101735_init_phase_a	\N	\N	2026-10-25 19:34:22.635572+00	1
7a61bc34-1b51-4b07-bcf9-2488d1a489af	2906b47fc9acd474dfb487e4edb23673eaead51a8a1215ac6e0c3cc6db4740bf	2026-10-25 19:34:22.74043+00	20261025102339_full_schema_phase_b	\N	\N	2026-10-25 19:34:22.657776+00	1
6c3d5eb8-45bd-4d68-bf15-53d47f5c1472	5c02325cb14d3cc6ba9c505bfd981e53a998bed2ede04da8469ebe8cf8b12d70	2026-10-25 19:34:22.74492+00	20261025141000_two_tier_roles	\N	\N	2026-10-25 19:34:22.743004+00	1
bc7bd82e-3f05-43e4-991c-19e720160176	bf0944f7d0382749dc22241ce1d49e19ee89a0fa4f429457b6d3769e145407ee	2026-11-08 00:00:12.388299+00	20261026011600_add_personnel_image_url	\N	\N	2026-11-08 00:00:12.378703+00	1
3e41b2e3-d95f-4237-ad40-28ae828bda9b	1050449b5b93e668468073e2eacb6f87e57ed44c9dbb383cfacfcb88c08f1cbf	2026-11-08 00:00:12.451257+00	20261105023000_strategic_kpi_4tier_and_lookups	\N	\N	2026-11-08 00:00:12.389035+00	1
737dc88e-e019-4184-8b23-ee97b76f5e45	d19fe700f8eb34bce96887f40ee2a0d5ff85e189c21ba8ff697c30d97d606c99	2026-11-08 00:00:12.455466+00	20261106223000_split_personnel_name	\N	\N	2026-11-08 00:00:12.452058+00	1
088c5835-0622-4622-808d-ed736c8da654	7409a8190a2244564f7eaa41857fc8d62c1690807739e10dd082151d5b803914	2026-11-08 00:00:12.563236+00	20261107195500_enforce_mandatory_fields	\N	\N	2026-11-08 00:00:12.456195+00	1
04cd5bf6-2842-468f-b8fc-887d3684d3a3	90cd5d12184ce602d28db8f5520b7f811484b7b36a92c7169833ba7f6b0ce356	2026-11-08 00:04:04.997235+00	20261108070000_sync_schema_fields	\N	\N	2026-11-08 00:04:04.985403+00	1
\.


--
-- Data for Name: academic_dev_projects; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.academic_dev_projects (id, legacy_id, name, head_name, head_personnel_id, department_code, client, budget, month, fiscal_year, start_date, end_date, integration_start_date, integration_end_date, created_at, updated_at, alloc_dept, alloc_faculty, alloc_ku, alloc_overhead, alloc_remaining, characteristics, co_members_external, co_members_internal, patent_integration, project_sub_types, project_type_category, record_number, remarks, research_integration, research_projects, service_receiver_type, status) FROM stdin;
6	academic_idx_5	ให้คำปรึกษาการออกแบบและสร้างระบบบ้าน Eco-houses แบบพึ่งพาพลังงานตัวเอง (โซล่าเซลล์) สำหรับรองรับอุทกภัย	ผศ.ดร.วัชมา โพธิ์ทอง	175	OTH	บริษัท ทรีดี \nเอนเนอร์จี จำกัด	200000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.833	2026-10-26 04:20:00.833	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	academic_idx_12	โครงการทดสอบคุณสมบัติมอร์ต้าร์ ของบริษัท คอร์มิกซ์ อินเตอร์เนชั่นแนล จำกัด	อ.ดร.เพ็ญพิชชา  สนิทอินทร์	\N	OTH	บริษัท คอร์มิกซ์ อินเตอร์เนชั่นแนล จำกัด	21600.00	มี.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.845	2026-10-26 04:20:00.845	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	academic_idx_13	การออกแบบระบบควบคุมอัตโนมัติและวิเคราะห์ข้อมูล	รศ.ดร.ธนา ชีพสมทรง	\N	OTH	ผู้ประกอบการ	32000.00	มี.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.847	2026-10-26 04:20:00.847	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
18	academic_idx_17	โครงการทดสอบคุณสมบัติคอนกรีตในงานก่อสร้างจุดตัดทางหลวงหมายเลข 367 ของ บริษัท ยงคอนกรีต จำกัด (มหาชน)	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	OTH	บริษัท ยงคอนกรีต จำกัด (มหาชน)	63529.41	พ.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.853	2026-10-26 04:20:00.853	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
22	academic_idx_21	โครงการพัฒนาสื่อสร้างสรรค์ เสริมภาพลักษณ์องค์กรสู่ยุคดิจิทัล	นางสาวศศิธร ชลรัตน์อมฤต	266	OTH	หน่วยงานภาครัฐ/เอกชน/ผู้สนใจทั่วไป/ชุมชนภายนอก/บุคลากรและนิสิตทั่วไป	250000.00	ก.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.86	2026-10-26 04:20:00.86	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
24	academic_idx_23	โครงการการออกแบบและปฏิบัติการให้น้ำแก่แปลงข้าวโพดขนาดใหญ่ด้วยระบบน้ำหยดแบบ Inline dripper (Low tape drip)	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	OTH	บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)	25450.00	ก.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.863	2026-10-26 04:20:00.863	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	academic_idx_9	โครงการผลิตต้นไม้ป่าขุดล้อมขนาดเล็กคืนสู่แผ่นดิน	ผศ.ดร.วัชมา โพธิ์ทอง	175	OTH	ไม่ระบุผู้ว่าจ้าง	100000.00	ก.พ.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.84	2026-10-26 04:20:00.84	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	academic_idx_39	โครงการวิเคราะห์ข้อมูลเพื่อบูรณาการข้อมูลสำหรับการประเมินผลด้านทรัพยากรน้ำของประเทศ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	บริษัท \nคลิกเกอร์แล็บ \nจำกัด	8000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.908	2026-10-26 04:20:00.908	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	academic_idx_34	โครงการทดสอบวัสดุทางวิศวกรรมโยธา ประจำปีงบประมาณ \nพ.ศ. 2569	รศ.กฤษณะ  จันทรโชติ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	1000000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.892	2026-10-26 04:20:00.892	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	academic_idx_0	จ้างบำรุงรักษาระบบทะเบียนผู้ฝึกอาชีพ (JOB.DIPROM) ประจำปีงบประมาณ พ.ศ. 2568	ผศ.ดร.จักกริช พฤษการ	147	CPE	ไม่ระบุผู้ว่าจ้าง	420000.00	ม.ค.	2026	2026-10-25	2026-10-31	2026-10-31	2027-10-31	2026-10-26 04:20:00.819	2026-10-26 04:20:00.819	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	academic_idx_1	โครงการพัฒนาระบบสารสนเทศในการรวบรวมสำรวจและประเมินศักยภาพเอสเอ็มอี เพื่อใช้ในการพิจารณาสินเชื่อเบื้องต้น ปีงบประมาณ พ.ศ. 2568	ผศ.ดร.ทรงศักดิ์ \nภัทราวุฒิชัย	\N	OTH	ไม่ระบุผู้ว่าจ้าง	5000000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.824	2026-10-26 04:20:00.824	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	academic_idx_2	โครงการระบบการออกเอกสารในรูปแบบอิเล็กทรอนิกส์ของกรมโรงงานอุตสาหกรรม ระยะที่ ๓  (DIW Electronic Document Phase ๓ ) แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร ๑ ระบบ	ผศ.ดร.จักกริช พฤษการ	147	OTH	ไม่ระบุผู้ว่าจ้าง	13500000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.826	2026-10-26 04:20:00.826	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	academic_idx_3	ค่าใช้จ่ายในการศึกษาเพื่อพัฒนาหลักเกณฑ์การดำเนินการเกี่ยวกับสัมปทานประกอบกิจการประปา	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	7860000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.828	2026-10-26 04:20:00.828	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	academic_idx_4	กิจกรรมการพัฒนาเทคโนโลยีดิจิทัลและปัญญาประดิษฐ์สำหรับอุตสาหกรรมอาหารภายใต้โครงการซอฟต์พาวเวอร์ สาขาอาหาร ปีงบประมาณ พ.ศ. 2568	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	3990000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.831	2026-10-26 04:20:00.831	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	academic_idx_6	จ้างที่ปรึกษาโครงการระบบเชื่อมโยงข้อมูลเพื่อรองรับการดำเนินการทางอิเล็กทรอนิกส์ภายใต้อนุสัญญาบาเซล แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	9000000.00	ม.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.835	2026-10-26 04:20:00.835	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	academic_idx_7	โครงการศึกษาจัดทำแผนแม่บทการบริหารจัดการทรัพยากรน้ำ ในเขตลุ่มน้ำท่าจีน ปรับปรุงช่วงที่ 1 (พ.ศ.2566 - 2580)	ผศ.ดร.ทรงศักดิ์ \nภัทราวุฒิชัย	\N	OTH	ไม่ระบุผู้ว่าจ้าง	18594000.00	ก.พ.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.837	2026-10-26 04:20:00.837	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	academic_idx_8	โครงการศึกษาจัดทำแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ปรับปรุงช่วงที่ 1 (พ.ศ.2566-2580)	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	18340000.00	ก.พ.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.838	2026-10-26 04:20:00.838	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	academic_idx_10	โครงการค่าใช้จ่ายในการพัฒนาระบบตรวจวัดปริมาณน้ำเก็บกักในแหล่งน้ำขนาดเล็กพื้นที่ภาคตะวันออกเฉียงเหนือ ระยะที่ 3 เพื่อการพัฒนาศักยภาพการเก็บกักและบริหารจัดการทรัพยากรน้ำ กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	20000000.00	ก.พ.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.842	2026-10-26 04:20:00.842	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	academic_idx_11	ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น	ผศ.ดร.วัชมา โพธิ์ทอง	175	OTH	ไม่ระบุผู้ว่าจ้าง	500000.00	ก.พ.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.843	2026-10-26 04:20:00.843	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
15	academic_idx_14	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	ผศ.ดร.จิรเกียรติ ทรายทอง	127	OTH	ไม่ระบุผู้ว่าจ้าง	1358823.53	เม.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.848	2026-10-26 04:20:00.848	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	academic_idx_15	การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย	รศ.ดร.ชัยศรี สุขสาโรจน์	38	OTH	ไม่ระบุผู้ว่าจ้าง	6793588.00	พ.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.85	2026-10-26 04:20:00.85	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
17	academic_idx_16	การศึกษาพฤติกรรมการไหลของของไหลสำหรับอุปกรณ์แลกเปลี่ยนความร้อนแบบท่อ Vortex	รศ.ดร.เบญญา กสานติกุล	107	OTH	ไม่ระบุผู้ว่าจ้าง	50600.00	พ.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.851	2026-10-26 04:20:00.851	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
19	academic_idx_18	จ้างบำรุงรักษาระบบข้อมูลเพื่อรองรับการขับเคลื่อนการใช้ประโยชน์ข้อมูลขนาดใหญ่	ผศ.ดร.จักกริช พฤษการ	147	OTH	ไม่ระบุผู้ว่าจ้าง	350000.00	มิ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.854	2026-10-26 04:20:00.854	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
20	academic_idx_19	โครงการก่อสร้างถังเก็บน้ำใส 70,000 ลบ.ม.สถานีสูบน้ำมินบุรี ของ บริษัท วงษ์สยามก่อสร้าง จำกัด	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	OTH	ไม่ระบุผู้ว่าจ้าง	36000.00	มิ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.855	2026-10-26 04:20:00.855	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
21	academic_idx_20	ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ครั้งที่ 2	ผศ.ดร.วัชมา โพธิ์ทอง	175	OTH	ไม่ระบุผู้ว่าจ้าง	500000.00	มิ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.859	2026-10-26 04:20:00.859	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
23	academic_idx_22	การทดสอบสมรรถนะอุปกรณ์ตัดหญ้าไหล่ทาง	ดร.นิติรงค์ พงษ์พานิช	251	OTH	ไม่ระบุผู้ว่าจ้าง	43700.00	ก.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.862	2026-10-26 04:20:00.862	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	academic_idx_24	โครงการจัดทำแผนปรับปรุงและบำรุงรักษาอาคารและระบบชลประทาน ส่วนปรับปรุงบำรุงรักษา แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	4990000.00	ก.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.865	2026-10-26 04:20:00.865	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	academic_idx_25	โครงการศึกษางานซ่อมถังน้ำคอนกรีตขนาดใหญ่โดยใช้วัสดุซ่อมแซมสมรรถนะสูง แบบเทและฉาบ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	OTH	ไม่ระบุผู้ว่าจ้าง	2226210.00	ก.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.866	2026-10-26 04:20:00.866	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	academic_idx_26	โครงการให้บริการทดสอบเครื่องยนต์ขนาดเล็กและน้ำมันเชื้อเพลิง ปีงบประมาณ 2569	นายพิสิษฐ์ อินทรวิรัตน์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	80000.00	ก.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.869	2026-10-26 04:20:00.869	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	academic_idx_27	โครงการการทดสอบเครื่องจักรกลการเกษตร	นายทิตินัย เทียนแย้ม	254	OTH	ไม่ระบุผู้ว่าจ้าง	100000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.871	2026-10-26 04:20:00.871	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
29	academic_idx_28	โครงการให้บริการด้านการพัฒนา ผลิตเครื่องมือเครื่องจักร และสิ่งประดิษฐ์ด้านการเกษตร พลังงานและสิ่งแวดล้อม (ปี 2569)	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	300000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.873	2026-10-26 04:20:00.873	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	academic_idx_29	การอบรมเชิงปฏิบัติการและการทดสอบชุดสูบน้ำระบบไฮดรอลิคแบบปรับช่วงการทำงานประสิทธิภาพสูงขนาดใหญ่เพื่อการใช้งานด้านการบริหารและการจัดการน้ำในประเทศ	ผศ.ดร.วัชมา โพธิ์ทอง	175	OTH	ไม่ระบุผู้ว่าจ้าง	200000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.876	2026-10-26 04:20:00.876	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	academic_idx_59	โครงการประเมินปริมาณน้ำเสียชุมชนเพื่อการวางแผนระบบบำบัดน้ำเสียอย่างยั่งยืน	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	OTH	ไม่ระบุผู้ว่าจ้าง	481000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:00.987	2026-10-26 04:20:00.987	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	academic_idx_30	โครงการให้บริการด้านการออกแบบ ติดตั้ง และพัฒนาเครื่องจักร อุปกรณ์ ที่เกี่ยวข้องกับการผลิตพลังงานทดแทน (ปี 2569)	ดร.อรรถวุทธิ์ รื่นเริงใจ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	1000000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.879	2026-10-26 04:20:00.879	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	academic_idx_31	จ้างจัดหาระบบควบคุมประตูระบายน้ำจากระยะไกลในพื้นที่สำนักงานชลประทานที่ 10 ตำบลเขาพระงาม อำเภอเมืองลพบุรี จังหวัดลพบุรี	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	24538000.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.882	2026-10-26 04:20:00.882	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	academic_idx_32	จ้างจัดหาระบบควบคุมระยะไกลของ ปตร.มหาราชและอาคารประกอบ สำนักงานชลประทานที่ 10 ตำบลตลุก อำเภอสรรพยา จังหวัดชัยนาท	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	24854700.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.885	2026-10-26 04:20:00.885	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	academic_idx_33	จ้างบริการบำรุงรักษาและซ่อมแซมแก้ไขคอมพิวเตอร์ ระบบสารสนเทศตามพระราชบัญญัติวัตถุอันตราย พ.ศ. 2535 ปีงบประมาณ พ.ศ. 2569	อาจารย์พฤษพล ตั้งสัจจะธรรม	\N	OTH	ไม่ระบุผู้ว่าจ้าง	499200.00	ต.ค.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.889	2026-10-26 04:20:00.889	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	academic_idx_35	โครงการให้บริการตรวจสอบเสถียรภาพของอาคาร 9 ประเภท	อ.ธิติพงศ์ โพธิสุทธิ์	69	OTH	ไม่ระบุผู้ว่าจ้าง	500000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.895	2026-10-26 04:20:00.895	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	academic_idx_36	โครงการพัฒนาแนวทางการประเมินประสิทธิผลและความคุ้มค่าของงานอำนวยความปลอดภัยทางหลวง 1 โครงการ	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	20000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.898	2026-10-26 04:20:00.898	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	academic_idx_37	โครงการขับเคลื่อนภาคอุตสาหกรรมสู่การเปลี่ยนผ่านการผลิตที่ยั่งยืนและยกระดับความสามารถในการแข่งขันด้วยเทคโนโลยีหรือนวัตกรรม	ผศ.ดร.หทัยเทพ  วงศ์สุวรรณ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	6190200.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.901	2026-10-26 04:20:00.901	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
39	academic_idx_38	ค่าใช้จ่ายในการพัฒนาระบบแบบจำลองทางคณิตศาสตร์เพื่อการพยากรณ์น้ำฝน-น้ำท่าของพื้นที่ลุ่มน้ำประเทศไทย กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	18100000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.905	2026-10-26 04:20:00.905	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	academic_idx_40	โครงการวิเคราะห์และจัดทำชุดความรู้การบริหารจัดการทรัพยากรน้ำระดับชุมชน	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	2500000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.912	2026-10-26 04:20:00.912	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	academic_idx_41	จ้างที่ปรึกษาโครงการระบบติดตามและควบคุมการครอบครองของเสียเคมีวัตถุ แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	OTH	ไม่ระบุผู้ว่าจ้าง	10000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.916	2026-10-26 04:20:00.916	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	academic_idx_42	โครงการระบบการอนุญาตวัตถุอันตรายเพื่ออำนวยความสะดวกด้านการค้าการลงทุน แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ	ผศ.ดร.จักกริช พฤษการ	147	OTH	ไม่ระบุผู้ว่าจ้าง	20000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.919	2026-10-26 04:20:00.919	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	academic_idx_43	จ้างที่ปรึกษาโครงการปรับปรุงระบบเฝ้าระวังและเตือนภัยมลพิษระยะไกล (D-POMS) แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 1 ระบบ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	15000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.923	2026-10-26 04:20:00.923	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	academic_idx_44	โครงการศึกษาจัดทำคู่มือแนวทางการบริหารจัดการน้ำในภาวะวิกฤติ (ตามมาตรา 24)	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	2000000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.926	2026-10-26 04:20:00.926	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	academic_idx_45	โครงการรวบรวม ตรวจสอบ วิเคราะห์ความถูกต้องของข้อมูลสถานการณ์น้ำ ส่วนประมวลวิเคราะห์สถานการณ์น้ำ แขวงถนนนครไชยศรี เขตดุสิต กรุงเทพมหานคร	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	2990000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.93	2026-10-26 04:20:00.93	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	academic_idx_46	ค่าใช้จ่ายในการจัดทำกลยุทธ์การกำหนดนโยบายและความร่วมมือด้านพลังงานของประเทศเพื่อรองรับการเปลี่ยนแปลงในระยะยาว	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	1360000.00	พ.ย.	\N	\N	\N	\N	\N	2026-10-26 04:20:00.934	2026-10-26 04:20:00.934	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	academic_idx_47	ค่าใช้จ่ายในการประเมิน วางแผน จัดทำนโยบายธรรมาภิบาลข้อมูล (Data Governance) กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	21864368.00	1	\N	\N	\N	\N	\N	2026-10-26 04:20:00.937	2026-10-26 04:20:00.937	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	academic_idx_48	โครงการสนับสนุนการขับเคลื่อนภาคอุตสาหกรรมเพื่อการเติบโตที่ส่งผลต่อระบบเศรษฐกิจของประเทศ (กิจกรรมส่งเสริมการลงทุนเพื่อการขยายตัวภาคอุตสาหกรรมแห่งอนาคตและเศรษฐกิจหมุนเวียน)	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	OTH	ไม่ระบุผู้ว่าจ้าง	8499528.00	1	\N	\N	\N	\N	\N	2026-10-26 04:20:00.941	2026-10-26 04:20:00.941	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	academic_idx_49	จ้างติดตั้งและจัดทำระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ พื้นที่ฝั่งขวาแม่น้ำยม สำหรับงานเพิ่มประสิทธิภาพการบริหารจัดการน้ำฝั่งขวาแม่น้ำยมในเขตอำเภอบางระกำ จังหวัดพิษณุโลก ด้วยระบบติดตามสถานการณ์น้ำระยะไกลอัตโนมัติ	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	15043000.00	1	\N	\N	\N	\N	\N	2026-10-26 04:20:00.945	2026-10-26 04:20:00.945	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	academic_idx_50	โครงการบริการวิเคราะห์เเก๊สเรือนกระจกด้วยเครื่อง Gas chromatography พ.ศ. 2569	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	900000.00	1	\N	\N	\N	\N	\N	2026-10-26 04:20:00.95	2026-10-26 04:20:00.95	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	academic_idx_51	ให้คำปรึกษา และ ทดสอบโครงกรอบประตู หน้าต่าง ผนังอลูมิเนียมหรือวัสดุอื่น ติดกระจกตามมาตรฐาน มอก. และมาตรฐานสากลอื่น ประจำปี 2569	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	OTH	ไม่ระบุผู้ว่าจ้าง	1000000.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.954	2026-10-26 04:20:00.954	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	academic_idx_52	จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 1 ตำบลชุมแพ อำเภอชุมแพ จังหวัดขอนแก่น	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	24870300.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.958	2026-10-26 04:20:00.958	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	academic_idx_53	จ้างจัดทำและติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำ สำหรับงานโครงการติดตั้งระบบช่วยสนับสนุนการบริหารจัดการน้ำในโครงการส่งน้ำและบำรุงรักษาหนองหวาย (แม่น้ำชี) ตำบลน้ำพอง อำเภอน้ำพอง จังหวัดขอนแก่น	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	24900000.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.963	2026-10-26 04:20:00.963	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	academic_idx_54	จ้างจัดทำและติดตั้งระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกล สำหรับโครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในโครงการส่งน้ำและบำรุงรักษาพรม-เชิญ ช่วงที่ 2 ตำบลบ้านยาง อำเภอเกษตรสมบูรณ์ จังหวัดชัยภูมิ	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	24461600.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.968	2026-10-26 04:20:00.968	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	academic_idx_55	จ้างจัดทำโครงการพัฒนาระบบปัญญาประดิษฐ์ในการช่วยสนับสนุนการตัดสินใจในการบริหารจัดการน้ำของอ่างเก็บน้ำคลองกะทะ ตำบลฉลอง อำเภอเมืองภูเก็ต จังหวัดภูเก็ต	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	15637800.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.974	2026-10-26 04:20:00.974	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	academic_idx_56	ค่าใช้จ่ายในการศึกษาและจัดทำหลักเกณฑ์ มาตรฐานเครื่องวัดน้ำหรือประเมินปริมาณน้ำที่ใช้เพื่อเพิ่มประสิทธิภาพการควบคุมการใช้ทรัพยากรน้ำสาธารณะที่มิใช่น้ำจากทางน้ำชลประทาน กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	4847000.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.978	2026-10-26 04:20:00.978	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	academic_idx_57	โครงการวิเคราะห์และจัดทำชุดความรู้การบริหารจัดการทรัพยากรน้ำชุมชน	ผศ.ดร.เกศวรา สิทธิโชค	45	OTH	ไม่ระบุผู้ว่าจ้าง	2595440.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.981	2026-10-26 04:20:00.981	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	academic_idx_58	จ้างที่ปรึกษาทบทวนแบบก่อสร้างศูนย์บริหารจัดการคุณภาพน้ำ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	335000.00	2	\N	\N	\N	\N	\N	2026-10-26 04:20:00.984	2026-10-26 04:20:00.984	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	academic_idx_60	โครงการศึกษาความเหมาะสมและผลกระทบสิ่งแวดล้อม จัดหาแหล่งกักเก็บน้ำ อาคารประกอบ และโครงข่ายน้ำสำหรับใช้ในโครงการศูนย์ธุรกิจ EEC และเมืองใหม่น่าอยู่อัจฉริยะ จังหวัดชลบุรี	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	24000000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:00.99	2026-10-26 04:20:00.99	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	academic_idx_61	จ้างจัดหาระบบควบคุมระยะไกลของประตูระบายน้ำพระเอกาทศรถ สำนักงานก่อสร้างชลประทานขนาดใหญ่ที่ 11 สำนักพัฒนาแหล่งน้ำขนาดใหญ่ กรมชลประทาน	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	OTH	ไม่ระบุผู้ว่าจ้าง	15000000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:00.994	2026-10-26 04:20:00.994	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	academic_idx_62	โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท วัสดุภัณฑ์ธุรกิจ จำกัด)	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	350000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:00.997	2026-10-26 04:20:00.997	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
64	academic_idx_63	โครงการที่ปรึกษาในการศึกษาความเหมาะสม การออกแบบ และจัดทำเอกสารข้อเสนอประกวดราคา (บริษัท กลุ่ม 79 จำกัด)	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	OTH	ไม่ระบุผู้ว่าจ้าง	350000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:01	2026-10-26 04:20:01	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	academic_idx_64	โครงการวิจัยและพัฒนาท่อโค้งและท่อสามทางซีเมนต์ใยหินไฮบริดชนิดทนความดันพลัส  (HAC Plus)	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	OTH	ไม่ระบุผู้ว่าจ้าง	150000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:01.005	2026-10-26 04:20:01.005	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	academic_idx_65	งานจ้างศึกษาเบื้องต้นการตรวจสอบสภาพโครงสร้างคอนกรีตของเขื่อนเจ้าพระยาและการประเมินสภาพความเสียหายที่จะก่อให้เกิดการพังทลายในรูปแบบต่างๆ	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	OTH	ไม่ระบุผู้ว่าจ้าง	127500.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:01.01	2026-10-26 04:20:01.01	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	academic_idx_66	โครงการสำรวจและออกแบบรายละเอียดสถานีสูบน้ำหนองปลาไหล แห่งที่ 4 เพื่อทดแทนสถานีสูบน้ำหนองปลาไหล 2 สถานีสูบน้ำหนองปลาไหล 3	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	OTH	ไม่ระบุผู้ว่าจ้าง	3900000.00	3	\N	\N	\N	\N	\N	2026-10-26 04:20:01.013	2026-10-26 04:20:01.013	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	academic_idx_67	การประเมินผลของสารกระตุ้นทางชีวภาพต่อการเจริญเติบโตและผลผลิตของอ้อยและมันสำปะหลัง ณ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ประเทศไทย ระยะที่ 2	รศ.ดร.ชัยศรี สุขสาโรจน์	38	OTH	ไม่ระบุผู้ว่าจ้าง	7543647.00	4	\N	\N	\N	\N	\N	2026-10-26 04:20:01.022	2026-10-26 04:20:01.022	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	academic_idx_68	การจ้างดำเนินงานโครงการการประเมินผลสัมฤทธิ์โครงการของกรมทรัพยากรน้ำ กรมทรัพยากรน้ำ แขวงพญาไท เขตพญาไท กรุงเทพมหานคร ประจำปีงบประมาณ พ.ศ. 2569	ผศ.ดร.ไชยาพงษ์ \nเทพประสิทธิ์	\N	OTH	ไม่ระบุผู้ว่าจ้าง	500000.00	4	\N	\N	\N	\N	\N	2026-10-26 04:20:01.025	2026-10-26 04:20:01.025	0.00	0.00	0.00	0.00	0.00	\N	0	0	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: academic_services; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.academic_services (id, legacy_id, name, service_category, provider_name, provider_personnel_id, department_code, target_group, hours_spent, attendees_count, date, start_date, end_date, fiscal_year, created_at, updated_at, remarks) FROM stdin;
192	service_idx_190	เป็นกรรมการหลักสูตร วศ.บ.วิศวกรรมอุตสาหการ	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.275	2026-10-26 04:20:02.275	\N
110	service_idx_108	เป็นผู้ทรงคุณวุฒิ\nประเมินบทความนานาชาติ	วิชาการ	ดร.ธนัญกรณ์ ใจผ่อง	\N	OTH	Sugar Tech	1.00	1	1968-07-17	1968-07-17	1968-07-17	1968	2026-10-26 04:20:01.953	2026-10-26 04:20:01.953	\N
1	service_1792829081701	test	วิชาการ	test test	308	OTH	test	1.00	1	2026-10-24	2026-10-24	2026-10-25	2026	2026-10-26 04:20:01.544	2026-10-26 04:20:01.544	\N
193	service_idx_191	เป็นกรรมการหลักสูตร วศ.บ.วิศวกรรมชลประทาน	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.281	2026-10-26 04:20:02.281	\N
207	service_idx_205	เป็นกรรมการคณะวิทยาศาสตร์และวิศวกรรมศาสตร์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.33	2026-10-26 04:20:02.33	\N
190	service_idx_188	เป็นกรรมการหลักสูตร วศม.วิศวกรรมอาหาร	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.268	2026-10-26 04:20:02.268	\N
8	service_idx_6	ประชุมคณะอนุกรรมาธิการศึกษาและแก้ไขปัญหาลุ่มน้ำวัง ครั้งที่ 3	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-09	1968-01-09	1968-01-09	1968	2026-10-26 04:20:01.57	2026-10-26 04:20:01.57	\N
9	service_idx_7	ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 20	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-15	1968-01-15	1968-01-15	1968	2026-10-26 04:20:01.572	2026-10-26 04:20:01.572	\N
10	service_idx_8	ประชุมคณะกรรมาธิการการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 43	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-16	1968-01-16	1968-01-16	1968	2026-10-26 04:20:01.574	2026-10-26 04:20:01.574	\N
72	service_idx_70	Toward Net-Zero Production, Food Security and Sustainability"	วิชาการ	ดร.ธนัญกรณ์  ใจผ่อง	\N	AE	11th Asian Crop Science Association Conference (ACSAC11) Taipei, Taiwan	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.789	2026-10-26 04:20:01.789	\N
16	service_idx_14	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติภาค 2	1.00	1	1968-01-29	1968-01-29	1968-01-29	1968	2026-10-26 04:20:01.586	2026-10-26 04:20:01.586	\N
17	service_idx_15	ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 22	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-29	1968-01-29	1968-01-29	1968	2026-10-26 04:20:01.588	2026-10-26 04:20:01.588	\N
2	service_idx_0	คณะทำงานร่างแก้ไขข้อกำหนดการตรวจสภาท่า	ผู้ทรงคุณวุฒิ	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	CE	สมาคมความปลอดภัยทางน้ำ	1.00	1	1968-01-07	1968-01-07	1968-01-07	1968	2026-10-26 04:20:01.555	2026-10-26 04:20:01.555	\N
3	service_idx_1	ประเมินข้อเสนอโครงการวิจัย\nประจำปีงบประมาณ 2568 ภายใต้แผนงาน Global Partnership	ศึกษาดูงาน วศ.กพส.	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)	1.00	1	1968-01-14	1968-01-14	1968-01-14	1968	2026-10-26 04:20:01.558	2026-10-26 04:20:01.558	\N
4	service_idx_2	พิจารณาผลงานทางวิชาการ	วิชาชีพ	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	สถาบันเทคโนโลยีพระจอมเกล้าคุณทหารลาดกระบัง	1.00	1	1968-01-20	1968-01-20	1968-01-20	1968	2026-10-26 04:20:01.561	2026-10-26 04:20:01.561	\N
5	service_idx_3	เป็นผู้ทรงคุณวุฒิพิจารณาหลักสูตร\nระดับปริญญาตรี ระดับปริญญาโท สาขาวิชาวิศวกรรมอาหาร	วิทยากร/อาจารย์พิเศษ	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	คณะวิศวกรรมและอุตสาหกรรมเกษตร มหาวิทยาลัยแม่โจ้	1.00	1	1968-01-31	1968-01-31	1968-01-31	1968	2026-10-26 04:20:01.563	2026-10-26 04:20:01.563	\N
6	service_idx_4	วิชา 01418385 Digital Image Processing หมู่ 800	วิทยานิพนธ์ภายนอก	ผศ.ดร.เสกสรร มธุลาภรังสรรค์	\N	CPE	คณะวิทยาศาสตร์ ศรีราชา มหาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตศรีราชา	1.00	1	1968-02-01	1968-02-01	1968-02-01	1968	2026-10-26 04:20:01.565	2026-10-26 04:20:01.565	\N
7	service_idx_5	ประชุมคณะกรรมการทรัพยากรน้ำแห่งชาติ ครั้งที่ 1/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการทรัพยากรนน้ำแห่งชาติ สทนช.	1.00	1	1968-01-06	1968-01-06	1968-01-06	1968	2026-10-26 04:20:01.568	2026-10-26 04:20:01.568	\N
11	service_idx_9	ประชุมคณะอนุกรรมาธิการศึกษาและแก้ไขปัญหาลุ่มน้ำวัง ครั้งที่ 4	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-16	1968-01-16	1968-01-16	1968	2026-10-26 04:20:01.576	2026-10-26 04:20:01.576	\N
12	service_idx_10	ผู้ทรงพิจารณาบทความทางวิชาการ	วิชาการ	ผศ.ดร.ศศิวมล ขาวโกมล	\N	IRE	วารสาร Journal of Environmental Management	1.00	1	1968-01-01	1968-01-01	1968-01-01	1968	2026-10-26 04:20:01.579	2026-10-26 04:20:01.579	\N
13	service_idx_11	ประชุมคณะกรรมการวิชาการลุ่มน้ำเจ้าพระยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการทรัพยากรน้ำแห่งชาติ สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	1968-01-24	1968-01-24	1968-01-24	1968	2026-10-26 04:20:01.581	2026-10-26 04:20:01.581	\N
14	service_idx_12	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการทรัพยากรน้ำแห่งชาติ สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	1968-01-28	1968-01-28	1968-01-28	1968	2026-10-26 04:20:01.583	2026-10-26 04:20:01.583	\N
15	service_idx_13	ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 21	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-01-22	1968-01-22	1968-01-22	1968	2026-10-26 04:20:01.585	2026-10-26 04:20:01.585	\N
18	service_idx_16	ประชุมคณะกรรมการพัฒนาหลักสูตรวิศวกรรมศาสตรบัณฑิต วิทยาลัยการชลประทาน ครั้งที่ 1/2568	วิชาการ	รศ.ดร.วราวุธ วุฒิวณิชย์	\N	IRE	วิทยาลัยการชลประทาน สถาบันสมทบมหาวิทยาลัยเกษตรศาสตร์ จ.นนทบุรี	1.00	1	1968-01-30	1968-01-30	1968-01-30	1968	2026-10-26 04:20:01.59	2026-10-26 04:20:01.59	\N
19	service_idx_17	วิทยากรและจัดแสดงนิทรรศการในด้านการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม การจัดการเศษวัสดุเหลือใช้จากการเกษตร ภายใต้โครงการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม ซึ่งจัดโดยจังหวัดนครปฐม ณ อาคารเอนกประสงค์โรงเรียนวัดไผ่หูช้าง ต.ไผ่หูช้าง \nอ.บางเลน จ.นครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	EEEC	เกษตรกรจังหวัดนครปฐม	1.00	1	1968-01-16	1968-01-16	1968-01-16	1968	2026-10-26 04:20:01.592	2026-10-26 04:20:01.592	\N
20	service_idx_18	วิทยากรภายใต้โครงการพัฒนาบุคลากรสู่เศรษฐกิจมูลค่าสูงที่เป็นมิตรต่อสิ่งแวดล้อมในเขตเศรษฐกิจพิเศษภาคตะวันออก (ระยะที่ 2) ณ บ้านคลองใหญ่ ต.บ่อทอง อ.บ่อทอง จ.ชลบุรี	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	EEEC	ประชาชนในพื้นที่	1.00	1	1968-01-17	1968-01-17	1968-01-17	1968	2026-10-26 04:20:01.596	2026-10-26 04:20:01.596	\N
21	service_idx_19	เครื่องผลิตปุ๋ยหมัก 7 วัน ณ กรมยุทธศึกษาทหารเรือ ต.ศาลายา \nอ.พุทธมณฑล จ.นครปฐม	วิชาการ	นายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น	\N	EEEC	กรมยุทธศึกษาทหารเรือ	1.00	1	1968-01-28	1968-01-28	1968-01-28	1968	2026-10-26 04:20:01.598	2026-10-26 04:20:01.598	\N
22	service_idx_20	เป็นผู้แทนองค์กรวิชาชีพเข้าร่วมประชุมการประเมินมาตรฐานวิชาชีพ ปีการศึกษา 2567	วิชาการ	นายเสกสรร สีหวงษ์	\N	AE	วิทยาลัยเกษตรและเทคโนโลยีนครราชสีมา สถาบันการอาชีวศึกษาเกษตร \nภาคตะวันออกเฉียงเหนือ	1.00	1	1968-01-22	1968-01-22	1968-01-22	1968	2026-10-26 04:20:01.6	2026-10-26 04:20:01.6	\N
23	service_idx_21	กรรมการวิพากษ์หลักสูตร	วิชาการ	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	AE	คณะวิศวกรรมและอุตสาหการเกษตร มหาวิทยาลัยแม่โจ้	1.00	1	1968-02-13	1968-02-13	1968-02-13	1968	2026-10-26 04:20:01.603	2026-10-26 04:20:01.603	\N
24	service_idx_22	วิชา 01418385 Digital Image Processing หมู่ 870	วิชาการ	ผศ.ดร.เสกสรรค์ มธุลาภรังสรรค์	149	CPE	คณะวิทยาศาสตร์ ศรีราชา มหาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตศรีราชา	1.00	1	1968-02-01	1968-02-01	1968-02-01	1968	2026-10-26 04:20:01.604	2026-10-26 04:20:01.604	\N
25	service_idx_23	ให้คำปรึกษาและข้อเสนอแนะในการพัฒนาและปรับปรุงกระบวนการผลิตน้ำนมข้าวโพด	วิชาการ	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	ศูนย์วิจัยข้าวโพดและข้าวฟ่างแห่งชาติ อ.ปากช่อง จ.นครราชสีมา	1.00	1	1968-02-05	1968-02-05	1968-02-05	1968	2026-10-26 04:20:01.606	2026-10-26 04:20:01.606	\N
26	service_idx_24	กรรมการสอบวิทยานิพนธ์ เรื่อง\nThe Study of the influence of variability on hoek-brown\nparameters using random field theory	วิชาการ	ผศ.ดร.เพ็ญพิชชา  สนิทอินทร์	\N	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต	1.00	1	1968-02-07	1968-02-07	1968-02-07	1968	2026-10-26 04:20:01.608	2026-10-26 04:20:01.608	\N
27	service_idx_25	กรรมการสอบวิทยานิพนธ์ เรื่อง\nPrediction of failure envelopes of foundations using machine\nlearning algorithm and finite element limit analysis	วิชาการ	ผศ.ดร.เพ็ญพิชชา  สนิทอินทร์	\N	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ \nศูนย์รังสิต	1.00	1	1968-02-07	1968-02-07	1968-02-07	1968	2026-10-26 04:20:01.61	2026-10-26 04:20:01.61	\N
28	service_idx_26	ซ่อมเครื่องทอดสุญญากาศ \nและฝึกอบรมการใช้งานและซ่อมบำรุงเครื่องทอดพร้อมอุปกรณ์\nต่อพ่วงเบื้องต้น	วิชาการ	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	สำนักพระราชวัง สวนจิตรลดา กรุงเทพมหานคร\n(โครงการอุทยานธรรมชาติวิทยาฯ อ.สาวนผึ้ง จ.ราชบุรี)	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.612	2026-10-26 04:20:01.612	\N
29	service_idx_27	การเขียนโปรแกรม Arduino IDE สำหรับการใช้แขนหุ่นยนต์เพื่อการศึกษา	วิชาการ	ผศ.ดร.พิเชษฐ์  สืบสายพรหม	\N	CPE	โรงเรียนสิรินธรราชวิทยาลัย\nอ.เมือง จ.นครปฐม	1.00	1	1968-02-01	1968-02-01	1968-02-01	1968	2026-10-26 04:20:01.617	2026-10-26 04:20:01.617	\N
30	service_idx_28	เป็นผู้เชี่ยวชาญประเมินคุณภาพชุดสื่ออินโฟกราฟิก (ด้านเนื้อหา)	วิชาการ	ดร.ธนัญกรณ์  ใจผ่อง	\N	AE	คณะเทคโนโลยีการเกษตร\nสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง	1.00	1	1968-02-01	1968-02-01	1968-02-01	1968	2026-10-26 04:20:01.62	2026-10-26 04:20:01.62	\N
75	service_idx_73	เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับนานาชาติ	วิชาการ	ผศ.ดร.วันรัฐ อับดุลลากาซิม	\N	AE	วารสาร Engineering and Technology Horizons	1.00	1	1968-05-01	1968-05-01	1968-05-01	1968	2026-10-26 04:20:01.804	2026-10-26 04:20:01.804	\N
31	service_idx_29	เข้าร่วมประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 23	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สำนักงานเลขาธิการสภาผู้แทนราษฎร ในคณะกรรมาธิการบริการจัดทรัพยากรน้ำสภาผู้แทนราษฎร	1.00	1	1968-02-05	1968-02-05	1968-02-05	1968	2026-10-26 04:20:01.622	2026-10-26 04:20:01.622	\N
32	service_idx_30	เข้าร่วมประชุมคณะกรรมการทรัพยากรน้ำแห่งชาติ ครั้งที่ 2/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการทรัพยากรน้ำแห่งชาติ สทนช.	1.00	1	1968-02-21	1968-02-21	1968-02-21	1968	2026-10-26 04:20:01.625	2026-10-26 04:20:01.625	\N
33	service_idx_31	เข้าร่วมประชุมคณะอนุกรรมมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 25	วิชาการ	ผศ.ดร.ชูพันธ์ ชมภูจันทร์	\N	IRE	สำนักงานเลขาธิการสภาผู้แทนราษฎร	1.00	1	1968-02-19	1968-02-19	1968-02-19	1968	2026-10-26 04:20:01.628	2026-10-26 04:20:01.628	\N
34	service_idx_32	เข้าร่วมประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช.ภาค 2	1.00	1	1968-02-25	1968-02-25	1968-02-25	1968	2026-10-26 04:20:01.63	2026-10-26 04:20:01.63	\N
35	service_idx_33	เป็นอาจารย์พิเศษ \nบรรยายในหัวข้อ "Quality Management and Control"	ศึกษาดูงาน วศ.กพส.	ผศ.ดร.จิรเกียรติ ทรายทอง	127	IE	คณะวิทยาการจัดการ มหาวิทยาลัยสงขลานครินทร์	1.00	1	1968-02-28	1968-02-28	1968-02-28	1968	2026-10-26 04:20:01.633	2026-10-26 04:20:01.633	\N
36	service_idx_34	ร่วมจัดแสดงนิทรรศการผลงานวิจัยนวัตกรรมในงานเกษตรแฟร์ 2568 ณ โดมแอร์หน้าอาคารจักรพันธ์เพ็ญศิริ มหาวิทยาลัยเกษตรศาสตร์	วิชาการ	นายวีระพงษ์ กระแสธีป\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์	\N	OTH	นักเรียน นักศึกษา อาจารย์ และประชาชนทั่วไป	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.636	2026-10-26 04:20:01.636	\N
37	service_idx_35	คณะผู้บริหารและนิสิตแลกเปลี่ยนจาก Tokyo University of Agriculture (TUA) ประเทศญี่ปุ่น	วิชาการ	ดร.อำพล ชุมเปีย (ที่ปรึกษา)\nนายภัทรพล ชูราศรี\nนางสาวอทิตยา แผ้วไพบูลย์	\N	OTH	คณะผู้บริหารและนิสิตฯ	1.00	1	1968-02-18	1968-02-18	1968-02-18	1968	2026-10-26 04:20:01.64	2026-10-26 04:20:01.64	\N
38	service_idx_36	สาธิตการใช้งานเครื่องผลิตปุ๋ยหมัก 7 วัน ณ กรมยุทธศึกษาทหารเรือ \nต.ศาลายา อ.พุทธมณฑล จ.นครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	OTH	กรมยุทธศึกษาทหารเรือ ต.ศาลายา อ.พุทธมณฑล จ.นครปฐม	1.00	1	1968-02-24	1968-02-24	1968-02-24	1968	2026-10-26 04:20:01.644	2026-10-26 04:20:01.644	\N
113	service_idx_111	คณะอนุกรรรมการประชาสัมพันธ์	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สภาวิศวกร	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:01.968	2026-10-26 04:20:01.968	\N
39	service_idx_37	โรงเรียนสาธิตแห่งมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน ศูนย์วิจัยและพัฒนาการศึกษา เข้าใช้บริการเครื่องอัดภาชนะใบไม้	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายวีระพงษ์ กระแสธีป\nนางสาวธันยพร โส๊ะอ้น\nนายภัทรพล ชูราศรี\nนางสาวอทิตยา แผ้วไพบูลย์	\N	OTH	อาจารย์และนักเรียนระดับมัธยมศึกษาปีที่ 1	1.00	1	1968-02-27	1968-02-27	1968-02-27	1968	2026-10-26 04:20:01.648	2026-10-26 04:20:01.648	\N
40	service_idx_38	โครงการแลกเปลี่ยนนิสิตระหว่างมหาวิทยาลัยเกษตรศาสตร์ และ University of Tsukuba \nประเทศญี่ปุ่น	วิชาการ	นายอรรถวุทธิ์ รื่นเริงใจ\nนายวีระพงษ์ กระแสธีป\nนางสาวธันยพร โส๊ะอ้น\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น \nนายเจษฎาพร ด้วงแก้ว\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	OTH	Associate Professor Dr. Nakao NOMURA และนิสิตฯ	1.00	1	1968-02-27	1968-02-27	1968-02-27	1968	2026-10-26 04:20:01.652	2026-10-26 04:20:01.652	\N
71	service_idx_69	เป็นกรรมการหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิศวกรรมเกษตร มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.786	2026-10-26 04:20:01.786	\N
41	service_idx_39	ทำสอบสมรรถนะรถเก็บเกี่ยวฟางและอัดฟาง	วิชาการ	นายกิตติเดช โพธิ์นิยม\nนายทิตินัย เทียนแย้ม\nว่าที่ร.ต.พิสิษฐ์ อินทรวิรัตน์	\N	AE	แปลงเกษตรกร อ,โพธาราม จ.ราชบุรี	1.00	1	1968-02-05	1968-02-05	1968-02-05	1968	2026-10-26 04:20:01.655	2026-10-26 04:20:01.655	\N
42	service_idx_40	เป็นประธานภาค และเข้าร่วมประชุมวิชาการคอนกรีตประจำปี ครั้งที่ 19	วิชาการ	นายสุบรรณ สนิทอินทร์	255	AE	สมาคมคอนกรีตแห่งประเทศไทย ร่วมกับภาควิชาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์ \nมหาวิทยาลัยอุบลราชธานี	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.661	2026-10-26 04:20:01.661	\N
103	service_idx_101	การเป็นวิทยากรบรรยายในงาน Food Innovation Asia Conference 2024	วิชาการ	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	Food Innovation Asia Conference 2024	1.00	1	1967-06-13	1967-06-13	1967-06-13	1967	2026-10-26 04:20:01.923	2026-10-26 04:20:01.923	\N
43	service_idx_41	เป็นกรรมการสอบวิทยานิพนธ์	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา สาขาวิชาวิศวกรรมโยธา\nคณะวิศวกรรมศาสตร์\nมหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต	1.00	1	1968-03-01	1968-03-01	1968-03-01	1968	2026-10-26 04:20:01.667	2026-10-26 04:20:01.667	\N
44	service_idx_42	เป็นคณะกรรมการร่างปรับปรุงมาตรฐาน 2135-2545\n"เถ้าลอยจากถ่านหินใช้เป็นวัสดุผสมคอนกรีต"	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สมาคมคอนกรีตแห่งประเทศไทย (สคท.)	1.00	1	1968-03-01	1968-03-01	1968-03-01	1968	2026-10-26 04:20:01.671	2026-10-26 04:20:01.671	\N
45	service_idx_43	เข้าร่วมประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา \nสำนักงานทรัพยากรน้ำแห่งชาติภาค 2	1.00	1	1968-03-04	1968-03-04	1968-03-04	1968	2026-10-26 04:20:01.676	2026-10-26 04:20:01.676	\N
46	service_idx_44	เข้าร่วมประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 26	วิชาการ	ผศ.ดร.ชูพันธ์ ชมภูจันทร์	\N	IRE	สำนักงานเลขาธิการสภาผู้แทนราษฎร \nในคณะกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร	1.00	1	1968-03-05	1968-03-05	1968-03-05	1968	2026-10-26 04:20:01.68	2026-10-26 04:20:01.68	\N
47	service_idx_45	เป็นกรรมการสอบโครงร่างวิทยานิพนธ์นักศึกษาปริญญาเอก หัวข้อ "Sustainability of Rice Cultivation Practices in Chao Phraya Basin under the Impact of Extreme Weather Condotion: an Application of Sustainable Rice platorm Indicators"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สถาบันพัฒนาสุขภาพอาเซียน \nมหาวิทยาลัยมหิดล	1.00	1	1968-03-07	1968-03-07	1968-03-07	1968	2026-10-26 04:20:01.687	2026-10-26 04:20:01.687	\N
48	service_idx_46	ประชุมคณะอนุกรรมการวิชาการและการบริหารจัดการน้ำลุ่มน้ำแม่กลอง ครั้งที่ 1/2568 ศาลากลางจังหวัดสมุทรสงคราม	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำฯ	1.00	1	1968-03-10	1968-03-10	1968-03-10	1968	2026-10-26 04:20:01.692	2026-10-26 04:20:01.692	\N
49	service_idx_47	แต่งตั้ง "คณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ"	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	1968-03-04	1968-03-04	1968-03-04	1968	2026-10-26 04:20:01.698	2026-10-26 04:20:01.698	\N
50	service_idx_48	ประชุมคณะอนุกรรมาธิการการบริหารจัดการทรัพยากรน้ำภาคการเกษตร ครั้งที่ 27	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สภาผู้แทนราษฎร	1.00	1	1968-03-12	1968-03-12	1968-03-12	1968	2026-10-26 04:20:01.702	2026-10-26 04:20:01.702	\N
51	service_idx_49	ประชุมเชิงปฏิบัติการเพื่อพัฒนาเครื่องมือคาดการณ์สมดุลน้ำในพื้นที่เขตพัฒนาพิเศษภาคตะวันออก ครั้งที่ 2	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานคณะกรรมการ\nนโยบายเขตพัฒนาพิเศษภาคตะวันออก	1.00	1	1968-03-21	1968-03-21	1968-03-21	1968	2026-10-26 04:20:01.707	2026-10-26 04:20:01.707	\N
52	service_idx_50	ประชุมปรึกษาหารือกลุ่มย่อย ร่างแผนและแผนผังโครงสร้างพื้นฐาน : การจัดการน้ำ	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	กรมโยธาธิการและผังเมือง	1.00	1	1968-03-19	1968-03-19	1968-03-19	1968	2026-10-26 04:20:01.709	2026-10-26 04:20:01.709	\N
53	service_idx_51	แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำเจ้าพระยา"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2	1.00	1	1968-03-18	1968-03-18	1968-03-18	1968	2026-10-26 04:20:01.711	2026-10-26 04:20:01.711	\N
54	service_idx_52	แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำท่าจีน"	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานทรัพยากรน้ำ\nแห่งชาติภาค 2	1.00	1	1968-03-18	1968-03-18	1968-03-18	1968	2026-10-26 04:20:01.714	2026-10-26 04:20:01.714	\N
55	service_idx_53	แต่งตั้ง "กรรมการลุ่มน้ำผู้ทรงคุณวุฒิ ในคณะกรรมการลุ่มน้ำเเม่กลอง"	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สำนักงานทรัพยากรน้ำ\nแห่งชาติภาค 2	1.00	1	1968-03-18	1968-03-18	1968-03-18	1968	2026-10-26 04:20:01.717	2026-10-26 04:20:01.717	\N
56	service_idx_54	ประชุมคณะกรรมการลุ่มน้ำแม่กลอง ครั้งที่ 2/2568	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สำนักงานทรัพยากรน้ำ\nแห่งชาติภาค 2	1.00	1	1968-03-26	1968-03-26	1968-03-26	1968	2026-10-26 04:20:01.721	2026-10-26 04:20:01.721	\N
57	service_idx_55	อาจารย์ประจำสาขาวิชาวิศวกรรมเคมี คณะวิศวกรรมศาสตร์ มหาวิทยาลัยสงขลานครินทร์ เข้าศึกษาดูงานวิจัยด้านพลังงานทดแทน	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายรัตนศักดิ์ ทรัพย์เย็น \nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	อาจารย์ประจำสาขาวิชาฯ	1.00	1	1968-03-03	1968-03-03	1968-03-03	1968	2026-10-26 04:20:01.723	2026-10-26 04:20:01.723	\N
58	service_idx_56	วิสาหกิจชุมชนบ้านท่าช้าง อ.ปากช่อง จ.นครราชสีมา เข้าศึกษาดูงานเครื่องอัดภาชนะใบไม้และนวัตกรรมต่างๆ	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น \nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	วิสาหกิจชุมชน	1.00	1	1968-03-10	1968-03-10	1968-03-10	1968	2026-10-26 04:20:01.727	2026-10-26 04:20:01.727	\N
59	service_idx_57	ร่วมสัมมนาวิชาการในหัวข้อ Climate Change Challenges, Plant Science Solutions	วิชาการ	ดร.ธนัญกรณ์ ใจผ่อง\nนายทิตินัย เทียนแย้ม	\N	AE	Hiroshima University \nประเทศญี่ปุ่น	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.73	2026-10-26 04:20:01.73	\N
60	service_idx_58	23rd AUN-QA Tier 1 Training Programme Assessment, Version 4.0	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	Bangkok, Thailand	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.732	2026-10-26 04:20:01.732	\N
61	service_idx_59	19th Assessor Training Workshop for AUN-QA Programme Assessment [Tier II]	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	Brunei Darussalam, Cambodia, \nMalaysia, the Philippines, \nThailand, and Viet Nam	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.736	2026-10-26 04:20:01.736	\N
62	service_idx_60	การออกแบบและก่อสร้างโครงสร้างคอนกรีตเสริม GFRP รุ่นที่ 4	วิชาการ	ผศ.ดร.เพ็ญพิชชา  สนิทอินทร์	\N	CE	วิศวกรรมสถานแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (วสท.)	1.00	1	1968-04-26	1968-04-26	1968-04-26	1968	2026-10-26 04:20:01.739	2026-10-26 04:20:01.739	\N
63	service_idx_61	เป็นผู้ทรงคุณวุฒิประเมินข้อเสนอโครงการวิจัย	วิชาการ	ผศ.ดร.วันรัฐ อับดุลลากาซิม	\N	AE	คณะวิศวกรรมศาสตร์ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.744	2026-10-26 04:20:01.744	\N
64	service_idx_62	ประชุมคณะกรรมการลุ่มน้ำท่าจีน \nครั้งที่ 2/2568	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ\nภาค 2	1.00	1	1968-04-02	1968-04-02	1968-04-02	1968	2026-10-26 04:20:01.753	2026-10-26 04:20:01.753	\N
65	service_idx_63	ผู้ทรงคุณวุฒิให้กับนิสิตต่างชาติ Ms. Mahroo Aghaabbasi, Student ID 6688081920 หัวข้อ"Barriers to Smart Irrigation\nTechnologies Adoption in Thailand Agricultural Sector."	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	Environment, Development and Sustainability Program \nGraduate School, Chulalongkorn University	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.759	2026-10-26 04:20:01.759	\N
66	service_idx_64	ประชุมเชิงปฏิบัติการ "ถอดบทเรียนการขับเคลื่อนการดำเนินงาน ภายใต้พระราชบัญญัติทรัพยากรน้ำ พ.ศ. 2561 หมวด 4 การจัดสรรน้ำ\nและการใช้น้ำ ฯ"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	กรมทรัพยากรน้ำ	1.00	1	1968-04-30	1968-04-30	1968-04-30	1968	2026-10-26 04:20:01.766	2026-10-26 04:20:01.766	\N
67	service_idx_65	เป็นประธานหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมไฟฟ้าเครื่องกลการผลิต มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.772	2026-10-26 04:20:01.772	\N
68	service_idx_66	เป็นประธานหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิทยาศาสตร์การกีฬาและการออกกำลังกาย มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.775	2026-10-26 04:20:01.775	\N
69	service_idx_67	เป็นกรรมการหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาวิศวกรรมทรัพยากรน้ำ มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.779	2026-10-26 04:20:01.779	\N
70	service_idx_68	เป็นกรรมการหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาวิศวกรรมทรัพยากรน้ำ มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-04-01	1968-04-01	1968-04-01	1968	2026-10-26 04:20:01.782	2026-10-26 04:20:01.782	\N
73	service_idx_71	ประเมินรายงานความก้าวหน้าโครงการวิจัย แผนงานกลุ่มอาหารมูลค่าสูง ประจำปี 2567	วิชาการ	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)	1.00	1	1968-05-02	1968-05-02	1968-05-02	1968	2026-10-26 04:20:01.792	2026-10-26 04:20:01.792	\N
74	service_idx_72	คณะทำงานปรับปรุงมาตรฐานผลิตภัณฑ์อุตสาหกรรม เถ้าลอยจากถ่านหินใช้เป็นวัสดุผสมคอนกรีต	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สมาคมคอนกรีตแห่งประเทศไทย (สคท.)	1.00	1	1968-05-02	1968-05-02	1968-05-02	1968	2026-10-26 04:20:01.798	2026-10-26 04:20:01.798	\N
102	service_idx_100	วิทยากรบรรยาย หลักสูตร "นโยบายการบริหารจัดการคณภาพน้ำ ในภาพรวมระดับประเทศ"	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-06-05	1968-06-05	1968-06-05	1968	2026-10-26 04:20:01.92	2026-10-26 04:20:01.92	\N
76	service_idx_74	เป็นประธานกรรมการและผู้ทรงคุณวุฒิสอบวิทยานิพนธ์ เรื่อง การพัฒนานาโนซิลิการ่วมกับเส้นใยปาล์มน้ำมัน และเส้นใยป่านศรนารายณ์	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	คณะวิศวกรรมศาสตร์และสถาปัตยกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก \nเขตพื้นที่อุเทนถวาย	1.00	1	1968-05-26	1968-05-26	1968-05-26	1968	2026-10-26 04:20:01.81	2026-10-26 04:20:01.81	\N
77	service_idx_75	ให้คำปรึกษาและคำแนะนำด้านวิชาการเกี่ยวกับการรักษาคุณภาพมาตราฐาน และความปลอดภัยของบรรจุภัณฑ์น้ำพริก	วิชาการ	ภาควิชาวิศวกรรมอาหาร	\N	FE	เรือนจำกลางนครปฐม	1.00	1	1968-05-19	1968-05-19	1968-05-19	1968	2026-10-26 04:20:01.814	2026-10-26 04:20:01.814	\N
78	service_idx_76	ประชุมเชิงปฏิบัติการ "การขับเคลื่อน SDG Lab การบริหารจัดการน้ำเขิงพื่นที่ 3 จังหวัด ลุ่มน้ำแม่กล่องฯ"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ	1.00	1	2025-05-02	2025-05-02	2025-05-02	2025	2026-10-26 04:20:01.818	2026-10-26 04:20:01.818	\N
79	service_idx_77	เข้าร่วมประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ ../2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการล่มน้ำเจ้าพระยา สทนช.ภาค 2	1.00	1	1968-05-01	1968-05-01	1968-05-01	1968	2026-10-26 04:20:01.822	2026-10-26 04:20:01.822	\N
80	service_idx_78	ผู้ดำเนินรายการ "เสวนาวิชาการเรื่อง" ความเสี่ยงภัยพิบัติจากน้ำ 2025 ในภาวะภูมิอากาศสุดขั้ว"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สมาคมนักอุทกวิทยาไทย	1.00	1	1968-05-16	1968-05-16	1968-05-16	1968	2026-10-26 04:20:01.828	2026-10-26 04:20:01.828	\N
81	service_idx_79	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 4/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา (ศาลากลางจังหวัดนครสวรรค์)	1.00	1	1968-05-13	1968-05-13	1968-05-13	1968	2026-10-26 04:20:01.837	2026-10-26 04:20:01.837	\N
82	service_idx_80	วิทยากรบรรยาย หลักสูตร "เทคนิคการควบคุมการเดินระบบและบำรุงรักษาระบบบำบัดน้ำเสียให้มีประสิทธิภาพ"	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-05-22	1968-05-22	1968-05-22	1968	2026-10-26 04:20:01.842	2026-10-26 04:20:01.842	\N
83	service_idx_81	ประชุมเตรียมการเพื่อสนับสนุนการดำเนินงานของคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 1/2568	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	คณะกรรมการล่มน้ำท่าจีน (ศาลากลางจังหวัดสุพรรณบุรี)	1.00	1	1968-05-20	1968-05-20	1968-05-20	1968	2026-10-26 04:20:01.847	2026-10-26 04:20:01.847	\N
84	service_idx_82	ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 3/2568 (ออนไลน์)	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	คณะกรรมการล่มน้ำท่าจีน\n (ศาลากลางจังหวัดสุพรรณบุรี)	1.00	1	1968-05-23	1968-05-23	1968-05-23	1968	2026-10-26 04:20:01.852	2026-10-26 04:20:01.852	\N
85	service_idx_83	เป็นผู้ทรงคุณวุฒิประเมินบทความทางวิชาการระดับชาติ	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	งานประชุมวิชาการ ThaiCID 2025	1.00	1	1968-05-01	1968-05-01	1968-05-01	1968	2026-10-26 04:20:01.856	2026-10-26 04:20:01.856	\N
86	service_idx_84	ประชุมคณะกรรมการลุ่มน้ำเม่กลอง ครั้งที่ 3/2568 (ออนไลน์)	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	คณะกรรมการล่มน้ำแม่กลอง \n(ศาลากลางจังหวัดราชบุรี)	1.00	1	1968-05-02	1968-05-02	1968-05-02	1968	2026-10-26 04:20:01.86	2026-10-26 04:20:01.86	\N
87	service_idx_85	กรรมการสอบวิทยานิพนธ์ปริญญาเอก "Assessment of Flood Risk and Impacts under Climate and Land use \nChanges in the Loei River Basin"	วิชาการ	ผศ.ดร.เกศวรา สิทธิโชค	45	IRE	ภาควิชาวิศวกรรมโยธา \nมหาวิทยาลัยขอนแก่น	1.00	1	1968-05-01	1968-05-01	1968-05-01	1968	2026-10-26 04:20:01.864	2026-10-26 04:20:01.864	\N
129	service_idx_127	เป็นประธานหลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีเพื่อการพัฒนายั่งยืน มธ.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยธรรมศาสตร์	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.031	2026-10-26 04:20:02.031	\N
88	service_idx_86	เป็นผู้ทรงคุณวุฒิพิจารณาบทความ\nวารสารดอกพะยอมวิศวกรรมและเทคโนโลยี	วิชาการ	ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ	129	IE	คณะเทคโนโลยีการเกษตรและเทคโนโลยีอุตสาหกรรม \nมหาวิทยาลัยราชภัฏนครสวรรค์	1.00	1	1968-05-20	1968-05-20	1968-05-20	1968	2026-10-26 04:20:01.867	2026-10-26 04:20:01.867	\N
89	service_idx_87	ต้อนรับคณะผู้แทนจากภูมิภาคแอฟริกา พร้อมทั้งร่วมบรรยายในหัวข้อ “การลดขยะและการจัดการขยะในประเทศไทย”	วิชาการ	นายอรรถวุทธิ์ รื่นเริงใจ	166	OTH	คณะผู้แทนจากภูมิภาคแอฟริกา	1.00	1	1968-05-13	1968-05-13	1968-05-13	1968	2026-10-26 04:20:01.87	2026-10-26 04:20:01.87	\N
90	service_idx_88	วิทยากรในการฝึกอบรมเชิงปฏิบัติการเรื่อง “การผลิตภาชนะจากใบไม้” ณ สถานพินิจและคุ้มครองเด็กและเยาวชนจังหวัดนครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายวีระพงษ์ กระแสธีป\nนางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนางสาวธันยพร โส๊ะอ้น	\N	OTH	สถานพินิจและคุ้มครองเด็ก\nและเยาวชนจังหวัดนครปฐม	1.00	1	1968-05-13	1968-05-13	1968-05-13	1968	2026-10-26 04:20:01.873	2026-10-26 04:20:01.873	\N
91	service_idx_89	คณะศึกษาดูงานจาก Greenovation Hub (GHub) สาธารณรัฐประชาชนจีน เข้าเยี่ยมชมและแลกเปลี่ยนความร่วมมือด้านระบบเกษตรอาหารที่เป็นมิตรต่อสภาพอากาศและธรรมชาติในประเทศจีนและอาเซียน	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น	\N	OTH	คณะศึกษาดูงานจาก GreenovationHub (GHub) \nสาธารณรัฐประชาชนจีน	1.00	1	1968-05-14	1968-05-14	1968-05-14	1968	2026-10-26 04:20:01.877	2026-10-26 04:20:01.877	\N
108	service_idx_106	เป็นอาจารย์พิเศษ รายวิชา 01208211 Workshop in Computer Aided Disigh and Drafting for Buildind Systems ประจำภาคต้น ปีการศึกษา 2568	วิชาการ	ดร.นิติรงค์ พงษ์พานิช	251	AE	สาขาวิศวกรรมเครื่องกล ภาคพิเศษ คณะวิศวกรรมศาสตร์ กำแพงแสน	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.944	2026-10-26 04:20:01.944	\N
92	service_idx_90	เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “อิทธิพลของการเติมกราฟีนออกไซต์ต่อคุณสมบัติเชิงกลของคอนกรีต”	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ \nศูนย์รังสิต	1.00	1	1968-06-05	1968-06-05	1968-06-05	1968	2026-10-26 04:20:01.881	2026-10-26 04:20:01.881	\N
93	service_idx_91	เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “สมบัติทางกลและความทนไฟของคอนกรีตผสมด้วยของเสียพอลิเมอร์เสริมเส้นใยแก้ว”	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ \nศูนย์รังสิต	1.00	1	1968-06-05	1968-06-05	1968-06-05	1968	2026-10-26 04:20:01.884	2026-10-26 04:20:01.884	\N
94	service_idx_92	เป็นกรรมการสอบวิทยานิพนธ์ ในหัวข้อ “พฤติกรรมการรับแรงอัดของเสาคอนกรีตเสริมด้วยแท่งพอลิเมอร์เสริมเส้นใยแก้วเสริมกำลังด้วยแผ่นคาร์บอนไฟเบอร์”	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวกรรมโยธา \nคณะวิศวกรรมศาสตร์กำแพงแสน มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต	1.00	1	1968-06-05	1968-06-05	1968-06-05	1968	2026-10-26 04:20:01.889	2026-10-26 04:20:01.889	\N
95	service_idx_93	การบรรยายหัวข้อ การปรับปรุงกระบวนการผลิตในอุตสาหกรรมอาหาร	วิชาการ	รศ.ดร.เชาว์ อินทร์ประสิทธิ์	\N	FE	โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม	1.00	1	1968-06-13	1968-06-13	1968-06-13	1968	2026-10-26 04:20:01.892	2026-10-26 04:20:01.892	\N
96	service_idx_94	การบรรยายหัวข้อ การประยุกต์ใช้ Dash Board ในอุตสาหกรรมอาหาร	วิชาการ	ผศ.ดร.วรัญญา อรรถเสนา	141	CPE	โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม	1.00	1	1968-06-13	1968-06-13	1968-06-13	1968	2026-10-26 04:20:01.895	2026-10-26 04:20:01.895	\N
97	service_idx_95	การบรรยายหัวข้อ การประยุกต์ใช้ IoT ในอุตสาหกรรมอาหาร	วิชาการ	อ.ร้อยโทอนุมัติ อิงคนินันท์	144	CPE	โครงการการพัฒนาเทคโนโลยีดิจิทัล และปัญญาประดิษฐ์สำหรับอุตสาหกรรม	1.00	1	1968-06-13	1968-06-13	1968-06-13	1968	2026-10-26 04:20:01.899	2026-10-26 04:20:01.899	\N
98	service_idx_96	เป็นผู้ทรงคุณวุฒิบทความนานาชาติ	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	วารสาร Discover Concrete and Cement	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.906	2026-10-26 04:20:01.906	\N
99	service_idx_97	วิทยากรบรรยาย หลักสูตร "ความรู้พื้นฐานเรื่องน้ำเสีย ระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบบำบัดน้ำเสีย"	วิชาการ	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-06-06	1968-06-06	1968-06-06	1968	2026-10-26 04:20:01.91	2026-10-26 04:20:01.91	\N
100	service_idx_98	เข้าร่วมสัมมนาเพื่อส่งเสริมพัฒนาศักยภาพการดำเนินงานของคณะกรรมการลุ่มน้ำ	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	คณะกรรมการลุ่มน้ำแม่กลอง (โรงแรม รามาการ์เด้นส์ กทม.)	1.00	1	1968-06-12	1968-06-12	1968-06-12	1968	2026-10-26 04:20:01.913	2026-10-26 04:20:01.913	\N
101	service_idx_99	ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ ลุ่มน้ำท่าจีน ครั้งที่ 1/2568	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	คณะกรรมการลุ่มน้ำท่าจีน (ศาลากลางจังหวัดสุพรรณบุรี)	1.00	1	1968-06-13	1968-06-13	1968-06-13	1968	2026-10-26 04:20:01.917	2026-10-26 04:20:01.917	\N
104	service_idx_102	คณะกรรมการและกำหนดการสอบปากเปล่าขั้นสุดท้ายบัณฑิตวิทยาลัย (ประธาน)	วิชาการ	ผศ.ดร.ภัทรพงษ์ ภาคภูมิ	131	IE	บัณฑิตวิทยาลัย \nมหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-06-17	1968-06-17	1968-06-17	1968	2026-10-26 04:20:01.929	2026-10-26 04:20:01.929	\N
105	service_idx_103	การทดสอบผลิตภัณฑ์ประตูบานเลื่อน	วิชาการ	ผศ.ดร.วัชมา โพธิ์ทอง,\nผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	\N	DWT	บริษัท คองช์ บิวดิ้ง แมททีเรียลส์ (ไทยแลนด์) จำกัด	1.00	1	1968-06-20	1968-06-20	1968-06-20	1968	2026-10-26 04:20:01.933	2026-10-26 04:20:01.933	\N
106	service_idx_104	การทดสอบผลิตภัณฑ์หน้าต่างบานเลื่อน/บานเปิด	วิชาการ	ผศ.ดร.วัชมา โพธิ์ทอง	175	DWT	บริษัท แฮพส์เบิร์ก จำกัด	1.00	1	1968-06-06	1968-06-06	1968-06-06	1968	2026-10-26 04:20:01.936	2026-10-26 04:20:01.936	\N
107	service_idx_105	การทดสอบผลิตภัณฑ์ LAVAMIC	วิชาการ	ผศ.ดร.วัชมา โพธิ์ทอง	175	DWT	บริษัท ช้างคอนซูเมอร์ จำกัด	1.00	1	1968-06-27	1968-06-27	1968-06-27	1968	2026-10-26 04:20:01.939	2026-10-26 04:20:01.939	\N
109	service_idx_107	โครงการฝึกอบรมเชิงปฏิบัติการใช้เทคโนโลยีปัญญาประดิษฐ์ (AI) ในการเลี้ยงปศุสัตว์	วิชาการ	ผศ.ดร.พิเชษฐ์ สืบสายพรหม	143	CPE	วิทยาลัยเกษตรและเทคโนโลยีกาญจนบุรี สถาบันการอาชีวศึกษาเกษตร ภาคกลาง อำเภอเมือง จังหวัดกาญจนบุรี	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.948	2026-10-26 04:20:01.948	\N
111	service_idx_109	บรรยายหัวข้อ อัปเดตมาตรฐาน ACI 440-22 และ Spreadsheet ช่วยออกแบบ GFRP วัสดุใหม่แห่งความยั่งยืน โดย PJC	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	นิสิตนักศึกษา อาจารย์มหาวิทยาลัย และวิศกรที่อยู่ในอุสาหกรรมต่างๆ	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:01.957	2026-10-26 04:20:01.957	\N
112	service_idx_110	สัมนาวิชาการ หัวข้อ Advance Technologica Solutions for Refurbishing Reinforced Concrete Affected Infrastructure Deteriorations (online)	วิชาการ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	dvance Technologica Solutions for Refurbishing Reinforced Concrete Affected Infrastructure Deteriorations\n(online)	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:01.964	2026-10-26 04:20:01.964	\N
114	service_idx_112	สัมมนา Thai Water Expo 2025 : Empowering Thailand's Water Furure through Knowledge, Leadership, and Collaboration สร้างศักยภาพระบบน้ำไทยด้วยความรู้ ผู้นำและความร่วมมือ	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	เวที Water Forum 2025 ในงาน Thai Water Expo ณ ศูนย์การประชุมแห่งชาติสิริกิติ์	1.00	1	1968-07-03	1968-07-03	1968-07-03	1968	2026-10-26 04:20:01.971	2026-10-26 04:20:01.971	\N
115	service_idx_113	ประธานที่ประชุมวิชาการ Session by : Thai Hydrologist Association	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	เวที Water Forum 2025 ในงาน Thai Water Expo ณ ศูนย์การประชุมแห่งชาติสิริกิติ์	1.00	1	1968-07-04	1968-07-04	1968-07-04	1968	2026-10-26 04:20:01.974	2026-10-26 04:20:01.974	\N
130	service_idx_128	เป็นประธานหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาบริหารงานวิศวกรรมการก่อสร้าง ม.เอเซียอาคเนย์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	ม.เอเซียอาคเนย์	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.033	2026-10-26 04:20:02.033	\N
116	service_idx_114	ประชุมเชิงปฏิบัติการสร้างการรับรู้ในการขับเคลื่อนการดำเนินงานลุ่มน้ำแม่กลอง ตามพรบ. ทรัพยากรน้ำ พ.ศ.2561 ณ โรงแรมเวสเทิร์นแกรนด์ราชบุรี อ.เมือง จ.ราชบุรี	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	ในคณะกรรมการลุ่มน้ำแม่กลอง สำนักงานทรัพยากรน้ำแห่งชาติภาค 2	1.00	1	1968-07-03	1968-07-03	1968-07-03	1968	2026-10-26 04:20:01.978	2026-10-26 04:20:01.978	\N
117	service_idx_115	บรรยายหัวข้อ "แนวทางการดำเนินงานแบบบูรณาการเพื่อขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช. ภาค 2 \nณ โรงแรม เดอะคาวาลิ \nคาซ่ารีสอร์ท \nจ.พระนครศรีอยุธยา	1.00	1	1968-07-22	1968-07-22	1968-07-22	1968	2026-10-26 04:20:01.983	2026-10-26 04:20:01.983	\N
118	service_idx_116	ผู้ทรงคุณวุฒิดำเนินรายการบนเวทีคู่ขนานของการประชุมวิชาการด้านการชลประทานและการระบายน้ำแห่งชาติ ครั้งที่ 18 หรือ THAICID National Symposium 2025	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	คณะทำงานด้านวิชาการ THAICID กรมชลประทานปากเกร็ด \nจ.นนทบุรี	1.00	1	1968-07-07	1968-07-07	1968-07-07	1968	2026-10-26 04:20:01.987	2026-10-26 04:20:01.987	\N
119	service_idx_117	สอบวิทยานิพนธ์ ปริญญาเอกหลักสูตรนานาชาติ หัวข้อ “SUSTAINABILITY OF RICE PRODUCTION SYSTEM AGAINST IMPACTS\nOF EXTERNAL FORCING FACTORS IN THE CHAO PHRAYA RIVER BASIN, THAILAND: A SYSTEM\nDYNAMICS MODELING”	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	AIHD มหาวิทยาลัยมหิดล	1.00	1	1968-07-16	1968-07-16	1968-07-16	1968	2026-10-26 04:20:01.991	2026-10-26 04:20:01.991	\N
120	service_idx_118	ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ \nลุ่มน้ำเจ้าพระยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา \nสทนช.ภาค 2 (ออนไลน์)	1.00	1	1968-07-18	1968-07-18	1968-07-18	1968	2026-10-26 04:20:01.996	2026-10-26 04:20:01.996	\N
121	service_idx_119	วิทยากรบรรยาย \n"การประยุกต์ใช้เทคโนโลยี IrriSAT กับพื้นที่ชลประทานในระดับโครงการ"\n"แนวทางการต่อยอดการใช้งาน IrriSAT สำหรับโครงการกับสถานีตรวจวัดอากาศแบบอัตโนมัติ"	วิชาการ	รศ.ดร.วราวุธ วุฒิวณิชย์	\N	IRE	สำนักงานชลประทานที่ 12 \nอ.สรรพยา จ.ชัยนาท	1.00	1	1968-07-24	1968-07-24	1968-07-24	1968	2026-10-26 04:20:02.005	2026-10-26 04:20:02.005	\N
122	service_idx_120	วิทยากรบรรยาย "ติดตามและนำเสนอการใช้งาน IrriSAT กับพื้นที่ชลประทานในระดับโครงการ"	วิชาการ	รศ.ดร.วราวุธ วุฒิวณิชย์	\N	IRE	สำนักงานชลประทานที่ 12 \nอ.สรรพยา จ.ชัยนาท	1.00	1	1968-07-25	1968-07-25	1968-07-25	1968	2026-10-26 04:20:02.016	2026-10-26 04:20:02.016	\N
123	service_idx_121	ประชุมรับฟังความคิดเห็น ครั้งที่ 1  โครงการค่าใช้จ่ายในการจัดทำหลักเกณฑ์การจัดสรรน้ำเพื่อการพิจารณาอนุญาตใช้ทรัพยากรน้ำสาธารณะ	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	กรมทรัพยากรน้ำ	1.00	1	1968-07-30	1968-07-30	1968-07-30	1968	2026-10-26 04:20:02.018	2026-10-26 04:20:02.018	\N
124	service_idx_122	ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สทนช.ภาค 2 (ออนไลน์)	1.00	1	1968-07-30	1968-07-30	1968-07-30	1968	2026-10-26 04:20:02.02	2026-10-26 04:20:02.02	\N
125	service_idx_123	ประชุมคณะอนุกรรมการบริหารจัดการสถานการณ์น้ำลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดพระนครศรีอยุธยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ ภาค 2	1.00	1	1968-07-31	1968-07-31	1968-07-31	1968	2026-10-26 04:20:02.023	2026-10-26 04:20:02.023	\N
126	service_idx_124	ประชุมคณะอนุกรรมการวิชาการและสนับสนุนการบริหารทรัพยากรน้ำ \nลุ่มน้ำท่าจีน ครั้งที่ 2/2568	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	คณะกรรมการลุ่มน้ำท่าจีน	1.00	1	1968-07-31	1968-07-31	1968-07-31	1968	2026-10-26 04:20:02.025	2026-10-26 04:20:02.025	\N
127	service_idx_125	เป็นประธานหลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล มทร.อีสาน(โคราช)	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มทร.อีสาน(โคราช)	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.027	2026-10-26 04:20:02.027	\N
128	service_idx_126	เป็นประธานหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล มทร.อีสาน(ขอนแก่น)	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มทร.อีสาน(ขอนแก่น)	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.029	2026-10-26 04:20:02.029	\N
131	service_idx_129	เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาเทคโนโลยีเพื่อการพัฒนายั่งยืน มธ.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยธรรมศาสตร์	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.036	2026-10-26 04:20:02.036	\N
132	service_idx_130	เป็นกรรมกาหลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาเทคโนโลยีการจัดการพลังงานและสิ่งแวดล้อม มธ.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยธรรมศาสตร์	1.00	1	1968-07-01	1968-07-01	1968-07-01	1968	2026-10-26 04:20:02.039	2026-10-26 04:20:02.039	\N
133	service_idx_131	โรงเรียนวัดไทรใหญ่ \n(นนททิวากรราษฎร์บำรุง)  \nจังหวัดนนทบุรี	วิชาการ	ผศ.ดร.พิเชษฐ์ สืบสายพรหม	143	CPE	ระดับภาคและกลุ่มจังหวัด	1.00	1	1968-08-05	1968-08-05	1968-08-05	1968	2026-10-26 04:20:02.042	2026-10-26 04:20:02.042	\N
134	service_idx_132	ณ วิทยาลัยสารพัดช่างนครปฐม \nจ.นครปฐม	วิชาการ	ผศ.ดร.พิเชษฐ์ สืบสายพรหม	143	CPE	สำนักงานศึกษาธิการ\nจังหวัดนครปฐม	1.00	1	1968-08-06	1968-08-06	1968-08-06	1968	2026-10-26 04:20:02.045	2026-10-26 04:20:02.045	\N
135	service_idx_133	ปัญหา Corrosion ในโครงสร้างคอนกรีต และการป้องกันแก้ไข	วิชาการ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	สำนักงานการอาชีพ\nชัยพัฒนา จ.นครปฐม	1.00	1	1968-08-14	1968-08-14	1968-08-14	1968	2026-10-26 04:20:02.049	2026-10-26 04:20:02.049	\N
136	service_idx_134	Overview Agriculture in Thailand	วิชาการ	ดร.ธนัญกรณ์ ใจผ่อง	\N	OTH	หมาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตกำแพงแสน	1.00	1	1968-08-20	1968-08-20	1968-08-20	1968	2026-10-26 04:20:02.052	2026-10-26 04:20:02.052	\N
137	service_idx_135	ประชุมเชิงปฏิบัติการสร้างการรับรู้ในการขับเคลื่อนการดำเนินงานลุ่มน้ำแม่กลอง ตาม พ.ร.บ.ทรัพยากรน้ำ \nพ.ศ. 2561	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	คณะกรรมการลุ่มน้ำแม่กลอง (สทนช.) ประชุมโรงแรมริเวอร์แคว อ.เมือง \nจ.กาญจนบุรี	1.00	1	1968-08-07	1968-08-07	1968-08-07	1968	2026-10-26 04:20:02.055	2026-10-26 04:20:02.055	\N
138	service_idx_136	วิทยากรบรรยาย \n"หลักการชลประทานในแปลงอ้อย"	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	มหาวิทยาลัยเจ้าพระยา \nอ.เมือง จ.นครสวรรค์	1.00	1	1968-08-22	1968-08-22	1968-08-22	1968	2026-10-26 04:20:02.058	2026-10-26 04:20:02.058	\N
139	service_idx_137	ประชุมสภาคณะผู้บริหารบัณฑิตศึกษาแห่งประเทศไทย (สคบท) ครั้งที่ 3/2568	วิชาการ	รศ.ดร.เอกสิทธิ์ โฆสิตสกุลชัย	37	IRE	สภาคณะผู้บริหารบัณฑิตศึกษาแห่งประเทศไทย (สคบท)  \nณ ม.ราชภัฎอุดรธานี	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.061	2026-10-26 04:20:02.061	\N
140	service_idx_138	ประชุมเตรียมการบริหารจัดการน้ำลุ่มน้ำเจ้าพระยาและลุ่มน้ำที่เกี่ยวข้อง	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำฯ  \nสทนช.ภาค2	1.00	1	1968-08-13	1968-08-13	1968-08-13	1968	2026-10-26 04:20:02.065	2026-10-26 04:20:02.065	\N
141	service_idx_139	วิทยากรบรรยาย "การควบคุมดูแลระบบน้ำบำบัดน้ำเสีย"	วิชาการ	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-08-26	1968-08-26	1968-08-26	1968	2026-10-26 04:20:02.069	2026-10-26 04:20:02.069	\N
142	service_idx_140	วิทยากรบรรยาย \n"กิจกรรมร้อยอาชีพสู่ฝัน \nครั้งที่ 16"	วิชาการ	อ.ดร.ศศิวิมล ขาวโกมล	\N	IRE	โรงเรียนเพลินพัฒนา	1.00	1	1968-08-28	1968-08-28	1968-08-28	1968	2026-10-26 04:20:02.073	2026-10-26 04:20:02.073	\N
143	service_idx_141	วิทยากรบรรยาย \n"การจัดการแปลงเกษตรด้วยระบบ Smart Farming	วิชาการ	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	IRE	คณะผลิตกรรมการเกษตร \nมหาวิทยาลัยแม่โจ้	1.00	1	1968-08-23	1968-08-23	1968-08-23	1968	2026-10-26 04:20:02.076	2026-10-26 04:20:02.076	\N
144	service_idx_142	ประชุมเตรียมกระบวนการ workshop เวทีบทเรียนการขับเคลื่อนมติการบริหารจัดการกลไกน้ำ ในคณะกรรมการลุ่มน้ำเจ้าพระยา	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา ณ โรงแรมเอบีน่าเฮ้าส์ หลักสี่	1.00	1	1968-08-26	1968-08-26	1968-08-26	1968	2026-10-26 04:20:02.079	2026-10-26 04:20:02.079	\N
145	service_idx_143	แต่งตั้งเป็น "อุปนายก" คณะกรรมการสมาคมนักอุทกวิทยาไทย วาระปี 2568-2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สมาคมนักอุทกวิทยาไทย	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.083	2026-10-26 04:20:02.083	\N
146	service_idx_144	แต่งตั้งเป็น "กรรมการ" คณะกรรมการสมาคมนักอุทกวิทยาไทย วาระปี 2568-2569	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	สมาคมนักอุทกวิทยาไทย	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.086	2026-10-26 04:20:02.086	\N
155	service_idx_153	เป็นกรรมการหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมระบบการผลิตดิจิทัล มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.126	2026-10-26 04:20:02.126	\N
147	service_idx_145	แต่งตั้งเป็น "ที่ปรึกษาคณะทำงาน" คณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยา ด้วยโปรแกรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	สำนักงานเลขาธิการ THAICID ในคำสั่งคณะกรรมการด้านการ\nชลประทานและระบายน้ำ\nแห่งประเทศไทย	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.091	2026-10-26 04:20:02.091	\N
148	service_idx_146	อาจารย์พิเศษสอนในรายวิชา \nว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน \n(โครงการ วมว.มก.)(ครั้งที่ 1)	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	นักเรียนในโครงการฯ	1.00	1	1968-08-04	1968-08-04	1968-08-04	1968	2026-10-26 04:20:02.096	2026-10-26 04:20:02.096	\N
159	service_idx_157	เป็นกรรมการหลักสูตรวิทยาศาสตรมบัณฑิต สาขาวิศวกรรมอุตสาหการ มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.143	2026-10-26 04:20:02.143	\N
149	service_idx_147	ให้การต้อนรับ บริษัท อัลลายด์เทคเอ็นจิเนียริ่ง จำกัด จังหวัดกาญจนบุรี ในการเข้าศึกษาดูงานเกี่ยวกับการพัฒนาเทคโนโลยีและการแลกเปลี่ยนองค์ความรู้ด้าน Gasifier และการผลิตไบโอชาร์ (Biochar)	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์	\N	EEEC	บริษัท อัลลายด์เทคเอ็นจิเนียริ่ง จำกัด \nจังหวัดกาญจนบุรี	1.00	1	1968-08-05	1968-08-05	1968-08-05	1968	2026-10-26 04:20:02.101	2026-10-26 04:20:02.101	\N
150	service_idx_148	อาจารย์พิเศษสอนในรายวิชา\n ว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตกำแพงแสน \n(โครงการ วมว.มก.) (ครั้งที่ 2)	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	นักเรียนในโครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน	1.00	1	1968-08-13	1968-08-13	1968-08-13	1968	2026-10-26 04:20:02.105	2026-10-26 04:20:02.105	\N
151	service_idx_149	อาจารย์พิเศษสอนในรายวิชา\n ว30251 วิทยาศาสตร์และนวัตกรรม สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 4 ภายใต้โครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน โดยการกำกับดูแลของมหาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตกำแพงแสน\n(โครงการ วมว.มก.) (ครั้งที่ 3)	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์	\N	EEEC	นักเรียนในโครงการห้องเรียนวิทยาศาสตร์ในโรงเรียน	1.00	1	1968-08-18	1968-08-18	1968-08-18	1968	2026-10-26 04:20:02.109	2026-10-26 04:20:02.109	\N
166	service_idx_164	ประชุมระดมสมอง เรื่อง กำหนดแผนงานวิจัยด้านทรัพยากรน้ำและการผลักดันผลงานวิจัยไปสู่การใช้ประโยชน์ (2571-2575)	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว)	1.00	1	1968-09-24	1968-09-24	1968-09-24	1968	2026-10-26 04:20:02.168	2026-10-26 04:20:02.168	\N
152	service_idx_150	จัดโครงการอบรมหลักสูตร\n “การอบรมและสาธิตการใช้เตาประหยัดพลังงานและเตาเบ๊บซี เพื่อเพิ่มมูลค่าน้ำมันพืชใช้แล้วและวัสดุเหลือใช้ทางการเกษตรให้เป็นเชื้อเพลิงความร้อน พ.ศ. 2568”	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	ประชาชนทั่วไป	1.00	1	1968-08-20	1968-08-20	1968-08-20	1968	2026-10-26 04:20:02.114	2026-10-26 04:20:02.114	\N
153	service_idx_151	ให้การต้อนรับนิสิตแลกเปลี่ยนระหว่างมหาวิทยาลัยเกษตรศาสตร์ และ Okayama University ประเทศญี่ปุ่น	วิชาการ	นายอรรถวุทธิ์ รื่นเริงใจ\nนายภัทรพล ชูราศรี\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	นิสิตในโครงการฯ	1.00	1	1968-08-26	1968-08-26	1968-08-26	1968	2026-10-26 04:20:02.119	2026-10-26 04:20:02.119	\N
154	service_idx_152	เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาความปลอดภัยของอาหารในผลิตผลทางการเกษตร มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.123	2026-10-26 04:20:02.123	\N
156	service_idx_154	เป็นกรรมการหลักสูตร วิทยาศาสตรมหาบัณฑิต สาขาวิชาวิทยาศาสตร์และเทคโนโลยีสิ่งแวดล้อม มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.13	2026-10-26 04:20:02.13	\N
157	service_idx_155	เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาเทคโนโลยีและการจัดการสิ่งแวดล้อม มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.134	2026-10-26 04:20:02.134	\N
158	service_idx_156	เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาวิจัยและพัฒนากาชรเกษตร (นานาชาติ) มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.14	2026-10-26 04:20:02.14	\N
160	service_idx_158	เป็นกรรมการหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาการจัดการวิศวกรรมและเทคโนโลยี มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	1968-08-01	1968-08-01	1968-08-01	1968	2026-10-26 04:20:02.146	2026-10-26 04:20:02.146	\N
161	service_idx_159	ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 6/2568	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	คณะกรรมการลุ่มน้ำท่าจีน	1.00	1	1968-09-24	1968-09-24	1968-09-24	1968	2026-10-26 04:20:02.15	2026-10-26 04:20:02.15	\N
162	service_idx_160	ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา  ณ สำนักงานชลประทานที่ 12 \nจ.ชัยนาท	1.00	1	1968-09-04	1968-09-04	1968-09-04	1968	2026-10-26 04:20:02.154	2026-10-26 04:20:02.154	\N
163	service_idx_161	ประชุมสัมมนาถอดบทเรียนการติดตามประเมินผลการบริหารจัดการน้ำและมาตรการรองรับในช่วงฤดูแล้ว ปี 2567/68	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำ สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	1968-09-23	1968-09-23	1968-09-23	1968	2026-10-26 04:20:02.157	2026-10-26 04:20:02.157	\N
164	service_idx_162	ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม \nครั้งที่ 1/2568	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	คณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแรม HEC-RAS, HEC-HMS เพื่อการบริหารจัดการน้ำท่วม	1.00	1	1968-09-26	1968-09-26	1968-09-26	1968	2026-10-26 04:20:02.161	2026-10-26 04:20:02.161	\N
165	service_idx_163	ประชุมประจำปี 2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ	1.00	1	1968-09-26	1968-09-26	1968-09-26	1968	2026-10-26 04:20:02.165	2026-10-26 04:20:02.165	\N
167	service_idx_165	ให้การต้อนรับคณะจาก \nUI Green	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี	\N	EEEC	คณะจาก UI Green	1.00	1	1968-09-03	1968-09-03	1968-09-03	1968	2026-10-26 04:20:02.173	2026-10-26 04:20:02.173	\N
168	service_idx_166	ให้การต้อนรับคณะอนุรักษ์ไบโอปราณ เข้าศึกษาดูงานเครื่องอัดภาชนะจากใบไม้และเครื่องอัดกระถางจากวัสดุธรรมชาติ	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	คณะอนุรักษ์ไบโอปราณ	1.00	1	1968-09-05	1968-09-05	1968-09-05	1968	2026-10-26 04:20:02.176	2026-10-26 04:20:02.176	\N
169	service_idx_167	บริษัท สยามวู้ดแลนด์ จำกัด \nอำเภอลำลูกกา จังหวัดปทุมธานี เข้าใช้บริการเครื่องอัดภาชนะใบไม้	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนางสาวธันยพร โส๊ะอ้น	\N	EEEC	บริษัท สยามวู้ดแลนด์ จำกัด	1.00	1	1968-09-12	1968-09-12	1968-09-12	1968	2026-10-26 04:20:02.18	2026-10-26 04:20:02.18	\N
170	service_idx_168	เทคโนโลยีนวัตกรรมการผลิตข้าวคุณภาพ 5 ป. ปลอดการเผา การจัดการและการใช้ประโยชน์ฟางข้าว	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	เทศบาลตำบลบางเลน	1.00	1	1968-09-23	1968-09-23	1968-09-23	1968	2026-10-26 04:20:02.184	2026-10-26 04:20:02.184	\N
171	service_idx_169	เป็นผู้ทรงคุณวุฒิ\nประเมินข้อเสนอโครงการวิจัยเพื่อขอรับทุนอุดหนุนงานวิจัยจากงบประมาณด้านวิทยาศาสตร์ วิจัยและนวัตกรรม	วิชาการ	ผศ.ดร.วันรัฐ อับดุลลากาซิม	\N	AE	มหาวิทยาลัยเทคโนโลยี\nราชมงคลสุวรรณภูมิ	1.00	1	1968-10-26	1968-10-26	1968-10-26	1968	2026-10-26 04:20:02.187	2026-10-26 04:20:02.187	\N
172	service_idx_170	โครงการส่งน้ำและบำรุงรักษาเจ้าพระยา เรื่องการเสื่อมสภาพของโครงสร้างคอนกรีตตเสริมเหล็ก และบริษัทฯ	วิชาการ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	บริษัท ซีพีเอส ซัคเซส จำกัด	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.191	2026-10-26 04:20:02.191	\N
197	service_idx_195	เป็นกรรมการคณะแพทยศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nศรีนครินทรวิโรฒ	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.295	2026-10-26 04:20:02.295	\N
198	service_idx_196	เป็นกรรมการคณะวิศวกรรมศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nศรีนครินทรวิโรฒ	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.299	2026-10-26 04:20:02.299	\N
173	service_idx_171	กิจกรรมเผยแพร่องค์ความรู้การผลิตกระทงสาย EM รักษ์โลกโดยสมาคมอนุรักษ์สิ่งแวดล้อมล้อมชุมชนไทย ร่วมกับ การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย ณ วัดโตนด (หลวงพ่อสำเร็จ) อ.บางกรวย จ.นนทบุรี	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	ขยายผลสู่ชุมชน (บ้าน วัด โรงเรียน) ที่อยู่ริมน้ำ	1.00	1	1968-10-18	1968-10-18	1968-10-18	1968	2026-10-26 04:20:02.195	2026-10-26 04:20:02.195	\N
174	service_idx_172	โครงการวิจัย การส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก \nโดยสำนักส่งเสริมและฝึกอบรม \nม.เกษตร กำแพงแสน	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	อ.ศรีประจันต์,\nอ.เดิมบางนางบวช	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.2	2026-10-26 04:20:02.2	\N
182	service_idx_180	ประชุมระดับความคิดเห็นต่อการจัดทำสมุดปกขาว "อว. For Water"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานสภานโยบายการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรมแห่งชาติ (สอวช.)	1.00	1	2025-10-07	2025-10-07	2025-10-07	2025	2026-10-26 04:20:02.236	2026-10-26 04:20:02.236	\N
175	service_idx_173	การจัดการฟางข้าวและการใช้ประโยชน์ จากวัสดุเหลือใช้ทางการเกษตร ที่ศูนย์ข้าวชุมชน ตำบลทุ่งขวาง ตำบลหลักเมตร นครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	ศูนย์ข้าวชุมชน ตำบลทุ่งขวาง ตำบลหลักเมตร นครปฐม	1.00	1	1968-10-30	1968-10-30	1968-10-30	1968	2026-10-26 04:20:02.203	2026-10-26 04:20:02.203	\N
176	service_idx_174	จัดโครงการอบรมหลักสูตร “การฝึกอบรมเชิงปฏิบัติการการผลิตกระถางเพาะชำจากวัสดุธรรมชาติด้วยเครื่องอัดกระถางแบบมือโยกและไฮดรอลิก เพื่อส่งเสริมเศรษฐกิจหมุนเวียนในระดับชุมชน พ.ศ. 2568”	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	ประชาชนทั่วไป	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.208	2026-10-26 04:20:02.208	\N
187	service_idx_185	เป็นกรรมการหลักสูตร วท.บ.โภชนศาสตร์และเทคโนโลยีอาหารสัตว์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.257	2026-10-26 04:20:02.257	\N
188	service_idx_186	เป็นกรรมการหลักสูตร ป.รด. โภชนศาสตร์และเทคโนโลยีอาหารสัตว์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.261	2026-10-26 04:20:02.261	\N
177	service_idx_175	ให้การต้อนรับคุณครูและนักเรียนชั้นมัธยมศึกษาปีที่ 5 จากโรงเรียนสาธิตแห่งมหาวิทยาลัยเกษตรศาสตร์ ศูนย์วิจัยและพัฒนาการศึกษาที่ได้จัดทำโครงการการศึกษารอบรู้เฉพาะเรื่อง เรื่อง การออกแบบกระถางเพาะชำจากเปลือกข้าวโพด เข้าใช้บริการเครื่องอัดกระถางวัสดุจากธรรมชาติ	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนางสาวธันยพร โส๊ะอ้น	\N	EEEC	คุณครูและนักเรียนชั้นมัธยมศึกษาปีที่ 5 \nจากโรงเรียนสาธิตแห่งมหาวิทยาลัย\nเกษตรศาสตร์	1.00	1	1968-10-06	1968-10-06	1968-10-06	1968	2026-10-26 04:20:02.213	2026-10-26 04:20:02.213	\N
178	service_idx_176	จัดโครงการอบรมหลักสูตร “การออกแบบและปฏิบัติการให้น้ำแก่แปลงข้าวโพดขนาดใหญ่ด้วยระบบน้ำหยดแบบ Inline dripper (Low tape drip)”	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนางสาวธันยพร โส๊ะอ้น\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)	1.00	1	1968-10-08	1968-10-08	1968-10-08	1968	2026-10-26 04:20:02.217	2026-10-26 04:20:02.217	\N
199	service_idx_197	เป็นกรรมการคณะศิลปศาสตร์ มทร. ธัญญะบุรี	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยี\nราชมงคลธัญบุรี	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.302	2026-10-26 04:20:02.302	\N
200	service_idx_198	คณะการแพทย์บูรณาการ \nมทร. ธัญญะบุรี	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยี\nราชมงคลธัญบุรี	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.306	2026-10-26 04:20:02.306	\N
179	service_idx_177	วิทยากรโครงการจัดทำแผนยกระดับชุมชนอุดมสุขสู่การเป็นแกนกลางการเกษตร ปีบัญชี 2568 ให้กับกลุ่มวิสาหกิจชุมชนศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง ในหัวข้อ "การแปรรูปผลิตภัณฑ์จากข้าวเพื่อเพิ่มมูลค่าผลผลิต" ณ ศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง อำเภอกำแพงแสน จังหวัดนครปฐม จัดโดยสำนักส่งเสริมและฝึกอบรม กำแพงแสน ร่วมกับ สำนักงาน ธ.ก.ส.จังหวัดนครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	กลุ่มวิสาหกิจชุมชนศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตตำบลทุ่งขวาง	1.00	1	1968-10-30	1968-10-30	1968-10-30	1968	2026-10-26 04:20:02.221	2026-10-26 04:20:02.221	\N
180	service_idx_178	อบรมเชิงปฏิบัติการ การสร้างระบบ NIR สำหรับการวิเคราะห์ประจำวัน	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	บริษัทศรีตรังแอโกรอินดัสทรี จำกัด(มหาชน) สาขาเลย	1.00	1	2025-10-30	2025-10-30	2025-10-30	2025	2026-10-26 04:20:02.226	2026-10-26 04:20:02.226	\N
181	service_idx_179	ประชุมรับฟังความคิดเห็น ครั้งที่ 2 โครงการค่าใช้จ่ายในการจัดทำหลักเกณฑ์การจัดสรรน้ำเพื่อการพิจารณาอนุฐาตใช้ทรัพยากรน้ำสาธารณะ	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	กรมทรัพยากรน้ำ	1.00	1	2025-10-03	2025-10-03	2025-10-03	2025	2026-10-26 04:20:02.231	2026-10-26 04:20:02.231	\N
205	service_idx_203	เป็นกรรมการคณะศิลปะศาสตร์และวิทยาศาสตร์ มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.324	2026-10-26 04:20:02.324	\N
183	service_idx_181	ประชุมอนุกรรมการขับเคลื่อนแผนแม่บทและแผนงานโครงการในเขตลุ่มน้ำท่าจีน ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดสุพรรณบุรี	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานคณะกรรมการลุ่มน้ำท่าจีน	1.00	1	2025-10-16	2025-10-16	2025-10-16	2025	2026-10-26 04:20:02.24	2026-10-26 04:20:02.24	\N
184	service_idx_182	ประชุมคณะอนุกรรมการกลั่นกรองแผนปฏิบัติการด้านทรัพยากรน้ำลุ่มน้ำแม่กลอง ครั้งที่ 1/2568 ณ ศาลากลางจังหวัดราชบุรี	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  \n(คณะกรรมการลุ่มน้ำแม่กลอง)	1.00	1	2025-10-21	2025-10-21	2025-10-21	2025	2026-10-26 04:20:02.244	2026-10-26 04:20:02.244	\N
185	service_idx_183	สอนในหัวข้อ Transboundary water and water footprint	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	หลักสูตร ASIAN Studies for Sustainable Development program บัณฑิตวิทยาลัย มหาวิทยาลัยมหิดล	1.00	1	1968-10-31	1968-10-31	1968-10-31	1968	2026-10-26 04:20:02.248	2026-10-26 04:20:02.248	\N
186	service_idx_184	แต่งตั้งผู้ทรงคุณวุฒิสำหรับการจ้างที่ปรึกษาเพื่อศึกษาแนวทางการควบคุมอาคารและจัดทำคู่มือมาตรการสำหรับอาคารในการปรับตัว(Adaptation )และการเตรียมพร้อมในการรับมือ (Resilience) กับการเปลี่ยนแปลงสภาพภูมิอากาศ	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	กรมโยธาธิการและผังเมือง คำสั่งที่ 3471/2568 \nลว 27 ต.ค. 2568	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.252	2026-10-26 04:20:02.252	\N
189	service_idx_187	เป็นกรรมการหลักสูตร วทบ.เทคโนโลยีชีวภาพทางการเกษตร	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.264	2026-10-26 04:20:02.264	\N
191	service_idx_189	เป็นกรรมการหลักสูตร วศ.ด.บ.วิศวกรรมอาหาร	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัย\nเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.271	2026-10-26 04:20:02.271	\N
194	service_idx_192	เป็นประธานบัณฑิตวิทยาลัยวิศวกรรมศาสตร์นานาชาติสิรินธร ไทย-เยอรมัน มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.286	2026-10-26 04:20:02.286	\N
195	service_idx_193	เป็นประธานสถาบันวิจัยและพัฒนา มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยี\nราชมงคลตะวันออก	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.289	2026-10-26 04:20:02.289	\N
196	service_idx_194	เป็นประธานสำนักส่งเสริมวิชาการและงานทะเบียน มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.293	2026-10-26 04:20:02.293	\N
201	service_idx_199	เป็นกรรมการคณะสถาปัตยกรรมศาสตร์และการออกแบบ มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเทคโนโลยี\nราชมงคลรัตนโกสินทร์	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.31	2026-10-26 04:20:02.31	\N
202	service_idx_200	เป็นกรรมการคณะวิศวกรรมศาสตร์ ม.อบ.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยอุบลราชธานี	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.314	2026-10-26 04:20:02.314	\N
203	service_idx_201	เป็นกรรมการวิทยาศาสตร์ \nม.อบ.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยอุบลราชธานี	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.318	2026-10-26 04:20:02.318	\N
204	service_idx_202	เป็นกรรมการคณะมนุษยศาสตร์ มก.	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.321	2026-10-26 04:20:02.321	\N
206	service_idx_204	เป็นกรรมการคณะพาณิชยนาวี	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์\nกพส.	1.00	1	1968-10-01	1968-10-01	1968-10-01	1968	2026-10-26 04:20:02.326	2026-10-26 04:20:02.326	\N
208	service_idx_206	เข้าร่วมเป็นคณะทำงานกลั่นกรองโครงการบ้านมั่นคงเมืองชนบท และสินเชื่อเพื่อการพัฒนาภาคกรุงเทพฯปริมณฑลและตะวันออก	วิชาการ	ผศ.ดร.เพ็ญพิชา สนิทอินทร์	\N	CE	องค์กรชุมชน/ชุมชนท้องถิ่น	1.00	1	1968-10-28	1968-10-28	1968-10-28	1968	2026-10-26 04:20:02.334	2026-10-26 04:20:02.334	\N
209	service_idx_207	โครงการพัฒนาศักยภาพการบริหารจัดการคุณภาพน้ำ องค์กรปกครองส่วนท้องถิ่น รุ่นที่ 8 (ครั้งที่ 1/2569)	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	การบริหารจัดการน้ำเสียของประเทศไทย	1.00	1	1968-11-13	1968-11-13	1968-11-13	1968	2026-10-26 04:20:02.337	2026-10-26 04:20:02.337	\N
210	service_idx_208	วิวัฒนาการของการตรวจสอบคุณภาพผลผลิตเกษตรแบบไม่ทำลาย: จาก NIR สู่ Hyperspectral Imaging	วิชาการ	รศ.ดร.สิรินาฏ น้อยพิทักษ์	\N	AE	อ.เมืองนนทบุรี นนทบุรี	1.00	1	1968-11-03	1968-11-03	1968-11-03	1968	2026-10-26 04:20:02.341	2026-10-26 04:20:02.341	\N
211	service_idx_209	เป็นประธานการสอบวิทยานิพนธ์ \nเรื่อง Co-precipitated proteins based on Bambara groundnut protein isolate and acid solublecollagen:\nPreparation,characterization and film formation	วิชาการ	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	มหาวิทยาลัยสงขลานครินทร์ คณะอุตสาหกรรมเกษตร	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.344	2026-10-26 04:20:02.344	\N
212	service_idx_210	เป็นคณะกรรมการตรวจประกันคุณภาพเครือข่ายมหาวิทยาลัยอาเซียน (Asean University Network Quality Assurance,\nAUN-QA)	วิชาการ	รศ.ดร.เบญญา กสานติสกุล	\N	ME	การศึกษาระดับอุดมศึกษาในภูมิภาคให้เป็นมาตรฐานเดียวกัน	1.00	1	1968-11-17	1968-11-17	1968-11-17	1968	2026-10-26 04:20:02.347	2026-10-26 04:20:02.347	\N
213	service_idx_211	ประชุมคณะกรรมการลุ่มน้ำท่าจีน ครั้งที่ 7/2568 online	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  (คณะกรรมการลุ่มน้ำท่าจีน)	1.00	1	1968-11-06	1968-11-06	1968-11-06	1968	2026-10-26 04:20:02.35	2026-10-26 04:20:02.35	\N
214	service_idx_212	วิทยากรบรรยาย "ความรู้พื้นฐานเรื่องน้ำเสีย ระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบบำบัดน้ำเสีย"	วิชาการ	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-11-12	1968-11-12	1968-11-12	1968	2026-10-26 04:20:02.354	2026-10-26 04:20:02.354	\N
215	service_idx_213	วิทยากรบรรยาย "นโยบายการบริหารจัดการคุณภาพน้ำ ในภาพรวมระดับประเทศ"	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	องค์การจัดการน้ำเสีย	1.00	1	1968-11-13	1968-11-13	1968-11-13	1968	2026-10-26 04:20:02.357	2026-10-26 04:20:02.357	\N
216	service_idx_214	ประชุมคณะกรรมการลุ่มน้ำแม่กลอง ครั้งที่ 5/2568 ณ \nศาลากลางจังหวัดราชบุรี	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  \n(คณะกรรมการลุ่มน้ำ\nแม่กลอง)	1.00	1	1968-11-04	1968-11-04	1968-11-04	1968	2026-10-26 04:20:02.361	2026-10-26 04:20:02.361	\N
217	service_idx_215	วิทยากรเสวนา "สถานการณ์น้ำท่วม บรรเทาได้ด้วยวิจัย และนวัตกรรม" หัวข้อ สถานการณ์และ\nแนวโน้มน้ำท่วม	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	สำนักงานการวิจัยแห่งชาติ (วช.) กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม	1.00	1	1968-11-14	1968-11-14	1968-11-14	1968	2026-10-26 04:20:02.365	2026-10-26 04:20:02.365	\N
229	service_idx_227	ได้รับแต่งตั้งเป็นอนุกรรมการ ในคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68	1.00	1	1968-12-01	1968-12-01	1968-12-01	1968	2026-10-26 04:20:02.409	2026-10-26 04:20:02.409	\N
218	service_idx_216	วิทยากรเสวนา "สถานการณ์น้ำท่วม บรรเทาได้ด้วยวิจัย และนวัตกรรม" หัวข้อ บทเรียน และข้อเสนอแนะการน้ำในพื้นที่ภาคกลาง	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานการวิจัยแห่งชาติ (วช.) กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม	1.00	1	1968-11-14	1968-11-14	1968-11-14	1968	2026-10-26 04:20:02.37	2026-10-26 04:20:02.37	\N
219	service_idx_217	นำเสนอหัวข้อความท้าทายต่อการขับเคลื่อนมิต "ข้อท้าทายต่อการขับเคลื่อนการส่งเสริมความเข้มแข็งกลไกการบริหารจัดการน้ำเชิงพื้นที่" ในงานสัชชาสุขภาพแห่งชาติ \nครั้งที่ 18	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานคณะกรรมการสุขภาพแห่งชาติ ในฐานะกรรมการลุ่มน้ำ ผู้ทรงคุณวุฒิในคณะกรรมการ ลุ่มน้ำเจ้าพระยา	1.00	1	1968-11-28	1968-11-28	1968-11-28	1968	2026-10-26 04:20:02.373	2026-10-26 04:20:02.373	\N
220	service_idx_218	ประชุมคณะทำงานด้านวิชาการ THAICID ครั้งที่ 1/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะทำงานด้านวิชาการ \nTHAICID กรมชลประทาน\nปากเกร็ด จ.นนทบุรี	1.00	1	1968-11-17	1968-11-17	1968-11-17	1968	2026-10-26 04:20:02.377	2026-10-26 04:20:02.377	\N
261	service_idx_259	ประชุมกรรมการลุ่มน้ำท่าจีนครั้งที่ 1/69	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  (คณะกรรมการลุ่มน้ำท่าจีน)	1.00	1	2026-02-04	2026-02-04	2026-02-04	2026	2026-10-26 04:20:02.534	2026-10-26 04:20:02.534	\N
221	service_idx_219	แต่งตั้งคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คำสั่งกระทรวงการอุดมศึกษา \nวิทยาศาสตร์ วิจัยและนวัตกรรม ที่ 203/2568 \nลว. 30 พ.ย. 2568	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.38	2026-10-26 04:20:02.38	\N
222	service_idx_220	ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC- HMS เพื่อการบริหารจัดการน้ำท่วม ครั้งที่ 2/2568	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	ประชุมคณะทำงานปรับปรุงและพัฒนาแบบจำลองลุ่มน้ำเจ้าพระยาด้วยโปรแกรม HEC-RAS, HEC- HMS	1.00	1	1968-11-25	1968-11-25	1968-11-25	1968	2026-10-26 04:20:02.384	2026-10-26 04:20:02.384	\N
223	service_idx_221	ศูนย์สัตว์ทดลองแห่งชาติ มหาวิทยาลัยมหิดล เข้าศึกษาดูงานเครื่องอัดกระถาง และผลิตภัณฑ์	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ\nนายภัทรพล ชูราศรี\nนางสาวธันยพร โส๊ะอ้น	\N	OTH	ศูนย์สัตว์ทดลองแห่งชาติ \nมหาวิทยาลัยมหิดล	1.00	1	1968-11-12	1968-11-12	1968-11-12	1968	2026-10-26 04:20:02.387	2026-10-26 04:20:02.387	\N
224	service_idx_222	ประชุมคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน \nครั้งที่ 1/2568	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานการวิจัยแห่งชาติ (วช.)	1.00	1	1968-12-01	1968-12-01	1968-12-01	1968	2026-10-26 04:20:02.391	2026-10-26 04:20:02.391	\N
225	service_idx_223	ประชุมคณะกรรมการและที่ปรึกษา สมาคมนักอุทกวิทยาไทย	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สมาคมนักอุทกวิทยาไทย \nวาระปี 2568-2569 \nครั้งที่ 2/2568	1.00	1	1968-12-11	1968-12-11	1968-12-11	1968	2026-10-26 04:20:02.394	2026-10-26 04:20:02.394	\N
226	service_idx_224	วิทยากรบรรยาย	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	กิจกรรมเสวานาหัวข้อ "เราจะมีส่วนร่วมในการบริหารทรัพยากรน้ำระดับลุ่มน้ำเจ้าพระยาอย่างไร" ณ โรงแรม คลาสสิค คามิโอ อยุธยา \nจ.พระนครศรีอยุธยา	1.00	1	1968-12-24	1968-12-24	1968-12-24	1968	2026-10-26 04:20:02.398	2026-10-26 04:20:02.398	\N
227	service_idx_225	ได้รับแต่งตั้งเป็นประธานคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ ลว. 10 ธ.ค. 68	1.00	1	1968-12-01	1968-12-01	1968-12-01	1968	2026-10-26 04:20:02.402	2026-10-26 04:20:02.402	\N
241	service_idx_239	เป็นอนุกรรมการในสมาคมวิศวกรรมสถานแห่ง\nประเทศไทย ในพระราชูปถัมภ์	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สมาคมวิศวกรรมสถานแห่งประเทศไทย	1.00	1	1969-01-01	1969-01-01	1969-01-01	1969	2026-10-26 04:20:02.457	2026-10-26 04:20:02.457	\N
228	service_idx_226	ได้รับแต่งตั้งเป็นรองประธานคณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	ประกาศสมาคมนักอุทกวิทยาไทย ที่ 4/2568 เรื่อง คณะอนุกรรมการ ฝ่ายวิชาการและกิจการต่างประเทศ \nลว. 10 ธ.ค. 68	1.00	1	1968-12-01	1968-12-01	1968-12-01	1968	2026-10-26 04:20:02.406	2026-10-26 04:20:02.406	\N
230	service_idx_228	ภาควิชาวิศวกรรมชลประทาน \nคณะวิศวกรรมศาสตร์ กำแพงแสน ร่วมการประชุม ณ ห้องประชุมศูนย์ปฏิบัติการน้ำอัจฉริยะ สำนักงานชลประทานที่ 1 \n(SWOC1) จังหวัดเชียงใหม่	วิชาการ	ผศ.ดร.จุติเทพ วงษ์เพ็ชร์	44	IRE	กรมชลประทาน วางกรอบงานวิจัยบริหารจัดการน้ำ โครงการอุโมงค์ผันน้ำแม่แตง–แม่งัด–แม่กวง	1.00	1	2025-12-25	2025-12-25	2025-12-25	2025	2026-10-26 04:20:02.413	2026-10-26 04:20:02.413	\N
231	service_idx_229	การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตรของประเทศ	วิชาการ	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	AE	สถาบันไทย-เยอรมัน	1.00	1	2026-01-19	2026-01-19	2026-01-19	2026	2026-10-26 04:20:02.417	2026-10-26 04:20:02.417	\N
232	service_idx_230	การประชุมระดมสมองเพื่อจัดทำยุทธศาสตร์เครื่องจักรกลการเกษตร\nของประเทศ	วิชาการ	ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์	18	AE	สถาบันไทย-เยอรมัน	1.00	1	2026-01-20	2026-01-20	2026-01-20	2026	2026-10-26 04:20:02.421	2026-10-26 04:20:02.421	\N
233	service_idx_231	ประชุมคณะอนุกรรมการวิชาการ กรรมการลุ่มน้ำท่าจีน \nครั้งที่ 1/2569 online	วิชาการ	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	สำนักงานทรัพยากรน้ำแห่งชาติภาค 2  \n(คณะกรรมการลุ่มน้ำท่าจีน)	1.00	1	1969-01-05	1969-01-05	1969-01-05	1969	2026-10-26 04:20:02.426	2026-10-26 04:20:02.426	\N
235	service_idx_233	ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา \nครั้งที่ 1/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา (ประชุมออนไลน์)	1.00	1	1969-01-12	1969-01-12	1969-01-12	1969	2026-10-26 04:20:02.437	2026-10-26 04:20:02.437	\N
236	service_idx_234	ประชุมรับฟังความคิดเห็นต่อรายงานผลดำเนินการศึกษาและวางแนวทางการแก้ปัญหาอุทกภัยหาดใหญ่อย่างยั่งยืน	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	พื้นที่อำเภอหาดใหญ่ จ.สงขลา ในคณะกรรมการดำเนินการศึกษาและวางแนวทางการแก้ปัญหา อุทกภัยหาดใหญ่อย่างยั่งยืน	1.00	1	1969-01-12	1969-01-12	1969-01-12	1969	2026-10-26 04:20:02.441	2026-10-26 04:20:02.441	\N
237	service_idx_235	วิทยากรบรรยาย "แนวทางการจัดสรรน้ำและการใช้น้ำ และการจัดลำดับความสำคัญของการใช้น้ำ ประกอบการพิจารณาอนุญาตการใช้น้ำในภาวะน้ำแล้ง/น้ำท่วม ในมุมมองของผู้แทนคณะ\nกรรมการลุ่มน้ำ"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	กรมทรัพยากรน้ำ ณ โรงแรมเวสต์เกตเรสซิเดนซ์ อำเภอบางใหญ่ จ.นนทบุรี	1.00	1	1969-01-13	1969-01-13	1969-01-13	1969	2026-10-26 04:20:02.444	2026-10-26 04:20:02.444	\N
238	service_idx_236	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 1/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา ณ ศาลากลางจังหวัดนครสวรรค์	1.00	1	1969-01-12	1969-01-12	1969-01-12	1969	2026-10-26 04:20:02.447	2026-10-26 04:20:02.447	\N
239	service_idx_237	ประชุมหารือแลกเปลี่ยนและรับฟังข้อเสนอแนะโครงการก่อสร้างระบบป้องกันน้ำท่วมพื้นที่ชุมชนเมืองสมุทรสงคราม	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานโยธาธิการและผังเมือง ศาลากลางจังหวัดสมุทรสงคราม	1.00	1	1969-01-26	1969-01-26	1969-01-26	1969	2026-10-26 04:20:02.451	2026-10-26 04:20:02.451	\N
240	service_idx_238	เป็นผู้เชี่ยวชาญ "จัดทำร่างประกาศเชิญชวน ร่างเอกสารสำหรับคัดเลือกเอกชน \nร่างเอกสารสัญญาร่วมลงทุน"	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	เมืองพัทยา จังหวัดชลบุรี	1.00	1	1969-01-01	1969-01-01	1969-01-01	1969	2026-10-26 04:20:02.454	2026-10-26 04:20:02.454	\N
242	service_idx_240	เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินใหม่ห้องปฏิบัติการทดสอบ	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	บริษัท ซีพีเอฟ \n(ประเทศไทย) \nจำกัด มหาชน โรงงานผลิตอาหารสัตว์ กม.21  \nจ.สมุทรปราการ	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.46	2026-10-26 04:20:02.46	\N
243	service_idx_241	เป็นผู้ประเมินด้านวิชาการในการตรวจประเมินความสามารถและประสบการณ์เหมาะสม	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	บริษัท ซีพีเอฟ \n(ประเทศไทย) จำกัด มหาชน โรงงานผลิตอาหารสัตว์น้ำ จ.สมุทรสาคร	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.463	2026-10-26 04:20:02.463	\N
244	service_idx_242	แต่งตั้งคณะอนุกรรมการวิศวกรรมวัสดุคอนกรีต \nการซ่อมแซม และการบำรุงรักษาเพื่อความยั่งยืนในคณะกรรมการสาขาวิศวกรรมโยธา ประจำปี 2569	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สมาคมวิศวกรรมสถานแห่งประเทศไทย ที่024/2569	1.00	1	1969-01-01	1969-01-01	1969-01-01	1969	2026-10-26 04:20:02.467	2026-10-26 04:20:02.467	\N
245	service_idx_243	แต่งตั้งคณะอนุกรรมการวิศวกรรมวัสดุคอนกรีต การซ่อมแซม และการบำรุงรักษาเพื่อความยั่งยืนในคณะกรรมการสาขาวิศวกรรมโยธา ประจำปี 2569	วิชาการ	ดร.ปาณิศา แสงแก้ว	91	CE	สมาคมวิศวกรรมสถานแห่งประเทศไทย ที่024/2569	1.00	1	1969-01-01	1969-01-01	1969-01-01	1969	2026-10-26 04:20:02.483	2026-10-26 04:20:02.483	\N
246	service_idx_244	เป็นกรรมการสอบ\nวิทยานิพนธ์ของนักศึกษา	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา \nสาขาวิชาวิศวกรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต	1.00	1	1969-01-29	1969-01-29	1969-01-29	1969	2026-10-26 04:20:02.487	2026-10-26 04:20:02.487	\N
247	service_idx_245	แต่งตั้งอาจารย์ที่ปรึกษาวิทยานิพนธ์และคณะกรรมการสอบวิทยานิพนธ์ ที่ 21/2569	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	มหาวิทยาลัยธรรมศาสตร์\nศูนย์รังสิต	1.00	1	1969-01-26	1969-01-26	1969-01-26	1969	2026-10-26 04:20:02.49	2026-10-26 04:20:02.49	\N
248	service_idx_246	แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ตามเกณฑ์ AUN-QA ประจำปีการศึกษา 2567 (ชุดที่4)	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน	1.00	1	1969-01-20	1969-01-20	1969-01-20	1969	2026-10-26 04:20:02.492	2026-10-26 04:20:02.492	\N
249	service_idx_247	วิทยากรค่ายพัฒนาทักษะทางวิชาการ ในหัวข้อ กิจกรรมศาสตร์ของวัสดุและการประคอง	วิชาการ	ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ	129	IE	คณะศิลปศาสตร์และวิทยาศาสตร์ มก กพส	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.495	2026-10-26 04:20:02.495	\N
250	service_idx_248	การบริหารจัดการวัสดุเหลือใช้ทางการเกษตร "การใช้ประโยชน์ฟางข้าวและแกลบ"	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	กรมการข้าว	1.00	1	2026-01-27	2026-01-27	2026-01-27	2026	2026-10-26 04:20:02.499	2026-10-26 04:20:02.499	\N
265	service_idx_263	เป็นคณะกรรมการอำนวยการและคณะกรรมการวิชาการของสมาคมคอนกรีตประจำปี\n พ.ศ.2569-2570	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สาธารณะชนและประเทศชาติ	1.00	1	2026-02-03	2026-02-03	2026-02-03	2026	2026-10-26 04:20:02.545	2026-10-26 04:20:02.545	\N
251	service_idx_249	บริษัท มินริน จำกัด เข้าศึกษาดูงานเครื่องอัดภาชนะใบไม้	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง\nนายรัตนศักดิ์ ทรัพย์เย็น\nนางสาวธันยพร โส๊ะอ้น\nนายสมเกียรติ อิ่มจันทร์\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	บริษัท มินริน จำกัด	1.00	1	1969-01-07	1969-01-07	1969-01-07	1969	2026-10-26 04:20:02.502	2026-10-26 04:20:02.502	\N
252	service_idx_250	มหาวิทยาลัยสงขลานครินทร์ เข้าศึกษาดูงานและหารือด้านก๊าซชีวภาพ	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง	\N	EEEC	อาจารย์ประจำสาขาวิชาวิศวกรรมเคมี	1.00	1	1969-01-19	1969-01-19	1969-01-19	1969	2026-10-26 04:20:02.505	2026-10-26 04:20:02.505	\N
253	service_idx_251	วิทยากรการบรรยายในการสัมมนาเชิงปฏิบัติการด้านการพัฒนาผลิตภัณฑ์จากวัสดุเหลือใช้จากกระบวนการผลิตข้าว \nจ.อยุธยา	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง	\N	EEEC	เกษตรกร แล้วเจ้าหน้าที่กรมการข้าว/เจ้าหน้าที่โครงการ	1.00	1	1969-01-27	1969-01-27	1969-01-27	1969	2026-10-26 04:20:02.508	2026-10-26 04:20:02.508	\N
254	service_idx_252	Review ต้นฉบับบทความวิจัยวารสารระดับนานาชาติ Computers and Electronics In Agriculture 1 เรื่อง	วิชาการ	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	AE	วารสาร Computers and Electronics in Agriculture	1.00	1	1969-01-20	1969-01-20	1969-01-20	1969	2026-10-26 04:20:02.512	2026-10-26 04:20:02.512	\N
255	service_idx_253	แต่งตั้งผู้ทรงคุณวุฒิพิจารณาบทความวิจัยเพื่อตีพิมพ์ลงวารสารวิชาการ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (ฉบับที่ 349)	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	ภาครัฐและเอกชน	1.00	1	2026-01-23	2026-01-23	2026-01-23	2026	2026-10-26 04:20:02.516	2026-10-26 04:20:02.516	\N
256	service_idx_254	แต่งตั้งที่ปรึกษาภายใน ด้านการพัฒนาคุณภาพการศึกษาสู่ความเป็นเลิศ มหาวิทยาลัยเกษตรศาสตร์	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	2026-01-28	2026-01-28	2026-01-28	2026	2026-10-26 04:20:02.52	2026-10-26 04:20:02.52	\N
257	service_idx_255	แต่งตั้งคณะกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศระดับคณะ และวิทยาเขต มหาวิทยาลัยเกษตรศาสตร์ ประจำปีการศึกษา 2567	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์ กำแพงแสน	1.00	1	2026-02-06	2026-02-06	2026-02-06	2026	2026-10-26 04:20:02.523	2026-10-26 04:20:02.523	\N
258	service_idx_256	วิทยากรบรรยายในหัวข้อ "นโยบายการบริหารจัดการคุณภาพน้ำในภาพรวมระดับประเทศ"	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	องค์การจัดการน้ำเสีย	1.00	1	2026-02-26	2026-02-26	2026-02-26	2026	2026-10-26 04:20:02.526	2026-10-26 04:20:02.526	\N
259	service_idx_257	ผู้ดำเนินรายการ เสวนาวิชาการ เรื่อง "ประสบการณ์น้ำท่วมเชียงใหม่-หาดใหญ่ เราเรียนรู้อะไร ควรเตรียมการและปรับตัวอย่างไร	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สมาคมนักอุทกวิทยาไทย \nอ.ปากเกร็ด จ.นนทบุรี	1.00	1	2026-02-20	2026-02-20	2026-02-20	2026	2026-10-26 04:20:02.529	2026-10-26 04:20:02.529	\N
260	service_idx_258	วิทยากรบรรยายในหัวข้อ "ความรู้พื้นฐานเรื่องน้ำเสียระบบบำบัดน้ำเสีย และการนำพลังงานสะอาดมาใช้ในการบริหารจัดการระบบ\nบำบัดน้ำเสีย"	วิชาการ	ผศ.ดร.นิธิรัชต์ สงวนเดือน	42	IRE	องค์การจัดการน้ำเสีย	1.00	1	2026-02-25	2026-02-25	2026-02-25	2026	2026-10-26 04:20:02.531	2026-10-26 04:20:02.531	\N
262	service_idx_260	เป็นอาจารย์พิเศษบรรยาย "การตรวจสอบคุณภาพผลผลิตทางการเกษตรแบบไม่ทำลาย"	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	คณะเกษตรศาสตร์ ทรัพยากรธรรมชาติและสิ่งแวดล้อม ม.นเรศวร	1.00	1	1969-02-19	1969-02-19	1969-02-19	1969	2026-10-26 04:20:02.537	2026-10-26 04:20:02.537	\N
263	service_idx_261	เป็นผู้ให้การอบรมเกษตรกรสาธิตระบบให้น้ำและปุ๋ยอย่างแม่นยำ	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก จ.ขอนแก่น และกลุ่มสตรีสหกรณ์การเกษตรไม้ผลบ้านโหล่น จ.ชัยภูมิ	1.00	1	1969-02-28	1969-02-28	1969-02-28	1969	2026-10-26 04:20:02.539	2026-10-26 04:20:02.539	\N
264	service_idx_262	คณะกรรมการอำนวยการ ทสม. ระดับจังหวัด \nจังหวัดนครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	สำนักงานจังหวัดนครปฐม	1.00	1	2026-02-09	2026-02-09	2026-02-09	2026	2026-10-26 04:20:02.541	2026-10-26 04:20:02.541	\N
266	service_idx_264	แต่งตั้งคณะกรรมการยุววิศวกร ประจำปี 2569-2571	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	สมาคมวิศวกรรมสถาน\nแห่งประเทศไทย \nในพระราชูปถัมภ์	1.00	1	2026-02-09	2026-02-09	2026-02-09	2026	2026-10-26 04:20:02.548	2026-10-26 04:20:02.548	\N
267	service_idx_265	วิทยากรบรรยายในหัวข้อ\n"โครงการก่อสร้างอาคารนวัตกรรมการเรียนรู้ทางวิศวกรรมศาสตร์"	วิชาการ	นายณัฐพล เสรีเผ่าวงษ์	269	OTH	นักศึกษาและอาจารย์\nโครงการฝึกอบรมทางวิชาชีพและศึกษาดูงานสถานประกอบการ	1.00	1	1969-02-19	1969-02-19	1969-02-19	1969	2026-10-26 04:20:02.552	2026-10-26 04:20:02.552	\N
268	service_idx_266	จัดแสดงนิทรรศการผลงานวิจัยนวัตกรรมในงานเกษตรแฟร์ ประจำปี 2569	วิชาการ	นายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนางสาวธันยพร โส๊ะอ้น	\N	EEEC	ประชาชนทั่วไป	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.555	2026-10-26 04:20:02.555	\N
269	service_idx_267	นักศึกษาปีที่ 1 \nคณะศิลปศาสตร์และวิทยาศาสตร์ เข้าศึกษาดูงาน	วิชาการ	นางเนตรนภา วิชานงค์\nนายภัทรพล ชูราศรี\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	นักศึกษาปีที่ 1	1.00	1	2026-02-03	2026-02-03	2026-02-03	2026	2026-10-26 04:20:02.558	2026-10-26 04:20:02.558	\N
270	service_idx_268	เข้าร่วมการประชุมคณะกรรมการอำนวยการ ทสม. ระดับจังหวัด\n จังหวัดนครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง	\N	EEEC	คณะกรรมการอำนวยการ ทสม. ระดับจังหวัด จังหวัดนครปฐม	1.00	1	2026-02-09	2026-02-09	2026-02-09	2026	2026-10-26 04:20:02.561	2026-10-26 04:20:02.561	\N
271	service_idx_269	สำนักส่งเสริมฯ นำทีมผู้ประกอบการ เข้าศึกษาดูงาน	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น\nนางณีรนุช ยอดเพชร\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	ผู้ประกอบการ	1.00	1	2026-02-10	2026-02-10	2026-02-10	2026	2026-10-26 04:20:02.564	2026-10-26 04:20:02.564	\N
272	service_idx_270	คณะศึกษาดูงานจากสำนักงานส่งเสริมการปกครองท้องถิ่นจังหวัดนครปฐม ในการจัดกิจกรรมศึกษาเรียนรู้ “การกำจัดเศษใบไม้และกิ่งไม้ในบ้านเรือนและชุมชน ด้วยเตาเผาไร้ควัน” เพื่อสนับสนุนการดำเนินงานตามแผนปฏิบัติการจัดการขยะมูลฝอยชุมชน “จังหวัดสะอาด”\n ประจำปี พ.ศ. 2569	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง\nนายอรรถวุทธิ์ รื่นเริงใจ\nนายภัทรพล ชูราศรี\nนายเจษฎาพร ด้วงแก้ว\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	ผู้แทนกลุ่มงานบริการสาธารณะและประสานงานท้องถิ่นอำเภอ	1.00	1	2026-02-12	2026-02-12	2026-02-12	2026	2026-10-26 04:20:02.569	2026-10-26 04:20:02.569	\N
273	service_idx_271	จัดนิทรรศการในงาน 3 อ. FOR FIT ณ สำนักส่งเสริมและฝึกอบรม กำแพงแสน	วิชาการ	นายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	EEEC	ประชาชนทั่วไป	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.573	2026-10-26 04:20:02.573	\N
274	service_idx_272	จัดนิทรรศการ ในงาน green gain day ต.กระตีบ \nอ.กำแพงแสน จ.นครปฐม	วิชาการ	นางสาวธันยพร โส๊ะอ้น\nนางณีรนุช ยอดเพชร	\N	EEEC	เกษตรกรและชุมชน	1.00	1	2026-02-24	2026-02-24	2026-02-24	2026	2026-10-26 04:20:02.576	2026-10-26 04:20:02.576	\N
286	service_idx_284	อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Geospatial Modelling for Water Resources Management ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม\n ม.มหิดล วิทยาเขตศาลายา	1.00	1	2026-03-24	2026-03-24	2026-03-24	2026	2026-10-26 04:20:02.621	2026-10-26 04:20:02.621	\N
275	service_idx_273	ส่งมอบเครื่องอัดกระถางวัสดุจากธรรมชาติและเครื่องผสมวัสดุ พร้อมสาธิตการใช้งาน ให้กับโรงเรียนกาบเชิงวิทยา อำเภอกาบเชิง จังหวัดสุรินทร์	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว\nนายสมเกียรติ อิ่มจันทร์\nนางสาวอทิตยา แผ้วไพบูลย์	\N	EEEC	คณะครูโรงเรียนกาบเชิงวิทยา อำเภอกาบเชิง จังหวัดสุรินทร์	1.00	1	2026-02-24	2026-02-24	2026-02-24	2026	2026-10-26 04:20:02.58	2026-10-26 04:20:02.58	\N
276	service_idx_274	ประชุมคณะทำงานพัฒนาหลักเกณฑ์ มาตรฐานการบริหารจัดการทรัพยากรน้ำ ครั้งที่ 1/2569	วิชาการ	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	2026-03-05	2026-03-05	2026-03-05	2026	2026-10-26 04:20:02.586	2026-10-26 04:20:02.586	\N
277	service_idx_275	ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการน้ำเจ้าพระยา ครั้งที่ 1/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติ\nภาค 2 จ.นนทบุรี	1.00	1	2026-03-04	2026-03-04	2026-03-04	2026	2026-10-26 04:20:02.589	2026-10-26 04:20:02.589	\N
301	service_idx_299	เป็นประธานกรรมการประเมินคุณภาพการศึกษาเพื่อดำเนินการที่เป็นเลิศ ระดับสายสนับสนุน	วิชาการ	รศ.ดร.เบญญา กสานติกุล	107	ME	มหาวิทยาลัยเกษตรศาสตร์	1.00	1	2026-04-30	2026-04-30	2026-04-30	2026	2026-10-26 04:20:02.673	2026-10-26 04:20:02.673	\N
278	service_idx_276	ประชุมคณะอนุกรรมการบริหารจัดการสถานการณ์น้ำลุ่มน้ำเจ้าพระยา \nครั้งที่ 2/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา สำนักงานทรัพยากรน้ำแห่งชาติภาค 2	1.00	1	2026-03-06	2026-03-06	2026-03-06	2026	2026-10-26 04:20:02.592	2026-10-26 04:20:02.592	\N
279	service_idx_277	วิทยากรบรรยาย "ประเด็นการมีส่วนร่วมในการบริหารจัดการพื้นที่รับน้ำเพื่อการพัฒนาอย่างยั่งยืน"	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	การประชุมแลกเปลี่ยนสถานการณ์การบริหารจัดการน้ำของประเทศไทย เพื่อการพัฒนาและขับเคลื่อนนโยบายสาธารณะแบบมีส่วนร่วมของจังหวัดพระนครศรีอยุธยา ณ อาคารสุขภาพแห่งชาติ กระทรวงสาธารณสุข จ.นนทบุรี	1.00	1	2026-03-05	2026-03-05	2026-03-05	2026	2026-10-26 04:20:02.595	2026-10-26 04:20:02.595	\N
280	service_idx_278	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำเจ้าพระยา จ.นครสวรรค์	1.00	1	2026-03-10	2026-03-10	2026-03-10	2026	2026-10-26 04:20:02.598	2026-10-26 04:20:02.598	\N
281	service_idx_279	ประชุมสัมมนาระดมความคิดเห็นกรรมการลุ่มน้ำ\nผู้ทรงคุณวุฒิ 22 ลุ่มน้ำ เพื่อขับเคลื่อนการพัฒนาลุ่มน้ำอย่างยั่งยืน	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะกรรมการลุ่มน้ำฯ สำนักงานทรัพยากรน้ำแห่งชาติภาค 2 จ.นนทบุรี	1.00	1	2026-03-27	2026-03-27	2026-03-27	2026	2026-10-26 04:20:02.601	2026-10-26 04:20:02.601	\N
282	service_idx_280	วิทยากรให้ความรู้หัวข้อ "โครงการเพิ่มประสิทธิภาพระบบการบริหารจัดการน้ำและควบคุมอาคารชลประทานจากระยะไกลในแม่น้ำปิงสายหลัก"	วิชาการ	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	IRE	โครงการฝึกอบรม การจัดการความรู้ นวัตกรรม และเสริมสร้างธรรมาภิบาลขององค์กรเพื่อการบริหารจัดการน้ำอย่างยั่งยืน สำนักงานชลประทานที่ 1	1.00	1	2026-03-13	2026-03-13	2026-03-13	2026	2026-10-26 04:20:02.604	2026-10-26 04:20:02.604	\N
283	service_idx_281	วิทยากรบรรยายการประชุมเสวนาวิชาการ เรื่อง รู้ทัน การ\nเปลี่ยนแปลงพร้อมรับมือแล้งนี้	วิชาการ	รศ.ดร.วราวุฒิ วุฒิวณิชย์	\N	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ จ.นนทบุรี	1.00	1	2026-03-30	2026-03-30	2026-03-30	2026	2026-10-26 04:20:02.608	2026-10-26 04:20:02.608	\N
284	service_idx_282	ประชุมเสวนาวิชาการ \nเรื่อง รู้ทัน การเปลี่ยนแปลง \nพร้อมรับมือแล้งนี้	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	สำนักงานทรัพยากรน้ำแห่งชาติ	1.00	1	2026-03-30	2026-03-30	2026-03-30	2026	2026-10-26 04:20:02.612	2026-10-26 04:20:02.612	\N
285	service_idx_283	อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics\n in Advanced Water Resources Engineering หัวข้อ Vector and Raster Data Analysis & Terrain Analysis and Hydrological Modeling ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม \nม.มหิดล วิทยาเขตศาลายา	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม\n ม.มหิดล วิทยาเขตศาลายา	1.00	1	2026-03-17	2026-03-17	2026-03-17	2026	2026-10-26 04:20:02.617	2026-10-26 04:20:02.617	\N
287	service_idx_285	อาจารย์พิเศษ บรรยายวิชา EGEW564 Hydroinformatics in Advanced Water Resources Engineering หัวข้อ Remote Sensing in Hydrology ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม ม.มหิดล วิทยาเขตศาลายา	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	นักศึกษาปริญญาโท ภาควิชาวิศวกรรมโยธาและสิ่งแวดล้อม\n ม.มหิดล วิทยาเขตศาลายา	1.00	1	2026-03-31	2026-03-31	2026-03-31	2026	2026-10-26 04:20:02.624	2026-10-26 04:20:02.624	\N
288	service_idx_286	กรรมการสอบเค้าโครงวิทยานิพนธ์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น	วิชาการ	ผศ.ดร.เกศวรา สิทธิโชค	45	IRE	นักศึกษาปริญญาโท คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น	1.00	1	2026-03-24	2026-03-24	2026-03-24	2026	2026-10-26 04:20:02.628	2026-10-26 04:20:02.628	\N
289	service_idx_287	เป็นประธานกรรมการสอบป้องกันวิทยานิพนธ์	วิชาการ	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	สาขาวิชาวิทยาศาสตร์และเทคโนโลยีอาหาร \nคณะอุตสาหกรรมเกษตร มหาวิทยาลัยสงขลานครินทร์	1.00	1	1969-03-16	1969-03-16	1969-03-16	1969	2026-10-26 04:20:02.631	2026-10-26 04:20:02.631	\N
302	service_idx_300	เป็นผู้ทรงคุณวุฒิในการประชุมปรึกษาหารือทางวิชาการเพื่อให้คำแนะนำและแลกเปลี่ยนแนวคิดในหัวข้อ"เทคโนโลยีและการจัดการโรงเรือนปิดสำหรับการปลูกหญ้าหวานเชิงพาณิชย์"	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	บริษัท ชิล ทอล์ค จำกัด	1.00	1	1969-04-10	1969-04-10	1969-04-10	1969	2026-10-26 04:20:02.678	2026-10-26 04:20:02.678	\N
290	service_idx_288	ส่งเสริมและสนับสนุนการวิจัยและนวัตกรรมภายใต้แผนงานน้ำมั่นคง ไม่ท่วม ไม่แล้ง ใน 10 จังหวัดด้านการเกษตร	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก \nจ.ขอนแก่น และกลุ่มสตรีสหกรณ์การเกษตรไม้ผลบ้านโหล่น จ.ชัยภูมิ	1.00	1	1969-03-12	1969-03-12	1969-03-12	1969	2026-10-26 04:20:02.634	2026-10-26 04:20:02.634	\N
291	service_idx_289	เป็นผู้ทรงคุณวุฒิในการประชุมระดมสมองเพื่อจัดทำกรอบการวิจัยและนวัตกรรม ประจำปีงบประมาณ 2570 \nด้านเศรษฐกิจและการเกษตร	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	สำนักงานการวิจัยแห่งชาติ (วช.)	1.00	1	1969-03-26	1969-03-26	1969-03-26	1969	2026-10-26 04:20:02.638	2026-10-26 04:20:02.638	\N
292	service_idx_290	7th Asia Pacific International Conference on Industrial Engineering and Operations Management\nBangkok, Thailand, March 25-27, 2026	วิชาการ	นางสาวธันยพร โส๊ะอ้น\nนายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	EEEC	เกษตรกรใน อ.นครชัยศรี \nจ.นครปฐม	1.00	1	1969-03-10	1969-03-10	1969-03-10	1969	2026-10-26 04:20:02.641	2026-10-26 04:20:02.641	\N
293	service_idx_291	วิทยากรการอบรมเชิงปฏิบัติการสร้างมูลค่าเพิ่มเศษวัสดุเหลือใช้ทางการเกษตร โครงการส่งเสริมการเกษตรที่เป็นมิตรกับสิ่งแวดล้อม กิจกรรม จัดตั้ง "Green Gain Hub" ระดับจังหวัด ณ ต.บางไทรป่า อ.บางเลน จ.นครปฐม	วิชาการ	ผศ.นงลักษณ์ เล็กรุ่งเรือง\nนายภัทรพล ชูราศรี\nนายรัตนศักดิ์ ทรัพย์เย็น	\N	EEEC	เกษตรกรใน อ.บางเลน \nจ.นครปฐม	1.00	1	1969-03-13	1969-03-13	1969-03-13	1969	2026-10-26 04:20:02.644	2026-10-26 04:20:02.644	\N
294	service_idx_292	จัดนิทรรศการ ภายใต้โครงการวิจัยการส่งเสริมความสามารถการผลิตข้าวคุณภาพและการบริหารจัดการเชิงธุรกิจแบบมีส่วนร่วมของชาวนาภาคตะวันตก ณ ศูนย์ส่งเสริมและฝึกอบรมการเกษตรแห่งชาติ	วิชาการ	นายรัตนศักดิ์ ทรัพย์เย็น\nนายเจษฎาพร ด้วงแก้ว	\N	EEEC	หน่วยงานภาครัฐและเอกชน\nผู้ประกอบการ\nนักศึกษาและบุคลากรในมหาวิทยาลัย\nผู้ที่สนใจทั่วไป	1.00	1	1969-03-27	1969-03-27	1969-03-27	1969	2026-10-26 04:20:02.647	2026-10-26 04:20:02.647	\N
295	service_idx_293	เป็นวิทยากรบรรยายในงานสัมมนาความรู้ Design Precaign Strucyural Members with GFRP	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน	1.00	1	1969-03-20	1969-03-20	1969-03-20	1969	2026-10-26 04:20:02.653	2026-10-26 04:20:02.653	\N
296	service_idx_294	เข้าร่วมดำเนินงานโครงการวิจัย การศึกษาความเป็นไปได้ในการปรับปรุงรายการตรวจสอบสภาพอาคารเขื่อนทดแทนน้ำเก่า เพื่อลดความเสี่ยงต่อความเสียหายต่อพื้นที่เกษตรกรรม	วิชาการ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	ชป.สวทช.	1.00	1	1969-03-06	1969-03-06	1969-03-06	1969	2026-10-26 04:20:02.655	2026-10-26 04:20:02.655	\N
297	service_idx_295	เป็นประธานกรรมการและผู้ทรงคุณวุฒิสอบหัวข้อและ\nเค้าโครงวิทยานิพนธ์	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก	1.00	1	1969-03-25	1969-03-25	1969-03-25	1969	2026-10-26 04:20:02.659	2026-10-26 04:20:02.659	\N
298	service_idx_296	เป็นกรรมการสอบวิทยานิพนธ์ \nโครงการบัณฑิตศึกษา ในหัวข้อ การประยุกต์ใช้วิธีการตกตะกอนแคลเซียมคาร์บอเนต โดยเชื้อจุลินทรีย์ในมอตาร์ (ออนไลน์)	วิชาการ	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	โครงการบัณฑิตศึกษา \nสาขาวิศวรรมโยธา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต ต.คลองหนึ่ง \nอ.คลองหลวง จ.ปทุมธานี	1.00	1	1969-03-24	1969-03-24	1969-03-24	1969	2026-10-26 04:20:02.663	2026-10-26 04:20:02.663	\N
299	service_idx_297	กรรมการสอบ ป้องกันสารนิพนธ์ของนักศึกษา\nระดับปริญญาโท	วิชาการ	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ	1.00	1	1969-03-25	1969-03-25	1969-03-25	1969	2026-10-26 04:20:02.666	2026-10-26 04:20:02.666	\N
300	service_idx_298	Invited Speaker ในการประชุมวิชาการ Inaugural Meeting of the Tropical Crops Machinery Branch of the Chinese Society for Agricultural Machinery and the High-Quality Development Forum on Tropical Crop Machinery	วิชาการ	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	AE	Chinese Society for Agricultural Machinery (CSAM)	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.669	2026-10-26 04:20:02.669	\N
303	service_idx_301	ประชุมคณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	คณะอนุกรรมการวิชาการและบริหารจัดการลุ่มน้ำเจ้าพระยา	1.00	1	1969-04-16	1969-04-16	1969-04-16	1969	2026-10-26 04:20:02.683	2026-10-26 04:20:02.683	\N
304	service_idx_302	ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา ครั้งที่ 2/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	ประชุมคณะอนุกรรมการขับเคลื่อนแผนแม่บทการบริหารจัดการทรัพยากรน้ำในเขตลุ่มน้ำเจ้าพระยา	1.00	1	1969-04-17	1969-04-17	1969-04-17	1969	2026-10-26 04:20:02.687	2026-10-26 04:20:02.687	\N
305	service_idx_303	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา ครั้งที่ 3/2569	วิชาการ	รศ.ดร.บัญชา ขวัญยืน	36	IRE	ประชุมคณะกรรมการลุ่มน้ำเจ้าพระยา	1.00	1	1969-04-22	1969-04-22	1969-04-22	1969	2026-10-26 04:20:02.69	2026-10-26 04:20:02.69	\N
306	service_idx_304	เป็นผู้ทรงคุณวุฒิในการประเมินผลกระทบของโครงการ ภายใต้โครงการเรื่อง ระบบการให้น้ำอย่างแม่นยำในสวนมะม่วงน้ำดอกไม้สีทองเพื่อการส่งออกจ.ขอนแก่นและจ.ชัยภูมิ	วิชาการ	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	กลุ่มวิสาหกิจชุมชนมะม่วงบ้านแฮดเพื่อการส่งออก จ.ขอนแก่น และกลุ่มสตรีสหกรณ์บ้านโหล่น จ.ชัยภูมิ	1.00	1	\N	2024-10-01	2024-10-01	\N	2026-10-26 04:20:02.694	2026-10-26 04:20:02.694	\N
307	service_idx_305	Keynote Speaker ในการสัมมนาออนไลน์ CAU-KU Online Workshop on Intelligent Agricultural Machinery and Smart Agriculture	วิชาการ	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	AE	China Agricultural University	1.00	1	1969-04-24	1969-04-24	1969-04-24	1969	2026-10-26 04:20:02.697	2026-10-26 04:20:02.697	\N
234	service_idx_232	กรรมการประเมินคุณภาพการศึกษาภายใน ระดับหลักสูตร ปีการศึกษา 2567	วิชาการ	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	บุคคลทั่วไป	1.00	1	1969-01-16	1969-01-16	1969-01-16	1969	2026-10-26 04:20:02.432	2026-10-26 04:20:02.432	\N
\.


--
-- Data for Name: course_catalog; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.course_catalog (course_code, course_name_th, course_name_en, department_code) FROM stdin;
01204111	คอมพิวเตอร์และการเขียนโปรแกรม	Computers and Programming	CPE
01204211	โครงสร้างข้อมูลและขั้นตอนวิธี	Data Structures and Algorithms	CPE
01204216	การโปรแกรมเชิงวัตถุ	Object-Oriented Programming	CPE
01204322	ระบบฐานข้อมูล	Database Systems	CPE
01204341	ปัญญาประดิษฐ์	Artificial Intelligence	CPE
01204351	วิศวกรรมซอฟต์แวร์	Software Engineering	CPE
01204441	การเรียนรู้ของเครื่อง	Machine Learning	CPE
01204499	โครงงานวิศวกรรมคอมพิวเตอร์	Computer Engineering Project	CPE
01205211	การวิเคราะห์วงจรไฟฟ้า	Electric Circuit Analysis	EEEC
01205213	สนามแม่เหล็กไฟฟ้า	Electromagnetic Fields	EEEC
01205311	ระบบไฟฟ้ากำลัง	Power System	EEEC
01205331	ระบบควบคุมและเครื่องมือวัด	Control Systems and Instrumentation	EEEC
01208201	กลศาสตร์วิศวกรรม I (สถิตยศาสตร์)	Engineering Mechanics I (Statics)	ME
01208202	กลศาสตร์วิศวกรรม II (พลศาสตร์)	Engineering Mechanics II (Dynamics)	ME
01208221	อุณหพลศาสตร์	Thermodynamics	ME
01208241	กลศาสตร์ของไหล	Fluid Mechanics	ME
01208381	การออกแบบเครื่องจักรกล	Mechanical Design	ME
01203211	กลศาสตร์ของวัสดุ	Mechanics of Materials	CE
01203221	การสำรวจเพื่องานวิศวกรรม	Surveying for Engineering	CE
01203331	การวิเคราะห์โครงสร้าง	Structural Analysis	CE
01203341	วิศวกรรมสิ่งแวดล้อม	Environmental Engineering	CE
01201211	เครื่องจักรกลเกษตรและการใช้ประโยชน์	Agricultural Machinery and Utilization	AE
01201311	วิศวกรรมดินและน้ำ	Soil and Water Engineering	AE
01201411	เทคโนโลยีเกษตรแม่นยำ	Precision Agriculture Technology	AE
01213211	ชลศาสตร์ชลประทาน	Irrigation Hydraulics	IRE
01213311	การวางแผนระบบชลประทาน	Irrigation System Planning	IRE
01213411	การจัดการทรัพยากรน้ำ	Water Resources Management	IRE
01211211	วิศวกรรมกระบวนการแปรรูปอาหาร	Food Process Engineering	FE
01211311	สุขาภิบาลโรงงานอุตสาหกรรมเกษตร	Agro-Industrial Sanitation	FE
01209211	การศึกษางานและการยศาสตร์	Work Study and Ergonomics	IE
01209311	การควบคุมคุณภาพทางวิศวกรรม	Engineering Quality Control	IE
01209411	การวิจัยดำเนินงาน	Operations Research	IE
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.departments (code, name_th, name_en, is_canonical, created_at) FROM stdin;
AE	ภาควิชาวิศวกรรมเกษตร	Department of Agricultural Engineering	t	2026-10-26 04:10:39.677
CPE	ภาควิชาวิศวกรรมคอมพิวเตอร์	Department of Computer Engineering	t	2026-10-26 04:10:39.695
IRE	ภาควิชาวิศวกรรมชลประทาน	Department of Irrigation Engineering	t	2026-10-26 04:10:39.697
FE	ภาควิชาวิศวกรรมอาหาร	Department of Food Engineering	t	2026-10-26 04:10:39.698
IE	ภาควิชาวิศวกรรมอุตสาหการ	Department of Industrial Engineering	t	2026-10-26 04:10:39.699
ME	ภาควิชาวิศวกรรมเครื่องกล	Department of Mechanical Engineering	t	2026-10-26 04:10:39.7
CE	ภาควิชาวิศวกรรมโยธา	Department of Civil Engineering	t	2026-10-26 04:10:39.702
EEEC	ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม	Energy and Environmental Engineering Center	t	2026-10-26 04:10:39.702
DWT	ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร	Door, Window and Curtain Wall Testing Center	t	2026-10-26 04:10:39.706
NAMC	ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ	National Agricultural Machinery Center	t	2026-10-26 04:10:39.707
OFS	สำนักงานเลขานุการ คณะวิศวกรรมศาสตร์ กำแพงแสน	Office of the Secretary	t	2026-10-26 04:10:39.708
OTH	อื่นๆ / ไม่ระบุ	Other / External	f	2026-10-26 04:10:39.708
\.


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.evaluations (id, category, record_id, sdg_ids, i_type, journal_index, evaluated_by, evaluated_at) FROM stdin;
1	research	วศ.กพส. 1/2569	{7,9,13}	I_AM	\N	admin	2026-10-24 21:00:19.475
2	research	วศ.กพส.\n1/2568	{11,13}	I_SEE	\N	admin	2026-10-24 20:36:46.502
3	publications	pub_001	{3,9,12}	I_SEE	[object Object]	admin	2026-10-24 20:34:58.707
4	publications	pub_002	{7,11}	\N	\N	system	2026-10-26 04:20:02.832
5	research	วศ.กพส.\n2/2568	{}	\N	\N	system	2026-10-26 04:20:02.832
6	academic	academic_idx_0	{4,11}	I_SEE	\N	admin	2026-10-24 20:50:50.558
7	service	service_1792829081701	{1,2}	I_AM	\N	admin	2026-10-24 21:00:19.604
8	ip	ip_1	{9}	I_AM	\N	admin	2026-10-24 21:00:19.682
\.


--
-- Data for Name: funding_sources; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.funding_sources (id, name, type) FROM stdin;
1	สำนักงานการวิจัยแห่งชาติ (วช.)	ภายนอก
2	สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)	ภายนอก
3	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.)	ภายนอก
4	หน่วยบริหารและจัดการทุนด้านการพัฒนากำลังคนและสถาบันอุดมศึกษา (บพค.)	ภายนอก
5	หน่วยบริหารและจัดการทุนด้านการพัฒนาระดับพื้นที่ (บพท.)	ภายนอก
6	สำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว.)	ภายนอก
7	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายใน
8	ทุนสนับสนุนการวิจัย วิทยาเขตกำแพงแสน	ภายใน
9	ทุนอุดหนุนวิจัยเพื่อพัฒนานักวิจัยรุ่นใหม่ มก.	ภายใน
10	ภาคเอกชน / บริษัทอุตสาหกรรม	ภายนอก
11	test	ภายใน
\.


--
-- Data for Name: intellectual_properties; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.intellectual_properties (id, legacy_id, title, type, work_category, work_character, creator_name, creator_personnel_id, department_code, application_number, registration_number, filing_date, protection_start, protection_end, support_amount, status, fiscal_year, remarks, created_at, updated_at, owner, right_holder) FROM stdin;
6	ip_6	Precast concrete with sacrificial anode cathodic protection	สิทธิบัตร	\N	\N	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	0000002025	0000755541	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.784	2026-10-26 04:20:02.784	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
1	ip_1	อุปกรณ์ผลิตลูกปูน	อนุสิทธิบัตร	\N	\N	รศ.ดร.นันทวัฒน์ ขมหวาน, รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	2303000652	0000022823	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.701	2026-10-26 04:20:02.701	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
2	ip_2	อุปกรณ์วัดความกรอบของเนื้อมะละกอผลดิบ	อนุสิทธิบัตร	\N	\N	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล, นายวิชัย หมอยาดี	\N	AE	2303003816	0000024730	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.729	2026-10-26 04:20:02.729	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
3	ip_3	เครื่องนึ่งและอบแห้งข้าวเปลือกด้วยเทคนิคฟลูอิไดซ์เบดสั่นร่วมกับการใช้ไอน้ำร้อนยวดยิ่ง	อนุสิทธิบัตร	\N	\N	รศ.ดร.เชาว์ อินทร์ประสิทธิ์, นางสาวพรพรรณ จิอู๋	\N	FE	2203002402	0000024939	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.737	2026-10-26 04:20:02.737	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
4	ip_4	รถเข็นสี่ล้อเพื่อการเกษตรขับเคลื่อนด้วยระบบไฟฟ้า	อนุสิทธิบัตร	\N	\N	รศ.ดร. ศิวลักษณ์ ปฐวีรัตน์	8	AE	2303003200	0000024938	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.745	2026-10-26 04:20:02.745	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
5	ip_5	เครื่องกำจัดโลหะฟอสไฟต์ตกค้างในเศษเถ้าสารรม	อนุสิทธิบัตร	\N	\N	รศ.ดร.วัชรพล ชยประเสริฐ	12	AE	2203002196	0000024733	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.751	2026-10-26 04:20:02.751	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
7	ip_7	เครื่องกำจัดวัชพืชด้วยเปลวไฟสำหรับติดท้ายรถแทรกเตอร์	อนุสิทธิบัตร	\N	\N	รศ.ดร.ประเทือง อุษาบริสุทธิ์, ผศ.ดร.วันรัฐ  อับดุลลากาซิม, ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์, อ.ดร.ชัยยะ จันทรา, นายพงศ์พันธุ์  ปั้นมยุรา	\N	AE	2303002822	0000025468	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.789	2026-10-26 04:20:02.789	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
8	ip_8	เครื่องกำจัดวัชพืชด้วยน้ำร้อนสำหรับติดท้ายรถแทรกเตอร์	อนุสิทธิบัตร	\N	\N	รศ.ดร.ประเทือง อุษาบริสุทธิ์, ผศ.ดร.วันรัฐ  อับดุลลากาซิม, ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์, อ.ดร.ชัยยะ จันทรา, นายพงศ์พันธุ์  ปั้นมยุรา	\N	AE	2303002824	0000025469	\N	2024-10-01	2030-10-01	0.00	ได้รับความคุ้มครองแล้ว	\N	\N	2026-10-26 04:20:02.795	2026-10-26 04:20:02.795	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
9	ip_9	เครื่องวัดความต้านทานดินแบบอัตโนมัติสำหรับรถแทรกเตอร์	อนุสิทธิบัตร	\N	\N	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2503004483	000009	\N	2024-10-01	2030-10-01	20000.00	ยื่นคำขอแล้ว	\N	\N	2026-10-26 04:20:02.8	2026-10-26 04:20:02.8	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
10	ip_10	ชุดอุปกรณ์ตรวจวัดความชื้นของเมล็ดพืช	อนุสิทธิบัตร	\N	\N	ภาควิชาวิศวกรรมเกษตร	\N	AE	\N	0000010	2024-06-17	2024-06-17	2030-06-17	0.00	ยื่นคำขอแล้ว	\N	\N	2026-10-26 04:20:02.802	2026-10-26 04:20:02.802	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
11	ip_11	รถไถเดินตามสำหรับกำจัดวัชพืช	อนุสิทธิบัตร	\N	\N	ภาควิชาวิศวกรรมเกษตร	\N	AE	\N	0000011	1968-04-29	1968-04-29	1974-04-29	20000.00	ยื่นคำขอแล้ว	\N	\N	2026-10-26 04:20:02.804	2026-10-26 04:20:02.804	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
12	ip_12	กรรมวิธีการสกัดลิกนินจากปาล์ม	อนุสิทธิบัตร	\N	\N	รศ.กันต์ธกรณ์ เขาทอง	109	ME	\N	0000012	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.807	2026-10-26 04:20:02.807	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
13	ip_13	กลไกกรีดฝักข้าวโพดอ่อนปรับความลึกอัตโนมัติ	อนุสิทธิบัตร	\N	\N	ศ.ดร.อนุพันธ์  เทอดวงศ์วรกุล	\N	AE	\N	0000013	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.809	2026-10-26 04:20:02.809	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
14	ip_14	กระบวนการก่อรูปแบบเมมเบรน อิเล็กโทรไลต์ชนิดเจลในเซลล์ อิเล็กโทรไลต์	อนุสิทธิบัตร	\N	\N	รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล	60	FE	\N	0000014	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.811	2026-10-26 04:20:02.811	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
15	ip_15	แผ่นแปะบรรเทาอาการโรคริดสีดวงทวาร	อนุสิทธิบัตร	\N	\N	รศ.กันต์ธกรณ์ เขาทอง	109	ME	\N	0000015	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.812	2026-10-26 04:20:02.812	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
16	ip_16	อุปกรณ์ไฟฟ้าช็อตที่มีค่ากระแสไฟฟ้าขาออกไม่เกินสองมิลลิแอมป์	อนุสิทธิบัตร	\N	\N	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	FE	\N	0000016	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.814	2026-10-26 04:20:02.814	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
17	ip_17	เครื่องทดสอบมุมกองวัสดุ	อนุสิทธิบัตร	\N	\N	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	ME	\N	0000017	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.817	2026-10-26 04:20:02.817	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
18	ip_18	เครื่องทดสอบค่าสัมประสิทธิ์ความเสียดทานสถิตระหว่างวัตถุกับพื้นผิว	อนุสิทธิบัตร	\N	\N	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	ME	\N	0000018	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.819	2026-10-26 04:20:02.819	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
19	ip_19	เครื่องทดสอบสัมประสิทธิ์การกระดอนของวัสดุ	อนุสิทธิบัตร	\N	\N	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	ME	\N	0000019	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.822	2026-10-26 04:20:02.822	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
20	ip_20	เครื่องทดลองวัดมุมกองเชิงพลวัตของวัสดุเม็ดในถังหมุนแบบผนังคลื่น	อนุสิทธิบัตร	\N	\N	ผศ.ดร.ปรีดา ปรากฏมาก	\N	ME	\N	0000020	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.824	2026-10-26 04:20:02.824	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
21	ip_21	กรรมวิธีการผลิต เพกทินชนิดเมทอกซิลต่ำโดยใช้กระบวนการอิเล็กโทรลิซิส	อนุสิทธิบัตร	\N	\N	รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล	60	FE	\N	0000021	\N	2024-10-01	2030-10-01	20000.00	เตรียมความพร้อมยื่นจด	\N	โครงการสนับสนุนเตรียมความพร้อมจดอนุสิทธิบัตร	2026-10-26 04:20:02.826	2026-10-26 04:20:02.826	มหาวิทยาลัยเกษตรศาสตร์	มหาวิทยาลัยเกษตรศาสตร์
\.


--
-- Data for Name: ip_departments; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.ip_departments (id, ip_id, department_code, other_name) FROM stdin;
1	1	CE	\N
2	1	CE	\N
3	1	FE	\N
4	2	AE	\N
5	3	FE	\N
6	4	AE	\N
7	5	AE	\N
8	6	CE	\N
9	7	AE	\N
10	7	AE	\N
11	8	AE	\N
12	8	AE	\N
13	9	AE	\N
14	10	AE	\N
15	11	AE	\N
16	12	ME	\N
17	13	AE	\N
18	14	FE	\N
19	15	ME	\N
20	16	FE	\N
21	17	ME	\N
22	18	ME	\N
23	19	ME	\N
24	20	ME	\N
25	21	FE	\N
\.


--
-- Data for Name: ip_inventors; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.ip_inventors (id, ip_id, person_name, personnel_id, is_lead) FROM stdin;
1	1	รศ.ดร.นันทวัฒน์ ขมหวาน	83	t
2	1	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	f
3	2	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	t
4	2	นายวิชัย หมอยาดี	\N	f
5	3	รศ.ดร.เชาว์ อินทร์ประสิทธิ์	\N	t
6	3	นางสาวพรพรรณ จิอู๋	\N	f
7	4	รศ.ดร. ศิวลักษณ์ ปฐวีรัตน์	8	t
8	5	รศ.ดร.วัชรพล ชยประเสริฐ	12	t
9	6	รศ.ดร.นันทวัฒน์ ขมหวาน	83	t
10	7	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	t
11	7	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	f
12	7	ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์	18	f
13	7	อ.ดร.ชัยยะ จันทรา	17	f
14	7	นายพงศ์พันธุ์  ปั้นมยุรา	\N	f
15	8	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	t
16	8	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	6	f
17	8	ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์	18	f
18	8	อ.ดร.ชัยยะ จันทรา	17	f
19	8	นายพงศ์พันธุ์  ปั้นมยุรา	\N	f
20	9	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	t
21	10	ภาควิชาวิศวกรรมเกษตร	\N	t
22	11	ภาควิชาวิศวกรรมเกษตร	\N	t
23	12	รศ.กันต์ธกรณ์ เขาทอง	109	t
24	13	ศ.ดร.อนุพันธ์  เทอดวงศ์วรกุล	\N	t
25	14	รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล	60	t
26	15	รศ.กันต์ธกรณ์ เขาทอง	109	t
27	16	รศ.ดร.เชาว์  อินทร์ประสิทธิ์	\N	t
28	17	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	t
29	18	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	t
30	19	ผศ.ดร.ปรีดา  ปรากฏมาก	\N	t
31	20	ผศ.ดร.ปรีดา ปรากฏมาก	\N	t
32	21	รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล	60	t
\.


--
-- Data for Name: kpi_option_lookups; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.kpi_option_lookups (id, field_key, value, label, is_custom, sort_order, created_at) FROM stdin;
1	collection_period	ปีงบประมาณ	ปีงบประมาณ	f	1	2026-11-08 00:00:12.39
2	collection_period	ปีการศึกษา	ปีการศึกษา	f	2	2026-11-08 00:00:12.39
3	collection_period	ปีปฏิทิน	ปีปฏิทิน	f	3	2026-11-08 00:00:12.39
4	collection_period	ภาคการศึกษา	ภาคการศึกษา	f	4	2026-11-08 00:00:12.39
5	collection_period	ไตรมาส	ไตรมาส	f	5	2026-11-08 00:00:12.39
6	value_type	จำนวนนับ	จำนวนนับ	f	1	2026-11-08 00:00:12.39
7	value_type	ร้อยละ	ร้อยละ	f	2	2026-11-08 00:00:12.39
8	value_type	ค่าเฉลี่ย	ค่าเฉลี่ย	f	3	2026-11-08 00:00:12.39
9	value_type	สัดส่วน A:B	สัดส่วน A:B	f	4	2026-11-08 00:00:12.39
10	value_type	จำนวนเงิน	จำนวนเงิน	f	5	2026-11-08 00:00:12.39
11	value_type	คะแนน	คะแนน	f	6	2026-11-08 00:00:12.39
12	value_type	ข้อความ/ระดับ	ข้อความ/ระดับ	f	7	2026-11-08 00:00:12.39
13	reporting_level	คณะ	คณะ	f	1	2026-11-08 00:00:12.39
14	reporting_level	ส่วนงาน	ส่วนงาน	f	2	2026-11-08 00:00:12.39
\.


--
-- Data for Name: kpi_reporting_rounds; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.kpi_reporting_rounds (id, name, start_date, end_date, due_date, is_cumulative, fiscal_year, sort_order, created_at, updated_at) FROM stdin;
round-6m	รอบ 6 เดือน	2025-10-01	2026-03-31	2026-04-10	t	2569	1	2026-11-08 00:00:12.39	2026-11-08 00:04:10.69
round-9m	รอบ 9 เดือน	2025-10-01	2026-07-31	2026-08-10	t	2569	2	2026-11-08 00:00:12.39	2026-11-08 00:04:10.693
\.


--
-- Data for Name: personnel; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.personnel (id, person_id, title_th, name_th, name_en, "position", department_code, email, created_at, updated_at, image_url, first_name, last_name) FROM stdin;
1	308	นาย	ฟหก	\N	ฟหก	CPE	asd@ku.th	2026-10-26 04:20:00.356	2026-10-26 04:20:00.356	\N	\N	\N
2	307	นาย	นาย ฟหก	\N	\N	CE	\N	2026-10-26 04:20:00.364	2026-10-26 04:20:00.364	\N	\N	\N
3	1	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	AE	fengcls@ku.ac.th	2026-10-26 04:20:00.367	2026-10-26 04:20:00.367	\N	\N	\N
4	2	ผศ.	ผศ.นงลักษณ์  เล็กรุ่งเรืองกิจ	\N	หัวหน้าภาค	AE	fengnllg@ku.ac.th	2026-10-26 04:20:00.368	2026-10-26 04:20:00.368	\N	\N	\N
5	3	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	AE	fengths@ku.ac.th	2026-10-26 04:20:00.369	2026-10-26 04:20:00.369	\N	\N	\N
6	4	ผศ.ดร.	ผศ.ดร.วันรัฐ  อับดุลลากาซิม	\N	ประธานหลักสูตร วศ.ม. (วิศวกรรมเกษตร) และประธานหลักสูตร วศ.ด. (วิศวกรรมเกษตร)	AE	fengwra@ku.ac.th	2026-10-26 04:20:00.37	2026-10-26 04:20:00.37	\N	\N	\N
7	5	รศ.ดร.	รศ.ดร.แก้วกานต์  พวงสมบัติ	\N	คณาจารย์/บุคลากร	AE	fengkkb@ku.ac.th	2026-10-26 04:20:00.371	2026-10-26 04:20:00.371	\N	\N	\N
8	6	รศ.ดร.	รศ.ดร. ศิวลักษณ์ ปฐวีรัตน์	\N	ประธานหลักสูตร วศ.บ. (วิศวกรรมวิศวกรรมนวัตกรรมเพื่อการเกษตรและอุตสาหกรรม)	AE	fengslp@ku.ac.th	2026-10-26 04:20:00.372	2026-10-26 04:20:00.372	\N	\N	\N
9	7	รศ.ดร.	รศ.ดร.สิรินาฏ  น้อยพิทักษ์	\N	คณาจารย์/บุคลากร	AE	fengsnn@ku.ac.th	2026-10-26 04:20:00.373	2026-10-26 04:20:00.373	\N	\N	\N
10	8	รศ.ดร.	รศ.ดร.ประเทือง อุษาบริสุทธิ์	\N	อาจารย์	AE	fengptu@ku.ac.th	2026-10-26 04:20:00.374	2026-10-26 04:20:00.374	\N	\N	\N
11	9	ผศ.	ผศ.ศุภชัย  กุลมุติวัฒน์	\N	อาจารย์	AE	fengsck@ku.ac.th	2026-10-26 04:20:00.375	2026-10-26 04:20:00.375	\N	\N	\N
12	10	รศ.ดร.	รศ.ดร.วัชรพล ชยประเสริฐ	\N	อาจารย์	AE	fengwpc@ku.ac.th	2026-10-26 04:20:00.376	2026-10-26 04:20:00.376	\N	\N	\N
13	11	ผศ.ดร.	ผศ.ดร.ศิริศักดิ์  เชิดเกียรติพล	\N	อาจารย์	AE	fengsrcp@ku.ac.th	2026-10-26 04:20:00.377	2026-10-26 04:20:00.377	\N	\N	\N
14	12	ผศ.ดร.	ผศ.ดร.ภวินท์  ธัญภัทรานนท์	\N	อาจารย์	AE	fengpwt@ku.ac.th	2026-10-26 04:20:00.377	2026-10-26 04:20:00.377	\N	\N	\N
15	13	รศ.ดร.	รศ.ดร.พิมพ์พรรณ  ปรืองาม	\N	อาจารย์	AE	fengpppn@ku.ac.th	2026-10-26 04:20:00.378	2026-10-26 04:20:00.378	\N	\N	\N
16	14	ผศ.ดร.	ผศ.ดร.อาทิตย์  พวงสมบัติ	\N	อาจารย์	AE	fengatp@ku.ac.th	2026-10-26 04:20:00.379	2026-10-26 04:20:00.379	\N	\N	\N
17	15	อ.	อ.ดร.ชัยยะ จันทรา	\N	อาจารย์	AE	fengcyj@ku.ac.th	2026-10-26 04:20:00.379	2026-10-26 04:20:00.379	\N	\N	\N
18	16	ผศ.ดร.	ผศ.ดร.วัชรชาญ สุขเจริญวิภารัตน์	\N	อาจารย์	AE	fengwhs@ku.ac.th	2026-10-26 04:20:00.38	2026-10-26 04:20:00.38	\N	\N	\N
19	17	นางสาว	นางสาวอรุณรัตน์ บุญปองหา	\N	ชำนาญการ	AE	fengndb@ku.ac.th	2026-10-26 04:20:00.38	2026-10-26 04:20:00.38	\N	\N	\N
20	18	นางสาว	นางสาวพีรดา แจ้งศรี	\N	ชำนาญการ	AE	fengpdj@ku.ac.th	2026-10-26 04:20:00.381	2026-10-26 04:20:00.381	\N	\N	\N
21	19	นางสาว	นางสาวรัตนาภรณ์ สระทองอ้อย	\N	เจ้าหน้าที่บริหารงานทั่วไป	AE	fengrosa@ku.ac.th	2026-10-26 04:20:00.382	2026-10-26 04:20:00.382	\N	\N	\N
22	20	นาย	นายภธร จันทรอุดม	\N	ปฏิบัติการ	AE	patara.jh@ku.th	2026-10-26 04:20:00.383	2026-10-26 04:20:00.383	\N	\N	\N
23	21	นาย	นายเจนวิทย์ จิตรใจเย็น	\N	ปฏิบัติการ	AE	janwit.ji@ku.th	2026-10-26 04:20:00.383	2026-10-26 04:20:00.383	\N	\N	\N
24	22	นาย	นายศักดา จันทร์ทอง	\N	ชำนาญงานพิเศษ	AE	fengsdc@ku.ac.th	2026-10-26 04:20:00.384	2026-10-26 04:20:00.384	\N	\N	\N
25	23	นาย	นายชัชวาล ตาก้อง	\N	ปฏิบัติงาน	AE	chatchawan.tak@ku.th	2026-10-26 04:20:00.385	2026-10-26 04:20:00.385	\N	\N	\N
26	24	นางสาว	นางสาวจักจั่น นาฟาง	\N	แม่บ้านประจำภาควิชา	AE	ไม่พบอีเมล	2026-10-26 04:20:00.385	2026-10-26 04:20:00.385	\N	\N	\N
27	25	นางสาว	นางสาวศิรประภา เชียงเงาะ	\N	แม่บ้านประจำภาควิชา	AE	fengths@ku.ac.th	2026-10-26 04:20:00.387	2026-10-26 04:20:00.387	\N	\N	\N
28	26	นาย	นายณัฐพล เสรีเผ่าวงษ์	\N	ปฏิบัติการ	IRE	fengnpse@ku.ac.th	2026-10-26 04:20:00.388	2026-10-26 04:20:00.388	\N	\N	\N
29	27	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	IRE	fengths@ku.ac.th	2026-10-26 04:20:00.388	2026-10-26 04:20:00.388	\N	\N	\N
30	28	ผศ.ดร.	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	\N	หัวหน้าภาควิชา	IRE	fengcpth@ku.ac.th	2026-10-26 04:20:00.389	2026-10-26 04:20:00.389	\N	\N	\N
31	29	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	IRE	fengcls@ku.ac.th	2026-10-26 04:20:00.39	2026-10-26 04:20:00.39	\N	\N	\N
32	30	นาย	นายแสง ทินวงษ์ปาน	\N	พนักงานทั่วไป	IRE	fengset@ku.ac.th	2026-10-26 04:20:00.391	2026-10-26 04:20:00.391	\N	\N	\N
33	31	ผศ.ดร.	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	\N	รองหัวหน้าภาควิชา	IRE	fengcpcc@ku.ac.th	2026-10-26 04:20:00.392	2026-10-26 04:20:00.392	\N	\N	\N
34	32	ผศ.ดร.	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	\N	รองหัวหน้าภาควิชา	IRE	songsak.pu@ku.ac.th	2026-10-26 04:20:00.392	2026-10-26 04:20:00.392	\N	\N	\N
35	33	รศ.ดร.	รศ.ดร.วราวุธ  วุฒิวณิชย์	\N	อาจารย์	IRE	fengvwv@ku.ac.th	2026-10-26 04:20:00.393	2026-10-26 04:20:00.393	\N	\N	\N
36	34	รศ.ดร.	รศ.ดร.บัญชา ขวัญยืน	\N	อาจารย์	IRE	fengbak@ku.ac.th	2026-10-26 04:20:00.394	2026-10-26 04:20:00.394	\N	\N	\N
37	35	รศ.ดร.	รศ.ดร.เอกสิทธิ์ โฆสิตสกุลชัย	\N	อาจารย์	IRE	fengesk@ku.ac.th	2026-10-26 04:20:00.395	2026-10-26 04:20:00.395	\N	\N	\N
38	36	รศ.ดร.	รศ.ดร.ชัยศรี สุขสาโรจน์	\N	อาจารย์	IRE	fengcss@ku.ac.th	2026-10-26 04:20:00.395	2026-10-26 04:20:00.395	\N	\N	\N
39	37	รศ.ดร.	รศ.ดร.สมชาย ดอนเจดีย์	\N	อาจารย์	IRE	fengscd@ku.ac.th	2026-10-26 04:20:00.396	2026-10-26 04:20:00.396	\N	\N	\N
40	38	รศ.ดร.	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	\N	อาจารย์	IRE	fengwwt@ku.ac.th	2026-10-26 04:20:00.397	2026-10-26 04:20:00.397	\N	\N	\N
41	39	ผศ.	ผศ.นิมิตร เฉิดฉันท์พิพัฒน์	\N	อาจารย์	IRE	fengnmc@ku.ac.th	2026-10-26 04:20:00.398	2026-10-26 04:20:00.398	\N	\N	\N
42	40	ผศ.ดร.	ผศ.ดร.นิธิรัชต์ สงวนเดือน	\N	อาจารย์	IRE	fengntr@ku.ac.th	2026-10-26 04:20:00.4	2026-10-26 04:20:00.4	\N	\N	\N
43	41	ผศ.ดร.	ผศ.ดร.จิระกานต์ ศิริวิชญ์ไมตรี	\N	อาจารย์	IRE	fengcrk@ku.ac.th	2026-10-26 04:20:00.401	2026-10-26 04:20:00.401	\N	\N	\N
44	42	ผศ.ดร.	ผศ.ดร.จุติเทพ วงษ์เพ็ชร์	\N	อาจารย์	IRE	fengjtv@ku.ac.th	2026-10-26 04:20:00.401	2026-10-26 04:20:00.401	\N	\N	\N
45	43	ผศ.ดร.	ผศ.ดร.เกศวรา สิทธิโชค	\N	อาจารย์	IRE	fengkrs@ku.ac.th	2026-10-26 04:20:00.402	2026-10-26 04:20:00.402	\N	\N	\N
46	44	ผศ.ดร.	ผศ.ดร.ศศิวิมล ขาวโกมล	\N	อาจารย์	IRE	fengsmk@ku.ac.th	2026-10-26 04:20:00.403	2026-10-26 04:20:00.403	\N	\N	\N
47	45	อ.	อ.ดร.ธัญดร ออกวะลา	\N	อาจารย์	IRE	fengtdo@ku.ac.th	2026-10-26 04:20:00.403	2026-10-26 04:20:00.403	\N	\N	\N
48	46	อ.	อ.พลเพชร สมานมิตร	\N	อาจารย์	IRE	fengpes@ku.ac.th	2026-10-26 04:20:00.404	2026-10-26 04:20:00.404	\N	\N	\N
49	47	นาย	นายเอนก ไกรรอด	\N	ปฏิบัติการ	IRE	fengankr@ku.ac.th	2026-10-26 04:20:00.405	2026-10-26 04:20:00.405	\N	\N	\N
50	48	นางสาว	นางสาวลักษณา ทรัพย์เย็น	\N	ชำนาญการ	IRE	fenglnn@ku.ac.th	2026-10-26 04:20:00.406	2026-10-26 04:20:00.406	\N	\N	\N
51	49	นางสาว	นางสาวสุกัญญา จำปาอ่อน	\N	ชำนาญการ	IRE	fengsnpi@ku.ac.th	2026-10-26 04:20:00.406	2026-10-26 04:20:00.406	\N	\N	\N
52	50	นางสาว	นางสาวณัฐธยาน์ นามอินทร์	\N	ปฏิบัติการ	IRE	fengnan@ku.ac.th	2026-10-26 04:20:00.407	2026-10-26 04:20:00.407	\N	\N	\N
53	51	นาย	นายธีรศักดิ์ ซ้ายอ่อน	\N	ปฏิบัติการ	IRE	fengtssa@ku.ac.th	2026-10-26 04:20:00.408	2026-10-26 04:20:00.408	\N	\N	\N
54	52	นางสาว	นางสาวสุภาพร  พัฒนแก้ว	\N	ปฏิบัติงาน	IRE	supaporn.patta@ku.th	2026-10-26 04:20:00.408	2026-10-26 04:20:00.408	\N	\N	\N
55	53	นาย	นายธนกร ทองดอนใหม่	\N	ปฏิบัติงาน	IRE	fengtot@ku.ac.th	2026-10-26 04:20:00.409	2026-10-26 04:20:00.409	\N	\N	\N
56	54	นาย	นายชรัตน์ แก่นประกอบ	\N	\N	IRE	fengcuk@ku.ac.th	2026-10-26 04:20:00.41	2026-10-26 04:20:00.41	\N	\N	\N
57	55	นางสาว	นางสาววนิดา สระทองพลอย	\N	ดูแลอาคารและสถานที่	IRE	ไม่พบอีเมล	2026-10-26 04:20:00.411	2026-10-26 04:20:00.411	\N	\N	\N
58	56	นาย	นายธนกร  แก่นประกอบ	\N	\N	IRE	ไม่พบอีเมล	2026-10-26 04:20:00.411	2026-10-26 04:20:00.411	\N	\N	\N
59	57	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	FE	fengths@ku.ac.th	2026-10-26 04:20:00.412	2026-10-26 04:20:00.412	\N	\N	\N
60	58	รศ.ดร.	รศ.ดร.กอบศักดิ์ กาญจนาพงศ์กุล	\N	หัวหน้าภาค	FE	fengkska@ku.ac.th	2026-10-26 04:20:00.413	2026-10-26 04:20:00.413	\N	\N	\N
61	59	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	FE	fengcls@ku.ac.th	2026-10-26 04:20:00.414	2026-10-26 04:20:00.414	\N	\N	\N
62	60	ผศ.ดร.	ผศ.ดร.วงศ์ผกา วงศ์รัตน์	\N	ประธานหลักสูตร ป.โท	FE	fengwkw@ku.ac.th	2026-10-26 04:20:00.414	2026-10-26 04:20:00.414	\N	\N	\N
63	61	อ.	อ.ดร.กฤษณันท์ มะลิทอง	\N	รองหัวหน้าภาค	FE	fengknma@ku.ac.th	2026-10-26 04:20:00.415	2026-10-26 04:20:00.415	\N	\N	\N
64	62	รศ.ดร.	รศ.ดร.รณฤทธิ์ ฤทธิรณ	\N	ประธานหลักสูตร ป.เอก	FE	fengror@ku.ac.th	2026-10-26 04:20:00.416	2026-10-26 04:20:00.416	\N	\N	\N
65	63	รศ.	รศ.อมรเดช พุทธิพิพัฒน์ขจร	\N	ประธานหลักสูตร ป.ตรี	FE	fengadp@ku.ac.th	2026-10-26 04:20:00.417	2026-10-26 04:20:00.417	\N	\N	\N
66	64	รศ.ดร.	รศ.ดร.สุกัญญา วิชชุกิจ	\N	อาจารย์	FE	fengskw@ku.ac.th	2026-10-26 04:20:00.418	2026-10-26 04:20:00.418	\N	\N	\N
67	65	ผศ.ดร.	ผศ.ดร.อังคณา อ.สุวรรณ	\N	อาจารย์	FE	fengaao@ku.ac.th	2026-10-26 04:20:00.419	2026-10-26 04:20:00.419	\N	\N	\N
68	66	ผศ.	ผศ.เมลดา เฟื่องฟู	\N	อาจารย์	FE	fengmdf@ku.ac.th	2026-10-26 04:20:00.42	2026-10-26 04:20:00.42	\N	\N	\N
69	67	อ.	อ.ธิติพงศ์ โพธิสุทธิ์	\N	อาจารย์	FE	fengttp@ku.ac.th	2026-10-26 04:20:00.42	2026-10-26 04:20:00.42	\N	\N	\N
70	68	อ.	อ.ดร.สยุมพร รัตนพันธ์	\N	อาจารย์	FE	fengsypr@ku.ac.th	2026-10-26 04:20:00.421	2026-10-26 04:20:00.421	\N	\N	\N
71	69	อ.	อ.ดร.กรณ์อัฐชญา วีณุตตรานนท์	\N	อาจารย์	FE	fengkav@ku.ac.th	2026-10-26 04:20:00.422	2026-10-26 04:20:00.422	\N	\N	\N
72	70	นางสาว	นางสาววันวิสาข์ ใจตรง	\N	เจ้าหน้าที่บริหารงานทั่วไป ชำนาญการ	FE	fengwsj@ku.ac.th	2026-10-26 04:20:00.423	2026-10-26 04:20:00.423	\N	\N	\N
73	71	นางสาว	นางสาววริศรา สมตน	\N	เจ้าหน้าที่บริหารงานทั่วไป	FE	fengwaso@ku.ac.th	2026-10-26 04:20:00.425	2026-10-26 04:20:00.425	\N	\N	\N
74	72	นางสาว	นางสาวคนิจฐา บุญเฟื่อง	\N	นักวิทยาศาสตร์ ชำนาญการ	FE	fengktb@ku.ac.th	2026-10-26 04:20:00.425	2026-10-26 04:20:00.425	\N	\N	\N
75	73	นาย	นายวุฒิชัย พูลลาภวิวัฒน์	\N	ช่างเทคนิค	FE	fengwcpw@ku.ac.th	2026-10-26 04:20:00.426	2026-10-26 04:20:00.426	\N	\N	\N
76	74	นาย	นายภูมิพัฒน์ โทจันทร์	\N	วิศวกรไฟฟ้า	FE	fengppt@ku.ac.th	2026-10-26 04:20:00.428	2026-10-26 04:20:00.428	\N	\N	\N
77	75	นาง	นางอุบล พรมชาติ	\N	พนักงานสถานที่	FE	fengobp@ku.ac.th	2026-10-26 04:20:00.429	2026-10-26 04:20:00.429	\N	\N	\N
78	76	รศ.ดร.	รศ.ดร.ปนัดดา กสิกิจวิวัฒน์	\N	หัวหน้าภาค	CE	fengpak@ku.ac.th	2026-10-26 04:20:00.43	2026-10-26 04:20:00.43	\N	\N	\N
79	77	ผศ.ดร.	ผศ.ดร.การันต์ คล้ายฉ่ำ	\N	รองหัวหน้าภาค และประธานหลักสูตรวิศวกรรมมหาบัณฑิต สาขาวิชาวิศวกรรมโยธา	CE	karun.kl@ku.ac.th	2026-10-26 04:20:00.431	2026-10-26 04:20:00.431	\N	\N	\N
80	78	ผศ.	ผศ.ชิษณุพงศ์ สุธัมมะ	\N	รองหัวหน้าภาค	CE	fengcpsu@ku.ac.th	2026-10-26 04:20:00.432	2026-10-26 04:20:00.432	\N	\N	\N
81	79	รศ.ดร.	รศ.ดร.วรากร ไม้เรียง	\N	ผู้ทรงคุณวุฒิพิเศษ	CE	fengwkm@ku.ac.th	2026-10-26 04:20:00.433	2026-10-26 04:20:00.433	\N	\N	\N
82	80	ผศ.ดร.	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	\N	ประธานหลักสูตรวิศวกรรมศาสตรดุษฎีบัณฑิต สาขาวิชาวิศวกรรมโยธา	CE	fengppcs@ku.ac.th	2026-10-26 04:20:00.435	2026-10-26 04:20:00.435	\N	\N	\N
83	81	รศ.ดร.	รศ.ดร.นันทวัฒน์ ขมหวาน	\N	ประธานหลักสูตรวิศวกรรมศาสตรบัณฑิตสาขาวิศวกรรมโยธา-โครงสร้างพื้นฐาน	CE	fengnwk@ku.ac.th	2026-10-26 04:20:00.436	2026-10-26 04:20:00.436	\N	\N	\N
84	82	ผศ.ดร.	ผศ.ดร.สมชาย ประยงค์พันธ์	\N	อาจารย์	CE	fengscpp@ku.ac.th	2026-10-26 04:20:00.437	2026-10-26 04:20:00.437	\N	\N	\N
85	83	ผศ.	ผศ.พงษ์ภวัลย์ ภัทรประภานันท์	\N	อาจารย์	CE	fengpwp@ku.ac.th	2026-10-26 04:20:00.437	2026-10-26 04:20:00.437	\N	\N	\N
86	84	รศ.ดร.	รศ.ดร.กมล อมรฟ้า	\N	อาจารย์	CE	fengkma@ku.ac.th	2026-10-26 04:20:00.438	2026-10-26 04:20:00.438	\N	\N	\N
87	85	รศ.	รศ.บรรพต กุลสุวรรณ	\N	อาจารย์	CE	fengbpk@ku.ac.th	2026-10-26 04:20:00.439	2026-10-26 04:20:00.439	\N	\N	\N
88	86	รศ.ดร.	รศ.ดร.สิรัญญา ทองชาติ	\N	อาจารย์	CE	fengsytc@ku.ac.th	2026-10-26 04:20:00.439	2026-10-26 04:20:00.439	\N	\N	\N
89	87	รศ.ดร.	รศ.ดร.นิภาวรรณ กุลสุวรรณ	\N	อาจารย์	CE	fengpnpw@ku.ac.th	2026-10-26 04:20:00.44	2026-10-26 04:20:00.44	\N	\N	\N
90	88	รศ.	รศ.กฤษณะ จันทรโชติ	\N	อาจารย์	CE	fengknj@ku.ac.th	2026-10-26 04:20:00.441	2026-10-26 04:20:00.441	\N	\N	\N
91	89	ดร.	ดร.ปาณิศา แสงแก้ว	\N	อาจารย์	CE	fengpis@ku.ac.th	2026-10-26 04:20:00.441	2026-10-26 04:20:00.441	\N	\N	\N
92	90	นาย	นายอนุพนธ์ แต่สกุล	\N	ปฏิบัติการ	CE	anupon.t@ku.ac.th	2026-10-26 04:20:00.442	2026-10-26 04:20:00.442	\N	\N	\N
93	91	นาย	นายพนาฤทธิ์ จันทร์ทอง	\N	ปฏิบัติการ	CE	fengprch@ku.ac.th	2026-10-26 04:20:00.443	2026-10-26 04:20:00.443	\N	\N	\N
94	92	นางสาว	นางสาวกัลยรัตน์ เอกจีน	\N	ปฏิบัติการ	CE	kanyarat.eakj@ku.th	2026-10-26 04:20:00.444	2026-10-26 04:20:00.444	\N	\N	\N
95	93	นางสาว	นางสาวศุทธศรี นราลักษณ์	\N	ปฏิบัติการ	CE	suttasri.na@ku.th	2026-10-26 04:20:00.444	2026-10-26 04:20:00.444	\N	\N	\N
96	94	นางสาว	นางสาวสุปราณี ปุยะพันธ์	\N	ชำนาญการ	CE	fengspn@ku.ac.th	2026-10-26 04:20:00.445	2026-10-26 04:20:00.445	\N	\N	\N
97	95	นางสาว	นางสาวฐิราภร สมรรถนาวิน	\N	ชำนาญการ	CE	fengsmr@ku.ac.th	2026-10-26 04:20:00.446	2026-10-26 04:20:00.446	\N	\N	\N
98	96	นางสาว	นางสาวศรีวรรณ น่วมปฐม	\N	ปฏิบัติการ	CE	fengswn@ku.ac.th	2026-10-26 04:20:00.446	2026-10-26 04:20:00.446	\N	\N	\N
99	97	นางสาว	นางสาวจิราวรรณ กลับวิหค	\N	ปฏิบัติการ	CE	fengcwki@ku.ac.th	2026-10-26 04:20:00.447	2026-10-26 04:20:00.447	\N	\N	\N
100	98	นางสาว	นางสาววิลัย ปู่น้อย	\N	ปฏิบัติงาน	CE	fengwlp@ku.ac.th	2026-10-26 04:20:00.448	2026-10-26 04:20:00.448	\N	\N	\N
101	99	ผศ.ดร.	ผศ.ดร.จีรชัย สุภาสุทธากูล	\N	หัวหน้าภาค	ME	fengjcs@ku.ac.th	2026-10-26 04:20:00.448	2026-10-26 04:20:00.448	\N	\N	\N
102	100	ผศ.ดร.	ผศ.ดร.ณัฐดนัย ตัณฑวิรุฬห์	\N	และประธานหลักสูตร วศ.ม. (วิศวกรรมเครื่องกล-พลังงาน)	ME	fengndn@ku.ac.th	2026-10-26 04:20:00.449	2026-10-26 04:20:00.449	\N	\N	\N
103	101	ผศ.	ผศ.สวัสดิ์ ภูมิสวัสดิ์	\N	และประธานโครงการหลักสูตรวิศวกรรมเครื่องกล (ภาคพิเศษ)	ME	fengswp@ku.ac.th	2026-10-26 04:20:00.45	2026-10-26 04:20:00.45	\N	\N	\N
104	102	ผศ.ดร.	ผศ.ดร.ชนมน จันทนา	\N	อาจารย์	ME	fengcnm@ku.ac.th	2026-10-26 04:20:00.451	2026-10-26 04:20:00.451	\N	\N	\N
105	103	ผศ.ดร.	ผศ.ดร.ธนา ชีพสมทรง	\N	อาจารย์	ME	fengtnc@ku.ac.th	2026-10-26 04:20:00.452	2026-10-26 04:20:00.452	\N	\N	\N
106	104	ผศ.ดร.	ผศ.ดร.หทัยเทพ วงศ์สุวรรณ	\N	อาจารย์	ME	fenghtw@ku.ac.th	2026-10-26 04:20:00.452	2026-10-26 04:20:00.452	\N	\N	\N
107	105	รศ.ดร.	รศ.ดร.เบญญา กสานติกุล	\N	ประธานหลักสูตร วศ.บ. (วิศวกรรมเครื่องกล)	ME	fengbyk@ku.ac.th	2026-10-26 04:20:00.454	2026-10-26 04:20:00.454	\N	\N	\N
108	106	รศ.	รศ.วิจิตรา ภูมิสวัสดิ์	\N	อาจารย์	ME	fengwth@ku.ac.th	2026-10-26 04:20:00.454	2026-10-26 04:20:00.454	\N	\N	\N
109	107	รศ.	รศ.กันต์ธกรณ์ เขาทอง	\N	อาจารย์	ME	fengkkk@ku.ac.th	2026-10-26 04:20:00.456	2026-10-26 04:20:00.456	\N	\N	\N
110	108	ผศ.ดร.	ผศ.ดร.วัชมา โพธิ์ทอง	\N	อาจารย์	ME	fengwmp@ku.ac.th	2026-10-26 04:20:00.457	2026-10-26 04:20:00.457	\N	\N	\N
111	109	ผศ.	ผศ.วรพจน์ ศตเดชากุล	\N	อาจารย์	ME	fengwpsk@ku.ac.th	2026-10-26 04:20:00.458	2026-10-26 04:20:00.458	\N	\N	\N
112	110	รศ.ดร.	รศ.ดร.ปรีดา ปรากฏมาก	\N	อาจารย์	ME	fengpdpr@ku.ac.th	2026-10-26 04:20:00.459	2026-10-26 04:20:00.459	\N	\N	\N
113	111	ผศ.ดร.	ผศ.ดร.คมกฤษณ์ ชัยโย	\N	อาจารย์	ME	fengkrc@ku.ac.th	2026-10-26 04:20:00.46	2026-10-26 04:20:00.46	\N	\N	\N
114	112	อ.	อ.ดร.ณัฐพงษ์ สุขสบาย	\N	อาจารย์	ME	nattapong.s@ku.ac.th	2026-10-26 04:20:00.461	2026-10-26 04:20:00.461	\N	\N	\N
115	113	นาย	นายเอนก ไกรรอด	\N	นักวิทยาศาสตร์	ME	fengankr@ku.ac.th	2026-10-26 04:20:00.462	2026-10-26 04:20:00.462	\N	\N	\N
116	114	นาย	นายมานิตย์ รุ่งสว่าง	\N	ช่างเทคนิค	ME	fengmnr@ku.ac.th	2026-10-26 04:20:00.462	2026-10-26 04:20:00.462	\N	\N	\N
117	115	นาง	นางสมบูรณ์   พรมชาติ	\N	เจ้าหน้าที่บริหารงานทั่วไป	ME	fengsbc@ku.ac.th	2026-10-26 04:20:00.463	2026-10-26 04:20:00.463	\N	\N	\N
118	116	นางสาว	นางสาววราพร คล้ายพลอย	\N	เจ้าหน้าที่บริหารงานทั่วไป	ME	fengwpkl@ku.ac.th	2026-10-26 04:20:00.464	2026-10-26 04:20:00.464	\N	\N	\N
119	117	นาง	นางรัชชานนท์ ชูราศรี	\N	พนักงานสถานที่	ME	fengrnc@ku.ac.th	2026-10-26 04:20:00.465	2026-10-26 04:20:00.465	\N	\N	\N
120	118	นาย	นายสุทิน พรมชาติ	\N	ช่างเทคนิค	ME	fengstpc@ku.ac.th	2026-10-26 04:20:00.466	2026-10-26 04:20:00.466	\N	\N	\N
121	119	นางสาว	นางสาวสุนิสา จ้อยร่อย	\N	เจ้าหน้าที่บริหารงานทั่วไป	ME	fengssj@ku.ac.th	2026-10-26 04:20:00.467	2026-10-26 04:20:00.467	\N	\N	\N
122	120	นาย	นายศักดิ์สิทธิ์ ช้างเยาว์	\N	ช่างเทคนิค	ME	fengssch@ku.ac.th	2026-10-26 04:20:00.467	2026-10-26 04:20:00.467	\N	\N	\N
123	121	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	IE	fengths@ku.ac.th	2026-10-26 04:20:00.469	2026-10-26 04:20:00.469	\N	\N	\N
124	122	ผศ.ดร.	ผศ.ดร.อธิวัฒน์ บุญมี	\N	หัวหน้าภาค	IE	fengawbo@ku.ac.th	2026-10-26 04:20:00.469	2026-10-26 04:20:00.469	\N	\N	\N
125	123	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	IE	fengcls@ku.ac.th	2026-10-26 04:20:00.47	2026-10-26 04:20:00.47	\N	\N	\N
126	124	รศ.ดร.	รศ.ดร.พีรยุทธ์ ชาญเศรษฐิกุล	\N	ผู้ทรงคุณวุฒิพิเศษ	IE	@ku.ac.th	2026-10-26 04:20:00.47	2026-10-26 04:20:00.47	\N	\N	\N
127	125	ผศ.ดร.	ผศ.ดร.จิรเกียรติ ทรายทอง	\N	รองหัวหน้าภาค	IE	chirakiat.s@ku.th	2026-10-26 04:20:00.473	2026-10-26 04:20:00.473	\N	\N	\N
128	126	ผศ.	ผศ.ปริญญา พัฒนวสันต์พร	\N	อาจารย์	IE	fengpypa@ku.ac.th	2026-10-26 04:20:00.474	2026-10-26 04:20:00.474	\N	\N	\N
129	127	ผศ.ดร.	ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ	\N	อาจารย์	IE	fengckl@ku.ac.th	2026-10-26 04:20:00.475	2026-10-26 04:20:00.475	\N	\N	\N
130	128	ผศ.ดร.	ผศ.ดร.อณจ ชัยมณี	\N	อาจารย์	IE	fenganc@ku.ac.th	2026-10-26 04:20:00.476	2026-10-26 04:20:00.476	\N	\N	\N
131	129	ผศ.ดร.	ผศ.ดร.ภัทรพงษ์ ภาคภูมิ	\N	อาจารย์	IE	fengpppa@ku.ac.th	2026-10-26 04:20:00.476	2026-10-26 04:20:00.476	\N	\N	\N
132	130	รศ.ดร.	รศ.ดร.ศศรส ใจจิตร์	\N	อาจารย์	IE	sasarose.j@ku.th	2026-10-26 04:20:00.477	2026-10-26 04:20:00.477	\N	\N	\N
133	131	อ.	อ.ดร.ปริญญา กวีกิจบัณฑิต	\N	อาจารย์	IE	fengpnka@ku.ac.th	2026-10-26 04:20:00.478	2026-10-26 04:20:00.478	\N	\N	\N
134	132	ผศ.ดร.	ผศ.ดร.วรญา เนื่องมัจฉา	\N	อาจารย์	IE	fengwyn@ku.ac.th	2026-10-26 04:20:00.478	2026-10-26 04:20:00.478	\N	\N	\N
135	133	นางสาว	นางสาวกรชนก กระจ่างเย่า	\N	ปฏิบัติการ	IE	fengknkr@ku.ac.th	2026-10-26 04:20:00.479	2026-10-26 04:20:00.479	\N	\N	\N
136	134	นางสาว	นางสาววิลาสินี แจ้งกระจ่าง	\N	ปฏิบัติการ	IE	wilasinee.jang@ku.ac.th	2026-10-26 04:20:00.48	2026-10-26 04:20:00.48	\N	\N	\N
137	135	นางสาว	นางสาวภัคจิรา สุขเกตุ	\N	ชำนาญการ	IE	fengpjr@ku.ac.th	2026-10-26 04:20:00.48	2026-10-26 04:20:00.48	\N	\N	\N
138	136	นางสาว	นางสาวอัธยา พลายภู่	\N	ปฏิบัติการ	IE	fengayp@ku.ac.th	2026-10-26 04:20:00.481	2026-10-26 04:20:00.481	\N	\N	\N
139	137	นาย	นายแสน เทพมาลาพันธ์ศิริ	\N	ปฏิบัติงาน	IE	san.t@ku.ac.th	2026-10-26 04:20:00.482	2026-10-26 04:20:00.482	\N	\N	\N
140	138	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	CPE	fengths@ku.ac.th	2026-10-26 04:20:00.483	2026-10-26 04:20:00.483	\N	\N	\N
141	139	ผศ.ดร.	ผศ.ดร.วรัญญา อรรถเสนา	\N	หัวหน้าภาควิชา	CPE	fengvry@ku.ac.th	2026-10-26 04:20:00.484	2026-10-26 04:20:00.484	\N	\N	\N
142	140	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	CPE	fengcls@ku.ac.th	2026-10-26 04:20:00.487	2026-10-26 04:20:00.487	\N	\N	\N
143	141	ผศ.ดร.	ผศ.ดร.พิเชษฐ์ สืบสายพรหม	\N	รองหัวหน้าภาควิชา	CPE	fengpcsu@ku.ac.th	2026-10-26 04:20:00.488	2026-10-26 04:20:00.488	\N	\N	\N
144	142	อ.	อ.ร้อยโทอนุมัติ อิงคนินันท์	\N	ประธานโครงการหลักสูตร ป.ตรี	CPE	fengame@ku.ac.th	2026-10-26 04:20:00.49	2026-10-26 04:20:00.49	\N	\N	\N
145	143	ผศ.ดร.	ผศ.ดร.บุญรัตน์ เผดิมรอด	\N	ประธานหลักสูตร ป.ตรี	CPE	fengbyr@ku.ac.th	2026-10-26 04:20:00.49	2026-10-26 04:20:00.49	\N	\N	\N
146	144	รศ.ดร.	รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร	\N	ประธานหลักสูตร ป.โท	CPE	fengarp@ku.ac.th	2026-10-26 04:20:00.491	2026-10-26 04:20:00.491	\N	\N	\N
147	145	ผศ.ดร.	ผศ.ดร.จักกริช พฤษการ	\N	อาจารย์	CPE	fengckp@ku.ac.th	2026-10-26 04:20:00.492	2026-10-26 04:20:00.492	\N	\N	\N
148	146	รศ.ดร.	รศ.ดร.ฐิติพงษ์ สถิรเมธีกุล	\N	อาจารย์	CPE	thitipong.s@ku.ac.th	2026-10-26 04:20:00.493	2026-10-26 04:20:00.493	\N	\N	\N
149	147	ผศ.ดร.	ผศ.ดร.เสกสรรค์ มธุลาภรังสรรค์	\N	อาจารย์	CPE	fengssmt@ku.ac.th	2026-10-26 04:20:00.495	2026-10-26 04:20:00.495	\N	\N	\N
150	148	ผศ.ดร.	ผศ.ดร.ดวงเพ็ญ เจตน์พิพัฒนพงษ์	\N	อาจารย์	CPE	fengdpj@ku.ac.th	2026-10-26 04:20:00.497	2026-10-26 04:20:00.497	\N	\N	\N
151	149	ผศ.ดร.	ผศ.ดร.ศิวดล เสถียรพัฒนากูล	\N	อาจารย์	CPE	fengsds@ku.ac.th	2026-10-26 04:20:00.499	2026-10-26 04:20:00.499	\N	\N	\N
152	150	ผศ.ดร.	ผศ.ดร.กายรัฐ เจริญราษฎร์	\N	อาจารย์	CPE	fengkrj@ku.ac.th	2026-10-26 04:20:00.5	2026-10-26 04:20:00.5	\N	\N	\N
153	151	อ.	อ.พฤษพล ตั้งสัจจะธรรม	\N	อาจารย์	CPE	pruetsaphon.t@ku.th	2026-10-26 04:20:00.502	2026-10-26 04:20:00.502	\N	\N	\N
154	152	อ.	อ.ธีรวัฒน์ หวายฤทธิ์	\N	อาจารย์	CPE	theerawat.wha@ku.th	2026-10-26 04:20:00.505	2026-10-26 04:20:00.505	\N	\N	\N
155	153	นางสาว	นางสาวจุฑาทิพย์ ทรัพย์ฤทธา	\N	เจ้าหน้าที่บริหารงานทั่วไปชำนาญการ	CPE	fengjts@ku.ac.th	2026-10-26 04:20:00.507	2026-10-26 04:20:00.507	\N	\N	\N
156	154	นางสาว	นางสาวมณฑิชา กิจสมสาตร์	\N	เจ้าหน้าที่บริหารงานทั่วไปปฎิบัติการ	CPE	fengmcn@ku.ac.th	2026-10-26 04:20:00.508	2026-10-26 04:20:00.508	\N	\N	\N
157	155	นาย	นายเอกลักษณ์ เรืองศรี	\N	วิศวกรชำนาญการ	CPE	fengalr@ku.ac.th	2026-10-26 04:20:00.509	2026-10-26 04:20:00.509	\N	\N	\N
158	156	นาย	นายวรธนัท เกตุศิริ	\N	นักวิชาการคอมพิวเตอร์ปฏิบัติการ	CPE	fengsok@ku.ac.th	2026-10-26 04:20:00.509	2026-10-26 04:20:00.509	\N	\N	\N
159	157	นางสาว	นางสาวนนิฌา วงศ์รสกร	\N	นักวิชาการคอมพิวเตอร์ปฏิบัติการ	CPE	fengncw@ku.ac.th	2026-10-26 04:20:00.51	2026-10-26 04:20:00.51	\N	\N	\N
160	158	นางสาว	นางสาวสุพัตรา ทองดอนแป้น	\N	แม่บ้าน	CPE	ไม่พบอีเมล	2026-10-26 04:20:00.512	2026-10-26 04:20:00.512	\N	\N	\N
161	159	ผศ.	ผศ.บุญมา ป้านประดิษฐ์	\N	ที่ปรึกษาศูนย์	EEEC	fengbop@ku.ac.th	2026-10-26 04:20:00.513	2026-10-26 04:20:00.513	\N	\N	\N
162	160	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	EEEC	fengths@ku.ac.th	2026-10-26 04:20:00.514	2026-10-26 04:20:00.514	\N	\N	\N
163	161	นาย	นายอำพล ชุมเปีย	\N	ที่ปรึกษาศูนย์	EEEC	ไม่พบอีเมล	2026-10-26 04:20:00.514	2026-10-26 04:20:00.514	\N	\N	\N
164	162	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	EEEC	fengcls@ku.ac.th	2026-10-26 04:20:00.515	2026-10-26 04:20:00.515	\N	\N	\N
165	163	รศ.ดร.	รศ.ดร.สมชาย ดอนเจดีย์	\N	รักษาการแทนหัวหน้าศูนย์	EEEC	fengscd@ku.ac.th	2026-10-26 04:20:00.516	2026-10-26 04:20:00.516	\N	\N	\N
166	164	นาย	นายอรรถวุทธิ์ รื่นเริงใจ	\N	ชำนาญการ	EEEC	fengavr@ku.ac.th	2026-10-26 04:20:00.517	2026-10-26 04:20:00.517	\N	\N	\N
167	165	นาง	นางเนตรนภา วิชานงค์	\N	ชำนาญการ	EEEC	fengnpv@ku.ac.th	2026-10-26 04:20:00.518	2026-10-26 04:20:00.518	\N	\N	\N
168	166	นาย	นายรัตนศักดิ์ ทรัพย์เย็น	\N	ปฏิบัติการ	EEEC	fengrssa@ku.ac.th	2026-10-26 04:20:00.519	2026-10-26 04:20:00.519	\N	\N	\N
169	167	นาย	นายภัทรพล ชูราศรี	\N	ปฏิบัติงาน	EEEC	fengppc@ku.ac.th	2026-10-26 04:20:00.52	2026-10-26 04:20:00.52	\N	\N	\N
170	168	นาย	นายสมเกียรติ อิ่มจันทร์	\N	ช่างฝีมือโรงงาน	EEEC	fengsii@ku.ac.th	2026-10-26 04:20:00.52	2026-10-26 04:20:00.52	\N	\N	\N
171	169	นาง	นางณีรนุช ยอดเพชร	\N	พนักงานสถานที่	EEEC	fengnrn@ku.ac.th	2026-10-26 04:20:00.521	2026-10-26 04:20:00.521	\N	\N	\N
172	170	นาย	นายเจษฎาพร ด้วงแก้ว	\N	พนักงานทั่วไป	EEEC	fengjhd@ku.ac.th	2026-10-26 04:20:00.522	2026-10-26 04:20:00.522	\N	\N	\N
173	171	นางสาว	นางสาวอทิตยา แผ้วไพบูลย์	\N	พนักงานธุรการ	EEEC	ไม่พบอีเมล	2026-10-26 04:20:00.522	2026-10-26 04:20:00.522	\N	\N	\N
174	172	ผศ.ดร.	ผศ.ดร.สุวรรณ หอมหวล	\N	ที่ปรึกษา	DWT	fengswh@ku.ac.th	2026-10-26 04:20:00.523	2026-10-26 04:20:00.523	\N	\N	\N
175	173	ผศ.ดร.	ผศ.ดร.วัชมา โพธิ์ทอง	\N	หัวหน้าศูนย์	DWT	fengwmp@ku.ac.th	2026-10-26 04:20:00.524	2026-10-26 04:20:00.524	\N	\N	\N
176	174	ผศ.ดร.	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	\N	รองหัวหน้าศูนย์	DWT	fengsrcp@ku.ac.th	2026-10-26 04:20:00.524	2026-10-26 04:20:00.524	\N	\N	\N
177	175	นางสาว	นางสาวปรารถนา ชุมพงศ์	\N	ผู้ปฏิบัติงานบริหาร	DWT	fengpnc@ku.ac.th	2026-10-26 04:20:00.525	2026-10-26 04:20:00.525	\N	\N	\N
178	176	นาย	นายพลากร จาดปลื้ม	\N	ช่างเทคนิค	DWT	fengplkj@ku.ac.th	2026-10-26 04:20:00.526	2026-10-26 04:20:00.526	\N	\N	\N
179	177	นาย	นายคมกฤช  ตั้งเพียร	\N	ช่างเทคนิค	DWT	fengkrta@ku.ac.th	2026-10-26 04:20:00.526	2026-10-26 04:20:00.526	\N	\N	\N
180	178	นาย	นายสุชาติ จตุรพิธพร	\N	คณาจารย์/บุคลากร	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.527	2026-10-26 04:20:00.527	\N	\N	\N
181	179	นาย	นายชัยภัค ภัทรจินดา	\N	ผู้ทรงคุณวุฒิอิสระ	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.528	2026-10-26 04:20:00.528	\N	\N	\N
182	180	นาย	นายสุเทพ วัฒนศัพท์	\N	ผู้แทนสานักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.528	2026-10-26 04:20:00.528	\N	\N	\N
183	181	นาย	นายทรงพล นพคุณ	\N	ผู้แทนสมาคมการค้าผู้ประกอบการอลูมิเนียมและกระจกไทย	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.529	2026-10-26 04:20:00.529	\N	\N	\N
184	182	นาย	นายธนวัฒน์ มงคลอดิสัย	\N	ผู้แทนบริษัท พฤกษา เรียลเอสเต็ท จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.53	2026-10-26 04:20:00.53	\N	\N	\N
185	183	นาย	นายธนา รัตนนาคินทร์	\N	ผู้แทนบริษัท ทวีมงคลก่อสร้าง (2000) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.531	2026-10-26 04:20:00.531	\N	\N	\N
186	184	นาย	นายวรพจน์ สุดสงวน	\N	ผู้แทนบริษัท สโตนเฮ้นจ์ อินเตอร์ จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.531	2026-10-26 04:20:00.531	\N	\N	\N
187	185	นาย	นายชูเกียรติ ธนะฤกษ์	\N	ผู้แทนบริษัท สี่พระยาก่อสร้าง จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.532	2026-10-26 04:20:00.532	\N	\N	\N
188	186	นาย	นายชูเกียรติ กันฉาย	\N	ผู้แทนบริษัท ไทย-ออสท์ อะลูมิเนียม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.533	2026-10-26 04:20:00.533	\N	\N	\N
189	187	นาย	นายมานิตย์ ศรีแสงสังข์	\N	ผู้แทนบริษัท เรโปรเฮ้าส์ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.534	2026-10-26 04:20:00.534	\N	\N	\N
190	188	นาย	นายณัฐธพงษ์ ประสิทธิ์เดชสกุล	\N	ผู้แทนบริษัท โอ อาร์ เอ็ม อลูมิเนียม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.535	2026-10-26 04:20:00.535	\N	\N	\N
191	189	นางสาว	นางสาวน้าผึ้ง บุตรดีวงษ์	\N	ผู้แทนบริษัท วินเซท อลูมิเนียม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.539	2026-10-26 04:20:00.539	\N	\N	\N
192	190	นาย	นายวัชมา โพธิ์ทอง	\N	ผู้แทนมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.539	2026-10-26 04:20:00.539	\N	\N	\N
193	191	นาย	นายอิทธิพล บารมีเกรียงไกร	\N	ผู้แทนสำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.54	2026-10-26 04:20:00.54	\N	\N	\N
194	192	นาย	นายสุภัทร์ รัตนะโสภณชัย	\N	ผู้แทนสมาคมการค้าผู้ประกอบการอลูมิเนียมและกระจกไทย	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.542	2026-10-26 04:20:00.542	\N	\N	\N
195	193	นางสาว	นางสาวพันธ์ทิพย์ เวงคกุล	\N	ผู้แทนบริษัท พฤกษา เรียลเอสเต็ท จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.542	2026-10-26 04:20:00.542	\N	\N	\N
196	194	นาย	นายวีรพงษ์ รักอักษร	\N	ผู้แทนบริษัท มีนบุรีรับสร้างบ้าน (2019) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.543	2026-10-26 04:20:00.543	\N	\N	\N
197	195	นาย	นายฉัตรชาย จิตรสายธาร	\N	ผู้แทนบริษัท ศุภาลัย จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.544	2026-10-26 04:20:00.544	\N	\N	\N
198	196	นางสาว	นางสาวสฤกกา พงษ์สุวรรณ	\N	ผู้แทนบริษัท ซันเคียว โฮม (ไทยแลนด์) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.544	2026-10-26 04:20:00.544	\N	\N	\N
199	197	นาง	นางชริตา คอนเอม	\N	ผู้แทนบริษัท แม็กโนเลีย ควอลิตี้ ดิเวล็อปเม้นท์ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.545	2026-10-26 04:20:00.545	\N	\N	\N
200	198	นาย	นายพงศธร ไตรวิทยาศิลย์	\N	ผู้แทนบริษัท โกลด์สตาร์เม็ททอล จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.546	2026-10-26 04:20:00.546	\N	\N	\N
201	199	นาย	นายธีระพล อินทร	\N	ผู้แทนบริษัท เคเอส แมนูแฟคทอรี่ (1991) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.547	2026-10-26 04:20:00.547	\N	\N	\N
202	200	นาย	นายคมสัน พิสุทธอานนท์	\N	ผู้แทนบริษัท ซี.เอ็น. โปรเกรส อินเตอร์ กรุ๊ป จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.548	2026-10-26 04:20:00.548	\N	\N	\N
203	201	นาย	นายพิพัฒน์ โกวิทคณิต	\N	ผู้แทนบริษัท อลูเม็ท จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.549	2026-10-26 04:20:00.549	\N	\N	\N
204	202	นาย	นาย อาศิรวรรธน์ โพธิพันธุ์	\N	มหาวิทยาลัยเกษตรศาสตร์	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.55	2026-10-26 04:20:00.55	\N	\N	\N
205	203	นาง	นาง จิราวดี  พิพัฒนาทรกุล	\N	สำนักงานมาตรฐานผลิตภัณฑ์อุตสหกรรม	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.55	2026-10-26 04:20:00.55	\N	\N	\N
206	204	นาย	นาย บูรณินทุ์ กัมผลพันธุ์	\N	สมาคมอาเซียน ไวนิล เคาน์ซิล	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.552	2026-10-26 04:20:00.552	\N	\N	\N
207	205	นาย	นาย ณรงค์ฤทธิ์  ศรีลาพัฒน์	\N	สมาคมอาเซียน ไวนิล เคาน์ซิล	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.552	2026-10-26 04:20:00.552	\N	\N	\N
208	206	นาย	นาย อดิศร แสงสุข	\N	พส์เบอร์ก จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.554	2026-10-26 04:20:00.554	\N	\N	\N
209	207	นางสาว	นางสาว นวลอนงค์ เมธาพิพัฒน์กุล	\N	บริษัท นวพลาสติกอุตสาหกรรม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.555	2026-10-26 04:20:00.555	\N	\N	\N
210	208	นาย	นาย อิทธิชัย โรจนนิรันด์กิจ	\N	บริษัท ดีคอยนิค (ประเทศไทย) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.556	2026-10-26 04:20:00.556	\N	\N	\N
211	209	นาย	นาย ธนินทร์ รัตนศิริวิไล	\N	บริษัท บางกอก พีวีซี จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.557	2026-10-26 04:20:00.557	\N	\N	\N
212	210	นาย	นาย สาธิต ศักดิ์พรรณทรู	\N	บริษัท วินโดว์เอเชีย จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.558	2026-10-26 04:20:00.558	\N	\N	\N
213	211	นาย	นาย ตวง ตัณฑเศรษฐี	\N	บริษัท เอ อี เอเชีย จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.559	2026-10-26 04:20:00.559	\N	\N	\N
214	212	นาย	นาย สุนัย ปั้นมีรส	\N	ผู้ออกแบบอิสระ	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.559	2026-10-26 04:20:00.559	\N	\N	\N
215	213	นาย	นาย วีรพงษ์ รักอักษร	\N	บริษัท แม็กโนเลีย ควอลิตี้ ดิเวล็อปเม้นท์ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.56	2026-10-26 04:20:00.56	\N	\N	\N
216	214	นาย	นาย อรุณวัฏ รัตนศึกษา	\N	บริษัท ศุภาลัย จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.561	2026-10-26 04:20:00.561	\N	\N	\N
217	215	นาย	นาย ชัยพร ควนวิไล	\N	บริษัท แสนสิริ จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.561	2026-10-26 04:20:00.561	\N	\N	\N
218	216	นาย	นายอาศิรวรรธน์  โพธิพันธุ์	\N	ผู้แทนคณะสถาปัตยกรรมศาสตร์ มหาวิทยาลัยเกษตรศาสตร์	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.562	2026-10-26 04:20:00.562	\N	\N	\N
219	217	นาย	นายไพศาล  หล่อพงศ์ไพบูลย์	\N	ผู้แทนสานักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.563	2026-10-26 04:20:00.563	\N	\N	\N
220	218	นาย	นายบูรณินทุ์  กัมพลพันธ์	\N	ผู้แทนสมาคมอาเซียน ไวนิล เคาน์ซิล	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.565	2026-10-26 04:20:00.565	\N	\N	\N
221	219	นาย	นายณรงค์ฤทธิ์  ศรีลาพัฒน์	\N	ผู้แทนสมาคมอาเซียน ไวนิล เคาน์ซิล	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.566	2026-10-26 04:20:00.566	\N	\N	\N
222	220	นาย	นายอดิศร  แสงสุข ผู้แทน	\N	ผู้แทนบริษัท แฮพส์เบอร์ก จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.567	2026-10-26 04:20:00.567	\N	\N	\N
223	221	นาย	นายนนทภัทร  เรืองตระกูล	\N	บริษัท นวพลาสติกอุตสาหกรรม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.568	2026-10-26 04:20:00.568	\N	\N	\N
224	222	นางสาว	นางสาวนวลอนงค์  เมธาพิพัฒน์กุล	\N	ผู้แทนบริษัท นวพลาสติกอุตสาหกรรม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.569	2026-10-26 04:20:00.569	\N	\N	\N
225	223	นาย	นายมนตรา  เพิ่มทรัพย์	\N	ผู้แทนบริษัท ดีคอยนิค (ประเทศไทย) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.571	2026-10-26 04:20:00.571	\N	\N	\N
226	224	นาย	นายอิทธิชัย  โรจนนิรันดร์กิจ	\N	ผู้แทนบริษัท ดีคอยนิค (ประเทศไทย) จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.571	2026-10-26 04:20:00.571	\N	\N	\N
227	225	นาย	นายธนินทร์  รัตนศิริวิไล	\N	ผู้แทนบริษัท บางกอกพีวีซี จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.572	2026-10-26 04:20:00.572	\N	\N	\N
228	226	นาย	นายตวง  ตัณฑเศรษฐี	\N	ผู้แทนบริษัทวินโดว์เอเชีย จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.573	2026-10-26 04:20:00.573	\N	\N	\N
229	227	นาย	นายกวิภัฎ  มลิวัลย์	\N	ผู้แทนผู้ออกแบบอิสระ	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.574	2026-10-26 04:20:00.574	\N	\N	\N
230	228	นาย	นายวีรพงษ์  รักอักษร	\N	ผู้แทนบริษัท เซ็นทรัลพัฒนา  จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.575	2026-10-26 04:20:00.575	\N	\N	\N
231	229	นาย	นายวัฒนา  พิมพ์จุฑา	\N	ผู้แทนบริษัท ศุภาลัย  จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.576	2026-10-26 04:20:00.576	\N	\N	\N
232	230	นาย	นายมนต์เสน่ห์  พงศ์เมธินทร์	\N	ผู้แทนบริษัท แฮพส์เบอร์ก จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.576	2026-10-26 04:20:00.576	\N	\N	\N
233	231	นาย	นายชัยภัค  ภัทรจินดา	\N	ผู้แทนมหาวิทยาลัยศิลปากร วิทยาเขตวังท่าพระ	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.577	2026-10-26 04:20:00.577	\N	\N	\N
234	232	นาย	นายไพศาล หล่อพงศ์ไพบูลย์	\N	ผู้แทนสมาคมการค้าผู้ประกอบการอลูมิเนียมและกระจกไทย ผู้ใช้	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.578	2026-10-26 04:20:00.578	\N	\N	\N
235	233	นาย	นายบูรณินทุ์ กัมพลพันธ์	\N	ผู้แทนสมาคมอาเซียน ไวนิล เคาน์ซิล	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.579	2026-10-26 04:20:00.579	\N	\N	\N
236	234	นาย	นายอรรถทวี ธัญญะวุฒิ	\N	ผู้แทนบริษัท แมกโนเลีย ควอลิตี้ ดีเวล็อปเม้นต์ คอร์ปอเรชั่น จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.58	2026-10-26 04:20:00.58	\N	\N	\N
237	235	นาย	นายธนพนธ์ วิทูรแก้วศิริ	\N	ผู้แทนบริษัท วินเวิร์ธ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.581	2026-10-26 04:20:00.581	\N	\N	\N
238	236	นางสาว	นางสาวชญาณิน จิตรานุเคราะห์	\N	ผู้แทนบริษัท ปีเตอร์สัน 1990 จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.581	2026-10-26 04:20:00.581	\N	\N	\N
239	237	นาย	นายนำชัย เงินคล้าย	\N	ที่ปรึกษาบริษัทรับเหมาก่อสร้างโครงการ	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.582	2026-10-26 04:20:00.582	\N	\N	\N
240	238	นาย	นายชนุดม โทนุสิทธิ์	\N	ผู้แทนบริษัท วายเอชเอส อินเตอร์เนชั่นแนล จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.583	2026-10-26 04:20:00.583	\N	\N	\N
241	239	นาย	นายณรงค์ฤทธิ์ ศรีลาพัฒน์	\N	ผู้แทนบริษัท พรพระนคร จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.583	2026-10-26 04:20:00.583	\N	\N	\N
242	240	นาย	นายเกรียงศักดิ์ แซ่ลี้	\N	ผู้แทนบริษัท แฮพส์เบอร์ก จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.585	2026-10-26 04:20:00.585	\N	\N	\N
243	241	นาย	นายเจริญพงษ์ สุขสวัสดิ์	\N	ผู้แทนบริษัท คริสตัลวิว วินโดว์แอนด์ดอร์ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.586	2026-10-26 04:20:00.586	\N	\N	\N
244	242	นาย	นายอดิศร แสงสุข	\N	ผู้แทนบริษัท มาลีฟาซาดเอ็นจิเนียริ่ง เซอร์วิส จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.588	2026-10-26 04:20:00.588	\N	\N	\N
245	243	นาย	นายธนา  รัตนนาคินทร์	\N	ผู้แทนบริษัท นวพลาสติกอุตสาหกรรม จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.589	2026-10-26 04:20:00.589	\N	\N	\N
246	244	นาย	นายศุภชัย งามใหญ่	\N	ผู้แทนบริษัท สโตนเฮ้นจ์ อินเตอร์ จำกัด (มหาชน)	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.59	2026-10-26 04:20:00.59	\N	\N	\N
247	245	นาย	นายกัมพล ออฟูวงศ์	\N	ผู้แทนบริษัท ซี.เอ็น. โปรเกรส อินเตอร์ กรุ๊ป จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.592	2026-10-26 04:20:00.592	\N	\N	\N
248	246	นาย	นายพูลลาภ สุมิตรเหมาะ	\N	ผู้แทนบริษัท เฟรมเทค วินโดว์ แอนด์ ดอร์ จำกัด	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.594	2026-10-26 04:20:00.594	\N	\N	\N
249	247	นาย	นายวัชมา  โพธิ์ทอง	\N	ผู้แทนมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน	DWT	ไม่พบอีเมล	2026-10-26 04:20:00.595	2026-10-26 04:20:00.595	\N	\N	\N
250	248	นาย	นายธงชัย แสงจันทร์	\N	พนักงานห้องปฏิบัติการ	AE	fengths@ku.ac.th	2026-10-26 04:20:00.596	2026-10-26 04:20:00.596	\N	\N	\N
251	249	ดร.	ดร.นิติรงค์ พงษ์พานิช	\N	นักวิจัยชำนาญการ	AE	rdinrp@ku.ac.th	2026-10-26 04:20:00.597	2026-10-26 04:20:00.597	\N	\N	\N
252	250	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	AE	fengcls@ku.ac.th	2026-10-26 04:20:00.598	2026-10-26 04:20:00.598	\N	\N	\N
253	251	นาย	นายธนัญกรณ์ ใจผ่อง	\N	ชำนาญการ	AE	rdiwtjh@ku.ac.th	2026-10-26 04:20:00.599	2026-10-26 04:20:00.599	\N	\N	\N
254	252	นาย	นายทิตินัย เทียนแย้ม	\N	ชำนาญการ	AE	rditnt@ku.ac.th	2026-10-26 04:20:00.6	2026-10-26 04:20:00.6	\N	\N	\N
255	253	นาย	นายสุบรรณ สนิทอินทร์	\N	ปฏิบัติการ	AE	kpssbsa@ku.ac.th	2026-10-26 04:20:00.601	2026-10-26 04:20:00.601	\N	\N	\N
256	254	นาย	นายจิรัฐ  มั่นเกษม	\N	ปฏิบัติการ	AE	fengjrm@ku.ac.th	2026-10-26 04:20:00.602	2026-10-26 04:20:00.602	\N	\N	\N
257	255	นาย	นายกิตติเดช โพธิ์นิยม	\N	ชำนาญการ	AE	rdikit@ku.ac.th	2026-10-26 04:20:00.603	2026-10-26 04:20:00.603	\N	\N	\N
258	256	นางสาว	นางสาวทัดชาวดี นฤทุม	\N	ชำนาญการ	AE	kpstdsi@ku.ac.th	2026-10-26 04:20:00.604	2026-10-26 04:20:00.604	\N	\N	\N
259	257	นางสาว	นางสาวพัชรียา  ไวภารา	\N	ปฏิบัติการ	AE	fengpew@ku.ac.th	2026-10-26 04:20:00.606	2026-10-26 04:20:00.606	\N	\N	\N
260	258	นาย	นายประเสริฐศักดิ์ ภักดีวงศ์	\N	ชำนาญการ	AE	fengpspu@ku.ac.th	2026-10-26 04:20:00.607	2026-10-26 04:20:00.607	\N	\N	\N
261	259	นาย	นายภาณุวัฒน์  วณิชวิวัฒน์วงศ์	\N	ปฏิบัติการ	AE	phanuwat.wa@ku.th	2026-10-26 04:20:00.608	2026-10-26 04:20:00.608	\N	\N	\N
262	260	นาง	นางสุวรรณรัตน์ สุขเกษม	\N	ส 4	AE	rdisrs@ku.ac.th	2026-10-26 04:20:00.609	2026-10-26 04:20:00.609	\N	\N	\N
263	261	นาย	นายณัฐดนัย เทพทอง	\N	ผู้ช่วยช่างทั่วไป (งานโรงงาน)	AE	ไม่พบอีเมล	2026-10-26 04:20:00.61	2026-10-26 04:20:00.61	\N	\N	\N
264	262	นาย	นายสัญญา เอกจีน	\N	ผู้ช่วยช่างทั่วไป (งานสนาม)	AE	fengths@ku.ac.th	2026-10-26 04:20:00.611	2026-10-26 04:20:00.611	\N	\N	\N
265	263	นางสาว	นางสาวเพชรน้อย ยอดอยู่ดี	\N	ชำนาญการ	OFS	fengpny@ku.ac.th	2026-10-26 04:20:00.612	2026-10-26 04:20:00.612	\N	\N	\N
266	264	นางสาว	นางสาวศศิธร ชลรัตน์อมฤต	\N	ชำนาญการ	OFS	fengsstc@ku.ac.th	2026-10-26 04:20:00.613	2026-10-26 04:20:00.613	\N	\N	\N
267	265	นางสาว	นางสาวกุสุมา ภิญโญ	\N	ปฏิบัติการ	OFS	fengkup@ku.ac.th	2026-10-26 04:20:00.614	2026-10-26 04:20:00.614	\N	\N	\N
268	266	นาย	นายประสิทธิ์ รุ่งโรจน์	\N	(พนักงานจ้างเหมา)	OFS	fengpny@ku.ac.th	2026-10-26 04:20:00.615	2026-10-26 04:20:00.615	\N	\N	\N
269	267	นาย	นายณัฐพล เสรีเผ่าวงษ์	\N	ชำนาญการ	OFS	fengnpse@ku.ac.th	2026-10-26 04:20:00.616	2026-10-26 04:20:00.616	\N	\N	\N
270	268	นาย	นายสาคร เขียวชะอุ่ม	\N	พนักงานทั่วไป	OFS	fengskk@ku.ac.th	2026-10-26 04:20:00.617	2026-10-26 04:20:00.617	\N	\N	\N
271	269	นาย	นายชวลิต แซ่จัน	\N	พนักงานทั่วไป	OFS	fengcls@ku.ac.th	2026-10-26 04:20:00.618	2026-10-26 04:20:00.618	\N	\N	\N
272	270	นาย	นายวิโรจน์ ศรีมงคลชัย	\N	ปฏิบัติงาน	OFS	fengvrsc@ku.ac.th	2026-10-26 04:20:00.618	2026-10-26 04:20:00.618	\N	\N	\N
273	271	นาย	นายศักดิ์สิทธิ์ เหมือนประสิทธิ์	\N	ชำนาญงาน	OFS	fengssms@ku.ac.th	2026-10-26 04:20:00.619	2026-10-26 04:20:00.619	\N	\N	\N
274	272	นาย	นายสมประสงค์ ชัยศิริพงษ์	\N	ปฏิบัติงาน	OFS	fengsscp@ku.ac.th	2026-10-26 04:20:00.62	2026-10-26 04:20:00.62	\N	\N	\N
275	273	นาย	นายนพเก้า ดอนเจดีย์	\N	ปฏิบัติงาน	OFS	fengnkd@ku.ac.th	2026-10-26 04:20:00.623	2026-10-26 04:20:00.623	\N	\N	\N
276	274	นาย	นายแสง ทินวงษ์ปาน	\N	พนักงานทั่วไป	OFS	fengset@ku.ac.th	2026-10-26 04:20:00.623	2026-10-26 04:20:00.623	\N	\N	\N
277	275	นาย	นายขจรศักดิ์  แซ่จัน	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.624	2026-10-26 04:20:00.624	\N	\N	\N
278	276	นาย	นายภานุพงศ์ คำทองหลาง	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.625	2026-10-26 04:20:00.625	\N	\N	\N
279	277	นางสาว	นางสาวกรรณิการ์ ปู่น้อย	\N	ชำนาญการ	OFS	fengknk@ku.ac.th	2026-10-26 04:20:00.626	2026-10-26 04:20:00.626	\N	\N	\N
280	278	นาง	นางปนิตา มีหมู่	\N	ชำนาญการ	OFS	fengpnt@ku.ac.th	2026-10-26 04:20:00.627	2026-10-26 04:20:00.627	\N	\N	\N
281	279	นางสาว	นางสาวอรุณี สุขศรี	\N	ปฏิบัติการ	OFS	fengansu@ku.ac.th	2026-10-26 04:20:00.628	2026-10-26 04:20:00.628	\N	\N	\N
282	280	นาย	นายวีระพงษ์ กระแสธีป	\N	ปฏิบัติการ	OFS	fengwok@ku.ac.th	2026-10-26 04:20:00.629	2026-10-26 04:20:00.629	\N	\N	\N
283	281	นางสาว	นางสาวทศพร  เอี่ยมสะอาด	\N	ปฏิบัติการ	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.63	2026-10-26 04:20:00.63	\N	\N	\N
284	282	นาย	นายสุขชัย ยั่งยืน	\N	ชำนาญการ	OFS	fengtcy@ku.ac.th	2026-10-26 04:20:00.632	2026-10-26 04:20:00.632	\N	\N	\N
285	283	นางสาว	นางสาวปิยวรรณ จันทร์สี	\N	ชำนาญการ	OFS	fengpwj@ku.ac.th	2026-10-26 04:20:00.633	2026-10-26 04:20:00.633	\N	\N	\N
286	284	นาย	นายชนานันท์ โคตรภักดี	\N	ปฏิบัติการ	OFS	fengcnkh@ku.ac.th	2026-10-26 04:20:00.634	2026-10-26 04:20:00.634	\N	\N	\N
287	285	นางสาว	นางสาวปฐมาภรณ์ อุ่นเรือน	\N	ปฏิบัติการ	OFS	fengppo@ku.ac.th	2026-10-26 04:20:00.636	2026-10-26 04:20:00.636	\N	\N	\N
288	286	นาง	นางรัตนา เขียวแก้ว	\N	ชำนาญงาน	OFS	fengrnkg@ku.ac.th	2026-10-26 04:20:00.637	2026-10-26 04:20:00.637	\N	\N	\N
289	287	นาง	นางสุกัญญา พันยุโดด	\N	ชำนาญการพิเศษ	OFS	fengsyp@ku.ac.th	2026-10-26 04:20:00.638	2026-10-26 04:20:00.638	\N	\N	\N
290	288	นางสาว	นางสาวธัญรดี เกษม	\N	ปฏิบัติการ	OFS	fengtnka@ku.ac.th	2026-10-26 04:20:00.639	2026-10-26 04:20:00.639	\N	\N	\N
291	289	นางสาว	นางสาวสโรชา พึ่งอุบล	\N	ปฏิบัติการ	OFS	fengscph@ku.ac.th	2026-10-26 04:20:00.64	2026-10-26 04:20:00.64	\N	\N	\N
292	290	นางสาว	นางสาวพรเพ็ญ เอี่ยมทิพย์	\N	ปฏิบัติการ	OFS	fengpha@ku.ac.th	2026-10-26 04:20:00.641	2026-10-26 04:20:00.641	\N	\N	\N
293	291	นางสาว	นางสาวนันฑริกา  มาช่วย	\N	ปฏิบัติการ	OFS	nantarika.m@ku.th	2026-10-26 04:20:00.642	2026-10-26 04:20:00.642	\N	\N	\N
294	292	นาง	นางนภัสวรรณ คำฝั้น	\N	ชำนาญการ	OFS	fengnps@ku.ac.th	2026-10-26 04:20:00.643	2026-10-26 04:20:00.643	\N	\N	\N
295	293	นางสาว	นางสาวเกวลิน อิสสะอาด	\N	ชำนาญการ	OFS	fengkri@ku.ac.th	2026-10-26 04:20:00.644	2026-10-26 04:20:00.644	\N	\N	\N
296	294	นางสาว	นางสาวนุศรา สุขีวงศ์	\N	ชำนาญการ	OFS	fengnrsw@ku.ac.th	2026-10-26 04:20:00.645	2026-10-26 04:20:00.645	\N	\N	\N
297	295	นาย	นายมาโนช ทองดอนเหมือน	\N	ชำนาญการ	OFS	fengmnt@ku.ac.th	2026-10-26 04:20:00.646	2026-10-26 04:20:00.646	\N	\N	\N
298	296	นาง	นางชุติมา  ทองสน	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.647	2026-10-26 04:20:00.647	\N	\N	\N
299	297	นาง	นางนงนาถ  คุ้มพะเนียด	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.648	2026-10-26 04:20:00.648	\N	\N	\N
300	298	นางสาว	นางสาวพวงผกา  คำผาสุข	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.65	2026-10-26 04:20:00.65	\N	\N	\N
301	299	นางสาว	นางสาวละอองดาว  เสือขำ	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.652	2026-10-26 04:20:00.652	\N	\N	\N
302	300	นางสาว	นางสาวจุฑาทิพย์ ทรัพย์ฤทธา	\N	ผู้จัดการ	OFS	fengjts@ku.ac.th	2026-10-26 04:20:00.654	2026-10-26 04:20:00.654	\N	\N	\N
303	301	นางสาว	นางสาวทิวาทิพย์  แซ่แต้	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.659	2026-10-26 04:20:00.659	\N	\N	\N
304	302	นางสาว	นางสาวมณิสรา  วงศ์วัฒนากูล	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.661	2026-10-26 04:20:00.661	\N	\N	\N
305	303	นางสาว	นางสาวอภิชญา พรมมิ	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.663	2026-10-26 04:20:00.663	\N	\N	\N
306	304	นาย	นายโชคชัย ไป๋เขียว	\N	(พนักงานจ้างเหมา)	OFS	ไม่พบอีเมล	2026-10-26 04:20:00.664	2026-10-26 04:20:00.664	\N	\N	\N
307	305	นาย	Test1	\N	Test1	DWT	test1@ku.th	2026-10-26 04:20:00.665	2026-10-26 04:20:00.665	\N	\N	\N
308	306	test	test test	\N	test	AE	test@ku.th	2026-10-26 04:20:00.666	2026-10-26 04:20:00.666	\N	\N	\N
\.


--
-- Data for Name: publication_authors; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.publication_authors (id, publication_id, person_name, personnel_id, affiliation_type) FROM stdin;
1	1	รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์	\N	internal
2	2	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
3	3	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
4	4	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
5	5	ผศ.ดร.ชูพันธุ์  ชมภูจันทร์	\N	internal
6	6	ผศ.บรรพต กุลสุวรรณ	\N	internal
7	7	รศ.ดร.ชัยศรี  สุขสาโรจน์	\N	internal
8	8	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
9	9	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	internal
10	10	รศ.ดร.ชัยศรี  สุขสาโรจน์	\N	internal
11	11	ผศ.ดร.นิธิรัชต์  สงวนเดือน	\N	internal
12	12	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	internal
13	13	รศ.กฤษณะ จันทรโชติ	90	internal
14	14	รศ.ดร.กมล อมรฟ้า	86	internal
15	15	ผศ.ดร.วรุตม์  บุญภักดี	\N	internal
16	16	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	internal
17	17	รศ.กันต์ธกรณ์ เขาทอง	109	internal
18	18	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	internal
19	19	ศ.ดร.อนุพันธ์  เทอดวงศ์วรกุล	\N	internal
20	20	ผศ.ดร.วงศ์ผกา วงศ์รัตน์	62	internal
21	21	ผศ.ดร.การันต์  คล้ายฉ่ำ	\N	internal
22	22	ผศ.ดร.ปรีดา ปรากฎมาก	\N	internal
23	23	ศ.ดร.รังสินี  โสธรวิทย์	\N	internal
24	24	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	internal
25	25	รศ.ดร.สมชาย ดอนเจดีย์	165	internal
26	26	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	internal
27	27	รศ.ดร.ศศรส ใจจิตร์	132	internal
28	28	ผศ.ดร.ไชยาพงษ์  เทพประสิทธิ์	\N	internal
29	29	รศ.ดร.วราวุธ  วุฒิวณิชย์	\N	internal
30	30	ผศ.ชิษณุพงศ์ สุธัมมะ	80	internal
31	31	รศ.ดร.นิภาวรรณ กุลสุวรรณ	89	internal
32	32	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	internal
33	33	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	internal
34	34	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	internal
35	35	รศ.กันต์ธกรณ์ เขาทอง	109	internal
36	36	รศ.ดร.ชัยศรี สุขสาโรจน์	38	internal
37	37	รศ.ดร.สิรินาฏ น้อยพิทักษ์	\N	internal
38	38	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	internal
39	39	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	internal
40	40	รศ.ดร.ปรีดา ปรากฏมาก	112	internal
41	41	ผศ.ดร.จิรเกียรติ ทรายทอง	127	internal
42	42	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
43	43	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	internal
44	44	ผศ.ดร.อณจ ชัยมณี	130	internal
45	45	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	internal
46	46	ศ.ดร.รังสินี โสธรวิทย์	\N	internal
47	47	รศ.ดร.นันทวัฒน์ ขมหวาน	83	internal
48	48	รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร	146	internal
49	49	อ.ดร.ปริญญา กวีกิจบัณฑิต	133	internal
50	50	ผศ.ดร.ศศิวิมล ขาวโกมล	46	internal
51	51	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	internal
52	52	ศ.ดร.รังสินี โสธรวิทย์	\N	internal
53	53	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	internal
54	54	ผศ.ชิษณุพงศ์ สุธัมมะ	80	internal
55	55	ผศ.ชิษณุพงศ์ สุธัมมะ	80	internal
56	56	รศ.ดร.แก้วกานต์ พวงสมบัติ	\N	internal
57	57	ผศ.ดร.ศศิวิมล ขาวโกมล	46	internal
58	58	รศ.ดร.พิมพ์พรรณ ปรืองาม	\N	internal
59	59	ศ.ดร.รังสินี โสธรวิทย์	\N	internal
60	60	ผศ.ดร.จุติเทพ วงษ์เพ็ชร์	44	internal
61	61	รศ.ดร.ชัยศรี สุขสาโรจน์	38	internal
62	62	รศ.ดร.วราวุธ  วุฒิวณิชย์	\N	internal
63	63	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	internal
64	64	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	internal
65	65	รศ.ดร.ปรีดา ปรากฏมาก	112	internal
66	66	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	internal
67	67	นายจิรัฐ มั่นเกษม	\N	internal
68	68	รศ.ดร.วราวุธ วุฒิวณิชย์	\N	internal
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.publications (id, legacy_id, title, type, level, journal, volume, issue, page_start, page_end, budget, first_author_name, first_author_personnel_id, department_code, fiscal_year_be, month, month_year, status, remarks, created_at, updated_at, co_authors_domestic, co_authors_foreign, has_domestic_coauthor, has_foreign_coauthor, has_international_coauthor, quartile) FROM stdin;
12	pub_016	Durability of precast prestressed concrete pile in exposure severe environment	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Journal of Metals, Materials and Minerals	-	-	1	1	20000.00	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	CE	2568	เม.ย.	2025-04	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.107	2026-10-26 04:20:01.107	\N	\N	f	f	f	\N
49	pub_062	Productivity Improvement of the Coconut Water Conveying System Using Simulation Modeling: A Case Study	ตีพิมพ์	ชาติ	Engineering and Technology Horizons (ETH)	-	-	1	1	5000.00	อ.ดร.ปริญญา กวีกิจบัณฑิต	133	IE	2568	ก.พ.	2025-02	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.37	2026-10-26 04:20:01.37	\N	\N	f	f	f	\N
24	pub_030	Effects of Mixing Techniques on Properties of Reactive Powder Concrete Containing Fly Ash	ตีพิมพ์	นานาชาติ	Engineering Access, June-December 2025	-	-	1	1	2500.00	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	FE	2568	มิ.ย.	2025-06	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.198	2026-10-26 04:20:01.198	\N	\N	f	f	f	\N
1	pub_002	A simple and cost-effective method to measure moisture content for multigrain	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Internation Journal of Agricultural Technology, March 2025	-	-	1	1	3384.00	รศ.ดร.ศิวลักษณ์ ปฐวีรัตน์	\N	AE	2568	ก.พ.	2025-02	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.032	2026-10-26 04:20:01.032	\N	\N	f	f	f	\N
2	pub_003	Development and performance test of a mechanical rice weeder attached to a narrow steel-wheeled tractor	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Internation Journal of Agricultural and Biological Engineering	-	-	1	1	20000.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	มี.ค.	2025-03	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.049	2026-10-26 04:20:01.049	\N	\N	f	f	f	\N
3	pub_024	Development and Performance Testing of a Combined Cultivating Implement and Organic Fertilizer Applicator for Sugarcane Ratooning	ตีพิมพ์	นานาชาติ	AgriEngineering, 2025	-	-	1	1	40000.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	ธ.ค.	2025-12	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.055	2026-10-26 04:20:01.055	\N	\N	f	f	f	\N
4	pub_005	Compaction Characteristics under Modified Proctor and Agriculture Engineering Tests Influenced by Organic Matter Application Level	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Malaysian Journal of Soil Science, 2025	-	-	1	1	9890.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	พ.ค.	2025-05	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.059	2026-10-26 04:20:01.059	\N	\N	f	f	f	\N
5	pub_008	Calibration and Temperature Compensation of a Low-Cost Capacitive Soil Moisture Sensor for Precision Irrigation in Thailand	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Engineering, Technology & Applied Science Research, 2025	-	-	1	1	20000.00	ผศ.ดร.ชูพันธุ์  ชมภูจันทร์	\N	IRE	2568	ส.ค.	2025-08	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.063	2026-10-26 04:20:01.063	\N	\N	f	f	f	\N
6	pub_009	Piezometer Time-Lag and Pore Pressure Ratio for Identification of Dam Internal Erosion	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Civil Engineeribg Journal	-	-	1	1	20000.00	ผศ.บรรพต กุลสุวรรณ	\N	CE	2568	ก.ย.	2025-09	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.073	2026-10-26 04:20:01.073	\N	\N	f	f	f	\N
7	pub_010	The Effect of Irrigation Practices on Stress-Related Physiological Characteristics, Water Productivity, and Water Footprint in Rice Cultivation	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Environmental and Sustainability Indicatiors	-	-	1	1	20000.00	รศ.ดร.ชัยศรี  สุขสาโรจน์	\N	IRE	2568	ต.ค.	2025-10	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.078	2026-10-26 04:20:01.078	\N	\N	f	f	f	\N
8	pub_011	การพัฒนาไถระเบิดดินดานสองขาเรียงตามแนวการเคลื่อนที่แบบปรับความลึกขาไถอัตโนมัติ	ตีพิมพ์	ชาติ	วารสารวิชาการเกษตร เดือนกันยายน-ธันวาคม 2567	-	-	1	1	5000.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	พ.ย.	2025-11	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.084	2026-10-26 04:20:01.084	\N	\N	f	f	f	\N
9	pub_012	Evaluation of durian maturity using short-range, coded-light, three-dimensional scanner with machine learning	ตีพิมพ์	นานาชาติ	Postharvest Biology and Technology, January 2025	-	-	1	1	20000.00	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	AE	2568	ธ.ค.	2025-12	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.089	2026-10-26 04:20:01.089	\N	\N	f	f	f	\N
10	pub_013	Evaluating river basin plans’ effects on water stress in Thailand’s economic development area	ตีพิมพ์	นานาชาติ	Internation Journal of Water Resources Development, October 2024	-	-	1	1	20000.00	รศ.ดร.ชัยศรี  สุขสาโรจน์	\N	IRE	2568	ม.ค.	2025-01	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.095	2026-10-26 04:20:01.095	\N	\N	f	f	f	\N
11	pub_015	Assessing Water Use Efficiency and Stress in Thailand's River Basins: Trends, Challenges, and Policy Strategies	เตรียมความพร้อมตีพิมพ์	นานาชาติ	sustainability 2025	-	-	1	1	20000.00	ผศ.ดร.นิธิรัชต์  สงวนเดือน	\N	IRE	2568	มี.ค.	2025-03	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.101	2026-10-26 04:20:01.101	\N	\N	f	f	f	\N
13	pub_017	Enhancing Durability in Recycled Concrete: Investigating Chloride Permeability with Recycled Aggregates and Plastic Waste	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Civil Engineeribg Journal	-	-	1	1	20000.00	รศ.กฤษณะ จันทรโชติ	90	CE	2568	พ.ค.	2025-05	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.112	2026-10-26 04:20:01.112	\N	\N	f	f	f	\N
14	pub_019	Sustainable Interlocking Blocks Containing Sugarcane Bagasse Ash: Structural Integrity, Cost Efficiency, and Environmental Benefits	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Civil Engineeribg Journal, May, 2025	-	-	1	1	20000.00	รศ.ดร.กมล อมรฟ้า	86	CE	2568	ก.ค.	2025-07	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.119	2026-10-26 04:20:01.119	\N	\N	f	f	f	\N
15	pub_020	Effective Heuristics for Solving the Multi-ltem Uncapacitated Lot-Sizing Problem Under Near-Minimal Storage Capacities	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Computation 2025	-	-	1	1	20000.00	ผศ.ดร.วรุตม์  บุญภักดี	\N	IE	2568	ส.ค.	2025-08	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.125	2026-10-26 04:20:01.125	\N	\N	f	f	f	\N
16	pub_021	Restrained Shrinkage Behavior of High-Strength Concrete with Various Synthetic Fiber and Cellulose Fiber Proportions	ตีพิมพ์	นานาชาติ	Journal of Materials in Civil Engineering, March 2025	-	-	1	1	6000.00	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	2568	ก.ย.	2025-09	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.132	2026-10-26 04:20:01.132	\N	\N	f	f	f	\N
17	pub_022	An empirical investigation into enhancing natural convection heat transfer through corona wind in a needle-to-cylinder configuration	ตีพิมพ์	นานาชาติ	Case Studies in Thermal Engineering, 2025	-	-	1	1	5000.00	รศ.กันต์ธกรณ์ เขาทอง	109	ME	2568	ต.ค.	2025-10	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.141	2026-10-26 04:20:01.141	\N	\N	f	f	f	\N
18	pub_023	ผลของสารก่อผลึกต่อความพรุนและการดูดซึมน้ำในมอร์ต้าร์	ตีพิมพ์	ชาติ	The Journal of Industrial Technology, January 2025	-	-	1	1	5000.00	รศ.ดร.นันทวัฒน์  ขมหวาน	\N	CE	2568	พ.ย.	2025-11	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.148	2026-10-26 04:20:01.148	\N	\N	f	f	f	\N
19	pub_025	Integration of independentiy preprocessed spectra to improve classification of repeatedly fried durian chips using portable near-infrared spectrometer and machine Learning	เตรียมความพร้อมตีพิมพ์	นานาชาติ	AIMS Agriculture and Food	-	-	1	1	20000.00	ศ.ดร.อนุพันธ์  เทอดวงศ์วรกุล	\N	AE	2568	ม.ค.	2025-01	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.158	2026-10-26 04:20:01.158	\N	\N	f	f	f	\N
20	pub_026	การพัฒนาผลิตภัณฑ์ข้าวเกรียบมันสำปะหลังพร้อมรับประทานด้วยวิธีไมโครเวฟ	ตีพิมพ์	ชาติ	วารสารวิจัยและส่งเสริมวิชาการเกษตร เดือนพฤษภาคม-สิงหาคม 2567	-	-	1	1	5000.00	ผศ.ดร.วงศ์ผกา วงศ์รัตน์	62	FE	2568	ก.พ.	2025-02	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.166	2026-10-26 04:20:01.166	\N	\N	f	f	f	\N
21	pub_027	Effective nonlocal finite element formulation for free vibration analysis of S-FGM doubly curved nanoshells based on linear strain–displacement relations using TSDT	ตีพิมพ์	นานาชาติ	Computers & Mathematics with Applications, February 2025	-	-	1	1	4000.00	ผศ.ดร.การันต์  คล้ายฉ่ำ	\N	CE	2568	มี.ค.	2025-03	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.174	2026-10-26 04:20:01.174	\N	\N	f	f	f	\N
22	pub_028	Modeling of multiphase heat transfer and transport behaviors of paddy in rotary drum drying by CFD-DEM	ตีพิมพ์	นานาชาติ	Case Studies in Thermal Engineering,  September 2025	-	-	1	1	20000.00	ผศ.ดร.ปรีดา ปรากฎมาก	\N	ME	2568	เม.ย.	2025-04	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.184	2026-10-26 04:20:01.184	\N	\N	f	f	f	\N
23	pub_029	Natural deep eutectic solvent polyphenol and cellulose from jackfruit peel as binary bio‑fillers in jackfruit seed flour/poly (vinyl alcohol)‑based sustainable composite films	ตีพิมพ์	นานาชาติ	Cellulose, June 2025	-	-	1	1	20000.00	ศ.ดร.รังสินี  โสธรวิทย์	\N	FE	2568	พ.ค.	2025-05	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.191	2026-10-26 04:20:01.191	\N	\N	f	f	f	\N
25	pub_032	Flow Measurement Using Bypass Flow Meters for Smart Farming Applications	ตีพิมพ์	ชาติ	วารสาร Science and Engineering Connect, March 2025	-	-	1	1	5000.00	รศ.ดร.สมชาย ดอนเจดีย์	165	IRE	2568	ส.ค.	2025-08	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.203	2026-10-26 04:20:01.203	\N	\N	f	f	f	\N
26	pub_033	Integration of independently preprocessed spectra to improve classification of repeatedly fried durian chips using portable near-infrared spectrometer and machine learning	ตีพิมพ์	นานาชาติ	วารสาร AIMS  Agriculture and Food, เดือน July 2025	-	-	1	1	20000.00	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	AE	2568	ก.ย.	2025-09	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.208	2026-10-26 04:20:01.208	\N	\N	f	f	f	\N
27	pub_034	A machine learning approach to sustainable land use: Integrating Markov chains and XGBoost for black galingale cultivation in Thailand	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Environmental and Sustainability Indicators, August 30, 2025	-	-	1	1	20000.00	รศ.ดร.ศศรส ใจจิตร์	132	IE	2568	ต.ค.	2025-10	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.213	2026-10-26 04:20:01.213	\N	\N	f	f	f	\N
28	pub_038	การวิเคราะห์ปริมาณการไหลพื้นฐานของลุ่มน้ำป่าสัก	ตีพิมพ์	ชาติ	วารสารวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา เดือนมกราคม-มิถุนายน 2568	-	-	1	1	1666.00	ผศ.ดร.ไชยาพงษ์  เทพประสิทธิ์	\N	IRE	2568	ก.พ.	2025-02	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.218	2026-10-26 04:20:01.218	\N	\N	f	f	f	\N
29	pub_039	Deep reinforcement Learning for multiple reservoir operation planning in the Chao Phraya River Basin	ตีพิมพ์	นานาชาติ	Modeling Earth Systems and Environment (2025) 11:102	-	-	1	1	2857.00	รศ.ดร.วราวุธ  วุฒิวณิชย์	\N	IRE	2568	มี.ค.	2025-03	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.223	2026-10-26 04:20:01.223	\N	\N	f	f	f	\N
30	pub_040	Axial compressive performance of sustainable BFRP-confined rectangular columns using recycled brick aggregates	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Composites Part C: Open Access	-	-	1	1	20000.00	ผศ.ชิษณุพงศ์ สุธัมมะ	80	CE	2568	เม.ย.	2025-04	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.227	2026-10-26 04:20:01.227	\N	\N	f	f	f	\N
31	pub_041	การประเมินความคุ้มค่าทางด้านเศรษฐศาสตร์ของการใช้งานรถสวัสดิการ ภายในมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน	ตีพิมพ์	ชาติ	วารสารวิชาการ  มทร.สุวรรณภูมิ	-	-	1	1	5000.00	รศ.ดร.นิภาวรรณ กุลสุวรรณ	89	CE	2568	พ.ค.	2025-05	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.236	2026-10-26 04:20:01.236	\N	\N	f	f	f	\N
32	pub_042	การพัฒนาอุโมงค์อบแห้งพลังงานแสงอาทิตย์สำหรับมันเส้น	ตีพิมพ์	ชาติ	วารสารวิศวกรรมศษสตร์และนวัตกรรม	-	-	1	1	5000.00	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	AE	2568	มิ.ย.	2025-06	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.244	2026-10-26 04:20:01.244	\N	\N	f	f	f	\N
33	pub_043	การพัฒนากลไกปลูกต้นกล้าอ้อยในแนวดิ่งสำหรับอุปกรณ์ปลูกต้นกล้าอ้อย	ตีพิมพ์	ชาติ	วารสารวิชาการเกษตร	-	-	1	1	5000.00	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	AE	2568	ก.ค.	2025-07	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.257	2026-10-26 04:20:01.257	\N	\N	f	f	f	\N
34	pub_044	การวัดทอร์กที่เพลาชุดลำเลียงปุ๋ยรูปดาว	ตีพิมพ์	ชาติ	วารสารวิศวกรรมศาสตร์และนวัตกรรม	-	-	1	1	5000.00	ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล	176	AE	2568	ส.ค.	2025-08	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.265	2026-10-26 04:20:01.265	\N	\N	f	f	f	\N
35	pub_045	Analysis of the alternative air ductwork by Numerical airflow behavior combined with the New Economic index and standard	ตีพิมพ์	นานาชาติ	Energy and Built Environment	-	-	1	1	20000.00	รศ.กันต์ธกรณ์ เขาทอง	109	ME	2568	ก.ย.	2025-09	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.274	2026-10-26 04:20:01.274	\N	\N	f	f	f	\N
36	pub_046	Physiological indicators drive climate-smart and sustainable AWD irrigation in rice systems	เตรียมความพร้อมตีพิมพ์	นานาชาติ	Physiological indicators drive climate-smart and sustainable AWD irrigation in rice systems	-	-	1	1	20000.00	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	2568	ต.ค.	2025-10	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.281	2026-10-26 04:20:01.281	\N	\N	f	f	f	\N
38	pub_050	Mechanical, fatigue, and microstructural properties of rubber wood fly ash-based alkali-activated concrete	ตีพิมพ์	นานาชาติ	Case Studies in Construction Materials	-	-	1	1	3333.00	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	2568	ก.พ.	2025-02	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.295	2026-10-26 04:20:01.295	\N	\N	f	f	f	\N
39	pub_051	The Study of the impact of water channel obstructions in the lower Mun River on flooding	ตีพิมพ์	ชาติ	Journal of Applied Research on Science and Technology (JARST)	-	-	1	1	5000.00	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	2568	มี.ค.	2025-03	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.301	2026-10-26 04:20:01.301	\N	\N	f	f	f	\N
40	pub_057	Performance comparison between gradient orifice and uniform orifice distributors in rotating fluidization for coated jasmine rice	ตีพิมพ์	นานาชาติ	Journal of Food Engineering	-	-	1	1	20800.00	รศ.ดร.ปรีดา ปรากฏมาก	112	ME	2568	ก.ย.	2025-09	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.306	2026-10-26 04:20:01.306	\N	\N	f	f	f	\N
42	pub_054	การออกแบบและพัฒนาเครื่องกำจัดวัชพืชแบบไม่ใช้สารเคมีต่อท้ายรถแทรกเตอร์	ตีพิมพ์	ชาติ	วารสารวิชาการเกษตร	-	-	1	1	5000.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	มิ.ย.	2025-06	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.318	2026-10-26 04:20:01.318	\N	\N	f	f	f	\N
43	pub_055	A low-cost sensor-based roller weeder to support non-chemical weed control in smallholder rice systems	ตีพิมพ์	นานาชาติ	Journal of the Saudi Society of Agricultural Sciences	-	-	1	1	20000.00	รศ.ดร.ประเทือง อุษาบริสุทธิ์	10	AE	2568	ก.ค.	2025-07	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.325	2026-10-26 04:20:01.325	\N	\N	f	f	f	\N
44	pub_056	การปรับปรุงประสิทธิภาพแถวคอยยานพาหนะและการลำเลียงสินค้าผ่านการจำลองสถานการณ์ : กรณีศึกษา (Improving the Efficiency of Vehicle Queuing and Product Conveyance through Simulation : A Case Study)	ตีพิมพ์	ชาติ	Journal of Engineering and Digital Technology (JEDT)	-	-	1	1	5000.00	ผศ.ดร.อณจ ชัยมณี	130	IE	2568	ส.ค.	2025-08	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.332	2026-10-26 04:20:01.332	\N	\N	f	f	f	\N
45	pub_058	Postharvest detection of anthracnose (Colletotrichum asianum) on mango fruit (Mangifera indica L.cv Namdokmai Sithong) using near-infrared response	ตีพิมพ์	นานาชาติ	BMC Plant Biology	-	-	1	1	1666.00	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	AE	2568	ต.ค.	2025-10	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.339	2026-10-26 04:20:01.339	\N	\N	f	f	f	\N
46	pub_059	Sustainable Packaging Film From Chitosan Reinforced With Rice Husk Cellulose Nanocrystals	ตีพิมพ์	นานาชาติ	Packaging Technology and Science	-	-	1	1	20000.00	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	2568	พ.ย.	2025-11	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.348	2026-10-26 04:20:01.348	\N	\N	f	f	f	\N
47	pub_060	Shear Behavior of Ultra-High-Performance Concrete Shear Pockets with Large-sized Studs in Full-Depth Precast Concrete Bridge Deck under Push-off Tests	ตีพิมพ์	นานาชาติ	Applied Science and Engineering Progress	-	-	1	1	20000.00	รศ.ดร.นันทวัฒน์ ขมหวาน	83	CE	2568	ธ.ค.	2025-12	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.354	2026-10-26 04:20:01.354	\N	\N	f	f	f	\N
48	pub_061	Maturity assessment-based dry matter content in Mon Thong durian pulp using machine learning and near-infrared hyperspectral image analysis	ตีพิมพ์	นานาชาติ	IEEE Access	-	-	1	1	20000.00	รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร	146	CPE	2568	ม.ค.	2025-01	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.362	2026-10-26 04:20:01.362	\N	\N	f	f	f	\N
50	pub_063	In vestor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model	ตีพิมพ์	นานาชาติ	Sustainability	-	-	1	1	20000.00	ผศ.ดร.ศศิวิมล ขาวโกมล	46	IRE	2568	มี.ค.	2025-03	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.377	2026-10-26 04:20:01.377	\N	\N	f	f	f	\N
51	pub_066	Prototype Framework for Agricultural Drought Monitoring in Northern Thailand Using Satellite-Based Evaporative Stress Index	ตีพิมพ์	นานาชาติ	Journal of Agrometeorology	-	-	1	1	23675.00	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	2568	มิ.ย.	2025-06	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.384	2026-10-26 04:20:01.384	\N	\N	f	f	f	\N
52	pub_065	Impact of high-pressure homogenization and ultrasonic techniques on production and characterization of carboxymethyl cellulose from lignocellulosic rice husks	ตีพิมพ์	นานาชาติ	Biomass Conversion and Biorefinery	-	-	1	1	20000.00	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	2568	พ.ค.	2025-05	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.391	2026-10-26 04:20:01.391	\N	\N	f	f	f	\N
53	pub_067	Gully erosion susceptibility assessment in Jhang-Ping and Ping-Lin watersheds: a risk-based model using conditioning indicators	ตีพิมพ์	นานาชาติ	Environmental Earth Sciences	-	-	1	1	2857.00	ผศ.ดร.ชูพันธุ์ ชมภูจันทร์	33	IRE	2568	ก.ค.	2025-07	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.398	2026-10-26 04:20:01.398	\N	\N	f	f	f	\N
54	pub_068	Exploring Natural Cotton FRP as a Sustainable Method for Confinement of Concrete Made with Natural and Recycled Aggregates	ตีพิมพ์	นานาชาติ	Journal of Natural Fibers	-	-	1	1	20000.00	ผศ.ชิษณุพงศ์ สุธัมมะ	80	CE	2568	ส.ค.	2025-08	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.405	2026-10-26 04:20:01.405	\N	\N	f	f	f	\N
55	pub_069	From Experiment to Prediction: Machine Learning Solutions for Concrete Strength Assessment with Steel Clamps	ตีพิมพ์	นานาชาติ	Buildings	-	-	1	1	20000.00	ผศ.ชิษณุพงศ์ สุธัมมะ	80	CE	2568	ก.ย.	2025-09	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.413	2026-10-26 04:20:01.413	\N	\N	f	f	f	\N
56	pub_070	การประเมินค่าปริมาณของแข็งที่ละลายได้ของผลแตงโมพันธุ์ซอนญ่าด้วยเทคนิคภาพสเปกโทรสโกปีอินฟราเรดย่านใกล้	ตีพิมพ์	ชาติ	วารสารวิชาการเกษตร	-	-	1	1	5000.00	รศ.ดร.แก้วกานต์ พวงสมบัติ	\N	AE	2568	ต.ค.	2025-10	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.421	2026-10-26 04:20:01.421	\N	\N	f	f	f	\N
59	pub_074	Intermolecularly aggregated complexation between faba bean protein and purified (NADES-retrieved) acidic phenolics is inferior to its soy protein-phenolic counterpart	ตีพิมพ์	นานาชาติ	วารสาร International Journal of Biological Macromolecules	-	-	1	1	20000.00	ศ.ดร.รังสินี โสธรวิทย์	\N	FE	2568	ก.พ.	2025-02	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.445	2026-10-26 04:20:01.445	\N	\N	f	f	f	\N
62	pub_077	Multiple reservoir optimization using constraint programming for water scarcity resilience in the chao Phraya River Basin	ตีพิมพ์	นานาชาติ	Applied Water Science (2026) 16:135	-	-	1	1	2857.00	รศ.ดร.วราวุธ  วุฒิวณิชย์	\N	IRE	2568	พ.ค.	2025-05	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.473	2026-10-26 04:20:01.473	\N	\N	f	f	f	\N
63	pub_078	Filter-based short-wave infrared imaging combined with machine learning for non-destructive quality assessment of durian pulp	ตีพิมพ์	นานาชาติ	Postharvest Biology and Technology	-	-	1	1	2500.00	ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล	\N	AE	2568	มิ.ย.	2025-06	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.504	2026-10-26 04:20:01.504	\N	\N	f	f	f	\N
64	pub_079	Synergistic role of supra-GQDs on the mechanical and durability properties of metakaolin-modified concreteSynergistic role of supra-GQDs on the mechanical and durability properties of metakaolin-modified concrete	ตีพิมพ์	นานาชาติ	Results in Engineering Journal	-	-	1	1	6000.00	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	2568	ก.ค.	2025-07	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.511	2026-10-26 04:20:01.511	\N	\N	f	f	f	\N
67	pub_082	A hybrid artificial neural network-Aspen Plus framework for CO2-enhanced biomass gasification and gas turbine performance	ตีพิมพ์	นานาชาติ	Journal of Environmental Chemical Engineering	-	-	1	1	3333.00	นายจิรัฐ มั่นเกษม	\N	AE	2568	ต.ค.	2025-10	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.528	2026-10-26 04:20:01.528	\N	\N	f	f	f	\N
68	pub_083	Predictive performances of machine learning-and deep learning-based univariate and multivariate reservoir inflow predictions in the Chao Phraya River Basin	ตีพิมพ์	นานาชาติ	Modeling Earth Systems and Environment (2026)12:171	-	-	1	1	2500.00	รศ.ดร.วราวุธ วุฒิวณิชย์	\N	IRE	2568	พ.ย.	2025-11	ตีพิมพ์แล้ว	\N	2026-10-26 04:20:01.534	2026-10-26 04:20:01.534	\N	\N	f	f	f	\N
37	pub_047	Development of Determination Methods for Nitrogen Contentin Dendrobium Sonia Earsakul using Near Infrared Hyperspectral Imaging for Plant Health Assessmen	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	1500.00	รศ.ดร.สิรินาฏ น้อยพิทักษ์	\N	AE	2568	พ.ย.	2025-11	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.288	2026-10-26 04:20:01.288	\N	\N	f	f	f	\N
41	pub_053	Determining the Optimal Order Quantity for Perishable Products Affected by Stochastic Transportation Delays	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	ผศ.ดร.จิรเกียรติ ทรายทอง	127	IE	2568	พ.ค.	2025-05	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.312	2026-10-26 04:20:01.312	\N	\N	f	f	f	\N
57	pub_071	Investor-Centric Policy Prioritization for Biomass Energy in Thailand: An Analytic Hierarchy Process Decision-Support Model	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	ผศ.ดร.ศศิวิมล ขาวโกมล	46	IRE	2568	พ.ย.	2025-11	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.43	2026-10-26 04:20:01.43	\N	\N	f	f	f	\N
58	pub_073	Evaluating the quality of pellets durian peel waste: potential and carbon footprint on production	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	รศ.ดร.พิมพ์พรรณ ปรืองาม	\N	AE	2568	ม.ค.	2025-01	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.438	2026-10-26 04:20:01.438	\N	\N	f	f	f	\N
60	pub_075	Interpreting Satellite Rainfall Bias Correction Through a Rainfall-Runoff Framework in a Monsoon-Influenced River Basin: The Phetchaburi River Basin, Thailand	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	ผศ.ดร.จุติเทพ วงษ์เพ็ชร์	44	IRE	2568	มี.ค.	2025-03	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.453	2026-10-26 04:20:01.453	\N	\N	f	f	f	\N
61	pub_076	Water-centric nexus assessment and critical land-use thresholds for economic crops in central Thailand	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	รศ.ดร.ชัยศรี สุขสาโรจน์	38	IRE	2568	เม.ย.	2025-04	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.461	2026-10-26 04:20:01.461	\N	\N	f	f	f	\N
65	pub_080	จานหมุนแบบรูกระจายขนาดในเครื่องฟลูอิไดซ์เบด	เตรียมความพร้อมตีพิมพ์	ชาติ	วารสารวิชาการ	-	-	1	1	20000.00	รศ.ดร.ปรีดา ปรากฏมาก	112	ME	2568	ส.ค.	2025-08	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.516	2026-10-26 04:20:01.516	\N	\N	f	f	f	\N
66	pub_081	Water Use Efficiency and Carbon Trade-Offs of Gravit and Pump Irrigation in Rice Cultivation	เตรียมความพร้อมตีพิมพ์	นานาชาติ	วารสารวิชาการ	-	-	1	1	20000.00	ผศ.ดร.ทรงศักดิ์ ภัทราวุฒิชัย	34	IRE	2568	ก.ย.	2025-09	เตรียมความพร้อมตีพิมพ์	\N	2026-10-26 04:20:01.523	2026-10-26 04:20:01.523	\N	\N	f	f	f	\N
\.


--
-- Data for Name: research_project_departments; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.research_project_departments (id, project_id, department_code, other_name) FROM stdin;
1	1	DWT	\N
2	2	AE	\N
3	3	DWT	\N
4	4	IE	\N
5	5	IE	\N
6	6	ME	\N
7	7	IE	\N
8	8	FE	\N
9	9	IE	\N
10	10	FE	\N
11	11	ME	\N
12	12	ME	\N
13	13	ME	\N
14	14	EEEC	\N
15	15	IRE	\N
16	16	FE	\N
17	17	FE	\N
18	18	CPE	\N
19	19	IRE	\N
20	20	IRE	\N
21	21	EEEC	\N
22	22	CE	\N
23	23	EEEC	\N
24	24	IRE	\N
25	25	CE	\N
26	26	IRE	\N
27	27	IE	\N
28	28	ME	\N
29	29	IRE	\N
30	30	FE	\N
31	31	IE	\N
32	32	IRE	\N
\.


--
-- Data for Name: research_project_members; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.research_project_members (id, project_id, person_name, personnel_id, role) FROM stdin;
1	1	[object Object]	\N	co_researcher
2	1	[object Object]	\N	co_researcher
\.


--
-- Data for Name: research_projects; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.research_projects (id, legacy_id, code, name, name_en, head_name, head_personnel_id, head_department_code, status, budget_internal, budget_external, fund_source, fund_type, collaboration_type, project_nature, start_date, end_date, fiscal_year, trl_outputs, created_at, updated_at, academic_service, applied_courses, cross_disciplinary, integration, remarks, teaching_courses, trl_end, trl_start) FROM stdin;
1	วศ.กพส. 1/2569	วศ.กพส. 1/2569	test	test	Test1	307	DWT	\N	12000.00	50.00	test	ภายใน	\N	applied	2026-10-01	2027-10-01	2026	\N	2026-10-26 04:20:00.674	2026-10-26 04:20:00.674	\N	\N	\N	\N	\N	\N	\N	\N
2	วศ.กพส.\n1/2568	วศ.กพส.\n1/2568	การใช้แอปพลิเคชั่นไลน์เพื่อการสื่อสารภายในคณะวิศวกรรมศาสตร์ กำแพงแสน	\N	นางสาวอรุณรัตน์ บุญปองหา	19	AE	\N	20000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.691	2026-10-26 04:20:00.691	\N	\N	\N	\N	\N	\N	\N	\N
8	research_idx_6	\N	การออกแบบวางระบบ และทดสอประสิทธิภาพ ระบบการผลิตน้ำดื่ม พระพิรุณตามมาตรฐานกระทรวงสาธารณสุข	\N	รศ.เชาว์ อินทร์ประสิทธิ์	\N	FE	\N	0.00	3707000.00	ทุนสนับสนุนการวิจัย \nวิทยาเขตกำแพงแสน \nประจำปีงบประมาณ 2568	ภายนอก	\N	applied	1968-01-01	1969-01-01	1968	\N	2026-10-26 04:20:00.71	2026-10-26 04:20:00.71	\N	\N	\N	\N	\N	\N	\N	\N
9	research_idx_7	\N	การพัฒนาเทคโนโลยีดิจิทัลแพลตฟอร์มของการรวบรวมใบอ้อยเพื่อลดต้นทุนโลจิสติกส์ และส่งเสริมการใช้ประโยชน์พลังงานทดแทนในอุตสาหกรรมอ้อยและน้ำตาลทราย	\N	รศ.ดร.กิตติพงษ์ ลาลุน	\N	IE	\N	0.00	6543600.00	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ (บพข.) ร่วมกับ บริษัท อินโนวาเทค เอ็นเนอร์ยี่ จำกัด	ภายนอก	\N	applied	1967-09-01	1968-09-01	1967	\N	2026-10-26 04:20:00.714	2026-10-26 04:20:00.714	\N	\N	\N	\N	\N	\N	\N	\N
10	research_idx_8	\N	ระบบการให้น้ำอย่างแม่นยำในสวนมะม่วงน้ำดอกไม้สีทองเพื่อการส่งออกจังหวัดขอนแก่นและจังหวัดชัยภูมิ	\N	รศ.ดร.รณฤทธิ์  ฤทธิรณ	\N	FE	\N	0.00	7658000.00	สำนักงานการวิจัย\nแห่งชาติ (วช.)	ภายนอก	\N	applied	1968-05-01	1969-05-01	1968	\N	2026-10-26 04:20:00.717	2026-10-26 04:20:00.717	\N	\N	\N	\N	\N	\N	\N	\N
11	วศ.กพส.\n7/2568	วศ.กพส.\n7/2568	การศึกษาคุณลักษณะการถ่ายเทความร้อนและการไหลของการหล่อเย็นภายในใบกังหันก๊าซ (Study of heat transfer and flow characteristics of cooling inside gas turbine blades)	\N	ผศ.ดร.คมกฤษณ์  ชัยโย	\N	ME	\N	40000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	1968-06-01	1969-06-01	1968	\N	2026-10-26 04:20:00.721	2026-10-26 04:20:00.721	\N	\N	\N	\N	\N	\N	\N	\N
12	วศ.กพส.\n8/2568	วศ.กพส.\n8/2568	การผลิตเชื้อเพลิงทอริไฟด์จาก\nกากกาแฟ	\N	รศ.วิจิตรา  ภูมิสวัสดิ์	\N	ME	\N	40000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	1968-06-01	1969-06-01	1968	\N	2026-10-26 04:20:00.724	2026-10-26 04:20:00.724	\N	\N	\N	\N	\N	\N	\N	\N
13	วศ.กพส.\n9/2568	วศ.กพส.\n9/2568	การพัฒนาระบบอัตโนมัติสำหรับงานบริการการศึกษาของนิสิตภาควิชาวิศวกรรมเกษตร คณะวิศวกรรมศาสตร์ กำแพงแสน ผ่านไลน์แอปพริเคชันแชทบอท	\N	นางพีรดา จิตตา	\N	ME	\N	20000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	1968-06-01	1969-06-01	1968	\N	2026-10-26 04:20:00.729	2026-10-26 04:20:00.729	\N	\N	\N	\N	\N	\N	\N	\N
14	วศ.กพส.\nบ.1/2568	วศ.กพส.\nบ.1/2568	การอบรมการผลิตกาบกล้วยและถ้วยจากกาบกล้วยและใบไม้เพื่อสร้างมูลค่าเพิ่มจากวัสดุธรรมชาติและลดขยะต้นทาง 2568	\N	ผศ.นงลักษณ์ เล็กรุ่งเรืองกิจ	\N	EEEC	\N	30000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	1968-06-15	1969-06-15	1968	\N	2026-10-26 04:20:00.734	2026-10-26 04:20:00.734	\N	\N	\N	\N	\N	\N	\N	\N
15	research_idx_13	\N	การประยุกต์ใช้ระบบการจำลองแบบอัตโนมัติสำหรับคาดการณ์ปริมาณความต้องการน้ำชลประทานและปริมาณน้ำท่าผิวดินเพื่อสนับสนุนการบริหารจัดการน้ำในพื้นที่ลุ่มน้ำแม่กลอง	\N	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	\N	0.00	1000000.00	สำนักงาน\nการวิจัยแห่งชาติ (วช.)	ภายนอก	\N	applied	1968-06-01	1969-06-01	1968	\N	2026-10-26 04:20:00.742	2026-10-26 04:20:00.742	\N	\N	\N	\N	\N	\N	\N	\N
16	research_idx_14	\N	การพัฒนาเครื่องวิเคราะห์คุณภาพกากน้ำตาลแลพน้ำเชื่อม แบบพกพาด้วยเทคนิค NIR	\N	รศ.ดร.รณฤทธิ์  ฤทธิรณ	\N	FE	\N	0.00	2500000.00	บริษัท มิตรผลวิจัย พัฒนาอ้อยและน้ำตาล จำกัด	ภายนอก	\N	applied	1968-03-01	1969-03-01	1968	\N	2026-10-26 04:20:00.747	2026-10-26 04:20:00.747	\N	\N	\N	\N	\N	\N	\N	\N
17	research_idx_15	\N	การพัฒนาเครื่องวิเคราะห์สีน้ำเชื่อมแบบพกพา สำหรับตรวจวัดคุณภาพในกระบวนการผลิต	\N	รศ.ดร.รณฤทธิ์  ฤทธิรณ	\N	FE	\N	0.00	300000.00	บริษัท มิตรผลวิจัย พัฒนาอ้อยและน้ำตาล จำกัด	ภายนอก	\N	applied	1968-03-01	1969-03-01	1968	\N	2026-10-26 04:20:00.751	2026-10-26 04:20:00.751	\N	\N	\N	\N	\N	\N	\N	\N
18	YF(KU)\n37.68	YF(KU)\n37.68	โมเดลคอมพิวเตอร์สำหรับบริหารจัดการฟาร์มโคนม	\N	อ.ธีรวัฒน์ หวายฤทธิ์	154	CPE	\N	300000.00	0.00	ทุนอุดหนุนวิจัยเพื่อพัฒนานักวิจัยรุ่นใหม่ มก. ปี 2568	ภายนอก	\N	applied	1968-07-01	1969-07-01	1968	\N	2026-10-26 04:20:00.755	2026-10-26 04:20:00.755	\N	\N	\N	\N	\N	\N	\N	\N
19	research_idx_17	\N	โครงการประมวลความรู้และจัดทำข้อเสนอการบริหารจัดการน้ำลุ่มน้ำแม่กลอง โดยใช้ประโยชน์จากผลงานวิจัย ระยะที่ 2	\N	รศ.ดร.บัญชา ขวัญยืน	36	IRE	\N	0.00	969000.00	สำนักงานการวิจัย\nแห่งชาติ (วช.)	ภายนอก	\N	applied	1968-07-01	1969-07-01	1968	\N	2026-10-26 04:20:00.759	2026-10-26 04:20:00.759	\N	\N	\N	\N	\N	\N	\N	\N
20	PRP\n6805031920	PRP\n6805031920	การพัฒนาพื้นที่เพื่อเตรียมความพร้อมรับมือกับปัญหาภัยแล้งและปัญหาอุทกภัยในพื้นที่เสี่ยงภัยที่มีความสำคัญทางเศรษฐกิจและสังคม	\N	รศ.ดร.สมชาย ดอนเจดีย์	165	IRE	\N	0.00	14500000.00	สำนักงานพัฒนาการวิจัยการเกษตร (องค์การมหาชน)	ภายนอก	\N	applied	1968-07-25	1969-07-25	1968	\N	2026-10-26 04:20:00.763	2026-10-26 04:20:00.763	\N	\N	\N	\N	\N	\N	\N	\N
21	วศ.กพส.\nบ.2/2568	วศ.กพส.\nบ.2/2568	การอบรมและสาธิตการใช้เตาประหยัดพลังงานและเตาเบ๊บซี เพื่อเพิ่มมูลค่าน้ำมันพืชใช้แล้วและวัสดุเหลือใช้ทางการเกษตรให้เป็นเชื้อเพลิงความร้อน พ.ศ. 2568	\N	นายภัทรพล  ชูราศรี	\N	EEEC	\N	30000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	2025-08-15	2026-08-15	2025	\N	2026-10-26 04:20:00.766	2026-10-26 04:20:00.766	\N	\N	\N	\N	\N	\N	\N	\N
22	วศ.กพส.\n10/2568	วศ.กพส.\n10/2568	การวิเคราะห์โครงสร้างจุลภาคของคอนกรีตรีไซเคิลที่ผสมขยะพลาสติกด้วยกล้องจุลทรรศน์อิเล็กตรอนแบบส่องกราด (SEM)	\N	รศ.กฤษณะ  จันทรโชติ	\N	CE	\N	40000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	2025-08-18	2026-08-18	2025	\N	2026-10-26 04:20:00.769	2026-10-26 04:20:00.769	\N	\N	\N	\N	\N	\N	\N	\N
23	วศ.กพส.\nบ.3/2568	วศ.กพส.\nบ.3/2568	การฝึกอบรมเชิงปฏิบัติการการผลิตกระถางเพาะชำจากวัสดุธรรมชาติด้วยเครื่องอัดกระถางแบบมือโยกและไฮดรอลิกเพื่อส่งเสริมเศรษฐกิจหมุนเวียนในระดับชุมชน พ.ศ. 2568	\N	นายรัตนศักดิ์ ทรัพย์เย็น	168	EEEC	\N	30000.00	0.00	คณะวิศวกรรมศาสตร์ กำแพงแสน	ภายนอก	\N	applied	2025-09-15	2026-09-15	2025	\N	2026-10-26 04:20:00.774	2026-10-26 04:20:00.774	\N	\N	\N	\N	\N	\N	\N	\N
24	research_idx_22	\N	ศึกษาวิจัยการวิเคราะห์จุดอ่อน\nเชิงระบบด้านความมั่นคงปลอดภัยไชเบอร์ของภาครัฐและกรอบแนวทางการยกระดับขีดความสามารถ	\N	ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์	30	IRE	\N	0.00	14000000.00	สำนักงานการวิจัย\nแห่งชาติ(วช.)	ภายนอก	\N	applied	2025-11-01	2026-11-01	2025	\N	2026-10-26 04:20:00.778	2026-10-26 04:20:00.778	\N	\N	\N	\N	\N	\N	\N	\N
25	research_idx_23	\N	การพัฒนาสมบัติทางกลและความทนทานของมอร์ต้าร์ที่รักษาการเสื่อมสภาพด้วยตัวเองโดยการใช้สารสร้างผลึกชนิดต่างๆ	\N	ผศ.ดร.เพ็ญพิชชา สนิทอินทร์	82	CE	\N	0.00	600000.00	สำนักงานการวิจัย\nแห่งชาติ(วช.)	ภายนอก	\N	applied	2026-03-01	2027-03-01	2026	\N	2026-10-26 04:20:00.781	2026-10-26 04:20:00.781	\N	\N	\N	\N	\N	\N	\N	\N
27	research_idx_25	\N	ระบบสนับสนุนการตัดสินใจสำหรับการออกแบบและการเพิ่มประสิทธิภาพอย่างยั่งยืนของเครือข่ายโซ่อุปทานหลังการเก็บเกี่ยวมะพร้าว	\N	ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ	129	IE	\N	20000.00	0.00	ทุนอุดหนุนการวิจัย คณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569	ภายนอก	\N	applied	2026-03-03	2027-03-03	2026	\N	2026-10-26 04:20:00.789	2026-10-26 04:20:00.789	\N	\N	\N	\N	\N	\N	\N	\N
28	research_idx_26	\N	การพัฒนาและถ่ายทอดเทคโนโลยีนวัตกรรมระบบควบคุมความปลอดภัยสำหรับปั้นจั่น(เครน)เหนือศีรษะด้วยเทคโนโลยี LiDAR เพื่อยกระดับความปลอดภัยของผู้ปฏิบัติงานและลดความเสี่ยงต่อสาธารณชน	\N	อ.ดร.ณัฐพงษ์ สุขสบาย	114	ME	\N	0.00	1628000.00	สำนักงานการวิจัย\nแห่งชาติ (วช)	ภายนอก	\N	applied	1969-03-03	1970-03-03	1969	\N	2026-10-26 04:20:00.793	2026-10-26 04:20:00.793	\N	\N	\N	\N	\N	\N	\N	\N
30	research_idx_28	\N	การใช้เทคโนโลยีจัดการน้ำ-ปุ๋ยและจัดการผลิตมะม่วงน้ำดอกไม้สีทองที่เหมาะสมในพื้นที่ประสบภัยแล้งจังหวัดขอนแก่นและชัยภูมิเพื่อการส่งออกและผลิตนอกฤดู	\N	รศ.ดร.รณฤทธิ์ ฤทธิรณ	64	FE	\N	0.00	6857000.00	สำนักงานการวิจัยแห่งชาติ(วช.)	ภายนอก	\N	applied	2026-04-04	2027-04-04	2026	\N	2026-10-26 04:20:00.802	2026-10-26 04:20:00.802	\N	\N	\N	\N	\N	\N	\N	\N
31	research_idx_29	\N	การพัฒนาระบบสารสนเทศเพื่อ\nปรับปรุงกระบวนการติดตามและ\nวิเคราะห์ผลการดำเนินโครงการที่\nเชื่อมโยงกับแผนยุทธศาสตร์ด้าน\nกิจการนิสิต: กรณีศึกษา \nมหาวิทยาลัยเกษตรศาสตร์ \nวิทยาเขตกำแพงแสน	\N	ผศ.อธิวัฒน์ บุญมี	\N	IE	\N	20000.00	0.00	ทุนอุดหนุนการวิจัย \nคณะวิศวกรรมศาสตร์ กำแพงแสน ประจำปีงบประมาณ 2569	ภายนอก	\N	applied	2026-04-04	2027-04-04	2026	\N	2026-10-26 04:20:00.807	2026-10-26 04:20:00.807	\N	\N	\N	\N	\N	\N	\N	\N
32	research_idx_30	\N	ศึกษาวิจัยและสาธิตเริ่มระบบช่วยตัดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่	\N	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	IRE	\N	0.00	18000200.00	หน่วยบริหารและจัดการทุนด้านการเพิ่มความสามารถในการแข่งขันของประเทศ(บพช)	ภายนอก	\N	applied	2026-05-05	2027-05-05	2026	\N	2026-10-26 04:20:00.813	2026-10-26 04:20:00.813	\N	\N	\N	\N	\N	\N	\N	\N
3	วศ.กพส.\n2/2568	วศ.กพส.\n2/2568	การศึกษาความสามารถของระบบเสริมการระบายอากาศของบ้านจัดสรรขนาด 140 ตารางเมตร	\N	ผศ.ดร.วัชมา โพธิ์ทอง	175	DWT	\N	20000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.695	2026-10-26 04:20:00.695	\N	\N	\N	\N	\N	\N	\N	\N
4	วศ.กพส.\n3/2568	วศ.กพส.\n3/2568	การพัฒนาเว็บไซต์ Eng Connect ด้วยการเพิ่มการแสดงผลการวิเคราะห์เชิงสถิติและการทำเหมืองข้อความ	\N	ผศ.ดร.ศศรส ใจจิตร์	\N	IE	\N	20000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.698	2026-10-26 04:20:00.698	\N	\N	\N	\N	\N	\N	\N	\N
5	วศ.กพส.\n4/2568	วศ.กพส.\n4/2568	การปรับปรุงความแม่นยำของสินค้าคงคลัง : กรณีศึกษาคลังสินค้าอุปกรณ์กีฬา	\N	ผศ.ดร.ภัทรพงษ์  ภาคภูมิ	\N	IE	\N	20000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.701	2026-10-26 04:20:00.701	\N	\N	\N	\N	\N	\N	\N	\N
6	วศ.กพส.\n5/2568	วศ.กพส.\n5/2568	การไพโรไลซีสร่วมระหว่างพลาสติกและถ่านไฮโดรชาร์จากพลาสติก	\N	ผศ.สวัสดิ์  ภูมิสวัสดิ์	\N	ME	\N	40000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.704	2026-10-26 04:20:00.704	\N	\N	\N	\N	\N	\N	\N	\N
7	วศ.กพส.\n6/2568	วศ.กพส.\n6/2568	Establishing an optimal base-stock level for a periodic review system with a partial replenishment in the face of supply disruption	\N	ผศ.ดร.จิรเกียรติ  ทรายทอง	\N	IE	\N	2000.00	0.00	คณะวิศวกรรมศาสตร์\nกำแพงแสน	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.707	2026-10-26 04:20:00.707	\N	\N	\N	\N	\N	\N	\N	\N
26	research_idx_24	\N	ศึกษาวิจัยและสาธิตริเริ่มระบบช่วยติดสินใจเพื่อการพยากรณ์น้ำและควบคุมเครื่องสูบน้ำแบบอัตโนมัติเพื่อป้องกันน้ำท่วมเมืองเชียงใหม่	\N	รศ.ดร.วิษุวัฒก์ แต้สมบัติ	40	IRE	\N	0.00	16050200.00	สำนักงานเร่งรัดการวิจัยและนวัตกรรมเพื่อเพิ่มความสามารถการแข่งขันและการพัฒนาพื้นที่ (องค์การมหาชน) \nกับ\nบริษัทโอทีเอส เซอร์วิสแอนด์ ซัพพลาย จำกัด	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.785	2026-10-26 04:20:00.785	\N	\N	\N	\N	\N	\N	\N	\N
29	research_idx_27	\N	การพัฒนาพื้นที่เพื่อเตรียมความ\nพร้อมรับมือกับปัญหาภัยแล้งและ\nปัญหาอุทกภัย ในพื้นที่เสี่ยงภัยที่มี\nความสำคัญทางเศรษฐกิจและ\nสังคม ปีที่ 2	\N	รศ.ดร.สมชาย ดอนเจดีย์	165	IRE	\N	0.00	9478000.00	สำนักงานพัฒนาการวิจัย\nการเกษตร(สวก.)	ภายนอก	\N	applied	2024-10-01	2025-10-01	2568	\N	2026-10-26 04:20:00.797	2026-10-26 04:20:00.797	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: role_audit_logs; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.role_audit_logs (id, actor_username, action, target_username, old_role, new_role, created_at) FROM stdin;
1	system	migrate_to_2tier	system	super_admin/management	admin/user	2026-10-25 19:34:22.732
\.


--
-- Data for Name: strategic_indicator_round_results; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.strategic_indicator_round_results (id, indicator_id, sub_indicator_id, round_id, actual_value, actual_text, evidence, remarks, reporter, status, updated_at) FROM stdin;
res-sub-kpi-2569-1-1-1-sub-1-round-6m	kpi-2569-1-1-1	kpi-2569-1-1-1-sub-1	round-6m	\N	-	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.706
res-sub-kpi-2569-1-1-1-sub-1-round-9m	kpi-2569-1-1-1	kpi-2569-1-1-1-sub-1	round-9m	\N	-	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.71
res-kpi-2569-1-1-1-round-6m	kpi-2569-1-1-1	\N	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.711
res-kpi-2569-1-1-1-round-9m	kpi-2569-1-1-1	\N	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.713
res-kpi-2569-1-1-2-round-6m	kpi-2569-1-1-2	\N	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.718
res-kpi-2569-1-1-2-round-9m	kpi-2569-1-1-2	\N	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.72
res-sub-kpi-2569-1-1-3-sub-1-round-6m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-1	round-6m	28.00	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.725
res-sub-kpi-2569-1-1-3-sub-1-round-9m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-1	round-9m	28.00	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.727
res-sub-kpi-2569-1-1-3-sub-2-round-6m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-2	round-6m	28.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.729
res-sub-kpi-2569-1-1-3-sub-2-round-9m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-2	round-9m	28.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.731
res-sub-kpi-2569-1-1-3-sub-3-round-6m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-3	round-6m	4.29	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.734
res-sub-kpi-2569-1-1-3-sub-3-round-9m	kpi-2569-1-1-3	kpi-2569-1-1-3-sub-3	round-9m	4.29	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.735
res-kpi-2569-1-1-3-round-6m	kpi-2569-1-1-3	\N	round-6m	28.00	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	โครงการพัฒนา Online/Onsite Course สำหรับการสนับสนุนการเรียนรู้ของผู้เรียนในระบบและศิษย์เก่า และส่งเสริม Innovative Learning Environment/Up-skill/Re-skill และ New skill (ผู้เข้าเรียนนำไปใช้ประโยชน์ทางธุรกิจ 28 ราย / ความพึงพอใจ 4.29 คะแนน)	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.736
res-kpi-2569-1-1-3-round-9m	kpi-2569-1-1-3	\N	round-9m	28.00	\N	หลักสูตรประกาศนียบัตรวิศวกรรมอุตสาหการเพื่อการปรับปรุงประสิทธิภาพและกระบวนการผลิต	โครงการพัฒนา Online/Onsite Course สำหรับการสนับสนุนการเรียนรู้ของผู้เรียนในระบบและศิษย์เก่า และส่งเสริม Innovative Learning Environment/Up-skill/Re-skill และ New skill (ผู้เข้าเรียนนำไปใช้ประโยชน์ทางธุรกิจ 28 ราย / ความพึงพอใจ 4.29 คะแนน)	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.741
res-sub-kpi-2569-1-1-4-sub-1-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-1	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.746
res-sub-kpi-2569-1-1-4-sub-1-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-1	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.747
res-sub-kpi-2569-1-1-4-sub-2-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-2	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.75
res-sub-kpi-2569-1-1-4-sub-2-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-2	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.751
res-sub-kpi-2569-1-1-4-sub-3-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-3	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.753
res-sub-kpi-2569-1-1-4-sub-3-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-3	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.754
res-sub-kpi-2569-1-1-4-sub-4-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-4	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.757
res-sub-kpi-2569-1-1-4-sub-4-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-4	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.758
res-sub-kpi-2569-1-1-4-sub-5-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-5	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.76
res-sub-kpi-2569-1-1-4-sub-5-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-5	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.761
res-sub-kpi-2569-1-1-4-sub-6-round-6m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-6	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.764
res-sub-kpi-2569-1-1-4-sub-6-round-9m	kpi-2569-1-1-4	kpi-2569-1-1-4-sub-6	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.765
res-kpi-2569-1-1-4-round-6m	kpi-2569-1-1-4	\N	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.767
res-kpi-2569-1-1-4-round-9m	kpi-2569-1-1-4	\N	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.768
res-kpi-2569-1-2-1-round-6m	kpi-2569-1-2-1	\N	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.772
res-kpi-2569-1-2-1-round-9m	kpi-2569-1-2-1	\N	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.773
res-kpi-2569-1-2-2-round-6m	kpi-2569-1-2-2	\N	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.776
res-kpi-2569-1-2-2-round-9m	kpi-2569-1-2-2	\N	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี / นางสุกัญญา พันยุโดด	submitted	2026-11-08 00:04:10.778
res-sub-kpi-2569-1-2-3-sub-1-round-6m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-1	round-6m	4.29	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.783
res-sub-kpi-2569-1-2-3-sub-1-round-9m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-1	round-9m	4.29	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.785
res-sub-kpi-2569-1-2-3-sub-2-round-6m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-2	round-6m	100.00	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.787
res-sub-kpi-2569-1-2-3-sub-2-round-9m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-2	round-9m	100.00	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.788
res-sub-kpi-2569-1-2-3-sub-3-round-6m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-3	round-6m	240000.00	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.79
res-sub-kpi-2569-1-2-3-sub-3-round-9m	kpi-2569-1-2-3	kpi-2569-1-2-3-sub-3	round-9m	240000.00	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	\N	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.791
res-kpi-2569-1-2-3-round-6m	kpi-2569-1-2-3	\N	round-6m	4.29	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	โครงการพัฒนา Online/Onsite Course เพื่อจะฝาก Contents ใน External Online/Onsite Learning Platform สำหรับผู้เรียนทั่วไป: 1) ความพึงพอใจของผู้เรียน 4.29 คะแนน (เป้า 4) 2) อัตราการแนะนำบอกต่อ ร้อยละ 100 (เป้า ร้อยละ 20) 3) รายได้จากผู้เรียน 240,000 บาท (เป้า > 50,000 บาท)	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.793
res-kpi-2569-1-2-3-round-9m	kpi-2569-1-2-3	\N	round-9m	4.29	\N	หลักสูตรผู้ประกอบการผลิตพืชระบบเกษตรอัจฉริยะ	โครงการพัฒนา Online/Onsite Course เพื่อจะฝาก Contents ใน External Online/Onsite Learning Platform สำหรับผู้เรียนทั่วไป: 1) ความพึงพอใจของผู้เรียน 4.29 คะแนน (เป้า 4) 2) อัตราการแนะนำบอกต่อ ร้อยละ 100 (เป้า ร้อยละ 20) 3) รายได้จากผู้เรียน 240,000 บาท (เป้า > 50,000 บาท)	ผศ.ดร.วันรัฐ อับดุลลากาซิม	submitted	2026-11-08 00:04:10.794
res-sub-kpi-2569-1-2-6-sub-1-round-6m	kpi-2569-1-2-6	kpi-2569-1-2-6-sub-1	round-6m	1.00	\N	1 ระบบ (ระบบบริหารจัดการงานวิจัย)	\N	นางนภัสวรรณ คำฝั้น	submitted	2026-11-08 00:04:10.803
res-sub-kpi-2569-1-2-6-sub-1-round-9m	kpi-2569-1-2-6	kpi-2569-1-2-6-sub-1	round-9m	1.00	\N	1 ระบบ (ระบบบริหารจัดการงานวิจัย)	\N	นางนภัสวรรณ คำฝั้น	submitted	2026-11-08 00:04:10.804
res-kpi-2569-1-2-6-round-6m	kpi-2569-1-2-6	\N	round-6m	1.00	\N	1 ระบบ (ระบบบริหารจัดการงานวิจัย)	โครงการส่วนงาน: โครงการพัฒนาระบบ Business Intelligence เพื่อสนับสนุนการตัดสินใจของผู้บริหาร (1. ระบบ BI / 2. ระบบ Paperless) เป้าหมายส่วนงาน 1 ระบบ ผลการดำเนินงาน 1 ระบบ (ระบบบริหารจัดการงานวิจัย)	นางนภัสวรรณ คำฝั้น	submitted	2026-11-08 00:04:10.806
res-kpi-2569-1-2-6-round-9m	kpi-2569-1-2-6	\N	round-9m	1.00	\N	1 ระบบ (ระบบบริหารจัดการงานวิจัย)	โครงการส่วนงาน: โครงการพัฒนาระบบ Business Intelligence เพื่อสนับสนุนการตัดสินใจของผู้บริหาร (1. ระบบ BI / 2. ระบบ Paperless) เป้าหมายส่วนงาน 1 ระบบ ผลการดำเนินงาน 1 ระบบ (ระบบบริหารจัดการงานวิจัย)	นางนภัสวรรณ คำฝั้น	submitted	2026-11-08 00:04:10.808
res-sub-kpi-2569-1-3-1-sub-1-round-6m	kpi-2569-1-3-1	kpi-2569-1-3-1-sub-1	round-6m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.813
res-sub-kpi-2569-1-3-1-sub-1-round-9m	kpi-2569-1-3-1	kpi-2569-1-3-1-sub-1	round-9m	0.00	\N	\N	\N	นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.814
res-sub-kpi-2569-1-3-1-sub-2-round-6m	kpi-2569-1-3-1	kpi-2569-1-3-1-sub-2	round-6m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.817
res-sub-kpi-2569-1-3-1-sub-2-round-9m	kpi-2569-1-3-1	kpi-2569-1-3-1-sub-2	round-9m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.818
res-kpi-2569-1-3-1-round-6m	kpi-2569-1-3-1	\N	round-6m	0.00	\N	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี / นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.82
res-kpi-2569-1-3-1-round-9m	kpi-2569-1-3-1	\N	round-9m	0.00	\N	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี / นางสาวปิยวรรณ จันทร์สี	submitted	2026-11-08 00:04:10.822
res-kpi-2569-1-3-2-round-6m	kpi-2569-1-3-2	\N	round-6m	0.00	\N	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี / รศ.ดร.สิรินาฏ น้อยพิทักษ์	submitted	2026-11-08 00:04:10.826
res-kpi-2569-1-3-2-round-9m	kpi-2569-1-3-2	\N	round-9m	0.00	\N	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี / รศ.ดร.สิรินาฏ น้อยพิทักษ์	submitted	2026-11-08 00:04:10.827
res-kpi-2569-1-3-3-round-6m	kpi-2569-1-3-3	\N	round-6m	58.00	\N	ตารางข้อมูลจำนวนใบ กว. ของคณาจารย์คณะวิศวกรรมศาสตร์ กำแพงแสน	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.832
res-kpi-2569-1-3-3-round-9m	kpi-2569-1-3-3	\N	round-9m	58.00	\N	ตารางข้อมูลจำนวนใบ กว. ของคณาจารย์คณะวิศวกรรมศาสตร์ กำแพงแสน	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.833
res-kpi-2569-1-3-4-round-6m	kpi-2569-1-3-4	\N	round-6m	11.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน (11 ราย):\n1. รศ.ดร.ศุภกิตติ์ สายสุนทร (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n2. รศ.ดร.วัชรพล ชยประเสริฐ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n3. รศ.ดร.วันรัฐ อับดุลลากาซิม (กองบรรณาธิการและผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n4. ผศ.ดร.อภิรักษ์ จันทร์สร้าง (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n5. ผศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n6. รศ.ดร.พิเชษฐ์ สืบสายพรหม (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n7. ผศ.ดร.ประพจน์ มลิวัลย์ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n8. รศ.ดร.เชาวลิต มิตรสันติสุข (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n9. อ.ดร.นนทватน์ จันทร์เจริญ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n10. ผศ.ดร.หทัยเทพ วงศ์สุวรรณ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n11. ผศ.ดร.กิติเดช ขันติยวิชัย (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\nรอบ 9 เดือน เพิ่มเติมรวม 22 ราย (อาทิ รศ.ดร.กัมปนาท เพ็ญสุภา, ผศ.ดร.จักรกฤษณ์ พจนศิลป์, ผศ.ดร.ไชยา บุญญานุภาพพงศ์, รศ.ดร.อนุสรณ์ วรสิงห์, ผศ.ดร.เสกสรรค์ สีหวงษ์ ฯลฯ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.838
res-kpi-2569-1-3-4-round-9m	kpi-2569-1-3-4	\N	round-9m	22.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน (11 ราย):\n1. รศ.ดร.ศุภกิตติ์ สายสุนทร (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n2. รศ.ดร.วัชรพล ชยประเสริฐ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n3. รศ.ดร.วันรัฐ อับดุลลากาซิม (กองบรรณาธิการและผู้ประเมินบทความงานประชุมวิชาการนานาชาติ TSAE)\n4. ผศ.ดร.อภิรักษ์ จันทร์สร้าง (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n5. ผศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n6. รศ.ดร.พิเชษฐ์ สืบสายพรหม (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n7. ผศ.ดร.ประพจน์ มลิวัลย์ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n8. รศ.ดร.เชาวลิต มิตรสันติสุข (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n9. อ.ดร.นนทватน์ จันทร์เจริญ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n10. ผศ.ดร.หทัยเทพ วงศ์สุวรรณ (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\n11. ผศ.ดร.กิติเดช ขันติยวิชัย (ผู้ประเมินบทความงานประชุมวิชาการนานาชาติ)\nรอบ 9 เดือน เพิ่มเติมรวม 22 ราย (อาทิ รศ.ดร.กัมปนาท เพ็ญสุภา, ผศ.ดร.จักรกฤษณ์ พจนศิลป์, ผศ.ดร.ไชยา บุญญานุภาพพงศ์, รศ.ดร.อนุสรณ์ วรสิงห์, ผศ.ดร.เสกสรรค์ สีหวงษ์ ฯลฯ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.842
res-kpi-2569-1-3-5-round-6m	kpi-2569-1-3-5	\N	round-6m	2.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. https://eng.kps.ku.ac.th/20th/index.php/news/award-proud	1. รศ.ดร.กัมปนาท เพ็ญสุภา (ได้รับรางวัล Best Paper Award ในการประชุมวิชาการระดับนานาชาติ)\n2. รศ.ดร.วันรัฐ อับดุลลากาซิม (ได้รับรางวัลผลงานวิจัย/นำเสนอระดับนานาชาติ)\n3. ผศ.ดร.เกรียงไกร แซมสีม่วง (รอบ 9 เดือน)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.847
res-kpi-2569-1-3-5-round-9m	kpi-2569-1-3-5	\N	round-9m	3.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. https://eng.kps.ku.ac.th/20th/index.php/news/award-proud	1. รศ.ดร.กัมปนาท เพ็ญสุภา (ได้รับรางวัล Best Paper Award ในการประชุมวิชาการระดับนานาชาติ)\n2. รศ.ดร.วันรัฐ อับดุลลากาซิม (ได้รับรางวัลผลงานวิจัย/นำเสนอระดับนานาชาติ)\n3. ผศ.ดร.เกรียงไกร แซมสีม่วง (รอบ 9 เดือน)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.849
res-kpi-2569-1-3-6-round-6m	kpi-2569-1-3-6	\N	round-6m	0.00	\N	หน่วยวิเทศสัมพันธ์ คณะวิศวกรรมศาสตร์ กำแพงแสน	รอบ 9 เดือน (5 ราย):\n1. รศ.ดร.วันรัฐ อับดุลลากาซิม\n2. ผศ.ดร.จักรกฤษณ์ พจนศิลป์\n3. ผศ.ดร.ประพจน์ มลิวัลย์\n4. อ.ดร.ธนากร แสงสง่า\n5. อ.ดร.ณัฐพล นิพัทธ์สกุล	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:10.852
res-kpi-2569-1-3-6-round-9m	kpi-2569-1-3-6	\N	round-9m	5.00	\N	หน่วยวิเทศสัมพันธ์ คณะวิศวกรรมศาสตร์ กำแพงแสน	รอบ 9 เดือน (5 ราย):\n1. รศ.ดร.วันรัฐ อับดุลลากาซิม\n2. ผศ.ดร.จักรกฤษณ์ พจนศิลป์\n3. ผศ.ดร.ประพจน์ มลิวัลย์\n4. อ.ดร.ธนากร แสงสง่า\n5. อ.ดร.ณัฐพล นิพัทธ์สกุล	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:10.854
res-sub-kpi-2569-1-3-8-sub-1-round-6m	kpi-2569-1-3-8	kpi-2569-1-3-8-sub-1	round-6m	1.00	\N	\N	1. คุณธนัญกรณ์ ใจผ่อง	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.86
res-sub-kpi-2569-1-3-8-sub-1-round-9m	kpi-2569-1-3-8	kpi-2569-1-3-8-sub-1	round-9m	1.00	\N	\N	1. คุณธนัญกรณ์ ใจผ่อง	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.862
res-sub-kpi-2569-1-3-8-sub-2-round-6m	kpi-2569-1-3-8	kpi-2569-1-3-8-sub-2	round-6m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.865
res-kpi-2569-2-2-17-round-6m	kpi-2569-2-2-17	\N	round-6m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.098
res-sub-kpi-2569-1-3-8-sub-2-round-9m	kpi-2569-1-3-8	kpi-2569-1-3-8-sub-2	round-9m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.866
res-kpi-2569-1-3-8-round-6m	kpi-2569-1-3-8	\N	round-6m	1.00	\N	\N	1. คุณธนัญกรณ์ ใจผ่อง	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.868
res-kpi-2569-1-3-8-round-9m	kpi-2569-1-3-8	\N	round-9m	1.00	\N	\N	1. คุณธนัญกรณ์ ใจผ่อง	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.869
res-sub-kpi-2569-2-1-1-sub-1-round-6m	kpi-2569-2-1-1	kpi-2569-2-1-1-sub-1	round-6m	0.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.874
res-sub-kpi-2569-2-1-1-sub-1-round-9m	kpi-2569-2-1-1	kpi-2569-2-1-1-sub-1	round-9m	0.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.876
res-sub-kpi-2569-2-1-1-sub-2-round-6m	kpi-2569-2-1-1	kpi-2569-2-1-1-sub-2	round-6m	23.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.878
res-sub-kpi-2569-2-1-1-sub-2-round-9m	kpi-2569-2-1-1	kpi-2569-2-1-1-sub-2	round-9m	51.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.88
res-kpi-2569-2-1-1-round-6m	kpi-2569-2-1-1	\N	round-6m	23.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน (ต.ค.68 - มี.ค.69): บทความวิจัยระดับนานาชาติ 23 บทความ / รอบ 9 เดือน (ต.ค.68 - ก.ค.69): บทความวิจัยระดับนานาชาติ 51 บทความ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.881
res-kpi-2569-2-1-1-round-9m	kpi-2569-2-1-1	\N	round-9m	51.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน (ต.ค.68 - มี.ค.69): บทความวิจัยระดับนานาชาติ 23 บทความ / รอบ 9 เดือน (ต.ค.68 - ก.ค.69): บทความวิจัยระดับนานาชาติ 51 บทความ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.883
res-sub-kpi-2569-2-1-2-sub-1-round-6m	kpi-2569-2-1-2	kpi-2569-2-1-2-sub-1	round-6m	3.92	\N	ฐานข้อมูล Scopus	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.889
res-sub-kpi-2569-2-1-2-sub-1-round-9m	kpi-2569-2-1-2	kpi-2569-2-1-2-sub-1	round-9m	3.90	\N	ฐานข้อมูล Scopus	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.89
res-sub-kpi-2569-2-1-2-sub-2-round-6m	kpi-2569-2-1-2	kpi-2569-2-1-2-sub-2	round-6m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.893
res-sub-kpi-2569-2-1-2-sub-2-round-9m	kpi-2569-2-1-2	kpi-2569-2-1-2-sub-2	round-9m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.895
res-kpi-2569-2-1-2-round-6m	kpi-2569-2-1-2	\N	round-6m	3.92	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. ฐานข้อมูล Scopus	ค่าเฉลี่ย H-index ในฐานข้อมูล Scopus ของคณาจารย์คณะวิศวกรรมศาสตร์ กำแพงแสน รอบ 6 เดือน = 3.92 / รอบ 9 เดือน = 3.90 (สูงกว่าเกณฑ์เป้าหมาย 0.6 : 1)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.897
res-kpi-2569-2-1-2-round-9m	kpi-2569-2-1-2	\N	round-9m	3.90	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. ฐานข้อมูล Scopus	ค่าเฉลี่ย H-index ในฐานข้อมูล Scopus ของคณาจารย์คณะวิศวกรรมศาสตร์ กำแพงแสน รอบ 6 เดือน = 3.92 / รอบ 9 เดือน = 3.90 (สูงกว่าเกณฑ์เป้าหมาย 0.6 : 1)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.899
res-kpi-2569-2-1-3-round-6m	kpi-2569-2-1-3	\N	round-6m	7.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: 7 ผลงาน / รอบ 9 เดือน: 12 ผลงาน (โครงการวิจัยบูรณาการข้ามศาสตร์ด้านวิศวกรรมเกษตร อาหาร ชลประทาน เครื่องกล คอมพิวเตอร์ และสิ่งแวดล้อม)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.904
res-kpi-2569-2-1-3-round-9m	kpi-2569-2-1-3	\N	round-9m	12.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: 7 ผลงาน / รอบ 9 เดือน: 12 ผลงาน (โครงการวิจัยบูรณาการข้ามศาสตร์ด้านวิศวกรรมเกษตร อาหาร ชลประทาน เครื่องกล คอมพิวเตอร์ และสิ่งแวดล้อม)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.907
res-sub-kpi-2569-2-1-5-sub-1-round-6m	kpi-2569-2-1-5	kpi-2569-2-1-5-sub-1	round-6m	6.00	\N	หน่วยวิจัยและนวัตกรรม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.914
res-sub-kpi-2569-2-1-5-sub-1-round-9m	kpi-2569-2-1-5	kpi-2569-2-1-5-sub-1	round-9m	6.00	\N	หน่วยวิจัยและนวัตกรรม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.916
res-sub-kpi-2569-2-1-5-sub-2-round-6m	kpi-2569-2-1-5	kpi-2569-2-1-5-sub-2	round-6m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.918
res-sub-kpi-2569-2-1-5-sub-2-round-9m	kpi-2569-2-1-5	kpi-2569-2-1-5-sub-2	round-9m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:10.92
res-sub-kpi-2569-2-1-7-sub-2-round-6m	kpi-2569-2-1-7	kpi-2569-2-1-7-sub-2	round-6m	5.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.966
res-sub-kpi-2569-2-1-7-sub-2-round-9m	kpi-2569-2-1-7	kpi-2569-2-1-7-sub-2	round-9m	5.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.968
res-kpi-2569-2-1-5-round-6m	kpi-2569-2-1-5	\N	round-6m	6.00	\N	หน่วยวิจัยและนวัตกรรม	จำนวนบุคลากรที่ได้รับประกาศนียบัตรรับรองการวิจัยในมนุษย์และสัตว์ทดลอง จำนวน 6 ราย:\n1. ผศ.ดร.ประพจน์ มลิวัลย์\n2. รศ.ดร.ศุภกิตติ์ สายสุนทร\n3. ผศ.ดร.วันเพ็ญ จิตรเจริญ\n4. อ.ดร.ธนากร แสงสง่า\n5. ผศ.ดร.ชูศักดิ์ ชูศรี\n6. ผศ.ดร.อภิรักษ์ จันทร์สร้าง	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.922
res-kpi-2569-2-1-5-round-9m	kpi-2569-2-1-5	\N	round-9m	6.00	\N	หน่วยวิจัยและนวัตกรรม	จำนวนบุคลากรที่ได้รับประกาศนียบัตรรับรองการวิจัยในมนุษย์และสัตว์ทดลอง จำนวน 6 ราย:\n1. ผศ.ดร.ประพจน์ มลิวัลย์\n2. รศ.ดร.ศุภกิตติ์ สายสุนทร\n3. ผศ.ดร.วันเพ็ญ จิตรเจริญ\n4. อ.ดร.ธนากร แสงสง่า\n5. ผศ.ดร.ชูศักดิ์ ชูศรี\n6. ผศ.ดร.อภิรักษ์ จันทร์สร้าง	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.924
res-sub-kpi-2569-2-1-6-sub-1-round-6m	kpi-2569-2-1-6	kpi-2569-2-1-6-sub-1	round-6m	301203231.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: พัฒนาวิชาการวิจัย 18 โครงการ (268,640,231 บาท) + วิจัย 5 โครงการ (32,563,000 บาท) | รอบ 9 เดือน: พัฒนาวิชาการวิจัย 23 โครงการ (292,704,378 บาท) + วิจัย 10 โครงการ (60,273,200 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.931
res-sub-kpi-2569-2-1-6-sub-1-round-9m	kpi-2569-2-1-6	kpi-2569-2-1-6-sub-1	round-9m	352977578.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: พัฒนาวิชาการวิจัย 18 โครงการ (268,640,231 บาท) + วิจัย 5 โครงการ (32,563,000 บาท) | รอบ 9 เดือน: พัฒนาวิชาการวิจัย 23 โครงการ (292,704,378 บาท) + วิจัย 10 โครงการ (60,273,200 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.933
res-sub-kpi-2569-2-1-6-sub-2-round-6m	kpi-2569-2-1-6	kpi-2569-2-1-6-sub-2	round-6m	349143159.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 44 โครงการ (394,143,159 บาท) | รอบ 9 เดือน: 56 โครงการ (442,025,106 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.937
res-sub-kpi-2569-2-1-6-sub-2-round-9m	kpi-2569-2-1-6	kpi-2569-2-1-6-sub-2	round-9m	442025106.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 44 โครงการ (394,143,159 บาท) | รอบ 9 เดือน: 56 โครงการ (442,025,106 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.941
res-kpi-2569-2-1-6-round-6m	kpi-2569-2-1-6	\N	round-6m	650.35	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน (รวม 650.35 ล้านบาท):\n- งบโครงการวิจัยภายนอก: 301,203,231 บาท (โครงการพัฒนาวิชาการด้านวิจัย 18 โครงการ = 268,640,231 บาท + โครงการวิจัย 5 โครงการ = 32,563,000 บาท)\n- งบโครงการบริการวิชาการภายนอก: 349,143,159 บาท (หมายเหตุ: รวมโครงการบริการวิชาการ 44 โครงการ เป็นเงิน 394,143,159 บาท)\n\nรอบ 9 เดือน (รวม 795.00 ล้านบาท):\n- งบโครงการวิจัยภายนอก: 352,977,578 บาท (โครงการพัฒนาวิชาการด้านวิจัย 23 โครงการ = 292,704,378 บาท + โครงการวิจัย 10 โครงการ = 60,273,200 บาท)\n- งบโครงการบริการวิชาการภายนอก: 442,025,106 บาท (จำนวน 56 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.943
res-kpi-2569-2-1-6-round-9m	kpi-2569-2-1-6	\N	round-9m	795.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน (รวม 650.35 ล้านบาท):\n- งบโครงการวิจัยภายนอก: 301,203,231 บาท (โครงการพัฒนาวิชาการด้านวิจัย 18 โครงการ = 268,640,231 บาท + โครงการวิจัย 5 โครงการ = 32,563,000 บาท)\n- งบโครงการบริการวิชาการภายนอก: 349,143,159 บาท (หมายเหตุ: รวมโครงการบริการวิชาการ 44 โครงการ เป็นเงิน 394,143,159 บาท)\n\nรอบ 9 เดือน (รวม 795.00 ล้านบาท):\n- งบโครงการวิจัยภายนอก: 352,977,578 บาท (โครงการพัฒนาวิชาการด้านวิจัย 23 โครงการ = 292,704,378 บาท + โครงการวิจัย 10 โครงการ = 60,273,200 บาท)\n- งบโครงการบริการวิชาการภายนอก: 442,025,106 บาท (จำนวน 56 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.947
res-sub-kpi-2569-2-1-7-sub-1-round-6m	kpi-2569-2-1-7	kpi-2569-2-1-7-sub-1	round-6m	13.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.958
res-sub-kpi-2569-2-1-7-sub-1-round-9m	kpi-2569-2-1-7	kpi-2569-2-1-7-sub-1	round-9m	14.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.96
res-kpi-2569-2-2-14-round-6m	kpi-2569-2-2-14	\N	round-6m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.086
res-kpi-2569-2-1-7-round-6m	kpi-2569-2-1-7	\N	round-6m	18.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 18 โครงการ (โครงการวิจัย/พัฒนาวิชาการวิจัย 13 โครงการ + โครงการบริการวิชาการ 5 โครงการ) | รอบ 9 เดือน: รวม 19 โครงการ (โครงการวิจัย/พัฒนาวิชาการวิจัย 14 โครงการ + โครงการบริการวิชาการ 5 โครงการ) (เป้าหมายส่วนงานวิจัย = 2 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.97
res-kpi-2569-2-1-7-round-9m	kpi-2569-2-1-7	\N	round-9m	19.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 18 โครงการ (โครงการวิจัย/พัฒนาวิชาการวิจัย 13 โครงการ + โครงการบริการวิชาการ 5 โครงการ) | รอบ 9 เดือน: รวม 19 โครงการ (โครงการวิจัย/พัฒนาวิชาการวิจัย 14 โครงการ + โครงการบริการวิชาการ 5 โครงการ) (เป้าหมายส่วนงานวิจัย = 2 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.973
res-kpi-2569-2-2-5-round-6m	kpi-2569-2-2-5	\N	round-6m	15.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 15 โครงการ / รอบ 9 เดือน: 16 โครงการ (โครงการบริการวิชาการถ่ายทอดเทคโนโลยีวิศวกรรมสู่ชุมชนและโรงเรียนในพื้นที่ จ.นครปฐม และภูมิภาคตะวันตก)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.978
res-kpi-2569-2-2-5-round-9m	kpi-2569-2-2-5	\N	round-9m	16.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 15 โครงการ / รอบ 9 เดือน: 16 โครงการ (โครงการบริการวิชาการถ่ายทอดเทคโนโลยีวิศวกรรมสู่ชุมชนและโรงเรียนในพื้นที่ จ.นครปฐม และภูมิภาคตะวันตก)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.98
res-kpi-2569-2-2-6-round-6m	kpi-2569-2-2-6	\N	round-6m	6.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 6 ชุมชน / รอบ 9 เดือน: 9 ชุมชน	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.989
res-kpi-2569-2-2-6-round-9m	kpi-2569-2-2-6	\N	round-9m	9.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 6 ชุมชน / รอบ 9 เดือน: 9 ชุมชน	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.99
res-sub-kpi-2569-2-2-7-sub-1-round-6m	kpi-2569-2-2-7	kpi-2569-2-2-7-sub-1	round-6m	205.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.996
res-sub-kpi-2569-2-2-7-sub-1-round-9m	kpi-2569-2-2-7	kpi-2569-2-2-7-sub-1	round-9m	228.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:10.998
res-sub-kpi-2569-2-2-7-sub-2-round-6m	kpi-2569-2-2-7	kpi-2569-2-2-7-sub-2	round-6m	18.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.001
res-sub-kpi-2569-2-2-7-sub-2-round-9m	kpi-2569-2-2-7	kpi-2569-2-2-7-sub-2	round-9m	23.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.002
res-kpi-2569-2-2-7-round-6m	kpi-2569-2-2-7	\N	round-6m	223.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 223 หน่วยงาน (แบบให้เปล่า 205 หน่วยงาน + แบบคิดค่าบริการ 18 หน่วยงาน) | รอบ 9 เดือน: รวม 251 หน่วยงาน (แบบให้เปล่า 228 หน่วยงาน + แบบคิดค่าบริการ 23 หน่วยงาน)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.003
res-kpi-2569-2-2-7-round-9m	kpi-2569-2-2-7	\N	round-9m	251.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 223 หน่วยงาน (แบบให้เปล่า 205 หน่วยงาน + แบบคิดค่าบริการ 18 หน่วยงาน) | รอบ 9 เดือน: รวม 251 หน่วยงาน (แบบให้เปล่า 228 หน่วยงาน + แบบคิดค่าบริการ 23 หน่วยงาน)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.005
res-sub-kpi-2569-2-2-8-sub-1-round-6m	kpi-2569-2-2-8	kpi-2569-2-2-8-sub-1	round-6m	394143159.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 44 โครงการ (394,143,159 บาท) | รอบ 9 เดือน: 56 โครงการ (442,025,106 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.014
res-kpi-2569-2-2-14-round-9m	kpi-2569-2-2-14	\N	round-9m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.09
res-sub-kpi-2569-2-2-8-sub-1-round-9m	kpi-2569-2-2-8	kpi-2569-2-2-8-sub-1	round-9m	442025106.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 44 โครงการ (394,143,159 บาท) | รอบ 9 เดือน: 56 โครงการ (442,025,106 บาท)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.016
res-sub-kpi-2569-2-2-8-sub-2-round-6m	kpi-2569-2-2-8	kpi-2569-2-2-8-sub-2	round-6m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:11.018
res-sub-kpi-2569-2-2-8-sub-2-round-9m	kpi-2569-2-2-8	kpi-2569-2-2-8-sub-2	round-9m	\N	-	\N	\N	นางสาวเพชรน้อย ยอดอยู่ดี	submitted	2026-11-08 00:04:11.02
res-kpi-2569-2-2-8-round-6m	kpi-2569-2-2-8	\N	round-6m	2.75	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รายรับจากโครงการบริการวิชาการแบบคิดค่าบริการทั้งหมด (100%): รอบ 6 เดือน = 394,143,159 บาท (44 โครงการ) | รอบ 9 เดือน = 442,025,106 บาท (56 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.021
res-kpi-2569-2-2-8-round-9m	kpi-2569-2-2-8	\N	round-9m	3.10	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รายรับจากโครงการบริการวิชาการแบบคิดค่าบริการทั้งหมด (100%): รอบ 6 เดือน = 394,143,159 บาท (44 โครงการ) | รอบ 9 เดือน = 442,025,106 บาท (56 โครงการ)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.023
res-sub-kpi-2569-2-2-9-sub-1-round-6m	kpi-2569-2-2-9	kpi-2569-2-2-9-sub-1	round-6m	120247268.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.031
res-sub-kpi-2569-2-2-9-sub-1-round-9m	kpi-2569-2-2-9	kpi-2569-2-2-9-sub-1	round-9m	153849728.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.033
res-sub-kpi-2569-2-2-9-sub-2-round-6m	kpi-2569-2-2-9	kpi-2569-2-2-9-sub-2	round-6m	51930631.94	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.035
res-sub-kpi-2569-2-2-9-sub-2-round-9m	kpi-2569-2-2-9	kpi-2569-2-2-9-sub-2	round-9m	51930631.94	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.036
res-kpi-2569-2-2-9-round-6m	kpi-2569-2-2-9	\N	round-6m	131.55	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รายได้ปีที่ผ่านมา (ปีฐาน): 51,930,631.94 บาท | รายได้ปีปัจจุบัน รอบ 6 เดือน: 120,247,268 บาท (เพิ่มขึ้น +131.55%) | รอบ 9 เดือน: 153,849,728 บาท (เพิ่มขึ้น +196.26%)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.037
res-kpi-2569-2-2-9-round-9m	kpi-2569-2-2-9	\N	round-9m	196.26	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รายได้ปีที่ผ่านมา (ปีฐาน): 51,930,631.94 บาท | รายได้ปีปัจจุบัน รอบ 6 เดือน: 120,247,268 บาท (เพิ่มขึ้น +131.55%) | รอบ 9 เดือน: 153,849,728 บาท (เพิ่มขึ้น +196.26%)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.038
res-sub-kpi-2569-2-2-10-sub-1-round-6m	kpi-2569-2-2-10	kpi-2569-2-2-10-sub-1	round-6m	26.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.043
res-sub-kpi-2569-2-2-10-sub-1-round-9m	kpi-2569-2-2-10	kpi-2569-2-2-10-sub-1	round-9m	30.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.044
res-sub-kpi-2569-2-2-10-sub-2-round-6m	kpi-2569-2-2-10	kpi-2569-2-2-10-sub-2	round-6m	24.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.047
res-sub-kpi-2569-2-2-10-sub-2-round-9m	kpi-2569-2-2-10	kpi-2569-2-2-10-sub-2	round-9m	24.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.049
res-kpi-2569-2-2-10-round-6m	kpi-2569-2-2-10	\N	round-6m	26.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	ปีที่ผ่านมา: 24 รายการ | ปีปัจจุบัน รอบ 6 เดือน: 26 รายการ | รอบ 9 เดือน: 30 รายการ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.052
res-kpi-2569-2-2-10-round-9m	kpi-2569-2-2-10	\N	round-9m	30.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	ปีที่ผ่านมา: 24 รายการ | ปีปัจจุบัน รอบ 6 เดือน: 26 รายการ | รอบ 9 เดือน: 30 รายการ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.055
res-sub-kpi-2569-2-2-13-sub-1-round-6m	kpi-2569-2-2-13	kpi-2569-2-2-13-sub-1	round-6m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.065
res-sub-kpi-2569-2-2-13-sub-1-round-9m	kpi-2569-2-2-13	kpi-2569-2-2-13-sub-1	round-9m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.067
res-sub-kpi-2569-2-2-13-sub-2-round-6m	kpi-2569-2-2-13	kpi-2569-2-2-13-sub-2	round-6m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.072
res-sub-kpi-2569-2-2-13-sub-2-round-9m	kpi-2569-2-2-13	kpi-2569-2-2-13-sub-2	round-9m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.074
res-kpi-2569-2-2-13-round-6m	kpi-2569-2-2-13	\N	round-6m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.076
res-kpi-2569-2-2-13-round-9m	kpi-2569-2-2-13	\N	round-9m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.079
res-kpi-2569-2-2-17-round-9m	kpi-2569-2-2-17	\N	round-9m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.101
res-kpi-2569-2-3-1-round-6m	kpi-2569-2-3-1	\N	round-6m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.109
res-kpi-2569-2-3-1-round-9m	kpi-2569-2-3-1	\N	round-9m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.112
res-kpi-2569-2-3-2-round-6m	kpi-2569-2-3-2	\N	round-6m	6.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. ทะเบียนทรัพย์สินทางปัญญา	รอบ 6 เดือน (6 ผลิตภัณฑ์/อนุสิทธิบัตร) และ รอบ 9 เดือน (10 ผลิตภัณฑ์/อนุสิทธิบัตร):\n1. อุปกรณ์ตรวจวัดความสุกของผลไม้แบบไม่ทำลาย\n2. เครื่องกะเทาะเมล็ดพืชเศรษฐกิจ\n3. ระบบควบคุมการให้น้ำและปุ๋ยอัจฉริยะสำหรับพืชโรงเรือน\n4. เครื่องอบแห้งพลังงานแสงอาทิตย์ร่วมกับชีวมวล\n5. ผลิตภัณฑ์อาหารแปรรูปเพื่อสุขภาพจากวัตถุดิบการเกษตร\n6. ระบบคัดแยกคุณภาพผลผลิตทางการเกษตรด้วยภาพถ่ายและ AI\n7-10. ผลงานอนุสิทธิบัตรและต้นแบบนวัตกรรมเครื่องจักรกลเกษตรเพิ่มเติมในรอบ 9 เดือน	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.12
res-kpi-2569-2-3-2-round-9m	kpi-2569-2-3-2	\N	round-9m	10.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. ทะเบียนทรัพย์สินทางปัญญา	รอบ 6 เดือน (6 ผลิตภัณฑ์/อนุสิทธิบัตร) และ รอบ 9 เดือน (10 ผลิตภัณฑ์/อนุสิทธิบัตร):\n1. อุปกรณ์ตรวจวัดความสุกของผลไม้แบบไม่ทำลาย\n2. เครื่องกะเทาะเมล็ดพืชเศรษฐกิจ\n3. ระบบควบคุมการให้น้ำและปุ๋ยอัจฉริยะสำหรับพืชโรงเรือน\n4. เครื่องอบแห้งพลังงานแสงอาทิตย์ร่วมกับชีวมวล\n5. ผลิตภัณฑ์อาหารแปรรูปเพื่อสุขภาพจากวัตถุดิบการเกษตร\n6. ระบบคัดแยกคุณภาพผลผลิตทางการเกษตรด้วยภาพถ่ายและ AI\n7-10. ผลงานอนุสิทธิบัตรและต้นแบบนวัตกรรมเครื่องจักรกลเกษตรเพิ่มเติมในรอบ 9 เดือน	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.125
res-sub-kpi-2569-2-3-3-sub-1-round-6m	kpi-2569-2-3-3	kpi-2569-2-3-3-sub-1	round-6m	934540.00	\N	บริษัท เคยู ดีแม็ค จำกัด / หน่วยวิจัยและนวัตกรรม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.137
res-sub-kpi-2569-2-3-3-sub-1-round-9m	kpi-2569-2-3-3	kpi-2569-2-3-3-sub-1	round-9m	2029000.00	\N	บริษัท เคยู ดีแม็ค จำกัด / หน่วยวิจัยและนวัตกรรม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.14
res-sub-kpi-2569-2-3-3-sub-2-round-6m	kpi-2569-2-3-3	kpi-2569-2-3-3-sub-2	round-6m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.145
res-sub-kpi-2569-2-3-3-sub-2-round-9m	kpi-2569-2-3-3	kpi-2569-2-3-3-sub-2	round-9m	\N	-	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.149
res-kpi-2569-2-3-3-round-6m	kpi-2569-2-3-3	\N	round-6m	934540.00	934,540 บาท	1. หน่วยวิจัยและนวัตกรรม 2. ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ (บริษัท เคยู ดีแม็ค จำกัด)	รายได้จากการใช้ประโยชน์จากผลการวิจัยและนวัตกรรมเกษตร ปีปัจจุบัน: รอบ 6 เดือน = 934,540 บาท | รอบ 9 เดือน = 2,029,000 บาท (บริษัท เคยู ดีแม็ค จำกัด)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.153
res-kpi-2569-2-3-3-round-9m	kpi-2569-2-3-3	\N	round-9m	2029000.00	2,029,000 บาท	1. หน่วยวิจัยและนวัตกรรม 2. ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ (บริษัท เคยู ดีแม็ค จำกัด)	รายได้จากการใช้ประโยชน์จากผลการวิจัยและนวัตกรรมเกษตร ปีปัจจุบัน: รอบ 6 เดือน = 934,540 บาท | รอบ 9 เดือน = 2,029,000 บาท (บริษัท เคยู ดีแม็ค จำกัด)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.157
res-kpi-2569-3-1-1-round-6m	kpi-2569-3-1-1	\N	round-6m	20.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 20 กิจกรรม/โครงการ (19 โครงการ โดยลำดับที่ 18 จัดกิจกรรม 2 ครั้ง) | รอบ 9 เดือน: 24 กิจกรรม/โครงการ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.165
res-kpi-2569-3-1-1-round-9m	kpi-2569-3-1-1	\N	round-9m	24.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: 20 กิจกรรม/โครงการ (19 โครงการ โดยลำดับที่ 18 จัดกิจกรรม 2 ครั้ง) | รอบ 9 เดือน: 24 กิจกรรม/โครงการ	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.17
res-kpi-2569-3-1-2-round-6m	kpi-2569-3-1-2	\N	round-6m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.178
res-kpi-2569-3-1-2-round-9m	kpi-2569-3-1-2	\N	round-9m	0.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.182
res-kpi-2569-4-1-1-round-6m	kpi-2569-4-1-1	\N	round-6m	17.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน: 17 สถาบัน/องค์กร | รอบ 9 เดือน: 19 สถาบัน/องค์กร	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.205
res-kpi-2569-4-1-1-round-9m	kpi-2569-4-1-1	\N	round-9m	19.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน: 17 สถาบัน/องค์กร | รอบ 9 เดือน: 19 สถาบัน/องค์กร	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.209
res-kpi-2569-4-1-2-round-6m	kpi-2569-4-1-2	\N	round-6m	11.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน: 11 สถาบัน/องค์กร | รอบ 9 เดือน: 17 สถาบัน/องค์กร	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.217
res-kpi-2569-4-1-2-round-9m	kpi-2569-4-1-2	\N	round-9m	17.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. หน่วยวิเทศสัมพันธ์	รอบ 6 เดือน: 11 สถาบัน/องค์กร | รอบ 9 เดือน: 17 สถาบัน/องค์กร	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.221
res-kpi-2569-4-1-3-round-6m	kpi-2569-4-1-3	\N	round-6m	3.00	\N	1. หน่วยวิเทศสัมพันธ์ 2. หน่วยวิจัยและนวัตกรรม	รอบ 6 เดือน: 3 ความร่วมมือ | รอบ 9 เดือน: 6 ความร่วมมือ	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.229
res-kpi-2569-4-1-3-round-9m	kpi-2569-4-1-3	\N	round-9m	6.00	\N	1. หน่วยวิเทศสัมพันธ์ 2. หน่วยวิจัยและนวัตกรรม	รอบ 6 เดือน: 3 ความร่วมมือ | รอบ 9 เดือน: 6 ความร่วมมือ	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.234
res-sub-kpi-2569-4-1-4-sub-1-round-6m	kpi-2569-4-1-4	kpi-2569-4-1-4-sub-1	round-6m	23.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.246
res-sub-kpi-2569-4-1-4-sub-1-round-9m	kpi-2569-4-1-4	kpi-2569-4-1-4-sub-1	round-9m	35.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.25
res-sub-kpi-2569-4-1-4-sub-2-round-6m	kpi-2569-4-1-4	kpi-2569-4-1-4-sub-2	round-6m	224.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.256
res-sub-kpi-2569-4-1-4-sub-2-round-9m	kpi-2569-4-1-4	kpi-2569-4-1-4-sub-2	round-9m	252.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.259
res-kpi-2569-4-1-4-round-6m	kpi-2569-4-1-4	\N	round-6m	247.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 247 โครงการ (โครงการวิจัยร่วม 23 โครงการ + โครงการบริการวิชาการร่วม 224 โครงการ) | รอบ 9 เดือน: รวม 287 โครงการ (โครงการวิจัยร่วม 35 โครงการ + โครงการบริการวิชาการร่วม 252 โครงการ)	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.262
res-kpi-2569-4-1-4-round-9m	kpi-2569-4-1-4	\N	round-9m	287.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 247 โครงการ (โครงการวิจัยร่วม 23 โครงการ + โครงการบริการวิชาการร่วม 224 โครงการ) | รอบ 9 เดือน: รวม 287 โครงการ (โครงการวิจัยร่วม 35 โครงการ + โครงการบริการวิชาการร่วม 252 โครงการ)	นางสาวปฐมาภรณ์ อุ่นเรือน / นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.267
res-sub-kpi-2569-4-1-5-sub-1-round-6m	kpi-2569-4-1-5	kpi-2569-4-1-5-sub-1	round-6m	22.00	\N	\N	\N	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.278
res-sub-kpi-2569-4-1-5-sub-1-round-9m	kpi-2569-4-1-5	kpi-2569-4-1-5-sub-1	round-9m	35.00	\N	\N	\N	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.281
res-sub-kpi-2569-4-1-5-sub-2-round-6m	kpi-2569-4-1-5	kpi-2569-4-1-5-sub-2	round-6m	8.00	\N	\N	\N	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.288
res-sub-kpi-2569-4-1-5-sub-2-round-9m	kpi-2569-4-1-5	kpi-2569-4-1-5-sub-2	round-9m	10.00	\N	\N	\N	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.292
res-kpi-2569-4-1-5-round-6m	kpi-2569-4-1-5	\N	round-6m	30.00	\N	หน่วยวิเทศสัมพันธ์ คณะวิศวกรรมศาสตร์ กำแพงแสน	รอบ 6 เดือน: รวม 30 ราย (ความร่วมมือ 22 ราย + รับบริการ 8 ราย) | รอบ 9 เดือน: รวม 45 ราย (ความร่วมมือ 35 ราย + รับบริการ 10 ราย)	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.296
res-kpi-2569-4-1-5-round-9m	kpi-2569-4-1-5	\N	round-9m	45.00	\N	หน่วยวิเทศสัมพันธ์ คณะวิศวกรรมศาสตร์ กำแพงแสน	รอบ 6 เดือน: รวม 30 ราย (ความร่วมมือ 22 ราย + รับบริการ 8 ราย) | รอบ 9 เดือน: รวม 45 ราย (ความร่วมมือ 35 ราย + รับบริการ 10 ราย)	นางสาวปฐมาภรณ์ อุ่นเรือน	submitted	2026-11-08 00:04:11.304
res-sub-kpi-2569-4-1-6-sub-1-round-6m	kpi-2569-4-1-6	kpi-2569-4-1-6-sub-1	round-6m	16.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.321
res-sub-kpi-2569-4-1-6-sub-1-round-9m	kpi-2569-4-1-6	kpi-2569-4-1-6-sub-1	round-9m	45.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.324
res-sub-kpi-2569-4-1-6-sub-2-round-6m	kpi-2569-4-1-6	kpi-2569-4-1-6-sub-2	round-6m	23.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.329
res-sub-kpi-2569-4-1-6-sub-2-round-9m	kpi-2569-4-1-6	kpi-2569-4-1-6-sub-2	round-9m	51.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.333
res-kpi-2569-4-1-6-round-6m	kpi-2569-4-1-6	\N	round-6m	0.70	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: บทความวิจัยร่วม 16 บทความ จาก 23 บทความ (สัดส่วน 0.70) | รอบ 9 เดือน: บทความวิจัยร่วม 45 บทความ จาก 51 บทความ (สัดส่วน 0.88)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.336
res-kpi-2569-4-1-6-round-9m	kpi-2569-4-1-6	\N	round-9m	0.88	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก.	รอบ 6 เดือน: บทความวิจัยร่วม 16 บทความ จาก 23 บทความ (สัดส่วน 0.70) | รอบ 9 เดือน: บทความวิจัยร่วม 45 บทความ จาก 51 บทความ (สัดส่วน 0.88)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.341
res-sub-kpi-2569-4-1-7-sub-1-round-6m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-1	round-6m	224.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.349
res-sub-kpi-2569-4-1-7-sub-1-round-9m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-1	round-9m	252.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.35
res-sub-kpi-2569-4-1-7-sub-2-round-6m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-2	round-6m	23.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.359
res-sub-kpi-2569-4-1-7-sub-2-round-9m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-2	round-9m	35.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.36
res-sub-kpi-2569-4-1-7-sub-3-round-6m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-3	round-6m	247.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.364
res-sub-kpi-2569-4-1-7-sub-3-round-9m	kpi-2569-4-1-7	kpi-2569-4-1-7-sub-3	round-9m	287.00	\N	\N	\N	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.366
res-kpi-2569-4-1-7-round-6m	kpi-2569-4-1-7	\N	round-6m	1.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 247 โครงการ (บริการวิชาการร่วม 224 + วิจัยร่วม 23) | รอบ 9 เดือน: รวม 287 โครงการ (บริการวิชาการร่วม 252 + วิจัยร่วม 35)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.37
res-kpi-2569-4-1-7-round-9m	kpi-2569-4-1-7	\N	round-9m	1.00	\N	1. หน่วยวิจัยและนวัตกรรม 2. สวพ.มก. 3. สำนักนวัตกรรมและพันธกิจเพื่อสังคม	รอบ 6 เดือน: รวม 247 โครงการ (บริการวิชาการร่วม 224 + วิจัยร่วม 23) | รอบ 9 เดือน: รวม 287 โครงการ (บริการวิชาการร่วม 252 + วิจัยร่วม 35)	นางสาวธัญรดี เกษม	submitted	2026-11-08 00:04:11.372
\.


--
-- Data for Name: strategic_indicators; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.strategic_indicators (id, strategy_id, plan_id, code, title, description, category, fiscal_year, collection_period, value_type, reporting_levels, unit, target_operator, target_value, target_label, department_target, formula_method, calc_type, dataset_key, active_round_ids, reporters, responsible_unit, created_at, updated_at, dataset_keys, manual_excluded_project_ids, manual_included_project_ids) FROM stdin;
kpi-2569-1-1-1	strat-1-1	plan-1-1-1	1.1-1 (1)	ร้อยละของหลักสูตรภายใน KU.KPS ได้รับการรับรองตามมาตรฐานการศึกษาในระดับสากล	จำนวนหลักสูตรภายใน KU.KPS ที่ได้รับการรับรองตามมาตรฐานการศึกษาระดับสากล คิดเป็นร้อยละของหลักสูตรทั้งหมดของวิทยาเขตกำแพงแสนในปีการศึกษานั้น (AUN-QA, ABET, AACSB ฯลฯ)	academic	2569	ปีการศึกษา	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	15.00	\N	\N	PERCENTAGE	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	งานบริการการศึกษา / คณะวิศวกรรมศาสตร์ กำแพงแสน	2026-11-08 00:04:10.697	2026-11-08 00:04:10.697	{}	{}	{}
kpi-2569-1-1-2	strat-1-1	plan-1-1-2	1.1-2 (2)	จำนวนหลักสูตรที่พัฒนาขึ้นเพื่อการเรียนรู้ตลอดชีวิต (Non-degree / Double Degree / หลักสูตรนานาชาติ / หลักสูตรระยะสั้น SDGs)	จำนวนหลักสูตรในระดับปริญญา (Degree) และหลักสูตรระยะสั้น (Non-Degree) รวมถึงโครงการฝึกอบรมเพื่อพัฒนาทักษะ (Upskill/Reskill) ที่พัฒนาหรือปรับปรุงขึ้นเพื่อส่งเสริมการเรียนรู้ตลอดชีวิต	academic	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	หลักสูตร	gte	10.00	\N	\N	DIRECT	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	งานบริการการศึกษา / คณะวิศวกรรมศาสตร์ กำแพงแสน	2026-11-08 00:04:10.715	2026-11-08 00:04:10.715	{}	{}	{}
kpi-2569-1-1-3	strat-1-1	plan-1-1-2	1.1-2 (3)	ร้อยละของผู้เรียนที่นำความรู้ที่ได้รับไปใช้ประโยชน์ (หลักสูตรการเรียนรู้ตลอดชีวิต)	จำนวนผู้สำเร็จการศึกษา/ผ่านการอบรมในหลักสูตรเพื่อการเรียนรู้ตลอดชีวิตที่สามารถนำความรู้หรือทักษะไปประยุกต์ใช้ในการทำงาน การประกอบอาชีพ หรือพัฒนาตนเองได้จริง	academic	2569	ปีการศึกษา	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	20.00	\N	\N	PERCENTAGE	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	คณะวิศวกรรมศาสตร์ กำแพงแสน	2026-11-08 00:04:10.721	2026-11-08 00:04:10.721	{}	{}	{}
kpi-2569-1-1-4	strat-1-1	plan-1-1-3	1.1-3 (4)	จำนวนผลงาน/รางวัลของนิสิตในระดับประเทศและระดับสากล	จำนวนผลงานหรือรางวัลที่นิสิตได้รับจากการประกวด แข่งขัน หรือการนำเสนอผลงานทางวิชาการ วิชาชีพ นวัตกรรม คุณธรรมจริยธรรม ทั้งในระดับชาติและระดับนานาชาติ	academic	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ผลงาน/รางวัล	gte	55.00	\N	\N	SUM	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี"}	งานกิจการนิสิต / งานบริการการศึกษา	2026-11-08 00:04:10.743	2026-11-08 00:04:10.743	{}	{}	{}
kpi-2569-1-2-1	strat-1-2	plan-1-2-1	1.2-1 (1)	จำนวน Platform หรือสิ่งสนับสนุน/แหล่งเรียนรู้ ที่สร้างผลกระทบต่อการจัดการเรียนการสอนและการเรียนรู้ตลอดชีวิต	จำนวนแพลตฟอร์มดิจิทัล ระบบเทคโนโลยีสารสนเทศ สื่อการเรียนรู้ หรือแหล่งเรียนรู้รูปแบบใหม่ที่พัฒนาหรือนำมาใช้เพื่อสนับสนุนการเรียนการสอนและการเรียนรู้ตลอดชีวิต	academic	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	Platform	gte	5.00	\N	\N	DIRECT	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	งานบริการการศึกษา	2026-11-08 00:04:10.77	2026-11-08 00:04:10.77	{}	{}	{}
kpi-2569-1-2-2	strat-1-2	plan-1-2-1	1.2-1 (2)	จำนวนรายวิชาที่มีการนำเทคโนโลยี/Platform/สิ่งสนับสนุนการเรียนรู้ไปใช้ประโยชน์	จำนวนรายวิชาที่เปิดสอนและมีการบูรณาการนำเทคโนโลยีดิจิทัล แพลตฟอร์มการเรียนรู้ออนไลน์ หรือสิ่งสนับสนุนการเรียนรู้สมัยใหม่ไปใช้ในการเรียนการสอนและการวัดประเมินผล	academic	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	รายวิชา	gte	5.00	\N	\N	DIRECT	manual	academic	{round-6m,round-9m}	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	งานบริการการศึกษา	2026-11-08 00:04:10.774	2026-11-08 00:04:10.774	{}	{}	{}
kpi-2569-1-2-3	strat-1-2	plan-1-2-1	1.2-1 (3)	ค่าเฉลี่ยระดับความพึงพอใจของบุคลากรและผู้เรียนต่อ Platform/สิ่งสนับสนุน/แหล่งเรียนรู้	ค่าเฉลี่ยคะแนนความพึงพอใจของบุคลากรและผู้เรียนที่มีต่อการใช้งานแพลตฟอร์ม สิ่งสนับสนุนการเรียนรู้ และแหล่งเรียนรู้ภายในวิทยาเขตกำแพงแสน (คะแนนเต็ม 5.00)	academic	2569	ปีการศึกษา	ค่าเฉลี่ย	{ส่วนงาน}	ค่าเฉลี่ย	gte	4.00	\N	\N	AVERAGE	manual	academic	{round-6m,round-9m}	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	คณะวิศวกรรมศาสตร์ กำแพงแสน	2026-11-08 00:04:10.78	2026-11-08 00:04:10.78	{}	{}	{}
kpi-2569-1-2-4	strat-1-2	plan-1-2-2	1.2-2 (4)	ระดับคะแนนผลการประเมินตามเกณฑ์คุณภาพการศึกษาเพื่อการดำเนินการที่เป็นเลิศ (EdPEx)	ระดับคะแนนผลการประเมินคุณภาพองค์กรตามเกณฑ์คุณภาพการศึกษาเพื่อการดำเนินการที่เป็นเลิศ (Education Criteria for Performance Excellence: EdPEx)	strategy	2569	ปีการศึกษา	คะแนน	{ส่วนงาน}	คะแนน	gte	300.00	\N	\N	DIRECT	manual	academic	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	งานประกันคุณภาพการศึกษา	2026-11-08 00:04:10.796	2026-11-08 00:04:10.796	{}	{}	{}
kpi-2569-1-2-6	strat-1-2	plan-1-2-3	1.2-3 (6)	จำนวนระบบฐานข้อมูลที่ตอบสนองการดำเนินงานของ KU.KPS (ระบบ BI และ Paperless)	จำนวนระบบฐานข้อมูลหรือระบบสารสนเทศเพื่อการบริหารจัดการที่ได้รับการพัฒนาหรือปรับปรุงให้สามารถเชื่อมโยงและสนับสนุนการตัดสินใจของผู้บริหาร (โครงการพัฒนาระบบ Business Intelligence เพื่อสนับสนุนการตัดสินใจของผู้บริหาร)	strategy	2569	ปีการศึกษา	จำนวนนับ	{คณะ,ส่วนงาน}	ระบบ	gte	1.00	\N	1	SUM	manual	research	{round-6m,round-9m}	{"นางนภัสวรรณ คำฝั้น"}	หน่วยวิจัยและนวัตกรรม / สำนักงานเลขานุการ	2026-11-08 00:04:10.799	2026-11-08 00:04:10.799	{}	{}	{}
kpi-2569-1-3-1	strat-1-3	plan-1-3-1	1.3-1 (1)	ร้อยละบุคลากรที่ได้รับการพัฒนาทักษะด้านการสอนด้วยเทคโนโลยีสมัยใหม่	จำนวนบุคลากรสายวิชาการที่ผ่านการอบรมหรือพัฒนาทักษะการจัดการเรียนการสอนโดยใช้เทคโนโลยีสมัยใหม่ นวัตกรรมการเรียนรู้ หรือ AI คิดเป็นร้อยละของอาจารย์ทั้งหมด	personnel	2569	ปีการศึกษา	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	60.00	\N	\N	PERCENTAGE	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี","นางสาวปิยวรรณ จันทร์สี"}	งานบุคคล / งานบริการการศึกษา	2026-11-08 00:04:10.81	2026-11-08 00:04:10.81	{}	{}	{}
kpi-2569-1-3-2	strat-1-3	plan-1-3-1	1.3-1 (2)	จำนวนอาจารย์ที่ได้รับการรับรองตามกรอบสมรรถนะวิชาชีพอาจารย์ (PSF / KUPSF)	จำนวนอาจารย์ประจำที่ได้รับการรับรองสมรรถนะวิชาชีพอาจารย์ตามกรอบมาตรฐาน UKPSF, Thailand PSF หรือ KUPSF ในปีการศึกษานั้น	personnel	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ราย	gte	5.00	\N	\N	DIRECT	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี","รศ.ดร.สิรินาฏ น้อยพิทักษ์"}	งานบุคคล / ฝ่ายวิชาการ	2026-11-08 00:04:10.824	2026-11-08 00:04:10.824	{}	{}	{}
kpi-2569-1-3-3	strat-1-3	plan-1-3-1	1.3-1 (3)	จำนวนอาจารย์ที่ได้รับการรับรองสมรรถนะตามมาตรฐานวิชาชีพ (ใบอนุญาตประกอบวิชาชีพวิศวกรรมควบคุม กว.)	จำนวนอาจารย์ประจำที่มีใบอนุญาตประกอบวิชาชีพ หรือได้รับการรับรองสมรรถนะตามมาตรฐานวิชาชีพจากองค์กรวิชาชีพที่เป็นที่ยอมรับ (เช่น สภาวิศวกร กว.)	personnel	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ราย	gte	5.00	\N	\N	DIRECT	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	งานบุคคล / คณะวิศวกรรมศาสตร์ กำแพงแสน	2026-11-08 00:04:10.829	2026-11-08 00:04:10.829	{}	{}	{}
kpi-2569-1-3-4	strat-1-3	plan-1-3-1	1.3-1 (4)	จำนวนบุคลากรที่ได้รับการแต่งตั้งเป็นกรรมการ/ที่ปรึกษา/วิทยากร ในองค์กรหรือหน่วยงานระดับนานาชาติ	จำนวนบุคลากรที่ได้รับเชิญหรือแต่งตั้งให้ดำรงตำแหน่งกรรมการ ที่ปรึกษา กองบรรณาธิการวารสารวิชาการนานาชาติ ผู้ทรงคุณวุฒิประเมินบทความวิชาการระดับนานาชาติ หรือวิทยากรในระดับนานาชาติ	personnel	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ราย	gte	10.00	\N	\N	DIRECT	manual	personnel	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม / หน่วยวิเทศสัมพันธ์	2026-11-08 00:04:10.835	2026-11-08 00:04:10.835	{}	{}	{}
kpi-2569-1-3-5	strat-1-3	plan-1-3-1	1.3-1 (5)	จำนวนบุคลากรที่ได้รับรางวัลในระดับนานาชาติ	จำนวนบุคลากรของวิทยาเขตกำแพงแสนที่ได้รับรางวัลเชิดชูเกียรติ รางวัลผลงานวิจัย/สิ่งประดิษฐ์ หรือรางวัลทางวิชาการในเวทีระดับนานาชาติ	personnel	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ราย	gte	4.00	\N	\N	DIRECT	manual	personnel	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.845	2026-11-08 00:04:10.845	{}	{}	{}
kpi-2569-1-3-6	strat-1-3	plan-1-3-1	1.3-1 (6)	จำนวนบุคลากรที่ได้แลกเปลี่ยนกับสถาบันการศึกษาต่างประเทศ (Professor Visiting)	จำนวนบุคลากรสายวิชาการและนักวิจัยที่เดินทางไปแลกเปลี่ยน ทำวิจัยระยะสั้น สอน หรือปฏิบัติงานทางวิชาการ (Visiting Professor / Researcher) ณ สถาบันการศึกษาในต่างประเทศ	personnel	2569	ปีการศึกษา	จำนวนนับ	{ส่วนงาน}	ราย	gte	20.00	\N	\N	DIRECT	manual	personnel	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน"}	หน่วยวิเทศสัมพันธ์	2026-11-08 00:04:10.85	2026-11-08 00:04:10.85	{}	{}	{}
kpi-2569-1-3-8	strat-1-3	plan-1-3-1	1.3-1 (8)	ร้อยละของบุคลากรสายสนับสนุนกลุ่มวิชาการ (นักวิจัย) ที่มีตำแหน่งชำนาญการพิเศษขึ้นไป	สัดส่วนบุคลากรสายสนับสนุนกลุ่มวิชาการที่ได้รับการแต่งตั้งให้ดำรงตำแหน่งระดับชำนาญการพิเศษ เชี่ยวชาญ หรือเชี่ยวชาญพิเศษ	personnel	2569	ปีการศึกษา	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	9.00	\N	\N	PERCENTAGE	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	งานบุคคล สำนักงานเลขานุการ	2026-11-08 00:04:10.857	2026-11-08 00:04:10.857	{}	{}	{}
kpi-2569-2-1-1	strat-2-1	plan-2-1-1	2.1-1 (1)	จำนวนบทความวิชาการและบทความวิจัยที่ได้รับการตีพิมพ์ในวารสารระดับนานาชาติ (Scopus / Web of Science)	จำนวนบทความวิชาการ (Review Article) และบทความวิจัย (Research Article) ที่ตีพิมพ์ในวารสารวิชาการระดับนานาชาติที่ปรากฏในฐานข้อมูลสากล (Scopus, Web of Science/ISI)	publications	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	บทความ	gte	330.00	\N	\N	SUM	manual	publications	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.871	2026-11-08 00:04:10.871	{}	{}	{}
kpi-2569-2-1-2	strat-2-1	plan-2-1-1	2.1-1 (2)	ค่าเฉลี่ย H-index ในฐานข้อมูล Scopus ของอาจารย์ประจำและนักวิจัยทั้งหมด	ผลรวมค่า H-index จากฐานข้อมูล Scopus ของอาจารย์ประจำและนักวิจัยทั้งหมด หารด้วยจำนวนอาจารย์ประจำและนักวิจัยทั้งหมดของส่วนงาน	publications	2569	ปีปฏิทิน	สัดส่วน A:B	{ส่วนงาน}	สัดส่วน	gte	3.90	0.6 : 1	\N	RATIO	manual	publications	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.885	2026-11-08 00:04:10.885	{}	{}	{}
kpi-2569-2-1-3	strat-2-1	plan-2-1-1	2.1-1 (3)	จำนวนผลงานวิจัย/นวัตกรรมด้านเกษตร สุขภาพ และสิ่งแวดล้อมที่มีลักษณะบูรณาการข้ามศาสตร์ (สหวิทยาการ)	จำนวนโครงการวิจัยหรือผลงานนวัตกรรมด้านการเกษตร สุขภาพ หรือสิ่งแวดล้อม ที่เกิดจากการบูรณาการองค์ความรู้ข้ามศาสตร์ตั้งแต่ 2 สาขาวิชาขึ้นไป	research	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ผลงาน	gte	70.00	\N	\N	DIRECT	manual	research	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.901	2026-11-08 00:04:10.901	{}	{}	{}
kpi-2569-2-1-5	strat-2-1	plan-2-1-1	2.1-1 (5)	ร้อยละบุคลากรกลุ่มวิชาการที่ได้รับประกาศนียบัตรรับรองการวิจัยในมนุษย์และสัตว์ทดลอง	ร้อยละของบุคลากรสายวิชาการและนักวิจัยที่ผ่านการอบรมและได้รับใบรับรองจริยธรรมการวิจัยในมนุษย์ และ/หรือ จรรยาบรรณการใช้สัตว์เพื่องานทางวิทยาศาสตร์	personnel	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	50.00	\N	\N	PERCENTAGE	manual	personnel	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.91	2026-11-08 00:04:10.91	{}	{}	{}
kpi-2569-2-1-6	strat-2-1	plan-2-1-2	2.1-2 (6)	จำนวนเงินงบประมาณ โครงการวิจัยและบริการวิชาการ ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก (ภาครัฐและเอกชน)	จำนวนเงินงบประมาณรวมของโครงการวิจัย โครงการพัฒนาวิชาการด้านการวิจัย และโครงการบริการวิชาการ ที่ได้รับการสนับสนุนจากแหล่งทุนภายนอกมหาวิทยาลัย (ภาครัฐและเอกชน)	research	2569	ปีงบประมาณ	จำนวนเงิน	{ส่วนงาน}	ล้านบาท	gte	100.00	\N	\N	SUM	manual	research	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.926	2026-11-08 00:04:10.926	{}	{}	{}
kpi-2569-2-1-7	strat-2-1	plan-2-1-2	2.1-2 (7)	จำนวนโครงการวิจัยและบริการวิชาการ ในระดับ Mega Project (≥ 10 ล้านบาท) ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก สะสม	จำนวนโครงการวิจัยและโครงการบริการวิชาการที่มีวงเงินงบประมาณตั้งแต่ 10 ล้านบาทขึ้นไป (Mega Project) ที่ได้รับการสนับสนุนจากหน่วยงานภายนอกมหาวิทยาลัย (สะสม)	research	2569	ปีงบประมาณ	จำนวนนับ	{คณะ,ส่วนงาน}	โครงการ	gte	6.00	\N	2	SUM	manual	research	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.952	2026-11-08 00:04:10.952	{}	{}	{}
kpi-2569-2-2-5	strat-2-2	plan-2-2-2	2.2-2 (5)	จำนวนโครงการบริการวิชาการ ด้านเกษตร สุขภาพ และสิ่งแวดล้อม แบบให้เปล่า ที่สามารถนำไปใช้ประโยชน์และส่งเสริมความเข้มแข็งแก่ชุมชนและสังคม	จำนวนโครงการบริการวิชาการแบบไม่คิดค่าบริการ (ให้เปล่า) ด้านการเกษตร สุขภาพ และสิ่งแวดล้อม ที่ถ่ายทอดองค์ความรู้หรือเทคโนโลยีสู่ชุมชนและสังคม	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	โครงการ	gte	35.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.976	2026-11-08 00:04:10.976	{}	{}	{}
kpi-2569-2-2-6	strat-2-2	plan-2-2-2	2.2-2 (6)	จำนวนชุมชนที่เข้าร่วมโครงการบริการวิชาการด้านเกษตร สุขภาพ และสิ่งแวดล้อม แบบให้เปล่า ที่สามารถนำความรู้ไปใช้ประโยชน์ในการประกอบอาชีพและสร้างรายได้	จำนวนชุมชน วิสาหกิจชุมชน หรือกลุ่มเกษตรกร ที่เข้าร่วมโครงการบริการวิชาการแบบให้เปล่าและนำองค์ความรู้ไปประยุกต์ใช้ในการประกอบอาชีพ ลดต้นทุน หรือเพิ่มรายได้	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ชุมชน	gte	30.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.984	2026-11-08 00:04:10.984	{}	{}	{}
kpi-2569-2-2-7	strat-2-2	plan-2-2-2	2.2-2 (7)	จำนวนหน่วยงานภาครัฐ/เอกชน ที่ได้รับบริการวิชาการแบบให้เปล่า/แบบคิดค่าบริการ จาก KU.KPS	จำนวนหน่วยงานภาครัฐ รัฐวิสาหกิจ และภาคเอกชน ที่ได้รับการบริการวิชาการ การทดสอบวิเคราะห์ หรือคำปรึกษาทางวิชาการ ทั้งแบบให้เปล่าและแบบคิดค่าบริการ	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	หน่วยงาน	gte	20.00	\N	\N	SUM	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:10.992	2026-11-08 00:04:10.992	{}	{}	{}
kpi-2569-2-2-8	strat-2-2	plan-2-2-2	2.2-2 (8)	สัดส่วนของรายรับจากบริการวิชาการแบบคิดค่าบริการที่ได้จากภายนอกมหาวิทยาลัย ต่ออาจารย์ประจำและนักวิจัย	สัดส่วนรายรับจากโครงการบริการวิชาการแบบคิดค่าบริการทั้งหมด (100%) ที่ได้รับจากหน่วยงานภายนอก ต่อจำนวนอาจารย์ประจำและนักวิจัยทั้งหมด	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ล้านบาท/ราย	gte	1.60	1.6 : 1	\N	SUM	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.008	2026-11-08 00:04:11.008	{}	{}	{}
kpi-2569-2-2-9	strat-2-2	plan-2-2-3	2.2-3 (9)	ร้อยละของรายได้จากการใช้ประโยชน์จากบริการวิชาการและผลงานสร้างสรรค์ด้านการเกษตรและนวัตกรรมการเกษตรเพิ่มขึ้นจากปีฐาน	อัตราการเติบโตของรายได้จากการให้บริการวิชาการและผลงานสร้างสรรค์ด้านการเกษตรและนวัตกรรมการเกษตร เทียบกับปีงบประมาณที่ผ่านมา	service	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	10.00	\N	\N	PERCENTAGE	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.025	2026-11-08 00:04:11.025	{}	{}	{}
kpi-2569-2-2-10	strat-2-2	plan-2-2-3	2.2-3 (10)	จำนวนบริการวิชาการและนวัตกรรมด้านการเกษตรที่นำออกไปเผยแพร่เพิ่มขึ้น	จำนวนโครงการบริการวิชาการและผลงานนวัตกรรมด้านการเกษตรที่นำออกไปเผยแพร่หรือถ่ายทอดเทคโนโลยีสู่สังคมเพิ่มขึ้นจากปีที่ผ่านมา	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	บริการวิชาการ/นวัตกรรม	gte	20.00	\N	\N	SUM	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.04	2026-11-08 00:04:11.04	{}	{}	{}
kpi-2569-2-2-13	strat-2-2	plan-2-2-5	2.2-5 (13)	ร้อยละของรายได้จากการใช้ประโยชน์จากบริการวิชาการและผลงานสร้างสรรค์ด้านการสร้างอาชีพและการเพิ่มรายได้เสริมเพิ่มขึ้นจากปีฐาน	ร้อยละที่เพิ่มขึ้นของรายได้จากการให้บริการวิชาการและผลงานสร้างสรรค์ด้านการสร้างอาชีพและการเพิ่มรายได้เสริมเทียบกับปีที่ผ่านมา	service	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	10.00	\N	\N	PERCENTAGE	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.058	2026-11-08 00:04:11.058	{}	{}	{}
kpi-2569-2-2-14	strat-2-2	plan-2-2-5	2.2-5 (14)	จำนวนบริการวิชาการที่สร้างอาชีพและการเพิ่มรายได้ให้แก่มหาวิทยาลัยเพิ่มขึ้น	จำนวนหลักสูตรฝึกอบรมหรือโครงการบริการวิชาการที่มุ่งเน้นการสร้างอาชีพและเพิ่มรายได้ให้แก่มหาวิทยาลัยเพิ่มขึ้นจากปีฐาน	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	บริการวิชาการ	gte	20.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.082	2026-11-08 00:04:11.082	{}	{}	{}
kpi-2569-2-2-17	strat-2-2	plan-2-2-5	2.2-5 (17)	จำนวนบริการวิชาการที่แก้ไขปัญหาสิ่งแวดล้อมที่ร่วมกับหน่วยงานภายนอกเพิ่มขึ้น	จำนวนโครงการบริการวิชาการด้านการจัดการสิ่งแวดล้อม พลังงานสะอาด การจัดการน้ำ หรือมลพิษ ที่ดำเนินการร่วมกับหน่วยงานภายนอกเพิ่มขึ้น	service	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	บริการวิชาการ	gte	20.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.093	2026-11-08 00:04:11.093	{}	{}	{}
kpi-2569-2-3-1	strat-2-3	plan-2-3-1	2.3-1 (1)	ร้อยละของรายได้จากการจำหน่ายผลิตภัณฑ์ทางการเกษตรเพิ่มขึ้นจากปีฐาน	ร้อยละที่เพิ่มขึ้นของรายได้จากการจำหน่ายผลิตภัณฑ์ทางการเกษตรและแปรรูปของส่วนงานเทียบกับปีงบประมาณที่ผ่านมา	ip	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	10.00	\N	\N	PERCENTAGE	manual	ip	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.105	2026-11-08 00:04:11.105	{}	{}	{}
kpi-2569-2-3-2	strat-2-3	plan-2-3-1	2.3-1 (2)	จำนวนผลิตภัณฑ์ทางการเกษตรที่ได้รับการพัฒนาสู่เชิงพาณิชย์ (ยื่นจดทรัพย์สินทางปัญญา/อนุสิทธิบัตร)	จำนวนผลิตภัณฑ์ทางการเกษตร เครื่องจักรกลเกษตร หรือนวัตกรรมอาหาร/เกษตร ที่ได้รับการพัฒนาต่อยอดสู่เชิงพาณิชย์หรือจดทะเบียนทรัพย์สินทางปัญญา	ip	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ผลิตภัณฑ์	gte	30.00	\N	\N	DIRECT	manual	ip	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.116	2026-11-08 00:04:11.116	{}	{}	{}
kpi-2569-2-3-3	strat-2-3	plan-2-3-2	2.3-2 (3)	ร้อยละของรายได้จากการใช้ประโยชน์จากผลการวิจัยและนวัตกรรมเกษตร	รายได้จากการถ่ายทอดเทคโนโลยี ค่าใช้สิทธิ (Licensing) หรือการนำผลงานวิจัยและนวัตกรรมเกษตรไปใช้ประโยชน์เชิงพาณิชย์ (เช่น ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ / บริษัท เคยู ดีแม็ค จำกัด)	ip	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	10.00	\N	\N	PERCENTAGE	manual	ip	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม / ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ	2026-11-08 00:04:11.129	2026-11-08 00:04:11.129	{}	{}	{}
kpi-2569-3-1-1	strat-3-1	plan-3-1-1	3.1-1 (1)	จำนวนกิจกรรม/โครงการ งานวิจัยและบริการวิชาการ ที่มุ่งเน้นความยั่งยืน การอนุรักษ์ทรัพยากรธรรมชาติ และการลดการใช้ทรัพยากรและพลังงาน	จำนวนกิจกรรมหรือโครงการวิจัยและบริการวิชาการที่สนับสนุนเป้าหมายการพัฒนาที่ยั่งยืน (SDGs) การลดก๊าซเรือนกระจก การอนุรักษ์ทรัพยากรน้ำ ดิน และพลังงานสะอาด	strategy	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	กิจกรรม/โครงการ	gte	100.00	\N	\N	DIRECT	manual	research	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.161	2026-11-08 00:04:11.161	{}	{}	{}
kpi-2569-3-1-2	strat-3-1	plan-3-1-1	3.1-1 (2)	จำนวนความร่วมมือในการปรับตัวกับการเปลี่ยนแปลงสภาพภูมิอากาศ	จำนวนความร่วมมือทางวิชาการหรือโครงการร่วมกับหน่วยงานภายนอกในการรับมือและปรับตัวต่อการเปลี่ยนแปลงสภาพภูมิอากาศ (Climate Adaptation)	strategy	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ความร่วมมือ	gte	15.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม / คณะ	2026-11-08 00:04:11.174	2026-11-08 00:04:11.174	{}	{}	{}
kpi-2569-3-2-1	strat-3-2	plan-3-2-1	3.2-1 (1)	ร้อยละความสำเร็จในการจัดทำแผนทำนุบำรุงศิลปวัฒนธรรมที่สอดคล้องกับค่านิยมของ KU.KPS	ความสำเร็จของการจัดทำและขับเคลื่อนแผนทำนุบำรุงศิลปวัฒนธรรมที่สอดคล้องกับอัตลักษณ์และค่านิยมของมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน	strategy	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	100.00	\N	\N	PERCENTAGE	manual	academic	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี","นางรัตนา เขียวแก้ว"}	สำนักงานเลขานุการ	2026-11-08 00:04:11.185	2026-11-08 00:04:11.185	{}	{}	{}
kpi-2569-3-2-2	strat-3-2	plan-3-2-1	3.2-1 (2)	ร้อยละของบุคลากรที่ได้รับการพัฒนาตามค่านิยมขององค์กร	สัดส่วนบุคลากรที่เข้าร่วมกิจกรรมหรือโครงการพัฒนาบุคลากรตามค่านิยมองค์กรของมหาวิทยาลัย	personnel	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	100.00	\N	\N	PERCENTAGE	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี","รศ.ดร.สิรินาฏ น้อยพิทักษ์"}	งานบุคคล สำนักงานเลขานุการ	2026-11-08 00:04:11.191	2026-11-08 00:04:11.191	{}	{}	{}
kpi-2569-3-2-3	strat-3-2	plan-3-2-1	3.2-1 (3)	ร้อยละบุคลากรที่มีผลการประเมิน Core Competency ตามที่มหาวิทยาลัยคาดหวัง	ร้อยละของบุคลากรที่มีผลการประเมินสมรรถนะหลัก (Core Competency) ผ่านเกณฑ์ตามที่มหาวิทยาลัยคาดหวัง	personnel	2569	ปีงบประมาณ	ร้อยละ	{ส่วนงาน}	ร้อยละ	gte	80.00	\N	\N	PERCENTAGE	manual	personnel	{round-6m,round-9m}	{"นางสาวเพชรน้อย ยอดอยู่ดี","รศ.ดร.สิรินาฏ น้อยพิทักษ์"}	งานบุคคล สำนักงานเลขานุการ	2026-11-08 00:04:11.195	2026-11-08 00:04:11.195	{}	{}	{}
kpi-2569-4-1-1	strat-4-1	plan-4-1-1	4.1-1 (1)	จำนวนสถาบันการศึกษาและองค์กรที่มีความร่วมมือในประเทศ	จำนวนสถาบันการศึกษา หน่วยงานภาครัฐ และองค์กรภาคเอกชนภายในประเทศ ที่มีความร่วมมือทางวิชาการ การวิจัย หรือการบริการวิชาการร่วมกับส่วนงาน	strategy	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	สถาบัน/องค์กร	gte	45.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน","นางสาวธัญรดี เกษม"}	หน่วยวิเทศสัมพันธ์ / หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.201	2026-11-08 00:04:11.201	{}	{}	{}
kpi-2569-4-1-2	strat-4-1	plan-4-1-1	4.1-1 (2)	จำนวนสถาบันการศึกษาและองค์กรที่มีความร่วมมือต่างประเทศ	จำนวนมหาวิทยาลัย สถาบันวิจัย และองค์กรในต่างประเทศ ที่มีการดำเนินกิจกรรมความร่วมมือทางวิชาการ การแลกเปลี่ยน หรือการวิจัยร่วมกัน	strategy	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	สถาบัน/องค์กร	gte	25.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน","นางสาวธัญรดี เกษม"}	หน่วยวิเทศสัมพันธ์ / หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.212	2026-11-08 00:04:11.212	{}	{}	{}
kpi-2569-4-1-3	strat-4-1	plan-4-1-1	4.1-1 (3)	จำนวนความร่วมมือกับหน่วยงานและองค์กร ทั้งในและต่างประเทศ ที่มีกิจกรรมต่อเนื่อง สะสม	จำนวนข้อตกลงความร่วมมือ (MOU/MOA) กับหน่วยงานและองค์กรทั้งในและต่างประเทศที่มีการจัดกิจกรรมต่อเนื่องร่วมกันอย่างเป็นรูปธรรม (สะสม)	strategy	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ความร่วมมือ	gte	30.00	\N	\N	DIRECT	manual	service	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน","นางสาวธัญรดี เกษม"}	หน่วยวิเทศสัมพันธ์ / หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.225	2026-11-08 00:04:11.225	{}	{}	{}
kpi-2569-4-1-4	strat-4-1	plan-4-1-1	4.1-1 (4)	จำนวนโครงการวิจัยและบริการวิชาการที่มีความร่วมมือกับมหาวิทยาลัยและองค์กรทั้งในและต่างประเทศ	จำนวนโครงการวิจัยและโครงการบริการวิชาการที่มีการดำเนินการร่วมกับมหาวิทยาลัยหรือองค์กรพันธมิตรทั้งในและต่างประเทศ	research	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	โครงการ	gte	300.00	\N	\N	SUM	manual	research	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน","นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม / หน่วยวิเทศสัมพันธ์	2026-11-08 00:04:11.238	2026-11-08 00:04:11.238	{}	{}	{}
kpi-2569-4-1-5	strat-4-1	plan-4-1-1	4.1-1 (5)	จำนวนชาวต่างชาติที่มีความร่วมมือ/รับบริการด้านการจัดการศึกษา การวิจัย และบริการวิชาการ	จำนวนนิสิตต่างชาติ นักวิจัยต่างชาติ หรือผู้รับบริการชาวต่างชาติ ที่เข้าร่วมกิจกรรมความร่วมมือหรือรับบริการด้านการศึกษา การวิจัย และบริการวิชาการ	academic	2569	ปีงบประมาณ	จำนวนนับ	{ส่วนงาน}	ราย	gte	1750.00	\N	\N	SUM	manual	academic	{round-6m,round-9m}	{"นางสาวปฐมาภรณ์ อุ่นเรือน"}	หน่วยวิเทศสัมพันธ์	2026-11-08 00:04:11.271	2026-11-08 00:04:11.271	{}	{}	{}
kpi-2569-4-1-6	strat-4-1	plan-4-1-1	4.1-1 (6)	สัดส่วนของบทความวิจัยที่ทำร่วมกับหน่วยงานหรือสถาบันทั้งในและต่างประเทศที่ได้รับการตีพิมพ์เผยแพร่ต่อบทความวิจัยทั้งหมด	สัดส่วนจำนวนบทความวิจัยที่มีผู้ร่วมวิจัยจากหน่วยงานหรือสถาบันภายนอกทั้งในและต่างประเทศ ต่อจำนวนบทความวิจัยที่ตีพิมพ์ทั้งหมด	publications	2569	ปีงบประมาณ	สัดส่วน A:B	{ส่วนงาน}	สัดส่วน	gte	0.20	0.2 (20%)	\N	RATIO	manual	publications	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.309	2026-11-08 00:04:11.309	{}	{}	{}
kpi-2569-4-1-7	strat-4-1	plan-4-1-1	4.1-1 (7)	สัดส่วนของงานวิจัยและบริการวิชาการ ที่ทำร่วมกับหน่วยงานหรือสถาบัน ทั้งในและต่างประเทศ	สัดส่วนของจำนวนงานวิจัยและงานบริการวิชาการที่ดำเนินการร่วมกับหน่วยงานหรือสถาบันทั้งในและต่างประเทศ ต่อจำนวนงานวิจัยและบริการวิชาการทั้งหมด	research	2569	ปีงบประมาณ	สัดส่วน A:B	{ส่วนงาน}	สัดส่วน	gte	0.20	0.2 (20%)	\N	RATIO	manual	research	{round-6m,round-9m}	{"นางสาวธัญรดี เกษม"}	หน่วยวิจัยและนวัตกรรม	2026-11-08 00:04:11.344	2026-11-08 00:04:11.344	{}	{}	{}
\.


--
-- Data for Name: strategic_plans; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.strategic_plans (id, strategy_id, code, name, is_department_project, created_at, updated_at) FROM stdin;
plan-1-1-1	strat-1-1	1.1-1	การยกระดับหลักสูตรการศึกษา และกระบวนการจัดการเรียนรู้ที่มุ่งเน้นนวัตกรรม เทคโนโลยี ให้มีคุณภาพตามมาตรฐานการศึกษาระดับสากล (AUN-QA, ABET, AACSB ฯลฯ)	f	2026-11-08 00:00:39.81	2026-11-08 00:04:10.667
plan-1-1-2	strat-1-1	1.1-2	พัฒนาและปรับปรุงหลักสูตรเพื่อการเรียนรู้ตลอดชีวิต (double degree/ joint degree/ sandwich programs หลักสูตร Non-degree/ หลักสูตรนานาชาติ/ หลักสูตรระยะสั้น SDGs)	f	2026-11-08 00:00:39.819	2026-11-08 00:04:10.669
plan-1-1-3	strat-1-1	1.1-3	การส่งเสริมศักยภาพ ภาวะผู้นำและทักษะการเรียนรู้ตลอดชีวิตของนิสิต ให้สอดคล้องกับความต้องการของตลาดงานระดับสากล	f	2026-11-08 00:00:39.822	2026-11-08 00:04:10.674
plan-1-2-1	strat-1-2	1.2-1	พัฒนาและปรับปรุงระบบนิเวศการเรียนรู้ (Learning Ecosystem) ที่ส่งเสริมการจัดการเรียนการสอนที่มุ่งเน้นนวัตกรรม เทคโนโลยี และการเรียนรู้ตลอดชีวิต	f	2026-11-08 00:00:39.825	2026-11-08 00:04:10.675
plan-1-2-2	strat-1-2	1.2-2	พัฒนาระบบการประกันคุณภาพการศึกษาเพื่อมุ่งสู่ความเป็นเลิศตามเกณฑ์มาตรฐานสากล (EdPEx)	f	2026-11-08 00:00:39.83	2026-11-08 00:04:10.676
plan-1-2-3	strat-1-2	1.2-3	พัฒนาระบบฐานข้อมูลด้านการเรียนการสอน และระบบการบริหารจัดการองค์กรดิจิทัล	f	2026-11-08 00:00:39.832	2026-11-08 00:04:10.677
plan-1-3-1	strat-1-3	1.3-1	พัฒนาสมรรถนะและทักษะการจัดการเรียนการสอนของบุคลากรสายวิชาการและสายสนับสนุนสู่มาตรฐานวิชาชีพระดับสากล	f	2026-11-08 00:00:39.834	2026-11-08 00:04:10.678
plan-2-1-1	strat-2-1	2.1-1	ส่งเสริมและสนับสนุนการสร้างองค์ความรู้การวิจัยและนวัตกรรมเพื่อการตีพิมพ์ในวารสารวิชาการระดับนานาชาติ	f	2026-11-08 00:00:39.836	2026-11-08 00:04:10.68
plan-2-1-2	strat-2-1	2.1-2	การบริหารจัดการงานวิจัยและนวัตกรรมมุ่งเป้าเพื่อแสวงหาแหล่งทุนภายนอกและสร้างเครือข่ายความร่วมมือระดับ Mega Project	f	2026-11-08 00:00:39.837	2026-11-08 00:04:10.681
plan-2-2-2	strat-2-2	2.2-2	การยกระดับการบริการวิชาการแก่สังคมและชุมชนเพื่อการพัฒนาที่ยั่งยืน (SDGs)	f	2026-11-08 00:00:39.839	2026-11-08 00:04:10.682
plan-2-2-3	strat-2-2	2.2-3	การให้บริการวิชาการด้านการเกษตรและนวัตกรรมการเกษตร	f	2026-11-08 00:00:39.84	2026-11-08 00:04:10.683
plan-2-2-5	strat-2-2	2.2-5	การให้บริการวิชาการด้านการสร้างอาชีพ การเพิ่มรายได้เสริม และการแก้ไขปัญหาสิ่งแวดล้อม	f	2026-11-08 00:00:39.842	2026-11-08 00:04:10.684
plan-2-3-1	strat-2-3	2.3-1	การพัฒนาผลิตภัณฑ์และนวัตกรรมการเกษตรสู่เชิงพาณิชย์	f	2026-11-08 00:00:39.844	2026-11-08 00:04:10.684
plan-2-3-2	strat-2-3	2.3-2	การส่งเสริมการใช้ประโยชน์ผลงานวิจัย นวัตกรรม และการท่องเที่ยวเชิงเกษตร	f	2026-11-08 00:00:39.846	2026-11-08 00:04:10.685
plan-3-1-1	strat-3-1	3.1-1	การวิจัย นวัตกรรม และบริการวิชาการเพื่อความยั่งยืนและรองรับการเปลี่ยนแปลงสภาพภูมิอากาศ (Climate Change & SDGs)	f	2026-11-08 00:00:39.847	2026-11-08 00:04:10.686
plan-3-2-1	strat-3-2	3.2-1	การทำนุบำรุงศิลปวัฒนธรรมและเสริมสร้างค่านิยมองค์กรเพื่อความยั่งยืน	f	2026-11-08 00:00:39.849	2026-11-08 00:04:10.687
plan-4-1-1	strat-4-1	4.1-1	การสร้างและพัฒนาเครือข่ายความร่วมมือทางวิชาการ การวิจัย และบริการวิชาการ ทั้งในประเทศและต่างประเทศ	f	2026-11-08 00:00:39.851	2026-11-08 00:04:10.688
\.


--
-- Data for Name: strategic_strategies; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.strategic_strategies (id, code, name, pillar_group, fiscal_year, created_at, updated_at) FROM stdin;
strat-1-1	1.1	พัฒนาและบริหารหลักสูตรที่มุ่งเน้นนวัตกรรม เทคโนโลยี เพื่อการเรียนรู้ตลอดชีวิต และเตรียมพร้อมบัณฑิตสู่มาตรฐานสากล	ยุทธศาสตร์ที่ 1 : การจัดการศึกษาและพัฒนาบุคลากร	2569	2026-11-08 00:00:39.782	2026-11-08 00:04:10.646
strat-1-2	1.2	พัฒนาระบบการบริหารจัดการด้านการเรียนการสอน เพื่อความเป็นเลิศ	ยุทธศาสตร์ที่ 1 : การจัดการศึกษาและพัฒนาบุคลากร	2569	2026-11-08 00:00:39.791	2026-11-08 00:04:10.654
strat-1-3	1.3	บริหารและพัฒนาขีดความสามารถของบุคลากรด้านการเรียนการสอน	ยุทธศาสตร์ที่ 1 : การจัดการศึกษาและพัฒนาบุคลากร	2569	2026-11-08 00:00:39.794	2026-11-08 00:04:10.657
strat-2-1	2.1	สร้างองค์ความรู้การวิจัย นวัตกรรมด้านเกษตร สุขภาพ และสิ่งแวดล้อมระดับสากล	ยุทธศาสตร์ที่ 2 : การวิจัย บริการวิชาการ และสร้างรายได้จากนวัตกรรม	2569	2026-11-08 00:00:39.796	2026-11-08 00:04:10.658
strat-2-2	2.2	พัฒนาการบริการวิชาการแบบครบวงจร (นวัตกรรมการเกษตร สุขภาพ และสิ่งแวดล้อม)	ยุทธศาสตร์ที่ 2 : การวิจัย บริการวิชาการ และสร้างรายได้จากนวัตกรรม	2569	2026-11-08 00:00:39.799	2026-11-08 00:04:10.659
strat-2-3	2.3	การสร้างรายได้จากผลิตภัณฑ์และนวัตกรรมการเกษตรที่มีคุณภาพสูงและตอบสนองความต้องการตลาด	ยุทธศาสตร์ที่ 2 : การวิจัย บริการวิชาการ และสร้างรายได้จากนวัตกรรม	2569	2026-11-08 00:00:39.8	2026-11-08 00:04:10.66
strat-3-1	3.1	สร้างระบบการพัฒนาเกษตรยั่งยืนเพื่อรองรับการเปลี่ยนแปลงทางสภาพภูมิอากาศ	ยุทธศาสตร์ที่ 3 : ความยั่งยืนและทำนุบำรุงศิลปวัฒนธรรม	2569	2026-11-08 00:00:39.802	2026-11-08 00:04:10.662
strat-3-2	3.2	การสร้างความยั่งยืนในทุกภาคส่วนของมหาวิทยาลัยและทำนุบำรุงศิลปวัฒนธรรม	ยุทธศาสตร์ที่ 3 : ความยั่งยืนและทำนุบำรุงศิลปวัฒนธรรม	2569	2026-11-08 00:00:39.804	2026-11-08 00:04:10.664
strat-4-1	4.1	การสร้างเครือข่ายความร่วมมือทั้งการจัดการศึกษา การวิจัย บริการวิชาการ ร่วมกับมหาวิทยาลัยและองค์กรระหว่างประเทศในระดับนานาชาติ	ยุทธศาสตร์ที่ 4 : เครือข่ายความร่วมมือระดับชาติและนานาชาติ	2569	2026-11-08 00:00:39.806	2026-11-08 00:04:10.666
\.


--
-- Data for Name: strategic_sub_indicators; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.strategic_sub_indicators (id, indicator_id, title, unit, formula_role, value_source, linked_dataset_key, target, reporters, sort_order) FROM stdin;
kpi-2569-1-1-1-sub-1	kpi-2569-1-1-1	- จำนวนหลักสูตรภายใน KU.KPS ได้รับการรับรองตามมาตรฐานการศึกษาในระดับสากล	หลักสูตร	numerator	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	0
kpi-2569-1-1-3-sub-1	kpi-2569-1-1-3	- จำนวนผู้เรียนที่นำความรู้ที่ได้รับไปใช้ประโยชน์	ราย	numerator	manual	academic	5	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	0
kpi-2569-1-1-3-sub-2	kpi-2569-1-1-3	- จำนวนผู้เรียนในหลักสูตรทั้งหมด	ราย	denominator	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี","นางสุกัญญา พันยุโดด"}	1
kpi-2569-1-1-3-sub-3	kpi-2569-1-1-3	- [โครงการส่วนงาน] ความพึงพอใจต่อ Additional Online/Onsite Materials ที่พัฒนาขึ้น	คะแนนเฉลี่ย	sum_part	manual	academic	3.8	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	2
kpi-2569-1-1-4-sub-1	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาตรี ระดับชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	0
kpi-2569-1-1-4-sub-2	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาตรี ระดับนานาชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	1
kpi-2569-1-1-4-sub-3	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาโท ระดับชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	2
kpi-2569-1-1-4-sub-4	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาโท ระดับนานาชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	3
kpi-2569-1-1-4-sub-5	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาเอก ระดับชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	4
kpi-2569-1-1-4-sub-6	kpi-2569-1-1-4	- จำนวนผลงานดีเด่นของนิสิตปริญญาเอก ระดับนานาชาติ	รางวัล	sum_part	manual	academic	\N	{"นางสาวปิยวรรณ จันทร์สี"}	5
kpi-2569-1-2-3-sub-1	kpi-2569-1-2-3	- [โครงการส่วนงาน] ความพึงพอใจของผู้เรียนต่อ Online/Onsite Courses ที่พัฒนาขึ้น	คะแนนเฉลี่ย	sum_part	manual	academic	4	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	0
kpi-2569-1-2-3-sub-2	kpi-2569-1-2-3	- [โครงการส่วนงาน] อัตราการแนะนำบอกต่อให้มาเรียน (ร้อยละของผู้เรียน)	ร้อยละ	sum_part	manual	academic	20	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	1
kpi-2569-1-2-3-sub-3	kpi-2569-1-2-3	- [โครงการส่วนงาน] รายได้จากผู้เรียน (Online/Onsite Course)	บาท	sum_part	manual	academic	> 50,000	{"ผศ.ดร.วันรัฐ อับดุลลากาซิม"}	2
kpi-2569-1-2-6-sub-1	kpi-2569-1-2-6	- [โครงการส่วนงาน] พัฒนาระบบ Business Intelligence (BI) และระบบ Paperless เพื่อสนับสนุนการตัดสินใจของผู้บริหาร	ระบบ	sum_part	manual	research	1	{"นางนภัสวรรณ คำฝั้น"}	0
kpi-2569-1-3-1-sub-1	kpi-2569-1-3-1	- จำนวนบุคลากรที่ได้รับการพัฒนาทักษะด้านการสอนด้วยเทคโนโลยีสมัยใหม่	ราย	numerator	manual	personnel	\N	{"นางสาวปิยวรรณ จันทร์สี"}	0
kpi-2569-1-3-1-sub-2	kpi-2569-1-3-1	- จำนวนอาจารย์ทั้งหมด	ราย	denominator	manual	personnel	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	1
kpi-2569-1-3-8-sub-1	kpi-2569-1-3-8	- จำนวนบุคลากรสายสนับสนุนกลุ่มวิชาการที่มีตำแหน่งชำนาญการพิเศษขึ้นไป	ราย	numerator	manual	personnel	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	0
kpi-2569-1-3-8-sub-2	kpi-2569-1-3-8	- จำนวนบุคลากรสายสนับสนุนทั้งหมด	ราย	denominator	manual	personnel	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	1
kpi-2569-2-1-1-sub-1	kpi-2569-2-1-1	- จำนวนบทความวิชาการที่ได้รับการตีพิมพ์ในวารสารระดับนานาชาติ	บทความ	sum_part	manual	publications	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-1-1-sub-2	kpi-2569-2-1-1	- จำนวนบทความวิจัยที่ได้รับการตีพิมพ์ในวารสารระดับนานาชาติ	บทความ	sum_part	manual	publications	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-1-2-sub-1	kpi-2569-2-1-2	- ผลรวมของค่า H-index ในฐานข้อมูล Scopus ของอาจารย์ประจำและนักวิจัยทั้งหมด	ผลรวม	numerator	manual	publications	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-1-2-sub-2	kpi-2569-2-1-2	- จำนวนอาจารย์ประจำและนักวิจัยทั้งหมด	ราย	denominator	manual	publications	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	1
kpi-2569-2-1-5-sub-1	kpi-2569-2-1-5	- จำนวนบุคลากรกลุ่มวิชาการที่ได้รับประกาศนียบัตรรับรองการวิจัยในมนุษย์และสัตว์ทดลอง	ราย	numerator	manual	personnel	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-1-5-sub-2	kpi-2569-2-1-5	- จำนวนอาจารย์ประจำและนักวิจัยทั้งหมด	ราย	denominator	manual	personnel	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	1
kpi-2569-2-1-6-sub-1	kpi-2569-2-1-6	- จำนวนเงินงบประมาณ โครงการวิจัย ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก (ภาครัฐและเอกชน)	บาท	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-1-6-sub-2	kpi-2569-2-1-6	- จำนวนเงินงบประมาณ โครงการบริการวิชาการ ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก (ภาครัฐและเอกชน)	บาท	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-1-7-sub-1	kpi-2569-2-1-7	- จำนวนโครงการวิจัย ในระดับ Mega Project ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก สะสม	โครงการ	sum_part	manual	research	2	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-1-7-sub-2	kpi-2569-2-1-7	- จำนวนโครงการบริการวิชาการ ในระดับ Mega Project ที่ได้รับการสนับสนุนจากหน่วยงานภายนอก สะสม	โครงการ	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-2-7-sub-1	kpi-2569-2-2-7	- จำนวนหน่วยงานภาครัฐ/เอกชน ที่ได้รับบริการวิชาการแบบให้เปล่า จาก KU.KPS	หน่วยงาน	sum_part	manual	service	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-2-7-sub-2	kpi-2569-2-2-7	- จำนวนหน่วยงานภาครัฐ/เอกชน ที่ได้รับบริการวิชาการแบบคิดค่าบริการ จาก KU.KPS	หน่วยงาน	sum_part	manual	service	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-2-8-sub-1	kpi-2569-2-2-8	- รายรับจากโครงการบริการวิชาการแบบคิดค่าบริการทั้งหมด (100%)	บาท	sum_part	manual	service	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-2-8-sub-2	kpi-2569-2-2-8	- จำนวนอาจารย์ประจำและนักวิจัยทั้งหมด	ราย	sum_part	manual	service	\N	{"นางสาวเพชรน้อย ยอดอยู่ดี"}	1
kpi-2569-2-2-9-sub-1	kpi-2569-2-2-9	- รายได้จากการใช้ประโยชน์จากบริการวิชาการและผลงานสร้างสรรค์ด้านการเกษตรและนวัตกรรมการเกษตร ปีปัจจุบัน	บาท	numerator	manual	service	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-2-9-sub-2	kpi-2569-2-2-9	- รายได้จากการใช้ประโยชน์จากบริการวิชาการและผลงานสร้างสรรค์ด้านการเกษตรและนวัตกรรมการเกษตร ปีที่ผ่านมา	บาท	denominator	manual	service	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-2-10-sub-1	kpi-2569-2-2-10	- จำนวนบริการวิชาการและนวัตกรรมด้านการเกษตรที่นำออกไปเผยแพร่ ปีปัจจุบัน	บริการวิชาการ/นวัตกรรม	sum_part	manual	service	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-2-10-sub-2	kpi-2569-2-2-10	- จำนวนบริการวิชาการและนวัตกรรมด้านการเกษตรที่นำออกไปเผยแพร่ ปีที่ผ่านมา	บริการวิชาการ/นวัตกรรม	sum_part	manual	service	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-2-13-sub-1	kpi-2569-2-2-13	- รายได้จากการใช้ประโยชน์จากบริการวิชาการฯ ด้านการสร้างอาชีพ ปีปัจจุบัน	บาท	numerator	manual	service	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-2-13-sub-2	kpi-2569-2-2-13	- รายได้จากการใช้ประโยชน์จากบริการวิชาการฯ ด้านการสร้างอาชีพ ปีที่ผ่านมา	บาท	denominator	manual	service	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-2-3-3-sub-1	kpi-2569-2-3-3	- รายได้จากการใช้ประโยชน์จากผลการวิจัยและนวัตกรรมเกษตร ปีปัจจุบัน	บาท	numerator	manual	ip	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-2-3-3-sub-2	kpi-2569-2-3-3	- รายได้จากการใช้ประโยชน์จากผลการวิจัยและนวัตกรรมเกษตร ปีที่ผ่านมา	บาท	denominator	manual	ip	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-4-1-4-sub-1	kpi-2569-4-1-4	- จำนวนโครงการวิจัยที่มีความร่วมมือกับมหาวิทยาลัยและองค์กรทั้งในและต่างประเทศ	โครงการ	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-4-1-4-sub-2	kpi-2569-4-1-4	- จำนวนโครงการบริการวิชาการที่มีความร่วมมือกับมหาวิทยาลัยและองค์กรทั้งในและต่างประเทศ	โครงการ	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-4-1-5-sub-1	kpi-2569-4-1-5	- จำนวนชาวต่างชาติที่มีความร่วมมือด้านการจัดการศึกษา การวิจัย และบริการวิชาการ	ราย	sum_part	manual	academic	\N	{"นางสาวปฐมาภรณ์ อุ่นเรือน"}	0
kpi-2569-4-1-5-sub-2	kpi-2569-4-1-5	- จำนวนชาวต่างชาติที่รับบริการด้านการจัดการศึกษา การวิจัย และบริการวิชาการ	ราย	sum_part	manual	academic	\N	{"นางสาวปฐมาภรณ์ อุ่นเรือน"}	1
kpi-2569-4-1-6-sub-1	kpi-2569-4-1-6	- จำนวนบทความวิจัยที่ทำร่วมกับหน่วยงานหรือสถาบันทั้งในและต่างประเทศที่ได้รับการตีพิมพ์เผยแพร่	บทความ	numerator	manual	publications	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-4-1-6-sub-2	kpi-2569-4-1-6	- จำนวนบทความวิจัยทั้งหมด	บทความ	denominator	manual	publications	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-4-1-7-sub-1	kpi-2569-4-1-7	- จำนวนงานบริการวิชาการที่ทำร่วมกับหน่วยงานหรือสถาบันทั้งในและต่างประเทศ	โครงการ	numerator	manual	research	\N	{"นางสาวธัญรดี เกษม"}	0
kpi-2569-4-1-7-sub-2	kpi-2569-4-1-7	- จำนวนงานวิจัยที่ทำร่วมกับหน่วยงานหรือสถาบันทั้งในและต่างประเทศ	โครงการ	denominator	manual	research	\N	{"นางสาวธัญรดี เกษม"}	1
kpi-2569-4-1-7-sub-3	kpi-2569-4-1-7	- จำนวนงานวิจัยและบริการวิชาการทั้งหมด	โครงการ	sum_part	manual	research	\N	{"นางสาวธัญรดี เกษม"}	2
\.


--
-- Data for Name: system_health_check; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.system_health_check (id, status, checked_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: ku_owner
--

COPY public.user_roles (username, role, display_name, granted_by, granted_at, note, updated_at, is_protected, otp, password) FROM stdin;
b6520503525	admin	Super Admin (b6520503525)	system	2026-11-04 12:02:04.629	Initial system super admin account	2026-11-08 00:05:17.529	t	123456	Admin@1234
superadmin	admin	Super Admin	system	2026-11-04 12:02:04.629	Default superadmin alias account	2026-11-08 00:05:17.529	t	123456	Admin@1234
b0123456789	admin	Admin	system	2026-10-25 19:34:33.693	Mock Protected Admin for testing environment	2026-11-08 00:05:17.529	t	123456	Admin@1234
admin	admin	Super Admin (Admin)	system	2026-11-04 12:02:04.629	Default admin alias account	2026-11-08 00:05:17.529	t	123456	Admin@1234
\.


--
-- Name: dim_funding_source_funding_source_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_funding_source_funding_source_key_seq', 8, true);


--
-- Name: dim_ip_type_ip_type_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_ip_type_ip_type_key_seq', 5, true);


--
-- Name: dim_organization_organization_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_organization_organization_key_seq', 9, true);


--
-- Name: dim_publication_tier_tier_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_publication_tier_tier_key_seq', 8, true);


--
-- Name: dim_researcher_researcher_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_researcher_researcher_key_seq', 1, false);


--
-- Name: dim_strategic_kpi_kpi_key_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.dim_strategic_kpi_kpi_key_seq', 1, false);


--
-- Name: fact_academic_dev_projects_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_academic_dev_projects_fact_id_seq', 1, false);


--
-- Name: fact_academic_services_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_academic_services_fact_id_seq', 1, false);


--
-- Name: fact_intellectual_properties_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_intellectual_properties_fact_id_seq', 1, false);


--
-- Name: fact_kpi_performance_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_kpi_performance_fact_id_seq', 1, false);


--
-- Name: fact_publications_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_publications_fact_id_seq', 1, false);


--
-- Name: fact_research_projects_fact_id_seq; Type: SEQUENCE SET; Schema: analytics; Owner: ku_admin
--

SELECT pg_catalog.setval('analytics.fact_research_projects_fact_id_seq', 1, false);


--
-- Name: academic_dev_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.academic_dev_projects_id_seq', 69, true);


--
-- Name: academic_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.academic_services_id_seq', 307, true);


--
-- Name: evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.evaluations_id_seq', 8, true);


--
-- Name: funding_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.funding_sources_id_seq', 11, true);


--
-- Name: intellectual_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.intellectual_properties_id_seq', 21, true);


--
-- Name: ip_departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.ip_departments_id_seq', 25, true);


--
-- Name: ip_inventors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.ip_inventors_id_seq', 32, true);


--
-- Name: kpi_option_lookups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.kpi_option_lookups_id_seq', 14, true);


--
-- Name: personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.personnel_id_seq', 308, true);


--
-- Name: publication_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.publication_authors_id_seq', 68, true);


--
-- Name: publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.publications_id_seq', 68, true);


--
-- Name: research_project_departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.research_project_departments_id_seq', 32, true);


--
-- Name: research_project_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.research_project_members_id_seq', 2, true);


--
-- Name: research_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.research_projects_id_seq', 32, true);


--
-- Name: role_audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.role_audit_logs_id_seq', 1, true);


--
-- Name: system_health_check_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ku_owner
--

SELECT pg_catalog.setval('public.system_health_check_id_seq', 1, false);


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

\unrestrict gNiheOYwEAPUvGt5blYhXaie21TM3z9tXSR3amJiMUX2VmBG7ELibU4d0gUVUFb

