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

  const [activeDiagramId, setActiveDiagramId] = useState<string>('1');

  const activeDiagram = diagrams.find((d) => d.id === activeDiagramId);

  const handleAddDiagram = useCallback(() => {
    const newId = String(Math.max(...diagrams.map((d) => parseInt(d.id)), 0) + 1);
    const newDiagram: Diagram = {
      id: newId,
      name: `Diagram ${newId}`,
      nodes: [],
      edges: [],
      isModified: false,
      createdAt: new Date(),
    };
    setDiagrams((prev) => [...prev, newDiagram]);
    setActiveDiagramId(newId);
  }, [diagrams]);

  const handleCloseDiagram = useCallback((id: string) => {
    setDiagrams((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (filtered.length === 0) return prev;
      return filtered;
    });
    setActiveDiagramId((prev) => (prev === id ? diagrams[0]?.id : prev));
  }, [diagrams]);

  const handleSelectDiagram = useCallback((id: string) => {
    setActiveDiagramId(id);
  }, []);

  const handleUpdateDiagram = useCallback((updated: Diagram) => {
    setDiagrams((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  }, []);

  if (!activeDiagram) {
    return <div className="flex items-center justify-center h-full">No diagrams</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <TabNavigation
        diagrams={diagrams}
        activeDiagramId={activeDiagramId}
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
