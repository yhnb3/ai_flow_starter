import React from 'react';
import type { BPMNNodeType } from '../../types/bpmn';

interface NodePaletteProps {
  onAddNode: (type: BPMNNodeType) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const onDragStart = (event: React.DragEvent, nodeType: BPMNNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 border-b border-gray-700">
      <span className="text-sm text-gray-400 font-medium">Nodes:</span>
      
      {/* Start Node Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, 'start')}
        onClick={() => onAddNode('start')}
        title="Click to add or drag to canvas"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
        <span className="text-sm font-medium">Start</span>
      </button>

      {/* End Node Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => onDragStart(e, 'end')}
        onClick={() => onAddNode('end')}
        title="Click to add or drag to canvas"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </svg>
        <span className="text-sm font-medium">End</span>
      </button>

      <div className="ml-auto text-xs text-gray-500">
        Drag to canvas or click to add
      </div>
    </div>
  );
};

export default NodePalette;
