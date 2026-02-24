import React, { useState, useEffect } from 'react';
import { Loader, Thermometer, ChevronRight, X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const theme = weather ? getTemperatureTheme(weather.temperature) : null;

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const widgetLabel = weather
    ? `Current weather: ${weather.temperature} degrees, ${weather.shortForecast}. Tap for full forecast.`
    : "Weather Widget";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !loading && !error && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        aria-label={widgetLabel}
        className={`
          rounded-3xl p-6 flex flex-col justify-between min-h-[240px] active:scale-[0.98] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400 border-2
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
            <div>
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
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <span className="text-xs text-gray-500 font-medium">Tap for full forecast</span>
              <ChevronRight className="text-gray-600" size={16} />
            </div>
          </>
        ) : null}
      </div>

      {/* Expanded Modal */}
      {isOpen && weather && theme && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="weather-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`
              w-full max-w-lg relative p-8 rounded-3xl border-2 shadow-2xl overflow-y-auto max-h-[90vh]
              ${theme.bg} ${theme.border}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40 focus-visible:ring-2 focus-visible:ring-white outline-none"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <WeatherIcon type={weather.weatherIcon} size={120} />

              <h2 id="weather-modal-title" className="text-6xl font-thin mt-6 mb-2">
                {weather.temperature}°
              </h2>

              <div className={`text-xl font-bold uppercase tracking-widest mb-8 ${theme.text}`}>
                {theme.label}
              </div>

              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 w-full">
                <p className="text-lg text-white leading-relaxed font-light">
                  {weather.detailedForecast}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                {weather.high !== undefined && (
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">High</span>
                    <p className="text-2xl font-light mt-1">{weather.high}°</p>
                  </div>
                )}
                {weather.low !== undefined && (
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Low</span>
                    <p className="text-2xl font-light mt-1">{weather.low}°</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(WeatherWidget);
