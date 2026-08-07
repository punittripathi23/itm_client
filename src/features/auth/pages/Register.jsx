import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import './AuthPages.css';

export const Register = () => {
  const { register } = useAuth();
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
      await register(name.trim(), email.trim(), password);
      setSubmitting(false);
      navigate('/user');
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };


  return (
    <div className="auth-form-wrapper">
      {error && (
        <div className="error-banner animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          id="name"
          type="text"
          placeholder="e.g. Sonu Tripathi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
          required
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="e.g. user@test.com"
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
          icon={UserPlus}
          className="w-100 mt-1"
        >
          Create Account
        </Button>
      </form>

      <div className="auth-footer-text">
        <span>Already have an account? </span>
        <Link to="/login" className="auth-link">Sign in instead</Link>
      </div>
    </div>
  );
};

export default Register;
