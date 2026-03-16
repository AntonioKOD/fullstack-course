// Add shared types for your app and API responses.

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
