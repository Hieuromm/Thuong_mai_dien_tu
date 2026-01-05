import { useState, useEffect } from 'react';
// Import thêm API lấy review
import { 
    getPublicProductDetailAPI, 
    getReviewsByProductIdAPI 
} from '../../../services/productService'; 
import { addToCartAPI } from '../../../services/cartService';

// --- 1. DỮ LIỆU GIẢ (Dùng khi API lỗi/Server tắt) ---
const MOCK_PRODUCT = {
    id: 999,
    name: "Sản phẩm Demo (Chế độ Offline)",
    price: 250000,
    stock: 100,
    description: "Bạn đang thấy dữ liệu này vì không kết nối được Server (Lỗi mạng hoặc 403).",
    imageUrl: "https://via.placeholder.com/500",
    images: ["https://via.placeholder.com/500", "https://via.placeholder.com/500/0000FF"],
    shop: {
        id: 1,
        name: "Shop Demo",
        logoUrl: "https://via.placeholder.com/100"
    },
    hasVariants: true,
    variant1Name: "Màu sắc",
    variant2Name: "Size",
    variants: [
        { value1: "Xanh", value2: "L", price: 250000, stock: 10 },
        { value1: "Đen", value2: "XL", price: 270000, stock: 5 }
    ]
};

const MOCK_REVIEWS = [
    { 
        id: 1, 
        rating: 5, 
        comment: "Hàng đẹp, chất lượng tốt (Review giả lập)", 
        shopResponse: "Cảm ơn bạn!",
        createdAt: new Date().toISOString(),
        user: { fullName: "Tester Offline", avatar: null },
        images: []
    }
];

export const useProductDetail = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State Review (Mới thêm)
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // State UI hiển thị
  const [mainImage, setMainImage] = useState('');
  const [selectedVariant1, setSelectedVariant1] = useState(null);
  const [selectedVariant2, setSelectedVariant2] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // State tính toán
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);

  // --- HÀM XỬ LÝ DỮ LIỆU (Dùng chung cho cả API và Mock) ---
  const processProductData = (data) => {
        // A. Xử lý Ảnh
        const rawImages = data.images && data.images.length > 0 
            ? data.images.map(img => img.imageUrl || img) // Support cả object ảnh hoặc string url
            : (data.imageUrl ? [data.imageUrl] : []);
            
        const formattedImages = rawImages.map(url => 
            url.startsWith('http') ? url : `http://localhost:8080/images/products/${url}`
        );
        if (formattedImages.length === 0) formattedImages.push('https://placehold.co/300?text=No+Image');

        // B. Xử lý Shop Avatar
        const shopLogo = data.shop?.logoUrl 
            ? (data.shop.logoUrl.startsWith('http') ? data.shop.logoUrl : `http://localhost:8080/images/shops/${data.shop.logoUrl}`)
            : 'https://placehold.co/100?text=Shop';

        // C. Phân tích Variants
        let v1Values = [], v2Values = [];
        if (data.hasVariants && data.variants) {
            v1Values = [...new Set(data.variants.map(v => v.value1).filter(Boolean))];
            v2Values = [...new Set(data.variants.map(v => v.value2).filter(Boolean))];
        }

        // D. Build Object hoàn chỉnh
        const productData = {
            ...data,
            images: formattedImages,
            shop: { 
                id: data.shop?.id,
                name: data.shop?.name || 'Shop Ẩn Danh',
                avatar: shopLogo,
                rating: data.shop?.rating || 5.0,
                followers: data.shop?.followerCount || 0,
                responseRate: '99%',
                joinTime: '2 năm trước',
                products: 100
            },
            variantGroups: {
                name1: data.variant1Name || 'Phân loại 1',
                values1: v1Values,
                name2: data.variant2Name || 'Phân loại 2',
                values2: v2Values
            }
        };

        setProduct(productData);
        setMainImage(formattedImages[0]);
        setCurrentPrice(data.price); 
        
        const totalStock = data.hasVariants 
            ? data.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
            : (data.stock || 0);
        setCurrentStock(totalStock);
  };

  // 1. TẢI DỮ LIỆU SẢN PHẨM & REVIEW
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // --- BƯỚC 1: GỌI API SẢN PHẨM ---
        const data = await getPublicProductDetailAPI(id);
        processProductData(data); // Xử lý dữ liệu thật

        // --- BƯỚC 2: GỌI API REVIEW ---
        try {
            const reviewList = await getReviewsByProductIdAPI(id);
            const realReviews = reviewList || [];
            
            setReviews(realReviews);
            setTotalReviews(realReviews.length);

            if (realReviews.length > 0) {
                const total = realReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
                setAvgRating((total / realReviews.length).toFixed(1));
            } else {
                setAvgRating(0);
            }
        } catch (reviewError) {
            console.warn("API Review lỗi/403 -> Dùng Mock Review");
            setReviews(MOCK_REVIEWS);
            setTotalReviews(MOCK_REVIEWS.length);
            setAvgRating(4.5);
        }

      } catch (error) {
        console.error("Lỗi tải sản phẩm (Network/403):", error);
        console.warn("⚠️ Chuyển sang chế độ MOCK DATA.");
        
        // Fallback: Dùng dữ liệu giả
        processProductData(MOCK_PRODUCT);
        setReviews(MOCK_REVIEWS);
        setTotalReviews(MOCK_REVIEWS.length);
        setAvgRating(5.0);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 2. LOGIC CHỌN BIẾN THỂ
  useEffect(() => {
      if (!product || !product.hasVariants) return;

      const matchedVariant = product.variants.find(v => 
          v.value1 === selectedVariant1 && 
          (product.variantGroups.values2.length > 0 ? v.value2 === selectedVariant2 : true)
      );

      if (matchedVariant) {
          setCurrentPrice(matchedVariant.price);
          setCurrentStock(matchedVariant.stock);
          if (quantity > matchedVariant.stock) setQuantity(1);
      }
  }, [selectedVariant1, selectedVariant2, product, quantity]);

  // 3. XỬ LÝ SỐ LƯỢNG
  const handleQuantityChange = (delta) => {
      const newQty = quantity + delta;
      if (newQty >= 1 && newQty <= currentStock) {
          setQuantity(newQty);
      }
  };

  // 4. THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          alert("Vui lòng đăng nhập để mua hàng!");
          return;
      }

      if (product.hasVariants) {
          if (!selectedVariant1) return alert(`Vui lòng chọn ${product.variantGroups.name1}`);
          if (product.variantGroups.values2.length > 0 && !selectedVariant2) return alert(`Vui lòng chọn ${product.variantGroups.name2}`);
      }

      try {
          await addToCartAPI({
              productId: product.id,
              quantity: quantity,
              variant1: selectedVariant1,
              variant2: selectedVariant2
          });
          alert("✅ Đã thêm sản phẩm vào giỏ hàng thành công!");
      } catch (error) {
          const msg = error.response?.data || "Lỗi khi thêm vào giỏ hàng";
          alert("❌ " + msg);
      }
  };

  return {
    product, 
    loading,
    // Trả về thêm data review
    reviews, avgRating, totalReviews, 
    mainImage, setMainImage,
    selectedVariant1, setSelectedVariant1,
    selectedVariant2, setSelectedVariant2,
    currentPrice, currentStock,
    quantity, handleQuantityChange, 
    handleAddToCart
  };
};