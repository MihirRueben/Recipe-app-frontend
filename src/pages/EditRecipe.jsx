import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ChefHat, Edit3, ArrowLeft, Save } from 'lucide-react';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        
        try {
            await api.put(`/recipes/${id}`, recipe);
            alert("Recipe updated! 👩‍🍳");
            navigate('/'); 
        } catch (err) {
            alert("Failed to update recipe.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return (
        <div className="container">
            <div className="text-center py-12">
                <div className="loading-spinner large"></div>
                <p className="mt-4 text-secondary">Loading recipe...</p>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="create-recipe-container">
                <div className="create-recipe-header">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-ghost"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <div className="header-content">
                        <div className="header-icon">
                            <Edit3 size={32} />
                        </div>
                        <h1 className="page-title">Edit Recipe</h1>
                        <p className="page-subtitle">Update your culinary creation</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="create-recipe-form">
                    <div className="form-section">
                        <h2 className="section-title">Recipe Information</h2>
                        
                        <div className="form-group">
                            <label className="form-label">
                                <Edit3 size={16} className="input-icon" />
                                Recipe Title
                            </label>
                            <input 
                                type="text"
                                value={recipe.title}
                                onChange={(e) => setRecipe({...recipe, title: e.target.value})}
                                placeholder="Recipe Title"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Edit3 size={16} className="input-icon" />
                                Description & Ingredients
                            </label>
                            <textarea 
                                value={recipe.description}
                                onChange={(e) => setRecipe({...recipe, description: e.target.value})}
                                placeholder="Ingredients & Instructions"
                                className="form-textarea"
                                rows={8}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn btn-secondary btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Update Recipe
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecipe;