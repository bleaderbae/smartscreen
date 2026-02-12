import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronRight, Loader, User } from 'lucide-react';
import { fetchCalendarEvents, type CalendarEvent } from '../services/calendarService';
import { CALENDAR_URLS } from '../config';
import { format, isToday, isTomorrow } from 'date-fns';

const CalendarWidget: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      if (Object.keys(CALENDAR_URLS).length === 0) return;
      
      setLoading(true);
      try {
        const data = await fetchCalendarEvents(CALENDAR_URLS);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load calendar", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    // Refresh every hour
    const interval = setInterval(loadEvents, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const nextEvent = events[0];

  const formatEventTime = (date: Date) => {
    let dayLabel = format(date, 'EEEE');
    if (isToday(date)) dayLabel = 'Today';
    if (isTomorrow(date)) dayLabel = 'Tomorrow';
    
    return `${format(date, 'h:mm a')} - ${dayLabel}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 min-h-[200px] flex items-center justify-center">
        <Loader className="animate-spin text-gray-600" size={32} />
      </div>
    );
  }

  if (!nextEvent) {
    return (
      <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 min-h-[200px] flex flex-col justify-between active:scale-[0.98] transition-transform cursor-pointer outline-none">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <CalendarIcon className="text-red-400" size={24} />
          </div>
          <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Next Event</span>
        </div>
        <p className="text-xl font-light text-gray-500 italic">No upcoming events scheduled</p>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-600">Add iCal URLs in config.ts to see your schedule</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      role="button"
      tabIndex={0}
      className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 min-h-[200px] flex flex-col justify-between active:scale-[0.98] transition-transform cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <CalendarIcon className="text-red-400" size={24} />
            </div>
            <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Next Event</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
            <User size={12} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{nextEvent.source}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-medium leading-tight text-white line-clamp-2">{nextEvent.summary}</p>
          <p className="text-lg text-red-400/80 font-light">{formatEventTime(nextEvent.startDate)}</p>
        </div>
      </div>

      {events.length > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500 font-medium">+{events.length - 1} more this week</span>
          <ChevronRight className="text-gray-600" size={16} />
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
