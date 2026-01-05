import React from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

// --- CONFIG & CONTEXT ---
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protected/ProtectedRoute';
import SellerGuard from './pages/seller/SellerGuard';
import ChatWidget from './components/common/ChatWidget';

// --- AUTHENTICATION ---
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// ================== BUYER PAGES (NGƯỜI MUA) ==================
// Core
import Home from './pages/buyer/core/Home';
import SearchResults from './pages/buyer/core/SearchResults';
import NotificationPage from './pages/buyer/core/NotificationPage';

// Product & Shop
import ProductDetail from './pages/buyer/product/ProductDetail';
import ShopPage from './pages/buyer/shop/ShopPage';

// Checkout
import Cart from './pages/buyer/checkout/Cart';
import Checkout from './pages/buyer/checkout/Checkout';

// Account Settings
import MyProfile from './pages/buyer/account/MyProfile';
import MyAddress from './pages/buyer/account/MyAddress';
import MyBanks from './pages/buyer/account/MyBanks';
import MyPurchase from './pages/buyer/account/MyPurchase';

// ================== SHIPPER PAGES ==================
import ShipperDashboard from './pages/shipper/ShipperDashboard';

// ================== SELLER PAGES (NGƯỜI BÁN) ==================
// Registration & Dashboard
import SellerRegister from './pages/seller/Register';
import SellerDashboard from './pages/seller/Dashboard';

// Product Management
import ProductManagement from './pages/seller/products/ProductManagement';
import AddProduct from './pages/seller/products/AddProduct';
import EditProduct from './pages/seller/products/EditProduct';

// Order Management
import OrderManagement from './pages/seller/orders/OrderManagementPage';
import MassDelivery from './pages/seller/orders/MassDelivery';
import ReturnRefundPage from './pages/seller/orders/ReturnRefundPage';

// Shop Settings
import ShopProfile from './pages/seller/shop/ShopProfile';
import ShopDecoration from './pages/seller/shop/ShopDecoration';
import ShopCategory from './pages/seller/shop/ShopCategory';
import TopProducts from './pages/seller/shop/TopProducts';

// Analytics
import SalesAnalytics from './pages/seller/analytics/SalesAnalytics';
import SalesOverview from './pages/seller/analytics/SalesOverview';
import TrafficAnalytics from './pages/seller/analytics/TrafficAnalytics';
//Admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRouteAdmin from './routes/ProtectedRouteAdmin';
import AdminShopManager from './pages/admin/AdminShopManager';
import AdminUserList from './pages/admin/AdminUserList';
import AdminProductList from './pages/admin/AdminProductList';
import AdminOrderManager from './pages/admin/AdminOrderManager';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ChatWidget />
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- PROTECTED ROUTES (Yêu cầu đăng nhập) --- */}
          <Route element={<ProtectedRoute />}>
            
            {/* 1. BUYER ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetail />} />
  
            
            {/* Buyer Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Buyer Account */}
            <Route path="/user/profile" element={<MyProfile />} />
            <Route path="/user/address" element={<MyAddress />} />
            <Route path="/user/banks" element={<MyBanks />} />
            <Route path="/user/purchase" element={<MyPurchase />} />
            <Route path="/user/notifications" element={<NotificationPage />} />

            {/* 2. SHIPPER ROUTES */}
            <Route path="/shipper/dashboard" element={<ShipperDashboard />} />
            <Route path="/shop/:shopId" element={<ShopPage />} />
            {/* 3. SELLER ROUTES */}
            {/* Đăng ký bán hàng */}
            <Route path="/seller/register" element={<SellerRegister />} />
            
            {/* Khu vực quản lý của Seller (Có SellerGuard bảo vệ) */}
            <Route path="/seller" element={<SellerGuard />}>
              <Route index element={<SellerDashboard />} />
              
              {/* Quản lý sản phẩm */}
              <Route path="products/list" element={<ProductManagement />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              
              {/* Quản lý đơn hàng */}
              <Route path="orders" element={<OrderManagement />} />
              <Route path="delivery/mass" element={<MassDelivery />} />
              <Route path="return-refund" element={<ReturnRefundPage />} />
              
              {/* Thiết lập Shop */}
              <Route path="shop/profile" element={<ShopProfile />} />
              <Route path="shop/decoration" element={<ShopDecoration />} />
              <Route path="shop/category" element={<ShopCategory />} />
              <Route path="shop/top-products" element={<TopProducts />} />
              
              {/* Phân tích & Thống kê */}
              <Route path="analytics" element={<SalesAnalytics />} />
              <Route path="analytics/sales" element={<SalesOverview />} />
              <Route path="analytics/traffic" element={<TrafficAnalytics />} />
            </Route>
            {/* --- KHU VỰC ADMIN (ĐƯỢC BẢO VỆ) --- */}
            <Route element={<ProtectedRouteAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                 
                    <Route index element={<Navigate to="dashboard" replace />} />
                    
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="shops" element={<AdminShopManager />} />
                    <Route path="users" element={<AdminUserList />} />
                    <Route path="products" element={<AdminProductList />} />
                    <Route path="orders" element={<AdminOrderManager />} />
               
                </Route>
            </Route>

          </Route> 
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;