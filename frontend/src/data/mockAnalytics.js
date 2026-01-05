// src/data/mockAnalytics.js

export const ANALYTIC_TABS = [
  { id: 'OVERVIEW', label: 'Tổng quan' },

];

// Dữ liệu Tổng quan (4 ô vuông lớn)
export const OVERVIEW_STATS = [
  { 
    id: 'sales', 
    label: 'Doanh số', 
    value: 15000000, 
    unit: 'đ', 
    growth: 12.5, // % tăng trưởng
    tooltip: 'Tổng giá trị đơn hàng đã xác nhận' 
  },
  { 
    id: 'orders', 
    label: 'Đơn hàng', 
    value: 45, 
    unit: '', 
    growth: 5.2,
    tooltip: 'Tổng số đơn hàng đã xác nhận' 
  },
  { 
    id: 'conversion', 
    label: 'Tỷ lệ chuyển đổi', 
    value: 2.5, 
    unit: '%', 
    growth: -1.1, // Giảm
    tooltip: 'Tỷ lệ khách truy cập mua hàng' 
  },
  { 
    id: 'visits', 
    label: 'Lượt truy cập', 
    value: 12050, 
    unit: '', 
    growth: 8.4,
    tooltip: 'Số lượt xem trang shop và sản phẩm' 
  }
];

// Dữ liệu biểu đồ (Giả lập tọa độ Y cho SVG)
// Giá trị từ 0 đến 100 để dễ vẽ
export const CHART_DATA = [
  10, 25, 15, 30, 45, 40, 60, 55, 80, 70, 90, 85, 100
];

// Dữ liệu nguồn truy cập (Phần dưới cùng)
export const TRAFFIC_SOURCES = [
  { label: 'Tổng doanh số', value: '15.000.000đ', compare: 12.5 },
  { label: 'Thẻ sản phẩm', value: '8.500.000đ', compare: 5.2 },
  { label: 'Live', value: '2.000.000đ', compare: 15.8 },
  { label: 'Video', value: '1.500.000đ', compare: -2.4 },
  { label: 'Tiếp thị liên kết', value: '3.000.000đ', compare: 0.0 }
];