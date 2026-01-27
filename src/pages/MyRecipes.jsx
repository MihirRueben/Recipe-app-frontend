import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                // Backend needs a route: @GetMapping("/user/{userId}")
                const response = await api.get(`/recipes/user/${user.id}`);
                setMyRecipes(response.data);
            } catch (err) {
                console.error("Failed to fetch your recipes", err);
            }
        };
        if (user) fetchMyRecipes();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await api.delete(`/recipes/${id}`);
                setMyRecipes(myRecipes.filter(r => r.id !== id));
            } catch (err) {
                alert("Delete failed.");
            }
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2>Manage Your Recipes</h2>
            <div style={gridStyle}>
                {myRecipes.map(recipe => (
                    <div key={recipe.id} style={cardStyle}>
                        <h4>{recipe.title}</h4>
                        <button onClick={() => handleDelete(recipe.id)} style={delBtn}>Delete</button>
                        <button style={editBtn}>Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Styles (minimal for now)
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' };
const cardStyle = { padding: '15px', border: '1px solid #ddd', borderRadius: '8px' };
const delBtn = { backgroundColor: '#ff4757', color: 'white', border: 'none', padding: '5px 10px', marginRight: '10px', cursor: 'pointer' };
const editBtn = { backgroundColor: '#ffa502', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' };

export default MyRecipes;