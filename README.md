# Northline — E-Commerce Platform 

Deployed at : https://product-service-gnwp.onrender.com



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

  secret-sharing approach is also exactly what Keycloak (Phase 4) replaces with a proper
  identity provider and public-key verification.
- **Known limitation, on purpose**: placing an order isn't a real distributed transaction — if
  stock reservation fails on item 2 of 3, item 1's stock has already been decremented with no
  rollback. That's a genuine gap, and naming it unprompted (plus explaining the saga pattern as
  the fix) reads far better in an interview than pretending it's not there.
