import { useState, useEffect } from 'react';
import { getProfileAPI, updateProfileAPI } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';

export const useMyProfile = () => {
  const { login, user } = useAuth();

  // 1. Cấu hình đường dẫn ảnh cơ sở từ Backend
  const IMAGE_BASE_URL = "http://localhost:8080/images/avatars/";

  const [profile, setProfile] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    gender: 'khac',
    day: 1, 
    month: 1, 
    year: 2000,
    avatar: '' 
  });

  // State lưu file vật lý để upload lên server
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const formatImageUrl = (url) => {
    if (!url) return "";
    // Nếu là link blob (xem trước) hoặc link tuyệt đối thì giữ nguyên
    if (url.startsWith('blob:') || url.startsWith('http')) {
      return url;
    }
    // Nếu là tên file từ database thì nối với đường dẫn folder avatars
    return `${IMAGE_BASE_URL}${url}`;
  };

  // 2. Load dữ liệu khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileAPI();
        
        // Xử lý tách chuỗi ngày sinh: "YYYY-MM-DD" -> [Y, M, D]
        let d = 1, m = 1, y = 2000;
        if (data.birthday) {
            const parts = data.birthday.split('-');
            y = parseInt(parts[0]);
            m = parseInt(parts[1]);
            d = parseInt(parts[2]);
        }

        setProfile({
            username: data.username,
            name: data.fullName || '',
            email: data.email || '',
            phone: data.phone || '',
            gender: data.gender || 'khac',
            avatar: formatImageUrl(data.avatarUrl),
            day: d,
            month: m,
            year: y
        });
      } catch (error) {
        console.error("Lỗi tải profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 3. Hàm thay đổi giá trị input văn bản
  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // 4. Hàm xử lý chọn ảnh và tạo ảnh xem trước (Preview)
  const handleAvatarChange = (file) => {
    if (file) {
        // Giải phóng URL cũ để tránh rò rỉ bộ nhớ
        if (profile.avatar.startsWith('blob:')) {
            URL.revokeObjectURL(profile.avatar);
        }
        
        const previewUrl = URL.createObjectURL(file);
        setProfile(prev => ({ ...prev, avatar: previewUrl }));
        setAvatarFile(file); 
    }
  };

  // 5. Hàm Lưu thông tin sử dụng FormData (Multipart)
  const handleSave = async () => {
    setIsSaving(true);
    try {
        const formattedDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`;

        const formData = new FormData();
        const userData = {
            fullName: profile.name,
            phone: profile.phone,
            gender: profile.gender,
            birthday: formattedDate
        };
        formData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        await updateProfileAPI(formData); 
        
        const updatedUser = { ...user, fullName: profile.name, avatar: profile.avatar };
        const token = localStorage.getItem('token');
        login(updatedUser, token);

        alert("✅ Lưu hồ sơ thành công!");
    } catch (error) {
        console.error("Lỗi khi lưu:", error);
        alert("❌ Lưu thất bại. Vui lòng thử lại.");
    } finally {
        setIsSaving(false);
    }
  };

  return {
    profile,
    loading,
    isSaving,
    handleChange,
    handleSave,
    handleAvatarChange
  };
};