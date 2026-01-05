import { useState, useEffect, useCallback } from 'react';
// Import dịch vụ gọi API
import { getSalesOverview, getProductAnalytics } from '../../../services/analyticsService';

export const useAnalytics = () => {
  // 1. QUẢN LÝ BỘ LỌC (Sử dụng dateRange để kích hoạt re-fetch)
  const [activeTab, setActiveTab] = useState('tong-quan'); 
  const [dateRange, setDateRange] = useState('today'); 
  const [orderType, setOrderType] = useState('COMPLETED'); 

  // 2. QUẢN LÝ DỮ LIỆU
  const [data, setData] = useState({
    overview: {}, // QUAN TRỌNG: Đổi từ [] sang {} để nhận Map từ Backend
    products: [], 
    chartData: [],
    realTime: {
      salesToday: 0,
      ordersCount: 0,
      visits: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. LOGIC FETCH DATA (Đồng bộ tham số dateRange)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'tong-quan') {
        // Gửi tham số dateRange và orderType lên Backend Spring Boot
        const response = await getSalesOverview(dateRange, orderType);
        
        if (response && response.data) {
          setData(prev => ({ 
            ...prev, 
            // Dữ liệu Map chứa các key: visits, sales, buyersCount, convVisitToOrder...
            overview: response.data.overview || {}, 
            chartData: response.data.chartData || [],
            realTime: response.data.realTime || {} 
          }));
        }
      } else {
        // Lấy dữ liệu chi tiết sản phẩm theo thời gian
        const response = await getProductAnalytics(dateRange);
        if (response && response.data) {
          setData(prev => ({ ...prev, products: response.data }));
        }
      }
    } catch (err) {
      console.error("Lỗi Fetch Analytics:", err);
      // Xử lý lỗi bảo mật 403 (Phân quyền)
      if (err.response?.status === 403) {
        setError("Lỗi 403: Bạn không có quyền SELLER để truy cập dữ liệu này.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Lỗi kết nối: Vui lòng kiểm tra server Spring Boot (CORS/Port).");
      } else {
        setError("Đã xảy ra lỗi hệ thống khi tải dữ liệu.");
      }
    } finally {
      setLoading(false);
    }
  }, [dateRange, orderType, activeTab]); 

  // Tự động tải lại dữ liệu khi dateRange thay đổi (Bấm nút trên giao diện)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 4. THUẬT TOÁN VẼ BIỂU ĐỒ SVG
   * Sử dụng mảng chartData trả về từ Backend
   */
  const getChartPath = () => {
    const points = data.chartData && data.chartData.length > 0 ? data.chartData : [0, 0, 0, 0, 0];
    const width = 1000;
    const height = 200;
    
    const maxVal = Math.max(...points, 1); 
    const stepX = width / (points.length - 1);

    const pathCommands = points.map((val, i) => {
      const x = i * stepX;
      const y = height - (val / maxVal * (height * 0.75)); 
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    });

    return pathCommands.join(' ');
  };

  return {
    activeTab,
    setActiveTab,
    dateRange,
    setDateRange, // Truyền hàm này để gắn vào thẻ <select> hoặc nút bấm
    orderType,
    setOrderType,
    data,
    loading,
    error,
    getChartPath,
    refreshData: fetchData
  };
};