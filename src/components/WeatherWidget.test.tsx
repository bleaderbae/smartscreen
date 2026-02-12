import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';
import type { WeatherData } from '../services/weatherService';

describe('WeatherWidget', () => {
  const mockWeather: WeatherData = {
    temperature: 72,
    shortForecast: 'Sunny',
    detailedForecast: 'Sunny all day',
    high: 75,
    low: 65,
    icon: 'http://example.com/icon.png',
    weatherIcon: 'Clear'
  };

  it('renders loading state', () => {
    render(<WeatherWidget weather={null} loading={true} error={null} />);
    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<WeatherWidget weather={null} loading={false} error="Failed" />);
    expect(screen.getByText('Weather Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders weather data', () => {
    render(<WeatherWidget weather={mockWeather} loading={false} error={null} />);
    expect(screen.getByText('72°')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('High: 75° Low: 65°')).toBeInTheDocument();
  });
});
