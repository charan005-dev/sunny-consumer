import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === TITLE FONT ===
const TITLE_FONTS: Record<string, string> = {
  sans: "text-lg font-bold text-gray-900 font-sans",
  serif: "text-xl font-bold text-gray-900 font-serif",
  mono: "text-base font-bold text-gray-900 font-mono",
  light: "text-xl font-light text-gray-800 tracking-wide",
};

// === BODY FONT ===
const BODY_FONTS: Record<string, string> = {
  default: "text-sm text-gray-600 leading-relaxed",
  serif: "text-sm text-gray-600 leading-relaxed font-serif italic",
  small: "text-xs text-gray-500 leading-relaxed",
};

// === BUTTON STYLE ===
function BtnFilled({ theme }: { theme: TenantTheme }) {
  return <button className="mt-3 text-sm font-medium px-4 py-2 rounded-lg" style={{ backgroundColor: theme.primaryLight, color: theme.activeText }}>Learn more</button>;
}
function BtnOutline({ theme }: { theme: TenantTheme }) {
  return <button className="mt-3 text-sm font-medium px-4 py-2 rounded-lg border-2" style={{ borderColor: theme.primary, color: theme.primary }}>Learn more</button>;
}
function BtnLink({ theme }: { theme: TenantTheme }) {
  return <button className="mt-3 text-sm font-medium underline" style={{ color: theme.primary }}>Learn more →</button>;
}
function BtnPill({ theme }: { theme: TenantTheme }) {
  return <button className="mt-3 text-xs font-semibold px-4 py-2 rounded-full text-white" style={{ backgroundColor: theme.primary }}>Learn more</button>;
}
const BTNS: Record<string, typeof BtnFilled> = { filled: BtnFilled, outline: BtnOutline, link: BtnLink, pill: BtnPill };

// === BORDER STYLE ===
const BORDERS: Record<string, string> = {
  default: "border border-gray-200",
  accent: "border-l-4 border-gray-200",
  shadow: "border-0 shadow-md",
  none: "border-0",
};

// === MAIN ===
export default function InfoCardVariantC({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Earn more by completing wellness actions!";
  const body = (props.body as string) ?? "Complete activities to earn rewards toward your wellness goals.";
  const titleFont = (props.titleFont as string) ?? "sans";
  const bodyFont = (props.bodyFont as string) ?? "default";
  const btnStyle = (props.btnStyle as string) ?? "filled";
  const borderStyle = (props.borderStyle as string) ?? "default";

  const titleClass = TITLE_FONTS[titleFont] ?? TITLE_FONTS.sans;
  const bodyClass = BODY_FONTS[bodyFont] ?? BODY_FONTS.default;
  const Btn = BTNS[btnStyle] ?? BtnFilled;
  const borderClass = BORDERS[borderStyle] ?? BORDERS.default;
  const accentStyle = borderStyle === "accent" ? { borderLeftColor: theme.primary } : {};

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm h-full ${borderClass}`} style={accentStyle}>
      <div data-sub-key="titleFont" data-sub-label="Title Font" className="mb-2">
        <div className={titleClass}>{title}</div>
      </div>
      {body && (
        <div data-sub-key="bodyFont" data-sub-label="Body Font">
          <div className={bodyClass}>{body}</div>
        </div>
      )}
      <div data-sub-key="button" data-sub-label="Button">
        <Btn theme={theme} />
      </div>
    </div>
  );
}
