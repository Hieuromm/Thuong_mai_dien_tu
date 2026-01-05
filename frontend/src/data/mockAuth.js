// src/data/mockAuth.js

export const MOCK_USERS = [
  { 
    id: 1, 
    username: 'admin', 
    password: '123',
    name: 'Admin User', 
    role: 2, 
    token: 'fake-jwt-token-seller-123456' 
  },
  { 
    id: 2, 
    username: 'user1', 
    password: '123',
    name: 'Nguyễn Văn A', 
    role: 1, // 1 = Buyer (Người mua)
    token: 'fake-jwt-token-buyer-987654' 
  }
];