import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CalendarWidget from './CalendarWidget';

describe('CalendarWidget', () => {
  it('renders next event information', () => {
    render(<CalendarWidget />);
    expect(screen.getByText('Next Event')).toBeInTheDocument();
    expect(screen.getByText('Dinner with Grandparents')).toBeInTheDocument();
    expect(screen.getByText('6:30 PM - Tonight')).toBeInTheDocument();
  });

  it('renders participant avatars', () => {
    render(<CalendarWidget />);
    expect(screen.getByText('+2 others')).toBeInTheDocument();
  });
});
