// Dữ liệu mẫu cho danh sách sản phẩm
export const MOCK_PRODUCTS = [
  {
    id: 101,
    name: 'Áo thun nam Cotton Basic thoáng mát, thấm hút mồ hôi, co giãn 4 chiều',
    sku: 'TSHIRT-001-W',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz4zy7136k3z26_tn', 
    sales: 1250,
    price: 99000,
    stock: 50,
    status: 'active'
  },
  {
    id: 102,
    name: 'Ốp lưng iPhone 14 Pro Max chống sốc, silicon dẻo trong suốt cao cấp',
    sku: 'CASE-IP14-TR',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm0g4t7y8z9a43_tn',
    sales: 5400,
    price: 25000,
    stock: 1200,
    status: 'active'
  },
  {
    id: 103,
    name: 'Tai nghe Bluetooth không dây TWS F9, pin trâu, âm thanh vòm 9D',
    sku: 'AUDIO-F9-BL',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llz3y5x6w7c8d9_tn',
    sales: 89,
    price: 159000,
    stock: 20,
    status: 'active'
  },
  {
    id: 104,
    name: 'Giày Sneaker nam nữ thể thao phong cách Hàn Quốc',
    sku: 'SHOE-KR-05',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llz3y5x6w7c8ee_tn',
    sales: 0,
    price: 320000,
    stock: 100,
    status: 'unpublished'
  }
];

// Dữ liệu mẫu cho các Tab trạng thái
export const PRODUCT_TABS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'active', label: 'Đang hoạt động' },
    { id: 'violation', label: 'Vi phạm (0)' },
    { id: 'review', label: 'Chờ duyệt (0)' },
    { id: 'unpublished', label: 'Chưa được đăng' },
];