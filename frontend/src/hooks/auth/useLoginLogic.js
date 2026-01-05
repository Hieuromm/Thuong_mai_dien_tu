// src/hooks/auth/useLoginLogic.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const useLoginLogic = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.username || !formData.password) {
      setErrorMsg("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Gọi API
      const data = await loginAPI(formData.username, formData.password);
      
      // 2. Lưu vào Context & LocalStorage (Backend trả về: token, role, fullName...)
      // Tạo object user để lưu
      const userToSave = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        avatar: "https://via.placeholder.com/150" 
      };

      login(userToSave, data.token);

      if (data.role === 'ADMIN' || data.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, isLoading, errorMsg, handleLogin };
};