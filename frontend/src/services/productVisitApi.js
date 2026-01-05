import axiosClient from './axiosClient';

const productVisitApi = {
  getTopVisited: () => {
    return axiosClient.get('/public/analytics/top-visited');
  }
};

export default productVisitApi;