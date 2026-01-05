// File: src/pages/admin/AdminUserList.jsx

import React, { useState, useEffect } from 'react';
import { 
    FaSearch, 
    FaTrash, 
    FaUserEdit, 
    FaFilter, 
    FaSpinner, 
    FaEllipsisV, 
    FaCalendarAlt, 
    FaSync 
} from 'react-icons/fa';

// Import các hàm API từ adminService
import { 
    getAdminUserList, 
    deleteUserAPI, 
    updateUserRoleAPI 
} from '../../services/admin/adminService';

import { useAuth } from '../../context/AuthContext';

const AdminUserList = () => {
    // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE BỘ LỌC SERVER-SIDE (Gửi request lên server) ---
    const [dateRange, setDateRange] = useState('all');

    // --- STATE BỘ LỌC CLIENT-SIDE (Lọc trên UI) ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    // Lấy thông tin Admin đang đăng nhập (để tránh xóa nhầm chính mình)
    const { user: currentUser } = useAuth(); 

    // --- 2. GỌI API LẤY DỮ LIỆU ---
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Truyền dateRange vào API để Server lọc ngày
            const response = await getAdminUserList(dateRange);
            
            // Backend trả về mảng user
            setUsers(response.data || response); 
        } catch (err) {
            console.error("Lỗi tải danh sách user:", err);
            setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API mỗi khi dateRange thay đổi
    useEffect(() => {
        fetchUsers();
    }, [dateRange]);

    // --- 3. XỬ LÝ LỌC & TÌM KIẾM (Client-side) ---
    // Sau khi lấy dữ liệu về, ta lọc tiếp theo Tên và Role
    const filteredUsers = users.filter(u => {
        // Lọc theo Role
        const matchRole = filterRole === 'ALL' || u.role === filterRole;
        
        // Lọc theo Tên hoặc Email
        const name = u.fullName || '';
        const email = u.email || '';
        const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchRole && matchSearch;
    });

    // --- 4. CHỨC NĂNG XÓA NGƯỜI DÙNG ---
    const handleDelete = async (id) => {
        if (window.confirm("Cảnh báo: Hành động này không thể hoàn tác.\nBạn có chắc chắn muốn xóa người dùng này?")) {
            try {
                await deleteUserAPI(id);
                alert("Đã xóa người dùng thành công!");
                
                // Cập nhật lại UI ngay lập tức
                setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Lỗi khi xóa người dùng.";
                alert("Thất bại: " + msg);
            }
        }
    };

    // --- 5. CHỨC NĂNG ĐỔI QUYỀN (ROLE) ---
    const handleRoleChange = async (id, currentRole) => {
        if (currentRole === 'ADMIN') {
            alert("Không thể thay đổi quyền của Admin tại đây.");
            return;
        }

        const newRole = currentRole === 'BUYER' ? 'SELLER' : 'BUYER';
        
        if (window.confirm(`Xác nhận đổi quyền của user này từ ${currentRole} sang ${newRole}?`)) {
            try {
                await updateUserRoleAPI(id, newRole);
                alert(`Cập nhật thành công! Người dùng giờ là ${newRole}.`);
                
                // Cập nhật lại state để UI đổi màu Badge ngay
                setUsers(prevUsers => prevUsers.map(u => 
                    u.id === id ? { ...u, role: newRole } : u
                ));
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Lỗi cập nhật quyền.";
                alert("Thất bại: " + msg);
            }
        }
    };

    // Helper: Render Badge màu sắc cho Role
    const renderRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs font-bold border border-red-200">ADMIN</span>;
            case 'SELLER':
                return <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs font-bold border border-blue-200">SELLER</span>;
            default: // BUYER
                return <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-bold border border-green-200">BUYER</span>;
        }
    };

    // Danh sách tùy chọn thời gian
    const rangeOptions = [
        { value: 'all', label: 'Tất cả thời gian' },
        { value: 'today', label: 'Đăng ký Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
        { value: 'last_month', label: 'Tháng trước' },
    ];

    // --- RENDER UI ---

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <FaSpinner className="animate-spin text-3xl text-[#ee4d2d]" />
                <span className="mt-3 text-gray-500 font-medium">Đang tải dữ liệu người dùng...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100 mt-6">
                <p className="text-red-600 mb-4 font-bold">{error}</p>
                <button 
                    onClick={fetchUsers}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                >
                    <FaSync className="inline mr-2"/> Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* --- HEADER & TIME FILTER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1b254b]">Quản Lý Người Dùng</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng số: <span className="font-bold text-[#ee4d2d] text-lg">{users.length}</span> tài khoản
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
                        onClick={fetchUsers} 
                        className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-[#ee4d2d] hover:bg-orange-50 transition-all border-l border-gray-200"
                        title="Làm mới dữ liệu"
                    >
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* --- TOOLBAR (SEARCH & ROLE FILTER) --- */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search Box */}
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm theo tên hoặc email..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Role Filter */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaFilter /> Lọc theo:
                    </div>
                    <select 
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#ee4d2d] bg-gray-50 cursor-pointer"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">Quản trị viên (Admin)</option>
                        <option value="SELLER">Người bán (Seller)</option>
                        <option value="BUYER">Người mua (Buyer)</option>
                    </select>
                </div>
            </div>

            {/* --- USER TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4 border-b">ID</th>
                                <th className="p-4 border-b">Thông tin người dùng</th>
                                <th className="p-4 border-b">Vai trò</th>
                                <th className="p-4 border-b">Ngày tham gia</th>
                                <th className="p-4 border-b text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4 text-gray-400 font-mono">#{item.id}</td>
                                        
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={item.avatarUrl || "https://via.placeholder.com/150"} 
                                                    alt={item.fullName} 
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm bg-gray-100"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }} 
                                                />
                                                <div>
                                                    <div className="font-bold text-[#1b254b]">{item.fullName || "Chưa đặt tên"}</div>
                                                    <div className="text-xs text-gray-500">{item.email}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5">{item.username}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {renderRoleBadge(item.role)}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {item.createdAt 
                                                ? new Date(item.createdAt).toLocaleDateString('vi-VN') 
                                                : <span className="text-gray-400 italic">--</span>
                                            }
                                        </td>

                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                
                                                {/* Nút Đổi Quyền (Chỉ hiện nếu không phải Admin) */}
                                                {item.role !== 'ADMIN' && (
                                                    <button 
                                                        onClick={() => handleRoleChange(item.id, item.role)}
                                                        className="p-2 text-blue-500 bg-blue-50 rounded hover:bg-blue-100 transition-colors tooltip-container group relative"
                                                    >
                                                        <FaUserEdit />
                                                        <span className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                            Đổi quyền (Buyer/Seller)
                                                        </span>
                                                    </button>
                                                )}

                                                {/* Nút Xóa (Chỉ hiện nếu không phải chính mình) */}
                                                {item.username !== currentUser?.username ? (
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-500 bg-red-50 rounded hover:bg-red-100 transition-colors group relative"
                                                    >
                                                        <FaTrash />
                                                        <span className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                            Xóa tài khoản
                                                        </span>
                                                    </button>
                                                ) : (
                                                    // Placeholder rỗng để giữ layout nếu là chính mình
                                                    <div className="w-8 h-8"></div>
                                                )}
                                                
                                                {/* Nút Menu khác (dự phòng) */}
                                                <button className="p-2 text-gray-400 hover:text-[#111c44]">
                                                    <FaEllipsisV />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaSearch className="text-4xl text-gray-200 mb-3" />
                                            <p>Không tìm thấy người dùng nào phù hợp với bộ lọc.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center bg-gray-50/50">
                    Hiển thị danh sách từ cơ sở dữ liệu
                </div>
            </div>
        </div>
    );
};

export default AdminUserList;