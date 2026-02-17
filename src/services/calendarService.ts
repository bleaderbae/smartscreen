import axios from 'axios';
import ICAL from 'ical.js';
import { addDays, isAfter, isBefore } from 'date-fns';

export interface CalendarEvent {
  summary: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  source: string; // To identify which person's calendar
}

export const fetchCalendarEvents = async (urls: Record<string, string>): Promise<CalendarEvent[]> => {
  // Define date range for filtering (now to 7 days ahead)
  const now = new Date();
  const nextWeek = addDays(now, 7);

  // NWS and other public APIs are fine, but external calendars often have CORS issues.
  // We'll try to fetch, but warn that a proxy might be needed.
  const fetchPromises = Object.entries(urls).map(async ([name, url]) => {
    try {
      // Validate URL protocol to prevent non-http/https requests (SSRF protection)
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        console.warn(`Skipping calendar for ${name}: Invalid protocol ${parsedUrl.protocol}`);
        return [];
      }

      // In a production environment, we'd use a proxy to avoid CORS.
      // For a local dev hub, we'll try direct or expect a local proxy.
      const response = await axios.get(url, {
        timeout: 10000, // 10 seconds timeout
        maxContentLength: 5 * 1024 * 1024, // 5MB limit
        headers: {
          'Accept': 'text/calendar'
        }
      });
      const jcalData = ICAL.parse(response.data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      // Optimize: Filter events during processing to avoid creating objects for past/future events
      return vevents.reduce<CalendarEvent[]>((acc, vevent) => {
        try {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate.toJSDate();
          const endDate = event.endDate.toJSDate();

          // Check if event is within the next 7 days (and not already ended)
          if (isAfter(endDate, now) && isBefore(startDate, nextWeek)) {
            acc.push({
              summary: event.summary,
              startDate,
              endDate,
              location: event.location,
              source: name
            });
          }
        } catch (e) {
          // specific event parsing error, skip this event
          console.warn(`Failed to parse an event in calendar ${name}`, e);
        }
        return acc;
      }, []);

    } catch (error) {
      console.error(`Failed to fetch calendar: ${name}`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  const allEvents = results.flat();

  // Sort by date
  return allEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
