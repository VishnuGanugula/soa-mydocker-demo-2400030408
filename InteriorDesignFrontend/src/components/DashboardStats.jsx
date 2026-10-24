import React from 'react';
import { FolderKanban, CheckCircle2, Clock, DollarSign } from 'lucide-react';

export default function DashboardStats({ designs }) {
  const total = designs.length;
  const completed = designs.filter(d => Boolean(d.completed)).length;
  const inProgress = total - completed;
  const totalBudget = designs.reduce((sum, d) => sum + (Number(d.budget) || 0), 0);
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="row g-3 mb-4" id="dashboard-stats-section">
      {/* Total Designs */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="stat-card" id="stat-card-total">
          <div className="stat-icon bg-primary bg-opacity-10 text-primary">
            <FolderKanban size={26} />
          </div>
          <div>
            <div className="text-muted small fw-semibold text-uppercase">Total Projects</div>
            <div className="fs-3 fw-bold text-dark">{total}</div>
          </div>
        </div>
      </div>

      {/* Completed Designs */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="stat-card" id="stat-card-completed">
          <div className="stat-icon bg-success bg-opacity-10 text-success">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="text-muted small fw-semibold text-uppercase">Completed</div>
            <div className="fs-3 fw-bold text-success">
              {completed} <span className="fs-6 text-muted fw-normal">({completionRate}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="stat-card" id="stat-card-in-progress">
          <div className="stat-icon bg-warning bg-opacity-10 text-warning">
            <Clock size={26} />
          </div>
          <div>
            <div className="text-muted small fw-semibold text-uppercase">In Progress</div>
            <div className="fs-3 fw-bold text-warning">{inProgress}</div>
          </div>
        </div>
      </div>

      {/* Total Budget */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="stat-card" id="stat-card-budget">
          <div className="stat-icon bg-info bg-opacity-10 text-info">
            <DollarSign size={26} />
          </div>
          <div>
            <div className="text-muted small fw-semibold text-uppercase">Total Budget</div>
            <div className="fs-4 fw-bold text-dark">{formatCurrency(totalBudget)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
