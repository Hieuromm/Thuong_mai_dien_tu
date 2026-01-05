import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaVideo, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useAddProduct } from '../../../hooks/seller/product/useAddProduct';
const AddProduct = () => {
  const { loading, handleSubmit } = useAddProduct();
  
  // --- 1. STATE THÔNG TIN CƠ BẢN ---
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    weight: '',
    price: '', // Giá mặc định (nếu ko có phân loại)
    stock: ''  // Kho mặc định (nếu ko có phân loại)
  });

  // --- 2. STATE QUẢN LÝ ẢNH ---
  const [selectedFiles, setSelectedFiles] = useState([]); // File để gửi server
  const [previewUrls, setPreviewUrls] = useState([]);     // URL blob để hiển thị
  const fileInputRef = useRef(null);

  // --- 3. STATE PHÂN LOẠI HÀNG (VARIANTS) ---
  const [enableVariations, setEnableVariations] = useState(false);
  
  // Nhóm 1 (Ví dụ: Màu sắc)
  const [group1, setGroup1] = useState({ name: '', values: [] });
  const [input1, setInput1] = useState('');

  // Nhóm 2 (Ví dụ: Size)
  const [group2, setGroup2] = useState({ name: '', values: [] });
  const [input2, setInput2] = useState('');

  // Danh sách biến thể (Matrix)
  const [variants, setVariants] = useState([]);

  // Menu bên trái
  const sections = ['Thông tin cơ bản', 'Mô tả', 'Thông tin bán hàng', 'Vận chuyển'];

  // ================= XỬ LÝ ẢNH =================
  const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      if (selectedFiles.length + files.length > 5) {
          alert("Bạn chỉ được đăng tối đa 5 ảnh!");
          return;
      }

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSelectedFiles(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
      URL.revokeObjectURL(previewUrls[index]);
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
      return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, []);

  // ================= XỬ LÝ PHÂN LOẠI HÀNG =================
  
  // Thêm giá trị vào nhóm (VD: Thêm màu "Đỏ")
  const addValue = (groupNum, val) => {
      if (!val.trim()) return;
      if (groupNum === 1) {
          if (!group1.values.includes(val)) {
              setGroup1(prev => ({ ...prev, values: [...prev.values, val] }));
              setInput1('');
          }
      } else {
          if (!group2.values.includes(val)) {
              setGroup2(prev => ({ ...prev, values: [...prev.values, val] }));
              setInput2('');
          }
      }
  };

  // Xóa giá trị khỏi nhóm
  const removeValue = (groupNum, val) => {
      if (groupNum === 1) setGroup1(prev => ({ ...prev, values: prev.values.filter(v => v !== val) }));
      else setGroup2(prev => ({ ...prev, values: prev.values.filter(v => v !== val) }));
  };

  // Tự động sinh bảng nhập giá/kho (Matrix)
  useEffect(() => {
      if (!enableVariations) {
          setVariants([]);
          return;
      }

      let newVariants = [];
      // Logic tổ hợp chéo: (A, B) x (1, 2) => A1, A2, B1, B2
      if (group1.values.length > 0 && group2.values.length > 0) {
          group1.values.forEach(v1 => {
              group2.values.forEach(v2 => {
                  newVariants.push({ value1: v1, value2: v2, price: '', stock: '' });
              });
          });
      } else if (group1.values.length > 0) {
          group1.values.forEach(v1 => {
              newVariants.push({ value1: v1, value2: null, price: '', stock: '' });
          });
      }
      setVariants(newVariants);
  }, [group1.values, group2.values, enableVariations]);

  // Cập nhật giá/kho trong bảng
  const handleVariantChange = (index, field, value) => {
      const updated = [...variants];
      updated[index][field] = value;
      setVariants(updated);
  };

  // ================= XỬ LÝ CHUNG =================
  const handleChange = (e) => {
      setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSave = (isHidden) => {
      // Truyền đầy đủ dữ liệu sang Hook
      // params: (productInfo, images, isHidden, variantList, group1Name, group2Name)
      handleSubmit(product, selectedFiles, isHidden, variants, group1.name, group2.name);
  };

  // ================= RENDER UI =================
  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-20 font-sans text-sm">
        
      <div className="max-w-[1400px] mx-auto pt-6 px-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 items-start">

        {/* --- CỘT TRÁI: MENU --- */}
        <div className="hidden lg:block sticky top-24">
            <div className="bg-white p-4 rounded-sm shadow-sm">
                <h3 className="font-bold mb-3 text-gray-800">Mẹo đăng bán</h3>
                <ul className="space-y-3 text-gray-500 text-[13px]">
                    <li className="flex items-center gap-2"><span className="text-green-500">✔</span> Tối đa 5 ảnh</li>
                    <li className="flex items-center gap-2"><span className="text-gray-300">○</span> Tên rõ ràng</li>
                    <li className="flex items-center gap-2"><span className="text-gray-300">○</span> Phân loại chi tiết</li>
                </ul>
            </div>
            <ul className="mt-4 space-y-1">
                {sections.map((sec, idx) => (
                    <li key={idx} className={`cursor-pointer px-4 py-2 rounded-sm ${idx === 0 ? 'font-bold text-[#ee4d2d] bg-white border-l-4 border-[#ee4d2d]' : 'text-gray-600 hover:bg-white'}`}>
                        {sec}
                    </li>
                ))}
            </ul>
        </div>

        {/* --- CỘT GIỮA: FORM NHẬP LIỆU --- */}
        <div className="space-y-6">
            
            {/* 1. THÔNG TIN CƠ BẢN */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Thông tin cơ bản</h2>
                
                {/* Upload Ảnh */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Hình ảnh sản phẩm ({selectedFiles.length}/5) <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 flex-wrap">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="w-24 h-24 border border-gray-200 rounded-sm relative group">
                                <img src={url} alt="Preview" className="w-full h-full object-cover rounded-sm"/>
                                {index === 0 && <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-0.5">Ảnh bìa</div>}
                                <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border hover:text-red-500">
                                    <FaTimes size={10}/>
                                </button>
                            </div>
                        ))}
                        {selectedFiles.length < 5 && (
                            <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 border-2 border-dashed border-[#ee4d2d] rounded-sm flex flex-col items-center justify-center text-[#ee4d2d] cursor-pointer hover:bg-orange-50 bg-white">
                                <FaPlus className="text-xl mb-1"/><span className="text-xs px-1 text-center">Thêm ảnh</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden"/>
                    </div>
                </div>

                {/* Tên & Ngành hàng */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                    <input type="text" name="name" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" maxLength={120} value={product.name} onChange={handleChange} placeholder="Nhập tên sản phẩm + Thương hiệu..."/>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Ngành hàng <span className="text-red-500">*</span></label>
                    <input type="text" name="category" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={product.category} onChange={handleChange} placeholder="Ví dụ: Thời trang nam"/>
                </div>
            </div>

            {/* 2. MÔ TẢ */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Mô tả sản phẩm</h2>
                <textarea name="description" className="w-full border p-2 h-40 rounded-sm outline-none resize-none focus:border-gray-500" placeholder="Mô tả chi tiết chất liệu, công dụng..." value={product.description} onChange={handleChange}></textarea>
            </div>

             {/* 3. THÔNG TIN BÁN HÀNG (QUAN TRỌNG) */}
             <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Thông tin bán hàng</h2>
                
                {/* Nút bật phân loại */}
                {!enableVariations && (
                    <div className="mb-6">
                        <button onClick={() => setEnableVariations(true)} className="border border-dashed border-[#ee4d2d] text-[#ee4d2d] px-4 py-2 rounded-sm text-sm hover:bg-orange-50 flex items-center gap-2">
                            <FaPlus /> Thêm phân loại hàng
                        </button>
                    </div>
                )}

                {/* KHU VỰC NHẬP BIẾN THỂ */}
                {enableVariations && (
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 animate-fadeIn">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-medium text-gray-700">Phân loại hàng</h3>
                            <button onClick={() => setEnableVariations(false)} className="text-gray-400 hover:text-red-500"><FaTrash/></button>
                        </div>

                        {/* Nhóm 1 */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-600 block mb-1">Nhóm phân loại 1</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Tên nhóm (VD: Màu sắc)" 
                                    value={group1.name} 
                                    onChange={(e) => setGroup1({...group1, name: e.target.value})} 
                                    className="border p-2 w-40 text-sm rounded-sm bg-white outline-none focus:border-[#ee4d2d]"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Nhập giá trị (VD: Đỏ, Xanh) rồi Enter" 
                                    className="border p-2 flex-1 text-sm rounded-sm bg-white outline-none focus:border-[#ee4d2d]"
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addValue(1, input1)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group1.values.map(v => (
                                    <span key={v} className="bg-white border px-2 py-1 text-xs rounded-sm flex items-center gap-2 text-gray-700 shadow-sm">
                                        {v} <FaTimes className="cursor-pointer hover:text-red-500" onClick={() => removeValue(1, v)}/>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Nhóm 2 */}
                        <div className="mb-4 border-t pt-4">
                            <label className="text-sm text-gray-600 block mb-1">Nhóm phân loại 2 (Không bắt buộc)</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Tên nhóm (VD: Size)"
                                    value={group2.name} 
                                    onChange={(e) => setGroup2({...group2, name: e.target.value})} 
                                    className="border p-2 w-40 text-sm rounded-sm bg-white outline-none focus:border-[#ee4d2d]"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Nhập giá trị (VD: S, M) rồi Enter" 
                                    className="border p-2 flex-1 text-sm rounded-sm bg-white outline-none focus:border-[#ee4d2d]"
                                    value={input2}
                                    onChange={(e) => setInput2(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addValue(2, input2)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group2.values.map(v => (
                                    <span key={v} className="bg-white border px-2 py-1 text-xs rounded-sm flex items-center gap-2 text-gray-700 shadow-sm">
                                        {v} <FaTimes className="cursor-pointer hover:text-red-500" onClick={() => removeValue(2, v)}/>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bảng nhập giá (Matrix) */}
                        {variants.length > 0 && (
                            <div className="mt-4 overflow-x-auto border border-gray-200 rounded-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600 font-medium">
                                        <tr>
                                            <th className="p-3 border-r border-b">{group1.name || 'Nhóm 1'}</th>
                                            {group2.values.length > 0 && <th className="p-3 border-r border-b">{group2.name || 'Nhóm 2'}</th>}
                                            <th className="p-3 border-r border-b w-32">Giá <span className="text-red-500">*</span></th>
                                            <th className="p-3 border-b w-32">Kho hàng <span className="text-red-500">*</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((v, idx) => (
                                            <tr key={idx} className="border-b last:border-b-0 hover:bg-white bg-gray-50/50">
                                                <td className="p-3 border-r text-gray-800">{v.value1}</td>
                                                {group2.values.length > 0 && <td className="p-3 border-r text-gray-800">{v.value2}</td>}
                                                <td className="p-2 border-r">
                                                    <div className="relative">
                                                        <span className="absolute left-2 top-1.5 text-gray-400 text-xs">₫</span>
                                                        <input type="number" className="w-full border p-1 pl-5 rounded-sm outline-none focus:border-[#ee4d2d]" placeholder="0" value={v.price} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}/>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <input type="number" className="w-full border p-1 rounded-sm outline-none focus:border-[#ee4d2d]" placeholder="0" value={v.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Form nhập giá thường (Nếu TẮT phân loại) */}
                {!enableVariations && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Giá <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-400">₫</span>
                                <input type="number" name="price" className="w-full border p-2 pl-8 rounded-sm outline-none focus:border-gray-500" placeholder="Nhập giá" value={product.price} onChange={handleChange}/>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Kho hàng <span className="text-red-500">*</span></label>
                            <input type="number" name="stock" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" placeholder="Nhập số lượng" value={product.stock} onChange={handleChange}/>
                        </div>
                    </div>
                )}
             </div>

             {/* 4. VẬN CHUYỂN */}
             <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Vận chuyển</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Cân nặng (Sau đóng gói)</label>
                    <div className="relative w-1/2">
                         <input type="number" name="weight" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" placeholder="Nhập cân nặng" value={product.weight} onChange={handleChange}/>
                         <span className="absolute right-3 top-2 text-gray-400">gr</span>
                    </div>
                </div>
             </div>
        </div>

        {/* --- CỘT PHẢI: MOBILE PREVIEW --- */}
        <div className="hidden lg:block sticky top-24">
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-100 font-medium text-gray-800">Xem trước</div>
                <div className="bg-gray-100 p-4 flex justify-center">
                    <div className="w-[260px] bg-white min-h-[400px] shadow-md rounded-md overflow-hidden relative">
                        {/* Ảnh */}
                        <div className="h-[260px] bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                             {previewUrls.length > 0 ? <img src={previewUrls[0]} className="w-full h-full object-cover" alt="Cover"/> : <FaImage className="text-4xl opacity-50"/>}
                        </div>
                        
                        {/* Thông tin */}
                        <div className="p-3">
                            <div className="bg-red-500 text-white text-[10px] inline-block px-1 rounded-sm mb-1">Yêu thích</div>
                            <div className="text-sm line-clamp-2 mb-1 text-gray-800 leading-snug">{product.name || 'Tên sản phẩm...'}</div>
                            
                            {/* Hiển thị giá (Nếu có variant thì lấy giá min) */}
                            <div className="text-[#ee4d2d] text-base font-medium">
                                ₫{product.price 
                                    ? new Intl.NumberFormat('vi-VN').format(product.price) 
                                    : (variants.length > 0 && variants[0].price ? new Intl.NumberFormat('vi-VN').format(variants[0].price) : '0')}
                            </div>
                            
                            <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                                <span>⭐ 0/5 (0)</span>
                                <span>Đã bán 0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 shadow-lg py-4 px-6 z-50 flex justify-end gap-4">
            <button className="px-6 py-2 rounded-sm border text-gray-600 hover:bg-gray-50">Hủy</button>
            <button onClick={() => onSave(true)} disabled={loading} className="px-6 py-2 rounded-sm border text-gray-600 hover:bg-gray-50">Lưu & Ẩn</button>
            <button 
                onClick={() => onSave(false)} 
                disabled={loading} 
                className="px-6 py-2 rounded-sm bg-[#ee4d2d] text-white hover:opacity-90 flex items-center gap-2 shadow-md"
            >
                {loading ? 'Đang tải lên...' : 'Lưu & Hiển thị'}
            </button>
      </div>

    </div>
  );
};

export default AddProduct;