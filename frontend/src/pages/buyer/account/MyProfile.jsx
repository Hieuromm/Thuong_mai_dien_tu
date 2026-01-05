import React from 'react';
import Header from '../../../components/common/Header';
import ProfileSidebar from '../../../components/profile/ProfileSidebar';
import { useMyProfile } from '../../../hooks/buyer/account/useMyProfile';

const MyProfile = () => {
  const { 
      profile, 
      loading, 
      isSaving, 
      handleChange, 
      handleSave,
      handleAvatarChange
  } = useMyProfile();

  if (loading) return (
     <div className="min-h-screen flex justify-center items-center text-[#110f0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f1d1d]"></div>
     </div>
  );

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10 font-sans text-sm">
        <Header />
        
        <div className="container mx-auto px-4 pt-5 grid grid-cols-12 gap-6">
            
            {/* SIDEBAR */}
            <div className="col-span-2 hidden md:block">
                <ProfileSidebar />
            </div>

            {/* MAIN CONTENT */}
            <div className="col-span-12 md:col-span-10 bg-white p-6 rounded-sm shadow-sm">
                
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-lg font-medium text-gray-800">Hồ Sơ Của Tôi</h1>
                    <div className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-8">
                    
                    {/* --- CỘT TRÁI: FORM --- */}
                    <div className="flex-1 pr-0 md:pr-12">
                        <form onSubmit={(e) => e.preventDefault()}>
                            
                            {/* Tên Đăng Nhập */}
                            <div className="grid grid-cols-12 mb-6 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Tên đăng nhập</div>
                                <div className="col-span-9 text-gray-800 font-medium">{profile.username}</div>
                            </div>

                            {/* Tên */}
                            <div className="grid grid-cols-12 mb-6 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Tên</div>
                                <div className="col-span-9">
                                    <input 
                                        type="text" 
                                        value={profile.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded-sm outline-none focus:border-gray-500 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="grid grid-cols-12 mb-6 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Email</div>
                                <div className="col-span-9 flex items-center gap-2">
                                    <span>{profile.email ? profile.email : 'Chưa thiết lập'}</span>
                                    <button className="text-blue-500 underline text-xs">Thay Đổi</button>
                                </div>
                            </div>

                            {/* SĐT */}
                            <div className="grid grid-cols-12 mb-6 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Số điện thoại</div>
                                <div className="col-span-9 flex items-center gap-2">
                                    {/* Cho phép sửa SĐT */}
                                    <input 
                                        type="text" 
                                        value={profile.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded-sm outline-none focus:border-gray-500 shadow-sm"
                                        placeholder="Thêm số điện thoại"
                                    />
                                </div>
                            </div>

                            {/* Giới Tính */}
                            <div className="grid grid-cols-12 mb-6 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Giới tính</div>
                                <div className="col-span-9 flex items-center gap-4">
                                    {['nam', 'nu', 'khac'].map(g => (
                                        <label key={g} className="flex items-center cursor-pointer gap-2 capitalize">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                checked={profile.gender === g} 
                                                onChange={() => handleChange('gender', g)}
                                            /> 
                                            {g === 'nu' ? 'Nữ' : (g === 'khac' ? 'Khác' : 'Nam')}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Ngày Sinh */}
                            <div className="grid grid-cols-12 mb-8 items-center">
                                <div className="col-span-3 text-right text-gray-500 pr-5">Ngày sinh</div>
                                <div className="col-span-9 flex gap-2">
                                    <select 
                                         value={profile.day} 
                                         onChange={(e) => handleChange('day', e.target.value)}
                                         className="border border-gray-300 px-3 py-2 rounded-sm cursor-pointer outline-none w-20"
                                    >
                                         {[...Array(31)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                                    </select>
                                    <select 
                                         value={profile.month} 
                                         onChange={(e) => handleChange('month', e.target.value)}
                                         className="border border-gray-300 px-3 py-2 rounded-sm cursor-pointer outline-none w-28"
                                    >
                                         {[...Array(12)].map((_, i) => <option key={i} value={i+1}>Tháng {i+1}</option>)}
                                    </select>
                                    <select 
                                         value={profile.year} 
                                         onChange={(e) => handleChange('year', e.target.value)}
                                         className="border border-gray-300 px-3 py-2 rounded-sm cursor-pointer outline-none w-24"
                                    >
                                         {[...Array(60)].map((_, i) => <option key={i} value={2025-i}>{2025-i}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Nút Lưu */}
                            <div className="grid grid-cols-12">
                                <div className="col-span-3"></div>
                                <div className="col-span-9">
                                    <button 
                                       onClick={handleSave}
                                       disabled={isSaving}
                                       className={`bg-[#ee4d2d] text-white px-6 py-2 rounded-sm text-sm shadow-sm 
                                            ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0e0c0c] transition-colors'}
                                       `}
                                    >
                                         {isSaving ? 'Đang Lưu...' : 'Lưu'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* --- CỘT PHẢI: AVATAR --- */}
                    <div className="w-full md:w-[280px] flex flex-col items-center justify-center border-l border-gray-100 pl-0 md:pl-8">
                        <div className="w-24 h-24 rounded-full border bg-gray-100 overflow-hidden mb-4 relative">
                            <img src={profile.avatar || "https://via.placeholder.com/150"} alt="User Avatar" className="w-full h-full object-cover"/>
                        </div>
                        
                        <label className="border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50 mb-3 cursor-pointer transition-colors rounded-sm">
                            Chọn Ảnh
                            <input type="file" className="hidden" onChange={(e) => handleAvatarChange(e.target.files[0])} accept="image/*"/>
                        </label>

                        <div className="text-gray-400 text-xs text-center space-y-1">
                            <div>Dụng lượng file tối đa 1 MB</div>
                            <div>Định dạng:.JPEG, .PNG</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default MyProfile;