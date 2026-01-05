import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Header from '../../../components/common/Header';
import ProfileSidebar from '../../../components/profile/ProfileSidebar';
import { useMyAddress } from '../../../hooks/buyer/account/useMyAddress';
import AddAddressModal from '../../../components/profile/AddAddressModal'; // Import Modal

const MyAddress = () => {
  const { addresses, loading, setDefaultAddress, deleteAddress, addAddress } = useMyAddress();
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (data) => {
      const success = await addAddress(data);
      if (success) setIsModalOpen(false);
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center text-[#1a1818]">Đang tải...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10 font-sans">
        <Header />
        
        {/* Modal */}
        <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />

        <div className="container mx-auto px-4 pt-5 grid grid-cols-12 gap-6">
            <div className="col-span-2 hidden md:block"><ProfileSidebar /></div>

            <div className="col-span-12 md:col-span-10 bg-white p-6 rounded-sm shadow-sm min-h-[500px]">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-lg text-gray-800 font-medium">Địa chỉ của tôi</h1>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#161514] text-white px-6 py-2 rounded-sm text-sm flex items-center gap-2 hover:opacity-90 shadow-sm"
                    >
                        <FaPlus className="text-xs"/> Thêm địa chỉ mới
                    </button>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Địa chỉ</h2>
                    {addresses.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-gray-50 border border-dashed">Bạn chưa có địa chỉ nào.</div>
                    ) : (
                        addresses.map((addr) => (
                            <div key={addr.id} className="border-b last:border-b-0 py-4 flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-800 text-sm border-r pr-2 border-gray-300">{addr.name}</span>
                                        <span className="text-gray-500 text-sm">{addr.phone}</span>
                                    </div>
                                    <div className="text-gray-600 text-sm mb-1">{addr.street}</div>
                                    <div className="text-gray-600 text-sm mb-2">{addr.ward}, {addr.district}, {addr.city}</div>
                                    <div className="flex gap-2">
                                        {addr.isDefault && <span className="border border-[#1b1817] text-[#1b1817] text-xs px-1 py-0.5 rounded-sm">Mặc định</span>}
                                        {addr.isPickup && <span className="border border-gray-300 text-gray-500 text-xs px-1 py-0.5 rounded-sm bg-gray-50">Địa chỉ lấy hàng</span>}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-end gap-3 text-sm w-full md:w-auto justify-end">
                                    <div className="flex items-center gap-3">
                                        <button className="text-blue-500 hover:text-[#ee4d2d] text-xs">Cập nhật</button>
                                        {!addr.isDefault && (
                                            <button onClick={() => deleteAddress(addr.id)} className="text-blue-500 hover:text-[#080808] text-xs">Xóa</button>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => setDefaultAddress(addr.id)}
                                        disabled={addr.isDefault}
                                        className={`px-3 py-1.5 rounded-sm border text-xs transition-colors ${addr.isDefault ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-600 hover:bg-white hover:text-[#161615]'}`}
                                    >
                                        Thiết lập mặc định
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MyAddress;