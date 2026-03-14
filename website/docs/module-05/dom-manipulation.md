---
sidebar_position: 2
title: DOM Manipulation
---

# DOM Manipulation

The DOM (Document Object Model) is the browser's in-memory representation of your HTML. JavaScript manipulates it to create dynamic UIs.

## Selecting Elements

```ts
// Single element — returns first match or null
const header = document.querySelector<HTMLElement>('header');
const form = document.querySelector<HTMLFormElement>('#signup-form');
const input = document.querySelector<HTMLInputElement>('.email-input');

// Multiple elements — returns a static NodeList
const buttons = document.querySelectorAll<HTMLButtonElement>('.btn');
const cards = document.querySelectorAll<HTMLDivElement>('.card');

// Iterate NodeList
buttons.forEach(btn => btn.disabled = true);
[...buttons].map(btn => btn.textContent);  // spread to array for array methods

// Relative selectors (scoped to a parent)
const container = document.querySelector<HTMLElement>('#app')!;
const title = container.querySelector<HTMLHeadingElement>('h1');
```

:::tip TypeScript + DOM
Always provide the HTML element type generic (e.g. `<HTMLInputElement>`) so TypeScript knows which properties are available (`.value`, `.checked`, etc.).
:::

## Reading and Writing Content

```ts
const el = document.querySelector<HTMLElement>('#title')!;

// Text content (safe — no HTML injection risk)
el.textContent = 'New Title';
const text = el.textContent;

// Inner HTML (use carefully — XSS risk if inserting user data)
el.innerHTML = '<strong>Bold text</strong>';

// Outer HTML — includes the element itself
console.log(el.outerHTML);

// Safe HTML with template (use instead of innerHTML for user data)
const name = userInput; // could be malicious
const span = document.createElement('span');
span.textContent = name; //  safe — textContent never interprets HTML
el.appendChild(span);
```

## Classes and Attributes

```ts
const btn = document.querySelector<HTMLButtonElement>('.btn')!;

// classList
btn.classList.add('active');
btn.classList.remove('active');
btn.classList.toggle('active');
btn.classList.contains('active'); // boolean
btn.classList.replace('old', 'new');

// Multiple classes
btn.classList.add('active', 'focused', 'visible');

// Attributes
btn.setAttribute('aria-pressed', 'true');
btn.getAttribute('aria-pressed'); // 'true'
btn.removeAttribute('disabled');
btn.hasAttribute('disabled'); // boolean

// Data attributes
const card = document.querySelector<HTMLElement>('[data-id]')!;
card.dataset.id;       // get data-id
card.dataset.userId = '42'; // set data-user-id
```

## Styles

```ts
const box = document.querySelector<HTMLDivElement>('#box')!;

// Inline styles (use sparingly — prefer classes)
box.style.display = 'flex';
box.style.backgroundColor = '#3b82f6';
box.style.setProperty('--custom-prop', 'value'); // CSS custom properties

// Get computed styles (what the browser actually applies)
const styles = getComputedStyle(box);
styles.getPropertyValue('color');
styles.getPropertyValue('--custom-prop');

// Better: toggle classes
box.classList.toggle('hidden');  // CSS: .hidden { display: none }
box.classList.toggle('visible');
```

## Creating and Inserting Elements

```ts
// Create
const div = document.createElement('div');
div.className = 'card';
div.textContent = 'Hello';

// Insert methods
parent.appendChild(child);                   // append as last child
parent.prepend(child);                       // insert as first child
parent.insertBefore(newEl, referenceEl);     // before a specific child
referenceEl.before(newEl);                   // sibling before
referenceEl.after(newEl);                    // sibling after
parent.replaceChild(newEl, oldEl);

// insertAdjacentHTML — precise position without replacing
el.insertAdjacentHTML('beforebegin', html);  // before the element
el.insertAdjacentHTML('afterbegin', html);   // first child
el.insertAdjacentHTML('beforeend', html);    // last child
el.insertAdjacentHTML('afterend', html);     // after the element

// DocumentFragment — batch inserts for performance
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.name;
  fragment.appendChild(li);
});
list.appendChild(fragment); // single DOM update
```

## The Template Pattern

Use `<template>` elements in HTML to clone complex structures:

```html
<template id="card-template">
  <article class="card">
    <h3 class="card__title"></h3>
    <p class="card__body"></p>
    <button class="card__btn">Read more</button>
  </article>
</template>
```

```ts
function renderCard(post: Post): HTMLElement {
  const template = document.querySelector<HTMLTemplateElement>('#card-template')!;
  const clone = template.content.cloneNode(true) as DocumentFragment;

  clone.querySelector<HTMLHeadingElement>('.card__title')!.textContent = post.title;
  clone.querySelector<HTMLParagraphElement>('.card__body')!.textContent = post.excerpt;

  const btn = clone.querySelector<HTMLButtonElement>('.card__btn')!;
  btn.addEventListener('click', () => openPost(post.id));

  return clone.querySelector('.card') as HTMLElement;
}

// Render all posts
const grid = document.querySelector<HTMLDivElement>('#post-grid')!;
const fragment = document.createDocumentFragment();
posts.forEach(post => fragment.appendChild(renderCard(post)));
grid.appendChild(fragment);
```

## Removing Elements

```ts
// Remove an element
element.remove();

// Remove all children
while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
}
// Or (simpler but replaces with empty string — lose event listeners)
parent.innerHTML = '';
```
