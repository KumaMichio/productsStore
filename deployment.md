# Deployment Guide

## Stack production (miễn phí)

| Service | Dùng để | Free tier |
|---|---|---|
| **Vercel** | Angular frontend | Unlimited, CDN toàn cầu |
| **Koyeb** | Spring Boot backend | 2 services, 512MB RAM, không sleep |
| **TiDB Cloud Serverless** | MySQL database | 5GB storage, MySQL-compatible |
| **Upstash** | Redis cache | 10,000 req/day, 256MB |
| **Cloudinary** | Lưu ảnh sản phẩm | 25GB storage + CDN |

---

## Cơ chế lưu ảnh

Ảnh sản phẩm **không lưu trong database**. Database chỉ lưu **tên file hoặc URL** (string).

```
Upload (production)
───────────────────
Frontend → POST /api/v1/products/uploads/{id}
Backend  → Cloudinary.uploader().upload(file)
         → Cloudinary trả về secure_url
         → Lưu secure_url vào product_images.image_url và products.thumbnail

Hiển thị ảnh
────────────
Backend trả về secure_url từ DB
Frontend hiển thị trực tiếp từ Cloudinary CDN (không qua backend)
```

```
Upload (local dev — không có CLOUDINARY_URL)
────────────────────────────────────────────
Backend → lưu file vào ./uploads/{uuid}.ext
        → lưu filename vào DB
Frontend → gọi GET /api/v1/products/images/{filename}
         → backend đọc file từ disk và trả về
```

Helper `resolveImageUrl()` trong frontend xử lý cả 2 trường hợp:
- URL đầy đủ (Cloudinary) → trả về nguyên văn
- Tên file cũ → ghép thành `{apiBaseUrl}/products/images/{filename}`

---

## Bước 1 — Đăng ký services

