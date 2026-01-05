import React from 'react';

const NotificationItem = ({ item }) => {
  return (
    <div className={`flex p-4 border-b border-gray-100 transition-colors hover:bg-gray-50 
        ${!item.isRead ? 'bg-[#fffbf8]' : 'bg-white'}`
    }>
      {/* 1. Ảnh sản phẩm */}
      <div className="flex-shrink-0 mr-4">
        <img 
          src={item.image} 
          alt="noti-thumb" 
          className="w-20 h-20 object-cover border border-gray-200 rounded-sm"
          onError={(e) => e.target.src = 'https://via.placeholder.com/80'} 
        />
      </div>

      {/* 2. Nội dung text */}
      <div className="flex-grow pr-4">
        <h4 className="text-[14px] text-gray-800 mb-1 font-medium font-sans">
            {item.title}
        </h4>
        <p className="text-[13px] text-gray-500 mb-1 leading-relaxed line-clamp-2">
            {item.content}
        </p>
        <div className="text-[12px] text-gray-400 mt-1">
            {item.time}
        </div>
      </div>

      {/* 3. Nút bấm hành động (Căn giữa theo chiều dọc) */}
      <div className="flex flex-col justify-center min-w-[140px]">
        {item.action && (
            <button className="border border-gray-300 text-gray-600 px-4 py-2 text-[13px] rounded-[2px] 
                               hover:bg-gray-50 hover:text-[#ee4d2d] hover:border-[#ee4d2d] transition-all bg-white">
                {item.action}
            </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;