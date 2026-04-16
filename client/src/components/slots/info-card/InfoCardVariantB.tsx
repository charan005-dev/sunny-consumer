import { useTheme } from "../../../contexts/ThemeContext";
import type { TenantTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

// === GRADIENT DIRECTION ===
const GRADIENTS: Record<string, string> = {
  diagonal: "135deg",
  horizontal: "90deg",
  vertical: "180deg",
  radial: "circle at top right",
};

// === DECORATION ===
const DECORATIONS: Record<string, (theme: TenantTheme) => React.ReactNode> = {
  circles: () => <><div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white/10" /><div className="absolute bottom-6 right-8 w-12 h-12 rounded-full border-2 border-white/10" /></>,
  lines: () => <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)" }} />,
  glow: (theme) => <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${theme.primary}40, transparent)` }} />,
  clean: () => null,
};

// === TITLE FONT ===
const TITLE_FONTS: Record<string, string> = {
  bold: "text-lg font-bold leading-snug",
  serif: "text-lg font-bold font-serif italic leading-snug",
  light: "text-xl font-light leading-snug tracking-wide",
  uppercase: "text-sm font-bold uppercase tracking-widest leading-relaxed",
};

// === CTA TEXT ===
const CTA_STYLES: Record<string, { text: string; className: string }> = {
  text: { text: "Tap to learn more", className: "text-sm opacity-70 mt-1" },
  button: { text: "Learn more →", className: "text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mt-2 inline-block" },
  hidden: { text: "", className: "" },
};

// === MAIN ===
export default function InfoCardVariantB({ props }: Props) {
  const theme = useTheme();
  const title = (props.title as string) ?? "Your chance to win $100 each month";
  const gradientDir = (props.gradientDir as string) ?? "diagonal";
  const decoration = (props.decoration as string) ?? "circles";
  const titleFont = (props.titleFont as string) ?? "bold";
  const ctaStyle = (props.ctaStyle as string) ?? "text";

  const gradAngle = GRADIENTS[gradientDir] ?? GRADIENTS.diagonal;
  const Deco = DECORATIONS[decoration] ?? DECORATIONS.circles;
  const fontClass = TITLE_FONTS[titleFont] ?? TITLE_FONTS.bold;
  const cta = CTA_STYLES[ctaStyle] ?? CTA_STYLES.text;

  const bgStyle = gradientDir === "radial"
    ? { background: `radial-gradient(${gradAngle}, ${theme.primaryDark}, ${theme.primary})` }
    : { background: `linear-gradient(${gradAngle}, ${theme.primaryDark}, ${theme.primary})` };

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm relative h-40" style={bgStyle}>
      <div data-sub-key="decoration" data-sub-label="Decoration">{Deco(theme)}</div>
      <div className="relative p-5 text-white flex flex-col justify-end h-full">
        <div data-sub-key="titleFont" data-sub-label="Title Font">
          <div className={fontClass}>{title}</div>
        </div>
        <div data-sub-key="cta" data-sub-label="Call to Action">
          {cta.text && <div className={cta.className}>{cta.text}</div>}
        </div>
      </div>
    </div>
  );
}
