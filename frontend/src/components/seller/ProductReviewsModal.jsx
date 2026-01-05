import React, { useState, useEffect } from 'react';
import { FaTimes, FaStar, FaReply, FaUserCircle } from 'react-icons/fa';
import { getReviewsByProductIdAPI } from '../../services/productService'; 
import { replyToReviewAPI } from '../../services/productService'; 

const ProductReviewsModal = ({ productId, productName, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [replyingTo, setReplyingTo] = useState(null); 
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviewsByProductIdAPI(productId);
                setReviews(data || []);
            } catch (error) {
                console.error("Lỗi tải đánh giá:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    // Xử lý gửi trả lời
    const handleSendReply = async (reviewId) => {
        if (!replyContent.trim()) return;
        setSubmitting(true);
        try {
            await replyToReviewAPI(reviewId, replyContent);
            
            // Cập nhật lại UI ngay lập tức
            setReviews(prev => prev.map(r => 
                r.id === reviewId ? { ...r, shopResponse: replyContent } : r
            ));
            
            setReplyingTo(null);
            setReplyContent('');
            alert("Đã gửi phản hồi thành công!");
        } catch (error) {
            alert("Lỗi khi gửi phản hồi: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => (
        <div className="flex text-[#ee4d2d]">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < rating ? "" : "text-gray-300"} size={12}/>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Đánh giá sản phẩm</h3>
                        <p className="text-sm text-gray-500 truncate max-w-md">{productName}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#f9f9f9]">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Đang tải đánh giá...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Sản phẩm này chưa có đánh giá nào.</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                                    {/* User Info */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                             {review.user?.avatar ? 
                                                <img src={review.user.avatar} className="w-full h-full object-cover"/> :
                                                <FaUserCircle className="w-full h-full text-gray-300" />
                                             }
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{review.user?.fullName || 'Khách hàng'}</div>
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            
                                            <div className="mt-2 text-sm text-gray-700">{review.comment}</div>
                                            
                                            {/* Ảnh khách review */}
                                            {review.images && review.images.length > 0 && (
                                                <div className="flex gap-2 mt-2">
                                                    {review.images.map((img, idx) => (
                                                        <img key={idx} src={img} alt="Review" className="w-16 h-16 object-cover border rounded-sm"/>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Phần Phản Hồi của Shop */}
                                    <div className="mt-4 ml-12">
                                        {review.shopResponse ? (
                                            <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 text-sm">
                                                <div className="font-medium text-[#ee4d2d] mb-1">Phản hồi của Shop:</div>
                                                <div className="text-gray-600">{review.shopResponse}</div>
                                            </div>
                                        ) : (
                                            // Form trả lời
                                            replyingTo === review.id ? (
                                                <div className="animate-fade-in">
                                                    <textarea 
                                                        className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-[#ee4d2d] outline-none"
                                                        rows="3"
                                                        placeholder="Nhập câu trả lời của bạn..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                    ></textarea>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button 
                                                            onClick={() => setReplyingTo(null)}
                                                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-sm"
                                                        >Hủy</button>
                                                        <button 
                                                            onClick={() => handleSendReply(review.id)}
                                                            disabled={submitting}
                                                            className="px-3 py-1 text-sm bg-[#ee4d2d] text-white rounded-sm hover:opacity-90 disabled:opacity-50"
                                                        >
                                                            {submitting ? 'Đang gửi...' : 'Gửi trả lời'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => { setReplyingTo(review.id); setReplyContent(''); }}
                                                    className="text-[#ee4d2d] text-sm flex items-center gap-1 hover:underline font-medium"
                                                >
                                                    <FaReply /> Trả lời đánh giá này
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductReviewsModal;