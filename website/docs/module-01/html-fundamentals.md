---
sidebar_position: 2
title: HTML Fundamentals
---

# HTML Fundamentals

:::info Learning Objectives
By the end of this lesson you will be able to:
- Explain what "semantic HTML" means and why it matters beyond aesthetics
- Build a correctly structured HTML document from memory, including every required element in `<head>`
- Choose the right semantic element for any given piece of page content
- Write accessible images, forms, and heading hierarchies that screen readers can navigate
- Validate your HTML and interpret any errors the validator returns
:::

## Why This Matters

In Module 03, when you build your portfolio site, a recruiter or hiring manager is likely to view its source code. Experienced developers can tell immediately whether someone understands HTML semantics or just learned enough to make things look right on screen. Semantic HTML also affects your search engine ranking — Google's crawler reads HTML structure to understand what a page is about, and it uses heading levels, landmark regions, and link text as signals of quality.

More practically: accessibility is not optional. In many countries and industries, inaccessible websites create legal liability. More importantly, roughly 1 in 7 people worldwide have some form of disability that affects how they browse the web. Writing semantic, accessible HTML means your work actually reaches those people.

The good news is that semantic HTML costs you nothing extra. You are writing elements either way — the only question is whether you choose elements that carry meaning.

## What HTML Actually Is

HTML (HyperText Markup Language) is not a programming language. It does not have variables, loops, or logic. It is a description language: you wrap content in tags that tell the browser — and everything that reads your page — what that content *is*.

When a browser receives an HTML file, it parses every tag and builds a tree structure in memory called the DOM (Document Object Model). That tree is what CSS styles, what JavaScript manipulates, and what screen readers read aloud. The quality of that tree determines whether your page is usable by the full range of people and tools that will interact with it.

## The Document Structure

Before writing a single line of visible content, every HTML file needs a correct document shell. This is not boilerplate you paste and forget — each piece has a specific job.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="A brief description of this page for search engines" />
    <title>Page Title — Site Name</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <!-- all visible content goes here -->
  </body>
</html>
```

**What each line does:**

- `<!DOCTYPE html>` — tells the browser this is HTML5, not an older version. Without it, some browsers enter "quirks mode" and render your page unpredictably.
- `<html lang="en">` — the root element. The `lang` attribute tells screen readers which language model to use for pronunciation. A French screen reader pronouncing an English page sounds unintelligible to a blind English speaker.
- `<meta charset="UTF-8">` — tells the browser how to decode the bytes in the file. Without this, special characters (accented letters, emoji, curly quotes) can appear as garbage.
- `<meta name="viewport" ...>` — without this line, mobile browsers zoom the page out to show it at desktop scale. This single line is why responsive design works.
- `<meta name="description" ...>` — the text that appears under your page title in search results. Keep it under 160 characters and make it descriptive.
- `<title>` — appears in the browser tab and in search results. Every page should have a unique, descriptive title.

:::warning Common Mistake
Many beginners omit `lang="en"` from the `<html>` tag or forget the `viewport` meta entirely. Both are required for accessibility compliance (WCAG 2.1 Success Criterion 3.1.1) and responsive behavior respectively. Validate every new project at the start to catch these early.
:::

## Semantic Elements

The word "semantic" means "relating to meaning." A semantic HTML element tells you *what the content is*, not just how it should look. Compare these two code examples — they produce visually similar output, but they say completely different things to a browser, a screen reader, and a search engine.

**Non-semantic HTML (what beginners write):**

```html
<!-- div soup — every element is a meaningless box -->
<div class="header">
  <div class="logo">My Site</div>
  <div class="nav">
    <div class="nav-link">Home</div>
    <div class="nav-link">About</div>
  </div>
</div>

<div class="main-content">
  <div class="post">
    <div class="post-title">My First Blog Post</div>
    <div class="post-body">Some content here...</div>
  </div>
</div>

<div class="sidebar">
  <div class="widget">Related Posts</div>
