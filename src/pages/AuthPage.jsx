import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
    }

    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" data-aos="zoom-in">
        <div className="auth-header">
          <h2>{isLogin ? 'Xush kelibsiz' : 'Hisob yaratish'}</h2>
          <p>{isLogin ? 'Vazifalaringizni boshqarish uchun tizimga kiring' : 'Vazifalarni tartibga solishni boshlash uchun ro\'yxatdan o\'ting'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>To'liq ism</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ali Valiyev"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email manzil</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="siz@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Jarayonda...' : (isLogin ? (
              <><LogIn size={18} /> Kirish</>
            ) : (
              <><UserPlus size={18} /> Ro'yxatdan o'tish</>
            ))}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Hisobingiz yo'qmi? " : "Hisobingiz bormi? "}
            <button 
              type="button" 
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
