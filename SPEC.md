# GreenLife Food - E-Commerce Website Specification

## 1. Project Overview

**Project Name:** GreenLife Food E-Commerce Platform
**Type:** Full-stack e-commerce website with admin panel
**Core Functionality:** Online food ordering platform for healthy meals, juices, and salads targeting office workers, fitness enthusiasts, and weight-conscious customers.
**Target Users:**
- Office workers seeking healthy lunch options
- People on diet/weight loss programs
- Gym-goers needing clean eating options
- Health-conscious consumers in Vietnam

## 2. Business Model

- Online sales via website (primary)
- Facebook integration for marketing
- Delivery service to offices and homes
- Small store presence (1-2 locations)

## 3. Technical Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **i18n:** next-intl
- **UI Components:** Custom components with Lucide icons
- **Forms:** React Hook Form + Zod

### Backend
- **Runtime:** Java 17
- **Framework:** Spring Boot 3.2.2
- **ORM:** Spring Data JPA (Hibernate)
- **Database:** PostgreSQL
- **Authentication:** JWT with refresh tokens
- **Validation:** Spring Validation

### Infrastructure
- **Container:** Docker & Docker Compose
- **Reverse Proxy:** Nginx

## 4. Database Schema

### Core Entities
- **Users** - Customer and admin accounts
- **Products** - Food items (salads, juices, eat-clean meals)
- **Categories** - Product categories
- **Orders** - Customer orders
- **OrderItems** - Order line items
- **Articles** - Blog posts, news, recruitment
- **Pages** - Static pages (About, Contact)
- **Settings** - Site configuration

### RBAC Entities
- **Roles** - Role definitions (Admin, Manager, Staff, Customer)
- **Permissions** - Permission definitions
- **RolePermissions** - Role-permission mapping
- **UserRoles** - User-role assignment

## 5. Feature Specifications

### Frontend Features

#### Landing Page
- Hero section with company intro and CTA
- Featured products carousel
- About section with company story
- News/Articles preview
- Recruitment section
- Contact information

#### Product Listing
- Grid display with product cards
- Category filter sidebar
- Price range filter
- Sort by: Price, Name, Popularity, Newest
- Search functionality
- Pagination
- Quick add to cart

#### Shopping Cart
- Cart sidebar/modal
- Quantity adjustment
- Remove items
- Subtotal calculation
- Proceed to checkout

#### Checkout
- Address form
- Delivery time selection
- Payment method (COD, Bank transfer)
- Order summary
- Order confirmation

#### User Account
- Login/Register forms
- Profile management
- Order history with status
- Order details view
- Change password

#### Admin Panel

##### Dashboard
- Revenue statistics (daily, weekly, monthly)
- Order count and status breakdown
- Top selling products
- Recent orders list
- Quick actions

##### Product Management
- Product CRUD
- Category management
- Image upload
- Stock management

##### Order Management
- Order list with filters
- Order status update
- Order details view
- Print invoice

##### Article Management
- Blog posts CRUD
- News CRUD
- Recruitment posts CRUD
- Rich text editor

##### RBAC Management
- Role list and CRUD
- Permission list
- Assign permissions to roles
- Assign roles to users
- View user's roles and permissions

### SEO Features
- Meta tags (title, description, keywords)
- Open Graph tags
- Twitter Cards
- JSON-LD structured data (Product, Organization, Breadcrumb)
- Dynamic sitemap.xml
- robots.txt
- Canonical URLs

### i18n Features
- English and Vietnamese support
- Language switcher
- Localized dates and numbers
- RTL-ready structure

### Performance Features
- Image optimization (WebP, lazy loading)
- Code splitting (Next.js automatic)
- Minification (production build)
- Caching strategies
- CDN-ready static assets

## 6. API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- GET /api/auth/me

### Products
- GET /api/products (list with filters)
- GET /api/products/:slug
- GET /api/products/featured
- GET /api/products/best-sellers
- POST /api/admin/products (admin)
- PUT /api/admin/products/:id (admin)
- DELETE /api/admin/products/:id (admin)

### Categories
- GET /api/categories
- GET /api/categories/root
- GET /api/categories/:slug
- POST /api/admin/categories (admin)
- PUT /api/admin/categories/:id (admin)
- DELETE /api/admin/categories/:id (admin)

