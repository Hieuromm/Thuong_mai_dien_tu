import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddAddressModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', phone: '', city: '', district: '', ward: '', street: '', isDefault: false
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
   
        if (!formData.name || !formData.phone || !formData.street) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-[600px] rounded-sm shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-800">Địa Chỉ Mới</h3>
                    <button onClick={onClose}><FaTimes className="text-gray-400 hover:text-gray-600"/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d] w-full"/>
                        <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d] w-full"/>
                    </div>


                    <div className="grid grid-cols-3 gap-4">
                         <input type="text" name="city" placeholder="Tỉnh/Thành phố" value={formData.city} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d]"/>
                         <input type="text" name="district" placeholder="Quận/Huyện" value={formData.district} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d]"/>
                         <input type="text" name="ward" placeholder="Phường/Xã" value={formData.ward} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d]"/>
                    </div>

                    <input type="text" name="street" placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)" value={formData.street} onChange={handleChange} className="border p-2 rounded-sm outline-none focus:border-[#ee4d2d] w-full"/>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="defaultAddr" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="accent-[#ee4d2d]"/>
                        <label htmlFor="defaultAddr" className="text-sm text-gray-600">Đặt làm địa chỉ mặc định</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100">Trở Lại</button>
                        <button type="submit" className="px-6 py-2 text-sm text-white bg-[#ee4d2d] hover:opacity-90 shadow-sm">Hoàn Thành</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;