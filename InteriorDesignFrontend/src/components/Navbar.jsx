import React from 'react';
import { Home, PlusCircle, LayoutGrid, Activity, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onRefresh, totalCount }) {
  return (
    <nav className="navbar navbar-expand-lg lux-navbar sticky-top px-3 py-2" id="main-navbar">
      <div className="container-fluid">
        {/* Brand */}
        <a 
          className="navbar-brand d-flex align-items-center text-white text-decoration-none" 
          href="#home" 
          id="navbar-brand"
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
        >
          <span className="navbar-brand-badge me-2">
            <Home size={20} />
            LuxDesign
          </span>
          <span className="d-none d-sm-inline fs-6 text-light opacity-75">
            Studio Management
          </span>
        </a>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-secondary text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          id="navbar-toggler"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <button 
                id="nav-btn-dashboard"
                className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-light text-dark fw-bold' : 'btn-outline-light text-white border-0'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutGrid size={16} className="me-1 mb-1" />
                Dashboard & Records
                {totalCount > 0 && (
                  <span className="badge bg-primary text-white ms-2 rounded-pill">
                    {totalCount}
                  </span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button 
                id="nav-btn-add"
                className={`btn btn-sm ${activeTab === 'add' ? 'btn-light text-dark fw-bold' : 'btn-outline-light text-white border-0'}`}
                onClick={() => setActiveTab('add')}
              >
                <PlusCircle size={16} className="me-1 mb-1" />
                + Add Design
              </button>
            </li>
          </ul>

          {/* Right Section: Backend Status & Refresh */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {/* Status indicator */}
            <div 
              id="backend-status-pill"
              className="d-flex align-items-center gap-2 bg-dark px-3 py-1 rounded-pill border border-secondary text-light small"
              title="Spring Boot Backend Status (Port 2007)"
            >
              <span className={`pulse-dot ${backendStatus.online ? 'online' : 'offline'}`}></span>
              <span>{backendStatus.online ? 'Backend Online (:2007)' : 'Backend Offline'}</span>
            </div>

            <button 
              id="btn-refresh-all"
              className="btn btn-outline-light btn-sm rounded-circle p-2"
              title="Refresh Data"
              onClick={onRefresh}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
