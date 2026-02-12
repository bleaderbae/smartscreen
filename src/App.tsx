import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Home,
  CheckCircle,
  Circle,
  ListChecks
} from 'lucide-react';
import { getWeather, type WeatherData } from './services/weatherService';
import { DEFAULT_COORDINATES } from './config';
import DailyFeedWidget from './components/DailyFeedWidget';
import ShoppingListWidget from './components/ShoppingListWidget';
import WeatherWidget from './components/WeatherWidget';
import CalendarWidget from './components/CalendarWidget';
import Clock from './components/Clock';

interface Chore {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Todo List State
  const [chores, setChores] = useState<Chore[]>([
    { id: '1', text: 'Morning Dog Walk', completed: false },
    { id: '2', text: 'Feed Dogs', completed: false },
    { id: '3', text: 'Pick up Toys', completed: false },
    { id: '4', text: 'Evening Dog Walk', completed: false },
    { id: '5', text: 'Water Plants', completed: false },
  ]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleChore = (id: string) => {
    setChores(chores.map(chore =>
      chore.id === id ? { ...chore, completed: !chore.completed } : chore
    ));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white p-6 font-sans select-none overflow-hidden">
      {/* Top Section: Clock & Date */}
      <Clock />

      {/* Main Content: Widgets */}
      <div className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto pb-4 scrollbar-hide">
        {/* Weather Widget */}
        <WeatherWidget weather={weather} loading={loading} error={error} />

        {/* Calendar Widget */}
        <CalendarWidget />

        {/* To Do Checklist */}
        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2">
          <div className="flex items-center gap-2 mb-4 px-2">
            <ListChecks className="text-purple-400" size={24} />
            <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Weekly Chores</span>
          </div>
          <ul className="space-y-2">
            {chores.map((chore) => (
              <li 
                key={chore.id} 
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl active:scale-[0.98] transition-all cursor-pointer border border-transparent active:border-white/10" 
                onClick={() => toggleChore(chore.id)}
              >
                {chore.completed ? (
                  <CheckCircle className="text-green-400" size={28} />
                ) : (
                  <Circle className="text-gray-600" size={28} />
                )}
                <span className={`text-xl font-light transition-all ${chore.completed ? 'line-through text-gray-500 italic' : 'text-gray-100'}`}>
                  {chore.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Shopping List */}
        <ShoppingListWidget />

        {/* Daily Feed Widget */}
        <DailyFeedWidget />
      </div>

      {/* Bottom Navigation / Apps */}
      <div className="mt-8 mb-4 bg-gray-900/80 backdrop-blur-md rounded-full p-4 flex justify-around items-center border border-gray-800">
        <Home className="text-blue-400 active:scale-90 transition-transform cursor-pointer" size={28} />
        <User className="text-gray-500 active:scale-90 transition-transform cursor-pointer" size={28} />
        <Settings className="text-gray-500 active:scale-90 transition-transform cursor-pointer" size={28} />
      </div>
    </div>
  );
};

export default App;