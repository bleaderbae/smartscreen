import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  type LucideIcon,
  User
} from 'lucide-react';
import { FAMILY_PROFILES } from '../config';

interface ChoreWidgetProps {
  id: string;
  text: string;
  icon: LucideIcon;
  color: string;
  completed: boolean;
  onToggle: (id: string) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
  assignedTo?: string;
}

const ChoreWidget: React.FC<ChoreWidgetProps> = ({ 
  id, 
  text, 
  icon: Icon, 
  color, 
  completed, 
  onToggle,
  frequency,
  assignedTo
}) => {
  const profile = assignedTo ? FAMILY_PROFILES[assignedTo] : null;
  const theme = profile?.theme || {
    bg: `bg-${color}-950/30`,
    text: `text-${color}-400`,
    border: `border-${color}-500/30`,
    pill: `bg-${color}-500/20 text-${color}-300 border-${color}-500/30`
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onToggle(id)}
      className={`
        relative overflow-hidden rounded-3xl p-4 flex flex-col items-center justify-center gap-3
        transition-all duration-300 active:scale-90 cursor-pointer border-2
        ${completed 
          ? 'bg-green-500/20 border-green-500/50' 
          : `${theme.bg} ${theme.border} hover:border-white/20`
        }
      `}
    >
      <div className={`
        p-4 rounded-2xl transition-colors duration-300
        ${completed ? 'bg-green-500/20' : 'bg-black/20'}
      `}>
        <Icon 
          size={48} 
          className={completed ? 'text-green-400' : theme.text} 
        />
      </div>
      
      <div className="text-center">
        <p className={`
          text-lg font-medium leading-tight px-2
          ${completed ? 'text-green-200/70 line-through italic' : 'text-white'}
        `}>
          {text}
        </p>
        
        <div className="flex flex-col items-center gap-1 mt-2">
          {!completed && (
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              {frequency}
            </span>
          )}
          {assignedTo && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${theme.pill}`}>
              <User size={8} />
              {assignedTo}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-3 right-3">
        {completed ? (
          <CheckCircle2 className="text-green-400" size={20} />
        ) : (
          <Circle className="text-white/10" size={20} />
        )}
      </div>
    </div>
  );
};

export default ChoreWidget;
