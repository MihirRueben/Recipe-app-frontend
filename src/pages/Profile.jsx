import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const Profile = () => {
    const { user, login } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const id = user.id || user._id;
           
            const res = await api.put(`/users/${id}`, formData);
            
            // Update AuthContext so the navbar/app reflects the new name
            login(res.data); 
            setIsEditing(false);
            alert("Profile updated successfully! ✨");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please log in.</div>;

    return (
        <div style={styles.container}>
            <h2 style={{ color: '#ff4757' }}>My Profile</h2>
            
            {isEditing ? (
                <form onSubmit={handleUpdate} style={styles.form}>
                    <label>Username</label>
                    <input 
                        style={styles.input}
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <label>Email</label>
                    <input 
                        style={styles.input}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <label>Bio</label>
                    <textarea 
                        style={{...styles.input, height: '80px'}}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={styles.saveBtn}>Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div style={styles.infoCard}>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bio:</strong> {user.bio || "No bio added yet."}</p>
                    <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: '600px', margin: '50px auto', padding: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' },
    infoCard: { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' },
    saveBtn: { padding: '10px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    cancelBtn: { padding: '10px', backgroundColor: '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    editBtn: { marginTop: '20px', padding: '10px 20px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Profile;