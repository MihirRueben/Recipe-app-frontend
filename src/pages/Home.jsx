import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Hook to check if user is logged in

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await api.get('/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading tasty recipes...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Community Cookbook</h1>
            
            {/* Show this button only if a user is logged in */}
            {user && (
                <div style={{ textAlign: 'right', marginBottom: '30px' }}>
                    <Link to="/create" style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#2ed573', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}>
                        + Post New Recipe
                    </Link>
                </div>
            )}
            
            {recipes.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <p>No recipes yet. Be the first to share one!</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '30px' 
                }}>
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;