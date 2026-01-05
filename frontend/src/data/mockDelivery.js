// src/data/mockDelivery.js

export const CARRIERS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'SPX', label: 'SPX Express' },
  { id: 'GHN', label: 'Giao Hàng Nhanh' },
  { id: 'NJV', label: 'Ninja Van' },
  { id: 'VTP', label: 'Viettel Post' },
  { id: 'J&T', label: 'J&T Express' },
];

export const MOCK_SHIP_ORDERS = [
  {
    id: "231215ABC123",
    productName: "Áo Thun Nam Basic Cotton 100%",
    image: "https://via.placeholder.com/50",
    buyer: "nguyenvana",
    carrier: "SPX Express",
    deadline: "15/12/2023",
    status: "Chờ lấy hàng",
    pickupAddress: "Kho Hà Nội - 123 Cầu Giấy"
  },
  {
    id: "231215XYZ789",
    productName: "Quần Jean Ống Rộng",
    image: "https://via.placeholder.com/50",
    buyer: "tranthib",
    carrier: "Giao Hàng Nhanh",
    deadline: "16/12/2023",
    status: "Chờ lấy hàng",
    pickupAddress: "Kho Đà Nẵng - 456 Lê Duẩn"
  },
  {
    id: "231216LMN456",
    productName: "Tai nghe Bluetooth",
    image: "https://via.placeholder.com/50",
    buyer: "lethic",
    carrier: "SPX Express",
    deadline: "14/12/2023",
    status: "Chờ lấy hàng",
    pickupAddress: "Kho Hà Nội - 123 Cầu Giấy"
  },
  {
    id: "231217KJH999",
    productName: "Ốp lưng iPhone 15 Pro Max",
    image: "https://via.placeholder.com/50",
    buyer: "hoangd",
    carrier: "J&T Express",
    deadline: "17/12/2023",
    status: "Chờ lấy hàng",
    pickupAddress: "Kho HCM - Quận 1"
  }
];