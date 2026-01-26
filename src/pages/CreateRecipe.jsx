import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CreateRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [recipeData, setRecipeData] = useState({ title: '', description: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        
        // 1. First, upload the image to get the URL
        const imageFormData = new FormData();
        imageFormData.append('file', file);

        try {
            const imageRes = await api.post('/images/upload', imageFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = imageRes.data; // e.g., "/uploads/image_123.jpg"

            // 2. Then, save the recipe with that Image URL and the User ID
            const finalRecipe = {
                ...recipeData,
                imageUrl: imageUrl,
                userId: user.id // Taking the ID from our AuthContext
            };

            await api.post('/recipes', finalRecipe);
            alert("Recipe Created!");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Failed to create recipe");
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Share a New Recipe</h2>
            <form onSubmit={handleUpload}>
                <input 
                    type="text" placeholder="Recipe Title" required
                    onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '10px' }}
                />
                <textarea 
                    placeholder="Description / Ingredients" required
                    onChange={(e) => setRecipeData({...recipeData, description: e.target.value})}
                    style={{ display: 'block', width: '100%', marginBottom: '15px', padding: '10px', height: '100px' }}
                />
                <label>Upload Food Photo:</label>
                <input 
                    type="file" required
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: 'block', marginBottom: '15px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Publish Recipe
                </button>
            </form>
        </div>
    );
};

export default CreateRecipe;