package com.greenlife.service;

import com.greenlife.dto.request.ProductRequest;
import com.greenlife.dto.response.PageResponse;
import com.greenlife.dto.response.ProductResponse;
import com.greenlife.entity.Category;
import com.greenlife.entity.Product;
import com.greenlife.exception.ConflictException;
import com.greenlife.exception.ResourceNotFoundException;
import com.greenlife.repository.CategoryRepository;
import com.greenlife.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProducts(
            Integer page, Integer limit, String category, String search,
            String sort, BigDecimal minPrice, BigDecimal maxPrice) {

        Pageable pageable = PageRequest.of(
                page != null ? page - 1 : 0,
                limit != null ? limit : 20,
                getSort(sort)
        );

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isTrue(root.get("isActive")));

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category").get("slug"), category));
            }

            if (StringUtils.hasText(search)) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchPattern),
                        cb.like(cb.lower(root.get("description")), searchPattern)
                ));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<ProductResponse> products = productPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.of(products, productPage.getTotalElements(), page != null ? page : 1, limit != null ? limit : 20);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findFeaturedProducts().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getBestSellers() {
        return productRepository.findBestSellers().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySlug(generateSlug(request.getName()))) {
            throw new ConflictException("Product slug already exists");
        }

        if (request.getSku() != null && productRepository.existsBySku(request.getSku())) {
            throw new ConflictException("SKU already exists");
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Product product = Product.builder()
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .description(request.getDescription())
                .shortDesc(request.getShortDesc())
                .price(request.getPrice())
                .comparePrice(request.getComparePrice())
                .sku(request.getSku())
                .barcode(request.getBarcode())
                .image(request.getImage())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .unit(request.getUnit() != null ? request.getUnit() : "phần")
                .calories(request.getCalories())
                .weight(request.getWeight())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isBestSeller(request.getIsBestSeller() != null ? request.getIsBestSeller() : false)
                .metaTitle(request.getMetaTitle())
                .metaDesc(request.getMetaDesc())
                .category(category)
                .build();

        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(String id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        if (request.getName() != null) {
            product.setName(request.getName());
            product.setSlug(generateSlug(request.getName()));
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getShortDesc() != null) {
            product.setShortDesc(request.getShortDesc());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getComparePrice() != null) {
            product.setComparePrice(request.getComparePrice());
        }
        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        if (request.getBarcode() != null) {
            product.setBarcode(request.getBarcode());
        }
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getUnit() != null) {
            product.setUnit(request.getUnit());
        }
        if (request.getCalories() != null) {
            product.setCalories(request.getCalories());
        }
        if (request.getWeight() != null) {
            product.setWeight(request.getWeight());
        }
        if (request.getIsActive() != null) {
            product.setIsActive(request.getIsActive());
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsBestSeller() != null) {
            product.setIsBestSeller(request.getIsBestSeller());
        }
        if (request.getMetaTitle() != null) {
            product.setMetaTitle(request.getMetaTitle());
        }
        if (request.getMetaDesc() != null) {
            product.setMetaDesc(request.getMetaDesc());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        productRepository.delete(product);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }

    private Sort getSort(String sort) {
        if (sort == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        return switch (sort.toLowerCase()) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "name_asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc" -> Sort.by(Sort.Direction.DESC, "name");
            case "popularity" -> Sort.by(Sort.Direction.DESC, "isBestSeller");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .shortDesc(product.getShortDesc())
                .price(product.getPrice())
                .comparePrice(product.getComparePrice())
                .sku(product.getSku())
                .barcode(product.getBarcode())
                .image(product.getImage())
                .images(product.getImages())
                .stock(product.getStock())
                .unit(product.getUnit())
                .calories(product.getCalories())
                .weight(product.getWeight())
                .isActive(product.getIsActive())
                .isFeatured(product.getIsFeatured())
                .isBestSeller(product.getIsBestSeller())
                .metaTitle(product.getMetaTitle())
                .metaDesc(product.getMetaDesc())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
