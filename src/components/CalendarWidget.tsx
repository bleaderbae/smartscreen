import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronRight, Loader, User, X } from 'lucide-react';
import type { CalendarEvent } from '../services/calendarService';
import { FAMILY_PROFILES } from '../config';
import { format, isToday, isTomorrow, startOfDay } from 'date-fns';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  loading: boolean;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const nextEvent = events[0];

  const formatEventTime = (date: Date) => {
    let dayLabel = format(date, 'EEEE');
    if (isToday(date)) dayLabel = 'Today';
    if (isTomorrow(date)) dayLabel = 'Tomorrow';
    
    return `${format(date, 'h:mm a')} - ${dayLabel}`;
  };

  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const dayKey = format(startOfDay(event.startDate), 'yyyy-MM-dd');
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(event);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  if (loading && !isExpanded) {
    return (
      <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 min-h-[200px] flex items-center justify-center">
        <Loader className="animate-spin text-gray-600" size={32} />
      </div>
    );
  }

  if (!nextEvent && !isExpanded) {
    return (
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(true)}
        className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 min-h-[200px] flex flex-col justify-between active:scale-[0.98] transition-transform cursor-pointer outline-none"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <CalendarIcon className="text-red-400" size={24} />
          </div>
          <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Next Event</span>
        </div>
        <p className="text-xl font-light text-gray-500 italic">No upcoming events scheduled</p>
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-600 font-medium">Tap to see full week</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(true)}
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
            {nextEvent && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border border-white/5 ${FAMILY_PROFILES[nextEvent.source]?.theme.pill || 'bg-white/5 text-gray-400'}`}>
                <User size={12} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{nextEvent.source}</span>
              </div>
            )}
          </div>
          
          {nextEvent ? (
            <div className="space-y-1">
              <p className="text-2xl font-medium leading-tight text-white line-clamp-2">{nextEvent.summary}</p>
              <p className="text-lg text-red-400/80 font-light">{formatEventTime(nextEvent.startDate)}</p>
            </div>
          ) : (
            <p className="text-xl font-light text-gray-500 italic">Clear schedule</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500 font-medium">
            {events.length > 1 ? `+${events.length - 1} more this week` : 'Tap for full week'}
          </span>
          <ChevronRight className="text-gray-600" size={16} />
        </div>
      </div>

      {/* Expanded Weekly Agenda Modal */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl animate-fadeIn flex flex-col p-8 select-none"
          onClick={() => setIsExpanded(false)}
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-500/10 rounded-2xl">
                <CalendarIcon className="text-red-400" size={40} />
              </div>
              <div>
                <h2 className="text-4xl font-thin tracking-tight text-white">Family Agenda</h2>
                <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mt-1">Next 7 Days</p>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
              className="p-4 bg-white/10 rounded-full text-white/50 active:scale-90 transition-transform active:bg-white/20"
            >
              <X size={32} />
            </button>
          </div>

          <div 
            className="flex-1 overflow-y-auto space-y-10 scrollbar-hide pb-12"
            onClick={(e) => e.stopPropagation()}
          >
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <CalendarIcon size={64} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-2xl font-light italic">No events found for this week</p>
              </div>
            ) : (
              groupedEvents.map(([dateKey, dayEvents]) => {
                const date = parseISO(dateKey);
                return (
                  <div key={dateKey} className="space-y-4">
                    <div className="flex items-baseline gap-3 border-b border-white/5 pb-2">
                      <span className="text-3xl font-thin text-white">
                        {isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'EEEE')}
                      </span>
                      <span className="text-lg text-gray-500 font-light">
                        {format(date, 'MMMM do')}
                      </span>
                    </div>
                    
                    <div className="grid gap-3">
                      {dayEvents.map((event, idx) => {
                        const profile = FAMILY_PROFILES[event.source];
                        return (
                          <div 
                            key={`${dateKey}-${idx}`}
                            className={`flex items-center justify-between p-5 rounded-2xl border-l-4 ${profile?.theme.bg || 'bg-white/5'} ${profile?.theme.border || 'border-gray-700'}`}
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-xl font-medium text-white">{event.summary}</span>
                              <span className="text-sm text-gray-400">{format(event.startDate, 'h:mm a')}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${profile?.theme.pill || 'bg-white/10 text-gray-500'}`}>
                              {event.source}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
};

import { parseISO as dateFnsParseISO } from 'date-fns';
const parseISO = (s: string) => dateFnsParseISO(s);

export default CalendarWidget;
