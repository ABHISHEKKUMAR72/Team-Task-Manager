import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>📋 Task Manager</h2>
        </div>
        {user && (
          <div className="nav-menu">
            <a href="/dashboard" onClick={() => navigate('/dashboard')}>Dashboard</a>
            <a href="/projects" onClick={() => navigate('/projects')}>Projects</a>
            <div className="nav-user">
              <span>{user.firstName} {user.lastName}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
