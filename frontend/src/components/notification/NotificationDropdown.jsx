import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_NOTIFICATIONS } from '../../data/mockData'; 

const NotificationDropdown = () => {
  // Lấy 5 thông báo đầu tiên để hiển thị rút gọn
  const recentNotifications = DUMMY_NOTIFICATIONS.slice(0, 5);

  return (
    <div className="absolute top-[150%] right-0 w-[400px] bg-white shadow-lg rounded-sm z-50 border border-gray-100 animate-fadeIn origin-top-right">
      

      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

      {/* Header của Dropdown */}
      <div className="text-gray-400 text-sm px-4 py-3 text-left">
        Thông Báo Mới Nhận
      </div>

      {/* Danh sách thông báo */}
      <div className="flex flex-col">
        {recentNotifications.map((item) => (
          <Link 
            to="/user/notifications" 
            key={item.id}
            className={`flex items-start px-4 py-3 hover:bg-gray-50 transition-colors
              ${!item.isRead ? 'bg-[#fff2ee]' : 'bg-white'} 
            `}
          >
            {/* Ảnh */}
            <div className="flex-shrink-0 mr-3">
              <img 
                src={item.image} 
                alt="img" 
                className="w-10 h-10 object-cover border border-gray-200"
                onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
              />
            </div>

            {/* Nội dung text */}
            <div className="flex-1 text-left">
              <h4 className="text-sm text-gray-800 mb-1 line-clamp-1 font-normal">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-tight">
                {item.content}
              </p>
            </div>
          </Link>
        ))}
      </div>


      <Link 
        to="/user/notifications"
        className="block w-full text-center py-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-[#ee4d2d] hover:underline"
      >
        Xem tất cả
      </Link>
    </div>
  );
};

export default NotificationDropdown;