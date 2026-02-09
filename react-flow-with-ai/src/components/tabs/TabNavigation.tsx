import React, { useRef } from 'react';
import type { Diagram } from '../../types/diagram';
import TabButton from './TabButton';

interface TabNavigationProps {
  diagrams: Diagram[];
  activeDiagramId: string;
  onSelectDiagram: (id: string) => void;
  onAddDiagram: () => void;
  onCloseDiagram: (id: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  diagrams,
  activeDiagramId,
  onSelectDiagram,
  onAddDiagram,
  onCloseDiagram,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      // 마우스 휠의 수직 스크롤을 수평 스크롤로 변환
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 border-b border-gray-700 px-4 py-3">
      {/* Left scroll button */}
      <button
        onClick={() => scroll('left')}
        className="icon-btn"
        title="Scroll left"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex-1 flex gap-1 scrollbar-hide"
      >
        {diagrams.map((diagram) => (
          <TabButton
            key={diagram.id}
            diagram={diagram}
            isActive={diagram.id === activeDiagramId}
            onSelect={() => onSelectDiagram(diagram.id)}
            onClose={() => onCloseDiagram(diagram.id)}
          />
        ))}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll('right')}
        className="icon-btn"
        title="Scroll right"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Add new diagram button */}
      <button
        onClick={onAddDiagram}
        className="icon-btn hover:text-green-400"
        title="Add new diagram"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default TabNavigation;
