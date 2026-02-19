export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface DockZoneLayout {
  height?: number;
  sideInset?: number;
  bottomInset?: number;
}

const DEFAULT_DOCK_ZONE_HEIGHT = 88;
const DEFAULT_DOCK_ZONE_SIDE_INSET = 24;
const DEFAULT_DOCK_ZONE_BOTTOM_INSET = 12;
const DEFAULT_MIN_OVERLAP_RATIO = 0.18;

export function createRect(x: number, y: number, width: number, height: number): Rect {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  };
}

export function getDockZoneRect(
  viewportWidth: number,
  viewportHeight: number,
  layout: DockZoneLayout = {}
): Rect {
  const height = layout.height ?? DEFAULT_DOCK_ZONE_HEIGHT;
  const sideInset = layout.sideInset ?? DEFAULT_DOCK_ZONE_SIDE_INSET;
  const bottomInset = layout.bottomInset ?? DEFAULT_DOCK_ZONE_BOTTOM_INSET;

  const left = sideInset;
  const right = Math.max(viewportWidth - sideInset, left);
  const bottom = Math.max(viewportHeight - bottomInset, 0);
  const top = Math.max(bottom - height, 0);

  return { left, top, right, bottom };
}

export function getIntersectionArea(a: Rect, b: Rect): number {
  const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return overlapWidth * overlapHeight;
}

export function shouldDockPanel(
  panelRect: Rect,
  dockZoneRect: Rect,
  minOverlapRatio: number = DEFAULT_MIN_OVERLAP_RATIO
): boolean {
  const panelArea = Math.max(0, panelRect.right - panelRect.left) * Math.max(0, panelRect.bottom - panelRect.top);
  if (panelArea <= 0) return false;

  const overlapArea = getIntersectionArea(panelRect, dockZoneRect);
  return overlapArea / panelArea >= minOverlapRatio;
}
