# Setup Guide

This guide explains how to run ShopApp locally and in Docker.

## Prerequisites

### Backend
- Java 17
- Maven
- MySQL 8 or compatible
- Redis (optional, if you want cache support)

### Frontend
- Node.js >= 18
- npm

### Docker (optional)
- Docker Desktop or Docker Engine
- docker-compose support

## Option 1: Run backend and frontend locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on port `8088` by default.

Make sure your MySQL database is available and the `ShopApp` schema exists.

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run start:dev
```

The Angular app starts on port `4300`.

### Notes

- Local frontend uses `src/environments/environment.ts`
- Default API base URL for development is `http://localhost:8088/api/v1`

## Option 2: Run with Docker and Docker Compose

### Quick start (recommended)

Use the provided scripts at the project root:

```powershell
# Start everything (Kafka + Zookeeper + MySQL + Redis + Backend)
.\start.ps1

# Stop everything
.\stop.ps1
```

Then run the frontend separately:

```bash
cd frontend
npm install --legacy-peer-deps
npm run start:dev
```

### Manual start

#### Start Kafka cluster first

```bash
docker-compose -f kafka-deployment.yaml up -d
```

#### Start application stack

```bash
docker-compose -f deployment.yaml up -d --build
```

This will start:

- Backend API at `http://localhost:8099`
- phpMyAdmin at `http://localhost:8100`
- MySQL on host port `3307`
- Redis on host port `6379`

### Running the backend container manually

If running the Spring Boot container standalone (outside docker-compose), use
`host.docker.internal` so the container can reach host services:

```powershell
docker run -d -p 8088:8088 --name shopapp-spring `
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3307/ShopApp?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true" `
  -e REDIS_HOST="host.docker.internal" `
  -e KAFKA_BROKER_SERVER="host.docker.internal" `
  shopapp-spring:1.0.4
```

### Verification

- Backend health: `http://localhost:8088/api/v1/actuator/health`
- Swagger UI: `http://localhost:8088/swagger-ui.html`
- Frontend: `http://localhost:4300`
- phpMyAdmin: `http://localhost:8100`

## Database setup

### Docker

The Docker setup creates the `ShopApp` database automatically.
Import the base schema before first run:

```powershell
docker cp shopapp.sql mysql8-container:/shopapp.sql
docker exec mysql8-container mysql -u root -p"Abc123456789@" ShopApp -e "source /shopapp.sql;"
```

### Seed lifestyle data

After schema import, seed the lifestyle product data:

```powershell
docker cp seed-lifestyle.sql mysql8-container:/seed-lifestyle.sql
docker exec mysql8-container mysql --default-character-set=utf8mb4 -u root -p"Abc123456789@" ShopApp -e "source /seed-lifestyle.sql;"

docker cp seed-products.sql mysql8-container:/seed-products.sql
docker exec mysql8-container mysql --default-character-set=utf8mb4 -u root -p"Abc123456789@" ShopApp -e "source /seed-products.sql;"
```

### Local

Create a MySQL schema named `ShopApp`, then import `shopapp.sql`.

## Admin account

A default admin account is created via the register API then promoted:

| Field | Value |
|---|---|
| Phone | `0900000001` |
| Password | `Admin@123456` |
| Role | admin |

To create your own admin: register normally, then run:

```sql
UPDATE users SET role_id = 2 WHERE phone_number = 'your_phone';
```

## Important notes

### Character encoding

Always use `--default-character-set=utf8mb4` when running SQL with Vietnamese
text via docker exec, to avoid mojibake:

```powershell
docker exec mysql8-container mysql --default-character-set=utf8mb4 -u root -p"..." ShopApp -e "..."
```

### Backend environment variables

- `SPRING_DATASOURCE_URL` — must include `characterEncoding=UTF-8&useUnicode=true`
- `MYSQL_ROOT_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`
- `KAFKA_BROKER_SERVER`
- `KAFKA_BROKER_PORT`

### Frontend environment URLs

- `src/environments/environment.ts` — `http://localhost:8088/api/v1` (local backend)
- `src/environments/environment.prod.ts` — `http://localhost:8099/api/v1` (Docker backend)
