import { useState, useEffect } from 'react';
import { getShopProfileAPI, updateShopProfileAPI } from '../../../services/shopService';

export const useShopProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    logo: '' // URL ảnh để hiển thị
  });
  
  const [tempProfile, setTempProfile] = useState(null); // Dữ liệu khi đang edit
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedFile, setSelectedFile] = useState(null); // File ảnh mới

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const data = await getShopProfileAPI();
        // Xử lý ảnh logo
        const logoUrl = data.logoUrl 
            ? (data.logoUrl.startsWith('http') ? data.logoUrl : `http://localhost:8080/images/shops/${data.logoUrl}`)
            : 'https://via.placeholder.com/150?text=Shop+Logo';

        setProfile({
            name: data.name,
            description: data.description || '',
            logo: logoUrl
        });
    } catch (error) {
        console.error("Lỗi tải hồ sơ shop:", error);
    }
  };

  // Bắt đầu sửa
  const handleStartEdit = () => {
      setTempProfile({ ...profile });
      setIsEditing(true);
  };

  // Hủy sửa
  const handleCancelEdit = () => {
      setTempProfile(null);
      setSelectedFile(null);
      setIsEditing(false);
  };

  // Thay đổi input text
  const handleChange = (field, value) => {
      setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  // Thay đổi ảnh
  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setSelectedFile(file);
          // Tạo URL ảo để preview ngay lập tức
          setTempProfile(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
      }
  };

  // Lưu thay đổi
  const handleSave = async () => {
      try {
          const formData = new FormData();
          
          // Gửi data JSON
          const shopData = {
              name: tempProfile.name,
              description: tempProfile.description
          };
          formData.append("data", JSON.stringify(shopData));

          // Gửi file ảnh nếu có
          if (selectedFile) {
              formData.append("logo", selectedFile);
          }

          await updateShopProfileAPI(formData);
          
          alert("Cập nhật thành công!");
          setIsEditing(false);
          fetchProfile(); // Load lại dữ liệu mới nhất từ server

      } catch (error) {
          alert("Lỗi cập nhật: " + error.message);
      }
  };

  return {
    profile,
    tempProfile,
    isEditing,
    activeTab,
    setActiveTab,
    handleStartEdit,
    handleCancelEdit,
    handleSave,
    handleChange,
    handleImageChange
  };
};