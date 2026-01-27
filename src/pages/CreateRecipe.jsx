import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Plus, X, ArrowLeft, Save, Package } from 'lucide-react';

const CreateRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        category: '',
        image: null
    });
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormData({ ...formData, image: selectedFile });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const addIngredient = () => {
        setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
    };

    const removeIngredient = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: newIngredients });
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
        const filteredIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
        let imageUrl = "";

        if (formData.image) {
            const imageData = new FormData();
            imageData.append('image', formData.image);

            
            const imageRes = await api.post('/images/upload', imageData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            imageUrl = imageRes.data; // The path returned by backend
        }

       
        const recipePayload = {
            title: formData.title,
            description: formData.description,
            instructions: formData.instructions,
            category: formData.category,
            ingredients: filteredIngredients,
            imageUrl: imageUrl, 
            userId: user.id || user._id
        };

        console.log('Sending final JSON payload:', recipePayload);

        const response = await api.post('/recipes', recipePayload);

        console.log('Recipe creation successful:', response);
        alert("Recipe created! 👩‍🍳");
        navigate('/');
    } catch (err) {
        console.error("Full Error Object:", err);
        // Alert the specific error message from the backend if available
        const errorMsg = err.response?.data?.message || err.response?.data || "Internal Server Error";
        alert(`Error: ${errorMsg}`);
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
                        <h2 className="section-title">Basic Information</h2>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <ChefHat size={16} className="input-icon" />
                                Recipe Title
                            </label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter your recipe title"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <ChefHat size={16} className="input-icon" />
                                Description
                            </label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe your recipe..."
                                className="form-textarea"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Package size={16} className="input-icon" />
                                Category
                            </label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="form-input"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Snack">Snack</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Gluten-Free">Gluten-Free</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Ingredients</h2>
                        
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-input-group">
                                <input 
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    placeholder={`Ingredient ${index + 1}`}
                                    className="form-input"
                                />
                                {formData.ingredients.length > 1 && (
                                    <button 
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            type="button"
                            onClick={addIngredient}
                            className="btn btn-secondary btn-sm"
                        >
                            <Plus size={16} />
                            Add Ingredient
                        </button>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Instructions</h2>
                        
                        <div className="form-group">
                            <textarea 
                                value={formData.instructions}
                                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                                placeholder="Write step-by-step cooking instructions..."
                                className="form-textarea"
                                rows={8}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Recipe Image</h2>
                        
                        <div className="file-upload-container">
                            <div className="file-upload-area">
                                {preview ? (
                                    <div className="image-preview">
                                        <img 
                                            src={preview} 
                                            alt="Recipe preview" 
                                            className="preview-image"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setFormData({...formData, image: null});
                                            }}
                                            className="remove-image-btn"
                                        >
                                            <X size={16} />
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="upload-icon">
                                            <Plus size={48} />
                                        </div>
                                        <div className="upload-text">
                                            <p className="upload-title">Upload Recipe Image</p>
                                            <p className="upload-subtitle">
                                                Click to browse or drag and drop
                                            </p>
                                        </div>
                                        <input 
                                            type="file"
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
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Plus size={20} />
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