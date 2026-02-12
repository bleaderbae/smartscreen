import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';

const Clock: React.FC = () => {
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

  return (
    <div className="flex flex-col items-center mt-8 mb-12">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="p-4 bg-white/5 rounded-3xl mb-2">
          {timeContext.icon}
        </div>
        <span className={`text-xs font-black uppercase tracking-[0.3em] ${timeContext.color}`}>
          {timeContext.label}
        </span>
      </div>
      
      <h1 className="text-8xl font-thin tracking-tighter leading-none">
        {format(currentTime, 'h:mm')}
        <span className="text-3xl ml-2 opacity-50">{format(currentTime, 'a')}</span>
      </h1>
      <p className="text-2xl font-light text-gray-400 mt-4">
        {format(currentTime, 'EEEE, MMMM do')}
      </p>
    </div>
  );
};

export default Clock;
