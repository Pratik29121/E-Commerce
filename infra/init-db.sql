-- Runs automatically on first container start.
-- Each microservice owns its own database (database-per-service pattern).
CREATE DATABASE userdb;
CREATE DATABASE productdb;
CREATE DATABASE orderdb;
