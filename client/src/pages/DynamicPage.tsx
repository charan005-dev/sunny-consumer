import { useLocation } from "react-router-dom";
import { useLayout } from "../hooks/useLayout";
import LayoutRenderer from "../components/renderer/LayoutRenderer";

function LoadingSkeleton() {
  return (
    <div className="p-4 md:p-5 w-[75%]" style={{
      display: "grid",
      gridTemplateColumns: "clamp(180px, 15vw, 240px) 1fr clamp(240px, 25vw, 340px)",
      gridTemplateRows: "340px 200px minmax(240px, auto)",
      gap: "16px",
      gridTemplateAreas: '"sidebar main_top right" "sidebar main_bottom right" "sidebar footer footer"',
      height: "100%",
    }}>
      {/* Sidebar skeleton */}
      <div style={{ gridArea: "sidebar" }} className="bg-white rounded-2xl border border-gray-100 animate-pulse p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Main top skeleton */}
      <div style={{ gridArea: "main_top" }} className="bg-white rounded-2xl border border-gray-100 animate-pulse p-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-48 mb-6" />
        <div className="flex justify-center">
          <div className="w-40 h-40 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Right skeleton */}
      <div style={{ gridArea: "right" }} className="bg-white rounded-2xl border border-gray-100 animate-pulse p-5">
        <div className="h-4 bg-gray-200 rounded w-28 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-full mb-1.5" />
                <div className="h-2 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main bottom skeleton */}
      <div style={{ gridArea: "main_bottom" }} className="bg-white rounded-2xl border border-gray-100 animate-pulse p-5">
        <div className="h-4 bg-gray-200 rounded w-40 mb-3" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>

      {/* Footer skeleton */}
      <div style={{ gridArea: "footer" }} className="bg-white rounded-2xl border border-gray-100 animate-pulse p-5">
        <div className="h-4 bg-gray-200 rounded w-28 mb-3" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 bg-gray-100 rounded flex-1" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DynamicPage() {
  const { pathname } = useLocation();
  const { data: layoutConfig, isLoading, error } = useLayout(pathname);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !layoutConfig) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No layout configured</h2>
          <p className="text-gray-500 text-sm">
            No published layout found for <code className="bg-gray-100 px-1 rounded">{pathname}</code> on this viewport.
          </p>
        </div>
      </div>
    );
  }

  return <LayoutRenderer config={layoutConfig} />;
}
