---
sidebar_position: 1
title: Challenge — Employee Tracker
---

# Challenge — Employee Tracker

# Challenge — Employee Tracker CMS

Build a CLI app to manage a company's employees using PostgreSQL.

## Database Schema

```sql
CREATE TABLE department (id SERIAL PRIMARY KEY, name VARCHAR(30) UNIQUE NOT NULL);
CREATE TABLE role (id SERIAL PRIMARY KEY, title VARCHAR(30) NOT NULL, salary DECIMAL, department_id INTEGER REFERENCES department(id));
CREATE TABLE employee (id SERIAL PRIMARY KEY, first_name VARCHAR(30), last_name VARCHAR(30), role_id INTEGER REFERENCES role(id), manager_id INTEGER REFERENCES employee(id));
```

## Menu Options
- View all departments / roles / employees
- Add department / role / employee
- Update employee role
- View employees by manager

## Requirements
- Uses `inquirer` for prompts
- Uses `pg` (node-postgres) with parameterized queries
- TypeScript strict mode
- Walkthrough video required
