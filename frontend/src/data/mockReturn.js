// src/data/mockReturn.js

// 1. Cấu hình TABS Cấp 1 (Loại đơn)
export const MAIN_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'RETURN_REFUND', label: 'Đơn Trả hàng/Hoàn tiền' },
  { id: 'CANCEL', label: 'Đơn Hủy' },
  { id: 'DELIVERY_FAILED', label: 'Đơn Giao hàng không thành công' },
];

// 2. Cấu hình TABS Cấp 2 (Trạng thái chi tiết - Chủ yếu cho Trả hàng)
export const SUB_TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'SHOPEE_REVIEW', label: 'Shopee đang xem xét' },
  { id: 'RETURNING', label: 'Đang trả hàng cho Người bán' },
  { id: 'REFUNDED', label: 'Đã hoàn tiền cho Người mua' },
  { id: 'DISPUTE', label: 'Đã khiếu nại đến Shopee' },
];

// 3. Dữ liệu giả
export const MOCK_RETURN_ORDERS = [
  {
    id: "RETURN_01",
    type: "RETURN_REFUND", // Khớp với MAIN_TABS
    subStatus: "SHOPEE_REVIEW", // Khớp với SUB_TABS
    productName: "Áo Thun Nam Cotton - Lỗi đường may",
    productImage: "https://via.placeholder.com/60",
    amount: 150000,
    reason: "Hàng bị lỗi / Hư hỏng",
    solution: "Hoàn tiền ngay",
    statusText: "Shopee đang xem xét",
    returnShipping: "Chưa cập nhật",
    deliveryShipping: "SPX Express",
    username: "nguyenvana"
  },
  {
    id: "CANCEL_02",
    type: "CANCEL",
    subStatus: "CANCELLED",
    productName: "Quần Jean Ống Rộng - Size XL",
    productImage: "https://via.placeholder.com/60",
    amount: 250000,
    reason: "Muốn thay đổi địa chỉ giao hàng",
    solution: "Hủy đơn hàng",
    statusText: "Đã hủy bởi người mua",
    returnShipping: "-",
    deliveryShipping: "Giao Hàng Nhanh",
    username: "tranthib"
  },
  {
    id: "FAIL_03",
    type: "DELIVERY_FAILED",
    subStatus: "RETURNING_TO_SELLER",
    productName: "Tai nghe Bluetooth không dây",
    productImage: "https://via.placeholder.com/60",
    amount: 320000,
    reason: "Không liên lạc được người nhận",
    solution: "Trả về kho bán",
    statusText: "Giao thất bại - Đang hoàn về",
    returnShipping: "J&T Express",
    deliveryShipping: "J&T Express",
    username: "lethic"
  }
];