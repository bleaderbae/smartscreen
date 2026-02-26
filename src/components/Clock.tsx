import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { format } from 'date-fns';
import { Sunrise, Sunset, Calendar } from 'lucide-react';
import type { CalendarEvent } from '../services/calendarService';
import { FAMILY_PROFILES } from '../config';

interface ClockProps {
  nextEvent?: CalendarEvent;
}

const Clock: React.FC<ClockProps> = ({ nextEvent }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(prev => {
        if (now.getMinutes() !== prev.getMinutes()) {
          return now;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Day Progress (0 to 100)
  const dayProgress = (totalMinutes / (24 * 60)) * 100;

  // Calculate Sun/Moon position and visibility
  // Sun is up from 6:00 (360m) to 20:00 (1200m)
  const sunVisible = totalMinutes >= 360 && totalMinutes <= 1200;
  const sunProgress = sunVisible ? (totalMinutes - 360) / (1200 - 360) : 0;
  
  // Arc calculation for "rising/setting" feel
  // Using sine wave for height: sin(0) = 0, sin(PI/2) = 1, sin(PI) = 0
  const sunHeight = sunVisible ? Math.sin(sunProgress * Math.PI) : 0;

  const timeContext = useMemo(() => {
    if (hour >= 5 && hour < 9) {
      return { 
        label: 'Good Morning', 
        color: 'text-orange-300',
        sunColor: 'bg-orange-400',
        glow: 'shadow-[0_0_50px_20px_rgba(251,146,60,0.4)]',
      };
    }
    if (hour >= 9 && hour < 17) {
      return { 
        label: 'Day Time', 
        color: 'text-yellow-400',
        sunColor: 'bg-yellow-100',
        glow: 'shadow-[0_0_60px_30px_rgba(253,224,71,0.3)]',
      };
    }
    if (hour >= 17 && hour < 20) {
      return { 
        label: 'Dusk', 
        color: 'text-orange-500',
        sunColor: 'bg-orange-500',
        glow: 'shadow-[0_0_50px_20px_rgba(234,88,12,0.4)]',
      };
    }
    return { 
      label: 'Quiet Time', 
      color: 'text-blue-200',
      sunColor: 'bg-blue-50',
      glow: 'shadow-[0_0_40px_15px_rgba(191,219,254,0.3)]',
    };
  }, [hour]);

  const nextEventTheme = nextEvent ? FAMILY_PROFILES[nextEvent.source]?.theme : null;

  const celestialRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (celestialRef.current) {
      celestialRef.current.style.setProperty('--day-progress', `${dayProgress}%`);
      celestialRef.current.style.setProperty('--sun-height', `${sunHeight * 4 + 0.5}rem`);
    }
  }, [dayProgress, sunHeight]);

  return (
    <div className="flex flex-col items-center mt-8 mb-12 w-full max-w-2xl mx-auto">
      {/* Digital Clock */}
      <div className="text-center">
        <h1 className="text-[clamp(4rem,20vw,8rem)] font-thin tracking-tighter leading-none flex items-baseline justify-center">
          {format(currentTime, 'h:mm')}
          <span className="text-[clamp(1rem,5vw,2.25rem)] ml-3 opacity-40 font-light">{format(currentTime, 'a')}</span>
        </h1>
        <p className="text-[clamp(1rem,4vw,1.5rem)] font-light text-gray-400 mt-6 tracking-wide">
          {format(currentTime, 'EEEE, MMMM do')}
        </p>
      </div>

      {/* Sky Track Visualization */}
      <div className="w-full mt-20 px-8 relative h-24 flex items-end">
        {/* Phase Label - Floating above the track */}
        <div className="absolute -top-8 inset-x-0 flex justify-center">
           <span className={`text-xs font-black uppercase tracking-[0.4em] animate-fadeIn ${timeContext.color}`}>
            {timeContext.label}
          </span>
        </div>

        {/* The Track (Horizon) */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent relative">
          {/* Static Full Day Spectrum Background (The Sky) */}
          <div className="absolute -top-16 inset-x-0 h-16 opacity-20 bg-gradient-to-r from-indigo-950 via-blue-500 via-yellow-200 via-orange-500 to-indigo-950 blur-xl rounded-t-full" />
        </div>
        
        {/* Moving Celestial Body */}
        <div 
          ref={celestialRef}
          className="celestial-body absolute transition-all duration-1000 ease-linear flex items-center justify-center w-12 h-12 z-10"
        >
          {/* Broad Atmosphere Glow */}
          <div className={`absolute w-48 h-48 rounded-full opacity-20 blur-3xl ${timeContext.sunColor}`} />
          
          {/* Core Glow */}
          <div className={`absolute w-16 h-16 rounded-full blur-xl ${timeContext.sunColor} ${timeContext.glow}`} />
          
          {/* The Body */}
          <div className={`w-6 h-6 rounded-full ${timeContext.sunColor} shadow-lg relative`}>
             {/* Moon Craters / Sun Detail */}
             <div className="absolute inset-0 rounded-full bg-white/20 blur-[1px]" />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute -bottom-6 inset-x-8 flex justify-between px-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">
          <div className="flex items-center gap-2">
            <Sunrise size={12} />
            <span>Dawn</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Dusk</span>
            <Sunset size={12} />
          </div>
        </div>
      </div>

      {/* Next Up Glance */}
      {nextEvent && (
        <div className="mt-16 flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 animate-pulse-slow">
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
