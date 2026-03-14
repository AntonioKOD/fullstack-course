---
sidebar_position: 6
title: Challenge — E-Commerce Store
---

# Challenge — E-Commerce Store

## Objective

Build a React e-commerce front end with Zustand for cart and auth state management, and TanStack Query for product data fetching.

## Requirements

### Stores (40 points)

**Cart Store** (with `persist` + `devtools`)
- [ ] `items: CartItem[]` — `{ product: Product; quantity: number }`
- [ ] `addItem(product)` — adds or increments quantity
- [ ] `removeItem(productId)` — removes completely
- [ ] `updateQuantity(productId, qty)` — clamp to min 1
- [ ] `clearCart()` — empty the cart
- [ ] Computed: `total` (sum of price × quantity), `itemCount`
- [ ] Persisted to `localStorage`

**Auth Store** (with `devtools`)
- [ ] `user: User | null`
- [ ] `isLoading: boolean`, `error: string | null`
- [ ] `login(email, password)` — async action calling `/api/auth`
- [ ] `logout()` — clear user
- [ ] `initialized: boolean` — true after first auth check

### Pages (40 points)

- [ ] **Product Listing** (`/`) — grid of products, add to cart button
- [ ] **Product Detail** (`/products/:id`) — full info, quantity selector, add to cart
- [ ] **Cart** (`/cart`) — items list, quantity controls, total, checkout button
- [ ] **Checkout** (`/checkout`) — protected route, order summary, place order form

### Quality (20 points)

- [ ] No `any` in TypeScript
- [ ] Cart badge in header shows total item count
- [ ] Toast notifications on add/remove from cart
- [ ] Cart persists across page refreshes
- [ ] Login redirects back to the page the user was on

## API Endpoints (mock or real)

```ts
GET  /api/products         — list products (paginated)
GET  /api/products/:id     — product detail
POST /api/auth/login       — { email, password } → { user, token }
POST /api/auth/logout
GET  /api/auth/me          — current user from token
POST /api/orders           — place order (protected)
```

## Grading

| Criteria | Points |
|----------|--------|
| Cart store with all actions | 15 |
| Cart persistence (localStorage) | 10 |
| Auth store with async login/logout | 15 |
| Product listing page | 10 |
| Cart page with quantity controls | 15 |
| Protected checkout route | 10 |
| Header cart badge | 5 |
| TypeScript quality | 10 |
| Toast notifications | 5 |
| Responsive design | 5 |
| **Total** | **100** |

## Bonus

- Wishlist store with `persist`
- Recently viewed products (ring buffer — keep last 5)
- Apply coupon codes (discount state in cart store)
- Zustand devtools: action names on every set call
- Animate cart badge count with Framer Motion
