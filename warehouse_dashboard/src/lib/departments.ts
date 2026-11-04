/**
 * Global Department System (Single Source of Truth)
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 */

export const DEPARTMENT_COLORS = {
  AE: "#65B98A",
  CPE: "#5B9BD5",
  IRE: "#4FA9A0",
  FE: "#E88762",
  IE: "#9B78D0",
  ME: "#777ED0",
  CE: "#D96B8A",
  EEEC: "#91B95B",
  DWT: "#D5A04F",
  NAMC: "#BB68BC",
  OFS: "#E9A88F",
  OTH: "#2E3136",
} as const;

export type DepartmentCode = keyof typeof DEPARTMENT_COLORS;

export type DepartmentGroup = "ภาควิชา" | "ศูนย์" | "สำนักงาน" | "อื่นๆ";

export interface DepartmentInfo {
  code: DepartmentCode | string;
  name: string;
  group: DepartmentGroup | string;
  color: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  { code: "AE", name: "ภาควิชาวิศวกรรมเกษตร", group: "ภาควิชา", color: DEPARTMENT_COLORS.AE },
  { code: "CPE", name: "ภาควิชาวิศวกรรมคอมพิวเตอร์", group: "ภาควิชา", color: DEPARTMENT_COLORS.CPE },
  { code: "IRE", name: "ภาควิชาวิศวกรรมชลประทาน", group: "ภาควิชา", color: DEPARTMENT_COLORS.IRE },
  { code: "FE", name: "ภาควิชาวิศวกรรมอาหาร", group: "ภาควิชา", color: DEPARTMENT_COLORS.FE },
  { code: "IE", name: "ภาควิชาวิศวกรรมอุตสาหการ", group: "ภาควิชา", color: DEPARTMENT_COLORS.IE },
  { code: "ME", name: "ภาควิชาวิศวกรรมเครื่องกล", group: "ภาควิชา", color: DEPARTMENT_COLORS.ME },
  { code: "CE", name: "ภาควิชาวิศวกรรมโยธา", group: "ภาควิชา", color: DEPARTMENT_COLORS.CE },
  { code: "EEEC", name: "ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม", group: "ศูนย์", color: DEPARTMENT_COLORS.EEEC },
  { code: "DWT", name: "ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร", group: "ศูนย์", color: DEPARTMENT_COLORS.DWT },
  { code: "NAMC", name: "ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ", group: "ศูนย์", color: DEPARTMENT_COLORS.NAMC },
  { code: "OFS", name: "สำนักงานเลขานุการ", group: "สำนักงาน", color: DEPARTMENT_COLORS.OFS },
  { code: "OTH", name: "อื่นๆ (ระบุเอง)", group: "อื่นๆ", color: DEPARTMENT_COLORS.OTH },
];

export const DEFAULT_DEPARTMENT_COLOR = "#2E3136";

/**
 * Text contrast mode for badges:
 * Font color is pure white #ffffff and bold as requested.
 */
export const BADGE_TEXT_MODE: "dark" | "white" = "white";

/**
 * Get color for a department code. Unknown codes fall back to DEFAULT_DEPARTMENT_COLOR (#2E3136).
 */
export function getDepartmentColor(code: string): string {
  if (!code) return DEFAULT_DEPARTMENT_COLOR;
  const upper = code.trim().toUpperCase() as DepartmentCode;
  if (DEPARTMENT_COLORS[upper]) {
    return DEPARTMENT_COLORS[upper];
  }
  const resolved = getDepartment(code);
  return resolved.color || DEFAULT_DEPARTMENT_COLOR;
}

/**
 * Returns text color for badge. Always returns white #ffffff as requested.
 */
export function getBadgeTextColor(_bgColor?: string): string {
  return "#ffffff";
}

/**
 * Resolves a department code or name (including legacy aliases, abbreviations, and data typos)
 * to its canonical { code, name, group, color }.
 * Custom / other values use code "OTH" and color "#2E3136".
 */
