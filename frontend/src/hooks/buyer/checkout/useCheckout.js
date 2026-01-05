import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { placeOrderAPI } from '../../../services/orderService';
// Chỉ cần import hàm lấy tất cả địa chỉ
import { getAllAddressesAPI } from '../../../services/addressService';

export const useCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth(); // Vẫn cần check để biết đã login chưa

    // --- STATES ---
    const [checkoutData, setCheckoutData] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [addresses, setAddresses] = useState([]); // Lưu list để dùng cho Modal
    
    // --- UI STATES ---
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const paymentMethods = [
        { id: 'COD', name: 'Thanh toán khi nhận hàng' },
        { id: 'VNPAY', name: 'Thẻ ATM / Internet Banking (VNPAY)' }
    ];

    // --- 1. LẤY DỮ LIỆU (KHÔNG CẦN ID) ---
    const fetchData = useCallback(async () => {
        if (!user) return; // Chỉ chặn nếu chưa login

        setLoading(true);
        try {
            // A. GỌI API LẤY TẤT CẢ ĐỊA CHỈ (Dựa vào Token)
            // Không cần truyền userId vào đây nữa!
            try {
                const response = await getAllAddressesAPI();
                // Backend trả về List<Address>
                const listAddress = response.data || response; 
                
                setAddresses(listAddress); // Lưu lại để dùng cho Modal chọn địa chỉ

                // TỰ TÌM ĐỊA CHỈ MẶC ĐỊNH TRONG LIST
                // Kiểm tra cả trường 'default' và 'isDefault' tùy JSON backend trả về
                const defaultAddr = listAddress.find(addr => addr.default === true || addr.isDefault === true);
                
                if (defaultAddr) {
                    setUserInfo(defaultAddr);
                } else if (listAddress.length > 0) {
                    // Nếu chưa set mặc định, lấy tạm cái đầu tiên
                    setUserInfo(listAddress[0]);
                } else {
                    setUserInfo(null); // Chưa có địa chỉ nào
                }

            } catch (addrError) {
                console.error("Lỗi lấy danh sách địa chỉ:", addrError);
            }

            // B. Lấy dữ liệu sản phẩm (Giữ nguyên)
            const stateData = location.state?.checkoutData;
            const localData = localStorage.getItem('checkout_items');

            if (stateData && stateData.length > 0) {
                setCheckoutData(stateData);
            } else if (localData) {
                setCheckoutData(JSON.parse(localData));
            }
        } catch (error) {
            console.error("Lỗi chuẩn bị Checkout:", error);
        } finally {
            setLoading(false);
        }
    }, [user, location.state]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [fetchData, user]);

    // --- 2. TÍNH TIỀN ---
    const merchandiseSubtotal = useMemo(() => {
        if (!checkoutData || checkoutData.length === 0) return 0;
        return checkoutData.reduce((total, shop) => {
            const shopTotal = shop.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return total + shopTotal;
        }, 0);
    }, [checkoutData]);

    const shippingFee = 30000; 
    const totalPayment = merchandiseSubtotal + shippingFee;

    // --- 3. LOGIC MODAL ---
    const openAddressModal = () => {
        // Vì đã lấy list address ở fetchData rồi nên chỉ cần mở modal
        setIsModalOpen(true);
    };

    const selectAddress = (addr) => {
        setUserInfo(addr);
        setIsModalOpen(false);
    };

    // --- 4. ĐẶT HÀNG ---
    const handlePlaceOrder = async () => {
        if (!userInfo) {
            alert("Vui lòng thiết lập địa chỉ nhận hàng!");
            return;
        }

        const selectedIds = checkoutData.flatMap(shop => shop.items.map(item => item.id));
        const fullAddressStr = `${userInfo.name} | ${userInfo.phone}\n${userInfo.street}, ${userInfo.ward}, ${userInfo.district}, ${userInfo.city}`;

        // Lấy userId từ Token (nếu backend Order cần ID thì vẫn phải fix login,
        // nhưng nếu Backend Order tự lấy từ Token thì dòng dưới ko quan trọng)
        const userId = user?.id; 

        try {
            await placeOrderAPI({
                userId: userId, 
                address: fullAddressStr,
                paymentMethod: paymentMethod,
                note: note,
                selectedCartItemIds: selectedIds
            });

            alert("Đặt hàng thành công!");
            localStorage.removeItem('checkout_items');
            navigate('/user/purchase');
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Lỗi kết nối Server.";
            alert("Đặt hàng thất bại: " + errorMsg);
        }
    };

    return {
        userInfo,
        addresses,
        checkoutData,
        paymentMethods,
        paymentMethod, setPaymentMethod,
        note, setNote,
        isModalOpen, setIsModalOpen,
        merchandiseSubtotal,
        shippingFee,
        totalPayment,
        openAddressModal,
        selectAddress,
        handlePlaceOrder,
        loading
    };
};