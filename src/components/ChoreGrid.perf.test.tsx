import { render, fireEvent, screen } from '@testing-library/react';
import { vi, it, expect, describe, beforeEach } from 'vitest';
import ChoreGrid from './ChoreGrid';

// Mock ChoreService
vi.mock('../services/choreService', () => ({
  INITIAL_CHORES: [
    { id: '1', text: 'Chore 1', frequency: 'daily', icon: () => null, color: 'red' },
    { id: '2', text: 'Chore 2', frequency: 'daily', icon: () => null, color: 'blue' }
  ],
  getChoresForDate: () => [
    { id: '1', text: 'Chore 1', frequency: 'daily', icon: () => null, color: 'red' },
    { id: '2', text: 'Chore 2', frequency: 'daily', icon: () => null, color: 'blue' }
  ],
  Chore: {}
}));

// Mock ChoreWidget to capture props
const mockChoreWidget = vi.fn();

// Use a simpler interface for the mock props
interface MockProps {
  id: string;
  text: string;
  onToggle: (id: string) => void;
}

const MockChoreWidgetComponent = (props: MockProps) => {
  mockChoreWidget(props);
  return (
    <div data-testid={`chore-${props.id}`} onClick={() => props.onToggle(props.id)}>
      {props.text}
    </div>
  );
};

vi.mock('./ChoreWidget', () => ({
  default: (props: MockProps) => MockChoreWidgetComponent(props)
}));

describe('ChoreGrid Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('passes stable callbacks to children', () => {
    render(<ChoreGrid />);

    // Initial render
    expect(mockChoreWidget).toHaveBeenCalledTimes(2);
    const initialProps1 = mockChoreWidget.mock.calls[0][0] as MockProps;

    // Trigger update
    fireEvent.click(screen.getByTestId('chore-1'));

    // Re-render
    expect(mockChoreWidget).toHaveBeenCalledTimes(4); // 2 initial + 2 re-render
    const nextProps1 = mockChoreWidget.mock.calls[2][0] as MockProps;

    // Check if onToggle is stable
    expect(initialProps1.onToggle).toBe(nextProps1.onToggle);
  });
});
