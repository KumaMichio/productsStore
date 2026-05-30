# ShopApp Architecture

## Overview

`ShopApp` is a split frontend/backend web application:

- Backend: Java Spring Boot microservice with REST API and event-driven Kafka support.
- Frontend: Angular 17 SPA with server-side rendering support.
- Infrastructure: MySQL for persistence, Redis for cache, Kafka + Zookeeper for event streaming.

## Key responsibilities

### Backend

- Exposes REST API at `/api/v1`
- Handles authentication and authorization using Spring Security + JWT
- Persists data in MySQL through Spring Data JPA
- Uses Redis optionally for caching
- Publishes and consumes Kafka events
- Supports OAuth2 login configuration for social providers
- Serves file uploads from `uploads`

### Frontend

- Implements user-facing storefront UI
- Talks to backend API via `apiBaseUrl`
- Supports development mode and production build
- Uses Bootstrap 5 and Font Awesome for UI styling
- Uses `@auth0/angular-jwt` for JWT handling on the client side

## Deployment architecture

### Docker services

- `mysql8-container` - MySQL 8 database
- `phpmyadmin8-container` - phpMyAdmin admin UI
- `redis-container` - Redis cache server
- `shopapp-spring-container` - Spring Boot backend
- `zookeeper-01`, `zookeeper-02`, `zookeeper-03` - Zookeeper cluster nodes
- `kafka-broker-01`, `kafka-broker-02` - Kafka brokers

### Network

All containers attach to a bridge network named `shopapp-network`.

The backend container uses Docker environment variables to connect to MySQL, Redis, and Kafka in the same network.

## API and documentation

- Backend API prefix: `/api/v1`
- Swagger UI path: `/swagger-ui.html`
- OpenAPI docs path: `/api-docs`
- Actuator health path: `/api/v1/actuator/health`

## Configuration sources

- `backend/src/main/resources/application.yml`
- `frontend/src/environments/*`
- `deployment.yaml`
- `kafka-deployment.yaml`
