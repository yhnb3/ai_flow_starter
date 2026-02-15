import React, { useState, useCallback } from 'react';
import type { Diagram } from '../../types/diagram';
import TabNavigation from './TabNavigation';
import TabPanel from './TabPanel';

const TabsContainer: React.FC = () => {
  const [diagrams, setDiagrams] = useState<Diagram[]>([
    {
      id: '1',
      name: 'Diagram 1',
      nodes: [],
      edges: [],
      isModified: false,
      createdAt: new Date(),
    },
  ]);

  const [activeDiagramId, setActiveDiagramId] = useState<string | null>('1');

  const activeDiagram = diagrams.find((d) => d.id === activeDiagramId);

  const handleAddDiagram = useCallback(() => {
    setDiagrams((prev) => {
      const numericIds = prev
        .map((d) => Number.parseInt(d.id, 10))
        .filter((id) => Number.isFinite(id));
      const newId = String(Math.max(...numericIds, 0) + 1);
      const newDiagram: Diagram = {
        id: newId,
        name: `Diagram ${newId}`,
        nodes: [],
        edges: [],
        isModified: false,
        createdAt: new Date(),
      };

      setActiveDiagramId(newId);
      return [...prev, newDiagram];
    });
  }, []);

  const handleCloseDiagram = useCallback((id: string) => {
    setDiagrams((prev) => {
      const closedIndex = prev.findIndex((d) => d.id === id);
      const filtered = prev.filter((d) => d.id !== id);

      setActiveDiagramId((currentActiveId) => {
        if (currentActiveId !== id) return currentActiveId;
        if (filtered.length === 0) return null;

        const nextDiagram =
          filtered[closedIndex] ?? filtered[closedIndex - 1] ?? filtered[0];
        return nextDiagram.id;
      });

      return filtered;
    });
  }, []);

  const handleSelectDiagram = useCallback((id: string) => {
    setActiveDiagramId(id);
  }, []);

  const handleUpdateDiagram = useCallback((updated: Diagram) => {
    setDiagrams((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  }, []);

  if (!activeDiagram) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-300">
        <div>No diagrams</div>
        <button
          onClick={handleAddDiagram}
          className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm"
        >
          Add diagram
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <TabNavigation
        diagrams={diagrams}
        activeDiagramId={activeDiagram.id}
        onSelectDiagram={handleSelectDiagram}
        onAddDiagram={handleAddDiagram}
        onCloseDiagram={handleCloseDiagram}
      />
      <TabPanel
        diagram={activeDiagram}
        onUpdateDiagram={handleUpdateDiagram}
      />
    </div>
  );
};

export default TabsContainer;
