import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { 
    ArrowLeft, 
    Clock, 
    Users, 
    ChefHat, 
    Edit3, 
    Trash2, 
    Star
} from 'lucide-react';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                setRecipe(response.data);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                alert("Could not find recipe.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await api.delete(`/recipes/${id}`);
                alert("Recipe deleted successfully!");
                navigate('/');
            } catch (error) {
                alert("Could not delete recipe.");
            }
        }
    };

    const isOwner = user && (user.id === recipe?.userId || user._id === recipe?.userId);

    if (loading) {
        return (
            <div className="container">
                <div className="text-center py-12">
                    <div className="loading-spinner large"></div>
                    <p className="mt-4 text-secondary">Loading recipe...</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="container">
                <div className="text-center py-12">
                    <ChefHat size={48} className="mx-auto text-muted mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Recipe not found</h2>
                    <p className="text-secondary mb-6">The recipe you're looking for doesn't exist.</p>
                    <Link to="/" className="btn btn-primary">
                        Back to Recipes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="recipe-detail-container">
                {/* Header */}
                <div className="recipe-detail-header">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-ghost"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    
                    <div className="recipe-actions">
                    {isOwner && (
                        <>
                            <Link 
                                to={`/edit/${recipe.id}`}
                                className="btn btn-secondary btn-sm"
                            >
                                <Edit3 size={16} />
                                Edit
                            </Link>
                            <button 
                                onClick={handleDelete}
                                className="btn btn-accent btn-sm"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </>
                    )}
                </div>
                </div>

                {/* Recipe Image */}
                <div className="recipe-hero">
                    <img 
                        src={`http://localhost:8080${recipe.imageUrl}`}
                        alt={recipe.title}
                        className="recipe-hero-image"
                        onError={(e) => {
                            e.target.src = '/placeholder-recipe.jpg';
                        }}
                    />
                    <div className="recipe-hero-overlay">
                        <div className="recipe-meta">
                            <div className="meta-item">
                                <Clock size={18} />
                                <span>30 mins</span>
                            </div>
                            <div className="meta-item">
                                <Users size={18} />
                                <span>4 servings</span>
                            </div>
                            <div className="meta-item">
                                <Star size={18} />
                                <span>4.5 (24 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recipe Content */}
                <div className="recipe-content">
                    <div className="recipe-main">
                        <h1 className="recipe-title">{recipe.title}</h1>
                        
                        <div className="recipe-description">
                            <p>{recipe.description}</p>
                            {recipe.category && (
                                <span className="recipe-category-badge">
                                    {recipe.category}
                                </span>
                            )}
                        </div>

                        {/* Ingredients Section */}
                        <div className="recipe-section">
                            <h2 className="section-title">
                                <ChefHat size={20} />
                                Ingredients
                            </h2>
                            <div className="ingredients-list">
                                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                    recipe.ingredients.map((ingredient, index) => (
                                        <div key={index} className="ingredient-item">
                                            <span className="ingredient-bullet"></span>
                                            <span>{ingredient}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No ingredients listed.</p>
                                )}
                            </div>
                        </div>

                        {/* Instructions Section */}
                        <div className="recipe-section">
                            <h2 className="section-title">
                                <ChefHat size={20} />
                                Instructions
                            </h2>
                            <div className="instructions-content">
                                {recipe.instructions ? (
                                    <div className="instruction-text">
                                        {recipe.instructions.split('\n').map((instruction, index) => (
                                            <p key={index} className="instruction-paragraph">
                                                {instruction.trim()}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">No instructions provided.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
