import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchCalendarEvents } from './calendarService';
import { addDays } from 'date-fns';

vi.mock('axios');

const mockICalData = (summary: string, startDate: Date) => {
  // Format to YYYYMMDDTHHmmSSZ
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const start = formatDate(startDate);
  const end = formatDate(addDays(startDate, 1));

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Calendar//EN
BEGIN:VEVENT
UID:1234567890-${summary.replace(/\s/g, '')}
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
END:VEVENT
END:VCALENDAR`;
};

describe('fetchCalendarEvents', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches and parses calendar events successfully', async () => {
    const today = new Date();
    const eventSummary = 'Test Event';
    const iCalData = mockICalData(eventSummary, addDays(today, 1)); // Event tomorrow

    vi.mocked(axios.get).mockResolvedValue({ data: iCalData });

    const urls = {
      'User1': 'http://example.com/calendar1.ics'
    };

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledWith('http://example.com/calendar1.ics', expect.anything());
    expect(events).toHaveLength(1);
    expect(events[0].summary).toBe(eventSummary);
    expect(events[0].source).toBe('User1');
  });

  it('handles multiple calendars', async () => {
    const today = new Date();
    const event1 = mockICalData('Event 1', addDays(today, 1));
    const event2 = mockICalData('Event 2', addDays(today, 2));

    vi.mocked(axios.get).mockImplementation((url) => {
        if (url === 'http://example.com/url1') return Promise.resolve({ data: event1 });
        if (url === 'http://example.com/url2') return Promise.resolve({ data: event2 });
        return Promise.reject(new Error('Not found'));
    });

    const urls = {
      'User1': 'http://example.com/url1',
      'User2': 'http://example.com/url2'
    };

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(events).toHaveLength(2);
    // Sort order is by date, so Event 1 (tomorrow) comes before Event 2 (day after)
    expect(events[0].summary).toBe('Event 1');
    expect(events[1].summary).toBe('Event 2');
  });

  it('handles failures gracefully', async () => {
     const today = new Date();
    const event1 = mockICalData('Event 1', addDays(today, 1));

    vi.mocked(axios.get).mockImplementation((url) => {
        if (url === 'http://example.com/url1') return Promise.resolve({ data: event1 });
        if (url === 'http://example.com/url2') return Promise.reject(new Error('Network error'));
        return Promise.reject(new Error('Not found'));
    });

    const urls = {
      'User1': 'http://example.com/url1',
      'User2': 'http://example.com/url2'
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const events = await fetchCalendarEvents(urls);

    expect(events).toHaveLength(1);
    expect(events[0].source).toBe('User1');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
