# Northline — E-Commerce Platform (Phase 1 MVP)

A microservices e-commerce backend (Spring Boot 3.5.9, Java 25 LTS) with a React + Tailwind storefront.
This is **Phase 1** of a larger roadmap — see [ROADMAP.md](./ROADMAP.md) for what comes next
(Eureka, OpenFeign, Kafka, Redis, Resilience4j, Keycloak, Docker/K8s, observability).

Want to put this live for free (e.g. to share in an interview)? See [DEPLOY.md](./DEPLOY.md).

**Requires JDK 25** if you're running services outside Docker (e.g. in IntelliJ). Docker builds
already pull `eclipse-temurin:25` images, so `docker-compose up` needs nothing extra installed.

## Architecture

```
                        ┌──────────────────┐
   Browser  ──────────▶ │   React frontend │  (localhost:5173)
                        └────────┬─────────┘
                                 │ REST (JWT in Authorization header)
                                 ▼
                        ┌──────────────────┐
                        │   API Gateway     │  (localhost:8080)
                        │ Spring Cloud GW   │
                        └────────┬─────────┘
                    ┌────────────┼────────────┐
                    ▼            ▼             ▼
             ┌───────────┐ ┌───────────┐ ┌────────────┐
             │   User    │ │  Product  │ │   Order    │
             │  Service  │ │  Service  │ │  Service   │
             │  :8081    │ │  :8082    │ │  :8083     │
             └─────┬─────┘ └─────┬─────┘ └──────┬─────┘
                   │             │               │
                   ▼             ▼               │  (calls product-service
             ┌──────────┐  ┌──────────┐          │   synchronously to price
             │ userdb   │  │productdb │◀─────────┘   + reserve stock)
             └──────────┘  └──────────┘
                                  ┌──────────┐
                                  │ orderdb  │
                                  └──────────┘
                    (one PostgreSQL instance, one DB per service)
```

**Why order-service calls product-service synchronously, not via events:** in Phase 1 there's
no message broker yet, so placing an order does two blocking HTTP calls per line item (price
lookup, then stock reservation). This is intentionally the simplest thing that works — and it's
also the exact pain point that later phases fix: OpenFeign cleans up the client code, Resilience4j
adds a circuit breaker so a slow product-service can't cascade into order-service, and Kafka
eventually turns this into an async saga. Being able to explain *why* Phase 1 is simple and what
specifically breaks at scale is a stronger interview answer than jumping straight to Kafka without
understanding what problem it solves.

## Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 8080 | Single entry point, routes to services, CORS |
| `user-service` | 8081 | Register/login, JWT issuance, user profile |
| `product-service` | 8082 | Catalog CRUD, search, stock |
| `order-service` | 8083 | Order placement, order history, calls product-service |

## Running it

### Option A — Docker Compose (recommended, runs everything)

```bash
docker-compose up --build
```

This starts Postgres (with `userdb`, `productdb`, `orderdb` auto-created), all four Spring Boot
services, and exposes the gateway at `http://localhost:8080`.

Then, separately, run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Option B — Run services individually (better for debugging one service in your IDE)

1. Start Postgres only: `docker-compose up postgres`
2. Import each `backend/*-service` folder into IntelliJ/Eclipse as a Maven project
3. Run each `*Application.java` main class (they default to `localhost` for the DB and
   for the product-service URL, so no env vars needed locally)
4. Run the frontend as above

## Trying it out

1. Register an account at `/register`
2. Browse/search the seeded product catalog (8 demo products across 4 categories)
3. Add items to your cart, check out
4. View order history at `/orders`

## Project structure

```
ecommerce-mvp/
├── backend/
│   ├── api-gateway/
│   ├── user-service/
│   ├── product-service/
│   └── order-service/
├── frontend/           # React + Vite + Tailwind
├── infra/
│   └── init-db.sql     # creates the 3 databases on first Postgres start
├── docker-compose.yml
└── ROADMAP.md           # phases 2-5: Eureka, Kafka, Redis, Keycloak, K8s, observability
```

## What to say about this in an interview

- **Database-per-service**: each service owns its schema; nothing reaches across databases.
  order-service doesn't join against product's tables — it asks product-service over HTTP and
  stores a *price snapshot* on the order line item, so a later price change doesn't retroactively
  change historical orders.
- **Stateless auth**: user-service issues JWTs signed with a shared secret; every other service
  can validate a token locally without calling back into user-service on every request. That
  secret-sharing approach is also exactly what Keycloak (Phase 4) replaces with a proper
  identity provider and public-key verification.
- **Known limitation, on purpose**: placing an order isn't a real distributed transaction — if
  stock reservation fails on item 2 of 3, item 1's stock has already been decremented with no
  rollback. That's a genuine gap, and naming it unprompted (plus explaining the saga pattern as
  the fix) reads far better in an interview than pretending it's not there.
