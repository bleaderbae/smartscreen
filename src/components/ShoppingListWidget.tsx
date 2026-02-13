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
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping-list');
    return saved ? JSON.parse(saved) : [
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

  const addItem = (text: string, iconName?: string, color?: string) => {
    // Avoid duplicates for quick add
    if (items.find(i => i.text.toLowerCase() === text.toLowerCase() && !i.completed)) return;
    
    setItems(prev => [{
      id: Date.now().toString(),
      text,
      completed: false,
      icon: iconName,
      color
    }, ...prev]);
  };

  const removeItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item.id !== id));
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
          className="p-2 bg-white/5 rounded-full text-blue-400 active:scale-90 transition-transform"
          aria-label="Add item"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Quick Add Menu */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">Quick Add</span>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_ADD_ITEMS.map((preset) => (
            <button
              key={preset.text}
              onClick={() => addItem(preset.text, preset.iconName, preset.color)}
              aria-label={`Quick add ${preset.text}`}
              className="flex flex-col items-center gap-2 shrink-0 group active:scale-90 transition-transform"
            >
              <div className={`p-4 rounded-2xl bg-${preset.color}-500/10 border border-${preset.color}-500/20 group-active:bg-${preset.color}-500/20`}>
                <preset.icon className={`text-${preset.color}-400`} size={32} />
              </div>
              <span className="text-xs font-medium text-gray-400">{preset.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-1">Items</span>
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
                  aria-label={`Toggle ${item.text}`}
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
      </div>

      <button className="w-full py-4 text-sm text-blue-400 font-medium bg-white/5 rounded-2xl active:scale-[0.98] transition-transform border border-white/5">
        View Full List
      </button>
    </div>
  );
};

export default ShoppingListWidget;
