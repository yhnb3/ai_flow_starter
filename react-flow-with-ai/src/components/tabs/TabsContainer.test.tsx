import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TabsContainer from './TabsContainer';
import type { Diagram } from '../../types/diagram';

vi.mock('./TabNavigation', () => ({
  default: ({
    diagrams,
    activeDiagramId,
    onSelectDiagram,
    onAddDiagram,
    onCloseDiagram,
  }: {
    diagrams: Diagram[];
    activeDiagramId: string;
    onSelectDiagram: (id: string) => void;
    onAddDiagram: () => void;
    onCloseDiagram: (id: string) => void;
  }) => (
    <div>
      <div data-testid="active-tab-id">{activeDiagramId}</div>
      <button onClick={onAddDiagram}>add-tab</button>
      {diagrams.map((diagram) => (
        <div key={diagram.id}>
          <button onClick={() => onSelectDiagram(diagram.id)}>
            select-{diagram.id}
          </button>
          <button onClick={() => onCloseDiagram(diagram.id)}>
            close-{diagram.id}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('./TabPanel', () => ({
  default: ({ diagram }: { diagram: Diagram }) => (
    <div data-testid="active-diagram">{diagram.id}</div>
  ),
}));

describe('TabsContainer', () => {
  afterEach(() => {
    cleanup();
  });

  it('closes active tab and activates neighbor tab', () => {
    render(<TabsContainer />);

    fireEvent.click(screen.getByText('add-tab'));
    fireEvent.click(screen.getByText('add-tab'));

    fireEvent.click(screen.getByText('select-1'));
    expect(screen.getByTestId('active-diagram').textContent).toBe('1');

    fireEvent.click(screen.getByText('close-1'));
    expect(screen.getByTestId('active-diagram').textContent).toBe('2');
  });

  it('allows closing the last tab and can recover by adding a new tab', () => {
    render(<TabsContainer />);

    fireEvent.click(screen.getByText('close-1'));

    expect(screen.getByText('No diagrams')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Add diagram' })).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Add diagram' }));

    expect(screen.queryByText('No diagrams')).toBeNull();
    expect(screen.getByTestId('active-diagram').textContent).toBe('1');
  });

  it('keeps active tab when closing a non-active tab', () => {
    render(<TabsContainer />);

    fireEvent.click(screen.getByText('add-tab'));
    fireEvent.click(screen.getByText('select-1'));
    expect(screen.getByTestId('active-diagram').textContent).toBe('1');

    fireEvent.click(screen.getByText('close-2'));
    expect(screen.getByTestId('active-diagram').textContent).toBe('1');
  });
});
