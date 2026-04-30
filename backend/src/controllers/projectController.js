import { Project, ProjectMember, Task, User } from '../models/index.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, dueDate } = req.body;

    const project = await Project.create({
      name,
      description,
      ownerId: req.user.id,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    // Add owner as project member with admin role
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        ownerId: req.user.id,
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Task, as: 'tasks', attributes: ['id', 'title', 'status'] },
      ],
    });

    res.json({
      message: 'Projects retrieved',
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Task, as: 'tasks' },
        {
          model: User,
          as: 'members',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          through: { attributes: ['role'] },
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access
    const hasAccess = project.ownerId === req.user.id ||
      await ProjectMember.findOne({
        where: { projectId, userId: req.user.id },
      });

    if (!hasAccess && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Project retrieved',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, status, dueDate } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await project.update({
      name: name || project.name,
      description: description || project.description,
      status: status || project.status,
      dueDate: dueDate ? new Date(dueDate) : project.dueDate,
    });

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete related tasks
    await Task.destroy({ where: { projectId } });

    // Delete project members
    await ProjectMember.destroy({ where: { projectId } });

    // Delete project
    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      where: { projectId, userId },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    const member = await ProjectMember.create({
      projectId,
      userId,
      role: role || 'member',
    });

    res.status(201).json({
      message: 'Member added successfully',
      member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    if (project.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cannot remove owner
    if (project.ownerId === userId) {
      return res.status(400).json({ message: 'Cannot remove project owner' });
    }

    await ProjectMember.destroy({
      where: { projectId, userId },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing member' });
  }
};
