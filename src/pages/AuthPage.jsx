import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '' 
    });
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        const payload = isLogin 
            ? { email: formData.email, password: formData.password } 
            : { username: formData.username, email: formData.email, password: formData.password };

        try {
            const response = await api.post(endpoint, payload);
            
            if (isLogin) {
                // Destructure user and token from the backend response
                const { user, token } = response.data; 

                // 1. Save the token to localStorage so the Axios Interceptor can use it
                localStorage.setItem('token', token); 

                // 2. Update the AuthContext with the user data
                login(user); 

                // 3. Move to the home page
                navigate('/'); 
            } else {
                alert("Registration successful! Switching to login...");
                setIsLogin(true);
            }
        } catch (err) {
            console.error("Auth Error:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Authentication failed. Please check your credentials.";
            alert(errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join the Community'}</h2>
                <p style={styles.subtitle}>
                    {isLogin ? 'Login to manage your recipes' : 'Create an account to start sharing'}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input 
                                type="text" 
                                placeholder="ChefName123" 
                                required={!isLogin}
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                style={styles.input}
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>

                <div style={styles.toggleText}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"} 
                    <span 
                        onClick={() => setIsLogin(!isLogin)} 
                        style={styles.toggleLink}
                    >
                        {isLogin ? ' Register here' : ' Login here'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Internal Styling
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
    },
    card: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        margin: '0 0 10px 0',
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        margin: '0 0 30px 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#444',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    toggleText: {
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
    },
    toggleLink: {
        color: '#ff4757',
        cursor: 'pointer',
        fontWeight: 'bold',
    }
};

export default AuthPage;