import React from "react";
import styles from "./TaskCard.module.css";

const PRIORITY_LABEL = { high: "High", medium: "Medium", low: "Low" };
const STATUS_LABEL = {
  pending: "To Do",
  "in-progress": "In Progress",
  completed: "Done",
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const done = task.completed;
  const due = task.dueDate || task.due_date;
  const dueDate = due ? new Date(due) : null;
  const overdue = dueDate && !done && dueDate < new Date();

  const fmtDate = (d) =>
    d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className={`${styles.card} ${done ? styles.done : ""}`}>
      <button
        className={`${styles.check} ${done ? styles.checked : ""}`}
        onClick={onToggle}
        title={done ? "Mark as to do" : "Mark complete"}
      />
      <div className={styles.body}>
        <div className={styles.taskTitle}>{task.title}</div>
        {task.description && (
          <div className={styles.desc}>{task.description}</div>
        )}
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[`p_${task.priority}`]}`}>
            {PRIORITY_LABEL[task.priority] || task.priority}
          </span>
          <span
            className={`${styles.badge} ${styles[`s_${task.status?.replace("-", "_")}`]}`}
          >
            {STATUS_LABEL[task.status] || task.status}
          </span>
          {dueDate && (
            <span
              className={`${styles.dueDate} ${overdue ? styles.overdue : ""}`}
            >
              📅 {fmtDate(dueDate)}
              {overdue ? " · Overdue" : ""}
            </span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onEdit} title="Edit">
          ✎
        </button>
        <button
          className={`${styles.actionBtn} ${styles.del}`}
          onClick={onDelete}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
