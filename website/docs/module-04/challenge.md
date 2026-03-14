---
sidebar_position: 7
title: Challenge — TypeScript Migration
---

# Challenge — Migrate Payroll Tracker to TypeScript

## Objective

Take the JavaScript Payroll Tracker from Module 03 and migrate it fully to TypeScript.

## Requirements

### Types (40 points)

- [ ] `Employee` interface with all required fields and proper types
- [ ] `PayrollState` interface for the application state
- [ ] All function parameters and return types annotated
- [ ] No `any` types — `noImplicitAny` must pass
- [ ] `strict: true` in tsconfig — no errors

### Utility Types (30 points)

- [ ] Use `Omit<Employee, 'id' | 'addedAt'>` for the create input type
- [ ] Use `Partial<Employee>` for the update input type
- [ ] Use `Readonly<Employee>` where employees should not be mutated
- [ ] Create a `SortableField` type using `keyof Employee`

### Code (30 points)

- [ ] Separate files: `types.ts`, `data.ts`, `render.ts`, `storage.ts`, `main.ts`
- [ ] `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`
- [ ] Compiles with zero errors: `npx tsc --noEmit`

## Expected Types

```ts
// src/types.ts

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  salary: number;
  department: string;
  addedAt: string;
}

type CreateEmployeeInput = Omit<Employee, 'id' | 'addedAt'>;
type UpdateEmployeeInput = Partial<Omit<Employee, 'id' | 'addedAt'>>;
type SortableField = keyof Pick<Employee, 'lastName' | 'salary' | 'department'>;

interface PayrollState {
  employees: Readonly<Employee>[];
  sortBy: SortableField;
  sortDir: 'asc' | 'desc';
}
```

## Grading

| Criteria | Points |
|----------|--------|
| All interfaces defined correctly | 20 |
| Utility types used properly | 30 |
| All functions typed (no implicit any) | 20 |
| `tsc --noEmit` passes | 20 |
| tsconfig strict mode | 10 |
| **Total** | **100** |
