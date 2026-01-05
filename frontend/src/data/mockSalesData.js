// src/data/mockSalesData.js

// 1. Dữ liệu Phễu (Funnel)
export const SALES_FUNNEL_DATA = {
  visits: 1250,        // Lượt truy cập
  ordersPlaced: 85,    // Đơn hàng đã đặt
  ordersPaid: 80,      // Đơn đã xác nhận
  salesAmount: 15000000,
  salesPerBuyer: 187500,
  conversionRatePlaced: 6.8, // % Truy cập -> Đặt
  conversionRatePaid: 94.1   // % Đặt -> Xác nhận
};

// 2. Danh sách các chỉ số để vẽ biểu đồ (Checkbox options)
export const CHART_METRICS = [
  { id: 'visits', label: 'Lượt truy cập', color: '#3b82f6' }, // Blue
  { id: 'orders', label: 'Đơn hàng', color: '#f97316' },      // Orange
  { id: 'sales', label: 'Doanh số', color: '#ef4444' },       // Red
  { id: 'conversion', label: 'Tỷ lệ chuyển đổi', color: '#10b981' } // Green
];

// 3. Dữ liệu biểu đồ (Time series - 24h)
// Giả lập dữ liệu cho 4 chỉ số trên
export const HOURLY_DATA = [
  { time: '00:00', visits: 50, orders: 2, sales: 300000, conversion: 4 },
  { time: '04:00', visits: 20, orders: 0, sales: 0, conversion: 0 },
  { time: '08:00', visits: 150, orders: 10, sales: 2000000, conversion: 6.5 },
  { time: '12:00', visits: 400, orders: 35, sales: 6500000, conversion: 8.7 },
  { time: '16:00', visits: 300, orders: 20, sales: 3800000, conversion: 6.6 },
  { time: '20:00', visits: 250, orders: 15, sales: 2400000, conversion: 6.0 },
  { time: '23:59', visits: 80, orders: 3, sales: 400000, conversion: 3.7 },
];