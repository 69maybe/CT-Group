# GreenLife Food E-Commerce Platform

Nền tảng thương mại điện tử cho thực phẩm healthy - Salad, nước ép, cơm eat-clean.

## 🚀 Quick Start

### Yêu cầu hệ thống
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (nếu chạy local không dùng Docker)

### Cài đặt với Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repo-url>
cd greenlife-food

# Chạy với Docker
docker-compose up -d

# Khởi tạo database và seed data
npm run db:migrate
npm run db:seed
```

### Cài đặt Local (Development)

```bash
# Cài đặt dependencies
npm install

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed

# Frontend
cd ../frontend
npm install
```

### Chạy Development

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## 📁 Cấu trúc dự án

```
greenlife-food/
├── backend/           # Express.js API
│   ├── src/
│   │   ├── config/    # Cấu hình
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── prisma/        # Database schema
├── frontend/          # Next.js 14 App
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── store/
│   └── public/
├── docker-compose.yml
└── nginx/
```

## ✨ Tính năng

### Frontend
- [x] Landing page với hero, products, about, news
- [x] Product listing với filter/sort
- [x] Shopping cart
- [x] Checkout flow
- [x] User account & order history
- [x] Admin panel dashboard
- [x] Product management
- [x] Article management
- [x] RBAC management (Dynamic Roles & Permissions)
- [x] i18n (English + Vietnamese)
- [x] SEO optimized
- [x] Responsive design (mobile-first)

### Backend
- [x] RESTful API
- [x] JWT Authentication
- [x] Role-based Access Control
- [x] PostgreSQL với Prisma ORM
- [x] Input validation (Zod)
- [x] Rate limiting
- [x] CORS & Security headers

## 🔐 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@sysmac.vn | Admin@123 |
| Manager | manager@greenlifefood.vn | Manager@123 |
| Staff | staff@greenlifefood.vn | Staff@123 |
| Customer | customer@example.com | Customer@123 |

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Thông tin user hiện tại

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:slug` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật (Admin)
- `DELETE /api/products/:id` - Xóa (Admin)

### Categories
- `GET /api/categories` - Danh sách categories
- `POST /api/categories` - Tạo category (Admin)
- `PUT /api/categories/:id` - Cập nhật (Admin)
- `DELETE /api/categories/:id` - Xóa (Admin)

### Orders
- `GET /api/orders` - Danh sách orders
- `GET /api/orders/:id` - Chi tiết order
- `POST /api/orders` - Tạo order
- `PUT /api/orders/:id/status` - Cập nhật status (Admin)

### Articles
- `GET /api/articles` - Danh sách bài viết
- `GET /api/articles/:slug` - Chi tiết bài viết
- `POST /api/articles` - Tạo bài viết (Admin)
- `PUT /api/articles/:id` - Cập nhật (Admin)
- `DELETE /api/articles/:id` - Xóa (Admin)

### RBAC
- `GET /api/roles` - Danh sách roles
- `POST /api/roles` - Tạo role (Super Admin)
- `GET /api/permissions` - Danh sách permissions
- `POST /api/roles/:id/permissions` - Gán permissions cho role
- `POST /api/users/:id/roles` - Gán roles cho user

## 📝 License

MIT License - GreenLife Food © 2024
