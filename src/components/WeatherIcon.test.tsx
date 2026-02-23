import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import WeatherIcon from './WeatherIcon';
import type { WeatherData } from '../services/weatherService';

describe('WeatherIcon', () => {
  const weatherTypes: WeatherData['weatherIcon'][] = [
    'Clear',
    'Cloudy',
    'PartlyCloudy',
    'Rain',
    'Snow',
    'Thunderstorm',
    'Fog',
    'Unknown',
  ];

  weatherTypes.forEach((type) => {
    it(`renders correctly for type: ${type}`, () => {
      const { container } = render(<WeatherIcon type={type} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('renders correctly with custom size and className', () => {
    const { container } = render(
      <WeatherIcon type="Clear" size={64} className="custom-class" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
