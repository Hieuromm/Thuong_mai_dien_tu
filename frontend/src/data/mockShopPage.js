// src/data/mockShopPage.js

export const MOCK_SHOP_INFO = {
  id: "S001",
  name: "I.T MKCHI Official Store",
  username: "itmkchi_official",
  avatar: "https://via.placeholder.com/150/pink/white?text=MKCHI", // Ảnh giả
  cover: "https://via.placeholder.com/1200x300/333/666", // Ảnh bìa mờ phía sau
  isOfficial: true, // Shop Mall/Official
  stats: {
    products: 25,
    following: 3,
    chatPerformance: "100% (Trong Vài Phút)",
    followers: "1.7k",
    rating: 4.9,
    joined: "4 Tháng Trước"
  }
};

export const SHOP_VOUCHERS = [
  { id: 1, discount: "100k", minSpend: "300k", code: "SHOP100", expiry: "28.02.2025" },
  { id: 2, discount: "30k", minSpend: "300k", code: "SHOP30", expiry: "31.01.2025" },
  { id: 3, discount: "12%", minSpend: "100k", code: "SHOP12", expiry: "31.12.2025" },
];

export const SHOP_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Túi xách nữ I.T MKCHI thời trang cao cấp mẫu mới ${2024 + i}`,
  image: "https://via.placeholder.com/200",
  price: 339000 + (i * 10000),
  originalPrice: 400000 + (i * 10000),
  discount: 15,
  sold: 100 + i * 5,
  isMall: true
}));

export const SHOP_CATEGORIES = [
  { id: 'dao', label: 'Dạo' }, // Trang chủ shop
  { id: 'all', label: 'Tất cả sản phẩm' },
  { id: 'bag', label: 'Túi Xách' },
  { id: 'backpack', label: 'Ba Lô Nữ' },
  { id: 'wallet', label: 'Ví Nữ' },
];