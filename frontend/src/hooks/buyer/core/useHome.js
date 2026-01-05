import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryApi from '../../../services/categoryApi';
import productApi from '../../../services/productApi';
import productVisitApi from '../../../services/productVisitApi';
import aiApi from '../../../services/aiApi'; // Import lớp API AI riêng biệt

export const useHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // States dữ liệu
  const [banners] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [topProducts, setTopProducts] = useState([]); 
  const [globalTrending, setGlobalTrending] = useState([]); 
  const [suggested, setSuggested] = useState([]); 
  const [categoryTrends, setCategoryTrends] = useState({}); 

  // 1. Cấu hình Slider
  const sliderSettings = {
    banner: {
      dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, arrows: true,
    },
    topProduct: {
      dots: false, infinite: false, speed: 500, slidesToShow: 6, slidesToScroll: 1, arrows: true,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 4 } },
        { breakpoint: 600, settings: { slidesToShow: 2 } }
      ]
    }
  };

  // 2. Hàm Fetch dữ liệu tích hợp đa tầng AI
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;

      // Danh sách các API gọi song song để tối ưu tốc độ phản hồi
      const apiCalls = [
        categoryApi.getAll(),           // Lấy danh mục
        productVisitApi.getTopVisited(), // Lấy sản phẩm hot từ lượt xem (Visits)
        aiApi.getAllTrends(),            // Lấy xu hướng danh mục từ mô hình Prophet
        aiApi.getGlobalTrending()        // Lấy top sản phẩm bán chạy nhất toàn hệ thống
      ];

      // Gợi ý cá nhân hóa (SVD): Chỉ gọi khi đã đăng nhập
      if (userId) {
        apiCalls.push(aiApi.getRecommendations(userId));
      } else {
        apiCalls.push(productApi.getAll());
      }

      // Đợi tất cả AI và Data Service phản hồi
      const [
        catData, 
        topVisitedData, 
        trendData, 
        globalTrendingData, 
        recommendationData
      ] = await Promise.all(apiCalls);

      // Cập nhật các trạng thái dữ liệu
      setCategories(Array.isArray(catData) ? catData : []);
      setTopProducts(Array.isArray(topVisitedData) ? topVisitedData : []);
      setCategoryTrends(trendData || {}); // Dữ liệu nhãn HOT/NEW cho danh mục
      setGlobalTrending(Array.isArray(globalTrendingData) ? globalTrendingData : []); // Top bán chạy toàn cầu
      setSuggested(Array.isArray(recommendationData) ? recommendationData : []); // Gợi ý riêng cho bạn
      
    } catch (error) {
      console.error("Lỗi tải dữ liệu AI đa tầng:", error);
      setSuggested([]);
      setCategoryTrends({});
      setGlobalTrending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 3. Logic lọc theo danh mục
  const handleCategoryClick = async (categoryName) => {
    try {
      setLoading(true);
      const filteredProducts = await productApi.getByCategory(categoryName);
      setSuggested(Array.isArray(filteredProducts) ? filteredProducts : []);
    } catch (error) {
      console.error("Lỗi lọc danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = () => {
    fetchAllData();
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return {
    loading,
    banners,
    categories,
    topProducts,
    globalTrending, // Trả về để hiển thị mục "Bán chạy nhất hệ thống"
    suggested,
    categoryTrends, 
    sliderSettings,
    handleProductClick,
    handleCategoryClick, 
    fetchAllProducts    
  };
};