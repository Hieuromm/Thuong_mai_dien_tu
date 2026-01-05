// src/hooks/useReturnOrder.js
import { useState, useMemo } from 'react';
import { MOCK_RETURN_ORDERS } from '../../../data/mockReturn';

export const useReturnOrder = () => {
  // State quản lý Tabs
  const [activeMainTab, setActiveMainTab] = useState('ALL'); // Tab cấp 1
  const [activeSubTab, setActiveSubTab] = useState('ALL');   // Tab cấp 2
  
  // State tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm format tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // LOGIC LỌC
  const filteredOrders = useMemo(() => {
    return MOCK_RETURN_ORDERS.filter(order => {
      // 1. Lọc theo Tab Cấp 1 (Loại đơn)
      const matchMain = activeMainTab === 'ALL' || order.type === activeMainTab;

      // 2. Lọc theo Tab Cấp 2 (Trạng thái con)
      // Chỉ áp dụng lọc subTab nếu MainTab là Return hoặc All
      const matchSub = activeSubTab === 'ALL' || order.subStatus === activeSubTab;

      // 3. Lọc theo Search (Mã đơn hoặc Tên User)
      const term = searchTerm.toLowerCase();
      const matchSearch = order.id.toLowerCase().includes(term) || 
                          order.username.toLowerCase().includes(term) ||
                          order.productName.toLowerCase().includes(term);

      return matchMain && matchSub && matchSearch;
    });
  }, [activeMainTab, activeSubTab, searchTerm]);

  return {
    activeMainTab, setActiveMainTab,
    activeSubTab, setActiveSubTab,
    searchTerm, setSearchTerm,
    filteredOrders,
    formatCurrency
  };
};