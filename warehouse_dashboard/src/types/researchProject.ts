import { z } from 'zod';

export interface CoResearcher {
  id?: string;
  name: string;
  department?: string;
  isExternal?: boolean;
  role?: string;
  contributionPercent?: number | null;
}

export interface CourseIntegration {
  code: string;
  name: string;
  department?: string;
}

export interface TrlOutput {
  name: string;
  trl: number | null;
  note?: string;
}

export interface ResearchProjectData {
  id: string; // Project code, e.g. "วศ.กพส. 1/2568"
  name: string; // Thai project name
  name_en?: string; // English project name
  head: string; // Head of project (e.g. "ผศ.ดร.สมชาย ใจดี")
  head_id?: string;
  department: string; // Primary department
  departments?: string[]; // Multiple departments involved
  co_researchers?: CoResearcher[];
  fund_source: string; // Funding source name
  fund_type?: 'ภายใน' | 'ภายนอก' | string;
  start_date?: string; // YYYY-MM or legacy duration string
  end_date?: string; // YYYY-MM
  fiscal_year_be?: number;
  collaboration_type?: string[]; // e.g. ['ในประเทศ', 'ต่างประเทศ', ...]
  project_nature?: string[]; // e.g. ['วิจัยพื้นฐาน', 'วิจัยประยุกต์', 'พัฒนาเชิงทดลอง', ...]
  budget_internal: number;
  budget_external: number;
  budget_total?: number;
  teaching_courses?: CourseIntegration[];
  applied_courses?: CourseIntegration[];
  academic_service?: string;
  cross_disciplinary?: string;
  trl_start?: number | null;
  trl_end?: number | null;
  trl_outputs?: TrlOutput[];
  _id?: string;
  created_at?: string;
  updated_at?: string;
}

// Zod validation schema
export const CoResearcherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'ต้องระบุชื่อผู้ร่วมวิจัย'),
  department: z.string().optional(),
  isExternal: z.boolean().optional(),
  role: z.string().optional(),
  contributionPercent: z.number().min(0).max(100).nullable().optional(),
});

export const CourseIntegrationSchema = z.object({
  code: z.string().min(1, 'ต้องระบุรหัสวิชา'),
  name: z.string().min(1, 'ต้องระบุชื่อวิชา'),
  department: z.string().optional(),
});

export const TrlOutputSchema = z.object({
  name: z.string().min(1, 'ต้องระบุชื่อผลผลิต'),
  trl: z.number().int().min(1).max(9).nullable().optional(),
  note: z.string().optional(),
});

export const ResearchProjectSchema = z.object({
  id: z.string().min(1, 'กรุณาระบุรหัสโครงการวิจัย'),
  name: z.string().min(2, 'กรุณาระบุชื่อโครงการวิจัย (ภาษาไทย)'),
  name_en: z.string().optional(),
  head: z.string().min(2, 'กรุณาระบุหัวหน้าโครงการวิจัย'),
  head_id: z.string().optional(),
  department: z.string().min(1, 'กรุณาระบุภาควิชา/หน่วยงานหลัก'),
  departments: z.array(z.string()).optional(),
  co_researchers: z.array(CoResearcherSchema).optional(),
  fund_source: z.string().min(1, 'กรุณาระบุแหล่งทุนวิจัย'),
  fund_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  fiscal_year_be: z.number().int().optional(),
  collaboration_type: z.array(z.string()).optional(),
  project_nature: z.array(z.string()).optional(),
  budget_internal: z.number().min(0, 'งบประมาณภายในต้องไม่ติดลบ').default(0),
  budget_external: z.number().min(0, 'งบประมาณภายนอกต้องไม่ติดลบ').default(0),
  budget_total: z.number().min(0).optional(),
  teaching_courses: z.array(CourseIntegrationSchema).optional(),
  applied_courses: z.array(CourseIntegrationSchema).optional(),
  academic_service: z.string().optional(),
  cross_disciplinary: z.string().optional(),
  trl_start: z.number().int().min(1).max(9).nullable().optional(),
  trl_end: z.number().int().min(1).max(9).nullable().optional(),
  trl_outputs: z.array(TrlOutputSchema).optional(),
  _id: z.string().optional(),
});
