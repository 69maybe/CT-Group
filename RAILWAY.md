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
| `PGHOST`, `PGPORT`, `PGDATABASE` | Từ Postgres (hoặc reference `${{Postgres.xxx}}`) |
| `DB_USER`, `DB_PASSWORD` | Trùng user/password DB (Railway hay dùng `PGUSER` / `PGPASSWORD` — map sang `DB_USER` / `DB_PASSWORD`) |
| `JWT_SECRET` | Chuỗi bí mật dài, **đổi** trước khi public |
| `CORS_ORIGINS` | URL public của frontend, ví dụ `https://web-production-xxxx.up.railway.app` |

Sau deploy, mở **public URL** của service API — `GET /health` trả `OK`.

## 3. Service Frontend (Next.js)

- **New** → **GitHub Repo** (cùng repo) hoặc duplicate service.
- **Root Directory**: `frontend` (bắt buộc để đọc `frontend/railway.json` và `Dockerfile`).
- Build: Dockerfile; app lắng nghe `PORT` (Railway inject; `npm start` đã dùng `$PORT`).

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
