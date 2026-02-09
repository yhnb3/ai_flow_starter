import { describe, it, expect } from 'vitest';
import { createBPMNNode } from './bpmn';

describe('createBPMNNode', () => {
  it('start 노드를 기본 이름으로 생성한다', () => {
    // Given: 위치 정보가 주어졌을 때
    const position = { x: 100, y: 200 };
    
    // When: start 노드를 생성하면
    const node = createBPMNNode('start', position);
    
    // Then: 올바른 타입과 위치, 기본 이름을 가진 노드가 생성된다
    expect(node.type).toBe('start');
    expect(node.position.x).toBe(100);
    expect(node.position.y).toBe(200);
    expect(node.data.name).toBe('Start');
    expect(node.data.id).toBe(node.id);
    expect(node.id).toContain('start-');
  });

  it('end 노드를 커스텀 이름으로 생성한다', () => {
    // Given: 위치와 커스텀 이름이 주어졌을 때
    const position = { x: 300, y: 400 };
    const customName = 'Process Complete';
    
    // When: end 노드를 커스텀 이름으로 생성하면
    const node = createBPMNNode('end', position, customName);
    
    // Then: 커스텀 이름을 가진 end 노드가 생성된다
    expect(node.type).toBe('end');
    expect(node.position.x).toBe(300);
    expect(node.position.y).toBe(400);
    expect(node.data.name).toBe('Process Complete');
    expect(node.id).toContain('end-');
  });

  it('여러 노드를 생성할 때 각각 고유한 ID를 가진다', () => {
    // Given: 동일한 조건으로 두 개의 노드를 생성할 때
    const position = { x: 0, y: 0 };
    
    // When: 같은 타입의 노드를 두 번 생성하면
    const node1 = createBPMNNode('start', position);
    const node2 = createBPMNNode('start', position);
    
    // Then: 각 노드는 고유한 ID를 가진다
    expect(node1.id).not.toBe(node2.id);
  });

  it('이름 없이 end 노드를 생성하면 기본 이름을 사용한다', () => {
    // Given: 이름을 지정하지 않고
    const position = { x: 0, y: 0 };
    
    // When: end 노드를 생성하면
    const node = createBPMNNode('end', position);
    
    // Then: 기본 이름 'End'가 설정된다
    expect(node.data.name).toBe('End');
  });
});
