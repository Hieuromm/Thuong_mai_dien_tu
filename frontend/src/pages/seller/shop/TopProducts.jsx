// src/pages/seller/TopProducts.jsx
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { DECO_TABS, INTRO_CONTENT, PREVIEW_PRODUCTS } from '../../../data/mockTopProducts';
import { useTopProducts } from '../../../hooks/seller/shop/useTopProducts';

const TopProducts = () => {
  const { activeTab, setActiveTab, handleAutoSelect } = useTopProducts();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* 1. HEADER TABS */}
      <div className="bg-white rounded-t shadow-sm px-6 pt-4 mb-4">
        <div className="flex gap-8 border-b border-gray-200">
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
              {tab.label} <span className="text-gray-400 font-normal">{tab.id === 'TOP_PRODUCTS' && <HelpCircle size={12} className="inline mb-1"/>}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="bg-white rounded shadow-sm p-10 min-h-[600px] flex items-center justify-center">
        <div className="max-w-4xl w-full grid grid-cols-12 gap-16 items-center">
          
          {/* --- CỘT TRÁI: PHONE MOCKUP --- */}
          <div className="col-span-5 flex justify-center">
             <div className="relative w-[280px] h-[550px] border-8 border-gray-800 rounded-[35px] bg-gray-100 shadow-2xl overflow-hidden flex flex-col">
                
                {/* Phone Header (Fake) */}
                <div className="h-6 bg-gray-800 w-full"></div>
                
                {/* Phone Content */}
                <div className="flex-1 p-4 flex flex-col justify-center space-y-4">
                   
                   {/* Mock Product Page Content (Mờ mờ phía trên) */}
                   <div className="bg-white rounded p-2 h-20 w-full opacity-40 animate-pulse"></div>
                   <div className="space-y-2 opacity-40">
                      <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                   </div>

                   {/* WIDGET: TOP PICKS (Điểm nhấn chính) */}
                   <div className="bg-white rounded-lg shadow-md p-3 border border-orange-200 relative z-10">
                      <h4 className="font-bold text-xs text-orange-600 mb-2 uppercase tracking-wide">Top Picks from Shop</h4>
                      <div className="grid grid-cols-3 gap-2">
                         {PREVIEW_PRODUCTS.map((prod) => (
                            <div key={prod.id} className="text-center">
                               <div className="aspect-square bg-gray-100 rounded mb-1 overflow-hidden border border-gray-100">
                                  <img src={prod.image} alt="" className="w-full h-full object-cover"/>
                               </div>
                               <p className="text-[8px] text-gray-500 truncate">{prod.name}</p>
                               <p className="text-[9px] text-orange-600 font-medium">đ{prod.price.toLocaleString()}</p>
                            </div>
                         ))}
                      </div>
                      
                      {/* Decorative dots (giống ảnh) */}
                      <div className="flex justify-center gap-1 mt-2">
                         <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                      </div>
                   </div>

                   {/* Mock Content Bottom */}
                   <div className="bg-green-100/50 h-12 w-full rounded opacity-50"></div>

                </div>

                {/* Caption dưới điện thoại */}
                <p className="absolute -bottom-8 w-full text-center text-sm text-gray-500">Trang Chi tiết sản phẩm</p>
             </div>
          </div>

          {/* --- CỘT PHẢI: INFO & ACTIONS --- */}
          <div className="col-span-7 space-y-6">
             <h2 className="text-2xl font-medium text-gray-800">
               Top Sản phẩm nổi bật
             </h2>
             
             <div className="space-y-4 text-sm text-gray-600">
                <p className="font-medium text-lg text-gray-700">
                   {INTRO_CONTENT.title}
                </p>
                {INTRO_CONTENT.descriptions.map((desc, idx) => (
                   <p key={idx}>{desc}</p>
                ))}
             </div>

             <div className="pt-2">
                <button 
                  onClick={handleAutoSelect}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded shadow-sm transition"
                >
                  Tự chọn sản phẩm
                </button>
             </div>

             <div>
                <a href="#" className="text-blue-500 text-sm hover:underline">
                   Tìm hiểu thêm về Top sản phẩm nổi bật
                </a>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TopProducts;