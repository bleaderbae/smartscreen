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
  // logic properties
  dayOfWeek?: number; // 0-6
  isBiweekly?: boolean;
}

const RECYCLING_REFERENCE_DATE = '2026-02-09'; // A Monday with recycling

export const INITIAL_CHORES: Chore[] = [
  // DAILY
  { id: 'd1', text: 'Feed Dogs', icon: PawPrint, color: 'orange', frequency: 'daily', completed: false },
  { id: 'd2', text: 'Clean up Toys', icon: Blocks, color: 'yellow', frequency: 'daily', completed: false },
  { id: 'd3', text: 'Water Flowers', icon: Sprout, color: 'pink', frequency: 'daily', completed: false },
  
  // WEEKLY
  { id: 'w1', text: 'Laundry Day', icon: Shirt, color: 'blue', frequency: 'weekly', completed: false },
  { id: 'w2', text: 'Fold Clothes', icon: Container, color: 'indigo', frequency: 'weekly', completed: false },
  { id: 'w3', text: 'Dishwasher', icon: Utensils, color: 'cyan', frequency: 'weekly', completed: false },
  { id: 'w4', text: 'Dance Class', icon: Music, color: 'purple', frequency: 'weekly', completed: false },
  { id: 'w5', text: 'Show & Tell', icon: Mic, color: 'yellow', frequency: 'weekly', completed: false, dayOfWeek: 1 },
  { id: 'w6', text: 'Gas the Car', icon: Fuel, color: 'red', frequency: 'weekly', completed: false },
  { id: 'w7', text: 'Take out Trash', icon: Trash2, color: 'gray', frequency: 'weekly', completed: false, dayOfWeek: 0 },
  { id: 'w8', text: 'Recycling', icon: Recycle, color: 'green', frequency: 'weekly', completed: false, dayOfWeek: 1, isBiweekly: true },

  // MONTHLY
  { id: 'm1', text: 'Vacuum House', icon: Wind, color: 'blue', frequency: 'monthly', completed: false },
  { id: 'm2', text: 'Wet Mop', icon: SprayCan, color: 'cyan', frequency: 'monthly', completed: false },
  { id: 'm3', text: 'Baseboards', icon: Brush, color: 'orange', frequency: 'monthly', completed: false },
  { id: 'm4', text: 'Wipe Kitchen', icon: Zap, color: 'yellow', frequency: 'monthly', completed: false },
];

export const getChoresForDate = (chores: Chore[], date: Date): Chore[] => {
  return chores.filter(chore => {
    if (chore.frequency === 'daily') return true;
    if (chore.frequency === 'monthly') return true; // For now, show monthly tasks all month

    // Weekly logic
    if (chore.frequency === 'weekly') {
      // If a specific day is required
      if (chore.dayOfWeek !== undefined) {
        const isCorrectDay = date.getDay() === chore.dayOfWeek;
        
        if (chore.isBiweekly) {
          const weeks = differenceInCalendarWeeks(
            startOfDay(date), 
            startOfDay(parseISO(RECYCLING_REFERENCE_DATE))
          );
          return isCorrectDay && (weeks % 2 === 0);
        }
        
        return isCorrectDay;
      }
      return true; // General weekly task
    }
    
    return false;
  });
};
