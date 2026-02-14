import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as Lucide from 'lucide-react';

// Mock Lucide icons to count renders of ShoppingCart (which is always visible in ShoppingListWidget)
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof Lucide>();
  return {
    ...actual,
    ShoppingCart: vi.fn((props) => <div data-testid="shopping-cart-icon" {...props} />),
  };
});

// Mock services
vi.mock('./services/weatherService', () => ({
  getWeather: vi.fn(() => Promise.resolve({
    temperature: 72,
    shortForecast: 'Sunny',
    detailedForecast: 'Sunny all day',
    high: 75,
    low: 65,
    icon: 'http://example.com/icon.png',
    weatherIcon: 'Clear'
  })),
  getWeatherIconFromUrl: vi.fn(() => 'Clear')
}));

vi.mock('./services/dailyFeedService', () => ({
  getNASAData: vi.fn(() => Promise.resolve({
    id: 'nasa-1',
    type: 'nasa',
    title: 'NASA Image',
    url: 'http://example.com/nasa.jpg',
    explanation: 'Explanation',
    mediaType: 'image'
  })),
  getDogData: vi.fn(() => Promise.resolve({
    id: 'dog-1',
    type: 'dog',
    title: 'Dog Fact',
    url: 'http://example.com/dog.jpg',
    explanation: 'Explanation',
    mediaType: 'image'
  }))
}));

vi.mock('./services/calendarService', () => ({
  fetchCalendarEvents: vi.fn(() => Promise.resolve([]))
}));

vi.mock('./services/choreService', () => ({
  INITIAL_CHORES: [],
  getChoresForDate: () => []
}));

describe('App Optimization', () => {
  beforeEach(() => {
     vi.useFakeTimers();
     // Set specific date/time to control clock-based logic if needed
     vi.setSystemTime(new Date(2024, 0, 1, 10, 0, 0));
  });

  afterEach(() => {
     vi.useRealTimers();
     vi.restoreAllMocks();
  });

  it('skips unnecessary re-renders of child widgets when weather updates', async () => {
    render(<App />);

    // Initial render + API calls
    await act(async () => {
      // Allow initial promises to resolve
      await Promise.resolve();
    });

    const initialRenderCount = vi.mocked(Lucide.ShoppingCart).mock.calls.length;

    // Advance 30 mins (trigger weather update in App)
    await act(async () => {
      vi.advanceTimersByTime(30 * 60 * 1000);
      // Allow re-fetch promises to resolve
      await Promise.resolve();
    });

    const finalRenderCount = vi.mocked(Lucide.ShoppingCart).mock.calls.length;

    // With memoization, ShoppingListWidget should NOT re-render when weather state updates in App,
    // because its props haven't changed.
    expect(finalRenderCount).toBe(initialRenderCount);
  });
});
