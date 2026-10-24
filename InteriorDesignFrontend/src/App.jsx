import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import AddDesignForm from './components/AddDesignForm';
import DesignList from './components/DesignList';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import UpdateDesignModal from './components/UpdateDesignModal';
import ViewDetailsModal from './components/ViewDetailsModal';
import ToastContainer from './components/ToastContainer';
import { interiorDesignApi } from './services/api';
import { Plus, LayoutGrid, CheckCircle2, AlertTriangle, ShieldCheck, Server } from 'lucide-react';

export default function App() {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, message: 'Checking...' });
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'add'

  // Modal states
  const [viewingId, setViewingId] = useState(null);
  const [editingDesign, setEditingDesign] = useState(null);
  const [deletingDesign, setDeletingDesign] = useState(null);

  // Toast system
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      const res = await interiorDesignApi.checkHealth();
      setBackendStatus({ online: true, message: typeof res === 'string' ? res : 'Service Running' });
    } catch (err) {
      setBackendStatus({ online: false, message: 'Cannot reach Spring Boot server at port 2007' });
    }
  }, []);

  // Fetch all designs (GET /displayall)
  const fetchDesigns = useCallback(async (showToastOnSuccess = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await interiorDesignApi.getAllDesigns();
      setDesigns(Array.isArray(data) ? data : []);
      checkHealth();
      if (showToastOnSuccess) {
        addToast('Synced', 'Latest design records retrieved from PostgreSQL', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch interior design projects');
      setBackendStatus({ online: false, message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, checkHealth]);

  useEffect(() => {
    fetchDesigns();
    const interval = setInterval(checkHealth, 30000); // Heartbeat every 30s
    return () => clearInterval(interval);
  }, [fetchDesigns, checkHealth]);

  // Handler: Add Design (POST /add)
  const handleAddSuccess = async (formData) => {
    const created = await interiorDesignApi.addDesign(formData);
    addToast(
      'Project Created!', 
      `"${created.projectName}" saved successfully with Auto-ID #${created.id}`, 
      'success'
    );
    await fetchDesigns();
    setActiveTab('dashboard'); // Switch back to dashboard to view the new record
  };

  // Handler: Update Design (PUT /update)
  const handleUpdateSuccess = async (updatedData) => {
    const res = await interiorDesignApi.updateDesign(updatedData);
    addToast(
      'Record Updated', 
      `Project #${updatedData.id} budget & status successfully updated`, 
      'success'
    );
    await fetchDesigns();
  };

  // Handler: Delete Design (DELETE /delete/{id})
  const handleDeleteSuccess = async (id) => {
    const message = await interiorDesignApi.deleteDesign(id);
    addToast('Project Deleted', message || `Project #${id} was deleted`, 'success');
    await fetchDesigns();
  };

  return (
    <div className="min-vh-100 d-flex flex-column" id="app-root">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onRefresh={() => fetchDesigns(true)}
        totalCount={designs.length}
      />

      {/* Main Container */}
      <main className="container-xl py-4 flex-grow-1" id="main-content">
        {/* Backend Warning Banner if Offline */}
        {!backendStatus.online && !isLoading && (
          <div className="alert alert-warning border border-warning d-flex align-items-center justify-content-between p-3 rounded-4 mb-4 shadow-sm" role="alert" id="backend-offline-banner">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-warning bg-opacity-25 rounded-circle text-dark">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-dark">Spring Boot Server is Offline on Port 2007</h6>
                <p className="small text-muted mb-0">
                  Ensure <code>InteriorDesignProjectApplication</code> is running in Eclipse/terminal. Database configured: <code>jdbc:postgresql://localhost:5432/InteriorDesign</code>.
                </p>
              </div>
            </div>
            <button 
              className="btn btn-warning btn-sm fw-bold px-3 py-2 rounded-pill text-dark"
              onClick={() => fetchDesigns(true)}
              id="btn-reconnect-backend"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h1 className="fw-bold text-dark display-6 mb-1">
              LuxDesign Studio
            </h1>
            <p className="text-muted mb-0">
              Enterprise Interior Design Project & Contract Management System
            </p>
          </div>

          {/* Quick Tab Toggle */}
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              type="button"
              id="hero-btn-view-records"
              className={`btn d-flex align-items-center gap-2 rounded-pill px-3 ${
                activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutGrid size={16} />
              View Portfolio
            </button>
            <button
              type="button"
              id="hero-btn-add-record"
              className={`btn d-flex align-items-center gap-2 rounded-pill px-3 ${
                activeTab === 'add' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setActiveTab('add')}
            >
              <Plus size={16} />
              + Add Design
            </button>
          </div>
        </div>

        {/* Dashboard Metrics (Visible on both or main view) */}
        <DashboardStats designs={designs} />

        {/* Tab 1: Add Record Form */}
        {activeTab === 'add' && (
          <div className="fade-in">
            <AddDesignForm 
              onAddSuccess={handleAddSuccess}
              onCancel={() => setActiveTab('dashboard')}
            />
          </div>
        )}

        {/* Tab 2: Dashboard & Records List */}
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <DesignList
              designs={designs}
              isLoading={isLoading}
              error={error}
              onRefresh={() => fetchDesigns(true)}
              onOpenAdd={() => setActiveTab('add')}
              onOpenView={(id) => setViewingId(id)}
              onOpenEdit={(design) => setEditingDesign(design)}
              onOpenDelete={(design) => setDeletingDesign(design)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ViewDetailsModal
        designId={viewingId}
        isOpen={Boolean(viewingId)}
        onClose={() => setViewingId(null)}
      />

      <UpdateDesignModal
        design={editingDesign}
        isOpen={Boolean(editingDesign)}
        onClose={() => setEditingDesign(null)}
        onUpdateConfirm={handleUpdateSuccess}
      />

      <DeleteConfirmModal
        design={deletingDesign}
        isOpen={Boolean(deletingDesign)}
        onClose={() => setDeletingDesign(null)}
        onConfirm={handleDeleteSuccess}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="bg-dark text-light py-3 mt-auto border-top border-secondary border-opacity-25" id="app-footer">
        <div className="container-xl d-flex flex-wrap justify-content-between align-items-center small">
          <div className="text-secondary">
            LuxDesign Studio &copy; {new Date().getFullYear()} &bull; SOA Lab Exam Frontend Implementation
          </div>
          <div className="d-flex align-items-center gap-3 text-secondary">
            <span>Backend: <strong>Spring Boot (Port 2006)</strong></span>
            <span>Database: <strong>PostgreSQL (Port 5432)</strong></span>
            <span className="badge bg-secondary font-monospace">REST API v1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
