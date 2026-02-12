import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWeather } from './weatherService';

describe('getWeather', () => {
  beforeEach(() => {
    // Cross-compatible way to mock fetch for both Vitest and Bun
    if (typeof vi.stubGlobal === 'function') {
      vi.stubGlobal('fetch', vi.fn());
    } else {
      globalThis.fetch = vi.fn() as any;
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches weather data successfully', async () => {
    const mockPointsResponse = {
      ok: true,
      json: async () => ({
        properties: {
          forecast: 'https://api.weather.gov/gridpoints/OKX/33,35/forecast',
        },
      }),
    };

    const mockForecastResponse = {
      ok: true,
      json: async () => ({
        properties: {
          periods: [
            {
              number: 1,
              name: 'Today',
              startTime: '2023-10-26T06:00:00-04:00',
              endTime: '2023-10-26T18:00:00-04:00',
              isDaytime: true,
              temperature: 72,
              temperatureUnit: 'F',
              shortForecast: 'Partly Cloudy',
              detailedForecast: 'Partly cloudy, with a high near 72.',
              icon: 'https://api.weather.gov/icons/land/day/sct?size=medium',
            },
            {
              number: 2,
              name: 'Tonight',
              startTime: '2023-10-26T18:00:00-04:00',
              endTime: '2023-10-27T06:00:00-04:00',
              isDaytime: false,
              temperature: 60,
              temperatureUnit: 'F',
              shortForecast: 'Mostly Clear',
              detailedForecast: 'Mostly clear, with a low around 60.',
              icon: 'https://api.weather.gov/icons/land/night/few?size=medium',
            },
          ],
        },
      }),
    };

    // Mock the fetch implementation
    (fetch as any).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve(mockPointsResponse);
      }
      if (url.includes('/forecast')) {
        return Promise.resolve(mockForecastResponse);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const data = await getWeather(40.7128, -74.0060);

    expect(data).toEqual({
      temperature: 72,
      shortForecast: 'Partly Cloudy',
      detailedForecast: 'Partly cloudy, with a high near 72.',
      high: 72,
      low: 60,
      icon: 'https://api.weather.gov/icons/land/day/sct?size=medium',
      weatherIcon: 'PartlyCloudy',
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles points fetch failure', async () => {
    (fetch as any).mockImplementation(() => Promise.resolve({ ok: false, statusText: 'Not Found' }));

    await expect(getWeather(0, 0)).rejects.toThrow('Failed to fetch points: Not Found');
  });

  it('handles forecast fetch failure', async () => {
    const mockPointsResponse = {
      ok: true,
      json: async () => ({
        properties: {
          forecast: 'https://api.weather.gov/gridpoints/OKX/33,35/forecast',
        },
      }),
    };

    (fetch as any).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve(mockPointsResponse);
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ ok: false, statusText: 'Internal Server Error' });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await expect(getWeather(40.7128, -74.0060)).rejects.toThrow('Failed to fetch forecast: Internal Server Error');
  });

  it('handles empty forecast periods', async () => {
    const mockPointsResponse = {
      ok: true,
      json: async () => ({
        properties: {
          forecast: 'https://api.weather.gov/gridpoints/OKX/33,35/forecast',
        },
      }),
    };

    const mockForecastResponse = {
      ok: true,
      json: async () => ({
        properties: {
          periods: [],
        },
      }),
    };

    (fetch as any).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve(mockPointsResponse);
      }
      if (url.includes('/forecast')) {
        return Promise.resolve(mockForecastResponse);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await expect(getWeather(40.7128, -74.0060)).rejects.toThrow('No forecast data available');
  });
});
