---
sidebar_position: 4
title: Error Handling
---

# Client-Side Error Handling

## Classifying Errors

```ts
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
  get isNotFound()     { return this.status === 404; }
  get isUnauthorized() { return this.status === 401; }
  get isServerError()  { return this.status >= 500; }
}
```

## Consistent Error Handler

```ts
async function handleError(err: unknown): Promise<void> {
  if (err instanceof ApiError) {
    if (err.isUnauthorized) return redirectToLogin();
    if (err.isNotFound) return showNotFound();
    showToast(err.message, 'error');
  } else if (err instanceof TypeError && err.message.includes('fetch')) {
    showToast('Network error — check your connection', 'error');
  } else {
    showToast('Something went wrong', 'error');
    console.error(err);
  }
}
```

## Error Boundaries in UI

Wrap risky UI sections:

```html
<div id="weather-widget">Loading...</div>

<script>
async function loadWidget() {
  const container = document.getElementById('weather-widget');
  try {
    const data = await getWeather();
    container.innerHTML = renderWeather(data);
  } catch {
    container.innerHTML = '<p class="text-red-500">Weather unavailable</p>';
  }
}
loadWidget();
</script>
```
