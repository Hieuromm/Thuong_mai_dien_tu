import React, { useState } from 'react';
import { FaSearch, FaStore, FaCommentDots, FaTruck, FaFileInvoiceDollar } from 'react-icons/fa';
import Header from '../../../components/common/Header';
import ProfileSidebar from '../../../components/profile/ProfileSidebar';
import ReviewModal from '../../../components/modal/ReviewModal'; // Import Modal Đánh Giá
import { useMyPurchase } from '../../../hooks/buyer/account/useMyPurchase';
import { submitReviewAPI } from '../../../services/orderService'; // Import API Đánh Giá

const MyPurchase = () => {
  // 1. GỌI HOOK LOGIC
  const { 
    activeTab, 
    setActiveTab, 
    orders, 
    loading, 
    tabs, 
    handleCancelOrder,
    handleRequestReturn // Lấy hàm Yêu Cầu Trả Hàng
  } = useMyPurchase();

  // 2. STATE CHO MODAL ĐÁNH GIÁ
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);

  // Helper format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };


  const openReviewModal = (order) => {
    
      const item = order.items[0]; 
      console.log("Debug Item:", item);
      setSelectedOrderForReview(order.id);
      setSelectedProductForReview({
          id: item.productId, 
          name: item.name,
          image: item.image
      });
      setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async ({ rating, comment, image }) => {
      try {
          const formData = new FormData();
          formData.append('orderId', selectedOrderForReview);
          formData.append('productId', selectedProductForReview.id);
          formData.append('rating', rating);
          formData.append('comment', comment || '');
          
          if (image) {
              formData.append('image', image);
          }

          await submitReviewAPI(formData);
          
          alert("Cảm ơn bạn đã đánh giá sản phẩm!");
          setIsReviewModalOpen(false);
          // Có thể gọi hàm reload orders tại đây nếu cần cập nhật trạng thái nút
          
      } catch (error) {
          alert("Lỗi đánh giá: " + (error.response?.data || error.message));
      }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10">
        <Header />
        
        <div className="container mx-auto px-4 pt-5 grid grid-cols-12 gap-6">
            
            {/* SIDEBAR */}
            <div className="col-span-2 hidden md:block">
                <ProfileSidebar />
            </div>

            {/* MAIN CONTENT */}
            <div className="col-span-12 md:col-span-10">
                
                {/* TABS & SEARCH */}
                <div className="bg-white sticky top-0 z-30 shadow-sm rounded-sm mb-4">
                    <div className="flex text-sm text-gray-600 border-b overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <div 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 text-center py-4 px-4 cursor-pointer hover:text-[#110f0f] border-b-2 transition-colors whitespace-nowrap min-w-[120px]
                                    ${activeTab === tab.id ? 'border-[#1b1919] text-[#0c0b0b] font-medium' : 'border-transparent'}
                                `}
                            >
                                {tab.label}
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-4 bg-[#eaeaea]">
                        <div className="bg-white border rounded-sm flex items-center p-2 w-full shadow-sm">
                            <FaSearch className="text-gray-400 ml-2"/>
                            <input 
                                type="text" 
                                placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm" 
                                className="flex-1 px-3 outline-none text-sm w-full text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH ĐƠN HÀNG */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm">
                        <div className="w-8 h-8 border-4 border-[#1d1a19] border-t-transparent rounded-full animate-spin"></div>
                        <div className="mt-3 text-gray-500 text-sm">Đang tải đơn hàng...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white text-center py-24 rounded-sm shadow-sm flex flex-col items-center justify-center h-[400px]">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <FaFileInvoiceDollar className="text-gray-300 text-5xl" />
                        </div>
                        <div className="text-gray-800 font-medium text-lg">Chưa có đơn hàng</div>
                        <p className="text-gray-500 text-sm mt-1">Hãy đặt mua các sản phẩm yêu thích ngay thôi!</p>
                        <a href="/" className="mt-4 px-6 py-2 bg-[#1d1a19] text-white rounded-sm hover:opacity-90 transition-opacity">
                            Tiếp tục mua sắm
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white shadow-sm rounded-sm p-6 border border-transparent hover:border-gray-200 transition-all">
                                
                                {/* Header Order */}
                                <div className="flex justify-between items-start md:items-center border-b pb-4 mb-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[#111010] text-white text-[10px] font-bold px-1 py-0.5 rounded-sm">Yêu thích</span>
                                            <span className="font-bold text-sm text-gray-800">{order.shopName}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2 md:mt-0">
                                            <button className="bg-[#1a1716] text-white text-xs px-2 py-1 flex items-center gap-1 rounded-sm hover:opacity-90"><FaCommentDots/> Chat</button>
                                            <button className="border border-gray-300 text-gray-600 text-xs px-2 py-1 flex items-center gap-1 rounded-sm hover:bg-gray-50"><FaStore/> Xem Shop</button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-green-600 flex items-center gap-1 text-xs md:text-sm"><FaTruck className="text-lg"/> {order.deliveryText}</span>
                                            <div className="h-4 border-l border-gray-300 mx-1"></div>
                                            <span className="text-[#131110] uppercase font-medium">{order.statusText}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 border-b last:border-b-0 pb-4 last:pb-0 items-start">
                                            <div className="w-20 h-20 flex-shrink-0 border border-gray-200 rounded-sm overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover" alt={item.name}/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-base font-medium text-gray-800 line-clamp-2">{item.name}</div>
                                                <div className="text-gray-500 text-sm mt-1">Phân loại hàng: {item.variant}</div>
                                                <div className="text-gray-800 text-sm mt-1">x{item.quantity}</div>
                                            </div>
                                            <div className="text-right">
                                                {item.originalPrice > item.price && (
                                                    <span className="text-gray-400 line-through text-xs mr-2 block md:inline">{formatCurrency(item.originalPrice)}</span>
                                                )}
                                                <span className="text-[#1b1918] font-medium">{formatCurrency(item.price)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer & Actions */}
                                <div className="border-t border-dashed border-gray-300 pt-4 mt-4 bg-[#fffefb] -mx-6 px-6 -mb-6 pb-6 rounded-b-sm">
                                    <div className="flex flex-col items-end gap-4">
                                        
                                        <div className="flex items-center gap-2 text-base">
                                            <span className="text-gray-600">Thành tiền:</span>
                                            <span className="text-[#141212] text-2xl font-bold">{formatCurrency(order.totalPrice)}</span>
                                        </div>
                                        
                                        <div className="flex flex-wrap justify-end gap-2 md:gap-3 w-full">
                                            
                                            {/* Nút Hủy Đơn */}
                                            {order.canCancel && (
                                                <button 
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="min-w-[150px] px-4 py-2 bg-[#161514] text-white rounded-sm text-sm hover:opacity-90 transition-opacity font-medium"
                                                >
                                                    Hủy Đơn Hàng
                                                </button>
                                            )}

                                            {/* Nút Đánh Giá & Mua Lại */}
                                            {order.canRate && (
                                                <>
                                                    <button 
                                                        onClick={() => openReviewModal(order)} // Mở Modal Đánh Giá
                                                        className="min-w-[140px] px-4 py-2 bg-[#181615] text-white rounded-sm text-sm hover:opacity-90 font-medium"
                                                    >
                                                        Đánh Giá
                                                    </button>
                                                    <button className="min-w-[140px] px-4 py-2 border border-[#1a1818] text-[#201e1e] bg-[#ffeee8] rounded-sm text-sm hover:bg-[#fddacb] font-medium">
                                                        Mua Lại
                                                    </button>
                                                </>
                                            )}

                                            {/* Nút Yêu Cầu Trả Hàng */}
                                            {order.canReturn && (
                                                <button 
                                                    onClick={() => handleRequestReturn(order.id)} // Gửi yêu cầu trả hàng
                                                    className="min-w-[150px] px-4 py-2 border border-gray-300 text-gray-600 rounded-sm text-sm hover:bg-gray-50 hover:text-gray-800 font-medium"
                                                >
                                                    Yêu Cầu Trả Hàng
                                                </button>
                                            )}

                                            {/* Nút Chung */}
                                            <button className="min-w-[150px] px-4 py-2 border border-gray-300 text-gray-600 rounded-sm text-sm hover:bg-gray-50 hover:text-gray-800 font-medium">
                                                Liên Hệ Người Bán
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* --- MODAL ĐÁNH GIÁ (Render ở cuối) --- */}
        <ReviewModal 
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleSubmitReview}
            productName={selectedProductForReview?.name}
            productImage={selectedProductForReview?.image}
        />
    </div>
  );
};

export default MyPurchase;