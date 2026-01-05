// src/hooks/useShopCategory.js
import { useState } from 'react';
import { MOCK_CATEGORIES } from '../../../data/mockCategory';

export const useShopCategory = () => {
  const [activeTab, setActiveTab] = useState('CATEGORY'); 
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  // Hàm bật/tắt hiển thị danh mục
  const toggleStatus = (id) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  // Hàm xóa danh mục
  const handleDelete = (id) => {
    if(window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  // Hàm thêm danh mục (Demo)
  const handleAddCategory = () => {
    const newCat = {
      id: Date.now(),
      name: "Danh mục mới",
      productCount: 0,
      isActive: true
    };
    setCategories([...categories, newCat]);
  };

  return {
    activeTab,
    setActiveTab,
    categories,
    toggleStatus,
    handleDelete,
    handleAddCategory
  };
};