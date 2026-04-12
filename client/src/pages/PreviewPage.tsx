import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { ThemeProvider } from "../contexts/ThemeContext";
import Header from "../components/common/Header";
import LayoutRenderer from "../components/renderer/LayoutRenderer";
import type { PageLayoutConfig } from "../hooks/useLayout";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PreviewPage() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const route = searchParams.get("route") ?? "/rewards";
  const viewport = (searchParams.get("viewport") ?? "desktop") as "desktop" | "mobile";
  const tenantCode = searchParams.get("tenantCode") ?? "";
  const cohortCode = searchParams.get("cohortCode") ?? "default";
  const status = searchParams.get("status") ?? "draft";
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dragHoverSlot, setDragHoverSlot] = useState<string | null>(null);

  const { data: layoutConfig, isLoading, error } = useQuery<PageLayoutConfig>({
    queryKey: ["preview-layout", route, viewport, tenantCode, cohortCode, status],
    queryFn: async () => {
      const res = await api.get("/preview/layout", {
        params: { route, viewport, tenantCode, cohortCode, status },
      });
      if (res.data.fallbackCohort) {
        window.parent.postMessage({ type: "cohort-fallback", fallbackCohort: res.data.fallbackCohort }, "*");
      }
      return res.data.data;
    },
    enabled: !!tenantCode,
    staleTime: 0,
    placeholderData: (prev: PageLayoutConfig | undefined) => prev,
  });

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const msg = event.data;
      if (!msg?.type) return;
      if (msg.type === "select-slot") setSelectedSlot(msg.slotKey);
      if (msg.type === "refresh") queryClient.invalidateQueries({ queryKey: ["preview-layout"] });
      if (msg.type === "drag-hover") setDragHoverSlot(msg.slotKey);
      if (msg.type === "drag-end") setDragHoverSlot(null);
      if (msg.type === "get-slot-rects") {
        const rects: Record<string, { top: number; left: number; width: number; height: number }> = {};
        document.querySelectorAll("[data-slot-key]").forEach((el) => {
          const key = el.getAttribute("data-slot-key");
          if (key) {
            const r = el.getBoundingClientRect();
            rects[key] = { top: r.top, left: r.left, width: r.width, height: r.height };
          }
        });
        window.parent.postMessage({ type: "slot-rects", rects }, "*");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [queryClient]);

  const handleSlotClick = useCallback((slotKey: string) => {
    setSelectedSlot(slotKey);
    window.parent.postMessage({ type: "slot-clicked", slotKey }, "*");
  }, []);

  if (!tenantCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <p className="text-gray-500">Missing tenantCode parameter</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0]">
        <div className="p-8">
          <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !layoutConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No layout found</h2>
          <p className="text-gray-500 text-sm">
            No {status} layout for <code className="bg-gray-100 px-1 rounded">{route}</code>{" "}
            ({tenantCode}/{cohortCode}, {viewport})
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider tenantCode={tenantCode}>
      <div className="h-screen flex flex-col bg-[#f5f5f0] overflow-hidden">
        {/* Header */}
        <Header tenantName={capitalize(tenantCode)} />

        {/* Layout grid — fills remaining height */}
        <div className="flex-1 min-h-0 overflow-auto">
          <LayoutRenderer
            config={layoutConfig!}
            editMode
            selectedSlot={selectedSlot}
            dragHoverSlot={dragHoverSlot}
            onSlotClick={handleSlotClick}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
