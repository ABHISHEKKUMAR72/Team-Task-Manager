import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
  tableName: 'project_members',
});

export default ProjectMember;
