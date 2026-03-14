---
sidebar_position: 1
title: Module 20 Overview
---

# Module 20 — Progressive Web Apps & Performance

## What You'll Build

Transform a Vite + React app into a **Progressive Web App (PWA)** — installable, offline-capable, and lightning fast. Then audit and optimize it to score 90+ on Google Lighthouse.

## What Is a PWA?

A Progressive Web App is a web application that uses modern browser APIs to deliver an app-like experience:

- **Installable** — users can add it to their home screen or desktop
- **Offline-capable** — works without an internet connection (or with poor connectivity)
- **Fast** — loads quickly, responds instantly
- **Secure** — requires HTTPS
- **Reliable** — sends push notifications, syncs in background

Companies using PWAs: Twitter (now X), Pinterest, Starbucks, Uber, Spotify.

## What You'll Learn

1. **PWA Fundamentals** — manifest, icons, installability criteria
2. **Service Workers** — lifecycle, caching strategies, offline support
3. **Vite PWA Plugin** — automate everything with `vite-plugin-pwa`
4. **Performance Auditing** — Lighthouse, Core Web Vitals, bundle analysis

## Core Web Vitals (2024)

Google uses these to rank websites in search results:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **LCP** — Largest Contentful Paint | Loading performance | < 2.5s |
| **INP** — Interaction to Next Paint | Responsiveness | < 200ms |
| **CLS** — Cumulative Layout Shift | Visual stability | < 0.1 |

## Prerequisites

- React + Vite (Module 16)
- TypeScript (Module 04)
- Basic HTTP/fetch knowledge (Module 06)

## Project

By the end of this module you'll have a recipe app that:
- Installs to the home screen on mobile and desktop
- Shows cached recipes when offline
- Scores 95+ on Lighthouse
- Loads in under 1 second on a simulated 3G connection
