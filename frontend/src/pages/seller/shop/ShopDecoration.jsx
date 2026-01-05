// src/pages/seller/ShopDecoration.jsx
import React from 'react';
import { HelpCircle, Smartphone, Monitor } from 'lucide-react';
import { DECO_TABS, DEVICE_TABS, PROMO_CONTENT } from '../../../data/mockDecoration';
import { useDecoration } from '../../../hooks/seller/shop/useDecoration';

const ShopDecoration = () => {
  const {
    activeTab, 
    setActiveTab,
    activeDevice, 
    setActiveDevice,
    handleStartDecoration
  } = useDecoration();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* 1. HEADER & MAIN TABS */}
      <div className="bg-white rounded-t shadow-sm px-6 pt-4 mb-0.5">
        <div className="flex items-center justify-between mb-4">
           {/* Main Tabs Navigation */}
           <div className="flex gap-8">
            {DECO_TABS.map((tab) => (
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

          {/* Link Hướng dẫn & Kho ảnh */}
          <div className="flex gap-4 text-sm text-blue-500">
             <button className="hover:underline flex items-center gap-1">
                Kho Hình Ảnh/Video
             </button>
             <span className="text-gray-300">|</span>
             <button className="hover:underline flex items-center gap-1">
                <HelpCircle size={14}/> Hướng dẫn cài đặt
             </button>
          </div>
        </div>
      </div>

      {/* 2. SUB TABS (DEVICE SELECTION) */}
      {activeTab === 'HOME' && (
        <div className="bg-white shadow-sm px-6 border-t border-gray-100 mb-4">
           <div className="flex gap-6">
              {DEVICE_TABS.map((device) => (
                <button
                   key={device.id}
                   onClick={() => setActiveDevice(device.id)}
                   className={`py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                      activeDevice === device.id 
                        ? 'text-orange-600 border-orange-600' 
                        : 'text-gray-500 border-transparent hover:text-orange-600'
                   }`}
                >
                   {device.id === 'MOBILE' ? <Smartphone size={16}/> : <Monitor size={16}/>}
                   {device.label}
                </button>
              ))}
           </div>
        </div>
      )}

      {/* 3. HERO CONTENT (PROMO BANNER) */}
      <div className="bg-white rounded shadow-sm p-10 min-h-[500px] flex items-center justify-center">
         <div className="max-w-5xl w-full grid grid-cols-12 gap-12 items-center">
            
            {/* Left Content: Text & Button */}
            <div className="col-span-5 space-y-6">
               <h2 className="text-2xl font-medium text-gray-800 leading-snug">
                  {PROMO_CONTENT.title}
               </h2>
               
               <ul className="space-y-3">
                  {PROMO_CONTENT.features.map((feature, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <span className="text-orange-500 text-lg leading-none">•</span>
                        {feature}
                     </li>
                  ))}
               </ul>

               <div className="pt-4">
                 <button 
                    onClick={handleStartDecoration}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded shadow-sm transition-transform active:scale-95"
                 >
                    {PROMO_CONTENT.buttonText}
                 </button>
               </div>
            </div>

            {/* Right Content: Illustration Image */}
            <div className="col-span-7">
               <div className="relative">
                  {/* Bong bóng trang trí (Giả lập visual giống ảnh) */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-100 rounded-full opacity-50 blur-xl"></div>
                  <div className="absolute top-1/2 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
                  
                  {/* Ảnh chính */}
                  <img 
                    src={PROMO_CONTENT.illustration} 
                    alt="Shop Decoration Preview" 
                    className="w-full h-auto object-contain relative z-10"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://via.placeholder.com/600x350?text=Shop+Decoration+Preview"; // Fallback nếu ảnh lỗi
                    }}
                  />

                  {/* Tooltip giả lập bay bay (Giống ảnh) */}
                  <div className="absolute top-10 right-0 bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-20 animate-bounce-slow hidden md:block">
                     <p className="text-xs font-bold text-orange-500">Hiển thị bộ sưu tập</p>
                     <p className="text-[10px] text-gray-500">sản phẩm bán chạy của Shop</p>
                  </div>

                  <div className="absolute bottom-10 left-10 bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-20 hidden md:block">
                     <p className="text-xs font-bold text-blue-500">Giới thiệu Shop</p>
                     <p className="text-[10px] text-gray-500">của bạn</p>
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default ShopDecoration;