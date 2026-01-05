import React, { useRef } from 'react';
import Slider from 'react-slick';
// Import đầy đủ các icons cần thiết
import { 
  FaBoxOpen, FaFire, FaRobot, FaArrowTrendUp, FaArrowTrendDown, FaStar, 
  FaTicketSimple, FaHeadset, FaPhoneVolume, FaNewspaper 
} from 'react-icons/fa6'; 

// Import Components
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer'; 
import { useHome } from '../../../hooks/buyer/core/useHome'; 

// Import hình ảnh
import subBanner1 from '../../../assets/d4334724-098e-44ea-a01b-3e0a5684880e.png';
import Banner1 from '../../../assets/banner1.jpg';
import Banner2 from '../../../assets/banner2.jpg';
import Banner3 from '../../../assets/banner3.jpg';
import Banner4 from '../../../assets/banner4.jpg';
import Banner5 from '../../../assets/banner5.jpg';

const IMAGE_BASE_URL = "http://localhost:8080/uploads/products/"; 
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/200x200?text=No+Image";

const Home = () => {
  const {
    loading,
    categories,      
    topProducts,
    globalTrending, 
    suggested,       
    categoryTrends, 
    sliderSettings,
    handleProductClick,
    handleCategoryClick, 
    fetchAllProducts      
  } = useHome();

  const suggestedRef = useRef(null);

  const getProductImage = (imgName) => {
    if (!imgName) return PLACEHOLDER_IMAGE;
    if (imgName.startsWith('http')) return imgName;
    let fullPath = `${IMAGE_BASE_URL}/${imgName}`;
    return fullPath.replace(/([^:]\/)\/+/g, "$1");
  };

  const onCategoryClick = (catName) => {
    if (catName === 'ALL') {
        fetchAllProducts();
    } else {
        handleCategoryClick(catName);
    }
    if (suggestedRef.current) {
        const y = suggestedRef.current.getBoundingClientRect().top + window.scrollY - 140;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center text-[#141313]">
      <div className="w-12 h-12 border-4 border-[#201b1a] border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="font-bold text-lg italic animate-pulse">BuyNow...</div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="bg-[#f5f5f5] pb-10 flex-grow">
        <div className="w-full pt-8">
          
          {/* BANNER SECTION */}
          <div className="container mx-auto px-4 mb-6">
             <div className="grid grid-cols-3 gap-1">
                <div className="col-span-2 rounded-sm overflow-hidden shadow-sm relative group">
                    <Slider {...sliderSettings.banner}>
                        <img src={Banner1} className="w-full h-[235px] object-cover" alt="banner-1" />
                        <img src={Banner2} className="w-full h-[235px] object-cover" alt="banner-2" />
                        <img src={Banner3} className="w-full h-[235px] object-cover" alt="banner-3" />
                        <img src={Banner4} className="w-full h-[235px] object-cover" alt="banner-4" />
                    </Slider>
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                   <img src={subBanner1} className="h-[115px] w-full object-cover rounded-sm" alt="banner-sub"/>
                   <img src={Banner5} className="h-[115px] w-full object-cover rounded-sm" alt="banner-sub"/>
                </div>
             </div>
          </div>

          <div className="flex justify-between gap-0 w-full relative">
            
            <aside className="w-[180px] flex-shrink-0 sticky top-[170px] h-fit pl-4 z-30 hidden md:block">
                <div className="bg-white rounded-sm shadow-sm p-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                    <div className="text-gray-500 font-bold mb-3 text-xs uppercase tracking-wider border-b pb-2">
                      Danh Mục
                    </div>
                    <div className="flex flex-col gap-3">
                        <div 
                          onClick={() => onCategoryClick('ALL')}
                          className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors"
                        >
                          <div className="w-[35px] h-[35px] border border-orange-100 rounded-md bg-orange-50 flex items-center justify-center group-hover:shadow-sm">
                              <span className="text-[#161514] font-bold text-[8px] uppercase">All</span>
                          </div>
                          <span className="text-[12px] text-gray-700 font-medium group-hover:text-[#141313]">Tất cả</span>
                        </div>

                        {categories.map((catName, index) => {
                            const trend = categoryTrends[catName];
                            return (
                                <div 
                                  key={index} 
                                  onClick={() => onCategoryClick(catName)}
                                  className="flex items-center gap-2 cursor-pointer group relative hover:bg-gray-50 p-1 rounded transition-colors mt-1" // Thêm mt-1 để các badge không đè lên nhau quá nhiều
                                >
                                    {/* --- PHẦN CODE BẠN YÊU CẦU THÊM VÀO --- */}
                                    {trend === "TĂNG" && (
                                       <div className="absolute -top-2 -right-1 z-10 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-bounce shadow-sm">
                                           <FaArrowTrendUp size={8}/> HOT
                                       </div>
                                    )}
                                    {trend === "NEW" && (
                                       <div className="absolute -top-2 -right-1 z-10 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                           NEW
                                       </div>
                                    )}
                                    {trend === "GIẢM" && (
                                       <div className="absolute -top-2 -right-1 z-10 bg-blue-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm opacity-80">
                                           <FaArrowTrendDown size={8}/> ỔN ĐỊNH
                                       </div>
                                    )}
                                    {/* -------------------------------------- */}

                                    <div className={`w-[35px] h-[35px] border rounded-md flex items-center justify-center group-hover:shadow-sm ${trend === "TĂNG" ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                                       <FaBoxOpen className={`text-base ${trend === "TĂNG" ? 'text-red-400' : 'text-gray-400'} group-hover:text-[#ee4d2d]`} />
                                    </div>
                                    <span className="text-[12px] text-gray-700 font-medium line-clamp-2 leading-3 flex-1 group-hover:text-[#ee4d2d]">
                                      {catName}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* 2. CỘT GIỮA: NỘI DUNG CHÍNH */}
            <div className="flex-1 flex justify-center px-4 min-w-0">
                <div className="w-full max-w-[1200px]">
                    
                    {/* Top Visited */}
                    <div className="bg-white p-5 rounded-sm shadow-sm mb-6 border-t-2 border-[#ee4d2d]">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                           <div className="text-base font-bold text-[#1d1b1a] uppercase italic flex items-center gap-2">
                              <FaFire className="animate-pulse" /> Tìm Kiếm Hàng Đầu
                           </div>
                        </div>
                        <div className="px-2"> 
                           {topProducts.length > 0 ? (
                             <Slider {...sliderSettings.topProduct}>
                                {topProducts.map((item) => (
                                   <div key={item.id} className="px-2 cursor-pointer group" onClick={() => handleProductClick(item.id)}>
                                      <div className="relative rounded-sm overflow-hidden bg-gray-50 aspect-square">
                                         <div className="absolute top-0 left-0 z-20">
                                            <div className="bg-[#1d1a1a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-sm">HOT</div>
                                         </div>
                                         <img 
                                             src={getProductImage(item.imageUrl)} 
                                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                             alt={item.name}
                                             onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                                         />
                                      </div>
                                      <div className="mt-2 text-sm text-gray-700 font-medium line-clamp-2 text-center h-10 group-hover:text-[#1d1b1b]">
                                         {item.name}
                                      </div>
                                   </div>
                                ))}
                             </Slider>
                           ) : (
                             <div className="text-center py-10 text-gray-400 text-sm italic">Chưa có xu hướng tìm kiếm hôm nay</div>
                           )}
                        </div>
                    </div>

                    {/* Top Selling */}
                    <div className="bg-white p-5 rounded-sm shadow-sm mb-6 border-t-2 border-yellow-400">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                           <div className="text-base font-bold text-yellow-500 uppercase italic flex items-center gap-2">
                              <FaStar className="animate-spin-slow" /> Top Bán Chạy
                           </div>
                        </div>
                        <div className="px-2"> 
                           {globalTrending && globalTrending.length > 0 ? (
                             <Slider {...sliderSettings.topProduct}>
                                {globalTrending.map((item) => (
                                   <div key={item.id} className="px-2 cursor-pointer group" onClick={() => handleProductClick(item.id)}>
                                      <div className="relative rounded-sm overflow-hidden bg-gray-50 aspect-square border border-yellow-100">
                                         <div className="absolute top-0 left-0 z-20">
                                            <div className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-sm shadow-sm">TOP</div>
                                         </div>
                                         <img 
                                             src={getProductImage(item.imageUrl)} 
                                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                             alt={item.name}
                                             onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                                         />
                                      </div>
                                      <div className="mt-2 text-sm text-gray-700 font-medium line-clamp-2 text-center h-10 group-hover:text-[#141313]">
                                         {item.name}
                                      </div>
                                      <div className="text-center text-[#0c0b0a] font-bold text-sm">
                                         ₫{item.price?.toLocaleString()}
                                      </div>
                                   </div>
                                ))}
                             </Slider>
                           ) : (
                             <div className="text-center py-10 text-gray-400 text-sm italic">Đang cập nhật...</div>
                           )}
                        </div>
                    </div>

                    {/* AI Suggested */}
                    <div ref={suggestedRef} className="sticky top-[135px] z-20 bg-[#f5f5f5] mb-2">
                        <div className="py-3 text-[#11100f] font-bold bg-white border-b-4 border-[#222020] cursor-pointer uppercase flex items-center justify-center gap-2 shadow-sm rounded-sm">
                           <FaRobot className="animate-bounce" /> Gợi ý dành riêng cho bạn
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {suggested && suggested.length > 0 ? (
                          suggested.map((item) => (
                            <div 
                              key={item.id} 
                              onClick={() => handleProductClick(item.id)} 
                              className="bg-white hover:border-[#131211] border border-transparent rounded-sm shadow-sm cursor-pointer overflow-hidden flex flex-col relative group transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                              <div className="absolute top-0 right-0 z-10">
                                  <div className="bg-[#feeeea] text-[#0f0e0e] text-[9px] px-1 border border-[#1a1717] rounded-bl-sm font-bold flex items-center gap-1">
                                     <FaRobot size={8}/> AI
                                  </div>
                              </div>
                              <div className="relative w-full pt-[100%] bg-gray-100">
                                  <img 
                                      src={getProductImage(item.imageUrl)} 
                                      className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                      alt={item.name}
                                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE }}
                                  />
                              </div>
                              <div className="p-2 flex flex-col justify-between flex-1">
                                  <div className="text-[12px] text-gray-800 line-clamp-2 mb-2 h-8 leading-4 group-hover:text-[#080808]">{item.name}</div>
                                  <div className="flex items-center justify-between">
                                      <div className="text-[#11100f] font-bold text-base">
                                          <span className="text-xs underline align-top">₫</span>
                                          {item.price?.toLocaleString()}
                                      </div>
                                  </div>
                                  <div className="text-[10px] text-gray-500 mt-2 flex justify-between items-center border-t border-gray-50 pt-2">
                                    <span>Kho: {item.stock}</span>
                                    <span className="bg-gray-100 px-1 rounded">Đã bán {item.id + 20}+</span>
                                  </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-sm border border-dashed border-gray-300">
                            <FaBoxOpen className="text-5xl text-gray-200 mb-4" />
                            <p className="text-gray-400 text-sm italic">AI đang tìm kiếm sản phẩm...</p>
                          </div>
                        )}
                    </div>
                    
                    <div className="mt-10 text-center pb-10">
                        <button onClick={fetchAllProducts} className="bg-white border border-[#111010] text-[#1a1616] px-12 py-2.5 hover:bg-[#feeeea] rounded-sm shadow-sm transition-all text-sm font-bold uppercase tracking-wide">
                          Xem thêm
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. SIDEBAR PHẢI: MÃ GIẢM GIÁ & TIN TỨC */}
            <aside className="w-[180px] flex-shrink-0 sticky top-[170px] h-fit pr-4 hidden xl:block z-30">
                <div className="flex flex-col gap-4">
                    
                    {/* WIDGET 1: Mã Giảm Giá */}
                    <div className="bg-white rounded-sm shadow-sm p-3">
                        <div className="flex items-center gap-2 text-[#131111] font-bold text-xs uppercase mb-3 border-b border-gray-100 pb-2">
                           <FaTicketSimple /> Mã giảm giá
                        </div>
                        <div className="flex flex-col gap-2">
                           <div className="border border-[#141312] bg-[#feeeea] p-2 rounded relative overflow-hidden group cursor-pointer">
                              <div className="text-[10px] text-[#141312] font-bold">GIẢM 50%</div>
                              <div className="text-[9px] text-gray-600">Đơn từ 0đ</div>
                              <div className="mt-1 bg-[#1f1c1b] text-white text-[9px] text-center rounded py-0.5 hover:bg-red-600 transition-colors">Lưu</div>
                              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                           </div>
                           <div className="border border-blue-400 bg-blue-50 p-2 rounded relative overflow-hidden group cursor-pointer">
                              <div className="text-[10px] text-blue-600 font-bold">FREESHIP</div>
                              <div className="text-[9px] text-gray-600">Tối đa 15k</div>
                              <div className="mt-1 bg-blue-500 text-white text-[9px] text-center rounded py-0.5 hover:bg-blue-600 transition-colors">Lưu</div>
                              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                           </div>
                        </div>
                    </div>

               
                    <div className="bg-white rounded-sm shadow-sm p-3">
                        <div className="flex items-center gap-2 text-gray-700 font-bold text-xs uppercase mb-3 border-b border-gray-100 pb-2">
                           <FaNewspaper className="text-blue-500"/> Góc chia sẻ
                        </div>
                        
                        <div className="flex flex-col gap-3">
                       
                           <div className="group cursor-pointer">
                              <div className="h-24 rounded overflow-hidden relative mb-2">
                                  <img src={Banner2} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="blog"/>
                                  <div className="absolute bottom-0 left-0 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-tr-sm">Mẹo vặt</div>
                              </div>
                              <div className="text-[11px] font-bold leading-4 group-hover:text-[#1a1818] transition-colors mb-1">
                                  5 Cách phối đồ cực chất cho mùa hè 2025
                              </div>
                              <div className="text-[9px] text-gray-400">2 giờ trước • 1.5k lượt xem</div>
                           </div>
                           
                        </div>
                    </div>

                     <div className="bg-white rounded-sm shadow-sm p-3 text-center">
                        <div className="text-gray-500 text-[10px] mb-2">Cần hỗ trợ?</div>
                        <button className="flex items-center justify-center gap-2 w-full bg-green-500 text-white text-[10px] font-bold py-1.5 rounded hover:bg-green-600 transition-colors">
                           <FaHeadset /> Chat Ngay
                        </button>
                        <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-gray-600 font-bold">
                           <FaPhoneVolume className="text-[#ee4d2d]"/> 1900 1234
                        </div>
                     </div>

                </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;