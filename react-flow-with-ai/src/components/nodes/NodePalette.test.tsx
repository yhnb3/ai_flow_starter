import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import NodePalette from './NodePalette';

describe('NodePalette', () => {
  // 각 테스트 후 DOM 정리
  afterEach(() => {
    cleanup();
  });

  it('Start와 End 버튼을 렌더링한다', () => {
    // Given: NodePalette 컴포넌트가 주어졌을 때
    const onAddNode = vi.fn();
    const { getByText } = render(<NodePalette onAddNode={onAddNode} />);
    
    // When & Then: Start와 End 버튼이 화면에 표시된다
    expect(getByText('Start')).toBeDefined();
    expect(getByText('End')).toBeDefined();
  });

  it('Start 버튼 클릭 시 onAddNode 콜백을 호출한다', () => {
    // Given: 클릭 콜백이 등록된 NodePalette가 있을 때
    const onAddNode = vi.fn();
    const { getByText } = render(<NodePalette onAddNode={onAddNode} />);
    
    // When: Start 버튼을 클릭하면
    fireEvent.click(getByText('Start'));
    
    // Then: 'start' 타입으로 콜백이 호출된다
    expect(onAddNode).toHaveBeenCalledWith('start');
  });

  it('End 버튼 클릭 시 onAddNode 콜백을 호출한다', () => {
    // Given: 클릭 콜백이 등록된 NodePalette가 있을 때
    const onAddNode = vi.fn();
    const { getByText } = render(<NodePalette onAddNode={onAddNode} />);
    
    // When: End 버튼을 클릭하면
    fireEvent.click(getByText('End'));
    
    // Then: 'end' 타입으로 콜백이 호출된다
    expect(onAddNode).toHaveBeenCalledWith('end');
  });

  it('Start 버튼 드래그 시작 시 dataTransfer를 설정한다', () => {
    // Given: NodePalette가 렌더링되어 있을 때
    const onAddNode = vi.fn();
    const { getByText } = render(<NodePalette onAddNode={onAddNode} />);
    
    // When: Start 버튼에서 드래그를 시작하면
    const startButton = getByText('Start').closest('button')!;
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    };
    
    fireEvent.dragStart(startButton, { dataTransfer });
    
    // Then: React Flow 포맷으로 데이터가 설정된다
    expect(dataTransfer.setData).toHaveBeenCalledWith('application/reactflow', 'start');
    expect(dataTransfer.effectAllowed).toBe('move');
  });

  it('End 버튼 드래그 시작 시 dataTransfer를 설정한다', () => {
    // Given: NodePalette가 렌더링되어 있을 때
    const onAddNode = vi.fn();
    const { getByText } = render(<NodePalette onAddNode={onAddNode} />);
    
    // When: End 버튼에서 드래그를 시작하면
    const endButton = getByText('End').closest('button')!;
    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: '',
    };
    
    fireEvent.dragStart(endButton, { dataTransfer });
    
    // Then: React Flow 포맷으로 데이터가 설정된다
    expect(dataTransfer.setData).toHaveBeenCalledWith('application/reactflow', 'end');
  });
});
