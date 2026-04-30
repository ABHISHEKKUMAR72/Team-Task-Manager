import User from './User.js';
import Project from './Project.js';
import Task from './Task.js';
import ProjectMember from './ProjectMember.js';

// User - Project relationship (owner)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// User - Task relationship (creator)
User.hasMany(Task, { foreignKey: 'createdBy', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User - Task relationship (assignee)
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

// Project - Task relationship
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Project - User relationship (members)
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'projectId', as: 'members' });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'userId', as: 'projects' });

export { User, Project, Task, ProjectMember };
