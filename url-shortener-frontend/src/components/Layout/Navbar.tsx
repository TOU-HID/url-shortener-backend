import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
	const { loading, totalCount, limit } = useSelector((state: RootState) => state.url);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          🔗 URL Shortener
        </div>
        
        {isAuthenticated && (
          <div style={styles.rightSection}>
            <span style={styles.userName}>👤 {user?.name}</span>
            <span style={styles.urlCount}>
              URLs: {loading ? '.../...' : totalCount + '/' + limit}
            </span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2563eb',
    padding: '1rem 2rem',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  } as React.CSSProperties,
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  } as React.CSSProperties,
  userName: {
    fontSize: '0.95rem',
  } as React.CSSProperties,
  urlCount: {
    fontSize: '0.9rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
  } as React.CSSProperties,
  logoutBtn: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  } as React.CSSProperties,
};

export default Navbar;