import React, { useState } from 'react';
import { 
  HelpCircle, Download, TrendingUp, TrendingDown, ChevronDown, 
  Eye, ShoppingBag, Search, Filter, ChevronRight, MousePointer2, X, Trophy
} from 'lucide-react';
import { useAnalytics } from "../../../hooks/seller/analytics/useAnalytics";


const BASE_URL = "http://localhost:8080"; 
const DEFAULT_PRODUCT_IMG = "https://via.placeholder.com/150?text=No+Image";

const SalesAnalytics = () => {
  // Lấy dữ liệu và logic từ Custom Hook
  const { 
    activeTab, setActiveTab,
    dateRange, setDateRange,
    getChartPath,
    data, 
    loading,
    error 
  } = useAnalytics();

  // State quản lý việc hiển thị Bảng xếp hạng
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Helper: Định dạng tiền tệ VND
  const formatCurrency = (val) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  // Helper: Định dạng số phân cách hàng nghìn
  const formatNumber = (val) => 
    new Intl.NumberFormat('vi-VN').format(val || 0);


  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PRODUCT_IMG;
    if (imagePath.startsWith('http')) return imagePath;
    
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Nếu path chưa có "uploads", tự động thêm thư mục sản phẩm
    if (!cleanPath.includes('uploads')) {
        return `${BASE_URL}/uploads/products${cleanPath}`;
    }
    return `${BASE_URL}${cleanPath}`;
  };

  /**
   * COMPONENT: Bảng Xếp Hạng (Modal Popup)
   */
  const LeaderboardModal = () => {
    // Sắp xếp top 10 sản phẩm theo doanh thu giảm dần
    const sortedProducts = [...(data?.products || [])]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3 text-white">
              <Trophy size={28} className="text-yellow-300 animate-bounce" />
              <h2 className="text-xl font-black uppercase tracking-tight">Bảng Xếp Hạng Doanh Thu</h2>
            </div>
            <button onClick={() => setIsLeaderboardOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 p-1 rounded-full">
              <X size={24} />
            </button>
          </div>

          {/* List */}
          <div className="p-6 max-h-[65vh] overflow-y-auto custom-scrollbar bg-gray-50">
            <div className="space-y-3">
              {sortedProducts.length > 0 ? sortedProducts.map((p, index) => (
                <div key={p.productId} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${index < 3 ? 'bg-white border-orange-200 shadow-sm' : 'bg-white/50 border-gray-100'}`}>
                  <div className="w-10 flex justify-center">
                    {index === 0 ? <span className="text-3xl">🥇</span> : 
                     index === 1 ? <span className="text-3xl">🥈</span> : 
                     index === 2 ? <span className="text-3xl">🥉</span> : 
                     <span className="text-lg font-black text-gray-400">#{index + 1}</span>}
                  </div>

                  <img src={getImageUrl(p.productImage)} className="w-14 h-14 rounded-lg object-cover border border-gray-100" alt={p.productName} />

                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 line-clamp-1 text-sm">{p.productName}</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase mt-1">Đã bán: <span className="text-gray-700">{p.soldCount}</span></p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-orange-600">{formatCurrency(p.revenue)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-400 italic font-medium">Chưa có dữ liệu xếp hạng</div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-white border-t text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">* Dữ liệu tính trên khung thời gian: {dateRange}</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-20 text-center text-orange-500 font-black animate-pulse">ĐANG ĐỒNG BỘ DỮ LIỆU...</div>;

  if (error) return (
    <div className="m-10 p-10 bg-white rounded-xl shadow-lg text-center border border-red-100">
      <div className="text-4xl mb-4">❌</div>
      <p className="text-gray-800 font-bold mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold">Thử lại</button>
    </div>
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen p-6 font-sans text-gray-800">
      
  
      {isLeaderboardOpen && <LeaderboardModal />}

      {/* 1. HEADER & TABS */}
      <div className="bg-white rounded-t-xl shadow-sm px-6 pt-5 mb-4 border border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Phân tích Bán hàng</h1>
        <div className="flex gap-8 border-b border-gray-50">
          {[{ id: 'tong-quan', label: 'Tổng quan' }, { id: 'san-pham', label: 'Sản phẩm' }].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-orange-600' : 'text-gray-400 hover:text-orange-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-full"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. BỘ LỌC THỜI GIAN */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs font-black uppercase">Khung Thời Gian</span>
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-bold outline-none focus:border-orange-500 bg-white cursor-pointer hover:bg-gray-50 min-w-[200px]"
            >
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="7days">7 ngày vừa qua</option>
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 text-gray-600 transition-all shadow-sm">
          <Download size={16}/> Xuất dữ liệu
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9 space-y-6">
          {activeTab === 'tong-quan' ? (
            <>
          
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-4 gap-8 mb-10">
                   {data?.overview?.map((stat) => (
                     <div key={stat.id} className="p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-orange-200 transition-all shadow-sm">
                        <div className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest">{stat.label}</div>
                        <div className="text-2xl font-black text-gray-900 mb-2">
                           {stat.id === 'sales' ? formatCurrency(stat.value) : formatNumber(stat.value)}
                           <span className="text-[10px] ml-1 text-gray-400 font-bold">{stat.unit}</span>
                        </div>
                        <div className={`text-[11px] font-black flex items-center gap-1 ${stat.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                           {stat.growth >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} 
                           {Math.abs(stat.growth).toFixed(2)}% <span className="text-gray-400 font-normal">vs kỳ trước</span>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-4">
                   <h4 className="text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">Biểu đồ xu hướng doanh thu</h4>
                   <div className="h-[250px] w-full relative">
                      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                         <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#ea580c" stopOpacity="0.1"/>
                               <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
                            </linearGradient>
                         </defs>
                         <path d={`${getChartPath()} L 1000 200 L 0 200 Z`} fill="url(#chartGradient)" />
                         <path d={getChartPath()} fill="none" stroke="#ea580c" strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
                      </svg>
                   </div>
                   <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-black px-1 border-t border-gray-50 pt-4">
                      <span>00:00</span><span>12:00</span><span>23:59</span>
                   </div>
                </div>
              </div>
            </>
          ) : (
            /* TAB SẢN PHẨM */
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="relative w-80">
                  <input type="text" placeholder="Tìm tên sản phẩm..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 shadow-sm" />
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                </div>
                <button className="flex items-center gap-2 text-xs font-black text-gray-500 border border-gray-200 px-5 py-2.5 bg-white rounded-xl hover:bg-gray-50 shadow-sm transition-all uppercase tracking-widest">
                  <Filter size={16}/> Bộ lọc
                </button>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black">
                    <th className="px-8 py-6 w-[45%]">Sản phẩm</th>
                    <th className="px-4 py-6 text-center">Lượt xem</th>
                    <th className="px-4 py-6 text-center">Đã bán</th>
                    <th className="px-6 py-6 text-right">Doanh thu</th>
                    <th className="px-8 py-6 text-right">Tỉ lệ chốt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.products?.length > 0 ? (
                    data.products.map((product) => {
                      const conversionRate = product.visitCount > 0 
                        ? ((product.soldCount / product.visitCount) * 100).toFixed(1) 
                        : "0.0";

                      return (
                        <tr key={product.productId} className="hover:bg-orange-50/20 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 shrink-0 border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
                                <img 
                                  src={getImageUrl(product.productImage)} 
                                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                  alt={product.productName} 
                                  onError={(e) => { e.target.src = DEFAULT_PRODUCT_IMG; }}
                                />
                              </div>
                              <span className="font-bold text-gray-700 line-clamp-2 text-sm leading-relaxed group-hover:text-orange-600 transition-colors">
                                {product.productName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center text-gray-500 font-medium">{formatNumber(product.visitCount)}</td>
                  
                          <td className="px-4 py-5 text-center text-gray-900 font-black">{formatNumber(product.soldCount)}</td>
                          <td className="px-6 py-5 text-right text-orange-600 font-black">{formatCurrency(product.revenue)}</td>
                          <td className="px-8 py-5 text-right">
                            <span className="inline-block text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                              {conversionRate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-32 text-center text-gray-300 italic font-medium">
                         Chưa ghi nhận dữ liệu cho khung thời gian này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SIDEBAR DỮ LIỆU TRỰC TIẾP */}
        <div className="col-span-3">
           <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-orange-500 sticky top-6 border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="font-black text-gray-900 tracking-tighter text-sm uppercase">Dữ liệu Live</h3>
                 <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[10px] text-green-700 font-black uppercase tracking-widest">Live</span>
                 </div>
              </div>

              <div className="space-y-12">
                 <div>
                    <p className="text-[10px] text-gray-400 mb-3 font-black uppercase tracking-[0.2em]">DOANH SỐ HÔM NAY</p>
                    <p className="text-3xl font-black text-orange-600 tracking-tighter">
                      {formatCurrency(data?.realTime?.salesToday || 0)}
                    </p>
                 </div>

                 <div className="space-y-8">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-3 font-black uppercase tracking-[0.2em]">Đơn hàng mới</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatNumber(data?.realTime?.ordersCount || 0)}</p>
                      <div className="h-1.5 w-full bg-gray-50 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-3 font-black uppercase tracking-[0.2em]">Lượt truy cập</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatNumber(data?.realTime?.visits || 0)}</p>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-50">
                    <button 
                      onClick={() => setIsLeaderboardOpen(true)}
                      className="w-full py-4 text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] hover:bg-blue-50 rounded-xl transition-all border border-blue-100 shadow-sm"
                    >
                       Xem bảng xếp hạng
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;

// --- CSS ANIMATION CHO PROGRESS BAR ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes progress {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
`;
document.head.appendChild(styleSheet);