import React, { useState, useMemo } from 'react';
import { ListChecks, CalendarDays, LayoutGrid } from 'lucide-react';
import ChoreWidget from './ChoreWidget';
import { INITIAL_CHORES, getChoresForDate, type Chore } from '../services/choreService';

const ChoreGrid: React.FC = () => {
  const [chores, setChores] = useState<Chore[]>(INITIAL_CHORES);
  const [viewMode, setViewAll] = useState(false); // false = Due Today, true = Show All

  const today = useMemo(() => new Date(), []);

  const displayedChores = useMemo(() => {
    if (viewMode) return chores;
    return getChoresForDate(chores, today);
  }, [chores, today, viewMode]);

  const toggleChore = (id: string) => {
    setChores(prev => prev.map(c => 
      c.id === id ? { ...c, completed: !c.completed } : c
    ));
  };

  const sections = [
    { id: 'daily', label: 'Daily', icon: LayoutGrid, color: 'text-orange-400' },
    { id: 'weekly', label: 'Weekly', icon: CalendarDays, color: 'text-blue-400' },
    { id: 'monthly', label: 'Monthly', icon: ListChecks, color: 'text-purple-400' },
  ];

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
        {sections.map(section => {
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

export default ChoreGrid;
