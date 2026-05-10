# Travello Backend

REST API and real-time backend for **Travello**, a travel-focused social application: accounts, trips, posts, messaging, notifications, administrative tools, and an AI-assisted trip discovery flow.

---

## Features

| Area | Summary |
|------|---------|
| **Authentication** | Email signup with OTP, sign-in, Google sign-in, password reset, JWT-based sessions via HTTP-only cookies |
| **Users & profiles** | Profiles, avatar upload, password updates, search |
| **Trips** | Create and manage trips with media uploads, discovery, joins and requests, listings and counts |
| **Posts** | Feed-style posts, likes, saved posts |
| **Social** | Follow relationships and counts |
| **Comments** | Comments on posts |
| **Notifications** | Persistence and reads; complements real-time delivery |
| **Messaging** | Conversations and messages |
| **Admin** | Separate admin auth, aggregated stats, user management |
| **AI** | Conversational suggestions grounded in indexed trip data (vector store + configurable LLM provider) |

---

## Tech Stack

- **Runtime**: Node.js, TypeScript (`ts-node`)
- **HTTP**: Express
- **Data**: MongoDB (Mongoose)
- **Search / AI context**: Vector database for trip embeddings (optional at runtime)
- **Real-time**: Socket.IO
- **Media**: Cloudinary
- **Email**: Nodemailer
- **Hardening**: Helmet, CORS allowlist, cookie-parser, bcrypt

---

## Architecture

Layered layout: HTTP routes invoke controllers; controllers call use cases; use cases orchestrate repositories and integrations. Mongoose models and infrastructure utilities sit at the edge.

High-level shape:

```
Clients → Express (middleware) → Controllers → Use cases → Repositories → MongoDB
                     ↘ integrations (storage, AI, mail, realtime)
```

See `src/` for the concrete module tree (`frameworks/`, `controllers/`, `usecase/`, `repository/`, `interfaces/`, `entities/`).

---

## API & real-time

- HTTP routes are grouped under **`/api/*`**. Paths and payloads are defined in `src/frameworks/routes/` and the corresponding controllers.
- **Auth** is enforced by middleware on most user-facing routes; treat any exception as intentional only for local development unless you secure it.
- Socket connections share the HTTP server; see `src/frameworks/configs/socketio*.ts` for connection options (CORS aligns with REST).

Configure allowed **CORS origins** in the Express and Socket.IO config when you deploy new frontends.

---

## Configuration

Create a `.env` in the project root. **Do not commit secrets.**

Use names that match your codebase (search `process.env` in `src/` for the authoritative list). Typical groups:

| Category | Examples (names vary by deployment) |
|----------|----------------------------------------|
| Core | Mongo connection URI, HTTP port, JWT secret, `NODE_ENV` |
| Auth | OAuth client identifiers |
| Mail | SMTP or provider credentials |
| Media | Cloud object / CDN API keys |
| Vector / AI | Vector DB URL and keys, embedding and chat provider keys |

---

## Scripts

```bash
npm install
npm run dev      # nodemon + ts-node (watches src/)
npm run start    # ts-node ./src/server.ts
npm run pm2start # ts-node with explicit tsconfig (PM2-friendly)
```

---

## Prerequisites

- Node.js (LTS, e.g. 18+)
- MongoDB
- Optional: vector DB, media host, OAuth, SMTP, AI provider credentials — only if you use those features

---

## Project status

Automated tests are not wired yet (`npm test` is a placeholder in `package.json`).

---

## License

ISC (see `package.json`).
