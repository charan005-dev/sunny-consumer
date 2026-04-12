import { ChevronRight } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const ADVENTURES = [
  { name: "Fitness and exercise adventure", color: "#16a34a" },
  { name: "Self-care and wellness adventure", color: "#2563eb" },
  { name: "Healthy eating adventure", color: "#d97706" },
  { name: "Sleep better challenge", color: "#7c3aed" },
  { name: "Hydration tracker", color: "#0891b2" },
  { name: "Mindfulness journey", color: "#be185d" },
];

export default function AdventuresVariantA({ props: _props }: Props) {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bold text-gray-900">For you</h3>
        <button className="flex items-center gap-0.5 text-sm font-medium" style={{ color: theme.linkColor }}>
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-5 pb-5 overflow-x-auto">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {ADVENTURES.map((adv) => (
            <div
              key={adv.name}
              className="shrink-0 w-[200px] rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="h-28 relative" style={{ backgroundColor: adv.color + "15" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: adv.color + "25" }} />
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 leading-snug mb-2">{adv.name}</div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
