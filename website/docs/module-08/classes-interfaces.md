---
sidebar_position: 2
title: Classes & Interfaces
---
# Classes & Interfaces

## TypeScript Classes

```ts
class Animal {
  // Access modifiers
  public name: string;
  protected species: string;
  private _health: number;
  readonly id: string;

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
    this._health = 100;
    this.id = crypto.randomUUID();
  }

  // Getter/setter
  get health(): number { return this._health; }
  set health(value: number) {
    if (value < 0 || value > 100) throw new RangeError('Health must be 0-100');
    this._health = value;
  }

  describe(): string {
    return `${this.name} is a ${this.species}`;
  }

  // Static method
  static create(name: string, species: string): Animal {
    return new Animal(name, species);
  }
}

const cat = new Animal('Whiskers', 'cat');
cat.health = 80;
console.log(cat.describe()); // Whiskers is a cat
```

## Interfaces as Contracts

```ts
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Loggable {
  log(): void;
}

// Implement multiple interfaces
class User implements Serializable, Loggable {
  constructor(public id: string, public name: string, public email: string) {}

  serialize(): string {
    return JSON.stringify({ id: this.id, name: this.name, email: this.email });
  }

  deserialize(data: string): void {
    const obj = JSON.parse(data);
    this.name = obj.name;
    this.email = obj.email;
  }

  log(): void {
    console.log(`[User] ${this.id}: ${this.name}`);
  }
}
```
