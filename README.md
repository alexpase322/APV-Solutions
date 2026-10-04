# APV Business Solutions — Web (frontend)

React + Vite + Tailwind. Company website plus the NFC digital cards app (sales page, public cards, client dashboard and super admin). Deployed on **Vercel**.

The API lives in its own repository, **APV-back** (Express + MongoDB, deployed on Render).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

The app calls the API at `http://localhost:4000` by default. To point elsewhere, copy `.env.example` to `.env.local` and set `VITE_API_URL`.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Deploy (Vercel)

- Framework preset **Vite**, Root Directory **empty** (the project is at the repo root).
- Environment variable **`VITE_API_URL`** = the Render API URL (e.g. `https://apv-nfc-api.onrender.com`). The build stops with a clear error on Vercel if it's missing.
- `vercel.json` rewrites every route to `index.html` (SPA).

On the backend (Render), `CLIENT_URL` must include this site's domain(s) for CORS, and `PUBLIC_APP_URL` must be the domain used in NFC links (`https://apvsolutions.tech`).

## Routes

| Route | What |
|---|---|
| `/`, `/services`, `/portfolio`, `/about`, `/legal` | Company website |
| `/nfc` | NFC cards sales page |
| `/c/:code` | Public card (the URL programmed into each NFC chip) |
| `/login`, `/activate`, `/forgot-password`, `/reset-password` | Auth |
| `/dashboard` | Card owner: edit profile |
| `/admin`, `/admin/cards/:id` | Super admin: register sales, get NFC links, manage clients |

## Structure

```
src/
  pages/            website pages + nfc/, auth/, dashboard/, admin/
  components/       website sections + nfc/ (card, editor, UI), auth/, icons/
  context/          AuthContext (session)
  lib/              api client, NFC helpers, legal texts
  hooks/            useSeo, useNoIndex, useCardTheme
```
