import React, { useEffect, useCallback } from 'react';
import styles from './Modal.module.css';

export default function DeleteModal({ task, onConfirm, onClose }) {
  const onKey = useCallback(e => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} ${styles.sm}`}>
        <div className={styles.header}>
          <h3>Delete task?</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <p className={styles.deleteMsg}>
            This can't be undone. "<strong>{task.title}</strong>" will be permanently removed.
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.btnGhost} onClick={onClose}>Keep it</button>
          <button className={styles.btnDanger} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
