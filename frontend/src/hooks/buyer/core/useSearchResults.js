// src/hooks/buyer/core/useSearchResults.js
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProductsAPI, getCategoriesAPI } from '../../../services/productService'; 

export const useSearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || ''; 

  const [results, setResults] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const [filters, setFilters] = useState({
    categories: [],
    minPrice: null,
    maxPrice: null
  });

  // 1. Lấy danh sách danh mục từ Database khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesAPI();
        setCategoriesList(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 2. Hàm gọi API tìm kiếm sản phẩm (giữ nguyên logic của bạn)
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const data = await searchProductsAPI(
        keyword, 
        sortBy, 
        filters.categories, 
        filters.minPrice, 
        filters.maxPrice
      );
      
      const formattedData = data.map(p => ({
        id: p.id,
        name: p.name,
        image: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:8080/images/products/${p.imageUrl}`) : 'https://placehold.co/150',
        price: p.price,
        sold: p.sold || 0, 
        location: p.shop?.address || 'Toàn quốc', 
        discount: p.discount || 0
      }));

      setResults(formattedData);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, sortBy, filters]); 

  useEffect(() => {
    if (keyword.trim()) fetchResults();
  }, [fetchResults, keyword]); 

  return { 
    keyword, results, categoriesList, loading, // Trả về categoriesList
    sortBy, setSortBy, filters, updateFilters 
  };
};