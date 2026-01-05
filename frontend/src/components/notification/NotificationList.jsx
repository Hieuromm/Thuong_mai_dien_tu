import React from 'react';
import NotificationItem from './NotificationItem';
import { DUMMY_NOTIFICATIONS } from '../../data/mockData';

const NotificationList = () => {
  return (
    <div className="bg-white shadow-sm rounded-sm min-h-[500px]">
      {/* Header: Căn phải nút "Đánh dấu đã đọc" */}
      <div className="flex justify-end items-center px-6 py-4 border-b border-gray-100">
        <button className="text-[14px] text-gray-400 hover:text-[#ee4d2d] cursor-pointer">
            Đánh dấu Đã đọc tất cả
        </button>
      </div>

      {/* Danh sách Items */}
      <div>
        {DUMMY_NOTIFICATIONS.length > 0 ? (
            DUMMY_NOTIFICATIONS.map((item) => (
                <NotificationItem key={item.id} item={item} />
            ))
        ) : (
            // Trạng thái khi không có thông báo
            <div className="flex flex-col items-center justify-center py-20 h-96">
                <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png" alt="empty" className="w-24 h-24 mb-4 opacity-50"/>
                <span className="text-gray-500 text-sm">Chưa có thông báo nào</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;