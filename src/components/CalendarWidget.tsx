import React from 'react';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

const CalendarWidget: React.FC = () => {
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
          <ChevronRight className="text-gray-600" size={20} />
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-medium leading-tight text-white">Dinner with Grandparents</p>
          <p className="text-lg text-red-400/80 font-light">6:30 PM - Tonight</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <span className="text-xs text-gray-500 font-medium">+2 others</span>
      </div>
    </div>
  );
};

export default CalendarWidget;
