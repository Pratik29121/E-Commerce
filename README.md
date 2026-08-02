# Northline — E-Commerce Platform 

Deployed at : https://e-commerce-kd57zlq4f-pratik29121s-projects.vercel.app/



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

