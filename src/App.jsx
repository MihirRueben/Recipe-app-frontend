import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
    <Router>
        <Navbar />
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