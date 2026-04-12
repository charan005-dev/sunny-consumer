import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

export default function DialVariantA({ props }: Props) {
  const theme = useTheme();
  const earned = (props.earned as number) ?? 75;
  const max = (props.max as number) ?? 150;
  const left = max - earned;
  const pct = Math.min(earned / max, 1);

  const radius = 70;
  const strokeWidth = 14;
  const center = 80;
  const startAngle = -220;
  const endAngle = 40;
  const totalAngle = endAngle - startAngle;
  const currentAngle = startAngle + totalAngle * pct;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const tickCount = 24;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const angle = startAngle + (totalAngle * i) / tickCount;
    const isMajor = i % 4 === 0;
    const innerR = radius - strokeWidth / 2 - (isMajor ? 7 : 4);
    const outerR = radius - strokeWidth / 2 - 1;
    const rad = (angle * Math.PI) / 180;
    return { x1: center + innerR * Math.cos(rad), y1: center + innerR * Math.sin(rad), x2: center + outerR * Math.cos(rad), y2: center + outerR * Math.sin(rad), isMajor };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col p-4">
      <div className="mb-1">
        <h3 className="text-base font-bold text-gray-900">My rewards</h3>
        <p className="text-[11px] text-gray-400">Check out your actions below to start earning.</p>
      </div>
      <div className="flex-1 flex items-center justify-between">
        {/* Earned - left */}
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: theme.dialStroke }}>${earned}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Earned</div>
        </div>

        {/* Gauge - center */}
        <svg viewBox="0 0 160 120" className="w-[140px] shrink-0">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.dialStroke} />
              <stop offset="100%" stopColor={theme.dialStroke} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d={describeArc(startAngle, endAngle)} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={describeArc(startAngle, currentAngle)} fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth} strokeLinecap="round" />
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.isMajor ? "#9ca3af" : "#d1d5db"} strokeWidth={t.isMajor ? 1.5 : 0.8} />
          ))}
          <text x={center} y={center - 6} textAnchor="middle" fill="#111827" fontSize="28" fontWeight="800" fontFamily="system-ui">${left}</text>
          <text x={center} y={center + 10} textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="system-ui">Left to earn</text>
        </svg>

        {/* Maximum - right */}
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">${max}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Maximum</div>
        </div>
      </div>
    </div>
  );
}
