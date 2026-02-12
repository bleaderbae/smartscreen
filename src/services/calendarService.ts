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
  const allEvents: CalendarEvent[] = [];
  
  // NWS and other public APIs are fine, but external calendars often have CORS issues.
  // We'll try to fetch, but warn that a proxy might be needed.
  for (const [name, url] of Object.entries(urls)) {
    try {
      // In a production environment, we'd use a proxy to avoid CORS.
      // For a local dev hub, we'll try direct or expect a local proxy.
      const response = await axios.get(url);
      const jcalData = ICAL.parse(response.data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      const events = vevents.map(vevent => {
        const event = new ICAL.Event(vevent);
        return {
          summary: event.summary,
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate.toJSDate(),
          location: event.location,
          source: name
        };
      });

      allEvents.push(...events);
    } catch (error) {
      console.error(`Failed to fetch calendar: ${name}`, error);
    }
  }

  // Sort by date and filter for future events (up to 7 days out)
  const now = new Date();
  const nextWeek = addDays(now, 7);

  return allEvents
    .filter(e => isAfter(e.endDate, now) && isBefore(e.startDate, nextWeek))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
