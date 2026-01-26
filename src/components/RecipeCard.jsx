const RecipeCard = ({ recipe }) => {
    // We point to your Spring Boot port for the image
    const imageUrl = `http://localhost:8080${recipe.imageUrl}`;

    return (
        <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
        }}>
            <img 
                src={imageUrl} 
                alt={recipe.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{recipe.title}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>{recipe.description}</p>
                <button style={{ 
                    marginTop: '10px', 
                    padding: '8px 12px', 
                    backgroundColor: '#ff4757', 
                    color: '#white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer' 
                }}>
                    View Recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;