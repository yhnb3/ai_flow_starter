import React from 'react';

interface DockDropZoneProps {
  visible: boolean;
  active: boolean;
}

const DockDropZone: React.FC<DockDropZoneProps> = ({ visible, active }) => {
  if (!visible) return null;

  return (
    <div className="fixed left-6 right-6 bottom-3 z-[999] pointer-events-none">
      <div
        className={`h-[88px] rounded-xl border-2 border-dashed px-4 flex items-center justify-center transition-all duration-150 ${
          active
            ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_0_3px_rgba(59,130,246,0.25)]'
            : 'border-gray-500 bg-gray-900/65'
        }`}
      >
        <p className="text-sm font-medium text-gray-200">
          {active ? '여기에 놓으면 Docked 모드로 전환됩니다' : '패널을 아래 영역으로 드래그해 Docked 모드로 전환'}
        </p>
      </div>
    </div>
  );
};

export default DockDropZone;
