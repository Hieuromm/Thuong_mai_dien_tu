package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.request.CreateOrderRequest;
import com.thuongmaidientu.backend.entity.*;
import com.thuongmaidientu.backend.repository.*;
import com.thuongmaidientu.backend.service.Notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    // 2. Inject NotificationService
    private final NotificationService notificationService;

    /* ========================================================================
       1. API DÀNH CHO NGƯỜI MUA (BUYER)
       ======================================================================== */

    // A. TẠO ĐƠN HÀNG (CHECKOUT)
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@RequestBody CreateOrderRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        // Lấy giỏ hàng
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        // Lọc sản phẩm được chọn
        List<Long> selectedIds = request.getSelectedCartItemIds();
        if (selectedIds == null || selectedIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn sản phẩm");
        }

        List<CartItem> selectedItems = cart.getItems().stream()
                .filter(item -> selectedIds.contains(item.getId()))
                .collect(Collectors.toList());

        if (selectedItems.isEmpty()) return ResponseEntity.badRequest().body("Sản phẩm không hợp lệ");

        // Tách đơn theo Shop
        Map<Shop, List<CartItem>> itemsByShop = selectedItems.stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getShop()));

        List<Order> createdOrders = new ArrayList<>();

        for (Map.Entry<Shop, List<CartItem>> entry : itemsByShop.entrySet()) {
            Shop shop = entry.getKey();
            List<CartItem> items = entry.getValue();

            double totalAmount = items.stream().mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity()).sum();

            Order order = Order.builder()
                    .user(user)
                    .shop(shop)
                    .status(OrderStatus.PENDING)
                    .totalAmount(totalAmount)
                    .shippingAddress(request.getAddress())
                    .paymentMethod(request.getPaymentMethod())
                    .note(request.getNote())
                    .items(new ArrayList<>())
                    .build();

            Order savedOrder = orderRepository.save(order);

            for (CartItem ci : items) {
                // Logic tạo variant string...
                String variantString = "";
                if (ci.getVariant1() != null) variantString += ci.getVariant1();
                if (ci.getVariant2() != null) variantString += " - " + ci.getVariant2();

                OrderItem oi = OrderItem.builder()
                        .order(savedOrder)
                        .product(ci.getProduct())
                        .quantity(ci.getQuantity())
                        .price(ci.getProduct().getPrice())
                        .variant(variantString.trim())
                        .build();
                savedOrder.getItems().add(oi);
            }
            orderRepository.save(savedOrder);
            createdOrders.add(savedOrder);

            // --- 3. GỬI THÔNG BÁO CHO SHOP: CÓ ĐƠN HÀNG MỚI ---
            notificationService.createNotification(
                    shop.getUser(), // Chủ shop
                    "Bạn có đơn hàng mới!",
                    "Đơn hàng #" + savedOrder.getId() + " trị giá " + totalAmount + "đ vừa được tạo.",
                    "ORDER",
                    savedOrder.getId()
            );
        }

        // Xóa khỏi giỏ
        cart.getItems().removeAll(selectedItems);
        cartRepository.save(cart);

        return ResponseEntity.ok(createdOrders);
    }

    // B. LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(orders);
    }

    // C. HỦY ĐƠN HÀNG (Khi còn PENDING)
    @PutMapping("/{orderId}/cancel")
    @Transactional // Thêm Transactional để đảm bảo thông báo gửi cùng lúc update DB
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Bạn không có quyền hủy đơn này");
        }

        if (order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            // --- GỬI THÔNG BÁO CHO SHOP: KHÁCH HỦY ĐƠN ---
            notificationService.createNotification(
                    order.getShop().getUser(),
                    "Khách hàng đã hủy đơn",
                    "Đơn hàng #" + order.getId() + " đã bị khách hàng hủy.",
                    "ORDER",
                    order.getId()
            );

            return ResponseEntity.ok("Hủy đơn hàng thành công");
        }
        return ResponseEntity.badRequest().body("Không thể hủy đơn hàng này");
    }

    // D. YÊU CẦU TRẢ HÀNG
    @PutMapping("/{orderId}/return-request")
    public ResponseEntity<?> requestReturn(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Bạn không có quyền thao tác trên đơn hàng này");
        }

        if (order.getStatus() == OrderStatus.COMPLETED) {
            order.setStatus(OrderStatus.RETURN_REQUESTED);
            orderRepository.save(order);

            // --- GỬI THÔNG BÁO CHO SHOP: CÓ YÊU CẦU TRẢ HÀNG ---
            notificationService.createNotification(
                    order.getShop().getUser(),
                    "Yêu cầu trả hàng/hoàn tiền",
                    "Đơn hàng #" + order.getId() + " có yêu cầu trả hàng từ người mua.",
                    "ORDER",
                    order.getId()
            );

            return ResponseEntity.ok("Gửi yêu cầu trả hàng thành công");
        }

        return ResponseEntity.badRequest().body("Đơn hàng chưa hoàn thành hoặc trạng thái không hợp lệ");
    }

    /* ========================================================================
       2. API DÀNH CHO NGƯỜI BÁN (SELLER)
       ======================================================================== */

    @GetMapping("/seller")
    public ResponseEntity<?> getSellerOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

        List<Order> orders = orderRepository.findByShopIdOrderByCreatedAtDesc(shop.getId());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/seller/{orderId}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        Shop shop = shopRepository.findByUserId(user.getId()).orElseThrow();

        Order order = orderRepository.findById(orderId).orElseThrow();

        if (!order.getShop().getId().equals(shop.getId())) {
            return ResponseEntity.badRequest().body("Không có quyền truy cập");
        }

        try {
            OrderStatus newStatus = OrderStatus.valueOf(status);
            OrderStatus oldStatus = order.getStatus();

            // Logic Trừ kho
            if (newStatus == OrderStatus.CONFIRMED && oldStatus == OrderStatus.PENDING) {
                updateProductStock(order, false);

                // --- THÔNG BÁO CHO KHÁCH: ĐƠN ĐÃ ĐƯỢC XÁC NHẬN ---
                notificationService.createNotification(
                        order.getUser(),
                        "Đơn hàng đã được xác nhận",
                        "Shop đã xác nhận đơn hàng #" + order.getId() + ". Đang chuẩn bị hàng.",
                        "ORDER",
                        order.getId()
                );
            }

            // Logic Hoàn kho
            boolean shouldRestock = false;
            if (newStatus == OrderStatus.DELIVERY_FAILED) shouldRestock = true;
            if (newStatus == OrderStatus.RETURNED) shouldRestock = true;
            if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.PENDING) shouldRestock = true;

            if (shouldRestock) {
                updateProductStock(order, true);
            }

            // --- 4. LOGIC THÔNG BÁO KHI ĐƠN HÀNG THÀNH CÔNG (COMPLETED) ---
            if (newStatus == OrderStatus.COMPLETED) {
                // Báo cho Người mua (Để vào đánh giá)
                notificationService.createNotification(
                        order.getUser(),
                        "Giao hàng thành công!",
                        "Đơn hàng #" + order.getId() + " đã được giao. Hãy đánh giá sản phẩm để nhận xu nhé!",
                        "ORDER",
                        order.getId()
                );

                // Báo cho Shop (Seller) - Báo doanh thu
                notificationService.createNotification(
                        shop.getUser(),
                        "Đơn hàng hoàn tất",
                        "Đơn hàng #" + order.getId() + " đã hoàn thành. Doanh thu đã được ghi nhận vào ví.",
                        "ORDER",
                        order.getId()
                );
            }

            // --- THÔNG BÁO KHI SHOP HỦY ĐƠN ---
            if (newStatus == OrderStatus.CANCELLED && oldStatus != OrderStatus.CANCELLED) {
                notificationService.createNotification(
                        order.getUser(),
                        "Đơn hàng bị hủy",
                        "Rất tiếc, Shop đã hủy đơn hàng #" + order.getId() + " của bạn.",
                        "ORDER",
                        order.getId()
                );
            }

            order.setStatus(newStatus);
            orderRepository.save(order);
            return ResponseEntity.ok("Cập nhật thành công: " + status);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // --- Helper cập nhật kho ---
    private void updateProductStock(Order order, boolean isRestock) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            int quantity = item.getQuantity();

            if (product.isHasVariants()) {
                String variantString = item.getVariant();
                ProductVariant variant = null;
                if (variantString != null) {
                    variant = productVariantRepository.findByProductIdAndValue1(product.getId(), variantString).orElse(null);
                }

                if (variant != null) {
                    int newStock = isRestock ? variant.getStock() + quantity : variant.getStock() - quantity;
                    if (newStock < 0) throw new RuntimeException("Hết hàng variant");
                    variant.setStock(newStock);
                    productVariantRepository.save(variant);
                }
            } else {
                int newStock = isRestock ? product.getStock() + quantity : product.getStock() - quantity;
                if (newStock < 0) throw new RuntimeException("Hết hàng");
                product.setStock(newStock);
                productRepository.save(product);
            }
        }
    }
}