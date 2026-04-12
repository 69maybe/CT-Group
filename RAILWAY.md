# Deploy lên Railway (2 service: API + Web)

Monorepo gồm `backend/` (Spring Boot) và `frontend/` (Next.js 14). Mỗi thứ **một service** trên Railway.

## 1. PostgreSQL

- Trong project Railway: **New** → **Database** → **PostgreSQL**.
- Sau khi có plugin, lấy biến `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (tên có thể khác chút tùy UI; xem tab **Variables** của Postgres).

## 2. Service Backend (API)

**Cách A — Root = toàn repo (giữ như cũ)**  
- **Root Directory**: để trống hoặc `.`  
- Railway đọc `railway.json` ở gốc repo → build `backend/Dockerfile`.

**Cách B — Root = `backend/` (gọn hơn)**  
- **Root Directory**: `backend`  
- Dùng `backend/railway.json` → build `Dockerfile` trong cùng thư mục.

**Variables** (xem mẫu `backend/.env.railway.example`):

| Biến | Ghi chú |
|------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` — **bắt buộc** nếu build bằng Nixpacks/JAR không qua `backend/Dockerfile`. Image Docker trong repo đã `ENV SPRING_PROFILES_ACTIVE=prod`; nếu thiếu `prod`, app dùng profile **dev** và kết nối `127.0.0.1:5433` → lỗi trên Railway. |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Từ Postgres (reference plugin) — **`application-prod.yml` dùng luôn `PGUSER`/`PGPASSWORD` nếu không có `DB_USER`/`DB_PASSWORD`** |
| `DB_USER`, `DB_PASSWORD` | Tuỳ chọn; chỉ cần nếu bạn không dùng `PGUSER`/`PGPASSWORD` |
| `DATABASE_URL` | **Spring không đọc** biến này trong cấu hình hiện tại; có thể bỏ hoặc giữ cho tool khác — quan trọng là bộ `PG*`. |
| `JWT_SECRET` | Chuỗi bí mật dài, **đổi** trước khi public |
| `CORS_ORIGINS` | URL public của frontend, ví dụ `https://web-production-xxxx.up.railway.app` |

Sau deploy, mở **public URL** của service API — `GET /health` trả `OK`.

## 3. Service Frontend (Next.js)

- **New** → **GitHub Repo** (cùng repo) hoặc duplicate service.
- **Root Directory**: `frontend` (bắt buộc để đọc `frontend/railway.json`, `Dockerfile`, `nixpacks.toml`).
- Build: Dockerfile (hoặc Nixpacks nếu đổi builder trong UI). App lắng nghe `PORT` (Railway inject; `npm run start` dùng `$PORT`).
- **Settings → Deploy → Custom Start Command**: để **trống** hoặc gõ đúng `npm run start`. **Không** dùng `npm run start -w greenlife-frontend` / `--workspace=greenlife-frontend` khi Root Directory là `frontend` — trong thư mục đó không có npm workspace (workspace chỉ nằm ở `package.json` gốc repo). Nếu thấy lỗi `No workspaces found`, xóa custom start command và redeploy; repo đã cố định `startCommand` trong `frontend/railway.json` và `frontend/nixpacks.toml`.

**Variables** (mẫu `frontend/.env.railway.example`):

| Biến | Ghi chú |
|------|---------|
| `BACKEND_URL` | URL public backend (**https**, không `/` cuối) |
| `NEXT_PUBLIC_API_URL` | Thường **cùng** `BACKEND_URL` (client gọi `/api/*` trên Next, route proxy tới backend) |
| `NEXT_PUBLIC_SITE_URL` | URL public của chính frontend |

**Health check** trong `frontend/railway.json` dùng `/vi` vì next-intl dùng `localePrefix: 'always'` (trang chủ locale trả 200 ổn định hơn so với redirect gốc `/`).

## 4. Thứ tự nên làm

1. Tạo Postgres → lưu biến kết nối.  
2. Deploy **backend** → gán biến → kiểm tra `/health`.  
3. Copy URL backend → gán `CORS_ORIGINS` = URL frontend (có thể sửa lại sau khi có URL frontend).  
4. Deploy **frontend** → gán `BACKEND_URL` / `NEXT_PUBLIC_*` → mở site, thử đăng nhập / tin tức.

## 5. Ghi chú

- `application-prod.yml` dùng `sslmode=require` — phù hợp Postgres trên Railway.  
- Nếu đổi domain tùy chỉnh, cập nhật lại `CORS_ORIGINS` và các URL trong biến frontend.

### Postgres “trống” dù API đã chạy

- Seed dữ liệu (roles, tin mẫu, `business_sectors`, …) chỉ chạy **một lần khi backend khởi động** (`CommandLineRunner` / `ApplicationRunner`).  
- Nếu bạn **tạo DB mới**, **reset volume**, hoặc nối Postgres **sau** lần deploy đầu: cần **Restart** service backend để seed chạy lại.  
- Kiểm tra log deploy có dòng kiểu `Data initialization completed`, `Business sectors: …`, `Seeding sample CT GROUP articles`.  
- `GET /health` **không** truy vấn DB — service vẫn “online” được; có dữ liệu hay không xem API thật (vd. `/api/articles`, `/api/public/business-sectors`) hoặc bảng trong Postgres.
