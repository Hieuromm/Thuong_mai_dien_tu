import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerShopAPI } from '../../services/shopService'; 
import { useAuth } from '../../context/AuthContext'; 
import { 
    FaStore, 
    FaSpinner, 
    FaMapMarkerAlt, 
    FaInfoCircle, 
    FaPhoneAlt, // Thêm icon điện thoại
    FaArrowLeft,
    FaHourglassHalf // Thêm icon đồng hồ cát cho màn hình chờ
} from 'react-icons/fa';

const SellerRegister = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Lấy user để kiểm tra trạng thái

  // CẬP NHẬT 1: Sửa state để khớp 100% với Backend DTO (Thêm phone, bỏ city)
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    phone: '',      // Backend bắt buộc trường này
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- LOGIC 1: CHUYỂN HƯỚNG NẾU ĐÃ LÀ SELLER ---
  useEffect(() => {
    if (user?.role === 'SELLER') {
        navigate('/seller/dashboard');
    }
  }, [user, navigate]);

  // --- LOGIC 2: HIỂN THỊ MÀN HÌNH CHỜ NẾU ĐANG PENDING ---
  // Đoạn này chặn Form lại nếu user đang ở trạng thái chờ duyệt
  if (user?.shopStatus === 'PENDING' || user?.shop?.status === 'PENDING') {
    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-orange-500 animate-fadeIn">
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-50 p-5 rounded-full relative">
                        <FaStore className="text-6xl text-orange-200" />
                        <FaHourglassHalf className="text-2xl text-orange-500 animate-bounce absolute bottom-2 right-2" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Hồ sơ đang chờ duyệt</h2>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    Yêu cầu mở Shop <strong>{user?.shopName}</strong> đã được gửi thành công. 
                    Quản trị viên đang kiểm tra thông tin. Vui lòng quay lại sau.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="w-full py-3 bg-[#ee4d2d] text-white font-bold rounded-lg hover:bg-[#d73211] transition-all shadow-md"
                >
                    Quay về Trang chủ
                </button>
            </div>
        </div>
    );
  }

  // --- LOGIC 3: FORM ĐĂNG KÝ (CHỈ HIỆN KHI CHƯA CÓ SHOP) ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        // 1. Gọi API đăng ký (Backend trả về shopStatus: "PENDING")
        const data = await registerShopAPI(formData);
        
        // 2. Cập nhật AuthContext. 
        // Quan trọng: Hàm login sẽ cập nhật user.shopStatus = "PENDING".
        // React sẽ phát hiện thay đổi -> Re-render -> Nhảy vào LOGIC 2 ở trên -> Hiện màn hình chờ.
        login(data, data.token); 
        
        // Không cần navigate('/') ở đây nữa, để UI tự chuyển sang màn hình chờ cho chuyên nghiệp.
        
    } catch (error) {
        const message = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
        setErrorMsg(message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-100">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><FaArrowLeft /></button>
                <h1 className="text-2xl font-bold text-[#ee4d2d] flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <FaStore className="text-3xl"/> Đăng Ký Người Bán
                </h1>
            </div>
         </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl border-t-4 border-[#ee4d2d]">
            
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Cài đặt thông tin Shop</h2>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-6 flex items-start gap-2">
                <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0"/>
                <p className="text-blue-700 text-xs">
                    Vui lòng điền chính xác thông tin. Hồ sơ sẽ được duyệt trong vòng 24h.
                </p>
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm border border-red-200 flex items-center gap-2">
                    ⚠️ {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Tên Shop */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tight">
                        Tên Shop <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        name="shopName" 
                        maxLength="30"
                        required
                        className="w-full border p-3 rounded text-sm outline-none focus:border-[#ee4d2d] transition-all"
                        placeholder="Nhập tên Shop của bạn..."
                        value={formData.shopName} 
                        onChange={handleChange}
                    />
                </div>

                {/* CẬP NHẬT 2: Thêm trường Số điện thoại (Bắt buộc) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tight">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="tel" 
                            name="phone" 
                            required
                            pattern="[0-9]{10,11}"
                            className="w-full border p-3 pl-10 rounded text-sm outline-none focus:border-[#ee4d2d]"
                            placeholder="Nhập số điện thoại liên hệ..."
                            value={formData.phone} 
                            onChange={handleChange}
                        />
                        <FaPhoneAlt className="absolute left-3.5 top-3.5 text-gray-400 text-xs"/>
                    </div>
                </div>

                {/* CẬP NHẬT 3: Sửa thành 1 ô Địa chỉ duy nhất (Bỏ City) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tight">
                        Địa chỉ lấy hàng <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            name="address" 
                            required
                            className="w-full border p-3 pl-10 rounded text-sm outline-none focus:border-[#ee4d2d]"
                            placeholder="Số nhà, tên đường, Phường, Quận, Tỉnh/Thành phố..."
                            value={formData.address} 
                            onChange={handleChange}
                        />
                        <FaMapMarkerAlt className="absolute left-3.5 top-3.5 text-gray-400"/>
                    </div>
                </div>

                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-tight">Mô tả Shop</label>
                    <textarea 
                        name="description" 
                        rows="4"
                        className="w-full border p-3 rounded text-sm outline-none focus:border-[#ee4d2d] resize-none"
                        placeholder="Giới thiệu về sản phẩm bạn định bán..."
                        value={formData.description} 
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Nút bấm */}
                <div className="flex justify-end items-center gap-6 pt-6 border-t border-gray-100">
                    <button 
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-800 text-sm font-bold transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`px-10 py-3 rounded text-white font-bold text-sm shadow-md transition-all uppercase tracking-wide
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ee4d2d] hover:bg-[#d73211] active:scale-95'}
                        `}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <FaSpinner className="animate-spin"/> Đang xử lý...
                            </div>
                        ) : (
                            "Gửi hồ sơ xét duyệt"
                        )}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;