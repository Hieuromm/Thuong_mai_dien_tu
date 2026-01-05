import { useState } from 'react';
import { addProductAPI } from '../../../services/productService'; 
import { useNavigate } from 'react-router-dom';

export const useAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /**
   * Hàm xử lý Submit Form (Đã cập nhật cho Dynamic Variants)
   * @param {Object} productData - Thông tin chung
   * @param {Array} imageFiles - Mảng file ảnh
   * @param {Boolean} isHidden - Ẩn/Hiện
   * @param {Array} variants - Danh sách biến thể (Matrix)
   * @param {String} v1Name - Tên nhóm 1 (VD: Màu sắc)
   * @param {String} v2Name - Tên nhóm 2 (VD: Size)
   */
  const handleSubmit = async (productData, imageFiles, isHidden = false, variants = [], v1Name = '', v2Name = '') => {
    
    // --- 1. VALIDATE DỮ LIỆU ---
    if (!productData.name || !productData.category) {
        alert("Vui lòng nhập Tên sản phẩm và Ngành hàng!");
        return;
    }

    if (imageFiles.length === 0) {
        alert("Vui lòng chọn ít nhất 1 hình ảnh sản phẩm!");
        return;
    }

    const hasVariants = variants.length > 0;

    if (!hasVariants) {
        // Nếu KHÔNG có biến thể -> Bắt buộc nhập giá & kho ở form chính
        if (!productData.price || !productData.stock) {
            alert("Vui lòng nhập Giá và Kho hàng!");
            return;
        }
    } else {
        // Nếu CÓ biến thể -> Phải có tên nhóm
        if (!v1Name) {
            alert("Vui lòng nhập tên cho Nhóm phân loại 1 (Ví dụ: Màu sắc, Hương vị...)");
            return;
        }

        // Kiểm tra giá/kho từng dòng
        const invalidVariant = variants.some(v => !v.price || !v.stock);
        if (invalidVariant) {
            alert("Vui lòng nhập đầy đủ Giá và Kho cho tất cả các phân loại hàng!");
            return;
        }
    }

    setLoading(true);

    try {
        // --- 2. ĐÓNG GÓI DỮ LIỆU ---
        const formData = new FormData();

        const productPayload = {
            name: productData.name,
            description: productData.description || "",
            category: productData.category,
            weight: parseFloat(productData.weight || 0),
            isHidden: isHidden,
            
            // Nếu có biến thể thì lưu tên nhóm vào đây
            variant1Name: v1Name,
            variant2Name: v2Name,

            // Giá/Kho cha
            price: hasVariants ? 0 : parseFloat(productData.price),
            stock: hasVariants ? 0 : parseInt(productData.stock),
            
            // Map danh sách variants (QUAN TRỌNG: Dùng value1, value2)
            variants: variants.map(v => ({
                value1: v.value1, // Khớp với Backend DTO
                value2: v.value2, // Khớp với Backend DTO
                price: parseFloat(v.price),
                stock: parseInt(v.stock)
            }))
        };

        // Debug: Log payload để kiểm tra trước khi gửi
        console.log("Payload gửi đi:", productPayload);

        // Append JSON String
        formData.append("data", JSON.stringify(productPayload));

        // Append File ảnh
        imageFiles.forEach((file) => {
            formData.append("images", file);
        });

        // --- 3. GỌI API ---
        await addProductAPI(formData);
        
        alert("Thêm sản phẩm thành công!");
        navigate('/seller/products/list');

    } catch (error) {
        console.error("Lỗi thêm sản phẩm:", error);
        
        // Log chi tiết lỗi từ Backend (Rất quan trọng để debug)
        if (error.response) {
            console.log("Server Error Data:", error.response.data);
            console.log("Server Status:", error.response.status);
        }

        const message = error.response?.data?.message || error.message || "Lỗi không xác định";
        alert("Lỗi: " + message);
    } finally {
        setLoading(false);
    }
  };

  return { loading, handleSubmit };
};