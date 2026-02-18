import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChoreGrid from './ChoreGrid';
import ChoreWidget from './ChoreWidget';

// Mock dependencies
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ListChecks: () => <div data-testid="icon-list" />,
    CalendarDays: () => <div data-testid="icon-calendar" />,
    LayoutGrid: () => <div data-testid="icon-layout" />,
  };
});

// Mock ChoreWidget to track renders and allow interaction
vi.mock('./ChoreWidget', async () => {
  const React = await import('react');
  const MockFn = vi.fn((props: any) => (
    <div data-testid="chore-widget" onClick={() => props.onToggle(props.id)}>
      {props.text}
    </div>
  ));

  const Memoized = React.memo(MockFn);
  // Attach spy to the component for testing
  (Memoized as any).getMock = () => MockFn;

  return {
    default: Memoized
  };
});

describe('ChoreGrid Optimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('measures re-renders when a chore is toggled', () => {
    render(<ChoreGrid />);

    // Get initial render count
    // @ts-ignore
    const spy = ChoreWidget.getMock();
    const initialRenderCount = spy.mock.calls.length;
    console.log(`Initial ChoreWidget renders: ${initialRenderCount}`);

    // Ensure we have chores rendered
    expect(initialRenderCount).toBeGreaterThan(0);

    // Find and click the first chore
    const chores = screen.getAllByTestId('chore-widget');
    fireEvent.click(chores[0]);

    // Get total render count after interaction
    const totalRenderCount = spy.mock.calls.length;
    const reRenderCount = totalRenderCount - initialRenderCount;

    console.log(`Re-renders after toggle: ${reRenderCount}`);
    console.log(`Total renders: ${totalRenderCount}`);

    // Optimized behavior: reRenderCount should be 1 (only the toggled item re-renders)
    if (initialRenderCount > 0) {
        expect(reRenderCount).toBe(1);
    }
  });
});
