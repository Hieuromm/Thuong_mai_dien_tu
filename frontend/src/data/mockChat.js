// src/data/mockChat.js

export const CONVERSATIONS = [
  {
    id: "S001",
    shopName: "Thời trang H_A_N",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Dạ sản phẩm này còn hàng bạn nhé!",
    time: "10:30",
    unread: 2,
    online: true
  },
  {
    id: "S002",
    shopName: "Tech Store VN",
    avatar: "https://via.placeholder.com/150",
    lastMessage: "Cảm ơn bạn đã ủng hộ shop ạ.",
    time: "Hôm qua",
    unread: 0,
    online: false
  }
];

export const MOCK_MESSAGES = [
  { id: 1, sender: 'me', text: "Shop ơi, áo này size L còn không ạ?", time: "10:00" },
  { id: 2, sender: 'shop', text: "Chào bạn, để shop kiểm tra kho chút nhé.", time: "10:05" },
  { id: 3, sender: 'shop', text: "Dạ sản phẩm này còn hàng bạn nhé! Bạn đặt sớm kẻo hết ạ.", time: "10:30" }
];