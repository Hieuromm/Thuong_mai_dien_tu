import React, { useEffect, useState } from 'react';
import { getAdminShops, approveShopApi, rejectShopApi } from '../../services/admin/adminService';
import { 
    FaCheck, 
    FaTimes, 
    FaStore, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaSync, 
    FaCalendarAlt // Import thêm icon lịch
} from 'react-icons/fa';

const AdminShopManager = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE BỘ LỌC NGÀY ---
    const [dateRange, setDateRange] = useState('all');

    const loadShops = async () => {
        try {
            setLoading(true);
            // Truyền dateRange vào API
            const data = await getAdminShops(dateRange);
            setShops(data);
        } catch (err) {
            console.error("Lỗi gọi API:", err);
        } finally {
            setLoading(false);
        }
    };

    // Khi dateRange thay đổi -> Gọi lại API
    useEffect(() => { 
        loadShops(); 
    }, [dateRange]);

    // Hàm xử lý Duyệt
    const handleApprove = async (id) => {
        if (window.confirm("Phê duyệt cửa hàng này?")) {
            await approveShopApi(id);
            loadShops();
        }
    };

    // Hàm xử lý Từ chối
    const handleReject = async (id) => {
        if (window.confirm("Từ chối yêu cầu này?")) {
            await rejectShopApi(id);
            loadShops();
        }
    };

    // Danh sách tùy chọn thời gian
    const rangeOptions = [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Đăng ký Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ee4d2d]"></div>
            <span className="ml-3 text-gray-500 font-medium">Đang tải danh sách Shop...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            
            {/* HEADER & FILTER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b254b]">Quản lý Cửa hàng</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng số: <span className="font-bold text-[#ee4d2d]">{shops.length}</span> cửa hàng
                        {dateRange !== 'all' && <span className="text-gray-400 font-normal ml-1">({rangeOptions.find(o => o.value === dateRange)?.label})</span>}
                    </p>
                </div>

                {/* Dropdown Chọn Ngày */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                    <div className="pl-3 text-gray-400"><FaCalendarAlt /></div>
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-transparent text-sm font-semibold text-gray-700 py-2 pr-8 outline-none cursor-pointer hover:text-[#ee4d2d] transition-colors appearance-none min-w-[160px]"
                    >
                        {rangeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button 
                        onClick={loadShops} 
                        className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#ee4d2d] hover:bg-orange-50 transition-all border-l border-gray-200"
                        title="Làm mới dữ liệu"
                    >
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest">
                        <tr>
                            <th className="p-4 font-bold">Cửa hàng</th>
                            <th className="p-4 font-bold">Liên hệ</th>
                            <th className="p-4 font-bold">Trạng thái</th>
                            <th className="p-4 font-bold">Ngày tạo</th> {/* Thêm cột ngày tạo */}
                            <th className="p-4 font-bold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {shops.length > 0 ? (
                            shops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                {shop.logoUrl ? (
                                                    <img src={shop.logoUrl} alt="logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <FaStore className="text-gray-300 text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 uppercase text-xs md:text-sm">{shop.name || "Chưa đặt tên"}</div>
                                                <div className="text-[10px] text-gray-400">ID: #{shop.id}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaPhone className="text-[10px]" />
                                            <span>{shop.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                                            <FaMapMarkerAlt className="text-[10px]" />
                                            <span className="truncate max-w-[150px]">{shop.address || "N/A"}</span>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            shop.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 
                                            shop.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {shop.status === 'ACTIVE' ? 'Hoạt động' : 
                                             shop.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-500 text-xs">
                                        {shop.createdAt 
                                            ? new Date(shop.createdAt).toLocaleDateString('vi-VN') 
                                            : '--'}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            {shop.status === 'PENDING' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleApprove(shop.id)} 
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all tooltip-container group relative"
                                                    >
                                                        <FaCheck size={14} />
                                                        <span className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Duyệt</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(shop.id)} 
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all tooltip-container group relative"
                                                    >
                                                        <FaTimes size={14} />
                                                        <span className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Từ chối</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-gray-300 italic font-medium tracking-tight border border-gray-100 px-2 py-1 rounded">Đã xử lý</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-500">
                                    Không tìm thấy cửa hàng nào trong khoảng thời gian này.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminShopManager;