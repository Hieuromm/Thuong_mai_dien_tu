import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaCamera } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, onSubmit, productName, productImage }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
        setRating(5);
        setComment('');
        setSelectedImage(null);
        setPreviewImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit({ rating, comment, image: selectedImage });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg w-full max-w-[600px] p-6 relative shadow-xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-bold mb-5 text-gray-800">Đánh giá sản phẩm</h2>

        {/* 1. Thông tin sản phẩm */}
        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
            <img src={productImage} alt="product" className="w-16 h-16 object-cover border rounded-sm"/>
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 line-clamp-2">{productName}</div>
                <div className="text-xs text-green-600 mt-1">Đã mua hàng chính hãng</div>
            </div>
        </div>

        {/* 2. Chọn Sao */}
        <div className="flex flex-col items-center mb-6">
            <div className="flex gap-2">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      className="hidden" 
                      value={ratingValue} 
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar 
                      className="transition-transform duration-200 group-hover:scale-110" 
                      size={32} 
          
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
            <div className="text-sm text-[#131110] font-medium mt-2">
                {rating === 5 ? 'Tuyệt vời' : rating === 4 ? 'Hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Không hài lòng' : 'Tệ'}
            </div>
        </div>

        {/* 3. Khu vực nhập nội dung & Ảnh */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-6">
            <textarea
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none resize-none mb-3"
                rows="4"
                placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            
            <div className="flex gap-2">
                <label className="cursor-pointer border border-[#1f1d1c] text-[#1b1919] px-3 py-1.5 rounded-sm text-xs flex items-center gap-2 hover:bg-orange-50 transition">
                    <FaCamera /> Thêm Hình ảnh
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>

                {previewImage && (
                    <div className="relative w-10 h-10 border border-gray-300 rounded overflow-hidden group">
                        <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => { setSelectedImage(null); setPreviewImage(null); }}
                            className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                            <FaTimes size={10}/>
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* 4. Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-sm text-sm hover:bg-gray-50 text-gray-600">Trở lại</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-[#181414] text-white rounded-sm text-sm font-medium hover:opacity-90 shadow-sm">Hoàn thành</button>
        </div>

      </div>
    </div>
  );
};

export default ReviewModal; 