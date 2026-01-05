import React, { useState, useEffect } from 'react';
import { FaAngleRight, FaQuestionCircle } from 'react-icons/fa';
// Import hook analytics để lấy dữ liệu real-time (Doanh số, Truy cập)
import { useAnalytics } from "../../hooks/seller/analytics/useAnalytics";
// Import service để lấy thống kê danh sách cần làm
import { getTodoStatistics } from "../../services/analyticsService";

const SellerDashboard = () => {
    // 1. Lấy dữ liệu bán hàng (Doanh số, Lượt truy cập) từ Hook
    const { data, loading: analyticsLoading } = useAnalytics();

    // 2. Quản lý trạng thái cho "Danh sách cần làm" (Dữ liệu thật từ bảng orders)
    const [todoData, setTodoData] = useState({
        pendingCount: 0,   
        readyToShipCount: 0,
        shippingCount: 0,   
        cancelledCount: 0,  
        completedCount: 0   
    });
    const [todoLoading, setTodoLoading] = useState(true);

    // 3. Fetch dữ liệu thống kê đơn hàng khi component mount
    useEffect(() => {
        const fetchTodoData = async () => {
            try {
                const response = await getTodoStatistics();
                if (response && response.data) {
                    setTodoData(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thống kê công việc:", error);
            } finally {
                setTodoLoading(false);
            }
        };
        fetchTodoData();
    }, []);

    // Helper: Định dạng tiền tệ
    const formatCurrency = (val) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

    // Helper: Định dạng số
    const formatNumber = (val) => 
        new Intl.NumberFormat('vi-VN').format(val || 0);

    // Tính toán tỷ lệ chuyển đổi từ dữ liệu real-time
    const conversionRate = data.realTime?.visits > 0 
        ? ((data.realTime?.ordersCount / data.realTime?.visits) * 100).toFixed(2) 
        : "0.00";

    return (
        <div className="p-6 bg-[#f5f5f5] min-h-screen font-sans text-gray-800">
            
            {/* 1. DANH SÁCH CẦN LÀM (DỮ LIỆU THỰC TỪ ORDER TABLE) */}
            <div className="bg-white rounded-sm shadow-sm p-5 mb-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">Danh sách cần làm</h3>
                        <p className="text-xs text-gray-500 mt-1">Những việc bạn cần xử lý ngay</p>
                    </div>
                </div>
                
                {todoLoading ? (
                    <div className="py-4 text-center text-gray-400 animate-pulse italic">Đang cập nhật trạng thái đơn hàng...</div>
                ) : (
                    <div className="grid grid-cols-5 gap-4 text-center"> {/* Đổi grid-cols-4 thành grid-cols-5 */}
                        <TodoItem count={todoData.pendingCount} label="Đơn chờ xác nhận" color="text-blue-600" />
                        <TodoItem count={todoData.readyToShipCount} label="Chờ lấy hàng" color="text-orange-500" /> 
                        <TodoItem count={todoData.shippingCount} label="Đang giao hàng" color="text-blue-600" />
                        <TodoItem count={todoData.cancelledCount} label="Đơn Hủy" color="text-red-500" />
                        <TodoItem count={todoData.completedCount} label="Đơn hoàn thành" color="text-green-600" />
                    </div>
                )}
            </div>

            {/* 2. PHÂN TÍCH BÁN HÀNG (DỮ LIỆU THỰC TỪ ANALYTICS) */}
            <div className="bg-white rounded-sm shadow-sm p-5 mb-4">
                 <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800 text-lg">Phân Tích Bán Hàng</h3>
                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Hôm nay</span>
                    </div>
                    <a href="/seller/analytics" className="text-blue-500 text-sm font-medium flex items-center gap-1 hover:underline">
                        Phân tích chi tiết <FaAngleRight />
                    </a>
                </div>

                {analyticsLoading ? (
                    <div className="py-10 text-center text-gray-400 animate-pulse">Đang tính toán doanh số...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatsItem 
                            label="Doanh số" 
                            value={formatCurrency(data.realTime?.salesToday)} 
                            percent="+0.00%" 
                        />
                        <StatsItem 
                            label="Lượt truy cập" 
                            value={formatNumber(data.realTime?.visits)} 
                            percent="+0.00%" 
                        />
                        <StatsItem 
                            label="Đơn hàng" 
                            value={formatNumber(data.realTime?.ordersCount)} 
                            percent="+0.00%" 
                        />
                        <StatsItem 
                            label="Tỷ lệ chuyển đổi" 
                            value={`${conversionRate}%`} 
                            percent="-0.00%" 
                        />
                    </div>
                )}
            </div>

            {/* 3. LAYOUT CHIA CỘT TIẾP THỊ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* CỘT TRÁI (Marketing) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-5 rounded-sm shadow-sm border-l-4 border-blue-500">
                         <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                                Tăng trưởng doanh thu <FaQuestionCircle className="text-gray-300 text-sm"/>
                            </h3>
                            <a href="#" className="text-blue-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-1">Xem thêm <FaAngleRight /></a>
                         </div>
                         <div className="bg-blue-50/50 p-5 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="font-bold text-blue-900 mb-1">Cơ hội bán hàng dựa trên truy cập!</div>
                                <p className="text-sm text-blue-700/80">Với <b>{formatNumber(data.realTime?.visits)}</b> lượt xem hôm nay, bạn có thể tăng gấp đôi doanh số nhờ quảng cáo.</p>
                            </div>
                            <button className="bg-[#ee4d2d] text-white px-6 py-2 text-sm font-bold rounded shadow-sm hover:opacity-90 transition-opacity">Chạy ngay</button>
                         </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm shadow-sm">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-sm">Tiếp thị KOL/KOC</h3>
                            <a href="#" className="text-blue-500 text-xs font-bold uppercase tracking-tighter">Tham gia <FaAngleRight className="inline ml-1"/></a>
                        </div>
                        <div className="bg-orange-50/50 p-6 rounded-lg text-center text-sm text-orange-800 border border-orange-100/50 italic">
                            "Mạng lưới KOL sẽ giúp bạn cải thiện tỷ lệ chốt đơn <b>{conversionRate}%</b> hiện tại!"
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (Hiệu quả & News) */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-sm shadow-sm">
                        <div className="flex justify-between mb-4 border-b border-gray-50 pb-2">
                            <h3 className="font-bold text-gray-800 text-sm">Hiệu quả vận hành</h3>
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Tuyệt vời</span>
                        </div>
                        <div className="py-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Đơn hàng mới</span>
                                <span className="font-bold">{data.realTime?.ordersCount}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[100%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-sm shadow-sm overflow-hidden relative group">
                        <div className="flex justify-between mb-4 relative z-10">
                            <h3 className="font-bold text-gray-800 text-sm">Tin Nổi Bật</h3>
                            <FaAngleRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-xl p-6 relative overflow-hidden h-40 flex flex-col justify-end">
                            <p className="font-black text-2xl uppercase leading-tight tracking-tighter z-10">SIÊU SALE<br/>MÙA LỄ HỘI</p>
                            <p className="text-[10px] font-bold opacity-80 mt-2 z-10 italic">Bùng nổ doanh số tháng 12</p>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute right-2 bottom-2 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component cho Danh sách cần làm (To-do)
const TodoItem = ({ count, label, color }) => (
    <div className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all border border-transparent hover:border-gray-100 group">
        <div className={`text-3xl font-black ${color} mb-2 group-hover:scale-110 transition-transform`}>{count}</div>
        <div className="text-[13px] font-medium text-gray-500 group-hover:text-gray-800">{label}</div>
    </div>
);

// Sub-component cho Phân tích bán hàng (Stats)
const StatsItem = ({ label, value, percent }) => (
    <div className="flex flex-col">
        <div className="flex items-center gap-1 mb-2">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
             <FaQuestionCircle className="text-gray-200 text-[10px] cursor-help hover:text-gray-400"/>
        </div>
        <div className="text-2xl font-black text-gray-800 mb-1 tracking-tighter">{value}</div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            vs hôm qua <span className={percent.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{percent}</span>
        </div>
    </div>
);

export default SellerDashboard;