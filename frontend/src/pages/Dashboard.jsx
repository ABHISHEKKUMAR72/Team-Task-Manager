import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await taskService.getTaskStats();
        setStats(response.data.stats);
        setTasks(response.data.tasks);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {user?.firstName}!</p>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>To Do</h3>
            <p className="stat-number">{stats.todo}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
          <div className="stat-card danger">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>
      )}

      <div className="tasks-section">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks assigned yet</p>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <div key={task.id} className="task-item">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`status ${task.status}`}>{task.status}</span>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                  {task.dueDate && (
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
