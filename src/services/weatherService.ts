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

// Cache for grid points to avoid redundant API calls
const pointsCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

export async function getWeather(lat: number, long: number): Promise<WeatherData> {
  const userAgent = '(myweatherapp.com, contact@myweatherapp.com)';

  try {
    const cacheKey = `${lat},${long}`;
    let forecastUrl = pointsCache.get(cacheKey);

    if (!forecastUrl) {
      // 1. Get grid point
      const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${long}`, {
        headers: { 'User-Agent': userAgent }
      });

      if (!pointsResponse.ok) {
        throw new Error(`Failed to fetch points: ${pointsResponse.statusText}`);
      }

      const pointsData = (await pointsResponse.json()) as GridPointResponse;
      forecastUrl = pointsData.properties.forecast;

      if (pointsCache.size >= MAX_CACHE_SIZE) {
        pointsCache.clear();
      }
      pointsCache.set(cacheKey, forecastUrl);
    }

    // 2. Get forecast
    const forecastResponse = await fetch(forecastUrl, {
      headers: { 'User-Agent': userAgent }
    });

    if (!forecastResponse.ok) {
      if (forecastResponse.status === 404) {
        pointsCache.delete(cacheKey);
      }
      throw new Error(`Failed to fetch forecast: ${forecastResponse.statusText}`);
    }

    const forecastData = (await forecastResponse.json()) as ForecastResponse;
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
