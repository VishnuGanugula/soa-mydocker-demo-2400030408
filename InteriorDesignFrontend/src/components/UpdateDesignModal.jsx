import React, { useState, useEffect } from 'react';
import { Edit3, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function UpdateDesignModal({ design, isOpen, onClose, onUpdateConfirm }) {
  const [formData, setFormData] = useState({
    id: '',
    projectName: '',
    clientName: '',
    budget: '',
    completed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (design) {
      setFormData({
        id: design.id,
        projectName: design.projectName || '',
        clientName: design.clientName || '',
        budget: design.budget !== undefined ? design.budget.toString() : '',
        completed: Boolean(design.completed)
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [design]);

  if (!isOpen || !design) return null;

  const validate = () => {
    const newErrors = {};
    const numBudget = Number(formData.budget);

    if (formData.budget === '' || isNaN(numBudget)) {
      newErrors.budget = 'Please enter a valid numeric budget';
    } else if (numBudget <= 0) {
      newErrors.budget = 'Budget must be greater than $0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onUpdateConfirm({
        ...design,
        budget: parseFloat(formData.budget),
        completed: Boolean(formData.completed)
      });
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to update record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" id="edit-modal-overlay">
      <div className="modal-dialog-custom p-4" id="edit-modal-dialog">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2 text-primary">
            <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
              <Edit3 size={22} />
            </div>
            <h5 className="modal-title fw-bold text-dark mb-0">Update Design Record</h5>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={onClose}
            disabled={isSubmitting}
            id="btn-close-edit-modal"
          ></button>
        </div>

        <form onSubmit={handleSubmit} id="edit-interior-design-form">
          {/* Target Info */}
          <div className="bg-light p-3 rounded-3 mb-3 border">
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Database Record:</span>
              <strong className="text-dark font-monospace">ID #{formData.id}</strong>
            </div>
            <div className="d-flex justify-content-between text-muted small mb-1">
              <span>Project Name:</span>
              <span className="text-dark fw-semibold">{formData.projectName}</span>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Client Name:</span>
              <span className="text-dark">{formData.clientName}</span>
            </div>
          </div>

          {submitError && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              <AlertCircle size={16} className="me-1 inline" />
              {submitError}
            </div>
          )}

          {/* Editable Field: Budget */}
          <div className="mb-3">
            <label htmlFor="edit-budget" className="form-label fw-semibold text-secondary small">
              Updated Budget ($ USD) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                id="edit-budget"
                className={`form-control lux-input ${errors.budget ? 'is-invalid' : ''}`}
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                disabled={isSubmitting}
                required
              />
            </div>
            {errors.budget && <div className="invalid-feedback d-block">{errors.budget}</div>}
          </div>

          {/* Editable Field: Completion Status */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary small d-block">
              Project Status
            </label>
            <div className="d-flex gap-2">
              <button
                type="button"
                id="btn-edit-status-in-progress"
                className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 ${
                  !formData.completed ? 'btn-warning fw-bold text-dark' : 'btn-outline-secondary'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, completed: false }))}
                disabled={isSubmitting}
              >
                In Progress
              </button>
              <button
                type="button"
                id="btn-edit-status-completed"
                className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 ${
                  formData.completed ? 'btn-success fw-bold text-white' : 'btn-outline-secondary'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, completed: true }))}
                disabled={isSubmitting}
              >
                <CheckCircle2 size={16} />
                Completed
              </button>
            </div>
            <div className="form-text text-muted small">Updated via <code>PUT /update</code>.</div>
          </div>

          {/* Modal Actions */}
          <div className="d-flex justify-content-end gap-2 pt-2 border-top">
            <button
              type="button"
              className="btn btn-lux-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
              id="btn-cancel-edit"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-lux-primary btn-sm d-flex align-items-center gap-1"
              disabled={isSubmitting}
              id="btn-submit-edit"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Edit3 size={15} />
                  <span>Update Record (PUT /update)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
