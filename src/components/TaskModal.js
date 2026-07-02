import React, { useState, useEffect, useCallback } from 'react';
import styles from './Modal.module.css';

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm]   = useState({ title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      const due = task.dueDate || task.due_date;
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        priority:    task.priority    || 'medium',
        status:      task.status      || 'pending',
        dueDate:     due ? due.split('T')[0] : '',
      });
    }
  }, [task]);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
      setSaving(false);
    }
  };

  const onKey = useCallback(e => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onKey]);

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{task ? 'Edit task' : 'New task'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit}>
          <div className={styles.body}>
            <div className={styles.field}>
              <label>Title <span className={styles.req}>*</span></label>
              <input name="title" value={form.title} onChange={handle} placeholder="What needs to be done?" autoFocus />
            </div>
            <div className={styles.field}>
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handle} placeholder="Add details (optional)…" rows={3} />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={handle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Status</label>
                <select name="status" value={form.status} onChange={handle}>
                  <option value="pending">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Due date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handle} />
            </div>
            {error && <div className={styles.error}>{error}</div>}
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Saving…' : task ? 'Save changes' : 'Save task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
