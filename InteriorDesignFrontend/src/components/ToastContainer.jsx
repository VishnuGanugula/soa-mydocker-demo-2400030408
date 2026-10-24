import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-custom" id="toast-notifications-container">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={20} className="text-success flex-shrink-0" />;
            case 'error':
              return <AlertCircle size={20} className="text-danger flex-shrink-0" />;
            default:
              return <Info size={20} className="text-primary flex-shrink-0" />;
          }
        };

        return (
          <div 
            key={toast.id} 
            className={`custom-toast ${toast.type || 'info'}`}
            id={`toast-${toast.id}`}
          >
            {getIcon()}
            <div className="flex-grow-1">
              {toast.title && <div className="fw-bold text-dark small">{toast.title}</div>}
              <div className="text-secondary small">{toast.message}</div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-sm"
              aria-label="Close"
              onClick={() => onDismiss(toast.id)}
            ></button>
          </div>
        );
      })}
    </div>
  );
}
