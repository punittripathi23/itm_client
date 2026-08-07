import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Award, BookOpen, UserPlus } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import AuthCardLayout from '../components/AuthCardLayout';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './AuthPages.css';

export const RegisterPage = () => {
  const auth = useAuth() || {};
  const { register } = auth;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orcid: '',
    memberId: '',
    password: '',
    role: 'researcher'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please complete all required fields (*).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid institutional email address.');
      return;
    }

    setLoading(true);
    try {
      if (register) {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          orcid: formData.orcid.trim(),
          memberId: formData.memberId.trim(),
          password: formData.password,
          role: formData.role
        });
      }
      setLoading(false);
      navigate('/user');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthCardLayout
      title="Create Researcher Profile"
      subtitle="Register to submit papers, participate in peer review, and download proceedings."
      footerLink={
        <span>
          Already registered? <Link to="/login">Sign in here</Link>
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
          label="Full Academic Name"
          id="name"
          type="text"
          placeholder="e.g. Dr. Elena Rostova"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={User}
          required
        />

        <Input
          label="Institutional Email Address"
          id="email"
          type="email"
          placeholder="e.g. e.rostova@university.edu"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={Mail}
          required
        />

        <Input
          label="ORCID iD (Optional)"
          id="orcid"
          type="text"
          placeholder="e.g. 0000-0002-1825-0097"
          value={formData.orcid}
          onChange={(e) => handleChange('orcid', e.target.value)}
          icon={BookOpen}
          helpText="Connects your publications directly to your ORCID profile."
        />

        <Input
          label="IEEE / ACM Member ID (Optional)"
          id="memberId"
          type="text"
          placeholder="e.g. IEEE-9402182"
          value={formData.memberId}
          onChange={(e) => handleChange('memberId', e.target.value)}
          icon={Award}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          icon={Lock}
          required
        />

        <div className="role-selection-group">
          <label className="academic-form-label">Primary Account Role</label>
          <div className="role-radio-options">
            <label className={`role-radio-pill ${formData.role === 'researcher' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="researcher"
                checked={formData.role === 'researcher'}
                onChange={(e) => handleChange('role', e.target.value)}
              />
              <span>Author / Researcher</span>
            </label>
            <label className={`role-radio-pill ${formData.role === 'reviewer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value="reviewer"
                checked={formData.role === 'reviewer'}
                onChange={(e) => handleChange('role', e.target.value)}
              />
              <span>Peer Reviewer</span>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          fullWidth
          loading={loading}
          icon={UserPlus}
        >
          Create Academic Account
        </Button>
      </form>
    </AuthCardLayout>
  );
};

export default RegisterPage;
