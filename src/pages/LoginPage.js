import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Fill in both fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}><span className={styles.hex}>⬡</span> TaskFlow</div>
        <div className={styles.hero}>
          <h1>Work that<br /><em>flows.</em></h1>
          <p>Your tasks, organized without friction. Pick up where you left off, every time.</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.statN}>∞</span><span className={styles.statL}>Tasks you can create</span></div>
          <div className={styles.stat}><span className={styles.statN}>0</span><span className={styles.statL}>Distractions</span></div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Sign in</h2>
          <p className={styles.cardSub}>Don't have an account? <Link to="/register" className={styles.link}>Create one</Link></p>

          <form onSubmit={submit} className={styles.form}>
            <div className={styles.field}>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" autoFocus />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
