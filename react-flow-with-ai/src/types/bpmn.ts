import type { Node } from '@xyflow/react';

/**
 * BPMN 노드 타입 정의
 */
export type BPMNNodeType = 'start' | 'end';

/**
 * BPMN 노드 데이터 구조
 * - id: 노드의 고유 식별자
 * - name: 사용자가 입력한 노드 이름
 */
export interface BPMNNodeData extends Record<string, unknown> {
  id: string;
  name: string;
}

/**
 * React Flow Node를 BPMN 노드 데이터로 확장
 */
export type BPMNNode = Node<BPMNNodeData, BPMNNodeType>;

/**
 * 새 BPMN 노드 생성 헬퍼
 */
export function createBPMNNode(
  type: BPMNNodeType,
  position: { x: number; y: number },
  name: string = ''
): BPMNNode {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return {
    id,
    type,
    position,
    data: {
      id,
      name: name || (type === 'start' ? 'Start' : 'End'),
    },
  };
}
