import axios from 'axios';

// 1. URL Dành cho SELLER (Cần đăng nhập)
const SELLER_API_URL = 'http://localhost:8080/api/seller/products';

// 2. URL Dành cho BUYER/PUBLIC (Không cần đăng nhập)
const PUBLIC_API_URL = 'http://localhost:8080/api/products'; 

// 3. URL Dành cho REVIEW
const REVIEW_API_URL = 'http://localhost:8080/api/reviews';
const CATEGORY_API_URL = 'http://localhost:8080/api/categories';

// Helper: Lấy Token từ LocalStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// --- PHẦN SELLER (QUẢN LÝ SẢN PHẨM) ---

export const addProductAPI = async (formData) => {
    const res = await axios.post(SELLER_API_URL, formData, getAuthHeader());
    return res.data;
};

export const getMyProductsAPI = async () => {
    const res = await axios.get(SELLER_API_URL, getAuthHeader());
    return res.data;
};

export const getProductDetailAPI = async (id) => {
    const res = await axios.get(`${SELLER_API_URL}/${id}`, getAuthHeader());
    return res.data;
};

export const updateProductAPI = async (id, formData) => {
    const res = await axios.put(`${SELLER_API_URL}/${id}`, formData, getAuthHeader());
    return res.data;
};

export const deleteProductAPI = async (id) => {
    const res = await axios.delete(`${SELLER_API_URL}/${id}`, getAuthHeader());
    return res.data;
};


// --- PHẦN BUYER (KHÁCH HÀNG) ---

export const getPublicProductsAPI = async () => {
    const res = await axios.get(PUBLIC_API_URL);
    return res.data;
};

export const getPublicProductDetailAPI = async (id) => {
    const res = await axios.get(`${PUBLIC_API_URL}/${id}`);
    return res.data;
};


export const searchProductsAPI = async (keyword, sortBy = 'relevance', categories = [], minPrice = null, maxPrice = null) => {
    const res = await axios.get(`${PUBLIC_API_URL}/search`, {
        params: { 
            keyword: keyword,
            sortBy: sortBy,
            categories: categories && categories.length > 0 ? categories.join(',') : null,
            minPrice: minPrice,
            maxPrice: maxPrice
        }
    });
    return res.data;
};
export const getCategoriesAPI = async () => {
    const res = await axios.get('http://localhost:8080/api/categories');
    return res.data;
};

// --- PHẦN REVIEW ---

export const getReviewsByProductIdAPI = async (productId) => {
    const res = await axios.get(`${REVIEW_API_URL}/product/${productId}`);
    return res.data;
};

export const replyToReviewAPI = async (reviewId, content) => {
    const res = await axios.post(`http://localhost:8080/api/reviews/reply`, {
        reviewId: reviewId,
        content: content
    }, getAuthHeader());
    return res.data;
};

// --- PHẦN SHOP PUBLIC ---

const PUBLIC_SHOP_API = 'http://localhost:8080/api/public/shops';

export const getPublicShopDetailAPI = async (shopId) => {
    const res = await axios.get(`${PUBLIC_SHOP_API}/${shopId}`);
    return res.data;
};

export const getPublicShopProductsAPI = async (shopId, page = 0) => {
    const res = await axios.get(`${PUBLIC_SHOP_API}/${shopId}/products`, {
        params: {
            page: page,
            limit: 20
        }
    });
    return res.data;
};