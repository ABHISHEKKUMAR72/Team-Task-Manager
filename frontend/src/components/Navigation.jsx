import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
              <div className="nav-profile-container" style={{ position: 'relative' }}>
                <div 
                  className="nav-avatar" 
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  {initials}
                </div>
                {profileOpen && (
                  <div className="profile-dropdown" style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    width: '240px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    color: 'var(--text)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div className="nav-avatar" style={{ margin: 0, width: 40, height: 40, fontSize: '1rem' }}>{initials}</div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px', fontStyle: 'italic' }}>
                      "TaskFlow enthusiast and team player. Ready to ship features fast."
                    </div>
                    <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '0 -16px 12px -16px' }} />
                    <button 
                      className="btn btn-ghost btn-sm" 
                      onClick={handleLogout}
                      style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
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
