import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Clock from './Clock';

vi.mock('lucide-react', () => ({
  Sunrise: () => <div data-testid="icon-sunrise" />,
  Sun: () => <div data-testid="icon-sun" />,
  Sunset: () => <div data-testid="icon-sunset" />,
  Moon: () => <div data-testid="icon-moon" />,
  Calendar: () => <div data-testid="icon-calendar" />
}));

describe('Clock Component - Sky Track Arc Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  const renderAtTime = (hours: number, minutes: number = 0) => {
    const date = new Date(2026, 1, 21, hours, minutes);
    vi.setSystemTime(date);
    return render(<Clock />);
  };

  it('positions sun at 50% horizontally and max height at midday', () => {
    const { container } = renderAtTime(12, 0);
    const body = container.querySelector('.celestial-body') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.style.getPropertyValue('--day-progress')).toBe('50%');

    // Midday is 12:00. Sun is up 6:00 to 20:00. 12:00 is (12-6)/(20-6) = 6/14 progress of daylight.
    // sunProgress = (12*60 - 360) / (1200 - 360) = 360 / 840 = 0.428...
    // Math.sin(0.428 * Math.PI) is approx 0.97.
    // style bottom should be high.
    const height = body.style.getPropertyValue('--sun-height');
    expect(parseFloat(height)).toBeGreaterThan(3); // 3rem+
  });

  it('positions body at 0% horizontally at midnight', () => {
    const { container } = renderAtTime(0, 0);
    const body = container.querySelector('.celestial-body') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.style.getPropertyValue('--day-progress')).toBe('0%');
    expect(body.style.getPropertyValue('--sun-height')).toBe('0.5rem'); // Horizon level
  });

  it('positions body at ~25% horizontally at 6 AM', () => {
    const { container } = renderAtTime(6, 0);
    const body = container.querySelector('.celestial-body') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.style.getPropertyValue('--day-progress')).toBe('25%');
    // At 6:00 exactly, sunHeight is sin(0) = 0, so bottom is 0.5rem
    expect(body.style.getPropertyValue('--sun-height')).toBe('0.5rem');
  });

  it('positions body at ~83.3% horizontally at 8 PM', () => {
    const { container } = renderAtTime(20, 0);
    const body = container.querySelector('.celestial-body') as HTMLElement;
    expect(body).toBeTruthy();
    // (20*60 / 1440) = 0.8333...
    expect(body.style.getPropertyValue('--day-progress')).toContain('83.3');
    // At 20:00 exactly, sunHeight is sin(PI) = 0, so bottom is approx 0.5rem
    expect(body.style.getPropertyValue('--sun-height')).toContain('0.5');
  });
});
