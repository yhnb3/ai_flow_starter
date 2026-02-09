import type { Node, Edge } from '@xyflow/react';

export interface Diagram {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  isModified: boolean;
  createdAt: Date;
}
