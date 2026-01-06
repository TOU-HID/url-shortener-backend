import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUrl, incrementUrlClick } from '../../redux/slices/urlSlice';
import { updateUserUrlCount } from '../../redux/slices/authSlice';
import type { AppDispatch } from '../../redux/store';
import type { Url } from '../../types';

interface UrlTableProps {
  urls: Url[];
  userUrlCount: number;
}

const UrlTable: React.FC<UrlTableProps> = ({ urls, userUrlCount }) => {
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const result = await dispatch(deleteUrl(id));
      if (deleteUrl.fulfilled.match(result)) {
        dispatch(updateUserUrlCount(userUrlCount - 1));
      }
    }
  };

  const handleCopy = async (shortUrl: string, id: string) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const truncateUrl = (url: string, maxLength: number = 30) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (urls.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>📭 No URLs yet. Create your first shortened URL above!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📊 Your Shortened URLs</h3>
      
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Original URL</th>
              <th style={styles.th}>Short Code</th>
              <th style={styles.th}>Short URL</th>
              <th style={styles.th}>Clicks</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id} style={styles.row}>
                <td style={styles.td}>
                  <div
                    style={styles.urlCell}
                    onClick={() => setExpandedUrl(expandedUrl === url._id ? null : url._id)}
                    title={url.originalUrl}
                  >
                    {expandedUrl === url._id
                      ? url.originalUrl
                      : truncateUrl(url.originalUrl)}
                  </div>
                </td>
                <td style={styles.td}>
                  <code style={styles.code}>{url.shortCode}</code>
                </td>
                <td style={styles.td}>
                  <div style={styles.shortUrlCell}>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                      onClick={() => dispatch(incrementUrlClick(url._id))}
                    >
                      {truncateUrl(url.shortUrl, 30)}
                    </a>
                    <button
                      onClick={() => handleCopy(url.shortUrl, url._id)}
                      style={styles.copyBtn}
                    >
                      {copySuccess === url._id ? '✓' : '📋'}
                    </button>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge}>{url.clicks}</span>
                </td>
                <td style={styles.td}>{formatDate(url.createdAt)}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(url._id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  } as React.CSSProperties,
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937',
  } as React.CSSProperties,
  emptyState: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  } as React.CSSProperties,
  emptyText: {
    fontSize: '1.1rem',
    color: '#6b7280',
  } as React.CSSProperties,
  tableWrapper: {
    overflowX: 'auto',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  headerRow: {
    backgroundColor: '#f3f4f6',
  } as React.CSSProperties,
  th: {
    padding: '0.875rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  } as React.CSSProperties,
  row: {
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,
  td: {
    padding: '1rem 0.875rem',
    fontSize: '0.9rem',
    color: '#1f2937',
  } as React.CSSProperties,
  urlCell: {
    cursor: 'pointer',
    maxWidth: '300px',
    wordBreak: 'break-word',
  } as React.CSSProperties,
  code: {
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
  } as React.CSSProperties,
  shortUrlCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  } as React.CSSProperties,
  copyBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.25rem',
  } as React.CSSProperties,
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '600',
  } as React.CSSProperties,
  deleteBtn: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
  } as React.CSSProperties,
};

export default UrlTable;