import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  type LucideIcon
} from 'lucide-react';

interface ChoreWidgetProps {
  id: string;
  text: string;
  icon: LucideIcon;
  color: string;
  completed: boolean;
  onToggle: (id: string) => void;
  frequency: 'daily' | 'weekly' | 'monthly';
}

const ChoreWidget: React.FC<ChoreWidgetProps> = ({ 
  id, 
  text, 
  icon: Icon, 
  color, 
  completed, 
  onToggle,
  frequency
}) => {
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
          : 'bg-gray-900/40 border-gray-800 hover:border-gray-700'
        }
      `}
    >
      <div className={`
        p-4 rounded-2xl transition-colors duration-300
        ${completed ? 'bg-green-500/20' : `bg-${color}-500/10`}
      `}>
        <Icon 
          size={48} 
          className={completed ? 'text-green-400' : `text-${color}-400`} 
        />
      </div>
      
      <div className="text-center">
        <p className={`
          text-lg font-medium leading-tight px-2
          ${completed ? 'text-green-200/70 line-through italic' : 'text-white'}
        `}>
          {text}
        </p>
        {!completed && (
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1 block">
            {frequency}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3">
        {completed ? (
          <CheckCircle2 className="text-green-400" size={20} />
        ) : (
          <Circle className="text-gray-700" size={20} />
        )}
      </div>
    </div>
  );
};

export default ChoreWidget;
