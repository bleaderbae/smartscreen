import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Calendar as CalendarIcon, 
  ShoppingCart, 
  StickyNote, 
  Settings, 
  User, 
  Home,
  ChevronRight,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { getWeather, type WeatherData } from './services/weatherService';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // NYC coordinates for now
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather(40.7128, -74.0060);
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

  const getWeatherIconComponent = (type: WeatherData['weatherIcon']) => {
    switch (type) {
      case 'Clear': return <Sun className="text-yellow-400" size={40} />;
      case 'Cloudy': return <Cloud className="text-gray-400" size={40} />;
      case 'PartlyCloudy': return <Cloud className="text-blue-400" size={40} />;
      case 'Rain': return <CloudRain className="text-blue-500" size={40} />;
      case 'Snow': return <CloudSnow className="text-white" size={40} />;
      case 'Thunderstorm': return <CloudLightning className="text-yellow-600" size={40} />;
      case 'Fog': return <CloudFog className="text-gray-400" size={40} />;
      default: return <Cloud className="text-blue-400" size={40} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white p-6 font-sans select-none">
      {/* Top Section: Clock & Date */}
      <div className="flex flex-col items-center mt-12 mb-12">
        <h1 className="text-8xl font-thin tracking-tighter">
          {format(currentTime, 'h:mm')}
          <span className="text-3xl ml-2 opacity-50">{format(currentTime, 'a')}</span>
        </h1>
        <p className="text-2xl font-light text-gray-400 mt-2">
          {format(currentTime, 'EEEE, MMMM do')}
        </p>
      </div>

      {/* Main Content: Widgets */}
      <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
        {/* Weather Widget */}
        <div className="bg-gray-900/50 rounded-3xl p-6 flex flex-col justify-between border border-gray-800">
          {loading ? (
             <div className="flex flex-col h-full items-center justify-center">
               <span className="animate-pulse text-gray-400">Loading Weather...</span>
             </div>
          ) : error ? (
             <div className="flex flex-col h-full items-center justify-center">
               <span className="text-red-400">Weather Unavailable</span>
             </div>
          ) : weather ? (
            <>
              <div className="flex justify-between items-start">
                {getWeatherIconComponent(weather.weatherIcon)}
                <span className="text-4xl font-light">{weather.temperature}°</span>
              </div>
              <div className="mt-4">
                <p className="text-xl font-medium truncate">{weather.shortForecast}</p>
                <p className="text-sm text-gray-400">
                  {weather.high !== undefined ? `High: ${weather.high}° ` : ''}
                  {weather.low !== undefined ? `Low: ${weather.low}°` : ''}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Calendar Widget */}
        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="text-red-400" size={24} />
            <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Next Event</span>
          </div>
          <p className="text-lg font-medium leading-tight">Dinner with Grandparents</p>
          <p className="text-sm text-gray-500 mt-1">6:30 PM - Tonight</p>
        </div>

        {/* Shopping List */}
        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-green-400" size={24} />
              <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Shopping List</span>
            </div>
            <button className="text-xs text-blue-400 font-medium">View All</button>
          </div>
          <ul className="space-y-3">
            {['Oat Milk', 'Avocados', 'Whole Grain Bread'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-gray-700" />
                <span className="text-lg font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notes Widget */}
        <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="text-yellow-400" size={24} />
            <span className="font-semibold uppercase text-xs tracking-widest text-gray-400">Family Note</span>
          </div>
          <p className="text-lg font-light italic text-gray-300">
            "Remember to water the plants before you leave! Love, Mom"
          </p>
        </div>
      </div>

      {/* Bottom Navigation / Apps */}
      <div className="mt-8 mb-4 bg-gray-900/80 backdrop-blur-md rounded-full p-4 flex justify-around items-center border border-gray-800">
        <Home className="text-blue-400" size={28} />
        <User className="text-gray-500" size={28} />
        <Settings className="text-gray-500" size={28} />
      </div>
    </div>
  );
};

export default App;