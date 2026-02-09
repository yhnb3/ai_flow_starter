import React, { useState, useEffect, useRef } from 'react';
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
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
}

const DEFAULT_STATE: PanelState = {
  mode: 'docked',
  x: window.innerWidth - 350,
  y: 100,
  width: 320,
  height: 400, // Header (~40px) + Content (360px)
};

const FloatablePanel: React.FC<FloatablePanelProps> = ({ 
  children, 
  title = 'Properties',
  onClose 
}) => {
  const [panelState, setPanelState] = useState<PanelState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
  });

  const rndRef = useRef<Rnd>(null);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(panelState));
  }, [panelState]);

  // Handle continuous dragging when switching to floating mode
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPanelState((prev) => ({
        ...prev,
        x: e.clientX - dragState.offsetX,
        y: e.clientY - dragState.offsetY,
      }));
    };

    const handleMouseUp = () => {
      setDragState({ isDragging: false, offsetX: 0, offsetY: 0 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  const toggleMode = () => {
    setPanelState((prev) => ({
      ...prev,
      mode: prev.mode === 'docked' ? 'floating' : 'docked',
    }));
  };

  // Docked mode - fixed at bottom
  if (panelState.mode === 'docked') {
    return (
      <div className="border-t border-gray-700 bg-gray-800">
        <div 
          className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700 cursor-move hover:bg-gray-700 transition-colors"
          onMouseDown={(e) => {
            // Prevent text selection during drag
            e.preventDefault();
            console.log("x:", e.clientX, "y:", e.clientY);
            const startX = e.clientX;
            const startY = e.clientY;
            const threshold = 5;
            
            // Measure the actual header height from the docked mode
            const headerRect = e.currentTarget.getBoundingClientRect();
            
            // Always center the mouse on the header when converting to floating
            const centerOffsetX = panelState.width / 2;
            // Add 1px for border-top of the floating panel container
            const centerOffsetY = headerRect.height / 2 + 1;

            console.log(centerOffsetX, centerOffsetY);
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = Math.abs(moveEvent.clientX - startX);
              const deltaY = Math.abs(moveEvent.clientY - startY);
              
              // If moved more than threshold, switch to floating mode
              if (deltaX > threshold || deltaY > threshold) {
                // Position panel so mouse is at center of header
                setPanelState((prev) => ({
                  ...prev,
                  mode: 'floating',
                  x: moveEvent.clientX - centerOffsetX,
                  y: moveEvent.clientY - centerOffsetY,
                }));
                
                // Enable continuous dragging with centered offset
                setDragState({
                  isDragging: true,
                  offsetX: moveEvent.clientX - centerOffsetX,
                  offsetY: moveEvent.clientY - centerOffsetY,
                });
                
                // Clean up these listeners as useEffect will take over
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              }
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
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

  console.log('Rendering floating panel at', panelState.x, panelState.y);

  // Floating mode - draggable and resizable
  return (
    <Rnd
      ref={rndRef}
      position={{ x: panelState.x, y: panelState.y }}
      size={{ width: panelState.width, height: panelState.height }}
      onDragStart={() => {
        // Disable our custom dragging when Rnd takes over
        setDragState({ isDragging: false, offsetX: 0, offsetY: 0 });
      }}
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
      style={{ zIndex: 1000 }}
      disableDragging={dragState.isDragging}
    >
      <div className="w-full h-full flex flex-col bg-gray-800 border border-gray-700 rounded-lg">
        <div className="drag-handle flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700 cursor-move hover:bg-gray-700 transition-colors">
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
};

export default FloatablePanel;
