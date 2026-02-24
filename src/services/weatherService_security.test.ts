import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import axios from 'axios';
import { getWeather } from './weatherService';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      isAxiosError: (payload: any) => payload?.isAxiosError === true,
    },
  };
});

describe('getWeather Security', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects forecast URL with invalid protocol (http)', async () => {
    const lat = 40.0001;
    const long = -74.0001;
    const maliciousUrl = 'http://api.weather.gov/gridpoints/OKX/33,35/forecast';

    (axios.get as Mock)
      .mockResolvedValueOnce({
        data: {
          properties: {
            forecast: maliciousUrl,
          },
        },
      })
      .mockResolvedValueOnce({
        data: { properties: { periods: [] } },
      });

    await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });

  it('rejects forecast URL with invalid domain (not weather.gov)', async () => {
    const lat = 40.0002;
    const long = -74.0002;
    const maliciousUrl = 'https://malicious.com/forecast';

    (axios.get as Mock)
      .mockResolvedValueOnce({
        data: {
          properties: {
            forecast: maliciousUrl,
          },
        },
      })
      .mockResolvedValueOnce({
        data: { properties: { periods: [] } },
      });

    await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });

  it('rejects forecast URL with invalid subdomain (not ending in .weather.gov)', async () => {
      const lat = 40.0003;
      const long = -74.0003;
      const maliciousUrl = 'https://weather.gov.malicious.com/forecast';

      (axios.get as Mock)
      .mockResolvedValueOnce({
        data: {
          properties: {
            forecast: maliciousUrl,
          },
        },
      })
      .mockResolvedValueOnce({
        data: { properties: { periods: [] } },
      });

      await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });
});
