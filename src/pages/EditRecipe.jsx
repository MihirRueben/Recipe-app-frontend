import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // Matches your @GetMapping("/{id}") in RecipeController.java
                const res = await api.get(`/recipes/${id}`);
                setRecipe(res.data);
            } catch (err) {
                console.error(err);
                alert("Could not find recipe.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            await api.put(`/recipes/${id}`, recipe);
            alert("Recipe updated! 👩‍🍳");
            navigate('/'); 
        } catch (err) {
            alert("Failed to update recipe.");
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading recipe...</p>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    style={styles.input}
                    value={recipe.title}
                    onChange={(e) => setRecipe({...recipe, title: e.target.value})}
                    placeholder="Recipe Title"
                />
                <textarea 
                    style={{...styles.input, height: '150px'}}
                    value={recipe.description}
                    onChange={(e) => setRecipe({...recipe, description: e.target.value})}
                    placeholder="Ingredients & Instructions"
                />
                <button type="submit" style={styles.button}>Update Recipe</button>
            </form>
        </div>
    );
};

const styles = {
    input: { display: 'block', width: '100%', marginBottom: '20px', padding: '12px', border: '1px solid #ccc', borderRadius: '5px' },
    button: { width: '100%', padding: '14px', backgroundColor: '#ffa502', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default EditRecipe;