import axiosClient from './axiosClient';

const productApi = {
  // Lấy sản phẩm theo tên danh mục
  getByCategory: (categoryName) => {
    const url = `/products/category/${encodeURIComponent(categoryName)}`;
    return axiosClient.get(url);
  },
  getRecommendations: (userId) => {
        return axiosClient.get(`/ai/recommend/${userId}`); // Gọi sang Spring Boot
    },
 
  getAll: () => {
    return axiosClient.get('/products');
  }
};

export default productApi;