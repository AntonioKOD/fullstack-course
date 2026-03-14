---
sidebar_position: 5
title: Challenge — Weather Dashboard
---

# Challenge — Weather Dashboard

## Objective

Build a weather dashboard using the **OpenWeatherMap API** (free tier).

## Setup

1. Sign up at [openweathermap.org](https://openweathermap.org/api) (free)
2. Get an API key (takes a few minutes to activate)
3. Store the key in a `.env` file (never commit it!)

```bash
# .env
VITE_WEATHER_API_KEY=your_key_here
```

```ts
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
```

## API Endpoints

```
# Current weather by city name
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=imperial

# 5-day forecast
GET https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=imperial
```

## Requirements

### Core Features (60 points)
- [ ] Search input — enter a city name and press Enter or click Search
- [ ] Current conditions card: city name, temperature, humidity, wind speed, weather icon, description
- [ ] 5-day forecast — one card per day with high/low temps and icon
- [ ] Search history — last 8 searches shown as clickable buttons
- [ ] Click a history button → reload that city's weather
- [ ] History persists in localStorage

### Error Handling (20 points)
- [ ] Show a user-friendly error message if city not found (404)
- [ ] Show an error if API key is invalid
- [ ] Loading spinner while fetching
- [ ] Empty state before first search

### Code Quality (20 points)
- [ ] TypeScript with full types for API responses
- [ ] API logic in a separate `weatherApi.ts` module
- [ ] No API key in committed code

## Type the API Response

```ts
// src/types/weather.ts
interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  sys: { country: string };
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    dt_txt: string;
    main: WeatherResponse['main'];
    weather: WeatherResponse['weather'];
  }>;
}
```

## Grading

| Criteria | Points |
|----------|--------|
| Current weather display | 20 |
| 5-day forecast | 20 |
| Search history | 20 |
| Error handling + loading | 20 |
| TypeScript types | 20 |
| **Total** | **100** |

## Bonus
- Toggle between Fahrenheit and Celsius
- Geolocation — use current position on first load
- Animated weather icons based on condition code
