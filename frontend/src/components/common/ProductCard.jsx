import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaRobot, FaStar } from 'react-icons/fa6';

const IMAGE_BASE_URL = "http://localhost:8080/uploads/products/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Hàm xử lý ảnh an toàn
  const getProductImage = (imgName) => {
    if (!imgName) return PLACEHOLDER_IMAGE;
    if (imgName.startsWith('http')) return imgName;
    let fullPath = `${IMAGE_BASE_URL}/${imgName}`;
    return fullPath.replace(/([^:]\/)\/+/g, "$1");
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0); 
  };

  if (!product) return null;

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white hover:border hover:border-[#ee4d2d] border border-transparent rounded-sm shadow-sm cursor-pointer overflow-hidden flex flex-col relative group transition-all hover:-translate-y-1 hover:shadow-lg h-full"
    >
     
      <div className="absolute top-0 right-0 z-10">
          <div className="bg-[#feeeea] text-[#ee4d2d] text-[9px] px-1.5 py-0.5 border border-[#ee4d2d] rounded-bl-sm font-bold flex items-center gap-1">
             <FaRobot size={8}/> AI Gợi ý
          </div>
      </div>

      {/* Hình ảnh sản phẩm */}
      <div className="relative w-full pt-[100%] bg-gray-50">
          <img 
              src={getProductImage(product.imageUrl || product.image)} 
              className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              alt={product.name}
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
          />
          {/* Lớp phủ khi hover */}
          <div className="absolute bottom-0 w-full bg-[#ee4d2d]/90 text-white text-center py-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">
            Xem chi tiết
          </div>
      </div>

      {/* Nội dung thông tin */}
      <div className="p-3 flex flex-col justify-between flex-1">
          <div className="text-[12px] text-gray-800 line-clamp-2 mb-2 h-8 leading-4 group-hover:text-[#ee4d2d] transition-colors">
            {product.name}
          </div>
          
          <div className="mt-auto">
              <div className="flex items-center justify-between">
                  <div className="text-[#ee4d2d] font-bold text-base">
                      <span className="text-xs underline align-top mr-0.5">₫</span>
                      {product.price?.toLocaleString('vi-VN')}
                  </div>
              </div>
              
              <div className="text-[10px] text-gray-500 mt-2 flex justify-between items-center border-t border-gray-50 pt-2">
                <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" size={8}/> 
                    {(product.id % 5) + 4}.0
                </span>
                <span>Đã bán {product.sold || (product.id + 10)}+</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ProductCard;