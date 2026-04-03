'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/shows');
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Mike Rita</h1>
        <p style={styles.sub}>Admin Panel</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
            style={styles.input}
            autoFocus
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#1a0f0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Georgia', serif",
    padding: '1rem',
  },
  card: {
    backgroundColor: '#261510',
    border: '1px solid #3a1f14',
    borderRadius: '8px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
  },
  heading: {
    color: '#E8651A',
    fontSize: '1.8rem',
    fontWeight: 700,
    margin: '0 0 0.25rem',
    letterSpacing: '0.02em',
  },
  sub: {
    color: '#a07060',
    fontSize: '0.9rem',
    margin: '0 0 2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    textAlign: 'left',
  },
  label: {
    color: '#F5F0E8',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.75rem',
    backgroundColor: '#1a0f0a',
    border: '1px solid #3a1f14',
    borderRadius: '4px',
    color: '#F5F0E8',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    color: '#e05555',
    fontSize: '0.875rem',
    margin: '0',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(224,85,85,0.1)',
    borderRadius: '4px',
    border: '1px solid rgba(224,85,85,0.3)',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#E8651A',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'background-color 0.2s',
  },
};
