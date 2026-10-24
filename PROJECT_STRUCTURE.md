# Project Structure Documentation

This document provides a comprehensive technical overview and architectural index of the Engineering Faculty Data Warehouse and Executive Dashboard project.

---

## 1. Tech Stack and Entry Points

### Framework and Runtime

- **Frontend Dashboard**: [Next.js 16.3.0](https://nextjs.org/) (App Router, Turbopack, React 19.2.8). Client state management via React Context (`AuthContext`, `TimeFilterContext`).
- **Backend API**: [Express 5.0.1](https://expressjs.com/) on Node.js v20+ with TypeScript execution via `tsx` in development and `tsc` compilation in production.
- **Data Engineering / Scripts**: Node.js ES modules / CommonJS migration utilities and Python 3 (`data/import_name.py`).



### Language

- **TypeScript 5.7.3** configured in strict mode for both `backend/` and `warehouse_dashboard/` applications with path aliases (`@/`* mapped to `./src/*`).



### Database and ORM

- **Database Engine**: PostgreSQL 16 (running via Docker container `ku_warehouse_db` using `postgres:16-alpine`, exposed on host port `5432`).
- **Backend ORM**: [Prisma Client 6.4.1](https://www.prisma.io/) used for database connectivity in backend Express services.
- **Schema Architecture**: Dual-schema design:
  - `core` schema: Third Normal Form (3NF) operational relational model with integer surrogate keys, referential integrity foreign keys, and JSONB extension attributes.
  - `analytics` schema: Dimensional star and snowflake schema optimized for OLAP analytics (`dim_date`, `dim_department`, `dim_person`, `fact_research_output`, `fact_financial_summary`).
- **Next.js Server Persistence Layer**: `warehouse_dashboard/src/lib/serverDataStore.ts` implements an atomic, file-backed transactional store with asynchronous mutex locking (`persisted_{category}.json` in `src/data/`), falling back to base seed files with full support for runtime CRUD operations without requiring an active PostgreSQL connection.



### Styling Approach

- **Tailwind CSS 4**: Utilizes native `@import "tailwindcss";` in `warehouse_dashboard/src/app/globals.css` with a centralized `@theme` configuration defining KU institutional colors (primary teal `#006664`, deep teal `#004846`, accent gold `#E0A020`, semantic badges, and dark mode variables).
- **Headless UI Primitives**: [Base UI](https://base-ui.com/) (`@base-ui/react`) for accessible dialogs, popovers, select dropdowns, tooltips, and checkboxes.
- **Glassmorphic / Liquid Glass UI**: Dedicated glass styling primitives in `components/ui/liquid-glass.tsx` and utility classes for translucent overlays, subtle gradient borders, and backdrop blurs.
- **Icons**: Lucide React (`lucide-react`) and React Icons (`react-icons/fa`, `react-icons/fa6`).

## 2. Folder Tree

```text
.gitignore  Git version control ignore rules for root workspace.
PROJECT_STRUCTURE.md  Comprehensive project architecture and technical structure documentation.
backend  Express backend API application root directory.
backend/.env  Backend environment variable definitions for database and JWT.
backend/.env.example  Example template for backend environment variables.
backend/package.json  Express backend package manifest and npm build scripts.
backend/src  Backend TypeScript source code root directory.
backend/src/config  Backend environment and runtime configuration modules.
backend/src/config/env.ts  Backend environment variable parser and type validation.
backend/src/data  Backend static data fixtures and seed files.
backend/src/data/personnel.json  Backend personnel fallback JSON seed data.
backend/src/index.ts  Express backend server entry point and middleware.
backend/src/middleware  Express middleware functions including authentication and error handling.
backend/src/middleware/auth.ts  JWT authentication and role-based authorization Express middleware.
backend/src/routes  Express REST API route controllers and endpoints.
backend/src/routes/admin.routes.ts  Express routes for administrator ETL trigger endpoints.
backend/src/routes/auth.routes.ts  Express routes for user authentication and login.
backend/src/routes/dashboard.routes.ts  Express routes for aggregated overview and metrics.
backend/src/routes/personnel.routes.ts  Express routes for personnel queries and management.
backend/src/services  Backend business logic and database service layers.
backend/src/services/auth.service.ts  Authentication service handling JWT tokens and users.
backend/src/services/dashboard.service.ts  Dashboard aggregation and analytics query service.
backend/src/services/personnel.service.ts  Personnel query service fetching faculty records.
backend/src/types  Backend TypeScript interface and type declarations.
backend/src/types/index.ts  Backend TypeScript interface definitions and API types.
backend/tsconfig.json  TypeScript compiler configuration for backend service.
backend/uploads  Storage directory for uploaded files and avatars.
data  Raw dataset files, schemas, and data warehouse notes.
data/1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx  Source data spreadsheet provided by faculty administration.
data/1_Context_Summary.md  Data warehouse project requirements and stakeholder context summary.
data/2.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx  Source data spreadsheet provided by faculty administration.
data/2_Star_Schema_Design.md  Star schema dimensional modeling specifications and fact tables.
data/3.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx  Source data spreadsheet provided by faculty administration.
data/3_Snowflake_Schema_Design.md  Snowflake schema normalized dimensional architecture documentation.
data/4.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx  Source data spreadsheet provided by faculty administration.
data/4_Development_Plan.md  Data warehouse implementation phases and development plan.
data/5.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx  Source data spreadsheet provided by faculty administration.
data/all_data.json  Consolidated raw seed dataset for data warehouse.
data/backup.zip  Archive backup of initial data warehouse seed files.
data/import_name.py  Python ETL utility script importing personnel names.
data/ku_eng_personnel.json  Exported personnel dataset for Faculty of Engineering.
data/ku_eng_personnel.zip  Compressed archive of faculty personnel dataset and photos.
data/metadata.json  Data dictionary metadata describing warehouse dataset attributes.
data/metadata_columns.json  Detailed column specifications and data types metadata.
data/profile_images  Department folders containing personnel portrait images.
warehouse_dashboard/public/vercel.svg  Vector graphic icon or brand asset.
warehouse_dashboard/public/window.svg  Vector graphic icon or brand asset.
warehouse_dashboard/README.md  Frontend dashboard overview and developer getting started guide.
warehouse_dashboard/scratch  Project directory.
warehouse_dashboard/scripts  Data migration and normalization utility scripts.
warehouse_dashboard/scripts/migrate_ip_records.js  Data script migrating legacy IP JSON records format.
warehouse_dashboard/scripts/migrate_personnel_references.js  Data script resolving personnel references to integer ids.
warehouse_dashboard/src  Next.js dashboard frontend application source code.
warehouse_dashboard/src/app  Next.js App Router routes, layouts, and pages.
warehouse_dashboard/src/app/(dashboard)  Authenticated dashboard route group with common layout.
warehouse_dashboard/src/app/(dashboard)/academic  Academic development projects module view and components.
warehouse_dashboard/src/app/(dashboard)/academic/page.tsx  Academic development projects dashboard view page.
warehouse_dashboard/src/app/(dashboard)/academic/_components  Academic development dashboard visualization components and tables.
warehouse_dashboard/src/app/(dashboard)/academic/_components/AcademicCharts.tsx  Visualization charts for academic development projects.
warehouse_dashboard/src/app/(dashboard)/academic/_components/AcademicTable.tsx  Data table component displaying academic development projects.
warehouse_dashboard/src/app/(dashboard)/academic/_components/AcademicView.tsx  Main content view combining academic charts and tables.
warehouse_dashboard/src/app/(dashboard)/academic/_hooks  Academic development data fetching and state hooks.
warehouse_dashboard/src/app/(dashboard)/academic/_hooks/useAcademicData.ts  Custom hook fetching academic development project datasets.
warehouse_dashboard/src/app/(dashboard)/ip  Intellectual property module views and components.
warehouse_dashboard/src/app/(dashboard)/ip/new  Create new intellectual property page route.
warehouse_dashboard/src/app/(dashboard)/ip/new/page.tsx  Dedicated page route for registering intellectual property.
warehouse_dashboard/src/app/(dashboard)/ip/page.tsx  Intellectual property dashboard overview and list page.
warehouse_dashboard/src/app/(dashboard)/ip/[id]  Dynamic route folder for editing specific IP.
warehouse_dashboard/src/app/(dashboard)/ip/[id]/edit  Edit page route for existing intellectual property.
warehouse_dashboard/src/app/(dashboard)/ip/[id]/edit/page.tsx  Dedicated page route for editing intellectual property.
warehouse_dashboard/src/app/(dashboard)/ip/_components  Intellectual property dashboard visualization components and tables.
warehouse_dashboard/src/app/(dashboard)/ip/_components/IPCharts.tsx  Visualization charts for intellectual property statistics.
warehouse_dashboard/src/app/(dashboard)/ip/_components/IPTable.tsx  Data table displaying intellectual property records.
warehouse_dashboard/src/app/(dashboard)/ip/_components/IPView.tsx  Main view aggregating intellectual property analytics.
warehouse_dashboard/src/app/(dashboard)/ip/_hooks  Intellectual property data fetching and state hooks.
warehouse_dashboard/src/app/(dashboard)/ip/_hooks/useIPData.ts  Custom hook fetching intellectual property datasets.
warehouse_dashboard/src/app/(dashboard)/kpi  Strategic KPI tracking dashboard view and filters.
warehouse_dashboard/src/app/(dashboard)/kpi/page.tsx  Strategic KPI tracking and monitoring dashboard page.
warehouse_dashboard/src/app/(dashboard)/kpi/_components  KPI metrics grid, filters, and cards.
warehouse_dashboard/src/app/(dashboard)/kpi/_components/KpiFilterBar.tsx  Filter bar for selecting fiscal years and dimensions.
warehouse_dashboard/src/app/(dashboard)/kpi/_components/KpiGridCards.tsx  Grid displaying strategic KPI achievement cards.
warehouse_dashboard/src/app/(dashboard)/kpi/_components/KpiHeaderToolbar.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/kpi/_components/KpiSummaryCards.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/kpi/_components/KPIView.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/kpi/_hooks  Project directory.
warehouse_dashboard/src/app/(dashboard)/kpi/_hooks/useKpiData.ts  Project source file.
warehouse_dashboard/src/app/(dashboard)/layout.tsx  Main dashboard layout rendering header, sidebar, and shell.
warehouse_dashboard/src/app/(dashboard)/manage  Master data management dashboard views and forms.
warehouse_dashboard/src/app/(dashboard)/manage/page.tsx  Master data management hub page.
warehouse_dashboard/src/app/(dashboard)/manage/_components  Data management tabs, tables, and modal components.
warehouse_dashboard/src/app/(dashboard)/manage/_components/AcademicProjectForm.tsx  Dedicated form for academic development project records.
warehouse_dashboard/src/app/(dashboard)/manage/_components/DataManagementRoot.tsx  Tabbed controller for managing data domains.
warehouse_dashboard/src/app/(dashboard)/manage/_components/DataTable.tsx  Interactive CRUD table with sorting and filtering.
warehouse_dashboard/src/app/(dashboard)/manage/_components/FilterModal.tsx  Modal dialog for configuring multi-column table filters.
warehouse_dashboard/src/app/(dashboard)/manage/_components/JournalQuartileSelector.tsx  Input component selecting journal quartile ranking (Q1-Q4).
warehouse_dashboard/src/app/(dashboard)/manage/_components/KPIManagementTab.tsx  Management interface for setting KPI targets and actuals.
warehouse_dashboard/src/app/(dashboard)/manage/_components/ManageView.tsx  Master data view controller rendering active tabs.
warehouse_dashboard/src/app/(dashboard)/manage/_components/MultiMemberSelector.tsx  Component for selecting and ordering multiple team members.
warehouse_dashboard/src/app/(dashboard)/manage/_components/PersonnelGrid.tsx  Card grid display for faculty personnel records.
warehouse_dashboard/src/app/(dashboard)/manage/_components/ProjectMonitoringView.tsx  Project extension timeline monitoring view component.
warehouse_dashboard/src/app/(dashboard)/manage/_components/SDGTagSelector.tsx  Selector for United Nations Sustainable Development Goals tags.
warehouse_dashboard/src/app/(dashboard)/manage/_components/SmartAddEditModal.tsx  Universal dynamic modal for creating and editing records.
warehouse_dashboard/src/app/(dashboard)/manage/_components/SmartAutocomplete.tsx  Autocomplete input with debounced searching and dropdown.
warehouse_dashboard/src/app/(dashboard)/manage/_components/SmartExcelImportModal.tsx  Modal for importing and mapping Excel spreadsheets.
warehouse_dashboard/src/app/(dashboard)/manage/_components/TopSegmentedTabs.tsx  Horizontal segmented navigation tabs for data categories.
warehouse_dashboard/src/app/(dashboard)/monitoring  Project extension and milestone monitoring dashboard.
warehouse_dashboard/src/app/(dashboard)/monitoring/page.tsx  Project extension monitoring dashboard page.
warehouse_dashboard/src/app/(dashboard)/monitoring/_components  Project extension monitoring timeline and table components.
warehouse_dashboard/src/app/(dashboard)/monitoring/_components/MonitoringView.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/monitoring/_components/ProjectMonitoringTab.tsx  Monitoring tab tracking project deadlines and extensions.
warehouse_dashboard/src/app/(dashboard)/overview  Executive overview dashboard perspective cards and actions.
warehouse_dashboard/src/app/(dashboard)/overview/page.tsx  Executive overview summary dashboard page.
warehouse_dashboard/src/app/(dashboard)/overview/_components  Executive overview summary cards and perspective sections.
warehouse_dashboard/src/app/(dashboard)/overview/_components/ActionListCard.tsx  Action list card displaying pending approvals and alerts.
warehouse_dashboard/src/app/(dashboard)/overview/_components/BurnupCard.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/overview/_components/KpiScorecardGrid.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/overview/_components/OverviewHeaderToolbar.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/overview/_components/OverviewView.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/overview/_components/PerspectiveSection.tsx  Section grouping strategic perspective metrics and charts.
warehouse_dashboard/src/app/(dashboard)/overview/_constants  Project directory.
warehouse_dashboard/src/app/(dashboard)/overview/_constants/mockHistoricalData.ts  Project source file.
warehouse_dashboard/src/app/(dashboard)/overview/_hooks  Executive overview aggregation and burnup calculation hooks.
warehouse_dashboard/src/app/(dashboard)/overview/_hooks/useOverviewData.ts  Custom hook aggregating metrics for executive overview.
warehouse_dashboard/src/app/(dashboard)/overview/_services  Project directory.
warehouse_dashboard/src/app/(dashboard)/overview/_services/burnupCalculations.ts  Project source file.
warehouse_dashboard/src/app/(dashboard)/publications  Academic publications module views and components.
warehouse_dashboard/src/app/(dashboard)/publications/new  Create new academic publication page route.
warehouse_dashboard/src/app/(dashboard)/publications/new/page.tsx  Dedicated page route for registering academic publication.
warehouse_dashboard/src/app/(dashboard)/publications/page.tsx  Academic publications dashboard and list page.
warehouse_dashboard/src/app/(dashboard)/publications/[id]  Dynamic route folder for editing specific publication.
warehouse_dashboard/src/app/(dashboard)/publications/[id]/edit  Edit page route for existing academic publication.
warehouse_dashboard/src/app/(dashboard)/publications/[id]/edit/page.tsx  Dedicated page route for editing academic publication.
warehouse_dashboard/src/app/(dashboard)/publications/_components  Academic publications dashboard charts and tables.
warehouse_dashboard/src/app/(dashboard)/publications/_components/PublicationsCharts.tsx  Charts visualizing publication quartiles and citations.
warehouse_dashboard/src/app/(dashboard)/publications/_components/PublicationsTable.tsx  Data table displaying academic publication records.
warehouse_dashboard/src/app/(dashboard)/publications/_components/PublicationsView.tsx  Main publications view combining charts and table.
warehouse_dashboard/src/app/(dashboard)/publications/_hooks  Academic publications data fetching and state hooks.
warehouse_dashboard/src/app/(dashboard)/publications/_hooks/usePublicationsData.ts  Custom hook fetching academic publication datasets.
warehouse_dashboard/src/app/(dashboard)/research  Research projects module dashboard views and charts.
warehouse_dashboard/src/app/(dashboard)/research/page.tsx  Research projects dashboard view page.
warehouse_dashboard/src/app/(dashboard)/research/_components  Research project dashboard visualization charts and tables.
warehouse_dashboard/src/app/(dashboard)/research/_components/ResearchCharts.tsx  Visualization charts for research funding and status.
warehouse_dashboard/src/app/(dashboard)/research/_components/ResearchTable.tsx  Data table displaying active research projects.
warehouse_dashboard/src/app/(dashboard)/research/_components/ResearchView.tsx  Main research view combining charts and table.
warehouse_dashboard/src/app/(dashboard)/research/_hooks  Research project data fetching and state hooks.
warehouse_dashboard/src/app/(dashboard)/research/_hooks/useResearchData.ts  Custom hook fetching research project datasets.
warehouse_dashboard/src/app/(dashboard)/service  Academic services dashboard view and analytics charts.
warehouse_dashboard/src/app/(dashboard)/service/page.tsx  Academic services dashboard view page.
warehouse_dashboard/src/app/(dashboard)/service/_components  Academic services dashboard visualization components and tables.
warehouse_dashboard/src/app/(dashboard)/service/_components/ServiceCharts.tsx  Visualization charts for academic service revenues.
warehouse_dashboard/src/app/(dashboard)/service/_components/ServiceTable.tsx  Data table displaying academic service projects.
warehouse_dashboard/src/app/(dashboard)/service/_components/ServiceView.tsx  Main service view combining charts and table.
warehouse_dashboard/src/app/(dashboard)/service/_hooks  Academic services data fetching and state hooks.
warehouse_dashboard/src/app/(dashboard)/service/_hooks/useServiceData.ts  Custom hook fetching academic service datasets.
warehouse_dashboard/src/app/(dashboard)/services  Plural alias route folder for academic services.
warehouse_dashboard/src/app/(dashboard)/services/page.tsx  Alias route redirecting to academic service page.
warehouse_dashboard/src/app/(dashboard)/studio  Self-service analytics and query builder studio.
warehouse_dashboard/src/app/(dashboard)/studio/page.tsx  Self-service analytics and query builder page.
warehouse_dashboard/src/app/(dashboard)/studio/_components  Self-service studio visual builder and chart components.
warehouse_dashboard/src/app/(dashboard)/studio/_components/SelfServiceStudio.tsx  Interactive query builder, pivot table, and chart studio.
warehouse_dashboard/src/app/(dashboard)/studio/_components/StudioView.tsx  Project source file.
warehouse_dashboard/src/app/(dashboard)/_components  Shared shell and layout components for dashboard.
warehouse_dashboard/src/app/(dashboard)/_components/DashboardShell.tsx  Shell container component wrapping dashboard main content.
warehouse_dashboard/src/app/api  Next.js App Router serverless backend API routes.
warehouse_dashboard/src/app/api/data  Data CRUD API endpoints by domain category.
warehouse_dashboard/src/app/api/data/[category]  Dynamic route directory for categorized data operations.
warehouse_dashboard/src/app/api/data/[category]/route.ts  REST API endpoint handling CRUD for domain categories.
warehouse_dashboard/src/app/api/lookups  Autocomplete lookup and reference data API endpoints.
warehouse_dashboard/src/app/api/lookups/courses  Lookup route directory for academic course catalog.
warehouse_dashboard/src/app/api/lookups/courses/route.ts  REST API endpoint searching course catalog for autocomplete.
warehouse_dashboard/src/app/api/lookups/funding-sources  Lookup route directory for project funding agencies.
warehouse_dashboard/src/app/api/lookups/funding-sources/route.ts  REST API endpoint searching project funding agencies.
warehouse_dashboard/src/app/api/lookups/personnel  Lookup route directory for faculty and personnel.
warehouse_dashboard/src/app/api/lookups/personnel/route.ts  REST API endpoint searching faculty personnel for picker.
warehouse_dashboard/src/app/apple-icon.png  Project source file.
warehouse_dashboard/src/app/favicon.ico  Project source file.
warehouse_dashboard/src/app/fonts  Project directory.
warehouse_dashboard/src/app/fonts/Kanit-Black.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-BlackItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Bold.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-BoldItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-ExtraBold.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-ExtraBoldItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-ExtraLight.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-ExtraLightItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Italic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Light.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-LightItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Medium.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-MediumItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Regular.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-SemiBold.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-SemiBoldItalic.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-Thin.ttf  Project source file.
warehouse_dashboard/src/app/fonts/Kanit-ThinItalic.ttf  Project source file.
warehouse_dashboard/src/app/globals.css  Global Tailwind CSS 4 theme rules and tokens.
warehouse_dashboard/src/app/icon.png  Project source file.
warehouse_dashboard/src/app/layout.tsx  Root HTML layout wrapping application with providers.
warehouse_dashboard/src/app/page.tsx  Root redirect page routing visitors to overview dashboard.
warehouse_dashboard/src/app/providers.tsx  Client providers wrapping auth and time-filter contexts.
warehouse_dashboard/src/components  Shared reusable UI and form component library.
warehouse_dashboard/src/components/data-display  Shared data display cards and decision boxes.
warehouse_dashboard/src/components/data-display/DecisionBox.tsx  Strategic decision recommendation callout card with icon.
warehouse_dashboard/src/components/data-display/index.ts  Barrel export file for data display components.
warehouse_dashboard/src/components/data-display/KpiGrid.tsx  Responsive grid container for KPI metric cards.
warehouse_dashboard/src/components/form  Shared domain form controls, pickers, and inputs.
warehouse_dashboard/src/components/form/AcademicServiceForm.tsx  Comprehensive add/edit form for academic service projects.
warehouse_dashboard/src/components/form/AvatarImageField.tsx  Personnel avatar upload field with cropping support.
warehouse_dashboard/src/components/form/CheckboxGroupWithOther.tsx  Multi-checkbox selector with custom other text input.
warehouse_dashboard/src/components/form/CourseCodePicker.tsx  Autocomplete picker for academic courses with validation.
warehouse_dashboard/src/components/form/CourseListField.tsx  Repeatable dynamic list for associated academic courses.
warehouse_dashboard/src/components/form/CreatableCombobox.tsx  Combobox supporting dropdown selection or custom text creation.
warehouse_dashboard/src/components/form/DateRangePickerBE.tsx  Date range picker displaying Buddhist Era calendar years.
warehouse_dashboard/src/components/form/DepartmentMultiSelect.tsx  Multi-select dropdown for academic departments with badges.
warehouse_dashboard/src/components/form/FormField.tsx  Standardized form field wrapper with label and error.
warehouse_dashboard/src/components/form/ImageCropModal.tsx  Modal dialog for cropping and resizing uploaded avatars.
warehouse_dashboard/src/components/form/index.ts  Barrel export file for shared form controls.
warehouse_dashboard/src/components/form/IntellectualPropertyForm.tsx  Comprehensive add/edit form for intellectual property assets.
warehouse_dashboard/src/components/form/MoneyInput.tsx  Standardized currency input with thousands separators and unit.
warehouse_dashboard/src/components/form/MonthYearPicker.tsx  Single month and Buddhist Era year picker control.
warehouse_dashboard/src/components/form/MonthYearRangePicker.tsx  Month and year range picker for project durations.
warehouse_dashboard/src/components/form/NumberUnitInput.tsx  Numeric input component with customizable unit label.
warehouse_dashboard/src/components/form/PersonAddConfirmModal.tsx  Confirmation modal before adding unregistered person to directory.
warehouse_dashboard/src/components/form/PersonListField.tsx  Dynamic repeatable list of persons with project roles.
warehouse_dashboard/src/components/form/PersonnelForm.tsx  Comprehensive add/edit form for faculty personnel profiles.
warehouse_dashboard/src/components/form/PersonPicker.tsx  Shared single/multi person autocomplete picker with badges.
warehouse_dashboard/src/components/form/PrefixCombobox.tsx  Academic prefix dropdown supporting custom honorific entries.
warehouse_dashboard/src/components/form/PublicationForm.tsx  Comprehensive add/edit form for academic research publications.
warehouse_dashboard/src/components/form/RepeatableList.tsx  Generic container for dynamically adding and removing rows.
warehouse_dashboard/src/components/form/ResearchProjectForm.tsx  Comprehensive add/edit form for research project records.
warehouse_dashboard/src/components/form/TrlOutputsField.tsx  Form field specifying Technology Readiness Level expected outputs.
warehouse_dashboard/src/components/form/TrlSelect.tsx  Select component for Technology Readiness Levels (TRL 1-9).
warehouse_dashboard/src/components/index.ts  Barrel export file for UI, form, layout components.
warehouse_dashboard/src/components/layout  Shared application layout headers, sidebars, and navigation.
warehouse_dashboard/src/components/layout/Header.tsx  Application top bar with title, search, and user profile.
warehouse_dashboard/src/components/layout/index.ts  Barrel export file for layout components.
warehouse_dashboard/src/components/layout/Sidebar.tsx  Collapsible application sidebar navigation with links.
warehouse_dashboard/src/components/ui  Primitive design system UI elements and base controls.
warehouse_dashboard/src/components/ui/button.tsx  Base UI button primitive with theme variants.
warehouse_dashboard/src/components/ui/calendar.tsx  Accessible day picker calendar component using date-fns.
warehouse_dashboard/src/components/ui/checkbox.tsx  Accessible checkbox input component with custom styling.
warehouse_dashboard/src/components/ui/command.tsx  Command palette and searchable list component primitives.
warehouse_dashboard/src/components/ui/ConfirmActionModal.tsx  Generic modal dialog confirming user actions and deletions.
warehouse_dashboard/src/components/ui/date-picker.tsx  Single date picker popover input with calendar.
warehouse_dashboard/src/components/ui/department-badge.tsx  Rounded badge displaying department abbreviation with brand color.
warehouse_dashboard/src/components/ui/department-select.tsx  Standard select dropdown for choosing faculty departments.
warehouse_dashboard/src/components/ui/dialog.tsx  Accessible modal dialog primitive built with Base UI.
warehouse_dashboard/src/components/ui/index.ts  Barrel export file for UI primitive components.
warehouse_dashboard/src/components/ui/input-group.tsx  Input wrapper component supporting icons and addon buttons.
warehouse_dashboard/src/components/ui/input.tsx  Accessible text input primitive styled with Tailwind tokens.
warehouse_dashboard/src/components/ui/liquid-glass.tsx  Glassmorphic card, header, and dock UI wrapper components.
warehouse_dashboard/src/components/ui/popover.tsx  Floating popover overlay primitive component.
warehouse_dashboard/src/components/ui/SearchInput.tsx  Search box input component with clear icon button.
warehouse_dashboard/src/components/ui/select.tsx  Accessible select dropdown primitive built with Base UI.
warehouse_dashboard/src/components/ui/textarea.tsx  Accessible multiline textarea input component.
warehouse_dashboard/src/components/ui/tooltip.tsx  Accessible tooltip hover card primitive component.
warehouse_dashboard/src/config  Application constants, navigation menus, and theme configurations.
warehouse_dashboard/src/config/analyticsMetadata.ts  Metadata configurations for self-service analytics builder dimensions.
warehouse_dashboard/src/config/dataManagementConfig.ts  Domain schema definitions and table columns for management.
warehouse_dashboard/src/config/departments.ts  Master list of faculty departments, codes, and colors.
warehouse_dashboard/src/config/journalRankingConfig.ts  Journal quartile rankings and citation database configurations.
warehouse_dashboard/src/config/kpiConfig.ts  Strategic KPI definitions, targets, formulas, and weights.
warehouse_dashboard/src/config/navigation.ts  Sidebar navigation menu hierarchy and route metadata.
warehouse_dashboard/src/config/sdgConfig.ts  United Nations Sustainable Development Goals labels and colors.
warehouse_dashboard/src/config/site.ts  Global site metadata, titles, and branding constants.
warehouse_dashboard/src/config/theme.ts  Theme color palette tokens, radius, and shadow definitions.
warehouse_dashboard/src/data  Local JSON data fixtures and persisted data storage.
warehouse_dashboard/src/data/academic.json  Initial JSON dataset for academic development projects.
warehouse_dashboard/src/data/course_catalog.json  Academic course catalog dataset for autocomplete lookup.
warehouse_dashboard/src/data/funding_sources.json  Master list of recognized project funding agencies.
warehouse_dashboard/src/data/ip.json  Initial JSON dataset for intellectual property assets.
warehouse_dashboard/src/data/persisted_academic.json  Persisted server storage for academic development records.
warehouse_dashboard/src/data/persisted_ip.json  Persisted server storage for intellectual property records.
warehouse_dashboard/src/data/persisted_personnel.json  Persisted server storage for faculty personnel records.
warehouse_dashboard/src/data/persisted_publications.json  Persisted server storage for academic publications.
warehouse_dashboard/src/data/persisted_research.json  Persisted server storage for research project records.
warehouse_dashboard/src/data/persisted_services.json  Persisted server storage for academic services records.
warehouse_dashboard/src/data/personnel.json  Initial JSON dataset for faculty personnel directory.
warehouse_dashboard/src/data/publications.json  Initial JSON dataset for academic research publications.
warehouse_dashboard/src/data/research.json  Initial JSON dataset for faculty research projects.
warehouse_dashboard/src/data/services.json  Initial JSON dataset for faculty academic services.
warehouse_dashboard/src/features  Cross-cutting feature modules with scoped contexts.
warehouse_dashboard/src/features/auth  User authentication feature module and modals.
warehouse_dashboard/src/features/auth/components  Authentication dialog and header button components.
warehouse_dashboard/src/features/auth/components/AuthModal.tsx  Login and registration modal dialog component.
warehouse_dashboard/src/features/auth/components/HeaderAuth.tsx  Header button displaying current user and login action.
warehouse_dashboard/src/features/auth/constants  Authentication configuration constants and token keys.
warehouse_dashboard/src/features/auth/constants/authConfig.ts  Authentication token storage keys and session timeout constants.
warehouse_dashboard/src/features/auth/context  Authentication context provider and session state.
warehouse_dashboard/src/features/auth/context/AuthContext.tsx  React context provider managing authentication state and login.
warehouse_dashboard/src/features/auth/index.ts  Barrel export file for authentication feature module.
warehouse_dashboard/src/features/auth/types  Authentication type definitions and user roles.
warehouse_dashboard/src/features/auth/types/auth.ts  TypeScript interfaces for user accounts, roles, credentials.
warehouse_dashboard/src/features/monitoring  Project monitoring and extension feature components.
warehouse_dashboard/src/features/monitoring/components  Project extension request modal component.
warehouse_dashboard/src/features/monitoring/components/ProjectExtensionModal.tsx  Modal for requesting and recording project timeline extensions.
warehouse_dashboard/src/features/time-filter  Fiscal year and date range filter feature.
warehouse_dashboard/src/features/time-filter/components  Time filter bar and range selection modal.
warehouse_dashboard/src/features/time-filter/components/TimeFilterBar.tsx  Interactive header bar for toggling fiscal years.
warehouse_dashboard/src/features/time-filter/components/TimeFilterModal.tsx  Modal dialog for selecting custom date ranges.
warehouse_dashboard/src/features/time-filter/constants  Fiscal year preset configurations and ranges.
warehouse_dashboard/src/features/time-filter/constants/timeFilterPresets.ts  Preset fiscal year boundaries and Buddhist Era dates.
warehouse_dashboard/src/features/time-filter/context  Time filter context provider and active state.
warehouse_dashboard/src/features/time-filter/context/TimeFilterContext.tsx  React context provider managing global time filter state.
warehouse_dashboard/src/features/time-filter/hooks  Hook for accessing active time filter state.
warehouse_dashboard/src/features/time-filter/hooks/useTimeFilter.ts  Hook providing access to global time filter selections.
warehouse_dashboard/src/features/time-filter/index.ts  Barrel export file for time filter feature module.
warehouse_dashboard/src/lib  Utility functions, calculation engines, and service clients.
warehouse_dashboard/src/lib/analyticsEngine.ts  Client-side aggregation and multidimensional analytics engine.
warehouse_dashboard/src/lib/api.ts  HTTP client wrapper for backend REST API calls.
warehouse_dashboard/src/lib/chartAdvisor.ts  Rule-based recommendation utility suggesting optimal chart types.
warehouse_dashboard/src/lib/dataService.ts  Data service abstraction layer for domain CRUD operations.
warehouse_dashboard/src/lib/departments.ts  Utility functions for retrieving department metadata and colors.
warehouse_dashboard/src/lib/etlEngine.ts  ETL transform functions converting raw records to warehouse.
warehouse_dashboard/src/lib/journalRankingEngine.ts  Engine determining journal quartile rankings and citation impact.
warehouse_dashboard/src/lib/kpiEngine.ts  Calculation engine evaluating strategic KPI formulas and scores.
warehouse_dashboard/src/lib/personnelService.ts  Client and server utility for personnel query operations.
warehouse_dashboard/src/lib/projectMonitoringEngine.ts  Engine evaluating project deadlines, delays, and extensions.
warehouse_dashboard/src/lib/sdgEngine.ts  Utility parsing and calculating SDG contribution metrics.
warehouse_dashboard/src/lib/serverDataStore.ts  Server-side file-backed storage with mutex locking.
warehouse_dashboard/src/lib/utils.ts  Common utility functions including Tailwind class merging (cn).
warehouse_dashboard/src/types  Core TypeScript interface declarations across domain modules.
warehouse_dashboard/src/types/analyticsBuilder.ts  Type definitions for self-service analytics and charts.
warehouse_dashboard/src/types/dataManagement.ts  Core TypeScript interfaces for all domain datasets.
warehouse_dashboard/src/types/kpi.ts  Type definitions for strategic KPIs, targets, actuals.
warehouse_dashboard/src/types/projectMonitoring.ts  Type definitions for project extensions and monitoring records.
warehouse_dashboard/src/types/researchProject.ts  Zod schema and TypeScript interfaces for research projects.
warehouse_dashboard/src/types/timeFilter.ts  Type definitions for time filters and fiscal ranges.
warehouse_dashboard/tsconfig.json  TypeScript compiler configuration and path aliases for dashboard.
```



---



## 3. Module Map


| Module                                              | List Page                                               | Add/Edit Form                                                          | API Route                                                                    | Service / Repository                                      | Validation Schema                       | DB Table / Model                                                           | Migration                                   | Types                                          |
| --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------- |
| **โครงการวิจัย** (Research Projects)                | `app/(dashboard)/research/page.tsx`                     | `components/form/ResearchProjectForm.tsx`                              | `/api/data/research`                                                         | `lib/serverDataStore.ts`, `lib/dataService.ts`            | `ResearchProjectSchema` (Zod)           | `core.research_projects`, `core.research_members`, `core.research_funding` | `002_research_project_full_schema.sql`      | `ResearchProjectData`, `ResearchMember`        |
| **โครงการพัฒนาวิชาการ** (Academic Dev Projects)     | `app/(dashboard)/academic/page.tsx`                     | `manage/_components/AcademicProjectForm.tsx`                           | `/api/data/academic`                                                         | `lib/serverDataStore.ts`, `lib/dataService.ts`            | `AcademicProjectData` client validation | `core.academic_dev_projects`, `core.academic_dev_members`                  | `004_academic_dev_project_types.sql`        | `AcademicProjectData`, `AcademicDevMember`     |
| **งานบริการวิชาการ** (Academic Services)            | `app/(dashboard)/service/page.tsx`, `services/page.tsx` | `components/form/AcademicServiceForm.tsx`                              | `/api/data/service`, `/api/data/services`                                    | `lib/serverDataStore.ts`, `lib/dataService.ts`            | Form & route payload validation         | `core.academic_services`, `core.academic_service_members`                  | `003_academic_services_full_schema.sql`     | `AcademicServiceData`, `AcademicServiceMember` |
| **ผลงานตีพิมพ์ทางวิชาการ** (Academic Publications)  | `app/(dashboard)/publications/page.tsx`                 | `components/form/PublicationForm.tsx`, `publications/new`, `[id]/edit` | `/api/data/publications`                                                     | `lib/serverDataStore.ts`, `lib/journalRankingEngine.ts`   | Form & route payload validation         | `core.publications`, `core.publication_authors`                            | `005_academic_publications_full_schema.sql` | `PublicationData`, `PublicationAuthor`         |
| **งานทรัพย์สินทางปัญญา** (Intellectual Property)    | `app/(dashboard)/ip/page.tsx`                           | `components/form/IntellectualPropertyForm.tsx`, `ip/new`, `[id]/edit`  | `/api/data/ip`                                                               | `lib/serverDataStore.ts`, `lib/dataService.ts`            | Form & route payload validation         | `core.intellectual_properties`, `core.ip_inventors`                        | `007_intellectual_property_schema.sql`      | `IntellectualPropertyData`, `IPInventor`       |
| **ข้อมูลบุคลากรและอาจารย์** (Personnel & Faculty)   | `app/(dashboard)/manage/page.tsx` (Personnel tab)       | `components/form/PersonnelForm.tsx`, `PersonAddConfirmModal.tsx`       | `/api/data/personnel`, `/api/lookups/personnel`, backend `/api/v1/personnel` | `lib/personnelService.ts`, backend `personnel.service.ts` | `PersonnelRecord` interface validation  | `core.persons`, `core.departments`                                         | `006_personnel_integer_id_schema.sql`       | `PersonnelRecord`                              |
| **KPI** (ตัวชี้วัดยุทธศาสตร์)                       | `app/(dashboard)/kpi/page.tsx`                          | `manage/_components/KPIManagementTab.tsx`                              | `/api/data/kpi`, backend `/api/v1/dashboard/overview`                        | `lib/kpiEngine.ts`, backend `dashboard.service.ts`        | `kpiConfig.ts` schema rules             | `core.strategic_kpis`, `core.kpi_targets`, `core.kpi_actuals`              | `schema.sql`                                | `StrategicKpi`, `KpiActualRecord`              |
| **ติดตามสถานะโครงการ** (Project Monitoring)         | `app/(dashboard)/monitoring/page.tsx`                   | `features/monitoring/components/ProjectExtensionModal.tsx`             | `/api/data/monitoring`                                                       | `lib/projectMonitoringEngine.ts`                          | Extension form validation               | Project extension history in `core.research_projects`                      | `002_research_project_full_schema.sql`      | `ProjectMonitoringItem`, `ProjectExtension`    |
| **สตูดิโอวิเคราะห์ข้อมูล** (Self-Service Analytics) | `app/(dashboard)/studio/page.tsx`                       | `studio/_components/SelfServiceStudio.tsx`                             | Cross-domain `/api/data/[category]`                                          | `lib/analyticsEngine.ts`, `lib/chartAdvisor.ts`           | `AnalyticsConfig` schema                | `analytics.fact_research_output`, `analytics.fact_financial_summary`       | `schema.sql`                                | `AnalyticsConfig`, `Dimension`, `Metric`       |
| **ภาพรวม** (Executive Overview)                     | `app/(dashboard)/overview/page.tsx`                     | Read-only perspective cards                                            | Aggregated via `/api/data/[category]`                                        | `lib/burnupCalculations.ts`, `useOverviewData.ts`         | Analytical aggregation transforms       | Star schema tables (`analytics.`*, `core.*`)                               | `schema.sql`                                | `ExecutiveOverviewData`                        |


---



## 4. Global Components Index


| Component Name             | Path                                                       | Purpose                                                                                                                                                                       | Key Props                                                                       | Used by Forms / Views                                                                                              |
| -------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **PersonPicker**           | `src/components/form/PersonPicker.tsx`                     | Global person autocomplete picker displaying 52px fixed-width affiliation badges in dropdown options, with full single/multi selection and unlisted person registration flow. | `value`, `onChange`, `multiple`, `placeholder`, `disabled`, `required`, `label` | `ResearchProjectForm`, `AcademicProjectForm`, `AcademicServiceForm`, `PublicationForm`, `IntellectualPropertyForm` |
| **PersonAddConfirmModal**  | `src/components/form/PersonAddConfirmModal.tsx`            | Standardized danger/red header confirmation modal prompted when an entered person name is not found in the personnel database.                                                | `isOpen`, `onClose`, `onConfirm`, `personName`                                  | `PersonPicker.tsx`, `SmartAddEditModal.tsx`                                                                        |
| **DepartmentBadge**        | `src/components/ui/department-badge.tsx`                   | Standardized rounded colored badge displaying department abbreviation with fixed width and centered text.                                                                     | `deptId`, `deptName`, `size`, `className`                                       | `PersonPicker`, `DepartmentSelect`, `DepartmentMultiSelect`, `PersonnelGrid`                                       |
| **DepartmentSelect**       | `src/components/ui/department-select.tsx`                  | Single-select dropdown for choosing faculty departments with integrated color badges and search.                                                                              | `value`, `onChange`, `placeholder`, `disabled`                                  | `PersonnelForm`, `AcademicServiceForm`, `SmartAddEditModal`                                                        |
| **DepartmentMultiSelect**  | `src/components/form/DepartmentMultiSelect.tsx`            | Multi-select dropdown supporting multiple department tags with colored badges.                                                                                                | `value`, `onChange`, `placeholder`, `disabled`                                  | `ResearchProjectForm`, `AcademicProjectForm`, `AcademicServiceForm`                                                |
| **MoneyInput**             | `src/components/form/MoneyInput.tsx`                       | Standardized Thai currency input with right alignment, thousands separator, 2 decimals, and fixed 'บาท' unit badge.                                                           | `value`, `onChange`, `disabled`, `placeholder`, `error`                         | `ResearchProjectForm`, `AcademicProjectForm`, `AcademicServiceForm`, `IntellectualPropertyForm`                    |
| **NumberUnitInput**        | `src/components/form/NumberUnitInput.tsx`                  | Numeric input control with fixed unit suffix addon (e.g. คน, ครั้ง, วัน, %).                                                                                                  | `value`, `onChange`, `unit`, `min`, `max`, `step`                               | `AcademicServiceForm`, `AcademicProjectForm`                                                                       |
| **DateRangePickerBE**      | `src/components/form/DateRangePickerBE.tsx`                | Buddhist Era (พ.ศ.) date range picker with synchronized calendar and format validation.                                                                                       | `startDate`, `endDate`, `onChange`, `disabled`                                  | `ResearchProjectForm`, `AcademicProjectForm`, `AcademicServiceForm`                                                |
| **MonthYearPicker**        | `src/components/form/MonthYearPicker.tsx`                  | Month and Buddhist Era year picker for publications and intellectual property filing dates.                                                                                   | `value`, `onChange`, `placeholder`, `disabled`                                  | `PublicationForm`, `IntellectualPropertyForm`                                                                      |
| **MonthYearRangePicker**   | `src/components/form/MonthYearRangePicker.tsx`             | Month and year range selector for multi-month project durations.                                                                                                              | `startMonth`, `startYear`, `endMonth`, `endYear`, `onChange`                    | `AcademicProjectForm`, `ResearchProjectForm`                                                                       |
| **DatePicker**             | `src/components/ui/date-picker.tsx`                        | Accessible single date picker popover input displaying Buddhist Era calendar years.                                                                                           | `date`, `onDateChange`, `placeholder`, `disabled`                               | Forms requiring exact calendar day selection                                                                       |
| **FormField**              | `src/components/form/FormField.tsx`                        | Reusable form row container providing label, required asterisk, description, and error message.                                                                               | `label`, `required`, `error`, `description`, `children`                         | Standard wrapper across all domain forms                                                                           |
| **RepeatableList**         | `src/components/form/RepeatableList.tsx`                   | Generic dynamic list wrapper supporting adding, removing, and reordering multi-item form entries.                                                                             | `items`, `onAdd`, `onRemove`, `renderItem`, `addLabel`                          | `PersonListField`, `CourseListField`, `TrlOutputsField`                                                            |
| **PersonListField**        | `src/components/form/PersonListField.tsx`                  | Repeatable team member selector binding person identity with project role and effort percentage.                                                                              | `value`, `onChange`, `availableRoles`, `disabled`                               | `ResearchProjectForm`, `AcademicProjectForm`, `IntellectualPropertyForm`                                           |
| **CourseListField**        | `src/components/form/CourseListField.tsx`                  | Repeatable selector for linking multiple academic course codes to project initiatives.                                                                                        | `value`, `onChange`, `disabled`                                                 | `AcademicProjectForm.tsx`                                                                                          |
| **CourseCodePicker**       | `src/components/form/CourseCodePicker.tsx`                 | Autocomplete picker searching university course catalog by course code and name.                                                                                              | `value`, `onChange`, `disabled`                                                 | `CourseListField.tsx`                                                                                              |
| **PrefixCombobox**         | `src/components/form/PrefixCombobox.tsx`                   | Academic prefix dropdown supporting standard faculty honorifics with custom text input.                                                                                       | `value`, `onChange`, `disabled`                                                 | `PersonnelForm.tsx`, `PersonAddConfirmModal.tsx`                                                                   |
| **CreatableCombobox**      | `src/components/form/CreatableCombobox.tsx`                | Combobox allowing selection from lookup options or creating a novel freeform text entry.                                                                                      | `options`, `value`, `onChange`, `placeholder`, `onCreate`                       | Agency selection in `ResearchProjectForm`, `PublicationForm`                                                       |
| **TrlSelect**              | `src/components/form/TrlSelect.tsx`                        | Specialized select dropdown for Technology Readiness Levels (TRL 1 through TRL 9).                                                                                            | `value`, `onChange`, `disabled`                                                 | `ResearchProjectForm`, `IntellectualPropertyForm`                                                                  |
| **TrlOutputsField**        | `src/components/form/TrlOutputsField.tsx`                  | Repeatable list specifying Technology Readiness Level expected outputs and milestones.                                                                                        | `value`, `onChange`, `disabled`                                                 | `ResearchProjectForm.tsx`                                                                                          |
| **CheckboxGroupWithOther** | `src/components/form/CheckboxGroupWithOther.tsx`           | Multi-select checkbox group with conditional freeform text input when 'อื่นๆ' is selected.                                                                                    | `options`, `value`, `onChange`, `otherValue`, `onOtherChange`                   | Academic project classifications and research scopes                                                               |
| **AvatarImageField**       | `src/components/form/AvatarImageField.tsx`                 | Personnel photo upload control with preview and integration to cropping modal.                                                                                                | `value`, `onChange`, `disabled`                                                 | `PersonnelForm.tsx`                                                                                                |
| **ImageCropModal**         | `src/components/form/ImageCropModal.tsx`                   | Modal dialog with zoom and drag controls for cropping portrait images to square avatar proportions.                                                                           | `isOpen`, `imageSrc`, `onClose`, `onCropComplete`                               | `AvatarImageField.tsx`                                                                                             |
| **Button**                 | `src/components/ui/button.tsx`                             | Base UI button primitive with theme variants (`default`, `outline`, `ghost`, `danger`, `glass`).                                                                              | `variant`, `size`, `isLoading`, `disabled`, `children`                          | Universal action and submit buttons                                                                                |
| **Input**                  | `src/components/ui/input.tsx`                              | Accessible text input primitive styled with theme focus ring and border tokens.                                                                                               | `type`, `value`, `onChange`, `placeholder`, `error`                             | Universal text input fields                                                                                        |
| **SearchInput**            | `src/components/ui/SearchInput.tsx`                        | Search input component with search icon and clear button.                                                                                                                     | `value`, `onChange`, `onClear`, `placeholder`                                   | `DataTable`, `PersonnelGrid`, `Header`                                                                             |
| **Select**                 | `src/components/ui/select.tsx`                             | Accessible select dropdown primitive built with Base UI.                                                                                                                      | `value`, `onChange`, `options`, `placeholder`                                   | Single-choice selection fields                                                                                     |
| **Checkbox**               | `src/components/ui/checkbox.tsx`                           | Accessible checkbox primitive built with Base UI and custom check icon.                                                                                                       | `checked`, `onCheckedChange`, `disabled`                                        | Boolean and multi-option checkboxes                                                                                |
| **Dialog**                 | `src/components/ui/dialog.tsx`                             | Accessible modal dialog primitive built with Base UI with backdrop and focus lock.                                                                                            | `open`, `onOpenChange`, `children`                                              | `FilterModal`, `AuthModal`, `ConfirmActionModal`                                                                   |
| **Popover**                | `src/components/ui/popover.tsx`                            | Accessible floating popover container built with Base UI.                                                                                                                     | `open`, `onOpenChange`, `children`                                              | Date pickers, department selectors                                                                                 |
| **Tooltip**                | `src/components/ui/tooltip.tsx`                            | Accessible hover tooltip component built with Base UI.                                                                                                                        | `content`, `children`, `side`                                                   | Action buttons, data badges                                                                                        |
| **ConfirmActionModal**     | `src/components/ui/ConfirmActionModal.tsx`                 | Standardized confirmation modal dialog for destructive actions (deletions, state resets).                                                                                     | `isOpen`, `title`, `message`, `onConfirm`, `onCancel`                           | `DataTable`, `ManageView`                                                                                          |
| **LiquidGlassCard**        | `src/components/ui/liquid-glass.tsx`                       | Glassmorphic card container with backdrop blur, translucent gradient border, and hover sheen.                                                                                 | `children`, `className`, `variant`                                              | Dashboard metric cards, studio charts, overview sections                                                           |
| **DecisionBox**            | `src/components/data-display/DecisionBox.tsx`              | Callout card rendering strategic insights, recommendations, and warnings with lightbulb icon.                                                                                 | `title`, `insights`, `variant`, `actionLabel`                                   | Overview and module analytical views                                                                               |
| **KpiGrid**                | `src/components/data-display/KpiGrid.tsx`                  | Responsive grid container organizing KPI cards with progress bars and trend indicators.                                                                                       | `items`, `columns`, `onCardClick`                                               | Module analytical headers (`research`, `academic`, `ip`, etc.)                                                     |
| **Header**                 | `src/components/layout/Header.tsx`                         | Application header bar with KU logo, module title, global search, and user profile badge.                                                                                     | `title`, `subtitle`, `onToggleSidebar`                                          | Root dashboard layout (`layout.tsx`)                                                                               |
| **Sidebar**                | `src/components/layout/Sidebar.tsx`                        | Collapsible application navigation drawer with active route highlighting and icons.                                                                                           | `collapsed`, `onToggle`                                                         | Root dashboard layout (`layout.tsx`)                                                                               |
| **DashboardShell**         | `src/app/(dashboard)/_components/DashboardShell.tsx`       | Main layout wrapper container for dashboard content with padding and responsive breakpoints.                                                                                  | `children`, `className`                                                         | Root dashboard layout (`layout.tsx`)                                                                               |
| **SmartAddEditModal**      | `manage/_components/SmartAddEditModal.tsx`                 | Universal dynamic modal dialog dynamically rendering form components for creating and editing records.                                                                        | `isOpen`, `onClose`, `category`, `initialData`, `onSuccess`                     | Master data management (`manage/page.tsx`)                                                                         |
| **DataTable**              | `manage/_components/DataTable.tsx`                         | Full-featured data table with sorting, multi-column search, pagination, and Excel export.                                                                                     | `columns`, `data`, `onEdit`, `onDelete`, `onExport`                             | Master data management, module table views                                                                         |
| **TopSegmentedTabs**       | `manage/_components/TopSegmentedTabs.tsx`                  | Horizontal pill tab bar for navigating between domain management categories.                                                                                                  | `activeTab`, `onTabChange`, `tabs`                                              | `ManageView.tsx`, `DataManagementRoot.tsx`                                                                         |
| **TimeFilterBar**          | `features/time-filter/components/TimeFilterBar.tsx`        | Header filter component allowing one-click selection of fiscal years and custom date ranges.                                                                                  | `fiscalYears`, `activeFilter`, `onSelect`                                       | Root dashboard header across all analytical modules                                                                |
| **TimeFilterModal**        | `features/time-filter/components/TimeFilterModal.tsx`      | Modal dialog for configuring custom fiscal year and calendar date filter boundaries.                                                                                          | `isOpen`, `onClose`, `onApply`, `currentRange`                                  | `TimeFilterBar.tsx`                                                                                                |
| **ProjectExtensionModal**  | `features/monitoring/components/ProjectExtensionModal.tsx` | Modal dialog for entering project timeline extension requests with reason and approval dates.                                                                                 | `isOpen`, `project`, `onClose`, `onSave`                                        | `monitoring/page.tsx`, `ProjectMonitoringView.tsx`                                                                 |
| **AuthModal**              | `features/auth/components/AuthModal.tsx`                   | User login and registration modal dialog with JWT credential handling.                                                                                                        | `isOpen`, `onClose`, `defaultTab`                                               | Global header, unauthorized action triggers                                                                        |
| **HeaderAuth**             | `features/auth/components/HeaderAuth.tsx`                  | Header widget displaying logged-in user profile, role badge, and login/logout trigger.                                                                                        | `user`, `onLoginClick`, `onLogoutClick`                                         | `Header.tsx`                                                                                                       |




---



## 5. Hooks, Utils, Types, Constants, and Config



### Hooks

- `src/features/time-filter/hooks/useTimeFilter.ts`: React hook providing access to global fiscal year and date range filter state.
- `src/app/(dashboard)/research/_hooks/useResearchData.ts`: React hook fetching, caching, and filtering research project datasets.
- `src/app/(dashboard)/academic/_hooks/useAcademicData.ts`: React hook fetching and filtering academic development project records.
- `src/app/(dashboard)/service/_hooks/useServiceData.ts`: React hook fetching and aggregating academic services datasets.
- `src/app/(dashboard)/publications/_hooks/usePublicationsData.ts`: React hook fetching academic publication records and quartile metrics.
- `src/app/(dashboard)/ip/_hooks/useIPData.ts`: React hook fetching and calculating intellectual property statistics.
- `src/app/(dashboard)/overview/_hooks/useOverviewData.ts`: React hook consolidating cross-module KPIs and strategic burnup charts for overview.



### Utils and Calculation Engines

- `src/lib/utils.ts`: Shared helper functions including `cn()` for conditionally merging Tailwind classes via `clsx` and `tailwind-merge`.
- `src/lib/departments.ts`: Lookup functions for retrieving department metadata, acronyms, and institutional color tokens.
- `src/lib/serverDataStore.ts`: Server-side transactional JSON storage engine with mutex concurrency locking and automatic seed fallback.
- `src/lib/dataService.ts`: Unified client/server data service abstraction for performing CRUD operations across domain categories.
- `src/lib/personnelService.ts`: Lookup and normalization utility resolving personnel identities and Department linkages.
- `src/lib/kpiEngine.ts`: Evaluation engine calculating strategic KPI actual values, target percentages, and achievement scores.
- `src/lib/analyticsEngine.ts`: Multidimensional data engine executing client-side aggregations, grouping, and pivot tables.
- `src/lib/chartAdvisor.ts`: Rule-based recommendation engine suggesting appropriate chart visualizations based on selected dimensions.
- `src/lib/journalRankingEngine.ts`: Engine evaluating journal quartile tiers (Q1-Q4) and citation metrics from indexing sources.
- `src/lib/projectMonitoringEngine.ts`: Engine evaluating project schedule adherence, delay warnings, and timeline extension histories.
- `src/lib/sdgEngine.ts`: Utility calculating project contributions to UN Sustainable Development Goals (SDG 1-17).
- `src/lib/etlEngine.ts`: Transformation engine converting raw spreadsheet data records into relational and dimensional entities.
- `src/lib/api.ts`: Type-safe fetch client wrapper for issuing HTTP requests to backend REST API endpoints.



### Types and Interfaces

- `src/types/dataManagement.ts`: Core TypeScript interfaces for all domain datasets (`AcademicProjectData`, `AcademicServiceData`, `PublicationData`, `IntellectualPropertyData`).
- `src/types/researchProject.ts`: Comprehensive TypeScript interfaces and Zod validation schema (`ResearchProjectSchema`) for research projects.
- `src/types/kpi.ts`: Type definitions for strategic KPIs, targets, actual records, and summary cards.
- `src/types/projectMonitoring.ts`: Type declarations for project extensions, delay tracking, and timeline monitoring views.
- `src/types/analyticsBuilder.ts`: Type definitions for self-service analytics builder dimensions, metrics, and dataset configurations.
- `src/types/timeFilter.ts`: Type definitions for fiscal year filters, date ranges, and calendar presets.
- `src/features/auth/types/auth.ts`: TypeScript interfaces for user accounts, role definitions, and JWT auth credentials.
- `backend/src/types/index.ts`: Backend API request/response structures, JWT payload interfaces, and database model types.



### Constants and Configuration

- `src/config/site.ts`: Global site configuration constants, metadata titles, institutional descriptions, and links.
- `src/config/theme.ts`: Color palette tokens, border radii, shadows, and glassmorphic UI styling constants.
- `src/config/navigation.ts`: Primary application navigation structure, route links, permission tiers, and icons.
- `src/config/departments.ts`: Canonical list of 11 faculty departments with codes, Thai names, abbreviations, and theme colors.
- `src/config/dataManagementConfig.ts`: Schema configurations, table columns, filter rules, and form field metadata for master management.
- `src/config/kpiConfig.ts`: Strategic KPI configuration specifications, weights, baseline targets, and evaluation formulas.
- `src/config/journalRankingConfig.ts`: Academic journal rankings configuration, indexing tiers (Scopus, WoS, TCI), and quartile boundaries.
- `src/config/sdgConfig.ts`: Master metadata for the 17 United Nations Sustainable Development Goals with official colors and Thai labels.
- `src/config/analyticsMetadata.ts`: Dimension and metric configurations registered for the self-service analytics studio.
- `src/features/auth/constants/authConfig.ts`: Local storage token keys, session expiration intervals, and role-based route permissions.
- `src/features/time-filter/constants/timeFilterPresets.ts`: Fiscal year presets (`2567`, `2568`, `ทั้งหมด`) and Buddhist Era calendar boundaries.



### Style and Theme Files

- `warehouse_dashboard/src/app/globals.css`: Main application stylesheet declaring Tailwind CSS 4 directives, `@theme` design tokens, custom font utilities, and liquid glass styling classes.

---



## 6. Database

The project implements a PostgreSQL relational schema combining operational third-normal-form (3NF) tables (`core`) with a dimensional star schema (`analytics`).


| Table Name                           | Purpose                                                         | Key Columns                                                                                             | Foreign Keys                                                                    | Migration / Schema File                                         |
| ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **core.departments**                 | Faculty academic departments and research centers               | `department_id` (PK, INT), `department_code`, `department_name_th`, `department_name_en`                | None                                                                            | `schema.sql`, `001_initial_schema.sql`                          |
| **core.persons**                     | Faculty members, researchers, and personnel directory           | `person_id` (PK, INT), `citizen_id`, `prefix_th`, `first_name_th`, `last_name_th`, `department_id`      | `department_id` -> `core.departments`                                           | `001_initial_schema.sql`, `006_personnel_integer_id_schema.sql` |
| **core.research_projects**           | Faculty research projects, grants, and durations                | `project_id` (PK, INT), `project_code`, `project_name_th`, `leader_person_id`, `total_budget`, `status` | `leader_person_id` -> `core.persons`                                            | `002_research_project_full_schema.sql`                          |
| **core.research_members**            | Project team researchers and effort allocation                  | `project_id` (PK), `person_id` (PK), `role`, `contribution_percentage`                                  | `project_id` -> `core.research_projects`, `person_id` -> `core.persons`         | `002_research_project_full_schema.sql`                          |
| **core.research_funding**            | Funding sources, granting agencies, and fiscal disbursements    | `funding_id` (PK, INT), `project_id`, `funding_source_name`, `allocated_amount`                         | `project_id` -> `core.research_projects`                                        | `002_research_project_full_schema.sql`                          |
| **core.academic_dev_projects**       | Academic development and curriculum improvement projects        | `dev_project_id` (PK, INT), `project_code`, `project_name_th`, `total_budget`, `fiscal_year`            | `department_id` -> `core.departments`                                           | `004_academic_dev_project_types.sql`                            |
| **core.academic_dev_members**        | Team members contributing to academic development               | `dev_project_id` (PK), `person_id` (PK), `role`, `effort_percent`                                       | `dev_project_id` -> `core.academic_dev_projects`, `person_id` -> `core.persons` | `004_academic_dev_project_types.sql`                            |
| **core.academic_services**           | Commercial and community academic service initiatives           | `service_id` (PK, INT), `service_code`, `service_name_th`, `total_revenue`, `start_date`                | `department_id` -> `core.departments`                                           | `003_academic_services_full_schema.sql`                         |
| **core.academic_service_members**    | Consultants and project staff on academic services              | `service_id` (PK), `person_id` (PK), `role`, `remuneration_amount`                                      | `service_id` -> `core.academic_services`, `person_id` -> `core.persons`         | `003_academic_services_full_schema.sql`                         |
| **core.publications**                | Refereed academic journal articles and conference papers        | `publication_id` (PK, INT), `title_en`, `journal_name`, `quartile`, `citation_count`                    | `department_id` -> `core.departments`                                           | `005_academic_publications_full_schema.sql`                     |
| **core.publication_authors**         | Authorship and affiliation ordering for publications            | `publication_id` (PK), `person_id` (PK), `author_order`, `is_corresponding`                             | `publication_id` -> `core.publications`, `person_id` -> `core.persons`          | `005_academic_publications_full_schema.sql`                     |
| **core.intellectual_properties**     | Patents, petty patents, and registered copyrights               | `ip_id` (PK, INT), `ip_type`, `title_th`, `application_number`, `registration_number`                   | `department_id` -> `core.departments`                                           | `007_intellectual_property_schema.sql`                          |
| **core.ip_inventors**                | Inventors and creators associated with intellectual property    | `ip_id` (PK), `person_id` (PK), `inventor_order`, `contribution_percentage`                             | `ip_id` -> `core.intellectual_properties`, `person_id` -> `core.persons`        | `007_intellectual_property_schema.sql`                          |
| **core.strategic_kpis**              | Faculty strategic key performance indicator definitions         | `kpi_id` (PK, INT), `kpi_code`, `kpi_name_th`, `dimension`, `target_value`, `unit`                      | None                                                                            | `schema.sql`                                                    |
| **core.kpi_targets**                 | Annual KPI target thresholds per department                     | `target_id` (PK, INT), `kpi_id`, `fiscal_year`, `target_amount`                                         | `kpi_id` -> `core.strategic_kpis`                                               | `schema.sql`                                                    |
| **core.kpi_actuals**                 | Quarterly and annual recorded KPI actual results                | `actual_id` (PK, INT), `kpi_id`, `fiscal_year`, `actual_amount`, `recorded_date`                        | `kpi_id` -> `core.strategic_kpis`                                               | `schema.sql`                                                    |
| **analytics.dim_date**               | Date dimension for time-series analysis and fiscal calendar     | `date_key` (PK, INT), `full_date`, `fiscal_year_th`, `quarter`, `month_th`                              | None                                                                            | `schema.sql`                                                    |
| **analytics.dim_department**         | Department dimension with institutional hierarchy               | `dept_key` (PK, INT), `department_id`, `department_code`, `department_name`                             | None                                                                            | `schema.sql`                                                    |
| **analytics.dim_person**             | Researcher dimension with academic ranking and profile          | `person_key` (PK, INT), `person_id`, `full_name`, `academic_rank`, `department_key`                     | `department_key` -> `analytics.dim_department`                                  | `schema.sql`                                                    |
| **analytics.fact_research_output**   | Fact table recording research outputs, citations, and IP counts | `fact_id` (PK, INT), `date_key`, `dept_key`, `person_key`, `output_type`, `points`                      | `date_key`, `dept_key`, `person_key`                                            | `schema.sql`                                                    |
| **analytics.fact_financial_summary** | Fact table recording project expenditures and overhead          | `fact_id` (PK, INT), `date_key`, `dept_key`, `budget_allocated`, `actual_expended`                      | `date_key`, `dept_key`                                                          | `schema.sql`                                                    |


---



## 7. API



### Next.js App Router API Routes


| Method     | Endpoint Path                  | Purpose                                                                                                                           | Handler File                                   |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **GET**    | `/api/data/[category]`         | Fetch all records for domain category (`research`, `academic`, `service`, `publications`, `ip`, `personnel`, `kpi`, `monitoring`) | `src/app/api/data/[category]/route.ts`         |
| **POST**   | `/api/data/[category]`         | Create a new record in the specified domain category with server-side validation                                                  | `src/app/api/data/[category]/route.ts`         |
| **PUT**    | `/api/data/[category]`         | Update an existing record by identifier in the specified domain category                                                          | `src/app/api/data/[category]/route.ts`         |
| **DELETE** | `/api/data/[category]`         | Delete a record by identifier from the specified domain category                                                                  | `src/app/api/data/[category]/route.ts`         |
| **GET**    | `/api/lookups/personnel`       | Query faculty directory for PersonPicker autocomplete filtering by name or department                                             | `src/app/api/lookups/personnel/route.ts`       |
| **GET**    | `/api/lookups/courses`         | Search university course catalog for course picker autocomplete                                                                   | `src/app/api/lookups/courses/route.ts`         |
| **GET**    | `/api/lookups/funding-sources` | Search recognized project funding agencies for combobox autocomplete                                                              | `src/app/api/lookups/funding-sources/route.ts` |




### Backend Express API Routes (`http://localhost:5000/api/v1`)


| Method     | Endpoint Path                   | Purpose                                                                                 | Handler File                             |
| ---------- | ------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| **POST**   | `/api/v1/auth/login`            | Authenticate user credentials and issue signed JWT bearer tokens                        | `backend/src/routes/auth.routes.ts`      |
| **GET**    | `/api/v1/auth/me`               | Retrieve authenticated user profile and roles from JWT session token                    | `backend/src/routes/auth.routes.ts`      |
| **GET**    | `/api/v1/dashboard/overview`    | Fetch consolidated strategic dashboard metrics and burnup progress                      | `backend/src/routes/dashboard.routes.ts` |
| **GET**    | `/api/v1/dashboard/kpi-summary` | Fetch strategic KPI achievement summaries grouped by strategic pillar                   | `backend/src/routes/dashboard.routes.ts` |
| **GET**    | `/api/v1/personnel`             | Query personnel records with filtering, pagination, and sorting                         | `backend/src/routes/personnel.routes.ts` |
| **GET**    | `/api/v1/personnel/:id`         | Retrieve detailed profile for an individual faculty member                              | `backend/src/routes/personnel.routes.ts` |
| **POST**   | `/api/v1/personnel`             | Register a new faculty personnel record (Admin role required)                           | `backend/src/routes/personnel.routes.ts` |
| **PUT**    | `/api/v1/personnel/:id`         | Update faculty personnel profile details (Admin role required)                          | `backend/src/routes/personnel.routes.ts` |
| **DELETE** | `/api/v1/personnel/:id`         | Archive or remove faculty personnel record (Admin role required)                        | `backend/src/routes/personnel.routes.ts` |
| **POST**   | `/api/v1/admin/etl/trigger`     | Trigger automated ETL synchronization from operational sources into analytics warehouse | `backend/src/routes/admin.routes.ts`     |


---



## 8. Conventions Found in the Code



### 1. Naming Conventions

- **Component Files**: PascalCase (e.g., `PersonPicker.tsx`, `SmartAddEditModal.tsx`, `ResearchProjectForm.tsx`).
- **Hook Files**: camelCase starting with `use` (e.g., `useTimeFilter.ts`, `useOverviewData.ts`).
- **Utility / Engine Files**: camelCase (e.g., `kpiEngine.ts`, `serverDataStore.ts`, `journalRankingEngine.ts`).
- **Database Tables and Columns**: Snake_case (e.g., `core.research_projects`, `dev_project_id`, `total_budget`, `is_corresponding`).
- **Data Categories (Next.js)**: Plural and singular strings mapped via `categoryMap` in `serverDataStore.ts` (`research`, `academic`, `service`/`services`, `publications`, `ip`, `personnel`).



### 2. Folder and Architecture Rules

- **Route Colocation**: Dashboard pages reside within the `warehouse_dashboard/src/app/(dashboard)/` route group. Module-specific charts, tables, and views are colocated within private `_components/` and `_hooks/` directories inside each route folder.
- **Shared Components Hierarchy**: Generic, non-domain primitives belong in `src/components/ui/`. Reusable domain form controls belong in `src/components/form/`. Visual layout components belong in `src/components/layout/` and `src/components/data-display/`.
- **Feature Encapsulation**: Self-contained domain features that include state, modals, and hooks (such as `auth`, `monitoring`, and `time-filter`) are placed in `src/features/<feature-name>/`.



### 3. Form Validation Conventions

- **Zod Schemas**: Used for complex forms (`ResearchProjectSchema` in `src/types/researchProject.ts`).
- **Controlled Components**: Form inputs are controlled components requiring `value` and `onChange` handlers with consistent error messaging via the standard `FormField` wrapper.
- **Personnel Identity Binding**: Forms store references to faculty using integer `person_id` (e.g. `101`) along with denormalized `name` and `department` to preserve historical reporting if a person changes departments.



### 4. Money and Currency Conventions

- **Formatting**: Thousands separator with two fixed decimals (e.g., `1,250,000.00`).
- **Alignment**: Currency input values are right-aligned to maintain horizontal decimal point alignment.
- **Unit Badge**: Fixed unit label 'บาท' displayed as an external addon suffix outside the input element.
- **Non-negativity**: Form validation enforces zero or positive numeric values (`min={0}`).



### 5. Date and Calendar Conventions (พ.ศ. / Buddhist Era)

- **Display Layer**: Dates presented in the user interface strictly use the Buddhist Era (พ.ศ.) format by adding 543 to the Gregorian year (e.g., `2025` is formatted as `2568`).
- **Storage Layer**: Server-side persistence and database records store dates in standard Gregorian ISO-8601 strings (`YYYY-MM-DD`).
- **Pickers**: Pickers (`DateRangePickerBE.tsx`, `MonthYearPicker.tsx`, `date-picker.tsx`) transparently convert Gregorian values to Buddhist Era labels in the UI.



### 6. Thai Labels and Terminology Standard

- **Official Terminology**: Official Faculty of Engineering Thai labels are used consistently across all views without informal wording, placeholders, or helper text:
  - Modules: `โครงการวิจัย`, `โครงการพัฒนาวิชาการ`, `งานบริการวิชาการ`, `ผลงานตีพิมพ์ทางวิชาการ`, `งานทรัพย์สินทางปัญญา`, `ข้อมูลบุคลากรและอาจารย์`, `ตัวชี้วัดยุทธศาสตร์ (KPI)`
  - Financial Breakdown: `งบประมาณรวมทั้งหมด`, `การจัดสรรงบประมาณอัตโนมัติ`, `หักเข้าคณะ`, `หักเข้าภาควิชา`, `หักเข้ามหาวิทยาลัย (มก.)`, `สัดส่วน`, `จำนวนเงิน`, `หักรวม`, `งบดำเนินงานคงเหลือ`
  - Actions: `บันทึกข้อมูล`, `บันทึกรายการใหม่`, `ยกเลิก`, `ค้นหา...`, `ลบข้อมูล`

---



## 9. Findings

*(List only; no modifications made per read-only task boundaries.)*

### 1. Duplicated or Near-Duplicate Components

- **Modal Add/Edit Forms**: `warehouse_dashboard/src/app/(dashboard)/manage/_components/AcademicProjectForm.tsx` duplicates much of the layout and field handling found in `warehouse_dashboard/src/components/form/AcademicServiceForm.tsx` and `ResearchProjectForm.tsx`.
- **Department Definitions**: Department lists and color mappings are defined in three separate locations: `warehouse_dashboard/src/config/departments.ts`, `warehouse_dashboard/src/lib/departments.ts`, and `backend/src/config/`.
- **Confirm Modals**: `src/components/ui/ConfirmActionModal.tsx` and `src/components/form/PersonAddConfirmModal.tsx` share similar modal structures and button tokens but have separate implementations.



### 2. Hard-Coded Styles and Colors That Bypass Theme

- **Teal Brand Colors**: Several components hardcode `#006664`, `#004846`, or `rgba(0, 102, 100, ...)` in style props or inline Tailwind classes instead of consuming the Tailwind CSS 4 theme token `var(--color-primary)` or `text-primary`.
- **Status Badges**: Components in `manage/_components/DataTable.tsx` use hardcoded Tailwind utility classes (`bg-emerald-50 text-emerald-700`, `bg-amber-50 text-amber-700`) rather than semantic theme tokens.



### 3. Unused or Obsolete Files

- **Backend Mock Seed**: `backend/src/data/personnel.json` duplicates `warehouse_dashboard/src/data/personnel.json` and is not synchronized with the database.
- **Public Assets**: `warehouse_dashboard/public/myku-ref.png` and `warehouse_dashboard/public/bg9.jpg` appear to be legacy design reference assets that are not referenced in active UI pages.
- **Route Aliasing**: `warehouse_dashboard/src/app/(dashboard)/services/page.tsx` serves as an alias for `warehouse_dashboard/src/app/(dashboard)/service/page.tsx`, creating dual route maintenance overhead.



### 4. Inconsistent Naming

- **Route vs File Pluralization**: The academic services module uses singular `/service` for its main dashboard page but plural `/services` for fallback data and persisted storage (`persisted_services.json`).
- **Identifier Conventions**: Personnel records use `id` as a string in legacy JSON files (`"101"`) but integer in PostgreSQL migrations (`person_id INT`) and normalized JSON files (`101`).

