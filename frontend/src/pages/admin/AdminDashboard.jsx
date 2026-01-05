import React from 'react';
import { 
    FaUsers, 
    FaStore, 
    FaShoppingBag, 
    FaMoneyBillWave, 
    FaArrowUp, 
    FaCircle, 
    FaSync,
    FaCalendarAlt 
} from 'react-icons/fa';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard';

const AdminDashboard = () => {
    // 1. Lấy dữ liệu và các hàm điều khiển từ Hook
    const { 
        stats, 
        loading, 
        error, 
        calculatePercent, 
        refresh, 
        dateRange, 
        setDateRange 
    } = useAdminDashboard();

    // 2. Danh sách tùy chọn thời gian
    const rangeOptions = [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
        { value: 'last_month', label: 'Tháng trước' },
    ];

    // Helper: Lấy nhãn hiển thị cho bộ lọc hiện tại
    const currentLabel = rangeOptions.find(o => o.value === dateRange)?.label.toLowerCase();

    // --- RENDER LOADING ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee4d2d]"></div>
            <p className="mt-4 text-gray-500 font-medium">Đang tổng hợp dữ liệu {currentLabel}...</p>
        </div>
    );

    // --- RENDER ERROR ---
    if (error) return (
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 flex flex-col items-center mt-10">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button 
                onClick={refresh}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-all"
            >
                <FaSync /> Thử lại
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-10">
            
            {/* --- HEADER & FILTER --- */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1b254b]">Tổng quan Hệ thống</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Hiển thị số liệu thống kê: <span className="font-bold text-[#ee4d2d] capitalize">{currentLabel}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                    {/* Icon Calendar */}
                    <div className="pl-3 text-gray-400">
                        <FaCalendarAlt />
                    </div>

                    {/* Dropdown Select */}
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-transparent text-sm font-semibold text-gray-700 py-2 pr-8 outline-none cursor-pointer hover:text-[#ee4d2d] transition-colors appearance-none min-w-[140px]"
                    >
                        {rangeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Refresh Button */}
                    <button 
                        onClick={refresh}
                        className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#ee4d2d] hover:bg-orange-50 transition-all border-l border-gray-200"
                        title="Làm mới dữ liệu"
                    >
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* --- 4 THẺ CHỈ SỐ (STATS CARDS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. NGƯỜI DÙNG */}
                <StatCard 
                    title={dateRange === 'all' ? "Tổng Người dùng" : "Người dùng mới"}
                    value={stats?.totalUsers || 0} 
                    icon={<FaUsers className="text-blue-600" />} 
                    bgColor="bg-blue-100"
                    subText={`Tài khoản tạo ${currentLabel}`}
                    isCurrency={false}
                />

                {/* 2. CỬA HÀNG */}
                <StatCard 
                    title={dateRange === 'all' ? "Tổng Cửa hàng" : "Cửa hàng mới"}
                    value={stats?.totalShops || 0} 
                    icon={<FaStore className="text-purple-600" />} 
                    bgColor="bg-purple-100"
                    subText={`Shop đăng ký ${currentLabel}`}
                    isCurrency={false}
                />

                {/* 3. ĐƠN HÀNG */}
                <StatCard 
                    title="Đơn hàng" 
                    value={stats?.totalOrders || 0} 
                    icon={<FaShoppingBag className="text-orange-600" />} 
                    bgColor="bg-orange-100"
                    subText={`Đơn phát sinh ${currentLabel}`}
                    isCurrency={false}
                />

                {/* 4. DOANH THU */}
                <StatCard 
                    title="Doanh thu" 
                    value={stats?.totalRevenue || 0} 
                    icon={<FaMoneyBillWave className="text-green-600" />} 
                    bgColor="bg-green-100"
                    subText={`Tổng tiền ${currentLabel}`}
                    isCurrency={true} // Bật chế độ format tiền tệ
                />
            </div>

            {/* --- PHÂN BỔ & THÔNG TIN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cột Trái: Phân bổ Vai trò */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                    <h3 className="font-bold text-[#1b254b] mb-6 flex items-center gap-2">
                        <FaCircle className="text-[8px] text-[#ee4d2d]" /> 
                        {dateRange === 'all' ? "Cơ cấu Tài khoản" : "Tài khoản mới theo Vai trò"}
                    </h3>
                    
                    <div className="space-y-8">
                        <ProgressItem 
                            label="Người mua (Buyer)" 
                            count={stats?.userDistribution?.BUYER || 0}
                            percentage={calculatePercent(stats?.userDistribution?.BUYER)} 
                            color="bg-blue-500" 
                        />
                        <ProgressItem 
                            label="Người bán (Seller)" 
                            count={stats?.userDistribution?.SELLER || 0}
                            percentage={calculatePercent(stats?.userDistribution?.SELLER)} 
                            color="bg-[#ee4d2d]" 
                        />
                        <ProgressItem 
                            label="Quản trị viên (Admin)" 
                            count={stats?.userDistribution?.ADMIN || 0}
                            percentage={calculatePercent(stats?.userDistribution?.ADMIN)} 
                            color="bg-purple-500" 
                        />
                    </div>
                </div>

                {/* Cột Phải: Thông tin hệ thống (Chiếm 2 phần) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-[#1b254b] mb-6">Trạng thái Vận hành</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoBox 
                                title="Quy mô sàn"
                                text={`Hệ thống đang quản lý tổng cộng ${new Intl.NumberFormat('vi-VN').format(stats?.totalUsers || 0)} người dùng và ${new Intl.NumberFormat('vi-VN').format(stats?.totalShops || 0)} cửa hàng.`}
                            />
                            <InfoBox 
                                title="Hiệu suất kinh doanh"
                                text={`Trong khoảng thời gian này, sàn đã ghi nhận ${new Intl.NumberFormat('vi-VN').format(stats?.totalOrders || 0)} đơn hàng, tạo ra dòng tiền ${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} đ.`}
                            />
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                        <FaSync className="mt-1 shrink-0" />
                        <div>
                            <span className="font-bold">Lưu ý quản trị:</span> Số liệu doanh thu được tính dựa trên các đơn hàng có trạng thái <span className="font-mono font-bold bg-white px-1 rounded">COMPLETED</span>. Các đơn hàng hủy hoặc đang xử lý chưa được tính vào báo cáo tài chính này.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon, bgColor, subText, isCurrency }) => {
    // Format giá trị
    const displayValue = isCurrency 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        : new Intl.NumberFormat('vi-VN').format(value);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300 group">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-[#1b254b] mb-1 group-hover:text-[#ee4d2d] transition-colors">
                    {displayValue}
                </h3>
                <p className="text-[10px] text-gray-400 italic">{subText}</p>
            </div>
            <div className={`p-4 ${bgColor} rounded-2xl text-xl group-hover:scale-110 transition-transform shadow-sm`}>
                {icon}
            </div>
        </div>
    );
};

const ProgressItem = ({ label, count, percentage, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">{label}</span>
            <span className="text-[#1b254b] font-bold">{count} <span className="text-xs text-gray-400 font-normal">({percentage}%)</span></span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div 
                className={`h-full ${color} transition-all duration-1000 ease-out rounded-full shadow-sm`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

const InfoBox = ({ title, text }) => (
    <div className="p-5 bg-gray-50 rounded-xl border border-dashed border-gray-200 hover:border-gray-300 transition-colors">
        <h4 className="font-bold text-[#1b254b] text-sm mb-2">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
            {text}
        </p>
    </div>
);

export default AdminDashboard;