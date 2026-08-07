import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/user.service';
import Button from '../../../components/common/Button/Button';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Users, ShieldAlert, UserMinus, UserCheck, Shield } from 'lucide-react';
import './AdminTables.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  
  // Dialog states for status toggle
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [toggling, setToggling] = useState(false);

  const loadUsers = () => {
    setUsers(userService.getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatusTrigger = (user) => {
    setTargetUser(user);
    setConfirmOpen(true);
  };

  const handleToggleStatusConfirm = async () => {
    if (!targetUser) return;
    setToggling(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    userService.updateUserStatus(targetUser.id, newStatus);
    
    setToggling(false);
    setConfirmOpen(false);
    loadUsers();
  };

  const handleRoleToggle = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    userService.updateUserRole(user.id, newRole);
    loadUsers();
  };

  return (
    <div className="admin-users-view animate-fade-in">
      <div className="flex-between admin-table-header">
        <h3>User Registration & Access Directory</h3>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Access Role</th>
              <th className="text-right">Privilege Controls</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="flex-align" style={{ gap: '0.75rem' }}>
                  <div className="user-avatar-initials flex-center">
                    {u.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <strong>{u.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Joined: {u.joinedDate}</div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="text-right">
                  <div className="action-btns flex-align justify-end" style={{ gap: '0.5rem' }}>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleRoleToggle(u)}
                      icon={Shield}
                    >
                      Toggle Role
                    </Button>
                    <button 
                      onClick={() => handleToggleStatusTrigger(u)} 
                      className={`tbl-act-btn toggle ${u.status === 'active' ? 'active' : 'inactive'}`}
                      aria-label="Toggle user status"
                    >
                      {u.status === 'active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {targetUser && (
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleToggleStatusConfirm}
          loading={toggling}
          title={targetUser.status === 'active' ? 'Suspend User Access' : 'Unsuspend User Access'}
          message={`Are you sure you want to ${targetUser.status === 'active' ? 'suspend' : 'activate'} access permissions for ${targetUser.name}? ${targetUser.status === 'active' ? 'This user will be blocked from logging into the portal.' : 'This user will regain entry privileges.'}`}
          confirmText={targetUser.status === 'active' ? 'Suspend Account' : 'Activate Account'}
          variant={targetUser.status === 'active' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};

export default AdminUsers;
