import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import './AuthPages.css';

export const AdminRegister = () => {
  const { registerAdmin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const user = await registerAdmin(name.trim(), email.trim(), password);
      setSubmitting(false);
      // GuestRoute will redirect to /admin automatically once isAdmin becomes true.
      // navigate is kept as immediate fallback.
      if (user && user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Admin registration failed. Please try again.');
    }

  };

  return (
    <div className="auth-form-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '2rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#dc2626',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          <ShieldCheck size={16} /> Administrator Portal Registration
        </div>
      </div>

      {error && (
        <div className="error-banner animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Admin Full Name"
          id="name"
          type="text"
          placeholder="e.g. Administrator Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
          required
        />

        <Input
          label="Official Admin Email"
          id="email"
          type="email"
          placeholder="e.g. admin@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
          required
        />

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          icon={ShieldCheck}
          className="w-100 mt-1"
        >
          Create Admin Account
        </Button>
      </form>

      <div className="auth-footer-text">
        <span>Already have an admin account? </span>
        <Link to="/login" className="auth-link">Sign in here</Link>
      </div>
    </div>
  );
};

export default AdminRegister;