</div>

<div class="footer">
  <div class="copyright">2025 My Name</div>
</div>
```

**Semantic HTML (what professionals write):**

```html
<!-- Every element communicates its purpose -->
<header>
  <a href="/" class="logo">My Site</a>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>My First Blog Post</h1>
    <p>Some content here...</p>
  </article>

  <aside>
    <h2>Related Posts</h2>
  </aside>
</main>

<footer>
  <p>&copy; 2025 My Name</p>
</footer>
```

The second version looks the same in a browser, but a screen reader user pressing the "navigate by landmark" shortcut key can jump directly to `<main>` and skip the navigation entirely. A search engine sees `<article>` and understands that content is a self-contained piece of writing. The difference is invisible to sighted users but meaningful to everyone else.

### The Landmark Elements

These are the elements you reach for to define the major regions of a page:

| Element | What it represents | Rule |
|---------|-------------------|------|
| `<header>` | Introductory content: site name, logo, top navigation | Can appear in `<body>` or inside `<article>`/`<section>` |
| `<nav>` | A set of navigation links | Use only for major navigation — not every group of links |
| `<main>` | The primary content of the page | Only one per page |
| `<article>` | A self-contained piece of content that makes sense on its own (blog post, product card, tweet) | Would still make sense if you extracted it and put it on another page |
| `<section>` | A thematic grouping of content that needs a heading | Always has an `<h2>` or deeper heading as its first child |
| `<aside>` | Content that is related to but separate from the main content (sidebars, pull quotes, related links) | |
| `<footer>` | Footer for a page or section — copyright, links, contact info | Can appear in `<body>` or inside `<article>`/`<section>` |

### Content Elements

Beyond landmarks, use these elements for the content itself:

| Element | What it represents |
|---------|-------------------|
| `<h1>` through `<h6>` | Headings — create document outline |
| `<p>` | A paragraph of text |
| `<ul>` / `<ol>` | Unordered and ordered lists |
| `<li>` | A list item (must be inside `<ul>` or `<ol>`) |
| `<figure>` + `<figcaption>` | An image, diagram, or code example with a caption |
| `<blockquote>` | A quotation from another source |
| `<time>` | A date or time value |
| `<address>` | Contact information |
| `<strong>` | Text of strong importance (bold, semantically meaningful) |
| `<em>` | Emphasized text (italic, semantically meaningful) |

:::warning Common Mistake
`<b>` and `<i>` are not the same as `<strong>` and `<em>`. `<b>` and `<i>` are purely visual — they just change the appearance. `<strong>` and `<em>` carry semantic meaning that screen readers can convey. If you want to bold or italicize for emphasis, use the semantic elements. If you want to bold or italicize purely for visual styling (like a book title or a technical term), use CSS.
:::

## Accessibility Essentials

Accessibility means building pages that work for people regardless of how they interact with them — mouse, keyboard, touch, or screen reader. Three areas account for the majority of accessibility failures on the web.

### Images Must Have Alt Text

A screen reader, when it encounters an `<img>` with no `alt` attribute, reads out the file name — which is usually something like "hero-image-2024-v3-FINAL.jpg" — or says nothing useful at all. The `alt` attribute provides a text alternative.

```html
<!-- Fails accessibility: the screen reader reads the filename -->
<img src="team-photo.jpg" />

<!-- Correct: describes what the image shows -->
<img src="team-photo.jpg" alt="The engineering team gathered around a whiteboard covered in diagrams" />

<!-- Decorative image: empty alt tells screen readers to skip it entirely -->
<!-- Use this for images that are purely visual and add no information -->
<img src="background-texture.png" alt="" />
```

The rule: if removing the image would cause a sighted user to lose information, write a description of that information. If the image is purely decorative, use `alt=""` (not omitting the attribute — omitting it is an error; an empty string is intentional silence).

### Forms Need Labels

Placeholder text is not a label. When a user clicks into a field, the placeholder disappears — and if they need to check what they were filling in, there is nothing left to read. Screen readers also cannot reliably associate placeholder text with an input.

```html
<!-- Fails accessibility: placeholder vanishes on focus, no accessible label -->
<input type="email" placeholder="Enter your email" />

