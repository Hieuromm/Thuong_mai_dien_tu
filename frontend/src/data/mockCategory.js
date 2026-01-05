// src/data/mockCategory.js

// 1. Export Tabs (Cần thiết cho Header)
export const DECO_TABS = [
  { id: 'CATEGORY', label: 'Trang danh mục' },
];

// 2. Export Danh sách danh mục (Lỗi của bạn là do thiếu biến này)
export const MOCK_CATEGORIES = [
  { 
    id: 1, 
    name: "Áo Thun Nam (Demo)", 
    productCount: 12, 
    isActive: true 
  },
  { 
    id: 2, 
    name: "Quần Jean (Demo)", 
    productCount: 5, 
    isActive: false 
  }
];