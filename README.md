<img width="838" height="238" alt="image" src="https://github.com/user-attachments/assets/78892fc8-205d-469f-88ba-fe895a47c163" />


> **A community-powered local help platform — connecting people who need assistance with neighbors ready to help.**

NeedHelp is a full-stack neighborhood assistance marketplace. Users post local help requests, browse nearby tasks, respond as helpers, chat securely in-app, manage a wallet for paid tasks, and build reputation through karma and reviews — all in a fast, mobile-friendly experience designed for real communities.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Pages & Screens](#pages--screens)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)
- [Smoke Test Checklist](#smoke-test-checklist)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Features

### For People Seeking Help
- Post detailed help requests with title, description, location, category, urgency level, and optional reward
- Geolocation support for automatic location detection with manual address/landmark fallback
- AI-assisted title and description suggestions when drafting a request
- Option to attach a monetary reward, deducted from your in-app wallet

### For Helpers
- Browse open requests filtered by category, urgency, or keyword search
- Respond to requests and connect with the requester through secure in-app messaging
- Build reputation through karma points and community reviews

### Platform-Wide
- JWT-based authentication with session persistence
- In-app messaging with conversation starring and muting
- Wallet with transaction history, top-up flow, and statement download
- Notifications system
- SOS / safety mode toggle
- Public user profiles with trust signals (karma, ratings, verification theme)
- Activity and helping history log
- 14 request categories covering everyday to emergency needs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS, Framer Motion, Lucide React |
| Backend | Node.js, Express 5, Mongoose, JWT, bcryptjs |
| Database | MongoDB |
| Security | Helmet, CORS, express-rate-limit |
| Auth | JWT (bearer token), bcryptjs password hashing |

---

## Folder Structure

```text
needhelp/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── modules/          # Feature modules (auth, home, requests, wallet, etc.)
│   │   ├── routes/           # App routing and route guards
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── server/                   # Express + MongoDB backend
│   ├── api.js                # Main API handler
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── DEPLOYMENT.md         # Hosting and deployment notes
├── scripts/                  # Utility scripts
└── package.json              # Root convenience scripts
```

---

## Pages & Screens

### Public Routes

| Route | Description |
|---|---|
| `/login` | User sign-in |
| `/register` | New account registration |
| `/forgot-password` | Password reset flow |

### Protected Routes (requires login)

| Route | Description |
|---|---|
| `/home` | Personalized dashboard |
| `/browse` | Browse and filter help requests |
| `/post` | Create a new help request |
| `/requests/:requestId` | Request detail view |
| `/my-requests` | Your posted requests |
| `/messages` | In-app conversations |
| `/wallet` | Wallet balance, transactions, top-up |
| `/profile` | Edit your profile |
| `/users/:userId` | Public profile of another user |

> Unauthenticated users are redirected to `/login`. Authenticated users accessing guest routes are redirected to `/home`.

---

## API Overview

All endpoints are mounted under `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/reset-password` | Password reset |
| `GET` | `/api/requests` | List requests (supports `query`, `category`, `urgency` filters) |
| `GET` | `/api/requests/:requestId` | Request detail |
| `POST` | `/api/requests` | Create a request |
| `POST` | `/api/requests/:requestId/help` | Offer help on a request |
| `POST` | `/api/requests/:requestId/responses` | Submit a response |
| `POST` | `/api/requests/:requestId/complete` | Mark a request complete |
| `POST` | `/api/requests/:requestId/delete` | Delete a request |
| `POST` | `/api/requests/:requestId/chat` | Send a message on a request |
| `GET` | `/api/profile` | Get own profile |
| `PUT` | `/api/profile` | Update own profile |
| `GET` | `/api/profiles/:userId` | Get public profile |
| `GET` | `/api/messages` | Get conversations |
| `POST` | `/api/messages/:conversationId` | Send message |
| `POST` | `/api/messages/:conversationId/settings` | Star/mute conversation |
| `GET` | `/api/wallet` | Wallet info and transactions |
| `POST` | `/api/wallet/add-money` | Top-up wallet |
| `GET` | `/api/notifications` | Get notifications |
| `POST` | `/api/notifications/mark-read` | Mark notifications read |
| `POST` | `/api/sos/toggle` | Toggle SOS/safety mode |
| `POST` | `/api/request-suggestions` | Get AI-style request suggestions |
| `GET` | `/api/request-form` | Request form metadata |

---

## Environment Variables

### Frontend — `client/.env`

Copy from `client/.env.example`:

```env
VITE_API_BASE_URL=
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:4000
```

| Variable | Usage |
|---|---|
| `VITE_API_BASE_URL` | Leave empty for local dev (Vite proxy handles routing). In production, set to your backend origin, e.g. `https://api.yourdomain.com` (no trailing slash). |
| `VITE_DEV_API_PROXY_TARGET` | Backend address for local Vite proxy. Default: `http://127.0.0.1:4000` |

### Backend — `server/.env`

Copy from `server/.env.example`:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27018/needhelp
JWT_SECRET=change-this-in-production
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

| Variable | Usage |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — **change before deploying** |
| `CLIENT_ORIGIN` | Comma-separated list of allowed frontend origins for CORS |

> **Note:** The `.env.example` uses MongoDB on port `27018`. The backend fallback defaults to `27017`. For local development, follow the `.env.example` value (`27018`) unless you intentionally run MongoDB on the default port.

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/your-username/needhelp.git
cd needhelp
```

**2. Install dependencies**

```bash
cd client && npm install
cd ../server && npm install
```

**3. Configure environment files**

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Edit the `.env` files as needed (see [Environment Variables](#environment-variables)).

**4. Start MongoDB**

Make sure your local MongoDB instance is running on the port specified in `server/.env` (default: `27018`).

**5. Start the backend**

```bash
npm --prefix server run dev
```

**6. Start the frontend** (in a separate terminal)

```bash
npm --prefix client run dev
```

**7. Open in browser**

```text
http://localhost:5173
```

---

## Available Scripts

### Root

| Script | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run dev:client` | Same as above |
| `npm run dev:server` | Start backend dev server |
| `npm run build` | Build frontend for production |
| `npm run start` | Start backend in production mode |

### Frontend (`client/`)

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |

### Backend (`server/`)

| Script | Description |
|---|---|
| `npm run dev` | Start the backend server |
| `npm run start` | Start in production mode |

---

## Deployment

### Frontend

Best deployed to **Vercel** or **Netlify**.

| Setting | Value |
|---|---|
| Root directory | `client` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `VITE_API_BASE_URL=https://your-backend-domain.com` |

### Backend

Best deployed to **Render**, **Railway**, or any Node.js host.

| Setting | Value |
|---|---|
| Root directory | `server` |
| Start command | `npm start` |

### Production Checklist

- [ ] Set `VITE_API_BASE_URL` on the frontend to your backend's public URL
- [ ] Set `CLIENT_ORIGIN` on the backend to your frontend's domain(s)
- [ ] Use a hosted MongoDB instance (e.g. MongoDB Atlas)
- [ ] Replace `JWT_SECRET` with a strong, unique secret
- [ ] Review `CORS` and rate-limit settings for production traffic

For detailed hosting notes, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Demo Credentials

> ⚠️ **These credentials are for local development and demo use only.** Do not use in a production environment.

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `password123` |
| Display Name | Community Hero |

The demo account comes pre-loaded with sample help requests, wallet transactions, reviews, helping history, and notifications so you can explore the full platform immediately.

---

## Smoke Test Checklist

After setup, run through this quick checklist to confirm everything works end-to-end:

- [ ] Register a new account at `/register`
- [ ] Log in at `/login`
- [ ] Log out, then log back in
- [ ] Visit `/browse` — confirm requests load and filters work
- [ ] Visit `/post` — submit a new help request
- [ ] Visit `/wallet` — confirm balance loads and top-up flow completes
- [ ] Refresh on a protected route — confirm session persists

---

## Known Limitations

| Area | Status |
|---|---|
| Payments | Wallet top-up and paid requests are **simulated**. No real payment gateway is integrated. |
| OAuth | Google and Facebook login buttons are **UI placeholders** — full OAuth is not implemented. |
| AI Suggestions | Request suggestion logic is **backend-driven/simulated**. No external AI model is integrated. |
| Real-time Chat | Messaging is **request/response based**, not WebSocket-powered. No live push updates. |
| Video Calls | The video call action opens a **Jitsi room** — no custom video infrastructure. |
| Tests | No test suite is configured in the current package scripts. No CI/CD pipeline is set up. |
| Backend Structure | Most server logic is concentrated in a single `api.js` file — not yet split into modular controllers. |
| Production Readiness | This project is suitable for **demo and staging** use. It is not hardened for real financial transactions or production-scale traffic. |

---

## Future Improvements

These are natural next steps for evolving NeedHelp into a production-grade platform:

- **Real payment gateway** — Integrate Stripe or Razorpay for actual wallet funding and paid tasks
- **WebSocket-powered chat** — Live messaging with Socket.io or a similar library
- **Full OAuth** — Google and Facebook login via Passport.js or NextAuth
- **Image uploads** — Allow profile photos and request attachments via Cloudinary or S3
- **Push notifications** — Browser push or mobile notifications for new messages and request activity
- **Map-based browsing** — Interactive map view for requests using Leaflet or Google Maps
- **Admin moderation tools** — Dashboard for reviewing flagged content and managing users
- **Modular backend architecture** — Refactor `api.js` into separate controllers, services, and route files
- **Test coverage and CI/CD** — Add unit and integration tests with Jest; set up GitHub Actions
- **Mobile app** — React Native client sharing the same backend

---

## Categories

NeedHelp supports 14 request categories:

`Home & Daily Help` · `Vehicle & Transport` · `Medical & Emergency` · `Delivery & Pickup` · `Student Help` · `Pet & Animal Help` · `Personal Help` · `Event & Social` · `Skill-Based Help` · `Tech Help` · `Shopping Help` · `Local Information` · `Unique Requests` · `Quick Emergency`

---

## Trust & Safety

NeedHelp is designed with community safety in mind:

- Karma points and ratings build verifiable helper reputation
- In-app chat keeps personal contact details private until trust is established
- SOS mode signals emergency context on a user's account
- JWT-secured sessions with automatic logout on token expiry
- Rate limiting and CORS protection on the backend

---

<p align="center">Built for communities. Made to help.</p>
