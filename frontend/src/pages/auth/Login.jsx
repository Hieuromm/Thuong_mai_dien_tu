// src/pages/auth/Login.jsx
import React, { useState } from 'react'; // Thêm useState
import { FaFacebook, FaGoogle, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa'; // Thêm icon mắt
import { Link } from 'react-router-dom';
import { useLoginLogic } from '../../hooks/auth/useLoginLogic';
import subBanner1 from '../../assets/d4334724-098e-44ea-a01b-3e0a5684880e.png';
const Login = () => {

  const { 
    formData, 
    handleChange, 
    isLoading, 
    errorMsg, 
    handleLogin 
  } = useLoginLogic();

  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f6]">
      
      {/* HEADER */}
      <header className="bg-white py-4 px-10 flex justify-between items-center shadow-md">
        <div className="flex items-end gap-4 container mx-auto">
           <Link to="/" className="text-[#292626] text-3xl font-bold italic">BuyNow</Link>
          <span className="text-xl text-gray-700">Đăng nhập</span>
        </div>
        <span className="text-[#221f1e] text-sm font-medium cursor-pointer">Bạn cần giúp đỡ?</span>
      </header>

      {/* BODY */}
      <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-10">
        
        {/* Banner Marketing */}
        <div className="hidden lg:block w-3/5 text-center text-white pr-10">
           <div className="flex flex-col items-center">
              <img src={subBanner1} className="h-[115px] w-full object-cover rounded-sm" alt="banner-sub"/>
              <div className="text-5xl  text-[#181615] font-bold mb-4 drop-shadow-md">Nền tảng thương mại</div>
              <div className="text-3xl  text-[#181615] font-bold uppercase drop-shadow-md">Được yêu thích nhất Việt Nam</div>
           </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-[400px]">
          <h2 className="text-xl mb-6 text-gray-800 font-medium">Đăng nhập</h2>
          
          {/* Thông báo lỗi */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-[#181615] text-sm p-3 mb-4 rounded flex items-center gap-2">
               ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Username */}
            <input 
               type="text" 
               name="username" // QUAN TRỌNG: Cần name để handleChange hoạt động
               placeholder="Email/Số điện thoại/Tên đăng nhập" 
               className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
               value={formData.username} // Dùng formData
               onChange={handleChange}
            />

            {/* Input Password (Có nút ẩn hiện) */}
            <div className="relative">
                <input 
                  type={showPass ? "text" : "password"}
                  name="password" // QUAN TRỌNG
                  placeholder="Mật khẩu" 
                  className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500 pr-10"
                  value={formData.password} // Dùng formData
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass(!showPass)}
                >
                    {showPass ? <FaEyeSlash/> : <FaEye/>}
                </button>
            </div>
            
            <button 
                disabled={isLoading}
                className={`w-full text-white py-3 rounded-sm uppercase text-sm flex justify-center items-center gap-2 font-medium tracking-wide
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#201e1d] hover:opacity-90'}
                `}
            >
                {isLoading ? <><FaSpinner className="animate-spin"/> ĐANG NHẬP...</> : "ĐĂNG NHẬP"}
            </button>
          </form>
          
          <div className="flex justify-between text-xs text-blue-500 mt-2 mb-6">
             <a href="#">Quên mật khẩu</a>
             <a href="#">Đăng nhập với SMS</a>
          </div>

          <div className="flex items-center gap-2 my-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase">HOẶC</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <div className="flex gap-2 mb-6">
             <button className="flex-1 border p-2 flex justify-center items-center gap-2 hover:bg-gray-50 text-sm rounded-sm">
                <FaFacebook className="text-blue-600 text-lg"/> Facebook
             </button>
             <button className="flex-1 border p-2 flex justify-center items-center gap-2 hover:bg-gray-50 text-sm rounded-sm">
                <FaGoogle className="text-red-500 text-lg"/> Google
             </button>
          </div>

          <div className="text-center text-sm text-gray-400">
             Bạn mới biết đến Shopee? <Link to="/register" className="text-[#181615] font-medium ml-1">Đăng ký</Link>
          </div>

        </div>
      </div>

      <footer className="bg-[#f5f5f5] text-center py-8 text-xs text-gray-500 container mx-auto">
         <div className="grid grid-cols-4 gap-4 mb-8 w-2/3 mx-auto">
            <span>CHĂM SÓC KHÁCH HÀNG</span>
            <span>VỀ BuyNow</span>
            <span>THANH TOÁN</span>
            <span>THEO DÕI CHÚNG TÔI</span>
         </div>
         <div> BuyNow. Tất cả các quyền được bảo lưu.</div>
      </footer>
    </div>
  );
};

export default Login;