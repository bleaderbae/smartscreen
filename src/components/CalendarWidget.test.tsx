import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('supports keyboard navigation', () => {
    render(<CalendarWidget events={mockEvents} loading={false} />);
    const widget = screen.getByRole('button', { name: /Next event: Dinner with Grandparents/i });
    expect(widget).toBeInTheDocument();

    // Open with Enter
    fireEvent.keyDown(widget, { key: 'Enter', code: 'Enter' });
    expect(screen.getByRole('dialog', { name: /Family Agenda/i })).toBeInTheDocument();

    // Close with Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
