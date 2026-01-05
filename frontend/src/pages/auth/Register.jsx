// src/pages/auth/Register.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaSpinner } from 'react-icons/fa';
import { useRegisterLogic } from '../../hooks/auth/useRegisterLogic';
import subBanner1 from '../../assets/d4334724-098e-44ea-a01b-3e0a5684880e.png';
const Register = () => {
  const { 
    formData, 
    handleChange, 
    isLoading, 
    errorMsg, 
    handleRegister 
  } = useRegisterLogic();

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff]">
      
      {/* HEADER */}
      <header className="bg-white py-4 px-10 flex justify-between items-center shadow-md">
        <div className="flex items-end gap-4 container mx-auto">
          <Link to="/" className="text-[#292626] text-3xl font-bold italic">BuyNow</Link>
          <span className="text-xl text-gray-700">Đăng ký</span>
        </div>
        <span className="text-[#0f0e0d] text-sm font-medium cursor-pointer">Bạn cần giúp đỡ?</span>
      </header>

      {/* BODY */}
      <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-10">
        
        {/* Banner Marketing */}
        <div className="hidden lg:block w-3/5 text-center text-white pr-10">
             <div className="flex flex-col items-center">
               <img src={subBanner1} className="h-[115px] w-full object-cover rounded-sm" alt="banner-sub"/>
                <div className="text-5xl text-[#181615] font-bold mb-4 drop-shadow-md">Nền tảng thương mại</div>
                <div className="text-3xl text-[#181615] font-bold uppercase drop-shadow-md">Được yêu thích nhất Việt Nam</div>
             </div>
        </div>

        {/* Form Register */}
        <div className="bg-white p-8 rounded shadow w-full max-w-[400px]">
          <h2 className="text-xl mb-6 text-gray-800 font-medium">Đăng ký</h2>
          
          {/* Thông báo lỗi */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-[#181615] text-sm p-3 mb-4 rounded flex items-center gap-2">
               ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            {/* 1. Tên đăng nhập */}
            <input 
               type="text" 
               name="username"
               placeholder="Tên đăng nhập" 
               className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
               value={formData.username}
               onChange={handleChange}
            />

            {/* 2. Email (BẮT BUỘC) */}
            <input 
               type="email" 
               name="email"
               placeholder="Email (Bắt buộc)" 
               className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
               value={formData.email}
               onChange={handleChange}
            />

            {/* 3. Họ và tên */}
            <input 
               type="text" 
               name="fullName"
               placeholder="Họ và tên đầy đủ" 
               className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
               value={formData.fullName}
               onChange={handleChange}
            />

            {/* 4. Số điện thoại */}
            <input 
               type="text" 
               name="phone"
               placeholder="Số điện thoại" 
               className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
               value={formData.phone}
               onChange={handleChange}
            />

            {/* 5. Mật khẩu */}
            <input 
              type="password" 
              name="password"
              placeholder="Mật khẩu" 
              className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
              value={formData.password}
              onChange={handleChange}
            />

            {/* 6. Nhập lại mật khẩu */}
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu" 
              className="w-full border p-3 rounded-sm text-sm outline-none focus:border-gray-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <button 
                disabled={isLoading}
                className={`w-full text-white py-3 rounded-sm uppercase text-sm flex justify-center items-center gap-2 font-medium tracking-wide mt-2
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#252221] hover:opacity-90'}
                `}
            >
                {isLoading ? <><FaSpinner className="animate-spin"/> ĐANG XỬ LÝ...</> : "ĐĂNG KÝ"}
            </button>
          </form>
          
          {/* Social Login */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase">Hoặc</span>
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

          <div className="text-center text-xs text-gray-500 mb-6 px-4">
             Bằng việc đăng ký, bạn đồng ý với BuyNow về <br/>
             <a href="#" className="text-[#1f1b1a]">Điều khoản dịch vụ</a> & <a href="#" className="text-[#131111]">Chính sách bảo mật</a>
          </div>

          <div className="text-center text-sm text-gray-400">
             Bạn đã có tài khoản? <Link to="/login" className="text-[#252221] font-medium ml-1">Đăng nhập</Link>
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
         <div>BuyNow. Tất cả các quyền được bảo lưu.</div>
      </footer>
    </div>
  );
};

export default Register;