export function getDepartment(codeOrName: string | null | undefined): DepartmentInfo {
  if (!codeOrName || codeOrName === "-" || codeOrName === "nan" || codeOrName === "NaT") {
    return {
      code: "-",
      name: "ไม่ระบุสังกัด",
      group: "อื่นๆ",
      color: DEFAULT_DEPARTMENT_COLOR,
    };
  }

  const raw = String(codeOrName).trim();
  // Clean whitespace and linebreaks
  const clean = raw.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
  const upper = clean.toUpperCase();

  // Custom "OTH: Custom Name" or "OTH"
  if (upper === "OTH" || upper.startsWith("OTH:") || upper.startsWith("OTH :") || clean === "อื่นๆ" || clean.startsWith("อื่นๆ")) {
    const customName = clean.replace(/^OTH\s*:\s*/i, "").trim() || "อื่นๆ";
    return {
      code: "OTH",
      name: customName,
      group: "อื่นๆ",
      color: DEPARTMENT_COLORS.OTH,
    };
  }

  // 1. Direct code lookup (AE, CPE, IRE, FE, IE, ME, CE, EEEC, DWT, NAMC, OFS, OTH)
  const directMatch = DEPARTMENTS.find((d) => d.code.toUpperCase() === upper);
  if (directMatch) return directMatch;

  // 2. Legacy code lookup: ABE -> AE, TDW -> DWT, OFFICE -> OFS
  if (upper === "ABE") return DEPARTMENTS.find((d) => d.code === "AE")!;
  if (upper === "TDW") return DEPARTMENTS.find((d) => d.code === "DWT")!;
  if (upper === "OFFICE") return DEPARTMENTS.find((d) => d.code === "OFS")!;

  // 3. Exact name lookup
  const nameMatch = DEPARTMENTS.find(
    (d) => d.name === clean || d.name.replace("ภาควิชา", "") === clean.replace("ภาควิชา", "")
  );
  if (nameMatch) return nameMatch;

  // 4. Fuzzy / Keyword matching for real-world variations & typos
  // วิศวกรรมเกษตร (AE)
  if (clean.includes("เกษตร") || clean.includes("วศ.กษ.") || upper.includes("ABE") || upper === "AE") {
    return DEPARTMENTS.find((d) => d.code === "AE")!;
  }

  // วิศวกรรมคอมพิวเตอร์ (CPE)
  if (clean.includes("คอมพิวเตอร์") || clean.includes("คอม") || clean.includes("วศ.คพ.") || upper.includes("CPE")) {
    return DEPARTMENTS.find((d) => d.code === "CPE")!;
  }

  // วิศวกรรมชลประทาน (IRE) - includes typo "ศวกรรมชลประทาน", "วิศวกรรมการชลประทาน"
  if (clean.includes("ชลประทาน") || clean.includes("วศ.ชป.") || upper.includes("IRE")) {
    return DEPARTMENTS.find((d) => d.code === "IRE")!;
  }

  // วิศวกรรมอาหาร (FE) - includes "วิศวกรรมการอาหาร", typo "วิศกวรรมการอาหาร", "วศ.อห."
  if (clean.includes("อาหาร") || clean.includes("วศ.อห.") || upper.includes("FE")) {
    return DEPARTMENTS.find((d) => d.code === "FE")!;
  }

  // วิศวกรรมอุตสาหการ (IE)
  if (clean.includes("อุตสาหการ") || clean.includes("วศ.อหก.") || upper.includes("IE")) {
    return DEPARTMENTS.find((d) => d.code === "IE")!;
  }

  // วิศวกรรมเครื่องกล (ME) - includes typo "วิศววกรรมเครื่องกล"
  if (clean.includes("เครื่องกล") || clean.includes("วศ.คก.") || upper.includes("ME")) {
    return DEPARTMENTS.find((d) => d.code === "ME")!;
  }

  // วิศวกรรมโยธา (CE) - includes typos "วิศกวรรมโยธา", "วิศวกรรโยธา", "วศ.ยธ."
  if (clean.includes("โยธา") || clean.includes("วศ.ยธ.") || upper.includes("CE")) {
    return DEPARTMENTS.find((d) => d.code === "CE")!;
  }

  // ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม (EEEC)
  if (clean.includes("พลังงาน") || clean.includes("สิ่งแวดล้อม") || upper.includes("EEEC")) {
    return DEPARTMENTS.find((d) => d.code === "EEEC")!;
  }

  // ศูนย์ทดสอบประตู หน้าต่าง (DWT) - includes "ประตูหน้าต่างฯ", "ผนังกระจก", "TDW"
  if (clean.includes("ประตู") || clean.includes("หน้าต่าง") || clean.includes("ผนังกระจก") || upper.includes("TDW") || upper.includes("DWT")) {
    return DEPARTMENTS.find((d) => d.code === "DWT")!;
  }

  // ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ (NAMC) - includes "เครื่องจักรกลฯ"
  if (clean.includes("เครื่องจักรกล") || upper.includes("NAMC")) {
    return DEPARTMENTS.find((d) => d.code === "NAMC")!;
  }

  // สำนักงานเลขานุการ (OFS)
  if (clean.includes("เลขานุการ") || clean.includes("สำนักงาน") || upper.includes("OFFICE") || upper.includes("OFS")) {
    return DEPARTMENTS.find((d) => d.code === "OFS")!;
  }

  // 5. Fallback for custom / other departments (e.g. "งานพัฒนากายภาพ") -> uses code OTH and color #2E3136
  return {
    code: "OTH",
    name: clean,
    group: "อื่นๆ",
    color: DEPARTMENT_COLORS.OTH,
  };
}
