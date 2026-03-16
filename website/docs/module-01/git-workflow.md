---
sidebar_position: 3
title: Git Workflow
---

# Git & GitHub Workflow

:::info Learning Objectives
By the end of this lesson you will be able to:
- Explain what Git is doing conceptually — staging, committing, and branching — not just memorize the commands
- Run the daily Git workflow: checking status, staging, committing, and pushing changes
- Write commit messages in the Conventional Commits format that professional teams use
- Create feature branches, push them to GitHub, and open a pull request
- Resolve a merge conflict without losing anyone's work
- Use `.gitignore` to keep secrets and generated files out of version control
:::

## Why This Matters

Git is not optional at a professional software job. Every team you will ever work on uses it. Every project you submit will be graded in part on whether it has a clean commit history. Your GitHub profile — with real projects, consistent commits, and pull requests — is a hiring signal that many companies weight as heavily as a resume.

More practically: you will make mistakes. Files will get corrupted. You will accidentally delete something important. You will work on a feature for three days and then need to throw it away. Git is what lets you do all of this without catastrophe. Without it, the only recovery option when something goes wrong is to undo changes manually and hope you remember everything.

In Module 06, when you start working in teams on shared repositories, the branching and pull request workflow from this lesson is exactly what you will use every day. Get comfortable with it now.

## The Mental Model

Before any commands, understand what Git is actually tracking. Most beginners think of Git as something that "saves" their files — but that is not quite right. Git tracks *snapshots* of your project at specific moments in time, and it keeps every snapshot forever.

Think of it like this: every time you commit, you are taking a photograph of your entire project. Git stores all those photographs in order. At any point, you can flip back to any earlier photograph. You can also branch off from any photograph and create an alternate timeline.

There are three places your code lives in Git's world:

```
Working Directory       Staging Area           Repository
(files you can see)     (changes you've        (permanent snapshots
                         prepared to commit)    = commits)

     edit files   →    git add    →    git commit
```

- **Working directory**: the actual files on your hard drive. You edit these.
- **Staging area** (also called "the index"): a holding area where you prepare changes before committing. You choose exactly which changes go into the next snapshot.
- **Repository**: the permanent record of all your commits. Once something is here, it is safe.

The staging area is what makes Git powerful. You can edit ten files, then selectively stage only three of them for a focused commit — keeping the other seven changes for a separate commit later.

## Starting a Project

There are two ways to start working with Git:

```bash
# Option A: Start a brand-new local repository
mkdir my-project
cd my-project
git init              # creates a hidden .git folder — this IS the repository
git branch -M main    # rename the default branch to "main"

# Option B: Clone an existing repository from GitHub
git clone https://github.com/username/repo-name.git
cd repo-name
# you are now on the main branch, with full history downloaded
```

When you `git init`, Git creates a hidden `.git` folder in your project directory. That folder contains every commit, branch, and configuration. Deleting it removes all Git history — do not delete it unless you want to start over.

:::warning Common Mistake
Running `git init` inside a folder that is already inside another Git repository creates a "nested repository" that causes strange, confusing behavior. Before running `git init`, run `git status` to check whether you are already inside a repository. If it says "not a git repository," you are safe to initialize.
:::

## The Daily Workflow

Once your repository is set up, this is the sequence you will run dozens of times per day:

```bash
# Step 1: See what has changed since your last commit
git status
```

`git status` shows you three categories: untracked files (new files Git has never seen), modified files (files Git knows about that have been changed), and staged files (changes ready to commit). Always run this first — it shows you exactly where you are.

```bash
# Step 2: See the actual changes (optional but highly recommended)
git diff
```

`git diff` shows you the line-by-line changes in your working directory that have not been staged yet. Lines starting with `+` are additions, lines starting with `-` are deletions. Reading diffs is a skill worth developing — it tells you exactly what you are about to commit.

```bash
# Step 3: Stage the files you want in this commit
git add index.html styles.css
```

Stage specific files by name rather than using `git add .`, which stages everything. Staging specific files keeps your commits focused. A commit that changes one thing is easier to understand, easier to revert, and easier to review in a pull request.

```bash
# Step 4: Commit with a descriptive message
git commit -m "feat: add navigation header with responsive menu"
```

The commit message is permanent — it is part of the project's history and other developers will read it. Write it as a short statement that completes the sentence "This commit will..." The format `feat: add navigation header` is the Conventional Commits standard, covered in detail below.

```bash
# Step 5: Push your commits to the remote repository on GitHub
git push origin main
```

`origin` is the default name for the remote repository (the one on GitHub). `main` is the branch you are pushing. If you are on a feature branch, replace `main` with your branch name.

**Checking what you have so far:**

