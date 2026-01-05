import axiosClient from './axiosClient';

const aiApi = {
    getRecommendations: (userId) => {
        const url = `/ai/recommend/${userId}`;
        return axiosClient.get(url);
    },

 
    getAllTrends: () => {
        const url = `/ai/trends/all`;
        return axiosClient.get(url);
    },
    getGlobalTrending: () => {
        // Đường dẫn này phải khớp với @GetMapping trong AIController.java của Spring Boot
        return axiosClient.get('/ai/trending/system'); 
    },

    // Hàm lấy sản phẩm tương tự (TF-IDF)
    getSimilarProducts: (id) => {
        return axiosClient.get(`/ai/similar/${id}`);
    }
}

export default aiApi;