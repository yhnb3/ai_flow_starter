import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';

interface FloatablePanelProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

const STORAGE_KEY = 'floatable-panel-state';

interface PanelState {
  mode: 'docked' | 'floating';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  hasFloated: boolean;
}

const getDefaultState = (): PanelState => {
  const defaultX =
    typeof window !== 'undefined' ? window.innerWidth - 350 : 970;

  return {
    mode: 'docked',
    x: defaultX,
    y: 100,
    width: 320,
    height: 400, // 헤더(~40px) + 본문(360px)
  };
};

const FloatablePanel: React.FC<FloatablePanelProps> = ({ 
  children, 
  title = 'Properties',
  onClose 
}) => {
  const floatingShellRef = useRef<HTMLDivElement | null>(null);
  const floatingHeaderRef = useRef<HTMLDivElement | null>(null);
  const floatingMetricsRef = useRef({ headerTopInset: 1, headerHeight: 40 });
  const defaultState = getDefaultState();
  const [panelState, setPanelState] = useState<PanelState>(() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultState, ...JSON.parse(saved) };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [dragState, setDragState] = useState<DragState | null>(null);

  // 패널 상태를 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(panelState));
    }
  }, [panelState]);

  useLayoutEffect(() => {
    if (panelState.mode !== 'floating') return;
    const shell = floatingShellRef.current;
    const header = floatingHeaderRef.current;
    if (!shell || !header) return;

    const shellRect = shell.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    floatingMetricsRef.current = {
      headerTopInset: Math.max(headerRect.top - shellRect.top, 0),
      headerHeight: Math.max(headerRect.height, 1),
    };
  }, [panelState.mode, panelState.width, panelState.height]);

  // docked DOM이 사라진 뒤에도 동일 포인터를 계속 추적
  useEffect(() => {
    if (!dragState || typeof window === 'undefined') return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== dragState.pointerId) return;

      const threshold = 5;
      const deltaX = Math.abs(e.clientX - dragState.startX);
      const deltaY = Math.abs(e.clientY - dragState.startY);
      const shouldFloat = dragState.hasFloated || deltaX > threshold || deltaY > threshold;

      if (!shouldFloat) return;

      setPanelState((prev) => ({
        ...prev,
        mode: 'floating',
        x: e.clientX - dragState.offsetX,
        y:
          e.clientY -
          (floatingMetricsRef.current.headerTopInset +
            floatingMetricsRef.current.headerHeight / 2),
      }));

      if (!dragState.hasFloated) {
        setDragState((prev) => (prev ? { ...prev, hasFloated: true } : prev));
      }
    };

    const handlePointerEnd = (e: PointerEvent) => {
      if (e.pointerId !== dragState.pointerId) return;
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [dragState]);

  const toggleMode = () => {
    setPanelState((prev) => ({
      ...prev,
      mode: prev.mode === 'docked' ? 'floating' : 'docked',
    }));
  };

  // Docked 모드: 하단 고정
  if (panelState.mode === 'docked') {
    return (
      <div className="border-t border-gray-700 bg-gray-800">
        <div 
          className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700 cursor-move hover:bg-gray-700 transition-colors"
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            if ((e.target as HTMLElement).closest('button')) return;
            e.preventDefault();

            // docked에서 끌어올릴 때 커서가 floating 헤더 중앙 근처를 유지하도록 계산
            const offsetX = panelState.width / 2;

            setDragState({
              pointerId: e.pointerId,
              startX: e.clientX,
              startY: e.clientY,
              offsetX,
              hasFloated: false,
            });
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Float panel"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-600 transition-colors"
                title="Close panel"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="p-4 overflow-auto" style={{ height: '360px' }}>
          {children}
        </div>
      </div>
    );
  }

  // Floating 모드: 드래그/리사이즈 가능
  const floatingPanel = (
    <Rnd
      position={{ x: panelState.x, y: panelState.y }}
      size={{ width: panelState.width, height: panelState.height }}
      onDragStop={(_e, d) => {
        setPanelState((prev) => ({ ...prev, x: d.x, y: d.y }));
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        setPanelState((prev) => ({
          ...prev,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: position.x,
          y: position.y,
        }));
      }}
      minWidth={280}
      minHeight={200}
      bounds="window"
      dragHandleClassName="drag-handle"
      className="shadow-2xl rounded-lg overflow-hidden"
      style={{ zIndex: 1000, position: 'fixed' }}
    >
      <div
        ref={floatingShellRef}
        className="w-full h-full flex flex-col bg-gray-800 border border-gray-700 rounded-lg"
      >
        <div
          ref={floatingHeaderRef}
          className="drag-handle flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700 cursor-move hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Dock panel"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4m0-8V4m0 0h-4m4 0l-5 5M4 8l5-5" />
              </svg>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-600 transition-colors"
                title="Close panel"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </Rnd>
  );

  if (typeof document === 'undefined') {
    return floatingPanel;
  }

  return createPortal(floatingPanel, document.body);
};

export default FloatablePanel;
