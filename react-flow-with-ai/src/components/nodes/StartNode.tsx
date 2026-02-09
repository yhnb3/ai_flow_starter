import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { BPMNNode } from '../../types/bpmn';

const StartNode: React.FC<NodeProps<BPMNNode>> = ({ data, selected }) => {
  return (
    <div
      className={`px-6 py-4 rounded-full border-4 border-green-500 bg-green-50 min-w-[120px] ${
        selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      }`}
    >
      {/* Output handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />

      <div className="flex flex-col items-center">
        <div className="text-xs text-green-700 font-semibold mb-1">START</div>
        <div className="text-sm text-gray-700 text-center">{data.name}</div>
      </div>
    </div>
  );
};

export default StartNode;
