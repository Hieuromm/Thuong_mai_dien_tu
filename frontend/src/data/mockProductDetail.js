// src/data/mockProductDetail.js

export const MOCK_PRODUCT_DETAIL = {
  id: "P001",
  name: "Áo Thun Nam Basic Cotton 100% Thoáng Mát, Thấm Hút Mồ Hôi Cực Tốt",
  images: [
    "https://via.placeholder.com/600",
    "https://via.placeholder.com/600/0000FF",
    "https://via.placeholder.com/600/FF0000",
    "https://via.placeholder.com/600/FFFF00"
  ],
  price: 75000,
  originalPrice: 150000,
  discount: 50,
  rating: 4.9,
  ratingCount: "2.1k",
  sold: "5.3k",
  stock: 1200,
  description: `Chất liệu: Cotton 100% cao cấp
  Màu sắc: Đen, Trắng, Xám
  Size: M, L, XL, XXL
  Xuất xứ: Việt Nam
  
  HƯỚNG DẪN GIẶT ỦI:
  - Giặt máy ở chế độ nhẹ
  - Không dùng thuốc tẩy`,
  variants: {
    colors: ["Trắng", "Đen", "Xám"],
    sizes: ["M", "L", "XL", "XXL"]
  },
  shop: {
    id: "S001",
    name: "Thời trang H_A_N",
    avatar: "https://via.placeholder.com/100",
    rating: 4.8,
    products: 120,
    responseRate: "98%",
    joinTime: "2 năm trước",
    followers: "12.5k"
  },
  reviews: [
    {
      user: "nguyenvana",
      rating: 5,
      date: "2023-12-10 09:30",
      variant: "Trắng, Size L",
      comment: "Áo đẹp, chất vải mát, giao hàng nhanh. Sẽ ủng hộ shop tiếp."
    },
    {
      user: "tranthib",
      rating: 4,
      date: "2023-12-09 14:15",
      variant: "Đen, Size XL",
      comment: "Hơi rộng so với bảng size nhưng chất lượng ok."
    }
  ]
};