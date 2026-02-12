import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Home
} from 'lucide-react';
import { getWeather, type WeatherData } from './services/weatherService';
import { DEFAULT_COORDINATES } from './config';
import DailyFeedWidget from './components/DailyFeedWidget';
import ShoppingListWidget from './components/ShoppingListWidget';
import WeatherWidget from './components/WeatherWidget';
import CalendarWidget from './components/CalendarWidget';
import ChoreGrid from './components/ChoreGrid';
import Clock from './components/Clock';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        {/* Family Chores Grid */}
        <ChoreGrid />

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