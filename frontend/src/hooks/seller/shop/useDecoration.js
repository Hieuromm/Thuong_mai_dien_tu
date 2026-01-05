// src/hooks/useDecoration.js
import { useState } from 'react';

export const useDecoration = () => {
  const [activeTab, setActiveTab] = useState('HOME');      // Tab chính
  const [activeDevice, setActiveDevice] = useState('MOBILE'); // Tab thiết bị (Mobile/PC)

  // Hàm xử lý khi bấm nút "Trang trí ngay"
  const handleStartDecoration = () => {
    alert("Chức năng đang phát triển: Chuyển hướng đến trình kéo thả giao diện (Drag & Drop Builder)");
    // Sau này bạn có thể navigate('/seller/shop/decoration/builder') tại đây
  };

  return {
    activeTab, 
    setActiveTab,
    activeDevice, 
    setActiveDevice,
    handleStartDecoration
  };
};