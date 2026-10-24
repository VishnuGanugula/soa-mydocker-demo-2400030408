import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  LayoutList, 
  LayoutGrid, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCw 
} from 'lucide-react';

export default function DesignList({ 
  designs, 
  isLoading, 
  error, 
  onRefresh, 
  onOpenAdd, 
  onOpenView, 
  onOpenEdit, 
  onOpenDelete 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('ID_DESC');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filter & Sort Logic
  const filteredDesigns = useMemo(() => {
    return designs
      .filter(item => {
        // Status filter
        if (statusFilter === 'COMPLETED' && !item.completed) return false;
        if (statusFilter === 'IN_PROGRESS' && item.completed) return false;

        // Search term (ID, Project Name, Client Name)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          const matchesId = item.id?.toString().includes(term);
          const matchesProject = item.projectName?.toLowerCase().includes(term);
          const matchesClient = item.clientName?.toLowerCase().includes(term);
          return matchesId || matchesProject || matchesClient;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'ID_ASC':
            return (a.id || 0) - (b.id || 0);
          case 'ID_DESC':
            return (b.id || 0) - (a.id || 0);
          case 'BUDGET_HIGH':
            return (b.budget || 0) - (a.budget || 0);
          case 'BUDGET_LOW':
            return (a.budget || 0) - (b.budget || 0);
          case 'NAME_ASC':
            return (a.projectName || '').localeCompare(b.projectName || '');
          default:
            return 0;
        }
      });
  }, [designs, searchTerm, statusFilter, sortBy]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="card glass-card p-4" id="design-list-container">
      {/* List Header & Controls */}
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12 col-md-4">
          <h4 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <span>Design Portfolio Records</span>
            <span className="badge bg-secondary rounded-pill fs-6 fw-normal">
              {filteredDesigns.length}
            </span>
          </h4>
          <span className="text-muted small">Fetched via <code>GET /displayall</code></span>
        </div>

        {/* Search Input */}
        <div className="col-12 col-sm-6 col-md-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted rounded-start-3">
              <Search size={16} />
            </span>
            <input
              type="text"
              id="input-search"
              className="form-control lux-input border-start-0"
              placeholder="Search by ID, project or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter and View Toggles */}
        <div className="col-12 col-sm-6 col-md-4 d-flex justify-content-end gap-2">
          {/* Status Filter */}
          <select
            id="select-filter-status"
            className="form-select form-select-sm lux-input"
            style={{ maxWidth: '140px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>

          {/* Sort Selector */}
          <select
            id="select-sort-by"
            className="form-select form-select-sm lux-input"
            style={{ maxWidth: '140px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="ID_DESC">Newest (ID)</option>
            <option value="ID_ASC">Oldest (ID)</option>
            <option value="BUDGET_HIGH">Budget (High)</option>
            <option value="BUDGET_LOW">Budget (Low)</option>
            <option value="NAME_ASC">Name (A-Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              id="btn-view-grid"
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              id="btn-view-table"
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <LayoutList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-5" id="list-loading-state">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Fetching design projects from PostgreSQL backend...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3" role="alert" id="list-error-banner">
          <div className="d-flex align-items-center gap-2">
            <AlertCircle size={20} className="text-danger" />
            <div>
              <strong>Failed to load projects:</strong> {error}
            </div>
          </div>
          <button 
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill"
            onClick={onRefresh}
            id="btn-retry-fetch"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Empty State: No Designs in Database */}
      {!isLoading && !error && designs.length === 0 && (
        <div className="text-center py-5 px-3" id="list-empty-state">
          <div className="stat-icon bg-light text-muted mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
            <LayoutGrid size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">No Interior Design Projects Found</h5>
          <p className="text-muted small max-w-sm mx-auto mb-4">
            Your database currently has no records. Create your first luxury design project to get started.
          </p>
          <button 
            type="button" 
            className="btn btn-lux-primary d-inline-flex align-items-center gap-2 rounded-pill px-4"
            onClick={onOpenAdd}
            id="btn-add-first-project"
          >
            <Plus size={18} />
            Add First Project
          </button>
        </div>
      )}

      {/* Empty State: Filter matched 0 results */}
      {!isLoading && !error && designs.length > 0 && filteredDesigns.length === 0 && (
        <div className="text-center py-5 px-3" id="list-no-matches-state">
          <h6 className="fw-bold text-dark mb-1">No Projects Match Your Filter</h6>
          <p className="text-muted small mb-3">
            Try adjusting your search query or status filter to see other projects.
          </p>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
            id="btn-reset-filters"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Records Content: Grid Mode */}
      {!isLoading && !error && filteredDesigns.length > 0 && viewMode === 'grid' && (
        <div className="row g-3" id="designs-grid-view">
          {filteredDesigns.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 p-3 glass-card glass-card-interactive position-relative border-0" id={`card-design-${item.id}`}>
                {/* Top: ID Badge and Status */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-dark bg-opacity-75 text-light font-monospace px-2 py-1 rounded-2">
                    ID #{item.id}
                  </span>

                  {item.completed ? (
                    <span className="badge-completed" id={`badge-completed-${item.id}`}>
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  ) : (
                    <span className="badge-in-progress" id={`badge-in-progress-${item.id}`}>
                      <Clock size={13} />
                      In Progress
                    </span>
                  )}
                </div>

                {/* Project Title */}
                <h5 className="fw-bold text-dark mb-1 text-truncate" title={item.projectName}>
                  {item.projectName}
                </h5>

                {/* Client Name */}
                <div className="text-muted small mb-3">
                  <span className="text-secondary fw-semibold">Client:</span> {item.clientName}
                </div>

                {/* Budget Display */}
                <div className="bg-light p-2 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="text-muted small fw-semibold text-uppercase">Budget</span>
                  <span className="fs-5 fw-bold text-primary font-monospace">
                    {formatCurrency(item.budget)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-2 border-top d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    title="View Full Details (GET /display/{id})"
                    onClick={() => onOpenView(item.id)}
                    id={`btn-view-${item.id}`}
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    title="Edit Status / Budget (PUT /update)"
                    onClick={() => onOpenEdit(item)}
                    id={`btn-edit-${item.id}`}
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    title="Delete Project (DELETE /delete/{id})"
                    onClick={() => onOpenDelete(item)}
                    id={`btn-delete-${item.id}`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Records Content: Table Mode */}
      {!isLoading && !error && filteredDesigns.length > 0 && viewMode === 'table' && (
        <div className="table-responsive rounded-3 border" id="designs-table-view">
          <table className="table lux-table mb-0" id="interior-designs-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Budget ($)</th>
                <th>Status</th>
                <th className="text-end" style={{ width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesigns.map((item) => (
                <tr key={item.id} id={`row-design-${item.id}`}>
                  <td className="fw-bold font-monospace text-muted">
                    #{item.id}
                  </td>
                  <td className="fw-semibold text-dark">
                    {item.projectName}
                  </td>
                  <td className="text-secondary">
                    {item.clientName}
                  </td>
                  <td className="fw-bold text-primary font-monospace">
                    {formatCurrency(item.budget)}
                  </td>
                  <td>
                    {item.completed ? (
                      <span className="badge-completed">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    ) : (
                      <span className="badge-in-progress">
                        <Clock size={13} /> In Progress
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        title="View Details (GET /display/{id})"
                        onClick={() => onOpenView(item.id)}
                        id={`btn-table-view-${item.id}`}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        title="Edit Design (PUT /update)"
                        onClick={() => onOpenEdit(item)}
                        id={`btn-table-edit-${item.id}`}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        title="Delete Design (DELETE /delete/{id})"
                        onClick={() => onOpenDelete(item)}
                        id={`btn-table-delete-${item.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
