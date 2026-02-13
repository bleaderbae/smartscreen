# Jules: Hand-off & System Update (2026-02-12)

## **Executive Summary**
The repository has undergone a significant architectural and visual overhaul to transition from an "Information Dashboard" to a **"Family Interaction Hub"**. The primary design constraint is now **Touch-First/Toddler-Friendly**, optimized for a wall-mounted vertical display used by non-readers and children (4yo Harper, 3yo Hunter).

## **Key Changes & Logic**

### **1. Interaction Model: Touch-First**
- **No Hover Reliance**: All primary actions (maximize, add, check) are now always visible.
- **Tactile Feedback**: Every interactive element now uses `active:scale-95/98` transitions to provide physical response on a touch screen.
- **Target Size**: Padding and hit-boxes have been significantly increased for small hands.

### **2. Toddler-Friendly Iconography**
- **Recognition over Reading**: Text is now secondary to high-contrast iconography (`lucide-react`).
- **Shopping List**: Features a "Quick Add" menu with recognizable icons (Milk, Egg, etc.) allowing kids to participate.
- **Weather Widget**: Entire card is now **color-coded by temperature** (Blue = Cold, Orange = Warm, Red = Hot) and includes a visual "What to Wear" guide.
- **Clock**: Added visual time-of-day context (Sunrise, Sun, Sunset, Moon) and a **Day Progress Bar** (6 AM - 8 PM) to visualize time passage for toddlers.

### **3. Family Identity & Color Palette**
Implemented a sophisticated, centralized color scheme in `config.ts` (`FAMILY_PROFILES`):
- **Dad**: Rosewood (Deep Red)
- **Mom**: Blush (Soft Pink)
- **Hunter**: Sage (Earthy Green)
- **Harper**: Prism (Pink/Purple/Blue Gradient)
*All events and chores are dynamically color-coded based on these profiles.*

### **4. Functional Logic & Persistence**
- **Persistence**: `localStorage` implemented for Shopping List and Chores.
- **Smart Reset**: Chores in `ChoreGrid` use period-specific keys. Daily chores reset at midnight; weekly chores reset at the start of the week.
- **iCal Integration**: `calendarService` now supports fetching and merging multiple public iCal feeds.
- **Location**: Default coordinates updated to **Leander, TX**.

### **5. Architectural Refactor**
- Logic has been moved out of `App.tsx` into modular widgets and services.
- **State Flow**: Calendar data is now fetched at the root (`App.tsx`) and shared between the `Clock` (for "Next Up" pulses) and the `CalendarWidget`.

## **Instructions for Future Automations**
- **Don't revert to lists**: Maintain the visual grid/card pattern for chores.
- **Keep it Tactile**: Always include `active:scale` on new buttons.
- **Respect the Palette**: Use `FAMILY_PROFILES` for any user-specific UI elements.
- **Sync check**: Always check the remote repository before running local tasks, as multiple agents are collaborating on this project.
