import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { getWeather } from './weatherService';

describe('getWeather Security', () => {

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

  it('rejects forecast URL with invalid protocol (http)', async () => {
    const lat = 40.0001;
    const long = -74.0001;
    const maliciousUrl = 'http://api.weather.gov/gridpoints/OKX/33,35/forecast';

    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          properties: {
            forecast: maliciousUrl,
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ properties: { periods: [] } }),
      } as Response);

    await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });

  it('rejects forecast URL with invalid domain (not weather.gov)', async () => {
    const lat = 40.0002;
    const long = -74.0002;
    const maliciousUrl = 'https://malicious.com/forecast';

    (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          properties: {
            forecast: maliciousUrl,
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ properties: { periods: [] } }),
      } as Response);

    await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });

  it('rejects forecast URL with invalid subdomain (not ending in .weather.gov)', async () => {
      const lat = 40.0003;
      const long = -74.0003;
      const maliciousUrl = 'https://weather.gov.malicious.com/forecast';

      (fetch as Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          properties: {
            forecast: maliciousUrl,
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ properties: { periods: [] } }),
      } as Response);

      await expect(getWeather(lat, long)).rejects.toThrow(/Invalid forecast URL/);
  });
});
