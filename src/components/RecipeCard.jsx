import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RecipeCard = ({ recipe }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const imageUrl = `http://localhost:8080${recipe.imageUrl}`;

    const handleViewRecipe = () => {
        if (!user) {
            alert("You must be logged in to view the full recipe!");
            navigate('/login');
        } else {
            // This will navigate to a detail page we'll build later
            navigate(`/recipe/${recipe.id}`);
        }
    };

    return (
        <div style={styles.card}>
            <img src={imageUrl} alt={recipe.title} style={styles.image} />
            <div style={{ padding: '15px' }}>
                <h3 style={styles.title}>{recipe.title}</h3>
                <p style={styles.description}>{recipe.description}</p>
                <button onClick={handleViewRecipe} style={styles.button}>
                    View Recipe
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    image: { width: '100%', height: '200px', objectFit: 'cover' },
    title: { margin: '0 0 10px 0', color: '#333' },
    description: { color: '#666', fontSize: '14px' },
    button: { marginTop: '10px', padding: '8px 12px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default RecipeCard;