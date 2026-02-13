import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { getWeather, getWeatherIconFromUrl } from './weatherService';

describe('getWeatherIconFromUrl', () => {
  const testCases = [
    { url: 'https://api.weather.gov/icons/land/day/skc?size=medium', expected: 'Clear' },
    { url: 'https://api.weather.gov/icons/land/day/few?size=medium', expected: 'Clear' },
    { url: 'https://api.weather.gov/icons/land/day/sct?size=medium', expected: 'PartlyCloudy' },
    { url: 'https://api.weather.gov/icons/land/day/bkn?size=medium', expected: 'PartlyCloudy' },
    { url: 'https://api.weather.gov/icons/land/day/ovc?size=medium', expected: 'Cloudy' },
    { url: 'https://api.weather.gov/icons/land/day/rain?size=medium', expected: 'Rain' },
    { url: 'https://api.weather.gov/icons/land/day/shra?size=medium', expected: 'Rain' },
    { url: 'https://api.weather.gov/icons/land/day/snow?size=medium', expected: 'Snow' },
    { url: 'https://api.weather.gov/icons/land/day/tsra?size=medium', expected: 'Thunderstorm' },
    { url: 'https://api.weather.gov/icons/land/day/fog?size=medium', expected: 'Fog' },
    { url: 'https://api.weather.gov/icons/land/day/hurricane?size=medium', expected: 'Unknown' },
    { url: '', expected: 'Unknown' },
  ];

  testCases.forEach(({ url, expected }) => {
    it(`maps icon URL containing "${url}" to ${expected}`, () => {
      expect(getWeatherIconFromUrl(url)).toBe(expected);
    });
  });
});

describe('getWeather', () => {
  beforeEach(() => {
    // Cross-compatible way to mock fetch for both Vitest and Bun
    if (typeof vi.stubGlobal === 'function') {
      vi.stubGlobal('fetch', vi.fn());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    (fetch as Mock).mockImplementation((url: string) => {
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
    (fetch as Mock).mockImplementation(() => Promise.resolve({ ok: false, statusText: 'Not Found' }));

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

    (fetch as Mock).mockImplementation((url: string) => {
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

    (fetch as Mock).mockImplementation((url: string) => {
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

  it('caches grid point URL for subsequent calls', async () => {
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
          ],
        },
      }),
    };

    (fetch as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve(mockPointsResponse);
      }
      if (url.includes('/forecast')) {
        return Promise.resolve(mockForecastResponse);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // First call: should fetch points + forecast
    // Use unique coordinates to ensure cache miss (since other tests might populate cache for default coords)
    const lat = 41.0000;
    const long = -75.0000;

    await getWeather(lat, long);
    expect(fetch).toHaveBeenCalledTimes(2);

    // Second call: should fetch only forecast (using cached grid point URL)
    await getWeather(lat, long);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('logs a generic error message and does not expose internal error details', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (fetch as Mock).mockImplementation(() => Promise.reject(new Error('Sensitive internal path: /var/www/html')));

    await expect(getWeather(0, 0)).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching weather data');
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Sensitive internal path'));
  });
});
