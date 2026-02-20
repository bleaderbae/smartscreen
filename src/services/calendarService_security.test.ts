import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { fetchCalendarEvents } from './calendarService';

vi.mock('axios');

describe('fetchCalendarEvents Security', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects URLs with invalid protocols (javascript:)', async () => {
    const maliciousUrl = 'javascript:alert(1)';
    const urls = { 'MaliciousUser': maliciousUrl };

    // axios should NOT be called for this URL
    vi.mocked(axios.get).mockResolvedValue({ data: '' });

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).not.toHaveBeenCalledWith(maliciousUrl);
    expect(events).toEqual([]);
  });

  it('rejects URLs with invalid protocols (file:)', async () => {
    const maliciousUrl = 'file:///etc/passwd';
    const urls = { 'MaliciousUser': maliciousUrl };

    vi.mocked(axios.get).mockResolvedValue({ data: '' });

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).not.toHaveBeenCalledWith(maliciousUrl);
    expect(events).toEqual([]);
  });

  it('rejects malformed URLs', async () => {
    const malformedUrl = 'not-a-valid-url';
    const urls = { 'BadUser': malformedUrl };

    vi.mocked(axios.get).mockResolvedValue({ data: '' });

    const events = await fetchCalendarEvents(urls);

    expect(axios.get).not.toHaveBeenCalledWith(malformedUrl);
    expect(events).toEqual([]);
  });

  it('allows valid https URLs', async () => {
    const validUrl = 'https://example.com/calendar.ics';
    const urls = { 'GoodUser': validUrl };

    vi.mocked(axios.get).mockResolvedValue({
      data: `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Test Event
DTSTART:20250101T120000Z
DTEND:20250101T130000Z
END:VEVENT
END:VCALENDAR`
    });

    // We expect this to FAIL until the implementation is updated,
    // but here we are writing the test first (TDD-ish).
    // Actually, the current implementation WILL call axios, so this expectation passes.
    // The security tests above (rejecting invalid URLs) are expected to FAIL
    // with the current implementation because it DOES call axios for everything.

    await fetchCalendarEvents(urls);
    expect(axios.get).toHaveBeenCalledWith(validUrl, expect.anything());
  });

  it('calls axios with timeout and size limits', async () => {
    const validUrl = 'https://example.com/calendar.ics';
    const urls = { 'GoodUser': validUrl };

    vi.mocked(axios.get).mockResolvedValue({
      data: `BEGIN:VCALENDAR
VERSION:2.0
END:VCALENDAR`
    });

    await fetchCalendarEvents(urls);

    expect(axios.get).toHaveBeenCalledWith(validUrl, expect.objectContaining({
      timeout: 10000,
      maxContentLength: 5242880 // 5MB
    }));
  });
});
