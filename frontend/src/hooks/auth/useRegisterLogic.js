
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../../services/authService';

export const useRegisterLogic = () => {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validate 
    if (!formData.username || !formData.password || !formData.email) {
      setErrorMsg("Vui lòng nhập Tên đăng nhập, Email và Mật khẩu.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    // 2. Gọi API
    setIsLoading(true);
    try {
      // Gửi đúng object mà Backend (RegisterRequest) yêu cầu
      await registerAPI({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone
      });
      
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      navigate('/login');

    } catch (error) {
      // Hiển thị lỗi từ Backend
      setErrorMsg(typeof error === 'string' ? error : "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    isLoading,
    errorMsg,
    handleRegister
  };
};