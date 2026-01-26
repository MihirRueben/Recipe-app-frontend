import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateRecipe from './pages/CreateRecipe';
import { AuthProvider }  from './context/AuthContext';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app-container">
        
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/login" element={<AuthPage />} /> 
           <Route path="/profile/" element={<Profile />} /> 
           <Route path="/create" element={<CreateRecipe />} /> 
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;