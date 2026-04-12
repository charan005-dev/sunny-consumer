import SlotRenderer from "./SlotRenderer";
import type { PageLayoutConfig } from "../../hooks/useLayout";

interface LayoutRendererProps {
  config: PageLayoutConfig;
  editMode?: boolean;
  selectedSlot?: string | null;
  dragHoverSlot?: string | null;
  onSlotClick?: (slotKey: string) => void;
}

function responsiveColumns(columns: string): string {
  return columns.replace(/(\d+)px/g, (_match, px) => {
    const num = parseInt(px, 10);
    if (num <= 100) return `clamp(48px, ${num}px, ${num}px)`;
    if (num <= 280) return `clamp(180px, 15vw, ${num}px)`;
    if (num <= 400) return `clamp(240px, 25vw, ${num}px)`;
    return `clamp(200px, 30vw, ${num}px)`;
  });
}

export default function LayoutRenderer({ config, editMode, selectedSlot, dragHoverSlot, onSlotClick }: LayoutRendererProps) {
  const isMobile = config.gridTemplate.columns === "1fr";

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : responsiveColumns(config.gridTemplate.columns),
    gridTemplateRows: config.gridTemplate.rows,
    gap: isMobile ? "12px" : config.gridTemplate.gap,
    gridTemplateAreas: config.gridTemplate.areas
      .map((row) => `"${row}"`)
      .join(" "),
    height: "100%",
  };

  return (
    <div style={gridStyle} className={isMobile ? "p-3 w-full" : "p-4 md:p-5 w-[75%]"}>
      {Object.entries(config.slots).map(([slotKey, slotConfig]) => (
        <SlotRenderer
          key={slotKey}
          slotKey={slotKey}
          componentCode={slotConfig.componentCode}
          gridArea={slotConfig.gridArea}
          props={slotConfig.props}
          editMode={editMode}
          isSelected={selectedSlot === slotKey}
          isDragHover={dragHoverSlot === slotKey}
          onClick={editMode ? () => onSlotClick?.(slotKey) : undefined}
        />
      ))}
    </div>
  );
}
