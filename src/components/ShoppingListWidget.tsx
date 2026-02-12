import React, { useState } from 'react';
import { ShoppingCart, Plus, CheckCircle2, Circle } from 'lucide-react';

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
}

const ShoppingListWidget: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: '1', text: 'Oat Milk', completed: false },
    { id: '2', text: 'Avocados', completed: false },
    { id: '3', text: 'Whole Grain Bread', completed: false },
  ]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2 flex flex-col gap-4">
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

      <ul className="space-y-2">
        {items.map((item) => (
          <li 
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => toggleItem(item.id)}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-[0.98] transition-all cursor-pointer border border-transparent active:border-white/10"
          >
            {item.completed ? (
              <CheckCircle2 className="text-green-400 shrink-0" size={28} />
            ) : (
              <Circle className="text-gray-600 shrink-0" size={28} />
            )}
            <span className={`text-xl font-light transition-all ${
              item.completed ? 'line-through text-gray-500 italic' : 'text-gray-100'
            }`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      <button className="w-full py-3 mt-2 text-sm text-blue-400 font-medium bg-white/5 rounded-2xl active:scale-[0.98] transition-transform">
        View Full List
      </button>
    </div>
  );
};

export default ShoppingListWidget;
