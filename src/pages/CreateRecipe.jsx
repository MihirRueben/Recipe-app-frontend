import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Upload, FileText, ArrowLeft, X } from 'lucide-react';

const CreateRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [recipeData, setRecipeData] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!user) {
            alert("You must be logged in to post a recipe!");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', file);

            const imageResponse = await api.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = imageResponse.data;

            const finalRecipe = {
                title: recipeData.title,
                description: recipeData.description,
                imageUrl: imageUrl,
                userId: user.id || user._id 
            };

            await api.post('/recipes', finalRecipe);

            alert("Recipe Created Successfully! 🍳");
            navigate('/'); 
            
        } catch (err) {
            console.error("Error creating recipe:", err);
            alert(err.response?.status === 403 ? "Access Denied: Please log in again." : "Failed to upload recipe.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="create-recipe-container">
                <div className="create-recipe-header">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-ghost"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <div className="header-content">
                        <div className="header-icon">
                            <ChefHat size={32} />
                        </div>
                        <h1 className="page-title">Share a New Recipe</h1>
                        <p className="page-subtitle">Share your culinary creation with the community</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="create-recipe-form">
                    <div className="form-section">
                        <h2 className="section-title">Recipe Information</h2>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <FileText size={16} className="input-icon" />
                                Recipe Title
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g., Grandma's Secret Pasta" 
                                required
                                value={recipeData.title}
                                onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FileText size={16} className="input-icon" />
                                Description & Ingredients
                            </label>
                            <textarea 
                                placeholder="Tell us how to make it... Include ingredients, step-by-step instructions, cooking time, and serving size." 
                                required
                                value={recipeData.description}
                                onChange={(e) => setRecipeData({...recipeData, description: e.target.value})}
                                className="form-textarea"
                                rows={8}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Food Photo</h2>
                        
                        <div className="file-upload-container">
                            <div className="file-upload-area">
                                {preview ? (
                                    <div className="image-preview">
                                        <img src={preview} alt="Recipe preview" className="preview-image" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setFile(null);
                                                setPreview(null);
                                            }}
                                            className="remove-image-btn"
                                        >
                                            <X size={16} />
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <Upload size={48} className="upload-icon" />
                                        <div className="upload-text">
                                            <p className="upload-title">Click to upload or drag and drop</p>
                                            <p className="upload-subtitle">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            required 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg"
                            disabled={isLoading || !file}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Publish Recipe
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;