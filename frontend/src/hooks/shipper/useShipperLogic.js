import { useState, useEffect } from 'react';
// Tận dụng API của seller để giả lập lấy đơn hàng
import { getSellerOrdersAPI, updateOrderStatusAPI } from '../../services/orderService';

export const useShipperLogic = () => {
  const [shippingOrders, setShippingOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. TẢI DANH SÁCH ĐƠN CẦN GIAO ---
  const fetchShippingOrders = async () => {
    setLoading(true);
    try {
      // Giả lập: Lấy tất cả đơn hàng, chỉ lọc ra những đơn đang ở trạng thái 'SHIPPING'
      const data = await getSellerOrdersAPI();
      
      const onlyShipping = data.filter(order => order.status === 'SHIPPING');

      const formatted = onlyShipping.map(order => ({
        id: order.id,
        customerName: order.user?.fullName || 'Khách lẻ',
        customerPhone: order.user?.phone || '09xx xxx xxx', 
        address: order.shippingAddress,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán Online',
        isCOD: order.paymentMethod === 'COD',
        itemCount: order.items.length,
        items: order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')
      }));

      setShippingOrders(formatted);
    } catch (error) {
      console.error("Lỗi tải đơn giao hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippingOrders();
  }, []);

  // --- 2. XỬ LÝ GIAO THÀNH CÔNG ---
  const handleConfirmDelivered = async (orderId) => {
    if (window.confirm(`Xác nhận đơn hàng #${orderId} đã giao thành công?`)) {
      try {
        await updateOrderStatusAPI(orderId, 'COMPLETED');
        alert("✅ Giao hàng thành công!");
        await fetchShippingOrders(); // Load lại danh sách
      } catch (error) {
        alert("Lỗi: " + (error.response?.data || error.message));
      }
    }
  };

  // --- 3. XỬ LÝ GIAO THẤT BẠI (Boom hàng/Không nghe máy) ---
  const handleDeliveryFailed = async (orderId) => {
    const reason = prompt("Nhập lý do giao thất bại (VD: Khách không nghe máy, Sai địa chỉ...):");
    if (!reason) return; // Nếu bấm hủy thì thôi

    if (window.confirm("Xác nhận giao thất bại? Hàng sẽ được hoàn về kho.")) {
      try {
        await updateOrderStatusAPI(orderId, 'DELIVERY_FAILED');
        alert("⚠️ Đã báo cáo giao thất bại. Hàng đã được cộng lại vào kho.");
        await fetchShippingOrders(); // Load lại danh sách
      } catch (error) {
        alert("Lỗi: " + (error.response?.data || error.message));
      }
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return {
    shippingOrders,
    loading,
    formatCurrency,
    handleConfirmDelivered,
    handleDeliveryFailed,
    refresh: fetchShippingOrders
  };
};