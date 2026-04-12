package com.greenlife.config;

import com.greenlife.entity.Article;
import com.greenlife.entity.Category;
import com.greenlife.entity.Permission;
import com.greenlife.entity.Product;
import com.greenlife.entity.Role;
import com.greenlife.entity.RolePermission;
import com.greenlife.entity.User;
import com.greenlife.entity.UserRole;
import com.greenlife.entity.enums.ArticleCategory;
import com.greenlife.repository.ArticleRepository;
import com.greenlife.repository.CategoryRepository;
import com.greenlife.repository.PermissionRepository;
import com.greenlife.repository.ProductRepository;
import com.greenlife.repository.RolePermissionRepository;
import com.greenlife.repository.RoleRepository;
import com.greenlife.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final ArticleRepository articleRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppSeedProperties appSeedProperties;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            initializeRoles();
        }
        if (permissionRepository.count() == 0) {
            initializePermissions();
        }
        if (rolePermissionRepository.count() == 0) {
            initializeRolePermissions();
        }
        // Always reinitialize users to ensure admin account works (for dev)
        initializeUsers();
        if (articleRepository.count() == 0) {
            initializeArticles();
        }
        migrateLegacyGreenLifeCategoriesToCtGroup();
        if (productRepository.count() == 0) {
            initializeProducts();
        }
        log.info("Data initialization completed");
    }

    private void initializeRoles() {
        List<Role> roles = Arrays.asList(
                Role.builder().name("SUPER_ADMIN").description("Full system access").isDefault(false).build(),
                Role.builder().name("ADMIN").description("Administrator").isDefault(false).build(),
                Role.builder().name("MANAGER").description("Manager").isDefault(false).build(),
                Role.builder().name("STAFF").description("Staff member").isDefault(false).build(),
                Role.builder().name("CUSTOMER").description("Customer").isDefault(true).build()
        );
        roleRepository.saveAll(roles);
        log.info("Default roles created");
    }

    private void initializePermissions() {
        String[][] permissions = {
            {"users.view", "View Users", "users", "view"},
            {"users.create", "Create Users", "users", "create"},
            {"users.update", "Update Users", "users", "update"},
            {"users.delete", "Delete Users", "users", "delete"},
            {"roles.view", "View Roles", "roles", "view"},
            {"roles.create", "Create Roles", "roles", "create"},
            {"roles.update", "Update Roles", "roles", "update"},
            {"roles.delete", "Delete Roles", "roles", "delete"},
            {"products.view", "View Products", "products", "view"},
            {"products.create", "Create Products", "products", "create"},
            {"products.update", "Update Products", "products", "update"},
            {"products.delete", "Delete Products", "products", "delete"},
            {"categories.view", "View Categories", "categories", "view"},
            {"categories.create", "Create Categories", "categories", "create"},
            {"categories.update", "Update Categories", "categories", "update"},
            {"categories.delete", "Delete Categories", "categories", "delete"},
            {"orders.view", "View Orders", "orders", "view"},
            {"orders.create", "Create Orders", "orders", "create"},
            {"orders.update", "Update Orders", "orders", "update"},
            {"orders.delete", "Delete Orders", "orders", "delete"},
            {"articles.view", "View Articles", "articles", "view"},
            {"articles.create", "Create Articles", "articles", "create"},
            {"articles.update", "Update Articles", "articles", "update"},
            {"articles.delete", "Delete Articles", "articles", "delete"},
            {"dashboard.view", "View Dashboard", "dashboard", "view"},
        };

        for (String[] perm : permissions) {
            Permission permission = Permission.builder()
                    .name(perm[0])
                    .description(perm[1])
                    .resource(perm[2])
                    .action(perm[3])
                    .build();
            permissionRepository.save(permission);
        }
        log.info("Default permissions created");
    }

    private void initializeRolePermissions() {
        // Get all permissions
        List<Permission> permissions = permissionRepository.findAll();
        
        // Get roles
        Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
        Role managerRole = roleRepository.findByName("MANAGER").orElse(null);
        Role staffRole = roleRepository.findByName("STAFF").orElse(null);
        Role superAdminRole = roleRepository.findByName("SUPER_ADMIN").orElse(null);

        // SUPER_ADMIN gets all permissions
        if (superAdminRole != null) {
            for (Permission perm : permissions) {
                RolePermission rp = RolePermission.builder()
                        .role(superAdminRole)
                        .permission(perm)
                        .build();
                rolePermissionRepository.save(rp);
            }
        }

        // ADMIN gets all permissions except user deletion and role deletion
        if (adminRole != null) {
            for (Permission perm : permissions) {
                if (!perm.getName().equals("users.delete") && !perm.getName().equals("roles.delete")) {
                    RolePermission rp = RolePermission.builder()
                            .role(adminRole)
                            .permission(perm)
                            .build();
                    rolePermissionRepository.save(rp);
                }
            }
        }

        // MANAGER gets products, categories, orders, articles permissions
        if (managerRole != null) {
            for (Permission perm : permissions) {
                if (perm.getResource().equals("products") || 
                    perm.getResource().equals("categories") || 
                    perm.getResource().equals("orders") ||
                    perm.getResource().equals("articles") ||
                    perm.getResource().equals("dashboard")) {
                    RolePermission rp = RolePermission.builder()
                            .role(managerRole)
                            .permission(perm)
                            .build();
                    rolePermissionRepository.save(rp);
                }
            }
        }

        // STAFF gets view permissions for products, categories, orders
        if (staffRole != null) {
            for (Permission perm : permissions) {
                if (perm.getAction().equals("view") && 
                    (perm.getResource().equals("products") || 
                     perm.getResource().equals("categories") || 
                     perm.getResource().equals("orders") ||
                     perm.getResource().equals("articles"))) {
                    RolePermission rp = RolePermission.builder()
                            .role(staffRole)
                            .permission(perm)
                            .build();
                    rolePermissionRepository.save(rp);
                }
                // Staff can update orders
                if (perm.getResource().equals("orders") && perm.getAction().equals("update")) {
                    RolePermission rp = RolePermission.builder()
                            .role(staffRole)
                            .permission(perm)
                            .build();
                    rolePermissionRepository.save(rp);
                }
            }
        }

        log.info("Role permissions assigned");
    }

    private void initializeUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
        Role customerRole = roleRepository.findByName("CUSTOMER").orElse(null);

        String adminEmail = appSeedProperties.getAdminEmail();
        String adminPassword = appSeedProperties.getAdminPassword();

        // Admin user (email + password lấy từ app.seed — xem application-dev.yml hoặc ADMIN_EMAIL / ADMIN_PASSWORD)
        var adminOpt = userRepository.findByEmail(adminEmail);
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode(adminPassword));
            if (adminRole != null && admin.getUserRoles().isEmpty()) {
                admin.getUserRoles().add(UserRole.builder().user(admin).role(adminRole).build());
            }
            userRepository.save(admin);
            log.info("Admin user updated: {}", adminEmail);
        } else if (adminRole != null) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .name("Admin")
                    .phone("0901 234 567")
                    .isActive(true)
                    .build();
            admin.getUserRoles().add(UserRole.builder().user(admin).role(adminRole).build());
            userRepository.save(admin);
            log.info("Admin user created: {}", adminEmail);
        }
        
        // Customer user
        var customerOpt = userRepository.findByEmail("customer@example.com");
        if (customerOpt.isPresent()) {
            User customer = customerOpt.get();
            customer.setPassword(passwordEncoder.encode("Customer@123"));
            if (customerRole != null && customer.getUserRoles().isEmpty()) {
                customer.getUserRoles().add(UserRole.builder().user(customer).role(customerRole).build());
            }
            userRepository.save(customer);
            log.info("Customer user updated: customer@example.com / Customer@123");
        } else if (customerRole != null) {
            User customer = User.builder()
                    .email("customer@example.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .name("Customer Test")
                    .phone("0902 345 678")
                    .isActive(true)
                    .build();
            customer.getUserRoles().add(UserRole.builder().user(customer).role(customerRole).build());
            userRepository.save(customer);
            log.info("Customer user created: customer@example.com / Customer@123");
        }

        log.info("Default users initialized");
    }

    private void initializeArticles() {
        List<Article> articles = Arrays.asList(
            Article.builder()
                .title("5 Lợi Ích Sức Khỏe Của Rau Xanh Mỗi Ngày")
                .titleEn("5 Health Benefits of Eating Green Vegetables Daily")
                .slug("5-loi-ich-suc-khoe-cua-rau-xanh")
                .excerpt("Rau xanh là nguồn vitamin và khoáng chất dồi dào, giúp tăng cường miễn dịch và phòng ngừa nhiều bệnh tật.")
                .excerptEn("Green vegetables are rich sources of vitamins and minerals that help boost immunity and prevent many diseases.")
                .content("<p>Rau xanh là một phần không thể thiếu trong chế độ ăn uống lành mạnh. Dưới đây là 5 lợi ích nổi bật:</p><h2>1. Tăng cường hệ miễn dịch</h2><p>Rau xanh chứa nhiều vitamin C, vitamin A và các chất chống oxy hóa giúp tăng cường sức đề kháng.</p><h2>2. Hỗ trợ tiêu hóa</h2><p>Chất xơ trong rau xanh giúp hệ tiêu hóa hoạt động tốt hơn, ngăn ngừa táo bón.</p><h2>3. Giảm nguy cơ bệnh tim</h2><p>Kali trong rau xanh giúp điều hòa huyết áp và bảo vệ sức khỏe tim mạch.</p><h2>4. Kiểm soát đường huyết</h2><p>Rau xanh có chỉ số đường huyết thấp, phù hợp cho người bị tiểu đường.</p><h2>5. Giữ dáng và đẹp da</h2><p>Ít calo nhưng giàu dinh dưỡng, rau xanh là lựa chọn hoàn hảo cho người muốn giảm cân.</p>")
                .contentEn("<p>Green vegetables are an essential part of a healthy diet. Here are 5 notable benefits:</p><h2>1. Boost Immune System</h2><p>Green vegetables are rich in vitamin C, vitamin A, and antioxidants that help strengthen immunity.</p><h2>2. Support Digestion</h2><p>Fiber in green vegetables helps the digestive system work better and prevents constipation.</p><h2>3. Reduce Heart Disease Risk</h2><p>Potassium in green vegetables helps regulate blood pressure and protects heart health.</p><h2>4. Control Blood Sugar</h2><p>Green vegetables have a low glycemic index, making them suitable for diabetics.</p><h2>5. Maintain Shape and Beautiful Skin</h2><p>Low in calories but rich in nutrients, green vegetables are the perfect choice for those wanting to lose weight.</p>")
                .image("https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800")
                .author("GreenLife Team")
                .category(ArticleCategory.NEWS)
                .tags(new HashSet<>(Arrays.asList("sức khỏe", "rau xanh", "dinh dưỡng")))
                .isFeatured(true)
                .isPublished(true)
                .viewCount(245)
                .publishedAt(LocalDateTime.now().minusDays(5))
                .build(),

            Article.builder()
                .title("Cách Chế Biến Nước Ép Trái Cây Tươi Ngon Tại Nhà")
                .titleEn("How to Make Fresh and Delicious Fruit Juice at Home")
                .slug("cach-che-bien-nuoc-ep-trai-cay")
                .excerpt("Học cách pha chế nước ép trái cây tươi mát, bổ dưỡng ngay tại nhà với những công thức đơn giản.")
                .excerptEn("Learn how to make refreshing and nutritious fruit juices at home with simple recipes.")
                .content("<p>Nước ép trái cây là cách tuyệt vời để bổ sung vitamin và khoáng chất. Hãy cùng khám phá các công thức đơn giản:</p><h2>Nước ép cam - cà rốt</h2><p>Kết hợp 2 quả cam và 1 củ cà rốt, cho vào máy ép và thưởng thức ngay.</p><h2>Nước ép táo - cần tây</h2><p>1 quả táo và 2 nhánh cần tây cho ly nước ép thanh lọc cơ thể.</p><h2>Nước ép dưa hấu - bạc hà</h2><p>Mát lạnh với dưa hấu và vài lá bạc hà tươi.</p>")
                .contentEn("<p>Fruit juice is a wonderful way to supplement vitamins and minerals. Let's explore some simple recipes:</p><h2>Orange - Carrot Juice</h2><p>Combine 2 oranges and 1 carrot, put in a juicer and enjoy immediately.</p><h2>Apple - Celery Juice</h2><p>1 apple and 2 celery stalks make a refreshing body detox juice.</p><h2>Watermelon - Mint Juice</h2><p>Cool and refreshing with watermelon and a few fresh mint leaves.</p>")
                .image("https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800")
                .author("GreenLife Team")
                .category(ArticleCategory.BLOG)
                .tags(new HashSet<>(Arrays.asList("nước ép", "trái cây", "pha chế")))
                .isFeatured(true)
                .isPublished(true)
                .viewCount(189)
                .publishedAt(LocalDateTime.now().minusDays(3))
                .build(),

            Article.builder()
                .title("Eat Clean: Chế Độ Ăn Lành Mạnh Cho Người Bận Rộn")
                .titleEn("Eat Clean: Healthy Diet for Busy People")
                .slug("eat-clean-cho-nguoi-ban-ron")
                .excerpt("Eat Clean không cần phức tạp. Cùng GreenLife tìm hiểu cách ăn uống lành mạnh dù bạn rất bận rộn.")
                .excerptEn("Eat Clean doesn't have to be complicated. Learn how to eat healthy even when you're very busy with GreenLife.")
                .content("<p>Eat Clean đang trở thành xu hướng được nhiều người lựa chọn. Tuy nhiên, không phải ai cũng có thời gian để chuẩn bị những bữa ăn phức tạp.</p><h2>Nguyên tắc Eat Clean cơ bản</h2><ul><li>Ưu tiên thực phẩm tươi sạch, ít chế biến</li><li>Hạn chế đường tinh luyện và thực phẩm chế biến sẵn</li><li>Bổ sung đủ protein, carb lành mạnh và chất béo tốt</li><li>Uống đủ nước mỗi ngày</li></ul><h2>Mẹo cho người bận rộn</h2><p>Chuẩn bị meal prep vào cuối tuần, nấu ăn đơn giản, và luôn có sẵn snack healthy trong túi.</p>")
                .contentEn("<p>Eat Clean is becoming a trend chosen by many people. However, not everyone has time to prepare complex meals.</p><h2>Basic Eat Clean Principles</h2><ul><li>Prioritize fresh, clean, minimally processed foods</li><li>Limit refined sugar and processed foods</li><li>Get enough protein, healthy carbs, and good fats</li><li>Drink enough water every day</li></ul><h2>Tips for Busy People</h2><p>Prepare meal prep on weekends, cook simple meals, and always have healthy snacks on hand.</p>")
                .image("https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800")
                .author("GreenLife Nutritionist")
                .category(ArticleCategory.NEWS)
                .tags(new HashSet<>(Arrays.asList("eat clean", "dinh dưỡng", "lối sống")))
                .isFeatured(false)
                .isPublished(true)
                .viewCount(312)
                .publishedAt(LocalDateTime.now().minusDays(7))
                .build(),

            Article.builder()
                .title("Salad Trái Cây: Món Tráng Miệng Ngon Lành Cho Mùa Hè")
                .titleEn("Fruit Salad: A Healthy Dessert for Summer")
                .slug("salad-trai-cay-cho-mua-he")
                .excerpt("Salad trái cây không chỉ ngon miệng mà còn cung cấp đầy đủ vitamin. Cùng GreenLife vào bếp!")
                .excerptEn("Fruit salad is not only delicious but also provides plenty of vitamins. Let's cook with GreenLife!")
                .content("<p>Mùa hè nóng bức, không có gì tuyệt vời hơn một ly salad trái cây mát lạnh thêm một chút sữa chua.</p><h2>Nguyên liệu</h2><ul><li>1 quả táo</li><li>1 quả lê</li><li>1 quả chuối</li><li>Nho đỏ</li><li>Dâu tây</li><li>Sữa chua không đường</li><li>Mật ong</li></ul><h2>Cách làm</h2><p>Rửa sạch trái cây, cắt khối vừa ăn, trộn đều và thêm sữa chua cùng mật ong.</p>")
                .contentEn("<p>On hot summer days, nothing beats a refreshing fruit salad topped with a bit of yogurt.</p><h2>Ingredients</h2><ul><li>1 apple</li><li>1 pear</li><li>1 banana</li><li>Red grapes</li><li>Strawberries</li><li>Unsweetened yogurt</li><li>Honey</li></ul><h2>Instructions</h2><p>Wash fruits thoroughly, cut into bite-sized pieces, mix well and add yogurt with honey.</p>")
                .image("https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800")
                .author("GreenLife Chef")
                .category(ArticleCategory.BLOG)
                .tags(new HashSet<>(Arrays.asList("salad", "trái cây", "món tráng miệng")))
                .isFeatured(false)
                .isPublished(true)
                .viewCount(156)
                .publishedAt(LocalDateTime.now().minusDays(10))
                .build(),

            Article.builder()
                .title("GreenLife Ra Mắt Dịch Vụ Giao Hàng Tươi Sạch Toàn Quốc")
                .titleEn("GreenLife Launches Fresh Delivery Service Nationwide")
                .slug("greenlife-ra-mat-dich-vu-giao-hang")
                .excerpt("GreenLife hân hạnh thông báo dịch vụ giao hàng tươi sạch giờ đây đã có mặt tại tất cả các tỉnh thành.")
                .excerptEn("GreenLife is pleased to announce that our fresh delivery service is now available in all provinces nationwide.")
                .content("<p>GreenLife - Hệ thống thực phẩm sạch hàng đầu Việt Nam, chính thức mở rộng dịch vụ giao hàng tươi sạch đến tất cả 63 tỉnh thành trên toàn quốc.</p><h2>Cam kết của GreenLife</h2><ul><li>100% sản phẩm organic, không thuốc trừ sâu</li><li>Giao hàng trong 24h kể từ khi đặt hàng</li><li>Đội ngũ giao hàng chuyên nghiệp với xe lạnh</li><li>Chính sách đổi trả trong 48h nếu không hài lòng</li></ul>")
                .contentEn("<p>GreenLife - Vietnam's leading clean food system, officially expands fresh delivery service to all 63 provinces nationwide.</p><h2>GreenLife's Commitment</h2><ul><li>100% organic products, pesticide-free</li><li>Delivery within 24 hours of ordering</li><li>Professional delivery team with refrigerated vehicles</li><li>48-hour return policy if not satisfied</li></ul>")
                .image("https://images.unsplash.com/photo-1542838132-92c53300491e?w=800")
                .author("GreenLife Team")
                .category(ArticleCategory.NEWS)
                .tags(new HashSet<>(Arrays.asList("tin tức", "giao hàng", "khuyến mãi")))
                .isFeatured(true)
                .isPublished(true)
                .viewCount(523)
                .publishedAt(LocalDateTime.now().minusDays(1))
                .build()
        );

        articleRepository.saveAll(articles);
        log.info("Sample articles created with English translations");
    }

    /**
     * Seed demo GreenLife (rau, trái cây…) — đổi sang nhóm phù hợp CT GROUP (giữ nguyên id để không gãy FK sản phẩm).
     */
    private void migrateLegacyGreenLifeCategoriesToCtGroup() {
        record Mig(String oldSlug, String newSlug, String name, String description, String image) {}
        List<Mig> migs = Arrays.asList(
                new Mig("rau-xanh", "do-thi-ha-tang",
                        "Đô thị thông minh & Hạ tầng",
                        "Giải pháp đô thị thông minh, hạ tầng giao thông và logistics xanh.",
                        "/images/ctgroup/KV_Nganh-1.png"),
                new Mig("trai-cay", "cong-nghe-cao",
                        "Công nghệ cao & Sản xuất",
                        "Bán dẫn, UAV, AI, công nghệ không gian và tự động hóa.",
                        "/images/ctgroup/KV_Nganh-11.png"),
                new Mig("thit-sach", "y-te-doi-song",
                        "Y tế & Đời sống",
                        "Thực phẩm sạch, y tế, công nghệ sinh học và chăm sóc sức khỏe.",
                        "/images/ctgroup/KV_Nganh-3.png"),
                new Mig("hai-san", "nang-luong-moi-truong",
                        "Năng lượng & Môi trường",
                        "Tín chỉ carbon, tài sản số xanh và phát triển bền vững.",
                        "/images/ctgroup/KV_Nganh-10.png"),
                new Mig("thuc-pham-che-bien", "dich-vu-doi-moi",
                        "Dịch vụ & Đổi mới sáng tạo",
                        "CT Innovation Hub, tư vấn chuyển đổi số và đồng hành doanh nghiệp.",
                        "/images/ctgroup/KV_Nganh-9.png")
        );
        for (int i = 0; i < migs.size(); i++) {
            final Mig m = migs.get(i);
            final int sortOrder = i + 1;
            categoryRepository.findBySlug(m.oldSlug()).ifPresent(cat -> {
                boolean newSlugAvailable = categoryRepository.findBySlug(m.newSlug())
                        .map(o -> o.getId().equals(cat.getId()))
                        .orElse(true);
                if (newSlugAvailable) {
                    cat.setSlug(m.newSlug());
                }
                cat.setName(m.name());
                cat.setDescription(m.description());
                cat.setImage(m.image());
                cat.setSortOrder(sortOrder);
                categoryRepository.save(cat);
                log.info("Category migrated: {} -> {}", m.oldSlug(), cat.getSlug());
            });
        }
    }

    private List<Category> ensureCtGroupCategoriesForProducts() {
        record Spec(int order, String slug, String name, String description, String image) {}
        List<Spec> specs = Arrays.asList(
                new Spec(1, "do-thi-ha-tang", "Đô thị thông minh & Hạ tầng",
                        "Giải pháp đô thị thông minh, hạ tầng giao thông và logistics xanh.",
                        "/images/ctgroup/KV_Nganh-1.png"),
                new Spec(2, "cong-nghe-cao", "Công nghệ cao & Sản xuất",
                        "Bán dẫn, UAV, AI, công nghệ không gian và tự động hóa.",
                        "/images/ctgroup/KV_Nganh-11.png"),
                new Spec(3, "y-te-doi-song", "Y tế & Đời sống",
                        "Thực phẩm sạch, y tế, công nghệ sinh học và chăm sóc sức khỏe.",
                        "/images/ctgroup/KV_Nganh-3.png"),
                new Spec(4, "nang-luong-moi-truong", "Năng lượng & Môi trường",
                        "Tín chỉ carbon, tài sản số xanh và phát triển bền vững.",
                        "/images/ctgroup/KV_Nganh-10.png"),
                new Spec(5, "dich-vu-doi-moi", "Dịch vụ & Đổi mới sáng tạo",
                        "CT Innovation Hub, tư vấn chuyển đổi số và đồng hành doanh nghiệp.",
                        "/images/ctgroup/KV_Nganh-9.png")
        );
        List<Category> list = new ArrayList<>();
        for (Spec s : specs) {
            Category c = categoryRepository.findBySlug(s.slug())
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .name(s.name())
                            .slug(s.slug())
                            .description(s.description())
                            .image(s.image())
                            .isActive(true)
                            .sortOrder(s.order())
                            .build()));
            c.setName(s.name());
            c.setDescription(s.description());
            c.setImage(s.image());
            c.setSortOrder(s.order());
            c.setIsActive(true);
            categoryRepository.save(c);
            list.add(c);
        }
        return list;
    }

    private void initializeProducts() {
        List<Category> categories = ensureCtGroupCategoriesForProducts();
        Category catDoThi = categories.get(0);
        Category catCnCao = categories.get(1);
        Category catYTe = categories.get(2);
        Category catNangLuong = categories.get(3);
        Category catDichVu = categories.get(4);

        List<Product> products = Arrays.asList(
                Product.builder()
                        .name("Gói tích hợp Smart City")
                        .slug("goi-tich-hop-smart-city")
                        .description("Khung giải pháp đô thị thông minh: IoT, dữ liệu đô thị, tích hợp hệ thống quản trị.")
                        .shortDesc("Smart City — tư vấn & triển khai")
                        .price(new BigDecimal("0"))
                        .sku("CT-SC-001")
                        .image("/images/ctgroup/KV_Nganh-1.png")
                        .stock(999)
                        .unit("gói")
                        .isActive(true)
                        .isFeatured(true)
                        .isBestSeller(false)
                        .category(catDoThi)
                        .build(),
                Product.builder()
                        .name("Hệ thống giám sát UAV công nghiệp")
                        .slug("he-thong-giam-sat-uav")
                        .description("Nền tảng điều phối UAV, giám sát an ninh và khảo sát hạ tầng.")
                        .shortDesc("UAV — nền tảng giám sát")
                        .price(new BigDecimal("0"))
                        .sku("CT-UAV-001")
                        .image("/images/ctgroup/KV_Nganh-4.png")
                        .stock(999)
                        .unit("hệ thống")
                        .isActive(true)
                        .isFeatured(true)
                        .category(catCnCao)
                        .build(),
                Product.builder()
                        .name("Nền tảng phân tích AI doanh nghiệp")
                        .slug("nen-tang-phan-tich-ai")
                        .description("Ứng dụng machine learning cho vận hành, dự báo và tối ưu quy trình.")
                        .shortDesc("AI — phân tích & tự động hóa")
                        .price(new BigDecimal("0"))
                        .sku("CT-AI-001")
                        .image("/images/ctgroup/KV_Nganh-2.png")
                        .stock(999)
                        .unit("nền tảng")
                        .isActive(true)
                        .isFeatured(true)
                        .category(catCnCao)
                        .build(),
                Product.builder()
                        .name("Liên hợp thực phẩm sạch & y tế")
                        .slug("lien-hop-thuc-pham-y-te")
                        .description("Mô hình chuỗi cung ứng thực phẩm sạch kết hợp dịch vụ chăm sóc sức khỏe.")
                        .shortDesc("Clean food & healthcare")
                        .price(new BigDecimal("0"))
                        .sku("CT-HE-001")
                        .image("/images/ctgroup/KV_Nganh-3.png")
                        .stock(999)
                        .unit("gói")
                        .isActive(true)
                        .isFeatured(false)
                        .category(catYTe)
                        .build(),
                Product.builder()
                        .name("Tư vấn thị trường tín chỉ carbon")
                        .slug("tu-van-tin-chi-carbon")
                        .description("Hỗ trợ doanh nghiệp tiếp cận cơ chế tín chỉ carbon và báo cáo ESG.")
                        .shortDesc("Carbon credits & ESG")
                        .price(new BigDecimal("0"))
                        .sku("CT-CARBON-001")
                        .image("/images/ctgroup/KV_Nganh-10.png")
                        .stock(999)
                        .unit("dự án")
                        .isActive(true)
                        .isFeatured(true)
                        .category(catNangLuong)
                        .build(),
                Product.builder()
                        .name("Chương trình CT Innovation Hub 4.0")
                        .slug("ct-innovation-hub-4")
                        .description("Ươm tạo startup, lab công nghệ và kết nối đối tác chiến lược.")
                        .shortDesc("Innovation Hub 4.0")
                        .price(new BigDecimal("0"))
                        .sku("CT-HUB-001")
                        .image("/images/ctgroup/KV_Nganh-9.png")
                        .stock(999)
                        .unit("chương trình")
                        .isActive(true)
                        .isFeatured(true)
                        .isBestSeller(true)
                        .category(catDichVu)
                        .build()
        );

        productRepository.saveAll(products);
        log.info("CT GROUP demo products created ({} items)", products.size());
    }
}
