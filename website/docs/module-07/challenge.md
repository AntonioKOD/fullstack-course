---
sidebar_position: 6
title: Challenge — README Generator
---

# Challenge — Professional README Generator

## Objective

Build a CLI tool that generates a professional `README.md` by asking the user a series of questions.

## Setup

```bash
npm install inquirer
npm install -D @types/inquirer
```

## Questions to Ask

1. Project title
2. Description
3. Installation instructions
4. Usage instructions
5. License (select from: MIT, Apache 2.0, GPL 3.0, BSD 3-Clause, None)
6. Contributing guidelines
7. Test instructions
8. GitHub username
9. Email address

## Generated README Sections

```markdown
# Project Title

## Description

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

## Usage

## License

![License Badge](https://img.shields.io/badge/license-MIT-blue.svg)

## Contributing

## Tests

## Questions

GitHub: [username](https://github.com/username)
Email: user@email.com
```

## Requirements

- [ ] Uses `inquirer` for prompts (not `readline`)
- [ ] All prompts validate input (no empty required fields)
- [ ] License section includes correct badge (different badge per license)
- [ ] Table of Contents links work (lowercase, hyphenated anchors)
- [ ] Output written to `README.md` in current directory
- [ ] TypeScript with strict mode
- [ ] Walkthrough video recorded (2–5 minutes) showing CLI in action

## Badge URLs

```ts
const badges: Record<string, string> = {
  MIT: 'https://img.shields.io/badge/license-MIT-blue.svg',
  'Apache 2.0': 'https://img.shields.io/badge/license-Apache%202.0-blue.svg',
  'GPL 3.0': 'https://img.shields.io/badge/license-GPL%203.0-blue.svg',
  'BSD 3-Clause': 'https://img.shields.io/badge/license-BSD%203--Clause-blue.svg',
};
```

## Grading

| Criteria | Points |
|----------|--------|
| All questions asked | 20 |
| Correct README structure | 20 |
| Validation on all inputs | 20 |
| License badge per selection | 15 |
| TypeScript (no errors) | 15 |
| Walkthrough video submitted | 10 |
| **Total** | **100** |
