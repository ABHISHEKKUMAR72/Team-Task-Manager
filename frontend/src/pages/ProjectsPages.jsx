import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Projects.css';

export const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response.data.projects);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await projectService.createProject(formData);
      setProjects([...projects, response.data.project]);
      setFormData({ name: '', description: '', dueDate: '' });
      setShowForm(false);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return <div className="projects-page">Loading...</div>;

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreateProject} className="project-form">
          <input
            type="text"
            placeholder="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <button type="submit" className="btn-primary">Create Project</button>
        </form>
      )}

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p className="status">{project.status}</p>
            <div className="project-actions">
              <button onClick={() => navigate(`/projects/${project.id}`)} className="btn-secondary">
                View
              </button>
              <button onClick={() => handleDeleteProject(project.id)} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          projectService.getProjectById(projectId),
          taskService.getProjectTasks(projectId),
        ]);
        setProject(projectRes.data.project);
        setTasks(tasksRes.data.tasks);
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await taskService.createTask(projectId, taskFormData);
      setTasks([...tasks, response.data.task]);
      setTaskFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map(t => t.id === taskId ? response.data.task : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <div className="project-detail">Loading...</div>;
  if (!project) return <div className="project-detail">Project not found</div>;

  return (
    <div className="project-detail">
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p className="status">{project.status}</p>

      {error && <div className="error-message">{error}</div>}

      <div className="members-section">
        <h3>Team Members</h3>
        {project.members && project.members.length > 0 ? (
          <ul>
            {project.members.map(member => (
              <li key={member.id}>
                {member.firstName} {member.lastName} ({member.ProjectMember?.role})
              </li>
            ))}
          </ul>
        ) : (
          <p>No team members yet</p>
        )}
      </div>

      <div className="tasks-section">
        <div className="section-header">
          <h3>Tasks</h3>
          {project.ownerId === user?.id && (
            <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn-primary">
              {showTaskForm ? 'Cancel' : 'New Task'}
            </button>
          )}
        </div>

        {showTaskForm && (
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              placeholder="Task Title"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={taskFormData.description}
              onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
            />
            <select
              value={taskFormData.priority}
              onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={taskFormData.dueDate}
              onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
            />
            <button type="submit" className="btn-primary">Create Task</button>
          </form>
        )}

        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <select
                value={task.status}
                onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                className="status-select"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="task-meta">
                <span className={`priority ${task.priority}`}>{task.priority}</span>
                {task.dueDate && (
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>
              {project.ownerId === user?.id && (
                <button onClick={() => handleDeleteTask(task.id)} className="btn-danger">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
