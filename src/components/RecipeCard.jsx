import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, Clock, Users, ChefHat } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const imageUrl = `http://localhost:8080${recipe.imageUrl}`;

    const handleViewRecipe = () => {
        navigate(`/recipe/${recipe.id}`);
    };

    const handleImageError = (e) => {
        e.target.src = '/placeholder-recipe.jpg';
    };

    return (
        <div className="recipe-card home-recipe-card">
            <div className="recipe-image-container">
                <img 
                    src={imageUrl} 
                    alt={recipe.title} 
                    className="recipe-image"
                    onError={handleImageError}
                />
                <div className="recipe-overlay">
                    <div className="recipe-stats">
                        <span className="stat-item">
                            <Clock size={14} />
                            <span>Quick</span>
                        </span>
                        <span className="stat-item">
                            <Users size={14} />
                            <span>4 servings</span>
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">
                    {recipe.description?.substring(0, 120)}...
                </p>
                
                <button 
                    onClick={handleViewRecipe} 
                    className="btn btn-primary btn-sm recipe-view-btn"
                >
                    <Eye size={16} />
                    View Recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;