# Docker and Kafka Deployment

This document explains the Docker Compose-based deployment for the ShopApp infrastructure.

## Files

- `deployment.yaml` - MySQL, phpMyAdmin, Redis, Spring Boot backend
- `kafka-deployment.yaml` - Zookeeper cluster and Kafka brokers
- `DockerfileJavaSpring` - backend Docker image build

## Deployment order

1. Start Kafka and Zookeeper
2. Start MySQL, Redis, phpMyAdmin, and backend

## Kafka and Zookeeper

### Start Kafka cluster

```bash
docker-compose -f kafka-deployment.yaml up -d
```

### Services

- `zookeeper-01` on host port `2181`
- `zookeeper-02` on host port `2182`
- `zookeeper-03` on host port `2183`
- `kafka-broker-01` on host ports `9092`, `29092`, `9999`
- `kafka-broker-02` on host ports `9093`, `29093`

### Kafka listeners

`kafka-broker-01` and `kafka-broker-02` expose:

- `INTERNAL` listener for container-to-container communication
- `EXTERNAL` listener for host access on ports `9092` / `9093`
- `DOCKER` listener for Docker-internal host access

### Notes

- `KAFKA_ZOOKEEPER_CONNECT` points to the three Zookeeper nodes.
- The Kafka cluster is configured with PLAINTEXT listeners.
- Topic replication and transaction logging are configured for a single-node environment.

## Spring Boot and application stack

### Start backend stack

```bash
docker-compose -f deployment.yaml up -d --build
```

### Services

- `mysql8-container` exposes MySQL on `3307`
- `phpmyadmin8-container` exposes phpMyAdmin on `8100`
- `redis-container` exposes Redis on `6379`
- `shopapp-spring-container` exposes backend API on `8099`

### Environment variables for backend

The backend container uses:

- `SPRING_DATASOURCE_URL` pointing to `mysql8-container`
- `MYSQL_ROOT_PASSWORD`
- `REDIS_HOST` = `redis-container`
- `REDIS_PORT` = `6379`
- `KAFKA_BROKER_SERVER` = `kafka-broker-01`
- `KAFKA_BROKER_PORT` = `19092`

### Health check

The backend container has a health check on:

```text
http://localhost:8088/api/v1/actuator/health
```

## DockerfileJavaSpring

The backend image is built with a multi-stage Dockerfile:

- First stage builds the Maven project
- Second stage copies the built jar and uploads folder
- The container runs on port `8088`

### Build command

```bash
docker build -t shopapp-spring:1.0.0 -f DockerfileJavaSpring .
```

## Useful Docker commands

```bash
# Stop the application stack
docker-compose -f deployment.yaml down

# Stop the Kafka stack
docker-compose -f kafka-deployment.yaml down

# View logs from backend
docker logs -f shopapp-spring-container
```
