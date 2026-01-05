import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Header from '../../../components/common/Header';
import ProfileSidebar from '../../../components/profile/ProfileSidebar';
import { useMyBanks } from '../../../hooks/buyer/account/useMyBanks';
import AddBankModal from '../../../components/profile/AddBankModal'; // Import Modal Mới

const MyBanks = () => {
  const { 
    banks, 
    loading, 
    deleteBank, 
    setDefaultBank,
    addBank // Hàm này giờ nhận object, không bật prompt nữa
  } = useMyBanks();

  // State quản lý đóng/mở Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hàm xử lý khi bấm nút "Hoàn Thành" trong Modal
  const handleSaveBank = async (bankData) => {
      const success = await addBank(bankData);
      if (success) {
          setIsModalOpen(false); // Đóng modal nếu thành công
      }
  };

  if (loading) return (
     <div className="min-h-screen flex justify-center items-center text-[#1f1d1c]">
        Đang tải thông tin ngân hàng...
     </div>
  );

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10 font-sans">
        <Header />
        
        {/* --- MODAL Ở ĐÂY --- */}
        <AddBankModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveBank}
        />

        <div className="container mx-auto px-4 pt-5 grid grid-cols-12 gap-6">
            
            <div className="col-span-2 hidden md:block">
                <ProfileSidebar />
            </div>

            <div className="col-span-12 md:col-span-10 bg-white p-6 rounded-sm shadow-sm min-h-[500px]">
                
                <div>
                    <div className="flex justify-between items-center border-b pb-4 mb-6">
                        <h2 className="text-lg text-gray-800 font-medium">Tài Khoản Ngân Hàng Của Tôi</h2>
                        <button 
                            onClick={() => setIsModalOpen(true)} // Bấm nút thì Mở Modal
                            className="bg-[#181515] text-white px-4 py-2 rounded-sm text-sm flex items-center gap-2 hover:opacity-90 shadow-sm transition"
                        >
                            <FaPlus className="text-xs"/> Thêm Tài Khoản Ngân Hàng
                        </button>
                    </div>

                    <div className="space-y-4">
                        {banks.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-sm bg-gray-50 border border-dashed rounded-sm">
                                Bạn chưa có tài khoản ngân hàng nào.
                            </div>
                        ) : (
                            banks.map((bank) => (
                                <div key={bank.id} className="border border-gray-200 rounded-sm p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors group relative">
                                    
                                    {/* Logo */}
                                    <div className="w-16 h-16 border rounded flex items-center justify-center bg-white flex-shrink-0 p-1">
                                        <img src={bank.logo} alt="Bank Logo" className="w-full h-full object-contain"/>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-gray-800 text-sm font-medium border-r pr-2 mr-2 border-gray-300">
                                                {bank.bankName}
                                            </span>
                                            {bank.isDefault && (
                                                <span className="bg-[#1d1b1b] text-white text-[10px] px-1.5 py-0.5 rounded-sm">Mặc định</span>
                                            )}
                                            {bank.isVerified && (
                                                <span className="text-green-600 text-[10px] border border-green-200 bg-green-50 px-1 rounded">Đã kiểm tra</span>
                                            )}
                                        </div>
                                        <div className="text-gray-600 text-sm font-medium">
                                            {bank.accountName}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                            {bank.branch ? `Chi nhánh: ${bank.branch}` : ''} 
                                            <span className="ml-2 font-mono tracking-wider">**** {bank.lastDigits}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col items-end gap-3 text-sm pt-1 pl-4">
                                        <button 
                                            onClick={() => deleteBank(bank.id)}
                                            className="text-gray-500 hover:text-[#1b1818] text-xs underline decoration-dotted"
                                        >
                                            Xóa
                                        </button>
                                        {!bank.isDefault && (
                                            <button 
                                                onClick={() => setDefaultBank(bank.id)}
                                                className="border border-gray-300 text-gray-600 px-3 py-1 rounded-sm text-xs hover:border-[#ee4d2d] hover:text-[#ee4d2d] transition-colors"
                                            >
                                                Thiết lập mặc định
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default MyBanks;