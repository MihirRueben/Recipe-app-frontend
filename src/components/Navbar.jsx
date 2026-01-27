import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X, ChefHat, Home, PlusCircle, User, FileText, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={handleLinkClick}>
                    <ChefHat size={28} className="logo-icon" />
                    <span className="logo-text">RecipeShare</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="desktop-menu">
                    {user ? (
                        <div className="nav-links">
                            <Link to="/" className="nav-link">
                                <Home size={18} />
                                <span>Home</span>
                            </Link>
                            <Link to="/create" className="nav-link">
                                <PlusCircle size={18} />
                                <span>Post Recipe</span>
                            </Link>
                            <Link to="/profile" className="nav-link">
                                <User size={18} />
                                <span>My Account</span>
                            </Link>
                            <Link to="/my-recipes" className="nav-link">
                                <FileText size={18} />
                                <span>My Recipes</span>
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={18} />
                                <span>Logout ({user.username})</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn" onClick={handleLinkClick}>
                            Login / Register
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-btn"
                    onClick={handleMobileMenuToggle}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {user ? (
                        <div className="mobile-nav-links">
                            <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>
                                <Home size={20} />
                                <span>Home</span>
                            </Link>
                            <Link to="/create" className="mobile-nav-link" onClick={handleLinkClick}>
                                <PlusCircle size={20} />
                                <span>Post Recipe</span>
                            </Link>
                            <Link to="/profile" className="mobile-nav-link" onClick={handleLinkClick}>
                                <User size={20} />
                                <span>My Account</span>
                            </Link>
                            <Link to="/my-recipes" className="mobile-nav-link" onClick={handleLinkClick}>
                                <FileText size={20} />
                                <span>My Recipes</span>
                            </Link>
                            <button onClick={handleLogout} className="mobile-logout-btn">
                                <LogOut size={20} />
                                <span>Logout ({user.username})</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="mobile-login-btn" onClick={handleLinkClick}>
                            Login / Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;