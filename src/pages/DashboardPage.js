import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import DeleteModal from "../components/DeleteModal";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /* FILTER */
  const filtered = tasks.filter((t) => {
    const byStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && t.completed) ||
      (statusFilter === "pending" && !t.completed);

    const byPriority =
      priorityFilter === "all" || t.priority === priorityFilter;

    const bySearch =
      !search || t.title.toLowerCase().includes(search.toLowerCase());

    return byStatus && byPriority && bySearch;
  });

  /* COUNTS */
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    "in-progress": 0,
  };

  /* ACTIONS */
  const openNew = () => {
    setEditTask(null);
    setModalOpen(true);
  };
  const openEdit = (t) => {
    setEditTask(t);
    setModalOpen(true);
  };

  const saveTask = async (payload) => {
    try {
      if (editTask) {
        const { data } = await api.put(`/tasks/${editTask._id}`, payload);
        setTasks((ts) => ts.map((t) => (t._id === editTask._id ? data : t)));
        toast.success("Task updated.");
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((ts) => [data, ...ts]);
        toast.success("Task created!");
      }
      setModalOpen(false);
    } catch (err) {
      throw err; // let modal show the error
    }
  };

  const toggleComplete = async (task) => {
    try {
      const { data } = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });

      setTasks((ts) => ts.map((t) => (t._id === task._id ? data : t)));

      toast.success(!task.completed ? "Task completed ✓" : "Task reopened");
    } catch {
      toast.error("Update failed.");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteTask._id}`);
      setTasks((ts) => ts.filter((t) => t._id !== deleteTask._id));
      toast.success("Task deleted.");
      setDeleteTask(null);
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        counts={counts}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />
      <main className={styles.main}>
        <TaskList
          tasks={filtered}
          loading={loading}
          search={search}
          onSearch={setSearch}
          priorityFilter={priorityFilter}
          onPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}
          onNewTask={openNew}
          onEdit={openEdit}
          onDelete={setDeleteTask}
          onToggle={toggleComplete}
        />
      </main>

      {modalOpen && (
        <TaskModal
          task={editTask}
          onSave={saveTask}
          onClose={() => setModalOpen(false)}
        />
      )}
      {deleteTask && (
        <DeleteModal
          task={deleteTask}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTask(null)}
        />
      )}
    </div>
  );
}
