import React from 'react';
import { CheckCircle2, Circle, Trash2, type LucideIcon } from 'lucide-react';

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  icon?: string;
  color?: string;
}

interface ShoppingListItemProps {
  item: ShoppingItem;
  Icon: LucideIcon | null;
  onToggle: (id: string) => void;
  onRemove: (e: React.MouseEvent, id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, Icon, onToggle, onRemove, onKeyDown }) => {
  return (
    <li
      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl active:scale-[0.98] transition-all border border-transparent active:border-white/10 group"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(item.id)}
        onKeyDown={(e) => onKeyDown(e, item.id)}
        aria-label={item.text}
        aria-pressed={item.completed}
        className="flex-1 flex items-center gap-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
      >
        <div className="relative">
          {item.completed ? (
            <CheckCircle2 className="text-green-400 shrink-0" size={28} />
          ) : (
            <Circle className="text-gray-600 shrink-0" size={28} />
          )}
        </div>
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className={`text-${item.color}-400/60`} />}
          <span className={`text-xl font-light transition-all ${
            item.completed ? 'line-through text-gray-500 italic' : 'text-gray-100'
          }`}>
            {item.text}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => onRemove(e, item.id)}
        className="p-2 text-gray-600 hover:text-red-400 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg ml-2"
        aria-label={`Remove ${item.text}`}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
};

export default React.memo(ShoppingListItem);
