// src/hooks/useSalesData.js
import { useState } from 'react';
import { HOURLY_DATA } from '../../../data/mockSalesData';

export const useSalesData = () => {
  // State quản lý các chỉ số đang được chọn để vẽ (Mặc định chọn Doanh số & Đơn hàng)
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'orders']);

  // Hàm toggle checkbox
  const toggleMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      // Bỏ chọn (nhưng không cho bỏ hết, giữ lại ít nhất 1)
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(prev => prev.filter(m => m !== metricId));
      }
    } else {
      // Chọn thêm (Giới hạn tối đa 4)
      if (selectedMetrics.length < 4) {
        setSelectedMetrics(prev => [...prev, metricId]);
      }
    }
  };

  // Hàm tính toán SVG Path cho từng metric
  const getPathForMetric = (metricId, width = 1000, height = 300) => {
    const data = HOURLY_DATA;
    // 1. Tìm giá trị lớn nhất của metric đó để scale biểu đồ
    const maxValue = Math.max(...data.map(d => d[metricId])) || 1;
    
    const stepX = width / (data.length - 1);

    const path = data.map((point, index) => {
      const x = index * stepX;
      // Scale giá trị về chiều cao SVG (đảo ngược Y)
      const y = height - (point[metricId] / maxValue) * (height * 0.8); // nhân 0.8 để chừa lề trên
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return path;
  };

  return {
    selectedMetrics,
    toggleMetric,
    getPathForMetric,
    hourlyData: HOURLY_DATA
  };
};