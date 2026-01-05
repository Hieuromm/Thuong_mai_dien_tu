package com.thuongmaidientu.backend.controller;

import com.thuongmaidientu.backend.dto.request.AddToCartRequest;
import com.thuongmaidientu.backend.entity.*;
import com.thuongmaidientu.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // Helper: Lấy Cart của user hiện tại (nếu chưa có thì tạo mới)
    private Cart getOrCreateCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    // 1. LẤY GIỎ HÀNG
    @GetMapping
    public ResponseEntity<?> getCart() {
        Cart cart = getOrCreateCart();
        return ResponseEntity.ok(cart.getItems());
    }

    // 2. THÊM VÀO GIỎ
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        Cart cart = getOrCreateCart();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Kiểm tra xem sản phẩm + biến thể này đã có trong giỏ chưa
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId())
                        && isSameVariant(i, request))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .variant1(request.getVariant1())
                    .variant2(request.getVariant2())
                    .build();
            cartItemRepository.save(newItem);
        }

        return ResponseEntity.ok("Đã thêm vào giỏ");
    }

    // 3. CẬP NHẬT SỐ LƯỢNG
    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long itemId, @RequestParam int quantity) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow();
        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return ResponseEntity.ok("Cập nhật thành công");
    }

    // 4. XÓA SẢN PHẨM
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        cartItemRepository.deleteById(itemId);
        return ResponseEntity.ok("Đã xóa");
    }

    private boolean isSameVariant(CartItem item, AddToCartRequest req) {
        boolean v1 = (item.getVariant1() == null && req.getVariant1() == null) ||
                (item.getVariant1() != null && item.getVariant1().equals(req.getVariant1()));
        boolean v2 = (item.getVariant2() == null && req.getVariant2() == null) ||
                (item.getVariant2() != null && item.getVariant2().equals(req.getVariant2()));
        return v1 && v2;
    }
}