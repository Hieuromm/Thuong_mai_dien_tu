// src/pages/buyer/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaTicketAlt } from 'react-icons/fa';
import { useCart } from '../../../hooks/buyer/checkout/useCart'; 

const Cart = () => {
  const navigate = useNavigate();
  const handleBuy = () => {
      // 1. Lọc ra các shop và sản phẩm được chọn
      const selectedItemsToBuy = cartItems.map(shop => ({
          ...shop,
          items: shop.items.filter(item => item.checked) // Chỉ lấy item có checked = true
      })).filter(shop => shop.items.length > 0); // Loại bỏ shop không có item nào được chọn

      // 2. Kiểm tra
      if (selectedItemsToBuy.length === 0) {
          alert("Bạn chưa chọn sản phẩm nào để mua!");
          return;
      }

      // 3. Chuyển hướng và GỬI KÈM DỮ LIỆU (state)
      navigate('/checkout', { state: { checkoutData: selectedItemsToBuy } });
  };
  // Lấy dữ liệu và hàm từ Hook
  const {
    cartItems,
    handleQuantityChange,
    handleDelete,
    handleCheckItem,
    handleCheckAll,
    totalAmount,
    totalCount,
    isAllChecked
  } = useCart();

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-[100px] flex items-center justify-between">
          <div className="flex items-end gap-4">
            <Link to="/" className="text-[#292626] text-3xl font-bold italic">BuyNow</Link>
            <span className="text-xl text-[#332e2d] border-l border-[#383636] pl-4 leading-6">Giỏ Hàng</span>
          </div>
          <div className="w-[600px] flex">
            <input 
              type="text" 
              placeholder="Săn Deal Siêu Rẻ 12.12" 
              className="flex-1 border-2 border-[#272423] px-4 py-2 outline-none rounded-l-sm"
            />
            <button className="bg-[#221f1f] px-8 py-2 rounded-r-sm hover:opacity-90">
              <FaSearch className="text-white text-lg"/>
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="container mx-auto px-4 pt-5">
        
        {/* Banner FreeShip */}
        <div className="bg-[#fffefb] border border-[#fddbc8] p-3 mb-3 flex items-center gap-2 text-sm rounded-sm">
           <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/d9e992985b18d96aab90.png" width={24} alt="freeship" />
           <span>Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển bạn nhé!</span>
        </div>

        {/* Header Bảng */}
        <div className="bg-white py-4 px-10 grid grid-cols-12 text-sm text-gray-500 shadow-sm rounded-sm mb-3 items-center">
           <div className="col-span-6 flex items-center gap-4">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#27201f] cursor-pointer" 
                checked={isAllChecked}
                onChange={(e) => handleCheckAll(e.target.checked)}
              />
              <span>Sản Phẩm</span>
           </div>
           <div className="col-span-2 text-center">Đơn Giá</div>
           <div className="col-span-2 text-center">Số Lượng</div>
           <div className="col-span-1 text-center">Số Tiền</div>
           <div className="col-span-1 text-center">Thao Tác</div>
        </div>

        {/* Danh sách Shop & Sản phẩm */}
        {cartItems.map((shop) => (
          <div key={shop.id} className="bg-white mb-3 shadow-sm rounded-sm">
             {/* Shop Header */}
             <div className="p-4 border-b flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 accent-[#292524]"/>
                <span className="font-bold text-sm">{shop.shopName}</span>
                <div className="bg-[#131111] text-white text-[10px] px-1 rounded-sm cursor-pointer">Chat ngay</div>
             </div>

             {/* Items Loop */}
             {shop.items.map((item) => (
               <div key={item.id} className="px-4 py-4 grid grid-cols-12 items-center border-b last:border-b-0 text-sm">
                  
                  {/* Cột 1: Thông tin SP */}
                  <div className="col-span-6 flex gap-3 items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-[#1b1817] cursor-pointer"
                        checked={item.checked || false}
                        onChange={() => handleCheckItem(shop.id, item.id)}
                      />
                      <img src={item.image} className="w-20 h-20 object-cover border" alt={item.name}/>
                      <div className="flex flex-col gap-1 pr-4">
                         <div className="line-clamp-2">{item.name}</div>
                         <div className="w-fit text-xs text-gray-500 border border-[#242222] px-1 text-[#ee4d2d]">Đổi ý miễn phí 15 ngày</div>
                         <img src="https://down-vn.img.susercontent.com/file/vn-50009109-c024fa8994793467610029b9e5904df8" className="h-4 w-fit mt-1" alt="badge"/>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs cursor-pointer">
                         Phân loại: {item.classification} ▼
                      </div>
                  </div>

                  {/* Cột 2: Giá */}
                  <div className="col-span-2 text-center flex flex-col items-center justify-center">
                      <span className="line-through text-gray-400 text-xs">₫{item.originalPrice.toLocaleString()}</span>
                      <span className="text-sm font-medium">₫{item.price.toLocaleString()}</span>
                  </div>

                  {/* Cột 3: Số lượng */}
                  <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                          <button 
                             onClick={() => handleQuantityChange(shop.id, item.id, -1)}
                             className="px-3 py-1 border-r hover:bg-gray-100"
                          >-</button>
                          <input 
                             type="text" 
                             value={item.quantity} 
                             className="w-12 text-center outline-none" 
                             readOnly
                          />
                          <button 
                             onClick={() => handleQuantityChange(shop.id, item.id, 1)}
                             className="px-3 py-1 border-l hover:bg-gray-100"
                          >+</button>
                      </div>
                  </div>

                  {/* Cột 4: Thành tiền */}
                  <div className="col-span-1 text-center text-[#141313] font-medium">
                      ₫{(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Cột 5: Thao tác */}
                  <div className="col-span-1 text-center flex flex-col gap-2">
                      <span 
                        className="hover:text-[#221e1d] cursor-pointer"
                        onClick={() => handleDelete(shop.id, item.id)}
                      >Xóa</span>
                      <span className="text-[#1b1918] text-xs cursor-pointer flex items-center justify-center gap-1">
                          Tìm sản phẩm tương tự ▼
                      </span>
                  </div>
               </div>
             ))}

             {/* Shop Voucher */}
             <div className="p-3 border-t flex items-center gap-2 text-[#242121] text-sm cursor-pointer hover:bg-gray-50">
                 <FaTicketAlt /> Thêm mã giảm giá của Shop
             </div>
          </div>
        ))}

      </main>

      {/* FOOTER STICKY */}
      <div className="sticky bottom-0 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 mt-6">
          <div className="container mx-auto px-4 py-4 grid grid-cols-12 items-center">
             
             <div className="col-span-6 flex items-center gap-6 text-sm">
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#201c1b] cursor-pointer" 
                      checked={isAllChecked}
                      onChange={(e) => handleCheckAll(e.target.checked)}
                    />
                    <button className="hover:text-[#201c1b]" onClick={() => handleCheckAll(!isAllChecked)}>
                      Chọn Tất Cả ({cartItems.reduce((acc, s) => acc + s.items.length, 0)})
                    </button>
                 </div>
                 <button className="hover:text-[#292423]">Xóa</button>
                 <button className="hover:text-[#27211f] text-[#181615]">Lưu vào mục Đã thích</button>
             </div>

             <div className="col-span-6 flex justify-end items-center gap-4">
                 <div className="flex flex-col items-end">
                     <div className="flex items-center gap-2 text-base">
                         <span>Tổng thanh toán ({totalCount} sản phẩm):</span>
                         <span className="text-[#1d1919] text-2xl font-medium">₫{totalAmount.toLocaleString()}</span>
                     </div>
                     <div className="text-xs text-green-600">Tiết kiệm ₫0</div>
                 </div>
                 <button 
                    onClick={handleBuy}
                    className="bg-[#463f3e] text-white w-48 py-3 text-sm rounded-sm hover:opacity-90 uppercase font-medium"
                 >
                     Mua Hàng
                 </button>
             </div>

          </div>
      </div>

    </div>
  );
};

export default Cart;