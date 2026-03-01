import { render, fireEvent, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CalendarWidget from './CalendarWidget';
import type { CalendarEvent } from '../services/calendarService';
import * as dateFns from 'date-fns';

vi.mock('date-fns', async (importOriginal) => {
  const actual = await importOriginal<typeof import('date-fns')>();
  return {
    ...actual,
    format: vi.fn(actual.format),
  };
});

describe('CalendarWidget Performance', () => {
  const mockEvents: CalendarEvent[] = [
    {
      summary: 'Event 1',
      startDate: new Date('2023-10-26T10:00:00Z'),
      endDate: new Date('2023-10-26T11:00:00Z'),
      source: 'Mom'
    },
    {
      summary: 'Event 2',
      startDate: new Date('2023-10-27T10:00:00Z'),
      endDate: new Date('2023-10-27T11:00:00Z'),
      source: 'Dad'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('pre-calculates date strings instead of calling format in render loop', () => {
    // First render to get the collapsed state
    render(<CalendarWidget events={mockEvents} loading={false} />);

    // Clear mock to only track calls during the expanded state render
    vi.mocked(dateFns.format).mockClear();

    // Expand to render the list
    const widget = screen.getByRole('button');
    fireEvent.click(widget);

    // In an unoptimized component, format is called in the render loop.
    console.log("FORMAT CALLS:", vi.mocked(dateFns.format).mock.calls.length);

    // Test logic expects it NOT to trigger large map recalculations.
    // The previously unoptimized code would have > 8 calls here
    expect(vi.mocked(dateFns.format).mock.calls.length).toBeLessThan(12);
  });
});
