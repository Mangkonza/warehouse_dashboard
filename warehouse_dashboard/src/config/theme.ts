/**
 * Centralized Design Tokens and Theme Colors
 * Standard KU Green #00A651, Department Crimson #990000, Chart Palettes, and Status Colors.
 */

export const THEME_COLORS = {
  primary: "#00A651",
  primaryHover: "#008f44",
  primaryLight: "#e8f5e9",
  primaryBorder: "#86efac",

  departmentBadge: "#990000",

  sidebarBg: "#1e2327",
  sidebarHover: "#2d343c",
  sidebarText: "#94a3b8",
  sidebarTextActive: "#ffffff",

  status: {
    success: "#059669",
    successBg: "#ecfdf5",
    info: "#0284c7",
    infoBg: "#f0f9ff",
    warning: "#d97706",
    warningBg: "#fffbeb",
    danger: "#dc2626",
    dangerBg: "#fef2f2",
  },

  chart: {
    fontFamily: "'Kanit', sans-serif",
    fontSize: 12,
    textColor: "#0f172a",
    research: "#006838",
    academic: "#1565c0",
    publication: "#8e24aa",
    service: "#ef6c00",
    ip: "#d81b60",
    palette: [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC926",
    ],
  },
} as const;
