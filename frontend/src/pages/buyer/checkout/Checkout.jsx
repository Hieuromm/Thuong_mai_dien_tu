import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaShieldAlt, FaPlus } from 'react-icons/fa';
import Footer from '../../../components/common/Footer';
import { useCheckout } from '../../../hooks/buyer/checkout/useCheckout';

const Checkout = () => {
    const {
        userInfo,
        addresses,
        checkoutData,
        paymentMethods,
        paymentMethod,
        setPaymentMethod,
        note,
        setNote,
        isModalOpen,
        setIsModalOpen,
        merchandiseSubtotal,
        shippingFee,
        totalPayment,
        openAddressModal,
        selectAddress,
        handlePlaceOrder,
        loading
    } = useCheckout();


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f0e0e]"></div>
                    <p className="text-gray-500 italic">Đang chuẩn bị thông tin thanh toán...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-[#222]">
            
    
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-[100px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-[#181615] text-4xl font-bold italic tracking-tighter">BuyNow</Link>
                        <div className="h-8 border-l-2 border-[#181615] opacity-20"></div>
                        <span className="text-xl text-[#222] font-medium">Thanh Toán</span>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6 flex-grow max-w-6xl">
                <div className="bg-white p-7 rounded-sm shadow-sm mb-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[repeating-linear-gradient(45deg,#ee4d2d,#ee4d2d_33px,#fff_33px,#fff_44px,#405cbf_44px,#405cbf_77px,#fff_77px,#fff_88px)]"></div>
                    
                    <div className="flex items-center gap-2 text-[#131111] text-lg font-medium mb-4 uppercase tracking-wide">
                        <FaMapMarkerAlt /> Địa Chỉ Nhận Hàng
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-[15px]">
                        {userInfo ? (
                            <>
                                <div className="font-bold flex-shrink-0 text-black whitespace-nowrap">
                                    {userInfo.name} {userInfo.phone}
                                </div>
                                <div className="flex-grow text-[#222] line-clamp-1">
                                    {`${userInfo.street}, ${userInfo.ward}, ${userInfo.district}, ${userInfo.city}`}
                                </div>
                                {userInfo.default && (
                                    <span className="text-[#1d1b1b] border border-[#181717] text-[10px] px-1.5 py-0.5 rounded-sm uppercase font-medium">
                                        Mặc Định
                                    </span>
                                )}
                                <button 
                                    onClick={openAddressModal}
                                    className="text-[#4080ee] hover:underline uppercase font-medium text-sm ml-auto"
                                >
                                    Thay Đổi
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-500 italic flex items-center gap-2 py-2">
                                Bạn chưa thiết lập địa chỉ nhận hàng. 
                                <Link to="/user/address" className="text-blue-500 font-bold hover:underline ml-1">Thiết lập ngay</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- DANH SÁCH SẢN PHẨM --- */}
                <div className="bg-white rounded-sm shadow-sm mb-4 overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 px-6 py-4 text-sm text-gray-500 border-b bg-white">
                        <div className="col-span-6 text-black text-base font-medium">Sản phẩm</div>
                        <div className="col-span-2 text-center">Đơn giá</div>
                        <div className="col-span-2 text-center">Số lượng</div>
                        <div className="col-span-2 text-right">Thành tiền</div>
                    </div>

                    {checkoutData.map((shop, sIdx) => (
                        <div key={sIdx} className="border-b last:border-b-0">
                            <div className="px-6 py-4 flex items-center gap-2 text-sm font-medium border-b border-gray-50 bg-[#fafafa]">
                                <span className="bg-[#22201f] text-white text-[10px] px-1.5 py-0.5 rounded-sm">Yêu Thích</span>
                                <span className="text-[#222]">{shop.shopName}</span>
                            </div>

                            {shop.items.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 items-center px-6 py-4 text-sm border-b border-gray-50 last:border-b-0">
                                    <div className="col-span-12 md:col-span-6 flex gap-3 mb-4 md:mb-0">
                                        <img src={item.image} className="w-14 h-14 object-cover border border-gray-100 rounded-sm" alt={item.name} />
                                        <div className="flex flex-col gap-1 pr-4">
                                            <span className="line-clamp-2 text-[#222] font-normal">{item.name}</span>
                                            <span className="text-gray-400 text-xs italic">Phân loại: {item.classification || "Mặc định"}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 md:col-span-2 text-center">₫{item.price.toLocaleString()}</div>
                                    <div className="col-span-4 md:col-span-2 text-center text-gray-500">x{item.quantity}</div>
                                    <div className="col-span-4 md:col-span-2 text-right font-medium">₫{(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            ))}

                            <div className="bg-[#fafdff] border-t border-dashed border-[#dcecf5] px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                                <div className="md:col-span-5 flex items-center gap-3">
                                    <label className="text-sm text-[#222]">Lời nhắn:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Lưu ý cho Người bán..." 
                                        className="flex-1 border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-300 rounded-sm"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-7 flex flex-col gap-1 md:border-l border-dashed border-[#dcecf5] md:pl-6 text-right">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#00bfa5] text-sm font-medium uppercase italic">Đơn vị vận chuyển: Nhanh</span>
                                        <span className="text-[#222] text-sm font-medium">₫{shippingFee.toLocaleString()}</span>
                                    </div>
                                    <div className="text-gray-400 text-[11px]">Dự kiến nhận hàng trong 2-4 ngày</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- PHƯƠNG THỨC THANH TOÁN --- */}
                <div className="bg-white rounded-sm shadow-sm mb-4">
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b">
                            <div className="font-medium text-lg">Phương thức thanh toán</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-8">
                            {paymentMethods.map((method) => (
                                <button 
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`px-6 py-2.5 border text-sm rounded-sm transition-all relative min-w-[150px]
                                        ${paymentMethod === method.id 
                                            ? 'border-[#22201f] text-[#0e0d0d] bg-orange-50 font-medium' 
                                            : 'border-gray-200 text-[#222] hover:bg-gray-50'}
                                    `}
                                >
                                    {method.name}
                                    {paymentMethod === method.id && (
                                        <div className="absolute bottom-0 right-0 w-4 h-4 overflow-hidden">
                                            <div className="bg-[#161514] text-white text-[8px] absolute rotate-45 w-8 h-4 bottom-[-5px] right-[-10px] flex items-center justify-center">✔</div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* --- TỔNG KẾT --- */}
                        <div className="bg-[#fffefb] border-t border-gray-100 -mx-7 px-7 py-8 space-y-4">
                            <div className="flex justify-end text-sm text-gray-500">
                                <div className="w-[220px] text-right pr-10">Tổng tiền hàng</div>
                                <div className="w-[150px] text-right">₫{merchandiseSubtotal.toLocaleString()}</div>
                            </div>
                            <div className="flex justify-end text-sm text-gray-500">
                                <div className="w-[220px] text-right pr-10">Phí vận chuyển</div>
                                <div className="w-[150px] text-right">₫{shippingFee.toLocaleString()}</div>
                            </div>
                            <div className="flex justify-end items-center mt-6">
                                <div className="mr-10 text-right">
                                    <div className="text-sm text-gray-600 mb-1">Tổng thanh toán</div>
                                    <div className="text-[#131111] text-4xl font-bold font-mono">₫{totalPayment.toLocaleString()}</div>
                                </div>
                                <button 
                                    onClick={handlePlaceOrder}
                                    disabled={!userInfo || checkoutData.length === 0}
                                    className={`w-60 py-3.5 rounded-sm text-base font-bold shadow-md transition-all active:scale-95
                                        ${(!userInfo || checkoutData.length === 0) 
                                            ? 'bg-gray-300 cursor-not-allowed text-white' 
                                            : 'bg-[#221e1d] text-white hover:brightness-110'}
                                    `}
                                >
                                    Đặt hàng
                                </button>
                            </div>
                            <div className="flex justify-end items-center gap-2 text-[11px] text-gray-400 mt-4 italic">
                                <FaShieldAlt className="text-[#272322]" />
                                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản của BuyNow
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MODAL THAY ĐỔI ĐỊA CHỈ --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
                            <h3 className="text-lg font-medium">Địa Chỉ Của Tôi</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-black">&times;</button>
                        </div>
                        
                        <div className="max-h-[450px] overflow-y-auto p-6 space-y-4">
                            {addresses.length > 0 ? (
                                addresses.map((addr) => (
                                    <div 
                                        key={addr.id} 
                                        className={`group relative border p-5 rounded-sm cursor-pointer transition-all 
                                            ${userInfo?.id === addr.id ? 'border-[#181514] bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => selectAddress(addr)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[15px]">{addr.name}</span>
                                                    <span className="text-gray-400 border-l pl-2">{addr.phone}</span>
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                    {addr.street}
                                                </div>
                                                <div className="text-sm text-gray-600 uppercase text-[12px] opacity-70">
                                                    {`${addr.ward}, ${addr.district}, ${addr.city}`}
                                                </div>
                                                {addr.default && (
                                                    <div className="mt-2">
                                                        <span className="text-[#221e1e] text-[10px] border border-[#181616] px-1.5 py-0.5 rounded-sm font-medium">Mặc định</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                                                ${userInfo?.id === addr.id ? 'border-[#1f1c1c]' : 'border-gray-300'}`}>
                                                {userInfo?.id === addr.id && <div className="w-2 h-2 rounded-full bg-[#0a0909]"></div>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400">Bạn chưa lưu địa chỉ nào.</div>
                            )}
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-between items-center px-6">
                            <Link 
                                to="/user/address" 
                                className="flex items-center gap-2 text-gray-600 hover:text-[#181616] transition-colors text-sm"
                            >
                                <FaPlus size={10} /> Thêm Địa Chỉ Mới
                            </Link>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-2 border border-gray-300 rounded-sm text-sm hover:bg-white"
                                >
                                    Trở Lại
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-2 bg-[#141312] text-white rounded-sm text-sm hover:brightness-110 shadow-sm"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Checkout;