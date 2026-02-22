import { render } from '@testing-library/react';
import { vi, it, expect, describe } from 'vitest';
import WeatherWidget from './WeatherWidget';
import ChoreGrid from './ChoreGrid';
import WeatherIcon from './WeatherIcon';
import ChoreWidget from './ChoreWidget';
import type { WeatherData } from '../services/weatherService';

// Mock children to track renders
vi.mock('./WeatherIcon', () => ({
  default: vi.fn(() => <div data-testid="weather-icon">Icon</div>)
}));

// Mock ChoreWidget to track renders
vi.mock('./ChoreWidget', () => ({
  default: vi.fn(() => <div data-testid="chore-widget">Chore</div>)
}));

// Mock services for ChoreGrid
vi.mock('../services/choreService', () => ({
  INITIAL_CHORES: [{ id: '1', frequency: 'daily' }],
  getChoresForDate: () => [{ id: '1', frequency: 'daily' }]
}));

describe('Widget Optimization', () => {
  it('WeatherWidget skips re-render with same props (optimized)', () => {
    const weatherData: WeatherData = {
      temperature: 70,
      weatherIcon: 'Clear',
      high: 80,
      low: 60,
      shortForecast: 'Sunny',
      detailedForecast: 'Sunny all day',
      icon: 'http://example.com/icon.png'
    };

    const props = {
      weather: weatherData,
      loading: false,
      error: null
    };

    const { rerender } = render(<WeatherWidget {...props} />);

    // Initial render
    // WeatherIcon should be called
    expect(vi.mocked(WeatherIcon)).toHaveBeenCalledTimes(1);

    // Rerender with SAME props object
    rerender(<WeatherWidget {...props} />);

    // With React.memo, it should NOT render again
    expect(vi.mocked(WeatherIcon)).toHaveBeenCalledTimes(1);
  });

  it('ChoreGrid skips re-render with same props (optimized)', () => {
    const { rerender } = render(<ChoreGrid />);

    // Initial render
    expect(vi.mocked(ChoreWidget)).toHaveBeenCalledTimes(1);

    // Rerender
    rerender(<ChoreGrid />);

    // With React.memo, it should NOT render again
    expect(vi.mocked(ChoreWidget)).toHaveBeenCalledTimes(1);
  });
});
