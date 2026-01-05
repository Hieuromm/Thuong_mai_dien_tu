import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAPI } from '../services/authService'; // Import service của bạn

const useLoginLogic = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(''); // Form dùng email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Gọi API từ service của bạn
      // Lưu ý: Backend Spring Boot thường map 'username' với 'email'
      // nên ta truyền email vào vị trí tham số username
      const data = await loginAPI(email, password);

      // data lúc này là response.data từ backend (chứa token, user info...)
      // Gọi hàm login của Context để cập nhật State
      login(data, data.token);

      navigate('/'); 
    } catch (err) {
      // Lấy message lỗi từ service ném ra
      setError(err.toString());
    }
  };

  return {
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleSubmit,
    error 
  };
};

export default useLoginLogic;