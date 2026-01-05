// src/pages/seller/ReturnRefundPage.jsx
import React from 'react';
import { Search, ChevronDown, FileText, Filter, AlertCircle } from 'lucide-react';
import { MAIN_TABS, SUB_TABS } from '../../../data/mockReturn';
import { useReturnOrder } from '../../../hooks/seller/orders/useReturnOrder';

const ReturnRefundPage = () => {
  const {
    activeMainTab, setActiveMainTab,
    activeSubTab, setActiveSubTab,
    searchTerm, setSearchTerm,
    filteredOrders,
    formatCurrency
  } = useReturnOrder();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* 1. MAIN TABS (Cấp 1) */}
      <div className="bg-white pt-4 px-4 rounded-t shadow-sm mb-1">
        <div className="flex border-b border-gray-200 gap-6">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id);
                setActiveSubTab('ALL'); // Reset tab con khi chuyển tab cha
              }}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeMainTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SUB TABS & FILTERS (Cấp 2) */}
      <div className="bg-white p-4 rounded-b shadow-sm space-y-4">
        
        {/* Sub Tabs (Chỉ hiện khi ở Tab Tất cả hoặc Trả hàng) */}
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
          {SUB_TABS.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveSubTab(tab.id)}
               className={`whitespace-nowrap px-4 py-1.5 text-sm rounded-full border transition-colors ${
                 activeSubTab === tab.id
                   ? 'border-orange-500 text-orange-500 bg-orange-50'
                   : 'border-gray-200 text-gray-600 hover:bg-gray-50'
               }`}
             >
               {tab.label}
             </button>
          ))}
        </div>

        {/* Priority Filters (Hết hạn...) */}
        <div className="flex items-center gap-2 text-sm">
           <span className="text-gray-500 mr-2">Ưu tiên:</span>
           {['Tất cả', 'Hết hạn sau 1 ngày', 'Hết hạn sau 2 ngày'].map((label, idx) => (
             <button key={idx} className={`px-3 py-1 border rounded-full text-xs ${idx===0 ? 'border-orange-500 text-orange-500' : 'border-gray-200 text-gray-600'}`}>
               {label}
             </button>
           ))}
        </div>

        {/* Action Filters (Hành động quan trọng) */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
           <span className="text-gray-500 mr-2 font-medium">HÀNH ĐỘNG QUAN TRỌNG:</span>
           {['Thương lượng với Người mua', 'Cần cung cấp bằng chứng', 'Giữ lại kiện hàng'].map((label, idx) => (
             <button key={idx} className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-orange-500 hover:text-orange-500 transition">
               {label}
             </button>
           ))}
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 flex border border-gray-300 rounded overflow-hidden hover:border-gray-400 transition">
             <input 
               type="text"
               placeholder="Điền Mã yêu cầu trả hàng / Mã đơn hàng / Tên người mua..."
               className="flex-1 px-4 py-2 text-sm outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="w-48 border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 flex justify-between items-center cursor-pointer bg-white">
             Toàn bộ thao tác <ChevronDown size={14}/>
          </div>
          <button className="px-6 py-2 bg-orange-500 text-white rounded text-sm font-medium hover:bg-orange-600">
            Tìm kiếm
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded text-sm hover:bg-gray-50">
            Đặt lại
          </button>
        </div>
      </div>

      {/* 3. INFO BAR (Số lượng yêu cầu) */}
      <div className="my-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">{filteredOrders.length} Yêu cầu</h3>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 border bg-white rounded text-sm flex items-center gap-1 text-gray-600">
             Sắp xếp theo <ChevronDown size={14}/>
           </button>
           <button className="px-3 py-1.5 border bg-white rounded text-sm text-gray-600">Export</button>
        </div>
      </div>

      {/* 4. TABLE */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm min-h-[400px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 bg-gray-50 p-3 text-xs font-semibold text-gray-500 border-b border-gray-200">
           <div className="col-span-4 pl-2">Sản phẩm</div>
           <div className="col-span-1 text-right">Số tiền</div>
           <div className="col-span-2 pl-4">Lý do</div>
           <div className="col-span-2">Phương án</div>
           <div className="col-span-2">Trạng thái</div>
           <div className="col-span-1 text-center">Thao tác</div>
        </div>

        {/* Table Body */}
        {filteredOrders.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gray-100 p-4 rounded-full mb-3"><FileText size={32} className="text-gray-400"/></div>
              <p className="text-gray-500 text-sm">Không tìm thấy đơn hàng</p>
           </div>
        ) : (
           filteredOrders.map((order) => (
             <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 text-sm items-center">
                
                {/* Cột Sản phẩm */}
                <div className="col-span-4 flex gap-3">
                   <img src={order.productImage} alt="" className="w-16 h-16 object-cover border rounded bg-gray-100 flex-shrink-0"/>
                   <div>
                      <p className="font-medium text-gray-800 line-clamp-2">{order.productName}</p>
                      <p className="text-xs text-gray-500 mt-1">Người mua: {order.username}</p>
                      <p className="text-xs text-gray-400 mt-0.5">ID: {order.id}</p>
                   </div>
                </div>

                {/* Cột Số tiền */}
                <div className="col-span-1 text-right font-medium text-gray-800">
                   {formatCurrency(order.amount)}
                </div>

                {/* Cột Lý do */}
                <div className="col-span-2 pl-4 text-gray-600 text-xs">
                   {order.reason}
                </div>

                {/* Cột Phương án */}
                <div className="col-span-2 text-xs">
                   <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 inline-block">
                     {order.solution}
                   </span>
                </div>

                {/* Cột Trạng thái */}
                <div className="col-span-2 text-xs space-y-1">
                   <p className="font-medium text-orange-600">{order.statusText}</p>
                   <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                      VC chiều về: {order.returnShipping}
                   </div>
                </div>

                {/* Cột Thao tác */}
                <div className="col-span-1 flex flex-col gap-2 items-center">
                   <button className="text-blue-600 hover:underline text-xs">Chi tiết</button>
                   {order.type === 'RETURN_REFUND' && (
                     <button className="text-xs border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-50 w-full">
                       Phản hồi
                     </button>
                   )}
                </div>

             </div>
           ))
        )}
      </div>

    </div>
  );
};

export default ReturnRefundPage;