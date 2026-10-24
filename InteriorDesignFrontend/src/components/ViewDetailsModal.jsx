import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, Clock, DollarSign, User, Folder, Hash, X, Code } from 'lucide-react';
import { interiorDesignApi } from '../services/api';

export default function ViewDetailsModal({ designId, isOpen, onClose }) {
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    if (isOpen && designId) {
      loadDesignDetails();
    } else {
      setDesign(null);
      setError(null);
      setShowJson(false);
    }
  }, [isOpen, designId]);

  const loadDesignDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await interiorDesignApi.getDesignById(designId);
      setDesign(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch design record details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val || 0);
  };

  return (
    <div className="modal-overlay" id="view-details-overlay">
      <div className="modal-dialog-custom p-4" id="view-details-dialog">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
              <Eye size={22} />
            </div>
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">Project Details</h5>
              <span className="text-muted small">Fetched via <code>GET /display/{designId}</code></span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Close" 
            onClick={onClose}
            id="btn-close-view-modal"
          ></button>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
            <p className="mt-2 text-muted small">Calling GET /display/{designId}...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && design && (
          <div>
            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="row g-3">
                {/* ID */}
                <div className="col-6">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <Hash size={14} /> ID
                  </div>
                  <div className="fw-bold font-monospace fs-6 text-dark">#{design.id}</div>
                </div>

                {/* Status */}
                <div className="col-6">
                  <div className="text-muted small">Status</div>
                  {design.completed ? (
                    <span className="badge-completed mt-1">
                      <CheckCircle2 size={13} /> Completed
                    </span>
                  ) : (
                    <span className="badge-in-progress mt-1">
                      <Clock size={13} /> In Progress
                    </span>
                  )}
                </div>

                {/* Project Name */}
                <div className="col-12">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <Folder size={14} /> Project Name
                  </div>
                  <div className="fw-bold fs-5 text-dark">{design.projectName}</div>
                </div>

                {/* Client Name */}
                <div className="col-12 col-sm-6">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <User size={14} /> Client Name
                  </div>
                  <div className="fw-semibold text-secondary">{design.clientName}</div>
                </div>

                {/* Budget */}
                <div className="col-12 col-sm-6">
                  <div className="text-muted small d-flex align-items-center gap-1">
                    <DollarSign size={14} /> Budget Allocated
                  </div>
                  <div className="fw-bold font-monospace text-primary fs-5">
                    {formatCurrency(design.budget)}
                  </div>
                </div>
              </div>
            </div>

            {/* JSON Toggle */}
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center gap-1 text-muted"
                onClick={() => setShowJson(!showJson)}
              >
                <Code size={14} />
                {showJson ? 'Hide Raw Backend JSON' : 'View Raw Backend JSON'}
              </button>

              {showJson && (
                <pre className="bg-dark text-success p-3 rounded-3 mt-2 small font-monospace overflow-auto" style={{ maxHeight: '150px' }}>
                  {JSON.stringify(design, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end pt-2 border-top">
          <button
            type="button"
            className="btn btn-lux-secondary btn-sm"
            onClick={onClose}
            id="btn-close-view-footer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
