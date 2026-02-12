import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog, Loader } from 'lucide-react';
import type { WeatherData } from '../services/weatherService';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, loading, error }) => {
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
    <div 
      role="button"
      tabIndex={0}
      className="bg-gray-900/50 rounded-3xl p-6 flex flex-col justify-between border border-gray-800 min-h-[200px] active:scale-[0.98] transition-transform cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      {loading ? (
        <div className="flex flex-col h-full items-center justify-center">
          <Loader className="animate-spin text-gray-400" size={32} />
          <span className="mt-2 text-sm text-gray-500 font-medium">Updating...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col h-full items-center justify-center">
          <span className="text-red-400 font-medium">Weather Unavailable</span>
          <button 
            className="mt-2 text-xs text-blue-400 underline active:opacity-70"
            onClick={(e) => { e.stopPropagation(); window.location.reload(); }}
          >
            Try Again
          </button>
        </div>
      ) : weather ? (
        <>
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/5 rounded-2xl">
              {getWeatherIconComponent(weather.weatherIcon)}
            </div>
            <span className="text-5xl font-thin tracking-tighter">{weather.temperature}°</span>
          </div>
          <div>
            <p className="text-xl font-medium truncate">{weather.shortForecast}</p>
            <p className="text-sm text-gray-400 font-light">
              {weather.high !== undefined ? `High: ${weather.high}° ` : ''}
              {weather.low !== undefined ? `Low: ${weather.low}°` : ''}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
