# ShopApp Documentation

Welcome to the `Products Store (ShopApp)` documentation.

This repository includes a Java Spring Boot backend and an Angular frontend, plus Docker-based infrastructure for MySQL, Redis, Kafka, and Zookeeper.

## Contents

- `architecture.md` - system architecture and component responsibilities
- `setup.md` - how to run the project locally and with Docker
- `backend.md` - backend structure, technologies, and configuration
- `frontend.md` - frontend structure, technologies, and build/run commands
- `docker-kafka.md` - Docker compose files and Kafka deployment details

## Project layout

- `backend` - Spring Boot backend application
- `frontend` - Angular frontend application
- `deployment.yaml` - Docker compose for MySQL, phpMyAdmin, Redis, and Spring Boot
- `kafka-deployment.yaml` - Docker compose for Kafka and Zookeeper
- `DockerfileJavaSpring` - multi-stage Dockerfile for building the backend image
- `shopapp.sql` - SQL schema / sample data file

## How to use this docs folder

Open the relevant markdown file for the area you need:

- Backend development: `backend.md`
- Frontend development: `frontend.md`
- Docker deployment: `docker-kafka.md`
- Overall setup: `setup.md`
- Architecture and component overview: `architecture.md`
