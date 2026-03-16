/**
 * localStorage helpers. Use for persisting user preferences, saved items, etc.
 */

const PREFIX = 'project01_';

export function getStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage setItem failed', e);
  }
}

export function removeStored(key: string): void {
  localStorage.removeItem(PREFIX + key);
}
