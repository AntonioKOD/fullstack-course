---
sidebar_position: 6
title: Challenge — Vehicle Fleet
---
# Challenge — Vehicle Fleet Manager

## Objective

Build a CLI tool that manages a vehicle fleet using OOP.

## Class Hierarchy

```ts
abstract class Vehicle {
  abstract fuelType: string;
  abstract maxSpeed: number;
  constructor(public id: string, public make: string, public model: string, public year: number) {}
  abstract describe(): string;
  abstract startEngine(): string;
}

class Car extends Vehicle { fuelType = 'gasoline'; maxSpeed = 150; /* ... */ }
class Truck extends Vehicle { fuelType = 'diesel'; maxSpeed = 90; /* ... */ }
class ElectricCar extends Car { fuelType = 'electric'; /* ... */ }
class Motorbike extends Vehicle { fuelType = 'gasoline'; maxSpeed = 200; /* ... */ }
```

## Requirements
- [ ] 4 vehicle types (Car, Truck, ElectricCar, Motorbike) using inheritance
- [ ] `FleetManager` class to add/remove/list vehicles
- [ ] CLI interface using `inquirer`
- [ ] Vitest test suite: at least 10 tests
- [ ] TypeScript strict mode

## Grading

| Criteria | Points |
|----------|--------|
| Class hierarchy with TypeScript | 30 |
| FleetManager with CRUD | 20 |
| Inquirer CLI | 20 |
| 10+ passing Vitest tests | 30 |
| **Total** | **100** |
