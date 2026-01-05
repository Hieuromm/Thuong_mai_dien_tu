import { useState, useEffect, useCallback } from 'react';
import { getAdminStatsSummary } from '../../services/admin/adminService';

export const useAdminDashboard = () => {
    // 1. Thêm state quản lý khoảng thời gian (Mặc định là 'all')
    const [dateRange, setDateRange] = useState('all');

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            // 2. Truyền dateRange vào API
            // Hàm getAdminStatsSummary cần được cập nhật ở service để nhận tham số này
            const data = await getAdminStatsSummary(dateRange);
            
            setStats(data);
            setError(null);
        } catch (err) {
            console.error("Lỗi tải dashboard:", err);
            setError(err.response?.data?.message || "Lỗi kết nối dữ liệu thống kê");
        } finally {
            setLoading(false);
        }
    }, [dateRange]); // 3. Quan trọng: Thêm dateRange vào đây để khi đổi ngày -> tự gọi lại API

    useEffect(() => {
        loadData();
    }, [loadData]);

    const calculatePercent = (value) => {
        // Kiểm tra an toàn hơn: nếu totalUsers chưa có hoặc = 0
        if (!stats || !stats.totalUsers) return 0;
        return ((value / stats.totalUsers) * 100).toFixed(1);
    };

    return { 
        stats, 
        loading, 
        error, 
        calculatePercent, 
        refresh: loadData,
    
        dateRange, 
        setDateRange 
    };
};