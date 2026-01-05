import React from 'react';
import ProfileSidebar from '../../../components/profile/ProfileSidebar';
import NotificationList from '../../../components/Notification/NotificationList';
import Headers from '../../../components/common/Header';
const NotificationPage = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen py-5 font-sans">
        <Headers/>
      {/* Container: Giới hạn chiều rộng 1200px, căn giữa */}
      <div className="container mx-auto max-w-[1200px] px-4 flex gap-5 items-start">
        
        {/* Cột trái: Sidebar (Ẩn trên mobile, hiện trên Desktop) */}
        <div className="col-span-2 hidden md:block">
            <ProfileSidebar />
        </div>

        {/* Cột phải: Nội dung chính */}
        <div className="flex-1 w-full overflow-hidden">
            <NotificationList />
        </div>

      </div>
    </div>
  );
};

export default NotificationPage;