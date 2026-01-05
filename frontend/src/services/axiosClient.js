
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// QUAN TRỌNG: Cấu hình này giúp bạn lấy thẳng dữ liệu (Array)
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về phần data (là mảng sản phẩm/danh mục)
    return response.data; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;