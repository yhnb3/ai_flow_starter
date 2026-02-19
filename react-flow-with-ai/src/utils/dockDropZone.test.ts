import { describe, expect, it } from 'vitest';
import { createRect, getDockZoneRect, getIntersectionArea, shouldDockPanel } from './dockDropZone';

describe('dockDropZone utils', () => {
  it('viewport 기준으로 dock zone rect를 계산한다', () => {
    const zone = getDockZoneRect(1200, 800, {
      height: 100,
      sideInset: 20,
      bottomInset: 10,
    });

    expect(zone).toEqual({
      left: 20,
      top: 690,
      right: 1180,
      bottom: 790,
    });
  });

  it('두 rect의 겹치는 면적을 계산한다', () => {
    const a = createRect(0, 0, 100, 100);
    const b = createRect(50, 50, 100, 100);

    expect(getIntersectionArea(a, b)).toBe(2500);
  });

  it('겹치는 비율이 기준 이상이면 dock 가능으로 판단한다', () => {
    const panelRect = createRect(100, 680, 300, 200);
    const dockZoneRect = getDockZoneRect(1200, 800, {
      height: 100,
      sideInset: 24,
      bottomInset: 0,
    });

    expect(shouldDockPanel(panelRect, dockZoneRect, 0.12)).toBe(true);
  });

  it('겹치는 비율이 기준 미만이면 dock 불가로 판단한다', () => {
    const panelRect = createRect(100, 780, 300, 200);
    const dockZoneRect = getDockZoneRect(1200, 800, {
      height: 100,
      sideInset: 24,
      bottomInset: 0,
    });

    expect(shouldDockPanel(panelRect, dockZoneRect, 0.18)).toBe(false);
  });
});
