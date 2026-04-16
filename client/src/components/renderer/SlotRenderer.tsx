import { Suspense, useEffect, useRef, useState } from "react";
import { getComponent } from "../../registry/componentRegistry";

interface SlotRendererProps {
  slotKey: string;
  componentCode: string;
  gridArea: string;
  props: Record<string, unknown>;
  editMode?: boolean;
  isSelected?: boolean;
  selectedSubKey?: string | null;
  isDragHover?: boolean;
  onClick?: () => void;
}

export default function SlotRenderer({ slotKey, componentCode, gridArea, props, editMode, isSelected, selectedSubKey, isDragHover, onClick }: SlotRendererProps) {
  const entry = getComponent(componentCode);
  const containerRef = useRef<HTMLDivElement>(null);
  const [localSubKey, setLocalSubKey] = useState<string | null>(null);

  // Use either the prop from parent or local state (whichever is set)
  const activeSubKey = selectedSubKey ?? localSubKey;

  // Sync from parent
  useEffect(() => {
    if (selectedSubKey !== undefined) setLocalSubKey(selectedSubKey);
  }, [selectedSubKey]);

  // Apply/remove highlight class on the sub-element
  useEffect(() => {
    if (!containerRef.current) return;
    document.querySelectorAll(".sub-highlight").forEach((el) => {
      el.classList.remove("sub-highlight");
    });
    if (activeSubKey) {
      const el = containerRef.current.querySelector(`[data-sub-key="${activeSubKey}"]`);
      if (el) el.classList.add("sub-highlight");
    }
  }, [activeSubKey]);

  if (!entry) {
    return (
      <div style={{ gridArea }} data-slot-key={slotKey} className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
        Unknown component: {componentCode} (slot: {slotKey})
      </div>
    );
  }

  const Component = entry.component;
  const hasSubSelected = !!activeSubKey;

  return (
    <div
      ref={containerRef}
      data-slot-key={slotKey}
      style={{ gridArea }}
      onClick={editMode ? (e: React.MouseEvent) => {
        const subEl = (e.target as HTMLElement).closest("[data-sub-key]") as HTMLElement | null;
        if (subEl) {
          const subKey = subEl.getAttribute("data-sub-key");
          e.stopPropagation();
          // Clear ALL highlights across entire page, then highlight only the clicked element
          document.querySelectorAll(".sub-highlight").forEach((el) => el.classList.remove("sub-highlight"));
          subEl.classList.add("sub-highlight");
          setLocalSubKey(subKey);
          window.parent.postMessage({ type: "slot-clicked", slotKey }, "*");
          window.parent.postMessage({ type: "sub-clicked", slotKey, subKey }, "*");
          return;
        }
        // Clicked the block (not a sub-element) — clear sub selection
        setLocalSubKey(null);
        onClick?.();
      } : undefined}
      className={`relative ${editMode ? "cursor-pointer group" : ""}`}
    >
      {/* Content */}
      <div className="h-full overflow-y-auto rounded-2xl">
        <Suspense fallback={<div className="bg-gray-100 rounded-2xl p-6 animate-pulse h-32" />}>
          <Component props={props} />
        </Suspense>
      </div>

      {/* Edit mode: block outline + label */}
      {editMode && (
        <>
          <div
            className={`absolute -inset-1 rounded-2xl pointer-events-none transition-all ${
              isDragHover
                ? "border-2 border-black bg-black/5"
                : isSelected && hasSubSelected
                ? "border border-dashed border-neutral-300"
                : isSelected
                ? "border-2 border-black"
                : "border-2 border-transparent group-hover:border-neutral-300"
            }`}
          />
          <div className={`absolute -top-1 left-2 -translate-y-full px-2 py-0.5 rounded-t-md text-[10px] font-semibold uppercase tracking-wider pointer-events-none transition-opacity ${
            isDragHover
              ? "bg-black text-white opacity-100"
              : isSelected && !hasSubSelected
              ? "bg-black text-white opacity-100"
              : isSelected && hasSubSelected
              ? "bg-neutral-400 text-white opacity-100"
              : "bg-neutral-500 text-white opacity-0 group-hover:opacity-100"
          }`}>
            {isDragHover ? "Drop here" : slotKey}
          </div>
        </>
      )}
    </div>
  );
}
