import React from 'react';
import { Truck, MapPin, Phone, Package, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useShipperLogic } from '../../hooks/shipper/useShipperLogic';

const ShipperDashboard = () => {
  const { 
    shippingOrders, 
    loading, 
    formatCurrency, 
    handleConfirmDelivered,
    handleDeliveryFailed,
    refresh
  } = useShipperLogic();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <Truck size={28} /> Shipper Hub
            </h1>
            <p className="text-sm text-gray-500 mt-1">Danh sách cần giao: <b>{shippingOrders.length}</b> đơn</p>
          </div>
          <button 
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-200 rounded-md text-sm font-medium transition"
          >
            <RefreshCw size={16}/> Làm mới
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-center py-20">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
             <p className="text-gray-500">Đang tìm đơn hàng...</p>
          </div>
        ) : shippingOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
             <Package size={64} className="text-gray-200 mx-auto mb-4" />
             <h2 className="text-lg font-medium text-gray-700">Hết nhiệm vụ!</h2>
             <p className="text-gray-500 mt-2 text-sm">Hiện tại không còn đơn hàng nào cần giao.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shippingOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative group">
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Đang giao
                </div>

                <div className="p-5">
                  {/* Info Header */}
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="text-sm text-gray-500 mb-1">Mã vận đơn: <span className="font-mono text-gray-800 font-bold">#{order.id}</span></div>
                        <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                     </div>
                     <div className="text-right">
                        {order.isCOD ? (
                            <div className="text-red-600 font-bold text-lg">{formatCurrency(order.totalAmount)}</div>
                        ) : (
                            <div className="text-green-600 font-bold text-sm">Đã thanh toán</div>
                        )}
                        <div className="text-[10px] text-gray-400 uppercase mt-1">Cần thu tiền</div>
                     </div>
                  </div>

                  {/* Info Details */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3 mb-4">
                      <div className="flex gap-3">
                          <MapPin className="text-blue-500 shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-gray-700 font-medium">{order.address}</span>
                      </div>
                      <div className="flex gap-3">
                          <Phone className="text-blue-500 shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-gray-700 font-bold tracking-wide">{order.customerPhone}</span>
                      </div>
                      <div className="flex gap-3">
                          <Package className="text-blue-500 shrink-0 mt-0.5" size={18} />
                          <span className="text-xs text-gray-500 italic line-clamp-2">{order.items}</span>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                        onClick={() => handleDeliveryFailed(order.id)}
                        className="flex-1 bg-white border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-medium py-3 rounded text-sm transition flex items-center justify-center gap-2"
                    >
                        <XCircle size={18} />
                        Giao thất bại
                    </button>

                    <button
                        onClick={() => handleConfirmDelivered(order.id)}
                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        Giao thành công
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipperDashboard;