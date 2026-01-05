import React, { useRef } from 'react';
import { FaImage, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { useEditProduct } from '../../../hooks/seller/product/useEditProduct';

const EditProduct = () => {
  // Lấy state và hàm từ Hook
  const {
      product, setProduct,
      enableVariations, setEnableVariations,
      group1, setGroup1,
      group2, setGroup2,
      variants, setVariants,
      previewUrls, setPreviewUrls,
      selectedFiles, setSelectedFiles,
      loading,
      handleUpdate
  } = useEditProduct();

  // State tạm cho input nhập nhanh
  const [input1, setInput1] = React.useState('');
  const [input2, setInput2] = React.useState('');
  const fileInputRef = useRef(null);
  
  const sections = ['Thông tin cơ bản', 'Mô tả', 'Thông tin bán hàng', 'Vận chuyển'];

  // --- XỬ LÝ ẢNH ---
  const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      // Reset ảnh cũ để chọn ảnh mới (hoặc bạn có thể code thêm logic nối mảng)
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setSelectedFiles(files); 
      setPreviewUrls(newPreviews);
  };

  const removeImage = (index) => {
      // Vì logic edit phức tạp (ảnh cũ là url, ảnh mới là file), 
      // để đơn giản: xóa là xóa hết chọn lại
      setPreviewUrls([]);
      setSelectedFiles([]);
  };

  // --- XỬ LÝ BIẾN THỂ ---
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

  const removeValue = (groupNum, val) => {
      if (groupNum === 1) setGroup1(prev => ({ ...prev, values: prev.values.filter(v => v !== val) }));
      else setGroup2(prev => ({ ...prev, values: prev.values.filter(v => v !== val) }));
  };

  // Sinh bảng matrix khi user thay đổi nhóm phân loại
  // Lưu ý: Chỉ chạy khi đang edit, không chạy lúc mới load để tránh đè dữ liệu cũ
  React.useEffect(() => {
      if (!enableVariations || loading) return;

      // Logic: Nếu variants hiện tại khớp với group1/group2 thì giữ nguyên giá/kho
      // Nếu không khớp (user thêm/bớt màu) thì tạo mới
      
      let newVariants = [];
      if (group1.values.length > 0 && group2.values.length > 0) {
          group1.values.forEach(v1 => {
              group2.values.forEach(v2 => {
                  // Tìm xem biến thể này đã có giá/kho cũ chưa
                  const old = variants.find(v => v.value1 === v1 && v.value2 === v2);
                  newVariants.push({ 
                      value1: v1, 
                      value2: v2, 
                      price: old ? old.price : '', 
                      stock: old ? old.stock : '' 
                  });
              });
          });
      } else if (group1.values.length > 0) {
          group1.values.forEach(v1 => {
              const old = variants.find(v => v.value1 === v1);
              newVariants.push({ 
                  value1: v1, 
                  value2: null, 
                  price: old ? old.price : '', 
                  stock: old ? old.stock : '' 
              });
          });
      }
      setVariants(newVariants);
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group1.values, group2.values]);

  const handleVariantChange = (index, field, value) => {
      const updated = [...variants];
      updated[index][field] = value;
      setVariants(updated);
  };

  const handleChange = (e) => {
      setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const onSave = (isHidden) => {
      handleUpdate(product, selectedFiles, isHidden, variants, group1.name, group2.name);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#ee4d2d]">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="bg-[#f6f6f6] min-h-screen pb-20 font-sans text-sm">
        
      <div className="max-w-[1400px] mx-auto pt-6 px-4 grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 items-start">

        {/* --- MENU TRÁI --- */}
        <div className="hidden lg:block sticky top-24">
            <div className="bg-white p-4 rounded-sm shadow-sm">
                <h3 className="font-bold mb-3 text-gray-800">Chỉnh sửa</h3>
                <ul className="space-y-2 text-gray-500 text-[13px]">
                    <li>Cập nhật thông tin</li>
                    <li>Thay đổi giá & kho</li>
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

        {/* --- FORM GIỮA --- */}
        <div className="space-y-6">
            
            {/* 1. CƠ BẢN */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Thông tin cơ bản</h2>
                
                {/* Upload Ảnh */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Hình ảnh sản phẩm</label>
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
                        {previewUrls.length === 0 && (
                            <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 border-2 border-dashed border-[#ee4d2d] rounded-sm flex flex-col items-center justify-center text-[#ee4d2d] cursor-pointer hover:bg-orange-50 bg-white">
                                <FaPlus className="text-xl mb-1"/><span className="text-xs px-1 text-center">Thay ảnh</span>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden"/>
                    </div>
                </div>

                {/* Tên & Ngành */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Tên sản phẩm</label>
                    <input type="text" name="name" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={product.name} onChange={handleChange}/>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">Ngành hàng</label>
                    <input type="text" name="category" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={product.category} onChange={handleChange}/>
                </div>
            </div>

            {/* 2. MÔ TẢ */}
            <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Mô tả sản phẩm</h2>
                <textarea name="description" className="w-full border p-2 h-40 rounded-sm outline-none resize-none focus:border-gray-500" value={product.description} onChange={handleChange}></textarea>
            </div>

             {/* 3. BÁN HÀNG */}
             <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Thông tin bán hàng</h2>
                
                {!enableVariations && (
                    <div className="mb-6">
                        <button onClick={() => setEnableVariations(true)} className="border border-dashed border-[#ee4d2d] text-[#ee4d2d] px-4 py-2 rounded-sm text-sm hover:bg-orange-50 flex items-center gap-2">
                            <FaPlus /> Thêm phân loại hàng
                        </button>
                    </div>
                )}

                {/* KHU VỰC BIẾN THỂ */}
                {enableVariations && (
                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-medium text-gray-700">Phân loại hàng</h3>
                            <button onClick={() => setEnableVariations(false)} className="text-gray-400 hover:text-red-500"><FaTrash/></button>
                        </div>

                        {/* Nhóm 1 */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-600 block mb-1">Nhóm 1</label>
                            <div className="flex gap-2 mb-2">
                                <input type="text" value={group1.name} onChange={(e) => setGroup1({...group1, name: e.target.value})} className="border p-1 w-32 text-sm rounded-sm bg-white"/>
                                <input type="text" placeholder="Nhập giá trị..." className="border p-1 flex-1 text-sm rounded-sm bg-white" value={input1} onChange={(e) => setInput1(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addValue(1, input1)}/>
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
                            <label className="text-sm text-gray-600 block mb-1">Nhóm 2</label>
                            <div className="flex gap-2 mb-2">
                                <input type="text" value={group2.name} onChange={(e) => setGroup2({...group2, name: e.target.value})} className="border p-1 w-32 text-sm rounded-sm bg-white"/>
                                <input type="text" placeholder="Nhập giá trị..." className="border p-1 flex-1 text-sm rounded-sm bg-white" value={input2} onChange={(e) => setInput2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addValue(2, input2)}/>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group2.values.map(v => (
                                    <span key={v} className="bg-white border px-2 py-1 text-xs rounded-sm flex items-center gap-2 text-gray-700 shadow-sm">
                                        {v} <FaTimes className="cursor-pointer hover:text-red-500" onClick={() => removeValue(2, v)}/>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bảng nhập giá */}
                        {variants.length > 0 && (
                            <div className="mt-4 overflow-x-auto border border-gray-200 rounded-sm bg-white">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="p-2 border-r">{group1.name || 'Nhóm 1'}</th>
                                            {group2.values.length > 0 && <th className="p-2 border-r">{group2.name || 'Nhóm 2'}</th>}
                                            <th className="p-2 border-r w-32">Giá</th>
                                            <th className="p-2 w-32">Kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((v, idx) => (
                                            <tr key={idx} className="border-t">
                                                <td className="p-2 border-r text-gray-800">{v.value1}</td>
                                                {group2.values.length > 0 && <td className="p-2 border-r text-gray-800">{v.value2}</td>}
                                                <td className="p-2 border-r"><input type="number" className="w-full border p-1 rounded-sm" value={v.price} onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}/></td>
                                                <td className="p-2"><input type="number" className="w-full border p-1 rounded-sm" value={v.stock} onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}/></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {!enableVariations && (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Giá</label>
                            <input type="number" name="price" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={product.price} onChange={handleChange}/>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">Kho hàng</label>
                            <input type="number" name="stock" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={product.stock} onChange={handleChange}/>
                        </div>
                    </div>
                )}
             </div>

             {/* 4. VẬN CHUYỂN */}
             <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-lg font-medium text-gray-800 mb-6">Vận chuyển</h2>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">Cân nặng (gr)</label>
                    <input type="number" name="weight" className="w-1/2 border p-2 rounded-sm outline-none focus:border-gray-500" value={product.weight} onChange={handleChange}/>
                </div>
             </div>
        </div>

        {/* --- CỘT PHẢI: PREVIEW --- */}
        <div className="hidden lg:block sticky top-24">
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-100 font-medium text-gray-800">Xem trước</div>
                <div className="bg-gray-100 p-4 flex justify-center">
                    <div className="w-[260px] bg-white min-h-[400px] shadow-md rounded-md overflow-hidden relative">
                        <div className="h-[260px] bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                             {previewUrls.length > 0 ? <img src={previewUrls[0]} className="w-full h-full object-cover" alt="Cover"/> : <FaImage className="text-4xl opacity-50"/>}
                        </div>
                        <div className="p-3">
                            <div className="text-sm line-clamp-2 mb-1 text-gray-800 leading-snug">{product.name || 'Tên sản phẩm...'}</div>
                            <div className="text-[#ee4d2d] text-base font-medium">
                                ₫{product.price ? new Intl.NumberFormat('vi-VN').format(product.price) : '0'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 shadow-lg py-4 px-6 z-50 flex justify-end gap-4">
            <button onClick={() => onSave(true)} disabled={loading} className="px-6 py-2 rounded-sm border text-gray-600 hover:bg-gray-50">Lưu & Ẩn</button>
            <button onClick={() => onSave(false)} disabled={loading} className="px-6 py-2 rounded-sm bg-[#ee4d2d] text-white hover:opacity-90">{loading ? 'Đang lưu...' : 'Cập nhật'}</button>
      </div>

    </div>
  );
};

export default EditProduct;