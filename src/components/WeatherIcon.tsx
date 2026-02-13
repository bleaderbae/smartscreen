import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import type { WeatherData } from '../services/weatherService';

interface WeatherIconProps {
  type: WeatherData['weatherIcon'];
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ type, size = 48, className = '' }) => {
  switch (type) {
    case 'Clear': return <Sun className={`text-yellow-400 ${className}`} size={size} />;
    case 'Cloudy': return <Cloud className={`text-gray-400 ${className}`} size={size} />;
    case 'PartlyCloudy': return <Cloud className={`text-blue-400 ${className}`} size={size} />;
    case 'Rain': return <CloudRain className={`text-blue-500 ${className}`} size={size} />;
    case 'Snow': return <CloudSnow className={`text-white ${className}`} size={size} />;
    case 'Thunderstorm': return <CloudLightning className={`text-yellow-600 ${className}`} size={size} />;
    case 'Fog': return <CloudFog className={`text-gray-400 ${className}`} size={size} />;
    default: return <Cloud className={`text-blue-400 ${className}`} size={size} />;
  }
};

export default WeatherIcon;
