import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import SellerSidebar from '../components/seller/SellerSidebar';
import { FaBell, FaTh } from 'react-icons/fa';
// 1. Import Auth Context
import { useAuth } from '../context/AuthContext';


const SellerLayout = () => {
  // 2. Lấy thông tin user và hàm logout
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] font-sans">
      {/* Sidebar cố định bên trái */}
      <SellerSidebar />

      {/* Nội dung bên phải */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* --- SELLER HEADER (CẬP NHẬT) --- */}
        <header className="bg-white shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium text-gray-700">Kênh Người Bán</h2>
            </div>
            
            <div className="flex items-center gap-6">
                 {/* Icon Thông báo */}
                 <div className="relative cursor-pointer hover:opacity-80">
                    <FaBell className="text-gray-500 text-xl" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                 </div>
                 
                 {/* Icon Menu khác (Ví dụ) */}
                 <div className="cursor-pointer hover:opacity-80">
                    <FaTh className="text-gray-500 text-lg" />
                 </div>

                 {/* --- PHẦN USER PROFILE (ĐỘNG) --- */}
                 {user ? (
                    <div className="relative group flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                            <img 
                                 
                                    src={user?.avatar || "https://placehold.co/150?text=Shop"} 
                                    alt="avatar" 
                                    className="w-full h-full object-cover"
                                   
                                    onError={(e) => e.target.src = "https://placehold.co/150?text=Shop"}
/>
                        </div>
                        
                        {/* Tên User */}
                        <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                            {user.name}
                        </span>

                        {/* Dropdown Menu (Xổ xuống khi hover) */}
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-sm shadow-lg hidden group-hover:block animate-fadeIn z-50">
                            {/* Mũi tên trang trí */}
                            <div className="absolute -top-1 right-4 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100"></div>
                            {/* Cầu nối trong suốt */}
                            <div className="absolute -top-3 left-0 w-full h-4 bg-transparent"></div>

                            <ul className="py-1 text-sm text-gray-700">
                                <li>
                                    <Link to="/" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">
                                        Trang chủ BuyNow
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/seller/profile" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">
                                        Hồ sơ Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/seller/settings" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">
                                        Thiết lập Shop
                                    </Link>
                                </li>
                                <li className="border-t border-gray-100">
                                    <button 
                                        onClick={logout} 
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]"
                                    >
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                 ) : (
    
                    <Link to="/login" className="text-sm text-[#ee4d2d] font-medium hover:opacity-80">
                        Đăng nhập
                    </Link>
                 )}
        
            </div>
        </header>


        <main className="flex-1 overflow-y-auto p-6">
            <Outlet/>
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;