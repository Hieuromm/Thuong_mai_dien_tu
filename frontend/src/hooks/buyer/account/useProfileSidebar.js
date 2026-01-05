import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useProfileSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const IMAGE_BASE_URL = "http://localhost:8080/images/avatars/";

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  // 3. Xử lý đường dẫn ảnh
  const getAvatarUrl = (url) => {
    const targetUrl = url || user?.avatar || user?.avatarUrl;
    if (!targetUrl) return DEFAULT_AVATAR;
    
    if (targetUrl.startsWith('blob:') || targetUrl.startsWith('http')) {
      return targetUrl;
    }
    
    return `${IMAGE_BASE_URL}${targetUrl}`;
  };

  // 4. Logic điều hướng
  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path) => 
    isActive(path) 
      ? 'text-[#ee4d2d] font-medium' 
      : 'text-gray-500 hover:text-[#ee4d2d] transition-colors';

  return {
    user,
    getAvatarUrl,
    getLinkClass,
    isActive,
    DEFAULT_AVATAR
  };
};