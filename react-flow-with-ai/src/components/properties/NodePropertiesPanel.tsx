import React from 'react';
import type { BPMNNode, BPMNNodeData } from '../../types/bpmn';

interface NodePropertiesPanelProps {
  selectedNode: BPMNNode;
  onChange: (nodeId: string, data: Partial<BPMNNodeData>) => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  selectedNode,
  onChange,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(selectedNode.id, { name: e.target.value });
  };

  const nodeTypeLabel = selectedNode.type === 'start' ? 'Start' : 'End';

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Type
        </label>
        <div className="text-sm text-white">{nodeTypeLabel}</div>
      </div>

      <div>
        <label htmlFor="node-name" className="block text-xs font-medium text-gray-400 mb-1">
          Name
        </label>
        <input
          id="node-name"
          type="text"
          value={selectedNode.data.name}
          onChange={handleNameChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter node name"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          ID
        </label>
        <div className="text-xs text-gray-500 font-mono">{selectedNode.id}</div>
      </div>
    </div>
  );
};

export default NodePropertiesPanel;
