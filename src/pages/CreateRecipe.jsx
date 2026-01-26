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

        // Safety check: Ensure user is logged in
        if (!user) {
            alert("You must be logged in to post a recipe!");
            return;
        }

        try {
            // 1. Prepare the Image for Upload
            const formData = new FormData();
            formData.append('image', file); //appending file to the name image

            // 2. Upload the image to get the URL back
            const imageResponse = await api.post('/images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Assuming your backend returns just the string URL or an object with the URL
            const imageUrl = imageResponse.data; 

            // 3. Create the final recipe object
            const finalRecipe = {
                title: recipeData.title,
                description: recipeData.description,
                imageUrl: imageUrl, // The path from the backend
                userId: user.id    // Link the recipe to the logged-in user
            };

            // 4. Save the actual recipe to MongoDB
            await api.post('/recipes', finalRecipe);

            alert("Recipe Created Successfully! 🍳");
            navigate('/');
            
        } catch (err) {
            console.error("Error creating recipe:", err);
            // Handle 403 or 500 errors specifically
            const errorMsg = err.response?.status === 403 
                ? "Access Denied: Please check if you are logged in." 
                : "Failed to upload recipe. Please try again.";
            alert(errorMsg);
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

                <button type="submit" style={styles.button}>
                    Publish Recipe
                </button>
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