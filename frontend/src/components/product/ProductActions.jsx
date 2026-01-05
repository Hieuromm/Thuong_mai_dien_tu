
import React from 'react';
import { FaCommentDots, FaCartPlus } from 'react-icons/fa';
import { useChat } from '../../hooks/common/useChat';

const ProductActions = ({ product }) => {
  const { openChatWithShop } = useChat();

  const handleChatNow = () => {
    const shopData = {
      id: product.shopId,
      name: product.shopName,
      avatar: product.shopAvatar
    };
    
    openChatWithShop(shopData);
  };

  return (
    <div className="flex gap-4 mt-6">
      {/* Nút Chat Ngay */}
      <button 
        onClick={handleChatNow}
        className="flex-1 bg-[#00bfa5] text-white px-6 py-3 rounded hover:opacity-90 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95"
      >
        <FaCommentDots />
        Chat Ngay
      </button>

      {/* Nút Thêm Giỏ Hàng */}
      <button className="flex-1 bg-[#ee4d2d] text-white px-6 py-3 rounded hover:opacity-90 flex items-center justify-center gap-2 font-bold">
        <FaCartPlus />
        Thêm Vào Giỏ
      </button>
    </div>
  );
};

export default ProductActions;