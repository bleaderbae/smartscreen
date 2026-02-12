# Family Smart Hub

A custom implementation of a family smart hub designed to be deployed on a vertical monitor touch screen. This application provides essential information and widgets for family organization and convenience.

## Features

- **Clock & Date:** Real-time display of the current time, date, and day of the week.
- **Weather Widget:** Displays current temperature, conditions, and daily high/low (currently mock data).
- **Calendar Widget:** Shows the next upcoming event (currently mock data).
- **Shopping List:** Interactive list of items to buy (currently mock data).
- **Family Notes:** A space for leaving messages and reminders (currently mock data).
- **Navigation/Apps:** Shortcuts to Home, User Profiles, and Settings.

## Hardware Recommendations

For the optimal experience, we recommend the following hardware setup:

- **Display:** A vertical monitor (portrait orientation) with at least 1080p resolution.
- **Touch Screen:** A touch-enabled display or an overlay to interact with the widgets.
- **Compute Unit:** A small form-factor computer such as a Raspberry Pi 4 or 5, or a Mini PC capable of running a modern web browser (Chrome/Chromium recommended).
- **Mounting:** Wall mount or stand suitable for vertical orientation.

## Roadmap

This project is currently in the initial development phase with mock data. Future development plans include:

1. **Weather API Integration:** Replace mock weather data with a real weather API (e.g., OpenWeatherMap).
2. **Calendar Integration:** Connect to Google Calendar or iCal for real-time event syncing.
3. **Shopping List Backend:** Implement a backend or local storage solution to persist shopping list items.
4. **Notes Functionality:** Allow users to add, edit, and delete notes.
5. **User Profiles:** Support for multiple user profiles with personalized settings.
6. **Voice Control:** (Long-term) Integration with voice assistants for hands-free operation.

## Installation & Setup

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd smartscreen
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the port specified in the terminal).

## Tech Stack

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Lucide React (Icons)
-   Date-fns
