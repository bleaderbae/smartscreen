import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  User, 
  Home
} from 'lucide-react';
import { getWeather, type WeatherData } from './services/weatherService';
import { fetchCalendarEvents, type CalendarEvent } from './services/calendarService';
import { DEFAULT_COORDINATES, CALENDAR_URLS } from './config';
import DailyFeedWidget from './components/DailyFeedWidget';
import ShoppingListWidget from './components/ShoppingListWidget';
import WeatherWidget from './components/WeatherWidget';
import CalendarWidget from './components/CalendarWidget';
import ChoreGrid from './components/ChoreGrid';
import Clock from './components/Clock';

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      setWeatherLoading(true);
      const data = await getWeather(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
      setWeather(data);
      setWeatherError(null);
    } catch (err) {
      setWeatherError('Failed to load weather');
      console.error(err);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const fetchCalendarData = useCallback(async () => {
    if (Object.keys(CALENDAR_URLS).length === 0) return;
    
    setCalendarLoading(true);
    try {
      const data = await fetchCalendarEvents(CALENDAR_URLS);
      setCalendarEvents(data);
    } catch (error) {
      console.error("Failed to load calendar", error);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData();
    fetchCalendarData();

    const weatherInterval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    const calendarInterval = setInterval(fetchCalendarData, 60 * 60 * 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(calendarInterval);
    };
  }, [fetchWeatherData, fetchCalendarData]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white p-6 font-sans select-none overflow-x-hidden">
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {/* Top Section: Clock & Date */}
        <Clock nextEvent={calendarEvents[0]} />

        {/* Main Content: Widgets */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {/* Weather Widget */}
          <WeatherWidget weather={weather} loading={weatherLoading} error={weatherError} />

          {/* Calendar Widget */}
          <CalendarWidget events={calendarEvents} loading={calendarLoading} />

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
    </div>
  );
};

export default App;