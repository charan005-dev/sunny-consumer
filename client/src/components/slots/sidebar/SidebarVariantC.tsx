import { CreditCard, Target, Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

interface Props {
  props: Record<string, unknown>;
}

const ICONS: Record<string, typeof Target> = {
  "My card": CreditCard,
  "My rewards": Target,
  "Health adventures": Heart,
};

const ROUTES: Record<string, string> = {
  "My card": "/my-card",
  "My rewards": "/rewards",
};

export default function SidebarVariantC({ props }: Props) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const items = (props.items as string[]) ?? ["My rewards", "Health adventures"];

  const isPreview = location.pathname.startsWith("/preview");
  const currentPath = isPreview
    ? new URLSearchParams(location.search).get("route") ?? "/rewards"
    : location.pathname;
  const activeItem = Object.entries(ROUTES).find(([, path]) => currentPath.startsWith(path))?.[0];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2.5">
      <div className="flex justify-around">
        {items.map((item) => {
          const Icon = ICONS[item] ?? Heart;
          const isActive = item === activeItem;
          const route = ROUTES[item];
          return (
            <button
              key={item}
              onClick={() => {
                if (!route || isPreview) return;
                navigate(route);
              }}
              className="flex flex-col items-center gap-1 py-1 px-3 text-xs transition-colors"
              style={isActive ? { color: theme.activeText, fontWeight: 600 } : { color: "#6b7280" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isActive ? theme.activeBg : "#f3f4f6" }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
