import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChoreGrid from './ChoreGrid';

// Define mocks using vi.hoisted so they are available in vi.mock
const mocks = vi.hoisted(() => ({
  icon1: vi.fn(() => null),
  icon2: vi.fn(() => null)
}));

// Mock dependencies
vi.mock('../services/choreService', () => ({
  INITIAL_CHORES: [
    { id: 'd1', text: 'Chore 1', icon: mocks.icon1, color: 'red', frequency: 'daily', completed: false },
    { id: 'd2', text: 'Chore 2', icon: mocks.icon2, color: 'blue', frequency: 'daily', completed: false },
  ],
  getChoresForDate: (chores: any[]) => chores
}));

describe('ChoreGrid Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('only re-renders the toggled chore', () => {
    render(<ChoreGrid />);

    // Initial render
    expect(mocks.icon1).toHaveBeenCalled();
    expect(mocks.icon2).toHaveBeenCalled();

    mocks.icon1.mockClear();
    mocks.icon2.mockClear();

    // Toggle the first chore
    const chore1 = screen.getByText('Chore 1');
    const widget = chore1.closest('[role="button"]');
    if (!widget) throw new Error('Widget not found');

    fireEvent.click(widget);

    // Expectation:
    // MockIcon1 should be called (re-render)
    // MockIcon2 should NOT be called (memoized)
    expect(mocks.icon1).toHaveBeenCalled();
    expect(mocks.icon2).not.toHaveBeenCalled();
  });
});
