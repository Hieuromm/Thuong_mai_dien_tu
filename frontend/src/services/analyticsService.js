import api from './api';

// 1. Lấy dữ liệu doanh số tổng quan và biểu đồ
export const getSalesOverview = (range, status) => 
  api.get('/seller/analytics/overview', { params: { range, status } });

// 2. Lấy phân tích chi tiết từng sản phẩm (Lượt xem, Đã bán, Doanh thu)
export const getProductAnalytics = (range) => 
  api.get('/seller/analytics/products', { params: { range } });

// 3. Ghi nhận lượt truy cập sản phẩm/shop
export const logVisit = (shopId, productId, source) => {
  return api.post('/visits/log', { shopId, productId, source });
};

// 4. Lấy thống kê "Danh sách cần làm" cho Dashboard (SỬA TẠI ĐÂY)
export const getTodoStatistics = () => {
    // Gọi đến endpoint đã khai báo trong AnalyticsController
    return api.get('/seller/analytics/todo-statistics');
};