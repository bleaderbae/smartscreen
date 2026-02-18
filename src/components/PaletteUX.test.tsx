import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';
import ShoppingListWidget from './ShoppingListWidget';
import DailyFeedWidget from './DailyFeedWidget';
import { getNASAData, getDogData } from '../services/dailyFeedService';

// Mock services to avoid network calls
vi.mock('../services/dailyFeedService', () => ({
  getNASAData: vi.fn(),
  getDogData: vi.fn(),
}));

describe('Palette UX Improvements', () => {
  it('WeatherWidget: Removes false affordance (role="button")', () => {
    const mockWeather = {
      temperature: 72,
      shortForecast: 'Sunny',
      detailedForecast: 'Sunny all day',
      high: 75,
      low: 65,
      icon: 'http://example.com/icon.png',
      weatherIcon: 'Clear' as const
    };

    render(<WeatherWidget weather={mockWeather} loading={false} error={null} />);

    // It should render content
    expect(screen.getByText('72°')).toBeInTheDocument();

    // But the container should NOT have role="button"
    // We verify this by ensuring no button role contains the temperature text
    // (This assumes no other buttons contain this text)
    const container = screen.getByText('72°').closest('div.rounded-3xl');
    expect(container).not.toHaveAttribute('role', 'button');
    expect(container).not.toHaveAttribute('tabIndex');
  });

  it('ShoppingListWidget: Removes broken "Add item" button', () => {
    render(<ShoppingListWidget />);
    // The "Add item" button with the specific aria-label should be gone
    expect(screen.queryByLabelText('Add item')).not.toBeInTheDocument();
  });

  it('ShoppingListWidget: Delete button has tactile feedback', () => {
    render(<ShoppingListWidget />);
    // There should be default items with delete buttons
    const deleteButtons = screen.getAllByLabelText(/Remove/);
    expect(deleteButtons.length).toBeGreaterThan(0);
    // Check for active:scale class (assuming we use scale-90 or similar)
    expect(deleteButtons[0].className).toMatch(/active:scale-90/);
  });

  it('DailyFeedWidget: Close button has tactile feedback', async () => {
    // We need to trigger the modal to see the close button
    // Mock data
    (vi.mocked(getNASAData)).mockResolvedValue({
      title: 'Test Image',
      url: 'http://example.com/image.jpg',
      explanation: 'Test explanation',
      type: 'nasa'
    });
    (vi.mocked(getDogData)).mockResolvedValue({
      title: 'Test Dog',
      url: 'http://example.com/dog.jpg',
      explanation: 'Test explanation',
      type: 'dog'
    });

    render(<DailyFeedWidget />);

    // Wait for load
    const card = await screen.findByRole('button', { name: /View Astronomy Picture/i });

    // Click to open modal
    card.click();

    // Find close button
    const closeButton = await screen.findByLabelText('Close');
    expect(closeButton.className).toMatch(/active:scale-90/);
  });
});
