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

  it('configures axios with timeout and maxContentLength', async () => {
    const validUrl = 'https://example.com/calendar.ics';
    const urls = { 'TestUser': validUrl };

    // Mock axios response
    vi.mocked(axios.get).mockResolvedValue({
      data: `BEGIN:VCALENDAR
VERSION:2.0
END:VCALENDAR`
    });

    await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledWith(
      validUrl,
      expect.objectContaining({
        timeout: 10000, // 10 seconds
        maxContentLength: 5242880, // 5MB
      })
    );
  });
});
