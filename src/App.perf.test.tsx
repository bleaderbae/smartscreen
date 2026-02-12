import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as DailyFeedWidgetModule from './components/DailyFeedWidget';

// Mock the DailyFeedWidget to count renders
vi.mock('./components/DailyFeedWidget', () => ({
  default: vi.fn(() => <div data-testid="mocked-widget">Mocked Widget</div>)
}));

// Mock the WeatherService to avoid network calls
vi.mock('./services/weatherService', () => ({
  getWeather: vi.fn(() => Promise.resolve({
    temperature: 72,
    shortForecast: 'Sunny',
    detailedForecast: 'Sunny all day',
    high: 75,
    low: 65,
    icon: 'http://example.com/icon.png',
    weatherIcon: 'Clear'
  }))
}));

describe('App Performance', () => {
  beforeEach(() => {
     vi.useFakeTimers();
  });

  afterEach(() => {
     vi.useRealTimers();
     vi.restoreAllMocks();
  });

  it('renders children unnecessarily on clock tick', async () => {
    render(<App />);

    // Initial render
    expect(DailyFeedWidgetModule.default).toHaveBeenCalledTimes(1);

    // Advance time by 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    console.log(`Render count after 1s: ${vi.mocked(DailyFeedWidgetModule.default).mock.calls.length}`);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    console.log(`Render count after 2s: ${vi.mocked(DailyFeedWidgetModule.default).mock.calls.length}`);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    console.log(`Render count after 3s: ${vi.mocked(DailyFeedWidgetModule.default).mock.calls.length}`);

    // In optimized code, this should be stable (e.g. 2, due to initial render + weather fetch update)
    // It should NOT increase with every clock tick (which would make it 3, 4, 5...)
    expect(DailyFeedWidgetModule.default).toHaveBeenCalledTimes(2);
  });
});
