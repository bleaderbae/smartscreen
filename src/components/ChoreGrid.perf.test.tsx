import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChoreGrid from './ChoreGrid';

// Hoist the mock function so it can be used inside vi.mock
const { ChoreWidgetMock } = vi.hoisted(() => ({
  ChoreWidgetMock: vi.fn()
}));

// Mock dependencies
vi.mock('../services/choreService', () => {
  const DummyIcon = () => React.createElement('div', null, 'Icon');
  return {
    INITIAL_CHORES: [
      { id: 'd1', text: 'Chore 1', icon: DummyIcon, color: 'red', frequency: 'daily', completed: false },
      { id: 'd2', text: 'Chore 2', icon: DummyIcon, color: 'blue', frequency: 'daily', completed: false },
    ],
    getChoresForDate: (chores: any[]) => chores // Return all
  };
});

// Mock Child Component with React.memo to verify props stability
vi.mock('./ChoreWidget', async () => {
  const React = await import('react');
  const Comp = (props: any) => {
    ChoreWidgetMock(props);
    return React.createElement('button', {
      'data-testid': `chore-${props.id}`,
      onClick: () => props.onToggle(props.id)
    }, props.text);
  };
  return {
    default: React.memo(Comp)
  };
});

describe('ChoreGrid Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('only re-renders the toggled chore', () => {
    render(<ChoreGrid />);

    // Initial render: 2 chores
    expect(ChoreWidgetMock).toHaveBeenCalledTimes(2);

    // Clear mock calls
    ChoreWidgetMock.mockClear();

    // Toggle the first chore
    const chore1 = screen.getByTestId('chore-d1');
    fireEvent.click(chore1);

    // Expectation:
    // If ChoreGrid passes stable props (stable toggleChore callback),
    // React.memo should prevent re-render of the second chore.

    // We expect 1 call (for d1 only).
    expect(ChoreWidgetMock).toHaveBeenCalledTimes(1);
    expect(ChoreWidgetMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'd1' }),
    );
  });
});
