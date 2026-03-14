---
sidebar_position: 5
title: API Design for Consumers
---

# API Design for Consumers

When consuming third-party APIs, build a typed wrapper layer so the rest of your app doesn't directly depend on the external shape.

## The Adapter Pattern

```ts title="src/api/weather.ts"
// External API shape (messy, changes without notice)
interface OpenWeatherResponse {
  name: string;
  main: { temp: number; humidity: number; feels_like: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  sys: { country: string };
}

// Your clean internal type
interface WeatherSummary {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  iconUrl: string;
}

// Adapter — translates external → internal
function adaptWeather(raw: OpenWeatherResponse): WeatherSummary {
  return {
    city: raw.name,
    country: raw.sys.country,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    description: raw.weather[0]?.description ?? '',
    iconUrl: `https://openweathermap.org/img/wn/${raw.weather[0]?.icon}@2x.png`,
  };
}

export async function getWeather(city: string): Promise<WeatherSummary> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
  );
  if (!res.ok) throw new Error(res.status === 404 ? 'City not found' : 'Weather API error');
  const raw: OpenWeatherResponse = await res.json();
  return adaptWeather(raw);
}
```

If the OpenWeather API changes its response shape, you only update the adapter — not every component that uses weather data.
