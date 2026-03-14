---
sidebar_position: 3
title: Events
---

# Events

## addEventListener

```ts
const btn = document.querySelector<HTMLButtonElement>('#submit')!;

// Add listener
btn.addEventListener('click', (event: MouseEvent) => {
  event.preventDefault();
  console.log('clicked at', event.clientX, event.clientY);
});

// Named handler (easier to remove later)
function handleClick(event: MouseEvent) {
  console.log('clicked');
}

btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick);  // same reference required

// Once — fires once then auto-removes
btn.addEventListener('click', handleClick, { once: true });

// Passive — improves scroll performance
window.addEventListener('scroll', onScroll, { passive: true });
```

## Common Event Types

```ts
// Mouse events
el.addEventListener('click', (e: MouseEvent) => {});
el.addEventListener('dblclick', (e: MouseEvent) => {});
el.addEventListener('mousedown', (e: MouseEvent) => {});
el.addEventListener('mouseup', (e: MouseEvent) => {});
el.addEventListener('mousemove', (e: MouseEvent) => {});
el.addEventListener('mouseenter', (e: MouseEvent) => {}); // no bubbling
el.addEventListener('mouseleave', (e: MouseEvent) => {}); // no bubbling

// Keyboard events
input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') submitForm();
  if (e.key === 'Escape') closeModal();
  if (e.ctrlKey && e.key === 's') save();
});
input.addEventListener('keyup', (e: KeyboardEvent) => {});

// Form events
form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(e.target as HTMLFormElement);
  const email = data.get('email') as string;
});

input.addEventListener('input', (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
});

input.addEventListener('change', handler);  // fires on blur after change
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);

// Window/Document events
window.addEventListener('load', handler);           // all assets loaded
document.addEventListener('DOMContentLoaded', handler); // HTML parsed
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
window.addEventListener('online', handler);
window.addEventListener('offline', handler);
```

## Event Bubbling and Delegation

Events bubble up from child to parent. Use this for **event delegation** — attach one listener to a parent instead of many to children:

```ts
//  Bad — adds listener to every button (memory, lots of listeners)
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', handleDelete);
});

//  Good — one listener on the parent
const list = document.querySelector<HTMLUListElement>('#todo-list')!;

list.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  // Check what was actually clicked using closest()
  const deleteBtn = target.closest<HTMLButtonElement>('.delete-btn');
  if (deleteBtn) {
    const item = deleteBtn.closest<HTMLLIElement>('.todo-item')!;
    const id = item.dataset.id!;
    deleteTodo(id);
    return;
  }

  const checkbox = target.closest<HTMLInputElement>('.todo-checkbox');
  if (checkbox) {
    const id = checkbox.closest<HTMLLIElement>('.todo-item')!.dataset.id!;
    toggleTodo(id);
  }
});
```

### .closest() — Essential for Delegation

```ts
// .closest() walks UP the DOM tree to find the nearest matching ancestor
const btn = event.target as HTMLElement;

const card = btn.closest('.card');     // finds nearest .card ancestor
const row  = btn.closest('tr');        // finds nearest <tr> ancestor
const form = btn.closest('form');      // finds nearest <form>

// Returns null if no match found
if (!card) return;
```

## Stopping Propagation

```ts
inner.addEventListener('click', (e: MouseEvent) => {
  e.stopPropagation();  // prevent bubbling to outer.addEventListener
});

// stopImmediatePropagation — also prevents other listeners on same element
el.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
});
```

## Custom Events

```ts
// Dispatch custom events for component communication
const event = new CustomEvent('cart:add', {
  bubbles: true,    // bubbles up the DOM
  detail: {         // pass data
    productId: '123',
    quantity: 2,
  },
});

addToCartBtn.dispatchEvent(event);

// Listen anywhere up the DOM tree
document.addEventListener('cart:add', (e: CustomEvent) => {
  console.log(e.detail.productId); // '123'
  updateCartCount(e.detail.quantity);
});
```

## Intersection Observer

Detect when elements enter/leave the viewport — for lazy loading, animations, infinite scroll:

```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop watching after first intersection
      }
    });
  },
  {
    threshold: 0.1,     // trigger when 10% visible
    rootMargin: '0px 0px -50px 0px', // offset
  }
);

// Observe all cards
document.querySelectorAll('.card').forEach(card => observer.observe(card));
```
