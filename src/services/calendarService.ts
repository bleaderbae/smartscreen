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
      const response = await axios.get(url);
      const jcalData = ICAL.parse(response.data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      return vevents.map(vevent => {
        const event = new ICAL.Event(vevent);
        return {
          summary: event.summary,
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate.toJSDate(),
          location: event.location,
          source: name
        };
      });
    } catch (error) {
      console.error(`Failed to fetch calendar: ${name}`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  const allEvents = results.flat();

  // Sort by date and filter for future events (up to 7 days out)
  const now = new Date();
  const nextWeek = addDays(now, 7);

  return allEvents
    .filter(e => isAfter(e.endDate, now) && isBefore(e.startDate, nextWeek))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
