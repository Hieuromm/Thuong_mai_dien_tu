import { useState, useEffect } from 'react';
import { getCartAPI, updateCartItemAPI, deleteCartItemAPI } from '../../../services/cartService';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]); // Dữ liệu đã nhóm theo Shop
  const [rawItems, setRawItems] = useState([]);   // Dữ liệu gốc từ API
  const [loading, setLoading] = useState(true);

  // Load Cart
  const fetchCart = async () => {
    try {
        const data = await getCartAPI();
        setRawItems(data); // Lưu raw để tính toán
        setCartItems(groupItemsByShop(data)); // Nhóm theo shop để hiển thị
    } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Hàm nhóm item theo Shop
  const groupItemsByShop = (items) => {
      const groups = {};
      items.forEach(item => {
          // Xử lý shop null (nếu data cũ lỗi)
          const shopId = item.product.shop?.id || 'unknown';
          const shopName = item.product.shop?.name || 'Shop Khác';
          
          if (!groups[shopId]) {
              groups[shopId] = { id: shopId, shopName, items: [] };
          }
          
          // Format item cho UI
          groups[shopId].items.push({
              id: item.id,
              name: item.product.name,
              image: item.product.imageUrl ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080/images/products/${item.product.imageUrl}`) : 'https://placehold.co/100',
              price: item.product.price, // Giá hiện tại 
              originalPrice: item.product.price * 1.2, 
              quantity: item.quantity,
              classification: [item.variant1, item.variant2].filter(Boolean).join(', '),
              checked: false // Mặc định chưa chọn
          });
      });
      return Object.values(groups);
  };

  // Thay đổi số lượng
  const handleQuantityChange = async (shopId, itemId, delta) => {
      // Cập nhật UI ngay lập tức
      const newCart = cartItems.map(shop => {
          if (shop.id === shopId) {
              return {
                  ...shop,
                  items: shop.items.map(item => {
                      if (item.id === itemId) {
                          const newQty = Math.max(1, item.quantity + delta);
                          // Gọi API ngầm
                          updateCartItemAPI(itemId, newQty); 
                          return { ...item, quantity: newQty };
                      }
                      return item;
                  })
              };
          }
          return shop;
      });
      setCartItems(newCart);
  };

  // Xóa
  const handleDelete = async (shopId, itemId) => {
      if (window.confirm("Bạn muốn xóa sản phẩm này?")) {
          await deleteCartItemAPI(itemId);
          fetchCart(); 
      }
  };

  // Chọn 1 Item
  const handleCheckItem = (shopId, itemId) => {
      const newCart = cartItems.map(shop => {
          if (shop.id === shopId) {
              return {
                  ...shop,
                  items: shop.items.map(item => 
                      item.id === itemId ? { ...item, checked: !item.checked } : item
                  )
              };
          }
          return shop;
      });
      setCartItems(newCart);
  };

  // Chọn Tất cả
  const handleCheckAll = (checked) => {
      const newCart = cartItems.map(shop => ({
          ...shop,
          items: shop.items.map(item => ({ ...item, checked }))
      }));
      setCartItems(newCart);
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((acc, shop) => {
      return acc + shop.items.reduce((shopAcc, item) => {
          return shopAcc + (item.checked ? item.price * item.quantity : 0);
      }, 0);
  }, 0);

  // Tính tổng số lượng đã chọn
  const totalCount = cartItems.reduce((acc, shop) => {
      return acc + shop.items.reduce((shopAcc, item) => {
          return shopAcc + (item.checked ? 1 : 0);
      }, 0);
  }, 0);

  const isAllChecked = totalCount > 0 && cartItems.every(shop => shop.items.every(i => i.checked));

  return {
    cartItems, loading,
    handleQuantityChange, handleDelete,
    handleCheckItem, handleCheckAll,
    totalAmount, totalCount, isAllChecked
  };
};