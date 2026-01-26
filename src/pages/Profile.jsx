import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';

const Profile = () => {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get(`/recipes/user/${user.id}`)
            .then(res => setMyrecipes(res.data))
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
        }
    }, [user]);

    if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login to view your profile.</div>;
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading your kitchen...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <div style={{ fontSize: '50px' }}>👨‍🍳</div>
                <h1>{user.username}'s Kitchen</h1>
                <p style={{ color: '#666' }}>You have shared {myRecipes.length} recipes</p>
            </div>

            {myRecipes.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888' }}>
                    <p>You haven't posted any recipes yet. Start cooking!</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                    gap: '30px' 
                }}>
                    {myRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;