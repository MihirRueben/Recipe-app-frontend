import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';
import MyRecipes from './pages/MyRecipes';
import EditRecipe from './pages/EditRecipe';
import RecipeDetail from './pages/RecipeDetail';


function App() {
  return (
    <AuthProvider>
    <Router>
        <Navbar />
        <div className="container">
          
        <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<AuthPage />} /> 
           <Route path="/profile/" element={<Profile />} /> 
           <Route path="/create" element={<CreateRecipe />} /> 
           <Route path="/my-recipes" element={<MyRecipes />} /> 
           <Route path="/edit/:id" element={<EditRecipe />} />
           <Route path="/recipe/:id" element={<RecipeDetail />} />
           <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;