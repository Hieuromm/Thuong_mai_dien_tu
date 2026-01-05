import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaComments, FaStar, FaClock, FaUserFriends, FaShoppingBag } from 'react-icons/fa';

// Import các Components
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';

// Import Hooks và Services
import { useShopPage } from '../../../hooks/buyer/shop/useShopPage';
import { logShopVisit } from '../../../services/visitService';

const ShopPage = () => {
  // 1. Lấy shopId từ URL (Ví dụ: /shop/:shopId)
  const { shopId } = useParams();

  const { 
    shopInfo, products, vouchers, categories,
    activeTab, setActiveTab, loading,
    handleFollow, handleChat
  } = useShopPage(shopId);

  const fallbackImg = "https://via.placeholder.com/300?text=No+Image";

  // 2. Logic theo dõi lượt truy cập
  useEffect(() => {
    if (shopId && shopInfo) {
      // Gọi service để ghi nhận khách hàng đã vào trang chủ Shop
      logShopVisit(shopId, "SHOP_HOME")
        .then(() => console.log(`Logged visit for shop: ${shopId}`))
        .catch(err => console.error("Visit logging failed:", err));
    }
    // Chạy lại khi shopId thay đổi hoặc khi dữ liệu shop đã tải xong (shopInfo)
  }, [shopId, shopInfo]);

  // Giao diện khi đang tải
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center text-[#ee4d2d]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ee4d2d] mr-3"></div>
          Đang tải Shop...
        </div>
        <Footer />
      </div>
    );
  }

  // Giao diện khi không tìm thấy Shop
  if (!shopInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <img src="/not-found-shop.png" alt="Not found" className="w-40 opacity-50" />
          <p className="text-gray-500 text-lg">Shop không tồn tại hoặc đã bị khóa</p>
          <Link to="/" className="bg-[#ee4d2d] text-white px-6 py-2 rounded-sm">Về trang chủ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-6 flex-grow">
        
        {/* 1. SHOP INFO CARD (Header của Shop) */}
        <div className="bg-white rounded-sm shadow-sm mb-6 overflow-hidden">
           <div className="relative">
              {/* Background Cover mờ */}
              <div className="absolute inset-0 bg-gray-800/90 z-0">
                  <img 
                    src={shopInfo.cover || "/default-cover.jpg"} 
                    className="w-full h-full object-cover opacity-30 blur-sm" 
                    alt="cover" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
              </div>

              {/* Thông tin Avatar và Tên Shop */}
              <div className="relative z-10 p-5 flex flex-col md:flex-row gap-6 text-white">
                 <div className="flex-shrink-0 w-full md:w-[350px] bg-black/30 rounded p-4 flex gap-4 border border-white/20 backdrop-blur-md">
                    <div className="relative">
                       <img 
                          src={shopInfo.avatar} 
                          className="w-20 h-20 rounded-full border-2 border-white/50 bg-white object-cover" 
                          alt="avatar" 
                          onError={(e) => e.target.src = fallbackImg}
                       />
                       {shopInfo.isOfficial && (
                          <div className="absolute bottom-0 bg-[#ee4d2d] text-white text-[10px] px-1 w-full text-center rounded-sm font-bold uppercase">Mall</div>
                       )}
                    </div>
                    <div className="flex flex-col justify-center gap-2 flex-1">
                       <h1 className="font-bold text-lg leading-6 truncate">{shopInfo.name}</h1>
                       <div className="text-xs opacity-80 text-green-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          Đang hoạt động
                       </div>
                       <div className="flex gap-2 mt-1">
                          <button onClick={handleFollow} className="flex-1 border border-white text-white text-xs py-1.5 flex items-center justify-center gap-1 uppercase hover:bg-white/10 transition-all">
                             <FaPlus size={10}/> Theo dõi
                          </button>
                          <button onClick={handleChat} className="flex-1 border border-white text-white text-xs py-1.5 flex items-center justify-center gap-1 uppercase hover:bg-white/10 transition-all">
                             <FaComments size={12}/> Chat
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* Chỉ số thống kê (Stats) */}
                 <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-3 text-xs items-center">
                    <div className="flex items-center gap-2"><FaShoppingBag className="opacity-70"/> Sản Phẩm: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.products}</span></div>
                    <div className="flex items-center gap-2"><FaUserFriends className="opacity-70"/> Người Theo Dõi: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.followers.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2"><FaStar className="opacity-70"/> Đánh Giá: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.rating} (4.9/5)</span></div>
                    <div className="flex items-center gap-2"><FaUserFriends className="opacity-70"/> Đang Theo: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.following}</span></div>
                    <div className="flex items-center gap-2"><FaComments className="opacity-70"/> Tỉ Lệ Phản Hồi: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.chatPerformance}</span></div>
                    <div className="flex items-center gap-2"><FaClock className="opacity-70"/> Tham Gia: <span className="text-[#ee4d2d] font-bold">{shopInfo.stats.joined}</span></div>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. NAVIGATION TABS (Thanh danh mục sản phẩm của shop) */}
        <div className="bg-white shadow-sm mb-4 sticky top-0 z-20 overflow-x-auto">
           <div className="flex text-sm text-gray-600 container mx-auto min-w-max">
              {categories.map((cat) => (
                 <div 
                    key={cat.id} 
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-8 py-4 cursor-pointer hover:text-[#ee4d2d] border-b-2 transition-colors font-medium uppercase
                       ${activeTab === cat.id ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-transparent'}
                    `}
                 >
                    {cat.label}
                 </div>
              ))}
           </div>
        </div>

        {/* 3. VOUCHERS SECTION */}
        <div className="bg-white p-4 rounded-sm shadow-sm mb-4">
           <h3 className="text-gray-500 font-medium mb-4 uppercase text-sm">Mã giảm giá của Shop</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map((voucher) => (
                 <div key={voucher.id} className="bg-[#fff4f4] border border-[#fbd8d8] p-3 flex items-center justify-between rounded-sm relative overflow-hidden shadow-sm">
                    {/* Đường răng cưa trang trí bên trái */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ee4d2d] border-r border-dashed border-white"></div>
                    <div className="flex-1 pl-3">
                       <div className="text-[#ee4d2d] font-bold text-lg">Giảm {voucher.discount}</div>
                       <div className="text-xs text-gray-500">Đơn Tối Thiểu {voucher.minSpend}</div>
                       <div className="text-[10px] text-gray-400 mt-1 uppercase">HSD: {voucher.expiry}</div>
                    </div>
                    <button className="bg-[#ee4d2d] text-white text-xs px-4 py-1.5 rounded-sm hover:opacity-90 transition-opacity font-medium">Lưu</button>
                 </div>
              ))}
           </div>
        </div>

        {/* 4. PRODUCT LIST (Danh sách sản phẩm) */}
        <div className="bg-white p-4 rounded-sm shadow-sm">
           <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-gray-500 font-medium uppercase text-sm">Tất cả sản phẩm</h3>
              <div className="text-[#ee4d2d] text-xs cursor-pointer hover:underline flex items-center gap-1">
                Xem Tất Cả <span>&gt;</span>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {products.map((prod) => (
                 <Link to={`/product/${prod.id}`} key={prod.id} 
                       className="bg-white hover:border-[#ee4d2d] border border-transparent rounded-sm shadow-sm cursor-pointer overflow-hidden flex flex-col relative group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    
                    {/* Hình ảnh sản phẩm */}
                    <div className="relative w-full pt-[100%]">
                       <img src={prod.image} className="absolute top-0 left-0 w-full h-full object-cover" 
                            alt={prod.name} onError={(e) => e.target.src = fallbackImg}/>
                       
                       {/* Nhãn Mall / Giảm giá */}
                       {prod.isMall && <div className="absolute top-0 left-0 bg-[#d0011b] text-white text-[10px] px-1 rounded-br-sm font-bold z-10 uppercase">Mall</div>}
                       {prod.discount > 0 && (
                          <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 px-1 text-[10px] font-bold z-10 flex flex-col items-center">
                            <span>{prod.discount}%</span>
                            <span className="text-white text-[9px] -mt-1 uppercase">GIẢM</span>
                          </div>
                       )}
                    </div>

                    {/* Nội dung sản phẩm */}
                    <div className="p-2 flex flex-col justify-between flex-1">
                       <div className="text-xs text-gray-800 line-clamp-2 mb-2 h-8 leading-4">{prod.name}</div>
                       <div className="mt-auto">
                          <div className="flex items-center gap-1 h-4">
                             {prod.discount > 0 && (
                                 <div className="text-gray-400 line-through text-[10px]">₫{prod.originalPrice.toLocaleString()}</div>
                             )}
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="text-[#ee4d2d] font-bold text-sm">
                                <span className="text-xs underline align-top mr-0.5">₫</span>{prod.price.toLocaleString()}
                             </div>
                             <div className="text-[10px] text-gray-500">Đã bán {prod.sold}</div>
                          </div>
                       </div>
                    </div>
                 </Link>
              ))}
           </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;