<!-- Correct: label persists, linked to input via matching for/id -->
<label for="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  autocomplete="email"
  placeholder="you@example.com"
/>
```

The `for` attribute on the label must exactly match the `id` on the input. When they are linked correctly, clicking the label text also focuses the input — which doubles the click target and helps users with motor impairments. Screen readers read the label text when the user navigates to the field.

You can also wrap the input inside the label to associate them without `for`/`id`:

```html
<label>
  Email address
  <input type="email" name="email" autocomplete="email" />
</label>
```

Both approaches are valid. The `for`/`id` approach is more flexible (the label does not have to be adjacent to the input).

### Heading Hierarchy

Headings do not just make text big — they create a document outline that screen reader users navigate by. A screen reader user can list all the headings on a page and jump between them, just like a sighted user skims a page by reading the large text first.

```html
<!-- Broken: h2 skipped, heading used to make text bigger, not for structure -->
<h1>My Portfolio</h1>
<h3>About Me</h3>       <!-- skipped h2! creates a gap in the outline -->
<h2>Projects</h2>       <!-- now the outline goes 1 → 3 → 2, which is nonsense -->

<!-- Correct: one h1, then h2 for main sections, h3 for subsections -->
<h1>My Portfolio</h1>
  <h2>About Me</h2>
  <h2>Projects</h2>
    <h3>Project One</h3>
    <h3>Project Two</h3>
  <h2>Contact</h2>
```

The rules:
- One `<h1>` per page — it names the page, like a document title
- Never skip levels (no jumping from `<h2>` to `<h4>`)
- Use headings for structure, not for styling — if you want large text, use CSS

:::warning Common Mistake
Using `<h2>` or `<h3>` to make text visually large is one of the most common beginner mistakes. A heading communicates "this is a section title in the document structure." If you want big text that is not a section heading, use a `<p>` or `<span>` and style it with CSS.
:::

## HTML5 Input Types

Most beginners use `<input type="text">` for everything. HTML5 added over a dozen specific input types that give you free validation, better mobile keyboards, and native UI controls without any JavaScript.

```html
<!-- Email: validates that the value contains @, shows email keyboard on mobile -->
<input type="email" name="email" autocomplete="email" />

<!-- Phone: shows numeric keyboard on mobile -->
<input type="tel" name="phone" autocomplete="tel" />

<!-- Number: only accepts numeric values, shows increment/decrement arrows -->
<input type="number" name="quantity" min="1" max="100" />

<!-- Date: shows a native date picker -->
<input type="date" name="birthdate" />

<!-- URL: validates URL format -->
<input type="url" name="website" />

<!-- Search: shows a clear button, sometimes has different styling -->
<input type="search" name="q" />

<!-- Password: masks the input characters -->
<input type="password" name="password" autocomplete="current-password" />

<!-- Range: renders as a slider -->
<input type="range" name="volume" min="0" max="100" value="50" />

