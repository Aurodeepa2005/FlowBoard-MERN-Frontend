import React from 'react';
import TaskCard from './TaskCard';
import styles from './TaskList.module.css';

const PRIORITY_FILTERS = [
  { key: 'all',    label: 'All' },
  { key: 'high',   label: 'High',   dot: 'high' },
  { key: 'medium', label: 'Medium', dot: 'medium' },
  { key: 'low',    label: 'Low',    dot: 'low' },
];

const STATUS_TITLES = {
  all: 'All Tasks', pending: 'To Do',
  'in-progress': 'In Progress', completed: 'Completed',
};

export default function TaskList({
  tasks, loading, search, onSearch,
  priorityFilter, onPriorityFilter,
  statusFilter, onNewTask, onEdit, onDelete, onToggle,
}) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>{STATUS_TITLES[statusFilter] || 'Tasks'}</h2>
          <span className={styles.sub}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search tasks…"
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
          </div>
          <button className={styles.btnNew} onClick={onNewTask}>+ New task</button>
        </div>
      </header>

      <div className={styles.priorityBar}>
        {PRIORITY_FILTERS.map(({ key, label, dot }) => (
          <button
            key={key}
            className={`${styles.pFilter} ${priorityFilter === key ? styles.active : ''}`}
            onClick={() => onPriorityFilter(key)}
          >
            {dot && <span className={`${styles.dot} ${styles[dot]}`} />}
            {label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◌</span>
            <span>Loading your tasks…</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>{search ? '🔍' : '✦'}</span>
            <span>{search ? 'No tasks match your search.' : 'No tasks here yet.'}</span>
            {!search && <span className={styles.emptyHint}>Hit "+ New task" to add one.</span>}
          </div>
        ) : (
          tasks.map(t => (
            <TaskCard
              key={t._id}
              task={t}
              onToggle={() => onToggle(t)}
              onEdit={() => onEdit(t)}
              onDelete={() => onDelete(t)}
            />
          ))
        )}
      </div>
    </>
  );
}
