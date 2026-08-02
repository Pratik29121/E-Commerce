# Roadmap — Phases 2 to 5

Each phase is meant to be added *incrementally* onto the running Phase 1 MVP, not built from
scratch. Do them in order — each one motivates the next.

## Phase 2 — Service discovery & typed clients
- Add a **Eureka** server (new `discovery-server` module, port 8761)
- Each service registers with Eureka instead of using hardcoded URLs
- Replace `ProductClient`'s `RestTemplate` calls in order-service with **OpenFeign**
  (`@FeignClient(name = "product-service")`) — same behavior, far less boilerplate
- Add **Inventory Service** and **Cart Service** as separate services (currently inventory is
  just the `stockQuantity` field on Product, and cart is client-side only)
- Talking point: what changes when a URL becomes a logical service name resolved at runtime?

## Phase 3 — Resilience & async messaging
- Wrap the order → product Feign calls in **Resilience4j** (circuit breaker + retry + timeout);
  add a fallback (e.g. "pricing temporarily unavailable")
- Add **Kafka**: order-service publishes an `OrderPlaced` event after saving the order;
  **Notification Service** (new) consumes it and sends a simulated email
  (log it, or use a real provider like SendGrid in sandbox mode)
- Add **Redis** to cache product-service's hot reads (`GET /api/products/{id}` and search
  results), with cache invalidation on update/delete
- Talking point: why events instead of another synchronous call? What's eventual consistency,
  and where in this flow does the user see it?

## Phase 4 — Real authentication & configuration
- Replace user-service's self-issued JWTs with **Keycloak** (run as a container, configure a
  realm + client); the gateway validates tokens against Keycloak's JWKS endpoint instead of a
  shared secret
- Add a **Config Server** so all services pull `application.yml` from a shared Git repo instead
  of bundling it — useful once you have 6+ services with overlapping config
- Add **Review Service** and **Coupon Service**
- Talking point: symmetric (shared secret) vs asymmetric (public/private key) JWT verification —
  why does moving to Keycloak change which one you use?

## Phase 5 — Scale, observability, and the rest of the catalog
- **Docker Compose → Kubernetes**: write Deployments/Services/ConfigMaps for each service,
  a Horizontal Pod Autoscaler for product-service, and an Ingress in front of the gateway
- **Zipkin**: add distributed tracing so a single request across gateway → order → product shows
  up as one trace
- **Prometheus + Grafana**: expose `/actuator/prometheus` on each service, scrape it, build a
  dashboard (request rate, latency, error rate per service)
- Add **Recommendation Service** (start simple — "customers who bought X also bought Y" from
  order history — before reaching for anything ML-heavy)
- Talking point: what does a trace actually show you that logs don't? What's the difference
  between a liveness and readiness probe, and why do both matter in K8s?

## A note on scope

You don't need to finish Phase 5 to interview well. A candidate who deeply understands Phases
1-3 and can clearly explain *why* each piece exists will do better than one who bolted on all 8
services and every tool in the list without being able to defend a single design decision. Build
one phase, use it, break it on purpose, fix it — then move on.
