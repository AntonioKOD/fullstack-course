---
sidebar_position: 2
title: HTML Fundamentals
---

# HTML Fundamentals

HTML (HyperText Markup Language) is the skeleton of every web page. Writing *semantic* HTML — using elements for their intended purpose — makes your pages accessible, SEO-friendly, and easier to maintain.

## The Document Structure

Every HTML page starts with this boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="A brief description of this page" />
    <title>Page Title — Site Name</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <!-- content here -->
  </body>
</html>
```

:::tip Why `lang="en"`?
Screen readers use the `lang` attribute to determine which language model to use for pronunciation. Always set it.
:::

## Semantic Elements

Non-semantic HTML (what beginners write):

```html
<!--  div soup — no meaning -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main-content">
  <div class="post">...</div>
</div>
<div class="footer">...</div>
```

Semantic HTML (what you should write):

```html
<!--  semantic — clear structure and accessible -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>

  <aside>
    <h2>Related Posts</h2>
  </aside>
</main>

<footer>
  <p>&copy; 2025 Your Name</p>
</footer>
```

## Key Semantic Elements

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content or navigation for a page/section |
| `<nav>` | Primary navigation links |
| `<main>` | The dominant content of the page (one per page) |
| `<article>` | Self-contained content (blog post, product card) |
| `<section>` | Thematic grouping with a heading |
| `<aside>` | Content tangentially related to main content |
| `<footer>` | Footer for a page or section |
| `<figure>` + `<figcaption>` | Images with captions |

## Accessibility Essentials

### Images must have alt text

```html
<!--  Missing alt -->
<img src="dog.jpg" />

<!--  Descriptive alt -->
<img src="dog.jpg" alt="A golden retriever catching a frisbee" />

<!--  Decorative image — empty alt tells screen readers to skip it -->
<img src="divider.png" alt="" />
```

### Forms need labels

```html
<!--  Placeholder is NOT a label -->
<input type="email" placeholder="Email" />

<!--  Label associated with input -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email" />
```

### Heading hierarchy

```html
<!--  Skipping levels -->
<h1>Page Title</h1>
<h3>Section</h3>  <!-- skipped h2! -->

<!--  Logical hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
```

## HTML5 Input Types

Use specific input types — browsers give you free validation and mobile keyboards:

```html
<input type="email" />     <!-- validates @ format, email keyboard on mobile -->
<input type="tel" />       <!-- numeric keyboard on mobile -->
<input type="number" />    <!-- spinners, validates numeric -->
<input type="date" />      <!-- native date picker -->
<input type="url" />       <!-- validates URL format -->
<input type="search" />    <!-- shows clear button -->
<input type="password" />  <!-- masks input -->
```

## Activity

1. Create `index.html` from scratch (no copy-paste of boilerplate)
2. Add a `<header>` with a `<nav>` containing 3 links
3. Add a `<main>` with two `<article>` elements, each with a heading and paragraph
4. Add a `<footer>` with your name and year
5. Add one image with proper `alt` text
6. Add a contact form with labeled `<input>` fields (name, email, message textarea)
7. Validate your HTML at [validator.w3.org](https://validator.w3.org) — zero errors

## Key Takeaways

- Use semantic elements — they communicate *meaning*, not just appearance
- Every `<img>` needs an `alt` attribute
- One `<h1>` per page; headings must be hierarchical
- Forms need `<label>` elements linked to inputs via `for`/`id`
- The `lang` attribute on `<html>` is required for accessibility
