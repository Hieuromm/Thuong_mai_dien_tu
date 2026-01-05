import React, { useState, useEffect } from 'react';
import { 
    FaSearch, FaSpinner, FaCalendarAlt, FaSync, FaShoppingBag, FaUser, FaStore 
} from 'react-icons/fa';
import { getAdminOrders } from '../../services/admin/adminService';

const AdminOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch dữ liệu
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAdminOrders(dateRange);
            setOrders(data);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [dateRange]);

    // Filter tìm kiếm Client-side
    const filteredOrders = orders.filter(o => 
        o.id.toString().includes(searchTerm) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper: Badge trạng thái
    const renderStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
            SHIPPING: 'bg-purple-100 text-purple-700 border-purple-200',
            COMPLETED: 'bg-green-100 text-green-700 border-green-200',
            CANCELLED: 'bg-red-100 text-red-700 border-red-200'
        };
        const label = {
            PENDING: 'Chờ xác nhận',
            PROCESSING: 'Đang xử lý',
            SHIPPING: 'Đang giao',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy'
        };
        return (
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
                {label[status] || status}
            </span>
        );
    };

    // Range Options
    const rangeOptions = [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
    ];

    if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-[#ee4d2d]"/></div>;

    return (
        <div className="space-y-6">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b254b]">Quản Lý Đơn Hàng</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng số đơn: <span className="font-bold text-[#ee4d2d]">{orders.length}</span>
                        {dateRange !== 'all' && <span className="text-gray-400 font-normal ml-1">({rangeOptions.find(o => o.value === dateRange)?.label})</span>}
                    </p>
                </div>

                {/* Filter Date */}
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
                    <button onClick={fetchOrders} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#ee4d2d] transition-all border-l border-gray-200">
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm ID đơn, tên khách, tên shop..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ee4d2d]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4 border-b">Mã đơn</th>
                                <th className="p-4 border-b">Khách hàng</th>
                                <th className="p-4 border-b">Cửa hàng (Shop)</th>
                                <th className="p-4 border-b text-right">Tổng tiền</th>
                                <th className="p-4 border-b text-center">Trạng thái</th>
                                <th className="p-4 border-b text-right">Ngày đặt</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 font-mono text-[#ee4d2d] font-bold">#{order.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-gray-300"/> 
                                                <span className="font-medium text-gray-700">{order.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <FaStore className="text-blue-400"/>
                                                <span className="text-gray-600">{order.shopName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-[#1b254b]">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {renderStatusBadge(order.status)}
                                        </td>
                                        <td className="p-4 text-right text-gray-500 text-xs">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : '--'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-500">
                                        Không tìm thấy đơn hàng nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderManager;