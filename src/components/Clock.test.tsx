import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Clock from './Clock';

describe('Clock', () => {
  const mockEvent = {
    summary: 'Family Dinner',
    startDate: new Date(),
    endDate: new Date(),
    source: 'Mom'
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders morning context (7 AM)', () => {
    const morningDate = new Date('2026-02-12T07:00:00');
    vi.setSystemTime(morningDate);
    render(<Clock />);
    expect(screen.getByText('Good Morning')).toBeInTheDocument();
  });

  it('renders day time context (12 PM)', () => {
    const dayDate = new Date('2026-02-12T12:00:00');
    vi.setSystemTime(dayDate);
    render(<Clock />);
    expect(screen.getByText('Day Time')).toBeInTheDocument();
  });

  it('renders dusk context (6 PM)', () => {
    const duskDate = new Date('2026-02-12T18:00:00');
    vi.setSystemTime(duskDate);
    render(<Clock />);
    expect(screen.getByText('Dusk')).toBeInTheDocument();
  });

  it('renders quiet time context (10 PM)', () => {
    const nightDate = new Date('2026-02-12T22:00:00');
    vi.setSystemTime(nightDate);
    render(<Clock />);
    expect(screen.getByText('Quiet Time')).toBeInTheDocument();
  });

  it('renders next event glance', () => {
    render(<Clock nextEvent={mockEvent} />);
    expect(screen.getByText('Next Up:')).toBeInTheDocument();
    expect(screen.getByText('Family Dinner')).toBeInTheDocument();
    expect(screen.getByText('Mom')).toBeInTheDocument();
  });

  it('updates time every minute', async () => {
    const initialDate = new Date('2026-02-12T10:00:00');
    vi.setSystemTime(initialDate);
    render(<Clock />);
    
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
    
    // Advance time by 1 minute
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    expect(screen.getByText(/10:01/)).toBeInTheDocument();
  });
});