### Orders
- GET /api/orders (user's orders or all for admin)
- GET /api/orders/:id
- GET /api/orders/number/:orderNumber
- POST /api/orders
- PUT /api/admin/orders/:id/status (admin)
- DELETE /api/admin/orders/:id (admin)

### Articles
- GET /api/articles (list)
- GET /api/articles/:slug
- GET /api/articles/featured
- POST /api/admin/articles (admin)
- PUT /api/admin/articles/:id (admin)
- DELETE /api/admin/articles/:id (admin)

### RBAC
- GET /api/roles
- POST /api/roles (admin)
- PUT /api/roles/:id (admin)
- DELETE /api/roles/:id (admin)
- GET /api/permissions
- GET /api/permissions/grouped
- POST /api/roles/:id/permissions (admin)
- GET /api/admin/users
- GET /api/admin/users/:id
- PUT /api/admin/users/:id (admin)
- POST /api/admin/users/:id/roles (admin)
- DELETE /api/admin/users/:id (admin)

### Dashboard
- GET /api/dashboard/stats (admin)
- GET /api/dashboard/recent-orders (admin)
- GET /api/dashboard/top-products (admin)

## 7. Security Requirements

- JWT access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Password hashing with BCrypt
- Input validation with Spring Validation
- SQL injection prevention (JPA)
- CORS configuration
- Security headers via Spring Security
- HTTPS enforcement in production

## 8. Default Roles and Permissions

### Super Admin
- Full system access
- Can manage all roles and permissions

### Admin
- Full content management
- Order management
- User management (except super admin)

### Manager
- Product management
- Order management
- Article management
- View dashboard

### Staff
- Order management (view, update status)
- View products

### Customer
- Place orders
- View own profile
- View order history

## 9. File Structure

```
greenlife-food/
├── backend/
│   ├── src/main/java/com/greenlife/
│   │   ├── GreenLifeApplication.java
│   │   ├── config/
│   │   │   ├── AppConfig.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataInitializer.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── AdminProductController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── AdminCategoryController.java
│   │   │   ├── OrderController.java
│   │   │   ├── AdminOrderController.java
│   │   │   ├── ArticleController.java
│   │   │   ├── AdminArticleController.java
│   │   │   ├── RoleController.java
│   │   │   ├── PermissionController.java
│   │   │   ├── AdminUserController.java
│   │   │   └── DashboardController.java
│   │   ├── dto/
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── entity/
│   │   │   ├── enums/
│   │   │   ├── BaseEntity.java
│   │   │   ├── User.java
│   │   │   ├── Product.java
│   │   │   ├── Category.java
│   │   │   ├── Order.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Article.java
│   │   │   ├── Role.java
│   │   │   ├── Permission.java
│   │   │   ├── UserRole.java
│   │   │   ├── RolePermission.java
│   │   │   ├── RefreshToken.java
│   │   │   ├── Setting.java
│   │   │   └── Contact.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── BadRequestException.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   ├── UnauthorizedException.java
│   │   │   └── ConflictException.java
│   │   ├── repository/
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── UserPrincipal.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── ProductService.java
│   │       ├── CategoryService.java
│   │       ├── OrderService.java
│   │       ├── ArticleService.java
│   │       ├── RoleService.java
│   │       ├── PermissionService.java
│   │       ├── UserService.java
│   │       └── DashboardService.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   ├── public/
│   └── package.json
├── docker-compose.yml
├── nginx/
│   └── nginx.conf
└── README.md
```

## 10. Acceptance Criteria

- [ ] Landing page displays correctly with all sections
- [ ] Products can be filtered and sorted
- [ ] Cart operations work correctly
- [ ] Checkout flow completes orders
- [ ] User registration and login work
- [ ] Order history displays correctly
- [ ] Admin dashboard shows statistics
- [ ] Products can be managed (CRUD)
- [ ] Articles can be managed (CRUD)
- [ ] Orders can be managed with status updates
- [ ] RBAC system allows role/permission management
- [ ] Language switching works (EN/VN)
- [ ] SEO meta tags are properly rendered
- [ ] Responsive design works on mobile
- [ ] Docker deployment works
