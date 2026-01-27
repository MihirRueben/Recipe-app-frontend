import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { User, Mail, Edit3, Save, X, Camera } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth(); 
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const id = user.id || user._id;
            const res = await api.put(`/users/${id}`, formData);
            login(res.data);
            setIsEditing(false);
            alert("Profile updated successfully! ✨");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || ''
        });
        setIsEditing(false);
    };

    if (!user) return (
        <div className="container">
            <div className="text-center py-12">
                <User size={48} className="mx-auto text-muted mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
                <p className="text-secondary">You need to be logged in to view your profile.</p>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">
                            <User size={48} />
                        </div>
                        <button className="avatar-upload-btn">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-title">My Profile</h1>
                        <p className="profile-subtitle">Manage your account information</p>
                    </div>
                </div>

                <div className="profile-content">
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="profile-form">
                            <div className="form-group">
                                <label className="form-label">
                                    <User size={16} className="input-icon" />
                                    Username
                                </label>
                                <input 
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Mail size={16} className="input-icon" />
                                    Email
                                </label>
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Edit3 size={16} className="input-icon" />
                                    Bio
                                </label>
                                <textarea 
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    className="form-textarea"
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading-spinner"></span>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCancel}
                                    className="btn btn-outline"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-view">
                            <div className="info-card">
                                <div className="info-item">
                                    <div className="info-label">
                                        <User size={16} />
                                        Username
                                    </div>
                                    <div className="info-value">{user.username}</div>
                                </div>

                                <div className="info-item">
                                    <div className="info-label">
                                        <Mail size={16} />
                                        Email
                                    </div>
                                    <div className="info-value">{user.email}</div>
                                </div>

                                <div className="info-item">
                                    <div className="info-label">
                                        <Edit3 size={16} />
                                        Bio
                                    </div>
                                    <div className="info-value">
                                        {user.bio || "No bio added yet."}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="btn btn-primary"
                            >
                                <Edit3 size={16} />
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;