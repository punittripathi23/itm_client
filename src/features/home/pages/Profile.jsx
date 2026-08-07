import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { User, Mail, Lock, CheckCircle, Save } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    if (!name || !email) {
      setError('Name and Email fields are required');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    setSaving(true);
    // Simulate API saving latency
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }
    
    updateProfile(updateData);
    setSaving(false);
    setSuccess(true);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="profile-view animate-fade-in">
      <div className="flex-between section-header border-b">
        <h2>Account Settings</h2>
        <span className="badge badge-info">Role: {user?.role.toUpperCase()}</span>
      </div>

      {success && (
        <div className="profile-success-banner flex-align animate-scale-up">
          <CheckCircle size={18} />
          <span>Profile configuration saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="error-banner animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form mt-2">
        <div className="grid-2">
          <Input
            label="Full Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            disabled // Email matches login session token in mock DB
          />
        </div>

        <div className="password-update-section">
          <h3>Update Credentials</h3>
          <p className="section-subtitle">Leave fields blank if you do not wish to change your active login credentials.</p>
          
          <div className="grid-2 mt-1">
            <Input
              label="New Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={saving}
          icon={Save}
          className="mt-2 save-profile-btn"
        >
          Save Configuration
        </Button>
      </form>
    </div>
  );
};

export default Profile;
