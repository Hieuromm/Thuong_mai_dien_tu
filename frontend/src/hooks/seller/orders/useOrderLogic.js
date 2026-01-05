import { useState, useEffect } from 'react';
// Import API thật
import { getSellerOrdersAPI, updateOrderStatusAPI } from '../../../services/orderService';

export const useOrderLogic = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // ========================================================================
  // 1. TẢI DỮ LIỆU TỪ SERVER (REAL API)
  // ========================================================================
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getSellerOrdersAPI();
      
      // Map dữ liệu từ Backend (Entity) sang format UI
      const formattedData = data.map(order => ({
        id: order.id,
        username: order.user?.fullName || order.user?.username || 'Khách lẻ',
        phone: order.user?.phone || '03xxxxxxxxx',
        totalAmount: order.totalAmount,
        status: order.status, 
        // status gồm: PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED, DELIVERY_FAILED, RETURN_REQUESTED, RETURNED
        statusText: getStatusText(order.status),
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        shippingCarrier: 'Vận chuyển nhanh',
        createdAt: order.createdAt,
        products: order.items.map(item => ({
          name: item.product.name,
          // Xử lý ảnh: Nối localhost nếu link ảnh chưa đầy đủ
          image: item.product.imageUrl 
            ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080/images/products/${item.product.imageUrl}`) 
            : 'https://placehold.co/100?text=No+Img',
          variant: item.variant || 'Tiêu chuẩn',
          price: item.price,
          quantity: item.quantity
        }))
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ========================================================================
  // 2. LOGIC LỌC ĐƠN HÀNG (FILTER THEO 7 TAB)
  // ========================================================================
  const filteredOrders = orders.filter(order => {
    // A. Lọc theo từ khóa tìm kiếm
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      searchTerm === '' ||
      order.id.toString().includes(searchTerm) ||
      order.username.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // B. Lọc theo Tab trạng thái
    switch (activeTab) {
        case 'all': 
            return true;
        
        case 'pending': 
            return order.status === 'PENDING';
        
        case 'confirmed': 
            return order.status === 'CONFIRMED'; // Tab Chờ lấy hàng
        
        case 'shipping': 
            return order.status === 'SHIPPING';   // Tab Đang giao
        
        case 'completed': 
            return order.status === 'COMPLETED'; // Tab Đã giao thành công
        
        case 'cancelled': 
            // Tab Đơn Hủy bao gồm: 
            // 1. CANCELLED (Khách hủy)
            // 2. DELIVERY_FAILED (Giao thất bại)
            // 3. RETURNED (Đã trả hàng xong)
            // 4. RETURN_REJECTED (Từ chối trả hàng - tùy logic shop có thể để ở đây hoặc Completed)
            return ['CANCELLED', 'DELIVERY_FAILED', 'RETURNED', 'RETURN_REJECTED'].includes(order.status);
        
        case 'returned': 
            // Tab Trả hàng/Hoàn tiền: Chỉ hiện những đơn ĐANG YÊU CẦU
            return order.status === 'RETURN_REQUESTED';
            
        default: 
            return true;
    }
  });

  // ========================================================================
  // 3. CÁC HÀM XỬ LÝ HÀNH ĐỘNG (ACTIONS)
  // ========================================================================

  // A. Nút "Xác nhận" (Pending -> Confirmed)
  // -> Chuyển sang tab: Chờ lấy hàng
  const handleConfirmOrder = async (orderId) => {
    if (window.confirm("Xác nhận có hàng và chuẩn bị đóng gói? (Kho sẽ được trừ)")) {
        await updateStatusAndRefresh(orderId, 'CONFIRMED', 'confirmed');
    }
  };

  // B. Nút "Giao ĐVVC" (Confirmed -> Shipping)
  // -> Chuyển sang tab: Đang giao
  const handleShipOrder = async (orderId) => {
    if (window.confirm("Xác nhận đã giao hàng cho bưu tá?")) {
        await updateStatusAndRefresh(orderId, 'SHIPPING', 'shipping');
    }
  };

  // C. Nút "Đã giao" (Shipping -> Completed)
  // -> Chuyển sang tab: Đã giao
  const handleCompleteOrder = async (orderId) => {
    if (window.confirm("Xác nhận đơn hàng đã giao thành công?")) {
        await updateStatusAndRefresh(orderId, 'COMPLETED', 'completed');
    }
  };

  // D. Nút "Đồng ý Trả hàng" (Return Requested -> Returned)
  // -> Chuyển sang tab: Đơn Hủy
  // -> Backend sẽ cộng lại kho
  const handleAcceptReturn = async (orderId) => {
      if (window.confirm("Đồng ý nhận lại hàng và hoàn tiền? Kho sẽ được cộng lại.")) {
          await updateStatusAndRefresh(orderId, 'RETURNED', 'cancelled');
      }
  };

  // E. Nút "Từ chối Trả hàng" (Return Requested -> Return Rejected/Completed)
  // -> Chuyển sang tab: Đơn Hủy (hoặc Đã giao tùy quy định)
  const handleRejectReturn = async (orderId) => {
      if (window.confirm("Từ chối yêu cầu trả hàng? Đơn hàng sẽ giữ nguyên.")) {
          // Có thể chuyển sang RETURN_REJECTED hoặc COMPLETED
          await updateStatusAndRefresh(orderId, 'RETURN_REJECTED', 'cancelled');
      }
  };

  // F. Nút "Đã nhận hàng hoàn" (Delivery Failed -> Returned)
  // -> Dành cho trường hợp Shipper báo giao thất bại, hàng về kho Shop
  // -> Backend sẽ cộng lại kho lúc này
  const handleReceivedReturn = async (orderId) => {
      if (window.confirm("Xác nhận đã nhận lại hàng từ Shipper? Kho sẽ được cộng lại.")) {
          await updateStatusAndRefresh(orderId, 'RETURNED', 'cancelled');
      }
  };

  // G. Nút Debug (Giả lập khách yêu cầu trả hàng để test)
  const debugRequestReturn = async (orderId) => {
      if (window.confirm("[TEST] Giả lập khách yêu cầu trả hàng?")) {
          await updateStatusAndRefresh(orderId, 'RETURN_REQUESTED', 'returned');
      }
  };

  // --- HÀM HELPER CHUNG ---
  // Gọi API cập nhật -> Thông báo -> Load lại -> Chuyển tab
  const updateStatusAndRefresh = async (id, status, nextTabId) => {
      try {
          await updateOrderStatusAPI(id, status);
          alert("Cập nhật thành công!");
          
          await fetchOrders(); // Tải lại dữ liệu mới nhất
          
          if (nextTabId) {
            setActiveTab(nextTabId); // Tự động chuyển Tab
          }
      } catch (error) {
          alert("Lỗi: " + (error.response?.data || error.message));
      }
  }

  // --- FORMATTERS ---
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const getStatusText = (status) => {
    const map = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đang chuẩn bị hàng',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Giao thành công',
      'CANCELLED': 'Đã hủy',
      'DELIVERY_FAILED': 'Giao thất bại',
      'RETURN_REQUESTED': 'Yêu cầu trả hàng',
      'RETURNED': 'Đã trả hàng/Hoàn tiền',
      'RETURN_REJECTED': 'Từ chối trả hàng'
    };
    return map[status] || status;
  };

  return {
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,
    filteredOrders,
    loading,
    formatCurrency,
    // Export các hàm xử lý hành động
    handleConfirmOrder,
    handleShipOrder,
    handleCompleteOrder,
    handleAcceptReturn,
    handleRejectReturn,
    handleReceivedReturn,
    debugRequestReturn
  };
};