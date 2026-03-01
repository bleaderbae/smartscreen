import axios from 'axios';

export interface WeatherData {
  temperature: number;
  shortForecast: string;
  detailedForecast: string;
  high?: number;
  low?: number;
  icon: string;
  weatherIcon: 'Clear' | 'Cloudy' | 'Rain' | 'Snow' | 'Thunderstorm' | 'PartlyCloudy' | 'Fog' | 'Unknown';
}

interface Period {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | null;
  };
  dewpoint: {
    unitCode: string;
    value: number;
  };
  relativeHumidity: {
    unitCode: string;
    value: number;
  };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

interface GridPointResponse {
  properties: {
    forecast: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: Period[];
  };
}

export function getWeatherIconFromUrl(iconUrl: string): WeatherData['weatherIcon'] {
  if (iconUrl.includes('skc') || iconUrl.includes('few')) return 'Clear';
  if (iconUrl.includes('sct') || iconUrl.includes('bkn')) return 'PartlyCloudy'; // sct=scattered, bkn=broken
  if (iconUrl.includes('ovc')) return 'Cloudy';
  if (iconUrl.includes('rain') || iconUrl.includes('shra')) return 'Rain';
  if (iconUrl.includes('snow')) return 'Snow';
  if (iconUrl.includes('tsra')) return 'Thunderstorm';
  if (iconUrl.includes('fog')) return 'Fog';
  return 'Unknown';
}

// Cache for grid points and forecasts to avoid redundant API calls
export const pointsCache = new Map<string, string>();
export const forecastCache = new Map<string, { data: ForecastResponse; timestamp: number }>();
const MAX_CACHE_SIZE = 100;
const FORECAST_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const AXIOS_CONFIG = {
  timeout: 10000, // 10 seconds
  maxContentLength: 5 * 1024 * 1024, // 5MB
  headers: {
    'User-Agent': '(myweatherapp.com, contact@myweatherapp.com)'
  }
};

export async function getWeather(lat: number, long: number): Promise<WeatherData> {
  // Input validation: ensure coordinates are numbers and within valid ranges
  if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude: must be a number between -90 and 90');
  }
  if (typeof long !== 'number' || !Number.isFinite(long) || long < -180 || long > 180) {
    throw new Error('Invalid longitude: must be a number between -180 and 180');
  }

  try {
    const cacheKey = `${lat},${long}`;
    let forecastUrl = pointsCache.get(cacheKey);

    if (!forecastUrl) {
      // 1. Get grid point
      try {
        const pointsResponse = await axios.get<GridPointResponse>(
          `https://api.weather.gov/points/${lat},${long}`,
          AXIOS_CONFIG
        );
        const pointsData = pointsResponse.data;
        forecastUrl = pointsData.properties.forecast;

        if (pointsCache.size >= MAX_CACHE_SIZE) {
          pointsCache.clear();
        }
        pointsCache.set(cacheKey, forecastUrl);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(`Failed to fetch points: ${error.response.statusText}`);
        }
        throw error;
      }
    }

    // 2. Get forecast
    const url = new URL(forecastUrl);
    if (url.protocol !== 'https:' || (url.hostname !== 'weather.gov' && !url.hostname.endsWith('.weather.gov'))) {
      throw new Error('Invalid forecast URL');
    }

    let forecastData: ForecastResponse;
    const now = Date.now();
    const cachedForecast = forecastCache.get(forecastUrl);

    if (cachedForecast && (now - cachedForecast.timestamp) < FORECAST_CACHE_TTL) {
      forecastData = cachedForecast.data;
    } else {
      try {
        const forecastResponse = await axios.get<ForecastResponse>(
          forecastUrl,
          AXIOS_CONFIG
        );
        forecastData = forecastResponse.data;

        if (forecastCache.size >= MAX_CACHE_SIZE) {
          forecastCache.clear();
        }
        forecastCache.set(forecastUrl, { data: forecastData, timestamp: now });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            pointsCache.delete(cacheKey);
          }
          if (error.response) {
            throw new Error(`Failed to fetch forecast: ${error.response.statusText}`);
          }
        }
        throw error;
      }
    }

    const periods = forecastData.properties.periods;

    if (!periods || periods.length === 0) {
      throw new Error('No forecast data available');
    }

    const currentPeriod = periods[0];
    const nextPeriod = periods[1];

    let high: number | undefined;
    let low: number | undefined;

    // Determine high/low based on current period
    if (currentPeriod.isDaytime) {
      high = currentPeriod.temperature;
      low = nextPeriod?.temperature;
    } else {
      low = currentPeriod.temperature;
      high = nextPeriod?.temperature; // This is actually tomorrow's high, or we can look for previous day's high if we had it.
      // For tonight, displaying "Low: XX" is accurate.
    }

    return {
      temperature: currentPeriod.temperature,
      shortForecast: currentPeriod.shortForecast,
      detailedForecast: currentPeriod.detailedForecast,
      high,
      low,
      icon: currentPeriod.icon,
      weatherIcon: getWeatherIconFromUrl(currentPeriod.icon),
    };

  } catch (error) {
    console.error('Error fetching weather data');
    throw error;
  }
}
