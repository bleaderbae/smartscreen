import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { fetchCalendarEvents } from './calendarService';

vi.mock('axios');

describe('fetchCalendarEvents DoS Protection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('configures axios with a timeout to prevent hanging requests', async () => {
    const urls = { 'User1': 'http://example.com/cal.ics' };
    vi.mocked(axios.get).mockResolvedValue({ data: 'BEGIN:VCALENDAR\nEND:VCALENDAR' });

    await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledWith(
      'http://example.com/cal.ics',
      expect.objectContaining({
        timeout: 10000, // 10 seconds
        responseType: 'text'
      })
    );
  });

  it('rejects responses larger than 5MB to prevent memory exhaustion', async () => {
    const urls = { 'User1': 'http://example.com/large.ics' };

    // Create a large string > 5MB
    const largeData = 'a'.repeat(5 * 1024 * 1024 + 1);

    vi.mocked(axios.get).mockResolvedValue({ data: largeData });

    // Spy on console.error to suppress output during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const events = await fetchCalendarEvents(urls);

    expect(events).toEqual([]); // Should return empty array
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch calendar'),
      expect.any(Error)
    );

    // Verify the error message contains size limit info
    const errorArg = consoleSpy.mock.calls[0][1] as Error;
    expect(errorArg.message).toMatch(/size limit/i);
  });
});
