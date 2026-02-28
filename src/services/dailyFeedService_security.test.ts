import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getNASAData, getDogData } from './dailyFeedService';

vi.mock('axios');

describe('dailyFeedService Security', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Fetch Configuration (DoS Prevention)', () => {
    it('calls NASA API with timeout and size limits', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.get as any).mockResolvedValue({ data: {} });

      await getNASAData();

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('api.nasa.gov'),
        expect.objectContaining({
          timeout: 10000,
          maxContentLength: 5 * 1024 * 1024
        })
      );
    });

    it('calls Dog API with timeout and size limits', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.get as any).mockResolvedValue({ data: {} });

      await getDogData();

      // Should be called twice (image and fact), both with limits
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('dog.ceo'),
        expect.objectContaining({
          timeout: 10000,
          maxContentLength: 5 * 1024 * 1024
        })
      );
      expect(axios.get).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('dogapi.dog'),
        expect.objectContaining({
          timeout: 10000,
          maxContentLength: 5 * 1024 * 1024
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles timeout errors gracefully (NASA)', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (timeoutError as any).code = 'ECONNABORTED';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.get as any).mockRejectedValue(timeoutError);

      const result = await getNASAData();

      expect(result.id).toBe('nasa-fallback');
    });

    it('handles large response errors gracefully (NASA)', async () => {
      const sizeError = new Error('maxContentLength size of 5242880 exceeded');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.get as any).mockRejectedValue(sizeError);

      const result = await getNASAData();

      expect(result.id).toBe('nasa-fallback');
    });
  });
});
