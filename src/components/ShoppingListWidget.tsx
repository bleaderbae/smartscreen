import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Milk, 
  Egg, 
  Carrot, 
  Apple, 
  Coffee, 
  Beef, 
  Zap,
  Trash2,
  type LucideIcon
} from 'lucide-react';
import { safeJSONParse } from '../utils/security';

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  icon?: string; // Store icon name as string for persistence
  color?: string;
}

const QUICK_ADD_ITEMS: { text: string; icon: LucideIcon; color: string; iconName: string }[] = [
  { text: 'Milk', icon: Milk, color: 'blue', iconName: 'Milk' },
  { text: 'Eggs', icon: Egg, color: 'yellow', iconName: 'Egg' },
  { text: 'Apples', icon: Apple, color: 'red', iconName: 'Apple' },
  { text: 'Carrots', icon: Carrot, color: 'orange', iconName: 'Carrot' },
  { text: 'Coffee', icon: Coffee, color: 'indigo', iconName: 'Coffee' },
  { text: 'Steak', icon: Beef, color: 'red', iconName: 'Beef' },
  { text: 'Snacks', icon: Zap, color: 'yellow', iconName: 'Zap' },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Milk, Egg, Apple, Carrot, Coffee, Beef, Zap
};

const ShoppingListWidget: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping-list');
    const parsed = safeJSONParse<unknown>(saved, null);

    if (Array.isArray(parsed)) {
      return parsed as ShoppingItem[];
    }

    return [
      { id: '1', text: 'Milk', completed: false, icon: 'Milk', color: 'blue' },
      { id: '2', text: 'Avocados', completed: false },
      { id: '3', text: 'Whole Grain Bread', completed: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addItem = (text: string, iconName?: string, color?: string): boolean => {
    // Avoid duplicates for quick add
    if (items.find(i => i.text.toLowerCase() === text.toLowerCase() && !i.completed)) {
      setDuplicateError(`'${text}' is already on the list!`);
      return false;
    }
    
    setItems(prev => [{
      id: Date.now().toString(),
      text,
      completed: false,
      icon: iconName,
      color
    }, ...prev]);

    setDuplicateError(null);
    return true;
  };

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(i => !i.completed));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-xl">
            <ShoppingCart className="text-green-400" size={24} />
          </div>
          <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Shopping List</span>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            setDuplicateError(null);
            setNewItemText('');
          }}
          className={`p-2 rounded-full text-blue-400 active:scale-90 transition-all ${isAdding ? 'bg-blue-500/20 rotate-45' : 'bg-white/5'}`}
          aria-label={isAdding ? "Cancel adding item" : "Add item"}
          aria-expanded={isAdding}
        >
          <Plus size={24} />
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newItemText.trim()) {
              const success = addItem(newItemText.trim());
              if (success) {
                setNewItemText('');
                setIsAdding(false);
              }
            }
          }}
          className="animate-fadeIn"
        >
          <div className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newItemText}
              onChange={(e) => {
                setNewItemText(e.target.value);
                if (duplicateError) setDuplicateError(null);
              }}
              placeholder="What do you need?"
              className={`flex-1 bg-white/10 rounded-xl px-4 py-3 text-lg text-white placeholder:text-gray-500 outline-none focus:ring-2 ${duplicateError ? 'focus:ring-red-400 border-red-400/50' : 'focus:ring-blue-400 border-white/5'} border`}
              aria-label="New item name"
              aria-invalid={!!duplicateError}
              aria-errormessage={duplicateError ? "duplicate-error" : undefined}
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="px-4 bg-blue-500/20 text-blue-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500/30 transition-colors"
              aria-label="Confirm add item"
            >
              <Plus size={24} />
            </button>
          </div>
          {duplicateError && (
            <p id="duplicate-error" className="text-red-400 text-xs mt-2 px-1 font-medium animate-pulse" role="alert">
              {duplicateError}
            </p>
          )}
        </form>
      )}

      {/* Quick Add Menu */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">Quick Add</span>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_ADD_ITEMS.map((preset) => {
            const isActive = items.some(i => i.text.toLowerCase() === preset.text.toLowerCase() && !i.completed);

            return (
              <button
                key={preset.text}
                onClick={() => addItem(preset.text, preset.iconName, preset.color)}
                disabled={isActive}
                aria-label={isActive ? `${preset.text} (Added)` : `Quick add ${preset.text}`}
                className={`flex flex-col items-center gap-2 shrink-0 group active:scale-90 transition-transform ${isActive ? 'opacity-50 cursor-default' : ''}`}
              >
                <div className={`relative p-4 rounded-2xl bg-${preset.color}-500/10 border border-${preset.color}-500/20 group-active:bg-${preset.color}-500/20`}>
                  <preset.icon className={`text-${preset.color}-400`} size={32} />
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                      <CheckCircle2 className="text-green-400" size={24} />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-400">{preset.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">Items</span>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fadeIn">
            <ShoppingCart size={48} className="mb-4 text-gray-500" />
            <p className="text-lg font-light">Your list is empty</p>
            <p className="text-xs uppercase tracking-widest mt-2">Add items above</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon ? ICON_MAP[item.icon] : null;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl active:scale-[0.98] transition-all border border-transparent active:border-white/10 group"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
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
                    onClick={(e) => removeItem(e, item.id)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg ml-2"
                    aria-label={`Remove ${item.text}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {items.some(i => i.completed) && (
        <button
          onClick={clearCompleted}
          className="w-full py-4 text-sm text-red-400 font-medium bg-white/5 rounded-2xl active:scale-[0.98] transition-transform border border-white/5 hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default React.memo(ShoppingListWidget);
