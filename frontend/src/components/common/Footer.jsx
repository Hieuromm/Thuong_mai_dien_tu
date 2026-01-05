import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#fbfbfb] text-gray-600 border-t-4 border-[#1d1a19] pt-12 pb-6 text-sm">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          
          {/* Cột 1 */}
          <div>
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Chăm sóc khách hàng</h3>
             <ul className="space-y-2 text-xs">
                <li className="hover:text-[#1d1a19] cursor-pointer">Trung Tâm Trợ Giúp</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">BuyNow Blog</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">BuyNow Mall</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Hướng Dẫn Mua Hàng</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Thanh Toán</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">BuyNow Xu</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Vận Chuyển</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Trả Hàng & Hoàn Tiền</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Chăm Sóc Khách Hàng</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Chính Sách Bảo Hành</li>
             </ul>
          </div>

          {/* Cột 2 */}
          <div>
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Về BuyNow</h3>
             <ul className="space-y-2 text-xs">
                <li className="hover:text-[#1d1a19] cursor-pointer">Giới Thiệu Về BuyNow Việt Nam</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Tuyển Dụng</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Điều Khoản BuyNow</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Chính Sách Bảo Mật</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Chính Hãng</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Kênh Người Bán</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Flash Sale</li>
                <li className="hover:text-[#1d1a19] cursor-pointer">Chương Trình Tiếp Thị Liên Kết</li>
             </ul>
          </div>

          {/* Cột 3: Thanh toán  */}
          <div>
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Thanh toán</h3>
             <div className="flex gap-2 flex-wrap mb-4">
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1"><img src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8" alt="Visa"/></div>
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1"><img src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c55" alt="Mastercard"/></div>
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1"><img src="https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08" alt="JCB"/></div>
             </div>
             
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Đơn vị vận chuyển</h3>
             <div className="flex gap-2 flex-wrap">
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1 text-[8px] font-bold">SPX</div>
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1 text-[8px] font-bold">GHN</div>
                 <div className="w-12 h-6 bg-white border shadow-sm flex items-center justify-center p-1 text-[8px] font-bold">Viettel</div>
             </div>
          </div>

          {/* Cột 4: Theo dõi */}
          <div>
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Theo dõi chúng tôi trên</h3>
             <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 hover:text-[#0f0e0e] cursor-pointer"><FaFacebook /> Facebook</li>
                <li className="flex items-center gap-2 hover:text-[#141212] cursor-pointer"><FaInstagram /> Instagram</li>
                <li className="flex items-center gap-2 hover:text-[#161212] cursor-pointer"><FaLinkedin /> LinkedIn</li>
             </ul>
          </div>

          {/* Cột 5: Tải ứng dụng */}
          <div>
             <h3 className="font-bold text-gray-700 mb-4 text-xs uppercase">Tải ứng dụng BuyNow</h3>
             <div className="flex gap-3">
                 <div className="w-20 h-20 bg-white border shadow-sm p-1">
                     <img src="https://down-vn.img.susercontent.com/file/a5e589e8e118e937dc660f224b9a1472" className="w-full h-full object-contain" alt="QR Code"/>
                 </div>
                 <div className="flex flex-col justify-center gap-2">
                     <div className="w-20 h-6 bg-white border shadow-sm flex items-center justify-center text-[10px] cursor-pointer">App Store</div>
                     <div className="w-20 h-6 bg-white border shadow-sm flex items-center justify-center text-[10px] cursor-pointer">Google Play</div>
              
                 </div>
             </div>
          </div>

        </div>

    

      
      </div>
    </footer>
  );
};

export default Footer;