// src/hooks/useMassDelivery.js
import { useState, useMemo } from 'react';
import { MOCK_SHIP_ORDERS } from '../../../data/mockDelivery';

export const useMassDelivery = () => {
  // --- STATE QUẢN LÝ ---
  const [activeTab, setActiveTab] = useState('pending'); // pending | created
  const [filterCarrier, setFilterCarrier] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]); // Mảng chứa các ID đã chọn

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredOrders = useMemo(() => {
    return MOCK_SHIP_ORDERS.filter(order => {
      // Logic lọc theo Tab (ví dụ tab pending thì lấy hết mock data hiện tại)
      // Logic lọc theo Nhà vận chuyển
      const matchCarrier = filterCarrier === 'all' || order.carrier === filterCarrier;
      
      return matchCarrier;
    });
  }, [filterCarrier, activeTab]);

  // --- LOGIC CHECKBOX HANDLERS ---
  
  // 1. Xử lý "Chọn tất cả"
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Lấy toàn bộ ID của danh sách ĐANG HIỂN THỊ (sau khi lọc)
      const allIds = filteredOrders.map(o => o.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // 2. Xử lý "Chọn từng cái"
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      // Nếu đã có -> Xóa đi (Uncheck)
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      // Nếu chưa có -> Thêm vào (Check)
      setSelectedIds(prev => [...prev, id]);
    }
  };

  // 3. Kiểm tra xem có đang chọn tất cả không (để hiện tick ở ô header)
  const isAllSelected = filteredOrders.length > 0 && selectedIds.length === filteredOrders.length;

  return {
    // Data
    filteredOrders,
    selectedIds,
    
    // States
    activeTab,
    filterCarrier,
    isAllSelected,

    // Actions (Setters & Handlers)
    setActiveTab,
    setFilterCarrier,
    handleSelectAll,
    handleSelectOne
  };
};