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
    expect(screen.getByText('Checking Clouds...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<WeatherWidget weather={null} loading={false} error="Failed" />);
    expect(screen.getByText('Weather is Sleepy')).toBeInTheDocument();
    expect(screen.getByText('Wake Up')).toBeInTheDocument();
  });

  it('renders weather data and outfit suggestions', () => {
    render(<WeatherWidget weather={mockWeather} loading={false} error={null} />);
    expect(screen.getByText('72°')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('Warm Day ☀️')).toBeInTheDocument();
    expect(screen.getByText('T-shirt weather!')).toBeInTheDocument();
  });

  it('renders cold weather advice', () => {
    const coldWeather: WeatherData = { ...mockWeather, temperature: 45 };
    render(<WeatherWidget weather={coldWeather} loading={false} error={null} />);
    expect(screen.getByText('Cold Day 🧥')).toBeInTheDocument();
    expect(screen.getByText('Wear a warm coat')).toBeInTheDocument();
  });
});
