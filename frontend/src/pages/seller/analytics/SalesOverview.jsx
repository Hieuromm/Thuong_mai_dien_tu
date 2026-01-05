import React from 'react';
import { Calendar, Download, HelpCircle } from 'lucide-react';
// Sử dụng useAnalytics để lấy dữ liệu thực tế từ Backend
import { useAnalytics } from "../../../hooks/seller/analytics/useAnalytics";

const SalesOverview = () => {
  // 1. Lấy dữ liệu thực tế từ Hook Analytics
  const { data, loading } = useAnalytics();

  // 2. Trích xuất và Tính toán các chỉ số
  const stats = {
    visits: data.realTime?.visits || 0,
    salesAmount: data.realTime?.salesToday || 0,

    buyers: data.realTime?.buyersCount || 0, 
    ordersPlaced: data.realTime?.ordersCount || 0,
 
    ordersPaid: data.realTime?.confirmedOrdersCount || 0 
  };

  // 3. Tính toán các tỷ lệ (Logics)
  const salesPerBuyer = stats.buyers > 0 ? stats.salesAmount / stats.buyers : 0;
  
  const conversionVisitToPlaced = stats.visits > 0 
    ? ((stats.ordersPlaced / stats.visits) * 100).toFixed(2) 
    : "0.00";

  const conversionPlacedToPaid = stats.ordersPlaced > 0 
    ? ((stats.ordersPaid / stats.ordersPlaced) * 100).toFixed(2) 
    : "0.00";


  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* HEADER & FILTER */}
      <div className="bg-white rounded-t shadow-sm px-6 py-4 mb-4 border-b">
         <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
               <h2 className="text-lg font-bold text-gray-800">Tổng quan về Doanh số</h2>
               <div className="h-4 w-[1px] bg-gray-300"></div>
               <div className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded text-sm bg-gray-50">
                  <span className="text-gray-500">Khung Thời Gian</span>
                  <span className="font-medium">Hôm nay</span>
                  <Calendar size={14} className="text-gray-400 ml-2"/>
               </div>
            </div>
            <button className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1.5 rounded text-sm hover:bg-blue-50">
               <Download size={14}/> Tải dữ liệu báo cáo
            </button>
         </div>
      </div>

      {/* 1. SALES FUNNEL SECTION (DỮ LIỆU THẬT) */}
      <div className="bg-white p-6 rounded shadow-sm mb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Phễu Chuyển Đổi Bán Hàng</h3>
            {loading && <span className="text-xs text-orange-500 animate-pulse italic">Đang cập nhật dữ liệu mới nhất...</span>}
          </div>
         
         <div className="flex gap-8 items-stretch min-h-[320px]">
            {/* LEFT: Stats Text */}
            <div className="flex-1 grid grid-cols-2 gap-y-10 gap-x-12 pt-4">
               <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">Lượt truy cập <HelpCircle size={12}/></p>
                  <p className="text-3xl font-black text-gray-800">{stats.visits.toLocaleString()}</p>
                  <p className="text-xs text-green-500 mt-1">Dựa trên dữ liệu shop_visits</p>
               </div>
               
               <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">Người mua <HelpCircle size={12}/></p>
                  <p className="text-3xl font-black text-gray-800">{stats.buyers.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Khách hàng đã đặt đơn</p>
               </div>

               <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">Doanh số <HelpCircle size={12}/></p>
                  <p className="text-3xl font-black text-[#ee4d2d]">{formatCurrency(stats.salesAmount)}</p>
                  <p className="text-xs text-gray-400 mt-1">Doanh thu tạm tính hôm nay</p>
               </div>

               <div>
                   <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">Doanh số / Người mua <HelpCircle size={12}/></p>
                   <p className="text-3xl font-black text-gray-800">{formatCurrency(salesPerBuyer)}</p>
                   <p className="text-xs text-gray-400 mt-1">Giá trị trung bình/khách</p>
               </div>
            </div>

            {/* RIGHT: Visual Funnel (Đổ số vào hình phễu) */}
            <div className="w-[450px] flex flex-col justify-between relative py-2 pr-40">
                {/* Step 1: Visit */}
                <div className="bg-blue-600 text-white p-4 text-center relative h-[80px] flex flex-col justify-center items-center rounded-sm mx-0 shadow-lg">
                    <p className="text-[10px] uppercase opacity-90 font-bold">1. Lượt truy cập</p>
                    <p className="font-black text-xl">{stats.visits.toLocaleString()}</p>
                </div>
                
                {/* Connector 1: Visit -> Placed */}
                <div className="absolute top-[22%] right-[-10px] w-[160px] text-xs text-gray-600 flex flex-col items-start pl-3 border-l-2 border-dashed border-blue-300 h-20 justify-center">
                    <p className="leading-tight">Tỷ lệ chuyển đổi <br/><span className="text-gray-400">(Truy cập → Đặt đơn)</span></p>
                    <p className="font-black text-blue-600 text-xl">{conversionVisitToPlaced}%</p>
                </div>

                {/* Step 2: Placed */}
                <div className="bg-blue-400 text-white p-4 text-center relative h-[80px] flex flex-col justify-center items-center rounded-sm mx-8 shadow-md">
                    <p className="text-[10px] uppercase opacity-90 font-bold">2. Đơn hàng đã đặt</p>
                    <p className="font-black text-xl">{stats.ordersPlaced.toLocaleString()}</p>
                </div>

                 {/* Connector 2: Placed -> Paid */}
                 <div className="absolute top-[58%] right-[-10px] w-[160px] text-xs text-gray-600 flex flex-col items-start pl-3 border-l-2 border-dashed border-orange-300 h-20 justify-center">
                    <p className="leading-tight">Tỷ lệ chuyển đổi <br/><span className="text-gray-400">(Đặt đơn → Xác nhận)</span></p>
                    <p className="font-black text-orange-600 text-xl">{conversionPlacedToPaid}%</p>
                </div>

                {/* Step 3: Paid */}
                <div className="bg-[#ee4d2d] text-white p-4 text-center relative h-[80px] flex flex-col justify-center items-center rounded-sm mx-16 shadow-md">
                    <p className="text-[10px] uppercase opacity-90 font-bold">3. Đơn đã xác nhận</p>
                    <p className="font-black text-xl">{stats.ordersPaid.toLocaleString()}</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SalesOverview;