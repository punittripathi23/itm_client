import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Award } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import AuthCardLayout from '../components/AuthCardLayout';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './AuthPages.css';

export const LoginPage = () => {
  const auth = useAuth() || {};
  const { login } = auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your Institutional Email or Member ID and Password.');
      return;
    }

    setLoading(true);
    try {
      if (login) {
        const user = await login(email.trim(), password);
        setLoading(false);
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setLoading(false);
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <AuthCardLayout
      title="Institutional Sign In"
      subtitle="Access peer-reviewed conference proceedings, saved papers, and submission status."
      footerLink={
        <span>
          Don't have an academic account? <Link to="/register">Register here</Link>
        </span>
      }
    >
      {error && (
        <div className="auth-error-banner" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Institutional Email or Member ID"
          id="email"
          type="email"
          placeholder="e.g. author@university.edu or IEEE-90123"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          required
        />

        <Input
          label="Account Password"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
        />

        <div className="auth-options-row">
          <label className="academic-checkbox-label">
            <input type="checkbox" id="rememberMe" />
            <span>Keep session active</span>
          </label>
          <a href="#forgot" className="auth-forgot-link">Forgot password?</a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          fullWidth
          loading={loading}
          icon={LogIn}
        >
          Sign In to Portal
        </Button>
      </form>

      <div className="demo-credentials-box">
        <span className="demo-title">Test Credentials:</span>
        <div className="demo-row">
          <span><strong>Administrator:</strong> admin@test.com / password123</span>
          <span><strong>Researcher:</strong> user@test.com / password123</span>
        </div>
      </div>
    </AuthCardLayout>
  );
};

export default LoginPage;
