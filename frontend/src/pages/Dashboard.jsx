import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService, projectService } from '../services/api.js';
import '../styles/Dashboard.css';
import '../styles/App.css';

const statusLabel = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [taskRes, projRes] = await Promise.all([
          taskService.getTaskStats(),
          projectService.getProjects(),
        ]);
        setStats(taskRes.data.stats);
        setTasks(taskRes.data.tasks);
        setProjects(projRes.data.projects);
      } catch {
        setError('Failed to load dashboard. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="page-wrapper dashboard">
        <div className="dash-header">
          <div className="skeleton" style={{ height: 28, width: 260, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: 180 }} />
        </div>
        <div className="stats-grid">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 36, width: '40%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper dashboard">
      <div className="dash-header">
        <h1>{greeting()}, {user?.firstName} 👋</h1>
        <p>Here's what's on your plate today.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          {[
            { label: 'Total tasks',  val: stats.total,      cls: '' },
            { label: 'To do',        val: stats.todo,       cls: '' },
            { label: 'In progress',  val: stats.inProgress, cls: '' },
            { label: 'Completed',    val: stats.completed,  cls: '' },
            { label: 'Overdue',      val: stats.overdue,    cls: 'stat-overdue' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.cls}`}>
              <span className="stat-label">{s.label}</span>
              <span className="stat-number">{s.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects quick row */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="dash-section-title">
            📁 Your projects
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>View all</button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {projects.slice(0, 4).map(p => (
              <button
                key={p._id}
                className="btn btn-ghost btn-sm"
                onClick={() => navigate(`/projects/${p._id}`)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assigned tasks */}
      <div className="dash-section-title">📋 Tasks assigned to you</div>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <p>No tasks assigned to you yet — enjoy the quiet!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task._id} className="task-row">
              <div className="task-row-left">
                <div className="task-row-title">{task.title}</div>
                {task.description && <div className="task-row-desc">{task.description}</div>}
              </div>
              <div className="task-row-meta">
                <span className={`badge badge-${task.status}`}>{statusLabel[task.status] ?? task.status}</span>
                <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                {task.dueDate && (
                  <span className="task-due">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
