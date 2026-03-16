/**
 * Example API wrapper. Replace with your own APIs (e.g. OpenWeatherMap, Giphy).
 * Use fetch() and return typed data. Keep API keys in .env (VITE_*).
 */

const API_BASE = 'https://api.example.com';

export async function fetchExample(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/example`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<{ message: string }>;
}
