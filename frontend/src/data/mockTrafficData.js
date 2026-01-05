// src/data/mockTrafficData.js

// 1. Dữ liệu Bảng Tổng quan (Phân chia theo Tất cả / App / PC)
export const TRAFFIC_OVERVIEW = {
  views: {
    label: "Lượt Xem",
    color: "bg-blue-500",
    items: [
      { id: 'page_views', label: 'Lượt xem', all: 1500, app: 1200, pc: 300, growth: 12.5 },
      { id: 'avg_views', label: 'Số lượt xem trung bình', all: 3.5, app: 4.2, pc: 2.1, growth: 0.0 },
      { id: 'avg_time', label: 'Thời gian xem trung bình', all: '00:02:30', app: '00:03:10', pc: '00:01:15', growth: 5.4 },
      { id: 'bounce_rate', label: 'Tỉ lệ thoát trang', all: '45.5%', app: '40.2%', pc: '60.1%', growth: -2.1 },
    ]
  },
  visitors: {
    label: "Khách Truy Cập",
    color: "bg-blue-400", // Màu nhạt hơn chút hoặc khác biệt
    items: [
      { id: 'visitors', label: 'Lượt truy cập', all: 850, app: 700, pc: 150, growth: 10.2 },
      { id: 'new_visitors', label: 'Số khách truy cập mới', all: 200, app: 180, pc: 20, growth: 15.8 },
      { id: 'existing_visitors', label: 'Số khách truy cập hiện tại', all: 650, app: 520, pc: 130, growth: 5.1 },
      { id: 'new_followers', label: 'Người theo dõi mới', all: 45, app: 40, pc: 5, growth: 8.9 },
    ]
  }
};

// 2. Danh sách Checkbox cho biểu đồ
export const TRAFFIC_METRICS = [
  { id: 'page_views', label: 'Lượt xem', group: 'view' },
  { id: 'avg_views', label: 'Số lượt xem trung bình', group: 'view' },
  { id: 'avg_time', label: 'Thời gian xem trung bình', group: 'view' },
  { id: 'bounce_rate', label: 'Tỉ lệ thoát trang', group: 'view' },
  { id: 'visitors', label: 'Lượt truy cập', group: 'visitor' },
  { id: 'new_visitors', label: 'Số khách truy cập mới', group: 'visitor' },
  { id: 'existing_visitors', label: 'Số khách truy cập hiện tại', group: 'visitor' },
  { id: 'new_followers', label: 'Người theo dõi mới', group: 'visitor' },
];

// 3. Dữ liệu biểu đồ (Time Series - 24h)
// Giả lập dữ liệu
export const TRAFFIC_CHART_DATA = Array.from({ length: 9 }, (_, i) => {
  const hour = i * 3; // 0, 3, 6, 9...
  return {
    time: `${hour}:00`,
    page_views: Math.floor(Math.random() * 500) + 100,
    visitors: Math.floor(Math.random() * 300) + 50,
    new_visitors: Math.floor(Math.random() * 50) + 10,
    bounce_rate: Math.floor(Math.random() * 30) + 20,
  };
});