---
sidebar_position: 7
title: Challenge — Payroll Tracker
---

# Challenge — Employee Payroll Tracker

## Objective

Build a browser-based payroll tracker using **vanilla JavaScript (no frameworks)**.

## Requirements

### Core Features (70 points)

- [ ] Add employees via a form (first name, last name, salary)
- [ ] Display employees in a table, sorted by last name alphabetically
- [ ] Show the average salary below the table
- [ ] Pick a random employee and display their name
- [ ] Persist data in `localStorage` — survives page refresh

### Code Quality (30 points)

- [ ] Use `const`/`let` — no `var`
- [ ] Use arrow functions throughout
- [ ] Use `.map()`, `.filter()`, `.reduce()`, `.sort()` where appropriate
- [ ] Separate concerns: data logic in one module, DOM manipulation in another
- [ ] Use ES Modules (`import`/`export`)

## Starter Structure

```
payroll-tracker/
 index.html
 src/
    data.js       # state management (employees array, CRUD ops)
    render.js     # DOM manipulation functions
    storage.js    # localStorage helpers
    main.js       # entry point, wires everything together
 style.css         # Tailwind or custom CSS
```

## Data Shape

```js
// Each employee object should look like:
{
  id: crypto.randomUUID(),
  firstName: 'Alice',
  lastName: 'Smith',
  salary: 85000,
  addedAt: new Date().toISOString(),
}
```

## Grading

| Criteria | Points |
|----------|--------|
| Add + display employees | 20 |
| Sort by last name | 15 |
| Average salary | 15 |
| Random employee picker | 10 |
| localStorage persistence | 10 |
| ES Modules + clean code | 15 |
| Form validation (no empty fields, salary must be a number) | 15 |
| **Total** | **100** |

## Bonus

- Filter employees by salary range
- Edit and delete employees
- Export the table to CSV using `Blob` + `URL.createObjectURL`
- Sort by any column (click on column header)
