

export const BANNER_IMAGES = [
    "https://fptshop.com.vn/tin-tuc/dien-may/cach-ket-noi-laptop-voi-tivi-161213",
    "https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xxhdpi", 
    "https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xxhdpi"
];

export const CATEGORIES = [
  { id: 1, name: "Khung Giờ Săn Sale", img: "https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi" },
  { id: 2, name: "Shopee Siêu Rẻ", img: "https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xhdpi" },
  { id: 3, name: "Mã Giảm Giá", img: "https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3c99fbed5a4_xhdpi" },
  { id: 4, name: "Hàng Hiệu Outlet", img: "https://cf.shopee.vn/file/vn-50009109-1975fb1af4ae3c22878d04f6f440b6f9_xhdpi" },
  { id: 5, name: "Nạp Thẻ & Dịch Vụ", img: "https://cf.shopee.vn/file/9dfd85e9045ebda3ea5b61e271136a34_xhdpi" },
  { id: 6, name: "Shopee Style", img: "https://cf.shopee.vn/file/vn-50009109-09259ae65f49d95f877002fa883c509a_xhdpi" },
  { id: 7, name: "Deal Sốc Từ 1K", img: "https://cf.shopee.vn/file/vn-50009109-91399a1d3ed283d272b069fac5ca950c_xhdpi" },
  { id: 8, name: "Bảo Hiểm Shopee", img: "https://cf.shopee.vn/file/vn-50009109-158a5ae015091c0683a54d485055b80a_xhdpi" },
];

