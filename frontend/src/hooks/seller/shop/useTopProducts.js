// src/hooks/useTopProducts.js
import { useState } from 'react';

export const useTopProducts = () => {
  const [activeTab, setActiveTab] = useState('TOP_PRODUCTS');

  const handleAutoSelect = () => {
    alert("Tính năng: Mở modal chọn sản phẩm từ danh sách của Shop");
  };

  return {
    activeTab,
    setActiveTab,
    handleAutoSelect
  };
};