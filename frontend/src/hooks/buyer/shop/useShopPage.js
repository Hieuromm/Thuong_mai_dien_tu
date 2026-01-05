import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicShopDetailAPI, getPublicShopProductsAPI } from '../../../services/shopService';

export const useShopPage = () => {
  const { shopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState('pho-bien');

  const BASE_URL = "http://localhost:8080/images/";

  // Cấu hình danh mục (giữ nguyên)
  const CATEGORIES = [
    { id: 'pho-bien', label: 'Phổ biến' },
    { id: 'moi-nhat', label: 'Mới nhất' },
    { id: 'ban-chay', label: 'Bán chạy' },
  ];

  // Hàm xử lý URL ảnh khớp với cấu trúc thư mục thực tế
  const formatUrl = (path, folder = 'products/') => {
    if (!path) return "https://via.placeholder.com/300?text=No+Image";
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    
    // Kiểm tra xem path đã chứa tiền tố thư mục chưa
    // Danh sách dựa trên ảnh image_bd7a6b.png và image_ceae1f.png
    const commonFolders = ['products/', 'shops/', 'reviews/'];
    const hasFolder = commonFolders.some(f => path.includes(f));

    if (hasFolder) {
        return `${BASE_URL}${path}`;
    }
    
    return `${BASE_URL}${folder}${path}`;
  };

  useEffect(() => {
    const fetchFullShopData = async () => {
      if (!shopId) return;
      setLoading(true);

      try {
        const [infoRes, productsRes] = await Promise.all([
          getPublicShopDetailAPI(shopId),
          getPublicShopProductsAPI(shopId)
        ]);

        // 1. Map dữ liệu Shop Info
        setShopInfo({
          ...infoRes,
          // SỬA TẠI ĐÂY: Đổi 'shop/' thành 'shops/' cho đúng với thư mục vật lý
          avatar: formatUrl(infoRes.avatar, 'shops/'), 
          cover: formatUrl(infoRes.cover, 'shops/'),   
          stats: {
            products: infoRes.totalProducts || 0,
            followers: infoRes.followerCount || 0,
            rating: infoRes.rating || 5.0,
            joined: infoRes.joinDate || "Mới tham gia",
            following: 0,
            chatPerformance: "100%"
          }
        });

        // 2. Map dữ liệu Sản phẩm (Thư mục 'products/' đã đúng)
        const rawProducts = Array.isArray(productsRes) ? productsRes : (productsRes.content || []);
        const mappedProducts = rawProducts.map(p => ({
          ...p,
          shopId: p.shopId || shopId, 
          image: formatUrl(p.image || p.imageUrl, 'products/'),
          price: p.price || 0,
          originalPrice: p.originalPrice || p.price || 0,
          discount: p.discount || 0,
          sold: p.sold || 0,
          isMall: infoRes.isOfficial || false
        }));

        setProducts(mappedProducts);
        
        // Mock vouchers (giữ nguyên)
        setVouchers([
            { id: 1, discount: "15k", minSpend: "150k", expiry: "30.12.2025" },
            { id: 2, discount: "10%", minSpend: "50k", expiry: "15.01.2026" }
        ]);

      } catch (error) {
        console.error("Lỗi tải trang Shop:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullShopData();
  }, [shopId]);

  return {
    shopInfo, products, vouchers, categories: CATEGORIES,
    activeTab, setActiveTab, loading,
    handleFollow: () => alert("Đã thêm vào danh sách theo dõi"),
    handleChat: () => alert("Đang kết nối với người bán...")
  };
};