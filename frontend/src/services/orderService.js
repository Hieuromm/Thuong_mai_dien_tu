import axios from 'axios';

// 1. ĐỊNH NGHĨA CÁC URL GỐC RIÊNG BIỆT
const BASE_URL = 'http://localhost:8080/api';
const ORDERS_URL = `${BASE_URL}/orders`;
const REVIEWS_URL = `${BASE_URL}/reviews`; // Định nghĩa riêng cho review

// Helper: Lấy Token từ LocalStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

/* ======================================================
   API DÀNH CHO NGƯỜI MUA (BUYER)
   ====================================================== */

// 1. Đặt hàng (Checkout)
export const placeOrderAPI = async (orderData) => {
    const res = await axios.post(`${ORDERS_URL}/checkout`, orderData, getAuthHeader());
    return res.data;
};

// 2. Lấy lịch sử mua hàng
export const getMyOrdersAPI = async () => {
    const res = await axios.get(`${ORDERS_URL}/my-orders`, getAuthHeader());
    return res.data;
};

// 3. Hủy đơn hàng (Khi còn ở trạng thái PENDING)
export const cancelOrderAPI = async (orderId) => {
    const res = await axios.put(`${ORDERS_URL}/${orderId}/cancel`, null, getAuthHeader());
    return res.data;
};

// 4. Yêu cầu trả hàng
export const requestReturnAPI = async (orderId, reason) => {
    const res = await axios.put(`${ORDERS_URL}/${orderId}/return-request`, { reason }, getAuthHeader());
    return res.data;
};

// 5. Gửi đánh giá (SỬA LẠI DÙNG REVIEWS_URL)
export const submitReviewAPI = async (formData) => {
    // Gọi đúng vào: http://localhost:8080/api/reviews/create
    const res = await axios.post(`${REVIEWS_URL}/create`, formData, getAuthHeader());
    return res.data;
};

/* ======================================================
   API DÀNH CHO NGƯỜI BÁN (SELLER) & SHIPPER
   ====================================================== */

// 6. Lấy danh sách đơn hàng của Shop
export const getSellerOrdersAPI = async () => {
    const res = await axios.get(`${ORDERS_URL}/seller`, getAuthHeader());
    return res.data;
};

// 7. Cập nhật trạng thái đơn hàng
export const updateOrderStatusAPI = async (orderId, status) => {
    const res = await axios.put(`${ORDERS_URL}/seller/${orderId}/status`, null, {
        ...getAuthHeader(),
        params: { status }
    });
    return res.data;
};