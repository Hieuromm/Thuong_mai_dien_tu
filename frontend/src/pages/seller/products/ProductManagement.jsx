import React, { useState, useMemo } from 'react'; // Thêm useMemo
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaRegTrashAlt, FaSpinner, FaBoxOpen, FaStar, FaEyeSlash } from 'react-icons/fa';
import { useProductManagement } from '../../../hooks/seller/product/useProductManagement';

import ProductReviewsModal from '../../../components/seller/ProductReviewsModal';

const ProductManagement = () => {
  const { products, loading, handleDelete } = useProductManagement();
  
  // Tab mặc định là 'all'
  const [activeTab, setActiveTab] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý Modal Đánh giá
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  // --- 1. CẤU HÌNH DANH SÁCH TABS ---
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'active', label: 'Đang bán' },      // status = ACTIVE & !hidden
    { id: 'pending', label: 'Chờ duyệt' },    // status = PENDING
    { id: 'rejected', label: 'Vi phạm' },     // status = REJECTED
    { id: 'hidden', label: 'Đã ẩn' },         // hidden = true
    { id: 'out_of_stock', label: 'Hết hàng' } // stock = 0
  ];

  // --- HELPER FUNCTIONS ---

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/50?text=No+Img';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/images/products/${url}`;
  };

  const calculateTotalStock = (product) => {
      if (!product.hasVariants) {
          return product.stock || 0;
      }
      if (product.variants && product.variants.length > 0) {
          return product.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
      }
      return 0;
  };

  const getPriceDisplay = (product) => {
      if (!product.hasVariants || !product.variants || product.variants.length === 0) {
          return formatCurrency(product.price);
      }
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) return formatCurrency(minPrice);
      return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
  };

  // --- 2. LOGIC LỌC SẢN PHẨM (FILTER) ---
  const filteredProducts = useMemo(() => {
      return products.filter(product => {
          // A. Lọc theo Search Term
          const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              String(product.id).includes(searchTerm);
          if (!matchSearch) return false;

          // B. Lọc theo Tab Status
          const totalStock = calculateTotalStock(product);

          switch (activeTab) {
              case 'active':
                  // Đang bán = ACTIVE + Không ẩn + Còn hàng
                  return product.status === 'ACTIVE' && !product.hidden && totalStock > 0;
              case 'pending':
                  return product.status === 'PENDING';
              case 'rejected':
                  return product.status === 'REJECTED';
              case 'hidden':
                  return product.hidden === true;
              case 'out_of_stock':
                  return totalStock === 0;
              default: // 'all'
                  return true;
          }
      });
  }, [products, activeTab, searchTerm]);

  // --- 3. HELPER RENDER BADGE TRẠNG THÁI ---
  const renderStatusBadge = (product) => {
      if (product.hidden) return <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded border border-gray-300">ĐÃ ẨN</span>;
      
      switch (product.status) {
          case 'PENDING':
              return <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">CHỜ DUYỆT</span>;
          case 'REJECTED':
              return <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">TỪ CHỐI</span>;
          case 'ACTIVE':
              return null; // Active thì không cần hiện badge cho đỡ rối (hoặc hiện nếu muốn)
          default:
              return null;
      }
  };

  return (
    <div className="p-6 bg-[#f6f6f6] min-h-screen font-sans text-sm">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">Quản lý Sản phẩm</h2>
        <Link 
            to="/seller/products/add" 
            className="bg-[#ee4d2d] text-white px-4 py-2 rounded-sm hover:opacity-90 flex items-center gap-2 shadow-sm font-medium"
        >
             <FaPlus /> Thêm 1 sản phẩm mới
        </Link>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-t-sm shadow-sm border-b border-gray-200 px-4 pt-4">
        <ul className="flex gap-8 text-sm overflow-x-auto">
            {tabs.map((tab) => (
                <li 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 cursor-pointer border-b-2 font-medium whitespace-nowrap transition-colors select-none
                        ${activeTab === tab.id ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent text-gray-600 hover:text-[#ee4d2d]'}
                    `}
                >
                    {tab.label} 
                    {/* Hiển thị số lượng (Opsional) */}
                    {/* <span className="text-gray-400 font-normal ml-1">({products.filter(...).length})</span> */}
                </li>
            ))}
        </ul>
      </div>

      {/* FILTER SEARCH */}
      <div className="bg-white p-5 shadow-sm mb-4">
         <div className="flex border border-gray-300 rounded-sm overflow-hidden max-w-lg focus-within:border-gray-500 transition-colors">
            <input 
                type="text" 
                placeholder="Tìm Tên sản phẩm, Mã ID..." 
                className="flex-1 px-3 py-2 outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-gray-100 px-4 hover:bg-gray-200 border-l border-gray-300 text-gray-600">
                <FaSearch/>
            </button>
         </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white shadow-sm rounded-sm overflow-hidden min-h-[400px] relative">
         {loading && (
             <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center text-[#ee4d2d]">
                 <FaSpinner className="animate-spin text-3xl mb-2"/>
                 <span className="text-sm font-medium">Đang tải dữ liệu...</span>
             </div>
         )}

         <div className="overflow-x-auto">
             <div className="min-w-[900px] grid grid-cols-12 bg-[#f6f6f6] text-gray-600 py-3 px-4 text-xs font-medium border-b border-gray-200 uppercase tracking-wide">
                 <div className="col-span-5 pl-2">Tên sản phẩm</div>
                 <div className="col-span-2 text-right">Phân loại hàng</div>
                 <div className="col-span-2 text-right">Giá</div>
                 <div className="col-span-1 text-right">Kho hàng</div>
                 <div className="col-span-2 text-center">Thao tác</div>
             </div>

             <div className="min-w-[900px]">
                 {filteredProducts.length > 0 ? (
                     filteredProducts.map((product) => (
                         <div key={product.id} className="grid grid-cols-12 border-b border-gray-100 hover:bg-gray-50 transition-colors py-4 px-4 items-center group">
                             
                             {/* 1. Tên + Ảnh */}
                             <div className="col-span-5 flex gap-3 items-start">
                                 <div className="w-14 h-14 shrink-0 border border-gray-200 rounded-sm bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                     <img 
                                         src={getImageUrl(product.imageUrl)} 
                                         alt={product.name} 
                                         className="w-full h-full object-cover"
                                         onError={(e) => e.target.src = 'https://placehold.co/50?text=No+Img'}
                                     />
                                     {/* Overlay nếu ẩn */}
                                     {product.hidden && (
                                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                             <FaEyeSlash />
                                         </div>
                                     )}
                                 </div>
                                 <div>
                                     <div className="text-sm text-gray-800 font-medium hover:text-[#ee4d2d] cursor-pointer line-clamp-2 leading-snug mb-1" title={product.name}>
                                          {/* Hiển thị Badge Status bên cạnh tên */}
                                          <div className="inline-block mr-1 align-middle">
                                            {renderStatusBadge(product)}
                                          </div>
                                          {product.name}
                                     </div>
                                     <div className="text-[11px] text-gray-400">Mã SP: {product.id}</div>
                                 </div>
                             </div>

                             {/* 2. Phân loại */}
                             <div className="col-span-2 text-right text-sm">
                                 {product.hasVariants ? (
                                     <div className="flex flex-col items-end gap-1">
                                         <span className="text-[#ee4d2d] bg-orange-50 px-2 py-0.5 rounded-full text-[10px] border border-orange-100 font-medium">
                                             {product.variant1Name} {product.variant2Name ? `& ${product.variant2Name}` : ''}
                                         </span>
                                         <span className="text-[11px] text-gray-500 line-clamp-1">
                                             {product.variants?.slice(0, 3).map(v => `${v.value1}`).join(', ')}...
                                         </span>
                                     </div>
                                 ) : (
                                     <span className="text-gray-400 italic">--</span>
                                 )}
                             </div>

                             {/* 3. Giá */}
                             <div className="col-span-2 text-right text-sm text-gray-700 font-medium">
                                 {getPriceDisplay(product)}
                             </div>

                             {/* 4. Kho */}
                             <div className="col-span-1 text-right text-sm text-gray-700">
                                 {calculateTotalStock(product)}
                             </div>

                             {/* 5. Thao tác */}
                             <div className="col-span-2 flex flex-col items-center gap-2">
                                 <button 
                                    onClick={() => setSelectedProductForReview(product)}
                                    className="text-yellow-600 text-xs hover:text-yellow-700 flex items-center gap-1 font-medium transition-colors"
                                 >
                                    <FaStar /> Đánh giá
                                 </button>

                                 <Link 
                                     to={`/seller/products/edit/${product.id}`} 
                                     className="text-blue-500 text-xs hover:underline flex items-center gap-1 font-medium"
                                 >       
                                     <FaEdit /> Sửa
                                 </Link>
                                 
                                 <button 
                                     onClick={() => handleDelete(product.id)}
                                     className="text-gray-500 text-xs hover:text-red-500 flex items-center gap-1 transition-colors"
                                 >
                                     <FaRegTrashAlt /> Xóa
                                 </button>
                             </div>

                         </div>
                     ))
                 ) : (
                     <div className="flex flex-col items-center justify-center py-20 bg-white">
                         <div className="bg-gray-100 p-4 rounded-full mb-3">
                            <FaBoxOpen className="text-4xl text-gray-300"/>
                         </div>
                         <span className="text-gray-500 font-medium">
                             {activeTab === 'all' ? 'Chưa có sản phẩm nào' : 'Không có sản phẩm trong mục này'}
                         </span>
                     </div>
                 )}
             </div>
         </div>
      </div>

      {/* MODAL */}
      {selectedProductForReview && (
          <ProductReviewsModal 
              productId={selectedProductForReview.id}
              productName={selectedProductForReview.name}
              onClose={() => setSelectedProductForReview(null)}
          />
      )}

    </div>
  );
};

export default ProductManagement;