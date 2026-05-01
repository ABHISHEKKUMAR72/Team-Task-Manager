import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import '../styles/Projects.css';
import '../styles/App.css';



/* ──────────────────────────────────────────────────────────
   Projects List
────────────────────────────────────────────────────────── */
export const ProjectsListPage = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState({ name: '', description: '', dueDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    projectService.getProjects()
      .then(r => setProjects(r.data.projects))
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await projectService.createProject(form);
      setProjects(prev => [...prev, r.data.project]);
      setForm({ name: '', description: '', dueDate: '' });
      setShowForm(false);
    } catch {
      setError('Failed to create project.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch {
      setError('Failed to delete project.');
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="skeleton" style={{ height: 28, width: 180, marginBottom: 32 }} />
      <div className="projects-grid">
        {[1,2,3].map(i => (
          <div key={i} className="project-card">
            <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 6 }} />
            <div className="skeleton" style={{ height: 14, width: '50%' }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-wrapper projects-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Projects</h1>
          <p>{projects.length === 0 ? 'No projects yet' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ New project'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="form-panel">
          <h3>New project</h3>
          <form onSubmit={handleCreate}>
            <div className="form-grid">
              <div className="field form-full">
                <label>Project name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Website Redesign"
                  required
                />
              </div>
              <div className="field form-full">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's this project about?"
                  rows={3}
                />
              </div>
              <div className="field">
                <label>Due date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create project'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>You haven't created any projects yet.<br />Hit <strong>New project</strong> to get started.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project._id} className="project-card">
              <div className="project-card-top">
                <h3>{project.name}</h3>
                <span className={`badge badge-${project.status}`}>{project.status}</span>
              </div>
              {project.description && (
                <p className="project-desc">{project.description}</p>
              )}
              <div className="project-card-footer">
                {project.dueDate && (
                  <span className="project-due">
                    📅 {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                )}
                <div className="project-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    Open →
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Project Detail
────────────────────────────────────────────────────────── */
export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]     = useState(null);
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskForm, setTaskForm]   = useState({ title: '', description: '', priority: 'medium', dueDate: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.getProjectById(projectId),
          taskService.getProjectTasks(projectId),
        ]);
        setProject(projRes.data.project);
        setTasks(taskRes.data.tasks);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          setError("Project not found or you don't have access.");
        } else {
          setError('Failed to load project. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskSubmitting(true);
    try {
      const r = await taskService.createTask(projectId, taskForm);
      setTasks(prev => [...prev, r.data.task]);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
    } catch {
      setError('Failed to create task.');
    } finally { setTaskSubmitting(false); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const r = await taskService.updateTask(taskId, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? r.data.task : t));
    } catch {
      setError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const isOwner = project && user && project.ownerId?.toString() === (user.id ?? user._id)?.toString();

  if (loading) return (
    <div className="page-wrapper">
      <div className="skeleton" style={{ height: 32, width: 300, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 16, width: 200, marginBottom: 32 }} />
      <div className="skeleton" style={{ height: 200, borderRadius: 10 }} />
    </div>
  );

  if (error && !project) return (
    <div className="page-wrapper">
      <div className="alert alert-error">{error}</div>
      <button className="btn btn-ghost" onClick={() => navigate('/projects')}>← Back to projects</button>
    </div>
  );

  return (
    <div className="page-wrapper project-detail">
      {/* Header */}
      <div className="project-detail-header">
        <div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 12 }}
            onClick={() => navigate('/projects')}
          >
            ← Projects
          </button>
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
          <div className="project-meta-row">
            <span className={`badge badge-${project.status}`}>{project.status}</span>
            {project.dueDate && (
              <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                📅 Due {new Date(project.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-layout">
        {/* Tasks column */}
        <div className="tasks-section">
          <div className="section-header">
            <h3>Tasks ({tasks.length})</h3>
            {(isOwner || true) && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowTaskForm(s => !s)}>
                {showTaskForm ? '✕ Cancel' : '+ Add task'}
              </button>
            )}
          </div>

          {showTaskForm && (
            <div className="task-form-panel">
              <form onSubmit={handleCreateTask}>
                <div className="task-form-grid">
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>Task title *</label>
                    <input
                      value={taskForm.title}
                      onChange={e => setTaskForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Design landing page"
                      required
                    />
                  </div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea
                      value={taskForm.description}
                      onChange={e => setTaskForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Optional details…"
                      rows={2}
                    />
                  </div>
                  <div className="field">
                    <label>Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={e => setTaskForm(p => ({ ...p, priority: e.target.value }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Due date</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={e => setTaskForm(p => ({ ...p, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-actions" style={{ marginTop: 14 }}>
                  <button type="submit" className="btn btn-primary" disabled={taskSubmitting}>
                    {taskSubmitting ? 'Adding…' : 'Add task'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No tasks yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-card-top">
                    <h4>{task.title}</h4>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', fontSize: '.78rem' }}
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      ✕
                    </button>
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div className="task-card-meta">
                    <select
                      className="task-status-select"
                      value={task.status}
                      onChange={e => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    {task.dueDate && (
                      <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h4>Project info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '.87rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Status</span>
                <span className={`badge badge-${project.status}`}>{project.status}</span>
              </div>
              {project.dueDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Due date</span>
                  <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Created</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Tasks</span>
                <span>{tasks.length} total</span>
              </div>
            </div>
          </div>

          {project.members && project.members.length > 0 && (
            <div className="sidebar-card">
              <h4>Team</h4>
              {project.members.map(m => (
                <div key={m._id} className="member-item">
                  <div className="member-avatar">
                    {(m.firstName?.[0] ?? '') + (m.lastName?.[0] ?? '')}
                  </div>
                  <div>
                    <div className="member-name">{m.firstName} {m.lastName}</div>
                    <div className="member-role">{m.role ?? 'member'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
