import { 
  differenceInCalendarWeeks,
  parseISO,
  startOfDay
} from 'date-fns';
import { 
  PawPrint, 
  Blocks, 
  Sprout, 
  Shirt, 
  Container, 
  Utensils, 
  Music, 
  Mic, 
  Fuel, 
  Trash2, 
  Recycle, 
  Wind, 
  SprayCan, 
  Brush, 
  Zap,
  type LucideIcon
} from 'lucide-react';

export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Chore {
  id: string;
  text: string;
  icon: LucideIcon;
  color: string;
  frequency: Frequency;
  completed: boolean;
  assignedTo?: string; // Maps to FAMILY_PROFILES keys
  // logic properties
  dayOfWeek?: number; // 0-6
  isBiweekly?: boolean;
}

const RECYCLING_REFERENCE_DATE = '2026-02-09'; // A Monday with recycling
// Optimize: Pre-parse the reference date once at module level
const RECYCLING_START_DATE = startOfDay(parseISO(RECYCLING_REFERENCE_DATE));

export const INITIAL_CHORES: Chore[] = [
  // DAILY
  { id: 'd1', text: 'Feed Dogs', icon: PawPrint, color: 'emerald', frequency: 'daily', completed: false, assignedTo: 'Hunter' },
  { id: 'd2', text: 'Clean up Toys', icon: Blocks, color: 'emerald', frequency: 'daily', completed: false, assignedTo: 'Hunter' },
  { id: 'd3', text: 'Water Flowers', icon: Sprout, color: 'rainbow', frequency: 'daily', completed: false, assignedTo: 'Harper' },
  
  // WEEKLY
  { id: 'w1', text: 'Laundry Day', icon: Shirt, color: 'pink', frequency: 'weekly', completed: false, assignedTo: 'Mom' },
  { id: 'w2', text: 'Fold Clothes', icon: Container, color: 'pink', frequency: 'weekly', completed: false, assignedTo: 'Mom' },
  { id: 'w3', text: 'Dishwasher', icon: Utensils, color: 'rose', frequency: 'weekly', completed: false, assignedTo: 'Dad' },
  { id: 'w4', text: 'Dance Class', icon: Music, color: 'rainbow', frequency: 'weekly', completed: false, assignedTo: 'Harper' },
  { id: 'w5', text: 'Show & Tell', icon: Mic, color: 'rainbow', frequency: 'weekly', completed: false, assignedTo: 'Harper', dayOfWeek: 1 },
  { id: 'w6', text: 'Gas the Car', icon: Fuel, color: 'rose', frequency: 'weekly', completed: false, assignedTo: 'Dad' },
  { id: 'w7', text: 'Take out Trash', icon: Trash2, color: 'rose', frequency: 'weekly', completed: false, assignedTo: 'Dad', dayOfWeek: 0 },
  { id: 'w8', text: 'Recycling', icon: Recycle, color: 'rose', frequency: 'weekly', completed: false, assignedTo: 'Dad', dayOfWeek: 1, isBiweekly: true },

  // MONTHLY
  { id: 'm1', text: 'Vacuum House', icon: Wind, color: 'pink', frequency: 'monthly', completed: false, assignedTo: 'Mom' },
  { id: 'm2', text: 'Wet Mop', icon: SprayCan, color: 'pink', frequency: 'monthly', completed: false, assignedTo: 'Mom' },
  { id: 'm3', text: 'Baseboards', icon: Brush, color: 'rose', frequency: 'monthly', completed: false, assignedTo: 'Dad' },
  { id: 'm4', text: 'Wipe Kitchen', icon: Zap, color: 'pink', frequency: 'monthly', completed: false, assignedTo: 'Mom' },
];

export const getChoresForDate = (chores: Chore[], date: Date): Chore[] => {
  // Optimize: Calculate date-derived values once outside the loop
  const dayOfWeek = date.getDay();
  const startOfCurrentDate = startOfDay(date);

  // Calculate this once for all biweekly chores
  const weeksSinceReference = differenceInCalendarWeeks(
    startOfCurrentDate,
    RECYCLING_START_DATE
  );

  return chores.filter(chore => {
    if (chore.frequency === 'daily') return true;
    if (chore.frequency === 'monthly') return true; // For now, show monthly tasks all month

    // Weekly logic
    if (chore.frequency === 'weekly') {
      // If a specific day is required
      if (chore.dayOfWeek !== undefined) {
        const isCorrectDay = dayOfWeek === chore.dayOfWeek;
        
        if (chore.isBiweekly) {
          return isCorrectDay && (weeksSinceReference % 2 === 0);
        }
        
        return isCorrectDay;
      }
      return true; // General weekly task
    }
    
    return false;
  });
};
