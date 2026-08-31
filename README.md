# SmartBar Client (fixed)

React client for guest ordering, waiter queue, kitchen/bar stations, and admin dashboard.

## What was fixed

The original source was missing the entire `src/lib/` folder and entry files, which caused webpack "Module not found" errors for:

- `./lib/ThemeContext`
- `../lib/api`
- `../lib/socket`
- `../lib/asArray`
- `./index.css`

This package restores those modules plus CRA entry points, Tailwind config, and a working `package.json`.

## Setup

```bash
cd smartbar-fixed
npm install
cp .env.example .env   # edit REACT_APP_API_URL if needed
npm start
```

App runs at http://localhost:3000 (CRA default). Backend is expected at http://localhost:5000.

## Routes

| Path | Screen |
|------|--------|
| `/` | Landing |
| `/order` | Guest ordering + payments |
| `/waiter` | Waiter live queue |
| `/kitchen` | Kitchen station |
| `/bar` | Bar station |
| `/admin` | Admin dashboard |

## Lib modules

| File | Role |
|------|------|
| `src/lib/api.js` | Axios instance (`api.get/post/delete`, `res.data`, multipart support) |
| `src/lib/socket.js` | Socket.IO client (`socket.emit` / `socket.on`) |
| `src/lib/asArray.js` | Safe array normalizer for API payloads |
| `src/lib/ThemeContext.jsx` | Dark/light theme (`useTheme`, `ThemeProvider`) |

`ThemeProvider` wraps the app in `src/index.js`.
