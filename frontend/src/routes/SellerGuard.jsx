import React from 'react';
import { useAuth } from '../context/AuthContext';

// Component con: Giao diện đăng ký (Cho Cấp 1)
const SellerRegistration = () => (
  <div className="p-10 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
    <img src="https://deo.shopeemobile.com/shopee/shopee-seller-live-sg/rootpages/static/modules/welcome/images/header-bg.png" className="w-64 mb-4" />
    <h1 className="text-2xl font-bold">Chào mừng đến với Shopee Seller</h1>
    <p className="text-gray-500 my-4">Để đăng bán sản phẩm, bạn cần đăng ký Shop.</p>
    <button className="bg-[#ee4d2d] text-white px-6 py-2 rounded shadow">Đăng ký ngay</button>
  </div>
);

// Component con: Giao diện quản lý (Cho Cấp 2)
const SellerDashboard = () => (
  <div className="bg-gray-100 min-h-screen p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Kênh Người Bán - Dashboard</h1>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">Đơn chờ xác nhận: 5</div>
      <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">Doanh thu: 5.000.000đ</div>
      <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">Sản phẩm hết hàng: 0</div>
    </div>
  </div>
);

// LOGIC ĐIỀU HƯỚNG
const SellerGuard = () => {
  const { user } = useAuth();

  // Nếu user có role = 2 -> Trả về Dashboard
  if (user && user.role === "SELLER") {
    return <SellerDashboard />;
  }

  // Mặc định (Cấp 1) -> Trả về trang Đăng ký
  return <SellerRegistration />;
};

export default SellerGuard;