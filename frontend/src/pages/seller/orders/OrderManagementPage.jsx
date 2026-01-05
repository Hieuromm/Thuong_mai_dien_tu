import React from 'react';
import { 
  Search, 
  ChevronDown, 
  FileText, 
  Truck, 
  MessageSquare, 
  PackageX,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Import Logic Hook (File logic hoàn chỉnh ở trên)
import { useOrderLogic } from '../../../hooks/seller/orders/useOrderLogic';

// --- 1. ĐỊNH NGHĨA DANH SÁCH 7 TAB CHUẨN ---
const ORDER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },      
  { id: 'confirmed', label: 'Chờ lấy hàng' },    
  { id: 'shipping', label: 'Đang giao' },        
  { id: 'completed', label: 'Đã giao' },         
  { id: 'cancelled', label: 'Đơn Hủy' },         
  { id: 'returned', label: 'Trả hàng/Hoàn tiền' } 
];

const OrderManagement = () => {
  // --- 2. GỌI HOOK LOGIC ---
  const { 
    activeTab, 
    setActiveTab, 
    searchTerm, 
    setSearchTerm, 
    filteredOrders,
    loading,
    formatCurrency,
    // Các hàm xử lý hành động
    handleConfirmOrder,
    handleShipOrder,
    handleCompleteOrder,
    handleAcceptReturn,
    handleRejectReturn,
    handleReceivedReturn,
    debugRequestReturn
  } = useOrderLogic();

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Xem và cập nhật trạng thái đơn hàng của shop</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded shadow-sm text-sm hover:bg-gray-50 transition">
            <FileText size={16} /> Xuất Báo Cáo
          </button>
        </div>

        {/* --- MAIN CONTENT CARD --- */}
        <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-200">
          
          {/* A. TABS NAVIGATION */}
          <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
            {ORDER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-orange-600 bg-orange-50/50'
                    : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* B. SEARCH BAR */}
          <div className="p-5 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-3">
              <div className="flex bg-white border border-gray-300 rounded overflow-hidden w-full md:w-96 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition shadow-sm">
                <div className="px-3 py-2 bg-gray-100 border-r border-gray-300 text-sm text-gray-600 flex items-center min-w-[120px] justify-between cursor-pointer hover:bg-gray-200">
                  Mã đơn hàng <ChevronDown size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Nhập mã đơn hàng, tên người mua..."
                  className="flex-1 px-4 py-2 text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="px-4 text-gray-400 hover:text-orange-500 bg-white border-l border-gray-100">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* C. TABLE HEADER */}
          <div className="grid grid-cols-12 gap-4 bg-gray-100/80 p-3 text-sm font-semibold text-gray-600 text-center border-b border-gray-200">
            <div className="col-span-6 text-left pl-4">Sản phẩm</div>
            <div className="col-span-2">Tổng đơn hàng</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-1">Vận chuyển</div>
            <div className="col-span-1">Thao tác</div>
          </div>

          {/* D. ORDER LIST */}
          <div className="bg-gray-50 p-4 space-y-4 min-h-[400px]">
            
            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 mt-2 text-sm">Đang tải dữ liệu...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded border border-dashed border-gray-300 h-full">
                 <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <PackageX size={40} className="text-gray-400"/>
                 </div>
                 <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng nào</p>
                 <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}

            {/* List Data */}
            {!loading && filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                
                {/* 1. Header Item */}
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-sm text-gray-800 flex items-center gap-2">
                        {order.username}
                        <button className="flex items-center gap-1 text-[11px] font-normal text-orange-600 border border-orange-200 px-2 py-0.5 rounded bg-orange-50 hover:bg-orange-100 transition">
                          <MessageSquare size={12} /> Chat
                        </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Mã đơn hàng: <b className="text-gray-800 font-mono">{order.id}</b></span>
                  </div>
                </div>

                {/* 2. Body Item */}
                <div className="grid grid-cols-12 divide-x divide-gray-100">
                  
                  {/* Cột Trái: Danh sách sản phẩm */}
                  <div className="col-span-6">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition">
                        <div className="w-20 h-20 border border-gray-200 rounded flex-shrink-0 bg-gray-100 overflow-hidden">
                          <img src={product.image} alt="product" className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-sm text-gray-800 font-medium line-clamp-2 mb-1">{product.name}</h4>
                            <div className="text-xs text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
                              Phân loại: {product.variant}
                            </div>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-xs text-gray-500">x{product.quantity}</span>
                            <span className="text-sm font-medium text-gray-800">{formatCurrency(product.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cột: Tổng tiền */}
                  <div className="col-span-2 p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-orange-600 font-bold text-base">{formatCurrency(order.totalAmount)}</span>
                    <span className="text-xs text-gray-500 mt-1 px-2 py-0.5 rounded bg-gray-100">{order.paymentMethod}</span>
                  </div>

                  {/* Cột: Trạng thái */}
                  <div className="col-span-2 p-4 flex flex-col justify-center items-center text-center">
                    <span className="text-sm font-medium text-gray-800 mb-1">{order.statusText}</span>
                    <p className="text-xs text-gray-500">{order.shippingCarrier}</p>
                  </div>

                  {/* Cột: Vận chuyển Link */}
                  <div className="col-span-1 p-4 flex flex-col justify-center items-center text-center">
                     <button className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition">
                        <Truck size={20} />
                     </button>
                  </div>

                  {/* Cột: Thao tác (HIỂN THỊ NÚT THEO TRẠNG THÁI) */}
                  <div className="col-span-1 p-4 flex flex-col justify-center items-center gap-2">
                      
                      {/* --- 1. Tab CHỜ XÁC NHẬN --- */}
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => handleConfirmOrder(order.id)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-1.5 rounded shadow-sm transition"
                        >
                          Xác nhận
                        </button>
                      )}

                      {/* --- 2. Tab CHỜ LẤY HÀNG --- */}
                      {order.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => handleShipOrder(order.id)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 rounded shadow-sm transition"
                        >
                          Giao ĐVVC
                        </button>
                      )}

                      {/* --- 3. Tab ĐANG GIAO --- */}
                      {order.status === 'SHIPPING' && (
                        <button 
                          onClick={() => handleCompleteOrder(order.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1.5 rounded shadow-sm transition"
                        >
                          Đã giao
                        </button>
                      )}
            
                      {/* --- 4. Tab TRẢ HÀNG/HOÀN TIỀN --- */}
                      {order.status === 'RETURN_REQUESTED' && (
                        <>
                          <button 
                              onClick={() => handleAcceptReturn(order.id)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-1.5 rounded shadow-sm mb-1"
                          >
                              Đồng ý
                          </button>
                          <button 
                              onClick={() => handleRejectReturn(order.id)}
                              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-medium py-1.5 rounded transition"
                          >
                              Từ chối
                          </button>
                        </>
                      )}

                      {/* --- 5. Tab ĐƠN HỦY (Xử lý Giao thất bại & Hoàn tất trả hàng) --- */}
                      
                      {/* Nếu Shipper báo giao thất bại -> Hiện nút để Shop nhận lại hàng */}
                      {order.status === 'DELIVERY_FAILED' && (
                        <>
                            <div className="text-[10px] text-red-500 font-bold mb-1 border border-red-200 bg-red-50 px-2 py-1 rounded text-center flex items-center gap-1">
                                <AlertCircle size={10} /> Giao thất bại
                            </div>
                            <button 
                                onClick={() => handleReceivedReturn(order.id)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-1.5 rounded shadow-sm transition"
                            >
                                Đã nhận hàng hoàn
                            </button>
                        </>
                      )}

                      {/* Đã nhận hàng hoàn xong */}
                      {order.status === 'RETURNED' && (
                        <span className="text-xs text-green-600 font-medium border border-green-200 bg-green-50 px-2 py-1 rounded text-center w-full">
                            Đã hoàn kho
                        </span>
                      )}

                      {/* Đơn hủy thông thường */}
                      {order.status === 'CANCELLED' && (
                        <span className="text-xs text-gray-500 font-medium border border-gray-200 bg-gray-50 px-2 py-1 rounded text-center w-full">
                            Đã hủy
                        </span>
                      )}

                      {/* --- DEBUG: Giả lập khách yêu cầu trả hàng (Hiện khi đã giao) --- */}
                      {order.status === 'COMPLETED' && (
                          <button 
                            onClick={() => debugRequestReturn(order.id)} 
                            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-red-500 transition mt-1"
                            title="Giả lập khách yêu cầu trả hàng"
                          >
                             <RefreshCw size={10}/> [Test] Trả hàng
                          </button>
                      )}

                      <button className="text-xs text-gray-500 hover:text-orange-500 hover:underline transition mt-1">
                        Chi tiết
                      </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* E. FOOTER PAGINATION */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-2 bg-white">
              <span className="text-sm text-gray-500 mr-4">Tổng {filteredOrders.length} đơn hàng</span>
              <button className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50" disabled>Trước</button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Tiếp</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderManagement;