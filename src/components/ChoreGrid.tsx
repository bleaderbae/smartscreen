import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ListChecks, CalendarDays, LayoutGrid } from 'lucide-react';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import ChoreWidget from './ChoreWidget';
import { INITIAL_CHORES, getChoresForDate, type Chore } from '../services/choreService';
import { safeJSONParse } from '../utils/security';

// Extracted to module scope to avoid recreation on every render
const getCompletionKey = (chore: Chore, date: Date) => {
  if (chore.frequency === 'daily') {
    return `daily-${chore.id}-${format(date, 'yyyy-MM-dd')}`;
  }
  if (chore.frequency === 'weekly') {
    // Use the start of the week as the key suffix
    return `weekly-${chore.id}-${format(startOfWeek(date), 'yyyy-MM-dd')}`;
  }
  if (chore.frequency === 'monthly') {
    return `monthly-${chore.id}-${format(startOfMonth(date), 'yyyy-MM')}`;
  }
  return `${chore.id}`;
};

// Extracted to module scope
const SECTIONS = [
  { id: 'daily', label: 'Daily', icon: LayoutGrid, color: 'text-orange-400' },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays, color: 'text-blue-400' },
  { id: 'monthly', label: 'Monthly', icon: ListChecks, color: 'text-purple-400' },
];

const ChoreGrid: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  
  // Persistence logic: track completions with period-specific keys
  const [completions, setCompletions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('chore-completions');
    return safeJSONParse(saved, {});
  });

  const [viewMode, setViewAll] = useState(false); // false = Due Today, true = Show All

  useEffect(() => {
    localStorage.setItem('chore-completions', JSON.stringify(completions));
  }, [completions]);

  const choresWithCompletion = useMemo(() => {
    return INITIAL_CHORES.map(chore => ({
      ...chore,
      completed: !!completions[getCompletionKey(chore, today)]
    }));
  }, [completions, today]);

  const displayedChores = useMemo(() => {
    if (viewMode) return choresWithCompletion;
    return getChoresForDate(choresWithCompletion, today);
  }, [choresWithCompletion, today, viewMode]);

  // Memoize the callback to ensure stable reference for React.memo
  const toggleChore = useCallback((id: string) => {
    const chore = INITIAL_CHORES.find(c => c.id === id);
    if (!chore) return;

    const key = getCompletionKey(chore, today);
    setCompletions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, [today]);

  return (
    <div className="col-span-2 space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <ListChecks className="text-purple-400" size={28} />
          <h2 className="text-2xl font-light tracking-tight text-white">Family Chores</h2>
        </div>
        
        <button 
          onClick={() => setViewAll(!viewMode)}
          className="px-4 py-2 bg-gray-800/50 rounded-full text-xs font-semibold uppercase tracking-widest text-gray-400 active:scale-95 transition-transform border border-gray-700"
        >
          {viewMode ? 'Show Today' : 'Show All'}
        </button>
      </div>

      <div className="space-y-8 pb-8">
        {SECTIONS.map(section => {
          const sectionChores = displayedChores.filter(c => c.frequency === section.id);
          if (sectionChores.length === 0) return null;

          return (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <section.icon className={section.color} size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  {section.label}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sectionChores.map(chore => (
                  <ChoreWidget
                    key={chore.id}
                    {...chore}
                    onToggle={toggleChore}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ChoreGrid);
