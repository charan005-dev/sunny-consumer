import { Globe, LogOut } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
  tenantName?: string;
  email?: string;
  onLogout?: () => void;
}

export default function Header({ tenantName, email, onLogout }: HeaderProps) {
  const theme = useTheme();

  return (
    <header
      className="text-white px-3 md:px-6 py-2.5 md:py-3 flex items-center justify-between overflow-hidden"
      style={{ backgroundColor: theme.headerBg }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <svg className="w-6 h-6 md:w-7 md:h-7 shrink-0" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="white" fillOpacity="0.15" />
          <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-base md:text-lg font-semibold tracking-tight">
          {tenantName ?? "Health Portal"}
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        {email && (
          <span className="text-xs md:text-sm text-white/60 truncate hidden md:block">{email}</span>
        )}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-white/70">
          <Globe className="w-4 h-4 shrink-0" />
          <select className="bg-transparent border-none text-white/70 text-sm cursor-pointer focus:outline-none">
            <option>English</option>
          </select>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-xs md:text-sm text-white/70 hover:text-white transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Sign out</span>
          </button>
        )}
      </div>
    </header>
  );
}
