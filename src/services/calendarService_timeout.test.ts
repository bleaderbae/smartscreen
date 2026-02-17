import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { fetchCalendarEvents } from './calendarService';

vi.mock('axios');

describe('fetchCalendarEvents Timeout & Size Limits', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls axios with timeout, maxContentLength, and headers', async () => {
    const url = 'https://example.com/calendar.ics';
    const urls = { 'User': url };

    // Return valid minimal ICS data to avoid parsing errors
    const validIcs = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//EN
BEGIN:VEVENT
UID:123
DTSTAMP:20250101T000000Z
DTSTART:20250101T000000Z
DTEND:20250101T010000Z
SUMMARY:Test
END:VEVENT
END:VCALENDAR`;

    vi.mocked(axios.get).mockResolvedValue({ data: validIcs });

    await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledWith(url, expect.objectContaining({
      timeout: 10000,
      maxContentLength: 5242880, // 5MB
      headers: expect.objectContaining({
        'Accept': 'text/calendar'
      })
    }));
  });
});
