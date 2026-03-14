---
sidebar_position: 3
title: Inheritance & Polymorphism
---
# Inheritance & Polymorphism

## Extending Classes

```ts
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;

  // Concrete method available to all subclasses
  describe(): string {
    return `${this.constructor.name}: area=${this.area().toFixed(2)}, perimeter=${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(public radius: number) { super(); }

  area(): number { return Math.PI * this.radius ** 2; }
  perimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) { super(); }

  area(): number { return this.width * this.height; }
  perimeter(): number { return 2 * (this.width + this.height); }
}

// Polymorphism — same interface, different behavior
const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
const totalArea = shapes.reduce((sum, s) => sum + s.area(), 0);
shapes.forEach(s => console.log(s.describe()));
```

## Composition Over Inheritance

Prefer composing objects rather than deep inheritance:

```ts
// Instead of extending User → AdminUser → SuperAdminUser...
// Compose capabilities:

interface Permissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}

class User {
  constructor(
    public id: string,
    public name: string,
    public permissions: Permissions
  ) {}
}

const admin = new User('1', 'Alice', { canRead: true, canWrite: true, canDelete: true });
const guest = new User('2', 'Bob',   { canRead: true, canWrite: false, canDelete: false });
```
