import { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getComponent } from "../registry/componentRegistry";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function PreviewComponentPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const propsRaw = searchParams.get("props") ?? "{}";
  const tenantCode = searchParams.get("tenant") ?? "kaiser";

  const props = useMemo(() => {
    try {
      return JSON.parse(propsRaw);
    } catch {
      return {};
    }
  }, [propsRaw]);

  const entry = getComponent(code);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <p className="text-gray-500">Unknown component: <code className="bg-gray-100 px-1 rounded">{code}</code></p>
      </div>
    );
  }

  const Component = entry.component;

  return (
    <ThemeProvider tenantCode={tenantCode}>
      <div className="min-h-screen bg-[#f5f5f0] p-6 flex items-start justify-center">
        <div className="w-full max-w-[500px]">
          <Suspense fallback={<div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />}>
            <Component props={props} />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}
