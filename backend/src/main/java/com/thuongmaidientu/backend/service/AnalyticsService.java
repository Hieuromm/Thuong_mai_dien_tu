package com.thuongmaidientu.backend.service;

import com.thuongmaidientu.backend.dto.projection.ProductAnalyticsProjection;
import com.thuongmaidientu.backend.dto.request.AnalyticsDTO;
import com.thuongmaidientu.backend.dto.request.StatDetail;
import com.thuongmaidientu.backend.dto.response.DashboardTodoResponse;
import com.thuongmaidientu.backend.entity.OrderStatus;
import com.thuongmaidientu.backend.repository.OrderItemRepository;
import com.thuongmaidientu.backend.repository.OrderRepository;
import com.thuongmaidientu.backend.repository.ShopVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ShopVisitRepository shopVisitRepository;
    private final OrderItemRepository orderItemRepository; // Thêm Repository này để xử lý sản phẩm

    /**
     * Lấy dữ liệu tổng quan cho trang Dashboard (Overview, Chart, Realtime)
     */
    public AnalyticsDTO getOverview(Long shopId, String range) {
        LocalDateTime now = LocalDateTime.now();

        // 1. Xác định khoảng thời gian hiện tại và đối chiếu
        LocalDateTime start;
        LocalDateTime end = now;
        LocalDateTime prevStart;
        LocalDateTime prevEnd;

        switch (range) {
            case "yesterday":
                start = now.toLocalDate().minusDays(1).atStartOfDay();
                end = now.toLocalDate().minusDays(1).atTime(LocalTime.MAX);
                prevStart = start.minusDays(1);
                prevEnd = start;
                break;
            case "7days":
                start = now.toLocalDate().minusDays(7).atStartOfDay();
                prevStart = start.minusDays(7);
                prevEnd = start;
                break;
            case "thisMonth":
                start = now.toLocalDate().with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                prevStart = start.minusMonths(1);
                prevEnd = start;
                break;
            case "lastMonth":
                start = now.toLocalDate().minusMonths(1).with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                end = now.toLocalDate().minusMonths(1).with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
                prevStart = start.minusMonths(1);
                prevEnd = start;
                break;
            case "today":
            default:
                start = now.toLocalDate().atStartOfDay();
                prevStart = start.minusDays(1);
                prevEnd = start;
                break;
        }

        // 2. Truy vấn dữ liệu từ Database
        Double currentSales = orderRepository.sumRevenueByShop(shopId, start, end);
        currentSales = (currentSales == null) ? 0.0 : currentSales;
        long currentOrders = orderRepository.countOrdersByShop(shopId, start, end);

        Double prevSales = orderRepository.sumRevenueByShop(shopId, prevStart, prevEnd);
        prevSales = (prevSales == null) ? 0.0 : prevSales;
        long prevOrders = orderRepository.countOrdersByShop(shopId, prevStart, prevEnd);

        long currentVisits = shopVisitRepository.countByShopAndDate(shopId, start, end);
        long prevVisits = shopVisitRepository.countByShopAndDate(shopId, prevStart, prevEnd);

        // 3. Tính toán tăng trưởng và tỷ lệ chuyển đổi
        double salesGrowth = calculateGrowth(currentSales, prevSales);
        double orderGrowth = calculateGrowth((double) currentOrders, (double) prevOrders);
        double visitGrowth = calculateGrowth((double) currentVisits, (double) prevVisits);
        double conversionRate = (currentVisits == 0) ? 0 : ((double) currentOrders / currentVisits) * 100;

        // 4. Lấy dữ liệu biểu đồ
        List<Double> chartData = getChartData(shopId, start, end, range);

        // 5. Đóng gói kết quả trả về
        List<StatDetail> overview = new ArrayList<>();
        overview.add(new StatDetail("sales", "Doanh số", currentSales, salesGrowth, "₫"));
        overview.add(new StatDetail("orders", "Đơn hàng", (double) currentOrders, orderGrowth, ""));
        overview.add(new StatDetail("visits", "Lượt truy cập", (double) currentVisits, visitGrowth, ""));
        overview.add(new StatDetail("conversion", "Tỉ lệ chuyển đổi", conversionRate, 0.0, "%"));

        return AnalyticsDTO.builder()
                .overview(overview)
                .chartData(chartData)
                .realTime(AnalyticsDTO.RealTimeDetail.builder()
                        .salesToday(currentSales)
                        .ordersCount(currentOrders)
                        .visits((int) currentVisits)
                        .build())
                .build();
    }


    public List<ProductAnalyticsProjection> getProductStats(Long shopId, String range) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;
        LocalDateTime endDate = now;

        switch (range) {
            case "yesterday":
                startDate = now.toLocalDate().minusDays(1).atStartOfDay();
                endDate = now.toLocalDate().minusDays(1).atTime(LocalTime.MAX);
                break;
            case "7days":
                startDate = now.minusDays(7).toLocalDate().atStartOfDay();
                break;
            case "thisMonth":
                startDate = now.with(TemporalAdjusters.firstDayOfMonth()).toLocalDate().atStartOfDay();
                break;
            case "today":
            default:
                startDate = now.toLocalDate().atStartOfDay();
                break;
        }

        return orderItemRepository.getProductAnalytics(shopId, startDate, endDate);
    }
    public DashboardTodoResponse getTodoStatistics(Long shopId) {
        return DashboardTodoResponse.builder()
                .pendingCount(orderRepository.countByShopIdAndStatus(shopId, OrderStatus.PENDING))
                .readyToShipCount(orderRepository.countByShopIdAndStatus(shopId, OrderStatus.CONFIRMED))
                .shippingCount(orderRepository.countByShopIdAndStatus(shopId, OrderStatus.SHIPPING))
                .cancelledCount(orderRepository.countByShopIdAndStatus(shopId, OrderStatus.CANCELLED))
                .completedCount(orderRepository.countByShopIdAndStatus(shopId, OrderStatus.COMPLETED))
                .build();
    }
    // --- HÀM HỖ TRỢ ---

    private double calculateGrowth(Double current, Double previous) {
        if (previous == null || previous == 0) return 0;
        return ((current - previous) / previous) * 100;
    }

    private List<Double> getChartData(Long shopId, LocalDateTime start, LocalDateTime end, String range) {
        if (range.equals("today") || range.equals("yesterday")) {
            List<Double> hourly = new ArrayList<>(Collections.nCopies(24, 0.0));
            orderRepository.getHourlyRevenue(shopId, start, end).forEach(row -> {
                int hour = ((Number) row[0]).intValue();
                hourly.set(hour, (Double) row[1]);
            });
            return hourly;
        } else {

            return List.of(20.0, 45.0, 30.0, 80.0, 60.0, 95.0, 110.0);
        }
    }
}