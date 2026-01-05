import React, { useState } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';


const SUPPORTED_BANKS = [
    { code: 'VCB', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)' },
    { code: 'TCB', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)' },
    { code: 'MB', name: 'Ngân hàng TMCP Quân Đội (MB Bank)' },
    { code: 'ACB', name: 'Ngân hàng TMCP Á Châu (ACB)' },
    { code: 'VPB', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)' },
    { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)' },
    { code: 'ICB', name: 'Ngân hàng TMCP Công Thương Việt Nam (VietinBank)' },
];

const AddBankModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        bankName: '',
        branch: '',
        accountNumber: '',
        accountName: '',
        isDefault: false
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Tự động viết hoa tên chủ tài khoản
    const handleNameChange = (e) => {
        setFormData(prev => ({ ...prev, accountName: e.target.value.toUpperCase() }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate 
        if(!formData.bankName || !formData.accountNumber || !formData.accountName) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-[500px] rounded-sm shadow-2xl transform transition-all scale-100">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-lg font-medium text-gray-800">Thêm Tài Khoản Ngân Hàng</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* 1. Chọn Ngân Hàng */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tên Ngân Hàng</label>
                        <select 
                            name="bankName" 
                            value={formData.bankName} 
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 outline-none focus:border-[#ee4d2d] focus:shadow-sm text-sm"
                        >
                            <option value="">-- Chọn Ngân Hàng --</option>
                            {SUPPORTED_BANKS.map(bank => (
                                <option key={bank.code} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Chi Nhánh */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Chi Nhánh (Tùy chọn)</label>
                        <input 
                            type="text" 
                            name="branch" 
                            value={formData.branch} 
                            onChange={handleChange}
                            placeholder="Ví dụ: Chi nhánh Hà Nội"
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 outline-none focus:border-[#ee4d2d] text-sm"
                        />
                    </div>

                    {/* 3. Số Tài Khoản */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Số Tài Khoản</label>
                        <input 
                            type="text" 
                            name="accountNumber" 
                            value={formData.accountNumber} 
                            onChange={handleChange}
                            placeholder="Nhập số tài khoản"
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 outline-none focus:border-[#ee4d2d] text-sm"
                        />
                    </div>

                    {/* 4. Tên Chủ Tài Khoản */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tên Chủ Tài Khoản</label>
                        <input 
                            type="text" 
                            name="accountName" 
                            value={formData.accountName} 
                            onChange={handleNameChange}
                            placeholder="HỌ VÀ TÊN (KHÔNG DẤU)"
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 outline-none focus:border-[#ee4d2d] text-sm uppercase"
                        />
                    </div>

                    {/* 5. Set Default */}
                    <div className="flex items-center gap-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="isDefault" 
                            name="isDefault" 
                            checked={formData.isDefault} 
                            onChange={handleChange}
                            className="w-4 h-4 accent-[#ee4d2d] cursor-pointer"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-600 cursor-pointer select-none">
                            Đặt làm tài khoản mặc định
                        </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
                        >
                            Trở Lại
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 text-sm text-white bg-[#ee4d2d] hover:opacity-90 rounded-sm shadow-sm transition-opacity"
                        >
                            Hoàn Thành
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBankModal;