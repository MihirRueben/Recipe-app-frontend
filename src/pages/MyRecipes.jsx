import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

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

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading your kitchen...</div>;
    if (!user) return <div style={{ textAlign: 'center', padding: '50px' }}>Please log in to manage recipes.</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '30px', borderBottom: '2px solid #ff4757', paddingBottom: '10px' }}>
                My Kitchen Cabinet
            </h2>
            
            {myRecipes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                    <p>You haven't shared any recipes yet!</p>
                    <button onClick={() => navigate('/create')} style={editBtn}>Post Your First Recipe</button>
                </div>
            ) : (
                <div style={gridStyle}>
                    {myRecipes.map(recipe => (
                        <div key={recipe.id} style={cardStyle}>
                            <img 
                                src={`http://localhost:8080${recipe.imageUrl}`} 
                                alt={recipe.title} 
                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} 
                            />
                            <h4 style={{ margin: '15px 0 10px 0' }}>{recipe.title}</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => navigate(`/edit/${recipe.id}`)} style={editBtn}>Edit</button>
                                <button onClick={() => handleDelete(recipe.id)} style={delBtn}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' };
const cardStyle = { padding: '20px', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const delBtn = { backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', flex: 1 };
const editBtn = { backgroundColor: '#ffa502', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', flex: 1 };

export default MyRecipes;