export const FLASHSALE_PRODUCTS = [
  { id: 101, price: 109000, sold: 12, discount: 45, img: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66" },
  { id: 102, price: 59000, sold: 55, discount: 50, img: "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lm082k796k7966" },
  { id: 103, price: 299000, sold: 90, discount: 30, img: "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5w-lwd088r58r5836" },
  { id: 104, price: 15000, sold: 5, discount: 10, img: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm4f8q78q78q66" },
  { id: 105, price: 99000, sold: 70, discount: 25, img: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljz8f8q8q8q866" },
  { id: 106, price: 45000, sold: 20, discount: 15, img: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66" },
];

export const SUGGESTED_PRODUCTS = Array(12).fill(null).map((_, index) => ({
    id: 200 + index,
    name: "Áo thun phông rộng nam nữ tay lỡ unisex form rộng vải cotton mát mịn phong cách hàn quốc - Local Brand " + (index + 1),
    price: 49000 + (index * 1000),
    sold: "12,5k",
    discount: 50,
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66"
}));
export const MOCK_USERS = [
  {
    id: 1,
    username: "user1",
    password: "123", // Mật khẩu giả
    name: "Nguyễn Văn Mua",
    role: 1, // Role 1: Người mua
    avatar: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66"
  },
  {
    id: 2,
    username: "admin",
    password: "123",
    name: "Shop Yêu Thích Official",
    role: 2, // Role 2: Người bán
    avatar: "https://down-vn.img.susercontent.com/file/sg-11134004-7rd70-m3l5m5m5m5m566"
  }
];

export const MOCK_CART = [
  {
    id: 1,
    shopName: "VERDAN Official Store",
    checked: false, // Trạng thái đã chọn hay chưa
    items: [
      {
        id: 101,
        name: "Áo Thun Trơn 100% Cotton Comfitex Hi Fabric 240Gsm Form Rộng",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66",
        classification: "Đen, XL",
        originalPrice: 198000,
        price: 129000,
        quantity: 1,
        stock: 100
      }
    ]
  },
  {
    id: 2,
    shopName: "Coolmate Official",
    checked: false,
    items: [
      {
        id: 102,
        name: "Quần Short Nam Thể Thao Co Giãn 4 Chiều",
        image: "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lm082k796k7966",
        classification: "Xanh Than, L",
        originalPrice: 150000,
        price: 99000,
        quantity: 2,
        stock: 50
      },
      {
        id: 103,
        name: "Áo Polo Nam Dry-Fit Thoáng Mát",
        image: "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5w-lwd088r58r5836",
        classification: "Trắng, M",
        originalPrice: 250000,
        price: 189000,
        quantity: 1,
        stock: 20
      }
    ]
  }
];
export const TOP_PRODUCTS = [
  { id: 1, name: "Đồ Chơi Nhà Bếp", sold: "12k+", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66" },
  { id: 2, name: "Đồ Chơi Bác Sĩ", sold: "7k+", image: "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lm082k796k7966" },
  { id: 3, name: "Xe Điều Khiển", sold: "3k+", image: "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5w-lwd088r58r5836" },
  { id: 4, name: "Loa Kéo", sold: "1k+", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm4f8q78q78q66" },
  { id: 5, name: "Son Kem Lì", sold: "90k+", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljz8f8q8q8q866" },
  { id: 6, name: "Quần Lót Cute", sold: "21k+", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66" },
];

// Cập nhật lại CATEGORIES cho giống hình mẫu (20 danh mục để chia 2 dòng)
export const CATEGORIES_FULL = Array(20).fill(null).map((_, i) => ({
    id: i,
    name: ["Thời trang nam", "Điện thoại", "Thiết bị điện tử", "Laptop", "Máy ảnh", "Đồng hồ", "Giày dép", "Đồ gia dụng", "Thể thao", "Xe máy"][i % 10],
    img: `https://cf.shopee.vn/file/687f3967b7c2fe6a134a2c11894eea4b_tn` // Link ảnh demo icon
}));
export const MOCK_PRODUCT_DETAIL = {
  id: 1,
  name: "Áo thun Cổ tròn FUTURE2 form chuẩn Unisex nam nữ, chất liệu mềm mịn, trẻ trung, hiện đại, dễ phối đồ",
  images: [
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66", 
    "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lm082k796k7966",
    "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5w-lwd088r58r5836",
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm4f8q78q78q66"
  ],
  price: 89380,
  originalPrice: 218000,
  discount: 59,
  rating: 4.9,
  ratingCount: 28,
  sold: 145,
  flashSaleEndTime: Date.now() + 7200000, // Kết thúc sau 2 tiếng
  shop: {
    name: "Minn.Houses",
    avatar: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66", // Tạm dùng ảnh này
    products: 155,
    followers: "1,3k",
    rating: 4.9,
    responseRate: "100%",
    joinTime: "7 năm trước"
  },
  variants: {
    colors: ["FUTURE2- 2 ÁO TRẮNG", "FUTURE2- 2 ÁO ĐEN", "FUTURE2- ĐEN+TRẮNG"],
    sizes: ["S", "M", "L", "XL"]
  },
  stock: 2456,
  description: "Chất liệu: Cotton khô thoáng mát\nXuất xứ: Việt Nam\nKiểu dáng: Form rộng Unisex...",
  reviews: [
    {
       user: "quoctruong",
       rating: 5,
       date: "2025-11-29 09:53",
       comment: "Giao hàng nhanh, săn sale nên được giá rẻ, sản phẩm chất lượng, hài lòng về sản phẩm",
       variant: "CTRÒN FUTURE2- TRẮNG,L"
    },
    {
       user: "vanvuong98",
       rating: 5,
       date: "2025-11-19 13:41",
       comment: "Áo đẹp quá shop ơi",
       variant: "FUTURE2- 2 ÁO TRẮNG,XL"
    }
  ]
};
export const MOCK_USER_INFO = {
    name: "Quang Hiếu",
    phone: "(+84) 945 715 956",
    address: "Số 2, Đường Nguyễn Cơ Thạch, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng",
    default: true
};

export const PAYMENT_METHODS = [
    { id: 'shopeepay', name: "Ví ShopeePay", icon: "https://down-vn.img.susercontent.com/file/vn-50009109-ec3ae5a663b4b8b3df9e6141a4a6e00a" },
    { id: 'cod', name: "Thanh toán khi nhận hàng", icon: "" },
    { id: 'bank', name: "Thẻ Tín dụng/Ghi nợ", icon: "" }
];
export const MOCK_ORDERS = [
  {
    id: "ORD-001",
    shopName: "T-Home&More",
    status: "completed", // Trạng thái dùng để lọc
    statusText: "HOÀN THÀNH", // Text hiển thị
    deliveryText: "Giao hàng thành công",
    items: [
      {
        id: 1,
        name: "Máy massage chườm ấm giảm đau bụng kinh nguyệt quà tặng bạn nữ T-Home&More",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm6e2y3y6y3y66",
        variant: "PHIÊN BẢN 2024-2025",
        price: 319000,
        originalPrice: 450000,
        quantity: 1
      }
    ],
    totalPrice: 238956,
    canRate: true, // Có thể đánh giá
    canRepurchase: true // Có thể mua lại
  },
  {
    id: "ORD-002",
    shopName: "SHIN CASE - ỐP LƯNG",
    status: "completed",
    statusText: "HOÀN THÀNH",
    deliveryText: "Giao hàng thành công",
    items: [
      {
        id: 2,
        name: "Ốp Lưng iPhone Sleep Couple IMD Cứng Nhám, Chống Sốc",
        image: "https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lm082k796k7966",
        variant: "Cún Trắng, 16 Pro",
        price: 31900,
        originalPrice: 35000,
        quantity: 1
      }
    ],
    totalPrice: 45000,
    canRate: true,
    canRepurchase: true
  },
  {
    id: "ORD-003",
    shopName: "Coolmate Official",
    status: "shipping",
    statusText: "VẬN CHUYỂN",
    deliveryText: "Đơn hàng đang được vận chuyển",
    items: [
      {
        id: 3,
        name: "Áo Thun Nam Cotton Compact Siêu Mát",
        image: "https://down-vn.img.susercontent.com/file/sg-11134201-7rd5w-lwd088r58r5836",
        variant: "Xanh Navy, L",
        price: 159000,
        originalPrice: 159000,
        quantity: 2
      }
    ],
    totalPrice: 318000,
    canRate: false,
    canRepurchase: false
  }
];
export const MOCK_PROFILE = {
    id: 1,
    username: "quanghieule",
    name: "Lê Quang Hiếu",
    email: "le***********@gmail.com",
    phone: "********56",
    gender: "nam",
    dob: {
        day: 1,
        month: 1,
        year: 2003
    },
    avatar: "https://down-vn.img.susercontent.com/file/sg-11134004-7rd70-m3l5m5m5m5m566" // Ảnh avatar mẫu
};
export const MOCK_BANKS = [
  {
    id: 1,
    bankName: "MB - NHTMCP QUAN DOI",
    logo: "https://down-vn.img.susercontent.com/file/vn-50009109-c9a9cc9e97914db0b87563725586617c", // Logo MB mẫu
    accountName: "Le Quang Hieu",
    branch: "CN Quang Tri (MB)",
    lastDigits: "9999",
    isVerified: true,
    isDefault: true
  }
  // Bạn có thể thêm ngân hàng khác vào đây để test
];

export const MOCK_CREDIT_CARDS = [];
export const MOCK_ADDRESSES = [
  {
    id: 1,
    name: "Quang Hiếu",
    phone: "(+84) 945 715 956",
    street: "Số 2, Đường Nguyễn Cơ Thạch",
    ward: "Phường Khuê Mỹ",
    district: "Quận Ngũ Hành Sơn",
    city: "Đà Nẵng",
    isDefault: true,
    isPickup: false
  },
  {
    id: 2,
    name: "Trương Khắc Ti",
    phone: "(+84) 945 715 956",
    street: "245 Trần Đại Nghĩa",
    ward: "Phường Hòa Hải",
    district: "Quận Ngũ Hành Sơn",
    city: "Đà Nẵng",
    isDefault: false,
    isPickup: true 
  },
  {
    id: 3,
    name: "Kim Anh",
    phone: "(+84) 913 026 238",
    street: "09 Ngô Quyền",
    ward: "Phường 5",
    district: "Thành Phố Đông Hà",
    city: "Quảng Trị",
    isDefault: false,
    isPickup: false
  }
];
export const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz4zy7136k3z26_tn', 
    title: 'Đang vận chuyển',
    content: 'Đơn hàng 2512112CY6D2PJ với mã vận đơn SPXVN05300405000C đã được Người bán Basefast Accessories giao cho đơn vị vận chuyển qua phương thức vận chuyển SPX Express.',
    time: '10:40 11-12-2025',
    action: 'Xem Chi Tiết',
    isRead: false,
    type: 'shipping'
  },
  {
    id: 2,
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm0g4t7y8z9a43_tn',
    title: 'Đang vận chuyển',
    content: 'Đơn hàng 2512112CK6Y8TM với mã vận đơn SPXVN05462364494C đã được Người bán Tổng Kho Sỉ Hà Nội 1 giao cho đơn vị vận chuyển qua phương thức vận chuyển SPX Express.',
    time: '10:14 11-12-2025',
    action: 'Xem Chi Tiết',
    isRead: false,
    type: 'shipping'
  },
  {
    id: 3,
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llz3y5x6w7c8d9_tn',
    title: 'Đơn hàng đã hoàn tất',
    content: 'Đơn hàng 2512017NEGWM41 đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 06-01-2026 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!',
    time: '16:13 07-12-2025',
    action: 'Đánh Giá Sản Phẩm',
    isRead: true, 
    type: 'order'
  },
  {
    id: 4,
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llz3y5x6w7c8ee_tn',
    title: 'Đơn hàng đã hoàn tất',
    content: 'Đơn hàng 2512016E1E53ST đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 05-01-2026 để nhận 200 xu và giúp người dùng khác hiểu hơn về sản phẩm nhé!',
    time: '16:46 06-12-2025',
    action: 'Đánh Giá Sản Phẩm',
    isRead: true,
    type: 'order'
  }
];
