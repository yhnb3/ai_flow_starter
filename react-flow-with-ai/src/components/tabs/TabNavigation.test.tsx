/**
 * TabNavigation 스크롤 기능 테스트 계획
 * 
 * ✅ 테스트 케이스:
 * 1. 많은 탭이 있을 때 overflow-x-auto가 작동하는지 확인
 * 2. 스크롤바가 숨겨지는지 확인 (scrollbar-hide 클래스)
 * 3. 좌/우 화살표 버튼으로 스크롤이 작동하는지 확인
 * 4. 탭 클릭 시 선택되는지 확인
 * 5. 탭 닫기 버튼이 작동하는지 확인
 * 6. 새 탭 추가 버튼이 작동하는지 확인
 * 
 * 🚀 실행 방법:
 * npm run test:scroll
 * 
 * 📋 현재 문제점 및 해결:
 * - flex-shrink-0을 TabButton에 추가하여 탭이 축소되지 않도록 함
 * - scrollbar-hide 클래스에 scrollbar-width: none; 추가하여 Firefox에서 스크롤바 숨김
 * - ::-webkit-scrollbar display: none; 추가하여 WebKit에서 스크롤바 숨김
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabNavigation from './TabNavigation';
import type { Diagram } from '../../types/diagram';

describe('TabNavigation (integration)', () => {
  const mockDiagrams: Diagram[] = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    name: `Diagram ${i + 1}`,
    nodes: [],
    edges: [],
    isModified: i % 2 === 0,
    createdAt: new Date(),
  }));

  const handlers = {
    onSelectDiagram: vi.fn(),
    onAddDiagram: vi.fn(),
    onCloseDiagram: vi.fn(),
  };

  beforeEach(() => {
    handlers.onSelectDiagram.mockClear();
    handlers.onAddDiagram.mockClear();
    handlers.onCloseDiagram.mockClear();
  });

  afterEach(() => {
    // restore prototype
    // @ts-expect-error - 테스트 후 scrollTo 프로토타입 복원
    delete Element.prototype.scrollTo;
  });

  it('renders tabs and supports click handlers', () => {
    render(
      <TabNavigation
        diagrams={mockDiagrams}
        activeDiagramId="1"
        onSelectDiagram={handlers.onSelectDiagram}
        onAddDiagram={handlers.onAddDiagram}
        onCloseDiagram={handlers.onCloseDiagram}
      />
    );

    // all tabs present
    mockDiagrams.forEach((d) => expect(screen.getByText(d.name)).toBeDefined());

    // click tab
    fireEvent.click(screen.getByText('Diagram 3'));
    expect(handlers.onSelectDiagram).toHaveBeenCalledWith('3');

    // click add
    fireEvent.click(screen.getByTitle('Add new diagram'));
    expect(handlers.onAddDiagram).toHaveBeenCalled();
  });

  it('scroll buttons call scrollTo on container (and wheel scroll moves scrollLeft)', () => {
    // polyfill scrollTo to update scrollLeft in jsdom
    // @ts-expect-error - jsdom에서 scrollTo 폴리필 필요
    Element.prototype.scrollTo = function ({ left }: { left: number }) {
      this.scrollLeft = left;
    };

    const { container } = render(
      <TabNavigation
        diagrams={mockDiagrams}
        activeDiagramId="1"
        onSelectDiagram={handlers.onSelectDiagram}
        onAddDiagram={handlers.onAddDiagram}
        onCloseDiagram={handlers.onCloseDiagram}
      />
    );

    const scrollContainer = container.querySelector('.scrollbar-hide') as HTMLElement;
    expect(scrollContainer).toBeTruthy();

    const leftButton = container.querySelector('button[title="Scroll left"]') as HTMLElement;
    const rightButton = container.querySelector('button[title="Scroll right"]') as HTMLElement;
    expect(leftButton).toBeTruthy();
    expect(rightButton).toBeTruthy();

    // initial
    expect(scrollContainer.scrollLeft).toBe(0);

    // click right -> scrollLeft increases
    fireEvent.click(rightButton);
    expect(scrollContainer.scrollLeft).toBeGreaterThan(0);

    const prev = scrollContainer.scrollLeft;

    // wheel event to scroll horizontally
    fireEvent.wheel(scrollContainer, { deltaY: 120 });
    expect(scrollContainer.scrollLeft).toBeGreaterThan(prev);

    // click left -> scrollLeft decreases
    fireEvent.click(leftButton);
    expect(scrollContainer.scrollLeft).toBeLessThanOrEqual(prev);
  });

  it('close button triggers handler', () => {
    render(
      <TabNavigation
        diagrams={mockDiagrams}
        activeDiagramId="1"
        onSelectDiagram={handlers.onSelectDiagram}
        onAddDiagram={handlers.onAddDiagram}
        onCloseDiagram={handlers.onCloseDiagram}
      />
    );

    const closeBtns = screen.getAllByTitle('Close diagram');
    expect(closeBtns.length).toBeGreaterThan(0);
    fireEvent.click(closeBtns[0]);
    expect(handlers.onCloseDiagram).toHaveBeenCalledWith('1');
  });
});
