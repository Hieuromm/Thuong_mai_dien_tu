import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { 
  FaSearch, FaShoppingCart, FaQuestionCircle, 
  FaGlobe, FaFacebook, FaInstagram, FaUserCircle 

} from 'react-icons/fa';

import NotificationBell from '../../components/notification/NotificationBell'; 

import { getTopKeywords, logSearchKeyword } from '../../services/searchService';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [keyword, setKeyword] = useState('');

  const [topKeywords, setTopKeywords] = useState([]); 

  // --- 1. FETCH TỪ KHÓA HOT KHI TRANG LOAD ---
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await getTopKeywords();
        if (response && response.data) {
          setTopKeywords(response.data.slice(0, 6)); 
        }
      } catch (error) {
        console.error("Lỗi lấy từ khóa gợi ý:", error);
        setTopKeywords(['Áo Khoác Nam', 'iPhone 15', 'Váy Xinh', 'Giày Sneaker']);
      }
    };
    fetchKeywords();
  }, []);

  // --- 2. HÀM XỬ LÝ TÌM KIẾM ---
  const handleSearch = async (searchKey) => {
    const finalKey = searchKey || keyword;
    if (finalKey.trim()) {
      try {
        await logSearchKeyword(finalKey);
      } catch (err) {
        console.warn("Lỗi ghi nhận lịch sử tìm kiếm");
      }
      navigate(`/search?keyword=${encodeURIComponent(finalKey)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const handleSellerChannelClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    user.role === 'SELLER' ? navigate('/seller/') : navigate('/seller/register');
  };

  return (
    <header className="bg-[#101111] text-white sticky top-0 z-50 shadow-md font-sans">
      
      {/* 1. NAVBAR NHỎ TRÊN CÙNG */}
      <div className="container mx-auto px-4 flex justify-between items-center text-[13px] font-light py-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSellerChannelClick} 
            className="hover:opacity-80 cursor-pointer bg-transparent border-none p-0 text-white font-light text-[13px] focus:outline-none"
          >
            Kênh Người Bán
          </button>
          <div className="h-4 border-r border-white/40"></div>
          <div className="flex items-center gap-1">
            <span>Kết nối</span>
            <FaFacebook className="hover:opacity-80 cursor-pointer" />
            <FaInstagram className="hover:opacity-80 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-1">
           
             <div className="text-white"> 
                <NotificationBell />
             </div>
             <span className="hover:opacity-80 cursor-pointer">Thông báo</span>
          </div>

          <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer"><FaQuestionCircle /> <span>Hỗ Trợ</span></div>
          <div className="flex items-center gap-1 hover:opacity-80 cursor-pointer"><FaGlobe /> <span>Tiếng Việt</span></div>

          {user ? (
            <div className="relative group ml-2 flex items-center gap-2 cursor-pointer py-1">
               <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden border border-white/50 flex items-center justify-center text-gray-500">
                  {user.avatar ? <img src={user.avatar} alt="Avt" className="w-full h-full object-cover"/> : <FaUserCircle size={20}/>}
               </div>
               <span className="font-semibold truncate max-w-[150px]">{user.fullName || user.username}</span>
               <div className="absolute top-full right-0 bg-white text-gray-800 shadow-lg rounded-sm w-40 hidden group-hover:block z-50 border border-gray-100 mt-1 animate-fadeIn origin-top-right">
                   <div className="absolute -top-1 right-6 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-100"></div>
                   <ul className="flex flex-col text-sm py-1 relative bg-white rounded-sm z-10">
                       <li><Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">Tài khoản của tôi</Link></li>
                       <li><Link to="/user/purchase" className="block px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">Đơn Mua</Link></li>
                       <div className="border-t my-1"></div>
                       <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-[#ee4d2d]">Đăng xuất</button></li>
                   </ul>
               </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 font-bold ml-2 text-[13px]">
               <Link to="/register" className="hover:opacity-70 transition-opacity">Đăng Ký</Link>
               <div className="h-3 border-r border-white/40"></div>
               <Link to="/login" className="hover:opacity-70 transition-opacity">Đăng Nhập</Link>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center gap-4 lg:gap-10">
        <Link to="/" className="flex flex-col items-center text-white cursor-pointer hover:opacity-95 shrink-0">
           <div className="text-3xl lg:text-4xl font-medium tracking-tighter italic font-serif">BuyNow</div>
        </Link>

        <div className="flex-1 bg-white rounded-sm p-1 flex shadow-sm max-w-4xl relative z-10">
           <input 
             type="text" 
             className="flex-1 px-3 py-1 text-black outline-none text-sm"
             placeholder="Săn Deal Siêu Rẻ"
             value={keyword}
             onChange={(e) => setKeyword(e.target.value)}
             onKeyDown={handleKeyDown}
           />
           <button onClick={() => handleSearch()} className="bg-[#2e2b2b] px-6 py-2 rounded-sm hover:opacity-90 flex items-center justify-center transition-colors">
             <FaSearch className="text-white" />
           </button>
        </div>

        <Link to="/cart" className="relative p-2 hover:opacity-80 cursor-pointer shrink-0 mr-4">
           <FaShoppingCart className="text-2xl lg:text-3xl" />
           <span className="absolute top-0 right-0 bg-white text-[#2b2827] border border-[#2e2d2d] text-xs font-bold px-1.5 py-0.5 rounded-full">+</span>
        </Link>
      </div>

      {/* 3. GỢI Ý TỪ KHÓA */}
      <div className="container mx-auto px-4 pb-2 text-[11px] flex gap-4 text-white/90 overflow-hidden h-6 items-center">
         {topKeywords.map((tag, index) => (
             <span 
              key={index} 
              className="cursor-pointer hover:opacity-80 whitespace-nowrap lowercase" 
              onClick={() => handleSearch(tag)}
             >
                {tag}
             </span>
         ))}
      </div>
    </header>
  );
};

export default Header;