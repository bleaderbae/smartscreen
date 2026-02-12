import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CalendarWidget from './CalendarWidget';

describe('CalendarWidget', () => {
  const mockEvents = [
    {
      summary: 'Dinner with Grandparents',
      startDate: new Date(),
      endDate: new Date(),
      source: 'Mom'
    }
  ];

  it('renders next event information', () => {
    render(<CalendarWidget events={mockEvents} loading={false} />);
    expect(screen.getByText('Next Event')).toBeInTheDocument();
    expect(screen.getByText('Dinner with Grandparents')).toBeInTheDocument();
    expect(screen.getByText(/Today/)).toBeInTheDocument();
  });

  it('renders source badge', () => {
    render(<CalendarWidget events={mockEvents} loading={false} />);
    expect(screen.getByText('Mom')).toBeInTheDocument();
  });
});