<!-- Color: shows a color picker -->
<input type="color" name="theme-color" />
```

Using the right input type is one of the easiest wins in HTML. A user on a phone filling in a date field expects a calendar picker — giving them a plain text box is a frustrating experience that specific input types prevent entirely.

## A Full Page Example

Putting everything together, here is what a well-structured HTML page looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Jane Doe — full-stack developer based in Austin, TX" />
    <title>Jane Doe — Full-Stack Developer</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>

    <header>
      <a href="/" class="logo">Jane Doe</a>
      <nav aria-label="Primary navigation">
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>

      <section id="about" aria-labelledby="about-heading">
        <h1 id="about-heading">Full-Stack Developer</h1>
        <p>I build accessible, performant web applications.</p>
        <figure>
          <img src="profile.jpg" alt="Jane Doe smiling in a coffee shop" />
          <figcaption>Currently based in Austin, TX</figcaption>
        </figure>
      </section>

      <section id="projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading">Projects</h2>

        <article>
          <h3>Budget Tracker App</h3>
          <p>A React application for tracking personal expenses...</p>
          <a href="https://github.com/janedoe/budget-tracker">View on GitHub</a>
        </article>

        <article>
          <h3>Restaurant Menu API</h3>
          <p>A Node.js REST API with Express and MongoDB...</p>
          <a href="https://github.com/janedoe/menu-api">View on GitHub</a>
        </article>

      </section>

      <section id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Get in Touch</h2>

        <form action="/contact" method="POST">
          <label for="name">Full name</label>
          <input type="text" id="name" name="name" autocomplete="name" required />

          <label for="contact-email">Email address</label>
          <input type="email" id="contact-email" name="email" autocomplete="email" required />

          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>

          <button type="submit">Send message</button>
        </form>

      </section>

    </main>

    <footer>
      <p>&copy; <time datetime="2025">2025</time> Jane Doe. All rights reserved.</p>
    </footer>

  </body>
</html>
```

Notice a few things this example does that the basics do not show: `aria-label` on the `<nav>` tells screen readers "this is the primary navigation" (useful when there are multiple nav elements). `aria-labelledby` links each `<section>` to its heading, so screen readers announce the section name when users navigate by landmark. These are small additions with meaningful impact.

## Activity

You will build a personal portfolio page from scratch in plain HTML — no CSS, no JavaScript, no frameworks. The goal is to write correct, meaningful HTML structure.

**Starter structure to build toward:**

```
index.html
  ├── <header> with logo text and nav with 3 links
  ├── <main>
  │     ├── <section id="about"> with h1 and a paragraph
  │     ├── <section id="projects"> with h2 and at least 2 <article> elements
  │     └── <section id="contact"> with h2 and a form
  └── <footer> with name and year
```

**Steps:**

1. Create a new file called `index.html`. Write the document shell from memory — do not paste it. Include all required `<head>` elements.
2. Add the `<header>` with your name as a text link and a `<nav>` with three anchor links pointing to `#about`, `#projects`, and `#contact`.
3. Add the `<main>` element. Inside it, add three `<section>` elements, each with the correct `id` and a heading.
4. In the projects section, write at least two `<article>` elements. Each should have an `<h3>` title, a `<p>` description, and a link.
5. In the contact section, write a `<form>` with labeled inputs for name, email, and a `<textarea>` for a message. Add a submit button.
6. In the about section, add an image (you can use a placeholder like `https://via.placeholder.com/300x300`) with a meaningful `alt` attribute.
7. Open your file in a browser and verify the page looks structurally correct even with no CSS.
8. Paste your file URL into [validator.w3.org](https://validator.w3.org) or copy-paste the HTML into the validator. Fix every error before moving on.

:::tip Success Check
Your page passes when: (1) the W3C validator shows zero errors and zero warnings, (2) tabbing through the page with just your keyboard moves through links and form fields in a logical order, (3) if you read the heading text only — ignoring all other content — the headings describe the page structure like a table of contents.
:::

## Key Takeaways

- When choosing an element, ask "what is this content?" not "how should this look?" — appearance is CSS's job
- Every page needs exactly one `<h1>`, and heading levels must nest without skipping
- Every `<img>` requires an `alt` attribute — a description for meaningful images, an empty string `alt=""` for decorative ones
- Every form `<input>` needs a `<label>` connected via matching `for` and `id` attributes
- The `lang` attribute on `<html>` is required; the `viewport` meta is required for mobile; `charset` is required for special characters
- Use specific `input` types (`email`, `tel`, `date`) to get free validation and better mobile keyboards
- Validate your HTML — errors in the document structure cause real problems for screen readers and search engines
