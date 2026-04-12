import { Suspense } from "react";
import { getComponent } from "../../registry/componentRegistry";

interface SlotRendererProps {
  slotKey: string;
  componentCode: string;
  gridArea: string;
  props: Record<string, unknown>;
  editMode?: boolean;
  isSelected?: boolean;
  isDragHover?: boolean;
  onClick?: () => void;
}

export default function SlotRenderer({ slotKey, componentCode, gridArea, props, editMode, isSelected, isDragHover, onClick }: SlotRendererProps) {
  const entry = getComponent(componentCode);

  if (!entry) {
    return (
      <div style={{ gridArea }} data-slot-key={slotKey} className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
        Unknown component: {componentCode} (slot: {slotKey})
      </div>
    );
  }

  const Component = entry.component;

  return (
    <div
      data-slot-key={slotKey}
      style={{ gridArea }}
      onClick={editMode ? onClick : undefined}
      className={`relative ${editMode ? "cursor-pointer group" : ""}`}
    >
      {/* Content */}
      <div className="h-full overflow-y-auto rounded-2xl">
        <Suspense
          fallback={<div className="bg-gray-100 rounded-2xl p-6 animate-pulse h-32" />}
        >
          <Component props={props} />
        </Suspense>
      </div>

      {/* Edit mode: selection outline + label (outside the content flow) */}
      {editMode && (
        <>
          {/* Outline border */}
          <div
            className={`absolute -inset-1 rounded-2xl pointer-events-none transition-all ${
              isDragHover
                ? "border-2 border-black bg-black/5"
                : isSelected
                ? "border-2 border-black"
                : "border-2 border-transparent group-hover:border-neutral-300"
            }`}
          />
          {/* Label */}
          <div className={`absolute -top-1 left-2 -translate-y-full px-2 py-0.5 rounded-t-md text-[10px] font-semibold uppercase tracking-wider pointer-events-none transition-opacity ${
            isDragHover
              ? "bg-black text-white opacity-100"
              : isSelected
              ? "bg-black text-white opacity-100"
              : "bg-neutral-500 text-white opacity-0 group-hover:opacity-100"
          }`}>
            {isDragHover ? "Drop here" : slotKey}
          </div>
        </>
      )}
    </div>
  );
}
