import { useState, useEffect } from 'react';
import { getMyProductsAPI, deleteProductAPI } from '../../../services/productService';

export const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
        const data = await getMyProductsAPI();
        setProducts(data);
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xóa sản phẩm
  const handleDelete = async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
          try {
              await deleteProductAPI(id);
              // Cập nhật UI ngay lập tức
              setProducts(prev => prev.filter(p => p.id !== id));
              alert("Đã xóa thành công");
          } catch (error) {
              alert("Xóa thất bại");
          }
      }
  };

  return { products, loading, handleDelete, refresh: fetchProducts };
};