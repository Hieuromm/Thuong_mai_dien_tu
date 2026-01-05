
import React, { useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaMinus, FaPaperPlane, FaStore, FaImage, FaSmile } from 'react-icons/fa';
import { useChat } from '../../hooks/common/useChat';

const ChatWidget = () => {
  const {
    isOpen, setIsOpen,
    isMinimized, setIsMinimized,
    activeShop, setActiveShop,
    conversations,
    messages,
    newMessage, setNewMessage,
    handleSendMessage,
    toggleChatWindow
  } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // --- GIAO DIỆN NÚT TRÒN (KHI ĐÓNG) ---
  if (!isOpen) {
    return (
      <button 
        onClick={toggleChatWindow}
        className="fixed bottom-4 right-4 bg-[#242222] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-transform hover:scale-105 z-50 flex items-center gap-2"
      >
        <FaCommentDots size={24} />
        <span className="font-bold">Chat</span>
      </button>
    );
  }

  // --- GIAO DIỆN THANH THU NHỎ ---
  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-64 bg-white border border-gray-300 rounded-t-lg shadow-lg z-50">
        <div 
          className="bg-[#3b3736] text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer"
          onClick={() => setIsMinimized(false)}
        >
          <span className="font-bold flex items-center gap-2"><FaCommentDots/> Chat ({conversations.length})</span>
          <div className="flex gap-3">
             <FaTimes onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="cursor-pointer"/>
          </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN CỬA SỔ CHAT ĐẦY ĐỦ ---
  return (
    <div className="fixed bottom-0 right-4 w-[600px] h-[500px] bg-white border border-gray-300 rounded-t-lg shadow-2xl z-50 flex flex-col font-sans">
      
      {/* 1. HEADER */}
      <div className="bg-[#181615] text-white p-3 rounded-t-lg flex justify-between items-center shrink-0">
        <div className="font-bold flex items-center gap-2">
           <FaCommentDots/> {activeShop ? activeShop.shopName : "Chat"}
        </div>
        <div className="flex gap-4">
           <FaMinus className="cursor-pointer" onClick={() => setIsMinimized(true)} title="Thu nhỏ"/>
           <FaTimes className="cursor-pointer" onClick={() => setIsOpen(false)} title="Đóng"/>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. SIDEBAR (DANH SÁCH SHOP) */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-[#fdfdfd]">
           {/* Search */}
           <div className="p-2 border-b">
              <input type="text" placeholder="Tìm kiếm..." className="w-full px-2 py-1 text-sm border rounded outline-none focus:border-[#0e0d0d]"/>
           </div>
           
           {/* List */}
           <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => (
                 <div 
                    key={conv.id} 
                    onClick={() => setActiveShop(conv)}
                    className={`flex gap-2 p-3 cursor-pointer hover:bg-gray-100 transition-colors
                        ${activeShop?.id === conv.id ? 'bg-orange-50 border-l-4 border-[#0a0a0a]' : ''}
                    `}
                 >
                    <div className="relative">
                       <img src={conv.avatar} className="w-10 h-10 rounded-full border"/>
                       {conv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                          <h4 className="text-sm font-medium truncate">{conv.shopName}</h4>
                          {conv.unread > 0 && <span className="bg-[#2c2929] text-white text-[10px] px-1 rounded-full">{conv.unread}</span>}
                       </div>
                       <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* 3. CHAT AREA (NỘI DUNG CHAT) */}
        <div className="w-2/3 flex flex-col bg-[#f5f5f5]">
           
           {activeShop ? (
             <>
                {/* Header Shop nhỏ bên trong */}
                <div className="bg-white p-2 border-b flex justify-between items-center shadow-sm">
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{activeShop.shopName}</span>
                      <span className="text-xs text-green-500">Online</span>
                   </div>
                   <button className="text-gray-500 hover:text-[#181616]"><FaStore/></button>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                   {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                         {msg.sender === 'shop' && <img src={activeShop.avatar} className="w-8 h-8 rounded-full mr-2 self-end"/>}
                         
                         <div className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm
                            ${msg.sender === 'me' 
                               ? 'bg-[#dcf8c6] text-black rounded-tr-none' 
                               : 'bg-white text-gray-800 rounded-tl-none'
                            }
                         `}>
                            {msg.text}
                            <div className={`text-[10px] mt-1 text-right ${msg.sender==='me'?'text-gray-500':'text-gray-400'}`}>{msg.time}</div>
                         </div>
                      </div>
                   ))}
                   <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-3 border-t">
                   <div className="flex gap-3 text-gray-400 mb-2 px-1">
                      <FaSmile className="cursor-pointer hover:text-[#222020]"/>
                      <FaImage className="cursor-pointer hover:text-[#181312]"/>
                   </div>
                   <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nhập tin nhắn..." 
                        className="flex-1 outline-none text-sm bg-transparent"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button type="submit" className="text-[#131111] hover:scale-110 transition-transform">
                         <FaPaperPlane size={18}/>
                      </button>
                   </form>
                </div>
             </>
           ) : (
             // Màn hình chờ khi chưa chọn shop
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FaCommentDots size={48} className="mb-2 opacity-20"/>
                <p>Chọn một đoạn chat để bắt đầu</p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ChatWidget;