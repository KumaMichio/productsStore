# Backend Documentation

## Location

`backend`

## Technology stack

- Java 17
- Spring Boot 3.1.2
- Spring Data JPA
- Spring Security
- Spring Boot Actuator
- SpringDoc OpenAPI
- Spring Kafka
- Spring Data Redis
- Flyway migrations
- MySQL 8
- JWT authentication
- OAuth2 client support

## Build and run

### Build

```bash
cd backend
mvn package
```

### Run

```bash
cd backend
mvn spring-boot:run
```

### Run packaged jar

```bash
java -jar target/shopapp-0.0.1-SNAPSHOT.jar
```

## Configuration

Main configuration file: `src/main/resources/application.yml`

### Important settings

- `server.port`: `8088`
- `spring.datasource.url`: `jdbc:mysql://localhost:3307/ShopApp?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true`
- `spring.datasource.username`: `root`
- `spring.datasource.password`: `${MYSQL_ROOT_PASSWORD}`
- `spring.jpa.hibernate.ddl-auto`: `none`
- `spring.flyway.locations`: `classpath:/db/migration,classpath:/dev/db/migration`
- `spring.kafka.bootstrap-servers`: `${KAFKA_BROKER_SERVER}:${KAFKA_BROKER_PORT}`
- `spring.data.redis.host`: `${REDIS_HOST}`
- `spring.data.redis.port`: `${REDIS_PORT}`
- `api.prefix`: `/api/v1`

> **Important:** The JDBC URL must include `characterEncoding=UTF-8&useUnicode=true`
> to correctly handle Vietnamese characters stored in MySQL utf8mb4 columns.

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | (see above) | Full JDBC URL including charset params |
| `MYSQL_ROOT_PASSWORD` | `Abc123456789@` | MySQL root password |
| `REDIS_HOST` | `localhost` | Redis hostname |
| `REDIS_PORT` | `6379` | Redis port |
| `KAFKA_BROKER_SERVER` | `localhost` | Kafka broker hostname |
| `KAFKA_BROKER_PORT` | `9092` | Kafka broker port |

## Docker image

Built by `DockerfileJavaSpring` at the project root.

### Build

```bash
docker build -t shopapp-spring:1.0.4 -f DockerfileJavaSpring .
```

### Run (standalone, connecting to host services)

```powershell
docker run -d -p 8088:8088 --name shopapp-spring `
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3307/ShopApp?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8&useUnicode=true" `
  -e REDIS_HOST="host.docker.internal" `
  -e KAFKA_BROKER_SERVER="host.docker.internal" `
  shopapp-spring:1.0.4
```

`host.docker.internal` resolves to the host machine from inside a Docker
container on Docker Desktop (Windows/Mac).

### Dockerfile details

- Build stage: `maven:3.8.4-openjdk-17-slim`
- Final stage: `eclipse-temurin:17-jre`
- Source copied from: `backend/` (project root relative)
- Exposes port `8088`

## API docs and health

- Swagger UI: `http://localhost:8088/swagger-ui.html`
- OpenAPI docs: `http://localhost:8088/api-docs`
- Health endpoint: `http://localhost:8088/api/v1/actuator/health`

## Flyway migrations

Located in `src/main/resources/dev/db/migration/`:

| Version | Description |
|---|---|
| V1 | Alter column types on categories, products, users, order_details |
| V2 | Change token columns |
| V3 | Add refresh token support |
| V4 | Create comments table |
| V5 | Create coupon table |

If Flyway reports a failed migration on startup, repair with:

```sql
DELETE FROM flyway_schema_history WHERE success = 0;
```

## Notes

- Redis caching is optional and toggled via `spring.data.redis.use-redis-cache`
- Kafka consumer/producer warnings on startup are non-fatal if Kafka is unreachable
- The `uploads/` directory inside the container stores product images
