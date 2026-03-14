---
sidebar_position: 3
title: Git Workflow
---

# Git & GitHub Workflow

Git is the version control system used by virtually every software team. Think of it as a time machine for your code — you can commit snapshots, branch off to experiment, and merge changes back in without losing work.

## Core Concepts

| Concept | What It Is |
|---------|-----------|
| **Repository** | A folder tracked by Git |
| **Commit** | A saved snapshot of your files |
| **Branch** | An independent line of development |
| **Remote** | A copy of the repo on a server (GitHub, GitLab) |
| **Pull Request** | A request to merge one branch into another |

## Starting a Project

```bash
# Option A: Start from scratch
mkdir my-project && cd my-project
git init
git branch -M main

# Option B: Clone an existing repo
git clone https://github.com/user/repo.git
cd repo
```

## The Daily Workflow

```bash
# 1. Check what's changed
git status

# 2. See the diff before staging
git diff

# 3. Stage specific files (preferred over `git add .`)
git add index.html styles.css

# 4. Commit with a descriptive message
git commit -m "feat: add navigation header with responsive menu"

# 5. Push to remote
git push origin main
```

## Commit Message Convention

Professional teams use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

feat:     a new feature
fix:      a bug fix
docs:     documentation only
style:    formatting (no logic change)
refactor: code restructure (no feature/bug change)
test:     adding or fixing tests
chore:    build process, tooling
```

```bash
#  Good commit messages
git commit -m "feat: add login form validation"
git commit -m "fix: correct contrast ratio on dark background"
git commit -m "docs: update README with setup instructions"

#  Bad commit messages
git commit -m "stuff"
git commit -m "WIP"
git commit -m "fixed bug"
```

## Branching Strategy

Never commit directly to `main` for team projects. Always work on a feature branch:

```bash
# Create and switch to a new branch
git checkout -b feat/user-auth

# Make your changes, commit them...
git add .
git commit -m "feat: implement JWT login endpoint"

# Push your branch to remote
git push origin feat/user-auth

# Open a Pull Request on GitHub, get it reviewed, then merge
```

## Common Branch Naming Patterns

```
feat/feature-name      # new features
fix/bug-description    # bug fixes
docs/update-readme     # documentation
chore/upgrade-deps     # maintenance
refactor/auth-module   # refactoring
```

## Resolving Merge Conflicts

When two people edit the same file, Git can't auto-merge and marks conflicts:

```
<<<<<<< HEAD (your branch)
const color = 'blue';
=======
const color = 'red';
>>>>>>> main
```

Fix it by choosing one or combining:

```js
// Resolved — pick what's correct
const color = 'blue';
```

Then:

```bash
git add .
git commit -m "fix: resolve merge conflict in styles"
```

## Undoing Mistakes

```bash
# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Unstage a file (keep edits in working dir)
git restore --staged filename.txt

# Discard all uncommitted changes (DANGER: permanent)
git restore .

# View all commits
git log --oneline
```

## .gitignore

Tell Git which files to never track:

```gitignore
# Dependencies
node_modules/

# Environment variables (NEVER commit secrets!)
.env
.env.local
.env.production

# Build output
dist/
.next/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
```

## Activity

1. Create a new repo on GitHub (initialize with README)
2. Clone it locally
3. Create a branch called `feat/homepage`
4. Add an `index.html` from the previous lesson
5. Stage and commit with a proper conventional commit message
6. Push your branch
7. Open a Pull Request on GitHub and merge it
8. Pull the updated `main` branch locally

## Key Takeaways

- Always work on feature branches, never directly on `main`
- Write descriptive commit messages using conventional commits format
- Never commit `.env` files or `node_modules`
- Pull before you push on shared branches to reduce conflicts
