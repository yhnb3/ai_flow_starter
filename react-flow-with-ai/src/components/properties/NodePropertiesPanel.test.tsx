import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import NodePropertiesPanel from './NodePropertiesPanel';
import type { BPMNNode } from '../../types/bpmn';

describe('NodePropertiesPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('Start 노드의 정보를 표시한다', () => {
    // Given: Start 노드가 선택되었을 때
    const startNode: BPMNNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: { id: 'start-1', name: 'Process Start' },
    };
    const onChange = vi.fn();

    // When: NodePropertiesPanel을 렌더링하면
    const { getByText, getByDisplayValue } = render(
      <NodePropertiesPanel selectedNode={startNode} onChange={onChange} />
    );

    // Then: 노드 타입과 이름 입력 필드가 표시된다
    expect(getByText('Start')).toBeDefined();
    expect(getByDisplayValue('Process Start')).toBeDefined();
  });

  it('End 노드의 정보를 표시한다', () => {
    // Given: End 노드가 선택되었을 때
    const endNode: BPMNNode = {
      id: 'end-1',
      type: 'end',
      position: { x: 100, y: 100 },
      data: { id: 'end-1', name: 'Process End' },
    };
    const onChange = vi.fn();

    // When: NodePropertiesPanel을 렌더링하면
    const { getByText, getByDisplayValue } = render(
      <NodePropertiesPanel selectedNode={endNode} onChange={onChange} />
    );

    // Then: 노드 타입과 이름 입력 필드가 표시된다
    expect(getByText('End')).toBeDefined();
    expect(getByDisplayValue('Process End')).toBeDefined();
  });

  it('이름 입력 시 onChange 콜백을 호출한다', () => {
    // Given: Start 노드가 선택되고 onChange 콜백이 등록되었을 때
    const startNode: BPMNNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: { id: 'start-1', name: 'Original Name' },
    };
    const onChange = vi.fn();
    const { getByDisplayValue } = render(
      <NodePropertiesPanel selectedNode={startNode} onChange={onChange} />
    );

    // When: 이름 입력 필드를 변경하면
    const input = getByDisplayValue('Original Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Name' } });

    // Then: onChange가 nodeId와 변경된 name으로 호출된다
    expect(onChange).toHaveBeenCalledWith('start-1', { name: 'New Name' });
  });

  it('현재 노드 이름을 입력 필드에 표시한다', () => {
    // Given: 특정 이름을 가진 노드가 있을 때
    const node: BPMNNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 0, y: 0 },
      data: { id: 'start-1', name: 'My Custom Name' },
    };
    const onChange = vi.fn();

    // When: NodePropertiesPanel을 렌더링하면
    const { getByDisplayValue } = render(
      <NodePropertiesPanel selectedNode={node} onChange={onChange} />
    );

    // Then: 입력 필드에 현재 노드 이름이 표시된다
    const input = getByDisplayValue('My Custom Name') as HTMLInputElement;
    expect(input.value).toBe('My Custom Name');
  });
});
