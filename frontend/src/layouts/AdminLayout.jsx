import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaChartLine, 
    FaUser, 
    FaBoxOpen, 
    FaSignOutAlt, 
    FaBars, 
    FaBell, 
    FaChevronLeft ,
    FaStore,
    FaShoppingBag
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth(); // Lấy thông tin user thật từ Context
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Xử lý đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?")) {
            logout(); 
            navigate('/login');
        }
    };

    // Danh sách menu quản trị
    const menuItems = [
        { path: '/admin/dashboard', name: 'Tổng quan', icon: <FaChartLine /> },
        { path: '/admin/users', name: 'Quản lý người dùng', icon: <FaUser /> },
        { path: '/admin/shops', name: 'Quản lý cửa hàng', icon: <FaStore /> }, 
        { path: '/admin/products', name: 'Quản lý sản phẩm', icon: <FaBoxOpen /> },
        { path: '/admin/orders', name: 'Quản lý đơn hàng', icon: <FaShoppingBag /> },
    ];

    return (
        <div className="flex h-screen bg-[#f4f7fe] font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside className={`bg-[#111c44] text-white flex flex-col transition-all duration-300 shadow-xl z-20
                ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-center border-b border-gray-700/50">
                    {isSidebarOpen ? (
                        <h1 className="text-2xl font-bold tracking-wider text-white italic">
                            BUY<span className="text-[#ee4d2d]">NOW</span>
                        </h1>
                    ) : (
                        <span className="text-[#ee4d2d] font-bold text-xl font-mono">BN</span>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                                    ${isActive 
                                        ? 'bg-[#ee4d2d] text-white shadow-lg shadow-orange-500/30' 
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                `}
                            >
                                <div className="text-lg flex-shrink-0">{item.icon}</div>
                                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer / Logout */}
                <div className="p-4 border-t border-gray-700/50">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <FaSignOutAlt className="flex-shrink-0" />
                        {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN SECTION --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* TOP HEADER */}
                <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            {isSidebarOpen ? <FaChevronLeft /> : <FaBars />}
                        </button>
                        <div className="hidden md:block">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Trang quản trị</p>
                            <h2 className="text-lg font-bold text-[#1b254b]">
                                {menuItems.find(i => i.path === location.pathname)?.name || "Dashboard"}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Thông báo */}
                        <div className="relative p-2 text-gray-400 hover:text-[#ee4d2d] cursor-pointer transition-colors">
                            <FaBell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>

                        {/* Thông tin Admin từ AuthContext */}
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-[#1b254b]">
                                    {user?.fullName || 'Hệ thống'}
                                </div>
                                <div className="text-[11px] font-bold text-green-500 uppercase tracking-tighter bg-green-50 px-2 rounded">
                                    {user?.role === 'ADMIN' ? 'Quản trị viên' : user?.role}
                                </div>
                            </div>
                            <div className="w-11 h-11 rounded-full border-2 border-[#ee4d2d]/20 p-0.5 shadow-sm">
                                <img 
                                    src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=random"} 
                                    alt="Admin Avatar" 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                    {/* Render các trang con như AdminDashboard, AdminUserList tại đây */}
                    <div className="animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;