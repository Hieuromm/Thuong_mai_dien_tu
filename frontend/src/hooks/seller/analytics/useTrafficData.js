// src/hooks/useTrafficData.js
import { useState } from 'react';
import { TRAFFIC_CHART_DATA } from '../../../data/mockTrafficData';

export const useTrafficData = () => {
  // Filter state
  const [sourceFilter, setSourceFilter] = useState('ALL'); // ALL | APP | PC
  
  // Chart metrics state (Mặc định chọn Lượt xem & Lượt truy cập)
  const [selectedMetrics, setSelectedMetrics] = useState(['page_views', 'visitors']);

  // Hàm toggle checkbox metric
  const toggleMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(prev => prev.filter(m => m !== metricId));
      }
    } else {
      if (selectedMetrics.length < 4) {
        setSelectedMetrics(prev => [...prev, metricId]);
      }
    }
  };

  // Logic vẽ biểu đồ SVG
  const getPathForMetric = (metricId, width = 1000, height = 300) => {
    const data = TRAFFIC_CHART_DATA;
    // Tìm max value để scale (tránh chia cho 0)
    const values = data.map(d => d[metricId] || 0);
    const maxValue = Math.max(...values) || 1; 

    const stepX = width / (data.length - 1);

    return data.map((point, index) => {
      const x = index * stepX;
      const val = point[metricId] || 0;
      // Đảo ngược Y (SVG 0 ở trên)
      const y = height - (val / maxValue) * (height * 0.8); 
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Màu sắc cho từng đường (Hardcode cho đẹp)
  const getMetricColor = (metricId) => {
    const colors = {
      'page_views': '#3b82f6', // Blue
      'visitors': '#f97316',   // Orange
      'new_visitors': '#10b981', // Green
      'bounce_rate': '#ef4444' // Red
    };
    return colors[metricId] || '#6b7280'; // Default Gray
  };

  return {
    sourceFilter,
    setSourceFilter,
    selectedMetrics,
    toggleMetric,
    getPathForMetric,
    getMetricColor,
    chartData: TRAFFIC_CHART_DATA
  };
};