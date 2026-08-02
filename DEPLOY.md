# Deploying Northline for free

This deploys the whole stack — 4 backend services, Postgres, and the frontend — without
paying anything. The tradeoff for "free" is that backend services on Render's free tier
**sleep after 15 minutes of no traffic** and take 30-60s to wake up on the next request.
See "Before an interview / demo" at the bottom for how to work around that.

## What you'll end up with

- `https://your-app.vercel.app` — the React frontend, live
- `https://api-gateway-xxxx.onrender.com` — your API, live
- A permanent (non-expiring) free Postgres database on Neon, holding all 3 schemas

## Step 0 — Push this project to GitHub

Render and Vercel both deploy from a Git repo, not a local folder.

```bash
cd ecommerce-mvp
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repo on github.com, then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## Step 1 — Database: Neon (free, permanent)

1. Go to neon.com, sign up (no credit card needed), create a project
2. Neon gives you one database by default. Open the **SQL Editor** and run:
   ```sql
   CREATE DATABASE userdb;
   CREATE DATABASE productdb;
   CREATE DATABASE orderdb;
   ```
3. Go to **Connection Details** in the Neon dashboard. Note down:
   - **Host** (looks like `ep-cool-name-123456.us-east-2.aws.neon.tech`)
   - **Role name** (your DB user, often your project name)
   - **Password**

   You'll paste these into Render in Step 2 for all three backend services (`DB_HOST`,
   `DB_USER`, `DB_PASSWORD` — same values for all three, only `DB_NAME` differs).

Neon requires SSL, which is why `render.yaml` sets `DB_PARAMS=?sslmode=require` — the
code already reads that env var, nothing else to configure.

## Step 2 — Backend: Render Blueprint

1. Go to render.com, sign up (no credit card needed)
2. **New > Blueprint**, connect your GitHub repo — Render finds `render.yaml` automatically
3. Render will list all 4 services. For each `sync: false` field, it prompts you for a value:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD` — your Neon values (same across user/product/order-service)
   - `PRODUCT_SERVICE_URL` (on order-service), and `USER_SERVICE_URL` / `PRODUCT_SERVICE_URL` /
     `ORDER_SERVICE_URL` (on api-gateway) — leave these blank for now, see step 3
4. Click **Apply** — Render builds and deploys all 4 services. This takes 5-10 minutes
   the first time (each one builds its own Docker image from source)

## Step 3 — Wire the services together

This is a chicken-and-egg problem: the gateway needs the other services' URLs, but those
URLs don't exist until after the first deploy. So:

1. Once all 4 services show "Live" in the Render dashboard, open each one and copy its
   URL from the top of its page (e.g. `https://user-service-ab12.onrender.com`)
2. Go to order-service > Environment, set `PRODUCT_SERVICE_URL` to product-service's URL
3. Go to api-gateway > Environment, set:
   - `USER_SERVICE_URL` to user-service's URL
   - `PRODUCT_SERVICE_URL` to product-service's URL
   - `ORDER_SERVICE_URL` to order-service's URL
4. Each save triggers an automatic redeploy of that service (about 1 minute, no rebuild needed)

## Step 4 — Verify the backend

```bash
curl https://api-gateway-xxxx.onrender.com/api/products
```

First call after any idle period will be slow (cold start) — that's expected. You should
get back the 8 seeded products.

## Step 5 — Frontend: Vercel (free)

1. Go to vercel.com, sign up, **Add New > Project**, import the same GitHub repo
2. Set the **Root Directory** to `frontend`
3. Add an environment variable: `VITE_API_URL` = your api-gateway URL from Step 3
4. Deploy — Vercel gives you a live URL in about a minute

Open it, register an account, and try the full flow end to end.

## Before an interview / demo

Free services sleep after 15 minutes idle. Nothing is more awkward than an interviewer
watching a blank loading spinner for a minute. Fix it for the duration of your demo:

- Use a free uptime pinger like UptimeRobot or cron-job.org to hit each service's
  `/actuator/health` (or `/` for the gateway) every 10 minutes, starting ~30 minutes before
  your interview. This keeps all 4 services warm the whole time.
- Set it up once, turn it off after — no need to keep 4 services awake 24/7 for free.

## What this setup can't do (and that's fine to say out loud)

- No zero-downtime deploys, no autoscaling, no private networking — services talk to
  each other over the public internet via their `*.onrender.com` URLs, not an internal
  network. That's a real limitation of free tier, and exactly what Phase 2's Eureka +
  service discovery is designed to fix once you're paying for infrastructure that supports it.
- Cold starts compound — a single user request through the gateway can, worst case,
  wake up 3 sleeping services in sequence. That's why order-service's timeout to
  product-service was bumped to 45s for this deployment (see `RestTemplateConfig.java`) —
  without that, a cold order placement would time out and fail.
