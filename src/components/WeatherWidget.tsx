import React from 'react';
import { Loader, Thermometer } from 'lucide-react';
import type { WeatherData } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const getTemperatureTheme = (temp: number) => {
  if (temp < 32) return { bg: 'bg-blue-900/40', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Freezing! ❄️', outfit: 'Bundle up tight!' };
  if (temp < 50) return { bg: 'bg-cyan-900/40', border: 'border-cyan-500/50', text: 'text-cyan-400', label: 'Cold Day 🧥', outfit: 'Wear a warm coat' };
  if (temp < 70) return { bg: 'bg-green-900/40', border: 'border-green-500/50', text: 'text-green-400', label: 'Perfect! 😊', outfit: 'A light sweater is good' };
  if (temp < 85) return { bg: 'bg-orange-900/40', border: 'border-orange-500/50', text: 'text-orange-400', label: 'Warm Day ☀️', outfit: 'T-shirt weather!' };
  return { bg: 'bg-red-900/40', border: 'border-red-500/50', text: 'text-red-400', label: 'Hot! 🥵', outfit: 'Stay cool in shorts' };
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, loading, error }) => {
  const theme = weather ? getTemperatureTheme(weather.temperature) : null;

  return (
    <div 
      className={`
        rounded-3xl p-6 flex flex-col justify-between min-h-[240px] transition-all border-2
        ${loading || !weather ? 'bg-gray-900/50 border-gray-800' : `${theme?.bg} ${theme?.border}`}
      `}
    >
      {loading ? (
        <div className="flex flex-col h-full items-center justify-center">
          <Loader className="animate-spin text-gray-400" size={48} />
          <span className="mt-4 text-sm text-gray-500 font-bold uppercase tracking-widest">Checking Clouds...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col h-full items-center justify-center text-center">
          <span className="text-red-400 font-bold">Weather is Sleepy</span>
          <button 
            className="mt-4 px-6 py-2 bg-white/5 rounded-full text-xs text-blue-400 uppercase tracking-widest font-bold active:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); window.location.reload(); }}
          >
            Wake Up
          </button>
        </div>
      ) : weather && theme ? (
        <>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <div className="p-3 bg-black/20 rounded-2xl w-fit">
                <WeatherIcon type={weather.weatherIcon} size={64} />
              </div>
              <span className={`text-xs font-black uppercase tracking-[0.2em] mt-2 ${theme.text}`}>
                {theme.label}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-7xl font-thin tracking-tighter leading-none">{weather.temperature}°</span>
              <div className="flex gap-2 mt-2 text-xs font-bold opacity-60">
                {weather.high !== undefined && <span>H: {weather.high}°</span>}
                {weather.low !== undefined && <span>L: {weather.low}°</span>}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${theme.bg}`}>
                <Thermometer size={20} className={theme.text} />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {theme.outfit}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 font-medium italic">
                  {weather.shortForecast}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default React.memo(WeatherWidget);
