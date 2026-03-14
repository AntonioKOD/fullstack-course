---
sidebar_position: 1
title: Module 05 Overview
---

# Module 05 — Web APIs (No jQuery)

## Why No jQuery?

jQuery was essential in 2008 when browsers were wildly inconsistent. In 2025, every browser has excellent native APIs that do everything jQuery does — faster, with less code, and without a 30KB dependency.

| jQuery | Modern Vanilla JS |
|--------|-----------------|
| `$(selector)` | `document.querySelector(selector)` |
| `$('.items')` | `document.querySelectorAll('.items')` |
| `$(el).addClass('active')` | `el.classList.add('active')` |
| `$(el).on('click', fn)` | `el.addEventListener('click', fn)` |
| `$.ajax({ url })` | `fetch(url)` |
| `$(el).hide()` | `el.style.display = 'none'` |
| `$(el).html(str)` | `el.innerHTML = str` |

## What You'll Learn

- Traverse and manipulate the DOM with native methods
- Handle events efficiently with event delegation
- Use localStorage and IndexedDB for client-side data
- Use Intersection Observer, ResizeObserver, and MutationObserver
- Work with the Fetch API and abort controllers

## Learning Objectives

By the end of this module you can:

- Select, create, and modify DOM elements without any library
- Attach and remove event listeners, and understand event bubbling
- Persist data in localStorage and retrieve it on page load
- Use modern browser APIs to observe element changes

## Module Lessons

1. [DOM Manipulation](./dom-manipulation)
2. [Events](./events)
3. [Fetch API](./fetch-api)
4. [localStorage & IndexedDB](./localstorage-indexeddb)

## Challenge

Build a Personal Blog — a two-page app (form + blog feed) with localStorage persistence and dark mode.

[View Challenge →](./challenge)
