import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CreateRecipe = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [recipeData, setRecipeData] = useState({ title: '', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to post a recipe!");
            return;
        }

        try {
            // 1. Prepare and Upload Image
            const formData = new FormData();
            formData.append('image', file);

            const imageResponse = await api.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = imageResponse.data; 

            // 2. Create final object with robust ID check
            const finalRecipe = {
                title: recipeData.title,
                description: recipeData.description,
                imageUrl: imageUrl,
                userId: user.id || user._id 
            };

            // 3. Save to MongoDB
            await api.post('/recipes', finalRecipe);

            alert("Recipe Created Successfully! 🍳");
            navigate('/'); 
            
        } catch (err) {
            console.error("Error creating recipe:", err);
            alert(err.response?.status === 403 ? "Access Denied: Please log in again." : "Failed to upload recipe.");
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>Share a New Recipe</h2>
            <form onSubmit={handleSubmit}>
                <label style={styles.label}>Recipe Title</label>
                <input 
                    type="text" placeholder="e.g., Grandma's Secret Pasta" required
                    onChange={(e) => setRecipeData({...recipeData, title: e.target.value})}
                    style={styles.input}
                />

                <label style={styles.label}>Description & Ingredients</label>
                <textarea 
                    placeholder="Tell us how to make it..." required
                    onChange={(e) => setRecipeData({...recipeData, description: e.target.value})}
                    style={{ ...styles.input, height: '120px', resize: 'vertical' }}
                />

                <label style={styles.label}>Upload Food Photo</label>
                <input 
                    type="file" required accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: 'block', marginBottom: '20px' }}
                />

                <button type="submit" style={styles.button}>Publish Recipe</button>
            </form>
        </div>
    );
};

const styles = {
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' },
    input: { display: 'block', width: '100%', marginBottom: '20px', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default CreateRecipe;