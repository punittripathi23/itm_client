import React from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger' // danger, primary, secondary
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-dialog-content">
        <div className={`confirm-dialog-icon-wrapper val-${variant}`}>
          <AlertTriangle size={32} />
        </div>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions flex-between">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
