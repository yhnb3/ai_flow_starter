import React, { useCallback, useMemo, useRef } from 'react';
import type { Node, Edge, Connection, NodeTypes, NodeChange, EdgeChange } from '@xyflow/react';
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from '../nodes/StartNode';
import EndNode from '../nodes/EndNode';
import NodePalette from '../nodes/NodePalette';
import NodePropertiesPanel from '../properties/NodePropertiesPanel';
import { createBPMNNode, type BPMNNodeType, type BPMNNode, type BPMNNodeData } from '../../types/bpmn';

interface BPMNEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const BPMNEditorContent: React.FC<BPMNEditorProps> = ({
  nodes,
  edges,
  onNodesChange: onNodesChangeCallback,
  onEdgesChange: onEdgesChangeCallback,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      start: StartNode,
      end: EndNode,
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges);
      onEdgesChangeCallback(newEdges);
    },
    [edges, onEdgesChangeCallback]
  );

  // Handle drag over to allow drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop to add node at mouse position
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as BPMNNodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createBPMNNode(type, position);
      const updatedNodes = [...nodes, newNode];
      onNodesChangeCallback(updatedNodes);
    },
    [screenToFlowPosition, nodes, onNodesChangeCallback]
  );

  // Handle click to add node at center
  const handleAddNode = useCallback(
    (type: BPMNNodeType) => {
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });

      const newNode = createBPMNNode(type, position);
      const updatedNodes = [...nodes, newNode];
      onNodesChangeCallback(updatedNodes);
    },
    [screenToFlowPosition, nodes, onNodesChangeCallback]
  );

  // Handle React Flow internal node changes (drag, select, etc.)
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      onNodesChangeCallback(updatedNodes);
    },
    [nodes, onNodesChangeCallback]
  );

  // Handle React Flow internal edge changes
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      onEdgesChangeCallback(updatedEdges);
    },
    [edges, onEdgesChangeCallback]
  );

  // Get selected node
  const selectedNode = nodes.find((node) => node.selected) as BPMNNode | undefined;

  // Handle node property changes
  const handleNodePropertyChange = useCallback(
    (nodeId: string, data: Partial<BPMNNodeData>) => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );
      onNodesChangeCallback(updatedNodes);
    },
    [nodes, onNodesChangeCallback]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <NodePalette onAddNode={handleAddNode} />
      <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNode && (
        <NodePropertiesPanel
          selectedNode={selectedNode}
          onChange={handleNodePropertyChange}
        />
      )}
    </div>
  );
};

const BPMNEditor: React.FC<BPMNEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <BPMNEditorContent {...props} />
    </ReactFlowProvider>
  );
};

export default BPMNEditor;
