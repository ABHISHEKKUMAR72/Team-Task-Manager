import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDrawerOpen(false);
  };

  const navTo = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo" onClick={() => navTo('/dashboard')}>
            <div className="logo-icon">✓</div>
            TaskFlow
          </div>

          {/* Desktop links */}
          {user && (
            <div className="nav-links">
              <a className={isActive('/dashboard')} onClick={() => navTo('/dashboard')} href="/dashboard">
                Dashboard
              </a>
              <a className={isActive('/projects')} onClick={() => navTo('/projects')} href="/projects">
                Projects
              </a>
            </div>
          )}

          {/* Right */}
          {user && (
            <div className="nav-right">
              <span className="nav-name hide-mobile">{user.firstName} {user.lastName}</span>
              <span className={`nav-role-badge ${user.role === 'admin' ? 'nav-role-admin' : 'nav-role-member'}`}>
                {user.role === 'admin' ? '👑 Admin' : '👤 Member'}
              </span>
              <div className="nav-avatar">{initials}</div>
              <button className="btn btn-ghost btn-sm hide-mobile" onClick={handleLogout}>
                Log out
              </button>
              <button
                className="nav-hamburger"
                onClick={() => setDrawerOpen(!drawerOpen)}
                aria-label="Toggle menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {user && (
        <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
          <div className="drawer-user">
            <div className="nav-avatar">{initials}</div>
            <span style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text)' }}>
              {user.firstName} {user.lastName}
            </span>
            <span className={`nav-role-badge ${user.role === 'admin' ? 'nav-role-admin' : 'nav-role-member'}`}>
              {user.role === 'admin' ? '👑 Admin' : '👤 Member'}
            </span>
          </div>
          <hr className="drawer-divider" />
          <a onClick={() => navTo('/dashboard')} href="/dashboard">🏠 Dashboard</a>
          <a onClick={() => navTo('/projects')} href="/projects">📁 Projects</a>
          <hr className="drawer-divider" />
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
};
