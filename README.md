# Smart Bar — Frontend (Create React App)

React + Tailwind CSS (v3) frontend for Smart Bar, built with Create React App instead of Vite,
covering all three surfaces from the planning document: the guest ordering app, the waiter app,
and the admin dashboard.

## Setup

```bash
npm install
cp .env.example .env    # point these at your running backend if not on localhost:4000
npm start
```

Requires the backend (`smart-bar-backend`) running - see its README for setup. By default this
expects the API at `http://localhost:4000/api` and the Socket.io server at `http://localhost:4000`.

Build for production with `npm run build` (outputs to `build/`).

## Pages

- **`/`** — a simple landing page linking to every view (for demo/dev convenience only; in
  production each device would just be pointed straight at its own URL).
- **`/order`** — the guest app. Opens on a table picker (tap your table number - no QR code
  needed); `?table=<number>` still works as a shortcut if you set one up later.
- **`/waiter`** — the waiter app. No login: a waiter picks their name from a list once (stored in
  `localStorage` for the session), then sees their live order queue and can end orders with the
  guest's PIN.
- **`/kitchen`** and **`/bar`** — the kitchen and drinks/bar prep views. Both are the exact same
  component (`StationApp`), just parameterized by station name, since the logic is identical and
  only the item category differs. Staff see only their own items per order and mark each one
  ready with a single button press - **no PIN involved**.
- **`/admin`** — now a landing page of its own, linking out to each report/tool individually
  instead of everything being squeezed onto one screen:
  - `/admin/sales` — revenue totals for today/this week/this month, plus a day/week/month breakdown
  - `/admin/pins` — forgot-PIN lookup
  - `/admin/delivery-times` — avg. time-to-close per waiter
  - `/admin/best-sellers` — most-ordered items by date range
  - `/admin/low-stock` — items below the stock threshold (live via Socket.io)
  - `/admin/history` — full order history with placed, kitchen-ready, bar-ready, and closed timestamps
  - `/admin/quick-add` — add a menu item, waiter, or table, and delete a menu item that's no
    longer being sold (e.g. after it's permanently out of stock)

## How it matches the backend

- **Guest app**: fetches `/menu` on load, then keeps stock counts live via the `stock:update`
  socket event (joins the `guests` room). Adding items builds a local cart; "Place order" posts
  once to `/orders` with the table number and the full item list, then shows the returned PIN in
  a stamped ticket-style card — the one signature visual moment in this app, deliberately kept as
  the only flourish.
- **Waiter app**: joins `waiter:<id>` on selecting an identity, receives new orders via the
  `order:new` socket event without polling, and calls `/orders/:id/end` with the entered PIN. On
  a successful match, the order card disappears from that waiter's queue.
- **Kitchen / bar apps**: join `station:kitchen` or `station:bar` on load, fetch pending items from
  `/stations/:station/orders`, and mark items ready via `/stations/:station/orders/:orderId/items/:itemId/ready`
  - no PIN, just a button. Live updates come through `station:neworder` and `station:itemReady`,
  and once every item on an order is marked ready the assigned waiter gets an `order:ready` ping.
- **Admin dashboard**: each sub-page pulls its own endpoint independently, and the low-stock and
  PIN-lookup pages listen for `inventory:lowstock` / `order:completed` respectively to stay live.


## Design notes

- Palette: warm paper background for the guest app, an ink-dark theme for the waiter app (built
  for low-light bar environments and quick glanceability under pressure), amber/copper as the
  shared accent tying both together, with a muted moss green reserved for future "on shift" /
  success states.
- Type: Space Grotesk for headings, Inter for body text, IBM Plex Mono for numbers, prices, and
  PINs - so anything the eye needs to scan quickly is visually set apart from prose.
- The PIN ticket on order confirmation is the one intentional signature element; everything else
  is kept quiet and functional on purpose.

## Why Create React App instead of Vite

Functionally identical to the Vite version - same components, same pages, same logic. The only
differences are plumbing:
- Environment variables use the `REACT_APP_` prefix (`process.env.REACT_APP_API_URL`) instead of
  Vite's `import.meta.env.VITE_API_URL`.
- Tailwind is v3 here (configured via `tailwind.config.js` + PostCSS) rather than v4's Vite
  plugin, since v4's tooling assumes a Vite-based build.
- `npm start` runs the dev server (CRA's equivalent of `npm run dev`).

## Known simplifications (flagged for follow-up)

- The guest app currently expects a table **number** in the URL, not the backend's `qrToken`.
  Wiring up an endpoint to resolve `qrToken -> table` would let you rotate/reissue QR codes without
  guests being able to guess another table's URL - worth adding before printing real table codes.
- No waiter login exists by design (per your instruction), so the "Switch" button on the waiter
  app is trust-based - anyone at that device can pick any waiter's name. Fine for a single shared
  tablet per station; worth revisiting if waiters use personal devices.
# smartbarclient
