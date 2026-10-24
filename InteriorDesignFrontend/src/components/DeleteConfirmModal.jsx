import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ design, isOpen, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !design) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(design.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" id="delete-modal-overlay">
      <div className="modal-dialog-custom p-4" id="delete-modal-dialog">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2 text-danger">
            <div className="p-2 bg-danger bg-opacity-10 rounded-circle">
              <AlertTriangle size={24} />
            </div>
            <h5 className="modal-title fw-bold text-dark mb-0">Confirm Delete</h5>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={onClose}
            disabled={isDeleting}
            id="btn-close-delete-modal"
          ></button>
        </div>

        <div className="py-2">
          <p className="text-secondary mb-2">
            Are you sure you want to permanently delete this interior design record?
          </p>

          <div className="bg-light p-3 rounded-3 mb-3 border">
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Database ID:</span>
              <strong className="text-dark font-monospace">#{design.id}</strong>
            </div>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Project:</span>
              <strong className="text-dark">{design.projectName}</strong>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Client:</span>
              <span className="text-dark">{design.clientName}</span>
            </div>
          </div>

          <div className="text-danger small mb-3">
            <strong>Endpoint:</strong> <code>DELETE /delete/{design.id}</code>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-lux-secondary btn-sm"
            onClick={onClose}
            disabled={isDeleting}
            id="btn-cancel-delete"
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm d-flex align-items-center gap-1"
            onClick={handleDelete}
            disabled={isDeleting}
            id="btn-confirm-delete"
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
