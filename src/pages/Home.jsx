import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';
import { ChefHat, Plus, Search } from 'lucide-react';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

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

    const filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="container">
            <div className="text-center py-12">
                <div className="loading-spinner large"></div>
                <p className="mt-4 text-secondary">Loading tasty recipes...</p>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="home-header">
                <div className="hero-section">
                    <div className="hero-content">
                        <div className="hero-icon">
                            <ChefHat size={48} />
                        </div>
                        <h1 className="hero-title">Community Cookbook</h1>
                        <p className="hero-subtitle">
                            Discover delicious recipes shared by our community of home cooks
                        </p>
                    </div>
                    
                    {user && (
                        <div className="hero-action">
                            <Link to="/create" className="btn btn-primary btn-lg">
                                <Plus size={20} />
                                Share Your Recipe
                            </Link>
                        </div>
                    )}
                </div>

                <div className="search-section">
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search recipes by name or ingredients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            <div className="recipes-section">
                <div className="section-header">
                    <h2 className="section-title">
                        {searchTerm ? `Search Results (${filteredRecipes.length})` : `All Recipes (${recipes.length})`}
                    </h2>
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="btn btn-ghost btn-sm"
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {filteredRecipes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Search size={64} />
                        </div>
                        <h2 className="empty-title">
                            {searchTerm ? 'No recipes found' : 'No recipes yet'}
                        </h2>
                        <p className="empty-description">
                            {searchTerm 
                                ? `No recipes match "${searchTerm}". Try different keywords.`
                                : user 
                                    ? 'Be the first to share a delicious recipe with the community!'
                                    : 'Login to be the first to share a recipe!'
                            }
                        </p>
                        {user && !searchTerm && (
                            <Link to="/create" className="btn btn-primary">
                                <Plus size={20} />
                                Share First Recipe
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;