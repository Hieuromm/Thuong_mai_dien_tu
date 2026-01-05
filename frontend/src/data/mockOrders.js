// src/data/mockOrders.js

export const ORDER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ thanh toán' },
  { id: 'shipping', label: 'Vận chuyển' },
  { id: 'waiting', label: 'Chờ giao hàng' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
  { id: 'refund', label: 'Trả hàng/Hoàn tiền' },
];

export const MOCK_ORDERS_LIST = [
  {
    id: "ORDER_001",
    shopName: "Thời trang H_A_N",
    status: "completed",
    statusText: "Hoàn thành",
    deliveryText: "Giao hàng thành công",
    totalPrice: 150000,
    canRate: true,
    items: [
      {
        name: "Áo Thun Nam Basic Cotton 100%",
        image: "https://via.placeholder.com/80",
        variant: "Trắng, L",
        price: 75000,
        originalPrice: 90000,
        quantity: 2
      }
    ]
  },
  {
    id: "ORDER_002",
    shopName: "Tech Store VN",
    status: "shipping",
    statusText: "Vận chuyển",
    deliveryText: "Đơn hàng đang được giao",
    totalPrice: 5000000,
    canRate: false,
    items: [
      {
        name: "Tai nghe Bluetooth Sony WH-1000XM5",
        image: "https://via.placeholder.com/80",
        variant: "Đen",
        price: 5000000,
        originalPrice: 5500000,
        quantity: 1
      }
    ]
  }
];