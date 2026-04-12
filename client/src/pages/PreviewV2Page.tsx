import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ThemeProvider } from "../contexts/ThemeContext";
import Header from "../components/common/Header";
import { getComponent } from "../registry/componentRegistry";

interface PlacedComponent {
  id: string;
  componentCode: string;
  name: string;
  col: number;
  row: number;
  colSpan: number;
  height: number; // 0 = auto
  props: Record<string, unknown>;
}

interface DropTarget {
  col: number;
  row: number;
}

const TOTAL_COLS = 12;
const MAX_ROWS = 6;

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Find which cells are occupied
function getOccupied(components: PlacedComponent[]): Set<string> {
  const s = new Set<string>();
  for (const c of components) {
    for (let col = c.col; col < c.col + c.colSpan; col++) {
      s.add(`${c.row}-${col}`);
    }
  }
  return s;
}

// Find all valid drop positions for a given colSpan
function findDropTargets(components: PlacedComponent[], colSpan: number): DropTarget[] {
  const occupied = getOccupied(components);
  const maxRow = components.length > 0 ? Math.max(...components.map((c) => c.row)) + 1 : 1;
  const rows = Math.max(maxRow, MAX_ROWS);
  const targets: DropTarget[] = [];

  for (let row = 1; row <= rows; row++) {
    for (let startCol = 1; startCol <= TOTAL_COLS - colSpan + 1; startCol++) {
      let fits = true;
      for (let c = startCol; c < startCol + colSpan; c++) {
        if (occupied.has(`${row}-${c}`)) { fits = false; break; }
      }
      if (fits) targets.push({ col: startCol, row });
    }
  }
  return targets;
}

export default function PreviewV2Page() {
  const [searchParams] = useSearchParams();
  const tenantCode = searchParams.get("tenantCode") ?? "kaiser";
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragSpan, setDragSpan] = useState<number>(0);
  const [dragCode, setDragCode] = useState<string | null>(null);
  const [dragProps, setDragProps] = useState<Record<string, unknown>>({});
  const [hoverTarget, setHoverTarget] = useState<string>("");  // "row-col"
  const isDragging = dragSpan > 0;

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const msg = event.data;
      if (!msg?.type) return;
      if (msg.type === "v2-layout") setComponents(msg.components ?? []);
      if (msg.type === "v2-select") setSelectedId(msg.id);
      if (msg.type === "v2-drag") {
        setDragSpan(msg.colSpan);
        setDragCode(msg.componentCode);
        setDragProps(msg.props);
        // Find nearest drop target
        requestAnimationFrame(() => {
          const slots = document.querySelectorAll("[data-drop-target]");
          let best = "", bestDist = Infinity;
          slots.forEach((el) => {
            const r = el.getBoundingClientRect();
            const d = (msg.x - (r.left + r.width / 2)) ** 2 + (msg.y - (r.top + r.height / 2)) ** 2;
            if (d < bestDist) { bestDist = d; best = el.getAttribute("data-drop-target") ?? ""; }
          });
          setHoverTarget(best);
          if (best) {
            const [row, col] = best.split("-").map(Number);
            window.parent.postMessage({ type: "v2-hover-pos", row, col }, "*");
          }
        });
      }
      if (msg.type === "v2-drag-end") {
        setDragSpan(0);
        setDragCode(null);
        setHoverTarget("");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClick = useCallback((id: string) => {
    setSelectedId(id);
    window.parent.postMessage({ type: "v2-clicked", id }, "*");
  }, []);
  const handleRemove = useCallback((id: string) => {
    window.parent.postMessage({ type: "v2-remove", id }, "*");
  }, []);

  const dropTargets = isDragging ? findDropTargets(components, dragSpan) : [];
  const GhostEntry = dragCode ? getComponent(dragCode) : null;
  const GhostComp = GhostEntry?.component;
  const maxRow = components.length > 0 ? Math.max(...components.map((c) => c.row)) : 0;
  const gridRows = isDragging ? Math.max(maxRow + 1, MAX_ROWS) : maxRow || 1;

  return (
    <ThemeProvider tenantCode={tenantCode}>
      <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
        <Header tenantName={capitalize(tenantCode)} />
        <div className="flex-1 p-4">
          {components.length === 0 && !isDragging ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-400">Drag components from the library to build your layout</p>
            </div>
          ) : (
            <div className="grid gap-2" style={{
              gridTemplateColumns: `repeat(${TOTAL_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, auto)`,
            }}>
              {/* Placed components */}
              {components.map((comp) => {
                const entry = getComponent(comp.componentCode);
                if (!entry) return null;
                const Comp = entry.component;
                const isSelected = selectedId === comp.id;
                return (
                  <div key={comp.id}
                    style={{ gridColumn: `${comp.col} / span ${comp.colSpan}`, gridRow: comp.row, ...(comp.height > 0 ? { height: comp.height, overflow: "hidden" } : {}) }}
                    className={`relative cursor-pointer group ${isSelected ? "ring-2 ring-black rounded-2xl" : ""} ${isDragging ? "opacity-70" : ""}`}
                    onClick={() => !isDragging && handleClick(comp.id)}>
                    <Suspense fallback={<div className="bg-gray-200 rounded-2xl h-32 animate-pulse" />}>
                      <Comp props={comp.props} />
                    </Suspense>
                    {!isDragging && (
                      <div className={`absolute inset-0 rounded-2xl transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-black/70 rounded-t-2xl">
                          <span className="text-[10px] font-medium text-white">{comp.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleRemove(comp.id); }} className="p-0.5 rounded hover:bg-red-500/50">
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Drop targets — only visible during drag */}
              {dropTargets.map((t) => {
                const key = `${t.row}-${t.col}`;
                const isHover = hoverTarget === key;
                return (
                  <div key={`target-${key}`}
                    data-drop-target={key}
                    style={{ gridColumn: `${t.col} / span ${dragSpan}`, gridRow: t.row }}
                    className={`relative rounded-2xl overflow-hidden transition-all ${
                      isHover ? "ring-3 ring-black shadow-lg scale-[1.01]" : "ring-1 ring-gray-300"
                    }`}>
                    {/* Ghost component at real size — defines the cell height */}
                    {GhostComp ? (
                      <div className={`pointer-events-none transition-opacity ${isHover ? "opacity-20" : "opacity-10"}`}>
                        <Suspense fallback={<div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />}>
                          <GhostComp props={dragProps} />
                        </Suspense>
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-100 rounded-2xl" />
                    )}
                    {/* Center label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                        isHover ? "bg-black text-white" : "bg-white/90 text-gray-400 border border-gray-200"
                      }`}>
                        {isHover ? "Drop here" : "Available"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
