export const DEFAULT_COORDINATES = {
  latitude: 30.5788,
  longitude: -97.8531,
};

export interface FamilyMember {
  name: string;
  color: string;
  theme: {
    bg: string;
    text: string;
    border: string;
    pill: string;
  };
  calendarUrl: string;
}

export const FAMILY_PROFILES: Record<string, FamilyMember> = {
  'Dad': {
    name: 'Dad',
    color: 'rose',
    theme: {
      bg: 'bg-rose-950/30',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      pill: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    calendarUrl: '', // Add Dad's iCal URL here
  },
  'Mom': {
    name: 'Mom',
    color: 'pink',
    theme: {
      bg: 'bg-pink-950/30',
      text: 'text-pink-400',
      border: 'border-pink-500/30',
      pill: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    },
    calendarUrl: '', // Add Mom's iCal URL here
  },
  'Hunter': {
    name: 'Hunter',
    color: 'emerald',
    theme: {
      bg: 'bg-emerald-950/30',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    calendarUrl: '', // Add Hunter's iCal URL here (e.g. daycare/class)
  },
  'Harper': {
    name: 'Harper',
    color: 'rainbow',
    theme: {
      bg: 'bg-slate-900/60',
      text: 'text-white',
      border: 'border-purple-500/30',
      pill: 'bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-blue-500/40 text-white border-white/10'
    },
    calendarUrl: '', // Add Harper's iCal URL here (e.g. dance class)
  }
};

// For backward compatibility or helper function
export const CALENDAR_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(FAMILY_PROFILES)
    .filter(([_, member]) => member.calendarUrl)
    .map(([name, member]) => [name, member.calendarUrl])
);

