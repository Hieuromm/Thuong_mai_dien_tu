// src/pages/seller/MassDelivery.jsx
import React from 'react';
import { 
  ChevronDown, 
  MapPin, 
  Calendar,
  Info
} from 'lucide-react';

// Import Data & Logic từ bên ngoài
import { CARRIERS } from '../../../data/mockDelivery';
import { useMassDelivery } from '../../../hooks/seller/orders/useMassDelivery';

const MassDelivery = () => {
  // Gọi Hook để lấy toàn bộ dữ liệu và hàm xử lý
  const {
    filteredOrders,
    selectedIds,
    activeTab,
    filterCarrier,
    isAllSelected,
    setActiveTab,
    setFilterCarrier,
    handleSelectAll,
    handleSelectOne
  } = useMassDelivery();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* HEADER TITLE & TABS */}
      <div className="mb-4">
        <h1 className="text-2xl font-medium text-gray-800">Giao Hàng Loạt</h1>
        <div className="flex mt-4 border-b border-gray-300">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-orange-500'}`}
          >
            Chờ giao hàng
          </button>
          <button 
             onClick={() => setActiveTab('created')}
             className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'created' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-orange-500'}`}
          >
            Tạo phiếu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        
        {/* --- CỘT TRÁI: DANH SÁCH & BỘ LỌC (Chiếm 9 phần) --- */}
        <div className="col-span-9 space-y-4">
          
          {/* FILTER CARD */}
          <div className="bg-white p-4 rounded shadow-sm">
            {/* Filter: Hạn giao hàng (Demo tĩnh) */}
            <div className="flex items-center mb-4">
              <span className="w-32 text-sm text-gray-500">Hạn giao hàng</span>
              <div className="flex gap-2">
                {['Tất cả trạng thái', 'Quá hạn (0)', 'Trong 24h (0)'].map((label, idx) => (
                   <button key={idx} className={`px-3 py-1 text-xs border rounded-sm ${idx === 0 ? 'border-orange-500 text-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                     {label}
                   </button>
                ))}
              </div>
            </div>

            {/* Filter: Đơn vị vận chuyển (Dynamic từ CARRIERS) */}
            <div className="flex items-start">
              <span className="w-32 text-sm text-gray-500 mt-1">Đơn vị vận chuyển</span>
              <div className="flex flex-wrap gap-2 flex-1">
                {CARRIERS.map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => setFilterCarrier(c.id === 'all' ? 'all' : c.label)}
                    className={`px-3 py-1 text-xs border rounded-sm transition-colors ${
                      (filterCarrier === 'all' && c.id === 'all') || (filterCarrier === c.label)
                        ? 'border-orange-500 text-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
               <h3 className="font-medium text-sm text-gray-700">{filteredOrders.length} Kiện hàng</h3>
            </div>

            {/* TABLE HEADER */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 grid grid-cols-12 gap-4 text-xs font-medium text-gray-500">
              <div className="col-span-1 flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                  onChange={handleSelectAll}
                  checked={isAllSelected} // Lấy từ Hook logic
                />
              </div>
              <div className="col-span-4">Sản phẩm</div>
              <div className="col-span-2">Mã đơn hàng</div>
              <div className="col-span-2">Đơn vị vận chuyển</div>
              <div className="col-span-2">Hạn gửi</div>
              <div className="col-span-1">Trạng thái</div>
            </div>

            {/* TABLE BODY */}
            <div className="bg-white min-h-[300px]">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                   <div className="bg-gray-100 p-4 rounded-full mb-2"><Info size={24} className="text-gray-400"/></div>
                   <p className="text-gray-400 text-sm">Không tìm thấy đơn hàng phù hợp</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="px-4 py-3 border-b border-gray-100 grid grid-cols-12 gap-4 items-center text-sm hover:bg-gray-50 transition-colors">
                    <div className="col-span-1">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(order.id)}
                        onChange={() => handleSelectOne(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-4 flex gap-3">
                       <img src={order.image} alt="" className="w-10 h-10 object-cover border rounded bg-gray-100"/>
                       <div className="flex flex-col justify-center">
                         <p className="line-clamp-1 font-medium text-gray-800" title={order.productName}>{order.productName}</p>
                         <p className="text-xs text-gray-500">Người mua: {order.buyer}</p>
                       </div>
                    </div>
                    <div className="col-span-2 text-gray-600 font-mono text-xs">{order.id}</div>
                    <div className="col-span-2 text-gray-700 text-xs">{order.carrier}</div>
                    <div className="col-span-2 text-orange-600 text-xs font-medium">{order.deadline}</div>
                    <div className="col-span-1 text-xs text-gray-500">{order.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: ACTIONS PANEL --- */}
        <div className="col-span-3">
           <div className="bg-white p-4 rounded shadow-sm sticky top-4 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-1">Thao tác hàng loạt</h3>
              <p className="text-sm text-gray-500 mb-4">Đã chọn: <b className="text-orange-500">{selectedIds.length}</b> đơn</p>

              {/* PICKUP SECTION */}
              <div className="mb-6">
                 <h4 className="font-semibold text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    Yêu cầu lấy hàng
                 </h4>
                 
                 <div className="bg-orange-50 p-3 rounded border border-orange-100 text-xs mb-3">
                    <p className="font-bold text-gray-800 mb-1">Kho Chính</p>
                    <p className="text-gray-600">245 Trần Đại Nghĩa, Đà Nẵng</p>
                 </div>

                 <div className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">Ngày lấy dự kiến</label>
                    <div className="flex items-center border border-gray-300 rounded px-2 py-2 bg-white hover:border-orange-500 transition">
                       <Calendar size={14} className="text-gray-400 mr-2"/>
                       <select className="w-full text-sm outline-none bg-transparent cursor-pointer">
                          <option>Ngày mai (16/12)</option>
                          <option>Ngày kia (17/12)</option>
                       </select>
                    </div>
                 </div>

                 <button 
                    disabled={selectedIds.length === 0}
                    className={`w-full py-2.5 text-sm font-medium text-white rounded shadow-sm transition-all
                       ${selectedIds.length > 0 ? 'bg-orange-500 hover:bg-orange-600 hover:shadow' : 'bg-gray-300 cursor-not-allowed'}
                    `}
                 >
                    Xác nhận lấy hàng
                 </button>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* DROPOFF SECTION */}
              <div>
                 <h4 className="font-semibold text-sm mb-2 text-gray-700 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                    Gửi tại bưu cục
                 </h4>
                 
                 <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="font-bold flex items-center gap-1 mb-1 text-gray-800"><MapPin size={12}/> Bưu cục gần nhất:</p>
                    <p className="text-gray-600 truncate">153 Trần Hưng Đạo, Sơn Trà</p>
                 </div>

                 <button 
                    disabled={selectedIds.length === 0}
                    className={`w-full py-2.5 text-sm font-medium text-white rounded shadow-sm transition-all
                       ${selectedIds.length > 0 ? 'bg-blue-500 hover:bg-blue-600 hover:shadow' : 'bg-gray-300 cursor-not-allowed'}
                    `}
                 >
                    Xác nhận gửi hàng
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MassDelivery;