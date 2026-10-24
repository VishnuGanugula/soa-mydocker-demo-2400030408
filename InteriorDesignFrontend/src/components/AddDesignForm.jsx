import React, { useState } from 'react';
import { PlusCircle, Sparkles, RotateCcw, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const SAMPLE_DESIGNS = [
  { projectName: 'Minimalist Scandinavian Penthouse', clientName: 'Sophia Montgomery', budget: 85000, completed: false },
  { projectName: 'Luxury Art Deco Master Suite', clientName: 'Alexander Sterling', budget: 120000, completed: true },
  { projectName: 'Biophilic Modern Living Room', clientName: 'Elena Rostova', budget: 45000, completed: false },
  { projectName: 'Mid-Century Contemporary Villa', clientName: 'Dr. Marcus Vance', budget: 160000, completed: false },
  { projectName: 'Zen Japanese Tea Room & Patio', clientName: 'Kenji Takahashi', budget: 38000, completed: true },
  { projectName: 'Urban Industrial Loft Renovation', clientName: 'Claire Beauchamp', budget: 95000, completed: true }
];

export default function AddDesignForm({ onAddSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    budget: '',
    completed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Field-level validation
  const validate = () => {
    const newErrors = {};

    if (!formData.projectName || !formData.projectName.trim()) {
      newErrors.projectName = 'Project Name is required';
    } else if (formData.projectName.trim().length < 3) {
      newErrors.projectName = 'Project Name must be at least 3 characters long';
    } else if (formData.projectName.trim().length > 80) {
      newErrors.projectName = 'Project Name cannot exceed 80 characters';
    }

    if (!formData.clientName || !formData.clientName.trim()) {
      newErrors.clientName = 'Client Name is required';
    } else if (formData.clientName.trim().length < 2) {
      newErrors.clientName = 'Client Name must be at least 2 characters long';
    } else if (formData.clientName.trim().length > 60) {
      newErrors.clientName = 'Client Name cannot exceed 60 characters';
    }

    if (formData.budget === '' || formData.budget === null || formData.budget === undefined) {
      newErrors.budget = 'Project Budget is required';
    } else {
      const numBudget = Number(formData.budget);
      if (isNaN(numBudget)) {
        newErrors.budget = 'Budget must be a valid numeric amount';
      } else if (numBudget <= 0) {
        newErrors.budget = 'Budget must be greater than $0';
      } else if (numBudget > 100000000) {
        newErrors.budget = 'Budget cannot exceed $100,000,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear inline error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, completed: status }));
  };

  const handleFillSample = () => {
    const randomSample = SAMPLE_DESIGNS[Math.floor(Math.random() * SAMPLE_DESIGNS.length)];
    setFormData({
      projectName: randomSample.projectName,
      clientName: randomSample.clientName,
      budget: randomSample.budget.toString(),
      completed: randomSample.completed
    });
    setErrors({});
    setSubmitError(null);
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      clientName: '',
      budget: '',
      completed: false
    });
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onAddSuccess(formData);
      handleReset();
    } catch (err) {
      setSubmitError(err.message || 'Failed to add interior design project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card glass-card p-4 mb-4" id="add-design-card">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <PlusCircle className="text-primary" size={24} />
            Create New Interior Design Project
          </h4>
          <p className="text-muted small mb-0">
            Submit a new design contract to your Spring Boot database.
          </p>
        </div>

        {/* Quick action: Fill sample data */}
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={handleFillSample}
            id="btn-fill-sample"
            title="Auto-fill with realistic interior design data for quick testing"
          >
            <Sparkles size={14} />
            Fill Sample Data
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={handleReset}
            id="btn-reset-form"
          >
            <RotateCcw size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Backend Auto-ID Notice */}
      <div className="alert alert-light border border-info border-opacity-25 d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded-3 text-secondary small">
        <ShieldCheck className="text-info flex-shrink-0" size={18} />
        <div>
          <strong>Auto-Generated ID:</strong> In accordance with backend specifications, the project ID is <em>never</em> entered manually. It will be automatically generated by the database upon saving.
        </div>
      </div>

      {/* Submit Error Banner */}
      {submitError && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert" id="add-form-error-banner">
          <AlertCircle size={18} />
          <div>{submitError}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate id="add-interior-design-form">
        <div className="row g-3">
          {/* Project Name */}
          <div className="col-12 col-md-6">
            <label htmlFor="input-project-name" className="form-label fw-semibold text-secondary small">
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="input-project-name"
              name="projectName"
              className={`form-control lux-input ${errors.projectName ? 'is-invalid' : ''}`}
              placeholder="e.g., Luxury Nordic Penthouse"
              value={formData.projectName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.projectName ? (
              <div className="invalid-feedback d-block">{errors.projectName}</div>
            ) : (
              <div className="form-text text-muted small">Descriptive title of the interior design theme.</div>
            )}
          </div>

          {/* Client Name */}
          <div className="col-12 col-md-6">
            <label htmlFor="input-client-name" className="form-label fw-semibold text-secondary small">
              Client Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="input-client-name"
              name="clientName"
              className={`form-control lux-input ${errors.clientName ? 'is-invalid' : ''}`}
              placeholder="e.g., Eleanor Vance"
              value={formData.clientName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.clientName ? (
              <div className="invalid-feedback d-block">{errors.clientName}</div>
            ) : (
              <div className="form-text text-muted small">Full name or company name of the client.</div>
            )}
          </div>

          {/* Budget */}
          <div className="col-12 col-md-6">
            <label htmlFor="input-budget" className="form-label fw-semibold text-secondary small">
              Budget ($ USD) <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted border-end-0 rounded-start-3">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                id="input-budget"
                name="budget"
                className={`form-control lux-input border-start-0 ${errors.budget ? 'is-invalid' : ''}`}
                placeholder="e.g., 75000"
                value={formData.budget}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.budget ? (
              <div className="invalid-feedback d-block">{errors.budget}</div>
            ) : (
              <div className="form-text text-muted small">Total estimated budget allocated for this design.</div>
            )}
          </div>

          {/* Completion Status */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold text-secondary small d-block">
              Project Status <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-2">
              <button
                type="button"
                id="btn-status-in-progress"
                className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 ${
                  !formData.completed ? 'btn-warning fw-bold text-dark' : 'btn-outline-secondary'
                }`}
                onClick={() => handleStatusChange(false)}
                disabled={isSubmitting}
              >
                In Progress
              </button>
              <button
                type="button"
                id="btn-status-completed"
                className={`btn flex-fill py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 ${
                  formData.completed ? 'btn-success fw-bold text-white' : 'btn-outline-secondary'
                }`}
                onClick={() => handleStatusChange(true)}
                disabled={isSubmitting}
              >
                <CheckCircle2 size={16} />
                Completed
              </button>
            </div>
            <div className="form-text text-muted small">Select current execution phase.</div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          {onCancel && (
            <button
              type="button"
              className="btn btn-lux-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              id="btn-cancel-add"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="btn btn-lux-primary d-flex align-items-center gap-2"
            disabled={isSubmitting}
            id="btn-submit-add"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Save Project (POST /add)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
