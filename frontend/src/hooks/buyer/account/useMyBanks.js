import { useState, useEffect } from 'react';
import { 
    getBanksAPI, 
    addBankAPI, 
    deleteBankAPI, 
    setDefaultBankAPI 
} from '../../../services/bankService';

// --- HELPER: LẤY LOGO NGÂN HÀNG ---
const getBankLogo = (bankName) => {
    if (!bankName) return 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png';
    
    const name = bankName.toLowerCase();
    if (name.includes('vietcombank')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png';
    if (name.includes('mb')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-MB-Bank-MBB.png';
    if (name.includes('techcombank')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Techcombank.png';
    if (name.includes('acb')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-ACB.png';
    if (name.includes('vpbank') || name.includes('vpb')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-VPBank.png';
    if (name.includes('bidv')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-BIDV.png';
    if (name.includes('vietinbank') || name.includes('icb')) return 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Icon-VietinBank.png';
    
    return 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png';
};

export const useMyBanks = () => {
  const [banks, setBanks] = useState([]);
  const [creditCards, setCreditCards] = useState([]); // Tạm thời để trống (Feature sau này)
  const [loading, setLoading] = useState(true);

  // 1. TẢI DANH SÁCH NGÂN HÀNG
  const fetchBanks = async () => {
    try {
      const data = await getBanksAPI();
      
      // Xử lý dữ liệu hiển thị
      const formattedBanks = data.map(b => ({
          ...b,
          logo: getBankLogo(b.bankName),
          lastDigits: b.accountNumber && b.accountNumber.length > 4 
              ? b.accountNumber.slice(-4) 
              : b.accountNumber
      }));

      setBanks(formattedBanks);
    } catch (error) {
      console.error("Lỗi tải danh sách ngân hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi hàm fetch khi component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  // 2. THÊM NGÂN HÀNG MỚI 
  const addBank = async (bankData) => {
    try {
        await addBankAPI(bankData);
        alert("Thêm tài khoản ngân hàng thành công!");
        
        // Load lại danh sách để cập nhật giao diện
        await fetchBanks();
        
        return true; 
    } catch (error) {
        console.error(error);
        alert("Thêm thất bại. Vui lòng kiểm tra lại thông tin.");
        return false;
    }
  };

  // 3. XÓA NGÂN HÀNG
  const deleteBank = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên kết ngân hàng này?")) {
        try {
            await deleteBankAPI(id);
    
            setBanks(prev => prev.filter(b => b.id !== id));
            
        } catch (error) {
            alert("Xóa thất bại. Vui lòng thử lại sau.");
        }
    }
  };

  // 4. THIẾT LẬP MẶC ĐỊNH
  const setDefaultBank = async (id) => {
    try {
        await setDefaultBankAPI(id);
        
        setBanks(prev => prev.map(b => ({
            ...b,
            isDefault: b.id === id
        })));
        
        alert("Đã thiết lập tài khoản mặc định.");
    } catch (error) {
        alert("Lỗi thiết lập mặc định.");
    }
  };

  return {
    banks,
    creditCards,
    loading,
    addBank,
    deleteBank,
    setDefaultBank
  };
};