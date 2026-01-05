import React from 'react';
import { useProfileSidebar } from '../../hooks/buyer/account/useProfileSidebar';
import { Link } from 'react-router-dom';
import { FaUser, FaClipboardList, FaBell, FaTicketAlt, FaCoins, FaPen } from 'react-icons/fa';

const ProfileSidebar = () => {
  const { user, getAvatarUrl, getLinkClass, isActive, DEFAULT_AVATAR } = useProfileSidebar();

  return (
    <div className="w-full text-sm font-sans">
        
       {/* 1. Phần Avatar & Tên User lấy từ Database */}
       <div className="flex items-center gap-3 py-4 border-b border-gray-100 mb-4">
           <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
               <img 
                   src={getAvatarUrl()} 
                   alt="User Avatar" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                       e.target.onerror = null;
                       e.target.src = DEFAULT_AVATAR;
                   }}
               />
           </div>
           <div className="overflow-hidden">
               <div className="font-semibold truncate max-w-[120px] text-gray-800">
                   {user?.fullName || user?.username || "Thành viên"}
               </div>
               <Link to="/user/profile" className="text-gray-500 text-[12px] flex items-center gap-1 cursor-pointer hover:text-[#1a1817]">
                   <FaPen size={10} /> Sửa Hồ Sơ
               </Link>
           </div>
       </div>

       {/* 2. Danh sách Menu điều hướng */}
       <ul className="space-y-4">
           {/* Mục: Tài Khoản Của Tôi */}
           <li>
               <div className="flex items-center gap-3 text-gray-800 font-medium cursor-pointer hover:text-[#131110]">
                   <div className="w-5 flex justify-center"><FaUser className="text-blue-600"/></div>
                   <span>Tài Khoản Của Tôi</span>
               </div>
               <ul className="ml-8 mt-2 space-y-3 text-[13px]">
                   <li><Link to="/user/profile" className={getLinkClass('/user/profile')}>Hồ Sơ</Link></li>
                   <li><Link to="/user/banks" className={getLinkClass('/user/banks')}>Ngân Hàng</Link></li>
                   <li><Link to="/user/address" className={getLinkClass('/user/address')}>Địa Chỉ</Link></li>
                   <li><Link to="/user/password" className={getLinkClass('/user/password')}>Đổi Mật Khẩu</Link></li>
               </ul>
           </li>

           {/* Mục: Đơn Mua */}
           <li className="flex items-center gap-3">
               <div className="w-5 flex justify-center"><FaClipboardList className="text-blue-500"/></div>
               <Link to="/user/purchase" className={`font-medium hover:text-[#161413] ${isActive('/user/purchase') ? 'text-[#141414]' : 'text-gray-800'}`}>
                   Đơn Mua
               </Link>
           </li>
           
           {/* Mục: Thông Báo */}
           <li className="flex items-center gap-3">
               <div className="w-5 flex justify-center"><FaBell className="text-[#0a0a0a]"/></div>
                <Link to="/user/notifications" className={`font-medium hover:text-[#1b1919] ${isActive('/user/notifications') ? 'text-[#0e0d0d]' : 'text-gray-800'}`}>
                    Thông Báo
                </Link>
           </li>
           
           <li className="flex items-center gap-3 text-gray-800 cursor-pointer hover:text-[#181514]">
               <div className="w-5 flex justify-center"><FaTicketAlt className="text-[#111010]"/></div>
               <span>Kho Voucher</span>
           </li>
           
    
       </ul>
    </div>
  );
};

export default ProfileSidebar;