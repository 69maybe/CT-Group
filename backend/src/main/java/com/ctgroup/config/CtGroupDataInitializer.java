package com.ctgroup.config;

import com.ctgroup.entity.Article;
import com.ctgroup.entity.BusinessSector;
import com.ctgroup.entity.enums.ArticleCategory;
import com.ctgroup.repository.ArticleRepository;
import com.ctgroup.repository.BusinessSectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds CT GROUP business sectors and sample news when tables are empty (first deploy / dev DB).
 */
@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class CtGroupDataInitializer implements ApplicationRunner {

    private final BusinessSectorRepository businessSectorRepository;
    private final ArticleRepository articleRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedBusinessSectors();
        seedSampleArticles();
    }

    private void seedBusinessSectors() {
        if (businessSectorRepository.count() > 0) {
            log.info("Business sectors already seeded, skipping.");
            return;
        }
        log.info("Ensuring business_sectors data for CT GROUP VIETNAM (upsert by slug)");
        List<BusinessSector> seeds = List.of(
                sector(1, "smart-city", "/images/ctgroup/KV_Nganh-1.png",
                        "Thành phố thông minh", "Smart City",
                        "IoT · AI · Đô thị", "IoT · AI · Urban",
                        "Giải pháp thành phố thông minh toàn diện, tích hợp IoT, AI và dữ liệu lớn để nâng cao chất lượng cuộc sống đô thị.",
                        "Comprehensive smart city solutions integrating IoT, AI and big data to enhance urban quality of life.",
                        "/business-sector/smart-city"),
                sector(2, "infrastructure", "/images/ctgroup/KV_Nganh-2.png",
                        "Hạ tầng giao thông & xã hội", "Infrastructure & logistics",
                        "Giao thông · Logistic xanh", "Transport · Green logistics",
                        "Phát triển hạ tầng giao thông, hạ tầng xã hội và hạ tầng logistic xanh.",
                        "Developing transportation infrastructure, social infrastructure and green logistics infrastructure.",
                        "/business-sector/infrastructure"),
                sector(3, "clean-food-healthcare", "/images/ctgroup/KV_Nganh-3.png",
                        "Thực phẩm sạch & Y tế", "Clean food & healthcare",
                        "Thực phẩm sạch · Y tế", "Clean food · Healthcare",
                        "Cung cấp thực phẩm sạch, dịch vụ chăm sóc sức khỏe và giải pháp y tế tiên tiến.",
                        "Providing clean food, healthcare services and advanced medical solutions.",
                        "/business-sector/clean-food"),
                sector(4, "uav", "/images/ctgroup/KV_Nganh-4.png",
                        "Máy bay không người lái", "Unmanned aerial vehicles",
                        "UAV · Drone", "UAV · Drone",
                        "Nghiên cứu và phát triển công nghệ UAV cho các ứng dụng dân dụng và công nghiệp.",
                        "Research and development of UAV technology for civil and industrial applications.",
                        "/business-sector/uav"),
                sector(5, "lae", "/images/ctgroup/KV_Nganh-5.png",
                        "Kinh tế hàng không thấp (LAE)", "Low altitude economy",
                        "Drone · eVTOL", "Drone · eVTOL",
                        "Khai thác và phát triển kinh tế hàng không thấp, bao gồm drone và eVTOL.",
                        "Exploiting and developing low altitude economy including drones and eVTOL.",
                        "/low-altitude-economy"),
                sector(6, "national-digital-twin", "/images/ctgroup/KV_Nganh-6.png",
                        "Mô hình số quốc gia 15 tầng", "15-layer national digital twin",
                        "Số hóa quốc gia", "National digitization",
                        "Xây dựng mô hình số quốc gia 15 tầng, số hóa toàn diện đất nước.",
                        "Building 15-layer national digital twin model, comprehensive digitization of the country.",
                        "/business-sector/digital-twin"),
                sector(7, "robotic-house", "/images/ctgroup/KV_Nganh-7.png",
                        "Nhà robot", "Robotic house",
                        "Tự động hóa · Nhà thông minh", "Automation · Smart home",
                        "Phát triển và ứng dụng robot trong gia đình và công nghiệp.",
                        "Developing and applying robots in households and industry.",
                        "/business-sector/robotic"),
                sector(8, "biotechnology", "/images/ctgroup/KV_Nganh-8-TA.png",
                        "Công nghệ sinh học", "Biotechnology",
                        "Nông nghiệp · Y tế · Môi trường", "Agri · Health · Environment",
                        "Nghiên cứu và ứng dụng công nghệ sinh học tiên tiến trong nông nghiệp, y tế và môi trường.",
                        "Research and application of advanced biotechnology in agriculture, healthcare and environment.",
                        "/business-sector/biotechnology"),
                sector(9, "innovation-hub", "/images/ctgroup/KV_Nganh-9.png",
                        "CT Innovation Hub 4.0", "CT Innovation Hub 4.0",
                        "Startup · R&D", "Startup · R&D",
                        "Trung tâm đổi mới sáng tạo 4.0, hỗ trợ startups và doanh nghiệp công nghệ.",
                        "Innovation Hub 4.0, supporting startups and technology enterprises.",
                        "/business-sector/innovation-hub"),
                sector(10, "carbon-credits", "/images/ctgroup/KV_Nganh-10.png",
                        "Tín chỉ carbon", "Carbon credits",
                        "Kinh tế carbon thấp", "Low-carbon economy",
                        "Phát triển và giao dịch tín chỉ carbon, hướng tới nền kinh tế carbon thấp.",
                        "Developing and trading carbon credits, towards low-carbon economy.",
                        "/carbon-credits"),
                sector(11, "semiconductor", "/images/ctgroup/KV_Nganh-11.png",
                        "Chip bán dẫn", "Semiconductor",
                        "Vi mạch · Linh kiện", "Microchips · Components",
                        "Nghiên cứu và phát triển công nghệ chip bán dẫn, vi mạch và linh kiện điện tử.",
                        "Research and development of semiconductor chip technology, microchips and electronic components.",
                        "/business-sector/semiconductor"),
                sector(12, "space-technology", "/images/ctgroup/KV_Nganh-12.png",
                        "Công nghệ không gian", "Space technology",
                        "Vệ tinh · Viễn thông", "Satellite · Telecom",
                        "Nghiên cứu và ứng dụng công nghệ vũ trụ trong viễn thông và quan sát Trái Đất.",
                        "Research and application of space technology in telecommunications and Earth observation.",
                        "/business-sector/space"),
                sector(13, "autonomous-vehicle", "/images/ctgroup/KV_Nganh-1.png",
                        "Xe tự hành", "Autonomous vehicle technology",
                        "Lái tự động · ADAS", "Self-driving · ADAS",
                        "Phát triển công nghệ xe tự hành cho giao thông thông minh.",
                        "Developing autonomous vehicle technology for smart transportation.",
                        "/business-sector/autonomous"),
                sector(14, "artificial-intelligence", "/images/ctgroup/KV_Nganh-2.png",
                        "Trí tuệ nhân tạo", "Artificial intelligence",
                        "ML · GenAI · Ứng dụng", "ML · GenAI · Applications",
                        "Nghiên cứu và phát triển các giải pháp AI cho doanh nghiệp và cuộc sống.",
                        "Research and development of AI solutions for businesses and life.",
                        "/business-sector/ai"),
                sector(15, "green-crypto", "/images/ctgroup/KV_Nganh-3.png",
                        "Tiền mã hóa xanh", "Green cryptocurrency",
                        "Tài sản số bền vững", "Sustainable digital assets",
                        "Phát triển cryptocurrency xanh, thân thiện với môi trường.",
                        "Developing green, environmentally friendly cryptocurrency.",
                        "/business-sector/crypto"),
                sector(16, "iot", "/images/ctgroup/KV_Nganh-1.png",
                        "IoT", "IoT",
                        "Internet of Things", "Internet of Things",
                        "Nền tảng IoT cho nhà máy/đô thị thông minh, thu thập dữ liệu thiết bị theo thời gian thực và vận hành tối ưu.",
                        "IoT platforms for smart factories/cities with real-time device data collection and operational optimization.",
                        "/business-sector/iot"),
                sector(17, "chatbot-ai", "/images/ctgroup/KV_Nganh-2.png",
                        "Chatbot AI", "Chatbot AI",
                        "Conversational AI", "Conversational AI",
                        "Xây dựng chatbot/voicebot cho CSKH, bán hàng và trợ lý nội bộ với tích hợp hệ thống doanh nghiệp.",
                        "Build chatbot/voicebot for customer support, sales, and internal assistants with enterprise integrations.",
                        "/business-sector/chatbot-ai"),
                sector(18, "drone-uav", "/images/ctgroup/KV_Nganh-4.png",
                        "Drone (UAV)", "Drone (UAV)",
                        "Khảo sát · Giám sát", "Survey · Monitoring",
                        "Ứng dụng drone/UAV cho khảo sát, giám sát, nông nghiệp và kiểm tra hạ tầng công nghiệp.",
                        "Drone/UAV applications for surveying, monitoring, agriculture, and industrial infrastructure inspection.",
                        "/business-sector/drone-uav"),
                sector(19, "cnc-controller", "/images/ctgroup/KV_Nganh-11.png",
                        "Bộ điều khiển CNC", "CNC Controller",
                        "Motion control · Tích hợp", "Motion control · Integration",
                        "Giải pháp điều khiển CNC, motion control và tích hợp dây chuyền sản xuất.",
                        "CNC control solutions, motion control, and production line integration.",
                        "/business-sector/cnc-controller"),
                sector(20, "industrial-robot", "/images/ctgroup/KV_Nganh-7.png",
                        "Robot công nghiệp", "Industrial robot",
                        "Tự động hóa sản xuất", "Manufacturing automation",
                        "Robot công nghiệp cho tự động hóa sản xuất: gắp đặt, hàn, đóng gói, kiểm tra chất lượng.",
                        "Industrial robots for manufacturing automation: pick-and-place, welding, packaging, and quality inspection.",
                        "/business-sector/industrial-robot")
        );
        int inserted = 0;
        int updated = 0;
        for (BusinessSector seed : seeds) {
            var existing = businessSectorRepository.findBySlug(seed.getSlug());
            if (existing.isEmpty()) {
                businessSectorRepository.save(seed);
                inserted++;
            } else {
                BusinessSector e = existing.get();
                copySectorFields(e, seed);
                businessSectorRepository.save(e);
                updated++;
            }
        }
        log.info("Business sectors: {} inserted, {} updated (canonical slugs)", inserted, updated);
    }

    private static void copySectorFields(BusinessSector target, BusinessSector src) {
        target.setSortOrder(src.getSortOrder());
        target.setImagePath(src.getImagePath());
        target.setTitleVi(src.getTitleVi());
        target.setTitleEn(src.getTitleEn());
        target.setSubtitleVi(src.getSubtitleVi());
        target.setSubtitleEn(src.getSubtitleEn());
        target.setDescriptionVi(src.getDescriptionVi());
        target.setDescriptionEn(src.getDescriptionEn());
        target.setDetailHref(src.getDetailHref());
        target.setActive(Boolean.TRUE.equals(src.getActive()));
    }

    private static BusinessSector sector(int order, String slug, String image,
                                         String titleVi, String titleEn,
                                         String subVi, String subEn,
                                         String descVi, String descEn,
                                         String href) {
        return BusinessSector.builder()
                .slug(slug)
                .sortOrder(order)
                .imagePath(image)
                .titleVi(titleVi)
                .titleEn(titleEn)
                .subtitleVi(subVi)
                .subtitleEn(subEn)
                .descriptionVi(descVi)
                .descriptionEn(descEn)
                .detailHref(href)
                .active(true)
                .build();
    }

    private void seedSampleArticles() {
        if (articleRepository.count() > 0) {
            return;
        }
        log.info("Seeding sample CT GROUP articles");
        LocalDateTime now = LocalDateTime.now();
        Article a1 = Article.builder()
                .title("CT GROUP giới thiệu giải pháp Smart City tại Vietnam Tech Week 2026")
                .titleEn("CT GROUP Introduces Smart City Solutions at Vietnam Tech Week 2026")
                .slug("ct-smart-city-vietnam-tech-week-2026")
                .excerpt("CT GROUP đã giới thiệu các giải pháp thành phố thông minh tiên tiến tại sự kiện Vietnam Tech Week 2026.")
                .excerptEn("CT GROUP showcased advanced smart city solutions at Vietnam Tech Week 2026.")
                .content("<p>CT GROUP đã tham gia Vietnam Tech Week 2026 với các giải pháp thành phố thông minh.</p>")
                .contentEn("<p>CT GROUP participated in Vietnam Tech Week 2026 with smart city solutions.</p>")
                .image("/images/ctgroup/CT-Land.jpg")
                .author("CT GROUP Marketing")
                .category(ArticleCategory.NEWS)
                .isFeatured(true)
                .isPublished(true)
                .publishedAt(now.minusDays(30))
                .build();

        Article a2 = Article.builder()
                .title("Hợp tác chiến lược với đối tác Nhật Bản trong lĩnh vực AI")
                .titleEn("Strategic Partnership with Japanese Partner in AI Field")
                .slug("ct-ai-partnership-japan-2026")
                .excerpt("CT GROUP ký kết hợp tác chiến lược với tập đoàn công nghệ hàng đầu Nhật Bản.")
                .excerptEn("CT GROUP signs strategic partnership with a leading Japanese technology group.")
                .content("<p>Hợp tác phát triển trí tuệ nhân tạo và ứng dụng công nghiệp.</p>")
                .contentEn("<p>Cooperation on AI and industrial applications.</p>")
                .image("/images/ctgroup/Logiin.jpg")
                .author("CT GROUP Marketing")
                .category(ArticleCategory.NEWS)
                .isFeatured(true)
                .isPublished(true)
                .publishedAt(now.minusDays(45))
                .build();

        Article a3 = Article.builder()
                .title("Ra mắt CT Innovation Hub 4.0 - Trung tâm đổi mới sáng tạo")
                .titleEn("Launch of CT Innovation Hub 4.0 - Innovation Center")
                .slug("ct-innovation-hub-4-launch")
                .excerpt("CT GROUP chính thức ra mắt CT Innovation Hub 4.0.")
                .excerptEn("CT GROUP officially launches CT Innovation Hub 4.0.")
                .content("<p>Trung tâm hỗ trợ startup và R&D công nghệ.</p>")
                .contentEn("<p>Supporting startups and technology R&D.</p>")
                .image("/images/ctgroup/Bon-14.jpg")
                .author("CT GROUP Marketing")
                .category(ArticleCategory.NEWS)
                .isFeatured(true)
                .isPublished(true)
                .publishedAt(now.minusDays(60))
                .build();

        articleRepository.saveAll(List.of(a1, a2, a3));
        log.info("Inserted {} sample articles", 3);
    }
}
