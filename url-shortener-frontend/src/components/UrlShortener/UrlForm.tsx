import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortUrl } from '../../redux/slices/urlSlice';
import { updateUserUrlCount } from '../../redux/slices/authSlice';
import type { AppDispatch, RootState } from '../../redux/store';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [latestShortUrl, setLatestShortUrl] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, totalCount, limit } = useSelector((state: RootState) => state.url);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalCount >= limit) {
      alert(`URL limit reached (${limit}/${limit}). Please upgrade your account.`);
      return;
    }

    const result = await dispatch(createShortUrl(url));
    
    if (createShortUrl.fulfilled.match(result)) {
      setLatestShortUrl(result.payload.data.shortUrl);
      setUrl('');
      setCopySuccess(false);
      
      // Update user's URL count
      if (user) {
        dispatch(updateUserUrlCount(user.urlCount + 1));
      }
    }
  };

  const handleCopy = async () => {
    if (latestShortUrl) {
      await navigator.clipboard.writeText(latestShortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔗 Shorten Your URL</h2>
      <p style={styles.subtitle}>
        Paste your long URL below and get a short, shareable link
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/long-url"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {latestShortUrl && (
        <div style={styles.resultContainer}>
          <p style={styles.resultLabel}>✅ Your shortened URL:</p>
          <div style={styles.resultBox}>
            <input
              type="text"
              value={latestShortUrl}
              readOnly
              style={styles.resultInput}
            />
            <button onClick={handleCopy} style={styles.copyButton}>
              {copySuccess ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      )}

      <div style={styles.statsBox}>
        <p style={styles.statsText}>
          📊 URLs Created: <strong>{totalCount}/{limit}</strong>
        </p>
        {totalCount >= limit && (
          <p style={styles.limitWarning}>
            ⚠️ You've reached your URL limit. Upgrade to create more!
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  } as React.CSSProperties,
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#1f2937',
  } as React.CSSProperties,
  subtitle: {
    color: '#6b7280',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  input: {
    flex: 1,
    padding: '0.875rem',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
  } as React.CSSProperties,
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  resultContainer: {
    backgroundColor: '#f0f9ff',
    padding: '1.25rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  resultLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  resultBox: {
    display: 'flex',
    gap: '0.75rem',
  } as React.CSSProperties,
  resultInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #93c5fd',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '0.95rem',
  } as React.CSSProperties,
  copyButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
  } as React.CSSProperties,
  statsBox: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'center',
  } as React.CSSProperties,
  statsText: {
    fontSize: '1rem',
    color: '#374151',
    margin: 0,
  } as React.CSSProperties,
  limitWarning: {
    color: '#dc2626',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    fontWeight: '500',
  } as React.CSSProperties,
};

export default UrlForm;