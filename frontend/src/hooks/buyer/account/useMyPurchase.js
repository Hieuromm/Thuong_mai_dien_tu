import { useState, useEffect } from 'react';
import { getMyOrdersAPI, cancelOrderAPI, requestReturnAPI } from '../../../services/orderService';

export const useMyPurchase = () => {
  const [orders, setOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' }, 
    { id: 'confirmed', label: 'Vận chuyển' },   
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
    { id: 'returned', label: 'Trả hàng/Hoàn tiền' }
  ];

  // 1. Tải đơn hàng
  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrdersAPI();
      
      const formatted = data.map(order => ({
        id: order.id,
        shopName: order.shop?.shopName || 'Shop Online',
        status: order.status,
        statusText: getStatusText(order.status),
        totalPrice: order.totalAmount,
        deliveryText: getDeliveryText(order.status),

        canCancel: order.status === 'PENDING',
        canRate: order.status === 'COMPLETED',
        canReturn: order.status === 'COMPLETED' || order.status === 'RETURN_REJECTED',
        
        items: order.items.map(item => ({
          
            productId: item.product.id, 
            
            name: item.product.name,
            image: item.product.imageUrl ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080/images/products/${item.product.imageUrl}`) : 'https://placehold.co/100',
            variant: item.variant || 'Tiêu chuẩn',
            price: item.price,
            originalPrice: item.price * 1.2,
            quantity: item.quantity
        }))
      }));
      setOrders(formatted);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // 2. Lọc theo Tab
  useEffect(() => {
    if (activeTab === 'all') {
        setFilteredOrders(orders);
    } else if (activeTab === 'pending') {
        setFilteredOrders(orders.filter(o => o.status === 'PENDING'));
    } else if (activeTab === 'confirmed') {
        setFilteredOrders(orders.filter(o => ['CONFIRMED', 'SHIPPING'].includes(o.status)));
    } else if (activeTab === 'completed') {
        setFilteredOrders(orders.filter(o => o.status === 'COMPLETED'));
    } else if (activeTab === 'cancelled') {
        setFilteredOrders(orders.filter(o => ['CANCELLED', 'DELIVERY_FAILED'].includes(o.status)));
    } else if (activeTab === 'returned') {
        setFilteredOrders(orders.filter(o => ['RETURN_REQUESTED', 'RETURNED', 'RETURN_REJECTED'].includes(o.status)));
    } else {
        setFilteredOrders(orders);
    }
  }, [activeTab, orders]);

  // 3. Xử lý Hủy Đơn
  const handleCancelOrder = async (orderId) => {
      if (window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) {
          try {
              await cancelOrderAPI(orderId);
              alert("Đã hủy đơn hàng thành công");
              fetchMyOrders(); 
          } catch (error) {
              alert("Lỗi hủy đơn: " + (error.response?.data || error.message));
          }
      }
  }

  // 4. Xử lý Yêu Cầu Trả Hàng
  const handleRequestReturn = async (orderId) => {
      const reason = prompt("Vui lòng nhập lý do trả hàng (VD: Hàng lỗi, sai mẫu...):");
      if (!reason) return; 

      try {
          await requestReturnAPI(orderId, reason);
          alert("Yêu cầu trả hàng đã được gửi! Vui lòng chờ Shop phản hồi.");
          fetchMyOrders(); 
      } catch (error) {
          alert("Lỗi: " + (error.response?.data || error.message));
      }
  };

  // Helpers
  const getStatusText = (status) => {
      const map = {
          'PENDING': 'CHỜ XÁC NHẬN',
          'CONFIRMED': 'ĐANG CHUẨN BỊ HÀNG',
          'SHIPPING': 'ĐANG GIAO HÀNG',
          'COMPLETED': 'HOÀN THÀNH',
          'CANCELLED': 'ĐÃ HỦY',
          'DELIVERY_FAILED': 'GIAO THẤT BẠI',
          'RETURN_REQUESTED': 'YÊU CẦU TRẢ HÀNG',
          'RETURNED': 'TRẢ HÀNG THÀNH CÔNG',
          'RETURN_REJECTED': 'TỪ CHỐI TRẢ HÀNG'
      };
      return map[status] || status;
  }

  const getDeliveryText = (status) => {
      if (status === 'SHIPPING') return 'Tài xế đang giao hàng đến bạn';
      if (status === 'COMPLETED') return 'Giao hàng thành công';
      if (status === 'CANCELLED') return 'Đơn hàng đã bị hủy';
      if (status === 'RETURNED') return 'Đã hoàn tiền';
      return 'Vận chuyển nhanh';
  }

  return {
    activeTab, setActiveTab,
    orders: filteredOrders, 
    loading,
    tabs,
    handleCancelOrder,
    handleRequestReturn
  };
};