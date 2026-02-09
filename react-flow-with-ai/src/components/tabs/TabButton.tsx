import React from 'react';
import type { Diagram } from '../../types/diagram';

interface TabButtonProps {
  diagram: Diagram;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  diagram,
  isActive,
  onSelect,
  onClose,
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      onClick={onSelect}
      className={`tab-btn-base flex-shrink-0 ${isActive ? 'tab-btn-active' : 'tab-btn-inactive'}`}
    >
      {/* Icon */}
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
      </svg>

      {/* Name */}
      <span className="text-sm font-medium">{diagram.name}</span>

      {/* Modified indicator */}
      {diagram.isModified && (
        <span className="text-xs text-orange-400 font-bold">●</span>
      )}

      {/* Close button */}
      <button
        onClick={handleClose}
        className="icon-btn ml-1"
        title="Close diagram"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default TabButton;
