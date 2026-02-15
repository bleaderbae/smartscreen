import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCalendarEvents } from './calendarService';

vi.mock('axios');

describe('fetchCalendarEvents Security', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('rejects URLs with non-http/https protocols', async () => {
    const urls = {
      'Malicious1': 'javascript:alert(1)',
      'Malicious2': 'file:///etc/passwd',
      'Malicious3': 'ftp://example.com/file.ics'
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).not.toHaveBeenCalled();
    expect(events).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled(); // Should log errors
  });

  it('rejects invalid URL strings', async () => {
    const urls = {
      'Invalid': 'not-a-url'
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).not.toHaveBeenCalled();
    expect(events).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('allows valid http/https URLs', async () => {
    const urls = {
        'ValidHttp': 'http://example.com/cal.ics',
        'ValidHttps': 'https://example.com/cal.ics'
    };

    // Return minimal valid iCal data to avoid parsing errors spamming logs,
    // although catching errors is expected behavior.
    vi.mocked(axios.get).mockResolvedValue({
        data: 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Test//EN\nBEGIN:VEVENT\nDTSTART:20230101T000000Z\nSUMMARY:Test\nEND:VEVENT\nEND:VCALENDAR'
    });

    await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith('http://example.com/cal.ics');
    expect(axios.get).toHaveBeenCalledWith('https://example.com/cal.ics');
  });
});
