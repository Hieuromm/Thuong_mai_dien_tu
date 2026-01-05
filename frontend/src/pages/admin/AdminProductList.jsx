import React, { useState, useEffect } from 'react';
import { 
    FaSearch, FaTrash, FaCheck, FaTimes, FaBoxOpen, FaStore, FaSpinner, 
    FaCalendarAlt, FaSync // Import thêm icon
} from 'react-icons/fa';
import { 
    getAdminProducts, 
    updateProductStatusAPI, 
    deleteProductAPI 
} from '../../services/admin/adminService';

const AdminProductList = () => {
    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter
    const [activeTab, setActiveTab] = useState('ALL'); // Mặc định hiển thị tất cả (để thấy hiệu quả lọc ngày)
    const [dateRange, setDateRange] = useState('all'); // <--- State lọc ngày
    const [searchTerm, setSearchTerm] = useState('');

    // --- 1. FETCH DATA ---
    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Truyền dateRange vào API
            const data = await getAdminProducts(dateRange);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
            // alert("Không thể tải danh sách sản phẩm."); // Có thể comment lại để đỡ phiền nếu reload nhiều
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API khi dateRange thay đổi
    useEffect(() => {
        fetchProducts();
    }, [dateRange]);

    // --- 2. XỬ LÝ DUYỆT / TỪ CHỐI ---
    const handleStatusChange = async (id, newStatus) => {
        const actionName = newStatus === 'ACTIVE' ? 'DUYỆT' : 'TỪ CHỐI';
        if (window.confirm(`Bạn có chắc muốn ${actionName} sản phẩm này?`)) {
            try {
                await updateProductStatusAPI(id, newStatus);
                // Cập nhật state local ngay lập tức
                setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
            } catch (error) {
                const msg = error.response?.data?.error || "Có lỗi xảy ra.";
                alert(msg);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Cảnh báo: Xóa vĩnh viễn sản phẩm này?")) {
            try {
                await deleteProductAPI(id);
                setProducts(prev => prev.filter(p => p.id !== id));
            } catch (error) {
                alert("Lỗi khi xóa.");
            }
        }
    };

    // --- 3. FILTER LOGIC (Client-side) ---
    const filteredProducts = products.filter(p => {
        // Lọc theo Tab (PENDING / ALL)
        const matchTab = activeTab === 'ALL' || p.status === activeTab;
        
        // Lọc theo Search (Tên SP hoặc Tên Shop)
        const searchLower = searchTerm.toLowerCase();
        const pName = p.name ? p.name.toLowerCase() : '';
        const sName = p.shopName ? p.shopName.toLowerCase() : '';
        
        const matchSearch = pName.includes(searchLower) || sName.includes(searchLower);

        return matchTab && matchSearch;
    });

    // Helper: Badge trạng thái
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">Chờ duyệt</span>;
            case 'ACTIVE': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">Đang bán</span>;
            case 'REJECTED': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200">Đã từ chối</span>;
            default: return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{status}</span>;
        }
    };

    // Options cho Dropdown ngày
    const rangeOptions = [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Đăng hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
    ];

    if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-[#ee4d2d]"/></div>;

    return (
        <div className="space-y-6">
            
            {/* Header & Filter Date */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b254b]">Quản Lý Sản Phẩm</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng cộng: <span className="font-bold text-[#ee4d2d]">{products.length}</span> sản phẩm
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
                        onClick={fetchProducts} 
                        className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#ee4d2d] hover:bg-orange-50 transition-all border-l border-gray-200"
                        title="Làm mới dữ liệu"
                    >
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Toolbar: Tabs & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* TABS */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap
                            ${activeTab === 'ALL' ? 'bg-white text-[#1b254b] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Tất cả
                    </button>
                    <button 
                        onClick={() => setActiveTab('PENDING')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap
                            ${activeTab === 'PENDING' ? 'bg-white text-[#ee4d2d] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Chờ duyệt 
                        {products.filter(p => p.status === 'PENDING').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {products.filter(p => p.status === 'PENDING').length}
                            </span>
                        )}
                    </button>
                </div>

                {/* SEARCH */}
                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm tên sản phẩm, tên shop..." 
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
                                <th className="p-4 border-b">Sản phẩm</th>
                                <th className="p-4 border-b">Giá & Kho</th>
                                <th className="p-4 border-b">Shop bán</th>
                                <th className="p-4 border-b">Trạng thái</th>
                                <th className="p-4 border-b">Ngày đăng</th> {/* Cột Mới */}
                                <th className="p-4 border-b text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                        {/* Ảnh & Tên */}
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <img 
                                                    src={p.imageUrl || "https://via.placeholder.com/150"} 
                                                    alt={p.name} 
                                                    className="w-16 h-16 rounded object-cover border border-gray-200 bg-gray-50"
                                                />
                                                <div>
                                                    <div className="font-bold text-[#1b254b] line-clamp-2 w-48" title={p.name}>
                                                        {p.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">ID: #{p.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Giá & Kho */}
                                        <td className="p-4">
                                            <div className="font-bold text-[#ee4d2d]">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price || 0)}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <FaBoxOpen className="text-gray-400"/> Kho: {p.stock || 0}
                                            </div>
                                        </td>

                                        {/* Shop */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <FaStore className="text-blue-500"/> 
                                                <span className="truncate max-w-[120px]" title={p.shopName}>
                                                    {p.shopName || "Unknown"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Trạng thái */}
                                        <td className="p-4">
                                            {renderStatusBadge(p.status)}
                                        </td>

                                        {/* Ngày đăng (Cột Mới) */}
                                        <td className="p-4 text-gray-500 text-xs">
                                            {p.createdAt 
                                                ? new Date(p.createdAt).toLocaleDateString('vi-VN') 
                                                : '--'}
                                        </td>

                                        {/* Nút hành động */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {p.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusChange(p.id, 'ACTIVE')}
                                                            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition shadow-sm text-xs font-bold"
                                                            title="Duyệt đăng bán"
                                                        >
                                                            <FaCheck /> Duyệt
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusChange(p.id, 'REJECTED')}
                                                            className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-200 hover:text-red-500 transition text-xs font-bold"
                                                            title="Từ chối sản phẩm này"
                                                        >
                                                            <FaTimes /> Từ chối
                                                        </button>
                                                    </>
                                                )}

                                                <button 
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Xóa vĩnh viễn"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-gray-500">
                                        Không tìm thấy sản phẩm nào trong khoảng thời gian này.
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

export default AdminProductList;