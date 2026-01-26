import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>🍳 RecipeShare</Link>
            </div>
            <ul style={styles.navLinks}>
                <li><Link to="/" style={styles.link}>Home</Link></li>
                
                {user ? (
                    <>
                        <li><Link to="/create" style={styles.link}>Post Recipe</Link></li>
                        <li><Link to="/profile" style={styles.link}>My Kitchen</Link></li>
                        <li>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout ({user.username})
                            </button>
                        </li>
                    </>
                ) : (
                    <li><Link to="/login" style={styles.loginBtn}>Login / Register</Link></li>
                )}
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        height: '70px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    logoLink: {
        fontSize: '24px',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#ff4757'
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        listStyle: 'none',
        gap: '25px'
    },
    link: {
        textDecoration: 'none',
        color: '#2f3542',
        fontWeight: '500',
        transition: '0.3s'
    },
    loginBtn: {
        textDecoration: 'none',
        backgroundColor: '#ff4757',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '20px',
        fontWeight: 'bold'
    },
    logoutBtn: {
        backgroundColor: '#f1f2f6',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#2f3542',
        fontWeight: '500'
    }
};

export default Navbar;