// src/pages/seller/ShopCategory.jsx
import React from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  ArrowLeft, 
  MessageSquare, 
  Menu,
  ShoppingBag,
  List
} from 'lucide-react';
import { DECO_TABS } from '../../../data/mockCategory';
import { useShopCategory } from '../../../hooks/seller/shop/useShopCategory';

const ShopCategory = () => {
  const {
    activeTab,
    setActiveTab,
    categories,
    toggleStatus,
    handleDelete,
    handleAddCategory
  } = useShopCategory();

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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* --- CỘT TRÁI: QUẢN LÝ DANH MỤC (Chiếm 8 phần) --- */}
        <div className="col-span-8 bg-white rounded shadow-sm p-6 min-h-[600px] flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-medium text-gray-800">Danh mục của Shop</h2>
             <button 
               onClick={handleAddCategory}
               className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
             >
               <Plus size={16}/> Thêm danh mục
             </button>
          </div>

          {/* TABLE HEADER */}
          <div className="bg-gray-50 border border-gray-200 grid grid-cols-12 py-3 px-4 text-sm font-medium text-gray-500 text-center">
             <div className="col-span-5 text-left">Tên danh mục</div>
             <div className="col-span-2">Sản phẩm</div>
             <div className="col-span-2">Bật/Tắt</div>
             <div className="col-span-3">Thao tác</div>
          </div>

          {/* TABLE BODY */}
          <div className="border border-t-0 border-gray-200 flex-1">
             {categories.length === 0 ? (
               // EMPTY STATE (Như trong ảnh)
               <div className="h-full flex flex-col items-center justify-center py-10">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                     <List size={40} className="text-gray-300"/>
                  </div>
                  <p className="font-medium text-gray-800 mb-1">Chưa có danh mục tự chọn</p>
                  <p className="text-gray-500 text-sm text-center max-w-md mb-6">
                    Shop của bạn sẽ tự động hiển thị danh mục được tạo bởi hệ thống cho người mua. 
                    Bạn cũng có thể thêm các danh mục tự chọn.
                  </p>
                  <button className="border border-orange-500 text-orange-500 px-6 py-2 rounded text-sm hover:bg-orange-50 transition">
                     ↓ Thêm Danh mục được tạo bởi hệ thống
                  </button>
               </div>
             ) : (
               // LIST DATA
               categories.map((cat) => (
                 <div key={cat.id} className="grid grid-cols-12 py-4 px-4 border-b border-gray-100 items-center text-sm text-center hover:bg-gray-50">
                    <div className="col-span-5 text-left font-medium text-gray-800">{cat.name}</div>
                    <div className="col-span-2 text-gray-600">{cat.productCount}</div>
                    <div className="col-span-2 flex justify-center">
                       {/* Toggle Switch Fake */}
                       <div 
                         onClick={() => toggleStatus(cat.id)}
                         className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${cat.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                       >
                         <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${cat.isActive ? 'left-5' : 'left-0.5'}`}></div>
                       </div>
                    </div>
                    <div className="col-span-3 flex justify-center gap-3 text-blue-500">
                       <button className="hover:underline">Sửa</button>
                       <button onClick={() => handleDelete(cat.id)} className="hover:underline text-red-500">Xóa</button>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* --- CỘT PHẢI: XEM TRƯỚC (Preview Mobile) --- */}
        <div className="col-span-4 bg-white rounded shadow-sm p-6">
           <h3 className="font-medium text-gray-800 mb-4">Xem trước</h3>
           
           {/* MOBILE FRAME */}
           <div className="mx-auto w-[300px] border-[10px] border-gray-800 rounded-[30px] overflow-hidden shadow-xl bg-gray-100 h-[600px] relative">
              
              {/* STATUS BAR (Fake) */}
              <div className="bg-gray-800 h-6 w-full flex justify-between px-4 items-center">
                 <span className="text-[10px] text-white">12:30</span>
                 <div className="flex gap-1">
                    <div className="w-3 h-3 bg-white rounded-full opacity-20"></div>
                    <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
                 </div>
              </div>

              {/* APP HEADER */}
              <div className="bg-orange-500 p-3 flex gap-2 items-center text-white">
                 <ArrowLeft size={18}/>
                 <div className="flex-1 bg-white/20 rounded px-2 py-1 flex items-center text-xs text-white placeholder-white">
                    <Search size={12} className="mr-1 opacity-70"/> 
                    <span className="opacity-90">Tìm kiếm trong Shop</span>
                 </div>
                 <MoreHorizontal size={18}/>
              </div>

              {/* SHOP INFO */}
              <div className="bg-gray-800/80 p-3 text-white relative">
                 {/* Background mờ */}
                 <div className="absolute inset-0 overflow-hidden z-0">
                    <img src="https://via.placeholder.com/300x100" className="w-full h-full object-cover opacity-30 blur-sm" alt="bg"/>
                 </div>
                 
                 <div className="relative z-10 flex gap-3 items-center">
                    <img src="https://via.placeholder.com/50" className="w-12 h-12 rounded-full border border-white" alt="ava"/>
                    <div className="flex-1">
                       <p className="font-bold text-sm">Thời trang H_A_N</p>
                       <p className="text-[10px] opacity-80 flex items-center gap-1">Online 4 phút trước</p>
                    </div>
                    <div className="flex flex-col gap-1">
                       <button className="bg-white/20 text-[10px] px-2 py-0.5 rounded border border-white/50">+ Theo dõi</button>
                       <button className="bg-white/20 text-[10px] px-2 py-0.5 rounded border border-white/50 flex items-center gap-1 justify-center">
                          <MessageSquare size={10}/> Chat
                       </button>
                    </div>
                 </div>
              </div>

              {/* APP TABS */}
              <div className="bg-white flex border-b border-gray-200">
                 {['Shop', 'Sản phẩm', 'Danh mục'].map((t, idx) => (
                    <div key={t} className={`flex-1 py-2 text-xs text-center font-medium ${t === 'Danh mục' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600'}`}>
                       {t}
                    </div>
                 ))}
              </div>

              {/* CONTENT PREVIEW */}
              <div className="p-4 overflow-y-auto h-[350px] bg-gray-50">
                 {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                       <ShoppingBag size={48} className="mb-2 opacity-50"/>
                       <p className="text-xs">Shop không có danh mục nào.</p>
                    </div>
                 ) : (
                    <div className="space-y-2">
                       {categories.filter(c => c.isActive).map(cat => (
                          <div key={cat.id} className="bg-white p-3 rounded shadow-sm flex justify-between items-center">
                             <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                             <span className="text-xs text-gray-400">Xem tất cả &gt;</span>
                          </div>
                       ))}
                    </div>
                 )}
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default ShopCategory;