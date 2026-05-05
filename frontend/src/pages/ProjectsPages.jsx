import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import '../styles/Projects.css';
import '../styles/App.css';

const priorityColors = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
const statusLabel = { todo: 'To Do', in_progress: 'In Progress', completed: 'Completed' };

/* ──────────────────────────────────────────────────────────
   Projects List
────────────────────────────────────────────────────────── */
export const ProjectsListPage = () => {
  const { user } = useAuth();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]           = useState({ name: '', description: '', dueDate: '' });
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

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
          <p>
            {projects.length === 0 ? 'No projects yet' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
            {!isAdmin && <span className="role-info-chip">👤 Member view — you see projects you're added to</span>}
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            {showForm ? '✕ Cancel' : '+ New project'}
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="alert alert-info">
          <strong>👤 Member access:</strong> You can see projects you've been added to. Ask an Admin to add you to a project.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && isAdmin && (
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
          <p>
            {isAdmin
              ? <>You haven't created any projects yet.<br />Hit <strong>New project</strong> to get started.</>
              : "You haven't been added to any projects yet. Ask an Admin to invite you."
            }
          </p>
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
                  {isAdmin && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  )}
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
   Project Detail — with task assignment & RBAC
────────────────────────────────────────────────────────── */
export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject]           = useState(null);
  const [tasks, setTasks]               = useState([]);
  const [members, setMembers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskForm, setTaskForm]         = useState({
    title: '', description: '', priority: 'medium', dueDate: '', assignedTo: ''
  });

  // Add member state
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberEmail, setMemberEmail]       = useState('');
  const [memberRole, setMemberRole]         = useState('member');
  const [memberSubmitting, setMemberSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const userId  = user?.id ?? user?._id;

  const load = useCallback(async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getProjectTasks(projectId),
      ]);
      const proj = projRes.data.project;
      setProject(proj);
      setTasks(taskRes.data.tasks);
      // Extract members from project
      const mems = proj.members || [];
      setMembers(mems);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        setError("Project not found or you don't have access.");
      } else {
        setError('Failed to load project. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  /* ── Task CRUD ── */
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskSubmitting(true);
    try {
      const payload = { ...taskForm };
      if (!payload.assignedTo) delete payload.assignedTo;
      const r = await taskService.createTask(projectId, payload);
      setTasks(prev => [...prev, r.data.task]);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
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

  /* ── Member management ── */
  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberSubmitting(true);
    try {
      await projectService.addMember(projectId, { email: memberEmail, role: memberRole });
      setMemberEmail('');
      setMemberRole('member');
      setShowMemberForm(false);
      await load(); // refresh to get new members
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member. Check the email address.');
    } finally { setMemberSubmitting(false); }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await projectService.removeMember(projectId, memberId);
      setMembers(prev => prev.filter(m => (m._id || m.user?._id) !== memberId));
    } catch {
      setError('Failed to remove member.');
    }
  };

  /* ── Helpers ── */
  const getAssigneeName = (task) => {
    if (!task.assignedTo) return null;
    const assignee = task.assignedTo;
    if (typeof assignee === 'object') {
      return `${assignee.firstName || ''} ${assignee.lastName || ''}`.trim();
    }
    const found = members.find(m => {
      const mId = m._id || m.user?._id || m.userId;
      return mId?.toString() === assignee?.toString();
    });
    if (found) return `${found.firstName || found.user?.firstName || ''} ${found.lastName || found.user?.lastName || ''}`.trim();
    return null;
  };

  // Can this user edit a specific task?
  const canEditTask = (task) => {
    if (isAdmin) return true;
    const assigneeId = task.assignedTo?._id || task.assignedTo;
    return assigneeId?.toString() === userId?.toString();
  };

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

  // Members list for assignment dropdown
  const assignableMembers = [
    // Include the owner
    ...(project?.owner ? [{ _id: project.owner._id || project.owner, firstName: project.owner.firstName || 'Owner', lastName: project.owner.lastName || '', email: project.owner.email || '' }] : []),
    ...members.map(m => ({
      _id: m._id || m.user?._id || m.userId,
      firstName: m.firstName || m.user?.firstName || '',
      lastName: m.lastName || m.user?.lastName || '',
      email: m.email || m.user?.email || '',
    }))
  ].filter((m, i, arr) => m._id && arr.findIndex(x => x._id?.toString() === m._id?.toString()) === i);

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
            {isAdmin && <span className="role-badge role-admin">👑 Admin</span>}
            {!isAdmin && <span className="role-badge role-member">👤 Member</span>}
            {project.dueDate && (
              <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>
                📅 Due {new Date(project.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!isAdmin && (
        <div className="alert alert-info">
          <strong>👤 Member view:</strong> You see only tasks assigned to you. Admins can see all project tasks. You can update status of your assigned tasks; only Admins can create/delete tasks.
        </div>
      )}

      <div className="detail-layout">
        {/* Tasks column */}
        <div className="tasks-section">
          <div className="section-header">
            <h3>Tasks ({tasks.length})</h3>
            {isAdmin && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowTaskForm(s => !s)}>
                {showTaskForm ? '✕ Cancel' : '+ Add task'}
              </button>
            )}
          </div>

          {showTaskForm && isAdmin && (
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
                    <label>Assign to</label>
                    <select
                      value={taskForm.assignedTo}
                      onChange={e => setTaskForm(p => ({ ...p, assignedTo: e.target.value }))}
                    >
                      <option value="">— Unassigned —</option>
                      {assignableMembers.map(m => (
                        <option key={m._id} value={m._id}>
                          {m.firstName} {m.lastName} {m.email ? `(${m.email})` : ''}
                        </option>
                      ))}
                    </select>
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
              <p>{isAdmin ? 'No tasks yet. Add one to get started.' : 'No tasks in this project yet.'}</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => {
                const assigneeName = getAssigneeName(task);
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
                const canEdit = canEditTask(task);

                return (
                  <div key={task._id} className={`task-card ${isOverdue ? 'task-overdue' : ''}`}>
                    <div className="task-card-top">
                      <div>
                        <h4>{task.title}</h4>
                        {assigneeName && (
                          <div className="task-assignee">
                            <span className="assignee-avatar">{assigneeName[0]}</span>
                            {assigneeName}
                          </div>
                        )}
                        {!assigneeName && (
                          <div className="task-assignee unassigned">Unassigned</div>
                        )}
                      </div>
                      {isAdmin && (
                        <button
                          className="btn btn-ghost btn-sm task-delete-btn"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div className="task-card-meta">
                      {canEdit ? (
                        <select
                          className="task-status-select"
                          value={task.status}
                          onChange={e => handleStatusChange(task._id, e.target.value)}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span className={`badge badge-status-${task.status}`}>
                          {statusLabel[task.status] ?? task.status}
                        </span>
                      )}
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                      {task.dueDate && (
                        <span style={{ fontSize: '.78rem', color: isOverdue ? 'var(--danger)' : 'var(--muted)' }}>
                          {isOverdue ? '⚠️' : '📅'} {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <span>{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} done</span>
              </div>
            </div>
          </div>

          {/* Team Members card */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h4>Team ({members.length + 1})</h4>
              {isAdmin && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowMemberForm(s => !s)}
                >
                  {showMemberForm ? '✕' : '+ Add'}
                </button>
              )}
            </div>

            {showMemberForm && isAdmin && (
              <form onSubmit={handleAddMember} className="member-form">
                <div className="field">
                  <label>Member email</label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                  />
                </div>
                <div className="field">
                  <label>Project role</label>
                  <select value={memberRole} onChange={e => setMemberRole(e.target.value)}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={memberSubmitting}>
                  {memberSubmitting ? 'Adding…' : 'Add member'}
                </button>
              </form>
            )}

            {/* Owner */}
            {project.owner && (
              <div className="member-item">
                <div className="member-avatar owner-avatar">
                  {(project.owner.firstName?.[0] ?? '?')}
                </div>
                <div>
                  <div className="member-name">
                    {project.owner.firstName} {project.owner.lastName}
                    {project.owner._id?.toString() === userId?.toString() && ' (you)'}
                  </div>
                  <div className="member-role">
                    <span className="role-badge role-admin">👑 Owner</span>
                  </div>
                </div>
              </div>
            )}

            {/* Members */}
            {members.map(m => {
              const mId   = m._id || m.user?._id || m.userId;
              const mFirst = m.firstName || m.user?.firstName || '';
              const mLast  = m.lastName  || m.user?.lastName  || '';
              const mRole  = m.role || 'member';
              return (
                <div key={mId} className="member-item">
                  <div className="member-avatar">
                    {(mFirst[0] ?? '') + (mLast[0] ?? '')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="member-name">
                      {mFirst} {mLast}
                      {mId?.toString() === userId?.toString() && ' (you)'}
                    </div>
                    <div className="member-role">
                      <span className={`role-badge role-${mRole}`}>
                        {mRole === 'admin' ? '👑 Admin' : '👤 Member'}
                      </span>
                    </div>
                  </div>
                  {isAdmin && mId?.toString() !== userId?.toString() && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 6px', fontSize: '.7rem' }}
                      onClick={() => handleRemoveMember(mId)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}

            {members.length === 0 && (
              <p style={{ fontSize: '.82rem', color: 'var(--muted)', textAlign: 'center', padding: '8px 0' }}>
                {isAdmin ? 'No members added yet.' : 'Only you are on this project.'}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
