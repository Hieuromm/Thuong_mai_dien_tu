import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { getMyNotifications, markAsReadAPI } from '../../services/notification/notificationService';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Fetch thông báo
    const fetchNoti = async () => {
        try {
            const data = await getMyNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length); // Backend trả về isRead nhưng JSON có thể là read
        } catch (error) {
            console.error("Lỗi lấy thông báo", error);
        }
    };

    useEffect(() => {
        fetchNoti();
        const interval = setInterval(fetchNoti, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRead = async (noti) => {
        if (!noti.read) {
            await markAsReadAPI(noti.id);
            // Cập nhật UI local
            setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        // Chuyển hướng tùy loại
        if (noti.type === 'SHOP') navigate('/seller/profile');
        if (noti.type === 'PRODUCT') navigate('/seller/products');
        if (noti.type === 'ORDER') navigate(`/user/orders/${noti.referenceId}`);
        
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* ICON CHUÔNG */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-gray-500 hover:text-[#ee4d2d] transition-colors"
            >
                <FaBell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* DROPDOWN MENU */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 animate-fadeIn">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                        Thông báo
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map(noti => (
                                <div 
                                    key={noti.id} 
                                    onClick={() => handleRead(noti)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!noti.read ? 'bg-orange-50/50' : ''}`}
                                >
                                    <h4 className={`text-sm ${!noti.read ? 'font-bold text-[#ee4d2d]' : 'font-semibold text-gray-700'}`}>
                                        {noti.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{noti.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                        {new Date(noti.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                Không có thông báo nào.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;