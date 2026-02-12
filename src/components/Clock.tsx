import React, { useState, useEffect, useMemo } from 'react';
import { format, differenceInMinutes, startOfDay, addHours } from 'date-fns';
import { Sunrise, Sun, Sunset, Moon, Calendar } from 'lucide-react';
import type { CalendarEvent } from '../services/calendarService';
import { FAMILY_PROFILES } from '../config';

interface ClockProps {
  nextEvent?: CalendarEvent;
}

const Clock: React.FC<ClockProps> = ({ nextEvent }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeContext = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 9) {
      return { 
        icon: <Sunrise size={48} className="text-orange-300" />, 
        label: 'Good Morning', 
        color: 'text-orange-300' 
      };
    }
    if (hour >= 9 && hour < 17) {
      return { 
        icon: <Sun size={48} className="text-yellow-400" />, 
        label: 'Day Time', 
        color: 'text-yellow-400' 
      };
    }
    if (hour >= 17 && hour < 20) {
      return { 
        icon: <Sunset size={48} className="text-orange-500" />, 
        label: 'Dusk', 
        color: 'text-orange-500' 
      };
    }
    return { 
      icon: <Moon size={48} className="text-blue-200" />, 
      label: 'Quiet Time', 
      color: 'text-blue-200' 
    };
  }, [currentTime]);

  const dayProgress = useMemo(() => {
    const start = addHours(startOfDay(currentTime), 6); // 6 AM
    const end = addHours(startOfDay(currentTime), 20); // 8 PM
    
    if (currentTime < start) return 0;
    if (currentTime > end) return 100;
    
    const totalMinutes = differenceInMinutes(end, start);
    const elapsedMinutes = differenceInMinutes(currentTime, start);
    return (elapsedMinutes / totalMinutes) * 100;
  }, [currentTime]);

  const nextEventTheme = nextEvent ? FAMILY_PROFILES[nextEvent.source]?.theme : null;

  return (
    <div className="flex flex-col items-center mt-8 mb-12 w-full max-w-2xl mx-auto">
      {/* Time Context Icon & Label */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="p-4 bg-white/5 rounded-3xl mb-2">
          {timeContext.icon}
        </div>
        <span className={`text-xs font-black uppercase tracking-[0.3em] ${timeContext.color}`}>
          {timeContext.label}
        </span>
      </div>
      
      {/* Digital Clock */}
      <div className="text-center">
        <h1 className="text-9xl font-thin tracking-tighter leading-none flex items-baseline justify-center">
          {format(currentTime, 'h:mm')}
          <span className="text-4xl ml-3 opacity-40 font-light">{format(currentTime, 'a')}</span>
        </h1>
        <p className="text-2xl font-light text-gray-400 mt-6 tracking-wide">
          {format(currentTime, 'EEEE, MMMM do')}
        </p>
      </div>

      {/* Day Progress Visualization */}
      <div className="w-full mt-10 px-8">
        <div className="relative h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${timeContext.color.replace('text', 'bg')}`}
            style={{ width: `${dayProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 px-1">
          <div className="flex flex-col items-center gap-1">
            <Sunrise size={14} className="text-gray-600" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">6 AM</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sunset size={14} className="text-gray-600" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">8 PM</span>
          </div>
        </div>
      </div>

      {/* Next Up Glance */}
      {nextEvent && (
        <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 animate-pulse-slow">
          <Calendar size={18} className="text-gray-500" />
          <p className="text-sm font-medium text-gray-300">
            Next Up: <span className="text-white">{nextEvent.summary}</span>
          </p>
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${nextEventTheme?.pill || 'bg-white/10 text-gray-400'}`}>
            {nextEvent.source}
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;
