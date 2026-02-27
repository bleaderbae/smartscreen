import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import axios from 'axios';
import { getWeather, getWeatherIconFromUrl } from './weatherService';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      isAxiosError: (payload: any) => payload?.isAxiosError === true,
    },
  };
});

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
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects with error for invalid latitude', async () => {
    await expect(getWeather(91, 0)).rejects.toThrow('Invalid latitude: must be a number between -90 and 90');
    await expect(getWeather(-91, 0)).rejects.toThrow('Invalid latitude: must be a number between -90 and 90');
  });

  it('rejects with error for invalid longitude', async () => {
    await expect(getWeather(0, 181)).rejects.toThrow('Invalid longitude: must be a number between -180 and 180');
    await expect(getWeather(0, -181)).rejects.toThrow('Invalid longitude: must be a number between -180 and 180');
  });

  it('fetches weather data successfully', async () => {
    const mockPointsResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/OKX/10,10/forecast', // Unique URL
      },
    };

    const mockForecastResponse = {
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
    };

    (axios.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve({ data: mockPointsResponse });
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ data: mockForecastResponse });
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

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      timeout: 10000,
      maxContentLength: 5242880
    }));
  });

  it('correctly sets high and low temperatures for nighttime forecast', async () => {
    const mockPointsResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/OKX/20,20/forecast', // Unique URL
      },
    };

    const mockForecastResponse = {
      properties: {
        periods: [
          {
            number: 1,
            name: 'Tonight',
            startTime: '2023-10-26T18:00:00-04:00',
            endTime: '2023-10-27T06:00:00-04:00',
            isDaytime: false,
            temperature: 55,
            temperatureUnit: 'F',
            shortForecast: 'Clear',
            detailedForecast: 'Clear, with a low around 55.',
            icon: 'https://api.weather.gov/icons/land/night/few?size=medium',
          },
          {
            number: 2,
            name: 'Tomorrow',
            startTime: '2023-10-27T06:00:00-04:00',
            endTime: '2023-10-27T18:00:00-04:00',
            isDaytime: true,
            temperature: 75,
            temperatureUnit: 'F',
            shortForecast: 'Sunny',
            detailedForecast: 'Sunny, with a high near 75.',
            icon: 'https://api.weather.gov/icons/land/day/few?size=medium',
          },
        ],
      },
    };

    (axios.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve({ data: mockPointsResponse });
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ data: mockForecastResponse });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const data = await getWeather(10.0, 10.0); // Unique Coords

    expect(data.high).toBe(75);
    expect(data.low).toBe(55);
  });

  it('handles points fetch failure', async () => {
    (axios.get as Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, statusText: 'Not Found' }
    });

    await expect(getWeather(0, 0)).rejects.toThrow('Failed to fetch points: Not Found');
  });

  it('handles forecast fetch failure', async () => {
    const mockPointsResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/OKX/30,30/forecast', // Unique URL
      },
    };

    (axios.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve({ data: mockPointsResponse });
      }
      if (url.includes('/forecast')) {
        return Promise.reject({
          isAxiosError: true,
          response: { status: 500, statusText: 'Internal Server Error' }
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await expect(getWeather(20.0, 20.0)).rejects.toThrow('Failed to fetch forecast: Internal Server Error'); // Unique Coords
  });

  it('handles empty forecast periods', async () => {
    const mockPointsResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/OKX/40,40/forecast', // Unique URL
      },
    };

    const mockForecastResponse = {
      properties: {
        periods: [],
      },
    };

    (axios.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve({ data: mockPointsResponse });
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ data: mockForecastResponse });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    await expect(getWeather(30.0, 30.0)).rejects.toThrow('No forecast data available'); // Unique Coords
  });

  it('caches grid point URL for subsequent calls', async () => {
    const mockPointsResponse = {
      properties: {
        forecast: 'https://api.weather.gov/gridpoints/OKX/50,50/forecast', // Unique URL
      },
    };

    const mockForecastResponse = {
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
    };

    (axios.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/points/')) {
        return Promise.resolve({ data: mockPointsResponse });
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ data: mockForecastResponse });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    // First call: should fetch points + forecast
    // Use unique coordinates to ensure cache miss
    const lat = 41.0000;
    const long = -75.0000;

    await getWeather(lat, long);
    expect(axios.get).toHaveBeenCalledTimes(2);

    // Second call: should use cached forecast (0 additional calls)
    await getWeather(lat, long);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('logs a generic error message and does not expose internal error details', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (axios.get as Mock).mockRejectedValue(new Error('Sensitive internal path: /var/www/html'));

    await expect(getWeather(0, 0)).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching weather data');
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Sensitive internal path'));
  });
});