### TiDB Cloud (MySQL database)
1. Truy cập [tidbcloud.com](https://tidbcloud.com) → tạo account miễn phí
2. **Create Cluster** → chọn **Serverless** → chọn region gần nhất
3. Vào cluster → **Connect** → chọn **General** → copy connection string

Connection string có dạng:
```
mysql://username.root:password@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/ShopApp?sslAcceptCerts=true
```

Chuyển thành JDBC URL:
```
SPRING_DATASOURCE_URL=jdbc:mysql://gateway01.us-east-1.prod.aws.tidbcloud.com:4000/ShopApp?serverTimezone=UTC&useSSL=true&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
DB_USERNAME=username.root
DB_PASSWORD=your_password
```

### Upstash (Redis cache)
1. Truy cập [console.upstash.com](https://console.upstash.com) → tạo account
2. **Create Database** → **Redis** → chọn region → **Free** tier
3. Vào database → tab **Details** → copy các thông tin:

```
REDIS_HOST=your-redis-id.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password
REDIS_SSL=true
```

### Cloudinary (image storage)
1. Truy cập [cloudinary.com](https://cloudinary.com) → tạo account miễn phí
2. Vào **Dashboard** → copy **API Environment variable**

Có dạng:
```
CLOUDINARY_URL=cloudinary://123456789012345:AbCdEfGhIjKlMnOpQrStUvWxYz@your-cloud-name
```

### JWT Secret
Tạo secret key ngẫu nhiên:
```bash
openssl rand -base64 32
```

---

## Bước 2 — Chuẩn bị file `.env`

```bash
cp .env.example .env
```

Điền đầy đủ các giá trị vào `.env`:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://gateway01.us-east-1.prod.aws.tidbcloud.com:4000/ShopApp?...
DB_USERNAME=your_tidb_username.root
DB_PASSWORD=your_tidb_password

REDIS_HOST=your-redis-id.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password
REDIS_SSL=true

SPRING_PROFILES_ACTIVE=prod
JWT_SECRET_KEY=your_32_char_random_secret

CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:4300
```

---

## Bước 3 — Deploy backend lên Koyeb

### Chuẩn bị Docker image

Build và push image lên Docker Hub (hoặc để GitHub Actions tự làm ở Bước 5):

```bash
# Build backend image
docker build -t your_dockerhub_username/shopapp-spring:latest -f DockerfileJavaSpring .

# Đăng nhập Docker Hub
docker login

# Push
docker push your_dockerhub_username/shopapp-spring:latest
```

### Tạo service trên Koyeb
1. Truy cập [koyeb.com](https://koyeb.com) → đăng nhập
2. **Create Service** → **Docker** → nhập image: `your_dockerhub_username/shopapp-spring:latest`
3. **Environment variables** → thêm tất cả các biến từ `.env` (trừ Docker Hub vars):

| Key | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | JDBC URL của TiDB |
| `DB_USERNAME` | TiDB username |
| `DB_PASSWORD` | TiDB password |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET_KEY` | Random secret |
| `CLOUDINARY_URL` | Cloudinary URL |
| `REDIS_HOST` | Upstash host |
| `REDIS_PORT` | `6379` |
| `REDIS_PASSWORD` | Upstash password |
| `REDIS_SSL` | `true` |
| `ALLOWED_ORIGINS` | *(điền sau khi có Vercel URL)* |

4. **Port** → `8088`
5. **Deploy** → đợi service healthy
6. Copy URL của service (dạng `https://shopapp-yourname.koyeb.app`)

---

## Bước 4 — Deploy frontend lên Vercel

### Cập nhật API URL
Mở file `frontend/src/environments/environment.prod.ts`, thay `KOYEB_APP_URL` bằng URL thực:

```typescript
export const environment = {
    production: true,
    apiBaseUrl: 'https://shopapp-yourname.koyeb.app/api/v1',
};
```

Commit và push lên GitHub.

### Import project vào Vercel
1. Truy cập [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repository
3. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Angular
   - Build command và output directory đã có trong `frontend/vercel.json`
4. **Deploy**
5. Copy Vercel URL (dạng `https://your-app.vercel.app`)

### Cập nhật CORS trên Koyeb
Quay lại Koyeb → service settings → Environment variables → sửa:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:4300
```

Redeploy service.

---

## Bước 5 — CI/CD với GitHub Actions (tự động)

### Thêm GitHub Secrets
Vào GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Secret | Giá trị |
|---|---|
| `DOCKER_HUB_USERNAME` | Docker Hub username |
| `DOCKER_HUB_TOKEN` | Docker Hub access token |
| `VPS_HOST` | IP VPS (nếu dùng VPS thay Koyeb) |
| `VPS_USERNAME` | `root` (hoặc username VPS) |
| `VPS_SSH_KEY` | Nội dung private SSH key |
| `MYSQL_ROOT_PASSWORD` | Mật khẩu DB |
| `JWT_SECRET_KEY` | JWT secret |
| `DOMAIN` | Domain của bạn |

Sau khi setup xong, mỗi lần push lên nhánh `main`:
1. GitHub Actions build Angular + Spring Boot
2. Push Docker images lên Docker Hub với tag `:latest` và `:{commit_sha}`
3. SSH vào VPS (nếu dùng VPS) để pull images mới và restart services

---

## Bước 6 — Migrate database

Flyway chạy tự động khi Spring Boot khởi động. Đảm bảo TiDB database tồn tại trước khi deploy:

```sql
-- Chạy trên TiDB Cloud SQL editor
CREATE DATABASE IF NOT EXISTS ShopApp;
```

Flyway sẽ tự apply các migration scripts trong `backend/src/main/resources/db/migration/`.

---

## Cấu trúc files infrastructure

```
productsStore/
├── .env.example              # Template env vars — copy thành .env
├── .env                      # Giá trị thực — gitignored
├── .gitignore                # Bao gồm .env, uploads/, dist/
├── DockerfileJavaSpring      # Multi-stage build cho backend
├── DockerfileAngular         # Multi-stage build cho frontend (Nginx)
├── docker-compose.prod.yml   # Production: tất cả services + volumes
├── docker-compose.dev.yml    # Dev: chỉ MySQL + Redis + phpMyAdmin
├── nginx/
│   ├── nginx.conf            # Reverse proxy: SSL, rate-limit, security headers
│   └── angular.conf          # Config Nginx bên trong Angular container
└── .github/
    └── workflows/
        └── deploy.yml        # CI/CD pipeline
```

---

## Phân biệt dev vs prod

| | Dev (`docker-compose.dev.yml`) | Prod (Koyeb + Vercel) |
|---|---|---|
| **Frontend** | `ng serve` trên localhost:4300 | Vercel |
| **Backend** | `mvn spring-boot:run` trên localhost:8088 | Koyeb |
| **Database** | MySQL trong Docker (localhost:3307) | TiDB Cloud Serverless |
| **Redis** | Redis trong Docker (localhost:6379) | Upstash |
| **Ảnh** | Local disk `uploads/` | Cloudinary CDN |
| **Kafka** | Docker (kafka-deployment.yaml) | Disabled |
| **Logging** | DEBUG | WARN/INFO |
| **show-sql** | true | false |

---

## Troubleshooting

### Backend không kết nối được TiDB
- Kiểm tra `useSSL=true` trong JDBC URL
- TiDB Serverless yêu cầu SSL bắt buộc
- Kiểm tra username có dạng `username.root` (không phải chỉ `root`)

### Redis kết nối thất bại (Upstash)
- Đảm bảo `REDIS_SSL=true` trong env vars
- Upstash yêu cầu TLS cho tất cả kết nối
- Kiểm tra password chính xác trong Upstash dashboard

### Ảnh không hiển thị sau khi upload
- Kiểm tra `CLOUDINARY_URL` đúng format: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`
- Vào Cloudinary Media Library xem ảnh có được upload không
- Kiểm tra folder `shopapp/products` trong Cloudinary

### CORS error trên frontend
- Đảm bảo Vercel URL đã được thêm vào `ALLOWED_ORIGINS` trên Koyeb
- Format: `https://your-app.vercel.app` (không có trailing slash)
- Sau khi sửa ALLOWED_ORIGINS, phải redeploy backend trên Koyeb

### Flyway migration thất bại
- TiDB Cloud → SQL Editor → chạy `SHOW DATABASES;` kiểm tra database tồn tại
- Xem log Koyeb để biết migration script nào lỗi
- TiDB tương thích MySQL 8.0, hầu hết syntax đều hoạt động

---

## Lệnh hữu ích

```bash
# Chạy dev environment (chỉ infrastructure)
docker-compose -f docker-compose.dev.yml up -d

# Dừng dev environment
docker-compose -f docker-compose.dev.yml down

# Build Angular production
cd frontend && npm run build -- --configuration=production

# Build Docker image backend
docker build -t shopapp-spring:latest -f DockerfileJavaSpring .

# Build Docker image frontend
docker build -t shopapp-frontend:latest -f DockerfileAngular .

# Xem log backend (nếu chạy Docker locally)
docker logs shopapp-spring-container -f

# Generate JWT secret
openssl rand -base64 32
```
