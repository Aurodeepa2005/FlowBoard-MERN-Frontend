import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV = [
  { key: 'all',         label: 'All Tasks',   icon: '◈' },
  { key: 'pending',     label: 'To Do',       icon: '○' },
  { key: 'in-progress', label: 'In Progress', icon: '◑' },
  { key: 'completed',   label: 'Completed',   icon: '●' },
];

export default function Sidebar({ counts, statusFilter, onStatusFilter }) {
  const { user, logout } = useAuth();
  const initial = (user?.name || user?.email || '?')[0].toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.hex}>⬡</span>
          <span className={styles.brandName}>TaskFlow</span>
        </div>
        <nav className={styles.nav}>
          {NAV.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`${styles.navItem} ${statusFilter === key ? styles.active : ''}`}
              onClick={() => onStatusFilter(key)}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
              <span className={styles.navCount}>{counts[key] ?? 0}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.userName}>{user?.name || user?.email}</span>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Sign out">↩</button>
      </div>
    </aside>
  );
}
