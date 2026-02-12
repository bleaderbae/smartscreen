import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNASAData, getDogData } from './dailyFeedService';

describe('dailyFeedService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getNASAData', () => {
    it('returns NASA data on success', async () => {
      const mockResponse = {
        date: '2023-10-27',
        title: 'Test Space',
        url: 'http://test.com/image.jpg',
        explanation: 'Test explanation',
        media_type: 'image'
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getNASAData();
      expect(result).toEqual({
        id: 'nasa-2023-10-27',
        type: 'nasa',
        title: 'Test Space',
        url: 'http://test.com/image.jpg',
        explanation: 'Test explanation',
        mediaType: 'image',
        thumbnailUrl: undefined
      });
    });

    it('returns fallback data on failure', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      } as Response);

      const result = await getNASAData();
      expect(result.id).toBe('nasa-fallback');
    });

    it('calls fetch with correct URL including API key', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({})
      });
      globalThis.fetch = mockFetch;

      await getNASAData();

      // Verifies that the URL is constructed with the fallback or environment variable
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('api_key=DEMO_KEY'));
    });
  });

  describe('getDogData', () => {
    it('returns combined Dog data on success', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({ // Dog Image
          ok: true,
          json: async () => ({ message: 'http://dog.com/dog.jpg', status: 'success' })
        } as Response)
        .mockResolvedValueOnce({ // Dog Fact
          ok: true,
          json: async () => ({ data: [{ attributes: { body: 'Dogs bark.' } }] })
        } as Response);

      const result = await getDogData();
      expect(result).toEqual({
        id: expect.stringMatching(/^dog-/),
        type: 'dog',
        title: 'Dog Fact',
        url: 'http://dog.com/dog.jpg',
        explanation: 'Dogs bark.',
        mediaType: 'image'
      });
    });

    it('returns fallback data on failure', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await getDogData();
      expect(result.id).toBe('dog-fallback');
    });
  });
});
