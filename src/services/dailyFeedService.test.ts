import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getNASAData, getDogData } from './dailyFeedService';

vi.mock('axios');

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

      (axios.get as any).mockResolvedValue({
        data: mockResponse,
      });

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
      (axios.get as any).mockRejectedValue(new Error('Internal Server Error'));

      const result = await getNASAData();
      expect(result.id).toBe('nasa-fallback');
    });

    it('calls axios with correct URL and API key in params', async () => {
      (axios.get as any).mockResolvedValue({
        data: {}
      });

      await getNASAData();

      // Verifies that the URL is the base URL and API key is passed in params
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.nasa.gov/planetary/apod',
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: 'DEMO_KEY',
            thumbs: 'True'
          })
        })
      );
    });
  });

  describe('getDogData', () => {
    it('returns combined Dog data on success', async () => {
      (axios.get as any)
        .mockResolvedValueOnce({ // Dog Image
          data: { message: 'http://dog.com/dog.jpg', status: 'success' }
        })
        .mockResolvedValueOnce({ // Dog Fact
          data: { data: [{ attributes: { body: 'Dogs bark.' } }] }
        });

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
      (axios.get as any).mockRejectedValue(new Error('Network error'));

      const result = await getDogData();
      expect(result.id).toBe('dog-fallback');
    });
  });
});
