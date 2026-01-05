// src/hooks/common/useChat.js
import { useState, useEffect } from 'react';
import { CONVERSATIONS, MOCK_MESSAGES } from '../../data/mockChat';

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng widget
  const [isMinimized, setIsMinimized] = useState(true); // Trạng thái thu nhỏ
  const [activeShop, setActiveShop] = useState(null); // Shop đang chat
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 1. Load danh sách hội thoại
  useEffect(() => {
    setConversations(CONVERSATIONS);
  }, []);

  // 2. Load tin nhắn khi chọn Shop
  useEffect(() => {
    if (activeShop) {
      // Giả lập gọi API lấy tin nhắn của shop đó
      setMessages(MOCK_MESSAGES);
    }
  }, [activeShop]);

  // Hành động: Mở chat (từ nút Chat trên trang Product)
  const openChatWithShop = (shop) => {
    setIsOpen(true);
    setIsMinimized(false);
    setActiveShop(shop);
  };

  // Hành động: Gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage("");

    // Giả lập Shop trả lời sau 1s
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'shop',
        text: "Cảm ơn bạn đã nhắn tin. Shop sẽ phản hồi sớm nhất ạ!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  // Hành động: Toggle cửa sổ
  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return {
    isOpen, setIsOpen,
    isMinimized, setIsMinimized,
    activeShop, setActiveShop,
    conversations,
    messages,
    newMessage, setNewMessage,
    openChatWithShop,
    handleSendMessage,
    toggleChatWindow
  };
};