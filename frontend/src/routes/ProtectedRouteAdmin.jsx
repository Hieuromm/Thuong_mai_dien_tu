import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRouteAdmin = () => {
    const { user } = useAuth(); // Lấy thông tin user từ Context
    const token = localStorage.getItem('token');

    const isAdmin = token && user && user.role === 'ADMIN';

    // Nếu là Admin -> Cho phép đi tiếp vào các route con (Outlet)
    // Nếu không phải -> Đá về trang chủ (replace để không quay lại được bằng nút Back)
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRouteAdmin;