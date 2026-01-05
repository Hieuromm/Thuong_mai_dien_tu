// src/services/visitService.js
import axios from 'axios';
import api from './api';

export const logShopVisit = async (shopId, source) => {
  try {
  
    await axios.post(`http://localhost:8080/api/public/visits/log?shopId=${shopId}&source=${source}`);
  } catch (err) {
    console.error("Lỗi log visit:", err);
  }
};
export const logVisit = (shopId, productId, source) => {
  return api.post('/visits/log', { shopId, productId, source });
};