```bash
# See all commits in reverse chronological order
git log --oneline

# Example output:
# a3f8c12 feat: add contact form with validation
# 9d21e45 feat: add about section with profile image
# 5e87b34 feat: initial project structure and HTML boilerplate
```

## Commit Message Convention

A commit message like "fixed stuff" or "WIP" is useless to anyone reading the history — including you, six months later. Professional teams use a standard format called [Conventional Commits](https://www.conventionalcommits.org/) that makes commit history scannable and enables automated tools to generate changelogs.

The format:

```
type(optional-scope): short description in present tense

Optional longer explanation if needed.
```

The available types:

| Type | When to use it |
|------|---------------|
| `feat` | A new feature or piece of visible functionality |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Code formatting changes that do not affect behavior |
| `refactor` | Code restructuring that is neither a feature nor a bug fix |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates, tooling |

```bash
# Good commit messages — specific, conventional, tell you exactly what changed
git commit -m "feat: add login form with email and password fields"
git commit -m "fix: correct broken link in navigation to /about page"
git commit -m "docs: add setup instructions to README"
git commit -m "style: reformat CSS file to follow team conventions"
git commit -m "chore: upgrade dependencies to latest patch versions"

# Bad commit messages — tell you nothing about what changed or why
git commit -m "stuff"
git commit -m "WIP"
git commit -m "fixed bug"
git commit -m "changes"
git commit -m "updated files"
```

The test for a good commit message: can someone reading just this line — without opening any files — understand what changed and why?

:::tip Write commits in present tense
Write "add navigation header" not "added navigation header." Think of each commit as a label for a snapshot: "this is a snapshot in which [commit message]." Present tense fits that model.
:::

## Branching

A branch is an independent line of development. It starts as a copy of another branch and then diverges as you make commits on it. Branches let you work on a new feature or bug fix without touching the stable code on `main`.

Here is the conceptual picture:

```
main:    A ── B ── C ──────────────── F (merge commit)
                    \                /
feat/nav:            D ── E ─────────
```

Commits A, B, C are on `main`. You branched off at C to work on a nav feature, making commits D and E. When the feature is done, you merge it back — creating commit F on `main` which contains all the original work plus your new feature.

```bash
# See all branches (the * marks your current branch)
git branch

# Create a new branch and switch to it in one command
git checkout -b feat/navigation-header

# Make changes, stage them, commit them...
git add nav.html styles.css
git commit -m "feat: add primary navigation with dropdown"

# Push your branch to GitHub (first time: -u sets the upstream tracking)
git push -u origin feat/navigation-header

# Switch back to main when you need to
git checkout main

# Bring new commits from main into your feature branch (do this regularly)
git merge main
```

**Branch naming conventions:**

```
feat/feature-name          new features
fix/bug-description        bug fixes
docs/what-you-documented   documentation
chore/what-you-updated     maintenance tasks
refactor/what-you-changed  refactoring
```

The prefix (feat/, fix/, etc.) mirrors the commit type. When someone looks at a list of branches they can immediately see what each one is about.

:::warning Common Mistake
Never commit directly to `main` on a team project. If two people both push to `main` at the same time, one push will be rejected and that person will have to resolve a conflict before they can push. Working on feature branches and merging via pull requests avoids this entirely. Even on solo projects, practicing the branch workflow builds the habit you need when you join a team.
:::

## Pull Requests

A pull request (PR) is a request to merge your feature branch into `main`. It is the review step: your code sits in GitHub's interface, other developers read it line by line, leave comments, and either approve it or request changes. Only after approval does the code get merged.

The typical flow:

1. Work on a feature branch, making commits as you go
2. Push your branch to GitHub
3. On GitHub, click "Compare & pull request" for your branch
4. Write a clear title and description explaining what the PR does and why
5. Request a review from a teammate
6. Respond to feedback — push additional commits to your branch to address it
7. Once approved, merge the PR and delete the branch

Even on solo projects, opening PRs against your own repository builds the habit of treating merges as intentional acts rather than automatic steps.

## Resolving Merge Conflicts

A merge conflict happens when two branches have changed the same lines of the same file. Git cannot automatically decide which version to keep, so it marks the conflict and asks you to resolve it manually.

A conflict looks like this inside a file:

```
<<<<<<< HEAD
const primaryColor = '#3b82f6';
=======
const primaryColor = '#6366f1';
>>>>>>> feat/rebrand
```

Everything between `<<<<<<< HEAD` and `=======` is your version (the branch you are merging into). Everything between `=======` and `>>>>>>>` is the incoming version (the branch being merged in).

To resolve it: delete the conflict markers and keep whatever is correct. Sometimes that is one version, sometimes it is the other, sometimes it is a combination:

```js
// Resolved: kept the rebrand color since that branch was approved
const primaryColor = '#6366f1';
```

Then stage the resolved file and commit:

```bash
git add styles.css
git commit -m "fix: resolve merge conflict in color variables"
```

VS Code has a built-in conflict editor that lets you click "Accept Current Change," "Accept Incoming Change," or "Accept Both" without manually editing the markers. Use it when you are learning — it makes the choices explicit.

## Undoing Mistakes

Git's undo commands are not all equal. Understanding what each one does prevents you from making a bad situation worse.

```bash
# Undo the last commit — keeps all your changes staged and ready to re-commit
# Safe: nothing is lost, you can make a different commit message or add more files
git reset --soft HEAD~1

# Unstage a file — moves it back to the working directory, edits preserved
# Safe: your changes are still in the file, just no longer staged
git restore --staged filename.css

# View all commits — use this to find the hash of a commit you want to go back to
git log --oneline

# Create a new commit that reverses a previous commit — safe for shared branches
# Use this instead of reset when the commit has already been pushed
git revert abc1234
```

:::warning Common Mistake
`git restore .` (without `--staged`) discards all uncommitted changes in your working directory permanently. There is no undo. Use it only when you are absolutely sure you want to throw away your changes. Before running it, at minimum run `git status` to confirm what you are about to lose.
:::

## The .gitignore File

Some files should never be committed to a repository. A `.gitignore` file tells Git to pretend those files do not exist.

```gitignore
# Dependencies — always install from package.json, never commit this folder
node_modules/

# Environment variables — these contain API keys, database passwords, secrets
# NEVER commit these. If you do, rotate your credentials immediately.
.env
.env.local
.env.development
.env.production

# Build output — generated files that can be recreated
dist/
build/
.next/
out/

# Operating system files
.DS_Store        # macOS
Thumbs.db        # Windows

# Editor configuration (optional — some teams commit this, some do not)
.vscode/settings.json
```

Create your `.gitignore` before your first commit. If you accidentally commit a file that should be ignored, removing it from history after the fact requires rewriting Git history — a painful process on a shared repository.

:::warning Common Mistake
If you commit `.env` with real API keys or passwords and push to a public GitHub repository, automated bots will find and exploit those credentials within minutes. This has happened to many developers and resulted in surprise cloud bills in the thousands of dollars. Always gitignore `.env` files. If you accidentally push one, immediately revoke the exposed credentials.
:::

## Activity

Work through these steps in order. Each step produces a concrete output you can verify.

**Setup:**
1. Go to GitHub and create a new public repository called `module-01-portfolio`. Initialize it with a README file.
2. Clone the repository to your computer: `git clone https://github.com/YOUR-USERNAME/module-01-portfolio.git`
3. Open the cloned folder in VS Code.

**Feature branch workflow:**
4. Create a new branch: `git checkout -b feat/homepage`
5. Create a `.gitignore` file with at least `node_modules/` and `.DS_Store` in it.
6. Copy your `index.html` from the HTML Fundamentals activity into this folder.
7. Stage both files: `git add index.html .gitignore`
8. Commit using a conventional commit message: `git commit -m "feat: add homepage HTML with semantic structure and contact form"`
9. Push your branch: `git push -u origin feat/homepage`

**Pull request:**
10. Go to your repository on GitHub. A banner should appear offering to open a pull request for your branch. Click it.
11. Write a title: "feat: add homepage with semantic HTML structure"
12. Write a description: briefly explain what the page contains and what semantic elements you used.
13. Merge the pull request. Delete the branch on GitHub when prompted.

**Local cleanup:**
14. Switch back to main: `git checkout main`
15. Pull the merged changes: `git pull origin main`
16. Verify with `git log --oneline` that your commit appears in the main branch history.

:::tip Success Check
You are done when: (1) your GitHub repository shows the commit in the `main` branch history with a proper conventional commit message, (2) `git log --oneline` on your local machine shows the same commit, (3) the `feat/homepage` branch no longer exists on GitHub (you deleted it after merging), and (4) your `index.html` is not in any `.gitignore` — only `node_modules` and system files are.
:::

## Key Takeaways

- When you write code professionally, commit early and commit often — small, focused commits are easier to review and safer to revert than massive ones
- Use `feat:`, `fix:`, `docs:` prefixes in commit messages — a clean commit history is a professional signal
- Always work on feature branches; treat `main` as the stable, reviewed version of your code
- Never commit `.env` files — if you expose secrets, rotate the credentials immediately
- `git restore .` permanently discards uncommitted work — use it with intention
- Pull before you push on a shared branch: `git pull origin main` before `git push`
