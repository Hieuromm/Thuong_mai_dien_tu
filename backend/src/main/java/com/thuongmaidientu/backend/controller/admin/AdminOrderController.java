package com.thuongmaidientu.backend.controller.admin;

import com.thuongmaidientu.backend.service.admin.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "all") String range
    ) {
        return ResponseEntity.ok(adminOrderService.getAllOrders(range));
    }
}