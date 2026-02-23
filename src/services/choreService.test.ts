import { describe, it, expect } from 'vitest';
import { getChoresForDate, type Chore } from './choreService';
import { parseISO } from 'date-fns';

// Mock icon as any since logic doesn't depend on it
const MockIcon: any = () => null;

const MOCK_CHORES: Chore[] = [
  { id: 'daily', text: 'Daily Task', icon: MockIcon, color: 'blue', frequency: 'daily', completed: false },
  { id: 'weekly-mon', text: 'Weekly Monday', icon: MockIcon, color: 'green', frequency: 'weekly', completed: false, dayOfWeek: 1 },
  { id: 'biweekly-mon', text: 'Biweekly Monday', icon: MockIcon, color: 'red', frequency: 'weekly', completed: false, dayOfWeek: 1, isBiweekly: true },
];

describe('choreService', () => {
  it('returns daily chores for any date', () => {
    const date = parseISO('2026-02-10'); // Tuesday
    const result = getChoresForDate(MOCK_CHORES, date);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'daily' })]));
  });

  it('returns weekly chores on the correct day', () => {
    const monday = parseISO('2026-02-09'); // Monday
    const result = getChoresForDate(MOCK_CHORES, monday);
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'weekly-mon' })]));

    const tuesday = parseISO('2026-02-10'); // Tuesday
    const resultTuesday = getChoresForDate(MOCK_CHORES, tuesday);
    expect(resultTuesday).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'weekly-mon' })]));
  });

  it('returns biweekly chores on the correct week and day', () => {
    // 2026-02-09 is the reference date (Recycling week)
    const recyclingWeekMonday = parseISO('2026-02-09');
    const result = getChoresForDate(MOCK_CHORES, recyclingWeekMonday);

    // Should include biweekly chore
    expect(result).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'biweekly-mon' })]));

    // 2026-02-16 is the next week (NOT recycling week)
    const nonRecyclingWeekMonday = parseISO('2026-02-16');
    const resultNextWeek = getChoresForDate(MOCK_CHORES, nonRecyclingWeekMonday);

    // Should NOT include biweekly chore
    expect(resultNextWeek).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: 'biweekly-mon' })]));

    // Should still include regular weekly chore
    expect(resultNextWeek).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'weekly-mon' })]));
  });
});
