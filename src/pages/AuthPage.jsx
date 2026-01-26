import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        try {
            const response = await api.post(endpoint, formData);
            if (isLogin) {
                login(response.data); // Store user in Context
                navigate('/');        // Go to Home
            } else {
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
            <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input 
                        type="text" placeholder="Username" 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                    />
                )}
                <input 
                    type="email" placeholder="Email" required
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                />
                <input 
                    type="password" placeholder="Password" required
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    style={{ display: 'block', width: '100%', marginBottom: '10px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: 'blue', textAlign: 'center' }}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default AuthPage;