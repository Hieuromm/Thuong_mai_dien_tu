import React, { useEffect, useState } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaStore, FaComments, FaCartPlus, FaUserCircle, FaRobot } from 'react-icons/fa';
import Header from '../../../components/common/Header'; 
import Footer from '../../../components/common/Footer'; 
import ProductCard from '../../../components/common/ProductCard'; // Component hiển thị item sản phẩm

// --- HOOKS & SERVICES ---
import { useProductDetail } from '../../../hooks/buyer/product/useProductDetail'; 
import { useChat } from '../../../hooks/common/useChat'; 
import { logVisit } from '../../../services/visitService'; 
import aiApi from '../../../services/aiApi'; // Import API AI

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const { openChatWithShop } = useChat();

  const {
    product, loading,
    reviews = [], 
    avgRating = 0, 
    totalReviews = 0,
    mainImage, setMainImage,
    selectedVariant1, setSelectedVariant1,
    selectedVariant2, setSelectedVariant2,
    currentPrice, currentStock,
    quantity, handleQuantityChange, handleAddToCart
  } = useProductDetail(id);

  // --- STATE DÀNH CHO AI ---
  const [similarProducts, setSimilarProducts] = useState([]);

  // --- 1. GHI NHẬN LƯỢT TRUY CẬP & TẢI SẢN PHẨM TƯƠNG TỰ ---
  useEffect(() => {
    if (!loading && product?.shop?.id) {
      // Ghi nhận hành vi để AI học
      logVisit(product.shop.id, id, "PRODUCT_DETAIL")
        .then(() => console.log("Ghi nhận lượt xem thành công"))
        .catch(err => console.error("Lỗi log visit:", err));
      
      // Tải sản phẩm tương tự từ AI Content-based Filtering
      const fetchSimilar = async () => {
        try {
            const data = await aiApi.getSimilarProducts(id);
            setSimilarProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải sản phẩm tương tự:", error);
        }
      };
      fetchSimilar();
    }
  }, [id, loading, product?.shop?.id]); 

  // --- 2. LOGIC XỬ LÝ MUA NGAY ---
  const handleBuyNow = () => {
    if (product.hasVariants) {
      if (product.variantGroups?.values1?.length > 0 && !selectedVariant1) {
        alert(`Vui lòng chọn ${product.variantGroups?.name1 || 'Phân loại'}`);
        return;
      }
      if (product.variantGroups?.values2?.length > 0 && !selectedVariant2) {
        alert(`Vui lòng chọn ${product.variantGroups?.name2 || 'Kích thước'}`);
        return;
      }
    }

    const buyNowData = [{
      shopId: product.shop?.id,
      shopName: product.shop?.name || 'Shop BuyNow',
      items: [{
        id: product.id,
        name: product.name,
        image: mainImage,
        price: currentPrice,
        quantity: quantity,
        classification: `${selectedVariant1 || ''}${selectedVariant1 && selectedVariant2 ? ', ' : ''}${selectedVariant2 || ''}` || 'Mặc định'
      }]
    }];

    localStorage.setItem('checkout_items', JSON.stringify(buyNowData));
    navigate('/checkout'); 
  };

  const renderStars = (rating) => {
    const safeRating = Number(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index} 
        className={index < Math.round(safeRating) ? "text-[#ee4d2d]" : "text-gray-300"} 
        size={14}
      />
    ));
  };

  const formatDate = (dateString) => {
    try {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'
        });
    } catch (e) { return ""; }
  };

  const handleChatNow = () => {
    if (!product) return;
    const shopData = { id: product.shop?.id, name: product.shop?.name, avatar: product.shop?.avatar };
    const productContext = { id: product.id, name: product.name, price: currentPrice, image: mainImage };
    openChatWithShop(shopData, productContext);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-[#ee4d2d] font-bold">Đang tải sản phẩm...</div>;
  if (!product) return <div className="min-h-screen flex justify-center items-center font-medium">Sản phẩm không tồn tại hoặc đã bị xóa.</div>;

  return (
    <div className="bg-[#f5f5f5] pb-10 min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-6 flex-grow">
        
        {/* PHẦN THÔNG TIN CHÍNH SẢN PHẨM */}
        <div className="bg-white p-4 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 mb-4 border border-gray-100">
          <div className="md:col-span-5">
              <div className="w-full pt-[100%] relative mb-4 border border-gray-50 overflow-hidden group">
                  <img src={mainImage} className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" alt="Main" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                  {product.images?.map((img, index) => (
                    <div key={index} 
                         className={`pt-[100%] relative border cursor-pointer hover:border-[#ee4d2d] transition-all ${mainImage === img ? 'border-[#ee4d2d]' : 'border-transparent'}`}
                         onMouseEnter={() => setMainImage(img)}
                    >
                        <img src={img} className="absolute top-0 left-0 w-full h-full object-cover" alt="Sub"/>
                    </div>
                  ))}
              </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-4">
              <h1 className="text-xl font-medium text-gray-800 leading-relaxed">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm divide-x divide-gray-200">
                <div className="flex items-center gap-1 text-[#ee4d2d]">
                    <span className="font-bold text-lg border-b border-[#ee4d2d]">{avgRating}</span><FaStar/>
                </div>
                <div className="pl-4 text-gray-500 underline">{totalReviews} Đánh Giá</div>
                <div className="pl-4 text-gray-500">{product.sold || 0} Đã Bán</div>
              </div>

              <div className="bg-[#fafafa] p-5 rounded-sm">
                <span className="text-[#ee4d2d] text-3xl font-medium">₫{currentPrice?.toLocaleString('vi-VN')}</span>
              </div>

              {product.hasVariants && product.variantGroups?.values1?.length > 0 && (
                  <div className="grid grid-cols-12 gap-2 text-sm items-center mt-4">
                      <div className="col-span-3 text-gray-500 capitalize">{product.variantGroups?.name1 || 'Phân loại'}</div>
                      <div className="col-span-9 flex flex-wrap gap-2">
                          {product.variantGroups.values1.map((val, idx) => (
                              <button key={idx} onClick={() => setSelectedVariant1(val)}
                                 className={`px-4 py-2 border rounded-sm transition-all ${selectedVariant1 === val ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white shadow-sm' : 'border-gray-200 hover:border-[#ee4d2d] text-gray-700'}`}>
                                  {val}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
              
              {product.hasVariants && product.variantGroups?.values2?.length > 0 && (
                  <div className="grid grid-cols-12 gap-2 text-sm items-center mt-2">
                      <div className="col-span-3 text-gray-500 capitalize">{product.variantGroups?.name2 || 'Kích thước'}</div>
                      <div className="col-span-9 flex flex-wrap gap-2">
                          {product.variantGroups.values2.map((val, idx) => (
                              <button key={idx} onClick={() => setSelectedVariant2(val)}
                                 className={`px-4 py-2 border rounded-sm transition-all ${selectedVariant2 === val ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white shadow-sm' : 'border-gray-200 hover:border-[#ee4d2d] text-gray-700'}`}>
                                  {val}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              <div className="grid grid-cols-12 gap-2 text-sm items-center mt-4">
                  <div className="col-span-3 text-gray-500">Số Lượng</div>
                  <div className="col-span-9 flex items-center gap-4">
                      <div className="flex border border-gray-300 rounded-sm overflow-hidden bg-white">
                          <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 flex items-center justify-center border-r hover:bg-gray-50 text-gray-600">-</button>
                          <input value={quantity} readOnly className="w-14 h-8 text-center outline-none border-none text-gray-800 font-medium"/>
                          <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 flex items-center justify-center border-l hover:bg-gray-50 text-gray-600">+</button>
                      </div>
                      <span className="text-gray-400 text-xs">{currentStock} sản phẩm có sẵn</span>
                  </div>
              </div>

              <div className="flex gap-4 mt-6">
                  <button onClick={handleAddToCart} className="flex-1 max-w-[220px] border border-[#ee4d2d] bg-[#ffeee8] text-[#ee4d2d] py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-[#fff5f1] transition-colors">
                      <FaCartPlus className="text-xl"/> <span>Thêm Vào Giỏ Hàng</span>
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 max-w-[220px] bg-[#ee4d2d] text-white py-3 rounded-sm hover:bg-[#d73211] transition-colors font-medium shadow-sm active:scale-95">
                    Mua Ngay
                  </button>
              </div>
          </div>
        </div>

        {/* THÔNG TIN SHOP */}
        <div className="bg-white p-6 rounded-sm shadow-sm mb-4 flex items-center gap-8 border border-gray-100">
            <div className="flex items-center gap-5 border-r pr-8">
                <div className="w-20 h-20 rounded-full border border-gray-100 overflow-hidden shadow-inner">
                    <img src={product.shop?.avatar || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="Shop" />
                </div>
                <div>
                    <div className="font-bold text-gray-800 text-lg">{product.shop?.name || 'Shop BuyNow'}</div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={handleChatNow} className="border border-[#ee4d2d] text-[#ee4d2d] bg-[#ffeee8] px-4 py-1.5 text-xs flex items-center gap-2 rounded-sm hover:bg-[#fff5f1] font-medium">
                            <FaComments/> Chat Ngay
                        </button>
                        <Link to={`/shop/${product.shop?.id}`} className="border border-gray-200 text-gray-600 px-4 py-1.5 text-xs flex items-center gap-2 rounded-sm hover:bg-gray-50 transition-colors"><FaStore/> Xem Shop</Link>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 flex-1 gap-y-4 text-sm px-4">
                <div className="text-gray-500">Đánh Giá: <span className="text-[#ee4d2d]">1.2k</span></div>
                <div className="text-gray-500">Tham Gia: <span className="text-[#ee4d2d]">6 tháng trước</span></div>
                <div className="text-gray-500">Sản Phẩm: <span className="text-[#ee4d2d]">{product.shop?.totalProducts || 88}</span></div>
            </div>
        </div>

        {/* MÔ TẢ SẢN PHẨM */}
        <div className="bg-white p-6 rounded-sm shadow-sm mb-4 border border-gray-100">
            <h3 className="bg-gray-50 p-4 text-lg text-gray-800 font-medium mb-6 uppercase tracking-tight">Chi Tiết Sản Phẩm</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line px-4 leading-loose">{product.description}</div>
        </div>

        {/* ĐÁNH GIÁ SẢN PHẨM */}
        <div className="bg-white p-6 rounded-sm shadow-sm mb-4 border border-gray-100">
            <h3 className="uppercase text-lg text-gray-800 font-medium mb-6">Đánh Giá Sản Phẩm</h3>
            <div className="bg-[#fffbf8] border border-[#f9ede5] p-8 mb-8 flex items-center gap-12 rounded-sm">
                <div className="text-center">
                    <div className="text-[#ee4d2d] text-4xl font-semibold mb-2">{avgRating} <span className="text-xl text-gray-400 font-normal">trên 5</span></div>
                    <div className="flex text-[#ee4d2d] text-xl justify-center">{renderStars(avgRating)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['Tất Cả', '5 Sao (1k)', '4 Sao (12)', '3 Sao (2)', '2 Sao (0)', '1 Sao (0)'].map(f => (
                        <button key={f} className={`px-5 py-1.5 text-sm border rounded-sm ${f==='Tất Cả' ? 'border-[#ee4d2d] text-[#ee4d2d] bg-white' : 'border-gray-200 bg-white text-gray-700 hover:border-[#ee4d2d]'}`}>{f}</button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8">
                {(!reviews || reviews.length === 0) ? (
                    <div className="text-center text-gray-400 py-12 italic border-t border-dashed">Chưa có đánh giá nào cho sản phẩm này.</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="flex gap-5 border-b border-gray-50 pb-8 last:border-none">
                            <div className="w-12 h-12 shrink-0 shadow-sm rounded-full overflow-hidden">
                                {review.user?.avatar ? 
                                    <img src={review.user.avatar} className="w-full h-full object-cover" alt="User"/> : 
                                    <FaUserCircle className="w-full h-full text-gray-200"/>
                                }
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-gray-900 font-bold mb-1">{review.user?.fullName || "Người dùng ẩn danh"}</div>
                                <div className="flex text-[#ee4d2d] text-xs mb-2">{renderStars(review.rating)}</div>
                                <div className="text-[11px] text-gray-400 mb-4">{formatDate(review.createdAt)}</div>
                                <div className="text-sm text-gray-700 mb-4 whitespace-pre-line leading-relaxed">{review.content || review.comment}</div>
                                {review.images?.length > 0 && (
                                  <div className="flex gap-2 mb-4">
                                      {review.images.map((rImg, rIdx) => (
                                          <img key={rIdx} src={rImg} className="w-16 h-16 object-cover border rounded-sm" alt="Review"/>
                                      ))}
                                  </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* [MỚI] SẢN PHẨM TƯƠNG TỰ - Giao diện rộng rãi */}
        {similarProducts.length > 0 && (
          <div className="bg-white p-6 rounded-sm shadow-sm mb-4 border border-gray-100 mt-6">
              <h3 className="text-gray-500 font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FaRobot className="text-[#ee4d2d] animate-pulse" /> CÓ THỂ BẠN CŨNG THÍCH
              </h3>
              
              {/* Grid 6 cột rộng rãi đồng bộ với thiết kế Shop */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {similarProducts.map((item) => (
                      <ProductCard key={item.id} product={item} />
                  ))}
              </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;