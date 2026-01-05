// src/pages/seller/TrafficAnalytics.jsx
import React from 'react';
import { Calendar, Download, HelpCircle, Eye, Users } from 'lucide-react';
import { TRAFFIC_OVERVIEW, TRAFFIC_METRICS } from '../../../data/mockTrafficData';
import { useTrafficData } from '../../../hooks/seller/analytics/useTrafficData';

const TrafficAnalytics = () => {
  const {
    sourceFilter,
    setSourceFilter,
    selectedMetrics,
    toggleMetric,
    getPathForMetric,
    getMetricColor,
    chartData
  } = useTrafficData();

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans text-gray-800">
      
      {/* 1. HEADER & DATE PICKER */}
      <div className="bg-white rounded-t shadow-sm px-6 py-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-6 items-center">
             <h2 className="text-lg font-medium text-gray-800 border-b-2 border-orange-500 pb-4 -mb-4">Tổng quan về lượt truy cập</h2>

          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-1.5 rounded text-sm hover:bg-gray-50 text-gray-600">
             <Download size={14}/> Tải dữ liệu
          </button>
        </div>
        
        {/* Date Row */}
        <div className="mt-6 flex items-center gap-2">
           <span className="text-sm text-gray-500">Khung Thời Gian</span>
           <div className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded text-sm bg-white cursor-pointer">
              <span>Hôm qua 10-12-2025 (GMT+7)</span>
              <Calendar size={14} className="text-gray-400"/>
           </div>
        </div>
      </div>

      {/* BANNER PROMO (Giống ảnh) */}
      <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded p-4 mb-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
            <div className="bg-teal-500 text-white p-2 rounded-full"><Users size={20}/></div>
            <span className="text-sm text-teal-800 font-medium">Tận Hưởng Dịch Vụ Chương Trình "Hỗ Trợ Kinh Phí Hiệu Suất Khi Sử Dụng Chế Độ Tối Đa Doanh Thu Tùy Chỉnh ROAS"</span>
         </div>
         <button className="bg-teal-500 text-white text-xs px-4 py-2 rounded hover:bg-teal-600 font-medium">Xem Chi Tiết &gt;</button>
      </div>

      {/* 2. OVERVIEW TABLE SECTION */}
      <div className="bg-white p-6 rounded shadow-sm mb-4">
         <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">Tổng Quan</h3>
            <p className="text-xs text-gray-500 mt-1">Phân tích lượng truy cập trang chi tiết sản phẩm và trang chủ của Shop trên ứng dụng Shopee và trên máy tính.</p>
         </div>

         {/* Custom Table */}
         <div className="border border-gray-200 rounded overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-blue-500 text-white text-sm font-medium py-3 text-center">
               <div className="col-span-3"></div>
               <div className="col-span-3">Tất cả</div>
               <div className="col-span-3">Ứng dụng</div>
               <div className="col-span-3">Máy tính</div>
            </div>

            {/* Loop through Groups (Views & Visitors) */}
            {[TRAFFIC_OVERVIEW.views, TRAFFIC_OVERVIEW.visitors].map((group, gIdx) => (
               <div key={gIdx} className="border-b border-gray-200 last:border-b-0">
                  <div className="grid grid-cols-12 min-h-[160px]"> {/* Fixed min-height for visuals */}
                     
                     {/* Cột trái: Tên Nhóm (Lượt Xem / Khách Truy Cập) */}
                     <div className={`col-span-2 ${group.color} text-white flex flex-col items-center justify-center p-4 text-center`}>
                        {gIdx === 0 ? <Eye size={24} className="mb-2"/> : <Users size={24} className="mb-2"/>}
                        <span className="font-medium text-sm">{group.label}</span>
                     </div>

                     {/* Cột dữ liệu */}
                     <div className="col-span-10 grid grid-rows-4 divide-y divide-gray-100">
                        {group.items.map((item) => (
                           <div key={item.id} className="grid grid-cols-10 items-center text-sm hover:bg-gray-50">
                              <div className="col-span-2 pl-4 py-3 font-medium text-gray-600 flex items-center gap-1">
                                 {item.label} <HelpCircle size={12} className="text-gray-300"/>
                              </div>
                              {/* All */}
                              <div className="col-span-3 text-center border-l border-gray-100 py-3">
                                 <span className="font-bold text-gray-800 mr-2">{item.all}</span>
                                 <span className="text-xs text-gray-400">{item.growth}%</span>
                              </div>
                              {/* App */}
                              <div className="col-span-3 text-center border-l border-gray-100 py-3">
                                 <span className="text-gray-800 mr-2">{item.app}</span>
                                 <span className="text-xs text-gray-400">{item.growth}%</span>
                              </div>
                              {/* PC */}
                              <div className="col-span-2 text-center border-l border-gray-100 py-3">
                                 <span className="text-gray-800 mr-2">{item.pc}</span>
                                 <span className="text-xs text-gray-400">{item.growth}%</span>
                              </div>
                           </div>
                        ))}
                     </div>

                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. TREND CHART SECTION */}
      <div className="bg-white p-6 rounded shadow-sm">
         <h3 className="text-lg font-medium text-gray-800 mb-6">Xu hướng số liệu</h3>

         {/* Source Filters (Radio) */}
         <div className="flex items-center gap-8 mb-6 border-b border-gray-100 pb-6">
            <span className="text-sm text-gray-500 w-24">Nguồn:</span>
            {['Tất cả', 'Ứng dụng', 'Máy tính'].map((src, idx) => (
               <label key={src} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="source" 
                    checked={(idx === 0 && sourceFilter === 'ALL') || (idx === 1 && sourceFilter === 'APP') || (idx === 2 && sourceFilter === 'PC')}
                    onChange={() => setSourceFilter(idx === 0 ? 'ALL' : idx === 1 ? 'APP' : 'PC')}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className={sourceFilter === (idx === 0 ? 'ALL' : idx === 1 ? 'APP' : 'PC') ? 'text-gray-800 font-medium' : 'text-gray-600'}>
                    {src}
                  </span>
               </label>
            ))}
         </div>

         {/* Metrics Checkboxes */}
         <div className="space-y-4 mb-8">
            {/* Row 1: Views Metrics */}
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-500 w-24">Lượt Xem:</span>
               <div className="flex gap-6 flex-wrap">
                  {TRAFFIC_METRICS.filter(m => m.group === 'view').map((m) => (
                     <label key={m.id} className="flex items-center gap-2 cursor-pointer text-sm select-none">
                        <input 
                           type="checkbox" 
                           checked={selectedMetrics.includes(m.id)}
                           onChange={() => toggleMetric(m.id)}
                           className="rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="text-gray-700">{m.label}</span>
                        <HelpCircle size={12} className="text-gray-300"/>
                     </label>
                  ))}
               </div>
            </div>

            {/* Row 2: Visitor Metrics */}
            <div className="flex items-center gap-4">
               <span className="text-sm text-gray-500 w-24">Khách Truy Cập:</span>
               <div className="flex gap-6 flex-wrap">
                  {TRAFFIC_METRICS.filter(m => m.group === 'visitor').map((m) => (
                     <label key={m.id} className="flex items-center gap-2 cursor-pointer text-sm select-none">
                        <input 
                           type="checkbox" 
                           checked={selectedMetrics.includes(m.id)}
                           onChange={() => toggleMetric(m.id)}
                           className="rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="text-gray-700">{m.label}</span>
                        <HelpCircle size={12} className="text-gray-300"/>
                     </label>
                  ))}
               </div>
            </div>
         </div>

         {/* SVG Chart */}
         <div className="h-[300px] w-full relative border-l border-b border-gray-200">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
               {[1, 2, 3, 4, 5].map(i => <div key={i} className="border-b border-dashed border-gray-100 w-full h-0"></div>)}
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 300" preserveAspectRatio="none">
               {selectedMetrics.map((metricId) => (
                  <path
                     key={metricId}
                     d={getPathForMetric(metricId)}
                     fill="none"
                     stroke={getMetricColor(metricId)}
                     strokeWidth="3"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     vectorEffect="non-scaling-stroke"
                     className="transition-all duration-300"
                  />
               ))}
            </svg>

            {/* X Axis Labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
               {chartData.map((d, i) => (
                  <span key={i}>{d.time}</span>
               ))}
            </div>

            {/* Legend (Bottom) */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-6">
               {selectedMetrics.map((metricId) => {
                  const metricConfig = TRAFFIC_METRICS.find(m => m.id === metricId);
                  return (
                     <div key={metricId} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getMetricColor(metricId) }}></div>
                        <span className="text-gray-600">{metricConfig?.label}</span>
                     </div>
                  )
               })}
            </div>
         </div>
         
         {/* Footer Hint */}
         <div className="mt-16 text-center text-xs text-gray-400">
            Shop chưa có dữ liệu? Hãy thử <span className="text-blue-500 hover:underline cursor-pointer">Tối ưu sản phẩm</span> hoặc sử dụng <span className="text-blue-500 hover:underline cursor-pointer">Công cụ Marketing</span>.
         </div>

      </div>

    </div>
  );
};

export default TrafficAnalytics;