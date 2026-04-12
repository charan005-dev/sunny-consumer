import { createContext, useContext, type ReactNode } from "react";

export interface TenantTheme {
  tenant: string;
  // Header
  headerBg: string;
  headerText: string;
  // Primary accent
  primary: string;
  primaryLight: string;
  primaryDark: string;
  // Dial / gauge
  dialStroke: string;
  dialStrokeTrail: string;
  // Card accents
  cardBg: string;
  cardText: string;
  // Action badge
  badgeBg: string;
  badgeText: string;
  // Link / interactive
  linkColor: string;
  activeBg: string;
  activeText: string;
  // Status
  successColor: string;
}

const THEMES: Record<string, TenantTheme> = {
  kaiser: {
    tenant: "kaiser",
    headerBg: "#1a2744",
    headerText: "#ffffff",
    primary: "#2563eb",
    primaryLight: "#dbeafe",
    primaryDark: "#1e3a5f",
    dialStroke: "#16a34a",
    dialStrokeTrail: "#e5e7eb",
    cardBg: "#1e3a5f",
    cardText: "#ffffff",
    badgeBg: "#1e3a5f",
    badgeText: "#ffffff",
    linkColor: "#2563eb",
    activeBg: "#eff6ff",
    activeText: "#1d4ed8",
    successColor: "#16a34a",
  },
  sunny: {
    tenant: "sunny",
    headerBg: "#78350f",
    headerText: "#ffffff",
    primary: "#d97706",
    primaryLight: "#fef3c7",
    primaryDark: "#92400e",
    dialStroke: "#d97706",
    dialStrokeTrail: "#e5e7eb",
    cardBg: "#92400e",
    cardText: "#ffffff",
    badgeBg: "#92400e",
    badgeText: "#ffffff",
    linkColor: "#d97706",
    activeBg: "#fef3c7",
    activeText: "#92400e",
    successColor: "#16a34a",
  },
};

const DEFAULT_THEME = THEMES.kaiser;

const ThemeContext = createContext<TenantTheme>(DEFAULT_THEME);

export function ThemeProvider({ tenantCode, children }: { tenantCode: string; children: ReactNode }) {
  const theme = THEMES[tenantCode] ?? DEFAULT_THEME;
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
