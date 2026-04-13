package com.ctgroup.service;

import com.ctgroup.dto.request.OrderRequest;
import com.ctgroup.dto.request.OrderStatusUpdateRequest;
import com.ctgroup.dto.response.OrderItemResponse;
import com.ctgroup.dto.response.OrderResponse;
import com.ctgroup.dto.response.PageResponse;
import com.ctgroup.entity.Order;
import com.ctgroup.entity.OrderItem;
import com.ctgroup.entity.Product;
import com.ctgroup.entity.User;
import com.ctgroup.entity.enums.OrderStatus;
import com.ctgroup.exception.ResourceNotFoundException;
import com.ctgroup.repository.OrderItemRepository;
import com.ctgroup.repository.OrderRepository;
import com.ctgroup.repository.ProductRepository;
import com.ctgroup.repository.UserRepository;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrders(String userId, Integer page, Integer limit, String status) {
        Pageable pageable = PageRequest.of(
                page != null ? page - 1 : 0,
                limit != null ? limit : 20,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<Order> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(userId)) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), OrderStatus.valueOf(status.toUpperCase())));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Order> orderPage = orderRepository.findAll(spec, pageable);

        List<OrderResponse> orders = orderPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.of(orders, orderPage.getTotalElements(), page != null ? page : 1, limit != null ? limit : 20);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request, String userId) {
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .customerAddress(request.getCustomerAddress())
                .deliveryTime(request.getDeliveryTime())
                .deliveryNote(request.getDeliveryNote())
                .paymentMethod(request.getPaymentMethod())
                .note(request.getNote())
                .build();

        if (StringUtils.hasText(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            order.setUser(user);
            if (request.getCustomerName() == null) {
                order.setCustomerName(user.getName());
            }
            if (request.getCustomerPhone() == null) {
                order.setCustomerPhone(user.getPhone());
            }
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .total(itemTotal)
                    .build();

            order.getItems().add(orderItem);
            subtotal = subtotal.add(itemTotal);
        }

        order.setSubtotal(subtotal);
        order.setTotal(subtotal.add(order.getShippingFee()).subtract(order.getDiscount()));

        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(String id, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }
        if (request.getNote() != null) {
            order.setNote(request.getNote());
        }

        order = orderRepository.save(order);
        return mapToResponse(order);
    }

    @Transactional
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        orderRepository.delete(order);
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "GL" + timestamp + uuid;
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProduct().getImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .total(item.getTotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .userName(order.getUser() != null ? order.getUser().getName() : null)
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .shippingFee(order.getShippingFee())
                .total(order.getTotal())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .customerEmail(order.getCustomerEmail())
                .customerAddress(order.getCustomerAddress())
                .deliveryTime(order.getDeliveryTime())
                .deliveryNote(order.getDeliveryNote())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .note(order.getNote())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
