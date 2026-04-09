# NeedHelp Deployment Guide

## Architecture

- `client/`: React + Vite frontend
- `server/`: Express + MongoDB backend
- Production expectation: deploy frontend and backend separately, then point the frontend to the backend with `VITE_API_BASE_URL`

## Environment Variables

### Frontend

Create `client/.env` for local overrides or set these in your hosting provider:

```env
VITE_API_BASE_URL=https://your-api-domain.example.com
VITE_DEV_API_PROXY_TARGET=http://127.0.0.1:4000
```

Notes:

- Leave `VITE_API_BASE_URL` empty for local Vite proxy usage.
- In production, `VITE_API_BASE_URL` should be the full backend origin without a trailing slash.

### Backend

Set these in the backend host:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=https://your-frontend-domain.example.com
```

Notes:

- `CLIENT_ORIGIN` accepts a comma-separated list if you need more than one origin.
- Use a hosted MongoDB instance for deployment.
- Replace the default JWT secret before going live.

## Recommended Hosting Split

### Frontend

- Recommended: Vercel or Netlify
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

### Backend

- Recommended: Render, Railway, or a Node host that supports persistent env vars
- Root directory: `server`
- Start command: `npm start`

## Local Development

### Frontend

```bash
npm --prefix client run dev
```

### Backend

```bash
npm --prefix server run dev
```

The frontend will proxy `/api` requests to `VITE_DEV_API_PROXY_TARGET`, which defaults to `http://127.0.0.1:4000`.

## Smoke Test Checklist

Before deployment:

1. Register a new account.
2. Log in with that account.
3. Log out and log back in.
4. Open `/browse` and verify requests load.
5. Open `/post` and submit a request.
6. Open `/wallet` and verify the wallet loads and top-up flow completes.
7. Refresh on a protected route and confirm the session still works.

## Current Product Notes

- Wallet payments are UI-clean but still non-live under the hood.
- Google and Facebook buttons are placeholders until real OAuth is added.
- This is suitable for demo/staging deployment, not live financial transactions.
