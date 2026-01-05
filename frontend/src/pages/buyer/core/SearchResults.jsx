// src/pages/buyer/core/SearchResults.jsx
import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import { useSearchResults } from '../../../hooks/buyer/core/useSearchResults';

const SearchResults = () => {
  const navigate = useNavigate();
  const { keyword, results, loading, sortBy, setSortBy, filters, updateFilters } = useSearchResults();


  const [tempPrice, setTempPrice] = useState({ min: '', max: '' });


  const categoryList = [
    { id: 'Đồ chơi', name: 'Đồ chơi' },
    { id: 'Gia dụng', name: 'Điện Thoại & Phụ Kiện' },
    { id: 'Trang trí', name: 'Trang trí' },
    { id: 'Chén bát', name: 'Chén bát' },
    { id: 'Trang trí', name: 'Thiết Bị Điện Tử' }
  ];

  const handleCategoryToggle = (id) => {
    const newCats = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id];
    updateFilters({ categories: newCats });
  };

  const handleApplyPrice = () => {
    updateFilters({
      minPrice: tempPrice.min !== '' ? Number(tempPrice.min) : null,
      maxPrice: tempPrice.max !== '' ? Number(tempPrice.max) : null
    });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
           <span className="text-black cursor-pointer hover:text-orange-600" onClick={() => navigate('/')}>Trang chủ</span> 
           &gt; <span>Kết quả tìm kiếm cho '{keyword}'</span>
        </div>

        <div className="grid grid-cols-12 gap-6">
           {/* SIDEBAR */}
           <div className="col-span-2 hidden md:block">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-4 text-sm uppercase">
                 <FaFilter/> Bộ lọc tìm kiếm
              </div>
              
              <div className="mb-6">
                 <h4 className="text-sm font-medium mb-3">Theo Danh Mục</h4>
                 <div className="flex flex-col gap-2 text-sm text-gray-600 pl-2">
                    {categoryList.map(cat => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                        <input 
                          type="checkbox"
                          checked={filters.categories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          className="w-4 h-4 accent-black"
                        /> 
                        {cat.name}
                      </label>
                    ))}
                 </div>
              </div>

              <div className="mb-6 border-t pt-4">
                 <h4 className="text-sm font-medium mb-3">Khoảng Giá</h4>
                 <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="number" 
                      placeholder="₫ TỪ" 
                      className="w-full border px-2 py-1.5 text-xs outline-none focus:border-black"
                      value={tempPrice.min}
                      onChange={(e) => setTempPrice({...tempPrice, min: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="₫ ĐẾN" 
                      className="w-full border px-2 py-1.5 text-xs outline-none focus:border-black"
                      value={tempPrice.max}
                      onChange={(e) => setTempPrice({...tempPrice, max: e.target.value})}
                    />
                 </div>
                 <button 
                  onClick={handleApplyPrice}
                  className="w-full bg-black text-white text-xs py-2 uppercase rounded-sm hover:opacity-80 transition-all font-bold"
                 >
                   Áp dụng
                 </button>
              </div>
           </div>

           {/* MAIN CONTENT */}
           <div className="col-span-12 md:col-span-10">
              <div className="bg-[#ededed] p-3 rounded-sm flex items-center gap-4 text-sm mb-4">
                 <span className="text-gray-600">Sắp xếp theo</span>
                 <button 
                    onClick={() => setSortBy('relevance')}
                    className={`px-4 py-2 rounded-sm ${sortBy === 'relevance' ? 'bg-black text-white' : 'bg-white'}`}
                 >Liên Quan</button>
                 <button 
                    onClick={() => setSortBy('latest')}
                    className={`px-4 py-2 rounded-sm ${sortBy === 'latest' ? 'bg-black text-white' : 'bg-white'}`}
                 >Mới Nhất</button>
                 <button 
                    onClick={() => setSortBy('sales')}
                    className={`px-4 py-2 rounded-sm ${sortBy === 'sales' ? 'bg-black text-white' : 'bg-white'}`}
                 >Bán Chạy</button>
                 
                 <select 
                    className="bg-white px-4 py-2 rounded-sm outline-none cursor-pointer min-w-[150px]"
                    onChange={(e) => setSortBy(e.target.value)}
                    value={sortBy.includes('price') ? sortBy : ''}
                 >
                    <option value="" disabled>Giá</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                 </select>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <p className="mt-2 text-gray-500">Đang tìm kiếm...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white shadow-sm">
                   <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/search/a60759ad1dabe909c46a.png" className="w-24 mb-4" alt="empty"/>
                   <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                   {results.map((item) => (
                      <div 
                         key={item.id} 
                         onClick={() => navigate(`/product/${item.id}`)}
                         className="bg-white border border-transparent hover:border-black rounded-sm shadow-sm cursor-pointer overflow-hidden flex flex-col group transition-all"
                      >
                         <div className="relative pt-[100%]">
                            <img src={item.image} className="absolute top-0 left-0 w-full h-full object-cover" alt={item.name}/>
                            {item.discount > 0 && (
                               <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 px-1 text-[10px] font-bold">-{item.discount}%</div>
                            )}
                         </div>
                         <div className="p-2 flex flex-col flex-1">
                            <div className="text-xs text-gray-800 line-clamp-2 mb-2 h-8">{item.name}</div>
                            <div className="mt-auto">
                               <div className="flex justify-between items-center mb-1">
                                  <div className="text-black font-bold text-sm">
                                     ₫{item.price.toLocaleString()}
                                  </div>
                                  <div className="text-[10px] text-gray-500">Đã bán {item.sold}</div>
                               </div>
                               <div className="text-[10px] text-gray-400 text-right italic">{item.location}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;