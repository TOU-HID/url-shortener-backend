import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUrls } from '../../redux/slices/urlSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import UrlForm from '../UrlShortener/UrlForm';
import UrlTable from './UrlTable';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { urls, loading } = useSelector((state: RootState) => state.url);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUrls());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.welcomeText}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={styles.subtitle}>
            Create and manage your shortened URLs
          </p>
        </div>

        <UrlForm />

        {loading ? (
          <div style={styles.loading}>
            <p>Loading your URLs...</p>
          </div>
        ) : (
          <UrlTable urls={urls} userUrlCount={user?.urlCount || 0} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 72px)',
    backgroundColor: '#f3f4f6',
    padding: '2rem',
  } as React.CSSProperties,
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  welcomeText: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '1.1rem',
    color: '#6b7280',
  } as React.CSSProperties,
  loading: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#6b7280',
  } as React.CSSProperties,
};

export default Dashboard;