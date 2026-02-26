import { describe, it, expect } from 'vitest';
import { deriveCalendarUrls, type FamilyMember } from './config';

describe('deriveCalendarUrls', () => {
  const mockTheme = {
    bg: 'bg-test',
    text: 'text-test',
    border: 'border-test',
    pill: 'pill-test'
  };

  it('should return an empty object when profiles is empty', () => {
    expect(deriveCalendarUrls({})).toEqual({});
  });

  it('should filter out members without a calendarUrl', () => {
    const profiles: Record<string, FamilyMember> = {
      'Dad': { name: 'Dad', color: 'rose', theme: mockTheme, calendarUrl: '' },
      'Mom': { name: 'Mom', color: 'pink', theme: mockTheme, calendarUrl: '' }
    };
    expect(deriveCalendarUrls(profiles)).toEqual({});
  });

  it('should include members with a calendarUrl', () => {
    const profiles: Record<string, FamilyMember> = {
      'Dad': { name: 'Dad', color: 'rose', theme: mockTheme, calendarUrl: 'https://example.com/dad.ics' },
      'Mom': { name: 'Mom', color: 'pink', theme: mockTheme, calendarUrl: '' }
    };
    expect(deriveCalendarUrls(profiles)).toEqual({
      'Dad': 'https://example.com/dad.ics'
    });
  });

  it('should include all members when all have a calendarUrl', () => {
    const profiles: Record<string, FamilyMember> = {
      'Dad': { name: 'Dad', color: 'rose', theme: mockTheme, calendarUrl: 'https://example.com/dad.ics' },
      'Mom': { name: 'Mom', color: 'pink', theme: mockTheme, calendarUrl: 'https://example.com/mom.ics' }
    };
    expect(deriveCalendarUrls(profiles)).toEqual({
      'Dad': 'https://example.com/dad.ics',
      'Mom': 'https://example.com/mom.ics'
    });
  });
});
