// src/pages/seller/ShopProfile.jsx
import React from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { PROFILE_TABS } from '../../../data/mockShopProfile';
import { useShopProfile } from '../../../hooks/seller/shop/useShopProfile';

const ShopProfile = () => {
  const {
    profile,
    tempProfile,
    isEditing,
    activeTab,
    setActiveTab,
    handleStartEdit,
    handleCancelEdit,
    handleSave,
    handleChange,
    handleImageChange
  } = useShopProfile();

  // Biến dùng để render dữ liệu (Nếu đang Edit thì dùng tempProfile, ngược lại dùng profile)
  const displayData = isEditing ? tempProfile : profile;

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* 1. HEADER & TABS */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800 mb-4">Hồ sơ Shop</h1>
        <div className="bg-white rounded-t shadow-sm border-b border-gray-200 px-4 pt-2">
          <div className="flex gap-8">
            {PROFILE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-orange-600'
                    : 'text-gray-600 border-transparent hover:text-orange-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT CARD */}
      <div className="bg-white rounded-b shadow-sm p-8 min-h-[500px]">
        
        {/* Card Header: Title & Actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Thông tin cơ bản</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý thông tin hồ sơ cửa hàng của bạn</p>
          </div>
          
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition">
                  <ExternalLink size={16} /> Xem Shop của tôi
                </button>
                <button 
                  onClick={handleStartEdit}
                  className="px-6 py-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 font-medium transition"
                >
                  Chỉnh sửa
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 font-medium transition"
                >
                  Lưu
                </button>
              </>
            )}
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="max-w-3xl">
          
          {/* Field: Tên Shop */}
          <div className="grid grid-cols-12 gap-6 mb-8 items-center">
             <div className="col-span-3 text-right text-sm text-gray-500">Tên Shop</div>
             <div className="col-span-9">
               {isEditing ? (
                 <input 
                   type="text" 
                   value={displayData.name}
                   onChange={(e) => handleChange('name', e.target.value)}
                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                   maxLength={30}
                 />
               ) : (
                 <span className="text-gray-800 font-medium">{displayData.name}</span>
               )}
             </div>
          </div>

          {/* Field: Logo Shop */}
          <div className="grid grid-cols-12 gap-6 mb-8 items-start">
             <div className="col-span-3 text-right text-sm text-gray-500 pt-2">Logo của Shop</div>
             <div className="col-span-9 flex items-center gap-6">
                {/* Image Preview Container */}
                <div className="relative w-24 h-24 rounded-full border border-gray-200 overflow-hidden group">
                   <img src={displayData.logo} alt="Shop Logo" className="w-full h-full object-cover" />
                   
                   {/* Overlay Icon khi Edit */}
                   {isEditing && (
                     <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                     </label>
                   )}
                </div>

                {/* Ghi chú hướng dẫn (Giống ảnh) */}
                <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                  <li>Kích thước hình ảnh tiêu chuẩn: Chiều rộng 300px, Chiều cao 300px</li>
                  <li>Dung lượng file tối đa: 2.0MB</li>
                  <li>Định dạng file được hỗ trợ: JPG, JPEG, PNG</li>
                </ul>
             </div>
          </div>

          {/* Field: Mô tả Shop */}
          <div className="grid grid-cols-12 gap-6 mb-8 items-start">
             <div className="col-span-3 text-right text-sm text-gray-500 pt-2">Mô tả Shop</div>
             <div className="col-span-9">
               {isEditing ? (
                 <div className="relative">
                   <textarea 
                     value={displayData.description}
                     onChange={(e) => handleChange('description', e.target.value)}
                     rows={5}
                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                     placeholder="Nhập mô tả về shop của bạn..."
                   />
                   <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                     {displayData.description ? displayData.description.length : 0}/500
                   </span>
                 </div>
               ) : (
                 <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed border border-transparent py-2">
                   {displayData.description || "Chưa có mô tả"}
                 </p>
               )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ShopProfile;