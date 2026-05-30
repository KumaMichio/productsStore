## Products Store - ShopApp

Ứng dụng **Products Store (ShopApp)** là một hệ thống bán hàng online gồm **backend Spring Boot** và **frontend Angular**, hỗ trợ:
- **Quản lý sản phẩm, danh mục, đơn hàng, coupon, bình luận, yêu thích...**
- **Xác thực & phân quyền** với Spring Security + JWT, đăng nhập OAuth2 (Google, v.v.).
- **MySQL** làm database chính, **Redis** cache dữ liệu sản phẩm.
- Tích hợp **Kafka** để xử lý sự kiện bất đồng bộ (ví dụ: thao tác với `category`, log/event sau này dễ mở rộng).

---

## Tech stack

- **Backend**
  - Java 17, **Spring Boot 3.1.2** (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-kafka`, `spring-data-redis`, `springdoc-openapi`, `spring-boot-starter-actuator`)
  - **MySQL 8** (Flyway migration)
  - **Redis 7** (cache, key-value store)
  - **Kafka** + **Zookeeper** (message broker, event streaming)
  - Build bằng **Maven**, container hóa bằng **Docker** (multi-stage build `DockerfileJavaSpring`)

- **Frontend**
  - **Angular 17** (`@angular/*`, `@angular/ssr`)
  - UI: **Bootstrap 5**, **Font Awesome**
  - Auth FE: `@auth0/angular-jwt`, RxJS

- **Hạ tầng & DevOps**
  - **Docker / docker-compose**
  - Các file: `deployment.yaml` (MySQL, phpMyAdmin, Redis, Spring Boot), `kafka-deployment.yaml` (Zookeeper & Kafka cluster), `DockerfileJavaSpring`

---

## Cấu trúc chính

- `backend/`: mã nguồn Spring Boot backend.
- `frontend/`: mã nguồn Angular frontend.
- `deployment.yaml`: docker-compose cho MySQL, phpMyAdmin, Redis, Spring Boot.
- `kafka-deployment.yaml`: docker-compose cho Zookeeper + Kafka brokers.
- `DockerfileJavaSpring`: build image Spring Boot multi-stage.
- `docs/`: project documentation for architecture, setup, backend, frontend, and Docker/Kafka deployment.

---

## Cách chạy project

### 1. Chạy từng phần BE / FE (không Docker, không Kafka bắt buộc)

#### 1.1. Backend Spring Boot (local)

**Yêu cầu:**
- JDK 17
- Maven
- MySQL 8 (hoặc tương thích)
- Redis (tùy chọn, nếu muốn dùng cache giống production)

**Bước thực hiện:**

1. Tạo database:
   - Tạo database tên **`ShopApp`** trong MySQL.
2. Cấu hình `application.yml` (nếu cần chỉnh URL DB, user/pass).
3. Chạy backend:

```bash
cd backend
mvn spring-boot:run
```

Mặc định service sẽ chạy ở port **8088** (theo `DockerfileJavaSpring`/config hiện tại).

> Nếu bạn muốn chạy Kafka/Redis local thay vì Docker, cần chỉnh lại `application.yml` tương ứng (hostname, port).

#### 1.2. Frontend Angular

**Yêu cầu:**
- Node.js (khuyên dùng >= 18)
- npm hoặc yarn

**Cài đặt & chạy dev server:**

```bash
cd frontend
npm install
npm run start:dev   # hoặc: npm start / ng serve
```

- Mặc định Angular dev server chạy ở **http://localhost:4300** (theo script `start:dev`).
- Đảm bảo API URL trong môi trường Angular (ví dụ `environment.ts`) trỏ đúng về backend (vd: `http://localhost:8088/api/v1/...`).

---

### 2. Chạy toàn hệ thống bằng Docker + Kafka + Zookeeper

Ở mode này, bạn để Docker chạy: **MySQL, phpMyAdmin, Redis, Kafka+Zookeeper, Spring Boot backend**. Frontend Angular thường vẫn chạy ngoài container (dev) hoặc bạn có thể build & deploy riêng.

#### 2.1. Khởi chạy Kafka + Zookeeper

File `kafka-deployment.yaml` chứa cấu hình:
- 3 container Zookeeper (`zookeeper-01`, `zookeeper-02`, `zookeeper-03`)
- 2 Kafka brokers (`kafka-broker-01`, `kafka-broker-02`)

**Chạy:**

```bash
docker-compose -f kafka-deployment.yaml up -d
```

Sau khi chạy xong:
- Kafka broker chính lắng nghe ở:
  - `EXTERNAL`: `localhost:9092`
  - `INTERNAL` (trong mạng Docker): `kafka-broker-01:19092`, `kafka-broker-02:19093`

#### 2.2. Khởi chạy MySQL, Redis, phpMyAdmin, Spring Boot

File `deployment.yaml` sẽ:
- Tạo:
  - `mysql8-container` (MySQL, port host `3307`)
  - `phpmyadmin8-container` (phpMyAdmin, port host `8100`)
  - `redis-container` (Redis, port host `6379`)
  - `shopapp-spring-container` (Spring Boot backend, port host `8099` → container `8088`)

**Build & chạy:**

```bash
docker-compose -f deployment.yaml up -d --build
```

Sau khi chạy:
- **API backend**: `http://localhost:8099` (forward tới `8088` trong container)
- **phpMyAdmin**: `http://localhost:8100` (host `mysql8-container`)
- **MySQL**: host `localhost`, port `3307`, DB `ShopApp`, user `root`, pass `Abc123456789@`
- **Redis**: `localhost:6379`

**Lưu ý Kafka trong backend:**
- Backend nhận cấu hình Kafka qua biến môi trường:
  - `KAFKA_BROKER_SERVER=kafka-broker-01`
  - `KAFKA_BROKER_PORT=19092`
- Do `shopapp-spring-container` nằm cùng mạng `shopapp-network` với Kafka, backend có thể kết nối Kafka bằng hostname nội bộ này.

#### 2.3. Chạy frontend kết nối tới backend Docker

Bạn có 2 lựa chọn:

- **Dev (khuyên dùng khi development)**:

```bash
cd frontend
npm install
npm run start:dev
```

Sau đó cấu hình API base URL trong Angular (environment) về:
- `http://localhost:8099/api/v1/...`

- **Build & deploy riêng FE**:
  - Dùng `npm run build` / `npm run build:production`, rồi deploy lên Nginx, S3, v.v. (tùy môi trường của bạn).

---

## Tóm tắt nhanh các lệnh chính

- **Chạy Backend local (không Docker)**:

```bash
cd backend
mvn spring-boot:run
```

- **Chạy Frontend Angular dev**:

```bash
cd frontend
npm install
npm run start:dev
```

- **Chạy Kafka + Zookeeper bằng Docker**:

```bash
docker-compose -f kafka-deployment.yaml up -d
```

- **Chạy MySQL, Redis, phpMyAdmin, Spring Boot bằng Docker**:

```bash
docker-compose -f deployment.yaml up -d --build
```

