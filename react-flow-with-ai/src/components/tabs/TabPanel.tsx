import React from 'react';
import type { Diagram } from '../../types/diagram';
import type { Node, Edge } from '@xyflow/react';
import BPMNEditor from './BPMNEditor';

interface TabPanelProps {
  diagram: Diagram;
  onUpdateDiagram: (diagram: Diagram) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ diagram, onUpdateDiagram }) => {
  const handleNodesChange = (nodes: Node[]) => {
    onUpdateDiagram({
      ...diagram,
      nodes,
      isModified: true,
    });
  };

  const handleEdgesChange = (edges: Edge[]) => {
    onUpdateDiagram({
      ...diagram,
      edges,
      isModified: true,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <BPMNEditor
        nodes={diagram.nodes}
        edges={diagram.edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
      />
    </div>
  );
};

export default TabPanel;
