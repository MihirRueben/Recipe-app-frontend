import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        const payload = isLogin 
            ? { email: formData.email, password: formData.password } 
            : { username: formData.username, email: formData.email, password: formData.password };

        try {
            const response = await api.post(endpoint, payload);
            
            if (isLogin) {
                const { user, token } = response.data;
                localStorage.setItem('token', token);
                login(user);
                navigate('/');
            } else {
                alert("Registration successful! Switching to login...");
                setIsLogin(true);
            }
        } catch (err) {
            console.error("Auth Error:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Authentication failed. Please check your credentials.";
            alert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <ChefHat size={40} className="logo-icon" />
                    </div>
                    <h1 className="auth-title">
                        {isLogin ? 'Welcome Back' : 'Join the Community'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin ? 'Login to manage your recipes' : 'Create an account to start sharing'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">
                                <User size={16} className="input-icon" />
                                Username
                            </label>
                            <input 
                                type="text" 
                                placeholder="ChefName123" 
                                required={!isLogin}
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                className="form-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            <Mail size={16} className="input-icon" />
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Lock size={16} className="input-icon" />
                            Password
                        </label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="••••••••" 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                className="form-input"
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility}
                                className="password-toggle-btn"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                {isLogin ? 'Login' : 'Create Account'}
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-toggle">
                    <span className="toggle-text">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="toggle-link"
                    >
                        {isLogin ? ' Register here' : ' Login here'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;