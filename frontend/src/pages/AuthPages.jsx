import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api.js';
import '../styles/Auth.css';
import '../styles/App.css';

export const SignupPage = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', role: 'member'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await authService.signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">✓</div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>TaskFlow</span>
        </div>
        <h1>Get your team on the same page</h1>
        <p>Plan projects, assign tasks, and ship faster — together.</p>
        <ul className="auth-feature-list">
          <li><strong>Admin</strong>: Create projects, add members, assign tasks</li>
          <li><strong>Member</strong>: View & update your assigned tasks</li>
          <li>Track progress with real-time status updates</li>
          <li>Free to use, no credit card needed</li>
        </ul>
        <div className="auth-role-explainer">
          <div className="role-card">
            <span className="role-badge role-admin">Admin</span>
            <p>Full control — create projects, add team members, assign and manage tasks</p>
          </div>
          <div className="role-card">
            <span className="role-badge role-member">Member</span>
            <p>Join projects, view tasks assigned to you, update task status</p>
          </div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-box">
          <h2>Create your account</h2>
          <p className="auth-sub">Already have one? <Link to="/login">Sign in</Link></p>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-row">
              <div className="field">
                <label>First name</label>
                <input name="firstName" value={form.firstName} onChange={change} placeholder="Jane" required />
              </div>
              <div className="field">
                <label>Last name</label>
                <input name="lastName" value={form.lastName} onChange={change} placeholder="Smith" required />
              </div>
            </div>
            <div className="field">
              <label>Work email</label>
              <input type="email" name="email" value={form.email} onChange={change} placeholder="jane@company.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={change} placeholder="At least 6 characters" required />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={change} placeholder="Repeat your password" required />
            </div>

            {/* Role Selection */}
            <div className="field">
              <label>I am joining as a…</label>
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-option ${form.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, role: 'admin' }))}
                >
                  <span className="role-icon">👑</span>
                  <span className="role-title">Admin</span>
                  <span className="role-desc">Create & manage projects</span>
                </button>
                <button
                  type="button"
                  className={`role-option ${form.role === 'member' ? 'active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, role: 'member' }))}
                >
                  <span className="role-icon">👤</span>
                  <span className="role-title">Member</span>
                  <span className="role-desc">Work on assigned tasks</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account…' : `Sign up as ${form.role === 'admin' ? 'Admin' : 'Member'}`}
            </button>
          </form>

          <p className="auth-footer">
            By signing up you agree to our <a href="#tos">Terms</a> and <a href="#privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">✓</div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>TaskFlow</span>
        </div>
        <h1>Welcome back</h1>
        <p>Pick up right where you left off. Your projects and tasks are waiting.</p>
        <ul className="auth-feature-list">
          <li>All your projects in one place</li>
          <li>Real-time task status updates</li>
          <li>Collaborate with your whole team</li>
        </ul>
        <div className="auth-demo-creds">
          <p style={{ fontWeight: 600, marginBottom: 8 }}>🧪 Try demo accounts:</p>
          <div className="demo-cred"><span className="role-badge role-admin">Admin</span> admin@demo.com / demo1234</div>
          <div className="demo-cred"><span className="role-badge role-member">Member</span> member@demo.com / demo1234</div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-box">
          <h2>Sign in</h2>
          <p className="auth-sub">Don't have an account? <Link to="/signup">Sign up free</Link></p>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={change} placeholder="jane@company.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={change} placeholder="Your password" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
