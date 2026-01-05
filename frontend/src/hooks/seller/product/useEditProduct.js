import { useState, useEffect } from 'react';
import { getProductDetailAPI, updateProductAPI } from '../../../services/productService';
import { useNavigate, useParams } from 'react-router-dom';

export const useEditProduct = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // --- 1. CÁC STATE QUẢN LÝ DỮ LIỆU ---
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    weight: '',
    price: '',
    stock: ''
  });

  const [enableVariations, setEnableVariations] = useState(false);
  
  // Nhóm phân loại (Để tái tạo lại giao diện tags)
  const [group1, setGroup1] = useState({ name: '', values: [] });
  const [group2, setGroup2] = useState({ name: '', values: [] });
  
  // Danh sách biến thể (Để hiển thị bảng giá/kho)
  const [variants, setVariants] = useState([]);

  // Ảnh
  const [previewUrls, setPreviewUrls] = useState([]);     // Link ảnh hiển thị
  const [selectedFiles, setSelectedFiles] = useState([]); // File mới (nếu user chọn thay thế)

  // --- 2. LOAD DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getProductDetailAPI(id);
            
            // A. Fill thông tin cơ bản
            setProduct({
                name: data.name,
                description: data.description,
                category: data.category,
                weight: data.weight || 0,
                price: data.price,
                stock: data.stock
            });

            // B. Fill Ảnh
            // Ưu tiên lấy list images, nếu rỗng thì lấy imageUrl
            let imgList = [];
            if (data.images && data.images.length > 0) {
                imgList = data.images.map(img => img.imageUrl);
            } else if (data.imageUrl) {
                imgList = [data.imageUrl];
            }

            // Xử lý đường dẫn ảnh (nếu là tên file thì nối localhost)
            const formattedUrls = imgList.map(url => {
                if (url.startsWith('http')) return url;
                return `http://localhost:8080/images/products/${url}`;
            });
            setPreviewUrls(formattedUrls);

            // C. Fill Biến thể (Phần phức tạp nhất)
            if (data.hasVariants && data.variants.length > 0) {
                setEnableVariations(true);
                
                // 1. Khôi phục Tên nhóm (VD: Màu sắc, Size)
                const g1Name = data.variant1Name || 'Nhóm 1';
                const g2Name = data.variant2Name || '';

                // 2. Khôi phục Giá trị nhóm (VD: [Đỏ, Xanh], [S, M])
                // Dùng Set để lọc trùng lặp
                const g1Values = [...new Set(data.variants.map(v => v.value1).filter(Boolean))];
                const g2Values = [...new Set(data.variants.map(v => v.value2).filter(Boolean))];

                setGroup1({ name: g1Name, values: g1Values });
                setGroup2({ name: g2Name, values: g2Values });

                // 3. Khôi phục Bảng Matrix
                setVariants(data.variants.map(v => ({
                    value1: v.value1,
                    value2: v.value2,
                    price: v.price,
                    stock: v.stock
                })));
            }

        } catch (error) {
            console.error("Error fetching product:", error);
            alert("Không thể tải thông tin sản phẩm hoặc bạn không có quyền truy cập.");
            navigate('/seller/products');
        } finally {
            setLoading(false);
        }
    };

    if (id) {
        fetchData();
    }
  }, [id, navigate]);

  // --- 3. HÀM UPDATE (GỌI KHI BẤM LƯU) ---
  const handleUpdate = async (productData, imageFiles, isHidden, currentVariants, v1Name, v2Name) => {
      
      // Validate cơ bản
      if (!productData.name || !productData.category) {
          alert("Vui lòng nhập Tên và Ngành hàng!");
          return;
      }

      setLoading(true);

      try {
          const formData = new FormData();
          const hasVariants = currentVariants.length > 0;

          // Tạo Payload JSON
          const productPayload = {
              name: productData.name,
              description: productData.description || "",
              category: productData.category,
              weight: parseFloat(productData.weight || 0),
              isHidden: isHidden,
              
              variant1Name: v1Name,
              variant2Name: v2Name,

              // Nếu có biến thể -> Giá/Kho cha = 0
              price: hasVariants ? 0 : parseFloat(productData.price),
              stock: hasVariants ? 0 : parseInt(productData.stock),
              
              // Map biến thể
              variants: currentVariants.map(v => ({
                  value1: v.value1,
                  value2: v.value2,
                  price: parseFloat(v.price),
                  stock: parseInt(v.stock)
              }))
          };

          // Append JSON
          formData.append("data", JSON.stringify(productPayload));
          
          // Append Ảnh Mới (Nếu có chọn)
          // Lưu ý: Backend logic hiện tại là: Có ảnh mới -> Xóa hết cũ -> Lưu mới
          if (imageFiles.length > 0) {
              imageFiles.forEach(file => {
                  formData.append("images", file);
              });
          }

          // Gọi API PUT
          await updateProductAPI(id, formData);
          
          alert("Cập nhật sản phẩm thành công!");
          navigate('/seller/products/list');

      } catch (error) {
          console.error("Update error:", error);
          const message = error.response?.data?.message || error.message || "Lỗi cập nhật";
          alert("Lỗi: " + message);
      } finally {
          setLoading(false);
      }
  };

  return {
      // State
      product, setProduct,
      loading,
      enableVariations, setEnableVariations,
      group1, setGroup1,
      group2, setGroup2,
      variants, setVariants,
      previewUrls, setPreviewUrls,
      selectedFiles, setSelectedFiles,
      
      // Action
      handleUpdate
  };
};