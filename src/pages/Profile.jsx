import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return <p>Please log in.</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
            <h1>User Profile</h1>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={() => alert("Update Profile logic goes here!")} style={{ marginRight: '10px' }}>
                    Edit Profile
                </button>
                <button onClick={() => { logout(); navigate('/login'); }} style={{ backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '10px' }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;