import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, ChefHat, Clock, Users } from 'lucide-react';

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const currentId = user?.id || user?._id;
            
            if (!currentId) {
                console.warn("MyRecipes: Waiting for user ID...");
                return;
            }

            console.log("Fetching recipes for User ID:", currentId);

            try {
                const response = await api.get(`/recipes/user/${currentId}`);
                console.log("Recipes found:", response.data);
                setMyRecipes(response.data);
            } catch (err) {
                console.error("Failed to fetch user recipes:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyRecipes();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this recipe permanently?")) {
            try {
                await api.delete(`/recipes/${id}`);
                setMyRecipes(prev => prev.filter(r => r.id !== id));
            } catch (err) {
                alert("Could not delete recipe.");
            }
        }
    };

    if (loading) return (
        <div className="container">
            <div className="text-center py-12">
                <div className="loading-spinner large"></div>
                <p className="mt-4 text-secondary">Loading your kitchen...</p>
            </div>
        </div>
    );
    
    if (!user) return (
        <div className="container">
            <div className="text-center py-12">
                <ChefHat size={48} className="mx-auto text-muted mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
                <p className="text-secondary">You need to be logged in to manage your recipes.</p>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="my-recipes-header">
                <div className="header-content">
                    <h1 className="page-title">My Kitchen Cabinet</h1>
                    <p className="page-subtitle">Manage and organize your culinary creations</p>
                </div>
                <button 
                    onClick={() => navigate('/create')} 
                    className="btn btn-primary"
                >
                    <Plus size={20} />
                    New Recipe
                </button>
            </div>
            
            {myRecipes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <ChefHat size={64} />
                    </div>
                    <h2 className="empty-title">No recipes yet!</h2>
                    <p className="empty-description">
                        You haven't shared any recipes with the community yet.
                        Start by creating your first culinary masterpiece!
                    </p>
                    <button 
                        onClick={() => navigate('/create')} 
                        className="btn btn-primary btn-lg"
                    >
                        <Plus size={20} />
                        Create Your First Recipe
                    </button>
                </div>
            ) : (
                <div className="recipes-grid">
                    {myRecipes.map(recipe => (
                        <div key={recipe.id} className="recipe-card">
                            <div className="recipe-image-container">
                                <img 
                                    src={`http://localhost:8080${recipe.imageUrl}`} 
                                    alt={recipe.title} 
                                    className="recipe-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-recipe.jpg';
                                    }}
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
                                    {recipe.description?.substring(0, 100)}...
                                </p>
                                <div className="recipe-actions">
                                    <button 
                                        onClick={() => navigate(`/edit/${recipe.id}`)} 
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(recipe.id)} 
                                        className="btn btn-accent btn-sm"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRecipes;