import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SellerLayout from '../../layouts/SellerLayout';

const SellerGuard = () => {
  const { user, loading } = useAuth();

  // 1. Đợi load xong thông tin user từ LocalStorage
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // 2. Nếu chưa đăng nhập -> Đá về Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Nếu là SELLER -> Cho phép vào Layout quản lý (Outlet sẽ hiện Dashboard)
  if (user.role === 'SELLER') {
    return <SellerLayout />; 
  }

  return <Navigate to="/seller/register" replace />;
};

export default SellerGuard;